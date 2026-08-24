import type { MetadataRoute } from 'next'
import { getServerApiBaseUrl } from '@/lib/server-api'
import { SHOP_ENABLED } from '@/lib/featureFlags'
import { TYPES as AI_TEMPLATE_TYPES } from '@/lib/ai-templates/catalog'

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
    // `/blog` is not listed: it 301s to /tech-trends since the two blogs were
    // merged (2026-08-05). A redirecting URL in a sitemap is a soft error.
    // Individual `/blog/<slug>` resource posts DO still resolve and are
    // emitted below.
    { url: `${SITE_URL}/repos`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/games`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/language`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },

    // ── Các trang công khai trước đây KHÔNG có trong sitemap ───────────────
    // Không trang nào ở đây đòi đăng nhập (đã đối chiếu từng cái với
    // middleware.ts và với chính page.tsx của nó — những trang có
    // `redirect('/login')` như /exam/[examId] cố ý KHÔNG nằm đây).
    //
    // `/code-lab` là cửa vào của phần nội dung lớn nhất web: nó liên kết
    // xuống toàn bộ track và bài tập được liệt kê ở cuối hàm này.
    { url: `${SITE_URL}/code-lab`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/algorithms`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/interview`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/cv`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/hub`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/download`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/tools/image-to-doc`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },

    // Sân chơi 3D. Trước đây KHÔNG có ở đây, và trên trang chủ nó lại nấp sau
    // một <button> không href (đã sửa trong PlaygroundGate.tsx) — nên thực tế
    // Googlebot không có lối nào bò tới, dù đây là thứ khác biệt nhất của web.
    // Không có dấu gạch chéo cuối: `/playground` được rewrite sang
    // /playground/index.html trong next.config.js, còn `/playground/` thì Next
    // bỏ dấu gạch chéo và 308 ngược lại — URL chuyển hướng trong sitemap là
    // một lỗi mềm của Search Console.
    { url: `${SITE_URL}/playground`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/tech-trends`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${SITE_URL}/voice`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${SITE_URL}/forum`, lastModified: now, changeFrequency: 'daily', priority: 0.5 },
    // (`/social` removed — that route 404s; the public feed lives at `/`.)

    // Kho AI Templates: liệt kê 10 trang DANH SÁCH, không liệt kê 1.877 trang
    // chi tiết. Trang chi tiết render lúc chạy và nội dung lấy từ GitHub — đẩy
    // cả ngần ấy URL vào sitemap là mời Googlebot nện VPS bằng 1.877 lượt
    // render kèm 1.877 lượt fetch ra ngoài. Trang danh sách đã liên kết tới tất
    // cả, nên bot vẫn bò tới được, chỉ là theo nhịp của nó.
    // (`/ai-templates` không có ở đây: nó 307 sang /ai-templates/skills.)
    ...AI_TEMPLATE_TYPES.map((t) => ({
      url: `${SITE_URL}/ai-templates/${t.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
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

  // Code Lab: một lời gọi cho TOÀN BỘ track + bài tập, ở dạng nhẹ nhất
  // (slug + updatedAt). Endpoint `/code-lab/sitemap` sinh ra riêng cho việc
  // này — xem `listSitemapEntries` ở backend để biết vì sao KHÔNG dùng
  // `/code-lab/exercises` (nó trả nguyên đề bài + lời giải, và chặn limit ở
  // 100 ⇒ 126 lượt gọi).
  type CodeLabSitemap = {
    tracks: { slug: string; updatedAt?: string }[]
    exercises: { slug: string; trackSlug: string; updatedAt?: string }[]
  }
  // Fail-open giống `safeFetch`, chỉ khác ở SHAPE trả về (một object hai mảng,
  // không phải `{ data: [...] }`) nên không dùng chung được. Thời hạn 8s thay
  // vì 3s: đây là truy vấn nặng nhất — nhưng backend đã nhớ tạm 1 giờ trong
  // tiến trình (`listSitemapEntries`), nên hầu hết lượt gọi về trong vài ms và
  // 8s chỉ là trần cho lần đầu sau khi khởi động lại.
  async function fetchCodeLab(): Promise<CodeLabSitemap> {
    const empty: CodeLabSitemap = { tracks: [], exercises: [] }
    try {
      const res = await fetch(`${getServerApiBaseUrl()}/api/v1/code-lab/sitemap`, {
        headers: { 'User-Agent': 'cuongthai-sitemap/1.0' },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8000),
      })
      if (!res.ok) return empty
      const d = (await res.json())?.data
      return {
        tracks: Array.isArray(d?.tracks) ? d.tracks : [],
        exercises: Array.isArray(d?.exercises) ? d.exercises : [],
      }
    } catch (err) {
      console.warn('[sitemap] code-lab fetch failed:', (err as Error).message)
      return empty
    }
  }

  // Code Lab đi CÙNG Promise.all, không xếp sau nó. Gọi tuần tự thì tổng thời
  // gian là 3s + 8s = 11s, và Search Console bỏ cuộc trước khi sitemap kịp trả
  // — đúng thứ mà chú thích `dynamic = 'force-dynamic'` ở đầu file dặn tránh.
  // Chạy song song thì tổng chỉ bằng lời gọi chậm nhất.
  const [[courses, posts, products, projects, techTrends, games], codeLab] = await Promise.all([
    Promise.all([
      safeFetch<CourseItem>('/courses?limit=100'),
      // `size`, not `limit` — the blog list endpoint ignores `limit` and falls
      // back to its default of 10, which would silently truncate the sitemap
      // once there are more than ten resource posts.
      safeFetch<BlogItem>('/blog/posts?size=100'),
      safeFetch<ShopItem>('/shop/products?limit=100'),
      safeFetch<ProjectItem>('/projects?limit=100'),
      safeFetch<TechTrendItem>('/tech-trends/articles?size=100'),
      safeFetch<GameItem>('/games'),
    ]),
    fetchCodeLab(),
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

  // Slug NÀO cũng có ở tech-trends thì bỏ khỏi phần /blog/ — hai bảng `posts`
  // và `tech_trend_articles` có slug trùng nhau trong dữ liệu thật (xem
  // `coBenTechTrends` trong blog/[slug]/page.tsx), và những trang đó nay
  // canonical sang /tech-trends/. Nộp cả hai URL cho Google là tự khai báo
  // trùng lặp: bản không-canonical chỉ tổ làm loãng.
  //
  // Best-effort: `techTrends` lấy `size=100`, nên nếu có hơn 100 bài thì vài
  // slug trùng vẫn lọt. Canonical ở trang mới là hàng rào chính; đây chỉ là
  // dọn cho sạch đầu vào.
  const slugTechTrends = new Set(techTrends.map((a) => a.slug).filter(Boolean))

  const blogUrls: MetadataRoute.Sitemap = posts
    .filter((p) => p.slug && p.slug.length > 0 && !slugTechTrends.has(p.slug))
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

  // ── Code Lab ────────────────────────────────────────────────────────────
  // Đây là phần nội dung LỚN NHẤT của web (~12.500 bài tập) và trước
  // 23/08/2026 không có URL nào của nó trong sitemap — sitemap chỉ có 76 dòng
  // trong khi trang chủ khoe hàng nghìn bài.
  //
  // Điều kiện tiên quyết ĐÃ xong trước khi thêm vào đây: mỗi trang bài tập nay
  // có tiêu đề + mô tả + canonical riêng, nhờ
  // `code-lab/[trackSlug]/[exerciseSlug]/layout.tsx`. Nộp 12.500 URL trùng
  // tiêu đề thì Google gộp hoặc bỏ, nên thứ tự hai việc này không đảo được.
  const codeTrackUrls: MetadataRoute.Sitemap = codeLab.tracks
    .filter((t) => t.slug)
    .map((t) => ({
      url: `${SITE_URL}/code-lab/${t.slug}`,
      lastModified: t.updatedAt ? new Date(t.updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  const codeExerciseUrls: MetadataRoute.Sitemap = codeLab.exercises
    .filter((e) => e.slug && e.trackSlug)
    .map((e) => ({
      url: `${SITE_URL}/code-lab/${e.trackSlug}/${e.slug}`,
      lastModified: e.updatedAt ? new Date(e.updatedAt) : now,
      // Nội dung bài tập gần như không đổi sau khi xuất bản; nói 'monthly' để
      // Googlebot không quay lại nện 12.500 URL mỗi ngày trên con VPS 6GB.
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))

  const all = [
    ...staticPages,
    ...courseUrls,
    ...blogUrls,
    ...shopUrls,
    ...projectUrls,
    ...techTrendUrls,
    ...gameUrls,
    ...voiceUrls,
    ...codeTrackUrls,
    ...codeExerciseUrls,
  ]

  // Trần cứng của giao thức sitemap: 50.000 URL cho MỘT file. Hiện ~12.700 nên
  // còn rất rộng, nhưng Code Lab là phần tăng nhanh nhất và ngày chạm trần thì
  // Google lặng lẽ bỏ phần thừa, không báo gì. Cắt có kiểm soát + một dòng log
  // để lần đó ta biết mà tách file (`generateSitemaps`) thay vì phát hiện qua
  // việc mất index.
  const MAX_URLS = 50_000
  if (all.length > MAX_URLS) {
    console.warn(
      `[sitemap] ${all.length} URL vượt trần ${MAX_URLS} — đã cắt bớt. ` +
        'Đã đến lúc tách sitemap bằng generateSitemaps().',
    )
    return all.slice(0, MAX_URLS)
  }

  return all
}
