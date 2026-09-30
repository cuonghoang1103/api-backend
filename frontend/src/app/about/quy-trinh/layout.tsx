import type { Metadata } from 'next';

// Metadata-only layout: page.tsx là client component nên không export
// metadata được (cùng cách với app/about/layout.tsx).
const DESCRIPTION =
  'Quy trình nhận & làm dự án phần mềm của CuongHoang: 15 giai đoạn từ tiếp nhận, khảo sát, đặc tả, thiết kế, phát triển, kiểm thử, bảo mật, DevOps, nghiệm thu, bàn giao tới bảo hành — mỗi giai đoạn có tài liệu bàn giao, tiêu chuẩn tham chiếu và cổng chất lượng.';

export const metadata: Metadata = {
  title: 'Quy trình nhận & làm dự án',
  alternates: { canonical: 'https://cuongthai.com/about/quy-trinh' },
  description: DESCRIPTION,
  openGraph: {
    title: 'Quy trình nhận & làm dự án — CuongHoang',
    description: DESCRIPTION,
    url: 'https://cuongthai.com/about/quy-trinh',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
