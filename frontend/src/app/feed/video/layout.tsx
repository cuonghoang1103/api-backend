import type { Metadata } from 'next';

// Metadata-only layout (SEO audit 2026-07-05). The page itself is a client
// component and cannot export metadata; this server layout gives the route
// its own <title> (root template appends " | CuongThai") + description
// without touching any rendering or logic.
export const metadata: Metadata = {
  title: 'Video Feed',
  description:
    'Short-video reels from the community feed.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
