import type { Metadata } from 'next';

// Fallback metadata for the /blog segment. The index used to live here; it
// now redirects to the merged blog at /tech-trends (see next.config.js), so
// the only route left under /blog is `[slug]` — the resource posts — and
// that page exports its own per-post metadata, which wins over this.
export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Source code, thông báo khoá học và bài viết kỹ thuật của Cuong Hoang.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
