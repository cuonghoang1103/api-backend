/**
 * /ai-code — giới thiệu CuongMini Code (extension) + CuongMini CLI (17/10/2026).
 *
 * Trang riêng chứ không nhét hết vào `/download`: `/download` là trang tải APP
 * (cố ý tiếng Anh, một nút lớn theo hệ điều hành), còn đây là lối vào cho người
 * đang tìm "AI tiếng Việt trong VS Code/Cursor" — cần URL và tiêu đề riêng để
 * Google đưa đúng người tới. `/download` chỉ giữ một thẻ trỏ sang đây.
 */
import type { Metadata } from 'next';
import AiCodeClient from './AiCodeClient';
import { LINK_CHO_MS, LINK_OPEN_VSX } from './trinhSoan';

export const metadata: Metadata = {
  title: 'CuongMini Code — AI lập trình trong VS Code, Cursor, Antigravity, Windsurf',
  description:
    'Cài AI Code của CuongThai vào VS Code, Cursor, Antigravity, Windsurf hay VSCodium bằng một cú bấm, hoặc chạy ngay trong terminal với CuongMini CLI. Chat tiếng Việt, AI đọc và sửa code, chạy lệnh, lịch sử việc, lệnh /, @ file — đăng nhập bằng tài khoản cuongthai.com, không cần app.',
  keywords: [
    'CuongMini Code',
    'AI Code',
    'extension VS Code tiếng Việt',
    'AI lập trình',
    'Cursor extension',
    'Antigravity',
    'Windsurf',
    'VSCodium',
    'CuongMini CLI',
    'CuongThai',
  ],
  alternates: { canonical: '/ai-code' },
  openGraph: {
    title: 'CuongMini Code — AI lập trình ngay trong trình soạn code của bạn',
    description:
      'Một cú bấm cài vào VS Code, Cursor, Antigravity, Windsurf, VSCodium — hoặc một dòng lệnh cho terminal.',
    images: ['/images/cuongmini-code/icon.png'],
  },
};

/* Dữ liệu có cấu trúc cho máy tìm kiếm: đây là MỘT phần mềm, có hai nơi tải. */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CuongMini Code',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'macOS, Windows, Linux',
  description:
    'AI lập trình của CuongThai chạy trong VS Code, Cursor, Antigravity, Windsurf, VSCodium và terminal.',
  url: 'https://cuongthai.com/ai-code',
  image: 'https://cuongthai.com/images/cuongmini-code/icon.png',
  downloadUrl: [LINK_CHO_MS, LINK_OPEN_VSX],
  publisher: { '@type': 'Organization', name: 'CuongThai', url: 'https://cuongthai.com' },
};

export default function AiCodePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <AiCodeClient />
    </>
  );
}
