// src/app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/app/api/auth/[...nextauth]/route'; // Import configured auth

const prisma = new PrismaClient();

export async function GET() {
  const session = await auth(); // Check session

  // Protect route: Only Admins
  if (!session?.user?.roles?.includes('ADMIN')) {
    return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true, // Include image for potential display
        enabled: true,
        provider: true, // Useful to see how the user signed up
        createdAt: true,
        roles: { // Include related roles
          select: {
            id: true, // Select role ID
            name: true, // Select role name
          },
          orderBy: { // Order roles alphabetically within each user
             name: 'asc'
          }
        },
      },
      orderBy: { // Order users by creation date or name
        createdAt: 'desc',
        // name: 'asc',
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return NextResponse.json({ message: "Erreur serveur lors de la récupération des utilisateurs." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}