import type { Metadata } from 'next';

/**
 * CTW đợt 7b — điền form (công khai / nội bộ): layout máy chủ chỉ để đặt metadata (noindex, không gửi referrer — link là
 * bí mật). Khung /work (WorkShell) tự bỏ sidebar cho đường /work/form/*; middleware không đòi đăng nhập ở đây.
 */
export const metadata: Metadata = {
  title: 'Form',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
  openGraph: { title: 'Form · CT Work', description: 'Fill in a short form — it goes straight to the team.' },
};

export default function FormLayout({ children }: { children: React.ReactNode }) {
  return children;
}
