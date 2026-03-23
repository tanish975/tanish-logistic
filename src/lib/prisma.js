import { PrismaClient } from '@prisma/client';

let prismaClient = null;

// Function to get or create Prisma client
function getPrismaClient() {
  if (!prismaClient) {
    console.log('Creating new PrismaClient instance');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('DATABASE_URL set:', !!process.env.DATABASE_URL);
    
    prismaClient = new PrismaClient({
      log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error', 'warn'],
    });
  }
  return prismaClient;
}

// Export the actual Prisma client
export default getPrismaClient();
