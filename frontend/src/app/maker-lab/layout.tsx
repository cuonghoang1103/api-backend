import type { Metadata } from 'next';

// Metadata-only layout: the page is a client component and can't
// export metadata itself. Same pattern as /exp-hub.
export const metadata: Metadata = {
  title: 'IoT Odin',
  description:
    'IoT Odin — robot AI và thiết bị IoT CuongThai tự làm: linh kiện, sơ đồ nối dây, firmware và bảng điều khiển trực tiếp.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
