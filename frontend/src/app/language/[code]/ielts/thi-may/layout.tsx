import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IELTS Online Test — thi trên máy tính',
  description: 'Làm đề IELTS Reading, Listening, Writing theo giao diện thi trên máy tính: đồng hồ, hai cột kéo được, tô sáng, ghi chú, cờ xem lại, band ước tính và AI chấm Writing.',
  alternates: { canonical: 'https://cuongthai.com/language/en/ielts/thi-may' },
};

export default function ThiMayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
