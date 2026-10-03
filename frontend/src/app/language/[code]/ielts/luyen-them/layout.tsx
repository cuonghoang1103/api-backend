import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Luyện thêm IELTS theo chặng — Tiếng Anh',
  description: 'Kho luyện IELTS 4 chặng band 0 → 7.5: bài học ngữ pháp, từ vựng, nghe, đọc, viết, nói, có lời giải từng câu.',
  alternates: { canonical: 'https://cuongthai.com/language/en/ielts/luyen-them' },
};

export default function LuyenThemLayout({ children }: { children: React.ReactNode }) {
  return children;
}
