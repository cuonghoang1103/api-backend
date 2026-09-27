import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tiếng Nhật できる日本語 — Bài 0–15',
  description: 'Học tiếng Nhật từ con số 0 theo giáo trình Dekiru Nihongo (JPD113/JPD123): kana, hội thoại, từ vựng, ngữ pháp, chữ Hán, nghe, nói — có gia sư AI.',
  alternates: { canonical: 'https://cuongthai.com/language/ja/dekiru' },
};

export default function DekiruLayout({ children }: { children: React.ReactNode }) {
  return children;
}
