'use client';

import { useState, useEffect } from 'react';
import NavigationDock from './NavigationDock';

export default function DockLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    <div className="flex min-h-screen w-full overflow-x-hidden">
      {/* Dock + toggle button — both rendered by NavigationDock */}
      <NavigationDock isOpen={isSidebarOpen} onToggle={toggleDock} />

      {/* Main content: takes remaining width */}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}
