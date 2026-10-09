import type { Metadata } from 'next';
import './work.css';
import WorkShell from './WorkShell';

/**
 * Khung /work (CT Work) — component MÁY CHỦ chỉ để đặt metadata; toàn bộ giao diện ở WorkShell.tsx (client).
 *
 * UX-D (09/10/2026): link /work/** gửi qua Messenger/Zalo từng hiện ảnh CHUNG của cả site ("Portfolio · Academy…")
 * ⇒ người nhận tưởng link rác. Giờ mọi trang CT Work mang thương hiệu "CT Work by CuongThai" (favicon, apple-touch-icon,
 * og:site_name) và ảnh xem trước riêng. Trang cần đăng nhập KHÔNG lộ tiêu đề/nội dung — chỉ tên workspace +
 * "Sign in to view" ([ws]/layout.tsx). Lời mời / link công khai có ảnh riêng (invite/[token], share/[token]).
 */
export const metadata: Metadata = {
  title: { default: 'CT Work', template: '%s · CT Work' },
  description: 'CT Work by CuongThai — project workspace for teams and student groups: boards, sprints, docs and reports.',
  applicationName: 'CT Work by CuongThai',
  // 10/10/2026 — bộ nhận diện mới (mark "Flow Check", xem public/images/ct-work/BRAND.md). Tên tệp MỚI + `?v=2`:
  // trình duyệt giữ favicon rất lâu theo URL, đổi URL là cách duy nhất chắc chắn thay được icon cũ trên tab.
  icons: {
    icon: [
      { url: '/images/ct-work/favicon.ico?v=2', sizes: '16x16 32x32 48x48' },
      { url: '/images/ct-work/icon.svg?v=2', type: 'image/svg+xml' },
      { url: '/images/ct-work/icon-192.png?v=2', sizes: '192x192', type: 'image/png' },
    ],
    apple: { url: '/images/ct-work/apple-touch-icon.png?v=2', sizes: '180x180' },
  },
  manifest: '/images/ct-work/work.webmanifest?v=2',
  appleWebApp: { title: 'CT Work' },
  openGraph: {
    type: 'website',
    siteName: 'CT Work by CuongThai',
    locale: 'en_US',
    title: 'CT Work',
    description: 'Sign in to view this page on CT Work — boards, sprints, docs and reports for your team.',
  },
  twitter: { card: 'summary_large_image', title: 'CT Work', description: 'Sign in to view this page on CT Work.' },
  // Trang làm việc riêng tư — không cho máy tìm kiếm lập chỉ mục.
  robots: { index: false, follow: false },
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <WorkShell>{children}</WorkShell>;
}
