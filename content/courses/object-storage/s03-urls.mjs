const REF = '?ref=%2Fcourses%2Fobject-storage%2Flearn&reflabel=Object%20Storage';
export default {
  title: 'Chapter 3 — URLs and access|||Chương 3 — URL và access',
  slug: 'os-ch3-urls',
  description: 'Bốn bài về ba loại URL (endpoint API, custom domain CDN, signed URL), Cache-Control per content type, và khi nào private vs public.',
  sortOrder: 4,
  lessons: [

    {
      title: '3.1 — Three URL types: API, CDN, signed|||3.1 — Ba loại URL: API, CDN, signed',
      slug: 'os-3-1-three-urls',
      type: 'VIDEO',
      description: 'API endpoint (auth required, expensive egress), custom domain qua CDN (free egress, cached), signed URL (short-lived, cho private objects). Kho này dùng cả ba.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Three URL types: API, CDN, signed</h2>
<p class="lead">Same object, three different URLs. Each serves a different purpose. Confusing them costs money or leaks data.</p>

<h3>Three URLs for the same object</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">1. R2 API endpoint</span><span class="lz-nsub">xxx.r2.cloudflarestorage.com</span></span>
<span class="lz-nbody">For code (the SDK). Requires auth (access key + signature). NOT cached. Egress is expensive (though zero on R2). Use it for upload, list and delete from the backend.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">2. Custom domain</span><span class="lz-nsub">media.cuongthai.com/key</span></span>
<span class="lz-nbody">For the browser. Public. Cached globally by the Cloudflare CDN. Zero egress. Use it to serve avatars, images and video.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">3. Signed URL</span><span class="lz-nsub">endpoint/key?X-Amz-Signature=...</span></span>
<span class="lz-nbody">For private objects. Short-lived (5-10 minutes). Signature-verified. NOT cached. Use it for paid-course PDFs and expiring downloads.</span>
</div>
</div>

<h3>This repo's config, from src/config/r2.ts</h3>
<pre><code class="language-ts">export function buildPublicUrl(key: string): string {
  // Serve qua CDN, khong qua R2 endpoint
  return &#96;\${config.r2.publicUrlBase}/\${key}&#96;;
  // e.g. https://media.cuongthai.com/users/42/avatar.jpg
}

// upload -&gt; API endpoint
await putObject(key, buffer, contentType);
// -&gt; https://xxx.r2.cloudflarestorage.com/... (auth required)

// return URL for FE
return buildPublicUrl(key);
// -&gt; https://media.cuongthai.com/... (public, cached)
</code></pre>

<h3>Use-case table</h3>
<div class="out">Use case                 URL type              Cache?  Auth?  Cost
Upload from backend      API endpoint          NO      YES    ~0 (R2)
Download to server       API endpoint          NO      YES    ~0 (R2)
Serve avatar to browser  Custom domain (CDN)   YES     NO     $0
Serve public video       Custom domain (CDN)   YES     NO     $0
Paid course PDF          Signed URL            NO      SIG    ~0
Temporary share link     Signed URL            NO      SIG    ~0
</div>

<div class="callout warn">
<p><strong>Do NOT serve public files through the API endpoint.</strong> Bug number one: a developer forgets the custom domain and the code returns <code>xxx.r2.cloudflarestorage.com/...</code>. The client fetches it and gets a 401 (unauthenticated). The fix: <em>always</em> <code>buildPublicUrl(key)</code>, never expose the endpoint.</p>
</div>

<h3>URL structure detail</h3>
<pre><code class="language-text">API endpoint (upload):
  https://51f0a8f1.r2.cloudflarestorage.com/bucket-name/users/42/x.jpg?X-Amz-...
  ^^^^ auth headers/query required

Custom domain (public):
  https://media.cuongthai.com/users/42/x.jpg
  ^^^^ no auth, cached by CDN, egress zero

Signed URL:
  https://51f0a8f1.r2.cloudflarestorage.com/bucket-name/paid/lesson-5.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...&X-Amz-Date=...&X-Amz-Expires=600&X-Amz-Signature=xxx
  ^^^^ signed with SigV4, expires in 600s
</code></pre>

<h3>Cache implications</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">CDN</span><span class="lz-t">Cache-Control determines TTL</span><span class="lz-d">Cache header set at upload time. Browser + CDN cache accordingly. Invalidate via Cloudflare purge API.</span></div>
<div class="lz-step"><span class="lz-k">API</span><span class="lz-t">No cache by design</span><span class="lz-d">The R2 endpoint is not cached — every GET reaches R2. Slow (~50-200 ms) and expensive (egress costs money on S3).</span></div>
<div class="lz-step"><span class="lz-k">Signed</span><span class="lz-t">Explicit no-cache</span><span class="lz-d">The signature in the query string makes every URL unique, so the CDN will not cache it. Every fetch reaches R2. Slower.</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — hardcode API endpoint URL trong DB.</strong> You store <code>https://xxx.r2.cloudflarestorage.com/...</code> in <code>MediaFile.url</code>. Later you change the custom domain or the R2 endpoint, and every stored URL breaks. The fix: store <em>key</em> only, build URL runtime.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Three URL types for the same object: the API endpoint (backend SDK, authenticated, uncached, for upload and delete), a custom domain through the CDN (browser, public, cached, for serving), and a signed URL (short-lived, signature-authenticated, uncached, for private access) — store the key in your database rather than a URL, and build the URL at runtime.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — Public buckets and custom domains</span><span class="lc-sub">developers.cloudflare.com/r2/buckets/public-buckets — setup guide.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Ba loại URL: API, CDN, signed</h2>
<p class="lead">Cùng object, ba URL khác nhau. Mỗi cái phục vụ mục đích khác. Nhầm chúng tốn tiền hoặc leak data.</p>

<h3>Ba URL cho cùng object</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">1. R2 API endpoint</span><span class="lz-nsub">xxx.r2.cloudflarestorage.com</span></span>
<span class="lz-nbody">Cho code (SDK). Cần auth (access key + signature). KHÔNG cache. Cost egress cao (nhưng R2 zero). Dùng cho upload, list, delete từ backend.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">2. Custom domain</span><span class="lz-nsub">media.cuongthai.com/key</span></span>
<span class="lz-nbody">Cho browser. Public. Cached qua Cloudflare CDN globally. Egress zero. Dùng cho serving avatar, image, video.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">3. Signed URL</span><span class="lz-nsub">endpoint/key?X-Amz-Signature=...</span></span>
<span class="lz-nbody">Cho private object. Short-lived (5-10 phút). Verified signature. KHÔNG cache. Dùng cho paid course PDF, expiring download.</span>
</div>
</div>

<h3>Kho này config từ src/config/r2.ts</h3>
<pre><code class="language-ts">export function buildPublicUrl(key: string): string {
  // Serve qua CDN, khong qua R2 endpoint
  return &#96;\${config.r2.publicUrlBase}/\${key}&#96;;
  // e.g. https://media.cuongthai.com/users/42/avatar.jpg
}

// upload -&gt; API endpoint
await putObject(key, buffer, contentType);
// -&gt; https://xxx.r2.cloudflarestorage.com/... (auth required)

// return URL for FE
return buildPublicUrl(key);
// -&gt; https://media.cuongthai.com/... (public, cached)
</code></pre>

<h3>Bảng use case</h3>
<div class="out">Use case                 URL type              Cache?  Auth?  Cost
Upload from backend      API endpoint          NO      YES    ~0 (R2)
Download to server       API endpoint          NO      YES    ~0 (R2)
Serve avatar to browser  Custom domain (CDN)   YES     NO     $0
Serve public video       Custom domain (CDN)   YES     NO     $0
Paid course PDF          Signed URL            NO      SIG    ~0
Temporary share link     Signed URL            NO      SIG    ~0
</div>

<div class="callout warn">
<p><strong>ĐỪNG serve public file qua API endpoint.</strong> Bug số 1: dev quên custom domain, code trả về <code>xxx.r2.cloudflarestorage.com/...</code>. Client fetch → 401 (không auth). Fix: <em>luôn</em> <code>buildPublicUrl(key)</code>, không expose endpoint.</p>
</div>

<h3>URL structure chi tiết</h3>
<pre><code class="language-text">API endpoint (upload):
  https://51f0a8f1.r2.cloudflarestorage.com/bucket-name/users/42/x.jpg?X-Amz-...
  ^^^^ auth headers/query required

Custom domain (public):
  https://media.cuongthai.com/users/42/x.jpg
  ^^^^ no auth, cached by CDN, egress zero

Signed URL:
  https://51f0a8f1.r2.cloudflarestorage.com/bucket-name/paid/lesson-5.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...&X-Amz-Date=...&X-Amz-Expires=600&X-Amz-Signature=xxx
  ^^^^ signed with SigV4, expires in 600s
</code></pre>

<h3>Cache implications</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">CDN</span><span class="lz-t">Cache-Control quyết định TTL</span><span class="lz-d">Cache header set lúc upload. Browser + CDN cache accordingly. Invalidate qua Cloudflare purge API.</span></div>
<div class="lz-step"><span class="lz-k">API</span><span class="lz-t">Không cache by design</span><span class="lz-d">R2 endpoint không cache — mọi GET đến R2. Chậm (~50-200ms latency) và đắt (egress $ trên S3).</span></div>
<div class="lz-step"><span class="lz-k">Signed</span><span class="lz-t">Explicit no-cache</span><span class="lz-d">Query string với signature làm URL unique per signature. CDN không cache (query string). Mọi fetch đi R2. Chậm hơn.</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — hardcode API endpoint URL trong DB.</strong> Bạn lưu <code>https://xxx.r2.cloudflarestorage.com/...</code> vào <code>MediaFile.url</code>. Sau đó đổi custom domain hoặc R2 endpoint, mọi URL cũ vỡ. Fix: lưu <em>key</em> thôi, build URL runtime.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Ba URL type cho cùng object: API endpoint (backend SDK, auth, không cache, upload/delete), custom domain qua CDN (browser, public, cached, serving), signed URL (short-lived, sig auth, không cache, private access) — lưu key trong DB không URL, build URL runtime.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">R2 — Public buckets and custom domains</span><span class="lc-sub">developers.cloudflare.com/r2/buckets/public-buckets — setup guide.</span></span></div>
</div>
`,
    },

    {
      title: '3.2 — Cache-Control per content type|||3.2 — Cache-Control theo content type',
      slug: 'os-3-2-cache',
      type: 'VIDEO',
      description: 'Immutable images: 1 year cache. Audio streams: 1 hour. Never over-cache mutable content. Kho này set cache_control lúc upload.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Cache-Control per content type</h2>
<p class="lead">Cache-Control header set on the object at upload time controls how long browsers and CDNs cache the response. Wrong TTL = either stale content or unnecessary hits.</p>

<h3>This repo tunes it per content type</h3>
<pre><code class="language-ts">// upload.service.ts
const CACHE_POLICIES = {
  image:   'public, max-age=31536000, immutable',    // 1 year, immutable
  video:   'public, max-age=31536000, immutable',    // 1 year
  audio:   'public, max-age=3600',                    // 1 hour
  avatar:  'public, max-age=86400',                   // 1 day (can change)
  pdf:     'public, max-age=604800',                  // 1 week
  default: 'public, max-age=3600',                    // 1 hour
};
</code></pre>

<h3>Immutable vs mutable</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">immutable</span><span class="lz-nsub">1 year + immutable directive</span></span>
<span class="lz-nbody">The content at this URL never changes. A new version means a new URL (a versioned key or a hash). The browser caches aggressively and never asks the server. Images, video, minified JS bundles.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">short-cache</span><span class="lz-nsub">1 hour</span></span>
<span class="lz-nbody">Content can change. Client fetches fresh occasionally. E.g. profile avatar (URL stable), music streams. Balance freshness vs origin hits.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">no-cache</span><span class="lz-nsub">max-age=0</span></span>
<span class="lz-nbody">Never cache. Every fetch hits origin. Rare — only for content that MUST be fresh AND frequently changes. Wasteful; try versioned URLs instead.</span>
</div>
</div>

<h3>Versioned URLs trump cache tuning</h3>
<pre><code class="language-text">Cach kem:
  URL:  https://media/avatar-user-42.jpg
  Cache: 1 hour
  Update: replace object, wait 1 hour for cache expire
  Bad UX: stale avatar for 1 hour after change

Cach tot:
  URL:  https://media/avatar-user-42-v42.jpg  (or -&lt;hash&gt;.jpg)
  Cache: 1 year immutable
  Update: upload NEW key with new version, update DB URL
  Old key eventually cleanup via lifecycle (Chuong 6)
  Perfect UX: instant switch, no cache fight
</code></pre>

<div class="callout ok">
<p><strong>Versioned URL = cache aggressive + no invalidation needed.</strong> This repo uses that pattern for avatar uploads — the key includes a timestamp <code>avatar-1234567890.jpg</code>.</p>
</div>

<h3>CDN cache invalidation — when you actually need it</h3>
<pre><code class="language-bash"># Cloudflare purge URL
$ curl -X POST \\
    "https://api.cloudflare.com/client/v4/zones/$ZONE/purge_cache" \\
    -H "Authorization: Bearer $TOKEN" \\
    -H "Content-Type: application/json" \\
    -d '{"files":["https://media.cuongthai.com/x.jpg"]}'
</code></pre>

<p>Cloudflare's free plan allows 30 purges a day; paid plans are unlimited. That free-tier limit is reason enough to prefer versioned URLs.</p>

<h3>Cache-Control syntax</h3>
<pre><code class="language-text">public                — anyone (including CDN) can cache
private               — only browser can cache
max-age=N             — N seconds
s-maxage=N            — for CDN (overrides max-age for CDN)
immutable             — content never changes at this URL (skip revalidation)
no-cache              — must revalidate before use (still cache but check)
no-store              — never cache (rare)

Combo cho immutable static asset:
  public, max-age=31536000, immutable
Combo cho private user data:
  private, max-age=60
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — set aggressive cache-control cho mutable content.</strong> An avatar cached for a year. The user changes it. A year later their friends still see the old one. The fix: either use a versioned URL, or cache briefly with a hash appended as a query string.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Cache-Control is set at upload time: immutable content (image, video, hashed asset) gets one year immutable, mutable content gets a one-hour max-age, a versioned URL beats a short cache plus invalidation, and the Cloudflare CDN tunes its own cache from that header — so set it correctly at upload.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">web.dev — HTTP caching</span><span class="lc-sub">web.dev/http-cache — Cache-Control guide.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Cache-Control theo content type</h2>
<p class="lead">Cache-Control header set trên object lúc upload điều khiển bao lâu browser và CDN cache response. TTL sai = hoặc content stale, hoặc hit không cần.</p>

<h3>Kho này tune per content type</h3>
<pre><code class="language-ts">// upload.service.ts
const CACHE_POLICIES = {
  image:   'public, max-age=31536000, immutable',    // 1 year, immutable
  video:   'public, max-age=31536000, immutable',    // 1 year
  audio:   'public, max-age=3600',                    // 1 hour
  avatar:  'public, max-age=86400',                   // 1 day (can change)
  pdf:     'public, max-age=604800',                  // 1 week
  default: 'public, max-age=3600',                    // 1 hour
};
</code></pre>

<h3>Immutable vs mutable</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">immutable</span><span class="lz-nsub">1 year + immutable directive</span></span>
<span class="lz-nbody">Content không bao giờ đổi ở URL này. Version mới = URL mới (versioned key hoặc hash). Browser aggressive cache, không hỏi server. VD: image, video, minified JS bundle.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">short-cache</span><span class="lz-nsub">1 hour</span></span>
<span class="lz-nbody">Content có thể đổi. Client fetch fresh occasionally. VD: profile avatar (URL stable), music stream. Cân bằng freshness vs origin hit.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">no-cache</span><span class="lz-nsub">max-age=0</span></span>
<span class="lz-nbody">Không cache. Mỗi fetch hit origin. Hiếm — chỉ cho content BẮT BUỘC fresh VÀ đổi thường xuyên. Lãng phí; thử versioned URL trước.</span>
</div>
</div>

<h3>Versioned URL trump cache tuning</h3>
<pre><code class="language-text">Cach kem:
  URL:  https://media/avatar-user-42.jpg
  Cache: 1 hour
  Update: replace object, wait 1 hour for cache expire
  Bad UX: stale avatar for 1 hour after change

Cach tot:
  URL:  https://media/avatar-user-42-v42.jpg  (or -&lt;hash&gt;.jpg)
  Cache: 1 year immutable
  Update: upload NEW key with new version, update DB URL
  Old key eventually cleanup via lifecycle (Chuong 6)
  Perfect UX: instant switch, no cache fight
</code></pre>

<div class="callout ok">
<p><strong>Versioned URL = cache aggressive + không cần invalidation.</strong> Kho này dùng pattern này cho avatar upload — key include timestamp <code>avatar-1234567890.jpg</code>.</p>
</div>

<h3>CDN cache invalidation — khi cần</h3>
<pre><code class="language-bash"># Cloudflare purge URL
$ curl -X POST \\
    "https://api.cloudflare.com/client/v4/zones/$ZONE/purge_cache" \\
    -H "Authorization: Bearer $TOKEN" \\
    -H "Content-Type: application/json" \\
    -d '{"files":["https://media.cuongthai.com/x.jpg"]}'
</code></pre>

<p>Cloudflare free plan: 30 purge/day. Paid: unlimited. Free tier limit là lý do đủ để dùng versioned URL.</p>

<h3>Cache-Control syntax</h3>
<pre><code class="language-text">public                — anyone (including CDN) can cache
private               — only browser can cache
max-age=N             — N seconds
s-maxage=N            — for CDN (overrides max-age for CDN)
immutable             — content never changes at this URL (skip revalidation)
no-cache              — must revalidate before use (still cache but check)
no-store              — never cache (rare)

Combo cho immutable static asset:
  public, max-age=31536000, immutable
Combo cho private user data:
  private, max-age=60
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — set aggressive cache-control cho mutable content.</strong> Avatar cache 1 year. User đổi avatar. 1 năm sau bạn bè họ vẫn thấy avatar cũ. Fix: hoặc dùng versioned URL, hoặc cache short với hash query string append.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Cache-Control set lúc upload: immutable content (image, video, hashed asset) = 1 year immutable, mutable content = 1 hour max-age, versioned URL tốt hơn short cache + invalidation, và Cloudflare CDN cache-tuning tự động dựa vào header — set đúng lúc upload.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">web.dev — HTTP caching</span><span class="lc-sub">web.dev/http-cache — Cache-Control guide.</span></span></div>
</div>
`,
    },

    {
      title: '3.3 — Signed URLs for private objects|||3.3 — Signed URL cho private object',
      slug: 'os-3-3-signed',
      type: 'VIDEO',
      description: '`getSignedUrl` từ SDK, TTL 5-10 phút, dùng cho paid course PDF hoặc expiring share link. Signature verify by R2.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Signed URLs for private objects</h2>
<p class="lead">Most content is public — no auth, cached by CDN, served free. Sometimes you need private: paid course PDFs, temporary share links. Signed URLs give short-lived access without making objects public.</p>

<h3>Generate signed URL</h3>
<pre><code class="language-ts">import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';

export async function getSignedDownloadUrl(
  key: string,
  expiresInSeconds: number = 600,   // 10 phut default
): Promise&lt;string&gt; {
  const cmd = new GetObjectCommand({
    Bucket: config.r2.bucketName,
    Key: key,
  });
  return getSignedUrl(getR2Client(), cmd, { expiresIn: expiresInSeconds });
}

// Usage: paid course PDF
const url = await getSignedDownloadUrl('paid/course-5/lesson-3.pdf', 600);
// -&gt; return to client, valid 10 min
</code></pre>

<h3>Signature format (SigV4)</h3>
<pre><code class="language-text">https://xxx.r2.cloudflarestorage.com/bucket/paid/lesson.pdf
  ?X-Amz-Algorithm=AWS4-HMAC-SHA256
  &X-Amz-Credential=ACCESS_KEY_ID/20260824/auto/s3/aws4_request
  &X-Amz-Date=20260824T120000Z
  &X-Amz-Expires=600
  &X-Amz-Signature=abc123...

Signature = HMAC-SHA256 cua request + key + date + expires
R2 recalculate signature; match -&gt; serve; nomatch -&gt; 403
</code></pre>

<h3>This repo's pattern — a paid course</h3>
<pre><code class="language-ts">// GET /api/v1/courses/:courseId/lessons/:lessonId/download
async function downloadLesson(req, res) {
  const { courseId, lessonId } = req.params;
  const userId = req.user.id;
  
  // 1. Verify user enrolled
  const enrolled = await isEnrolled(userId, courseId);
  if (!enrolled) return res.sendStatus(403);
  
  // 2. Get file key from DB
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  
  // 3. Return short-lived signed URL
  const url = await getSignedDownloadUrl(lesson.fileKey, 600);
  res.json({ url });   // FE fetch this URL within 10 min
}
</code></pre>

<div class="callout ok">
<p><strong>Two-step redirect protects private files.</strong> Client GET your API endpoint with auth cookie → server verify entitlement → server returns signed URL → client fetch signed URL directly from R2. R2 serves without your server bandwidth.</p>
</div>

<h3>TTL choice</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Short (5-10 min)</span><span class="lz-t">Client immediately downloads</span><span class="lz-d">Standard. Enough time for client to start download; not enough for URL sharing.</span></div>
<div class="lz-step"><span class="lz-k">Medium (1 hour)</span><span class="lz-t">Video streaming</span><span class="lz-d">Video player may pause + resume. Signed URL should survive one viewing session.</span></div>
<div class="lz-step"><span class="lz-k">Long (7 days)</span><span class="lz-t">Share link with expiry</span><span class="lz-d">R2 max is 7 days. For &quot;share this file until Friday&quot; UX.</span></div>
</div>

<h3>Signed URL cho UPLOAD (presigned PUT)</h3>
<pre><code class="language-ts">// Client can upload DIRECTLY to R2, bypassing your server
import { PutObjectCommand } from '@aws-sdk/client-s3';

const cmd = new PutObjectCommand({
  Bucket, Key: key,
  ContentType: 'video/mp4',
});
const url = await getSignedUrl(client, cmd, {
  expiresIn: 3600,
  signableHeaders: new Set(['host', 'content-type']),   // CRITICAL — see Chuong 4
});
</code></pre>

<div class="callout warn">
<p><strong>Chapter 4 measures the real SigV4 bug this repo hit when signableHeaders was wrong.</strong> Presigned PUT security is subtle — Chapter 4 covers it in detail.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — cache signed URL trong DB.</strong> The signature expires. Cache it for 24 hours in the database and the URL is dead before the user clicks. Regenerate it per request.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A signed URL gives short-lived private access (5-10 minutes for a download, an hour for streaming) without making the object public — this repo's pattern is an API endpoint that verifies entitlement and returns a signed URL for the client to fetch straight from R2, saving server bandwidth; signed URLs for upload (presigned PUT) are a separate topic, covered in Chapter 4.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">@aws-sdk/s3-request-presigner</span><span class="lc-sub">github.com/aws/aws-sdk-js-v3/tree/main/packages/s3-request-presigner — API.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Signed URL cho private object</h2>
<p class="lead">Đa phần content là public — không auth, cached bởi CDN, serve free. Đôi khi bạn cần private: paid course PDF, temporary share link. Signed URL cho short-lived access mà không public hoá object.</p>

<h3>Sinh signed URL</h3>
<pre><code class="language-ts">import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';

export async function getSignedDownloadUrl(
  key: string,
  expiresInSeconds: number = 600,   // 10 phut default
): Promise&lt;string&gt; {
  const cmd = new GetObjectCommand({
    Bucket: config.r2.bucketName,
    Key: key,
  });
  return getSignedUrl(getR2Client(), cmd, { expiresIn: expiresInSeconds });
}

// Usage: paid course PDF
const url = await getSignedDownloadUrl('paid/course-5/lesson-3.pdf', 600);
// -&gt; return to client, valid 10 min
</code></pre>

<h3>Signature format (SigV4)</h3>
<pre><code class="language-text">https://xxx.r2.cloudflarestorage.com/bucket/paid/lesson.pdf
  ?X-Amz-Algorithm=AWS4-HMAC-SHA256
  &X-Amz-Credential=ACCESS_KEY_ID/20260824/auto/s3/aws4_request
  &X-Amz-Date=20260824T120000Z
  &X-Amz-Expires=600
  &X-Amz-Signature=abc123...

Signature = HMAC-SHA256 cua request + key + date + expires
R2 recalculate signature; match -&gt; serve; nomatch -&gt; 403
</code></pre>

<h3>Kho này pattern — paid course</h3>
<pre><code class="language-ts">// GET /api/v1/courses/:courseId/lessons/:lessonId/download
async function downloadLesson(req, res) {
  const { courseId, lessonId } = req.params;
  const userId = req.user.id;
  
  // 1. Verify user enrolled
  const enrolled = await isEnrolled(userId, courseId);
  if (!enrolled) return res.sendStatus(403);
  
  // 2. Get file key from DB
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  
  // 3. Return short-lived signed URL
  const url = await getSignedDownloadUrl(lesson.fileKey, 600);
  res.json({ url });   // FE fetch this URL within 10 min
}
</code></pre>

<div class="callout ok">
<p><strong>Two-step redirect bảo vệ private file.</strong> Client GET API endpoint của bạn với auth cookie → server verify entitlement → server trả signed URL → client fetch signed URL trực tiếp từ R2. R2 serve mà không tốn server bandwidth.</p>
</div>

<h3>Chọn TTL</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Ngắn (5-10 phút)</span><span class="lz-t">Client immediately download</span><span class="lz-d">Chuẩn. Đủ thời gian cho client start download; không đủ để share URL.</span></div>
<div class="lz-step"><span class="lz-k">Trung bình (1 giờ)</span><span class="lz-t">Video streaming</span><span class="lz-d">Video player có thể pause + resume. Signed URL nên sống qua 1 viewing session.</span></div>
<div class="lz-step"><span class="lz-k">Dài (7 ngày)</span><span class="lz-t">Share link có expiry</span><span class="lz-d">R2 max là 7 ngày. Cho &quot;share file này đến thứ Sáu&quot; UX.</span></div>
</div>

<h3>Signed URL cho UPLOAD (presigned PUT)</h3>
<pre><code class="language-ts">// Client co the upload TRUC TIEP toi R2, bypass server cua ban
import { PutObjectCommand } from '@aws-sdk/client-s3';

const cmd = new PutObjectCommand({
  Bucket, Key: key,
  ContentType: 'video/mp4',
});
const url = await getSignedUrl(client, cmd, {
  expiresIn: 3600,
  signableHeaders: new Set(['host', 'content-type']),   // CRITICAL — xem Chuong 4
});
</code></pre>

<div class="callout warn">
<p><strong>Chương 4 đo bug SigV4 thật của kho này khi signableHeaders sai.</strong> Presigned PUT security phức tạp — Chương 4 dạy chi tiết.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — cache signed URL trong DB.</strong> Signature có expiry. Cache 24h in DB → URL expired trước khi user click. Regenerate mỗi request.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Signed URL = short-lived (5-10 phút cho download, 1 giờ cho streaming) private access mà không public hoá object — kho này pattern: API endpoint verify entitlement + return signed URL cho client fetch trực tiếp từ R2, tiết kiệm server bandwidth; signed URL cho upload (presigned PUT) là topic riêng cover trong Chương 4.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">@aws-sdk/s3-request-presigner</span><span class="lc-sub">github.com/aws/aws-sdk-js-v3/tree/main/packages/s3-request-presigner — API.</span></span></div>
</div>
`,
    },

    {
      title: '3.4 — Chapter 3 quiz|||3.4 — Kiểm tra Chương 3',
      slug: 'os-3-4-quiz',
      type: 'QUIZ',
      description: 'Bốn câu, sáu phút. Về URL types, Cache-Control, signed URLs.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 3 · Quiz</span><h2>What Chapter 3 established</h2><p class="lead">Four questions on URL patterns.</p></div><div class="ml-vi"><span class="eyebrow">Chương 3 · Kiểm tra</span><h2>Chương 3 đã dựng được gì</h2><p class="lead">Bốn câu về URL patterns.</p></div>`,
      quiz: {
        timeLimitSeconds: 360,
        questions: [
          {
            question: 'Serving avatar to browser via <code>https://xxx.r2.cloudflarestorage.com/...</code>. What happens?|||Serve avatar cho browser qua <code>https://xxx.r2.cloudflarestorage.com/...</code>. Chuyện gì?',
            options: [
              'Requires auth — browser fetch fails with 401 (no SDK signature). Should use custom domain URL that goes through CDN (public, cached, free egress)|||Cần auth — browser fetch fail 401 (không SDK signature). Nên dùng custom domain URL qua CDN (public, cached, free egress)',
              'Works fine|||Chạy ok',
              'Faster than CDN|||Nhanh hơn CDN',
              'Free egress|||Free egress',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Avatar cache 1 year immutable but user changes avatar. Problem?|||Avatar cache 1 year immutable nhưng user đổi avatar. Vấn đề?',
            options: [
              'Old cached avatar shown for up to 1 year. Fix: use versioned URL (avatar-v42.jpg) — cache aggressive + change URL when content changes|||Avatar cũ cached tới 1 năm. Fix: dùng versioned URL (avatar-v42.jpg) — cache aggressive + đổi URL khi content đổi',
              'Nothing — cache invalidates on new upload|||Không gì — cache invalidate khi upload mới',
              'Cloudflare auto-purges|||Cloudflare tự purge',
              'Browser detects change|||Browser detect change',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Standard TTL for signed URL for immediate download?|||TTL chuẩn cho signed URL cho immediate download?',
            options: [
              '5-10 minutes — enough for client to start download, not enough to share URL. For video streaming use 1 hour, share link max 7 days (R2 limit)|||5-10 phút — đủ cho client start download, không đủ để share URL. Cho video streaming dùng 1 giờ, share link max 7 ngày (R2 limit)',
              '24 hours default|||24 giờ default',
              '1 second|||1 giây',
              'No expiry|||Không expiry',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Storing R2 endpoint URL in DB (MediaFile.url). Risk?|||Lưu R2 endpoint URL trong DB (MediaFile.url). Nguy cơ?',
            options: [
              'When you change custom domain or R2 endpoint, all existing URLs break. Fix: store only the KEY in DB, build URL at runtime|||Khi bạn đổi custom domain hoặc R2 endpoint, mọi URL cũ vỡ. Fix: chỉ lưu KEY trong DB, build URL runtime',
              'No risk|||Không nguy cơ',
              'DB size grows|||DB size grow',
              'Slow queries|||Query chậm',
            ],
            correctIndex: 0, points: 1,
          },
        ],
      },
    },
  ],
};
