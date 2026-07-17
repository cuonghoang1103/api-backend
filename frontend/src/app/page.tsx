/**
 * Home ("/") — the public landing / front door.
 *
 * The Feed that used to live here now lives at /feed. This is a server component
 * (so the marketing copy is SSR'd for SEO) that renders the client RiveLanding
 * shell; the personalized greeting + animations hydrate on the client.
 */
import type { Metadata } from 'next';
import RiveLanding from '@/components/home/landing/RiveLanding';

export const metadata: Metadata = {
  title: 'CuongThai — Interactive learning & career platform',
  description:
    'Practice interviews graded by AI, learn English, Japanese and Chinese with an AI tutor, build your CV, play games, and more — all in one place.',
  openGraph: {
    title: 'CuongThai — Interactive learning & career platform',
    description:
      'Interviews graded by AI, language learning, CV builder, games and more. Sign up and start today.',
    type: 'website',
  },
};

export default function HomePage() {
  return <RiveLanding />;
}
