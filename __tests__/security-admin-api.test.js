jest.mock('@/lib/session', () => ({ withAdminRoute: (handler) => handler }));
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    booking: { findFirst: jest.fn(), update: jest.fn(), updateMany: jest.fn(), delete: jest.fn(), deleteMany: jest.fn() },
    driver: { findMany: jest.fn(), create: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
    vehicle: { findMany: jest.fn(), create: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
    user: { findUnique: jest.fn(), create: jest.fn() },
  },
}));
jest.mock('bcrypt', () => ({ hash: jest.fn(async () => 'mock-hash') }));
const prisma = require('@/lib/prisma').default;
const deleteBooking = require('../pages/api/delete-booking').default;
const updateStatus = require('../pages/api/update-booking-status').default;
const drivers = require('../pages/api/drivers/index').default;
const driver = require('../pages/api/drivers/[id]').default;
const vehicles = require('../pages/api/vehicles/index').default;
const addUser = require('../pages/api/users/add-user').default;
function res() {
  return { setHeader: jest.fn(), status: jest.fn(function (code) { this.code = code; return this; }), json: jest.fn(function (body) { this.body = body; return this; }), end: jest.fn() };
}
beforeEach(() => jest.clearAllMocks());

describe('admin input and error safety (authorization tested independently)', () => {
  it('cannot interpret a string such as "false" as a bulk-delete request', async () => {
    const response = res();
    await deleteBooking({ method: 'POST', body: { deleteAllCancelled: 'false' } }, response);
    expect(response.code).toBe(400);
    expect(prisma.booking.deleteMany).not.toHaveBeenCalled();
  });

  it('validates booking status and IDs before database access', async () => {
    for (const body of [{ id: { not: '' }, status: 'PENDING' }, { id: 'b1', status: 'not-a-status' }]) {
      const response = res();
      await updateStatus({ method: 'POST', body }, response);
      expect(response.code).toBe(400);
    }
    expect(prisma.booking.findFirst).not.toHaveBeenCalled();
  });

  it('validates driver and vehicle data, allowing only explicit fields', async () => {
    prisma.driver.create.mockImplementation(async ({ data }) => data);
    const added = res();
    await drivers({ method: 'POST', body: { name: 'Asha', phone: '9876543210', licenseNumber: 'LIC123', role: 'ADMIN' } }, added);
    expect(added.code).toBe(201);
    expect(prisma.driver.create).toHaveBeenCalledWith({ data: { name: 'Asha', phone: '9876543210', licenseNumber: 'LIC123' } });
    const invalid = res();
    await vehicles({ method: 'POST', body: { make: 'Tata', model: 'Test', licensePlate: 'GJ01AB1234', type: 'Truck', capacity: '10tons' } }, invalid);
    expect(invalid.code).toBe(400);
    expect(prisma.vehicle.create).not.toHaveBeenCalled();
    const badId = res();
    await driver({ method: 'DELETE', query: { id: ['all'] } }, badId);
    expect(badId.code).toBe(400);
    expect(prisma.driver.delete).not.toHaveBeenCalled();
  });

  it('enforces password length and never lets the request choose an admin role', async () => {
    const weak = res();
    await addUser({ method: 'POST', body: { email: 'customer@example.test', name: 'Test', password: 'short' } }, weak);
    expect(weak.code).toBe(400);
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockImplementation(async ({ data }) => ({ ...data, id: 'customer-1' }));
    const response = res();
    await addUser({ method: 'POST', body: { email: 'customer@example.test', name: 'Test', password: 'secure-test-password', role: 'ADMIN' } }, response);
    expect(response.code).toBe(201);
    expect(prisma.user.create.mock.calls[0][0].data.role).toBe('CUSTOMER');
    expect(response.body.user).not.toHaveProperty('password');
  });

  it('never exposes internal database exception messages', async () => {
    prisma.vehicle.findMany.mockRejectedValue(new Error('private database connection details'));
    const response = res();
    await vehicles({ method: 'GET' }, response);
    expect(response.code).toBe(500);
    expect(JSON.stringify(response.body)).not.toContain('private database connection details');
  });
});
