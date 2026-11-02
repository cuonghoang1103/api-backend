'use client';

/**
 * Below 1024px the mega menus become one full-screen sheet (a right-hand
 * drawer from 640px): the same tree, the same icon tiles and descriptions,
 * grouped as an accordion. Lazy chunk.
 *
 * Focus is trapped while it is open (Tab cycles inside, Esc closes and returns
 * focus to the ☰ button); the page behind does not scroll.
 */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Crown, KeyRound, LogOut, Mail, Moon, Phone, Search, Sun, X, Languages } from 'lucide-react';
import { lockScroll, unlockScroll } from '@/lib/scrollLock';
import { UserAvatar } from '@/components/common/UserAvatar';
import { MENU_HUE, MENU_LABEL, MENU_ORDER, CONTACT, menuForPath, uiCopy, type MenuId } from './navLabels';
import { ACCOUNT_LINKS, NAV_TREE, isActivePath, isVisible, visibleMenu, type NavItem, type Viewer } from './navTree';
import { logoutEverywhere } from './navActions';
import s from './nav.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

export interface MobileSheetProps {
  open: boolean;
  lang: 'en' | 'vi';
  viewer: Viewer;
  pathname: string | null;
  user: { displayName?: string; name?: string; username?: string; email?: string } | null;
  isPro: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onToggleLocale: () => void;
  onOpenSearch: () => void;
  onChangePassword: () => void;
  onClose: () => void;
}

function Row({ it, hue, lang, pathname, onClose }: { it: NavItem; hue: string; lang: 'en' | 'vi'; pathname: string | null; onClose: () => void }) {
  const Icon = it.icon;
  return (
    <li>
      <Link
        href={it.href}
        prefetch={false}
        className={s.item}
        style={{ ['--hue' as string]: hue }}
        aria-current={isActivePath(pathname, it.href) ? 'page' : undefined}
        onClick={onClose}
      >
        <span className={s.tile} aria-hidden><Icon /></span>
        <span className={s.itemText}>
          <span className={s.itemTitle}>{it.title[lang]}</span>
          <span className={s.itemDesc}>{it.desc[lang]}</span>
        </span>
      </Link>
    </li>
  );
}

