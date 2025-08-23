import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // CSS-Assets korrekt verarbeiten
  experimental: {
    optimizeCss: true,
  },
  // Asset-Pfade für statischen Export
  assetPrefix: process.env.NODE_ENV === "production" ? "" : "",
};

export default nextConfig;
