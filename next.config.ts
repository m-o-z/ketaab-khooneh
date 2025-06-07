/** @type {import('next').NextConfig} */
import withPWA from "@ducanh2912/next-pwa";
import { NextConfig } from "next";

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
} as NextConfig;

export default withPWA({
  dest: "public",
  register: true,
})(nextConfig);
