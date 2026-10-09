import { absMedia, apiData, plain, siteImage } from '@/lib/og/siteCards';

// UX-D: ảnh xem trước riêng (Dự án) — tiêu đề thật của trang thay vì ảnh chung của cả site.
export const runtime = 'nodejs';
export const alt = 'Dự án · CuongThai';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const p = await apiData<any>(`projects/${encodeURIComponent(params.slug)}`);
  const tech = Array.isArray(p?.techStack) ? p.techStack : Array.isArray(p?.technologies) ? p.technologies : [];
  return siteImage({
    kind: 'Dự án', title: plain(p?.title || p?.name) || 'Dự án trên CuongThai', subtitle: plain(p?.shortDescription || p?.summary || p?.description) || null,
    meta: tech.slice(0, 4).map((t: any) => (typeof t === 'string' ? t : t?.name ?? '')).filter(Boolean),
    image: absMedia(p?.thumbnailUrl || p?.thumbnail || p?.coverImage), accent: ['#f59e0b', '#ec4899'],
  });
}
