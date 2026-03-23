/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
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

export default nextConfig;