export default function MobileSheet(props: MobileSheetProps) {
  const { open, lang, viewer, pathname, user, isPro, theme, onClose } = props;
  const reduce = useReducedMotion();
  const t = uiCopy(lang);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [expanded, setExpanded] = useState<MenuId | 'account' | null>(() => menuForPath(pathname) ?? 'learn');

  useEffect(() => {
    if (!open) return;
    setExpanded(menuForPath(pathname) ?? 'learn');
    lockScroll();
    document.documentElement.classList.add('nav-sheet-open');
    const id = window.requestAnimationFrame(() => closeRef.current?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab' || !sheetRef.current) return;
      const f = Array.from(sheetRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
        .filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.cancelAnimationFrame(id);
      window.removeEventListener('keydown', onKey);
      unlockScroll();
      document.documentElement.classList.remove('nav-sheet-open');
      document.querySelector<HTMLElement>('[data-mobile-menu-trigger]')?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const name = user?.displayName || user?.name || user?.username || '';
  const accountLinks = ACCOUNT_LINKS.filter((it) => isVisible(it, viewer));

  return (
    <AnimatePresence>
      {open && (
        <div className={s.scope} key="sheet">
          <motion.div
            className={s.sheetBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: 'none', transition: { duration: reduce ? 0 : 0.18 } }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={sheetRef}
            className={s.sheet}
            role="dialog"
            aria-modal="true"
            aria-label={t.menuTitle}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0, pointerEvents: 'none' } : { opacity: 0, x: 28, pointerEvents: 'none', transition: { duration: 0.18, ease: EASE } }}
            transition={{ duration: reduce ? 0 : 0.28, ease: EASE }}
          >
            <div className={s.sheetHead}>
              <Link href="/" className={s.brand} onClick={onClose} aria-label={t.home}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/favicon.png" alt="" width={32} height={32} className={s.brandMark} data-pro={isPro ? 'true' : 'false'} />
                <span className={s.brandWord}>Cuong<b>Thai</b></span>
              </Link>
              <span className={s.spacer} />
              <button ref={closeRef} type="button" className={s.iconBtn} onClick={onClose} aria-label={t.closeMenu}>
                <X />
              </button>
            </div>

            <div className={s.sheetScroll}>
              <button type="button" className={s.sheetSearch} onClick={props.onOpenSearch}>
                <Search aria-hidden />
                <span>{t.palettePlaceholder}</span>
              </button>

              {viewer.isAuthenticated ? (
                <div className={s.sheetAccount}>
                  <UserAvatar size={40} className="rounded-xl shrink-0" />
                  <div style={{ minWidth: 0 }}>
                    <div className={s.userName} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
                    {user?.email && <div className={s.userMail} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>}
                  </div>
                </div>
              ) : (
                <div className={s.sheetAccount} style={{ display: 'block' }}>
                  <div className={s.userMail} style={{ fontSize: '0.875rem' }}>{t.signedOutHint}</div>
                  <div className={s.sheetAccountActions}>
                    <Link href="/login" className={s.chipBtn} onClick={onClose}>{t.login}</Link>
                    <Link href="/register" className={s.signupLink} onClick={onClose}>{t.signup}</Link>
                  </div>
                </div>
              )}

              {MENU_ORDER.map((id) => {
                const menu = visibleMenu(NAV_TREE.find((m) => m.id === id)!, viewer);
                const isOpen = expanded === id;
                const hue = MENU_HUE[id];
                return (
                  <div key={id} className={s.sheetGroup} style={{ ['--hue' as string]: hue }}>
                    <button
                      type="button"
                      className={s.sheetGroupBtn}
                      aria-expanded={isOpen}
                      aria-controls={`sheet-${id}`}
                      data-mobile-group={id}
                      onClick={() => setExpanded(isOpen ? null : id)}
                    >
                      <span className={s.sheetDot} aria-hidden />
                      {MENU_LABEL[id][lang]}
                      <ChevronDown className={s.chev} aria-hidden />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`sheet-${id}`}
                          className={s.sheetPanel}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: reduce ? 0 : 0.26, ease: EASE }}
                        >
                          <div className={s.sheetPanelInner}>
                            {menu.sections.map((sec) => (
                              <div key={sec.id}>
                                <div className={s.sheetSectionHead}>{sec.heading[lang]}</div>
                                <ul className={s.items}>
                                  {sec.items.map((it) => (
                                    <Row key={it.href} it={it} hue={hue} lang={lang} pathname={pathname} onClose={onClose} />
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {viewer.isAuthenticated && (
                <div className={s.sheetGroup} style={{ ['--hue' as string]: '#64748b' }}>
                  <button
                    type="button"
                    className={s.sheetGroupBtn}
                    aria-expanded={expanded === 'account'}
                    onClick={() => setExpanded(expanded === 'account' ? null : 'account')}
                  >
                    <span className={s.sheetDot} aria-hidden />
                    {t.account}
                    <ChevronDown className={s.chev} aria-hidden />
                  </button>
                  <AnimatePresence initial={false}>
                    {expanded === 'account' && (
                      <motion.div
                        className={s.sheetPanel}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.26, ease: EASE }}
                      >
                        <div className={s.sheetPanelInner}>
                          <ul className={s.items}>
                            {accountLinks.map((it) => (
                              <Row key={it.href} it={it} hue="#64748b" lang={lang} pathname={pathname} onClose={onClose} />
                            ))}
                          </ul>
                          <button type="button" className={s.menuRow} onClick={props.onChangePassword}>
                            <KeyRound aria-hidden /> {t.changePassword}
                          </button>
                          <button
                            type="button"
                            className={`${s.menuRow} ${s.menuRowDanger}`}
                            onClick={() => { onClose(); void logoutEverywhere(t.loggedOut); }}
                          >
                            <LogOut aria-hidden /> {t.logout}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className={s.sheetFoot}>
              <button type="button" className={s.chipBtn} onClick={props.onToggleLocale} aria-label={t.languageAria}>
                <Languages aria-hidden /> {t.language}
              </button>
              <button
                type="button"
                className={s.chipBtn}
                onClick={props.onToggleTheme}
                aria-label={theme === 'dark' ? t.theme.light : t.theme.dark}
              >
                {theme === 'dark' ? <Sun aria-hidden /> : <Moon aria-hidden />}
                {theme === 'dark' ? t.themeShort.light : t.themeShort.dark}
              </button>
              {!isPro && (
                <Link href="/pro" className={s.chipBtn} onClick={onClose}>
                  <Crown aria-hidden style={{ color: '#f59e0b' }} /> {t.getPro}
                </Link>
              )}
              <span className={s.spacer} />
              <a href={`tel:${CONTACT.phone}`} className={s.iconBtn} aria-label={lang === 'vi' ? 'Gọi điện' : 'Call'}><Phone /></a>
              <a href={`mailto:${CONTACT.email}`} className={s.iconBtn} aria-label="Email"><Mail /></a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
