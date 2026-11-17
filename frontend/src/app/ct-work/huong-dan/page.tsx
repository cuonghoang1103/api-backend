import { HuongDanApp } from '@/components/appsite/trang';
import { CTWORK_SITE, metaCtWork } from '../site';

export const revalidate = 3600;

export const metadata = metaCtWork('/huong-dan', 'Hướng dẫn', 'Hướng dẫn dùng CT Work từng bước: tạo dự án đầu tiên, board và sprint, thẻ việc, hỏi CuongMini, chat, cuộc họp và mẹo trên iPhone, iPad.');

export default function Page() {
  return <HuongDanApp site={CTWORK_SITE} />;
}
