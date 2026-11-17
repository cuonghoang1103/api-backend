import { TroGiupApp } from '@/components/appsite/trang';
import { CTCOURSES_SITE, metaCtCourses } from '../site';

export const revalidate = 3600;
export const metadata = metaCtCourses('/tro-giup', 'Trợ giúp', 'Câu hỏi thường gặp về CT Courses: miễn phí, đồng bộ với web, Code Lab, Phòng thi, CuongMini, gói Pro, huỷ thuê bao, liên hệ hỗ trợ.');

export default function Page() {
  return <TroGiupApp site={CTCOURSES_SITE} />;
}
