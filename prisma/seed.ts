// prisma/seed.ts
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const rolesToCreate: Prisma.RoleCreateInput[] = [
  { name: 'ADMIN' },
  { name: 'RADIOLOGIST' },
  { name: 'TECHNICIAN' },
  { name: 'MEDECIN' },
  { name: 'SECRETARY' },
];

// Définir l'utilisateur admin initial
const adminEmail = 'admin@orthancproject.com';
const adminPassword = 'adminpassword';

async function main() {
  console.log(`Start seeding ...`);

  for (const roleData of rolesToCreate) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: roleData,
    });
    console.log(`Created or found role: ${role.name}`);
  }

  const adminRole = await prisma.role.findUnique({
    where: { name: 'ADMIN' },
  });

  if (!adminRole) {
    console.error('ADMIN role not found. Seeding admin user failed.');
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10); // 10 = salt rounds

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin User',
      provider: 'local',
      enabled: true,
      emailVerified: new Date(),
      roles: {
        connect: { id: adminRole.id },
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