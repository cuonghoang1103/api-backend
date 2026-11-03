'use client';

/**
 * Desktop mega-menu panel (lazy chunk). One container stays mounted while the
 * pointer moves between triggers: it glides to the new trigger, resizes to the
 * new content and cross-fades the sections, so switching menus reads as one
 * object moving rather than five popups blinking.
 *
 * Exit is a fixed-length tween with `pointerEvents: 'none'` applied at once —
 * the old dock taught us a stalled exit leaves an invisible sheet that eats
 * clicks on the next page.
 *
 * Opening (03/11/2026): the panel grows out of the trigger — `transform-origin`
 * sits under the button that opened it — on a soft spring, the page behind dims
 * and blurs (fixed radius, opacity-only), and the rows cascade in. Reduced
 * motion ⇒ plain fades. See `navMotion.ts`.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronRight, Mail, Phone } from 'lucide-react';
import { MENU_HUE, MENU_LABEL, MENU_ORDER, CONTACT, uiCopy, type MenuId } from './navLabels';
import { menuById, visibleMenu, isActivePath, type NavSection, type Viewer } from './navTree';
import s from './nav.module.css';
import { EXIT, FADE, SPRING_OPEN, stagger } from './navMotion';

const EASE = [0.22, 1, 0.36, 1] as const;
const WIDTH: Record<2 | 3, number> = { 2: 760, 3: 1010 };

/**
 * Stack sections into columns so they balance: tallest first into the shortest
 * column, then keep the columns in reading order. A plain grid would leave a
 * hole beside a tall section (see Learn: 4 items next to 2).
 */
function stackColumns(sections: NavSection[], n: number): NavSection[][] {
  const cols = Array.from({ length: n }, () => ({ h: 0, list: [] as { sec: NavSection; i: number }[] }));
  const order = sections.map((sec, i) => ({ sec, i })).sort((a, b) => b.sec.items.length - a.sec.items.length || a.i - b.i);
  for (const e of order) {
    const col = cols.reduce((best, c) => (c.h < best.h ? c : best), cols[0]);
    col.list.push(e);
    col.h += e.sec.items.length + 1;
  }
  return cols
    .filter((c) => c.list.length > 0)
    .map((c) => c.list.sort((a, b) => a.i - b.i))
    .sort((a, b) => a[0].i - b[0].i)
    .map((list) => list.map((e) => e.sec));
}

export interface MegaPanelProps {
  open: boolean;
  menuId: MenuId;
  anchor: HTMLElement | null;
  lang: 'en' | 'vi';
  viewer: Viewer;
  pathname: string | null;
  focusFirstKey: number;
  panelRef: React.MutableRefObject<HTMLDivElement | null>;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  onNavigate: () => void;
  onBlur: (e: React.FocusEvent) => void;
}

function ZaloIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.03 2 11c0 2.62 1.25 4.98 3.24 6.63L4.5 21.5l4.02-1.94c1.08.29 2.24.44 3.48.44 5.52 0 10-4.03 10-9S17.52 2 12 2zM8.1 13.6H5.6v-.7l1.7-2.3H5.7v-.8h2.4v.7l-1.7 2.3h1.7v.8zm2.6 0h-.8v-.3c-.24.22-.55.36-.9.36-.8 0-1.36-.64-1.36-1.48s.56-1.48 1.36-1.48c.35 0 .66.13.9.35v-.28h.8v2.83zm1.6 0h-.85V9.8h.85v3.8zm2.1.06c-.84 0-1.5-.66-1.5-1.48s.66-1.48 1.5-1.48 1.5.66 1.5 1.48-.66 1.48-1.5 1.48zM9.05 11.43c-.42 0-.72.32-.72.75s.3.75.72.75.72-.32.72-.75-.3-.75-.72-.75zm5.35 0c-.42 0-.72.32-.72.75s.3.75.72.75.72-.32.72-.75-.3-.75-.72-.75z" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.07C24 5.45 18.63.07 12 .07S0 5.45 0 12.07c0 5.99 4.39 10.95 10.13 11.85v-8.38H7.08v-3.47h3.05V9.43c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.38C19.61 23.03 24 18.06 24 12.07z" />
    </svg>
  );
}

