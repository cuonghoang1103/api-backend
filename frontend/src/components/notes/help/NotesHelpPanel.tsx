'use client';

/**
 * Notes (Sổ tay) — ngăn Trợ giúp bên phải (toàn màn hình trên điện thoại).
 *
 * Dựng song song với ngăn Trợ giúp của CT Work (components/work/help/HelpPanel.tsx)
 * nhưng RIÊNG cho Sổ tay: không chạm vào module kia. Khác biệt chính:
 *  • Notes KHÔNG có hệ i18n như CT Work ⇒ ngăn tự giữ ngôn ngữ (vi mặc định,
 *    có nút đổi sang en), nhớ trong localStorage.
 *  • Notes dùng Tailwind `dark:` + biến `--notes-*`; ngăn vẽ TRONG cây (không
 *    dùng portal ra body) để class `dark` của NotesThemeProvider còn tác dụng.
 *  • Tab "Hỏi AI" dùng lại endpoint có sẵn: notesApi.aiHoi (trợ lý Sổ tay).
 *
 * Gắn MỘT lần trong layout Notes (NotesHelpPanelHost); nơi khác chỉ gọi
 * openNotesHelp(id) ở store. Phím ? (Shift+/) mở/đóng khi không gõ trong editor.
 */

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ArrowLeft, ArrowRight, BookOpen, ChevronRight, CircleHelp, Lightbulb, Loader2, Search, Send, Sparkles, TriangleAlert, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { notesApi } from '@/lib/api';
import {
  HELP_ARTICLES, HELP_BY_ID, HELP_CATEGORIES, HELP_ORDER, helpSnippet, searchHelp,
  type HelpArticle, type HelpBlock, type HelpLang, type LText,
} from './content';
import { useNotesHelp } from './store';

// ─── Lưu trữ cục bộ ──────────────────────────────────────────────

const LANG_KEY = 'notes-help:lang';
const LAST_KEY = 'notes-help:last';

