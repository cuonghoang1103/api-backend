import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { KhungApp } from '@/components/appsite/ui';
import { CTWORK_SITE } from './site';

export const metadata: Metadata = {
  title: { default: 'CT Work — quản lý dự án cho nhóm trên iPhone, iPad và web', template: '%s · CT Work' },
  description: CTWORK_SITE.moTa,
  alternates: { canonical: 'https://cuongthai.com/ct-work' },
  openGraph: {
    title: 'CT Work — quản lý dự án cho nhóm',
    description: CTWORK_SITE.moTa,
    url: '/ct-work',
    images: ['/images/ct-work/ct-work-app-icon-1024.png'],
  },
  // Smart App Banner của Safari trên iPhone/iPad.
  other: { 'apple-itunes-app': `app-id=${CTWORK_SITE.appStoreId}` },
};

export default function CtWorkAppLayout({ children }: { children: ReactNode }) {
  return <KhungApp site={CTWORK_SITE}>{children}</KhungApp>;
}
