import type { MetadataRoute } from 'next'

/**
 * sitemap.xml — auto-generated at build time + ISR'd by Next.
 *
 * Strategy:
 * - Static pages (homepage, courses list, etc.) are hard-coded.
 *   These don't change often and don't depend on data.
 * - Dynamic URLs (individual course, blog post, music track, shop
 *   product) are pulled from the public API at build time. We
 *   fail-open: if the API is down, we still serve the sitemap with
 *   just the static URLs. Sitemap generation never throws.
 *
 * The Next.js MetadataRoute.Sitemap type is the same shape as
 * Google's sitemap protocol (loc, lastModified, changeFrequency,
 * priority, plus optional images). We don't need to escape & to
 * &amp; — Next.js does that for us when it serialises to XML.
 *
 * `revalidate = 3600` re-runs the data fetch every hour without
 * a full rebuild. Combined with Next's static caching, this means
 * a fresh sitemap within an hour of a new course / post going live.
 */

const SITE_URL = 'https://cuongthai.com'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cuongthai.com'

// How often the sitemap re-generates (seconds). 1h balances freshness
// with the API's rate limits.
export const revalidate = 3600

type ListResp<T> = {
  success: boolean
  data: T[]
  pagination?: { total: number; page: number; limit: number }
}

async function safeFetch<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      // sitemap runs on the server (build + revalidate), so we
      // don't need cookies. cache: 'no-store' here would defeat
      // ISR; rely on Next's revalidate + the default fetch cache.
      headers: { 'User-Agent': 'cuongthai-sitemap/1.0' },
      signal: AbortSignal.timeout(8000), // 8s ceiling
    })
    if (!res.ok) return []
    const json = (await res.json()) as ListResp<T>
    return Array.isArray(json.data) ? json.data : []
  } catch (err) {
    // Fail open — log to server console, return empty list, sitemap
    // still serves the static pages.
    console.warn(`[sitemap] failed to fetch ${path}:`, (err as Error).message)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // ── Static pages ──────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/courses`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/academy`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/music`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/repos`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/dev-hub`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/games`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/social`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
  ]

  // ── Dynamic: courses ──────────────────────────────────────
  type CourseItem = { id: number | string; slug?: string; updatedAt?: string; createdAt?: string; thumbnailUrl?: string }
  const courses = await safeFetch<CourseItem>('/courses?limit=100')
  const courseUrls: MetadataRoute.Sitemap = courses
    .filter((c) => c.slug)
    .map((c) => ({
      url: `${SITE_URL}/courses/${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : c.createdAt ? new Date(c.createdAt) : now,
      changeFrequency: 'weekly',
      priority: 0.8,
      images: c.thumbnailUrl ? [c.thumbnailUrl] : undefined,
    }))

  // ── Dynamic: blog posts ───────────────────────────────────
  type BlogItem = { id: number | string; slug?: string; updatedAt?: string; publishedAt?: string; createdAt?: string; thumbnailUrl?: string }
  const posts = await safeFetch<BlogItem>('/blog/posts?limit=100')
  const blogUrls: MetadataRoute.Sitemap = posts
    .filter((p) => p.slug && p.slug.length > 0)
    .map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.publishedAt
        ? new Date(p.publishedAt)
        : p.updatedAt
        ? new Date(p.updatedAt)
        : p.createdAt
        ? new Date(p.createdAt)
        : now,
      changeFrequency: 'monthly',
      priority: 0.7,
      images: p.thumbnailUrl ? [p.thumbnailUrl] : undefined,
    }))

  // ── Dynamic: shop products ────────────────────────────────
  type ShopItem = { id: number | string; slug?: string; updatedAt?: string; createdAt?: string; thumbnailUrl?: string }
  const products = await safeFetch<ShopItem>('/shop/products?limit=100')
  const shopUrls: MetadataRoute.Sitemap = products
    .filter((s) => s.slug)
    .map((s) => ({
      url: `${SITE_URL}/shop/${s.slug}`,
      lastModified: s.updatedAt ? new Date(s.updatedAt) : s.createdAt ? new Date(s.createdAt) : now,
      changeFrequency: 'weekly',
      priority: 0.8,
      images: s.thumbnailUrl ? [s.thumbnailUrl] : undefined,
    }))

  // ── Dynamic: music tracks (no per-track page; link to /music) ──
  // The music player is on /music itself. Individual tracks don't
  // have a dedicated URL — they're played in-place. Skip the
  // per-track URLs to avoid linking to /music/:id which would 404.

  return [...staticPages, ...courseUrls, ...blogUrls, ...shopUrls]
}
