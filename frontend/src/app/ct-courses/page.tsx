import type { Metadata } from 'next';
import { TrangChuApp } from '@/components/appsite/trang';
import { CTCOURSES_SITE } from './site';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: { absolute: 'App CT Courses — học IT từ số 0 tới đi làm' },
  description:
    'Tải CT Courses trên App Store: Academy theo kỳ, khoá học lập trình từ số 0, Code Lab chấm tự động, phòng thi, phỏng vấn thử với AI, CuongMini và vở viết tay Apple Pencil.',
  alternates: { canonical: 'https://cuongthai.com/ct-courses' },
};

export default function Page() {
  return <TrangChuApp site={CTCOURSES_SITE} />;
}
