import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Allow me to config nextjs features here */
  reactCompiler:true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  }
};

export default nextConfig;
