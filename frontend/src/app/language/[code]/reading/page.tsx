'use client';
/**
 * My Language — Đọc (Reading) section page.
 * List of articles → detail view.
 *  • IMAGE_LIST: vertical image reader + tap image → lightbox gallery.
 *  • TEXT: typography reading view (HTML), A-/A+ font controls,
 *    optional Vietnamese translation, and a tap-a-word dictionary
 *    (tokenizes the article, underlines dictionary words, tap → sheet).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Newspaper,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  X,
  ZoomIn,
  AArrowUp,
  AArrowDown,
  Type,
} from 'lucide-react';
import { languageApi } from '@/lib/language-api';
import { getImageUrl } from '@/lib/utils';
import type { ReadingArticle, DictionaryEntry } from '@/types/language';
import {
  SectionShell,
  SpeakerButton,
  EmptyState,
  CardsSkeleton,
  usePrefersReducedMotion,
} from '@/components/language/primitives';

// ─── HTML → plain-text paragraphs (client-only) ───────────────────
function htmlToParagraphs(html: string): string[] {
  if (typeof window === 'undefined') return [html];
  const normalized = html
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\/\s*(p|div|h[1-6]|li|tr)\s*>/gi, '\n');
  const el = document.createElement('div');
  el.innerHTML = normalized;
  const text = el.textContent ?? '';
  return text
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// ─── Tokenizer: keep letters/numbers as "word" tokens, rest as "sep" ─
interface Token {
  kind: 'word' | 'sep';
  value: string;
  key: string;
}
const WORD_RE = /[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu;
function tokenize(text: string, keyPrefix: string): Token[] {
  const out: Token[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  WORD_RE.lastIndex = 0;
  let i = 0;
  while ((m = WORD_RE.exec(text)) !== null) {
    if (m.index > last) {
      out.push({ kind: 'sep', value: text.slice(last, m.index), key: `${keyPrefix}-s${i}` });
    }
    out.push({ kind: 'word', value: m[0], key: `${keyPrefix}-w${i}` });
    last = m.index + m[0].length;
    i += 1;
  }
  if (last < text.length) {
    out.push({ kind: 'sep', value: text.slice(last), key: `${keyPrefix}-s${i}` });
  }
  return out;
}

export default function ReadingPage() {
  const code = String(useParams().code);
  const reduced = usePrefersReducedMotion();

  const [articles, setArticles] = useState<ReadingArticle[] | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [dict, setDict] = useState<Map<string, DictionaryEntry> | null>(null);

  useEffect(() => {
    let alive = true;
    languageApi
      .reading(code)
      .then((res) => {
        if (alive) setArticles(res.data.data ?? []);
      })
      .catch(() => {
        if (alive) setArticles([]);
      });
    return () => {
      alive = false;
    };
  }, [code]);

  // Lazily fetch + index the dictionary the first time a TEXT article opens.
  const loadDictionary = useCallback(() => {
    if (dict) return;
    languageApi
      .dictionary(code)
      .then((res) => {
        const map = new Map<string, DictionaryEntry>();
        for (const e of res.data.data ?? []) {
          const k = e.word.trim().toLowerCase();
          if (k && !map.has(k)) map.set(k, e);
        }
        setDict(map);
      })
      .catch(() => setDict(new Map()));
  }, [code, dict]);

  const active = useMemo(
    () => articles?.find((a) => a.id === activeId) ?? null,
    [articles, activeId],
  );

  return (
    <SectionShell code={code} title="Đọc" icon={<Newspaper />}>
      {articles === null ? (
        <CardsSkeleton count={6} />
      ) : active ? (
        <ArticleDetail
          article={active}
          reduced={reduced}
          dict={dict}
          onNeedDictionary={loadDictionary}
          onBack={() => setActiveId(null)}
        />
      ) : articles.length === 0 ? (
        <EmptyState
          emoji="📰"
          title="Chưa có bài đọc"
          hint="Nội dung bài đọc cho ngôn ngữ này sẽ sớm được thêm."
        />
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {articles.map((a) => (
            <ArticleListCard key={a.id} article={a} onOpen={() => setActiveId(a.id)} />
          ))}
        </ul>
      )}
    </SectionShell>
  );
}

// ─── List card ────────────────────────────────────────────────────
function ArticleListCard({ article, onOpen }: { article: ReadingArticle; onOpen: () => void }) {
  const thumb =
    article.type === 'IMAGE_LIST' && article.images && article.images.length > 0
      ? getImageUrl(article.images[0])
      : null;
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className="card group flex w-full items-center gap-3 rounded-2xl p-3 text-left transition hover:ring-1 hover:ring-neon-violet/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-violet/50"
      >
        {thumb ? (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[var(--bg-surface)]">
            <Image src={thumb} alt={article.title} fill sizes="64px" className="object-cover" />
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-neon-violet">
            <Type size={22} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-text-primary">{article.title}</p>
          <p className="mt-0.5 text-xs text-text-muted">
            {article.type === 'IMAGE_LIST'
              ? `${article.images?.length ?? 0} hình`
              : 'Bài đọc văn bản'}
          </p>
        </div>
        <ChevronRight size={18} className="shrink-0 text-text-muted transition group-hover:text-neon-violet" />
      </button>
    </li>
  );
}

// ─── Detail view ──────────────────────────────────────────────────
function ArticleDetail({
  article,
  reduced,
  dict,
  onNeedDictionary,
  onBack,
}: {
  article: ReadingArticle;
  reduced: boolean;
  dict: Map<string, DictionaryEntry> | null;
  onNeedDictionary: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-surface)] px-3 py-1.5 text-sm font-medium text-text-secondary ring-1 ring-[var(--border-color)] transition hover:text-text-primary"
      >
        <ArrowLeft size={16} />
        Danh sách
      </button>
      <h2 className="mb-4 font-heading text-xl font-bold text-text-primary sm:text-2xl">{article.title}</h2>

      {article.type === 'IMAGE_LIST' ? (
        <ImageReader images={article.images ?? []} reduced={reduced} />
      ) : (
        <TextReader article={article} reduced={reduced} dict={dict} onNeedDictionary={onNeedDictionary} />
      )}
    </div>
  );
}

// ─── IMAGE_LIST reader + lightbox ─────────────────────────────────
function ImageReader({ images, reduced }: { images: string[]; reduced: boolean }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  if (images.length === 0) {
    return <EmptyState emoji="🖼️" title="Bài đọc này chưa có hình" />;
  }
  return (
    <>
      <div className="flex flex-col gap-3">
        {images.map((img, i) => (
          <button
            key={`${img}-${i}`}
            type="button"
            onClick={() => setLightbox(i)}
            className="group relative w-full overflow-hidden rounded-2xl bg-[var(--bg-surface)] ring-1 ring-[var(--border-color)] focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-violet/50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImageUrl(img)}
              alt={`Trang ${i + 1}`}
              className="w-full object-contain"
              loading="lazy"
            />
            <span className="pointer-events-none absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
              <ZoomIn size={13} /> Trang {i + 1}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            images={images}
            index={lightbox}
            reduced={reduced}
            onIndex={setLightbox}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function Lightbox({
  images,
  index,
  reduced,
  onIndex,
  onClose,
}: {
  images: string[];
  index: number;
  reduced: boolean;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const dur = reduced ? 0 : 0.2;

  const go = useCallback(
    (dir: 1 | -1) => {
      setZoom(false);
      onIndex((index + dir + images.length) % images.length);
    },
    [index, images.length, onIndex],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex flex-col bg-black/90"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: dur, ease: 'easeOut' } }}
      transition={{ duration: dur, ease: 'easeOut' }}
      style={{ pointerEvents: 'auto' }}
      onClick={onClose}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 text-white" onClick={(e) => e.stopPropagation()}>
        <span className="rounded-full bg-white/10 px-3 py-1 text-sm">
          {index + 1} / {images.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoom((z) => !z)}
            aria-pressed={zoom}
            aria-label="Phóng to"
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition ${
              zoom ? 'bg-neon-violet/40' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <ZoomIn size={18} />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Image stage */}
      <div
        className="relative flex flex-1 items-center justify-center overflow-auto p-2"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current;
          const end = e.changedTouches[0]?.clientX ?? null;
          if (start !== null && end !== null && Math.abs(end - start) > 50) {
            go(end < start ? 1 : -1);
          }
          touchStartX.current = null;
        }}
      >
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Trang trước"
            className="absolute left-2 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
          >
            <ChevronLeft size={22} />
          </button>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={index}
          src={getImageUrl(images[index])}
          alt={`Trang ${index + 1}`}
          onClick={() => setZoom((z) => !z)}
          className="max-h-full max-w-full origin-center cursor-zoom-in select-none object-contain transition-transform duration-200"
          style={{ transform: zoom ? 'scale(1.9)' : 'scale(1)', cursor: zoom ? 'zoom-out' : 'zoom-in' }}
          draggable={false}
        />
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Trang sau"
            className="absolute right-2 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── TEXT reader + tap-a-word dictionary ──────────────────────────
