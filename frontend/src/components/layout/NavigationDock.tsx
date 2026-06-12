'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Home, BookOpen, FolderOpen, Music, MessageCircle,
  LayoutDashboard, Shield, BookMarked, Receipt,
  Settings, ChevronLeft, ChevronRight, GraduationCap,
  ShoppingBag, Gamepad2, Globe, Sparkles, UserCircle,
} from 'lucide-react';

interface DockItem {
  href: string;
  label: string;
  icon: React.ElementType;
  section: 'main' | 'admin' | 'user';
  badge?: string;
}

const DOCK_ITEMS: DockItem[] = [
  { href: '/', label: 'Home', icon: Home, section: 'main' },
  { href: '/blog', label: 'Blog', icon: BookOpen, section: 'main' },
  { href: '/projects', label: 'Projects', icon: FolderOpen, section: 'main' },
  { href: '/music', label: 'Music', icon: Music, section: 'main' },
  { href: '/chat', label: 'AI Chat', icon: MessageCircle, section: 'main' },
  { href: '/shop', label: 'Shop', icon: ShoppingBag, section: 'user' },
  { href: '/academy', label: 'Academy', icon: GraduationCap, section: 'user' },
  { href: '/games', label: 'Games', icon: Gamepad2, section: 'user' },
  { href: '/social', label: 'Feed', icon: Globe, section: 'user' },
  { href: '/my-courses', label: 'My Courses', icon: BookMarked, section: 'user' },
  { href: '/my-orders', label: 'Orders', icon: Receipt, section: 'user' },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'admin' },
  { href: '/admin', label: 'Admin', icon: Shield, section: 'admin' },
];

const SECTIONS = {
  main: { label: 'Navigate', icon: Sparkles },
  user: { label: 'Personal', icon: UserCircle },
  admin: { label: 'System', icon: Settings },
} as const;

const DOCK_WIDTH = 220;

// ── Apple-style easing ──────────────────────────────────────────────
const APPLE_EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];
const APPLE_DURATION = 0.3;

// ── Sliding dock panel: slide in from left on open ──────────────────
const dockVariants: Variants = {
  hidden: { x: -DOCK_WIDTH - 20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 200, damping: 25, mass: 0.8 },
  },
  exit: {
    x: -DOCK_WIDTH - 20,
    opacity: 0,
    transition: { type: 'spring', stiffness: 280, damping: 28 },
  },
};

// ── Staggered nav section: each section fades/slides in sequentially ─
const sectionVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.07,
      duration: APPLE_DURATION,
      ease: APPLE_EASE,
    },
  }),
};

// ── Individual nav item: pillow press via framer-motion ──────────────
// Uses whileHover / whileTap — pure transform, zero layout reflow
const itemVariants: Variants = {
  default: {
    backgroundColor: 'rgba(0,0,0,0)',
    scale: 1,
  },
  hover: {
    scale: 0.97,
    backgroundColor: 'rgba(255,255,255,0.06)',
    transition: { duration: 0.18, ease: APPLE_EASE },
  },
  tap: {
    scale: 0.94,
    backgroundColor: 'rgba(255,255,255,0.04)',
    transition: { duration: 0.1, ease: APPLE_EASE },
  },
  active: {
    scale: 1,
    backgroundColor: 'rgba(139,92,246,0.12)',
    transition: { duration: 0.2, ease: APPLE_EASE },
  },
};

// ── Icon glow transition ─────────────────────────────────────────────
const iconVariants: Variants = {
  default: { color: '#94a3b8' },
  hover: { color: '#a78bfa' },
  active: { color: '#8B5CF6' },
};

