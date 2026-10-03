import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phòng thi thử IELTS — Tiếng Anh',
  description: 'Làm đề IELTS thử đủ Listening, Reading, Writing theo đúng đồng hồ thi thật, xem lời giải từng câu và nhờ AI chấm bài viết.',
  alternates: { canonical: 'https://cuongthai.com/language/en/ielts/phong-thi' },
};

export default function PhongThiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
