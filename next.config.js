/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["192.168.68.111", "localhost:3000"],
};

module.exports = nextConfig;
