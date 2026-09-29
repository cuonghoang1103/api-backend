import type { Metadata } from 'next';

/** 📷 Sách gốc — trang riêng tư (chỉ tài khoản được phép), không cho máy tìm kiếm. */
export const metadata: Metadata = {
  title: 'Sách gốc できる日本語',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
};

export default function SachGocLayout({ children }: { children: React.ReactNode }) {
  return children;
}
