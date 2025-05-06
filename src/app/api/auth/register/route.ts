// src/app/api/auth/register/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { createErrorResponse } from '@/lib/apiUtils';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

// Schéma de validation Zod
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
      return createErrorResponse("Un compte avec cet email existe déjà.", 409);
    }

    // 4. Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 5. Créer le nouvel utilisateur dans la base de données
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
        provider: 'local',
        enabled: true,
        // ----> AJOUT : Assignation du rôle par défaut <----
        roles: {
          connect: { name: 'TECHNICIAN' } // Connecter au rôle TECHNICIAN
        }
      },
      select: { // Sélectionner les champs à retourner
        id: true,
        email: true,
        name: true,
        createdAt: true,
        enabled: true,
        provider: true,
        // Inclure les rôles pour confirmation si nécessaire (optionnel)
        // roles: { select: { name: true } }
      }
    });

    console.log(`New local user registered: ${newUser.email} (ID: ${newUser.id}) with default role TECHNICIAN`);

    // 6. Retourner une réponse de succès
    return NextResponse.json(newUser, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    // Gestion spécifique si la connexion au rôle échoue (ex: rôle inexistant)
    if (error instanceof Error && error.message.toLowerCase().includes('record to connect not found')) {
        console.error("CRITICAL: Default role 'TECHNICIAN' not found in database during registration.");
        return createErrorResponse("Erreur interne de configuration lors de l'inscription.", 500);
    }
    return createErrorResponse("Une erreur interne est survenue lors de l'inscription.", 500);
  } finally {
     await prisma.$disconnect();
  }
}