import prisma from '@/lib/prisma';

export default async function handler(req, res) {
    const { method } = req;

    switch(method){
        case 'GET':
            try {
                const drivers = await prisma.driver.findMany({
                    orderBy: { createdAt: 'desc' },
                });
                res.status(200).json(drivers);
            } catch (error) {
                console.error('Error fetching drivers:', error);
                res.status(500).json({ message: 'Error fetching drivers', error: error.message });
            }
            break;
        case 'POST':
            try {
                const driver = req.body;
                const savedDriver = await prisma.driver.create({
                    data: {
                        name: driver.name,
                        phone: driver.phone,
                        licenseNumber: driver.licenseNumber,
                    },
                });
                res.status(201).json(savedDriver);
            } catch (error) {
                console.error('Error creating driver:', error);
                res.status(500).json({ message: 'Error creating driver', error: error.message });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
