'use client';

import { useState, useEffect } from 'react';
import NavigationDock from './NavigationDock';

const DOCK_WIDTH = 280;

export default function DockLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('dock-open');
    if (saved === 'true') setIsSidebarOpen(true);
  }, []);

  const toggleDock = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      sessionStorage.setItem('dock-open', String(next));
      return next;
    });
  };

  // Publish a CSS variable so the top navbar can also shift when the
  // dock is open — otherwise the sidebar would overlap the topbar's
  // left edge.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const isWide =
      window.matchMedia('(min-width: 768px)').matches && isSidebarOpen;
    document.documentElement.style.setProperty(
      '--dock-shift',
      isWide ? `${DOCK_WIDTH}px` : '0px',
    );
  }, [isSidebarOpen]);

  // Keep the variable in sync when the viewport crosses the breakpoint.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => {
      const isWide = mq.matches && isSidebarOpen;
      document.documentElement.style.setProperty(
        '--dock-shift',
        isWide ? `${DOCK_WIDTH}px` : '0px',
      );
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [isSidebarOpen]);

  return (
    <>
      {/* Navigation dock: fixed left sidebar */}
      <NavigationDock isOpen={isSidebarOpen} onToggle={toggleDock} />

      {/*
        Main content: full width by default. When the dock is open we
        shift the content to the right by the dock's width so it is
        never overlapped. The shift is animated and only applies on
        viewports that are wide enough to fit both the dock and the
        content; on small screens the dock overlays the content as
        before (no shift, no layout change).
      */}
      <main
        className="min-h-screen w-full transition-[padding] duration-300 ease-out"
        style={{
          paddingLeft: 'var(--dock-shift, 0px)',
        }}
      >
        {children}
      </main>
    </>
  );
}
