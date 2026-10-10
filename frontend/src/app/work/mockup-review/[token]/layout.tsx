import type { Metadata } from 'next';

/**
 * CTW đợt 6b — link khách xác nhận prototype: layout máy chủ chỉ để đặt metadata (noindex, không gửi referrer).
 * Khung /work (WorkShell) tự bỏ sidebar cho đường /work/mockup-review/*; middleware không đòi đăng nhập ở đây.
 */
export const metadata: Metadata = {
  title: 'Prototype review',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
  openGraph: { title: 'Prototype review · CT Work', description: 'Confirm a screen design before it is built — no account needed.' },
};

export default function MockupReviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
