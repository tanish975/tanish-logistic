import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Try to count users
    const userCount = await prisma.user.count();
    const bookingCount = await prisma.booking.count();
    
    res.status(200).json({ 
      success: true, 
      message: 'Database connected!',
      userCount,
      bookingCount,
      dbUrl: process.env.DATABASE_URL ? 'Set (masked)' : 'NOT SET'
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      dbUrl: process.env.DATABASE_URL ? 'Set (masked)' : 'NOT SET'
    });
  } finally {
    await prisma.$disconnect();
  }
}
