import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const vehicles = await prisma.vehicle.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        });
        res.status(200).json(vehicles);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ message: 'Failed to fetch vehicles', error: error.message });
      }
      break;

    case 'POST':
      try {
        const { make, model, licensePlate, type, capacity } = req.body;

        if (!make || !model || !licensePlate || !type || !capacity) {
          return res.status(400).json({ message: 'Missing required fields: make, model, licensePlate, type, capacity' });
        }

        const newVehicle = await prisma.vehicle.create({
          data: {
            make,
            model,
            licensePlate,
            type,
            capacity: parseFloat(capacity),
          },
        });
        res.status(201).json(newVehicle);
      } catch (error) {
        console.error('Error creating vehicle:', error);
        if (error.code === 'P2002') {
          return res.status(409).json({ message: `A vehicle with this licensePlate already exists.` });
        }
        res.status(500).json({ message: 'Failed to create vehicle', error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
