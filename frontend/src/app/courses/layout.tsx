import type { Metadata } from 'next';

// Metadata-only layout (SEO audit 2026-07-05). The page itself is a client
// component and cannot export metadata; this server layout gives the route
// its own <title> (root template appends " | CuongThai") + description
// without touching any rendering or logic.
export const metadata: Metadata = {
  title: 'Courses — Curriculum',
  alternates: { canonical: 'https://cuongthai.com/courses' },
  description:
    'A 15-term curriculum in four years — 75 courses from developer tools and web fundamentals to cloud, security, AI and data, each term five courses in the order to take them.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
