import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IELTS Tập 3 (band 5.0 → 6.0) — Tiếng Anh',
  description: 'IELTS 4 kỹ năng Tập 3: 30 ngày từ band 5.0 lên 6.0 — ngữ pháp B2, AWL sublist 3–6, paraphrase, Writing band 6 đủ 7 dạng Task 1 và 5 dạng Task 2, Speaking Part 3 có mức độ, kiểm tra chặng và giám khảo AI.',
  alternates: { canonical: 'https://cuongthai.com/language/en/ielts/tap-3' },
};

export default function IeltsTap3Layout({ children }: { children: React.ReactNode }) {
  return children;
}
