// Ref-counted page scroll lock.
//
// Why this exists: the comment modal and the dock sidebar both did
// `document.body.style.overflow = 'hidden'` to freeze the page behind
// them. That is a NO-OP whenever the viewport scrolls on <html> (the
// default document scroller) — `overflow` only propagates to the viewport
// from the root element, not from <body>. So the / feed kept scrolling
// underneath an open overlay ("lướt trong bình luận thì trang ngoài vẫn
// lướt"). This locks the REAL scroller (documentElement) and compensates
// the scrollbar width so desktop content doesn't jump sideways.
//
// Ref-counted so two overlays (e.g. a modal opened from inside the dock)
// don't unlock each other prematurely — the page unfreezes only when the
// last lock is released.

let locks = 0;
let prevHtmlOverflow = '';
let prevBodyPaddingRight = '';

export function lockScroll(): void {
  if (typeof document === 'undefined') return;
  locks += 1;
  if (locks > 1) return; // already locked by an outer overlay

  const html = document.documentElement;
  const body = document.body;
  // Width of the now-hidden scrollbar, so we can pad it back.
  const scrollbarW = window.innerWidth - html.clientWidth;

  prevHtmlOverflow = html.style.overflow;
  prevBodyPaddingRight = body.style.paddingRight;

  html.style.overflow = 'hidden';
  if (scrollbarW > 0) {
    const cur = parseFloat(getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${cur + scrollbarW}px`;
  }
}

export function unlockScroll(): void {
  if (typeof document === 'undefined') return;
  if (locks === 0) return;
  locks -= 1;
  if (locks > 0) return; // an outer overlay is still open

  document.documentElement.style.overflow = prevHtmlOverflow;
  document.body.style.paddingRight = prevBodyPaddingRight;
}

/** True while any overlay (modal / menu / sidebar) has the page scroll locked.
 *  Used by the home feed's pull-to-refresh so its window-level touch handlers
 *  don't hijack scrolling INSIDE an open overlay (menu stuck-at-bottom bug). */
export function isScrollLocked(): boolean {
  return locks > 0;
}
