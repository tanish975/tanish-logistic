import { getIronSession } from 'iron-session';
import { withRateLimit } from '@/lib/rate-limit';
import sessionOptions, { rejectCrossOrigin } from '@/lib/session';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { verifyPublicSubmission } from '@/lib/bot-protection';

export const config = { api: { bodyParser: { sizeLimit: '8kb' } } };
// A valid bcrypt hash used only to avoid an obvious timing difference for an
// unknown account. It is not a credential for any user.
const DUMMY_HASH = '$2b$10$C6UzMDM.H6dfI/f/IKcEe.4fB3UWFcP5vkMdJc.3V4Qx9vOnFqhJa';

const login = withRateLimit(async function loginRoute(req, res) {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string' ||
      email.length > 254 || !email.trim() || !password || Buffer.byteLength(password, 'utf8') > 72 ||
      /[\u0000-\u001f\u007f]/.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email and password.' });
  }

  const verification = await verifyPublicSubmission(req);
  if (!verification.allowed) {
    return res.status(verification.status).json({ message: 'Unable to verify sign-in. Please try again.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: email.trim() } });
    const isValid = await bcrypt.compare(password, user?.password || DUMMY_HASH);
    if (!user || !isValid || !(user.updatedAt instanceof Date) || !Number.isSafeInteger(user.sessionVersion)) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const session = await getIronSession(req, res, sessionOptions);
    const publicUser = { id: user.id, email: user.email, name: user.name, role: user.role };
    session.user = { ...publicUser, sessionVersion: user.sessionVersion, accountUpdatedAt: user.updatedAt.toISOString() };
    await session.save();
    return res.status(200).json({ user: publicUser, message: 'Login successful' });
  } catch {
    return res.status(500).json({ message: 'Internal server error.' });
  }
}, { limit: 5, windowMs: 60_000, name: 'login' });

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }
  if (rejectCrossOrigin(req, res)) return;
  return login(req, res);
}
