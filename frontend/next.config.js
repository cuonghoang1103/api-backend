// @ts-check
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  env: {
    // Bump this on every deploy to bust Next.js server action cache
    NEXT_PUBLIC_BUILD_ID: Date.now().toString(36),
  },
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'api.cuongthai.com', 'cuongthai.com', 'www.cuongthai.com'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'api.cuongthai.com' },
      { protocol: 'https', hostname: 'cuongthai.com' },
      { protocol: 'https', hostname: 'www.cuongthai.com' },
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

// Wrap the Next config with Sentry. The plugin instruments the
// build so that errors in the browser, server, and edge runtimes
// are all reported. When SENTRY_DSN is empty, the plugin is a
// no-op (we still call the wrapper to keep the build pipeline
// uniform — there's no runtime overhead without a DSN).
module.exports = withSentryConfig(nextConfig, {
  // Suppress ALL plugin output (build-time). We only see runtime
  // errors via the global error boundary. The plugin warns a lot
  // about source map upload / organization slug — those are
  // expected when SENTRY_AUTH_TOKEN is not set, and not errors.
  silent: true,
  // Hide source maps from the public build. The Sentry project
  // gets the source maps uploaded separately for stack-trace
  // symbolication, but end users shouldn't be able to download
  // them and read our source.
  hideSourceMaps: true,
  // Tree-shake unused Sentry SDK code out of the bundle. This
  // is webpack-only — Turbopack doesn't support these options.
  webpack: {
    treeshake: {
      removeDebugLogging: true,
      excludeReplayIframe: false,
      excludeReplayShadowDOM: false,
      excludeReplayCompressionWorker: false,
    },
  },
  // Upload a wider set of client source files. By default the
  // Sentry webpack plugin only uploads the entry files; with
  // this flag, deeper source maps are uploaded so stack traces
  // from any component are readable. Costs a few extra KB at
  // build time, no runtime cost.
  widenClientFileUpload: true,
  // Tunnel route: events go to /monitoring on our domain first,
  // which forwards to Sentry. Bypasses ad-blockers that block
  // sentry.io (a common reason Sentry "doesn't work" for users
  // on corporate networks or with privacy extensions).
  tunnelRoute: '/monitoring',
  // org/project slugs — used to upload source maps. The skill
  // recommends setting them as env vars in CI; we read them
  // here as build-time args. When these are missing the plugin
  // simply skips source map upload (no error).
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Auth token for source map upload. Create one at
  // https://sentry.io/settings/auth-tokens/ with the
  // `project:releases` + `org:read` scopes. Omit in development.
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Skip source map upload when no auth token is configured.
  // Avoids the "No Sentry organization slug" warning during
  // local builds. CI/prod sets SENTRY_AUTH_TOKEN to enable.
  dryRun: !process.env.SENTRY_AUTH_TOKEN,
});
