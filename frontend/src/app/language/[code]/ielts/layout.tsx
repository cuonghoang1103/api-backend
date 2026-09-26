import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IELTS nền tảng — Tiếng Anh',
  description: 'Học IELTS từ con số 0 trong 15 ngày: ngữ pháp, từ vựng, nghe, đọc, viết, nói, có gia sư AI giải thích từng trang.',
  alternates: { canonical: 'https://cuongthai.com/language/en/ielts' },
};

export default function IeltsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
