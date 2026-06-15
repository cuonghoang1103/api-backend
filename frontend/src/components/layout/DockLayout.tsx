'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import NavigationDock, { DOCK_WIDTH_COLLAPSED } from './NavigationDock';

const MQ_MD = '(min-width: 768px)';

export default function DockLayout({ children }: { children: React.ReactNode }) {
  const [isWide, setIsWide] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    const wide = window.matchMedia(MQ_MD).matches;
    setIsWide(wide);
    document.documentElement.style.setProperty(
      '--dock-shift',
      wide ? `${DOCK_WIDTH_COLLAPSED}px` : '0px',
    );
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(MQ_MD);
    const onChange = () => {
      const wide = mq.matches;
      setIsWide(wide);
      document.documentElement.style.setProperty(
        '--dock-shift',
        wide ? `${DOCK_WIDTH_COLLAPSED}px` : '0px',
      );
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const shift = isWide === true ? DOCK_WIDTH_COLLAPSED : 0;

  return (
    <>
      <NavigationDock />
      <main
        className="min-h-screen w-full"
        style={{ paddingLeft: shift }}
      >
        {children}
      </main>
    </>
  );
}
