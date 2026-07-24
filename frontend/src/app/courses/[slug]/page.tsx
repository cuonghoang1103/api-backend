import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getServerApiBaseUrl } from '@/lib/server-api';
import { pickLang } from '@/lib/utils';
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

  // Titles/descriptions may be bilingual ("EN|||VI"); use the English half for
  // SEO/OG (the app default locale) so "|||" never leaks into the tab or cards.
  const rawTitle: string = pickLang(course.title || course.name || 'Khoá học', 'en');
  const title = `${rawTitle} | Khoá học | CuongThai`;
  const description =
    toText(pickLang(course.shortDescription || course.summary || course.description, 'en')) ||
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
        name: pickLang(course.title || course.name, 'en'),
        description: toText(pickLang(course.shortDescription || course.summary || course.description, 'en')),
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
