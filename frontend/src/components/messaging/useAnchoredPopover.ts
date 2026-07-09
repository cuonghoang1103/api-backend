'use client';

import { useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react';

/**
 * Computes a `position: fixed` style that places a popover directly ABOVE
 * an anchor element, clamped to the viewport. Used so the emoji/GIF/sticker
 * pickers can be rendered through a portal to `document.body` — which
 * escapes any `overflow: hidden` ancestor (e.g. the rounded feed post card
 * that was clipping the comment-composer pickers). When no anchor is given
 * the caller keeps its original in-flow absolute positioning (messenger).
 */
export function useAnchoredFixedStyle(
  anchorRef: RefObject<HTMLElement | null> | undefined,
  open: boolean,
  width = 340,
): CSSProperties {
  const [style, setStyle] = useState<CSSProperties>({ position: 'fixed', left: -9999, top: -9999 });

  useLayoutEffect(() => {
    if (!open || !anchorRef?.current) return;
    const compute = () => {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const w = Math.min(width, window.innerWidth - 16);
      let left = r.left;
      if (left + w > window.innerWidth - 8) left = window.innerWidth - 8 - w;
      if (left < 8) left = 8;
      // Anchor the popover's BOTTOM just above the anchor's top edge so it
      // opens upward, like the original `bottom-full` behaviour.
      const bottom = window.innerHeight - r.top + 8;
      // z 220 so the picker sits ABOVE the comment modal (z-200) and every
      // other overlay; it's portaled to <body>, so this is always safe.
      setStyle({ position: 'fixed', left, bottom, width: w, zIndex: 220 });
    };
    compute();
    window.addEventListener('resize', compute);
    window.addEventListener('scroll', compute, true);
    return () => {
      window.removeEventListener('resize', compute);
      window.removeEventListener('scroll', compute, true);
    };
  }, [open, anchorRef, width]);

  return style;
}
