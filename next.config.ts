import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    outputFileTracingExcludes: {
      "*": [
        "node_modules/aws-cdk-lib/**",
        "node_modules/aws-cdk/**",
        "node_modules/@aws-amplify/data-construct/**",
        "node_modules/@aws-amplify/graphql-api-construct/**",
        "node_modules/constructs/**",
        "node_modules/esbuild/**",
        "node_modules/typescript/**",
      ],
    },
  } as Record<string, unknown>,
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
