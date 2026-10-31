// Treat every public booking field as untrusted, including fields not shown by
// the current UI. Only the returned allowlist is passed to Prisma.
const SINGLE_LINE_CONTROL = /[\u0000-\u001f\u007f\u2028\u2029]/;
const MULTILINE_CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
const EMAIL = /^[^\s@<>,;:"\\]+@[^\s@<>,;:"\\]+\.[^\s@<>,;:"\\]+$/;

export function validateBooking(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const values = {};
  const fields = {
    clientName: [body.contactPerson || body.clientName || body.customerName, 120, true, false],
    companyName: [body.companyName || (body.contactPerson ? body.customerName : ''), 200, false, false],
    phone: [body.phone, 60, true, false],
    email: [body.email, 254, true, false],
    pickup: [body.pickup || body.pickupLocation, 200, true, false],
    drop: [body.drop || body.dropLocation, 200, true, false],
    cargo: [body.goodsType || body.cargoType || body.cargo, 200, true, false],
    pickupAddress: [body.pickupAddress || body.pickupLocation, 500, true, true],
    dropAddress: [body.dropAddress || body.dropLocation, 500, true, true],
    serviceType: [body.serviceType || body.vehicleType, 100, true, false],
    cargoDescription: [body.cargoDescription || body.message, 5000, false, true],
    specialInstructions: [body.specialInstructions || body.message, 5000, false, true],
    website: [body.website, 200, false, false],
  };
  for (const [key, [value, limit, required, multiline]] of Object.entries(fields)) {
    if (value === undefined || value === null || value === '') {
      if (required) return null;
      values[key] = '';
      continue;
    }
    if (typeof value !== 'string' || value.length > limit ||
        (multiline ? MULTILINE_CONTROL : SINGLE_LINE_CONTROL).test(value)) return null;
    values[key] = value.trim();
    if (required && !values[key]) return null;
  }
  if (values.website || !EMAIL.test(values.email)) return null;
  const phoneDigits = (values.phone.match(/\p{Decimal_Number}/gu) || []).length;
  if (phoneDigits < 7 || phoneDigits > 20) return null;

  for (const [key, value, maximum] of [
    ['cargoWeight', body.weight ?? body.cargoWeight, 1_000_000],
    ['cargoValue', body.cargoValue, 1_000_000_000_000],
  ]) {
    if (value === undefined || value === null || value === '') {
      values[key] = null;
      continue;
    }
    if ((typeof value !== 'string' && typeof value !== 'number') ||
        (typeof value === 'string' && !/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(value.trim()))) return null;
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0 || number > maximum || (key === 'cargoWeight' && number === 0)) return null;
    values[key] = number;
  }
  if (typeof body.date !== 'string' || body.date.length > 30 || Number.isNaN(Date.parse(body.date))) return null;
  values.date = new Date(body.date);
  if (/^\d{4}-\d{2}-\d{2}$/.test(body.date) && values.date.toISOString().slice(0, 10) !== body.date) return null;
  delete values.website;
  // Pricing, status, and relations are set only by trusted staff, not visitors.
  return values;
}
