import type { Metadata } from 'next';
// Chữ riêng của /about/studio (bản broadsheet) — tự host qua @fontsource như
// layout gốc (KHÔNG next/font/google: fetch lúc build từng làm hỏng deploy).
// Nạp file css theo WEIGHT/trục, không theo subset, để giữ `unicode-range` —
// tiếng Việt hiển thị đúng và trình duyệt chỉ tải latin + vietnamese khi cần.
// Chỉ nạp ở route này, không ở layout gốc.
//   Newsreader Variable `opsz.css`: roman, trục weight 200–800 + optical size.
//   Be Vietnam Pro 400 (thân bài) + 600 (nút, nhãn đậm).
//   JetBrains Mono 400 đã có sẵn ở layout gốc.
import '@fontsource-variable/newsreader/opsz.css';
import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/600.css';

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
