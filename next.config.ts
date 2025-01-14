import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/Home',
        permanent: true, // Ustaw na true, jeśli przekierowanie ma być stałe (301)
      },
    ];
  },
};

export default nextConfig;
