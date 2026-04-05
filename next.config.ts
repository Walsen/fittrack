import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { dev }) => {
    if (!dev) {
      if (!config.optimization) {
        config.optimization = {};
      }
      config.optimization.minimize = false;
      config.optimization.minimizer = [];
    }
    return config;
  },
};

export default nextConfig;
