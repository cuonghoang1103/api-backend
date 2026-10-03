import type { Metadata } from 'next';
import LookupClient from './LookupClient';

const DESCRIPTION =
  'Tra cứu trạng thái phiếu yêu cầu dự án bằng mã phiếu (YC-…) và email đã dùng khi gửi: phiếu đang ở bước nào, bước tiếp theo là gì, lời nhắn của studio và link xem tiến độ dự án.';

export const metadata: Metadata = {
  title: 'Tra cứu phiếu yêu cầu',
  alternates: { canonical: 'https://cuongthai.com/about/nhan-du-an/tra-cuu' },
  description: DESCRIPTION,
  // Trang tiện ích cá nhân — không cần lên kết quả tìm kiếm.
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Tra cứu phiếu yêu cầu — CuongHoang',
    description: DESCRIPTION,
    url: 'https://cuongthai.com/about/nhan-du-an/tra-cuu',
    type: 'website',
  },
};

export default function LookupPage() {
  return <LookupClient />;
}
