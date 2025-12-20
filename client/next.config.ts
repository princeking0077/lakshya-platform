import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standard config for Vercel / Node.js
  images: {
     // Default is fine for Vercel
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, 
  }
};

export default nextConfig;
