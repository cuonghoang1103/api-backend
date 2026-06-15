'use client';

import { useState, useEffect, useLayoutEffect } from 'react';
import NavigationDock, {
  DOCK_WIDTH_COLLAPSED,
  DOCK_WIDTH_EXPANDED,
  DOCK_DRAWER_WIDTH,
} from './NavigationDock';

const MQ_MD = '(min-width: 768px)';

export default function DockLayout({ children }: { children: React.ReactNode }) {
  // Pinned: user clicked the toggle and wants the drawer to
  // stay open + shift content to the right.
  const [isPinned, setIsPinned] = useState(false);
  const [isWide, setIsWide] = useState<boolean | null>(null);

  // Rehydrate pin preference from sessionStorage.
  useLayoutEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    const saved = sessionStorage.getItem('dock-pinned') === 'true';
    const wide = window.matchMedia(MQ_MD).matches;
    setIsWide(wide);
    setIsPinned(saved && wide);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem('dock-pinned', String(isPinned));
  }, [isPinned]);

  // Drive the layout shift:
  //   pinned      -> reserve DOCK_WIDTH_EXPANDED + DOCK_DRAWER_WIDTH + gap
  //   not pinned  -> reserve just the rail collapsed width
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const wide = typeof window !== 'undefined' ? window.matchMedia(MQ_MD).matches : false;
    if (!wide) {
      document.documentElement.style.setProperty('--dock-shift', '0px');
      return;
    }
    const shift = isPinned
      ? DOCK_WIDTH_EXPANDED + DOCK_DRAWER_WIDTH + 8
      : DOCK_WIDTH_COLLAPSED;
    document.documentElement.style.setProperty('--dock-shift', `${shift}px`);
  }, [isPinned, isWide]);

  // Track viewport crossings.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(MQ_MD);
    const onChange = () => {
      const wide = mq.matches;
      setIsWide(wide);
      if (!wide) {
        document.documentElement.style.setProperty('--dock-shift', '0px');
        return;
      }
      const shift = isPinned
        ? DOCK_WIDTH_EXPANDED + DOCK_DRAWER_WIDTH + 8
        : DOCK_WIDTH_COLLAPSED;
      document.documentElement.style.setProperty('--dock-shift', `${shift}px`);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [isPinned]);

  const shift = isWide === true
    ? (isPinned ? DOCK_WIDTH_EXPANDED + DOCK_DRAWER_WIDTH + 8 : DOCK_WIDTH_COLLAPSED)
    : 0;

  return (
    <>
      <NavigationDock
        isPinned={isPinned}
        onPinChange={setIsPinned}
      />
      <main
        className="min-h-screen w-full transition-[padding] duration-300 ease-out"
        style={{ paddingLeft: shift }}
      >
        {children}
      </main>
    </>
  );
}
