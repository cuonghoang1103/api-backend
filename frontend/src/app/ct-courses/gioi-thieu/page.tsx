import { GioiThieuApp } from '@/components/appsite/trang';
import { CTCOURSES_SITE, metaCtCourses } from '../site';

export const revalidate = 3600;
export const metadata = metaCtCourses('/gioi-thieu', 'Giới thiệu', 'Giới thiệu CT Courses — app học công nghệ thông tin từ số 0 tới đi làm của CuongThai.');

export default function Page() {
  return <GioiThieuApp site={CTCOURSES_SITE} />;
}