function TextReader({
  article,
  reduced,
  dict,
  onNeedDictionary,
}: {
  article: ReadingArticle;
  reduced: boolean;
  dict: Map<string, DictionaryEntry> | null;
  onNeedDictionary: () => void;
}) {
  const [fontScale, setFontScale] = useState(1);
  const [showTranslation, setShowTranslation] = useState(false);
  const [selected, setSelected] = useState<DictionaryEntry | null>(null);

  useEffect(() => {
    onNeedDictionary();
  }, [onNeedDictionary]);

  const paragraphs = useMemo(
    () => htmlToParagraphs(article.content ?? ''),
    [article.content],
  );

  const tokenized = useMemo(
    () => paragraphs.map((p, i) => tokenize(p, `p${i}`)),
    [paragraphs],
  );

  const fontSize = `${Math.round(17 * fontScale)}px`;

  return (
    <div>
      {/* Font controls */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-surface)] p-1 ring-1 ring-[var(--border-color)]">
          <button
            type="button"
            onClick={() => setFontScale((s) => Math.max(0.8, +(s - 0.1).toFixed(2)))}
            aria-label="Giảm cỡ chữ"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition hover:text-neon-violet"
          >
            <AArrowDown size={18} />
          </button>
          <span className="min-w-[3ch] text-center text-xs font-medium text-text-muted">
            {Math.round(fontScale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setFontScale((s) => Math.min(1.8, +(s + 0.1).toFixed(2)))}
            aria-label="Tăng cỡ chữ"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition hover:text-neon-violet"
          >
            <AArrowUp size={18} />
          </button>
        </div>
        {article.translation && (
          <button
            type="button"
            onClick={() => setShowTranslation((v) => !v)}
            aria-pressed={showTranslation}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition ${
              showTranslation
                ? 'bg-neon-cyan/20 text-neon-cyan ring-neon-cyan/40'
                : 'bg-[var(--bg-surface)] text-text-secondary ring-[var(--border-color)] hover:text-text-primary'
            }`}
          >
            {showTranslation ? 'Ẩn bản dịch' : 'Hiện bản dịch'}
          </button>
        )}
      </div>

      {/* Reading body (tokenized) */}
      <article
        className="card rounded-2xl p-4 leading-relaxed text-text-primary sm:p-6"
        style={{ fontSize }}
      >
        {tokenized.length === 0 ? (
          <p className="text-text-muted">Bài đọc này chưa có nội dung.</p>
        ) : (
          tokenized.map((tokens, pi) => (
            <p key={`para-${pi}`} className="mb-4 last:mb-0">
              {tokens.map((tk) => {
                if (tk.kind === 'sep') return <span key={tk.key}>{tk.value}</span>;
                const entry = dict?.get(tk.value.toLowerCase());
                if (!entry) return <span key={tk.key}>{tk.value}</span>;
                return (
                  <button
                    key={tk.key}
                    type="button"
                    onClick={() => setSelected(entry)}
                    className="rounded-sm underline decoration-neon-violet/50 decoration-dotted underline-offset-4 transition hover:bg-neon-violet/10 hover:decoration-neon-violet"
                  >
                    {tk.value}
                  </button>
                );
              })}
            </p>
          ))
        )}
      </article>

      {/* Vietnamese translation */}
      <AnimatePresence initial={false}>
        {showTranslation && article.translation && (
          <motion.div
            key="translation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0, transition: { duration: reduced ? 0 : 0.2, ease: 'easeOut' } }}
            transition={{ duration: reduced ? 0 : 0.24, ease: 'easeOut' }}
            style={{ overflow: 'hidden', pointerEvents: 'auto' }}
          >
            <div className="mt-4 rounded-2xl border border-neon-cyan/30 bg-neon-cyan/5 p-4 sm:p-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neon-cyan">Bản dịch</p>
              <div
                className="prose-language leading-relaxed text-text-secondary"
                dangerouslySetInnerHTML={{ __html: article.translation }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Word sheet */}
      <AnimatePresence>
        {selected && <WordSheet entry={selected} reduced={reduced} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}

function WordSheet({
  entry,
  reduced,
  onClose,
}: {
  entry: DictionaryEntry;
  reduced: boolean;
  onClose: () => void;
}) {
  const dur = reduced ? 0 : 0.24;
  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: dur, ease: 'easeOut' } }}
      transition={{ duration: dur, ease: 'easeOut' }}
      style={{ pointerEvents: 'auto' }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        className="card relative z-10 w-full max-w-md rounded-t-2xl p-5 sm:rounded-2xl"
        initial={{ y: reduced ? 0 : 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: reduced ? 0 : 40, opacity: 0, transition: { duration: dur, ease: 'easeOut' } }}
        transition={{ duration: dur, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-heading text-xl font-bold text-text-primary">{entry.word}</h3>
            {entry.pronunciations.length > 0 && (
              <p className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-sm text-text-muted">
                {entry.pronunciations.map((p, i) => (
                  <span key={`${p.type}-${i}`}>
                    <span className="text-text-secondary">{p.type}:</span> {p.value}
                  </span>
                ))}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <SpeakerButton text={entry.word} />
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition hover:bg-[var(--bg-surface)] hover:text-text-primary"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <p className="mt-3 text-text-primary">{entry.meaningVi}</p>
      </motion.div>
    </motion.div>
  );
}
