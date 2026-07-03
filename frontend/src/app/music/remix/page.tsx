'use client';

// 'use client' — always render in the browser (no SSR), same as /music.
// The DJ deck + club backdrop are canvas/animation-heavy client components.
import RemixClient from './RemixClient';

export default function Page() {
  return <RemixClient />;
}
