// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import type { Session } from 'next-auth';
// import type { User as NextAuthUser } from 'next-auth'; // Peut être retiré si non utilisé directement
import type { AdapterUser } from '@auth/core/adapters';
import GoogleProvider from 'next-auth/providers/google';
// --- AJOUT ---
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs'; // Importer bcryptjs
// --- FIN AJOUT ---
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- Vérification des variables d'environnement essentielles ---
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!googleClientId || !googleClientSecret) {
  throw new Error('Missing Google OAuth environment variables (GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)');
}
if (!nextAuthSecret) {
  // Important: Ne pas logger le secret lui-même en production
  console.error('CRITICAL: Missing NEXTAUTH_SECRET environment variable!');
  throw new Error('Missing NEXTAUTH_SECRET environment variable. Authentication will fail.');
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
  // Si vous avez besoin d'étendre l'objet User retourné par authorize, faites-le ici
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
      // Vous pouvez ajouter des options ici, par exemple :
      // allowDangerousEmailAccountLinking: true, // Si vous voulez lier Google à un compte local existant par email
    }),
    // --- AJOUT DU CredentialsProvider ---
    CredentialsProvider({
      // Le nom affiché sur le formulaire de connexion (facultatif si vous créez votre propre formulaire)
      name: 'Credentials',
      // L'ID unique pour ce provider, utilisé lors de l'appel à signIn('credentials', ...)
      id: 'credentials',
      // `credentials` est utilisé pour générer un formulaire sur la page de connexion par défaut.
      // Vous pouvez définir les champs attendus.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "votre@email.com" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials): Promise<AdapterUser | null> {
        // Logique pour vérifier l'utilisateur
        console.log("Attempting credentials authorization..."); // Log pour le débogage

        // 1. Valider que l'email et le mot de passe sont fournis
        if (!credentials?.email || !credentials?.password) {
          console.error("Authorize Error: Email or password not provided.");
          // Vous pouvez lancer une erreur spécifique si vous préférez gérer cela différemment sur le frontend
          // throw new Error("Email and password required");
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        try {
          // 2. Trouver l'utilisateur dans la base de données via Prisma
          const user = await prisma.user.findUnique({
            where: { email: email }
          });

          // 3. Vérifier si l'utilisateur existe ET s'il a un mot de passe défini
          //    (un utilisateur créé via Google n'aura pas de champ 'password' initialement)
          if (!user || !user.password) {
             console.warn(`Authorize Warning: User not found or no password set for email: ${email}`);
             // Ne pas révéler si l'email existe ou non pour des raisons de sécurité
             return null;
          }

          // 4. Comparer le mot de passe fourni avec le hash stocké
          const isPasswordValid = await bcrypt.compare(password, user.password);

          // 5. Si le mot de passe est valide, retourner l'objet utilisateur attendu par NextAuth
          if (isPasswordValid) {
            console.log(`Authorize Success: User ${email} authenticated.`);
            // Retourner l'objet utilisateur compatible avec l'AdapterUser
            // L'adapter se chargera du reste, mais s'assurer que l'id est présent est crucial.
            // Les rôles seront ajoutés dans le callback `session`.
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              emailVerified: user.emailVerified, // Important pour l'adapter
              image: user.image,
              // Ne pas retourner le mot de passe !
            };
          } else {
            console.warn(`Authorize Warning: Invalid password attempt for email: ${email}`);
            // Mot de passe incorrect
            return null;
          }

        } catch (error) {
           console.error("Authorize Error: An unexpected error occurred.", error);
           // Gérer les erreurs potentielles (ex: problème de connexion DB)
           return null;
        }
      }
    })
    // --- FIN AJOUT ---
  ],
  session: {
    // Utilisation de la stratégie de base de données (via PrismaAdapter), pas de JWT nécessaire ici.
    strategy: 'database',
    // Vous pouvez configurer maxAge, updateAge si nécessaire
    // maxAge: 30 * 24 * 60 * 60, // 30 jours
    // updateAge: 24 * 60 * 60, // 24 heures
  },
  // Le secret est déjà défini et vérifié plus haut
  secret: nextAuthSecret,
  callbacks: {
    // Le callback session reste identique, il enrichit la session avec id et rôles
    // quel que soit le provider utilisé pour se connecter.
    async session({ session, user }: { session: Session; user: AdapterUser }) {
      console.log("Session callback triggered for user:", user.id); // Log pour débogage
      if (session?.user) {
        // L'AdapterUser a toujours un id de type string venant de Prisma/DB
        session.user.id = user.id;

        // Récupérer les rôles depuis Prisma (important après chaque connexion/refresh de session)
        const userWithRolesFromDb = await prisma.user.findUnique({
          where: { id: user.id },
          select: { // Sélectionner uniquement ce qui est nécessaire
            roles: {
              select: { name: true },
            },
           },
        });

        session.user.roles = userWithRolesFromDb?.roles.map((role) => role.name) ?? [];
        console.log("Session callback: User roles assigned:", session.user.roles); // Log rôles
      }
      return session;
    },
     // Vous pourriez ajouter un callback `signIn` si vous avez besoin de logique spécifique
     // juste après une tentative de connexion (réussie ou échouée) avant la redirection.
     // async signIn({ user, account, profile, email, credentials }) {
     //   if (account?.provider === "google" && profile?.email?.endsWith("@example.com")) {
     //     // Exemple: Autoriser uniquement certains domaines Google
     //     return true;
     //   }
     //   if (account?.provider === "credentials") {
     //     // Logique spécifique pour les connexions par credentials
     //     const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
     //     if (dbUser?.enabled === false) { // Vérifier si l'utilisateur est activé
     //        console.log(`Sign-in blocked for disabled user: ${user.email}`);
     //        return false; // Bloquer la connexion
     //     }
     //   }
     //   return true; // Autoriser la connexion par défaut
     // }
  },
  pages: {
    // Si vous créez des pages personnalisées (ce qui sera nécessaire pour le formulaire local)
    // signIn: '/auth/connexion', // Exemple de page de connexion personnalisée
    // signOut: '/auth/deconnexion',
    // error: '/auth/erreur', // Page pour afficher les erreurs d'authentification
    // verifyRequest: '/auth/verification', // Page pour l'email de vérification (si activé)
    // newUser: null // Mettre à null si vous ne voulez pas de redirection après création OAuth
  },
  debug: process.env.NODE_ENV === 'development',
};

// Exporter les handlers GET et POST (inchangé)
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };