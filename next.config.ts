import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
    ],
  },
  // Strip console.log/info/debug in production but keep console.error/warn
  // so genuine runtime errors are still surfaced.
  compiler: {
    removeConsole: { exclude: ['error', 'warn'] },
  },
};

export default nextConfig;
