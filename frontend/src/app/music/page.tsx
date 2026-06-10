// Server Component — forces fresh SSR on every request so the music page never shows cached data
export const dynamic = 'force-dynamic';

import CyberMusicPage from './MusicClient';

export default function Page() {
  return <CyberMusicPage />;
}
