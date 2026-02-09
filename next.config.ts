import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "img.youtube.com" },
      { hostname: "*.tiktokcdn.com" },
      { hostname: "*.cdninstagram.com" },
    ],
  },
};

export default nextConfig;
