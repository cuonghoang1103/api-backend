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

// ─── Single kana cell ────────────────────────────────────────────
function KanaCell({ item, hideRomaji, showNote }: { item: AlphabetItem; hideRomaji: boolean; showNote?: boolean }) {
  // The whole cell is clickable → forwards the click to the inner SpeakerButton.
  const wrapRef = useRef<HTMLSpanElement>(null);
  const speak = () => wrapRef.current?.querySelector('button')?.click();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={speak}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          speak();
        }
      }}
      title={item.note ?? undefined}
      aria-label={`${item.character}${item.romanization ? ` (${item.romanization})` : ''}`}
      className="card group relative flex aspect-square cursor-pointer select-none flex-col items-center justify-center gap-0.5 rounded-xl p-1 transition hover:border-neon-violet/50 hover:shadow-neon focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-violet/50"
    >
      <span className="font-heading text-3xl font-bold leading-none text-text-primary sm:text-4xl">
        {item.character}
      </span>
      {!hideRomaji && item.romanization && (
        <span className="text-[11px] font-medium leading-none text-text-muted">{item.romanization}</span>
      )}
      {showNote && item.note && (
        <span className="mt-0.5 line-clamp-1 max-w-full text-[9px] leading-tight text-text-muted">{item.note}</span>
      )}
      <span ref={wrapRef} className="absolute right-0.5 top-0.5 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
        <SpeakerButton text={item.character} audioUrl={item.audioUrl} size={13} className="h-6 w-6" />
      </span>
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
}: {
  items: AlphabetItem[];
  hideRomaji: boolean;
  mode?: KanaMode;
}) {
  const order = mode === 'yoon' ? YOON_ORDER : GOJUON_ORDER;

  const built = useMemo(() => (mode === 'flat' ? null : buildRows(items, order)), [items, order, mode]);

  if (items.length === 0) {
    return <p className="py-8 text-center text-sm text-text-muted">Nhóm này chưa có chữ.</p>;
  }

  // ── Flat: simple wrapped row (special marks っ / ー, kanji …) ──
  if (mode === 'flat' || !built) {
    return (
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
        {items.map((item) => (
          <KanaCell key={item.id} item={item} hideRomaji={hideRomaji} showNote />
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
                <KanaCell key={cell.id} item={cell} hideRomaji={hideRomaji} />
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
              <KanaCell key={item.id} item={item} hideRomaji={hideRomaji} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
