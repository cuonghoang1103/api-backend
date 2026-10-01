import type { Metadata } from 'next';
import { STAGES } from '../data';
import { DEPARTMENTS } from '../departments';

// Metadata-only layout: page.tsx là client component. Con số ĐẾM từ dữ liệu.
const N_DEPT = DEPARTMENTS.filter((d) => !d.external).length;
const DESCRIPTION = `Sơ đồ ${N_DEPT} bộ phận trong một dự án phần mềm và luồng chuyển giao giữa họ — ai chuyển tài liệu gì cho ai — cùng ma trận RACI tổng theo ${STAGES.length} giai đoạn của quy trình.`;

export const metadata: Metadata = {
  title: 'Tổ chức & RACI — Quy trình dự án',
  alternates: { canonical: 'https://cuongthai.com/about/quy-trinh/to-chuc' },
  description: DESCRIPTION,
  openGraph: {
    title: 'Tổ chức & RACI — CuongHoang',
    description: DESCRIPTION,
    url: 'https://cuongthai.com/about/quy-trinh/to-chuc',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
