import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
      allowedOrigins: [
        'wildlifewonderjewellery.com',
        'www.wildlifewonderjewellery.com',
        'wildlifewonderjewelry.com',
        'www.wildlifewonderjewelry.com'
      ]
    },
    proxyClientMaxBodySize: '50mb',
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.wildlifewonderjewellery.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
