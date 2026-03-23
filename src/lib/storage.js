// Simple JSON-based storage for Vercel (no database required)
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// File paths
const bookingsFile = path.join(dataDir, 'bookings.json');
const driversFile = path.join(dataDir, 'drivers.json');
const vehiclesFile = path.join(dataDir, 'vehicles.json');
const usersFile = path.join(dataDir, 'users.json');

// Initialize files if they don't exist
const initializeFile = (filePath, defaultData) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
};

// Default data - only initialize users, bookings/drivers/vehicles already exist
initializeFile(usersFile, [
  { id: '1', email: 'tanish@admin.com', password: '$2b$10$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqG5fN8H4G', name: 'Tanish Admin', role: 'ADMIN' }
]);

// Helper functions
export const readData = (file) => {
  try {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

export const writeData = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// Bookings
export const getBookings = () => readData(bookingsFile);

export const saveBooking = (booking) => {
  const bookings = getBookings();
  booking.id = booking.id || `BK${Date.now()}`;
  booking.createdAt = new Date().toISOString();
  // Map new field names to match data format
  booking.customerName = booking.customerName || booking.companyName || '';
  booking.pickup = booking.pickup || booking.pickupLocation || '';
  booking.drop = booking.drop || booking.dropLocation || '';
  booking.goodsType = booking.goodsType || booking.cargoType || '';
  booking.weight = booking.weight || booking.cargoWeight || '';
  booking.vehicleType = booking.serviceType || '';
  booking.status = booking.status || 'PENDING';
  bookings.unshift(booking);
  writeData(bookingsFile, bookings);
  return booking;
};

export const updateBookingStatus = (bookingId, status) => {
  try {
    const bookings = getBookings();
    // Try matching by id or bookingId
    const index = bookings.findIndex(b => b.id === bookingId || b.bookingId === bookingId);
    if (index !== -1) {
      bookings[index].status = status;
      bookings[index].updatedAt = new Date().toISOString();
      writeData(bookingsFile, bookings);
      return bookings[index];
    }
    console.log('Booking not found for ID:', bookingId, 'Available IDs:', bookings.map(b => b.id));
    return null;
  } catch (error) {
    console.error('Error in updateBookingStatus:', error);
    throw error;
  }
};

// Drivers
export const getDrivers = () => readData(driversFile);

export const saveDriver = (driver) => {
  const drivers = getDrivers();
  driver.id = driver.id || `DRV${Date.now()}`;
  driver.createdAt = new Date().toISOString();
  drivers.push(driver);
  writeData(driversFile, drivers);
  return driver;
};

// Vehicles
export const getVehicles = () => readData(vehiclesFile);

export const saveVehicle = (vehicle) => {
  const vehicles = getVehicles();
  vehicle.id = vehicle.id || `VEH${Date.now()}`;
  vehicle.createdAt = new Date().toISOString();
  vehicles.push(vehicle);
  writeData(vehiclesFile, vehicles);
  return vehicle;
};

// Users
export const getUsers = () => readData(usersFile);

export const findUser = (email) => {
  const users = getUsers();
  return users.find(u => u.email === email);
};
