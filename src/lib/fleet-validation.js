const CONTROLS = /[\u0000-\u001f\u007f]/;

export function validId(id) {
  return typeof id === 'string' && id.trim().length > 0 && id.length <= 128 && !CONTROLS.test(id);
}

function textFields(input, limits) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const result = {};
  for (const [field, max] of Object.entries(limits)) {
    const value = input[field];
    if (typeof value !== 'string' || !value.trim() || value.length > max || CONTROLS.test(value)) return null;
    result[field] = value.trim();
  }
  return result;
}

export function validateDriver(input) {
  const driver = textFields(input, { name: 120, phone: 60, licenseNumber: 100 });
  if (!driver) return null;
  const digits = (driver.phone.match(/\p{Decimal_Number}/gu) || []).length;
  return digits >= 7 && digits <= 20 ? driver : null;
}

export function validateVehicle(input) {
  const vehicle = textFields(input, { make: 100, model: 100, licensePlate: 100, type: 100 });
  if (!vehicle) return null;
  const raw = input.capacity;
  if ((typeof raw !== 'number' && typeof raw !== 'string') ||
      (typeof raw === 'string' && !/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(raw.trim()))) return null;
  const capacity = Number(raw);
  if (!Number.isFinite(capacity) || capacity <= 0 || capacity > 1_000_000) return null;
  return { ...vehicle, capacity };
}
