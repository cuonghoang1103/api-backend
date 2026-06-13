'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NavigationDock from './NavigationDock';

export default function DockLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const saved = sessionStorage.getItem('dock-open');
    if (saved === 'true') setIsSidebarOpen(true);
  }, []);

  // Chat page has its own navigation — hide the global NavigationDock
  const isChatPage = pathname === '/chat';

  const toggleDock = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      sessionStorage.setItem('dock-open', String(next));
      return next;
    });
  };

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      {/* Dock — only on non-chat pages */}
      {!isChatPage && <NavigationDock isOpen={isSidebarOpen} onToggle={toggleDock} />}

      {/* Main content: takes remaining width */}
      <main className={`flex-1 min-w-0 ${isChatPage ? '' : ''}`}>
        {children}
      </main>
    </div>
  );
}
