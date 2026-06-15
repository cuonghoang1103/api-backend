'use client';

import { useState, useEffect, useLayoutEffect } from 'react';
import NavigationDock from './NavigationDock';

const DOCK_WIDTH = 280;
const MQ_MD = '(min-width: 768px)';

export default function DockLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // `null` until we know the viewport width on the client. This
  // avoids a hydration mismatch: SSR always renders no shift, the
  // client decides on first effect whether the viewport is wide
  // enough for the dock to push content (≥md).
  const [isWide, setIsWide] = useState<boolean | null>(null);

  // Read saved state + measure viewport on the very first client
  // pass so the first paint already has the correct shift.
  useLayoutEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    const saved = sessionStorage.getItem('dock-open') === 'true';
    const wide = window.matchMedia(MQ_MD).matches;
    setIsWide(wide);
    setIsSidebarOpen(saved);
    document.documentElement.style.setProperty(
      '--dock-shift',
      saved && wide ? `${DOCK_WIDTH}px` : '0px',
    );
  }, []);

  // Keep CSS var in sync with state (consumed by the top navbar).
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const wide = typeof window !== 'undefined' ? window.matchMedia(MQ_MD).matches : false;
    document.documentElement.style.setProperty(
      '--dock-shift',
      isSidebarOpen && wide ? `${DOCK_WIDTH}px` : '0px',
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
        isSidebarOpen && wide ? `${DOCK_WIDTH}px` : '0px',
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

  // Compute the inline shift directly from state so the <main>
  // element shifts on the first client render — not after a CSS
  // variable update.
  const shift = isSidebarOpen && isWide === true ? DOCK_WIDTH : 0;

  return (
    <>
      {/* Navigation dock: fixed left sidebar */}
      <NavigationDock isOpen={isSidebarOpen} onToggle={toggleDock} />

      {/*
        Main content: full width by default. When the dock is open on
        a viewport wide enough (≥md) we shift the content to the
        right by the dock's width so it is never overlapped. The
        shift is animated. On small screens the dock overlays the
        content as before.
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
