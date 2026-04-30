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
      error: 'Configuration error'
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
       bookingCount
     });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: 'Database connection failed. Please try again later.'
      });
    } finally {
      await prisma.$disconnect();
    }
}
