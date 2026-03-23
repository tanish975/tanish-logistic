import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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
      nodeEnv: process.env.NODE_ENV,
      dbUrlSet: !!process.env.DATABASE_URL
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      code: error.code,
      nodeEnv: process.env.NODE_ENV,
      dbUrlSet: !!process.env.DATABASE_URL
    });
  } finally {
    await prisma.$disconnect();
  }
}
