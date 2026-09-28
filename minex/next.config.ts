import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
};

export default nextConfig;
