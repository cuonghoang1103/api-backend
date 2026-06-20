'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Home, BookOpen, FolderOpen, Music, MessagesSquare,
  LayoutDashboard, Shield, BookMarked, Receipt,
  Sparkles, User,
  GraduationCap, ShoppingBag, Gamepad2,
  Menu, X, ChevronRight,
  Github,
} from 'lucide-react';
import { useMessagingStore } from '@/store/messagingStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

// ── iOS-style floating sidebar ────────────────────────────────
//
// The sidebar is a floating panel. It is HIDDEN by default
// and only appears when the user clicks the menu button in
// the top-left of the viewport. It does NOT shift the page
// content — instead a dim + blur backdrop covers the rest of
// the screen while the panel is open, exactly like the iOS
// Control Center / app-switcher behaviour.
//
// When the panel is open, hovering an icon triggers the iOS
// dock magnify wave: the hovered icon scales up, the two
// neighbours scale up less, the two second-neighbours scale
// even less, and anything farther stays at 1.0.
//
// The panel slides in from the left, scales up slightly,
// and fades its content in, with the easing curve
// (0.32, 0.94, 0.6, 1) which is close to Apple's standard
// control-presentation curve.

const DOCK_WIDTH_OPEN = 288; // 18rem — wide enough for icon + label
const TOGGLE_BUTTON_SIZE = 44; // touch target ~Apple HIG

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
  { href: '/about', label: 'About', icon: User, section: 'user' },
  { href: '/courses', label: 'Courses', icon: BookMarked, section: 'user' },
  { href: '/my-orders', label: 'Orders', icon: Receipt, section: 'user' },
  { href: '/repos', label: 'GitHub Repos', icon: Github, section: 'user' },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'admin' },
  { href: '/admin', label: 'Admin', icon: Shield, section: 'admin' },
];

const SECTIONS = {
  main: { label: 'Navigate' },
  user: { label: 'Personal' },
  admin: { label: 'System' },
} as const;

// Magnify weights — iOS dock feel: hovered icon is the
// biggest, the two immediate neighbours are noticeably
// bigger, and the two second neighbours are slightly
// bigger. Anything farther is at 1.0.
const MAGNIFY = {
  hovered: 1.55,
  neighbor: 1.30,
  farNeighbor: 1.15,
} as const;

// Spring used for the panel slide-in / scale. This is the
// default framer "gentle" spring with the Apple-ish ease
// baked in via a custom stiffness/damping/mass combo.
const PANEL_SPRING = { type: 'spring' as const, stiffness: 380, damping: 36, mass: 0.95 };
const ICON_SPRING = { type: 'spring' as const, stiffness: 320, damping: 22, mass: 0.55 };

// Section reveal variants — used to stagger the fade-in
// of each section's contents after the panel itself is
// already in place.
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.18 + i * 0.04, duration: 0.22, ease: [0.32, 0.94, 0.6, 1] },
  }),
};

// Row variants — the rows themselves fade in slightly
// after their parent section.
const rowVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.22 + i * 0.018, duration: 0.22, ease: [0.32, 0.94, 0.6, 1] },
  }),
};

