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

// --- Vérification des variables d'environnement (inchangée) ---
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
// -------------------------------------------------------------

// Étendre les types (inchangé)
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
        // --- Logique authorize inchangée ---
        console.log("Attempting credentials authorization...");
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }
        const email = credentials.email as string;
        const password = credentials.password as string;
        try {
          const user = await prisma.user.findUnique({ where: { email: email } });
          if (!user || !user.password) { throw new Error("Email ou mot de passe invalide."); }
          if (!user.enabled) { throw new Error("Compte désactivé."); }
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (isPasswordValid) {
            console.log(`Authorize Success: User ${email} authenticated.`);
            return { id: user.id, email: user.email, name: user.name, emailVerified: user.emailVerified, image: user.image };
          } else {
            throw new Error("Email ou mot de passe invalide.");
          }
        } catch (error) {
           if (error instanceof Error && ["Email et mot de passe requis", "Email ou mot de passe invalide.", "Compte désactivé."].includes(error.message)) { throw error; }
           console.error("Authorize Error: An unexpected error occurred during authorization.", error);
           throw new Error("Une erreur interne est survenue lors de la connexion.");
        }
        // --- Fin logique authorize ---
      }
    })
  ],
  session: { strategy: 'database' },
  secret: nextAuthSecret,
  callbacks: {
    // Enrichit la session avec l'ID et les rôles de l'utilisateur
    async session({ session, user }: { session: Session; user: AdapterUser }) {
      console.log("Session callback triggered. User from adapter/token:", user);
      if (session?.user && user?.id) {
        session.user.id = user.id;

        try {
            // Récupérer les rôles actuels depuis la DB
            let userWithRolesFromDb = await prisma.user.findUnique({
              where: { id: user.id },
              select: {
                // Ajout de l'email pour le log
                email: true,
                roles: { select: { name: true } },
              },
            });

            // ----> AJOUT/CORRECTION : Vérification et assignation rôle par défaut pour OAuth <----
            if (userWithRolesFromDb && !userWithRolesFromDb.roles?.length) {
              // Vérifier si l'utilisateur a un compte Google lié
              const googleAccount = await prisma.account.findFirst({
                where: { userId: user.id, provider: 'google' },
                // *** CORRECTED: Select an existing valid field like userId to check existence ***
                select: { userId: true }
              });

              if (googleAccount) {
                // C'est probablement un nouvel utilisateur Google sans rôle, on assigne TECHNICIAN
                try {
                  console.log(`Assigning default TECHNICIAN role to new/roleless Google user: ${user.id} (${userWithRolesFromDb.email})`);
                  await prisma.user.update({
                    where: { id: user.id },
                    data: {
                      roles: {
                        connect: { name: 'TECHNICIAN' }
                      }
                    }
                  });
                  // Mettre à jour la variable locale pour que la session en cours ait le rôle
                  userWithRolesFromDb.roles = [{ name: 'TECHNICIAN' }];
                  console.log(`Default role assigned successfully to ${user.id}`);
                } catch (updateError) {
                  console.error(`Failed to assign default TECHNICIAN role to user ${user.id}:`, updateError);
                   // Logique de fallback en cas d'échec de la mise à jour du rôle (ex: rôle inexistant)
                   if (updateError instanceof Error && updateError.message.toLowerCase().includes('record to connect not found')) {
                     console.error("CRITICAL: Default role 'TECHNICIAN' not found in database during session update.");
                   }
                   // La session continuera sans le rôle par défaut si l'update échoue
                }
              }
            }
            // ------------------------------------------------------------------------

            // Assigner les rôles (potentiellement mis à jour) à la session
            session.user.roles = userWithRolesFromDb?.roles.map((role) => role.name) ?? [];
            console.log(`Session callback: User roles for ${user.id} set to:`, session.user.roles);

         } catch (dbError) {
             console.error(`Session callback: Error fetching or updating roles from DB for user ${user.id}`, dbError);
             session.user.roles = []; // Fallback à un tableau vide en cas d'erreur DB majeure
         }
      } else {
          console.warn("Session callback: session.user or user.id missing.", { hasSessionUser: !!session?.user, hasUserId: !!user?.id });
      }
      return session;
    },

    // --- Callback signIn inchangé ---
    async signIn({ user, account, profile }) {
      console.log(`SignIn callback: User: ${user.id}, Account Provider: ${account?.provider}`);
      if (account?.provider === 'credentials') {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { enabled: true } });
        if (dbUser?.enabled === false) {
           console.log(`Sign-in blocked for disabled user: ${user.email}`);
           throw new Error("Compte désactivé.");
        }
      }
      return true; // Autoriser la connexion
    }
  },
  pages: { // Inchangé
    signIn: '/auth/login',
    error: '/auth/login',
  },
  debug: process.env.NODE_ENV === 'development',
};

// --- Exports inchangés ---
const { handlers, auth, signIn: authSignIn, signOut: authSignOut } = NextAuth(authOptions);
export const { GET, POST } = handlers;
export { auth, authSignIn, authSignOut };