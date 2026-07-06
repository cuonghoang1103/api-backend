'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Home, BookOpen, FolderOpen, Music, MessagesSquare,
  LayoutDashboard, Shield, BookMarked, Receipt,
  Sparkles, FileCode2, LogOut, User, Settings,
  GraduationCap, ShoppingBag, Layers, ChevronRight,
  Github, Menu, X, NotebookPen, Languages,
} from 'lucide-react';
import { useMessagingStore } from '@/store/messagingStore';
import { useAuthStore } from '@/store/authStore';
import { useNotificationSocket } from '@/hooks/useNotificationSocket';
import { UserAvatar } from '@/components/common/UserAvatar';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'sonner';
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

// Full vertical nav (2026-07-03) — ordered per spec:
//   main:  Home, Academy, Shop, Messages, Courses, Orders
//   user:  Blog, Projects, Exp Hub, Hub, GitHub Repos, AI Chat, Music, Dashboard
//   admin: Admin (admin-only entry point, kept in its own section)
const DOCK_ITEMS: DockItem[] = [
  { href: '/', label: 'Home', icon: Home, section: 'main' },
  { href: '/academy', label: 'Academy', icon: GraduationCap, section: 'main' },
  { href: '/shop', label: 'Shop', icon: ShoppingBag, section: 'main' },
  { href: '/messages', label: 'Messages', icon: MessagesSquare, section: 'main', showUnread: true },
  { href: '/courses', label: 'Courses', icon: BookMarked, section: 'main' },
  { href: '/my-orders', label: 'Orders', icon: Receipt, section: 'main' },
  { href: '/blog', label: 'Blog', icon: BookOpen, section: 'user' },
  { href: '/notes', label: 'Notes', icon: NotebookPen, section: 'user' },
  { href: '/language', label: 'My Language', icon: Languages, section: 'user' },
  { href: '/projects', label: 'Projects', icon: FolderOpen, section: 'user' },
  { href: '/exp-hub', label: 'Exp Hub', icon: FileCode2, section: 'user' },
  { href: '/hub', label: 'Hub', icon: Layers, section: 'user' },
  { href: '/repos', label: 'GitHub Repos', icon: Github, section: 'user' },
  { href: '/chat', label: 'AI Chat', icon: Sparkles, section: 'user' },
  { href: '/music', label: 'Music', icon: Music, section: 'user' },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'user' },
  { href: '/admin', label: 'Admin', icon: Shield, section: 'admin' },
];

