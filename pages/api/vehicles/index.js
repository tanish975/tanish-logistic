import prisma from '@/lib/prisma';

export default async function handler(req, res) {
    const { method } = req;

    switch(method){
        case 'GET':
            try {
                const vehicles = await prisma.vehicle.findMany({
                    orderBy: { createdAt: 'desc' },
                });
                res.status(200).json(vehicles);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
                res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
            }
            break;
        case 'POST':
            try {
                const vehicle = req.body;
                const savedVehicle = await prisma.vehicle.create({
                    data: {
                        make: vehicle.make,
                        model: vehicle.model,
                        licensePlate: vehicle.licensePlate,
                        type: vehicle.type,
                        capacity: vehicle.capacity ? parseFloat(vehicle.capacity) : 0,
                    },
                });
                res.status(201).json(savedVehicle);
            } catch (error) {
                console.error('Error creating vehicle:', error);
                res.status(500).json({ message: 'Error creating vehicle', error: error.message });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