export default function NavigationDock() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
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

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setHoveredHref(null);
  }, []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  // Close on Esc.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  // Close on route change.
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Click outside the panel to close.
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (panelRef.current && !panelRef.current.contains(t)) {
        close();
      }
    };
    // Defer one frame so the click that opened the panel
    // does not immediately re-fire a close.
    const id = window.setTimeout(() => {
      document.addEventListener('mousedown', onDown);
    }, 0);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener('mousedown', onDown);
    };
  }, [isOpen, close]);

  // Lock body scroll while open.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
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
      {/* ── Toggle button (always visible) ────────────────
          A small floating button in the top-left of the
          viewport. Tapping it opens the sidebar panel.
          The button stays put while the panel animates in
          / out — it does NOT slide away, and the icon
          crossfades from Menu to X via AnimatePresence. */}
      <motion.button
        type="button"
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={isOpen}
        aria-controls="floating-nav-panel"
        onClick={toggle}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={ICON_SPRING}
        className={cn(
          'fixed top-4 left-6 z-[70]',
          'w-11 h-11 rounded-2xl',
          'flex items-center justify-center',
          'bg-[#0d1117]/85 backdrop-blur-2xl',
          'border border-white/10',
          'shadow-[0_4px_24px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)]',
          'text-text-primary',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee]/40',
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="x-icon"
              initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
              transition={{ duration: 0.18, ease: [0.32, 0.94, 0.6, 1] }}
              className="flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </motion.span>
          ) : (
            <motion.span
              key="menu-icon"
              initial={{ opacity: 0, rotate: 45, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -45, scale: 0.6 }}
              transition={{ duration: 0.18, ease: [0.32, 0.94, 0.6, 1] }}
              className="flex items-center justify-center"
            >
              <Menu className="w-5 h-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Backdrop dim + blur (only when panel is open) ──
          Full-screen transparent layer that darkens and
          blurs whatever is behind the panel. Clicking
          anywhere on it closes the panel. It animates in
          together with the panel so the dim appears to
          come FROM the menu button, not pop in. */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="dock-backdrop"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(14px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.32, ease: [0.32, 0.94, 0.6, 1] }}
            className="fixed inset-0 z-[65] bg-black/55"
            onMouseDown={close}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* ── Floating panel ─────────────────────────────────
          The sidebar itself. It slides in from the left
          edge of the viewport with a slight scale-up,
          which is the iOS sheet-presentation feel. The
          panel is positioned absolutely at top-0 left-0,
          with a small inset from the screen edges so it
          doesn't touch the rounded corners of an iPhone
          screen, and a generous border-radius so it
          looks like a glass sheet, not a strip.

          Width is animated by framer-motion (no fixed
          width, so we can also animate scale in tandem
          without layout thrash). We start at scale 0.92
          + x:-32 to get the slide-in, then spring to 1.0
          / 0. */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="dock-panel"
            id="floating-nav-panel"
            ref={panelRef as React.RefObject<HTMLElement>}
            role="dialog"
            aria-label="Primary navigation"
            initial={{ opacity: 0, x: -40, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -32, scale: 0.96 }}
            transition={PANEL_SPRING}
            onMouseLeave={() => setHoveredHref(null)}
            className={cn(
              'fixed z-[68]',
              // Position: top-3 / bottom-3 / left-3 gives the
              // panel a small margin from the screen edges,
              // matching the iOS Control Center look.
              'top-3 bottom-3 left-3',
              'w-[288px]',
              'flex flex-col',
              // The glass surface — strong blur, low-opacity
              // dark background, and a subtle inner stroke
              // so the panel reads as a real sheet rather
              // than a flat rectangle.
              'bg-[#0d1117]/85 backdrop-blur-2xl',
              'border border-white/[0.08]',
              'rounded-3xl',
              'shadow-[0_24px_80px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.04),inset_0_1px_0_rgba(255,255,255,0.06)]',
              'overflow-hidden',
            )}
          >
            {/* Panel header — leaves room for the toggle
                button at the top so they don't overlap. */}
            <div className="shrink-0 px-5 pt-16 pb-3">
              <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted">
                navigation
              </p>
              <p className="text-lg font-semibold text-text-primary mt-1">
                Where to next?
              </p>
            </div>

            {/* Section list — the magnify magic happens
                here. We render every section, and inside
                each section we render the rows. The rows
                read `hoveredHref` from the parent state
                to compute their own magnify scale based
                on distance from the hovered item. */}
            <div className="flex-1 overflow-y-auto overflow-x-visible px-3 pb-3">
              {sections.map(({ key, items, index }) => (
                <motion.div
                  key={key}
                  custom={index}
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-0.5 mb-3"
                >
                  <p className="px-3 pt-2 pb-1 text-[10px] font-mono uppercase tracking-[0.16em] text-text-muted/70">
                    {SECTIONS[key].label}
                  </p>
                  {items.map((item, rowIndex) => {
                    const flatIdx = flatItems.findIndex((i) => i.href === item.href);
                    const isActive =
                      pathname === item.href ||
                      (item.href !== '/' && pathname.startsWith(item.href));
                    const isHovered = hoveredHref === item.href;
                    let scale = 1;
                    if (hoveredIdx >= 0) {
                      const d = Math.abs(flatIdx - hoveredIdx);
                      if (d === 0) scale = MAGNIFY.hovered;
                      else if (d === 1) scale = MAGNIFY.neighbor;
                      else if (d === 2) scale = MAGNIFY.farNeighbor;
                    }
                    const showUnread =
                      !!item.showUnread && mounted && isAuthenticated && unreadMessages > 0;
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.href}
                        custom={rowIndex}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <DockRow
                          item={item}
                          Icon={Icon}
                          isActive={isActive}
                          isHovered={isHovered}
                          scale={scale}
                          showUnread={showUnread}
                          unreadCount={unreadMessages}
                          onHover={() => setHoveredHref(item.href)}
                          onLeave={() => {
                            setHoveredHref((prev) => (prev === item.href ? null : prev));
                          }}
                        />
                      </motion.div>
                    );
                  })}
                </motion.div>
              ))}
            </div>

            {/* Panel footer — a small "Esc to close" hint. */}
            <div className="shrink-0 px-5 py-3 border-t border-white/[0.06] flex items-center justify-between">
              <p className="text-[10px] font-mono text-text-muted">
                Press <kbd className="px-1 py-0.5 mx-0.5 rounded bg-white/5 border border-white/10">Esc</kbd> to close
              </p>
              <p className="text-[10px] font-mono text-text-muted/60">
                ⌘B
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Single dock row ─────────────────────────────────────────────
//
// A row is the clickable nav target. It contains:
//   - the active indicator bar (cyan→violet gradient) on the
//     left edge, with framer-motion's layoutId so it glides
//     between rows when the active route changes
//   - the icon (in a 40×40 hit area)
//   - the label (to the right of the icon)
//   - the chevron (right side, only on hover)
//   - the unread badge (top right of the row, or inside the
//     icon at smaller sizes)
//
// The icon's scale is animated by framer-motion. While the
// panel is open, the hovered row's icon scales up to ~1.55,
// neighbours scale up less, and so on — the iOS dock wave.
function DockRow({
  item,
  Icon,
  isActive,
  isHovered,
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
      className="relative"
    >
      <Link
        href={item.href}
        className={cn(
          'relative flex items-center w-full pl-3 pr-3 h-12 rounded-2xl',
          'transition-colors duration-150',
          isActive
            ? 'bg-gradient-to-r from-[#22d3ee]/15 to-[#8b5cf6]/10 text-text-primary'
            : isHovered
              ? 'bg-white/[0.06] text-text-primary'
              : 'text-text-muted hover:text-text-primary',
        )}
      >
        {/* Active bar — flat gradient on the left edge. */}
        {isActive && (
          <motion.div
            layoutId="navActiveIndicator"
            className="absolute -left-1 top-2 bottom-2 w-[3px] rounded-full"
            style={{
              background: 'linear-gradient(180deg, #22d3ee, #8b5cf6)',
              boxShadow: '0 0 12px rgba(34, 211, 238, 0.4)',
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.5 }}
          />
        )}

        {/* Icon wrapper — magnify scale is applied here. */}
        <motion.div
          className="flex items-center justify-center w-7 h-7 origin-center"
          animate={{ scale }}
          transition={ICON_SPRING}
        >
          <Icon
            className={cn(
              'w-[18px] h-[18px] transition-colors duration-150',
              isActive || isHovered ? 'text-text-primary' : 'text-text-muted',
            )}
          />
        </motion.div>

        {/* Label */}
        <span
          className={cn(
            'ml-3 flex-1 whitespace-nowrap text-[14px] font-medium select-none transition-colors duration-150',
            isActive || isHovered ? 'text-text-primary' : 'text-text-muted',
          )}
        >
          {item.label}
        </span>

        {/* Right-side adornments — chevron on hover, badge
            when there are unread messages. */}
        <AnimatePresence>
          {isHovered && !showUnread && (
            <motion.span
              key="chevron"
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.14, ease: [0.32, 0.94, 0.6, 1] }}
              className="text-text-muted"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.span>
          )}
        </AnimatePresence>

        {showUnread && (
          <UnreadBadge count={unreadCount} />
        )}
      </Link>
    </div>
  );
}

// ── Unread badge ──────────────────────────────────────────────
function UnreadBadge({ count }: { count: number }) {
  return (
    <span
      className="min-w-[20px] h-[20px] px-1.5
        bg-gradient-to-br from-[#ef4444] to-[#dc2626]
        text-white text-[10px] font-bold rounded-full
        flex items-center justify-center
        shadow-[0_0_12px_rgba(239,68,68,0.4)]"
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
