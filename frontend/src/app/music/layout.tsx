import type { Metadata } from 'next';

// Metadata-only layout (SEO audit 2026-07-05). The page itself is a client
// component and cannot export metadata; this server layout gives the route
// its own <title> (root template appends " | CuongThai") + description
// without touching any rendering or logic.
export const metadata: Metadata = {
  title: 'Music',
  alternates: { canonical: 'https://cuongthai.com/music' },
  description:
    'Cyber music player — playlists, likes, lyrics, remixes, and listen-together.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
