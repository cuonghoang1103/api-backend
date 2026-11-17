import { CongDongApp } from '@/components/appsite/trang';
import { CTCOURSES_SITE, metaCtCourses } from '../site';

export const revalidate = 3600;
export const metadata = metaCtCourses('/cong-dong', 'Cộng đồng', 'Cộng đồng CT Courses: thảo luận đề trong Phòng thi, diễn đàn CuongThai, góp ý cho app và quy tắc cộng đồng.');

export default function Page() {
  return <CongDongApp site={CTCOURSES_SITE} />;
}
