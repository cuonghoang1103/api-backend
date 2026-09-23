'use client';

/**
 * CT Work — ngăn Trợ giúp bên phải (toàn màn hình trên điện thoại).
 *
 * Gắn MỘT lần ở layout (HelpPanelHost); nơi khác chỉ gọi openHelp(id) trong
 * store. Tự nghe phím ? (Shift+/) khi không gõ trong ô nhập. Nội dung song ngữ
 * nằm ở content.ts; ngôn ngữ + bài đọc gần nhất nhớ trong localStorage (bọc
 * try/catch: trình duyệt riêng tư có thể ném lỗi).
 */

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, BookOpen, ChevronRight, CircleHelp, ExternalLink, Lightbulb, Search, TriangleAlert, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { isTyping, WorkPortal } from '../ui';
import { useWorkPath } from '../WorkSidebar';
import {
  HELP_ARTICLES, HELP_BY_ID, HELP_CATEGORIES, HELP_ORDER, helpSnippet, searchHelp,
  type HelpArticle, type HelpBlock, type HelpLang, type HelpPageLink, type LText,
} from './content';
import { openContextualHelp, useHelp } from './store';

// ─── Lưu trữ cục bộ ──────────────────────────────────────────────

const LANG_KEY = 'ctwork-help:lang';
const LAST_KEY = 'ctwork-help:last';

export function readHelpLang(): HelpLang {
  try {
    return window.localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'vi';
  } catch {
    return 'vi';
  }
}
function save(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* trình duyệt chặn lưu trữ — bỏ qua */
  }
}
function readLast(): string | null {
  try {
    const v = window.localStorage.getItem(LAST_KEY);
    return v && HELP_BY_ID[v] ? v : null;
  } catch {
    return null;
  }
}

// Chữ của khung ngăn (không phải nội dung bài).
const UI: Record<string, LText> = {
  title: { en: 'Help & guide', vi: 'Hướng dẫn sử dụng' },
  search: { en: 'Search the guide…', vi: 'Tìm trong hướng dẫn…' },
  contents: { en: 'Contents', vi: 'Mục lục' },
  open: { en: 'Open this page', vi: 'Mở trang này' },
  related: { en: 'Related articles', vi: 'Bài liên quan' },
  prev: { en: 'Previous', vi: 'Bài trước' },
  next: { en: 'Next', vi: 'Bài sau' },
  none: { en: 'No articles match', vi: 'Không có bài nào khớp' },
  noneBody: { en: 'Try another word — searching works in English and Vietnamese, with or without accents.', vi: 'Thử từ khác — tìm được cả tiếng Anh lẫn tiếng Việt, có dấu hay không dấu đều được.' },
  results: { en: 'results', vi: 'kết quả' },
  welcome: { en: 'Everything you can do in CT Work, step by step.', vi: 'Mọi thứ bạn làm được trong CT Work, hướng dẫn từng bước.' },
  welcomeBody: {
    en: 'Pick a topic below, or search. Press ? anywhere to open this guide on the article for the page you are on.',
    vi: 'Chọn một chủ đề bên dưới, hoặc tìm kiếm. Nhấn ? ở bất cứ đâu để mở hướng dẫn đúng bài của trang đang xem.',
  },
  startHere: { en: 'Start here', vi: 'Bắt đầu từ đây' },
  close: { en: 'Close (Esc)', vi: 'Đóng (Esc)' },
  shortcut: { en: 'Press ? to open or close', vi: 'Nhấn ? để mở hoặc đóng' },
  uiNote: {
    en: 'Buttons in CT Work are in English — labels in quotes match the screen exactly.',
    vi: 'Nút trong CT Work ghi bằng tiếng Anh — nhãn trong ngoặc kép giống hệt trên màn hình.',
  },
};

// ─── Chữ có định dạng: **đậm** · {{mã}} · [[phím]] ───────────────

const TOKEN_RE = /(\*\*.+?\*\*|\{\{.+?\}\}|\[\[.+?\]\])/g;

