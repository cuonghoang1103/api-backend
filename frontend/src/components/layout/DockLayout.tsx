'use client';

import { useState, useEffect, useLayoutEffect } from 'react';
import NavigationDock, {
  DOCK_WIDTH_COLLAPSED,
  DOCK_WIDTH_EXPANDED,
} from './NavigationDock';

const MQ_MD = '(min-width: 768px)';

export default function DockLayout({ children }: { children: React.ReactNode }) {
  // `null` until the first client effect resolves the viewport
  // width, so SSR and the first client render both produce
  // paddingLeft: 0 (no shift) — avoiding any hydration warning
  // when the user is on a wide screen.
  const [isWide, setIsWide] = useState<boolean | null>(null);
  const [isPanelHovered, setIsPanelHovered] = useState(false);

  // Track the rail's hover state via a single CSS class on
  // <html>; the rail itself doesn't need any direct coupling
  // because NavigationDock already animates its own width. We
  // only need this here so the main content can pad with the
  // *expanded* width while the user is hovering, then ease back
  // when the cursor leaves the rail.
  useLayoutEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    const wide = window.matchMedia(MQ_MD).matches;
    setIsWide(wide);
    document.documentElement.style.setProperty(
      '--dock-shift',
      wide ? `${DOCK_WIDTH_COLLAPSED}px` : '0px',
    );

    // Listen to pointer events on the whole left edge so the
    // main content can react to the rail being hovered without
    // us having to thread the state through NavigationDock.
    const EDGE_PX = DOCK_WIDTH_EXPANDED + 16;
    const handleMove = (e: PointerEvent) => {
      if (e.clientX <= EDGE_PX) {
        if (!isPanelHovered) setIsPanelHovered(true);
      } else if (isPanelHovered) {
        setIsPanelHovered(false);
      }
    };
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [isPanelHovered]);

  // Keep CSS var in sync with state (consumed by the top navbar).
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const wide = typeof window !== 'undefined' ? window.matchMedia(MQ_MD).matches : false;
    const shift = wide
      ? (isPanelHovered ? DOCK_WIDTH_EXPANDED : DOCK_WIDTH_COLLAPSED)
      : 0;
    document.documentElement.style.setProperty('--dock-shift', `${shift}px`);
  }, [isPanelHovered, isWide]);

  // Track viewport crossings (e.g. user resizes window).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(MQ_MD);
    const onChange = () => {
      setIsWide(mq.matches);
      const wide = mq.matches;
      document.documentElement.style.setProperty(
        '--dock-shift',
        wide
          ? (isPanelHovered ? `${DOCK_WIDTH_EXPANDED}px` : `${DOCK_WIDTH_COLLAPSED}px`)
          : '0px',
      );
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [isPanelHovered]);

  // Compute the inline shift directly from state. Hover-expand
  // is purely visual on the rail itself, but we DO shift main
  // content by the expanded width while the cursor is on the
  // rail so the labels have somewhere to sit. When the user
  // moves away, content eases back to the collapsed width.
  const shift = isWide === true
    ? (isPanelHovered ? DOCK_WIDTH_EXPANDED : DOCK_WIDTH_COLLAPSED)
    : 0;

  return (
    <>
      <NavigationDock />
      <main
        className="min-h-screen w-full transition-[padding] duration-300 ease-out"
        style={{ paddingLeft: shift }}
      >
        {children}
      </main>
    </>
  );
}
