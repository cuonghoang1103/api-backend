import { CapNhatApp } from '@/components/appsite/trang';
import { CTWORK_SITE, metaCtWork } from '../site';

export const revalidate = 3600;

export const metadata = metaCtWork('/cap-nhat', 'Cập nhật', 'Nhật ký phát hành của CT Work cho iPhone, iPad và app máy tính.');

export default function Page() {
  return <CapNhatApp site={CTWORK_SITE} />;
}
