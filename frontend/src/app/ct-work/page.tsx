import type { Metadata } from 'next';
import { TrangChuApp } from '@/components/appsite/trang';
import { CTWORK_SITE } from './site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: 'CT Work — quản lý dự án cho nhóm trên iPhone, iPad và web' },
  description:
    'Board, sprint, bảng tin, chat, cuộc họp, code và trợ lý AI CuongMini trong một app. Miễn phí trên App Store, web và app máy tính.',
  alternates: { canonical: 'https://cuongthai.com/ct-work' },
};

export default function Page() {
  return <TrangChuApp site={CTWORK_SITE} />;
}
