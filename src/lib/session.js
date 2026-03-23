import { withIronSessionApiRoute } from "iron-session";

const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD || "tanishlogisticsessionpassword2024secure32chars",
  cookieName: "tanish-logistic-session",
  cookieOptions: {
    secure: true, // Always use secure cookies in production
  },
};

export function withSessionRoute(handler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export default sessionOptions;