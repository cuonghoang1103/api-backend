import type { Metadata } from 'next';

/**
 * Link chia sẻ chỉ đọc — layout máy chủ chỉ để đặt metadata: KHÔNG cho máy
 * tìm kiếm lập chỉ mục (link là bí mật, lộ lên Google là lộ dự án).
 * Khung /work (layout cha) tự bỏ sidebar cho đường /work/share/*.
 */
export const metadata: Metadata = {
  title: 'Shared project · CT Work',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: 'no-referrer',
};

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
