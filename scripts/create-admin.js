import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const EMAIL = /^[^\s@<>,;:"\\]+@[^\s@<>,;:"\\]+\.[^\s@<>,;:"\\]+$/;
const SALT_ROUNDS = 12;

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (typeof email !== 'string' || email.length > 254 || email !== email.trim() || !EMAIL.test(email)) {
    throw new Error('Set one valid ADMIN_EMAIL address before creating an administrator.');
  }
  if (typeof password !== 'string' || password.length < 16 || Buffer.byteLength(password, 'utf8') > 72) {
    throw new Error('Set an ADMIN_PASSWORD of at least 16 characters and at most 72 UTF-8 bytes.');
  }

  const prisma = new PrismaClient();
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const adminUser = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
      },
      create: {
        email,
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN',
      },
    });

    process.stdout.write(`Admin user ready: ${adminUser.role}.\n`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
