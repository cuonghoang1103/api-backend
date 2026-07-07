'use client';
/**
 * My Language — Gojūon kana grid.
 * Arranges kana into vowel-aligned rows (gojūon / yōon) or a simple wrapped
 * row (flat, for special marks). Each cell is a neon card: big kana + small
 * romaji, clicking anywhere plays clear/slow TTS via the shared SpeakerButton.
 * Theme-aware (CSS vars, never `dark:`); mobile-first, 5 cols hold at 375px.
 */
import React, { useMemo, useRef } from 'react';
import { SpeakerButton } from '@/components/language/primitives';
import type { VocabLang } from '@/lib/notesTts';
import type { AlphabetItem } from '@/types/language';

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

/**
 * Pick a genuinely speakable string for an alphabet item. Kana/letters speak
 * themselves; IPA & pinyin cells speak the example word embedded in their
 * romanization; rule cards ("Biến điệu 3-3", "-ed"…) have nothing a TTS voice
 * can pronounce → return null and the speaker is hidden entirely.
 */
function speakableOf(item: AlphabetItem, code?: string): { text: string; lang?: VocabLang } | null {
  const char = (item.character ?? '').trim();
  const roman = (item.romanization ?? '').trim();

  if (code === 'zh') {
    // "bā 八 (số 8)" → speak 八; tone cards "mā 妈 = mẹ" → speak 妈.
    const cjk = roman.match(CJK_RUN) ?? char.match(CJK_RUN);
    return cjk ? { text: cjk[0], lang: 'zh-CN' } : null;
  }
  if (code === 'en') {
    // Single letters speak their name; IPA cards carry "day /deɪ/" → "day".
    if (/^[A-Za-z]$/.test(char)) return { text: char, lang: 'en-US' };
    const example = roman.match(/([A-Za-z]{2,})\s*\/[^/]+\//);
    if (example) return { text: example[1], lang: 'en-US' };
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
  // The whole cell is clickable → forwards the click to the inner SpeakerButton.
  const wrapRef = useRef<HTMLSpanElement>(null);
  const speak = () => wrapRef.current?.querySelector('button')?.click();
  const isLong = [...(item.character ?? '')].length > 4;

  return (
    <div
      role={speakable ? 'button' : undefined}
      tabIndex={speakable ? 0 : undefined}
      onClick={speakable ? speak : undefined}
      onKeyDown={
        speakable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                speak();
              }
            }
          : undefined
      }
      title={item.note ?? undefined}
      aria-label={`${item.character}${item.romanization ? ` (${item.romanization})` : ''}`}
      className={`card group relative flex select-none flex-col items-center justify-center gap-1 rounded-xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-violet/50 ${
        isLong ? 'min-h-[6rem] p-2' : 'aspect-square p-1'
      } ${speakable ? 'cursor-pointer hover:border-neon-violet/50 hover:shadow-neon' : ''}`}
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
          className="absolute right-0.5 top-0.5 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100"
        >
          <SpeakerButton text={speakable.text} forceLang={speakable.lang} audioUrl={item.audioUrl} size={13} className="h-6 w-6" />
        </span>
      )}
    </div>
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
