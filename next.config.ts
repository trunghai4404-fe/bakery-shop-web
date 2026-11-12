import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['10.10.119.11'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'thuhuongcake.vn',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'pub-91866f49c7d64b69abc96d1f831523dd.r2.dev',
        pathname: '/**'
      }

    ],
  },
};

export default withNextIntl(nextConfig);
