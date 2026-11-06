import { withAdminRoute } from '@/lib/session';
import prisma from '@/lib/prisma';

// Admin-only connectivity check. Never disconnect the shared Prisma client or
// expose record counts to unauthenticated visitors.
export default withAdminRoute(async function testDatabase(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method not allowed.' });
  }
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({ success: true, message: 'Database connected.' });
  } catch {
    return res.status(503).json({ success: false, message: 'Database connection unavailable.' });
  }
});
