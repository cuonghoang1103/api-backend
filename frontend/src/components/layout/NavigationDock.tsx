'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Home, BookOpen, FolderOpen, Music, MessagesSquare,
  LayoutDashboard, Shield, BookMarked, Receipt,
  Settings, Sparkles, UserCircle,
  GraduationCap, ShoppingBag, Gamepad2, Globe,
} from 'lucide-react';
import { useMessagingStore } from '@/store/messagingStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

// Two fixed rail widths. The dock sits at COLLAPSED_W when at
// rest and springs to EXPANDED_W when the user clicks the rail
// (iOS Control Center / iPadOS app-switcher feel). Labels are
// only visible while expanded; while collapsed, the rail is a
// pure 52px column with no labels.
export const DOCK_WIDTH_COLLAPSED = 52;
export const DOCK_WIDTH_EXPANDED = 220;

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

const APPLE_EASE: [number, number, number, number] = [0.32, 0.94, 0.6, 1];

const sectionVariants: Variants = {
  hidden: { opacity: 0, x: -6 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.22, ease: APPLE_EASE },
  }),
};

// Magnify weights — the hovered icon is biggest, the two
// neighbors are next, and the two second-neighbors are
// smaller. Identical to the iOS dock.
const MAGNIFY = {
  hovered: 1.22,
  neighbor: 1.10,
  farNeighbor: 1.04,
} as const;

export default function NavigationDock() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unreadMessages = useMessagingStore((s) => s.unreadTotal);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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

  // Open the dock on click of the rail. We treat the whole
  // collapsed rail as a click target — clicking anywhere on
  // the 52px strip opens the panel. Once open, only clicks
  // on actual <Link>s navigate; clicks on the rail chrome
  // (the strip itself, padding, header) keep it open.
  const handleRailClick = useCallback(() => {
    if (!isOpen) setIsOpen(true);
  }, [isOpen]);

  // Close when the cursor leaves the expanded panel.
  // We use a small grace period (140ms) so the cursor can
  // travel between the rail and the panel surface without
  // the panel snapping shut.
  const handlePanelLeave = useCallback(() => {
    if (!isOpen) return;
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setHoveredHref(null);
    }, 140);
  }, [isOpen]);

  const handlePanelEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  // Close on Esc.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  // Close on route change.
  useEffect(() => {
    setIsOpen(false);
    setHoveredHref(null);
  }, [pathname]);

  // Click outside the dock to close.
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (navRef.current && !navRef.current.contains(t)) {
        setIsOpen(false);
        setHoveredHref(null);
      }
    };
    // Defer one frame so the click that opened the dock
    // does not immediately re-fire a close.
    const id = window.setTimeout(() => {
      document.addEventListener('mousedown', onDown);
    }, 0);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener('mousedown', onDown);
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  // Flatten items so the magnify pass can compute distance
  // from the hovered item across section boundaries.
  const flatItems = useMemo(() => sections.flatMap((s) => s.items), [sections]);

  const hoveredIdx = hoveredHref
    ? flatItems.findIndex((i) => i.href === hoveredHref)
    : -1;

  return (
    <>
      {/* ── Backdrop dim + blur (only when dock is open) ──
          A full-screen transparent layer that darkens and
          blurs whatever is behind the dock. Click anywhere
          on it to close. It animates in/out with the dock
          using the same spring so the dim appears to come
          FROM the rail, not pop in independently. */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="dock-backdrop"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(6px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.28, ease: APPLE_EASE }}
            className="fixed inset-0 z-[58] bg-black/35"
            onMouseDown={() => {
              setIsOpen(false);
              setHoveredHref(null);
            }}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar panel (the rail) ──────────────────────── */}
      <motion.nav
        ref={navRef}
        key="dock-panel"
        initial={false}
        animate={{
          width: isOpen ? DOCK_WIDTH_EXPANDED : DOCK_WIDTH_COLLAPSED,
        }}
        transition={{ type: 'spring', stiffness: 340, damping: 32, mass: 0.9 }}
        onMouseEnter={handlePanelEnter}
        onMouseLeave={handlePanelLeave}
        className="fixed top-0 left-0 h-full z-[60] flex flex-col"
        style={{ overflow: 'visible' }}
        aria-label="Primary navigation"
      >
        <div
          className="h-full flex flex-col overflow-hidden
            bg-[#0d1117]/95 backdrop-blur-2xl
            border-r border-white/[0.06]
            shadow-[6px_0_32px_rgba(0,0,0,0.55)]"
        >
          {/* Click target — the 52px-wide rail when collapsed.
              When the rail is collapsed, every click on this
              strip (the open button at the top + the empty
              body) opens the panel. When the panel is open,
              this strip is the rail's body and we don't want
              empty clicks to do anything. */}
          <button
            type="button"
            aria-label={isOpen ? 'Navigation open' : 'Open navigation'}
            aria-expanded={isOpen}
            onClick={handleRailClick}
            className={cn(
              'flex flex-col items-stretch w-full text-left shrink-0',
              'focus:outline-none focus-visible:ring-1 focus-visible:ring-white/20',
              // While collapsed, the button stretches to the
              // full height and acts as the open trigger. The
              // real navigation sits ON TOP of it (z-index)
              // so individual icon clicks still navigate.
              isOpen ? 'h-0 overflow-hidden' : 'h-full',
            )}
            tabIndex={isOpen ? -1 : 0}
          />

          {/* Sections (rendered only when the panel is open).
              We keep them always-mounted so the magnify
              animation has somewhere to grow, but we hide
              the chrome (header labels, scrollbar) while
              collapsed. */}
          <div
            className={cn(
              'flex-1 overflow-y-auto overflow-x-visible py-3',
              isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
              'transition-opacity duration-150',
            )}
          >
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
                  const flatIdx = flatItems.findIndex((i) => i.href === item.href);
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href));
                  const isHovered = hoveredHref === item.href;
                  // Distance-based magnify: only apply while
                  // open. The hovered icon scales to 1.22,
                  // immediate neighbors to 1.10, second
                  // neighbors to 1.04. Anything farther
                  // stays at 1.0.
                  let scale = 1;
                  if (isOpen && hoveredIdx >= 0) {
                    const d = Math.abs(flatIdx - hoveredIdx);
                    if (d === 0) scale = MAGNIFY.hovered;
                    else if (d === 1) scale = MAGNIFY.neighbor;
                    else if (d === 2) scale = MAGNIFY.farNeighbor;
                  }
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
                      isOpen={isOpen}
                      scale={scale}
                      showUnread={showUnread}
                      unreadCount={unreadMessages}
                      onHover={() => setHoveredHref(item.href)}
                      onLeave={() => {
                        // Only clear if this row was the
                        // hovered one. This avoids a race
                        // when the cursor moves between
                        // rows quickly.
                        setHoveredHref((prev) => (prev === item.href ? null : prev));
                      }}
                    />
                  );
                })}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.nav>
    </>
  );
}

