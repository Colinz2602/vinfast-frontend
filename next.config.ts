import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      // Thêm pattern của CloudFront URL vào đây nếu bạn sử dụng S3 + CDN
    ],
  },
};

export default nextConfig;
