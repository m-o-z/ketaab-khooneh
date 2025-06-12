/** @type {import('next').NextConfig} */
import withPWA from "@ducanh2912/next-pwa";
import { isServer } from "@tanstack/react-query";
import { NextConfig } from "next";

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
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
