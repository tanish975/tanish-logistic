import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // First check if DATABASE_URL is set
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return res.status(500).json({ 
      success: false, 
      error: 'DATABASE_URL is not set',
      nodeEnv: process.env.NODE_ENV
    });
  }

  // Check if it's the correct format
  if (!dbUrl.startsWith('postgresql://')) {
    return res.status(500).json({ 
      success: false, 
      error: 'DATABASE_URL has invalid format',
      dbUrlPreview: dbUrl.substring(0, 30) + '...',
      nodeEnv: process.env.NODE_ENV
    });
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
      nodeEnv: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      code: error.code,
      nodeEnv: process.env.NODE_ENV,
      dbUrlPreview: dbUrl.substring(0, 50) + '...'
    });
  } finally {
    await prisma.$disconnect();
  }
}
