/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 1. Build ke waqt ESLint errors ko ignore karne ke liye
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // 2. Build ke waqt TypeScript type-checking errors ko ignore karne ke liye
  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/:path*`,
      },
    ]
  },
}

module.exports = nextConfig