// ── Single dock row ─────────────────────────────────────────────
// A 36px square icon, with magnify scale applied via
// framer-motion (only while the panel is open and the row
// is within distance of the hovered row).
function DockRow({
  item,
  Icon,
  isActive,
  isHovered,
  isOpen,
  scale,
  showUnread,
  unreadCount,
  onHover,
  onLeave,
}: {
  item: DockItem;
  Icon: React.ElementType;
  isActive: boolean;
  isHovered: boolean;
  isOpen: boolean;
  scale: number;
  showUnread: boolean;
  unreadCount: number;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="relative px-2 py-1.5"
    >
      <Link
        href={item.href}
        className={cn(
          'relative flex items-center w-8 h-8 mx-auto rounded-lg select-none',
          isOpen ? 'justify-start' : 'justify-center',
          'transition-colors duration-150',
        )}
      >
        {/* Active indicator bar — flat gradient, no halo. */}
        {isActive && (
          <motion.div
            layoutId="navActiveIndicator"
            className="absolute -left-2 top-1.5 bottom-1.5 w-[2px] rounded-full"
            style={{
              background: 'linear-gradient(180deg, #22d3ee, #8b5cf6)',
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.5 }}
          />
        )}

        {/* Icon wrapper — magnify scale is applied here.
            The scale motion is spring-based so the
            magnification is smooth when the cursor
            travels between rows. We cap the scale
            animation to the open state so the collapsed
            rail stays perfectly still. */}
        <motion.div
          className={cn(
            'flex items-center justify-center rounded-lg w-8 h-8 origin-center',
          )}
          animate={{
            scale: isOpen ? scale : 1,
            backgroundColor: isActive
              ? 'rgba(255,255,255,0.08)'
              : isHovered && isOpen
                ? 'rgba(255,255,255,0.06)'
                : 'rgba(255,255,255,0.0)',
          }}
          transition={{ type: 'spring', stiffness: 320, damping: 22, mass: 0.55 }}
        >
          <Icon
            className={cn(
              'shrink-0 w-[15px] h-[15px] transition-colors duration-150',
              isActive || isHovered
                ? 'text-text-primary'
                : 'text-text-muted',
            )}
          />
        </motion.div>

        {/* Label — only visible when the panel is open.
            It uses AnimatePresence so the labels fade in
            slightly after the width animation has begun,
            matching the iOS panel reveal timing. */}
        <AnimatePresence>
          {isOpen && (
            <motion.span
              key="row-label"
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.16, ease: APPLE_EASE, delay: 0.04 }}
              className={cn(
                'ml-3 whitespace-nowrap text-[13px] font-medium select-none',
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
            count={unreadMessages}
            isActive={isActive}
            isOpen={isOpen}
          />
        )}
      </Link>
    </div>
  );
}

// ── Unread badge ───────────────────────────────────────────────
function UnreadBadge({
  count,
  isActive,
  isOpen,
}: {
  count: number;
  isActive: boolean;
  isOpen: boolean;
}) {
  // While collapsed, the badge is the small dot in the top
  // right of the icon. When the panel is open, the badge
  // becomes a small pill on the right side of the row, so
  // the count is readable instead of a 1-px smudge.
  if (!isOpen) {
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
