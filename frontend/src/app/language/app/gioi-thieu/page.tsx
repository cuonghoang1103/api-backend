import type { Metadata } from 'next';
import { GioiThieuApp } from '@/components/appsite/trang';
import { CTLANGUAGE_SITE } from '../site';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Giới thiệu',
  description: 'Giới thiệu CT Language — app học ngoại ngữ cho người Việt của CuongThai.',
  alternates: { canonical: 'https://cuongthai.com/language/app/gioi-thieu' },
};

export default function Page() {
  return <GioiThieuApp site={CTLANGUAGE_SITE} />;
}
