'use client';
/**
 * My Language — Gojūon kana grid.
 * Arranges kana into vowel-aligned rows (gojūon / yōon) or a simple wrapped
 * row (flat, for special marks). Each cell is a neon card: big kana + small
 * romaji, clicking anywhere plays clear/slow TTS via the shared SpeakerButton.
 * Theme-aware (CSS vars, never `dark:`); mobile-first, 5 cols hold at 375px.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';
import { SpeakerButton } from '@/components/language/primitives';
import type { VocabLang } from '@/lib/notesTts';
import type { AlphabetItem } from '@/types/language';
import { getImageUrl } from '@/lib/utils';
import { KanaStudyPanel } from './KanaStudyPanel';

export type KanaMode = 'gojuon' | 'yoon' | 'flat';

type Vowel = 'a' | 'i' | 'u' | 'e' | 'o';
const GOJUON_ORDER: Vowel[] = ['a', 'i', 'u', 'e', 'o'];
const YOON_ORDER: Vowel[] = ['a', 'u', 'o'];

/** Trailing vowel of a romaji reading (shi→i, chi→i, tsu→u, fu→u, kya→a …). */
function trailingVowel(romaji: string | null | undefined): Vowel | null {
  const last = (romaji ?? '').trim().toLowerCase().slice(-1);
  return last === 'a' || last === 'i' || last === 'u' || last === 'e' || last === 'o' ? last : null;
}

type Cell = AlphabetItem | null;

/**
 * Walk items in array order, aligning each to its vowel column. Start a NEW row
 * whenever the current column index ≤ the previous one (detects the …o → …a
 * wrap into the next consonant row). Items with no trailing vowel (e.g. ん)
 * fall into `leftover` and render as a trailing flat row.
 */
function buildRows(items: AlphabetItem[], order: Vowel[]): { rows: Cell[][]; leftover: AlphabetItem[] } {
  const width = order.length;
  const rows: Cell[][] = [];
  const leftover: AlphabetItem[] = [];
  let cur: Cell[] | null = null;
  let prevCol = -1;

  for (const item of items) {
    const v = trailingVowel(item.romanization);
    const col = v ? order.indexOf(v) : -1;
    if (col < 0) {
      leftover.push(item);
      continue;
    }
    if (!cur || col <= prevCol) {
      cur = Array<Cell>(width).fill(null);
      rows.push(cur);
    }
    cur[col] = item;
    prevCol = col;
  }
  return { rows, leftover };
}

// ─── TTS: what (if anything) a cell should speak ─────────────────
const CJK_RUN = /[一-鿿]+/;
// Latin word (2+ letters) immediately followed by an IPA slash group: "sheep /ʃiːp/".
const EN_EXAMPLE = /([A-Za-z]{2,})\s*\/[^/]+\//;
// Leading pinyin syllable, incl. tone diacritics & final -r: "bā", "nǐ", "wánr".
const PINYIN_TOKEN = /^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]{2,}/i;

/**
 * Pick a genuinely speakable string for an alphabet item. The field that holds
 * the real sound differs per language/section, so we normalise here:
 *  • ja — the kana glyph (character) speaks itself.
 *  • zh — the example Han character in romanization ("bā 八 (số 8)" → 八); rule
 *         cards without a Han example fall back to the leading pinyin token.
 *  • en — IPA cards carry an example word ("sheep /ʃiːp/" → "sheep"); the A–Z
 *         table's character is a letter pair ("A a") → speak the letter name.
 * Returns null only when there is truly nothing a voice can pronounce, in which
 * case the card stays expandable but shows no speaker.
 */
function speakableOf(item: AlphabetItem, code?: string): { text: string; lang?: VocabLang } | null {
  const char = (item.character ?? '').trim();
  const roman = (item.romanization ?? '').trim();
  const note = (item.note ?? '').trim();

  if (code === 'zh') {
    const cjk = roman.match(CJK_RUN) ?? char.match(CJK_RUN);
    if (cjk) return { text: cjk[0], lang: 'zh-CN' };
    const py = roman.match(PINYIN_TOKEN) ?? char.match(PINYIN_TOKEN);
    return py ? { text: py[0], lang: 'zh-CN' } : null;
  }
  if (code === 'en') {
    // IPA cards embed an example word in romanization (or, rarely, the note).
    const example = roman.match(EN_EXAMPLE) ?? note.match(EN_EXAMPLE);
    if (example) return { text: example[1], lang: 'en-US' };
    // A–Z table: character is "A a" / "B b" / "Z z" → speak the letter name.
    const letter = char.match(/[A-Za-z]/);
    if (letter) return { text: letter[0], lang: 'en-US' };
    return null;
  }
  if (code === 'ja') return char ? { text: char, lang: 'ja-JP' } : null;
  // Unknown language → old behaviour (script auto-detect).
  return char ? { text: char } : null;
}

