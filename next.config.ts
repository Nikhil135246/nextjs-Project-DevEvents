import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable cachecomponent
  cacheComponents:true,

  // Allow images from Cloudinary
  images:{
    remotePatterns:[
      {
        protocol:'https',
        hostname:'res.cloudinary.com',
      }
    ]
  },

  /* Allow me to config nextjs features here */
  reactCompiler:true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  // PostHog reverse proxy configuration
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
