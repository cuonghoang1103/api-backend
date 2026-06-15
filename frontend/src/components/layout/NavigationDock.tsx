'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Home, BookOpen, FolderOpen, Music, MessageCircle,
  LayoutDashboard, Shield, BookMarked, Receipt,
  Settings, ChevronLeft, Sparkles, UserCircle,
  GraduationCap, ShoppingBag, Gamepad2, Globe,
} from 'lucide-react';
import { useMessagingStore } from '@/store/messagingStore';
import { useAuthStore } from '@/store/authStore';

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
  { href: '/messages', label: 'Messages', icon: MessageCircle, section: 'main', showUnread: true },
  { href: '/chat', label: 'AI Chat', icon: MessageCircle, section: 'main' },
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

const DOCK_WIDTH_COLLAPSED = 72;
const DOCK_WIDTH_EXPANDED = 280;
const APPLE_EASE: [number, number, number, number] = [0.32, 0.94, 0.6, 1];

// iOS cinematic spring for the dock panel itself.
const panelSpring = { type: 'spring' as const, stiffness: 320, damping: 32, mass: 0.9 };

// iOS dock magnification: scale curve is a smooth parabola peaking at the
// hovered item. Index 0 = the hovered item, neighbours get a smaller
// boost, items further away stay at 1.
function magnifyScale(distance: number): number {
  if (distance === 0) return 1.22;
  if (distance === 1) return 1.12;
  if (distance === 2) return 1.05;
  return 1.0;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.22, ease: APPLE_EASE },
  }),
};

interface NavigationDockProps {
  /** Whether the dock is open as a full overlay (mobile-style drawer) */
  isOpen: boolean;
  onToggle: () => void;
}