// ─── Single kana cell ────────────────────────────────────────────
/** Character font-size that fits the card: kana-sized down to label-sized. */
function charSizeClass(ch: string): string {
  const len = [...ch].length;
  if (len <= 2) return 'text-3xl sm:text-4xl leading-none';
  if (len <= 4) return 'text-2xl sm:text-3xl leading-none';
  if (len <= 8) return 'text-lg sm:text-xl leading-tight';
  return 'text-sm sm:text-base font-semibold leading-snug';
}

function KanaCell({
  item,
  hideRomaji,
  showNote,
  code,
}: {
  item: AlphabetItem;
  hideRomaji: boolean;
  showNote?: boolean;
  code?: string;
}) {
  const speakable = speakableOf(item, code);
  // The corner SpeakerButton owns the actual TTS/audio; the cell forwards to it.
  const wrapRef = useRef<HTMLSpanElement>(null);
  const speak = () => wrapRef.current?.querySelector('button')?.click();
  const isLong = [...(item.character ?? '')].length > 4;

  const [open, setOpen] = useState(false);
  // Single click → speak, double click → open detail. Defer the speak briefly so
  // a double-click can cancel it (otherwise a double-tap fires audio then opens).
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelPending = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
  };
  const handleClick = () => {
    if (clickTimer.current) return; // second click of a double — let onDoubleClick handle it
    clickTimer.current = setTimeout(() => {
      clickTimer.current = null;
      if (speakable) speak();
    }, 220);
  };
  const handleDoubleClick = () => {
    cancelPending();
    setOpen(true);
  };
  useEffect(() => cancelPending, []);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (speakable) speak();
          } else if (e.key.toLowerCase() === 'i') {
            e.preventDefault();
            setOpen(true);
          }
        }}
        title={item.note ?? undefined}
        aria-label={`${item.character}${item.romanization ? ` (${item.romanization})` : ''} — nhấn để nghe, nhấn đúp để xem đầy đủ`}
        className={`card group relative flex cursor-pointer select-none flex-col items-center justify-center gap-1 rounded-xl transition hover:border-neon-violet/50 hover:shadow-neon focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-violet/50 ${
          isLong ? 'min-h-[6rem] p-2' : 'aspect-square p-1'
        }`}
      >
        <span
          className={`max-w-full break-words text-center font-heading font-bold text-text-primary ${charSizeClass(
            item.character ?? '',
          )}`}
        >
          {item.character}
        </span>
        {!hideRomaji && item.romanization && (
          <span className="line-clamp-2 max-w-full break-words text-center text-[11px] font-medium leading-tight text-text-muted">
            {item.romanization}
          </span>
        )}
        {showNote && item.note && (
          <span className={`max-w-full text-center text-[9px] leading-tight text-text-muted ${isLong ? 'line-clamp-2' : 'line-clamp-1'}`}>
            {item.note}
          </span>
        )}
        {speakable && (
          <span
            ref={wrapRef}
            className="absolute right-0.5 top-0.5 opacity-60 transition group-hover:opacity-100 group-focus-within:opacity-100"
          >
            <SpeakerButton text={speakable.text} forceLang={speakable.lang} audioUrl={item.audioUrl} size={13} className="h-6 w-6" />
          </span>
        )}
        {/* Advertises the double-click-to-expand gesture (hover only, non-interactive). */}
        <Maximize2
          size={11}
          aria-hidden
          className="pointer-events-none absolute bottom-1 left-1 text-text-muted opacity-0 transition group-hover:opacity-70"
        />
      </div>

      <AnimatePresence>
        {open && <KanaCellDetail key="detail" item={item} speakable={speakable} onClose={() => setOpen(false)} code={code} />}
      </AnimatePresence>
    </>
  );
}

