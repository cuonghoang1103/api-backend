import { absMedia, apiData, plain, siteImage } from '@/lib/og/siteCards';

// UX-D: ảnh xem trước riêng (Blog) — tiêu đề thật của trang thay vì ảnh chung của cả site.
export const runtime = 'nodejs';
export const alt = 'Blog · CuongThai';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const a = await apiData<any>(`tech-trends/articles/by-slug/${encodeURIComponent(params.slug)}`);
  return siteImage({
    kind: 'Blog · Tech trends', title: plain(a?.title) || 'Tech trends', subtitle: plain(a?.summary) || null,
    meta: [a?.category ?? '', a?.readingMinutes ? `${a.readingMinutes} phút đọc` : ''].filter(Boolean),
    image: absMedia(a?.coverImageUrl), accent: ['#06b6d4', '#22c55e'],
  });
}
