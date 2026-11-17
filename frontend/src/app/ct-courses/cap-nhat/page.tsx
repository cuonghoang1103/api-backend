import { CapNhatApp } from '@/components/appsite/trang';
import { CTCOURSES_SITE, metaCtCourses } from '../site';

export const revalidate = 3600;
export const metadata = metaCtCourses('/cap-nhat', 'Có gì mới', 'Nhật ký cập nhật của app CT Courses trên App Store.');

export default function Page() {
  return <CapNhatApp site={CTCOURSES_SITE} />;
}
