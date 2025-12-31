import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // DISABLED for Custom Server Mode
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: true, // Crucial for Hostinger folder structure
};

export default nextConfig;
