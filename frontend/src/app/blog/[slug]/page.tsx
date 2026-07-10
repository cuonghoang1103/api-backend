import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getServerApiBaseUrl } from '@/lib/server-api';
import BlogPostPageClient from './BlogPostPageClient';

// SEO / social-share metadata is rendered SERVER-side here; the interactive
// article (comments, share buttons, related posts) stays in the client
// component, which fetches its own data exactly as before. `force-dynamic`
// keeps generateMetadata out of the production build — the backend isn't
// running during `npm run build`, so a build-time fetch would just fail.
export const dynamic = 'force-dynamic';

const CACHE_TTL_SECONDS = 300;

interface PageProps {
  params: { slug: string };
}

async function getPost(slug: string) {
  try {
    const res = await fetch(
      `${getServerApiBaseUrl()}/api/v1/blog/posts/by-slug/${encodeURIComponent(slug)}`,
      {
        headers: { cookie: headers().get('cookie') ?? '', accept: 'application/json' },
        next: { revalidate: CACHE_TTL_SECONDS },
      },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

// Strip markdown/html to a plain-text meta description.
const toText = (s?: string, n = 200) =>
  (s ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/[#*`>_~]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, n);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Bài viết | CuongThai' };

  const rawTitle: string = post.title || post.name || 'Bài viết';
  const title = `${rawTitle} | Blog | CuongThai`;
  const description = toText(post.excerpt || post.summary || post.content) || 'Bài viết trên CuongThai.';
  const image: string | undefined = post.thumbnailUrl || post.coverImage || post.thumbnail || undefined;
  const url = `https://cuongthai.com/blog/${params.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: rawTitle,
      description,
      url,
      type: 'article',
      images: image ? [image] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: rawTitle,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPost(params.slug);

  const jsonLd = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title || post.name,
        description: toText(post.excerpt || post.summary || post.content),
        image: post.thumbnailUrl || post.coverImage || post.thumbnail || undefined,
        datePublished: post.publishedAt || post.createdAt || undefined,
        dateModified: post.updatedAt || undefined,
        author: post.authorName ? { '@type': 'Person', name: post.authorName } : undefined,
        mainEntityOfPage: `https://cuongthai.com/blog/${params.slug}`,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          // Escape `<` so a title containing `</script>` can't break out.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      )}
      <BlogPostPageClient />
    </>
  );
}
