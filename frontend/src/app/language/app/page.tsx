import type { Metadata } from 'next';
import { TrangChuApp } from '@/components/appsite/trang';
import { CTLANGUAGE_SITE } from './site';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'App CT Language',
  description: 'Tải CT Language trên App Store: học tiếng Nhật, Trung, Anh từ số 0 với CuongMini, từ điển nghĩa tiếng Việt, dịch, podcast, học qua video, thi thử và 5 trò chơi.',
  alternates: { canonical: 'https://cuongthai.com/language/app' },
};

export default function Page() {
  return <TrangChuApp site={CTLANGUAGE_SITE} />;
}
