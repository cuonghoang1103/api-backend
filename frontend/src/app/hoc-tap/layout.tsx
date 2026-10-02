import type { Metadata } from 'next';

// Khu riêng của từng người — không cho máy tìm kiếm đánh chỉ mục.
export const metadata: Metadata = {
  title: 'Huấn luyện học kỳ',
  description: 'AI lập kế hoạch từng môn, chấm bằng chứng bạn nộp và báo động tỷ lệ trượt.',
  robots: { index: false, follow: false },
};

export default function HocTapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
