'use client';

import { useEffect } from 'react';

/**
 * Fades out and removes the boot splash (`#app-splash`) that is rendered
 * directly in the server HTML (see app/layout.tsx). The splash paints
 * instantly on first load / PWA launch (before React hydrates); this
 * component dismisses it once the app is interactive.
 *
 * Renders nothing. Keeps a small minimum on-screen time so a fast load
 * doesn't produce a jarring one-frame flash, and a hard safety timeout so
 * the splash can never get "stuck" if something goes wrong.
 */
export default function AppBootSplash() {
  useEffect(() => {
    const el = document.getElementById('app-splash');
    if (!el) return;

    let removed = false;
    const remove = () => {
      if (removed) return;
      removed = true;
      el.classList.add('app-splash--hide');
      // Remove from the DOM after the fade so it can't intercept anything.
      window.setTimeout(() => el.remove(), 500);
    };

    // Show for at least ~400ms (feels intentional, not a flash), then hide
    // on the next paint after the app is mounted.
    const MIN_MS = 400;
    const started = Number(el.dataset.t0 || Date.now());
    const elapsed = Date.now() - started;
    const t = window.setTimeout(remove, Math.max(0, MIN_MS - elapsed));

    // Safety net: never let it linger.
    const safety = window.setTimeout(remove, 6000);

    return () => {
      window.clearTimeout(t);
      window.clearTimeout(safety);
    };
  }, []);

  return null;
}
