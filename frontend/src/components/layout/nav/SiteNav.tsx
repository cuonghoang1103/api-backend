'use client';

/**
 * Site-wide top navigation (02/11/2026). Replaces BOTH the old icon bar
 * (`Navbar.tsx`) and the ☰ drawer (`NavigationDock.tsx`).
 *
 *   desktop ≥1024px: logo · five mega-menu triggers · ⌘K search · language ·
 *                    theme · cart · bell · messenger · avatar / log in
 *   below 1024px:    back · logo · search · bell · ☰ → full-screen sheet
 *   phones <640px:   + the four-tab bottom bar (Home · Feed · Messages · AI Chat)
 *
 * Weight: this file is in every page's JS. The menu tree (icons + two-language
 * descriptions), the panel, the sheet, the palette and the avatar menu are all
 * `next/dynamic` chunks, fetched on first hover/focus of the bar or on idle.
 * Do not import `navTree.ts` here.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ArrowLeft, Bell, ChevronDown, Crown, Home, Menu, MessageCircle, Moon,
  Newspaper, Search, ShoppingBag, Sparkles, Sun,
} from 'lucide-react';
import { useChromeAutoHide } from '@/hooks/useChromeAutoHide';
import { adminCheckUserKey, useAdminCheck } from '@/lib/useAdminCheck';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useMessagingStore } from '@/store/messagingStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useNotificationSocket } from '@/hooks/useNotificationSocket';
import { useMusicAccess } from '@/hooks/useMusicAccess';
import { usePro } from '@/hooks/usePro';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/LocaleContext';
import { CART_ENABLED } from '@/lib/featureFlags';
import { UserAvatar } from '@/components/common/UserAvatar';
import {
  MENU_ORDER, MENU_LABEL, OPEN_PALETTE_EVENT, menuForPath, pageOwnsCmdK, uiCopy,
  type MenuId,
} from './navLabels';
import s from './nav.module.css';

const MegaPanel = dynamic(() => import('./MegaPanel'), { ssr: false });
const MobileSheet = dynamic(() => import('./MobileSheet'), { ssr: false });
const CommandPalette = dynamic(() => import('./CommandPalette'), { ssr: false });
const UserMenu = dynamic(() => import('./UserMenu'), { ssr: false });
const NotificationDropdown = dynamic(() => import('@/components/social/NotificationDropdown'), { ssr: false });
const ChangePasswordModal = dynamic(
  () => import('@/components/auth/ChangePasswordModal').then((m) => m.ChangePasswordModal),
  { ssr: false },
);

let warmed = false;
/** Fetch the panel chunks before they are needed (hover/focus on the bar, or idle). */
function warmPanels() {
  if (warmed) return;
  warmed = true;
  void import('./MegaPanel');
  void import('./CommandPalette');
}

const OPEN_DELAY = 70;
const CLOSE_DELAY = 220;

