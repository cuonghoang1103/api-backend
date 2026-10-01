import type { Metadata } from 'next';

// Metadata-only layout: page.tsx là client component nên không export
// metadata được (cùng cách với app/about/layout.tsx).
import { STAGES } from './data';

// Số giai đoạn ĐẾM từ data.ts — không gõ tay (bản 1 ghi cứng "15").
const DESCRIPTION = `Quy trình nhận & làm dự án phần mềm của CuongHoang Studio: ${STAGES.length} giai đoạn từ tiếp nhận yêu cầu, đánh giá phù hợp, pháp lý, đặc tả, thiết kế, phát triển, kiểm thử, bảo mật, DevOps, nghiệm thu, phát hành, bàn giao tới bảo trì và ngừng hệ thống — mỗi giai đoạn có bộ phận phụ trách, RACI, cổng chất lượng và mẫu tài liệu.`;

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
