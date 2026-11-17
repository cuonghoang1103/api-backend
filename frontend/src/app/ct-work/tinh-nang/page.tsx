import { TinhNangApp } from '@/components/appsite/trang';
import { CTWORK_SITE, metaCtWork } from '../site';

export const revalidate = 3600;

export const metadata = metaCtWork('/tinh-nang', 'Tính năng', 'Mọi tính năng của CT Work: board và sprint, CuongMini, bảng tin, chat, cuộc họp, code, kiểm thử, lớp học, AI agent và các tiện ích riêng cho iPhone, iPad.');

export default function Page() {
  return <TinhNangApp site={CTWORK_SITE} />;
}
