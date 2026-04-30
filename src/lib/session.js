import { withIronSessionApiRoute } from "iron-session";

const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD || "tanishlogisticsessionpassword2024secure32chars",
  cookieName: "tanish-logistic-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
  },
};

export function withSessionRoute(handler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export default sessionOptions;