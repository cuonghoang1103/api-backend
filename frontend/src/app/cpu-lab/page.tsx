import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const SITE_URL = 'https://cuongthai.com';

// Mô phỏng chỉ sống ở trình duyệt (tương tác) — nạp động, không render phía máy chủ. Cùng khung với /os-lab.
const CpuLabGallery = dynamic(() => import('@/components/cpu-lab/CpuLabGallery'), {
  ssr: false,
  loading: () => <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>Đang dựng phòng lab…</div>,
});

export const metadata: Metadata = {
  title: 'Máy tính từ số 0 — phòng lab trực quan CPU',
  description:
    'Mô phỏng tương tác cho CSI104 và CEA201: bit và hệ đếm, bù hai, UTF-8 và IEEE-754, cổng logic tới bộ cộng, CPU von Neumann (MARIE) chạy từng bước nạp–giải mã–thực thi, từ mã C tới mã máy thật, bộ nhớ cache.',
  alternates: { canonical: `${SITE_URL}/cpu-lab` },
  openGraph: {
    title: 'Máy tính từ số 0 — nhìn thấy máy tính chạy chương trình',
    description: 'Dòng điện → bit → số → chữ → lệnh → CPU → chương trình. Tự bật bit, dựng bộ cộng, lập trình CPU và xem từng bước.',
    url: `${SITE_URL}/cpu-lab`,
    type: 'website',
  },
};

export default function CpuLabPage() {
  return <CpuLabGallery />;
}
