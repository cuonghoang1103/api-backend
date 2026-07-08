'use client';

import { useEffect } from 'react';

/**
 * Facebook-mobile-style hide-on-scroll chrome — MOBILE / TABLET ONLY.
 *
 * When `enabled`, scrolling DOWN adds `chrome-hidden` to <html> (the top
 * navbar slides up + the mobile bottom nav slides down, giving posts the
 * full viewport like the FB app); scrolling UP — or being near the top —
 * removes it so the chrome reappears.
 *
 * Gating: the effect no-ops unless `matchMedia('(max-width: 1023.98px)')`
 * matches, so desktop (lg+) is never touched and stays pixel-identical.
 * The matching CSS lives in globals.css (also gated to the same query),
 * so even if the class were somehow set on desktop nothing would move.
 *
 * SSR-safe: everything runs inside the effect. Cleanup removes both the
 * listener AND the `chrome-hidden` class so leaving the home route never
 * leaves the nav stuck off-screen on another page.
 */
export function useChromeAutoHide(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const root = document.documentElement;
    const mq = window.matchMedia('(max-width: 1023.98px)');

    // Only hide after scrolling past this many px so the top of the feed
    // stays stable and small overscrolls don't flicker the chrome.
    const REVEAL_ZONE = 120;
    // Ignore sub-pixel / jitter scroll deltas.
    const DELTA = 6;

    let lastY = window.scrollY;
    let ticking = false;

    const clear = () => root.classList.remove('chrome-hidden');

    const evaluate = () => {
      ticking = false;
      // Mobile/tablet only — on desktop just make sure the class is gone.
      if (!mq.matches) {
        clear();
        lastY = window.scrollY;
        return;
      }
      const y = window.scrollY;
      const dy = y - lastY;

      if (y <= REVEAL_ZONE) {
        // Near the top: always show the chrome.
        clear();
      } else if (dy > DELTA) {
        // Scrolling down past the reveal zone → hide.
        root.classList.add('chrome-hidden');
      } else if (dy < -DELTA) {
        // Scrolling up → reveal.
        clear();
      }
      lastY = y;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(evaluate);
    };

    // Rotating / resizing to a desktop width must drop the class and stop
    // reacting; back to mobile re-arms it.
    const onMqChange = () => {
      if (!mq.matches) clear();
      lastY = window.scrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    mq.addEventListener?.('change', onMqChange);

    return () => {
      window.removeEventListener('scroll', onScroll);
      mq.removeEventListener?.('change', onMqChange);
      // Never leave other routes with the nav hidden.
      root.classList.remove('chrome-hidden');
    };
  }, [enabled]);
}
