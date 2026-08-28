import type { Metadata } from 'next';
import LibraryClient from './LibraryClient';

// Font editorial nạp bằng <link> Google Fonts lúc chạy (theo chủ trương dự án:
// tránh next/font/google để không phụ thuộc mạng lúc build). CSP đã cho phép
// fonts.googleapis.com + gstatic.com. Offline thì tự rơi về font hệ thống.
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Source+Sans+3:wght@400;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap';

export const metadata: Metadata = {
  title: 'The Library · CuongThai Books',
  description:
    'A practical library by Cuong Hoang — 28 published volumes on technology, thinking and human skills, with examples, exercises and checkpoints.',
  openGraph: {
    title: 'The CuongThai Library',
    description: '28 volumes · 456 chapters · 862,052 words. Read online, chapter by chapter.',
    type: 'website',
  },
};

export default function BooksPage() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={FONTS_HREF} />
      <LibraryClient />
    </>
  );
}
