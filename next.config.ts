import type { NextConfig } from "next";
import path from "path";

const pagesBasePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  ...(pagesBasePath
    ? { basePath: pagesBasePath, assetPrefix: pagesBasePath }
    : {}),
  images: {
    unoptimized: true,
  },
  // Avoid picking ~/package-lock.json when another lockfile exists up the tree
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
