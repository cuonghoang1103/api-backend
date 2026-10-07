import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IELTS Flashcards — 100 từ mỗi ngày',
  description: 'Học từ vựng IELTS bằng thẻ lật có lặp lại ngắt quãng: 100 từ mới mỗi ngày, ôn đúng hạn, Match, nghe-gõ chính tả, thống kê nhớ sau 7 ngày.',
  alternates: { canonical: 'https://cuongthai.com/language/en/ielts/the-tu' },
};

export default function TheTuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
