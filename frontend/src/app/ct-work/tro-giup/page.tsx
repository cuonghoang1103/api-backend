import { TroGiupApp } from '@/components/appsite/trang';
import { CTWORK_SITE, metaCtWork } from '../site';

export const revalidate = 3600;

export const metadata = metaCtWork('/tro-giup', 'Trợ giúp', 'Câu hỏi thường gặp về CT Work: bắt đầu, làm việc nhóm, CuongMini, tài khoản, sự cố — và cách liên hệ.');

export default function Page() {
  return <TroGiupApp site={CTWORK_SITE} />;
}
