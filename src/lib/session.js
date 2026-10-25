import { getIronSession } from "iron-session";

const sessionPassword = process.env.SECRET_COOKIE_PASSWORD;
if (!sessionPassword || sessionPassword.length < 32) {
  throw new Error(
    'SECRET_COOKIE_PASSWORD is missing or shorter than 32 characters. ' +
    'Set it in .env before starting the server.'
  );
}

const sessionOptions = {
  password: sessionPassword,
  cookieName: "tanish-logistic-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
  },
};

export function withSessionRoute(handler) {
  return async function sessionWrappedHandler(req, res) {
    try {
      req.session = await getIronSession(req, res, sessionOptions);
      return handler(req, res);
    } catch (_error) {
      return res.status(500).json({ message: 'Internal server error processing session.' });
    }
  };
}

export function withAdminRoute(handler) {
  return async function adminProtectedHandler(req, res) {
    try {
      req.session = await getIronSession(req, res, sessionOptions);
      const user = req.session?.user;
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized. Authentication required.' });
      }
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden. Admin access required.' });
      }
      return handler(req, res);
    } catch (_error) {
      return res.status(500).json({ message: 'Internal server error processing session.' });
    }
  };
}

export default sessionOptions;