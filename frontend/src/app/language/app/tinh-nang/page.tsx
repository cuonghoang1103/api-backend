import type { Metadata } from 'next';
import { TinhNangApp } from '@/components/appsite/trang';
import { CTLANGUAGE_SITE } from '../site';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Tính năng',
  description: 'Mọi tính năng của CT Language: lộ trình từ số 0, CuongMini, gọi thoại luyện nói, học từ vựng, học qua video, podcast, từ điển, dịch, luyện thi, trò chơi, sổ tay và widget.',
  alternates: { canonical: 'https://cuongthai.com/language/app/tinh-nang' },
};

export default function Page() {
  return <TinhNangApp site={CTLANGUAGE_SITE} />;
}
