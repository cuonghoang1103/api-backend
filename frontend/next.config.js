/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    // Bump this on every deploy to bust Next.js server action cache
    NEXT_PUBLIC_BUILD_ID: Date.now().toString(36),
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
    ],
  },
  async headers() {
    return [
      {
        // Disable SSR cache for the music page so it always renders fresh
        source: '/music',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
        ],
      },
      {
        // No-cache for Next.js static JS chunks to avoid stale server action errors
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      // Proxy uploaded files to the backend which has the uploads volume mounted
      // This is needed because Next.js standalone mode doesn't serve files outside public/
      {
        source: '/uploads/:path*',
        destination: 'http://backend:3001/uploads/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
