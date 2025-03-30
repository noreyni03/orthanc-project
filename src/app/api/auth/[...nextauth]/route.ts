// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import type { Session } from 'next-auth';
import type { User as NextAuthUser } from 'next-auth';
import type { AdapterUser } from '@auth/core/adapters';
import GoogleProvider from 'next-auth/providers/google';
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
}

// Définir les options avec le type NextAuthConfig correct
export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  session: {
    strategy: 'database',
  },
  secret: nextAuthSecret,
  callbacks: {
    async session({ session, user }: { session: Session; user: AdapterUser }) {
      if (session?.user) {
        // L'AdapterUser a toujours un id de type string
        session.user.id = user.id;
        
        // Récupérer les rôles depuis Prisma
        const userWithRolesFromDb = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            roles: {
              select: { name: true },
            },
          },
        });
        
        session.user.roles = userWithRolesFromDb?.roles.map((role) => role.name) ?? [];
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

// Exporter les handlers GET et POST
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };