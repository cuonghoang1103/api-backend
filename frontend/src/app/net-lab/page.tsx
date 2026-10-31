import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const SITE_URL = 'https://cuongthai.com';

// Mô phỏng chỉ sống ở trình duyệt (tương tác) — nạp động, không render phía máy chủ. Cùng khung với /cpu-lab, /os-lab.
const NetLabGallery = dynamic(() => import('@/components/net-lab/NetLabGallery'), {
  ssr: false,
  loading: () => <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>Đang dựng phòng lab…</div>,
});

export const metadata: Metadata = {
  title: 'Phòng lab mạng — nhìn thấy gói tin, ARP, socket và độ trễ',
  description:
    'Mô phỏng tương tác cho khoá Networking for Developers: đóng gói HTTP → TCP → IP → Ethernet với hex dump thật, router đổi gì, MTU và segmentation offload, ARP và công tắc, socket và cổng (bind 0.0.0.0, cạn cổng tạm), biểu đồ thác DNS → TCP → TLS → TTFB từ số curl thật.',
  alternates: { canonical: `${SITE_URL}/net-lab` },
  openGraph: {
    title: 'Phòng lab mạng — nhìn thấy mạng làm việc',
    description: 'Theo một request thật từ curl tới nginx từng byte; ARP, socket, và từng mili-giây khi bạn bấm Enter.',
    url: `${SITE_URL}/net-lab`,
    type: 'website',
  },
};

export default function NetLabPage() {
  return <NetLabGallery />;
}
