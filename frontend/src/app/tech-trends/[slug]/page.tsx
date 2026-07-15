import type { Metadata } from 'next';
import Link from 'next/link';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { getServerApiBaseUrl } from '@/lib/server-api';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import type { PublicTechTrendArticle } from '@/lib/api';
import ArticleActions from './ArticleActions';

/**
 * Tech Trends — article detail page (SSR).
 *
 * Unlike the index (/tech-trends), this route server-renders the
 * full article HTML into the initial response, so:
 *   - crawlers see the real long-form content (the index is a
 *     client component and ships an empty shell)
 *   - each article has a stable permalink (/tech-trends/<slug>),
 *     its own canonical URL, OpenGraph card, and JSON-LD
 *   - the by-slug fetch increments viewCount server-side, so the
 *     admin "Views" column finally reflects reality
 *
 * `force-dynamic` keeps generateMetadata + the page fetch out of
 * the production build (the backend isn't up during `npm run
 * build`). The `cache()` wrapper dedupes the two calls within a
 * single request so we hit the backend — and increment the view
 * counter — exactly once per page load.
 */
export const dynamic = 'force-dynamic';

const SITE_URL = 'https://cuongthai.com';

interface PageProps {
  params: { slug: string };
}

const getArticle = cache(async (slug: string): Promise<PublicTechTrendArticle | null> => {
  try {
    const res = await fetch(
      `${getServerApiBaseUrl()}/api/v1/tech-trends/articles/by-slug/${encodeURIComponent(slug)}`,
      { headers: { accept: 'application/json' }, cache: 'no-store' },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data as PublicTechTrendArticle) ?? null;
  } catch {
    return null;
  }
});

const CATEGORY_LABEL: Record<string, { emoji: string; label: string }> = {
  TechNews: { emoji: '📰', label: '#TechNews' },
  FixBug: { emoji: '🐛', label: '#FixBug' },
  Experience: { emoji: '💼', label: '#Experience' },
  Interviews: { emoji: '🎯', label: '#Interviews' },
};

function authorName(a: PublicTechTrendArticle['author']): string {
  if (!a) return 'CuongThai';
  return a.displayName || a.fullName || a.username || 'CuongThai';
}

