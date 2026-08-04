import type { Metadata } from 'next';
import TechTrendsClient from './TechTrendsClient';

// Public page (no auth gate). Marked indexable so Google can
// discover the long-form content and credit the site as a
// source of original tech writing.
export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Sự cố production có thật, bài mổ lỗi, hướng dẫn chuyên sâu, kinh nghiệm ' +
    'ôn thi & phỏng vấn, cùng source code và thông báo khoá học — blog của Cuong Hoang.',
  openGraph: {
    title: 'Blog | CuongThai',
    description:
      'Sự cố production có thật, bài mổ lỗi, hướng dẫn chuyên sâu, kinh nghiệm ôn thi & phỏng vấn.',
    url: 'https://cuongthai.com/tech-trends',
    type: 'website',
    // Re-declare: this block replaces the root openGraph (incl. images).
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: 'https://cuongthai.com/tech-trends',
    types: {
      'application/rss+xml': 'https://cuongthai.com/tech-trends/rss.xml',
    },
  },
};

export default function TechTrendsPage() {
  return <TechTrendsClient />;
}
