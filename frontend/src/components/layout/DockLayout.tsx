'use client';

import { useState, useEffect, useLayoutEffect } from 'react';
import NavigationDock from './NavigationDock';

const DOCK_WIDTH_COLLAPSED = 60;
const DOCK_WIDTH_EXPANDED = 280;
const MQ_MD = '(min-width: 768px)';

export default function DockLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // `null` until we know the viewport width on the client. This
  // avoids a hydration mismatch: SSR always renders no shift, the
  // client decides on first effect whether the viewport is wide
  // enough for the dock to push content (≥md).
  const [isWide, setIsWide] = useState<boolean | null>(null);

  // The dock is always mounted at 72px (collapsed) on md+ screens.
  // Only when the user clicks the toggle (or the drawer mode is
  // active on mobile) does it push the main content. The hover-
  // expand to 280px is *visual only* — it overlays the page rather
  // than reflowing it, matching macOS / iOS dock behaviour.
  useLayoutEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    const saved = sessionStorage.getItem('dock-open') === 'true';
    const wide = window.matchMedia(MQ_MD).matches;
    setIsWide(wide);
    setIsSidebarOpen(saved);
    // On md+ the dock always reserves 72px so the collapsed icons
    // stay visible. Only when the user pinned the drawer open do
    // we shift content by 280.
    document.documentElement.style.setProperty(
      '--dock-shift',
      wide ? `${DOCK_WIDTH_COLLAPSED}px` : '0px',
    );
    document.documentElement.style.setProperty(
      '--dock-drawer-pinned',
      saved && wide ? '1' : '0',
    );
  }, []);

  // Keep CSS vars in sync with state (consumed by the top navbar).
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const wide = typeof window !== 'undefined' ? window.matchMedia(MQ_MD).matches : false;
    document.documentElement.style.setProperty(
      '--dock-shift',
      wide ? `${DOCK_WIDTH_COLLAPSED}px` : '0px',
    );
    document.documentElement.style.setProperty(
      '--dock-drawer-pinned',
      isSidebarOpen && wide ? '1' : '0',
    );
  }, [isSidebarOpen, isWide]);

  // Track viewport crossings (e.g. user resizes window).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(MQ_MD);
    const onChange = () => {
      setIsWide(mq.matches);
      const wide = mq.matches;
      document.documentElement.style.setProperty(
        '--dock-shift',
        wide ? `${DOCK_WIDTH_COLLAPSED}px` : '0px',
      );
      document.documentElement.style.setProperty(
        '--dock-drawer-pinned',
        isSidebarOpen && wide ? '1' : '0',
      );
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [isSidebarOpen]);

  const toggleDock = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      sessionStorage.setItem('dock-open', String(next));
      return next;
    });
  };

  // Compute the inline shift directly from state. The dock always
  // takes 72px on md+; it only pushes the rest of the layout to
  // 280 when the drawer is pinned open.
  const shift = isWide === true
    ? (isSidebarOpen ? DOCK_WIDTH_EXPANDED : DOCK_WIDTH_COLLAPSED)
    : 0;

  return (
    <>
      {/* Navigation dock: fixed left sidebar (always visible on md+) */}
      <NavigationDock isOpen={isSidebarOpen} onToggle={toggleDock} />

      {/*
        Main content: padded to leave room for the 72px collapsed
        dock on md+. Hover-expand is purely visual (overlays the
        main area) so we don't reflow on every cursor movement.
        The pinned-drawer state still adds the extra 208px to make
        room for labels.
      */}
      <main
        className="min-h-screen w-full transition-[padding] duration-300 ease-out"
        style={{ paddingLeft: shift }}
      >
        {children}
      </main>
    </>
  );
}