// ─── Detail modal (double-click) ─────────────────────────────────
/** Full-size view of one alphabet item: big glyph, full romanization + note
 *  (no truncation), a large speaker, and the example image if any. Language-
 *  agnostic — renders only AlphabetItem fields, so it works for every section. */
function KanaCellDetail({
  item,
  speakable,
  onClose,
  code,
}: {
  item: AlphabetItem;
  speakable: { text: string; lang?: VocabLang } | null;
  onClose: () => void;
  code?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label={item.character}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="card relative z-10 max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-2xl p-6 text-center"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition hover:bg-[var(--bg-surface)] hover:text-text-primary"
        >
          <X size={18} />
        </button>

        <div className="mb-3 break-words font-heading text-5xl font-bold leading-tight text-text-primary">
          {item.character}
        </div>
        {item.romanization && (
          <div className="mb-4 break-words text-lg font-medium text-neon-violet">{item.romanization}</div>
        )}
        {speakable && (
          <div className="mb-4 flex justify-center">
            <SpeakerButton
              text={speakable.text}
              forceLang={speakable.lang}
              audioUrl={item.audioUrl}
              size={22}
              className="h-12 w-12 bg-neon-violet/10 hover:bg-neon-violet/20"
            />
          </div>
        )}
        {item.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getImageUrl(item.imageUrl ?? undefined)}
            alt={item.character}
            className="mx-auto mb-4 max-h-48 w-auto rounded-xl object-contain"
          />
        )}
        {item.note && (
          <p className="whitespace-pre-wrap break-words text-left text-sm leading-relaxed text-text-secondary">
            {item.note}
          </p>
        )}

        {/* Writing / mnemonic / confusables — Japanese only: the stroke data is
            the Japanese set, and stroke order means nothing for A–Z or pinyin. */}
        {code === 'ja' && [...item.character].length === 1 && (
          <KanaStudyPanel char={item.character} romaji={item.romanization} code={code} />
        )}
      </motion.div>
    </motion.div>,
    document.body,
  );
}

function BlankCell() {
  return <div aria-hidden className="aspect-square rounded-xl border border-dashed border-[var(--border-color)]/40" />;
}

// ─── Grid ────────────────────────────────────────────────────────
export default function KanaGrid({
  items,
  hideRomaji,
  mode = 'gojuon',
  code,
}: {
  items: AlphabetItem[];
  hideRomaji: boolean;
  mode?: KanaMode;
  /** Language code ('ja' | 'en' | 'zh' …) — drives per-cell TTS voice & text. */
  code?: string;
}) {
  const order = mode === 'yoon' ? YOON_ORDER : GOJUON_ORDER;

  const built = useMemo(() => (mode === 'flat' ? null : buildRows(items, order)), [items, order, mode]);

  if (items.length === 0) {
    return <p className="py-8 text-center text-sm text-text-muted">Nhóm này chưa có chữ.</p>;
  }

  // ── Flat: simple wrapped row (special marks っ / ー, IPA, pinyin …) ──
  if (mode === 'flat' || !built) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {items.map((item) => (
          <KanaCell key={item.id} item={item} hideRomaji={hideRomaji} showNote code={code} />
        ))}
      </div>
    );
  }

  const { rows, leftover } = built;
  const width = order.length;
  const cols = `repeat(${width}, minmax(3.25rem, 1fr))`;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max sm:min-w-0">
        {/* Vowel column headers */}
        <div className="mb-1.5 grid gap-2" style={{ gridTemplateColumns: cols }}>
          {order.map((v) => (
            <div key={v} className="text-center text-[11px] font-semibold uppercase tracking-widest text-neon-violet/70">
              {v}
            </div>
          ))}
        </div>

        <div className="grid gap-2" style={{ gridTemplateColumns: cols }}>
          {rows.map((row, ri) =>
            row.map((cell, ci) =>
              cell ? (
                <KanaCell key={cell.id} item={cell} hideRomaji={hideRomaji} code={code} />
              ) : (
                <BlankCell key={`b-${ri}-${ci}`} />
              ),
            ),
          )}
        </div>

        {/* Vowel-less kana (e.g. ん / ン) */}
        {leftover.length > 0 && (
          <div className="mt-2 grid gap-2" style={{ gridTemplateColumns: cols }}>
            {leftover.map((item) => (
              <KanaCell key={item.id} item={item} hideRomaji={hideRomaji} code={code} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
