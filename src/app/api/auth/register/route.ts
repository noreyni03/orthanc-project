// src/app/api/auth/register/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { createErrorResponse } from '@/lib/apiUtils'; // Importer l'utilitaire

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

// Schéma de validation Zod (inchangé)
const registerSchema = z.object({
  email: z.string().email({ message: "Format d'email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit faire au moins 6 caractères" }),
  name: z.string().optional().nullable().transform(val => (val === "" ? null : val)),
});


export async function POST(req: NextRequest) {
  try {
    // 1. Extraire le corps de la requête
    const body = await req.json();

    // 2. Valider le corps de la requête avec Zod
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      // Utiliser createErrorResponse pour l'erreur de validation
      return createErrorResponse(
        "Erreur de validation des données d'inscription.",
        400,
        validationResult.error.flatten().fieldErrors
      );
    }

    // Utiliser les données validées
    const { email, password, name } = validationResult.data;

    // 3. Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      // Utiliser createErrorResponse pour l'email existant
      return createErrorResponse("Un compte avec cet email existe déjà.", 409);
    }

    // 4. Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 5. Créer le nouvel utilisateur
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
        provider: 'local',
        enabled: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        enabled: true,
        provider: true,
      }
    });

    console.log(`New local user registered: ${newUser.email} (ID: ${newUser.id})`);

    // 6. Retourner une réponse de succès (pas besoin de createSuccessResponse pour l'instant)
    // On garde la structure de réponse existante pour le succès.
    return NextResponse.json(newUser, { status: 201 });

  } catch (error) {
    // Logguer l'erreur complète côté serveur pour le débogage
    console.error("Registration Error:", error);

    // Retourner une erreur générique 500 au client via createErrorResponse
    return createErrorResponse("Une erreur interne est survenue lors de l'inscription.", 500);
  } finally {
     await prisma.$disconnect();
  }
}