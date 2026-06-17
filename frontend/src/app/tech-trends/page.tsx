import type { Metadata } from 'next';
import TechTrendsClient from './TechTrendsClient';

// Public page (no auth gate). Marked indexable so Google can
// discover the long-form content and credit the site as a
// source of original tech writing.
export const metadata: Metadata = {
  title: 'Tech Trends & Insights',
  description:
    'A curated feed of tech news, bug-fix deep dives, ' +
    'coding interview experiences, and architecture tutorials. ' +
    'Hand-picked by Cuong Hoang.',
  openGraph: {
    title: 'Tech Trends & Insights | CuongThai',
    description:
      'Tech news, bug-fix guides, interview experiences, and architecture tutorials.',
    url: 'https://cuongthai.com/tech-trends',
    type: 'website',
  },
  alternates: {
    canonical: 'https://cuongthai.com/tech-trends',
  },
};

export default function TechTrendsPage() {
  return <TechTrendsClient />;
}
