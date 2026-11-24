import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IELTS Tập 5 (band 7.0 → 8.0) — Tiếng Anh',
  description: 'IELTS 4 kỹ năng Tập 5: 30 ngày từ band 7.0 lên 8.0 — độ chính xác tuyệt đối, 4 đề thi đủ (Đề 9–12), mổ đề từng câu, Writing/Speaking band 8, luyện giám khảo AI.',
  alternates: { canonical: 'https://cuongthai.com/language/en/ielts/tap-5' },
};

export default function IeltsTap5Layout({ children }: { children: React.ReactNode }) {
  return children;
}
