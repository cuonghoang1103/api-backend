import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Language',
  alternates: { canonical: 'https://cuongthai.com/language' },
  description:
    'Nền tảng học ngôn ngữ cá nhân — từ vựng, ngữ pháp, nghe, giao tiếp, đọc và Q&A với flashcard SRS, quiz và theo dõi tiến độ.',
  openGraph: {
    title: 'My Language — Học ngôn ngữ',
    description: 'Từ vựng, ngữ pháp, nghe, giao tiếp, đọc, Q&A + flashcard SRS và quiz.',
  },
};

export default function LanguageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
