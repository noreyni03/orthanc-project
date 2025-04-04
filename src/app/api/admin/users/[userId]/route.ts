// src/app/api/admin/users/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/app/api/auth/[...nextauth]/route'; // Import configured auth

const prisma = new PrismaClient();

interface UpdateUserRolesBody {
  roleIds?: number[]; // Expect an array of Role IDs
}

// Handler for PUT requests to update roles
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await auth(); // Check session

  // Protect route: Only Admins
  if (!session?.user?.roles?.includes('ADMIN')) {
    return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });
  }

  const userId = params.userId;
  if (!userId) {
    return NextResponse.json({ message: 'ID utilisateur manquant' }, { status: 400 });
  }

  // Prevent admin from modifying their own roles via this endpoint (optional safety measure)
  if (userId === session.user.id) {
      return NextResponse.json({ message: 'Impossible de modifier vos propres rôles ici' }, { status: 403 });
  }


  try {
    const body = await request.json() as UpdateUserRolesBody;
    const roleIds = body.roleIds; // Expecting an array of numbers

    // Basic validation
    if (!Array.isArray(roleIds)) {
      return NextResponse.json({ message: 'Format de données invalide : roleIds doit être un tableau.' }, { status: 400 });
    }

    // Check if user exists (optional, update will fail anyway but gives better error)
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
        return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // --- Update user roles ---
    // Prisma's `set` operation replaces all existing relations with the provided ones.
    // It expects an array of objects like [{id: 1}, {id: 3}, ...]
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          set: roleIds.map(id => ({ id: id })), // Map the array of IDs to the format Prisma expects
        },
      },
      // Select the updated user data to return (excluding password)
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        enabled: true,
        provider: true,
        createdAt: true,
        roles: {
          select: {
            id: true,
            name: true,
          },
           orderBy: { name: 'asc' }
        },
      }
    });

    console.log(`Roles updated for user ${userId}`);
    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error(`Erreur lors de la mise à jour des rôles pour l'utilisateur ${userId}:`, error);
     // Handle potential Prisma errors like non-existent role IDs if needed
     if (error instanceof Error && error.message.includes('foreign key constraint')) {
         return NextResponse.json({ message: "Un ou plusieurs ID de rôle fournis sont invalides." }, { status: 400 });
     }
    return NextResponse.json({ message: "Erreur serveur lors de la mise à jour des rôles." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}