function Rich({ text }: { text: string }) {
  const parts = text.split(TOKEN_RE);
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          return <strong key={i} className="font-semibold text-[var(--w-text)]">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('{{') && part.endsWith('}}') && part.length > 4) {
          return (
            <code key={i} className="break-words rounded-[4px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-1 py-[1px] font-mono text-[12.5px] text-[var(--w-text)]">
              {part.slice(2, -2)}
            </code>
          );
        }
        if (part.startsWith('[[') && part.endsWith(']]') && part.length > 4) {
          return <kbd key={i} className="w-kbd mx-[1px] align-[1px] !text-[var(--w-text-2)]">{part.slice(2, -2)}</kbd>;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

// ─── Khối nội dung ───────────────────────────────────────────────

function Cell({ text }: { text: string }) {
  if (text === '✓') return <span className="font-semibold text-[var(--w-green)]" aria-label="yes">✓</span>;
  if (text === '—') return <span className="text-[var(--w-text-3)]" aria-label="no">—</span>;
  return <Rich text={text} />;
}

function Block({ b, lang }: { b: HelpBlock; lang: HelpLang }) {
  switch (b.t) {
    case 'p':
      return <p className="my-3.5"><Rich text={b.text[lang]} /></p>;
    case 'h':
      return <h3 className="mb-2 mt-8 text-[16px] font-semibold leading-snug text-[var(--w-text)] first:mt-2">{b.text[lang]}</h3>;
    case 'steps':
      return (
        <ol className="my-4 space-y-2.5">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-[2px] flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[var(--w-accent-soft)] text-[12px] font-semibold tabular-nums text-[var(--w-accent-text)]">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1"><Rich text={it[lang]} /></span>
            </li>
          ))}
        </ol>
      );
    case 'list':
      return (
        <ul className="my-3.5 space-y-2">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="mt-[10px] h-[5px] w-[5px] shrink-0 rounded-full bg-[var(--w-text-3)]" aria-hidden />
              <span className="min-w-0 flex-1"><Rich text={it[lang]} /></span>
            </li>
          ))}
        </ul>
      );
    case 'tip':
    case 'warn': {
      const warn = b.t === 'warn';
      const tone = warn ? 'var(--w-orange)' : 'var(--w-accent)';
      return (
        <div
          className="my-5 flex gap-3 rounded-[8px] border px-3.5 py-3"
          style={{
            borderColor: `color-mix(in srgb, ${tone} 32%, transparent)`,
            background: `color-mix(in srgb, ${tone} 8%, transparent)`,
          }}
        >
          {warn
            ? <TriangleAlert size={16} className="mt-[3px] shrink-0 text-[var(--w-orange)]" aria-label={lang === 'vi' ? 'Lưu ý' : 'Note'} />
            : <Lightbulb size={16} className="mt-[3px] shrink-0 text-[var(--w-accent-text)]" aria-label={lang === 'vi' ? 'Mẹo' : 'Tip'} />}
          <div className="min-w-0 flex-1 text-[14px]"><Rich text={b.text[lang]} /></div>
        </div>
      );
    }
    case 'table':
      return (
        <div className="my-4 overflow-x-auto rounded-[8px] border border-[var(--w-border)]">
          <table className="w-full border-collapse text-left text-[13.5px] leading-[1.5]">
            <thead>
              <tr className="bg-[var(--w-sunken)]">
                {b.head.map((c, i) => (
                  <th key={i} className="whitespace-nowrap border-b border-[var(--w-border)] px-3 py-2 text-[12px] font-semibold text-[var(--w-text-2)]">{c[lang]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i} className="border-b border-[var(--w-border)] align-top last:border-b-0">
                  {r.map((c, j) => (
                    <td key={j} className={cn('px-3 py-2', j === 0 ? 'min-w-[120px] font-medium text-[var(--w-text)]' : 'min-w-[90px]', c[lang].length <= 2 && 'text-center')}>
                      <Cell text={c[lang]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'kbd':
      return (
        <div className="my-4 overflow-hidden rounded-[8px] border border-[var(--w-border)]">
          {b.items.map((it, i) => (
            <div key={i} className="flex items-center gap-3 border-b border-[var(--w-border)] px-3 py-2 last:border-b-0">
              <span className="flex w-[92px] shrink-0 flex-wrap items-center gap-1">
                {it.keys.map((k) => <kbd key={k} className="w-kbd !h-[22px] !min-w-[22px] !text-[12px] !text-[var(--w-text)]">{k}</kbd>)}
              </span>
              <span className="min-w-0 flex-1 text-[14px]">{it.label[lang]}</span>
            </div>
          ))}
        </div>
      );
    case 'code':
      return (
        <pre className="my-4 overflow-x-auto rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3.5 py-3 font-mono text-[12.5px] leading-[1.6] text-[var(--w-text)]">
          {b.text}
        </pre>
      );
  }
}

// ─── Link "Open this page" ───────────────────────────────────────

function usePageHref() {
  const { slug, key } = useWorkPath();
  return useCallback((l: HelpPageLink): string | null => {
    if (l.scope === 'global') return l.path;
    if (!slug) return null;
    if (l.scope === 'workspace') return l.path ? `/work/${slug}/${l.path}` : `/work/${slug}`;
    return key ? `/work/${slug}/${key}/${l.path}` : null;
  }, [slug, key]);
}

// ─── Các khung nhìn ──────────────────────────────────────────────

function ArticleLink({ a, lang, active, onOpen, compact }: { a: HelpArticle; lang: HelpLang; active?: boolean; onOpen: (id: string) => void; compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(a.id)}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'w-full rounded-[6px] text-left transition-colors',
        compact ? 'px-2 py-[5px] text-[13px] leading-snug' : 'px-2.5 py-2 text-[14px]',
        active ? 'bg-[var(--w-active)] font-medium text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text)]',
      )}
    >
      {a.title[lang]}
    </button>
  );
}

function Toc({ lang, current, onOpen }: { lang: HelpLang; current: string | null; onOpen: (id: string) => void }) {
  return (
    <nav aria-label={UI.contents[lang]} className="space-y-4">
      {HELP_CATEGORIES.map((c) => (
        <div key={c.id}>
          <div className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--w-text-3)]">{c.label[lang]}</div>
          <div className="space-y-px">
            {HELP_ARTICLES.filter((a) => a.category === c.id).map((a) => (
              <ArticleLink key={a.id} a={a} lang={lang} active={current === a.id} onOpen={onOpen} compact />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

function Home({ lang, onOpen }: { lang: HelpLang; onOpen: (id: string) => void }) {
  const featured = ['getting-started', 'student-guide'].map((id) => HELP_BY_ID[id]);
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-[9px] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]">
          <BookOpen size={18} />
        </span>
        <h2 className="text-[19px] font-semibold leading-tight text-[var(--w-text)]">{UI.welcome[lang]}</h2>
      </div>
      <p className="mt-3 text-[var(--w-text-2)]">{UI.welcomeBody[lang]}</p>

      <div className="mt-6 text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--w-text-3)]">{UI.startHere[lang]}</div>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {featured.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => onOpen(a.id)}
            className="group rounded-[8px] border border-[var(--w-border-strong)] bg-[var(--w-panel)] px-3.5 py-3 text-left transition-colors hover:border-[var(--w-accent-border)] hover:bg-[var(--w-accent-soft)]"
          >
            <div className="flex items-start justify-between gap-2 text-[14px] font-semibold leading-snug text-[var(--w-text)]">
              {a.title[lang]}
              <ArrowRight size={14} className="mt-[3px] shrink-0 text-[var(--w-text-3)] transition-transform group-hover:translate-x-0.5" />
            </div>
            <div className="mt-1 text-[13px] leading-[1.5] text-[var(--w-text-2)]">{a.summary[lang]}</div>
          </button>
        ))}
      </div>

      {HELP_CATEGORIES.filter((c) => c.id !== 'start').map((c) => (
        <section key={c.id} className="mt-7">
          <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--w-text-3)]">{c.label[lang]}</h3>
          <div className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
            {HELP_ARTICLES.filter((a) => a.category === c.id).map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => onOpen(a.id)}
                className="flex w-full items-center gap-3 border-b border-[var(--w-border)] px-3.5 py-2.5 text-left transition-colors last:border-b-0 hover:bg-[var(--w-hover)]"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-medium text-[var(--w-text)]">{a.title[lang]}</span>
                  <span className="mt-0.5 block text-[12.5px] leading-[1.45] text-[var(--w-text-2)]">{a.summary[lang]}</span>
                </span>
                <ChevronRight size={15} className="shrink-0 text-[var(--w-text-3)]" />
              </button>
            ))}
          </div>
        </section>
      ))}
      <p className="mt-6 text-[12.5px] text-[var(--w-text-3)]">{UI.uiNote[lang]}</p>
    </div>
  );
}

