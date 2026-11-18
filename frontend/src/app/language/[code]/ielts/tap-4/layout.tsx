import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IELTS Tập 4 (band 6.0 → 7.0) — Tiếng Anh',
  description: 'IELTS 4 kỹ năng Tập 4: 30 ngày từ band 6.0 lên 7.0 — ngữ pháp C1, AWL sublist 7–10, collocation học thuật, Passage 3 và Part 4, Writing band 7 không lỗi, Speaking band 7, kiểm tra chặng và giám khảo AI.',
  alternates: { canonical: 'https://cuongthai.com/language/en/ielts/tap-4' },
};

export default function IeltsTap4Layout({ children }: { children: React.ReactNode }) {
  return children;
}
