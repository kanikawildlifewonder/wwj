import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dslwgbtaxwyotsyjqwhd.supabase.co',
      },
    ],
  },
};

export default nextConfig;
