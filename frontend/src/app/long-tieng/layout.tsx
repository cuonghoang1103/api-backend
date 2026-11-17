import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CT Lồng Tiếng',
  description: 'Lồng tiếng Việt bằng giọng chủ kênh cho video kỹ thuật — chỉ quản trị viên.',
  robots: { index: false, follow: false },
};

export default function LongTiengLayout({ children }: { children: React.ReactNode }) {
  return children;
}
