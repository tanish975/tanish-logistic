import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('tanish123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'tanish@admin.com' },
    update: {},
    create: {
      email: 'tanish@admin.com',
      password: hashedPassword,
      name: 'Tanish Admin',
      role: 'ADMIN',
    },
  });

  console.log({ adminUser });

  // Create sample bookings
  const bookings = [
    {
      bookingId: 'TN001',
      clientName: 'ABC Corporation',
      companyName: 'ABC India Pvt Ltd',
      phone: '9876543210',
      email: 'contact@abccorp.com',
      pickup: 'Mumbai',
      drop: 'Delhi',
      cargo: 'Electronics',
      cargoWeight: 500,
      cargoValue: 250000,
      cargoDescription: 'Laptops and computers',
      pickupAddress: '123 Mumbai Central, Mumbai',
      dropAddress: '456 Connaught Place, Delhi',
      date: new Date('2026-03-10'),
      serviceType: 'Express',
      specialInstructions: 'Handle with care',
      price: 25000,
      status: 'DELIVERED',
    },
    {
      bookingId: 'TN002',
      clientName: 'XYZ Industries',
      companyName: 'XYZ Ltd',
      phone: '9876543211',
      email: 'info@xyzind.com',
      pickup: 'Bangalore',
      drop: 'Chennai',
      cargo: 'Textiles',
      cargoWeight: 1000,
      cargoValue: 150000,
      cargoDescription: 'Cotton fabrics',
      pickupAddress: '789 Whitefield, Bangalore',
      dropAddress: '101 T Nagar, Chennai',
      date: new Date('2026-03-12'),
      serviceType: 'Standard',
      price: 18000,
      status: 'IN_TRANSIT',
    },
    {
      bookingId: 'TN003',
      clientName: 'Global Trade Co',
      phone: '9876543212',
      email: 'sales@globaltrade.com',
      pickup: 'Ahmedabad',
      drop: 'Surat',
      cargo: 'Chemicals',
      cargoWeight: 2000,
      cargoValue: 500000,
      pickupAddress: '222 GIDC, Ahmedabad',
      dropAddress: '333 Magdalla, Surat',
      date: new Date('2026-03-14'),
      serviceType: 'Express',
      price: 35000,
      status: 'PENDING',
    },
    {
      bookingId: 'TN004',
      clientName: 'Sunrise Exports',
      phone: '9876543213',
      email: 'export@sunrise.com',
      pickup: 'Vadodara',
      drop: 'Mumbai',
      cargo: 'Pharmaceuticals',
      cargoWeight: 300,
      cargoValue: 1000000,
      pickupAddress: '444 Pharmaceutical Zone, Vadodara',
      dropAddress: '555 Jawaharlal Nehru Port, Mumbai',
      date: new Date('2026-03-15'),
      serviceType: 'Express',
      specialInstructions: 'Keep refrigerated',
      price: 45000,
      status: 'CONFIRMED',
    },
    {
      bookingId: 'TN005',
      clientName: 'Tech Solutions',
      companyName: 'Tech Solutions India',
      phone: '9876543214',
      email: 'support@techsol.com',
      pickup: 'Hyderabad',
      drop: 'Pune',
      cargo: 'Server Equipment',
      cargoWeight: 800,
      cargoValue: 500000,
      pickupAddress: '666 HITEC City, Hyderabad',
      dropAddress: '777 Hinjewadi, Pune',
      date: new Date('2026-03-16'),
      serviceType: 'Premium',
      price: 55000,
      status: 'PENDING',
    },
  ];

  for (const booking of bookings) {
    await prisma.booking.upsert({
      where: { bookingId: booking.bookingId },
      update: {},
      create: booking,
    });
  }

  console.log('Created 5 sample bookings');

  // Create sample drivers
  const drivers = [
    {
      name: 'Rajesh Kumar',
      phone: '9988776655',
      licenseNumber: 'DL123456789',
    },
    {
      name: 'Amit Singh',
      phone: '9988776656',
      licenseNumber: 'DL987654321',
    },
    {
      name: 'Suresh Patel',
      phone: '9988776657',
      licenseNumber: 'GJ456789123',
    },
  ];

  for (const driver of drivers) {
    await prisma.driver.upsert({
      where: { licenseNumber: driver.licenseNumber },
      update: {},
      create: driver,
    });
  }

  console.log('Created 3 sample drivers');

  // Create sample vehicles
  const vehicles = [
    {
      make: 'Tata',
      model: 'LPT 2518',
      licensePlate: 'GJ01AB1234',
      type: 'Truck',
      capacity: 18,
    },
    {
      make: 'Ashok Leyland',
      model: 'Dost',
      licensePlate: 'MH02CD5678',
      type: 'Van',
      capacity: 3,
    },
    {
      make: 'Mahindra',
      model: 'Bolero Pickup',
      licensePlate: 'KA03EF9012',
      type: 'Pickup',
      capacity: 1.5,
    },
  ];

  for (const vehicle of vehicles) {
    await prisma.vehicle.upsert({
      where: { licensePlate: vehicle.licensePlate },
      update: {},
      create: vehicle,
    });
  }

  console.log('Created 3 sample vehicles');
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
