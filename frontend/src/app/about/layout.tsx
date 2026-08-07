import type { Metadata } from 'next';

// Metadata-only layout (SEO audit 2026-07-05). The page itself is a client
// component and cannot export metadata; this server layout gives the route its
// own <title> (root template appends " | CuongThai") + description without
// touching any rendering or logic.
//
// Description rewritten 2026-08-08 with the page: the old one ("building web,
// AI, and embedded products") described nothing a reader could check. The page
// now leads with counted evidence, so the snippet should too.
const DESCRIPTION =
  'CuongHoang — full-stack developer. This site is the portfolio: the codebase, the content counted straight from its database, how it deploys, and four production incidents with their fixes. CV available as a direct download.';

export const metadata: Metadata = {
  title: 'About',
  alternates: { canonical: 'https://cuongthai.com/about' },
  description: DESCRIPTION,
  openGraph: {
    title: 'About — CuongHoang',
    description: DESCRIPTION,
    url: 'https://cuongthai.com/about',
    type: 'profile',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
