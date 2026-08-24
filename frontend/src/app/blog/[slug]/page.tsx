import type { Metadata } from 'next';
import Link from 'next/link';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { Calendar, Eye, Download, Clock, Package } from 'lucide-react';
import { getServerApiBaseUrl } from '@/lib/server-api';
import type { Post } from '@/types';
import PostActions from './PostActions';
import PostBody from './PostBody';
import PostComments from './PostComments';

/**
 * Resource post detail — source-code drops and course announcements.
 *
 * ─── WHAT CHANGED (2026-08-05) ─────────────────────────────────────
 * This used to be an 823-line client component that drew a fake macOS
 * terminal window: traffic-light dots, a "TECHNICAL EXCHANGE" rail for
 * comments, monospace chrome around a post whose entire body was the
 * word "FPTU". It looked busy and said nothing. It is now a plain
 * article page that matches /tech-trends/[slug], server-rendered, with
 * three small client islands (download, markdown body, comments).
 *
 * The post LIST for these lives on the merged blog at /tech-trends
 * under the "Source & Thông báo" tab — /blog now redirects there. This
 * route stays because these permalinks are already shared and already
 * carry comment threads.
 *
 * `force-dynamic`: the backend isn't running during `npm run build`, so
 * a build-time fetch would fail. `cache()` dedupes generateMetadata and
 * the page render into one backend call — which matters here because
 * the by-slug endpoint increments viewCount as a side effect.
 */
export const dynamic = 'force-dynamic';

const SITE_URL = 'https://cuongthai.com';

interface PageProps {
  params: { slug: string };
}

const getPost = cache(async (slug: string): Promise<Post | null> => {
  try {
    const res = await fetch(
      `${getServerApiBaseUrl()}/api/v1/blog/posts/by-slug/${encodeURIComponent(slug)}`,
      { headers: { accept: 'application/json' }, cache: 'no-store' },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data as Post) ?? null;
  } catch {
    return null;
  }
});

/**
 * Slug này có tồn tại bên /tech-trends không?
 *
 * ─── VÌ SAO CẦN (25/08/2026) ─────────────────────────────────────────────
 * Hai bảng `posts` và `tech_trend_articles` CÓ SLUG TRÙNG NHAU trong dữ liệu
 * thật. Mã thì không hề có đường rẽ chéo — đọc mã sẽ kết luận là không thể
 * trùng, và tôi đã kết luận đúng như vậy, SAI. Đo trên production:
 *
 *   /tech-trends/ma-hoa-aes-rsa-chu-ky-so        → 200
 *   /blog/ma-hoa-aes-rsa-chu-ky-so               → 200   ← cùng một bài
 *   /blog/thong-bao-ve-thay-oi-source-swp301     → 200
 *   /tech-trends/thong-bao-ve-thay-oi-source-swp301 → 200
 *
 * Cả hai chiều. Nghĩa là cuộc gộp blog 05/08/2026 đã CHÉP nội dung sang bảng
 * mới mà không xoá bảng cũ. Google thấy hai URL cùng nội dung, mỗi URL tự
 * canonical về chính nó ⇒ tín hiệu xếp hạng bị chia đôi trên toàn bộ blog.
 *
 * Sửa bằng canonical CHÉO chứ không phải 301: `/blog/<slug>` phải sống tiếp vì
 * luồng bình luận của nó gắn với `Comment.postId` (bảng `posts`) — 301 sang
 * tech-trends là bỏ rơi toàn bộ bình luận cũ. Canonical giữ trang sống, giữ
 * bình luận, mà vẫn gộp tín hiệu về một URL.
 *
 * `?dem=0` để phép hỏi này KHÔNG cộng lượt xem cho bài tech-trends — xem chú
 * thích trong `techTrends.routes.ts`.
 */
const coBenTechTrends = cache(async (slug: string): Promise<boolean> => {
  try {
    const res = await fetch(
      `${getServerApiBaseUrl()}/api/v1/tech-trends/articles/by-slug/${encodeURIComponent(slug)}?dem=0`,
      { headers: { accept: 'application/json' }, next: { revalidate: 300 } },
    );
    return res.ok;
  } catch {
    // Hỏi không được thì coi như KHÔNG trùng — giữ canonical về chính nó.
    // Trỏ canonical sang một URL có thể không tồn tại còn tệ hơn là để nguyên.
    return false;
  }
});

