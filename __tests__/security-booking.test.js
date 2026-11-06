jest.mock('@/lib/prisma', () => ({ __esModule: true, default: { booking: { create: jest.fn() } } }));
jest.mock('@/lib/bot-protection', () => ({ verifyPublicSubmission: jest.fn(async () => ({ allowed: true })) }));
jest.mock('resend', () => {
  const send = jest.fn();
  return { Resend: jest.fn(() => ({ emails: { send } })), __mockSend: send };
});

const prisma = require('@/lib/prisma').default;
const { verifyPublicSubmission } = require('@/lib/bot-protection');
const { __mockSend: send } = require('resend');
const handler = require('../pages/api/add-booking').default;
const prior = { ADMIN_EMAIL: process.env.ADMIN_EMAIL, RESEND_API_KEY: process.env.RESEND_API_KEY };
let ip = 1;
const valid = () => ({
  customerName: 'Acme & Sons', contactPerson: 'Asha Patel', phone: '+91 98765 43210',
  email: 'asha@example.test', pickup: 'Vadodara', pickupAddress: '1 Station Road',
  drop: 'Surat', dropAddress: '2 Main Road', goodsType: 'Equipment', weight: '12.5',
  cargoValue: '10000', date: '2026-11-10', serviceType: 'Full Truck Load',
  cargoDescription: 'Freight', specialInstructions: 'Handle gently', website: '',
});
function req(body = valid()) {
  return { method: 'POST', body, headers: {}, socket: { remoteAddress: `198.51.100.${ip++}` } };
}
function res() {
  return {
    setHeader: jest.fn(),
    status: jest.fn(function (code) { this.code = code; return this; }),
    json: jest.fn(function (body) { this.body = body; return this; }),
  };
}
beforeEach(() => {
  jest.clearAllMocks();
  process.env.ADMIN_EMAIL = 'dispatch@example.test';
  process.env.RESEND_API_KEY = 'test-only';
  verifyPublicSubmission.mockResolvedValue({ allowed: true });
  prisma.booking.create.mockImplementation(async ({ data }) => ({ ...data, id: 'private-db-id' }));
  send.mockResolvedValue({ data: { id: 'fake-email-id' }, error: null });
});
afterAll(() => {
  for (const [key, value] of Object.entries(prior)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

describe('public booking security', () => {
  it('validates a real form payload, ignores privileged fields, and returns only the public reference', async () => {
    const response = res();
    await handler(req({ ...valid(), price: 999, status: 'DELIVERED', driverId: 'attacker-controlled' }), response);
    expect(response.code).toBe(201);
    const { data } = prisma.booking.create.mock.calls[0][0];
    expect(data).toEqual(expect.objectContaining({
      clientName: 'Asha Patel', companyName: 'Acme & Sons', cargoWeight: 12.5, status: 'PENDING',
    }));
    expect(data).not.toHaveProperty('price');
    expect(data).not.toHaveProperty('driverId');
    expect(data.bookingId).toMatch(/^TN[0-9A-F]{12}$/);
    expect(response.body).not.toHaveProperty('booking');
    expect(JSON.stringify(response.body)).not.toContain('asha@example.test');
    expect(send).toHaveBeenCalledTimes(2);
  });

  it('escapes every user-controlled value in email HTML', async () => {
    const response = res();
    await handler(req({
      ...valid(), customerName: '<img src=x onerror=alert(1)>', contactPerson: 'Asha <b>Patel</b>',
      serviceType: '<script>bad()</script>', cargoDescription: '<svg onload=bad()>',
    }), response);
    expect(response.code).toBe(201);
    const adminHtml = send.mock.calls[0][0].html;
    const customerHtml = send.mock.calls[1][0].html;
    expect(adminHtml).toContain('&lt;img');
    expect(adminHtml).toContain('&lt;script&gt;');
    expect(adminHtml).not.toContain('<script>bad()');
    expect(customerHtml).toContain('&lt;b&gt;Patel&lt;/b&gt;');
  });

  it.each([
    ['missing body', null],
    ['array body', []],
    ['missing contact', { ...valid(), customerName: '', contactPerson: '' }],
    ['non-string field', { ...valid(), pickup: { not: null } }],
    ['invalid email', { ...valid(), email: 'hello\r\nX: foo' }],
    ['invalid phone', { ...valid(), phone: '1234' }],
    ['huge field', { ...valid(), cargoDescription: 'x'.repeat(5001) }],
    ['invalid weight', { ...valid(), weight: '12tons' }],
    ['negative weight', { ...valid(), weight: '-1' }],
    ['infinite value', { ...valid(), cargoValue: 'Infinity' }],
    ['invalid date', { ...valid(), date: 'not-a-date' }],
    ['nonexistent calendar date', { ...valid(), date: '2026-02-31' }],
    ['honeypot', { ...valid(), website: 'spam' }],
  ])('rejects %s before storing or emailing', async (_name, body) => {
    const response = res();
    await handler(req(body), response);
    expect(response.code).toBe(400);
    expect(prisma.booking.create).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it('fails closed on Vercel bot verification failure', async () => {
    verifyPublicSubmission.mockResolvedValue({ allowed: false, status: 503 });
    const response = res();
    await handler(req(), response);
    expect(response.code).toBe(503);
    expect(prisma.booking.create).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it('retries the insert on a unique collision, not just a preliminary read', async () => {
    prisma.booking.create.mockRejectedValueOnce({ code: 'P2002' });
    const response = res();
    await handler(req(), response);
    expect(response.code).toBe(201);
    expect(prisma.booking.create).toHaveBeenCalledTimes(2);
    expect(prisma.booking.create.mock.calls[0][0].data.bookingId).not.toBe(prisma.booking.create.mock.calls[1][0].data.bookingId);
  });

  it('warns about email failure without telling the customer to duplicate a saved booking', async () => {
    send.mockRejectedValueOnce(new Error('private upstream detail'));
    const response = res();
    await handler(req(), response);
    expect(response.code).toBe(201);
    expect(response.body.warning).toBe('Email notification unavailable');
    expect(JSON.stringify(response.body)).not.toContain('private upstream detail');
    expect(prisma.booking.create).toHaveBeenCalledTimes(1);
  });
});
