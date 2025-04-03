// src/app/api/auth/register/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10; // Standard salt rounds for bcrypt

export async function POST(req: NextRequest) {
  try {
    // 1. Extraire les données du corps de la requête
    const body = await req.json();
    const { email, password, name } = body;

    // 2. Validation simple des entrées
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'Email invalide ou manquant.' }, { status: 400 });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      // Vous pouvez renforcer cette règle (longueur, complexité)
      return NextResponse.json({ message: 'Mot de passe invalide ou trop court (minimum 6 caractères).' }, { status: 400 });
    }
    // Le nom est facultatif ici, mais vous pouvez le rendre obligatoire si nécessaire
    if (name && typeof name !== 'string') {
        return NextResponse.json({ message: 'Nom invalide.' }, { status: 400 });
    }

    // 3. Vérifier si l'utilisateur existe déjà
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
        email: email,
        password: hashedPassword,
        name: name || null, // Stocker null si le nom n'est pas fourni
        provider: 'local', // Marquer comme compte local
        enabled: true, // Activer le compte par défaut
        // emailVerified: null, // L'email n'est pas vérifié initialement
        // --- Attribution de rôle par défaut (Optionnel) ---
        // Si vous voulez assigner un rôle par défaut (ex: 'PHYSICIAN') à chaque nouvel inscrit:
        // Assurez-vous que le rôle existe (créé par le seed)
        // roles: {
        //   connect: { name: 'PHYSICIAN' } // Ou l'ID si vous préférez
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
    // Gérer les erreurs potentielles (ex: problème de connexion DB, erreur inattendue)
    // Éviter de divulguer des détails sensibles en production
    let errorMessage = "Une erreur est survenue lors de l'inscription.";
    if (error instanceof Error) {
       // Vous pourriez vouloir logguer error.message côté serveur
       // mais ne pas nécessairement l'envoyer au client
       console.error("Detailed Error:", error.message);
    }

    // Erreur générique pour le client
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  } finally {
     // S'assurer de déconnecter Prisma dans les fonctions serverless
     // Bien que Next.js puisse gérer les connexions, c'est une bonne pratique
     await prisma.$disconnect();
  }
}