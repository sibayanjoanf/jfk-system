import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, 
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jfkbuilderstorage.blob.core.windows.net',
        port: '',
        pathname: '/**', 
      },
    ],
  },
};

export default nextConfig;