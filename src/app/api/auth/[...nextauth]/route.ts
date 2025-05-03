// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import type { Session } from 'next-auth';
import type { AdapterUser } from '@auth/core/adapters';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- Vérification des variables d'environnement ---
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!googleClientId || !googleClientSecret) {
  console.error("FATAL ERROR: Missing Google OAuth environment variables (GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)");
  throw new Error('Missing Google OAuth environment variables');
}
if (!nextAuthSecret) {
  console.error('FATAL ERROR: Missing NEXTAUTH_SECRET environment variable! Authentication will fail.');
  throw new Error('Missing NEXTAUTH_SECRET environment variable');
}

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
}

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
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
          throw new Error("Email et mot de passe requis");
        }
        const email = credentials.email as string;
        const password = credentials.password as string;
        try {
          const user = await prisma.user.findUnique({ where: { email: email } });
          if (!user || !user.password) { throw new Error("Email ou mot de passe invalide."); }
          // Vérification si le compte est activé
          if (!user.enabled) { throw new Error("Compte désactivé."); }
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (isPasswordValid) {
            console.log(`Authorize Success: User ${email} authenticated.`);
            // Retourner l'objet utilisateur pour l'adapter/session
            return { id: user.id, email: user.email, name: user.name, emailVerified: user.emailVerified, image: user.image };
          } else {
            console.warn(`Authorize Warning: Invalid password attempt for email: ${email}`);
            throw new Error("Email ou mot de passe invalide.");
          }
        } catch (error) {
           // Relancer les erreurs spécifiques pour affichage côté client
           if (error instanceof Error && ["Email et mot de passe requis", "Email ou mot de passe invalide.", "Compte désactivé."].includes(error.message)) {
               throw error;
           }
           // Logguer les erreurs inattendues et lancer une erreur générique
           console.error("Authorize Error: An unexpected error occurred during authorization.", error);
           throw new Error("Une erreur interne est survenue lors de la connexion.");
        }
      }
    })
  ],
  session: {
    strategy: 'database', // Utilisation de la base de données pour les sessions
  },
  secret: nextAuthSecret, // Clé secrète pour le chiffrement
  callbacks: {
    // Callback pour enrichir l'objet Session avec des données utilisateur (ID, rôles)
    async session({ session, user }: { session: Session; user: AdapterUser }) {
      console.log("Session callback triggered. User from adapter/token:", user);
      if (session?.user && user?.id) {
        session.user.id = user.id; // Ajoute l'ID utilisateur à la session

        try {
            // Récupérer les rôles actuels depuis la DB
            let userWithRolesFromDb = await prisma.user.findUnique({
              where: { id: user.id },
              select: {
                email: true, // Pour le log
                roles: { select: { name: true } },
              },
            });

            // ** Logique pour assigner un rôle par défaut aux nouveaux utilisateurs OAuth **
            // (Vérifie si l'utilisateur existe mais n'a pas de rôle ET s'il a un compte provider externe)
            if (userWithRolesFromDb && !userWithRolesFromDb.roles?.length) {
              const externalAccount = await prisma.account.findFirst({
                where: { userId: user.id, provider: { not: 'credentials' } }, // Exclut les comptes locaux
                select: { provider: true } // Juste besoin de savoir si un compte externe existe
              });

              if (externalAccount) {
                 // Assigner le rôle 'TECHNICIAN' par défaut
                try {
                  console.log(`Assigning default TECHNICIAN role to new/roleless external user: ${user.id} (${userWithRolesFromDb.email})`);
                  await prisma.user.update({
                    where: { id: user.id },
                    data: {
                      roles: { connect: { name: 'TECHNICIAN' } } // Assigner le rôle
                    }
                  });
                  // Mettre à jour l'objet local pour que la session en cours reflète le changement
                  userWithRolesFromDb.roles = [{ name: 'TECHNICIAN' }];
                  console.log(`Default role assigned successfully to ${user.id}`);
                } catch (updateError) {
                  console.error(`Failed to assign default TECHNICIAN role to user ${user.id}:`, updateError);
                   if (updateError instanceof Error && updateError.message.toLowerCase().includes('record to connect not found')) {
                     console.error("CRITICAL: Default role 'TECHNICIAN' not found in database during session update.");
                   }
                   // La session continuera sans le rôle si l'assignation échoue
                }
              }
            }
            
            // Assigner les rôles (mis à jour ou existants) à l'objet session.user
            session.user.roles = userWithRolesFromDb?.roles.map((role) => role.name) ?? [];
            console.log(`Session callback: User roles for ${user.id} set to:`, session.user.roles);

         } catch (dbError) {
             console.error(`Session callback: Error fetching/updating roles from DB for user ${user.id}`, dbError);
             session.user.roles = []; // Fallback sécurisé en cas d'erreur majeure
         }
      } else {
          console.warn("Session callback: session.user or user.id missing.");
      }
      // Retourner l'objet session enrichi
      return session;
    },

    // ** Callback signIn MODIFIÉ pour gérer la redirection de l'admin **
    async signIn({ user, account }) {
      console.log(`SignIn callback: User: ${user.id}, Account Provider: ${account?.provider}`);

      // 1. Vérification initiale: Compte local désactivé ? (Lancera une erreur si désactivé)
      //    (Cette vérification est redondante avec 'authorize' mais assure la sécurité)
      if (account?.provider === 'credentials') {
          const dbUserCheck = await prisma.user.findUnique({ where: { id: user.id }, select: { enabled: true } });
          if (dbUserCheck?.enabled === false) {
             console.log(`Sign-in blocked for disabled user: ${user.email}`);
             // Lancer une erreur ici est le moyen le plus fiable de bloquer avec Credentials
             throw new Error("Compte désactivé.");
          }
      }

      // 2. Logique de redirection basée sur le rôle (uniquement après une connexion réussie)
      if (account && user?.id) { // S'assurer qu'il s'agit bien d'un événement de connexion
        try {
          // Récupérer les rôles depuis la base de données
          const dbUserWithRoles = await prisma.user.findUnique({
            where: { id: user.id },
            select: { roles: { select: { name: true } } }
          });

          const isAdmin = dbUserWithRoles?.roles?.some(role => role.name === 'ADMIN');

          // Si l'utilisateur est un admin, retourner l'URL cible
          if (isAdmin) {
            console.log(`Admin user ${user.email || user.id} detected during signIn. Redirecting to /admin/users.`);
            return '/admin/users';
          }

          // Si ce n'est pas un admin, continuer le flux normal
          console.log(`Non-admin user ${user.email || user.id} detected during signIn. Proceeding with default redirect logic.`);
          // Retourner true permet à NextAuth d'utiliser la callbackUrl fournie ou la page par défaut

        } catch (error) {
          console.error("Error checking admin role during signIn:", error);
          // En cas d'erreur DB, on autorise quand même la connexion avec la redirection par défaut
          // pour ne pas bloquer l'utilisateur à cause d'un problème interne temporaire.
          return true;
        }
      }

      // 3. Cas par défaut: Autoriser la connexion/flux normal
      //    (Nécessaire pour les autres appels à signIn, ex: vérification de session)
      return true;
    }
  },
  pages: { // Pages personnalisées pour l'authentification
    signIn: '/auth/login',    // Page de connexion
    error: '/auth/login',     // Page où rediriger en cas d'erreur (affiche l'erreur)
    // signOut: '/auth/logout', // Optionnel: Page après déconnexion
    // verifyRequest: '/auth/verify-request', // Pour la connexion par email (Magic Link)
    // newUser: null // Pas de page spéciale pour les nouveaux utilisateurs OAuth par défaut
  },
  debug: process.env.NODE_ENV === 'development', // Activer les logs détaillés en développement
};

// --- Exports pour Next.js App Router ---
// Initialise NextAuth avec les options configurées
const { handlers, auth, signIn: authSignIn, signOut: authSignOut } = NextAuth(authOptions);

// Exporte les gestionnaires GET et POST pour la route catch-all [...nextauth]
export const { GET, POST } = handlers;

// Exporte les fonctions utilitaires pour utilisation côté serveur ailleurs (Server Actions, API Routes)
export { auth, authSignIn, authSignOut };