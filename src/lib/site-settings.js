import fs from 'node:fs/promises';
import path from 'node:path';
import prisma from '@/lib/prisma';

export const DEFAULT_SETTINGS = {
  siteName: 'Tanish Logistic',
  logoUrl: '/logo-animated.svg',
  slogan: 'Driven by Trust, Powered by Roads',
  contactDetails: 'Vadodara, Gujarat, India',
  copyright: `© ${new Date().getFullYear()} Tanish Logistic. All rights reserved.`,
  primaryColor: '#3b82f6',
  secondaryColor: '#8b5cf6',
  defaultPostStatus: 'draft',
  commentModeration: 'manual',
  phone: '',
  email: '',
  address: '',
};
const LIMITS = {
  siteName: 120, logoUrl: 1000, slogan: 240, contactDetails: 500,
  copyright: 240, primaryColor: 7, secondaryColor: 7, defaultPostStatus: 20,
  commentModeration: 20, phone: 60, email: 254, address: 500,
};
const PUBLIC_KEYS = ['siteName', 'logoUrl', 'slogan', 'contactDetails', 'copyright', 'primaryColor', 'secondaryColor', 'phone', 'email', 'address'];
const ROW_ID = 'site';

function isSafeLogo(value) {
  if (value.startsWith('/') && !value.startsWith('//') && !value.includes('\\') && !/[\s\u0000-\u001f]/.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password &&
      /^[a-z0-9-]+\.public\.blob\.vercel-storage\.com$/i.test(url.hostname);
  } catch {
    return false;
  }
}

export function validateSettings(input, { strict = true } = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const result = {};
  for (const [key, value] of Object.entries(input)) {
    if (!Object.hasOwn(LIMITS, key)) {
      if (strict) return null;
      continue; // Ignore legacy secrets and unknown keys, never return them.
    }
    if (typeof value !== 'string' || value.length > LIMITS[key] || /[\u0000-\u001f\u007f]/.test(value)) {
      if (strict) return null;
      continue;
    }
    if ((key === 'siteName' && !value.trim()) ||
        (key === 'logoUrl' && !isSafeLogo(value)) ||
        (['primaryColor', 'secondaryColor'].includes(key) && !/^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(value)) ||
        (key === 'defaultPostStatus' && !['draft', 'published'].includes(value)) ||
        (key === 'commentModeration' && !['manual', 'automatic'].includes(value))) {
      if (strict) return null;
      continue;
    }
    result[key] = value;
  }
  return result;
}

async function readLegacyDefaults() {
  try {
    const file = path.resolve(process.cwd(), 'data/settings.json');
    return validateSettings(JSON.parse(await fs.readFile(file, 'utf8')), { strict: false }) || {};
  } catch {
    return {};
  }
}

export async function readSiteSettings() {
  const row = await prisma.siteSettings.findUnique({ where: { id: ROW_ID } });
  const saved = row ? validateSettings(row.data, { strict: false }) : await readLegacyDefaults();
  return { ...DEFAULT_SETTINGS, ...(saved || {}) };
}

export async function saveSiteSettings(settings) {
  const valid = validateSettings(settings);
  if (!valid) return false;
  const current = await readSiteSettings();
  const data = { ...current, ...valid };
  await prisma.siteSettings.upsert({
    where: { id: ROW_ID },
    create: { id: ROW_ID, data },
    update: { data },
  });
  return true;
}

export function publicSiteSettings(settings) {
  return Object.fromEntries(PUBLIC_KEYS.map((key) => [key, settings[key]]));
}
