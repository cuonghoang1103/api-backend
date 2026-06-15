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
} from 'lucide-react';
import { useMessagingStore } from '@/store/messagingStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

// Fixed rail width. The dock never expands; labels are shown as
// a floating tooltip next to the hovered icon (Facebook style).
export const DOCK_WIDTH = 52;

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

const sectionVariants: Variants = {
  hidden: { opacity: 0, x: -6 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.22, ease: APPLE_EASE },
  }),
};

export default function NavigationDock() {
  const pathname = usePathname();
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unreadMessages = useMessagingStore((s) => s.unreadTotal);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const sections = (['main', 'user', 'admin'] as const).map((key, i) => ({
    key,
    index: i,
    ...SECTIONS[key],
    items: DOCK_ITEMS.filter((item) => item.section === key),
  }));

  // Show tooltip after ~200ms hover to avoid flicker when the
  // user is just gliding the cursor over the rail.
  const handleRowEnter = useCallback((href: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredHref(href);
    }, 180);
  }, []);

  const handleRowLeave = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = null;
    setHoveredHref(null);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  return (
    <motion.nav
      initial={false}
      animate={{ width: DOCK_WIDTH }}
      transition={{ type: 'spring', stiffness: 360, damping: 32, mass: 0.85 }}
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
                const isActive = pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href));
                const Icon = item.icon;
                const showUnread = !!item.showUnread && mounted && isAuthenticated && unreadMessages > 0;
                const isHovered = hoveredHref === item.href;

                return (
                  <DockRow
                    key={item.href}
                    item={item}
                    Icon={Icon}
                    isActive={isActive}
                    isHovered={isHovered}
                    showUnread={showUnread}
                    unreadCount={unreadMessages}
                    onHover={() => handleRowEnter(item.href)}
                    onLeave={handleRowLeave}
                  />
                );
              })}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}

// ── Single dock row ───────────────────────────────────────────────
// A 36px square icon, centered in the 52px column. No scale, no
// magnify. The label is a small floating tooltip that pops to
// the right of the icon (Facebook-style) on hover.
function DockRow({
  item,
  Icon,
  isActive,
  isHovered,
  showUnread,
  unreadCount,
  onHover,
  onLeave,
}: {
  item: DockItem;
  Icon: React.ElementType;
  isActive: boolean;
  isHovered: boolean;
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
          'relative flex items-center justify-center w-8 h-8 mx-auto rounded-lg select-none',
          'transition-colors duration-150',
        )}
      >
        {/* Active indicator bar — flat gradient, no halo. The
            bar sits on the left edge of the row, not the
            icon, so it reads as a printed marker for the
            whole row. */}
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

        {/* Icon wrapper — a single soft background tint. No
            box-shadow glow. The pill background opacity is
            intentionally low (0.06-0.08) so the rail stays
            quiet and the cursor's location is the only thing
            that gets emphasis. */}
        <motion.div
          className="flex items-center justify-center rounded-lg w-8 h-8"
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
              'shrink-0 w-[15px] h-[15px] transition-colors duration-150',
              isActive
                ? 'text-text-primary'
                : isHovered
                  ? 'text-text-primary'
                  : 'text-text-muted',
            )}
          />
        </motion.div>

        {/* Unread badge — Messenger-style dot. */}
        {showUnread && (
          <UnreadBadge
            count={unreadCount}
            isActive={isActive}
          />
        )}
      </Link>

      {/* Tooltip — Facebook-style label that pops out to the
          right of the icon. Anchored left-12 (so its arrow /
          left edge sits 4px right of the rail), vertically
          centered on the row. The label is a small dark pill
          with a slight backdrop blur so it stays readable
          over both light and dark page backgrounds. */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            key={`tooltip-${item.href}`}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.14, ease: APPLE_EASE }}
            className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-[60]"
          >
            <div
              className="whitespace-nowrap rounded-lg px-2.5 py-1.5
                text-[12px] font-medium text-white
                shadow-[0_6px_18px_rgba(0,0,0,0.4)]"
              style={{
                background: 'rgba(13, 17, 23, 0.92)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              {item.label}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Unread badge ──────────────────────────────────────────────────
function UnreadBadge({
  count,
  isActive,
}: {
  count: number;
  isActive: boolean;
}) {
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
