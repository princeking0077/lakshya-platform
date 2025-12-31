import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Static export for Hostinger compatibility
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
  distDir: '.next', // Build output directory
};

export default nextConfig;
