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

// Export a proxy that delays initialization
export default {
  get client() {
    return getPrismaClient();
  },
  
  // Proxy all Prisma operations through the getter
  $connect: async function() {
    return getPrismaClient().$connect();
  },
  
  $disconnect: async function() {
    return getPrismaClient().$disconnect();
  },
  
  $on: function(event, callback) {
    return getPrismaClient().$on(event, callback);
  },
  
  user: {
    findUnique: function(...args) {
      return getPrismaClient().user.findUnique(...args);
    },
    findMany: function(...args) {
      return getPrismaClient().user.findMany(...args);
    },
    create: function(...args) {
      return getPrismaClient().user.create(...args);
    },
    delete: function(...args) {
      return getPrismaClient().user.delete(...args);
    },
    count: function(...args) {
      return getPrismaClient().user.count(...args);
    },
  },
  
  booking: {
    findUnique: function(...args) {
      return getPrismaClient().booking.findUnique(...args);
    },
    findMany: function(...args) {
      return getPrismaClient().booking.findMany(...args);
    },
    create: function(...args) {
      return getPrismaClient().booking.create(...args);
    },
    update: function(...args) {
      return getPrismaClient().booking.update(...args);
    },
    delete: function(...args) {
      return getPrismaClient().booking.delete(...args);
    },
    count: function(...args) {
      return getPrismaClient().booking.count(...args);
    },
  },
  
  driver: {
    findUnique: function(...args) {
      return getPrismaClient().driver.findUnique(...args);
    },
    findMany: function(...args) {
      return getPrismaClient().driver.findMany(...args);
    },
    create: function(...args) {
      return getPrismaClient().driver.create(...args);
    },
    update: function(...args) {
      return getPrismaClient().driver.update(...args);
    },
    delete: function(...args) {
      return getPrismaClient().driver.delete(...args);
    },
  },
  
  vehicle: {
    findUnique: function(...args) {
      return getPrismaClient().vehicle.findUnique(...args);
    },
    findMany: function(...args) {
      return getPrismaClient().vehicle.findMany(...args);
    },
    create: function(...args) {
      return getPrismaClient().vehicle.create(...args);
    },
    update: function(...args) {
      return getPrismaClient().vehicle.update(...args);
    },
    delete: function(...args) {
      return getPrismaClient().vehicle.delete(...args);
    },
  },
  
  review: {
    findUnique: function(...args) {
      return getPrismaClient().review.findUnique(...args);
    },
    findMany: function(...args) {
      return getPrismaClient().review.findMany(...args);
    },
    create: function(...args) {
      return getPrismaClient().review.create(...args);
    },
    update: function(...args) {
      return getPrismaClient().review.update(...args);
    },
    delete: function(...args) {
      return getPrismaClient().review.delete(...args);
    },
  },
};
