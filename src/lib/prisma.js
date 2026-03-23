import { PrismaClient } from '@prisma/client';

let prisma;

if (process.env.NODE_ENV === 'production') {
  // For production, create a new client each time to avoid connection issues
  prisma = new PrismaClient({
    log: ['error', 'warn'],
  });
} else {
  // For development, use global to avoid creating too many connections
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  }
  prisma = global.prisma;
}

// Add error handler for connection issues
prisma.$on('error', (e) => {
  console.error('Prisma error:', e);
});

export default prisma;
