import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  assetPrefix: "",
  basePath: "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
