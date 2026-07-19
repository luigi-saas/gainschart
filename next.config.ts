import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "v2.exercisedb.io" },
      { protocol: "https", hostname: "static.exercisedb.dev" },
      { protocol: "https", hostname: "assets.exercisedb.dev" },
    ],
  },
};

export default nextConfig;