function readLang(): HelpLang {
  try {
    const v = window.localStorage.getItem(LANG_KEY);
    if (v === 'en' || v === 'vi') return v;
  } catch {
    /* trình duyệt chặn lưu trữ — bỏ qua */
  }
  return 'vi'; // Sổ tay là giao diện tiếng Việt ⇒ mặc định Việt.
}
function save(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* bỏ qua */
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

/** Đang gõ ở ô nhập / editor ⇒ phím ? là ký tự, không phải lệnh mở Trợ giúp. */
function isTyping(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null;
  if (!el || !el.tagName) return false;
  const tag = el.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
}

// Chữ của khung ngăn (không phải nội dung bài).
const UI: Record<string, LText> = {
  title: { en: 'Help & guide', vi: 'Hướng dẫn Sổ tay' },
  search: { en: 'Search the guide…', vi: 'Tìm trong hướng dẫn…' },
  contents: { en: 'Contents', vi: 'Mục lục' },
  related: { en: 'Related articles', vi: 'Bài liên quan' },
  prev: { en: 'Previous', vi: 'Bài trước' },
  next: { en: 'Next', vi: 'Bài sau' },
  none: { en: 'No articles match', vi: 'Không có bài nào khớp' },
  noneBody: { en: 'Try another word — searching works in English and Vietnamese, with or without accents.', vi: 'Thử từ khác — tìm được cả tiếng Anh lẫn tiếng Việt, có dấu hay không dấu đều được.' },
  results: { en: 'results', vi: 'kết quả' },
  welcome: { en: 'Everything you can do in Notes, step by step.', vi: 'Mọi thứ bạn làm được trong Sổ tay, hướng dẫn từng bước.' },
  welcomeBody: {
    en: 'Pick a topic below, or search. Press ? anywhere in Notes to open this guide.',
    vi: 'Chọn một chủ đề bên dưới, hoặc tìm kiếm. Nhấn ? ở bất cứ đâu trong Sổ tay để mở hướng dẫn này.',
  },
  startHere: { en: 'Start here', vi: 'Bắt đầu từ đây' },
  close: { en: 'Close (Esc)', vi: 'Đóng (Esc)' },
  shortcut: { en: 'Press ? to open or close', vi: 'Nhấn ? để mở hoặc đóng' },
  askTab: { en: 'Ask AI', vi: 'Hỏi AI' },
  askTitle: { en: 'Ask about your notes', vi: 'Hỏi về ghi chú của bạn' },
  askIntro: {
    en: 'Ask a question and the assistant searches all your notes, answers from them, and cites the notes it used.',
    vi: 'Đặt câu hỏi, trợ lý tìm khắp ghi chú của bạn, trả lời dựa trên đó và dẫn rõ ghi chú đã dùng.',
  },
  askPlaceholder: { en: 'e.g. What did I note about Prisma migrations?', vi: 'vd: Tôi ghi gì về migration Prisma?' },
  askSend: { en: 'Ask', vi: 'Hỏi' },
  askThinking: { en: 'Thinking…', vi: 'Đang trả lời…' },
  askError: { en: 'Could not get an answer. Please try again.', vi: 'Không lấy được câu trả lời. Vui lòng thử lại.' },
  askSources: { en: 'From these notes', vi: 'Lấy từ các ghi chú' },
  askDisclaimer: {
    en: 'The assistant answers only from your own notes and cites them. It does not guess beyond what you wrote.',
    vi: 'Trợ lý chỉ trả lời dựa trên ghi chú của bạn và dẫn nguồn. Nó không đoán ngoài những gì bạn đã viết.',
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
          return <strong key={i} className="font-semibold text-slate-900 dark:text-slate-100">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('{{') && part.endsWith('}}') && part.length > 4) {
          return (
            <code key={i} className="break-words rounded border border-slate-200 bg-slate-100 px-1 py-[1px] font-mono text-[12.5px] text-slate-800 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200">
              {part.slice(2, -2)}
            </code>
          );
        }
        if (part.startsWith('[[') && part.endsWith(']]') && part.length > 4) {
          return (
            <kbd key={i} className="mx-[1px] inline-flex min-w-[20px] items-center justify-center rounded border border-slate-300 bg-white px-1 text-[11px] font-medium text-slate-600 shadow-sm dark:border-white/15 dark:bg-white/[0.06] dark:text-slate-300">
              {part.slice(2, -2)}
            </kbd>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

// ─── Khối nội dung ───────────────────────────────────────────────

function Cell({ text }: { text: string }) {
  if (text === '✓') return <span className="font-semibold text-teal-600 dark:text-teal-400" aria-label="yes">✓</span>;
  if (text === '—') return <span className="text-slate-400" aria-label="no">—</span>;
  return <Rich text={text} />;
}

function Block({ b, lang }: { b: HelpBlock; lang: HelpLang }) {
  switch (b.t) {
    case 'p':
      return <p className="my-3.5"><Rich text={b.text[lang]} /></p>;
    case 'h':
      return <h3 className="mb-2 mt-8 text-[16px] font-semibold leading-snug text-slate-900 first:mt-2 dark:text-slate-100">{b.text[lang]}</h3>;
    case 'steps':
      return (
        <ol className="my-4 space-y-2.5">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-[2px] flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-[12px] font-semibold tabular-nums text-teal-700 dark:text-teal-300">
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
              <span className="mt-[10px] h-[5px] w-[5px] shrink-0 rounded-full bg-slate-400" aria-hidden />
              <span className="min-w-0 flex-1"><Rich text={it[lang]} /></span>
            </li>
          ))}
        </ul>
      );
    case 'tip':
    case 'warn': {
      const warnBox = b.t === 'warn';
      return (
        <div
          className={cn(
            'my-5 flex gap-3 rounded-lg border px-3.5 py-3',
            warnBox
              ? 'border-amber-400/40 bg-amber-400/10'
              : 'border-teal-500/30 bg-teal-500/[0.08]',
          )}
        >
          {warnBox
            ? <TriangleAlert size={16} className="mt-[3px] shrink-0 text-amber-500" aria-label={lang === 'vi' ? 'Lưu ý' : 'Note'} />
            : <Lightbulb size={16} className="mt-[3px] shrink-0 text-teal-600 dark:text-teal-400" aria-label={lang === 'vi' ? 'Mẹo' : 'Tip'} />}
          <div className="min-w-0 flex-1 text-[14px]"><Rich text={b.text[lang]} /></div>
        </div>
      );
    }
    case 'table':
      return (
        <div className="my-4 overflow-x-auto rounded-lg border border-slate-200 dark:border-white/10">
          <table className="w-full border-collapse text-left text-[13.5px] leading-[1.5]">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/[0.04]">
                {b.head.map((c, i) => (
                  <th key={i} className="whitespace-nowrap border-b border-slate-200 px-3 py-2 text-[12px] font-semibold text-slate-600 dark:border-white/10 dark:text-slate-300">{c[lang]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i} className="border-b border-slate-200 align-top last:border-b-0 dark:border-white/10">
                  {r.map((c, j) => (
                    <td key={j} className={cn('px-3 py-2', j === 0 ? 'min-w-[120px] font-medium text-slate-800 dark:text-slate-200' : 'min-w-[90px]', c[lang].length <= 2 && 'text-center')}>
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
        <div className="my-4 overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
          {b.items.map((it, i) => (
            <div key={i} className="flex items-center gap-3 border-b border-slate-200 px-3 py-2 last:border-b-0 dark:border-white/10">
              <span className="flex w-[92px] shrink-0 flex-wrap items-center gap-1">
                {it.keys.map((k) => (
                  <kbd key={k} className="inline-flex h-[22px] min-w-[22px] items-center justify-center rounded border border-slate-300 bg-white px-1 text-[12px] font-medium text-slate-700 shadow-sm dark:border-white/15 dark:bg-white/[0.06] dark:text-slate-200">{k}</kbd>
                ))}
              </span>
              <span className="min-w-0 flex-1 text-[14px]">{it.label[lang]}</span>
            </div>
          ))}
        </div>
      );
    case 'code':
      return (
        <pre className="my-4 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 font-mono text-[12.5px] leading-[1.6] text-slate-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200">
          {b.text}
        </pre>
      );
  }
}

// ─── Các khung nhìn ──────────────────────────────────────────────

function ArticleLink({ a, lang, active, onOpen }: { a: HelpArticle; lang: HelpLang; active?: boolean; onOpen: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(a.id)}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'w-full rounded-md px-2 py-[5px] text-left text-[13px] leading-snug transition-colors',
        active
          ? 'bg-teal-500/15 font-medium text-slate-900 dark:text-slate-100'
          : 'text-slate-600 hover:bg-black/[0.04] hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.05] dark:hover:text-slate-100',
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
          <div className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-400">{c.label[lang]}</div>
          <div className="space-y-px">
            {HELP_ARTICLES.filter((a) => a.category === c.id).map((a) => (
              <ArticleLink key={a.id} a={a} lang={lang} active={current === a.id} onOpen={onOpen} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

function Home({ lang, onOpen }: { lang: HelpLang; onOpen: (id: string) => void }) {
  const featured = ['getting-started', 'editor-slash'].map((id) => HELP_BY_ID[id]).filter(Boolean);
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-[9px] bg-teal-500/15 text-teal-600 dark:text-teal-400">
          <BookOpen size={18} />
        </span>
        <h2 className="text-[19px] font-semibold leading-tight text-slate-900 dark:text-slate-100">{UI.welcome[lang]}</h2>
      </div>
      <p className="mt-3 text-slate-600 dark:text-slate-300">{UI.welcomeBody[lang]}</p>

      <div className="mt-6 text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-400">{UI.startHere[lang]}</div>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {featured.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => onOpen(a.id)}
            className="group rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-left transition-colors hover:border-teal-500/50 hover:bg-teal-500/[0.06] dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-teal-400/40"
          >
            <div className="flex items-start justify-between gap-2 text-[14px] font-semibold leading-snug text-slate-900 dark:text-slate-100">
              {a.title[lang]}
              <ArrowRight size={14} className="mt-[3px] shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
            </div>
            <div className="mt-1 text-[13px] leading-[1.5] text-slate-600 dark:text-slate-400">{a.summary[lang]}</div>
          </button>
        ))}
      </div>

      {HELP_CATEGORIES.map((c) => (
        <section key={c.id} className="mt-7">
          <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-400">{c.label[lang]}</h3>
          <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
            {HELP_ARTICLES.filter((a) => a.category === c.id).map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => onOpen(a.id)}
                className="flex w-full items-center gap-3 border-b border-slate-200 px-3.5 py-2.5 text-left transition-colors last:border-b-0 hover:bg-black/[0.03] dark:border-white/10 dark:hover:bg-white/[0.04]"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-medium text-slate-900 dark:text-slate-100">{a.title[lang]}</span>
                  <span className="mt-0.5 block text-[12.5px] leading-[1.45] text-slate-600 dark:text-slate-400">{a.summary[lang]}</span>
                </span>
                <ChevronRight size={15} className="shrink-0 text-slate-400" />
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function Results({ lang, query, results, onOpen }: { lang: HelpLang; query: string; results: HelpArticle[]; onOpen: (id: string) => void }) {
  if (!results.length) {
    return (
      <div className="px-2 py-14 text-center">
        <Search size={22} className="mx-auto text-slate-400" />
        <div className="mt-3 text-[15px] font-semibold text-slate-800 dark:text-slate-100">{UI.none[lang]}</div>
        <p className="mx-auto mt-1 max-w-[360px] text-[13.5px] text-slate-600 dark:text-slate-400">{UI.noneBody[lang]}</p>
      </div>
    );
  }
  return (
    <div>
      <div className="mb-2 text-[12px] text-slate-400">{results.length} {UI.results[lang]}</div>
      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
        {results.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => onOpen(a.id)}
            className="block w-full border-b border-slate-200 px-3.5 py-3 text-left transition-colors last:border-b-0 hover:bg-black/[0.03] dark:border-white/10 dark:hover:bg-white/[0.04]"
          >
            <span className="block text-[11px] font-medium uppercase tracking-[0.04em] text-slate-400">
              {HELP_CATEGORIES.find((c) => c.id === a.category)?.label[lang]}
            </span>
            <span className="mt-0.5 block text-[14.5px] font-semibold text-slate-900 dark:text-slate-100">{a.title[lang]}</span>
            <span className="mt-1 block text-[13px] leading-[1.5] text-slate-600 dark:text-slate-400">{helpSnippet(a, query, lang)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ArticleView({ a, lang, onOpen }: { a: HelpArticle; lang: HelpLang; onOpen: (id: string) => void }) {
  const idx = HELP_ORDER.indexOf(a.id);
  const prev = idx > 0 ? HELP_BY_ID[HELP_ORDER[idx - 1]] : null;
  const next = idx >= 0 && idx < HELP_ORDER.length - 1 ? HELP_BY_ID[HELP_ORDER[idx + 1]] : null;
  const related = a.related.map((id) => HELP_BY_ID[id]).filter(Boolean);

  return (
    <article>
      <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-teal-600 dark:text-teal-400">
        {HELP_CATEGORIES.find((c) => c.id === a.category)?.label[lang]}
      </div>
      <h2 className="mt-1.5 text-[21px] font-semibold leading-[1.3] text-slate-900 dark:text-slate-100">{a.title[lang]}</h2>
      <p className="mt-2 text-[15px] text-slate-600 dark:text-slate-300">{a.summary[lang]}</p>

      <div className="mt-5 border-t border-slate-200 pt-2 dark:border-white/10">
        {a.blocks.map((b, i) => <Block key={i} b={b} lang={lang} />)}
      </div>

      {related.length > 0 && (
        <section className="mt-9 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 dark:border-white/10 dark:bg-white/[0.03]">
          <h3 className="mb-1.5 px-1 text-[12px] font-semibold uppercase tracking-[0.05em] text-slate-400">{UI.related[lang]}</h3>
          <div className="space-y-px">
            {related.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onOpen(r.id)}
                className="flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-left text-[14px] text-teal-700 hover:bg-black/[0.03] dark:text-teal-300 dark:hover:bg-white/[0.04]"
              >
                <ChevronRight size={14} className="shrink-0" />
                <span className="min-w-0 flex-1">{r.title[lang]}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="mt-6 grid grid-cols-2 gap-2 border-t border-slate-200 pt-4 dark:border-white/10">
        {prev ? (
          <button type="button" onClick={() => onOpen(prev.id)} className="min-w-0 rounded-lg px-2 py-2 text-left hover:bg-black/[0.03] dark:hover:bg-white/[0.04]">
            <span className="flex items-center gap-1 text-[12px] text-slate-400"><ArrowLeft size={12} /> {UI.prev[lang]}</span>
            <span className="mt-0.5 block text-[13.5px] font-medium leading-snug text-slate-800 dark:text-slate-200">{prev.title[lang]}</span>
          </button>
        ) : <span />}
        {next ? (
          <button type="button" onClick={() => onOpen(next.id)} className="min-w-0 rounded-lg px-2 py-2 text-right hover:bg-black/[0.03] dark:hover:bg-white/[0.04]">
            <span className="flex items-center justify-end gap-1 text-[12px] text-slate-400">{UI.next[lang]} <ArrowRight size={12} /></span>
            <span className="mt-0.5 block text-[13.5px] font-medium leading-snug text-slate-800 dark:text-slate-200">{next.title[lang]}</span>
          </button>
        ) : <span />}
      </div>
    </article>
  );
}

// ─── "Hỏi AI" — trợ lý Sổ tay (notesApi.aiHoi) ───────────────────

interface AskSource { noteId: number; title: string; trich: string }

function AskAi({ lang }: { lang: HelpLang }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<AskSource[]>([]);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const send = useCallback(async () => {
    const q = input.trim();
    if (!q || loading) return;
    setLoading(true);
    setError(false);
    setAnswer(null);
    setSources([]);
    try {
      const r = await notesApi.aiHoi(q);
      setAnswer(r.data.data.answer || '');
      setSources(r.data.data.sources ?? []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  return (
    <div>
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-[9px] bg-teal-500/15 text-teal-600 dark:text-teal-400">
          <Sparkles size={18} />
        </span>
        <h2 className="text-[19px] font-semibold leading-tight text-slate-900 dark:text-slate-100">{UI.askTitle[lang]}</h2>
      </div>
      <p className="mt-3 text-slate-600 dark:text-slate-300">{UI.askIntro[lang]}</p>

      <div className="mt-4">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send(); }
          }}
          placeholder={UI.askPlaceholder[lang]}
          aria-label={UI.askTitle[lang]}
          rows={3}
          className="min-h-[76px] w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-[14px] text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-white/15 dark:bg-white/[0.04] dark:text-slate-100"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => void send()}
            disabled={loading || !input.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-[13px] font-semibold text-white shadow-sm hover:bg-teal-500 disabled:opacity-50"
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            {loading ? UI.askThinking[lang] : UI.askSend[lang]}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex gap-3 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3.5 py-3 text-[14px]">
          <TriangleAlert size={16} className="mt-[3px] shrink-0 text-amber-500" />
          <span className="min-w-0 flex-1">{UI.askError[lang]}</span>
        </div>
      )}

      {answer !== null && !error && (
        <div className="mt-5 border-t border-slate-200 pt-4 dark:border-white/10">
          <div className="whitespace-pre-wrap text-[14.5px] leading-[1.65] text-slate-700 dark:text-slate-200">{answer}</div>
          {sources.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-400">{UI.askSources[lang]}</div>
              <div className="space-y-1.5">
                {sources.map((s, i) => (
                  <div key={`${s.noteId}-${i}`} className="rounded-lg border border-slate-200 px-3 py-2 dark:border-white/10">
                    <div className="flex items-center gap-1.5 text-[13.5px] font-medium text-slate-800 dark:text-slate-200">
                      <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded bg-teal-500/15 px-1 text-[11px] font-semibold text-teal-700 dark:text-teal-300">{i + 1}</span>
                      {s.title}
                    </div>
                    {s.trich && <div className="mt-1 line-clamp-2 text-[12.5px] leading-[1.5] text-slate-500 dark:text-slate-400">{s.trich}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <p className="mt-6 text-[12.5px] text-slate-400">{UI.askDisclaimer[lang]}</p>
    </div>
  );
}

// ─── Nút đổi ngôn ngữ ─────────────────────────────────────────────

function LangToggle({ lang, onChange }: { lang: HelpLang; onChange: (l: HelpLang) => void }) {
  return (
    <div className="flex h-[28px] shrink-0 rounded-md border border-slate-300 p-0.5 dark:border-white/15" role="group" aria-label="Language / Ngôn ngữ">
      {([['vi', 'Tiếng Việt'], ['en', 'English']] as const).map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          aria-pressed={lang === id}
          lang={id}
          className={cn(
            'rounded px-2 text-[12px] font-medium transition-colors',
            lang === id
              ? 'bg-teal-500/15 text-slate-900 dark:text-slate-100'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Ngăn ────────────────────────────────────────────────────────

function NotesHelpPanel({ requested, nonce, onClose }: { requested: string | null; nonce: number; onClose: () => void }) {
  const [lang, setLangState] = useState<HelpLang>(readLang);
  const [current, setCurrent] = useState<string | null>(() => (requested && HELP_BY_ID[requested] ? requested : readLast()));
  const [query, setQuery] = useState('');
  const [ask, setAsk] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Mỗi lần openNotesHelp(): đi tới bài được yêu cầu, không có thì bài đọc trước.
  useEffect(() => {
    const id = requested && HELP_BY_ID[requested] ? requested : readLast();
    setCurrent(id);
    setQuery('');
    setAsk(false);
  }, [requested, nonce]);

  useEffect(() => {
    if (current) save(LAST_KEY, current);
    mainRef.current?.scrollTo({ top: 0 });
  }, [current]);

  const setLang = (l: HelpLang) => {
    setLangState(l);
    save(LANG_KEY, l);
  };

  // Focus vào ngăn, trả focus khi đóng.
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    panelRef.current?.focus({ preventScroll: true });
    return () => prev?.focus?.({ preventScroll: true });
  }, []);

  // Esc: có chữ trong ô tìm thì xoá chữ trước, không thì đóng ngăn.
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
    setAsk(false);
  };
  const results = useMemo(() => (query.trim() ? searchHelp(query) : []), [query]);
  const article = current ? HELP_BY_ID[current] : null;

  let body: ReactNode;
  if (query.trim()) body = <Results lang={lang} query={query} results={results} onOpen={open} />;
  else if (ask) body = <AskAi lang={lang} />;
  else if (article) body = <ArticleView a={article} lang={lang} onOpen={open} />;
  else body = <Home lang={lang} onOpen={open} />;

  return (
    <>
      <div className="fixed inset-0 z-[70] bg-black/30" onMouseDown={onClose} aria-hidden />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={UI.title[lang]}
        lang={lang}
        data-notes-help-panel=""
        className="fixed inset-y-0 right-0 z-[71] flex w-full flex-col bg-white text-slate-700 shadow-2xl outline-none dark:bg-[#0e1218] dark:text-slate-300 sm:w-[min(900px,94vw)] sm:border-l sm:border-slate-200 dark:sm:border-white/10"
      >
        {/* Đầu ngăn */}
        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-slate-200 px-3 dark:border-white/10 sm:px-4">
          {(article || query || ask) ? (
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[13px] text-slate-500 hover:bg-black/[0.04] dark:text-slate-400 dark:hover:bg-white/[0.05] md:hidden"
              onClick={() => { setQuery(''); setCurrent(null); setAsk(false); }}
            >
              <ArrowLeft size={14} /> {UI.contents[lang]}
            </button>
          ) : (
            <span className="flex min-w-0 items-center gap-2 md:hidden">
              <CircleHelp size={16} className="shrink-0 text-teal-600 dark:text-teal-400" />
              <span className="truncate text-[14px] font-semibold text-slate-900 dark:text-slate-100">{UI.title[lang]}</span>
            </span>
          )}
          <button
            type="button"
            onClick={() => { setQuery(''); setCurrent(null); setAsk(false); }}
            className="hidden min-w-0 items-center gap-2 rounded-md px-1 py-0.5 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] md:flex"
            title={UI.contents[lang]}
          >
            <CircleHelp size={16} className="shrink-0 text-teal-600 dark:text-teal-400" />
            <span className="truncate text-[14px] font-semibold text-slate-900 dark:text-slate-100">{UI.title[lang]}</span>
          </button>
          <div className="ml-auto flex items-center gap-1.5">
            <LangToggle lang={lang} onChange={setLang} />
            <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-black/[0.04] dark:text-slate-400 dark:hover:bg-white/[0.05]" aria-label={UI.close[lang]} title={UI.close[lang]}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Ô tìm + nút Hỏi AI */}
        <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-3 py-2.5 dark:border-white/10 sm:px-4">
          <div className="relative min-w-0 flex-1">
            <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); if (e.target.value) setAsk(false); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && results[0]) { e.preventDefault(); open(results[0].id); }
              }}
              placeholder={UI.search[lang]}
              aria-label={UI.search[lang]}
              className="h-[36px] w-full rounded-lg border border-slate-300 bg-white pl-8 pr-2 text-[14px] text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-white/15 dark:bg-white/[0.04] dark:text-slate-100"
            />
          </div>
          <button
            type="button"
            onClick={() => { setAsk(true); setQuery(''); }}
            aria-pressed={ask}
            className={cn(
              'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-[13px] font-medium transition-colors',
              ask
                ? 'border-teal-500/50 bg-teal-500/[0.12] text-teal-700 dark:text-teal-300'
                : 'border-slate-300 text-slate-600 hover:bg-black/[0.03] dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/[0.05]',
            )}
            title={UI.askTitle[lang]}
          >
            <Sparkles size={13} className="text-teal-600 dark:text-teal-400" />
            <span className="max-sm:hidden">{UI.askTab[lang]}</span>
          </button>
        </div>

        <div className="flex min-h-0 flex-1">
          {/* Mục lục bên trái (màn rộng) */}
          <aside className="hidden w-[248px] shrink-0 overflow-y-auto overscroll-contain border-r border-slate-200 bg-slate-50 px-2 py-4 dark:border-white/10 dark:bg-white/[0.02] md:block">
            <Toc lang={lang} current={query ? null : current} onOpen={open} />
            <div className="mt-6 flex items-center gap-1.5 px-2 text-[11.5px] text-slate-400">
              <kbd className="inline-flex h-[20px] min-w-[20px] items-center justify-center rounded border border-slate-300 bg-white px-1 text-[11px] font-medium text-slate-600 dark:border-white/15 dark:bg-white/[0.06] dark:text-slate-300">?</kbd> {UI.shortcut[lang]}
            </div>
          </aside>

          {/* Nội dung */}
          <div ref={mainRef} className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
            <div className="mx-auto max-w-[640px] px-4 pb-16 pt-5 text-[14.5px] leading-[1.65] text-slate-600 dark:text-slate-300 sm:px-7 sm:pt-6">
              {body}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Host: gắn một lần trong layout Notes ────────────────────────

export default function NotesHelpPanelHost() {
  const open = useNotesHelp((s) => s.open);
  const articleId = useNotesHelp((s) => s.articleId);
  const nonce = useNotesHelp((s) => s.nonce);
  const closeNotesHelp = useNotesHelp((s) => s.closeNotesHelp);

  // Phím ? (Shift+/) — mở; đang mở thì đóng. Nhường khi đang gõ hoặc có dialog khác.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '?' || e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      if (isTyping(e.target)) return;
      const st = useNotesHelp.getState();
      if (st.open) {
        e.preventDefault();
        st.closeNotesHelp();
        return;
      }
      // Đang có hộp thoại / ngăn khác (bảng lệnh, chia sẻ, ôn thẻ…) ⇒ nhường.
      if (document.querySelector('[role="dialog"]')) return;
      e.preventDefault();
      st.openNotesHelp();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  if (!open) return null;
  return <NotesHelpPanel requested={articleId} nonce={nonce} onClose={closeNotesHelp} />;
}
