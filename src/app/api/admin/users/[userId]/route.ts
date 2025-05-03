// src/app/api/admin/users/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// Import spécifique pour l'erreur Prisma
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';
import { createErrorResponse } from '@/lib/apiUtils';

const prisma = new PrismaClient();

// Schéma pour les paramètres (inchangé)
const paramsSchema = z.object({
  userId: z.string().uuid({ message: "ID utilisateur invalide (doit être un UUID)" }),
});

// Schéma pour le body (inchangé)
const updateRolesSchema = z.object({
  roleIds: z.array(z.number().int(), { message: "roleIds doit être un tableau de nombres entiers." }),
});


export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  // 1. Valider les paramètres de l'URL
  const paramsValidation = paramsSchema.safeParse(params);
  if (!paramsValidation.success) {
    return createErrorResponse(
      "Paramètres d'URL invalides.",
      400,
      paramsValidation.error.flatten().fieldErrors
    );
  }
  const userId = paramsValidation.data.userId;

  // 2. Vérifier la session et les permissions
  const session = await auth();
  if (!session?.user?.roles?.includes('ADMIN')) {
    return createErrorResponse("Accès refusé. Seuls les administrateurs peuvent modifier les rôles.", 403);
  }

  // Prevent admin from modifying their own roles
  if (userId === session.user.id) {
      return createErrorResponse("Impossible de modifier vos propres rôles via cette interface.", 403);
  }

  try {
    // 3. Extraire et valider le corps de la requête
    const body = await request.json();
    const bodyValidation = updateRolesSchema.safeParse(body);

    if (!bodyValidation.success) {
      return createErrorResponse(
        "Données du corps de la requête invalides.",
        400,
        bodyValidation.error.flatten().fieldErrors
      );
    }
    const { roleIds } = bodyValidation.data;

    // 4. Vérifier si l'utilisateur existe (avant la mise à jour)
    //    Ce findUnique n'est pas strictement nécessaire car l'update échouerait avec P2025,
    //    mais il permet de retourner un 404 plus explicite avant l'opération d'écriture.
    const userExists = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true } // Sélectionne juste l'ID pour vérifier l'existence
    });
    if (!userExists) {
        return createErrorResponse("Utilisateur non trouvé.", 404);
    }

    // 5. Mettre à jour les rôles de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          set: roleIds.map(id => ({ id: id })),
        },
      },
      select: { // Sélectionner les données mises à jour à retourner
        id: true, name: true, email: true, image: true, enabled: true,
        provider: true, createdAt: true,
        roles: { select: { id: true, name: true }, orderBy: { name: 'asc' } },
      }
    });

    console.log(`Roles updated for user ${userId}`);
    // Réponse de succès standard
    return NextResponse.json(updatedUser);

  } catch (error) {
    // Logguer l'erreur complète côté serveur
    console.error(`Erreur lors de la mise à jour des rôles pour l'utilisateur ${userId}:`, error);

    // Gestion spécifique des erreurs Prisma connues
    if (error instanceof PrismaClientKnownRequestError) {
      // P2025: L'enregistrement à mettre à jour (User) n'a pas été trouvé.
      // Normalement couvert par la vérification userExists, mais sécurité supplémentaire.
      if (error.code === 'P2025') {
        return createErrorResponse("L'utilisateur cible n'existe pas.", 404);
      }
      // P2003: Violation de contrainte de clé étrangère (ex: un roleId n'existe pas dans la table Role)
      if (error.code === 'P2003') {
         // Le champ 'meta.field_name' peut indiquer quelle contrainte a échoué, ici on suppose que c'est lié aux roles.
         console.warn("Prisma Foreign Key Constraint Failed (P2003) - Likely invalid roleId provided.", error.meta);
         return createErrorResponse("Échec de la mise à jour: un ou plusieurs ID de rôle fournis sont invalides.", 400);
      }
      // Ajouter d'autres codes Prisma si nécessaire...
    }

    // Retourner une erreur générique 500 pour les autres cas
    return createErrorResponse("Erreur serveur lors de la mise à jour des rôles.", 500);
  } finally {
    await prisma.$disconnect();
  }
}