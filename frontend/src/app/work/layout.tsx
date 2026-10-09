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
  icons: {
    icon: [
      { url: '/images/ct-work/ct-work.svg', type: 'image/svg+xml' },
      { url: '/images/ct-work/ct-work-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/images/ct-work/ct-work-180.png', sizes: '180x180' },
  },
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
