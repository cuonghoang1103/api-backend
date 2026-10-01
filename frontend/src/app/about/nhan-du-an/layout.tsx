import type { Metadata } from 'next';

// Metadata-only layout: page.tsx là client component.
const DESCRIPTION =
  'Gửi yêu cầu dự án phần mềm: web, ứng dụng di động, công cụ nội bộ và tự động hoá, tích hợp AI. Mô hình hợp tác, những gì bạn nhận được khi bàn giao, và thông báo xử lý dữ liệu cá nhân theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP.';

export const metadata: Metadata = {
  title: 'Nhận dự án',
  alternates: { canonical: 'https://cuongthai.com/about/nhan-du-an' },
  description: DESCRIPTION,
  openGraph: {
    title: 'Nhận dự án — CuongHoang',
    description: DESCRIPTION,
    url: 'https://cuongthai.com/about/nhan-du-an',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
