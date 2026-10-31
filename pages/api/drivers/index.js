import { withAdminRoute } from '@/lib/session';
import { validateDriver } from '@/lib/fleet-validation';
import prisma from '@/lib/prisma';

export default withAdminRoute(async function driversIndexRoute(req, res) {
  try {
    if (req.method === 'GET') {
      return res.status(200).json(await prisma.driver.findMany({ orderBy: { createdAt: 'desc' } }));
    }
    if (req.method === 'POST') {
      const data = validateDriver(req.body);
      if (!data) return res.status(400).json({ message: 'Enter valid driver details.' });
      return res.status(201).json(await prisma.driver.create({ data }));
    }
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).end('Method Not Allowed');
  } catch (error) {
    if (error?.code === 'P2002') return res.status(409).json({ message: 'A driver with that phone or licence already exists.' });
    return res.status(500).json({ message: 'Unable to manage drivers.' });
  }
});
