import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { KhungApp } from '@/components/appsite/ui';
import { CTCOURSES_SITE } from './site';

/** Trang chủ app CT Courses (17/11/2026) — khung + thanh mục con + chân trang dùng chung (`components/appsite`). */
export const metadata: Metadata = {
  title: { default: 'App CT Courses — học IT từ số 0 tới đi làm', template: '%s · App CT Courses' },
  description: CTCOURSES_SITE.moTa,
  alternates: { canonical: 'https://cuongthai.com/ct-courses' },
  openGraph: {
    title: 'CT Courses — học IT từ số 0 tới đi làm',
    description: CTCOURSES_SITE.moTa,
    url: '/ct-courses',
    images: ['/images/ct-courses/app/icon-512.png'],
  },
  // Smart App Banner của Safari trên iPhone/iPad.
  other: { 'apple-itunes-app': `app-id=${CTCOURSES_SITE.appStoreId}` },
};

export default function CtCoursesAppLayout({ children }: { children: ReactNode }) {
  return <KhungApp site={CTCOURSES_SITE}>{children}</KhungApp>;
}
