import type { Metadata } from 'next';

// Metadata-only layout (SEO audit 2026-07-05). The page itself is a client
// component and cannot export metadata; this server layout gives the route
// its own <title> (root template appends " | CuongThai") + description
// without touching any rendering or logic.
export const metadata: Metadata = {
  title: 'Profile',
  description:
    'User profile on CuongThai.',
  // Personal/auth surface — keep out of search results.
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
