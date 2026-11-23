import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: { qualities: [75, 90] },
  // resume.pdf (plain-text links) always downloads; resume-view.pdf (icons) opens in the browser.
  async headers() {
    return [
      {
        source: "/resume.pdf",
        headers: [{ key: "Content-Disposition", value: 'attachment; filename="Anjali_Gupta_Resume.pdf"' }],
      },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
