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
        email: { label: "Email", type: "email", placeholder: "nom@email.com" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials): Promise<AdapterUser | null> {
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
            return { id: user.id, email: user.email, name: user.name, emailVerified: user.emailVerified, image: user.image };
          } else {
            throw new Error("Email ou mot de passe invalide.");
          }
        } catch (error) {
           if (error instanceof Error && ["Email et mot de passe requis", "Email ou mot de passe invalide.", "Compte désactivé."].includes(error.message)) {
               throw error;
           }
           console.error("Authorize Error: An unexpected error occurred during authorization.", error);
           throw new Error("Une erreur interne est survenue lors de la connexion.");
        }
      }
    })
  ],
  session: {
    strategy: 'database',
  },
  secret: nextAuthSecret,
  callbacks: {
    async session({ session, user }: { session: Session; user: AdapterUser }) {
      if (session?.user && user?.id) {
        session.user.id = user.id;
        try {
            let userWithRolesFromDb = await prisma.user.findUnique({
              where: { id: user.id },
              select: {
                email: true, 
                roles: { select: { name: true } },
              },
            });

            if (userWithRolesFromDb && !userWithRolesFromDb.roles?.length) {
              const externalAccount = await prisma.account.findFirst({
                where: { userId: user.id, provider: { not: 'credentials' } }, 
                select: { provider: true } 
              });

              if (externalAccount) {
                try {
                  console.log(`Assigning default TECHNICIAN role to new/roleless external user: ${user.id} (${userWithRolesFromDb.email})`);
                  await prisma.user.update({
                    where: { id: user.id },
                    data: {
                      roles: { connect: { name: 'TECHNICIAN' } } 
                    }
                  });
                  userWithRolesFromDb.roles = [{ name: 'TECHNICIAN' }];
                  console.log(`Default role assigned successfully to ${user.id}`);
                } catch (updateError) {
                  console.error(`Failed to assign default TECHNICIAN role to user ${user.id}:`, updateError);
                   if (updateError instanceof Error && updateError.message.toLowerCase().includes('record to connect not found')) {
                     console.error("CRITICAL: Default role 'TECHNICIAN' not found in database during session update.");
                   }
                }
              }
            }
            
            session.user.roles = userWithRolesFromDb?.roles.map((role) => role.name) ?? [];
            console.log(`Session callback: User roles for ${user.id} set to:`, session.user.roles);

         } catch (dbError) {
             console.error(`Session callback: Error fetching/updating roles from DB for user ${user.id}`, dbError);
             session.user.roles = []; 
         }
      } else {
          console.warn("Session callback: session.user or user.id missing.");
      }
      return session;
    },

    async signIn({ user, account, profile, email, credentials }) {
      // Note: `profile`, `email`, `credentials` are only available for specific flows.
      // `user` and `account` are more reliably available after initial auth provider step.

      // 1. Vérification du compte désactivé (principalement pour Credentials, déjà fait dans authorize)
      if (account?.provider === 'credentials' && user?.id) {
          const dbUserCheck = await prisma.user.findUnique({ where: { id: user.id }, select: { enabled: true } });
          if (dbUserCheck?.enabled === false) {
             console.log(`Sign-in blocked for disabled user: ${user.email}`);
             // Lancer une erreur est plus fiable pour bloquer Credentials ici.
             // NextAuth v5 gère mieux les erreurs lancées depuis authorize pour les afficher.
             // Retourner `false` peut ne pas toujours afficher une erreur claire.
             throw new Error("Compte désactivé.");
          }
      }

      // 2. Logique de redirection basée sur le rôle (après une connexion réussie)
      // Ce callback est appelé *avant* la redirection finale.
      // Si on retourne une URL (string), NextAuth redirige vers cette URL.
      // Si on retourne `true`, NextAuth continue avec la redirection par défaut (vers callbackUrl ou `/`).
      // Si on retourne `false`, NextAuth bloque la connexion.
      if (user?.id && account) { // S'assurer que c'est un événement de connexion (pas juste un check de session)
        try {
          const dbUserWithRoles = await prisma.user.findUnique({
            where: { id: user.id },
            select: { roles: { select: { name: true } } }
          });

          const isAdmin = dbUserWithRoles?.roles?.some(role => role.name === 'ADMIN');

          if (isAdmin) {
            console.log(`Admin user ${user.email || user.id} detected during signIn. Redirecting to /admin/users.`);
            return '/admin/users'; // Redirection spécifique pour l'admin
          }
          
          // Pour les utilisateurs non-admin, on ne spécifie pas de redirection ici.
          // On laisse NextAuth utiliser la `callbackUrl` fournie par la page de login.
          // Si cette `callbackUrl` est vide, NextAuth redirige vers `/` par défaut.
          // La page de login a été modifiée pour que la `defaultRedirect` (utilisée pour `callbackUrl`) soit `/dashboard`.
          console.log(`Non-admin user ${user.email || user.id} detected during signIn. Proceeding with default redirect logic (should be to /dashboard or provided callbackUrl).`);
          return true; // Important: Permet à NextAuth de gérer la redirection via callbackUrl

        } catch (error) {
          console.error("Error checking admin role during signIn:", error);
          return true; // En cas d'erreur DB, on autorise quand même la connexion avec la redirection par défaut
        }
      }
      
      // Cas par défaut si user.id ou account n'est pas disponible (ex: check de session)
      return true;
    }
  },
  pages: { 
    signIn: '/auth/login',    
    error: '/auth/login',     
  },
  debug: process.env.NODE_ENV === 'development', 
};

const { handlers, auth, signIn: authSignIn, signOut: authSignOut } = NextAuth(authOptions);

export const { GET, POST } = handlers;

export { auth, authSignIn, authSignOut };