import { absMedia, apiData, plain, siteImage } from '@/lib/og/siteCards';

// UX-D: ảnh xem trước riêng (Khoá học) — tiêu đề thật của trang thay vì ảnh chung của cả site.
export const runtime = 'nodejs';
export const alt = 'Khoá học · CuongThai';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const c = await apiData<any>(`courses/${encodeURIComponent(params.slug)}`);
  const lessons = c?.totalLessons ?? c?.lessonCount ?? c?._count?.lessons;
  return siteImage({
    kind: 'Khoá học', title: plain(c?.title || c?.name, 'en') || 'Khoá học trên CuongThai',
    subtitle: plain(c?.shortDescription || c?.summary || c?.description, 'en') || null,
    meta: [c?.level ? String(c.level).toLowerCase().replace(/^./, (x: string) => x.toUpperCase()) : '', lessons ? `${lessons} bài học` : '', c?.category?.name ?? ''].filter(Boolean),
    image: absMedia(c?.thumbnailUrl || c?.thumbnail || c?.coverImage),
  });
}
