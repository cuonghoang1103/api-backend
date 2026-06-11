'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NavigationDock from './NavigationDock';

const DOCK_WIDTH = 220;

export default function DockLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Persist dock open state in sessionStorage so refreshing keeps it open
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
      <NavigationDock isOpen={isSidebarOpen} onToggle={toggleDock} />

      {/* Main content — smoothly shifts when dock opens/closes */}
      <motion.div
        className="relative"
        animate={{
          paddingLeft: isSidebarOpen ? DOCK_WIDTH + 52 : 0,
          // paddingRight stays 0 — dock is on the LEFT
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        {children}
      </motion.div>
    </>
  );
}
