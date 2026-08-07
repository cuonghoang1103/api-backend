import type { Metadata } from 'next';

// Metadata-only layout: the page is a client component and can't
// export metadata itself. Same pattern as /exp-hub.
export const metadata: Metadata = {
  title: 'Maker Lab',
  description:
    'Xưởng phần cứng: robot, IoT, nhúng. Danh sách linh kiện có lý do chọn, sơ đồ nối dây, lộ trình firmware và bảng điều khiển thiết bị trực tiếp.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
