import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getServerApiBaseUrl } from '@/lib/server-api';
import CoursePageClient from './CoursePageClient';

// SEO / social-share metadata rendered SERVER-side; the interactive course
// page stays client-side and fetches its own data as before. `force-dynamic`
// keeps generateMetadata out of the build (backend isn't up during build).
export const dynamic = 'force-dynamic';

const CACHE_TTL_SECONDS = 300;

interface PageProps {
  params: { slug: string };
}

async function getCourse(slug: string) {
  try {
    const res = await fetch(
      `${getServerApiBaseUrl()}/api/v1/courses/${encodeURIComponent(slug)}`,
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

const toText = (s?: string, n = 200) =>
  (s ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/[#*`>_~]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, n);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const course = await getCourse(params.slug);
  if (!course) return { title: 'Khoá học | CuongThai' };

  const rawTitle: string = course.title || course.name || 'Khoá học';
  const title = `${rawTitle} | Khoá học | CuongThai`;
  const description =
    toText(course.shortDescription || course.summary || course.description) ||
    'Khoá học trên CuongThai.';
  const image: string | undefined =
    course.thumbnailUrl || course.thumbnail || course.coverImage || course.image || undefined;
  const url = `https://cuongthai.com/courses/${params.slug}`;

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

export default async function CourseDetailPage({ params }: PageProps) {
  const course = await getCourse(params.slug);

  const jsonLd = course
    ? {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: course.title || course.name,
        description: toText(course.shortDescription || course.summary || course.description),
        image: course.thumbnailUrl || course.thumbnail || course.coverImage || course.image || undefined,
        url: `https://cuongthai.com/courses/${params.slug}`,
        provider: {
          '@type': 'Organization',
          name: 'CuongThai',
          sameAs: 'https://cuongthai.com',
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      )}
      <CoursePageClient />
    </>
  );
}
