import type { NextConfig } from "next";

const locale = process.env.NEXT_PUBLIC_LOCALE || "en";

const nextConfig: NextConfig = {
  // Run one build directory per locale so dev servers for en/es/ar (ports
  // 3000/3001/3002) can run concurrently without fighting over the same `.next`
  // folder / "Another next dev server is already running" lock. Only apply the
  // locale suffix in local dev; production/Vercel builds always use `.next`.
  distDir: process.env.NODE_ENV === "production"
    ? ".next"
    : locale === "en" ? ".next" : `.next-${locale}`,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "pixabay.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
