import type { Metadata } from 'next';
import { ProApp } from '@/components/appsite/trang';
import { CTLANGUAGE_SITE } from '../site';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'CT Language Pro',
  description: 'So sánh bản miễn phí và CT Language Pro: giới hạn CuongMini, gọi thoại, thi thử, sổ từ, học offline; giá 49.000 ₫/tháng hoặc 399.000 ₫/năm, 7 ngày dùng thử.',
  alternates: { canonical: 'https://cuongthai.com/language/app/pro' },
};

export default function Page() {
  return <ProApp site={CTLANGUAGE_SITE} />;
}
