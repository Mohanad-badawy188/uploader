import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seed() {
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
      password,
      name: 'User',
      role: Role.USER,
    },
  });

  await prisma.$disconnect();
}
