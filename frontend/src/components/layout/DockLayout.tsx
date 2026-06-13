'use client';

import { useState, useEffect } from 'react';
import NavigationDock from './NavigationDock';

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

  return (
    <>
      {/* Navigation dock: fixed overlay — does NOT affect page layout */}
      <NavigationDock isOpen={isSidebarOpen} onToggle={toggleDock} />

      {/* Main content: always full width, never shifts */}
      <main className="min-h-screen w-full">
        {children}
      </main>
    </>
  );
}
