/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Critical for Netlify static deployment
  trailingSlash: true, // Better Netlify compatibility
  images: {
    unoptimized: true, // Required for static exports
  },
  experimental: {
    appDir: true,
  },
  // Disable TypeScript errors during build
  typescript: {
    ignoreBuildErrors: false,
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig