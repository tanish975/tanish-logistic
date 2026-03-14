import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const drivers = await prisma.driver.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        });
        res.status(200).json(drivers);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        res.status(500).json({ message: 'Failed to fetch drivers', error: error.message });
      }
      break;

    case 'POST':
      try {
        const { name, phone, licenseNumber } = req.body;

        if (!name || !phone || !licenseNumber) {
          return res.status(400).json({ message: 'Missing required fields: name, phone, licenseNumber' });
        }

        const newDriver = await prisma.driver.create({
          data: {
            name,
            phone,
            licenseNumber,
          },
        });
        res.status(201).json(newDriver);
      } catch (error) {
        console.error('Error creating driver:', error);
        // Check for unique constraint violation
        if (error.code === 'P2002') {
          return res.status(409).json({ message: `A driver with this ${error.meta.target.join(', ')} already exists.` });
        }
        res.status(500).json({ message: 'Failed to create driver', error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
