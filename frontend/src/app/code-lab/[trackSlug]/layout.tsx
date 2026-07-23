import type { Metadata } from 'next';
import { getServerApiBaseUrl } from '@/lib/server-api';

// Per-track metadata. The page itself is a client component (no `metadata`
// export possible), so this server layout supplies route-specific SEO +
// Open Graph tags. The critical field is `og:url`/`canonical`: Facebook
// Messenger uses og:url as the link's click destination, and without a
// per-page value it inherited the root layout's homepage URL — so every
// shared /code-lab/<track> link previewed and opened as "/". Pointing og:url
// at the actual track fixes Messenger/Facebook link sharing.
const SITE_URL = 'https://cuongthai.com';

export async function generateMetadata(
  { params }: { params: Promise<{ trackSlug: string }> },
): Promise<Metadata> {
  const { trackSlug } = await params;
  const url = `${SITE_URL}/code-lab/${trackSlug}`;

  // Generic fallback — used if the track lookup fails. og:url stays correct
  // regardless, which is the part that fixes the shared-link bug.
  let title = 'Code Lab — CuongThai';
  let description =
    'Học lập trình qua lộ trình bài tập chấm điểm, ví dụ mẫu và lời giải trên CuongThai Code Lab.';

  try {
    const res = await fetch(
      `${getServerApiBaseUrl()}/api/v1/code-lab/tracks/${encodeURIComponent(trackSlug)}`,
      { next: { revalidate: 300 } },
    );
    if (res.ok) {
      const json = await res.json();
      const track = json?.data ?? json;
      if (track?.name) {
        title = `${track.name} — Code Lab`;
        if (track.description) description = track.description;
      }
    }
  } catch {
    // Network/build-time failure — keep the generic copy; og:url is still right.
  }

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { url, title, description, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
