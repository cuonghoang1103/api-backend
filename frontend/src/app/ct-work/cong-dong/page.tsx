import { CongDongApp } from '@/components/appsite/trang';
import { CTWORK_SITE, metaCtWork } from '../site';

export const revalidate = 3600;

export const metadata = metaCtWork('/cong-dong', 'Cộng đồng', 'Diễn đàn, khoá video hướng dẫn CT Work và nơi góp ý, báo lỗi — cùng quy tắc cộng đồng.');

export default function Page() {
  return <CongDongApp site={CTWORK_SITE} />;
}
