/**
 * /cli — CuongMini CLI: AI Code của CuongThai chạy trong terminal (17/10/2026).
 *
 * Trang riêng (không gộp vào `/ai-code`) vì người tìm "AI lập trình trong
 * terminal" khác người tìm extension: họ cần hướng dẫn cài từ máy MỚI TINH theo
 * từng hệ điều hành và bảng lệnh/phím tắt — nội dung dài, cần URL + tiêu đề riêng.
 *
 * ⚠️ Cạnh file này là hai thư mục route `install.sh/` và `install.ps1/` (phục vụ
 * script cài cho `curl | bash` / `irm | iex`) — đừng đụng, đừng đổi tên thư mục.
 */
import type { Metadata } from 'next';
import CliClient from './CliClient';

export const metadata: Metadata = {
  title: 'CuongMini CLI — AI lập trình ngay trong terminal',
  description:
    'Cài CuongMini CLI bằng một dòng lệnh trên macOS, Windows, Linux: AI tiếng Việt đọc và sửa code, chạy lệnh, lập kế hoạch ngay trong terminal. Đăng nhập tài khoản cuongthai.com, dùng chung bộ máy AI Code của app — skill, bộ nhớ, MCP, lệnh /, 5 chế độ quyền.',
  keywords: [
    'CuongMini CLI',
    'AI trong terminal',
    'AI lập trình tiếng Việt',
    'trợ lý code terminal',
    'thay OpenCode',
    'AI Code',
    'CuongThai',
  ],
  alternates: { canonical: '/cli' },
  openGraph: {
    title: 'CuongMini CLI — AI lập trình ngay trong terminal',
    description:
      'Một dòng lệnh để cài. Gõ cuongmini trong thư mục dự án, giao việc bằng tiếng Việt — AI đọc, sửa, chạy lệnh và hỏi bạn trước khi làm.',
    images: ['/images/cuongmini-code/icon.png'],
  },
};

/* Dữ liệu có cấu trúc: một phần mềm dòng lệnh, cài từ chính cuongthai.com. */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CuongMini CLI',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'macOS, Windows, Linux',
  description: 'Trợ lý lập trình AI tiếng Việt chạy trong terminal, dùng lõi AI Code của CuongThai.',
  url: 'https://cuongthai.com/cli',
  image: 'https://cuongthai.com/images/cuongmini-code/icon.png',
  downloadUrl: ['https://cuongthai.com/cli/install.sh', 'https://cuongthai.com/cli/install.ps1'],
  publisher: { '@type': 'Organization', name: 'CuongThai', url: 'https://cuongthai.com' },
};

export default function CliPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <CliClient />
    </>
  );
}
