import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-aspect-ratio',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-context-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-hover-card',
      '@radix-ui/react-label',
      '@radix-ui/react-menubar',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group',
      '@radix-ui/react-tooltip',
      'framer-motion',
      'motion',
      '@nivo/bar',
      '@nivo/core',
      '@nivo/line',
      '@nivo/pie'
    ],
    // Enable Server Actions for better performance
    serverActions: true,
    // Optimize CSS imports
    optimizeCss: true,
    // Enable turbo for faster development
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    }
  },

  // Comprehensive image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    // Advanced image optimization settings
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    // Enable responsive images by default
    unoptimized: false,
    // Quality optimization
    quality: 85,
    // Enable placeholder blur for better UX
    placeholder: 'blur',
    // Enable faster image loading
    priority: false,
  },

  // Compiler optimizations
  compiler: {
    // Remove console.logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
    // Enable React optimizations
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // Bundle optimization
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        // Enable aggressive splitting for better caching
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
            },
            common: {
              name: 'common',
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
            // Separate chunk for UI components
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
              name: 'ui-components',
              priority: 20,
              reuseExistingChunk: true,
            },
            // Separate chunk for charts
            charts: {
              test: /[\\/]node_modules[\\/](@nivo|recharts)[\\/]/,
              name: 'charts',
              priority: 15,
              reuseExistingChunk: true,
            },
            // Separate chunk for animations
            animations: {
              test: /[\\/]node_modules[\\/](framer-motion|motion|@tsparticles)[\\/]/,
              name: 'animations',
              priority: 12,
              reuseExistingChunk: true,
            }
          },
        },
        // Enable module concatenation
        concatenateModules: true,
        // Minimize bundle size
        minimize: true,
      }

      // Enable tree shaking for better bundle optimization
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
    }

    // Optimize SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
                'removeDimensions',
              ],
            },
          },
        },
      ],
    })

    // Client-side bundle optimizations
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    return config
  },

  // Enable compression
  compress: true,

  // Output optimization
  output: 'standalone',

  // Enable static optimization
  trailingSlash: false,

  // Optimize headers for better caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=60',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Enable redirects optimization
  async redirects() {
    return []
  },

  // Optimize rewrites
  async rewrites() {
    return []
  },

  // Production-only optimizations
  ...(process.env.NODE_ENV === 'production' && {
    // Disable source maps in production for smaller bundles
    productionBrowserSourceMaps: false,
    // Enable build optimizations
    swcMinify: true,
  }),
}


export default nextConfig
