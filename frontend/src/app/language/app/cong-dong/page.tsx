import type { Metadata } from 'next';
import { CongDongApp } from '@/components/appsite/trang';
import { CTLANGUAGE_SITE } from '../site';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Cộng đồng',
  description: 'Cộng đồng CT Language: hỏi đáp tiếng Nhật, Trung, Anh, diễn đàn CuongThai, góp ý và quy tắc cộng đồng.',
  alternates: { canonical: 'https://cuongthai.com/language/app/cong-dong' },
};

export default function Page() {
  return <CongDongApp site={CTLANGUAGE_SITE} />;
}
