// src/app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { createErrorResponse } from '@/lib/apiUtils';

const prisma = new PrismaClient();

export async function GET() {
  const session = await auth();

  // Protect route: Only Admins
  if (!session?.user?.roles?.includes('ADMIN')) {
    // Utiliser createErrorResponse pour l'accès refusé
    return createErrorResponse("Accès refusé. Seuls les administrateurs peuvent accéder à cette ressource.", 403);
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        enabled: true,
        provider: true,
        createdAt: true,
        roles: {
          select: { id: true, name: true },
          orderBy: { name: 'asc' }
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    // Réponse de succès standard
    return NextResponse.json(users);
  } catch (error) {
    // Logguer l'erreur serveur
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    // Utiliser createErrorResponse pour l'erreur serveur
    return createErrorResponse("Erreur serveur lors de la récupération des utilisateurs.", 500);
  } finally {
    await prisma.$disconnect();
  }
}