import type { Metadata } from 'next';
import { HuongDanApp } from '@/components/appsite/trang';
import { CTLANGUAGE_SITE } from '../site';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Hướng dẫn sử dụng',
  description: 'Hướng dẫn dùng CT Language từng bước: bắt đầu, học từ vựng, hỏi CuongMini, học qua video, từ điển và dịch, luyện thi, sổ tay, tài khoản và gói Pro.',
  alternates: { canonical: 'https://cuongthai.com/language/app/huong-dan' },
};

export default function Page() {
  return <HuongDanApp site={CTLANGUAGE_SITE} />;
}
