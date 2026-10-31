import { withAdminRoute } from '@/lib/session';
import { validId, validateVehicle } from '@/lib/fleet-validation';
import prisma from '@/lib/prisma';

export default withAdminRoute(async function vehicleRoute(req, res) {
  const id = req.query?.id;
  if (!validId(id)) return res.status(400).json({ message: 'Invalid vehicle ID.' });
  try {
    if (req.method === 'GET') {
      const vehicle = await prisma.vehicle.findUnique({ where: { id } });
      return vehicle ? res.status(200).json(vehicle) : res.status(404).json({ message: 'Vehicle not found.' });
    }
    if (req.method === 'PUT') {
      const data = validateVehicle(req.body);
      if (!data) return res.status(400).json({ message: 'Enter valid vehicle details.' });
      return res.status(200).json(await prisma.vehicle.update({ where: { id }, data }));
    }
    if (req.method === 'DELETE') {
      await prisma.vehicle.delete({ where: { id } });
      return res.status(204).end();
    }
    res.setHeader('Allow', 'GET, PUT, DELETE');
    return res.status(405).end('Method Not Allowed');
  } catch (error) {
    if (error?.code === 'P2025') return res.status(404).json({ message: 'Vehicle not found.' });
    if (error?.code === 'P2002') return res.status(409).json({ message: 'A vehicle with that licence plate already exists.' });
    return res.status(500).json({ message: 'Unable to manage vehicle.' });
  }
});
