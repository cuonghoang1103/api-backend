import type { Metadata } from 'next';
import Link from 'next/link';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { getServerApiBaseUrl } from '@/lib/server-api';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import type { PublicVoicePost, VoicePostCard } from '@/lib/api';
import { Eye, MessageSquare } from 'lucide-react';
import VoicePlayer from './VoicePlayer';
import VoiceActions from './VoiceActions';
import VoiceComments from './VoiceComments';
import ReaderTldr from './ReaderTldr';
import { typeMeta, posterFor, formatVoiceDate, formatDuration } from '../voiceMeta';

/**
 * Voice Hub — post detail (SSR).
 *
 * Server-renders the media + show-notes into the initial response so crawlers
 * see real content, each post gets a stable permalink + canonical + OpenGraph +
 * JSON-LD VideoObject, and the by-slug fetch increments viewCount server-side.
 *
 * `force-dynamic` keeps the fetch out of `npm run build` (the backend isn't up
 * then). `cache()` dedupes the metadata + page fetch within one request so the
 * view counter increments exactly once.
 */
export const dynamic = 'force-dynamic';

const SITE_URL = 'https://cuongthai.com';

interface PageProps {
  params: { slug: string };
}

interface DetailPayload {
  post: PublicVoicePost;
  related: VoicePostCard[];
}

const getPost = cache(async (slug: string): Promise<DetailPayload | null> => {
  try {
    const res = await fetch(
      `${getServerApiBaseUrl()}/api/v1/voice/posts/${encodeURIComponent(slug)}?view=1`,
      { headers: { accept: 'application/json' }, cache: 'no-store' },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data as DetailPayload) ?? null;
  } catch {
    return null;
  }
});

function authorName(a: PublicVoicePost['author']): string {
  if (!a) return 'CuongThai';
  return a.displayName || a.fullName || a.username || 'CuongThai';
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getPost(params.slug);
  if (!data) return { title: 'Voice | CuongThai' };
  const { post } = data;
  const meta = typeMeta(post.type);
  const title = `${post.title} | Voice | CuongThai`;
  const description = (post.summary || `${meta.label} bởi ${authorName(post.author)}`).slice(0, 200);
  const url = `${SITE_URL}/voice/${params.slug}`;
  const image = posterFor(post) || undefined;

  return {
    title,
    description,
    keywords: post.tags?.length ? post.tags : undefined,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      url,
      type: 'video.other',
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

export default async function VoiceDetailPage({ params }: PageProps) {
  const data = await getPost(params.slug);
  if (!data) notFound();

  const { post, related } = data;
  const meta = typeMeta(post.type);
  const url = `${SITE_URL}/voice/${params.slug}`;
  const html = sanitizeHtml(post.descriptionHtml || '');
  const image = posterFor(post) || undefined;
  const embedUrl = post.mediaKind === 'YOUTUBE' && post.youtubeId
    ? `https://www.youtube.com/embed/${post.youtubeId}`
    : post.videoUrl || post.audioUrl || undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': post.mediaKind === 'AUDIO' ? 'AudioObject' : 'VideoObject',
    name: post.title,
    description: post.summary || meta.label,
    thumbnailUrl: image ? [image] : undefined,
    uploadDate: post.publishedAt || post.createdAt || undefined,
    duration: post.durationSec ? `PT${post.durationSec}S` : undefined,
    contentUrl: post.videoUrl || post.audioUrl || undefined,
    embedUrl,
    author: { '@type': 'Person', name: authorName(post.author) },
    keywords: post.tags?.join(', ') || undefined,
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/WatchAction',
      userInteractionCount: post.viewCount,
    },
    mainEntityOfPage: url,
  };

  return (
    <div className="min-h-screen pt-24 pb-24" style={{ background: '#0a0a0f' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-neon-indigo/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-neon-fuchsia/10 rounded-full blur-3xl" />
      </div>

      <article className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-5 text-sm text-text-muted flex items-center gap-1.5">
          <Link href="/voice" className="hover:text-neon-violet transition-colors">Voice</Link>
          <span>/</span>
          <span className="text-text-secondary">{meta.emoji} {meta.label}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main column */}
          <div className="lg:col-span-8 min-w-0">
            <VoicePlayer post={post} />

            {/* Title + meta */}
            <header className="mt-6">
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary tracking-tight leading-tight">
                {post.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {post.author?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.author.avatarUrl} alt={authorName(post.author)} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center text-sm font-bold text-white">
                      {authorName(post.author).slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{authorName(post.author)}</p>
                    <p className="text-xs text-text-muted flex items-center gap-2">
                      <span>{formatVoiceDate(post.publishedAt || post.createdAt)}</span>
                      <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" />{post.viewCount}</span>
                      {post.durationSec ? <span>· {formatDuration(post.durationSec)}</span> : null}
                    </p>
                  </div>
                </div>
                <VoiceActions postId={post.id} title={post.title} url={url} initialLiked={post.likedByMe} initialLikes={post.likeCount} />
              </div>

              {post.series && (
                <Link href={`/voice?series=${encodeURIComponent(post.series.slug)}`} className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neon-violet/10 border border-neon-violet/20 text-sm text-neon-violet hover:bg-neon-violet/15 transition-colors">
                  📺 Series: {post.series.title}
                </Link>
              )}
            </header>

            {/* Reader AI (Pro) */}
            {(post.descriptionHtml || post.summary) && (
              <div className="mt-6">
                <ReaderTldr slug={post.slug} />
              </div>
            )}

            {/* Show-notes */}
            {post.summary && <p className="mt-6 text-lg text-text-secondary leading-relaxed">{post.summary}</p>}
            {html ? (
              <div className="tech-prose !max-w-none mt-4" dangerouslySetInnerHTML={{ __html: html }} />
            ) : null}

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-darkborder flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/voice?tag=${encodeURIComponent(t)}`}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-white/[0.04] text-text-secondary border border-white/[0.06] hover:text-neon-violet hover:border-neon-violet/30 transition-colors"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            )}

            {/* Comments */}
            <VoiceComments postId={post.id} />
          </div>

          {/* Related sidebar */}
          <aside className="lg:col-span-4">
            {related.length > 0 && (
              <div className="lg:sticky lg:top-24">
                <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Xem thêm</h2>
                <div className="space-y-4">
                  {related.map((r) => {
                    const rposter = posterFor(r);
                    const rm = typeMeta(r.type);
                    return (
                      <Link key={r.id} href={`/voice/${r.slug}`} className="group flex gap-3">
                        <div className="relative shrink-0 w-32 aspect-video rounded-lg overflow-hidden border border-darkborder bg-darkbg">
                          {rposter ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={rposter} alt="" className="absolute inset-0 w-full h-full object-cover" />
                          ) : (
                            <div className={['absolute inset-0 bg-gradient-to-br opacity-40', rm.accent].join(' ')} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] text-neon-violet mb-0.5">{rm.emoji} {rm.label}</p>
                          <p className="text-sm font-semibold text-text-primary leading-snug line-clamp-2 group-hover:text-neon-violet transition-colors">{r.title}</p>
                          <p className="mt-1 text-[11px] text-text-muted flex items-center gap-2">
                            <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" />{r.viewCount}</span>
                            <span className="inline-flex items-center gap-1"><MessageSquare className="w-3 h-3" />{r.commentCount}</span>
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        </div>

        <div className="mt-14 pt-8 border-t border-darkborder">
          <Link
            href="/voice"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-darkborder text-sm text-text-secondary hover:text-text-primary hover:border-neon-violet/30 transition-all"
          >
            ← Về trang Voice
          </Link>
        </div>
      </article>
    </div>
  );
}
