import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sổ lỗi IELTS',
  description: 'Mỗi câu sai trong phòng thi tự vào Sổ lỗi theo kỹ năng và dạng câu: lý do sai, công thức rút ra, ôn lại có giãn cách, xuất CSV.',
  alternates: { canonical: 'https://cuongthai.com/language/en/ielts/so-loi' },
};

export default function SoLoiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
