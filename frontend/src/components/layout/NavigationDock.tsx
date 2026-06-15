'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Home, BookOpen, FolderOpen, Music, MessagesSquare,
  LayoutDashboard, Shield, BookMarked, Receipt,
  Settings, Sparkles, UserCircle,
  GraduationCap, ShoppingBag, Gamepad2, Globe,
  PanelLeft, PanelLeftClose,
} from 'lucide-react';
import { useMessagingStore } from '@/store/messagingStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import ChatSessionsDrawer from './ChatSessionsDrawer';

// ── Width constants ──────────────────────────────────────────────
// The rail is intentionally slim (52px) so it stays out of the
// way on every page. The expanded hover state (220px) is just
// wide enough to show short labels next to the icons; the
// sessions drawer is a separate floating panel that lives next
// to the rail.
export const DOCK_WIDTH_COLLAPSED = 52;
export const DOCK_WIDTH_EXPANDED = 220;
export const DOCK_DRAWER_WIDTH = 280;

interface DockItem {
  href: string;
  label: string;
  icon: React.ElementType;
  section: 'main' | 'user' | 'admin';
  showUnread?: boolean;
}

const DOCK_ITEMS: DockItem[] = [
  { href: '/', label: 'Home', icon: Home, section: 'main' },
  { href: '/blog', label: 'Blog', icon: BookOpen, section: 'main' },
  { href: '/projects', label: 'Projects', icon: FolderOpen, section: 'main' },
  { href: '/music', label: 'Music', icon: Music, section: 'main' },
  { href: '/messages', label: 'Messages', icon: MessagesSquare, section: 'main', showUnread: true },
  { href: '/chat', label: 'AI Chat', icon: Sparkles, section: 'main' },
  { href: '/shop', label: 'Shop', icon: ShoppingBag, section: 'user' },
  { href: '/academy', label: 'Academy', icon: GraduationCap, section: 'user' },
  { href: '/games', label: 'Games', icon: Gamepad2, section: 'user' },
  { href: '/social', label: 'Feed', icon: Globe, section: 'user' },
  { href: '/courses', label: 'Courses', icon: BookMarked, section: 'user' },
  { href: '/my-orders', label: 'Orders', icon: Receipt, section: 'user' },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'admin' },
  { href: '/admin', label: 'Admin', icon: Shield, section: 'admin' },
];

const SECTIONS = {
  main: { label: 'Navigate', icon: Sparkles },
  user: { label: 'Personal', icon: UserCircle },
  admin: { label: 'System', icon: Settings },
} as const;

const APPLE_EASE: [number, number, number, number] = [0.32, 0.94, 0.6, 1];

// iOS dock magnification — gentle bump, not a leap. 1.10 on the
// hovered row, falling off to 1.0 over 2 rows. Kept small because
// the rail is narrow and we don't want to push siblings.
function magnifyScale(distance: number): number {
  if (distance === 0) return 1.10;
  if (distance === 1) return 1.05;
  if (distance === 2) return 1.02;
  return 1.0;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, x: -6 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.22, ease: APPLE_EASE },
  }),
};

interface NavigationDockProps {
  /** True when the dock drawer is pinned (auto-hover is ignored). */
  isPinned: boolean;
  onPinChange: (pinned: boolean) => void;
  /** Backwards-compat alias for mobile (drawer mode). */
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function NavigationDock({
  isPinned,
  onPinChange,
}: NavigationDockProps) {
  const pathname = usePathname();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isPanelHovered, setIsPanelHovered] = useState(false);
  const [isDrawerHovered, setIsDrawerHovered] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unreadMessages = useMessagingStore((s) => s.unreadTotal);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [isWideViewport, setIsWideViewport] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsWideViewport(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const sections = (['main', 'user', 'admin'] as const).map((key, i) => ({
    key,
    index: i,
    ...SECTIONS[key],
    items: DOCK_ITEMS.filter((item) => item.section === key),
  }));
  const flatItems = sections.flatMap((s) => s.items);

  const clearAutoClose = () => {
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
      autoCloseTimeoutRef.current = null;
    }
  };

