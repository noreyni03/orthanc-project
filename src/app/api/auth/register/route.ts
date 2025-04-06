// src/app/api/auth/register/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod'; // Importer Zod

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

// Définir le schéma de validation Zod pour l'inscription
const registerSchema = z.object({
  email: z.string().email({ message: "Format d'email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit faire au moins 6 caractères" }),
  // Le nom est une chaîne facultative, transformée en null si vide ou absente
  name: z.string().optional().nullable().transform(val => (val === "" ? null : val)),
});


export async function POST(req: NextRequest) {
  try {
    // 1. Extraire le corps de la requête
    const body = await req.json();

    // 2. Valider le corps de la requête avec Zod
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      // Si la validation échoue, retourner une erreur 400 avec les détails
      return NextResponse.json(
        {
          message: 'Données invalides fournies.',
          errors: validationResult.error.flatten().fieldErrors, // Erreurs détaillées par champ
        },
        { status: 400 }
      );
    }

    // Utiliser les données validées
    const { email, password, name } = validationResult.data;

    // 3. Vérifier si l'utilisateur existe déjà (après validation)
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Un compte avec cet email existe déjà.' }, { status: 409 }); // 409 Conflict
    }

    // 4. Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 5. Créer le nouvel utilisateur dans la base de données
    const newUser = await prisma.user.create({
      data: {
        email: email, // Utiliser l'email validé
        password: hashedPassword,
        name: name, // Utiliser le nom validé et transformé
        provider: 'local',
        enabled: true,
        // emailVerified: null, // L'email n'est pas vérifié initialement
        // --- Attribution de rôle par défaut (Optionnel) ---
        // roles: {
        //   connect: { name: 'PHYSICIAN' }
        // }
        // ---------------------------------------------------
      },
      // Sélectionner les champs à retourner (NE PAS RETOURNER LE MOT DE PASSE)
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

    // 6. Retourner une réponse de succès
    return NextResponse.json(newUser, { status: 201 }); // 201 Created

  } catch (error) {
    console.error("Registration Error:", error);
    let errorMessage = "Une erreur est survenue lors de l'inscription.";
    if (error instanceof Error) {
       console.error("Detailed Error:", error.message);
    }
    // Erreur générique pour le client
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  } finally {
     await prisma.$disconnect();
  }
}