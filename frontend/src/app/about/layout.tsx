import type { Metadata } from 'next';

// Metadata-only layout (SEO audit 2026-07-05). The page itself is a client
// component and cannot export metadata; this server layout gives the route
// its own <title> (root template appends " | CuongThai") + description
// without touching any rendering or logic.
export const metadata: Metadata = {
  title: 'About',
  description:
    'About Cuong Hoang — full-stack developer building web, AI, and embedded products.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