function formatDate(iso: string | null): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return { title: 'Bài viết | Tech Trends | CuongThai' };

  const title = `${article.title} | Tech Trends | CuongThai`;
  const description = (article.summary || '').slice(0, 200);
  const url = `${SITE_URL}/tech-trends/${params.slug}`;
  const image = article.coverImageUrl || undefined;

  return {
    title,
    description,
    keywords: article.tags?.length ? article.tags : undefined,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description,
      url,
      type: 'article',
      publishedTime: article.publishedAt || undefined,
      modifiedTime: article.updatedAt || undefined,
      authors: [authorName(article.author)],
      tags: article.tags,
      images: image ? [image] : ['/opengraph-image'],
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: article.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function TechTrendArticlePage({ params }: PageProps) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const cat = CATEGORY_LABEL[article.category] ?? { emoji: '🏷️', label: `#${article.category}` };
  const url = `${SITE_URL}/tech-trends/${params.slug}`;
  const displayCover = article.coverEmoji || cat.emoji;
  const html = sanitizeHtml(article.bodyHtml);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.summary,
    image: article.coverImageUrl || undefined,
    datePublished: article.publishedAt || article.createdAt || undefined,
    dateModified: article.updatedAt || undefined,
    author: { '@type': 'Person', name: authorName(article.author) },
    keywords: article.tags?.join(', ') || undefined,
    articleSection: article.category,
    mainEntityOfPage: url,
    wordCount: html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length,
  };

  return (
    <div className="min-h-screen pt-24 pb-24" style={{ background: '#0a0a0f' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      {/* Decorative glow — matches the index aesthetic */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-neon-indigo/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-neon-fuchsia/10 rounded-full blur-3xl" />
      </div>

      <article className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / back */}
        <nav className="mb-6 text-sm text-text-muted flex items-center gap-1.5">
          <Link href="/tech-trends" className="hover:text-neon-violet transition-colors">
            Tech Trends
          </Link>
          <span>/</span>
          <span className="text-text-secondary">{cat.label}</span>
        </nav>

        {/* Cover */}
        <div className="relative w-full overflow-hidden rounded-2xl border border-darkborder aspect-[3/1] mb-8">
          {article.coverImageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.coverImageUrl} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/30 to-transparent" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-darksurface via-darkcard to-darksurface" />
              <div className="absolute inset-0 bg-gradient-to-br from-neon-indigo/10 via-transparent to-neon-fuchsia/10" />
              <div className="absolute inset-0 flex items-center justify-center text-8xl select-none">{displayCover}</div>
            </>
          )}
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-black/40 text-white border border-white/10 backdrop-blur-md">
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </span>
        </div>

        {/* Title + meta */}
        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-text-primary tracking-tight leading-[1.15]">
            {article.title}
          </h1>
          <p className="mt-4 text-lg text-text-secondary leading-relaxed">{article.summary}</p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {article.author?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={article.author.avatarUrl} alt={authorName(article.author)} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center text-sm font-bold text-white">
                  {authorName(article.author).slice(0, 1).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-text-primary">{authorName(article.author)}</p>
                <p className="text-xs text-text-muted">
                  {formatDate(article.publishedAt || article.createdAt)} · {article.readTimeMin} phút đọc · {article.viewCount} lượt xem
                </p>
              </div>
            </div>
            <ArticleActions articleId={article.id} title={article.title} summary={article.summary} url={url} />
          </div>
        </header>

        {/* Body + TOC */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 min-w-0">
            {/* Code comparison (FixBug) */}
            {article.codeBlock && (
              <div className="mb-8 rounded-xl border border-darkborder overflow-hidden bg-[#0a0c14]">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-darkborder">
                  <div>
                    <div className="px-3 py-2 border-b border-darkborder bg-red-500/5 text-[11px] font-semibold text-neon-red uppercase tracking-wider">
                      Before · Error <span className="ml-1 font-mono text-text-muted normal-case">{article.codeBlock.before.lang}</span>
                    </div>
                    <pre className="p-3 text-xs font-mono text-text-secondary overflow-x-auto"><code>{article.codeBlock.before.lines.join('\n')}</code></pre>
                  </div>
                  <div>
                    <div className="px-3 py-2 border-b border-darkborder bg-emerald-500/5 text-[11px] font-semibold text-neon-emerald uppercase tracking-wider">
                      After · Solution <span className="ml-1 font-mono text-text-muted normal-case">{article.codeBlock.after.lang}</span>
                    </div>
                    <pre className="p-3 text-xs font-mono text-text-secondary overflow-x-auto"><code>{article.codeBlock.after.lines.join('\n')}</code></pre>
                  </div>
                </div>
                <div className="px-3 py-2.5 bg-neon-violet/5 border-t border-darkborder text-xs text-text-secondary">
                  <span className="font-semibold text-text-primary">Takeaway:</span> {article.codeBlock.takeaway}
                </div>
              </div>
            )}

            {/* Article body — server-rendered HTML */}
            {html ? (
              <div className="tech-prose !max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <p className="text-text-muted">Nội dung đang được cập nhật.</p>
            )}

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-darkborder flex flex-wrap gap-2">
                {article.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/tech-trends?q=${encodeURIComponent(t)}`}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-white/[0.04] text-text-secondary border border-white/[0.06] hover:text-neon-violet hover:border-neon-violet/30 transition-colors"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* TOC sidebar */}
          {article.toc.length > 0 && (
            <aside className="hidden lg:block lg:col-span-4">
              <div className="sticky top-24">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Mục lục</p>
                <nav className="space-y-1 border-l border-darkborder">
                  {article.toc.map((item, i) => (
                    <a
                      key={`${item.id}-${i}`}
                      href={`#${item.id}`}
                      className={[
                        'block py-1 text-sm text-text-muted hover:text-neon-violet transition-colors border-l-2 border-transparent hover:border-neon-violet -ml-px',
                        item.level === 1 ? 'pl-3 font-medium' : item.level === 2 ? 'pl-5' : 'pl-7 text-[13px]',
                      ].join(' ')}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>

        {/* Back to index */}
        <div className="mt-14 pt-8 border-t border-darkborder">
          <Link
            href="/tech-trends"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-darkborder text-sm text-text-secondary hover:text-text-primary hover:border-neon-violet/30 transition-all"
          >
            ← Xem tất cả bài viết
          </Link>
        </div>
      </article>
    </div>
  );
}
