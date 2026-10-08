import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Add your CMS / CDN host here when media moves off /public (e.g. Sanity: cdn.sanity.io)
    remotePatterns: [],
  },
};

export default nextConfig;
