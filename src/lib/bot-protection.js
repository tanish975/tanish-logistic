import { checkBotId } from 'botid/server';

export function isVercelRequest() {
  return process.env.VERCEL === '1' || Boolean(process.env.VERCEL_ENV) ||
    typeof globalThis[Symbol.for('@vercel/request-context')]?.get === 'function';
}

// Fail closed on Vercel if the verification service cannot produce a verdict.
// The in-memory limiter still applies on every host; it is not a global limit.
export async function verifyPublicSubmission(req) {
  if (!isVercelRequest()) return { allowed: true };
  try {
    const verdict = await checkBotId({
      advancedOptions: { checkLevel: 'basic', headers: req.headers },
    });
    if (!verdict || typeof verdict.isBot !== 'boolean') throw new Error('Invalid bot verification result');
    if (verdict.isBot || verdict.isVerifiedBot) return { allowed: false, status: 403 };
    // A WAF bypass is not a verified human. Local development intentionally
    // bypasses BotID, but deployed production/preview builds must not.
    if (process.env.NODE_ENV === 'production' && (verdict.bypassed !== false || verdict.isHuman !== true)) {
      throw new Error('Bot verification was bypassed or incomplete');
    }
    return { allowed: true };
  } catch {
    return { allowed: false, status: 503 };
  }
}
