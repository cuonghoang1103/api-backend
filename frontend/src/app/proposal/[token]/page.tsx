import type { Metadata } from 'next';
import ProposalClient from './ProposalClient';

// Trang khách xem đề xuất qua link có token — riêng tư, không bao giờ lên kết quả tìm kiếm.
export const metadata: Metadata = {
  title: 'Đề xuất dự án',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: 'no-referrer',
};

export default function ProposalPage({ params }: { params: { token: string } }) {
  return <ProposalClient token={params.token} />;
}
