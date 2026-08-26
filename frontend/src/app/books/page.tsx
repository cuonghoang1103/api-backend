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
    'A technical library written from scratch by Cuong Hoang — 25 volumes, 412 chapters, 800,000+ words, on one rule: nothing is printed that was not run first. Read every volume in the browser.',
  openGraph: {
    title: 'The CuongThai Library',
    description: '25 volumes · 412 chapters · 809,780 words · 887 primary sources. Read online, chapter by chapter.',
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
