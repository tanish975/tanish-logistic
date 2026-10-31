import { withAdminRoute } from '@/lib/session';
import { validId, validateDriver } from '@/lib/fleet-validation';
import prisma from '@/lib/prisma';

export default withAdminRoute(async function driverRoute(req, res) {
  const id = req.query?.id;
  if (!validId(id)) return res.status(400).json({ message: 'Invalid driver ID.' });
  try {
    if (req.method === 'GET') {
      const driver = await prisma.driver.findUnique({ where: { id } });
      return driver ? res.status(200).json(driver) : res.status(404).json({ message: 'Driver not found.' });
    }
    if (req.method === 'PUT') {
      const data = validateDriver(req.body);
      if (!data) return res.status(400).json({ message: 'Enter valid driver details.' });
      return res.status(200).json(await prisma.driver.update({ where: { id }, data }));
    }
    if (req.method === 'DELETE') {
      await prisma.driver.delete({ where: { id } });
      return res.status(204).end();
    }
    res.setHeader('Allow', 'GET, PUT, DELETE');
    return res.status(405).end('Method Not Allowed');
  } catch (error) {
    if (error?.code === 'P2025') return res.status(404).json({ message: 'Driver not found.' });
    if (error?.code === 'P2002') return res.status(409).json({ message: 'A driver with that phone or licence already exists.' });
    return res.status(500).json({ message: 'Unable to manage driver.' });
  }
});
