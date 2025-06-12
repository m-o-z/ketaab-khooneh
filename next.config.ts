/** @type {import('next').NextConfig} */
import withPWA from "@ducanh2912/next-pwa";
import { NextConfig } from "next";

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    APP_ENV: process.env.APP_ENV,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals.concat([
        "dns",
        "net",
        "tls",
        "string_decoder",
        "stream",
        "crypto",
      ]);
    }

    return config;
  },
} as NextConfig;

export default withPWA({
  dest: "public",
  register: true,
  cacheOnFrontEndNav: true,
  cacheStartUrl: true,
})(nextConfig);