export default function SiteNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, setLocale } = useTranslation();
  const t = uiCopy(locale);
  const lang: 'en' | 'vi' = locale === 'vi' ? 'vi' : 'en';

  // Mobile/tablet hide-on-scroll (globals.css `.app-top-nav` / `.app-bottom-nav`).
  useChromeAutoHide(true);
  useEffect(() => {
    document.documentElement.classList.remove('chrome-hidden');
  }, [pathname]);

  const { data: session } = useSession();
  const { user: backendUser, isAuthenticated: isBackendAuth } = useAuthStore();
  const { hasAccess: hasMusicAccess } = useMusicAccess();
  const { isPro } = usePro();
  const { theme, toggleTheme } = useTheme();
  const cartCount = useCartStore((st) => st.getTotalItems());
  const openCart = useCartStore((st) => st.openDrawer);
  const unreadMessages = useMessagingStore((st) => st.unreadTotal);
  const initMessaging = useMessagingStore((st) => st.init);
  const disconnectMessaging = useMessagingStore((st) => st.shutdown);
  const unreadNotifications = useNotificationStore((st) => st.unreadCount);
  useNotificationSocket();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const adminKey = mounted ? adminCheckUserKey(isBackendAuth ? backendUser : null, session) : { key: null, hint: false };
  const isAdmin = useAdminCheck(adminKey.key, adminKey.hint) && mounted;
  const isAuthenticated = mounted && (isBackendAuth || !!session);
  const displayUser = mounted ? ((isBackendAuth ? backendUser : session?.user) as any) : null;
  const viewer = { isAuthenticated, isAdmin, hasMusicAccess };

  // Messaging socket + periodic unread refresh (moved from the old Navbar).
  useEffect(() => {
    if (!mounted) return;
    if (isAuthenticated) initMessaging();
    else disconnectMessaging();
  }, [mounted, isAuthenticated, initMessaging, disconnectMessaging]);
  useEffect(() => {
    if (!mounted || !isAuthenticated) return;
    const tick = () => { useMessagingStore.getState().refreshUnread().catch(() => {}); };
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, [mounted, isAuthenticated]);

  // ── Scroll state ───────────────────────────────────────────────────────
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  // ── Mega menu state ────────────────────────────────────────────────────
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const [focusFirst, setFocusFirst] = useState(0); // bump ⇒ panel focuses its first item
  const [hovered, setHovered] = useState<MenuId | null>(null);
  const triggerRefs = useRef<Partial<Record<MenuId, HTMLButtonElement | null>>>({});
  const menusRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const clearTimers = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openTimer.current = closeTimer.current = null;
  };
  const closeMenu = useCallback(() => {
    clearTimers();
    setOpenMenu(null);
  }, []);
  const scheduleClose = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), CLOSE_DELAY);
  }, []);
  const cancelClose = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);
  const userWrapRef = useRef<HTMLDivElement>(null);

  // Close everything on navigation.
  useEffect(() => {
    closeMenu();
    setSheetOpen(false);
    setPaletteOpen(false);
    setUserMenuOpen(false);
  }, [pathname, closeMenu]);

  // Outside pointer ⇒ close the mega panel / avatar menu.
  useEffect(() => {
    if (!openMenu && !userMenuOpen) return;
    const onDown = (e: PointerEvent) => {
      const tgt = e.target as Node;
      if (navRef.current?.contains(tgt) || panelRef.current?.contains(tgt)) {
        if (userMenuOpen && !userWrapRef.current?.contains(tgt)) setUserMenuOpen(false);
        return;
      }
      closeMenu();
      setUserMenuOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [openMenu, userMenuOpen, closeMenu]);

  // Esc closes the panel and hands focus back to its trigger.
  useEffect(() => {
    if (!openMenu && !userMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (openMenu) {
        const tr = triggerRefs.current[openMenu];
        closeMenu();
        tr?.focus();
      }
      if (userMenuOpen) {
        setUserMenuOpen(false);
        userWrapRef.current?.querySelector('button')?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openMenu, userMenuOpen, closeMenu]);

  // Global ⌘K / Ctrl+K — except on pages that bind it themselves.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.shiftKey || e.altKey) return;
      if (e.key.toLowerCase() !== 'k' || e.defaultPrevented) return;
      if (pageOwnsCmdK(window.location.pathname)) return;
      e.preventDefault();
      closeMenu();
      setPaletteOpen((v) => !v);
    };
    const onOpen = () => setPaletteOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, [closeMenu]);

  // Warm the panel chunks once the page is idle.
  useEffect(() => {
    const w = window as any;
    const id = w.requestIdleCallback ? w.requestIdleCallback(warmPanels, { timeout: 4000 }) : window.setTimeout(warmPanels, 2500);
    return () => { if (w.cancelIdleCallback) w.cancelIdleCallback(id); else window.clearTimeout(id); };
  }, []);

  // ── Pill that glides between triggers ──────────────────────────────────
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const pillTarget = openMenu ?? hovered;
  useLayoutEffect(() => {
    if (!pillTarget) return;
    const el = triggerRefs.current[pillTarget];
    if (el) setPill({ x: el.offsetLeft, w: el.offsetWidth });
  }, [pillTarget, locale]);

  const handleTriggerEnter = (id: MenuId, e: React.PointerEvent) => {
    warmPanels();
    setHovered(id);
    if (e.pointerType !== 'mouse') return; // touch opens on click
    cancelClose();
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (openMenu) setOpenMenu(id);
    else openTimer.current = window.setTimeout(() => setOpenMenu(id), OPEN_DELAY);
  };
  const handleTriggerKey = (id: MenuId, e: React.KeyboardEvent<HTMLButtonElement>) => {
    const idx = MENU_ORDER.indexOf(id);
    if (e.key === 'ArrowDown' || ((e.key === 'Enter' || e.key === ' ') && openMenu !== id)) {
      e.preventDefault();
      warmPanels();
      setOpenMenu(id);
      setFocusFirst((n) => n + 1);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const next = MENU_ORDER[(idx + (e.key === 'ArrowRight' ? 1 : MENU_ORDER.length - 1)) % MENU_ORDER.length];
      triggerRefs.current[next]?.focus();
      if (openMenu) setOpenMenu(next);
    } else if ((e.key === 'Enter' || e.key === ' ') && openMenu === id) {
      e.preventDefault();
      closeMenu();
    }
  };
  const handleNavBlur = (e: React.FocusEvent) => {
    const next = e.relatedTarget as Node | null;
    if (!next) return;
    if (navRef.current?.contains(next) || panelRef.current?.contains(next)) return;
    closeMenu();
  };

  const currentMenu = menuForPath(pathname);

  // Panels mount on first use and then stay mounted, so they can animate out.
  const lastMenu = useRef<MenuId>('learn');
  if (openMenu) lastMenu.current = openMenu;
  const [panelMounted, setPanelMounted] = useState(false);
  const [sheetMounted, setSheetMounted] = useState(false);
  const [paletteMounted, setPaletteMounted] = useState(false);
  useEffect(() => { if (openMenu) setPanelMounted(true); }, [openMenu]);
  useEffect(() => { if (sheetOpen) setSheetMounted(true); }, [sheetOpen]);
  useEffect(() => { if (paletteOpen) setPaletteMounted(true); }, [paletteOpen]);

  const switchLocale = () => setLocale(lang === 'en' ? 'vi' : 'en');

  // ── Routes without the site chrome ─────────────────────────────────────
  // (after every hook — see the Rules-of-Hooks note in the old NavigationDock)
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isBarePage = (pathname?.startsWith('/creator') ?? false)
    || (pathname?.startsWith('/nhung-video') ?? false) // bare iframe frame for the desktop app overlay
    || (pathname?.startsWith('/admin') ?? false) // admin has its own shell
    || pathname === '/work' || (pathname?.startsWith('/work/') ?? false); // CT Work has its own shell
  if (isAuthPage || isBarePage) return null;

  const showBack = pathname !== '/';
  const anchorEl = openMenu ? triggerRefs.current[openMenu] ?? null : null;

  return (
    <div className={s.scope} suppressHydrationWarning>
      <header
        ref={navRef as React.RefObject<HTMLElement>}
        className={`${s.bar} app-top-nav`}
        data-scrolled={scrolled ? 'true' : 'false'}
        data-open={openMenu ? 'true' : 'false'}
        onPointerEnter={warmPanels}
        onPointerLeave={(e) => { if (e.pointerType === 'mouse') { setHovered(null); if (openMenu) scheduleClose(); else if (openTimer.current) window.clearTimeout(openTimer.current); } }}
        onFocus={warmPanels}
        onBlur={handleNavBlur}
      >
        <div className={s.barInner}>
          {showBack && (
            <button
              type="button"
              onClick={() => router.back()}
              aria-label={t.back}
              className={`${s.iconBtn} ${s.hideFromSm}`}
            >
              <ArrowLeft />
            </button>
          )}

          <Link href="/" className={s.brand} aria-label={t.home}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/favicon.png" alt="" width={34} height={34} className={s.brandMark} data-pro={isPro ? 'true' : 'false'} />
            <span className={s.brandWord}>Cuong<b>Thai</b></span>
            {isPro && <span className={`${s.proChip} ${s.hideBelowSm}`}><Crown size={10} aria-hidden />PRO</span>}
          </Link>

          <nav aria-label={t.mainNav}>
            <div className={s.menus} ref={menusRef}>
              <span
                className={s.pill}
                aria-hidden
                style={pill ? { transform: `translateX(${pill.x}px)`, width: pill.w, opacity: pillTarget ? 1 : 0 } : undefined}
              />
              {MENU_ORDER.map((id) => (
                <button
                  key={id}
                  ref={(el) => { triggerRefs.current[id] = el; }}
                  type="button"
                  className={s.trigger}
                  data-mega-trigger={id}
                  data-current={currentMenu === id ? 'true' : 'false'}
                  aria-expanded={openMenu === id}
                  aria-haspopup="true"
                  aria-controls={openMenu === id ? `mega-${id}` : undefined}
                  onPointerEnter={(e) => handleTriggerEnter(id, e)}
                  onPointerLeave={() => { if (openTimer.current) window.clearTimeout(openTimer.current); }}
                  onClick={() => { warmPanels(); clearTimers(); setOpenMenu((cur) => (cur === id ? null : id)); }}
                  onKeyDown={(e) => handleTriggerKey(id, e)}
                >
                  {MENU_LABEL[id][lang]}
                  <ChevronDown className={s.chev} aria-hidden />
                </button>
              ))}
            </div>
          </nav>

          <div className={s.spacer} />

          <div className={s.controls}>
            <button type="button" className={s.searchPill} onClick={() => setPaletteOpen(true)} onPointerEnter={warmPanels}>
              <Search size={15} aria-hidden />
              <span>{t.searchHint}</span>
              <kbd className={s.kbd}>⌘K</kbd>
            </button>
            <button type="button" className={`${s.iconBtn} ${s.searchIcon}`} aria-label={t.search} onClick={() => setPaletteOpen(true)}>
              <Search />
            </button>

            <button
              type="button"
              className={`${s.iconBtn} ${s.langBtn} ${s.hideBelowLg}`}
              onClick={switchLocale}
              aria-label={t.languageAria}
              title={t.language}
            >
              {lang === 'en' ? <><b>EN</b><i>/</i><span>VI</span></> : <><span>EN</span><i>/</i><b>VI</b></>}
            </button>
            <button
              type="button"
              className={`${s.iconBtn} ${s.hideBelowLg}`}
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t.theme.light : t.theme.dark}
              title={theme === 'dark' ? t.theme.light : t.theme.dark}
            >
              {theme === 'dark' ? <Sun /> : <Moon />}
            </button>

            {CART_ENABLED && mounted && cartCount > 0 && (
              <button type="button" className={s.iconBtn} onClick={openCart} aria-label={t.cart}>
                <ShoppingBag />
                <span className={s.badge}>{cartCount}</span>
              </button>
            )}

            {isAuthenticated && (
              <>
                <button
                  ref={bellRef}
                  type="button"
                  className={s.iconBtn}
                  aria-label={t.notifications}
                  aria-expanded={bellOpen}
                  onClick={() => {
                    setBellOpen((o) => !o);
                    if (!bellOpen) useNotificationStore.getState().loadInitial();
                  }}
                >
                  <Bell />
                  {(unreadNotifications ?? 0) > 0 && (
                    <span className={s.badge}>{unreadNotifications > 99 ? '99+' : unreadNotifications}</span>
                  )}
                </button>
                <Link href="/messages" className={`${s.iconBtn} ${s.hideBelowLg}`} aria-label={t.messages}>
                  <MessageCircle />
                  {(unreadMessages ?? 0) > 0 && (
                    <span className={s.badge}>{unreadMessages > 99 ? '99+' : unreadMessages}</span>
                  )}
                </Link>
                <div ref={userWrapRef} className={`${s.hideBelowLg}`} style={{ position: 'relative' }}>
                  <button
                    type="button"
                    className={s.avatarBtn}
                    aria-label={t.account}
                    aria-haspopup="menu"
                    aria-expanded={userMenuOpen}
                    onClick={() => { closeMenu(); setUserMenuOpen((v) => !v); }}
                  >
                    <UserAvatar size={28} className="rounded-lg" />
                    <ChevronDown size={14} aria-hidden />
                  </button>
                  {userMenuOpen && (
                    <UserMenu
                      lang={lang}
                      user={displayUser}
                      viewer={viewer}
                      isPro={isPro}
                      theme={theme === 'dark' ? 'dark' : 'light'}
                      onToggleTheme={toggleTheme}
                      onChangePassword={() => setPwOpen(true)}
                      onClose={() => setUserMenuOpen(false)}
                    />
                  )}
                </div>
              </>
            )}

            {!isAuthenticated && mounted && (
              <>
                <Link href="/login" className={`${s.loginLink} ${s.hideBelowLg}`}>{t.login}</Link>
                <Link href="/register" className={`${s.signupLink} ${s.hideBelowSm}`}>{t.signup}</Link>
              </>
            )}

            <button
              type="button"
              className={`${s.iconBtn} ${s.hideFromLg}`}
              aria-label={t.openMenu}
              aria-expanded={sheetOpen}
              data-mobile-menu-trigger
              onClick={() => setSheetOpen(true)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>

      {panelMounted && (
        <MegaPanel
          open={!!openMenu}
          panelRef={panelRef}
          menuId={openMenu ?? lastMenu.current}
          anchor={anchorEl}
          lang={lang}
          viewer={viewer}
          pathname={pathname}
          focusFirstKey={focusFirst}
          onPointerEnter={cancelClose}
          onPointerLeave={scheduleClose}
          onNavigate={closeMenu}
          onBlur={handleNavBlur}
        />
      )}

      {sheetMounted && (
        <MobileSheet
          open={sheetOpen}
          lang={lang}
          viewer={viewer}
          pathname={pathname}
          user={displayUser}
          isPro={isPro}
          theme={theme === 'dark' ? 'dark' : 'light'}
          onToggleTheme={toggleTheme}
          onToggleLocale={switchLocale}
          onOpenSearch={() => { setSheetOpen(false); setPaletteOpen(true); }}
          onChangePassword={() => { setSheetOpen(false); setPwOpen(true); }}
          onClose={() => setSheetOpen(false)}
        />
      )}

      {paletteMounted && (
        <CommandPalette open={paletteOpen} lang={lang} viewer={viewer} onClose={() => setPaletteOpen(false)} />
      )}

      {/* Phone bottom tabs — hidden on /messages so the composer owns the bottom edge. */}
      {!(pathname?.startsWith('/messages')) && (
        <nav className={`${s.tabs} app-bottom-nav`} aria-label={t.mainNav}>
          <BottomTab href="/" icon={<Home />} label={lang === 'vi' ? 'Trang chủ' : 'Home'} pathname={pathname} />
          <BottomTab href="/feed" icon={<Newspaper />} label={lang === 'vi' ? 'Bảng tin' : 'Feed'} pathname={pathname} />
          {isAuthenticated && (
            <BottomTab href="/messages" icon={<MessageCircle />} label={lang === 'vi' ? 'Tin nhắn' : 'Messages'} pathname={pathname} badge={unreadMessages} />
          )}
          <BottomTab href="/chat" icon={<Sparkles />} label="AI Chat" pathname={pathname} />
        </nav>
      )}

      {isAuthenticated && bellOpen && (
        <NotificationDropdown anchor={bellRef.current} open={bellOpen} onClose={() => setBellOpen(false)} />
      )}
      {pwOpen && <ChangePasswordModal open={pwOpen} onClose={() => setPwOpen(false)} />}
    </div>
  );
}

function BottomTab({ href, icon, label, pathname, badge }: {
  href: string; icon: React.ReactNode; label: string; pathname: string | null; badge?: number;
}) {
  const active = href === '/' ? pathname === '/' : pathname === href || (pathname?.startsWith(`${href}/`) ?? false);
  return (
    <Link href={href} className={s.tab} aria-current={active ? 'page' : undefined}>
      {icon}
      <span>{label}</span>
      {!!badge && badge > 0 && <span className={s.badge}>{badge > 99 ? '99+' : badge}</span>}
    </Link>
  );
}
