import type { Metadata } from 'next';
import LongTiengStudio from '@/components/admin/longTieng/LongTiengStudio';

export const metadata: Metadata = {
  title: 'CT Lồng Tiếng',
  description: 'Lồng tiếng Việt bằng giọng chủ kênh cho video kỹ thuật — chỉ quản trị viên.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LongTiengStudio />;
}
