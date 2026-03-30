import type { NextConfig } from "next";

// ──────────────────────────────────────────────
// GitHub Pages configuration
// ──────────────────────────────────────────────
// If deploying to https://<username>.github.io/<repo>/ ,
// set basePath to "/<repo>" (e.g., "/calculators").
// For a user/org page (https://<username>.github.io/),
// leave basePath as "".
// ──────────────────────────────────────────────
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Remove trailing slash so that /repo and /repo/ both work
  trailingSlash: false,
};

export default nextConfig;
