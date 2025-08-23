import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CSS-Assets korrekt verarbeiten
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
