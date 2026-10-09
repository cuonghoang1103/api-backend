import { shareImage, type ShareCardData } from '@/lib/og/ctWorkCards';
import { fetchCard } from '@/lib/og/og';

// UX-D: link công khai chỉ đọc — dự án, bìa, % tiến độ, sprint (chỉ thứ link vốn cho xem).
export const runtime = 'nodejs';
export const alt = 'Shared CT Work project';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { token: string } }) {
  return shareImage(await fetchCard<ShareCardData>(`share-card/${encodeURIComponent(params.token)}`, 300));
}
