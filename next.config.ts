import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
  experimental: {
    outputFileTracingExcludes: {
      "*": [
        "node_modules/@swc/**",
        "node_modules/@esbuild/**",
        "node_modules/webpack/**",
        "node_modules/rollup/**",
      ],
    },
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
