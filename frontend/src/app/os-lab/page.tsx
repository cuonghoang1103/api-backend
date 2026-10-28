import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const SITE_URL = 'https://cuongthai.com';

// Mô phỏng chỉ sống ở trình duyệt (tương tác, đo khung nhìn) — nạp động, không render phía máy chủ.
const OsLabGallery = dynamic(() => import('@/components/os-lab/OsLabGallery'), {
  ssr: false,
  loading: () => <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>Đang dựng phòng lab…</div>,
});

export const metadata: Metadata = {
  title: 'Phòng lab Hệ điều hành — OS Visual Lab',
  description:
    'Mô phỏng tương tác cho khoá Operating Systems for Developers: tiến trình và fork/exec, đọc top/htop, lập lịch CPU, event loop, thread pool, semaphore, race condition và deadlock, bộ nhớ ảo, copy-on-write, page cache, cgroup và OOM, thang độ trễ.',
  alternates: { canonical: `${SITE_URL}/os-lab` },
  openGraph: {
    title: 'Phòng lab Hệ điều hành — nhìn thấy hệ điều hành làm việc',
    description: 'Chạy, dừng, đi từng bước: lập lịch CPU, race condition, lỗi trang, stack và ASLR.',
    url: `${SITE_URL}/os-lab`,
    type: 'website',
  },
};

export default function OsLabPage() {
  return <OsLabGallery />;
}
