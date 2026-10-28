import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const SITE_URL = 'https://cuongthai.com';

// Cảnh 3D chỉ sống ở trình duyệt; three.js còn được nạp muộn hơn nữa bên trong (khi sân khấu hiện ra).
const Journey3D = dynamic(() => import('@/components/cpu-lab-3d/Journey3D'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', background: '#04060b', color: '#9aa6bb' }}>Đang mở hành trình 3D…</div>,
});

export const metadata: Metadata = {
  title: 'Hành trình 3D vào máy tính — từ cây máy tới transistor',
  description:
    'Bay xuyên 8 tầng của một chiếc máy tính: bo mạch chủ, bus, CPU, die silicon, một lõi chạy lệnh Add, mạch cộng từ cổng logic, transistor bật tắt tạo ra bit 0/1. Kèm bản đồ “Bạn đang ở đâu trong máy tính” cho thanh ghi, cache, bảng trang, tệp, gói tin…',
  alternates: { canonical: `${SITE_URL}/cpu-lab/3d` },
  openGraph: {
    title: 'Hành trình 3D vào máy tính',
    description: 'Từ cây máy tính chui xuống tới transistor — CSI104 · CEA201, cuongthai.com',
    url: `${SITE_URL}/cpu-lab/3d`,
    type: 'website',
  },
};

export default function CpuLab3DPage() {
  return <Journey3D />;
}
