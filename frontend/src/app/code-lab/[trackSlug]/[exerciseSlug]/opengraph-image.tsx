import { apiData, plain, siteImage } from '@/lib/og/siteCards';

// UX-D: ảnh xem trước riêng (Bài tập Code Lab) — tiêu đề thật của trang thay vì ảnh chung của cả site.
export const runtime = 'nodejs';
export const alt = 'Bài tập Code Lab · CuongThai';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { trackSlug: string; exerciseSlug: string } }) {
  const ex = await apiData<any>(`code-lab/exercises/${encodeURIComponent(params.exerciseSlug)}/meta`);
  return siteImage({
    kind: 'Code Lab · Bài tập', title: plain(ex?.title) || params.exerciseSlug, subtitle: plain(ex?.problemHtml) || null,
    meta: [ex?.track?.name ?? '', ex?.module?.name ?? '', ex?.language ?? '', ex?.difficulty ?? ''].filter(Boolean),
    accent: ['#22c55e', '#06b6d4'],
  });
}