interface NavigationDockProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function NavigationDock({ isOpen, onToggle }: NavigationDockProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const sections = (['main', 'user', 'admin'] as const).map((key, i) => ({
    key,
    index: i,
    ...SECTIONS[key],
    items: DOCK_ITEMS.filter((item) => item.section === key),
  }));

  return (
    <>
      {/* ── Toggle button ───────────────────────────────────── */}
      <motion.button
        onClick={onToggle}
        className="fixed top-16 left-4 z-[60] flex items-center justify-center w-10 h-10 rounded-2xl
          bg-[#0d1117]/90 backdrop-blur-xl border border-white/10
          shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(139,92,246,0.15)]
          transition-all duration-200 cursor-pointer"
        whileHover={{ scale: 1.05, borderColor: 'rgba(139,92,246,0.4)' }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close navigation dock' : 'Open navigation dock'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ChevronLeft className="w-4 h-4 text-neon-violet" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ChevronRight className="w-4 h-4 text-text-secondary" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Mobile backdrop ──────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm md:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* ── Dock panel with staggered entry ───────────────────── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.nav
            key="dock"
            variants={dockVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-16 left-0 bottom-0 z-[38] flex flex-col"
            style={{ width: DOCK_WIDTH }}
          >
            <div
              className="flex-1 flex flex-col rounded-r-[28px] overflow-hidden
                bg-[#0d1117]/95 backdrop-blur-md md:bg-[#0d1117]/[0.98] md:backdrop-blur-none
                border-r border-white/[0.06]
                shadow-[8px_0_48px_rgba(0,0,0,0.6),inset_-1px_0_0_rgba(255,255,255,0.04)]"
            >
              {/* Dock header */}
              <div className="px-4 pt-16 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-violet shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted/60">
                    Navigation Dock
                  </span>
                </div>
              </div>

              {/* Sections with staggered fade-in */}
              <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-4 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
                {sections.map(({ key, label, icon: SectionIcon, items, index }) => (
                  <motion.div
                    key={key}
                    custom={index}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {/* Section header */}
                    <div className="flex items-center gap-2 px-3 mb-1.5">
                      <SectionIcon className="w-3 h-3 text-text-muted/40" />
                      <span className="text-[9px] font-mono font-semibold uppercase tracking-widest text-text-muted/40">
                        {label}
                      </span>
                      <div className="flex-1 h-px bg-white/[0.04]" />
                    </div>

                    {/* Section items */}
                    <div className="space-y-0.5">
                      {items.map((item) => {
                        const isActive = pathname === item.href ||
                          (item.href !== '/' && pathname.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                          <motion.div
                            key={item.href}
                            variants={isActive ? { ...itemVariants, active: itemVariants.active } : itemVariants}
                            initial="default"
                            animate={isActive ? 'active' : 'default'}
                            whileHover={isActive ? undefined : 'hover'}
                            whileTap={isActive ? undefined : 'tap'}
                            custom={isActive}
                          >
                            <Link
                              href={item.href}
                              className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl overflow-hidden"
                              style={{ display: 'flex' }}
                            >
                              {/* ── Sliding active indicator (GPU-accelerated) ── */}
                              {isActive && (
                                <motion.div
                                  layoutId="activeIndicator"
                                  className="absolute inset-y-0 left-0 w-[3px] rounded-full"
                                  style={{
                                    background: 'linear-gradient(180deg, #22d3ee, #8b5cf6)',
                                    boxShadow: '0 0 10px rgba(34,211,238,0.6), 0 0 20px rgba(139,92,246,0.3)',
                                  }}
                                  transition={{
                                    type: 'spring',
                                    stiffness: 350,
                                    damping: 30,
                                    mass: 0.5,
                                  }}
                                />
                              )}

                              {/* Icon with color animation */}
                              <motion.div
                                className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                                animate={{
                                  backgroundColor: isActive
                                    ? 'rgba(139,92,246,0.15)'
                                    : 'rgba(255,255,255,0.04)',
                                  boxShadow: isActive
                                    ? '0 0 12px rgba(139,92,246,0.25)'
                                    : 'none',
                                }}
                                transition={{ duration: 0.2, ease: APPLE_EASE }}
                              >
                                <motion.span
                                  variants={iconVariants}
                                  animate={isActive ? 'active' : 'default'}
                                  whileHover={isActive ? undefined : 'hover'}
                                  style={{ display: 'flex' }}
                                >
                                  <Icon className="w-4 h-4 shrink-0" />
                                </motion.span>
                              </motion.div>

                              {/* Label */}
                              <span
                                className="text-[13px] font-medium truncate"
                                style={{
                                  color: isActive ? '#c4b5fd' : '#94a3b8',
                                  transition: `color ${APPLE_DURATION}s cubic-bezier(0.23,1,0.32,1)`,
                                }}
                              >
                                {item.label}
                              </span>

                              {/* Active glow dot */}
                              <AnimatePresence>
                                {isActive && (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: APPLE_EASE }}
                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-violet shrink-0"
                                    style={{ boxShadow: '0 0 6px rgba(139,92,246,0.9)' }}
                                  />
                                )}
                              </AnimatePresence>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 pb-5 border-t border-white/[0.04] pt-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-white/10">
                    <img src="/images/avatar.png" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-text-primary truncate">CuongHoang</p>
                    <p className="text-[9px] text-text-muted/60 font-mono">v2.0.0</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
