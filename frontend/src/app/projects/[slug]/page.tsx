import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getServerApiBaseUrl } from '@/lib/server-api';
import ProjectPageClient from './ProjectPageClient';

// SEO / social-share metadata rendered SERVER-side; the interactive project
// page stays client-side and fetches its own data as before. `force-dynamic`
// keeps generateMetadata out of the build (backend isn't up during build).
export const dynamic = 'force-dynamic';

const CACHE_TTL_SECONDS = 300;

interface PageProps {
  params: { slug: string };
}

async function getProject(slug: string) {
  try {
    const res = await fetch(
      `${getServerApiBaseUrl()}/api/v1/projects/${encodeURIComponent(slug)}`,
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
  const project = await getProject(params.slug);
  if (!project) return { title: 'Dự án | CuongThai' };

  const rawTitle: string = project.title || project.name || 'Dự án';
  const title = `${rawTitle} | Dự án | CuongThai`;
  const description =
    toText(project.shortDescription || project.summary || project.description) ||
    'Dự án trên CuongThai.';
  const image: string | undefined =
    project.thumbnailUrl || project.thumbnail || project.coverImage || project.image || undefined;
  const url = `https://cuongthai.com/projects/${params.slug}`;

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

export default async function ProjectDetailPage({ params }: PageProps) {
  const project = await getProject(params.slug);

  const jsonLd = project
    ? {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title || project.name,
        description: toText(project.shortDescription || project.summary || project.description),
        image:
          project.thumbnailUrl || project.thumbnail || project.coverImage || project.image || undefined,
        url: `https://cuongthai.com/projects/${params.slug}`,
        dateCreated: project.createdAt || undefined,
        dateModified: project.updatedAt || undefined,
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
      <ProjectPageClient />
    </>
  );
}
