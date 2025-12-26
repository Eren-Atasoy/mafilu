import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "*.bunnycdn.com",
      },
    ],
  },
};

export default nextConfig;
