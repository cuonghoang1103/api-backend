import { absMedia, apiData, plain, siteImage } from '@/lib/og/siteCards';

// UX-D: ảnh xem trước riêng (Blog) — tiêu đề thật của trang thay vì ảnh chung của cả site.
export const runtime = 'nodejs';
export const alt = 'Blog · CuongThai';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  // Tuyến by-slug của blog TĂNG lượt xem — ảnh OG dùng bản tin gọn (meta) nếu có, không thì vẫn gọi (bot hiếm).
  const p = await apiData<any>(`blog/posts/by-slug/${encodeURIComponent(params.slug)}`);
  return siteImage({
    kind: 'Blog', title: plain(p?.title) || 'Blog CuongThai', subtitle: plain(p?.excerpt) || null,
    meta: [p?.category?.name ?? '', ...(Array.isArray(p?.tags) ? p.tags.slice(0, 3).map((t: any) => (typeof t === 'string' ? t : t?.name ?? t?.tag?.name ?? '')) : [])].filter(Boolean),
    image: absMedia(p?.thumbnailUrl), accent: ['#ec4899', '#8b5cf6'],
  });
}
