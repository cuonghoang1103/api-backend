'use client';

// 'use client' makes this always render in the browser (no SSR).
// The force-dynamic cache header in next.config.js handles SSR cache.
import CyberMusicPage from './MusicClient';

export default function Page() {
  return <CyberMusicPage />;
}
