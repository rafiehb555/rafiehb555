/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  env: {
    APP_NAME: 'EHB Technologies',
    APP_VERSION: '1.0.0',
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  webpack: config => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    
    // Performance optimizations for webpack
    config.optimization = {
      ...config.optimization,
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // Get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              // Create a hash name for better long-term caching
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      },
    };
    
    return config;
  },
  // Ultra-fast mode optimizations
  poweredByHeader: false,           // Remove X-Powered-By header for security and performance
  compress: true,                   // Enable gzip compression for faster responses
  productionBrowserSourceMaps: false, // Disable source maps in production for faster builds
  optimizeFonts: true,              // Optimize font loading
  swcMinify: true,                  // Use SWC for minification (faster than Terser)
  compiler: {
    // Compiler optimizations
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  experimental: {
    // Experimental features for better performance
    optimizeCss: true,              // Optimize CSS for faster loading
    scrollRestoration: true,        // Better scroll handling for performance
    optimisticClientCache: true,    // More aggressive client-side caching
  },
};

module.exports = nextConfig;
