import type { Metadata } from 'next';
import VoiceHubClient from './VoiceHubClient';

// Public, indexable landing for the creator channel.
export const metadata: Metadata = {
  title: 'Voice — Vlog, Reaction & Kinh nghiệm code',
  description:
    'Kênh chia sẻ của Cuong Hoang: vlog, video reaction, kinh nghiệm lập trình và podcast — xem trực tiếp trên web.',
  openGraph: {
    title: 'Voice — Vlog, Reaction & Kinh nghiệm code | CuongThai',
    description: 'Vlog, reaction, kinh nghiệm code và podcast — hand-crafted bởi Cuong Hoang.',
    url: 'https://cuongthai.com/voice',
    type: 'website',
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: 'https://cuongthai.com/voice',
    types: {
      'application/rss+xml': 'https://cuongthai.com/voice/rss.xml',
    },
  },
};

export default function VoicePage() {
  return <VoiceHubClient />;
}