function Results({ lang, query, results, onOpen }: { lang: HelpLang; query: string; results: HelpArticle[]; onOpen: (id: string) => void }) {
  if (!results.length) {
    return (
      <div className="px-2 py-14 text-center">
        <Search size={22} className="mx-auto text-[var(--w-text-3)]" />
        <div className="mt-3 text-[15px] font-semibold">{UI.none[lang]}</div>
        <p className="mx-auto mt-1 max-w-[360px] text-[13.5px] text-[var(--w-text-2)]">{UI.noneBody[lang]}</p>
      </div>
    );
  }
  return (
    <div>
      <div className="mb-2 text-[12px] text-[var(--w-text-3)]">{results.length} {UI.results[lang]}</div>
      <div className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
        {results.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => onOpen(a.id)}
            className="block w-full border-b border-[var(--w-border)] px-3.5 py-3 text-left transition-colors last:border-b-0 hover:bg-[var(--w-hover)]"
          >
            <span className="block text-[11px] font-medium uppercase tracking-[0.04em] text-[var(--w-text-3)]">
              {HELP_CATEGORIES.find((c) => c.id === a.category)?.label[lang]}
            </span>
            <span className="mt-0.5 block text-[14.5px] font-semibold text-[var(--w-text)]">{a.title[lang]}</span>
            <span className="mt-1 block text-[13px] leading-[1.5] text-[var(--w-text-2)]">{helpSnippet(a, query, lang)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ArticleView({ a, lang, onOpen, onNavigate }: { a: HelpArticle; lang: HelpLang; onOpen: (id: string) => void; onNavigate: () => void }) {
  const hrefOf = usePageHref();
  const links = (a.pages ?? []).map((l) => ({ l, href: hrefOf(l) })).filter((x): x is { l: HelpPageLink; href: string } => !!x.href);
  const idx = HELP_ORDER.indexOf(a.id);
  const prev = idx > 0 ? HELP_BY_ID[HELP_ORDER[idx - 1]] : null;
  const next = idx >= 0 && idx < HELP_ORDER.length - 1 ? HELP_BY_ID[HELP_ORDER[idx + 1]] : null;
  const related = a.related.map((id) => HELP_BY_ID[id]).filter(Boolean);

  return (
    <article>
      <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--w-accent-text)]">
        {HELP_CATEGORIES.find((c) => c.id === a.category)?.label[lang]}
      </div>
      <h2 className="mt-1.5 text-[21px] font-semibold leading-[1.3] text-[var(--w-text)]">{a.title[lang]}</h2>
      <p className="mt-2 text-[15px] text-[var(--w-text-2)]">{a.summary[lang]}</p>

      {links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {links.map(({ l, href }) => (
            <Link key={href} href={href} onClick={onNavigate} className="w-btn w-btn-sm" title={UI.open[lang]}>
              <ExternalLink size={12} className="text-[var(--w-accent-text)]" />
              <span className="text-[var(--w-text-3)]">{UI.open[lang]}:</span> {l.label[lang]}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-5 border-t border-[var(--w-border)] pt-2">
        {a.blocks.map((b, i) => <Block key={i} b={b} lang={lang} />)}
      </div>

      {related.length > 0 && (
        <section className="mt-9 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-3">
          <h3 className="mb-1.5 px-1 text-[12px] font-semibold uppercase tracking-[0.05em] text-[var(--w-text-3)]">{UI.related[lang]}</h3>
          <div className="space-y-px">
            {related.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onOpen(r.id)}
                className="flex w-full items-center gap-2 rounded-[6px] px-1.5 py-1.5 text-left text-[14px] text-[var(--w-accent-text)] hover:bg-[var(--w-hover)]"
              >
                <ChevronRight size={14} className="shrink-0" />
                <span className="min-w-0 flex-1">{r.title[lang]}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="mt-6 grid grid-cols-2 gap-2 border-t border-[var(--w-border)] pt-4">
        {prev ? (
          <button type="button" onClick={() => onOpen(prev.id)} className="min-w-0 rounded-[8px] px-2 py-2 text-left hover:bg-[var(--w-hover)]">
            <span className="flex items-center gap-1 text-[12px] text-[var(--w-text-3)]"><ArrowLeft size={12} /> {UI.prev[lang]}</span>
            <span className="mt-0.5 block text-[13.5px] font-medium leading-snug text-[var(--w-text)]">{prev.title[lang]}</span>
          </button>
        ) : <span />}
        {next ? (
          <button type="button" onClick={() => onOpen(next.id)} className="min-w-0 rounded-[8px] px-2 py-2 text-right hover:bg-[var(--w-hover)]">
            <span className="flex items-center justify-end gap-1 text-[12px] text-[var(--w-text-3)]">{UI.next[lang]} <ArrowRight size={12} /></span>
            <span className="mt-0.5 block text-[13.5px] font-medium leading-snug text-[var(--w-text)]">{next.title[lang]}</span>
          </button>
        ) : <span />}
      </div>
    </article>
  );
}

// ─── Ngăn ────────────────────────────────────────────────────────

function LangToggle({ lang, onChange }: { lang: HelpLang; onChange: (l: HelpLang) => void }) {
  return (
    <div className="flex h-[28px] shrink-0 rounded-[6px] border border-[var(--w-border-strong)] p-0.5" role="group" aria-label="Language / Ngôn ngữ">
      {([['vi', 'Tiếng Việt'], ['en', 'English']] as const).map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          aria-pressed={lang === id}
          lang={id}
          className={cn(
            'rounded-[4px] px-2 text-[12px] font-medium transition-colors',
            lang === id ? 'bg-[var(--w-active)] text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function HelpPanel({ requested, nonce, onClose }: { requested: string | null; nonce: number; onClose: () => void }) {
  // Ngăn chỉ gắn phía trình duyệt (sau thao tác của người dùng) ⇒ đọc localStorage ngay được.
  const [lang, setLangState] = useState<HelpLang>(readHelpLang);
  const [current, setCurrent] = useState<string | null>(() => (requested && HELP_BY_ID[requested] ? requested : readLast()));
  const [query, setQuery] = useState('');
  const mainRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Mỗi lần openHelp(): đi tới bài được yêu cầu, không có thì bài đọc lần trước.
  useEffect(() => {
    const id = requested && HELP_BY_ID[requested] ? requested : readLast();
    setCurrent(id);
    setQuery('');
  }, [requested, nonce]);

  useEffect(() => {
    if (current) save(LAST_KEY, current);
    mainRef.current?.scrollTo({ top: 0 });
  }, [current]);

  const setLang = (l: HelpLang) => {
    setLangState(l);
    save(LANG_KEY, l);
  };

  // Focus vào ngăn (không vào ô tìm — trên điện thoại sẽ bật bàn phím), trả focus khi đóng.
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    panelRef.current?.focus({ preventScroll: true });
    return () => prev?.focus?.({ preventScroll: true });
  }, []);

  // Esc: đang có chữ trong ô tìm thì xoá chữ trước, không thì đóng ngăn.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      e.preventDefault();
      if (query && e.target === searchRef.current) setQuery('');
      else onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [query, onClose]);

  const open = (id: string) => {
    setCurrent(id);
    setQuery('');
  };
  const results = useMemo(() => (query.trim() ? searchHelp(query) : []), [query]);
  const article = current ? HELP_BY_ID[current] : null;

  let body: ReactNode;
  if (query.trim()) body = <Results lang={lang} query={query} results={results} onOpen={open} />;
  else if (article) body = <ArticleView a={article} lang={lang} onOpen={open} onNavigate={onClose} />;
  else body = <Home lang={lang} onOpen={open} />;

  return (
    <WorkPortal>
      <div className="fixed inset-0 z-[75] bg-black/30" onMouseDown={onClose} aria-hidden />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={UI.title[lang]}
        lang={lang}
        data-help-panel=""
        className="fixed inset-y-0 right-0 z-[76] flex w-full flex-col bg-[var(--w-panel)] text-[var(--w-text)] outline-none sm:w-[min(900px,94vw)] sm:border-l sm:border-[var(--w-border)]"
        style={{ boxShadow: 'var(--w-shadow-pop)' }}
      >
        {/* Đầu ngăn */}
        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-[var(--w-border)] px-3 sm:px-4">
          {(article || query) ? (
            <button
              type="button"
              className="w-btn w-btn-ghost w-btn-sm md:!hidden"
              onClick={() => { setQuery(''); setCurrent(null); }}
            >
              <ArrowLeft size={14} /> {UI.contents[lang]}
            </button>
          ) : (
            <span className="flex min-w-0 items-center gap-2 md:!hidden">
              <CircleHelp size={16} className="shrink-0 text-[var(--w-accent-text)]" />
              <span className="truncate text-[14px] font-semibold">{UI.title[lang]}</span>
            </span>
          )}
          <button
            type="button"
            onClick={() => { setQuery(''); setCurrent(null); }}
            className="hidden min-w-0 items-center gap-2 rounded-[6px] px-1 py-0.5 hover:bg-[var(--w-hover)] md:flex"
            title={UI.contents[lang]}
          >
            <CircleHelp size={16} className="shrink-0 text-[var(--w-accent-text)]" />
            <span className="truncate text-[14px] font-semibold">{UI.title[lang]}</span>
          </button>
          <div className="ml-auto flex items-center gap-1.5">
            <LangToggle lang={lang} onChange={setLang} />
            <button type="button" onClick={onClose} className="w-btn w-btn-ghost w-btn-icon" aria-label={UI.close[lang]} title={UI.close[lang]}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Ô tìm */}
        <div className="shrink-0 border-b border-[var(--w-border)] px-3 py-2.5 sm:px-4">
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && results[0]) { e.preventDefault(); open(results[0].id); }
              }}
              placeholder={UI.search[lang]}
              aria-label={UI.search[lang]}
              className="w-input h-[36px] pl-8 !text-[14px]"
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          {/* Mục lục bên trái (màn rộng) */}
          <aside className="hidden w-[248px] shrink-0 overflow-y-auto overscroll-contain border-r border-[var(--w-border)] bg-[var(--w-bg)] px-2 py-4 md:block">
            <Toc lang={lang} current={query ? null : current} onOpen={open} />
            <div className="mt-6 flex items-center gap-1.5 px-2 text-[11.5px] text-[var(--w-text-3)]">
              <kbd className="w-kbd">?</kbd> {UI.shortcut[lang]}
            </div>
          </aside>

          {/* Nội dung */}
          <div ref={mainRef} className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
            <div className="mx-auto max-w-[640px] px-4 pb-16 pt-5 text-[14.5px] leading-[1.65] text-[var(--w-text-2)] sm:px-7 sm:pt-6">
              {body}
            </div>
          </div>
        </div>
      </div>
    </WorkPortal>
  );
}

// ─── Host: gắn một lần ở layout ──────────────────────────────────

export default function HelpPanelHost() {
  const open = useHelp((s) => s.open);
  const articleId = useHelp((s) => s.articleId);
  const nonce = useHelp((s) => s.nonce);
  const closeHelp = useHelp((s) => s.closeHelp);

  // Phím ? (Shift+/) — mở bài của trang đang xem; đang mở thì đóng.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '?' || e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      if (isTyping(e.target)) return;
      const st = useHelp.getState();
      if (st.open) {
        e.preventDefault();
        st.closeHelp();
        return;
      }
      // Đang có hộp thoại / ngăn khác (tạo issue, bảng lệnh, chạy test…) ⇒ nhường.
      if (document.querySelector('[role="dialog"]')) return;
      e.preventDefault();
      openContextualHelp();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  if (!open) return null;
  return <HelpPanel requested={articleId} nonce={nonce} onClose={closeHelp} />;
}
