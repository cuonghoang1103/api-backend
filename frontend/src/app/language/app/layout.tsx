import type { Metadata } from 'next';
import { KhungApp } from '@/components/appsite/ui';
import { CTLANGUAGE_SITE } from './site';

/** Trang chủ app CT Language trong mục My Language (17/11/2026) — khung + thanh mục con + chân trang dùng chung. */
export const metadata: Metadata = {
  title: { default: 'App CT Language — học Nhật, Trung, Anh cùng AI', template: '%s · App CT Language' },
  description: CTLANGUAGE_SITE.moTa,
  alternates: { canonical: 'https://cuongthai.com/language/app' },
  openGraph: {
    title: 'CT Language — học Nhật · Trung · Anh cùng AI',
    description: CTLANGUAGE_SITE.moTa,
    images: ['/images/ct-language/app/icon-512.png'],
  },
  other: { 'apple-itunes-app': `app-id=${CTLANGUAGE_SITE.appStoreId}` },
};

export const revalidate = 3600;

export default function CtLanguageAppLayout({ children }: { children: React.ReactNode }) {
  return <KhungApp site={CTLANGUAGE_SITE}>{children}</KhungApp>;
}
