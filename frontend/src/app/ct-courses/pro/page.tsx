import { ProApp } from '@/components/appsite/trang';
import { CTCOURSES_SITE, metaCtCourses } from '../site';

export const revalidate = 3600;
export const metadata = metaCtCourses('/pro', 'CT Courses Pro', 'So sánh bản miễn phí và CT Courses Pro: mở khoá toàn bộ bài học, AI chấm bài, CuongMini mạnh hơn, phỏng vấn thử không giới hạn; 49.000 ₫/tháng hoặc 399.000 ₫/năm, 7 ngày dùng thử.');

export default function Page() {
  return <ProApp site={CTCOURSES_SITE} />;
}
