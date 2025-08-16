import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // output: 'export', // Temporarily disabled to fix dynamic routes
  images: {
    unoptimized: true,
  },
}

export default nextConfig
