import type { Metadata } from 'next';

// Metadata-only layout: page.tsx là client component.
const DESCRIPTION =
  'CuongHoang — studio phần mềm độc lập: web, app, công cụ nội bộ và tích hợp AI cho doanh nghiệp. Sản phẩm đang vận hành, năng lực kỹ thuật và cách làm việc — chỉ số liệu đếm được.';

export const metadata: Metadata = {
  title: 'Giới thiệu studio',
  alternates: { canonical: 'https://cuongthai.com/about/studio' },
  description: DESCRIPTION,
  openGraph: {
    title: 'Giới thiệu studio — CuongHoang',
    description: DESCRIPTION,
    url: 'https://cuongthai.com/about/studio',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
