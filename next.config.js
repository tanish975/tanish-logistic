import { withBotId } from 'botid/next/config';

const isProduction = process.env.NODE_ENV === 'production';
// Next's Pages Router currently requires inline scripts/styles. This policy is
// defense in depth, not a substitute for output escaping or a nonce-based CSP.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProduction ? '' : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://images.pexels.com https://images.unsplash.com https://*.public.blob.vercel-storage.com",
  "media-src 'self' blob:",
  `connect-src 'self'${isProduction ? '' : ' ws: wss:'}`,
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isProduction ? ["frame-ancestors 'none'"] : []),
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Client instrumentation should run on Vercel, or when explicitly building
  // elsewhere for a Vercel deployment. Non-Vercel hosts use the local layers.
  env: {
    NEXT_PUBLIC_CONTACT_BOTID:
      process.env.VERCEL === '1' || process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_CONTACT_BOTID === '1'
        ? '1'
        : '0',
  },
  trailingSlash: true,
  poweredByHeader: false,
  async headers() {
    const headers = [
      { key: 'Content-Security-Policy', value: csp },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      ...(isProduction ? [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
      ] : []),
    ];
    return [
      { source: '/:path*', headers },
      { source: '/api/:path*', headers: [{ key: 'Cache-Control', value: 'private, no-store' }] },
      ...['/admin/:path*', '/settings/:path*', '/login/:path*'].map((source) => ({
        source,
        headers: [
          { key: 'Cache-Control', value: 'private, no-store' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      })),
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '**',
      },
    ],
  },
  allowedDevOrigins: ['http://10.217.21.3:3000', 'http://10.113.9.13:3000'],
  serverExternalPackages: ['@prisma/client', 'prisma'],
};

export default withBotId(nextConfig);
