'use client';

/** Avatar dropdown (lazy chunk). Arrow keys move between rows; Esc is handled by SiteNav. */
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Crown, KeyRound, LogOut, Moon, Sun } from 'lucide-react';
import { UserAvatar } from '@/components/common/UserAvatar';
import { ACCOUNT_LINKS, isVisible, type Viewer } from './navTree';
import { uiCopy } from './navLabels';
import { logoutEverywhere } from './navActions';
import s from './nav.module.css';

export interface UserMenuProps {
  lang: 'en' | 'vi';
  user: { displayName?: string; name?: string; username?: string; email?: string } | null;
  viewer: Viewer;
  isPro: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onChangePassword: () => void;
  onClose: () => void;
}

export default function UserMenu({ lang, user, viewer, isPro, theme, onToggleTheme, onChangePassword, onClose }: UserMenuProps) {
  const reduce = useReducedMotion();
  const t = uiCopy(lang);
  const ref = useRef<HTMLDivElement | null>(null);
  const links = ACCOUNT_LINKS.filter((it) => isVisible(it, viewer));
  const name = user?.displayName || user?.name || user?.username || 'User';

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus({ preventScroll: true });
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const rows = Array.from(ref.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    const i = rows.indexOf(document.activeElement as HTMLElement);
    e.preventDefault();
    const n = e.key === 'ArrowDown' ? (i + 1) % rows.length : (i <= 0 ? rows.length - 1 : i - 1);
    rows[n]?.focus();
  };

  return (
    <motion.div
      ref={ref}
      role="menu"
      aria-label={t.account}
      className={s.userMenu}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduce ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
      onKeyDown={onKeyDown}
    >
      <div className={s.userHead}>
        <UserAvatar size={38} className="rounded-xl shrink-0" />
        <div style={{ minWidth: 0 }}>
          <div className={s.userName} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
          {user?.email && <div className={s.userMail} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>}
        </div>
      </div>
      <Link href="/pro" prefetch={false} role="menuitem" className={`${s.menuRow} ${s.menuRowPro}`} onClick={onClose}>
        <Crown aria-hidden /> {isPro ? `${t.pro} ✓` : t.getPro}
      </Link>
      {links.map((it) => {
        const Icon = it.icon;
        return (
          <Link key={it.href} href={it.href} prefetch={false} role="menuitem" className={s.menuRow} onClick={onClose}>
            <Icon aria-hidden /> {it.title[lang]}
          </Link>
        );
      })}
      <div className={s.menuSep} />
      <button type="button" role="menuitem" className={s.menuRow} onClick={() => { onToggleTheme(); onClose(); }}>
        {theme === 'dark' ? <Sun aria-hidden /> : <Moon aria-hidden />}
        {theme === 'dark' ? t.theme.light : t.theme.dark}
      </button>
      <button type="button" role="menuitem" className={s.menuRow} onClick={() => { onClose(); onChangePassword(); }}>
        <KeyRound aria-hidden /> {t.changePassword}
      </button>
      <button
        type="button"
        role="menuitem"
        className={`${s.menuRow} ${s.menuRowDanger}`}
        onClick={() => { onClose(); void logoutEverywhere(t.loggedOut); }}
      >
        <LogOut aria-hidden /> {t.logout}
      </button>
    </motion.div>
  );
}
