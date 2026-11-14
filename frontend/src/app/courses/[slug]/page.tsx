import type { Metadata } from 'next';
import { getServerApiBaseUrl } from '@/lib/server-api';
import { pickLang } from '@/lib/utils';
import type { Course } from '@/types';
import CoursePageClient from './CoursePageClient';
import { OG_SITE, ogImageOr } from '@/lib/og/pickImage'; // UX-D

// SEO / social-share metadata AND the first paint of the course page are rendered SERVER-side (14/11/2026): before,
// the page shipped only a spinner (`loading = true` until JS fetched the course) ⇒ Googlebot / link previews / AI
// readers saw no <h1>, no description, no table of contents. The client still refetches with the viewer's session
// for the per-user parts (enrolled, progress, "continue" button). `force-dynamic` keeps this out of the build
// (backend isn't up during build).
export const dynamic = 'force-dynamic';

const CACHE_TTL_SECONDS = 300;

interface PageProps {
  params: { slug: string };
}

/**
 * PUBLIC view of the course — deliberately WITHOUT the viewer's cookie: the result is cached (revalidate) and handed
 * to the client as `initialCourse`, so it must never carry one person's enrolment/progress/admin flags. `?gon=1` is the
 * same lean landing-page payload the client asks for (no lesson `content`, plus `baoGom`), so the numbers in the server
 * HTML match what the client renders after its own fetch. generateMetadata and the page call this with identical
 * arguments ⇒ Next dedupes them into one backend request.
 */
// Course & loose extras: generateMetadata also probes legacy field names (name/summary/coverImage…).
type KhoaCongKhai = Course & Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

async function getCourse(slug: string): Promise<KhoaCongKhai | null> {
  try {
    const res = await fetch(
      `${getServerApiBaseUrl()}/api/v1/courses/${encodeURIComponent(slug)}?gon=1`,
      {
        headers: { accept: 'application/json' },
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
      images: ogImageOr(image, url), // UX-D: không có ảnh PNG/JPEG ⇒ ảnh động opengraph-image.tsx
      ...OG_SITE,
    },
    twitter: {
      card: 'summary_large_image', // UX-D: luôn ảnh lớn — opengraph-image.tsx cùng thư mục có tiêu đề thật
      title: rawTitle,
      description,
      images: ogImageOr(image, url),
    },
  };
}

/** Máy chủ trả "Vietnamese"/"English"; schema.org ưu tiên mã BCP 47. */
const MA_NGON_NGU: Record<string, string> = { Vietnamese: 'vi', English: 'en', Japanese: 'ja', Chinese: 'zh', Korean: 'ko' };

/** "PT2H15M" — schema.org Duration (ISO 8601). Dưới 1 phút ⇒ không khai. */
function isoThoiLuong(giay: number): string | undefined {
  if (!giay || giay < 60) return undefined;
  const h = Math.floor(giay / 3600);
  const m = Math.round((giay % 3600) / 60);
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}`;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const course = await getCourse(params.slug);

  const url = `https://cuongthai.com/courses/${params.slug}`;
  const giayVideo: number = course?.baoGom?.giayVideo ?? course?.totalDurationSeconds ?? 0;
  // Cùng luật với CoursePageClient: accessType là nguồn chuẩn, isFree chỉ là dự phòng.
  const mienPhi = (course?.accessType || (course?.isFree ? 'FREE' : 'PAID')) === 'FREE';
  const jsonLd = course
    ? {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: pickLang(course.title || course.name, 'en'),
        description: toText(pickLang(course.shortDescription || course.summary || course.description, 'en')),
        image: course.thumbnailUrl || course.thumbnail || course.coverImage || course.image || undefined,
        url,
        ...(course.courseCode ? { courseCode: course.courseCode } : {}),
        ...(course.language ? { inLanguage: MA_NGON_NGU[course.language] ?? course.language } : {}),
        provider: {
          '@type': 'Organization',
          name: 'CuongThai',
          sameAs: 'https://cuongthai.com',
        },
        ...(mienPhi
          ? { isAccessibleForFree: true, offers: { '@type': 'Offer', category: 'Free', price: 0, priceCurrency: 'VND' } }
          : {}),
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'Online',
          ...(isoThoiLuong(giayVideo) ? { courseWorkload: isoThoiLuong(giayVideo) } : {}),
        },
        // Mục lục (tên chương) — cùng dữ liệu đang hiện trong HTML; cắt 50 chương cho gọn.
        ...((course.sections?.length ?? 0) > 0
          ? {
              syllabusSections: (course.sections ?? []).slice(0, 50).map((sec) => ({
                '@type': 'Syllabus',
                name: pickLang(sec.title, 'en'),
              })),
            }
          : {}),
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
      {/* initialCourse = bản CÔNG KHAI ⇒ hero + mục lục có ngay trong HTML server; lỗi/404 ⇒ null ⇒ client tự tải như cũ. */}
      <CoursePageClient initialCourse={course} />
    </>
  );
}
