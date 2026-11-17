import { TinhNangApp } from '@/components/appsite/trang';
import { CTCOURSES_SITE, metaCtCourses } from '../site';

export const revalidate = 3600;
export const metadata = metaCtCourses('/tinh-nang', 'Tính năng', 'Mọi tính năng của CT Courses: Academy theo kỳ, khoá học từ số 0, lộ trình nghề, Code Lab chấm tự động, phòng thi, phỏng vấn thử với AI, CuongMini, vở viết tay và ghi chú.');

export default function Page() {
  return <TinhNangApp site={CTCOURSES_SITE} />;
}
