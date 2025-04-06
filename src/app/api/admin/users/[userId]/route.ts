// src/app/api/admin/users/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/app/api/auth/[...nextauth]/route'; // Import configured auth
import { z } from 'zod'; // Importer Zod

const prisma = new PrismaClient();

// Schéma de validation pour les paramètres de la route
const paramsSchema = z.object({
  userId: z.string().uuid({ message: "ID utilisateur invalide (doit être un UUID)" }),
});

// Schéma de validation pour le corps de la requête PUT
const updateRolesSchema = z.object({
  // roleIds doit être un tableau de nombres (peut être vide)
  roleIds: z.array(z.number().int(), { message: "roleIds doit être un tableau de nombres entiers." }),
});


// Handler for PUT requests to update roles
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } } // params type comes from Next.js
) {
  // 1. Valider les paramètres de l'URL (userId)
  const paramsValidation = paramsSchema.safeParse(params);
  if (!paramsValidation.success) {
    return NextResponse.json(
      {
        message: 'Paramètres d\'URL invalides.',
        errors: paramsValidation.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }
  // Utiliser l'ID validé
  const userId = paramsValidation.data.userId;

  // 2. Vérifier la session et les permissions
  const session = await auth(); // Check session
  if (!session?.user?.roles?.includes('ADMIN')) {
    return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });
  }

  // Prevent admin from modifying their own roles via this endpoint
  if (userId === session.user.id) {
      return NextResponse.json({ message: 'Impossible de modifier vos propres rôles ici' }, { status: 403 });
  }

  try {
    // 3. Extraire et valider le corps de la requête
    const body = await request.json();
    const bodyValidation = updateRolesSchema.safeParse(body);

    if (!bodyValidation.success) {
      return NextResponse.json(
        {
          message: 'Données du corps de la requête invalides.',
          errors: bodyValidation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Utiliser les données validées
    const { roleIds } = bodyValidation.data;

    // 4. Vérifier si l'utilisateur existe (avant la mise à jour)
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
        return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // 5. Mettre à jour les rôles de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          // Utiliser les roleIds validés
          set: roleIds.map(id => ({ id: id })),
        },
      },
      // Sélectionner les données mises à jour à retourner
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
     // Gérer les erreurs potentielles (ex: ID de rôle invalide -> contrainte FK)
     if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
         // Code P2025 de Prisma indique souvent un enregistrement lié non trouvé
         return NextResponse.json({ message: "Echec de la mise à jour: un ou plusieurs ID de rôle sont invalides ou l'utilisateur n'existe plus." }, { status: 400 });
     }
     if (error instanceof Error && error.message.includes('foreign key constraint')) { // Moins fiable que le code Prisma
         return NextResponse.json({ message: "Un ou plusieurs ID de rôle fournis sont invalides." }, { status: 400 });
     }
    return NextResponse.json({ message: "Erreur serveur lors de la mise à jour des rôles." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}