export default function NavigationDock({ isOpen, onToggle }: NavigationDockProps) {
  const pathname = usePathname();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  // `isHovered` is the dock panel-level hover (drives the
  // collapsed → expanded width animation). When the panel is hovered
  // (or has a pinned-open item via touch / focus) the labels fade in.
  const [isPanelHovered, setIsPanelHovered] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unreadMessages = useMessagingStore((s) => s.unreadTotal);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Track whether the viewport is wide enough for the always-visible
  // rail. Below md the dock is a hidden overlay drawer that the
  // user opens via a toggle button; on md+ the dock is permanently
  // mounted and the toggle is removed (hover does the job).
  const [isWideViewport, setIsWideViewport] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsWideViewport(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  const showToggle = !isWideViewport;

  // Build a flat list of items with stable indices so the magnify
  // wave can look up "the item 2 positions below me" across section
  // boundaries. We only care about distance *within* the rendered
  // sequence, so each rendered dock item gets an index.
  const sections = (['main', 'user', 'admin'] as const).map((key, i) => ({
    key,
    index: i,
    ...SECTIONS[key],
    items: DOCK_ITEMS.filter((item) => item.section === key),
  }));

  // Flat list for magnification distance calc.
  const flatItems = sections.flatMap((s) => s.items);

  // Clear any pending hide-timeout when the panel is (re-)entered.
  const handlePanelEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsPanelHovered(true);
  }, []);

  // Small grace period so the dock doesn't collapse mid-move between
  // two items (the cursor briefly leaves the panel when crossing the
  // 1px gap between buttons).
  const handlePanelLeave = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsPanelHovered(false);
      setHoveredIdx(null);
    }, 120);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  // Expanded = hovered OR overlay-open (mobile-style drawer mode).
  const isExpanded = isPanelHovered || isOpen;

  return (
    <>
      {/* ── Backdrop only for the full overlay (drawer) mode ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="dock-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: APPLE_EASE }}
            onClick={onToggle}
            className="fixed inset-0 z-[58] bg-black/40 backdrop-blur-md"
            style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar panel ──
          Width is driven by isExpanded. The panel is always mounted
          (we don't gate the children behind AnimatePresence) so the
          magnification wave is smooth when the user moves between
          items. The drawer "enter from the left" entrance is only
          used the first time it opens via the toggle button. */}
      <motion.nav
        key="dock-panel"
        initial={false}
        animate={{ width: isExpanded ? DOCK_WIDTH_EXPANDED : DOCK_WIDTH_COLLAPSED }}
        transition={panelSpring}
        onMouseEnter={handlePanelEnter}
        onMouseLeave={handlePanelLeave}
        className={`fixed top-0 left-0 h-full z-[59] flex flex-col ${
          isOpen ? '' : 'pt-16'
        }`}
        style={{ overflow: 'visible' }}
        aria-label="Primary navigation"
      >
        <div
          className="h-full flex flex-col overflow-hidden
            bg-[#0d1117]/97 backdrop-blur-xl
            border-r border-white/[0.06]
            shadow-[8px_0_48px_rgba(0,0,0,0.6),inset_-1px_0_0_rgba(255,255,255,0.04)]"
        >
          {/* Header — only when expanded */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="dock-header"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: APPLE_EASE }}
                className="px-4 pt-5 pb-3 flex items-center justify-between shrink-0 border-b border-white/[0.05] overflow-hidden"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-violet shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted/60 whitespace-nowrap">
                    Navigation
                  </span>
                </div>
                <motion.button
                  onClick={onToggle}
                  className="flex items-center justify-center w-7 h-7 rounded-xl
                    bg-white/[0.05] hover:bg-white/[0.1]
                    border border-white/[0.06] hover:border-white/[0.12]
                    text-text-muted hover:text-text-primary
                    transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close navigation"
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sections — always rendered, but the labels + section
              headers are width-clipped when collapsed. We use a
              horizontal padding transition so the icon stays
              centered when the panel is narrow. */}
          <div className="flex-1 overflow-y-auto overflow-x-visible py-3 space-y-4">
            {sections.map(({ key, label, icon: SectionIcon, items, index }) => (
              <motion.div
                key={key}
                custom={index}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Section header — only when expanded */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key={`${key}-header`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18, ease: APPLE_EASE }}
                      className="flex items-center gap-2 px-3 mb-1.5 overflow-hidden"
                    >
                      <SectionIcon className="w-3 h-3 text-text-muted/40 shrink-0" />
                      <span className="text-[9px] font-mono font-semibold uppercase tracking-widest text-text-muted/40 whitespace-nowrap">
                        {label}
                      </span>
                      <div className="flex-1 h-px bg-white/[0.04]" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-0.5">
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
                        isDrawerOpen={isOpen}
                        scale={magnifyScale(distance)}
                        isHovered={hoveredIdx === flatIdx}
                        showUnread={showUnread}
                        unreadCount={unreadMessages}
                        onHover={() => setHoveredIdx(flatIdx)}
                        onLeave={() => {
                          if (hoveredIdx === flatIdx) setHoveredIdx(null);
                        }}
                        onNavigate={onToggle}
                      />
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer — only when expanded */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="dock-footer"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: APPLE_EASE }}
                className="px-4 pb-5 border-t border-white/[0.04] pt-3 shrink-0 overflow-hidden"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-white/10 shrink-0">
                    <img src="/images/avatar.png" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-text-primary truncate">CuongHoang</p>
                    <p className="text-[9px] text-text-muted/60 font-mono">v2.0.0</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* ── Toggle button — ONLY on mobile (<md) where the dock is
           a hidden overlay drawer. On desktop the dock is always
           visible and the user opens it by hovering, so the toggle
           is redundant. */}
      {showToggle && (
        <motion.button
          onClick={onToggle}
          className="fixed top-[70px] left-3 z-[60] flex items-center justify-center w-9 h-9 rounded-xl
            bg-[#0d1117]/90 backdrop-blur-xl border border-white/10
            shadow-[0_4px_16px_rgba(0,0,0,0.4),0_0_0_1px_rgba(139,92,246,0.15)]
            transition-all duration-200 cursor-pointer"
          animate={{
            opacity: !isExpanded ? 1 : 0,
            scale: !isExpanded ? 1 : 0.7,
            pointerEvents: !isExpanded ? 'auto' : 'none',
          }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: !isExpanded ? 1.08 : 0.7, borderColor: 'rgba(139,92,246,0.4)' }}
          whileTap={{ scale: 0.92 }}
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        >
          <motion.div animate={{ rotate: isOpen ? -90 : 0 }} transition={{ duration: 0.25, ease: APPLE_EASE }}>
            <ChevronLeft className="w-4 h-4" style={{ color: '#94a3b8' }} />
          </motion.div>
        </motion.button>
      )}
    </>
  );
}

