import type { Metadata } from 'next';
import { shareMetadata } from '@/lib/og/workMeta';

/**
 * Link chia sẻ chỉ đọc — layout máy chủ chỉ để đặt metadata: KHÔNG cho máy
 * tìm kiếm lập chỉ mục (link là bí mật, lộ lên Google là lộ dự án).
 * Khung /work (layout cha) tự bỏ sidebar cho đường /work/share/*.
 */
export const dynamic = 'force-dynamic';

// UX-D: og:title = tên dự án · workspace, mô tả có % tiến độ + sprint (chỉ khi link vốn cho xem); vẫn noindex + no-referrer.
export function generateMetadata({ params }: { params: { token: string } }): Promise<Metadata> {
  return shareMetadata(params.token);
}

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
