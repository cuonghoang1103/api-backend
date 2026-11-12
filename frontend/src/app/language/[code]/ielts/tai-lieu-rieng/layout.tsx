import type { Metadata } from 'next';

/** 🔒 Tài liệu riêng IELTS — trang riêng tư (chỉ tài khoản được phép), không cho máy tìm kiếm. */
export const metadata: Metadata = {
  title: 'Tài liệu riêng IELTS',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
};

export default function TaiLieuRiengLayout({ children }: { children: React.ReactNode }) {
  return children;
}
