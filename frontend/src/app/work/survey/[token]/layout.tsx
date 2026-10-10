import type { Metadata } from 'next';

/**
 * CTW đợt 6b — khảo sát công khai: layout máy chủ chỉ để đặt metadata (noindex, không gửi referrer — link là bí mật).
 * Khung /work (WorkShell) tự bỏ sidebar cho đường /work/survey/*; middleware không đòi đăng nhập ở đây.
 */
export const metadata: Metadata = {
  title: 'Survey',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
  openGraph: { title: 'Survey · CT Work', description: 'Answer a short survey — no account needed.' },
};

export default function SurveyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
