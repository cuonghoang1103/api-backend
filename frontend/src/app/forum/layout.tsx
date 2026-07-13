import type { Metadata } from 'next';

// Metadata-only layout (SEO). The page itself is a client component and cannot
// export metadata; this server layout gives the route its own <title> (root
// template appends " | CuongThai") + description + self-canonical, without
// touching any rendering or logic.
export const metadata: Metadata = {
  title: 'Diễn đàn',
  description:
    'Diễn đàn / Tin tức — thông báo chính thức và cập nhật từ quản trị viên CuongThai.',
  alternates: { canonical: 'https://cuongthai.com/forum' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
