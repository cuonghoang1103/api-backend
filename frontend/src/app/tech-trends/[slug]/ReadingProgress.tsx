'use client';

import { useEffect, useState } from 'react';

/**
 * A thin fixed progress bar at the very top of the viewport that tracks how
 * far the reader has scrolled through the document. Pure UX sugar — cheap
 * (one passive scroll listener, rAF-throttled) and no layout impact.
 */
export default function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      setPct(scrollable > 0 ? Math.min(100, Math.max(0, (el.scrollTop / scrollable) * 100)) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-neon-indigo via-neon-violet to-neon-fuchsia transition-[width] duration-75"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
