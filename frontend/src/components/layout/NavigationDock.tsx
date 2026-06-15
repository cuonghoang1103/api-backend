'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Home, BookOpen, FolderOpen, Music, MessagesSquare,
  LayoutDashboard, Shield, BookMarked, Receipt,
  Sparkles,
  GraduationCap, ShoppingBag, Gamepad2, Globe,
  PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { useMessagingStore } from '@/store/messagingStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

// ── 52px sidebar with Facebook-style floating tooltip ──────────
//
// Design intent (per the user's latest feedback):
//
//   1. Sidebar is 52px wide by default. The icons are
//      pinned in a fixed-size square — they NEVER scale
//      or magnify on hover, no iOS dock wave, no
//      transform on the row at all.
//   2. Hovering an icon shows a Facebook-style floating
//      tooltip to the right of the icon. The tooltip has
//      a soft shadow, a small arrow pointing back at the
//      icon, and a 140ms fade-in.
//   3. The panel can be PINNED open by clicking the
//      chevron toggle in the top-left. While pinned, the
//      width springs from 52px to 240px and the label
//      appears next to every icon. Icons STILL do not
//      scale on hover — only the row background changes
//      subtly.
//   4. The user can dismiss the pinned panel by clicking
//      the toggle again, by pressing Esc, or by clicking
//      outside the panel.

const DOCK_WIDTH_COLLAPSED = 52;
const DOCK_WIDTH_EXPANDED = 240;

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
  main: { label: 'Navigate' },
  user: { label: 'Personal' },
  admin: { label: 'System' },
} as const;

