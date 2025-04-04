// src/app/api/admin/roles/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/app/api/auth/[...nextauth]/route'; // Import configured auth

const prisma = new PrismaClient();

export async function GET() {
  const session = await auth(); // Check session using the exported auth

  // Protect route: Only Admins
  if (!session?.user?.roles?.includes('ADMIN')) {
    return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });
  }

  try {
    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' }, // Optional: order roles alphabetically
    });
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Erreur lors de la récupération des rôles:", error);
    return NextResponse.json({ message: "Erreur serveur lors de la récupération des rôles." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}