import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('tanish123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'tanish@admin.com' },
    update: {},
    create: {
      email: 'tanish@admin.com',
      password: hashedPassword,
      name: 'Tanish Admin',
      role: 'ADMIN',
    },
  });

  console.log({ adminUser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
