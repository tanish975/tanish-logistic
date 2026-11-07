import { getIronSession } from 'iron-session';
import sessionOptions, { rejectCrossOrigin } from '@/lib/session';
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }
  if (rejectCrossOrigin(req, res)) return;

  try {
    const session = await getIronSession(req, res, sessionOptions);
    const { id, sessionVersion, accountUpdatedAt } = session.user || {};
    // Compare-and-increment prevents a replayed cookie from revoking a newer
    // session. A logout intentionally revokes all sessions for the account.
    if (typeof id === 'string' && Number.isSafeInteger(sessionVersion) && typeof accountUpdatedAt === 'string') {
      const versionDate = new Date(accountUpdatedAt);
      if (!Number.isNaN(versionDate.getTime()) && versionDate.toISOString() === accountUpdatedAt) {
        try {
          await prisma.user.updateMany({
            where: { id, sessionVersion, updatedAt: versionDate },
            data: { sessionVersion: { increment: 1 } },
          });
        } catch {
          session.destroy();
          return res.status(503).json({ message: 'Signed out locally, but session revocation is temporarily unavailable.', localSessionCleared: true });
        }
      }
    }
    session.destroy();
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch {
    return res.status(500).json({ message: 'Unable to sign out.' });
  }
}
