import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // ปิดการตรวจสอบ ESLint เมื่อ build
  },
};

export default nextConfig;
