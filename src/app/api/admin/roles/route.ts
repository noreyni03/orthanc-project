// src/app/api/admin/roles/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { createErrorResponse } from '@/lib/apiUtils';

const prisma = new PrismaClient();

export async function GET() {
  const session = await auth();
  
  console.log('Session in admin route:', session?.user);
  console.log('User roles:', session?.user?.roles);

  // Protect route: Only Admins
  if (!session?.user?.roles?.includes('ADMIN')) {
    console.log('Access denied - user roles:', session?.user?.roles);
    // Utiliser createErrorResponse pour l'accès refusé
    return createErrorResponse("Accès refusé. Seuls les administrateurs peuvent accéder à cette ressource.", 403);
  }

  try {
    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' },
    });
    // Réponse de succès standard
    return NextResponse.json(roles);
  } catch (error) {
    // Logguer l'erreur serveur
    console.error("Erreur lors de la récupération des rôles:", error);
    // Utiliser createErrorResponse pour l'erreur serveur
    return createErrorResponse("Erreur serveur lors de la récupération des rôles.", 500);
  } finally {
    await prisma.$disconnect();
  }
}