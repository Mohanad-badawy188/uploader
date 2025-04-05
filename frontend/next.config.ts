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
      // {
      //   protocol: "https",
      //   hostname: "production", // 🔁 your production API hostname
      //   pathname: "/uploads/**",
      // },
    ],
  },
};

export default nextConfig;
