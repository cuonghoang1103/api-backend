import type { MetadataRoute } from 'next'

/**
 * robots.txt — tells crawlers what to index and where the sitemap is.
 *
 * Disallow /admin/* and /api/* by default. We let crawlers in on
 * everything else so that the homepage, courses, blog, music, and
 * shop all show up in search results. Crawlers are rate-limited at
 * the nginx layer if they misbehave.
 *
 * Note: This file is part of Next.js's MetadataRoute convention. The
 * framework compiles it to /robots.txt at build time. We do NOT
 * serve a static file from /public — the route takes precedence
 * and lets us parameterise the host from metadataBase.
 *
 * Sitemap URL is anchored to the production host explicitly. The
 * metadataBase in layout.tsx also points at this domain, but
 * search engines parse robots.txt before they fetch the layout, so
 * the literal URL here is the safer bet.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = 'https://cuongthai.com'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',         // admin dashboard
          '/api/',           // internal API
          '/dashboard',      // user-only dashboard
          '/profile',        // user-only profile
          '/my-courses',     // user-only
          '/my-orders',      // user-only
          '/messages',       // private messaging
          '/cart',           // session-bound cart
          '/checkout',       // checkout flow
          '/payment/',       // payment callbacks
          '/oauth-callback', // OAuth flow
          '/auth/',          // auth flows
          '/login',          // login form
          '/register',       // register form
          '/forgot-password',
          '/reset-password',
          '/verify-',
          '/offline',        // PWA offline page
        ],
      },
      {
        // Googlebot: same as above, but also explicitly allowed on
        // /shop because products need rich snippets.
        userAgent: 'Googlebot',
        allow: ['/', '/shop/'],
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
