import handler from '../pages/api/send-email';
import { __mockSend as mockSend } from 'resend';
import { checkBotId } from 'botid/server';

jest.mock('resend', () => {
  const send = jest.fn();
  return {
    Resend: jest.fn(() => ({ emails: { send } })),
    __mockSend: send,
  };
});

jest.mock('botid/server', () => ({ checkBotId: jest.fn() }), { virtual: true });

let nextIp = 1;
const originalVercel = process.env.VERCEL;
const originalVercelEnv = process.env.VERCEL_ENV;

const legitimateInquiry = () => ({
  name: 'Asha Patel',
  email: 'asha@example.com',
  phone: '+91 98765 43210',
  company: 'Acme & Sons',
  service: 'Full Truck Load (FTL)',
  message: 'Please transport a load from Vadodara to Surat next week.',
  website: '',
});

function makeRequest(body = legitimateInquiry(), overrides = {}) {
  return {
    method: 'POST',
    headers: { 'x-forwarded-for': `192.0.2.${nextIp++}` },
    socket: {},
    body,
    ...overrides,
  };
}

function makeResponse() {
  return {
    setHeader: jest.fn(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

beforeEach(() => {
  process.env.VERCEL = '1';
  delete process.env.VERCEL_ENV;
  mockSend.mockReset();
  mockSend.mockResolvedValue({ data: { id: 'email-id' }, error: null });
  checkBotId.mockReset();
  checkBotId.mockResolvedValue({ isBot: false, isHuman: true });
});

afterAll(() => {
  if (originalVercel === undefined) delete process.env.VERCEL;
  else process.env.VERCEL = originalVercel;
  if (originalVercelEnv === undefined) delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV = originalVercelEnv;
});

describe('contact email endpoint', () => {
  it('accepts a genuine inquiry, verifies it, and sends both emails', async () => {
    const req = makeRequest();
    const res = makeResponse();
    await handler(req, res);

    expect(checkBotId).toHaveBeenCalledWith(expect.objectContaining({
      advancedOptions: expect.objectContaining({ checkLevel: 'basic', headers: req.headers }),
    }));
    expect(mockSend).toHaveBeenCalledTimes(2);
    expect(mockSend.mock.calls[0][0]).toEqual(expect.objectContaining({
      to: 'tanishlogistic744@gmail.com',
      subject: 'New Contact Form Submission from Asha Patel',
    }));
    expect(mockSend.mock.calls[1][0]).toEqual(expect.objectContaining({ to: 'asha@example.com' }));
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('blocks detected bots before sending either email', async () => {
    checkBotId.mockResolvedValue({ isBot: true, isHuman: false });
    const res = makeResponse();
    await handler(makeRequest(), res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('does not send emails when the bot verification service fails', async () => {
    checkBotId.mockRejectedValue(new Error('sensitive internal detail'));
    const res = makeResponse();
    await handler(makeRequest(), res);
    expect(res.status).toHaveBeenCalledWith(503);
    expect(mockSend).not.toHaveBeenCalled();
    expect(JSON.stringify(res.json.mock.calls)).not.toContain('sensitive internal detail');
  });

  it('fails closed if bot verification returns an incomplete verdict', async () => {
    checkBotId.mockResolvedValue({});
    const res = makeResponse();
    await handler(makeRequest(), res);
    expect(res.status).toHaveBeenCalledWith(503);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('fails closed if a deployed request bypassed verification or is a verified bot', async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      checkBotId.mockResolvedValueOnce({ isBot: false, isHuman: true, isVerifiedBot: false, bypassed: true });
      const bypassed = makeResponse();
      await handler(makeRequest(), bypassed);
      expect(bypassed.status).toHaveBeenCalledWith(503);
      checkBotId.mockResolvedValueOnce({ isBot: false, isHuman: true, isVerifiedBot: true, bypassed: false });
      const verifiedBot = makeResponse();
      await handler(makeRequest(), verifiedBot);
      expect(verifiedBot.status).toHaveBeenCalledWith(403);
      expect(mockSend).not.toHaveBeenCalled();
    } finally {
      process.env.NODE_ENV = originalNodeEnv;
    }
  });

  it('treats the honeypot as optional when verification succeeds', async () => {
    const body = legitimateInquiry();
    delete body.website;
    const res = makeResponse();
    await handler(makeRequest(body), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(mockSend).toHaveBeenCalledTimes(2);
  });

  it('rejects a filled honeypot without sending email', async () => {
    const res = makeResponse();
    await handler(makeRequest({ ...legitimateInquiry(), website: 'https://spam.example' }), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('blocks a detected bot with random-looking values like the reported spam', async () => {
    checkBotId.mockResolvedValue({ isBot: true, isHuman: false });
    const res = makeResponse();
    await handler(makeRequest({
      ...legitimateInquiry(),
      name: 'aBcDeFgHiJkLmNoPqRsT',
      message: 'zYxWvUtSrQpOnMlKjIhG',
    }), res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('does not reject an unusual name or message based on their spelling', async () => {
    const res = makeResponse();
    await handler(makeRequest({
      ...legitimateInquiry(),
      name: 'aBcDeFgHiJkLmNoPqRsT',
      message: 'zYxWvUtSrQpOnMlKjIhG',
    }), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(mockSend).toHaveBeenCalledTimes(2);
  });

  it('accepts real names and messages in other languages', async () => {
    const res = makeResponse();
    await handler(makeRequest({
      ...legitimateInquiry(),
      name: 'रवि कुमार',
      phone: '+९१ ९८७६५ ४३२१०',
      message: 'सूरत तक माल भेजना है।',
    }), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(mockSend).toHaveBeenCalledTimes(2);
  });

  it.each([
    ['missing body', null],
    ['array body', []],
    ['blank name', { ...legitimateInquiry(), name: '  ' }],
    ['invalid email', { ...legitimateInquiry(), email: 'not-an-email' }],
    ['blank message', { ...legitimateInquiry(), message: '  ' }],
    ['missing phone', { ...legitimateInquiry(), phone: '' }],
    ['short phone', { ...legitimateInquiry(), phone: '12345' }],
    ['phone with letters', { ...legitimateInquiry(), phone: 'please-call-me' }],
    ['non-string name', { ...legitimateInquiry(), name: { toString: 'bad' } }],
    ['oversized message', { ...legitimateInquiry(), message: 'x'.repeat(5001) }],
    ['header newline', { ...legitimateInquiry(), name: 'Asha\r\nInjected: yes' }],
  ])('rejects %s on the server', async (_label, body) => {
    const res = makeResponse();
    await handler(makeRequest(body), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('escapes untrusted values in both HTML email templates', async () => {
    const res = makeResponse();
    await handler(makeRequest({
      ...legitimateInquiry(),
      name: 'Asha <b>Patel</b>',
      message: '<script>alert("x")</script>',
    }), res);
    const adminHtml = mockSend.mock.calls[0][0].html;
    const customerHtml = mockSend.mock.calls[1][0].html;
    expect(adminHtml).toContain('&lt;script&gt;');
    expect(adminHtml).not.toContain('<script>');
    expect(customerHtml).toContain('Asha &lt;b&gt;Patel&lt;/b&gt;');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('rejects unsupported methods', async () => {
    const res = makeResponse();
    await handler(makeRequest(legitimateInquiry(), { method: 'GET' }), res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'POST');
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('limits repeated requests from the same IP', async () => {
    const req = makeRequest();
    for (let i = 0; i < 5; i += 1) {
      await handler(req, makeResponse());
    }
    const res = makeResponse();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.setHeader).toHaveBeenCalledWith('Retry-After', expect.any(String));
    expect(mockSend).toHaveBeenCalledTimes(10);
  });

  it('keeps working outside Vercel with the local protections', async () => {
    delete process.env.VERCEL;
    const res = makeResponse();
    await handler(makeRequest(), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(checkBotId).not.toHaveBeenCalled();
  });

  it('checks Vercel request context even if system environment variables are not exposed', async () => {
    delete process.env.VERCEL;
    const key = Symbol.for('@vercel/request-context');
    const original = globalThis[key];
    globalThis[key] = { get: () => ({}) };
    try {
      const res = makeResponse();
      await handler(makeRequest(), res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(checkBotId).toHaveBeenCalled();
    } finally {
      if (original === undefined) delete globalThis[key];
      else globalThis[key] = original;
    }
  });

  it('accepts short but genuine enquiries and international numbers', async () => {
    const res = makeResponse();
    await handler(makeRequest({ ...legitimateInquiry(), name: 'Li', message: 'Hi', phone: '+44 20 1234 5678 ext 12' }), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(mockSend).toHaveBeenCalledTimes(2);
  });

  it('does not send a customer confirmation if the admin notification failed', async () => {
    mockSend.mockResolvedValueOnce({ data: null, error: { message: 'failed' } });
    const res = makeResponse();
    await handler(makeRequest(), res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('does not report success if the admin delivery response is incomplete', async () => {
    mockSend.mockResolvedValueOnce({ data: null, error: null });
    const res = makeResponse();
    await handler(makeRequest(), res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('warns if the confirmation delivery response is incomplete', async () => {
    mockSend
      .mockResolvedValueOnce({ data: { id: 'admin-id' }, error: null })
      .mockResolvedValueOnce({ data: null, error: null });
    const res = makeResponse();
    await handler(makeRequest(), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ warning: 'Confirmation email failed' }));
  });

  it('preserves success with a warning when only the customer confirmation fails', async () => {
    mockSend
      .mockResolvedValueOnce({ data: { id: 'admin-id' }, error: null })
      .mockResolvedValueOnce({ data: null, error: { message: 'failed' } });
    const res = makeResponse();
    await handler(makeRequest(), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ warning: 'Confirmation email failed' }));
  });

  it('preserves success when the confirmation request throws after the admin email was sent', async () => {
    mockSend
      .mockResolvedValueOnce({ data: { id: 'admin-id' }, error: null })
      .mockRejectedValueOnce(new Error('network failure'));
    const res = makeResponse();
    await handler(makeRequest(), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ warning: 'Confirmation email failed' }));
  });
});