export default function MegaPanel(props: MegaPanelProps) {
  const { open, menuId, anchor, lang, viewer, pathname, focusFirstKey, panelRef } = props;
  const reduce = useReducedMotion();
  const t = uiCopy(lang);
  const menu = visibleMenu(menuById(menuId), viewer);
  const hue = MENU_HUE[menuId];

  // ── Geometry: centre under the trigger, clamped to the viewport ────────
  const [vw, setVw] = useState(() => (typeof window === 'undefined' ? 1440 : window.innerWidth));
  useEffect(() => {
    const on = () => setVw(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  const width = Math.min(WIDTH[menu.columns], vw - 32);
  const rect = anchor?.getBoundingClientRect();
  const centre = rect ? rect.left + rect.width / 2 : vw / 2;
  const left = Math.round(Math.max(16, Math.min(centre - width / 2, vw - width - 16)));
  // Grow from the trigger: the origin is the trigger's centre, in panel space.
  const originX = Math.round(Math.max(0, Math.min(width, centre - left)));

  // ── Height follows the content (measured, then animated) ───────────────
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | 'auto'>('auto');
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => setHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [menuId, open]);

  // Direction of travel when switching menus, for the content slide.
  const prevMenu = useRef(menuId);
  const dir = MENU_ORDER.indexOf(menuId) - MENU_ORDER.indexOf(prevMenu.current);
  useEffect(() => { prevMenu.current = menuId; }, [menuId]);

  // ── Spotlight that follows pointer / focus ─────────────────────────────
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [spot, setSpot] = useState<{ x: number; y: number; w: number; h: number; on: boolean }>({ x: 0, y: 0, w: 0, h: 0, on: false });
  const moveSpot = (el: HTMLElement) => {
    const box = gridRef.current?.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (!box) return;
    setSpot({ x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height, on: true });
  };
  useEffect(() => { setSpot((p) => ({ ...p, on: false })); }, [menuId]);

  // ── Keyboard: focus first item on request, arrows rove ─────────────────
  const consumed = useRef(0);
  useEffect(() => {
    if (!open || focusFirstKey === consumed.current) return;
    consumed.current = focusFirstKey;
    const id = window.requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>('[data-nav-item]')?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [open, focusFirstKey, menuId, panelRef]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('[data-nav-item]') ?? []);
    if (!items.length) return;
    e.preventDefault();
    const i = items.indexOf(document.activeElement as HTMLElement);
    let n = i;
    if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = items.length - 1;
    else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = i < 0 ? 0 : (i + 1) % items.length;
    else n = i <= 0 ? items.length - 1 : i - 1;
    items[n]?.focus();
  };

  const t0 = reduce ? { duration: 0 } : SPRING_OPEN;
  // Rows cascade only on the first open; switching menus slides the content instead.
  const firstOpen = useRef(true);
  useEffect(() => {
    if (!open) { firstOpen.current = true; return; }
    const id = window.setTimeout(() => { firstOpen.current = false; }, 450);
    return () => window.clearTimeout(id);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mega-scrim"
          className={`${s.scope} ${s.megaScrim}`}
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: reduce ? FADE : EXIT }}
          transition={reduce ? FADE : { duration: 0.24, ease: EASE }}
        />
      )}
      {open && (
        <div className={`${s.scope} ${s.panelWrap}`} key="mega">
          <motion.div
            ref={panelRef}
            id={`mega-${menuId}`}
            role="region"
            aria-label={MENU_LABEL[menuId][lang]}
            className={s.panel}
            style={{ ['--hue' as string]: hue, transformOrigin: `${originX}px 0px` }}
            initial={reduce ? { opacity: 0, x: left, width } : { opacity: 0, y: -12, scale: 0.94, x: left, width }}
            animate={{ opacity: 1, y: 0, scale: 1, x: left, width, height }}
            exit={reduce
              ? { opacity: 0, pointerEvents: 'none', transition: FADE }
              : { opacity: 0, y: -8, scale: 0.96, pointerEvents: 'none', transition: EXIT }}
            transition={{ ...t0, opacity: { duration: reduce ? 0.16 : 0.2 } }}
            onPointerEnter={props.onPointerEnter}
            onPointerLeave={(e) => { if (e.pointerType === 'mouse') props.onPointerLeave(); }}
            onKeyDown={onKeyDown}
            onBlur={props.onBlur}
          >
            <AnimatePresence initial={false} mode="popLayout" custom={dir}>
              <motion.div
                key={menuId}
                ref={contentRef}
                custom={dir}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir > 0 ? 24 : dir < 0 ? -24 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir > 0 ? -24 : 24 }}
                transition={{ duration: reduce ? 0 : 0.22, ease: EASE }}
                style={{ width: '100%' }}
              >
                <div className={s.panelBody}>
                  <div
                    ref={gridRef}
                    className={s.sections}
                    onPointerLeave={() => setSpot((p) => ({ ...p, on: false }))}
                  >
                    <span
                      className={s.spot}
                      aria-hidden
                      style={{ transform: `translate(${spot.x}px, ${spot.y}px)`, width: spot.w, height: spot.h, opacity: spot.on ? 1 : 0 }}
                    />
                    {(() => {
                      let n = 0;
                      const cascade = !reduce && firstOpen.current;
                      return stackColumns(menu.sections, menu.columns).map((col, ci) => (
                        <div key={ci} className={s.col}>
                          {col.map((sec) => (
                            <section key={sec.id} className={s.section} aria-labelledby={`mega-${menuId}-${sec.id}`}>
                              <motion.h3
                                id={`mega-${menuId}-${sec.id}`}
                                className={s.sectionHead}
                                initial={cascade ? { opacity: 0 } : false}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2, delay: stagger(n, 0.04) }}
                              >
                                {sec.heading[lang]}
                              </motion.h3>
                              <ul className={s.items}>
                                {sec.items.map((it) => {
                                  const i = n++;
                                  const Icon = it.icon;
                                  const active = isActivePath(pathname, it.href);
                                  return (
                                    <motion.li
                                      key={it.href}
                                      initial={cascade ? { opacity: 0, y: 10, scale: 0.98 } : reduce ? false : { opacity: 0 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      transition={cascade
                                        ? { type: 'spring', stiffness: 520, damping: 34, mass: 0.7, delay: stagger(i), opacity: { duration: 0.22, delay: stagger(i) } }
                                        : { duration: reduce ? 0 : 0.18, ease: EASE }}
                                    >
                                      <Link
                                        href={it.href}
                                        prefetch={false}
                                        className={s.item}
                                        data-nav-item
                                        aria-current={active ? 'page' : undefined}
                                        onPointerEnter={(e) => moveSpot(e.currentTarget)}
                                        onFocus={(e) => moveSpot(e.currentTarget)}
                                        onClick={props.onNavigate}
                                      >
                                        <span className={s.tile} aria-hidden><Icon /></span>
                                        <span className={s.itemText}>
                                          <span className={s.itemTitle}>{it.title[lang]}</span>
                                          <span className={s.itemDesc}>{it.desc[lang]}</span>
                                        </span>
                                      </Link>
                                    </motion.li>
                                  );
                                })}
                              </ul>
                            </section>
                          ))}
                        </div>
                      ));
                    })()}
                  </div>
                </div>
                <motion.div
                  className={s.panelFoot}
                  initial={!reduce && firstOpen.current ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: 0.16 }}
                >
                  <span className={s.footText}>
                    {menu.footer.text[lang]}{' '}
                    <Link href={menu.footer.cta.href} prefetch={false} className={s.footCta} onClick={props.onNavigate}>
                      {menu.footer.cta.label[lang]} <ArrowRight size={14} aria-hidden />
                    </Link>
                  </span>
                  <span className={s.footContacts}>
                    <a href={CONTACT.zalo} target="_blank" rel="noopener noreferrer" aria-label="Zalo" title="Zalo"><ZaloIcon /></a>
                    <a href={`tel:${CONTACT.phone}`} aria-label={lang === 'vi' ? 'Gọi điện' : 'Call'} title={CONTACT.phone}><Phone /></a>
                    <a href={`mailto:${CONTACT.email}`} aria-label="Email" title={CONTACT.email}><Mail /></a>
                    <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook"><FacebookIcon /></a>
                    <Link href="/about#contact" prefetch={false} className={s.footCta} style={{ marginLeft: 6, width: 'auto' }} onClick={props.onNavigate}>
                      {t.contactPage} <ChevronRight size={14} aria-hidden />
                    </Link>
                  </span>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
