import { PrismaClient } from '@prisma/client';

let prismaClient = null;

// Function to get or create Prisma client
function getPrismaClient() {
  if (!prismaClient) {
    prismaClient = new PrismaClient({
      log: process.env.NODE_ENV === 'production' ? ['error'] : [],
    });
  }
  return prismaClient;
}

// Export the actual Prisma client
export default getPrismaClient();

