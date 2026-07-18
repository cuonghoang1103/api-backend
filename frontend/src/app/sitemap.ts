import type { MetadataRoute } from 'next'
import { getServerApiBaseUrl } from '@/lib/server-api'
import { SHOP_ENABLED } from '@/lib/featureFlags'

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

// Render on-demand at RUNTIME (never build-time prerendered) so the dynamic
// URLs are always fetched against the INTERNAL backend, which is reachable at
// runtime but NOT during `npm run build`. This guarantees the sitemap always
// carries the full URL set (never a static-only subset). The fetches below run
// in parallel with a tight 3s timeout, so the live render stays fast (≤3s
// worst-case) — which is what avoids Google Search Console's fetch timeout.
export const dynamic = 'force-dynamic'

type ListResp<T> = {
  success: boolean
  data: T[]
  pagination?: { total: number; page: number; limit: number }
}

async function safeFetch<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(`${getServerApiBaseUrl()}/api/v1${path}`, {
      // sitemap runs on the server, hitting the internal backend directly.
      headers: { 'User-Agent': 'cuongthai-sitemap/1.0' },
      cache: 'no-store',
      signal: AbortSignal.timeout(3000), // 3s ceiling per fetch (was 8s)
    })
    if (!res.ok) return []
    const json = (await res.json()) as ListResp<T>
    return Array.isArray(json.data) ? json.data : []
  } catch (err) {
    // Fail open — log to server console, return empty list, sitemap
    // still serves the static pages. NEVER throws → the route never 500s.
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
    // /shop only listed while the shop is enabled (lib/featureFlags.ts)
    ...(SHOP_ENABLED ? [{ url: `${SITE_URL}/shop`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.9 }] : []),
    { url: `${SITE_URL}/music`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/repos`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/games`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/language`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/tech-trends`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${SITE_URL}/voice`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${SITE_URL}/forum`, lastModified: now, changeFrequency: 'daily', priority: 0.5 },
    // (`/social` removed — that route 404s; the public feed lives at `/`.)
  ]

  // ── Dynamic URLs — fetched in PARALLEL (Promise.all) so the total wait is
  // the slowest single call (≤3s), not the sum of all four. Each safeFetch is
  // fail-open (returns [] on error/timeout), so one slow or down API never
  // fails the sitemap — it still renders the static routes plus whatever data
  // came back. The route never throws / never 500s.
  type CourseItem = { id: number | string; slug?: string; updatedAt?: string; createdAt?: string; thumbnailUrl?: string }
  type BlogItem = { id: number | string; slug?: string; updatedAt?: string; publishedAt?: string; createdAt?: string; thumbnailUrl?: string }
  type ShopItem = { id: number | string; slug?: string; updatedAt?: string; createdAt?: string; thumbnailUrl?: string }
  type ProjectItem = { id: number | string; slug?: string; updatedAt?: string; createdAt?: string; thumbnailUrl?: string; thumbnail?: string }
  type TechTrendItem = { id: number | string; slug?: string; updatedAt?: string; publishedAt?: string; createdAt?: string; coverImageUrl?: string }
  type GameItem = { id: number | string; slug?: string; status?: string; updatedAt?: string; createdAt?: string; coverImage?: string }

  const [courses, posts, products, projects, techTrends, games] = await Promise.all([
    safeFetch<CourseItem>('/courses?limit=100'),
    safeFetch<BlogItem>('/blog/posts?limit=100'),
    safeFetch<ShopItem>('/shop/products?limit=100'),
    safeFetch<ProjectItem>('/projects?limit=100'),
    safeFetch<TechTrendItem>('/tech-trends/articles?size=100'),
    safeFetch<GameItem>('/games'),
  ])

  const courseUrls: MetadataRoute.Sitemap = courses
    .filter((c) => c.slug)
    .map((c) => ({
      url: `${SITE_URL}/courses/${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : c.createdAt ? new Date(c.createdAt) : now,
      changeFrequency: 'weekly',
      priority: 0.8,
      images: c.thumbnailUrl ? [c.thumbnailUrl] : undefined,
    }))

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

  const shopUrls: MetadataRoute.Sitemap = (SHOP_ENABLED ? products : [])
    .filter((s) => s.slug)
    .map((s) => ({
      url: `${SITE_URL}/shop/${s.slug}`,
      lastModified: s.updatedAt ? new Date(s.updatedAt) : s.createdAt ? new Date(s.createdAt) : now,
      changeFrequency: 'weekly',
      priority: 0.8,
      images: s.thumbnailUrl ? [s.thumbnailUrl] : undefined,
    }))

  const projectUrls: MetadataRoute.Sitemap = projects
    .filter((p) => p.slug)
    .map((p) => {
      const img = p.thumbnailUrl || p.thumbnail
      return {
        url: `${SITE_URL}/projects/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : p.createdAt ? new Date(p.createdAt) : now,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        images: img ? [img] : undefined,
      }
    })

  const techTrendUrls: MetadataRoute.Sitemap = techTrends
    .filter((a) => a.slug)
    .map((a) => ({
      url: `${SITE_URL}/tech-trends/${a.slug}`,
      lastModified: a.publishedAt
        ? new Date(a.publishedAt)
        : a.updatedAt
        ? new Date(a.updatedAt)
        : a.createdAt
        ? new Date(a.createdAt)
        : now,
      changeFrequency: 'monthly',
      priority: 0.6,
      images: a.coverImageUrl ? [a.coverImageUrl] : undefined,
    }))

  // Games: only PUBLISHED get a URL — COMING_SOON pages exist but hold no
  // content worth indexing, and DRAFT 404s for non-admins.
  const gameUrls: MetadataRoute.Sitemap = games
    .filter((g) => g.slug && g.status === 'PUBLISHED')
    .map((g) => ({
      url: `${SITE_URL}/games/${g.slug}`,
      lastModified: g.updatedAt ? new Date(g.updatedAt) : g.createdAt ? new Date(g.createdAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
      images: g.coverImage ? [g.coverImage] : undefined,
    }))

  // Voice Hub: the /voice list envelope is { data: { posts: [...] } }, which
  // safeFetch (expects json.data to be an array) can't read — fetch directly.
  type VoiceItem = { slug?: string; updatedAt?: string; publishedAt?: string; thumbnailUrl?: string }
  let voicePosts: VoiceItem[] = []
  try {
    const res = await fetch(`${getServerApiBaseUrl()}/api/v1/voice?size=100`, {
      headers: { 'User-Agent': 'cuongthai-sitemap/1.0' },
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    })
    if (res.ok) {
      const json = await res.json()
      if (Array.isArray(json?.data?.posts)) voicePosts = json.data.posts as VoiceItem[]
    }
  } catch { /* fail open */ }

  const voiceUrls: MetadataRoute.Sitemap = voicePosts
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${SITE_URL}/voice/${p.slug}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      images: p.thumbnailUrl ? [p.thumbnailUrl] : undefined,
    }))

  // Music tracks intentionally omitted — no per-track page (played in-place
  // on /music), so linking /music/:id would 404.

  return [...staticPages, ...courseUrls, ...blogUrls, ...shopUrls, ...projectUrls, ...techTrendUrls, ...gameUrls, ...voiceUrls]
}
