import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const SITE_URL = 'https://cuongthai.com';

// Mô phỏng chỉ sống ở trình duyệt (tương tác) — nạp động, không render phía máy chủ. Cùng khung với /cpu-lab, /os-lab.
const NetLabGallery = dynamic(() => import('@/components/net-lab/NetLabGallery'), {
  ssr: false,
  loading: () => <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>Đang dựng phòng lab…</div>,
});

export const metadata: Metadata = {
  title: 'Phòng lab mạng — gói tin, ARP, socket, subnet, định tuyến, NAT, IPv6, BGP',
  description:
    'Mô phỏng tương tác cho khoá Networking for Developers: đóng gói HTTP → TCP → IP → Ethernet với hex dump thật, ARP và công tắc, socket và cổng, biểu đồ thác DNS → TCP → TLS → TTFB; chia subnet, bảng định tuyến và traceroute, NAT và CGNAT, IPv6 và Happy Eyeballs, BGP bị cướp tuyến — số liệu từ lab Docker thật.',
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
