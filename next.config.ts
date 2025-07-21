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
        "fs",
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
  disable: false, // ❗️ Important: forces SW registration even in dev
  register: true,
  cacheOnFrontEndNav: true,
  cacheStartUrl: true,
  workboxOptions: {
    swDest: "sw.js",
    additionalManifestEntries: [
      {
        url: "/sw-version",
        revision: Date.now().toString(),
      },
    ],
    runtimeCaching: [
      {
        urlPattern: ({ url: { pathname } }) => {
          if (pathname.startsWith("/api/")) {
            return true;
          }

          return false;
        },
        handler: "NetworkOnly", // Always go to network, never cache
        method: "GET",
        options: {
          cacheName: "apis", // You can keep or remove, but no caching will happen with NetworkOnly
          // Remove cacheableResponse and expiration to disable caching completely
        },
      },
      {
        // 🔸 Static assets: fonts, images, scripts, styles, json
        urlPattern: /\.(?:ttf|woff2?|json|png|jpe?g|webp|gif|css|js)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "static-assets",
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
    ],
  },
})(nextConfig);