// Strip markdown/html to a plain-text meta description.
const toText = (s?: string, n = 200) =>
  (s ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/[#*`>_~]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, n);

function formatDate(iso?: string | null): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

function readingMinutes(content?: string): number {
  if (!content) return 1;
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Bài viết | Blog | CuongThai' };

  const description = toText(post.excerpt || post.content) || 'Bài viết trên CuongThai.';
  const image = post.thumbnailUrl || undefined;
  const url = `${SITE_URL}/blog/${params.slug}`;
  // Trùng bên tech-trends ⇒ canonical trỏ SANG ĐÓ. Xem `coBenTechTrends`.
  const canonical = (await coBenTechTrends(params.slug))
    ? `${SITE_URL}/tech-trends/${params.slug}`
    : url;

  return {
    title: `${post.title} | Blog | CuongThai`,
    description,
    keywords: post.tagNames?.length ? post.tagNames : undefined,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description,
      // og:url đi cùng canonical: Messenger dùng og:url làm đích khi bấm vào
      // link chia sẻ, nên để nó lệch canonical là hai nơi nói hai điều khác nhau.
      url: canonical,
      type: 'article',
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || undefined,
      tags: post.tagNames,
      images: image ? [image] : ['/opengraph-image'],
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: post.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${params.slug}`;
  // `cache()` nên lời gọi này dùng chung kết quả với generateMetadata — một
  // request tới backend cho cả hai, không phải hai.
  const canonical = (await coBenTechTrends(params.slug))
    ? `${SITE_URL}/tech-trends/${params.slug}`
    : url;
  const publishedAt = post.publishedAt || post.createdAt;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: toText(post.excerpt || post.content),
    image: post.thumbnailUrl || undefined,
    datePublished: publishedAt || undefined,
    dateModified: post.updatedAt || undefined,
    author: { '@type': 'Person', name: post.authorName || 'CuongThai' },
    keywords: post.tagNames?.join(', ') || undefined,
    mainEntityOfPage: canonical,
  };

  return (
    <div className="min-h-screen pb-24 pt-24" style={{ background: '#0a0a0f' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      {/* Decorative glow — same aesthetic as the article pages. */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-neon-indigo/10 blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-neon-fuchsia/10 blur-3xl" />
      </div>

      <article className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-text-muted">
          <Link href="/tech-trends" className="transition-colors hover:text-neon-violet">
            Blog
          </Link>
          <span>/</span>
          <span className="text-text-secondary">Source &amp; Thông báo</span>
        </nav>

        {/* Cover */}
        <div className="relative mb-8 aspect-[3/1] w-full overflow-hidden rounded-2xl border border-darkborder">
          {post.thumbnailUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.thumbnailUrl} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/30 to-transparent" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-darksurface via-darkcard to-darksurface" />
              <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/10 via-transparent to-neon-fuchsia/10" />
              <div className="absolute inset-0 flex select-none items-center justify-center text-8xl">📦</div>
            </>
          )}
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            <Package className="h-3.5 w-3.5" />
            Source &amp; Thông báo
          </span>
        </div>

        {/* Title + meta */}
        <header className="mb-8">
          <h1 className="font-heading text-3xl font-bold leading-[1.15] tracking-tight text-text-primary sm:text-4xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-4 text-lg leading-relaxed text-text-secondary">{post.excerpt}</p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              {(post.viewCount ?? 0).toLocaleString('vi-VN')} lượt xem
            </span>
            {!!post.downloadCount && post.downloadCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-amber-400">
                <Download className="h-3.5 w-3.5" />
                {post.downloadCount.toLocaleString('vi-VN')} lượt tải
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {readingMinutes(post.content)} phút đọc
            </span>
          </div>

          <div className="mt-6">
            <PostActions
              postId={post.id}
              sourceUrl={post.sourceUrl ?? null}
              title={post.title}
              url={url}
            />
          </div>
        </header>

        {/* Body */}
        {post.content?.trim() ? (
          <PostBody markdown={post.content} />
        ) : (
          <p className="text-text-muted">Bài này không có nội dung — phần chính là link source ở trên.</p>
        )}

        {/* Tags */}
        {post.tagNames && post.tagNames.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-darkborder pt-6">
            {post.tagNames.map((t) => (
              <Link
                key={t}
                href={`/tech-trends?q=${encodeURIComponent(t)}`}
                className="rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-1 text-xs font-medium text-text-secondary transition-colors hover:border-neon-violet/30 hover:text-neon-violet"
              >
                #{t}
              </Link>
            ))}
          </div>
        )}

        <PostComments postId={post.id} initial={post.comments ?? []} />

        <div className="mt-14 border-t border-darkborder pt-8">
          <Link
            href="/tech-trends"
            className="inline-flex items-center gap-2 rounded-xl border border-darkborder bg-white/[0.04] px-4 py-2.5 text-sm text-text-secondary transition-all hover:border-neon-violet/30 hover:text-text-primary"
          >
            ← Xem tất cả bài viết
          </Link>
        </div>
      </article>
    </div>
  );
}
