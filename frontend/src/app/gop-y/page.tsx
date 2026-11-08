import type { Metadata } from 'next';
import { Suspense } from 'react';
import TrangGopY from '@/components/gopY/TrangGopY';

export const metadata: Metadata = {
  title: 'Góp ý & báo lỗi',
  description: 'Gặp lỗi, muốn có thêm tính năng hay muốn góp ý cho CuongThai? Gửi ở đây — mọi góp ý đều được đọc và trả lời.',
  alternates: { canonical: '/gop-y' },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <TrangGopY />
    </Suspense>
  );
}
