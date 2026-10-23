import type { Metadata } from 'next';
import XemVoCongKhai from './XemVoCongKhai';

// Trang riêng tư của một người, chỉ người có link mới xem — không lập chỉ mục.
export const metadata: Metadata = {
  title: 'Trang vở viết tay · Chỉ xem',
  robots: { index: false, follow: false, nocache: true },
  referrer: 'no-referrer',
};

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <XemVoCongKhai token={token} />;
}
