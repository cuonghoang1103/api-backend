import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const SITE_URL = 'https://cuongthai.com';

// Toàn bộ studio phụ thuộc canvas, Web Audio và MediaRecorder — không có thứ
// nào tồn tại khi render phía máy chủ. Nạp động với ssr:false để tránh vòng
// render đầu tiên vô nghĩa (và tránh cảnh báo hydrate lệch).
const SimulationStudio = dynamic(() => import('@/components/simulation/SimulationStudio'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-[#05060c]">
      <div className="flex items-center gap-3 text-[13px] font-medium text-[#5d6d8c]">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1d2740] border-t-[#38bdf8]" />
        Đang dựng xưởng mô phỏng…
      </div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: 'Xưởng mô phỏng Code & Mạng — Simulation Studio',
  description:
    'Hoạt hình hoá vòng đời request REST, tầng đệm CDN/Redis, xác thực JWT, truy vấn CSDL, WebSocket và hàng đợi tin nhắn. Có phụ đề bài giảng, tua theo bước và quay video ngay trong trình duyệt.',
  alternates: { canonical: `${SITE_URL}/simulation` },
  openGraph: {
    title: 'Xưởng mô phỏng Code & Mạng',
    description:
      'Sáu kịch bản hệ thống chạy thành hoạt hình 1920×1080, tua theo bước và quay thành video bài giảng.',
    url: `${SITE_URL}/simulation`,
    type: 'website',
  },
};

export default function SimulationPage() {
  return <SimulationStudio />;
}
