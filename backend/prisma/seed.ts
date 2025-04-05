// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('test123', 12);

  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'admin',
      password,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      password: password,
      name: 'User',
      role: Role.USER,
    },
  });
}

main()
  .then(() => {
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });
