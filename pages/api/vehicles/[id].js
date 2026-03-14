import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const vehicle = await prisma.vehicle.findUnique({
          where: { id },
        });
        if (vehicle) {
          res.status(200).json(vehicle);
        } else {
          res.status(404).json({ message: 'Vehicle not found' });
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        res.status(500).json({ message: 'Failed to fetch vehicle', error: error.message });
      }
      break;

    case 'PUT':
      try {
        const { make, model, licensePlate, type, capacity } = req.body;

        const updatedVehicle = await prisma.vehicle.update({
          where: { id },
          data: {
            make,
            model,
            licensePlate,
            type,
            capacity: capacity ? parseFloat(capacity) : undefined,
          },
        });
        res.status(200).json(updatedVehicle);
      } catch (error) {
        console.error('Error updating vehicle:', error);
        if (error.code === 'P2025') {
          return res.status(404).json({ message: 'Vehicle not found' });
        }
        if (error.code === 'P2002') {
          return res.status(409).json({ message: `A vehicle with this licensePlate already exists.` });
        }
        res.status(500).json({ message: 'Failed to update vehicle', error: error.message });
      }
      break;

    case 'DELETE':
      try {
        await prisma.vehicle.delete({
          where: { id },
        });
        res.status(204).end(); // No content
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        if (error.code === 'P2025') {
          return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.status(500).json({ message: 'Failed to delete vehicle', error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
