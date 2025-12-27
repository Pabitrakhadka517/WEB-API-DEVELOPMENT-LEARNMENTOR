import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        // This allows any path under the unsplash domain
        pathname: '/**', 
      },
    ],
  },
};

export default nextConfig;