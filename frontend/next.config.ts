import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "responsible-victory-production.up.railway.app",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
