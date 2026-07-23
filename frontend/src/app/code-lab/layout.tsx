import type { Metadata } from 'next';
import './code-lab.css';

// Metadata-only server layout (the page is a client component). Gives the
// route its own <title>/description for SEO without touching rendering.
// og:url / canonical MUST point at this route, not the site root: Facebook
// Messenger uses og:url as the link's click destination, so inheriting the
// root layout's `openGraph.url: 'https://cuongthai.com'` made every shared
// Code Lab link collapse back to "/".
const HUB_DESC =
  'Practice coding across every language and framework — structured learning roadmaps with graded exercises, worked examples, and official solutions.';
export const metadata: Metadata = {
  title: 'Code Lab',
  description: HUB_DESC,
  alternates: { canonical: 'https://cuongthai.com/code-lab' },
  openGraph: {
    url: 'https://cuongthai.com/code-lab',
    title: 'Code Lab — CuongThai',
    description: HUB_DESC,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
