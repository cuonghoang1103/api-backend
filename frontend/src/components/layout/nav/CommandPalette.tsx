'use client';

/**
 * Global ⌘K palette (lazy chunk). Searches every menu destination plus the
 * account pages, accent-insensitively and in both languages at once — typing
 * "phong thi" or "exam" both find the Exam Room. The last row hands the query
 * to people search (/friends?q=…), which the old top bar did inline.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CornerDownLeft, Search, Users } from 'lucide-react';
import { lockScroll, unlockScroll } from '@/lib/scrollLock';
import { MENU_HUE, MENU_LABEL, MENU_ORDER, uiCopy, type MenuId } from './navLabels';
import { ACCOUNT_LINKS, NAV_TREE, foldText, isVisible, type NavItem, type Viewer } from './navTree';
import s from './nav.module.css';
import { EASE_IOS, EXIT, FADE, SPRING_OPEN } from './navMotion';

interface Entry { item: NavItem; group: MenuId | 'account'; hay: string; title: string }

export interface CommandPaletteProps {
  open: boolean;
  lang: 'en' | 'vi';
  viewer: Viewer;
  onClose: () => void;
}

export default function CommandPalette({ open, lang, viewer, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const t = uiCopy(lang);
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const entries = useMemo<Entry[]>(() => {
    const out: Entry[] = [];
    const seen = new Set<string>();
    const push = (item: NavItem, group: Entry['group']) => {
      if (!isVisible(item, viewer) || seen.has(item.href)) return;
      seen.add(item.href);
      out.push({
        item,
        group,
        title: foldText(`${item.title.en} ${item.title.vi}`),
        hay: foldText([item.title.en, item.title.vi, item.desc.en, item.desc.vi, item.keywords ?? '', item.href].join(' ')),
      });
    };
    for (const m of NAV_TREE) for (const sec of m.sections) for (const it of sec.items) push(it, m.id);
    for (const it of ACCOUNT_LINKS) push(it, 'account');
    return out;
  }, [viewer]);

  const folded = foldText(q);
  const results = useMemo(() => {
    if (!folded) return entries;
    const words = folded.split(/\s+/).filter(Boolean);
    return entries
      .map((e) => {
        let score = 0;
        if (e.title.startsWith(folded) || e.title.includes(` ${folded}`)) score = 3;
        else if (e.title.includes(folded)) score = 2;
        else if (words.every((w) => e.hay.includes(w))) score = 1;
        return { e, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.e);
  }, [entries, folded]);

  useEffect(() => {
    if (!open) return;
    setQ('');
    lockScroll();
    const id = window.requestAnimationFrame(() => inputRef.current?.focus());
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); onClose(); } };
    window.addEventListener('keydown', onKey);
    return () => { window.cancelAnimationFrame(id); window.removeEventListener('keydown', onKey); unlockScroll(); };
  }, [open, onClose]);

  const go = (href: string) => { onClose(); router.push(href); };

  const renderItem = (e: Entry) => {
    const Icon = e.item.icon;
    const hue = e.group === 'account' ? '#64748b' : MENU_HUE[e.group];
    return (
      <Command.Item
        key={e.item.href}
        value={e.item.href}
        onSelect={() => go(e.item.href)}
        className={s.paletteItem}
        style={{ ['--hue' as string]: hue }}
      >
        <span className={s.tile} aria-hidden><Icon /></span>
        <span style={{ minWidth: 0 }}>
          <div className={s.paletteItemTitle}>{e.item.title[lang]}</div>
          <div className={s.paletteItemDesc}>{e.item.desc[lang]}</div>
        </span>
      </Command.Item>
    );
  };

  const groups: Array<MenuId | 'account'> = [...MENU_ORDER, 'account'];

  return (
    <AnimatePresence>
      {open && (
        <div className={s.scope} key="palette">
          <motion.div
            className={s.paletteBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: 'none', transition: reduce ? FADE : EXIT }}
            transition={reduce ? FADE : { duration: 0.22, ease: EASE_IOS }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            className={s.palette}
            role="dialog"
            aria-modal="true"
            aria-label={t.paletteTitle}
            style={{ transformOrigin: '50% 0%' }}
            initial={reduce ? { opacity: 0, x: '-50%' } : { opacity: 0, x: '-50%', y: -14, scale: 0.94 }}
            animate={{ opacity: 1, x: '-50%', y: 0, scale: 1 }}
            exit={reduce
              ? { opacity: 0, x: '-50%', pointerEvents: 'none', transition: FADE }
              : { opacity: 0, x: '-50%', y: -8, scale: 0.96, pointerEvents: 'none', transition: EXIT }}
            transition={reduce ? FADE : { ...SPRING_OPEN, opacity: { duration: 0.18 } }}
          >
            <Command shouldFilter={false} loop label={t.paletteTitle} style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
              <div className={s.paletteInputRow}>
                <Search aria-hidden />
                <Command.Input
                  ref={inputRef}
                  value={q}
                  onValueChange={setQ}
                  placeholder={t.palettePlaceholder}
                  className={s.paletteInput}
                />
                <kbd className={s.kbd}>Esc</kbd>
              </div>
              <Command.List className={s.paletteList}>
                {folded ? (
                  <>
                    {results.slice(0, 30).map(renderItem)}
                    <Command.Item
                      value={`people:${q}`}
                      onSelect={() => go(`/friends?q=${encodeURIComponent(q.trim())}`)}
                      className={s.paletteItem}
                      style={{ ['--hue' as string]: MENU_HUE.community }}
                    >
                      <span className={s.tile} aria-hidden><Users /></span>
                      <span className={s.paletteItemTitle}>{t.paletteSearchPeople} “{q.trim()}”</span>
                    </Command.Item>
                    {results.length === 0 && <div className={s.paletteEmpty}>{t.paletteEmpty}</div>}
                  </>
                ) : (
                  groups.map((g) => {
                    const list = results.filter((e) => e.group === g);
                    if (!list.length) return null;
                    return (
                      <Command.Group
                        key={g}
                        heading={<div className={s.paletteGroupHead}>{g === 'account' ? t.paletteAccount : MENU_LABEL[g][lang]}</div>}
                      >
                        {list.map(renderItem)}
                      </Command.Group>
                    );
                  })
                )}
              </Command.List>
              <div className={s.paletteFoot}>
                <CornerDownLeft size={13} aria-hidden /> {t.paletteHint}
              </div>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
