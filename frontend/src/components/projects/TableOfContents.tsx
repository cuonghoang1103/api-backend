'use client';

import { useEffect, useState, useCallback } from 'react';
import { List, X } from 'lucide-react';

interface TableOfContentsProps {
 /** CSS selector for the body whose headings to enumerate. */
 contentSelector: string;
 /** Offset (in px) used for scroll-margin-top calculation. */
 headingOffset?: number;
}

interface TocItem {
 id: string;
 text: string;
 level: number;
}

/**
 * Vietnamese-aware slugifier — converts heading text into
 * the same id we (or rehype-slug) would assign. We do this
 * client-side so the TOC works even if the backend hasn't
 * generated ids.
 */
function slugify(s: string): string {
 return s
 .toLowerCase()
 .normalize('NFD')
 .replace(/[\u0300-\u036f]/g, '') // strip diacritics
 .replace(/đ/g, 'd')
 .replace(/[^a-z0-9]+/g, '-')
 .replace(/^-+|-+$/g, '')
 .slice(0, 80);
}

/**
 * TableOfContents — sticky sidebar on desktop, floating
 * button + drawer on mobile. Reads the headings from the
 * target element, normalises text into slugs (so it can
 * also work without rehype-slug), and watches scroll to
 * highlight the active section.
 */
export default function TableOfContents({
 contentSelector,
 headingOffset = 120,
}: TableOfContentsProps) {
 const [items, setItems] = useState<TocItem[]>([]);
 const [activeId, setActiveId] = useState<string>('');
 const [mobileOpen, setMobileOpen] = useState(false);

 // Enumerate headings from the body. We re-run this with
 // a MutationObserver because the body may not have
 // rendered when this component mounts (e.g. when the
 // API call completes async).
 useEffect(() => {
 const collect = () => {
 const root = document.querySelector(contentSelector);
 if (!root) return;
 const headings = root.querySelectorAll('h1, h2, h3, h4');
 const next: TocItem[] = [];
 headings.forEach((h) => {
 const el = h as HTMLElement;
 let id = el.id;
 if (!id) {
 id = slugify(el.textContent || '');
 el.id = id;
 }
 if (el.textContent) {
 next.push({ id, text: el.textContent, level: parseInt(el.tagName.substring(1), 10) });
 }
 });
 setItems(next);
 };

 const t = setTimeout(collect, 100); // let body paint first
 const root = document.querySelector(contentSelector);
 const observer = root
 ? new MutationObserver(collect)
 : null;
 if (root && observer) {
 observer.observe(root, { childList: true, subtree: true });
 }
 return () => {
 clearTimeout(t);
 observer?.disconnect();
 };
 }, [contentSelector]);

 // Track which heading is currently in view.
 useEffect(() => {
 if (items.length === 0) return;
 const root = document.querySelector(contentSelector);
 if (!root) return;

 const onScroll = () => {
 let current = items[0]?.id ?? '';
 const scrollY = window.scrollY + headingOffset + 4;
 for (const it of items) {
 const el = document.getElementById(it.id);
 if (!el) continue;
 const top = el.getBoundingClientRect().top + window.scrollY;
 if (top <= scrollY) current = it.id;
 else break;
 }
 setActiveId(current);
 };
 onScroll();
 window.addEventListener('scroll', onScroll, { passive: true });
 return () => window.removeEventListener('scroll', onScroll);
 }, [items, contentSelector, headingOffset]);

 const onJump = useCallback((e: React.MouseEvent, id: string) => {
 e.preventDefault();
 const el = document.getElementById(id);
 if (!el) return;
 const y = el.getBoundingClientRect().top + window.scrollY - headingOffset;
 window.scrollTo({ top: y, behavior: 'smooth' });
 setMobileOpen(false);
 }, [headingOffset]);

 if (items.length === 0) return null;

 const list = (
 <nav aria-label="Table of contents">
 <ul className="space-y-1 text-sm">
 {items.map((it) => {
 const isActive = it.id === activeId;
 return (
 <li key={it.id}>
 <a
 href={`#${it.id}`}
 onClick={(e) => onJump(e, it.id)}
 className={`block py-1.5 pr-2 transition-all border-l-2 leading-snug ${
 isActive
 ? 'border-neon-violet text-neon-violet font-medium bg-neon-violet/5'
 : 'border-transparent text-text-muted hover:text-text-primary hover:border-neon-violet/30'
 }`}
 style={{ paddingLeft: `${(it.level - 1) * 12 + 12}px` }}
 >
 {it.text}
 </a>
 </li>
 );
 })}
 </ul>
 </nav>
 );

 return (
 <>
 {/* Desktop: sticky sidebar (lg+ only) */}
 <aside className="hidden lg:block">
 <div className="sticky" style={{ top: `${headingOffset}px` }}>
 <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-text-muted mb-3">
 <List className="w-3.5 h-3.5" />
 Mục lục
 </div>
 {list}
 </div>
 </aside>

 {/* Mobile: floating button (only when there are items) */}
 <button
 onClick={() => setMobileOpen(true)}
 aria-label="Open table of contents"
 className="lg:hidden fixed bottom-6 right-6 z-30 w-12 h-12 rounded-full bg-gradient-to-r from-neon-indigo to-neon-violet text-white shadow-lg flex items-center justify-center"
 style={{ boxShadow: '0 8px 30px rgba(168,85,247,0.4)' }}
 >
 <List className="w-5 h-5" />
 </button>

 {/* Mobile: drawer */}
 {mobileOpen && (
 <div
 className="lg:hidden fixed inset-0 z-50 flex items-end"
 style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
 onClick={() => setMobileOpen(false)}
 >
 <div
 className="w-full max-h-[70vh] overflow-y-auto bg-darkcard border-t border-darkborder rounded-t-3xl p-6"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
 <List className="w-4 h-4 text-neon-violet" />
 Mục lục
 </div>
 <button onClick={() => setMobileOpen(false)} aria-label="Close">
 <X className="w-5 h-5 text-text-muted" />
 </button>
 </div>
 {list}
 </div>
 </div>
 )}
 </>
 );
}