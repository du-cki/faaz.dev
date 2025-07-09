import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://i.scdn.co/image/**"),
      new URL("https://lastfm.freetls.fastly.net/i/u/**"),
    ],
  },
};

export default nextConfig;