// ── Single dock row ───────────────────────────────────────────────
// Extracted so the magnification / hover / active logic stays in one
// place and the parent stays readable.
function DockRow({
  item,
  Icon,
  isActive,
  isExpanded,
  isDrawerOpen,
  scale,
  isHovered,
  showUnread,
  unreadCount,
  onHover,
  onLeave,
  onNavigate,
}: {
  item: DockItem;
  Icon: React.ElementType;
  isActive: boolean;
  isExpanded: boolean;
  isDrawerOpen: boolean;
  scale: number;
  isHovered: boolean;
  showUnread: boolean;
  unreadCount: number;
  onHover: () => void;
  onLeave: () => void;
  onNavigate: () => void;
}) {
  // Padding shifts from wide (px-3 py-2.5, gap-3) when expanded to
  // tight centered (px-2 py-2, gap-0) when collapsed. The icon
  // stays visually centered via flex justify-center.
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
        onClick={onNavigate}
        className={cn(
          'relative flex items-center rounded-xl overflow-hidden select-none',
          collapsed ? 'justify-center px-2 py-2 mx-2' : 'gap-3 px-3 py-2.5 mx-1',
        )}
        style={{ display: 'flex' }}
      >
        {/* Active indicator bar — only when expanded, otherwise we
            use a subtle ring on the icon to save space. */}
        {!collapsed && isActive && (
          <motion.div
            layoutId="navActiveIndicator"
            className="absolute inset-y-0 left-0 w-[3px] rounded-full"
            style={{
              background: 'linear-gradient(180deg, #22d3ee, #8b5cf6)',
              boxShadow: '0 0 10px rgba(34,211,238,0.6), 0 0 20px rgba(139,92,246,0.3)',
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 30, mass: 0.5 }}
          />
        )}

        {/* Icon — single source of truth for the magnifying scale.
            The wrapper's `animate={ scale }` already grows the entire
            row, but we ALSO animate the inner icon's `backgroundColor`
            so the magnify wave is visually obvious (small icons
            stay "icon-sized" while the row scales). */}
        <motion.div
          className={cn(
            'flex items-center justify-center rounded-lg shrink-0',
            collapsed ? 'w-10 h-10' : 'w-9 h-9',
          )}
          animate={{
            backgroundColor: isActive
              ? 'rgba(139,92,246,0.18)'
              : isHovered
                ? 'rgba(139,92,246,0.10)'
                : 'rgba(255,255,255,0.04)',
            boxShadow: isActive
              ? '0 0 14px rgba(139,92,246,0.30)'
              : isHovered
                ? '0 0 8px rgba(139,92,246,0.18)'
                : 'none',
          }}
          transition={{ duration: 0.18, ease: APPLE_EASE }}
        >
          <Icon
            className={cn(
              'shrink-0 transition-colors duration-150',
              collapsed ? 'w-[18px] h-[18px]' : 'w-4 h-4',
              isActive ? 'text-neon-violet' : isHovered ? 'text-text-primary' : 'text-text-muted',
            )}
          />
        </motion.div>

        {/* Unread badge — Messenger-style red bubble */}
        {showUnread && (
          <UnreadBadge
            count={unreadCount}
            collapsed={collapsed}
            isActive={isActive}
            isHovered={isHovered}
          />
        )}

        {/* Label — slides in from the left, only when expanded */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              key="label"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.18, ease: APPLE_EASE }}
              className="text-[13px] font-medium truncate whitespace-nowrap"
              style={{ color: isActive ? '#c4b5fd' : isHovered ? '#e5e7eb' : '#94a3b8' }}
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Active dot (right side) — only when expanded */}
        {!collapsed && (
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.18, ease: APPLE_EASE }}
                className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-violet shrink-0"
                style={{ boxShadow: '0 0 6px rgba(139,92,246,0.9)' }}
              />
            )}
          </AnimatePresence>
        )}
      </Link>
    </motion.div>
  );
}

// ── Messenger-style unread badge ─────────────────────────────────
// Pill (when count > 9), circle (when count ≤ 9). Always shows the
// numeric count when expanded; shows a small dot when collapsed so
// the icon row stays clean.
function UnreadBadge({
  count,
  collapsed,
  isActive,
  isHovered,
}: {
  count: number;
  collapsed: boolean;
  isActive: boolean;
  isHovered: boolean;
}) {
  // Show numeric count whenever there's room. When the dock is
  // collapsed, we switch to a small dot so the icon row stays tidy
  // (the badge is only meaningful as a count when the label is
  // visible).
  const text = count > 99 ? '99+' : String(count);
  const showNumber = !collapsed;

  return (
    <motion.span
      key={`badge-${text}`}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        // Pop on count change (bounce) — scale peaks slightly above
        // 1 then settles. Triggers on `text` change via the key prop.
      }}
      transition={{
        type: 'spring',
        stiffness: 600,
        damping: 18,
        mass: 0.5,
      }}
      className={cn(
        'absolute inline-flex items-center justify-center font-bold text-white pointer-events-none',
        // Position: top-right of the icon when collapsed; sits in
        // the row (right after the icon) when expanded.
        collapsed
          ? 'top-1 right-1 min-w-[14px] h-[14px] px-1 rounded-full'
          : 'left-[34px] top-1 min-w-[18px] h-[18px] px-1.5 rounded-full',
        'text-[10px]',
        // Messenger red with glow
        'bg-[#ef4444] ring-2 ring-[#0d1117]',
        'shadow-[0_0_10px_rgba(239,68,68,0.55),0_2px_4px_rgba(0,0,0,0.4)]',
      )}
      style={{
        // Hide number in dot mode but keep the dot, so collapsed
        // users still see a glanceable indicator.
        fontVariantNumeric: 'tabular-nums',
      }}
      aria-label={`${count} unread messages`}
      title={`${count} unread messages`}
    >
      {showNumber ? text : null}
    </motion.span>
  );
}

// Tiny utility — duplicated from lib/utils to avoid an extra import
// (the dock file already imports plenty; we keep this self-contained).
function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
