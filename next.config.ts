import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "replicate.delivery" },
      { hostname: "pbxt.replicate.delivery" },
      { hostname: "tjzk.replicate.delivery" },
      { hostname: "xezq.replicate.delivery" },
    ],
  },
};

export default nextConfig;
