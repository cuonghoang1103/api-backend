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
    domains: ['images.unsplash.com', 'api.cuongthai.com', 'cuongthai.com', 'www.cuongthai.com', 'media.cuongthai.com'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'api.cuongthai.com' },
      { protocol: 'https', hostname: 'cuongthai.com' },
      { protocol: 'https', hostname: 'www.cuongthai.com' },
      // Cloudflare R2 custom domain — added when the project
      // migrated from local-disk uploads to R2 in mid-2026.
      // Without these entries, any Next.js `<Image>` (and the
      // CSP that wraps the same allowlist) refuses to load
      // post covers, avatars, and playlist thumbnails that
      // are now served from `media.cuongthai.com`.
      { protocol: 'https', hostname: 'media.cuongthai.com' },
      { protocol: 'https', hostname: 'e8105049f41b90209104afb5911d84b2.r2.cloudflarestorage.com' },
      // Cloudflare R2 public bucket URLs (e.g. pub-*.r2.dev) — used when
      // R2_PUBLIC_URL is configured to return the bucket's public URL instead
      // of the custom domain. CSP must allow these for images to render.
      { protocol: 'https', hostname: '*.r2.dev' },
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
      // ─── Global security headers ──────────────────────────────────
      // These run on every response served by the Next.js server
      // (both static and dynamic). The headers are also relevant
      // for nginx which already sets HSTS — but having them in
      // Next means they survive the next nginx config rewrite.
      //
      // - X-Content-Type-Options: nosniff — prevents MIME sniffing
      //   (avatars uploaded as `image/*` are served with the right
      //   Content-Type, but defense-in-depth).
      // - X-Frame-Options: SAMEORIGIN — anti-clickjacking. The site
      //   embeds its own content (CourseDetail, ProjectDetailDrawer)
      //   but never wants to be framed by a third party.
      // - Referrer-Policy: strict-origin-when-cross-origin — leaks
      //   only the origin (not the path) when navigating out.
      // - Permissions-Policy — disable APIs the site doesn't use
      //   (geolocation, camera, microphone, payment). Saves a
      //   permission-prompt surface and limits XSS impact.
      // - X-Powered-By: removed — don't tell attackers the runtime.
      // - Cross-Origin-*-Policy: tighten COOP/COEP to same-origin
      //   (we don't share a process with other sites) and cross-origin
      //   for resources (images, fonts can be embedded anywhere).
      // - Content-Security-Policy: see below.
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), camera=(), microphone=(), payment=(), usb=()' },
          // Hide the framework fingerprint. The `x-nextjs-*` headers
          // are still emitted by Next for routing cache; this only
          // removes the `X-Powered-By: Next.js` line.
          { key: 'X-Powered-By', value: '' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
          {
            key: 'Content-Security-Policy',
            // Directives:
            // - default-src 'self': only same-origin by default.
            // - script-src 'self' 'unsafe-inline' 'unsafe-eval': Next.js
            //   inlines hydration data and uses eval in dev. In prod the
            //   build hashes all scripts, but a nonce-based policy would
            //   be a larger refactor. 'unsafe-inline' on the script side
            //   is a known Next.js tradeoff; we mitigate by allowing only
            //   the Sentry tunnel + Turnstile explicitly.
            // - style-src 'self' 'unsafe-inline': Tailwind injects
            //   inline styles; next/font inlines @font-face.
            // - img-src: self + data: (avatars, inline SVG) + the
            //   image hosts we actually use (Unsplash, our API).
            // - connect-src: API + Sentry + WebSocket. WSS needed for
            //   Sentry realtime.
            // - frame-src: YouTube embed + Turnstile iframe.
            // - media-src: self + API for music tracks.
            // - font-src: self + data: for next/font.
            // - object-src 'none': block <object>/<embed>.
            // - base-uri 'self': no <base> tag hijacking.
            // - form-action 'self': no third-party form posts.
            // - frame-ancestors 'self': same as X-Frame-Options.
            // - upgrade-insecure-requests: rewrite any leftover http://
            //   to https://.
            value: [
              "default-src 'self'",
              // YouTube domains added to script-src (iframe_api), img-src
              // (video thumbnails, channel avatars), and frame-src (the
              // player itself). All three are needed for the /music
              // search → YouTube IFrame Player flow. Without these the
              // search results show no thumbnails and the player never
              // loads its API script.
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://www.youtube.com",
              "style-src 'self' 'unsafe-inline'",
              // `media.cuongthai.com` (the R2 custom domain) was
              // added when the project migrated to Cloudflare R2 in
              // mid-2026. All new post images, avatars, playlist
              // covers, and music artwork come from this host.
              // Without it, browsers silently refuse to load the
              // images and the audio element refuses to start
              // playback, even though the network fetch itself
              // returns HTTP 200. The R2 S3 endpoint is kept as a
              // fallback for any leftover direct-to-bucket links.
              "img-src 'self' data: blob: https://api.cuongthai.com https://media.cuongthai.com https://images.unsplash.com https://api.dicebear.com https://*.amazonaws.com https://e8105049f41b90209104afb5911d84b2.r2.cloudflarestorage.com https://*.r2.dev https://i.ytimg.com https://yt3.ggpht.com https://i9.ytimg.com",
              "font-src 'self' data:",
              "connect-src 'self' https://api.cuongthai.com https://media.cuongthai.com https://e8105049f41b90209104afb5911d84b2.r2.cloudflarestorage.com https://*.r2.dev https://*.sentry.io wss://*.sentry.io https://www.youtube.com",
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://challenges.cloudflare.com",
              // `media-src` controls <audio>/<video> elements and
              // the Web Audio API. R2 music tracks are streamed
              // directly from the CDN (no backend hop), so the
              // domain must be allowed here.
              "media-src 'self' https://api.cuongthai.com https://media.cuongthai.com blob:",
              "worker-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
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