export default function NavigationDock() {
  const pathname = usePathname();
  const [pinned, setPinned] = useState(false); // user-clicked "pin open"
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const unreadMessages = useMessagingStore((s) => s.unreadTotal);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isOpen = pinned;
  const isExpanded = pinned;

  const sections = useMemo(
    () =>
      (['main', 'user', 'admin'] as const).map((key, i) => ({
        key,
        index: i,
        ...SECTIONS[key],
        items: DOCK_ITEMS.filter((item) => item.section === key),
      })),
    [],
  );

  const togglePin = useCallback(() => setPinned((v) => !v), []);
  const close = useCallback(() => {
    setPinned(false);
    setHoveredHref(null);
  }, []);

  // Close on Esc.
  useEffect(() => {
    if (!pinned) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pinned, close]);

  // Close on route change.
  useEffect(() => {
    setPinned(false);
    setHoveredHref(null);
  }, [pathname, close]);

  // Click outside the panel (while pinned) to close.
  useEffect(() => {
    if (!pinned) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (navRef.current && !navRef.current.contains(t)) {
        close();
      }
    };
    const id = window.setTimeout(() => {
      document.addEventListener('mousedown', onDown);
    }, 0);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener('mousedown', onDown);
    };
  }, [pinned, close]);

  // Resolve the active tooltip — the first hovered row's
  // label, or null when nothing is hovered. We render the
  // tooltip OUTSIDE the icon column so it doesn't move
  // the layout when it appears.
  const tooltipItem = useMemo(() => {
    if (!hoveredHref || isExpanded) return null;
    return DOCK_ITEMS.find((i) => i.href === hoveredHref) ?? null;
  }, [hoveredHref, isExpanded]);

  return (
    <>
      {/* ── Sidebar panel ──────────────────────────────── */}
      <motion.nav
        ref={navRef}
        initial={false}
        animate={{
          width: isExpanded ? DOCK_WIDTH_EXPANDED : DOCK_WIDTH_COLLAPSED,
        }}
        transition={{ type: 'spring', stiffness: 340, damping: 32, mass: 0.9 }}
        onMouseLeave={() => setHoveredHref(null)}
        className="fixed top-0 left-0 h-full z-[60] flex flex-col"
        aria-label="Primary navigation"
      >
        <div
          className="h-full flex flex-col overflow-hidden
            bg-[#0d1117]/95 backdrop-blur-2xl
            border-r border-white/[0.06]
            shadow-[6px_0_32px_rgba(0,0,0,0.55)]"
        >
          {/* Top spacer: the toggle button lives in this
              corner (top-3 / left-3) so it sits flush with
              the top of the rail. The button itself is
              absolutely positioned OUTSIDE the rail at
              z-70 so it stays visible even when the rail
              is collapsed. The rail's own top padding
              just makes space for it. */}
          <div className="shrink-0 h-14" />

          {/* Section list — the rail content. The list
              itself is always mounted; we just hide the
              expanded-only chrome while collapsed. */}
          <div
            className={cn(
              'flex-1 overflow-y-auto overflow-x-visible py-2',
              'scrollbar-thin',
            )}
          >
            {sections.map(({ key, items }) => (
              <div key={key} className="space-y-0.5">
                {items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href));
                  const isHovered = hoveredHref === item.href;
                  const showUnread =
                    !!item.showUnread && mounted && isAuthenticated && unreadMessages > 0;
                  const Icon = item.icon;

                  return (
                    <DockRow
                      key={item.href}
                      item={item}
                      Icon={Icon}
                      isActive={isActive}
                      isHovered={isHovered}
                      isExpanded={isExpanded}
                      showUnread={showUnread}
                      unreadCount={unreadMessages}
                      onHover={() => setHoveredHref(item.href)}
                      onLeave={() => {
                        setHoveredHref((prev) => (prev === item.href ? null : prev));
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* ── Floating tooltip (Facebook style) ─────────────
          Positioned absolutely next to the rail, NOT
          inside it. The icon row already occupies
          0-52px from the left; the tooltip renders to
          the right of the rail at left-14 (56px) so it
          sits flush against the rail edge with a small
          visual gap.

          The tooltip only renders when the panel is
          COLLAPSED. While the panel is pinned open
          (expanded), the label is shown right next to
          each icon, so a floating tooltip would be
          redundant. The tooltip uses a soft dark
          background with a small white arrow on the
          left edge pointing back at the icon. */}
      <AnimatePresence>
        {tooltipItem && (
          <motion.div
            key={`tooltip-${tooltipItem.href}`}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.14, ease: [0.32, 0.94, 0.6, 1] }}
            className="fixed z-[65] pointer-events-none"
            style={{ left: 60, top: 4 }}
          >
            <div className="relative">
              <div
                className="px-3 py-1.5 rounded-lg
                  bg-[#1a1f2e]/95 backdrop-blur-xl
                  border border-white/10
                  shadow-[0_4px_16px_rgba(0,0,0,0.5)]
                  text-[12px] font-medium text-text-primary whitespace-nowrap"
              >
                {tooltipItem.label}
              </div>
              {/* Arrow pointing left, back at the icon. */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -left-1
                  w-2 h-2 rotate-45
                  bg-[#1a1f2e]/95
                  border-l border-b border-white/10"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toggle button (pin / unpin) ─────────────────
          Floats at top-3 / left-3 with z-70, so it
          always sits above the rail content. The icon
          crossfades between PanelLeftOpen (collapsed)
          and PanelLeftClose (pinned) via AnimatePresence.
          The button itself is always visible — it is the
          primary way to "expand" the rail. */}
      <motion.button
        type="button"
        aria-label={pinned ? 'Collapse navigation' : 'Pin navigation open'}
        aria-expanded={pinned}
        onClick={togglePin}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22, mass: 0.55 }}
        className={cn(
          'fixed top-3 z-[70]',
          'left-3',
          'w-10 h-10 rounded-xl',
          'flex items-center justify-center',
          'bg-[#0d1117]/85 backdrop-blur-2xl',
          'border border-white/10',
          'shadow-[0_4px_24px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)]',
          'text-text-primary',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee]/40',
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {pinned ? (
            <motion.span
              key="panel-close"
              initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
              transition={{ duration: 0.18, ease: [0.32, 0.94, 0.6, 1] }}
              className="flex items-center justify-center"
            >
              <PanelLeftClose className="w-[18px] h-[18px]" />
            </motion.span>
          ) : (
            <motion.span
              key="panel-open"
              initial={{ opacity: 0, rotate: 45, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -45, scale: 0.6 }}
              transition={{ duration: 0.18, ease: [0.32, 0.94, 0.6, 1] }}
              className="flex items-center justify-center"
            >
              <PanelLeftOpen className="w-[18px] h-[18px]" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}

// ── Single dock row ─────────────────────────────────────────────
//
// The row is a fixed-size 36px-square clickable area. The icon
// sits inside a 36px square, and the row NEVER scales or
// magnifies on hover. Hovering only changes the row's
// background color (subtle) and lights up the icon's text
// color. While the panel is pinned, the label is shown to
// the right of the icon via AnimatePresence.
function DockRow({
  item,
  Icon,
  isActive,
  isHovered,
  isExpanded,
  showUnread,
  unreadCount,
  onHover,
  onLeave,
}: {
  item: DockItem;
  Icon: React.ElementType;
  isActive: boolean;
  isHovered: boolean;
  isExpanded: boolean;
  showUnread: boolean;
  unreadCount: number;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="relative px-1.5 py-1"
    >
      <Link
        href={item.href}
        className={cn(
          'relative flex items-center w-full h-9 rounded-xl select-none',
          isExpanded ? 'justify-start pl-2.5 pr-3' : 'justify-center',
          'transition-colors duration-150',
          isActive
            ? 'bg-gradient-to-r from-[#22d3ee]/15 to-[#8b5cf6]/10 text-text-primary'
            : isHovered
              ? 'bg-white/[0.05] text-text-primary'
              : 'text-text-muted hover:text-text-primary',
        )}
      >
        {/* Active indicator bar — flat gradient on the
            left edge, no transform, no scale. */}
        {isActive && (
          <div
            className="absolute -left-1 top-1.5 bottom-1.5 w-[2px] rounded-full"
            style={{
              background: 'linear-gradient(180deg, #22d3ee, #8b5cf6)',
              boxShadow: '0 0 8px rgba(34, 211, 238, 0.3)',
            }}
          />
        )}

        {/* Icon. Fixed size 18x18, NEVER scaled. The
            color is the only thing that animates on
            hover. The wrapper is intentionally a fixed
            28x28 so the icon position never moves. */}
        <div className="flex items-center justify-center w-7 h-7 shrink-0">
          <Icon
            className={cn(
              'w-[18px] h-[18px] transition-colors duration-150',
              isActive || isHovered
                ? 'text-text-primary'
                : 'text-text-muted',
            )}
          />
        </div>

        {/* Label — only visible when the panel is pinned
            (expanded). Always absolute-sized so its
            appearance never causes the icon to shift. */}
        <AnimatePresence>
          {isExpanded && (
            <motion.span
              key="row-label"
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.16, ease: [0.32, 0.94, 0.6, 1], delay: 0.04 }}
              className={cn(
                'ml-2.5 whitespace-nowrap text-[13px] font-medium select-none transition-colors duration-150',
                isActive || isHovered
                  ? 'text-text-primary'
                  : 'text-text-muted',
              )}
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread badge — Messenger-style dot. */}
        {showUnread && (
          <UnreadBadge
            count={unreadCount}
            isActive={isActive}
            isExpanded={isExpanded}
          />
        )}
      </Link>
    </div>
  );
}

// ── Unread badge ─────────────────────────────────────────────
function UnreadBadge({
  count,
  isActive,
  isExpanded,
}: {
  count: number;
  isActive: boolean;
  isExpanded: boolean;
}) {
  if (!isExpanded) {
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
      className="ml-auto min-w-[18px] h-[18px] px-1.5
        bg-red-500 text-white text-[10px] font-bold rounded-full
        flex items-center justify-center"
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
