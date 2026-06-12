'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NavigationDock from './NavigationDock';

const DOCK_WIDTH = 220;
const DOCK_TOGGLE_OFFSET = 52; // toggle button width + gap

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

  // Use transform: translateX() instead of paddingLeft to avoid layout reflow.
  // transform is GPU-accelerated and does NOT cause style recalculation.
  return (
    <>
      <NavigationDock isOpen={isSidebarOpen} onToggle={toggleDock} />

      <motion.div
        className="relative"
        animate={{
          x: isSidebarOpen ? DOCK_WIDTH + DOCK_TOGGLE_OFFSET : 0,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        {children}
      </motion.div>
    </>
  );
}
