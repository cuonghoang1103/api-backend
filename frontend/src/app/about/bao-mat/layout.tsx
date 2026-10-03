import type { Metadata } from 'next';

// Metadata-only layout: phần nội dung là client component (song ngữ).
const DESCRIPTION =
  'Bảo mật & Tuân thủ: cách studio xử lý dữ liệu khách (NDA, DPA, xoá khi kết thúc), thực hành kỹ thuật đang áp dụng, bên xử lý phụ, AI và dữ liệu, những gì chưa có, bảng trả lời đánh giá nhà cung cấp và kênh báo lỗ hổng.';

export const metadata: Metadata = {
  title: 'Bảo mật & Tuân thủ',
  alternates: { canonical: 'https://cuongthai.com/about/bao-mat' },
  description: DESCRIPTION,
  openGraph: {
    title: 'Bảo mật & Tuân thủ — CuongHoang',
    description: DESCRIPTION,
    url: 'https://cuongthai.com/about/bao-mat',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
