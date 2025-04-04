// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import type { Session } from 'next-auth';
// import type { User as NextAuthUser } from 'next-auth'; // Pas nécessaire ici
import type { AdapterUser } from '@auth/core/adapters';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- Vérification des variables d'environnement essentielles ---
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!googleClientId || !googleClientSecret) {
  console.error("FATAL ERROR: Missing Google OAuth environment variables (GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)");
  throw new Error('Missing Google OAuth environment variables');
}
if (!nextAuthSecret) {
  // Important: Ne pas logger le secret lui-même en production
  console.error('FATAL ERROR: Missing NEXTAUTH_SECRET environment variable! Authentication will fail.');
  throw new Error('Missing NEXTAUTH_SECRET environment variable');
}

// -------------------------------------------------------------
// Étendre les types pour ajouter nos champs personnalisés
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      roles: string[];
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
  // L'extension User n'est généralement pas nécessaire avec l'adapter si on utilise le callback session
  // interface User {
  //   roles?: string[];
  // }
}

// Définir les options avec le type NextAuthConfig correct
export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      // allowDangerousEmailAccountLinking: true, // Décommentez si vous voulez lier Google à un compte local existant par email
    }),
    CredentialsProvider({
      name: 'Credentials',
      id: 'credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "votre@email.com" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials): Promise<AdapterUser | null> {
        console.log("Attempting credentials authorization...");

        if (!credentials?.email || !credentials?.password) {
          console.error("Authorize Error: Email or password not provided.");
          // Lancer une erreur ici notifiera NextAuth de l'échec avec "CredentialsSignin"
          throw new Error("Email et mot de passe requis");
          // return null; // Alternativement, retourner null
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        try {
          const user = await prisma.user.findUnique({
            where: { email: email }
          });

          if (!user || !user.password) {
             console.warn(`Authorize Warning: User not found or no local password set for email: ${email}`);
             // Ne pas révéler si l'email existe ou non pour des raisons de sécurité
             // Lancer une erreur standard pour masquer la raison exacte de l'échec
             throw new Error("Email ou mot de passe invalide.");
             // return null;
          }

          // Vérifier si l'utilisateur est activé (si ce champ est pertinent)
          if (!user.enabled) {
            console.warn(`Authorize Warning: Disabled user login attempt: ${email}`);
            throw new Error("Compte désactivé.");
            // return null;
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (isPasswordValid) {
            console.log(`Authorize Success: User ${email} authenticated.`);
            // Retourner l'objet utilisateur requis par l'adapter et la session
            // Les rôles seront ajoutés dans le callback `session`.
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              emailVerified: user.emailVerified, // Important pour l'adapter
              image: user.image,
              // NE PAS RETOURNER LE MOT DE PASSE!
            };
          } else {
            console.warn(`Authorize Warning: Invalid password attempt for email: ${email}`);
            throw new Error("Email ou mot de passe invalide.");
            // return null;
          }

        } catch (error) {
           // Si l'erreur est déjà une Error avec un message utilisateur, la relancer
           if (error instanceof Error && ["Email et mot de passe requis", "Email ou mot de passe invalide.", "Compte désactivé."].includes(error.message)) {
             throw error;
           }
           // Pour les autres erreurs (DB, etc.), logguer et lancer une erreur générique
           console.error("Authorize Error: An unexpected error occurred during authorization.", error);
           throw new Error("Une erreur interne est survenue lors de la connexion.");
           // return null;
        }
      }
    })
  ],
  session: {
    // Utilisation de la stratégie de base de données (via PrismaAdapter)
    strategy: 'database',
    // maxAge: 30 * 24 * 60 * 60, // Optionnel : 30 jours
    // updateAge: 24 * 60 * 60, // Optionnel : Mettre à jour la session toutes les 24 heures
  },
  secret: nextAuthSecret, // Assuré non nul par la vérification précédente
  callbacks: {
    // Enrichit la session avec l'ID et les rôles de l'utilisateur
    async session({ session, user }: { session: Session; user: AdapterUser }) {
      // `user` ici est l'utilisateur tel que retourné par l'adapter (après connexion/inscription)
      // ou potentiellement par `authorize` (pour Credentials, bien que l'adapter soit prioritaire si session `database`)
      console.log("Session callback triggered. User from adapter/token:", user);
      if (session?.user && user?.id) { // Vérifier que user.id existe
        session.user.id = user.id;

        try {
            // Récupérer les rôles actuels depuis la DB à chaque création/refresh de session
            const userWithRolesFromDb = await prisma.user.findUnique({
              where: { id: user.id },
              select: {
                roles: {
                  select: { name: true },
                },
              },
            });

            session.user.roles = userWithRolesFromDb?.roles.map((role) => role.name) ?? [];
            console.log("Session callback: User roles assigned:", session.user.roles);
         } catch (dbError) {
             console.error("Session callback: Error fetching roles from DB", dbError);
             session.user.roles = []; // Fallback à un tableau vide en cas d'erreur DB
         }
      } else {
          console.warn("Session callback: session.user or user.id missing.", { hasSessionUser: !!session?.user, hasUserId: !!user?.id });
      }
      return session;
    },

    // Optionnel : Callback signIn pour des vérifications supplémentaires
    async signIn({ user, account, profile }) {
      console.log(`SignIn callback: User: ${user.id}, Account Provider: ${account?.provider}`);
      if (account?.provider === 'google') {
        // Exemple : Vérifier si l'email Google est vérifié
        // Note : `profile` peut varier selon le provider et la config OAuth
        // const googleProfile = profile as { email_verified?: boolean };
        // if (!googleProfile?.email_verified) {
        //   console.log(`Google Sign-In blocked: Email not verified for ${user.email}`);
        //   return false; // Bloquer la connexion si l'email Google n'est pas vérifié
        // }
      }
      if (account?.provider === 'credentials') {
        // La vérification 'enabled' est déjà dans authorize, mais pourrait être redoublée ici si nécessaire
        const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { enabled: true } });
        if (dbUser?.enabled === false) {
           console.log(`Sign-in blocked for disabled user: ${user.email}`);
           // Retourner false ici ne fonctionne pas toujours comme prévu pour Credentials avec redirect:false
           // Il est préférable de gérer le blocage dans `authorize` en lançant une erreur.
           // return false;
        }
      }
      return true; // Autoriser la connexion par défaut
    }
  },
  pages: {
    // Pointe vers les pages personnalisées créées
    signIn: '/auth/login',
    // signOut: '/auth/logout', // Page optionnelle après déconnexion
    error: '/auth/login', // Rediriger vers login en cas d'erreur, qui affichera l'erreur
    // verifyRequest: '/auth/verify-request', // Si vous implémentez la vérification d'email
    // newUser: '/auth/new-user' // Page après première connexion OAuth (rarement utilisé)
  },
  debug: process.env.NODE_ENV === 'development',
};

// --- NOUVEL EXPORT RECOMMANDÉ POUR Auth.js v5 / App Router ---
// Initialiser NextAuth avec les options
const { handlers, auth, signIn: authSignIn, signOut: authSignOut } = NextAuth(authOptions);

// Exporter les handlers GET et POST depuis l'objet handlers retourné
export const { GET, POST } = handlers;

// Exporter optionnellement les fonctions utilitaires si utilisées côté serveur ailleurs
export { auth, authSignIn, authSignOut };
// --- FIN DU NOUVEL EXPORT ---