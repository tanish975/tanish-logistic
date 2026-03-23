import { PrismaClient } from '@prisma/client';

// Singleton pattern to avoid creating too many connections in development
// In production, we'll create a new client each time to avoid connection issues
const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error', 'warn'],
});

// Store in global for development to avoid creating too many connections
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Add error handler
prisma.$on('error', (e) => {
  console.error('Prisma error:', e);
});

export default prisma;
