import { getIronSession } from 'iron-session';
import prisma from '@/lib/prisma';

const sessionPassword = process.env.SECRET_COOKIE_PASSWORD;
if (!sessionPassword || sessionPassword.length < 32) {
  throw new Error('SECRET_COOKIE_PASSWORD must be set to a unique secret of at least 32 characters.');
}

const SESSION_SECONDS = 8 * 60 * 60;
const sessionOptions = {
  password: sessionPassword,
  cookieName: 'tanish-logistic-session',
  // Set the sealed token lifetime as well as the browser cookie lifetime.
  ttl: SESSION_SECONDS,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_SECONDS,
  },
};

// Browsers send Origin on same-origin fetch POST/PUT/DELETE requests. Requiring
// it (rather than accepting an absent or "null" Origin) also protects against
// cross-site form posts from related subdomains. Non-browser admin clients must
// send the actual site origin explicitly.
export function hasSameOrigin(req) {
  const origin = req.headers?.origin;
  const host = req.headers?.host;
  if (typeof origin !== 'string' || typeof host !== 'string' || !origin || !host) return false;
  try {
    const parsed = new URL(origin);
    const permittedProtocol = parsed.protocol === 'https:' ||
      (process.env.NODE_ENV !== 'production' && parsed.protocol === 'http:');
    return permittedProtocol && parsed.origin === origin &&
      parsed.host.toLowerCase() === host.toLowerCase();
  } catch {
    return false;
  }
}

export function rejectCrossOrigin(req, res) {
  if (hasSameOrigin(req)) return false;
  res.status(403).json({ message: 'Forbidden. A same-origin request is required.' });
  return true;
}

// The cookie is encrypted and signed, but its contents can outlive a database
// change. Validate every authenticated request against the current account.
// A monotonic database version invalidates sessions on logout. updatedAt also
// invalidates them on normal Prisma account edits, including password changes.
export async function getValidatedSession(req, res) {
  const session = await getIronSession(req, res, sessionOptions);
  const stored = session.user;
  if (!stored || typeof stored.id !== 'string' || !Number.isSafeInteger(stored.sessionVersion) ||
      typeof stored.accountUpdatedAt !== 'string') {
    return { session, user: null };
  }

  const account = await prisma.user.findUnique({
    where: { id: stored.id },
    select: { id: true, email: true, name: true, role: true, updatedAt: true, sessionVersion: true },
  });
  if (!account || !(account.updatedAt instanceof Date) ||
      account.updatedAt.toISOString() !== stored.accountUpdatedAt ||
      account.sessionVersion !== stored.sessionVersion) {
    return { session, user: null };
  }
  return {
    session,
    user: { id: account.id, email: account.email, name: account.name, role: account.role },
  };
}

export function withSessionRoute(handler) {
  return async function sessionWrappedHandler(req, res) {
    res.setHeader('Cache-Control', 'private, no-store');
    try {
      const { session, user } = await getValidatedSession(req, res);
      req.session = session;
      req.currentUser = user;
      return await handler(req, res);
    } catch {
      return res.status(500).json({ message: 'Internal server error processing session.' });
    }
  };
}

export function withAdminRoute(handler) {
  return async function adminProtectedHandler(req, res) {
    res.setHeader('Cache-Control', 'private, no-store');
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && rejectCrossOrigin(req, res)) return;
    try {
      const { session, user } = await getValidatedSession(req, res);
      if (!user) return res.status(401).json({ message: 'Unauthorized. Authentication required.' });
      if (user.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden. Admin access required.' });
      req.session = session;
      req.currentUser = user;
      return await handler(req, res);
    } catch {
      return res.status(500).json({ message: 'Internal server error processing session.' });
    }
  };
}

export default sessionOptions;