  const handlePanelEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsPanelHovered(true);
    // Auto-open the sessions drawer on hover. Pinned mode
    // ignores this; pin keeps the drawer visible regardless.
    if (!isPinned) {
      clearAutoClose();
    }
  }, [isPinned]);

  // Leaving the rail schedules a 180ms close. If the cursor
  // reaches the floating drawer in time, the close cancels.
  const handlePanelLeave = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsPanelHovered(false);
      setHoveredIdx(null);
    }, 120);
    if (!isPinned) {
      clearAutoClose();
      autoCloseTimeoutRef.current = setTimeout(() => {
        // Only auto-close if the cursor is not on the drawer.
        // isDrawerHovered state is set inside the drawer.
      }, 180);
    }
  }, [isPinned]);

  const handleDrawerEnter = useCallback(() => {
    setIsDrawerHovered(true);
    clearAutoClose();
  }, []);

  const handleDrawerLeave = useCallback(() => {
    setIsDrawerHovered(false);
    if (isPinned) return;
    clearAutoClose();
    autoCloseTimeoutRef.current = setTimeout(() => {
      // No-op — visibility is computed from hover state
    }, 180);
  }, [isPinned]);

  // Sessions drawer visibility:
  //   pinned (toggle pressed)            -> always visible
  //   hovered rail / hovered drawer      -> visible (auto)
  //   otherwise                          -> hidden
  // Mobile gets the same behaviour, but the rail itself fills
  // the viewport because the layout script reserves zero
  // horizontal space below md.
  const drawerVisible = isPinned || isPanelHovered || isDrawerHovered;

  const togglePin = useCallback(() => {
    onPinChange(!isPinned);
  }, [isPinned, onPinChange]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (autoCloseTimeoutRef.current) clearTimeout(autoCloseTimeoutRef.current);
    };
  }, []);

  // Rail is expanded when hovered OR when the sessions drawer
  // is visible (so the toggle button and icon labels stay
  // legible when the drawer is up).
  const isExpanded = isPanelHovered || drawerVisible;

  return (
    <>
      {/* ── Sessions drawer (floating, glass) ─────────────────────
          Lives to the right of the rail. In hover mode (auto)
          the drawer sits over the page content — no layout
          shift. In pin mode the same drawer is used; layout
          shift is owned by DockLayout. */}
      <AnimatePresence>
        {drawerVisible && isWideViewport && (
          <motion.div
            key="dock-drawer"
            initial={{ opacity: 0, x: -12, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30, mass: 0.7 }}
            onMouseEnter={handleDrawerEnter}
            onMouseLeave={handleDrawerLeave}
            className={cn(
              'fixed z-[58] rounded-2xl overflow-hidden',
              isPinned ? 'top-16 bottom-4' : 'top-16 bottom-4',
            )}
            style={{
              // Sit just to the right of the (expanded) rail; in
              // hover mode this overlaps the page, in pin mode
              // DockLayout has already reserved the slot.
              left: DOCK_WIDTH_COLLAPSED + 8,
              width: DOCK_DRAWER_WIDTH,
              background: 'rgba(10, 10, 15, 0.50)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            <ChatSessionsDrawer
              variant={isPinned ? 'pinned' : 'overlay'}
              onNavigateAway={() => {
                // After picking a session, close auto-hover but
                // keep the pin if the user has pinned the
                // drawer.
                if (!isPinned) {
                  setIsPanelHovered(false);
                  setIsDrawerHovered(false);
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Backdrop: only when the drawer is pinned. In auto
           hover mode the drawer just slides in/out and the
           user keeps free mouse access to the page. ── */}
      <AnimatePresence>
        {isPinned && isWideViewport && (
          <motion.div
            key="dock-pinned-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: APPLE_EASE }}
            onClick={togglePin}
            className="fixed inset-0 z-[57] bg-black/30"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar panel (the rail) ────────────────────────────── */}
      <motion.nav
        key="dock-panel"
        initial={false}
        animate={{ width: isExpanded ? DOCK_WIDTH_EXPANDED : DOCK_WIDTH_COLLAPSED }}
        transition={{ type: 'spring', stiffness: 360, damping: 32, mass: 0.85 }}
        onMouseEnter={handlePanelEnter}
        onMouseLeave={handlePanelLeave}
        className="fixed top-0 left-0 h-full z-[59] flex flex-col pt-16"
        style={{ overflow: 'visible' }}
        aria-label="Primary navigation"
      >
        <div
          className="h-full flex flex-col overflow-hidden
            bg-[#0d1117]/95 backdrop-blur-xl
            border-r border-white/[0.05]
            shadow-[6px_0_32px_rgba(0,0,0,0.45)]"
        >
          {/* Sections — no header, no footer, no section labels.
              The expanded 220px width is just enough to fit
              short labels next to the icons. */}
          <div className="flex-1 overflow-y-auto overflow-x-visible py-3">
            {sections.map(({ key, items, index }) => (
              <motion.div
                key={key}
                custom={index}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                className="space-y-0.5"
              >
                {items.map((item) => {
                  const flatIdx = flatItems.indexOf(item);
                  const distance = hoveredIdx === null ? 99 : Math.abs(flatIdx - hoveredIdx);
                  const isActive = pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  const showUnread = !!item.showUnread && mounted && isAuthenticated && unreadMessages > 0;

                  return (
                    <DockRow
                      key={item.href}
                      item={item}
                      Icon={Icon}
                      isActive={isActive}
                      isExpanded={isExpanded}
                      scale={magnifyScale(distance)}
                      isHovered={hoveredIdx === flatIdx}
                      showUnread={showUnread}
                      unreadCount={unreadMessages}
                      onHover={() => setHoveredIdx(flatIdx)}
                      onLeave={() => {
                        if (hoveredIdx === flatIdx) setHoveredIdx(null);
                      }}
                    />
                  );
                })}

                {/* Pin / unpin toggle — only in the main section,
                    only on desktop. Sits as a separator so the
                    user sees it after the navigation group. */}
                {key === 'main' && isWideViewport && (
                  <div className="mt-2 mx-1">
                    <motion.button
                      type="button"
                      onClick={togglePin}
                      className={cn(
                        'group relative flex w-full items-center rounded-xl select-none',
                        !isExpanded
                          ? 'justify-center px-1.5 py-1.5 mx-0.5'
                          : 'gap-2.5 px-3 py-2',
                      )}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                      aria-label={isPinned ? 'Bỏ ghim sidebar' : 'Ghim sidebar'}
                      aria-pressed={isPinned}
                    >
                      <div
                        className={cn(
                          'flex shrink-0 items-center justify-center rounded-lg',
                          'transition-colors duration-150',
                          isPinned
                            ? 'bg-white/[0.08] text-text-primary'
                            : 'text-text-secondary group-hover:text-text-primary',
                          !isExpanded ? 'w-8 h-8' : 'w-8 h-8',
                        )}
                      >
                        {isPinned ? (
                          <PanelLeftClose
                            className={cn(
                              'shrink-0',
                              !isExpanded ? 'w-[15px] h-[15px]' : 'w-4 h-4',
                            )}
                          />
                        ) : (
                          <PanelLeft
                            className={cn(
                              'shrink-0',
                              !isExpanded ? 'w-[15px] h-[15px]' : 'w-4 h-4',
                            )}
                          />
                        )}
                      </div>
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.span
                            key="dock-toggle-label"
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -4 }}
                            transition={{ duration: 0.16, ease: APPLE_EASE }}
                            className="text-[12px] font-medium text-text-secondary group-hover:text-text-primary whitespace-nowrap"
                          >
                            {isPinned ? 'Bỏ ghim' : 'Ghim sidebar'}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.nav>
    </>
  );
}

// ── Single dock row ───────────────────────────────────────────────
// Compact row, no glow: a soft white-tinted background for the
// hovered / active state and a flat gradient bar on the inside
// edge when the row is the active one. The bar is no-shadow so
// the rail stays clean.
function DockRow({
  item,
  Icon,
  isActive,
  isExpanded,
  scale,
  isHovered,
  showUnread,
  unreadCount,
  onHover,
  onLeave,
}: {
  item: DockItem;
  Icon: React.ElementType;
  isActive: boolean;
  isExpanded: boolean;
  scale: number;
  isHovered: boolean;
  showUnread: boolean;
  unreadCount: number;
  onHover: () => void;
  onLeave: () => void;
}) {
  const collapsed = !isExpanded;

  return (
    <motion.div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      animate={{ scale }}
      transition={{ type: 'spring', stiffness: 380, damping: 26, mass: 0.55 }}
      style={{ transformOrigin: 'center center' }}
    >
      <Link
        href={item.href}
        className={cn(
          'relative flex items-center rounded-xl overflow-hidden select-none',
          collapsed
            ? 'justify-center px-1.5 py-1.5 mx-1.5'
            : 'gap-2.5 px-3 py-2.5 mx-1',
        )}
        style={{ display: 'flex' }}
      >
        {/* Active indicator bar — flat gradient, no halo. The
            gradient is the brand cyan→violet we already use
            elsewhere; without the box-shadow it reads as a
            printed line, not as light. */}
        {!collapsed && isActive && (
          <motion.div
            layoutId="navActiveIndicator"
            className="absolute inset-y-1 left-0 w-[2px] rounded-full"
            style={{
              background: 'linear-gradient(180deg, #22d3ee, #8b5cf6)',
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.5 }}
          />
        )}

        {/* Icon wrapper — a single soft background tint. No
            box-shadow glow. The pill background opacity is
            intentionally low (0.06-0.08) so the rail stays
            quiet and the cursor's location is the only thing
            that gets emphasis. */}
        <motion.div
          className={cn(
            'flex items-center justify-center rounded-lg shrink-0',
            collapsed ? 'w-8 h-8' : 'w-8 h-8',
          )}
          animate={{
            backgroundColor: isActive
              ? 'rgba(255,255,255,0.08)'
              : isHovered
                ? 'rgba(255,255,255,0.06)'
                : 'rgba(255,255,255,0.0)',
          }}
          transition={{ duration: 0.18, ease: APPLE_EASE }}
        >
          <Icon
            className={cn(
              'shrink-0 transition-colors duration-150',
              collapsed ? 'w-[15px] h-[15px]' : 'w-3.5 h-3.5',
              isActive
                ? 'text-text-primary'
                : isHovered
                  ? 'text-text-primary'
                  : 'text-text-muted',
            )}
          />
        </motion.div>

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              key="dock-row-label"
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.16, ease: APPLE_EASE }}
              className={cn(
                'whitespace-nowrap text-[12px] font-medium',
                isActive
                  ? 'text-text-primary'
                  : isHovered
                    ? 'text-text-primary'
                    : 'text-text-secondary',
              )}
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread badge — Messenger-style pill or dot. */}
        {showUnread && (
          <UnreadBadge
            count={unreadCount}
            collapsed={collapsed}
            isActive={isActive}
          />
        )}
      </Link>
    </motion.div>
  );
}

// ── Unread badge ──────────────────────────────────────────────────
function UnreadBadge({
  count,
  collapsed,
  isActive,
}: {
  count: number;
  collapsed: boolean;
  isActive: boolean;
}) {
  if (collapsed) {
    return (
      <span
        className="absolute top-0.5 right-0.5 min-w-[14px] h-[14px] px-1
          bg-red-500 text-white text-[9px] font-bold rounded-full
          flex items-center justify-center
          shadow-[0_0_0_2px_rgba(13,17,23,0.95)]"
      >
        {count > 9 ? '9+' : count}
      </span>
    );
  }
  return (
    <span
      className={cn(
        'ml-auto text-[10px] font-mono font-semibold',
        isActive ? 'text-text-primary' : 'text-text-muted',
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
