import type { Metadata } from 'next';
import { CapNhatApp } from '@/components/appsite/trang';
import { CTLANGUAGE_SITE } from '../site';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Có gì mới',
  description: 'Nhật ký cập nhật của app CT Language trên App Store.',
  alternates: { canonical: 'https://cuongthai.com/language/app/cap-nhat' },
};

export default function Page() {
  return <CapNhatApp site={CTLANGUAGE_SITE} />;
}
