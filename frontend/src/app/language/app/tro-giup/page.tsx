import type { Metadata } from 'next';
import { TroGiupApp } from '@/components/appsite/trang';
import { CTLANGUAGE_SITE } from '../site';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Trợ giúp',
  description: 'Câu hỏi thường gặp về CT Language: miễn phí, tài khoản, CuongMini, gói Pro, huỷ thuê bao, xoá tài khoản, liên hệ hỗ trợ.',
  alternates: { canonical: 'https://cuongthai.com/language/app/tro-giup' },
};

export default function Page() {
  return <TroGiupApp site={CTLANGUAGE_SITE} />;
}
