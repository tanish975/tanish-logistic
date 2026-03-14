import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const driver = await prisma.driver.findUnique({
          where: { id },
        });
        if (driver) {
          res.status(200).json(driver);
        } else {
          res.status(404).json({ message: 'Driver not found' });
        }
      } catch (error) {
        console.error('Error fetching driver:', error);
        res.status(500).json({ message: 'Failed to fetch driver', error: error.message });
      }
      break;

    case 'PUT':
      try {
        const { name, phone, licenseNumber } = req.body;

        const updatedDriver = await prisma.driver.update({
          where: { id },
          data: {
            name,
            phone,
            licenseNumber,
          },
        });
        res.status(200).json(updatedDriver);
      } catch (error) {
        console.error('Error updating driver:', error);
        if (error.code === 'P2025') {
          return res.status(404).json({ message: 'Driver not found' });
        }
        if (error.code === 'P2002') {
          return res.status(409).json({ message: `A driver with this ${error.meta.target.join(', ')} already exists.` });
        }
        res.status(500).json({ message: 'Failed to update driver', error: error.message });
      }
      break;

    case 'DELETE':
      try {
        await prisma.driver.delete({
          where: { id },
        });
        res.status(204).end(); // No content
      } catch (error) {
        console.error('Error deleting driver:', error);
        if (error.code === 'P2025') {
          return res.status(404).json({ message: 'Driver not found' });
        }
        res.status(500).json({ message: 'Failed to delete driver', error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
