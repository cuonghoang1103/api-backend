'use client';

import { useEffect, useState } from 'react';

/**
 * Height (in px) of the part of the layout viewport covered by the on-screen
 * keyboard — 0 when the keyboard is closed.
 *
 * iOS Safari does NOT resize 100dvh when the keyboard opens (dvh only tracks
 * the collapsing URL bar), it overlays the keyboard on top of the page. Any
 * full-height view with a bottom composer must therefore shrink itself by
 * this inset while typing, or the composer stays hidden behind the keyboard.
 *
 * Implementation: window.visualViewport resize+scroll events. The covered
 * band is layoutViewportHeight − (visualViewport.offsetTop + height). Values
 * under 80px are treated as URL-bar jitter, not a keyboard.
 */
export function useKeyboardInset(): number {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const covered = window.innerHeight - vv.height - vv.offsetTop;
        setInset(covered > 80 ? Math.round(covered) : 0);
      });
    };

    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      cancelAnimationFrame(raf);
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);

  return inset;
}