const SECTIONS = {
  main: { label: 'Navigate' },
  user: { label: 'Personal' },
  admin: { label: 'Account' },
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
  // /creator has its own studio topbar; the dock's floating
  // button would compete with it for the top-left slot.
  if (pathname?.startsWith('/creator')) return null;

  // Pages that already have a left-side sidebar of their own.
  // The dock's floating button sits at top-4 left-6 (z-70) and
  // visually + interactively overlaps any sidebar collapsed into
  // the same top-left region (e.g. /exp-hub FolderTree collapses
  // to a 44px strip directly under the dock button, so every
  // click on the collapsed chevron opened the dock panel and
  // stranded the user on the page-list). On these pages we hide
  // only the trigger button — the dock panel itself can still be
  // opened programmatically if a page needs it.
  // NOTE: /notes was briefly in this list (5b8cbfc) on the theory the
  // trigger overlapped its sidebar — the real culprit turned out to be
  // the zombie exit panel (fixed in 5a3a59a), and the notes sidebar
  // starts below the pt-16 top bar anyway, so the trigger is restored
  // there (users lost their nav menu, reported 2026-07-06).
  const hideTriggerButton =
    pathname?.startsWith('/exp-hub') ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/messages');

  const [isOpen, setIsOpen] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unreadMessages = useMessagingStore((s) => s.unreadTotal);
  const { user: backendUser, isAuthenticated: isBackendAuth } = useAuthStore();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [verifiedAdmin, setVerifiedAdmin] = useState(false);
  useEffect(() => setMounted(true), []);

  // Admin check — only for signed-in users; guests can't be admins and
  // the unconditional call fired a guaranteed-401 on every anonymous
  // page view (audit 2026-07-05).
  useEffect(() => {
    if (!mounted) return;
    if (!isBackendAuth && !session) return;
    const verifyAdmin = async () => {
      try {
        const res = await fetch('/api/auth/admin-check', { credentials: 'include', cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const isAdmin = (data.data?.roles ?? []).some(
            (r: string) => (r || '').replace('ROLE_', '').toUpperCase() === 'ADMIN',
          );
          setVerifiedAdmin(isAdmin);
        }
      } catch {}
    };
    verifyAdmin();
    // isBackendAuth/session in deps so the check re-runs when auth hydrates
    // after mount (persisted-store rehydration or a fresh login).
  }, [mounted, isBackendAuth, session]);

  const isAuthenticated = mounted && (isBackendAuth || !!session);
  const displayUser = mounted
    ? ((isBackendAuth ? backendUser : session?.user) as any)
    : null;
  const isAdmin = mounted && verifiedAdmin;

  // Activate the notification socket listener exactly once for
  // the lifetime of the dock. The hook itself is idempotent and
  // keeps the toolbar bell's unread count accurate in real time.
  useNotificationSocket();

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
      {/* ── Toggle button (always visible, hidden on pages with
          their own left sidebar — see hideTriggerButton above) ──
          A small floating button in the top-left of the
          viewport. Tapping it opens the sidebar panel.
          The button stays put while the panel animates in
          / out — it does NOT slide away, and the icon
          crossfades from Menu to X via AnimatePresence. */}
      {!hideTriggerButton && (
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
      )}

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
            // pointerEvents none applies INSTANTLY at exit start — even if
            // the exit animation stalls and the element zombies in the DOM,
            // it can never swallow clicks meant for the page underneath.
            exit={{ opacity: 0, backdropFilter: 'blur(0px)', pointerEvents: 'none' }}
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
            // Exit hardening (2026-07-05). The old exit relied on the
            // PANEL_SPRING finishing so AnimatePresence could unmount the
            // panel. When the panel closed BECAUSE of a route change, the
            // exit sometimes never completed and the panel stayed mounted at
            // opacity:0 with pointer-events:auto — an invisible 288px sheet
            // over the new page's left sidebar (exp-hub/notes) whose hidden
            // nav links swallowed every click ("click folder → jump to a
            // random page"). Two defenses:
            //   1. pointerEvents:'none' is a non-animatable value, applied
            //      the instant the exit starts — a stuck panel is harmless.
            //   2. exit uses a fixed-duration tween (springs + in-flight
            //      layout changes are what stalled completion).
            exit={{
              opacity: 0,
              x: -32,
              scale: 0.96,
              pointerEvents: 'none',
              transition: { duration: 0.22, ease: [0.32, 0.94, 0.6, 1] },
            }}
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
            {/* Panel header — leaves room for the toggle button at the top
                so they don't overlap; grows by the notch inset in the
                installed PWA (where the toggle is pushed down too). */}
            <div className="shrink-0 px-5 pb-3 pt-[calc(4rem+env(safe-area-inset-top,0px))]">
              {/* Account section - shows for authenticated users */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3 mb-3 px-2 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <UserAvatar size={36} className="rounded-lg shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-100 truncate">
                      {displayUser?.displayName || displayUser?.name || displayUser?.username || 'User'}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{displayUser?.email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex gap-2">
                    <a href="/login" className="text-xs text-slate-400 hover:text-slate-200">Login</a>
                    <span className="text-slate-600">/</span>
                    <a href="/register" className="text-xs text-slate-400 hover:text-slate-200">Register</a>
                  </div>
                </div>
              )}
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
                  {/* For 'admin' section, show Account section with user actions */}
                  {key === 'admin' ? (
                    <>
                      <p className="px-3 pt-2 pb-1 text-[10px] font-mono uppercase tracking-[0.16em] text-text-muted/70">
                        {SECTIONS[key].label}
                      </p>
                      {/* Admin Dashboard - only for admins */}
                      {isAdmin && (
                        <DockRowLink
                          href="/admin"
                          Icon={Shield}
                          label="Admin Dashboard"
                          isActive={pathname === '/admin'}
                          isHovered={hoveredHref === '/admin'}
                          scale={1}
                          onHover={() => setHoveredHref('/admin')}
                          onLeave={() => setHoveredHref(null)}
                        />
                      )}
                      {/* Profile */}
                      <DockRowLink
                        href="/profile"
                        Icon={User}
                        label="Profile"
                        isActive={pathname === '/profile'}
                        isHovered={hoveredHref === '/profile'}
                        scale={1}
                        onHover={() => setHoveredHref('/profile')}
                        onLeave={() => setHoveredHref(null)}
                      />
                      {/* Settings */}
                      <DockRowLink
                        href="/settings/notifications"
                        Icon={Settings}
                        label="Settings"
                        isActive={pathname === '/settings/notifications'}
                        isHovered={hoveredHref === '/settings/notifications'}
                        scale={1}
                        onHover={() => setHoveredHref('/settings/notifications')}
                        onLeave={() => setHoveredHref(null)}
                      />
                      {/* Logout - only for authenticated */}
                      {isAuthenticated && (
                        <button
                          onClick={() => {
                            close();
                            useAuthStore.getState().logout();
                            signOut({ redirect: false }).catch(() => {});
                            fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
                            toast.success('Logged out successfully');
                            window.location.href = '/login';
                          }}
                          className="flex items-center w-full pl-3 pr-3 h-12 rounded-2xl text-slate-400 hover:text-red-400 hover:bg-white/[0.04] transition-colors"
                        >
                          <div className="flex items-center justify-center w-7 h-7">
                            <LogOut className="w-[18px] h-[18px]" />
                          </div>
                          <span className="ml-3 flex-1 text-[14px] font-medium text-left">Logout</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
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
        {/* Active bar — flat gradient on the left edge.
            NOTE: deliberately NOT a layoutId shared-layout element. The
            active row changes at the same moment the panel starts its exit
            (route change closes the panel), and a layoutId re-parenting
            mid-exit stalled AnimatePresence — the panel never unmounted and
            its invisible links ate clicks on the next page's sidebar. */}
        {isActive && (
          <div
            className="absolute -left-1 top-2 bottom-2 w-[3px] rounded-full"
            style={{
              background: 'linear-gradient(180deg, #22d3ee, #8b5cf6)',
              boxShadow: '0 0 12px rgba(34, 211, 238, 0.4)',
            }}
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

// ── Single dock row (Link version for manual items) ──────────
function DockRowLink({
  href,
  Icon,
  label,
  isActive,
  isHovered,
  scale,
  onHover,
  onLeave,
}: {
  href: string;
  Icon: React.ElementType;
  label: string;
  isActive: boolean;
  isHovered: boolean;
  scale: number;
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
        href={href}
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
        {/* Active bar (plain div — see DockRow note about layoutId) */}
        {isActive && (
          <div
            className="absolute -left-1 top-2 bottom-2 w-[3px] rounded-full"
            style={{
              background: 'linear-gradient(180deg, #22d3ee, #8b5cf6)',
              boxShadow: '0 0 12px rgba(34, 211, 238, 0.4)',
            }}
          />
        )}

        {/* Icon */}
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
          {label}
        </span>
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
