// prisma/seed.ts
import { PrismaClient, Prisma } from '@prisma/client';
// Importer une librairie pour hacher le mot de passe (la même que vous utiliserez pour l'auth locale si vous l'implémentez)
// Ici, on utilise bcryptjs comme exemple. Installez-le : npm install bcryptjs @types/bcryptjs --save-dev
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Définir les rôles de base (Modification: PHYSICIAN -> MEDECIN)
const rolesToCreate: Prisma.RoleCreateInput[] = [
  { name: 'ADMIN' },
  { name: 'RADIOLOGIST' },
  { name: 'TECHNICIAN' },
  { name: 'MEDECIN' }, // Remplacé PHYSICIAN par MEDECIN
  { name: 'SECRETARY' }, // ou SecMed
  // Ajoutez d'autres rôles si nécessaire
];

// Définir l'utilisateur admin initial
const adminEmail = 'admin@orthancproject.com'; // Changez ceci si vous voulez
const adminPassword = 'adminpassword'; // Changez ceci pour quelque chose de plus sûr, même pour le seed

async function main() {
  console.log(`Start seeding ...`);

  // Créer les rôles (ignorer s'ils existent déjà)
  for (const roleData of rolesToCreate) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: {}, // Ne rien mettre à jour si le rôle existe déjà par nom
      create: roleData, // Créer le rôle s'il n'existe pas
    });
    console.log(`Created or found role: ${role.name}`);
  }

  // Récupérer l'ID du rôle ADMIN (inchangé)
  const adminRole = await prisma.role.findUnique({
    where: { name: 'ADMIN' },
  });

  if (!adminRole) {
    console.error('ADMIN role not found. Seeding admin user failed.');
    return;
  }

  // Hasher le mot de passe admin (inchangé)
  const hashedPassword = await bcrypt.hash(adminPassword, 10); // 10 = salt rounds

  // Créer l'utilisateur admin (ignorer s'il existe déjà par email) (inchangé)
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {}, // Ne rien mettre à jour s'il existe déjà
    create: {
      email: adminEmail,
      password: hashedPassword, // Stocker le mot de passe hashé
      name: 'Admin User', // Nom par défaut
      provider: 'local', // Indiquer que c'est un compte local
      enabled: true,
      emailVerified: new Date(), // Marquer comme vérifié pour le seed
      roles: {
        connect: { id: adminRole.id }, // Connecter au rôle ADMIN
      },
    },
  });

  console.log(`Created or found admin user: ${adminUser.email}`);

  console.log(`Seeding finished.`);
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });