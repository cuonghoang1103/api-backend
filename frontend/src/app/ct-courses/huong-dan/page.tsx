import { HuongDanApp } from '@/components/appsite/trang';
import { CTCOURSES_SITE, metaCtCourses } from '../site';

export const revalidate = 3600;
export const metadata = metaCtCourses('/huong-dan', 'Hướng dẫn sử dụng', 'Hướng dẫn dùng CT Courses từng bước: bắt đầu, học theo kỳ với Academy, làm bài Code Lab, luyện thi, phỏng vấn thử, CuongMini, vở và gói Pro.');

export default function Page() {
  return <HuongDanApp site={CTCOURSES_SITE} />;
}
