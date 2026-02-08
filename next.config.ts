import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/sunhaksan',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
