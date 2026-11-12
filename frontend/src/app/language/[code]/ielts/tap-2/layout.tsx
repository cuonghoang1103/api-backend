import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IELTS Tập 2 (band 4.0 → 5.0) — Tiếng Anh',
  description: 'IELTS 4 kỹ năng Tập 2: 24 ngày từ band 4.0 lên 5.0 — ngữ pháp B1, từ vựng học thuật AWL, đủ dạng Reading/Listening, Writing trọn bài, Speaking Part 2–3, kiểm tra chặng và gia sư AI.',
  alternates: { canonical: 'https://cuongthai.com/language/en/ielts/tap-2' },
};

export default function IeltsTap2Layout({ children }: { children: React.ReactNode }) {
  return children;
}
