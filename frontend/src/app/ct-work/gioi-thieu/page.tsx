import { GioiThieuApp } from '@/components/appsite/trang';
import { CTWORK_SITE, metaCtWork } from '../site';

export const revalidate = 3600;

export const metadata = metaCtWork('/gioi-thieu', 'Giới thiệu', 'CT Work là gì, dành cho ai và những điều chúng mình giữ khi làm ra nó.');

export default function Page() {
  return <GioiThieuApp site={CTWORK_SITE} />;
}
