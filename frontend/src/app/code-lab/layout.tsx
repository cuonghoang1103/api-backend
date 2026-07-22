import type { Metadata } from 'next';
import './code-lab.css';

// Metadata-only server layout (the page is a client component). Gives the
// route its own <title>/description for SEO without touching rendering.
export const metadata: Metadata = {
  title: 'Code Lab',
  description:
    'Practice coding across every language and framework — structured learning roadmaps with graded exercises, worked examples, and official solutions.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
