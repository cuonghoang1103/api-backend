import type { Metadata } from 'next';

// Metadata-only layout (SEO audit 2026-07-05). The page itself is a client
// component and cannot export metadata; this server layout gives the route
// its own <title> (root template appends " | CuongThai") + description
// without touching any rendering or logic.
export const metadata: Metadata = {
  title: 'Blog',
  alternates: { canonical: 'https://cuongthai.com/blog' },
  description:
    'Technical articles, tutorials, and dev notes by Cuong Hoang — web, AI, embedded, and everything in between.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
