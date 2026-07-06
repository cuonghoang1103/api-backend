'use client';
/**
 * Stages 1–3: Multiple choice, Reversed choice, Find a pair.
 */
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  distractorKana,
  distractorRomaji,
  normalizeRomaji,
  shuffle,
  type KanaItem,
  type StageProps,
} from '../types';
import { AnswerBar, OptionButton, PromptTile, type OptionState } from './common';

// ─── Stage 1: Multiple choice (kana → romaji) ────────────────────
export function MultipleChoiceStage({ target, pool, onResult, onNext, reduced }: StageProps) {
  const options = useMemo(
    () => shuffle([target.romaji, ...distractorRomaji(pool, target.romaji, 3)]),
    [target, pool],
  );
  const [picked, setPicked] = useState<string | null>(null);
  const answered = picked !== null;

  const choose = (opt: string) => {
    if (answered) return;
    setPicked(opt);
    onResult(normalizeRomaji(opt) === normalizeRomaji(target.romaji));
  };

  const stateOf = (opt: string): OptionState => {
    if (!answered) return 'idle';
    if (normalizeRomaji(opt) === normalizeRomaji(target.romaji)) return 'correct';
    if (opt === picked) return 'wrong';
    return 'muted';
  };

  return (
    <div>
      <PromptTile hint="Kana này đọc là gì?">{target.kana}</PromptTile>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {options.map((opt) => (
          <OptionButton key={opt} state={stateOf(opt)} disabled={answered} onClick={() => choose(opt)}>
            {opt}
          </OptionButton>
        ))}
      </div>
      {answered && (
        <AnswerBar
          status={normalizeRomaji(picked) === normalizeRomaji(target.romaji) ? 'correct' : 'wrong'}
          solution={target.romaji}
          onNext={onNext}
          reduced={reduced}
        />
      )}
    </div>
  );
}

// ─── Stage 2: Reversed choice (romaji → kana) ────────────────────
export function ReversedChoiceStage({ target, pool, onResult, onNext, reduced }: StageProps) {
  const options = useMemo(
    () => shuffle([target.kana, ...distractorKana(pool, target.kana, 3)]),
    [target, pool],
  );
  const [picked, setPicked] = useState<string | null>(null);
  const answered = picked !== null;

  const choose = (opt: string) => {
    if (answered) return;
    setPicked(opt);
    onResult(opt === target.kana);
  };

  const stateOf = (opt: string): OptionState => {
    if (!answered) return 'idle';
    if (opt === target.kana) return 'correct';
    if (opt === picked) return 'wrong';
    return 'muted';
  };

  return (
    <div>
      <PromptTile hint="Chọn kana đúng">{target.romaji}</PromptTile>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {options.map((opt) => (
          <OptionButton
            key={opt}
            state={stateOf(opt)}
            disabled={answered}
            onClick={() => choose(opt)}
            className="text-3xl"
          >
            {opt}
          </OptionButton>
        ))}
      </div>
      {answered && (
        <AnswerBar
          status={picked === target.kana ? 'correct' : 'wrong'}
          solution={target.kana}
          onNext={onNext}
          reduced={reduced}
        />
      )}
    </div>
  );
}

// ─── Stage 3: Find a pair (matching grid) ────────────────────────
type Tile = { key: string; label: string; item: KanaItem; col: 'kana' | 'romaji' };

export function FindPairStage({ pool, onResult, onNext, reduced }: StageProps) {
  const set = useMemo(() => {
    // Pick up to 5 items with distinct kana AND distinct romaji.
    const chosen: KanaItem[] = [];
    const seenKana = new Set<string>();
    const seenRomaji = new Set<string>();
    for (const it of shuffle(pool)) {
      if (seenKana.has(it.kana) || seenRomaji.has(normalizeRomaji(it.romaji))) continue;
      seenKana.add(it.kana);
      seenRomaji.add(normalizeRomaji(it.romaji));
      chosen.push(it);
      if (chosen.length >= 5) break;
    }
    return chosen;
  }, [pool]);

  const kanaTiles = useMemo<Tile[]>(
    () => shuffle(set.map((it) => ({ key: `k${it.id}`, label: it.kana, item: it, col: 'kana' as const }))),
    [set],
  );
  const romajiTiles = useMemo<Tile[]>(
    () => shuffle(set.map((it) => ({ key: `r${it.id}`, label: it.romaji, item: it, col: 'romaji' as const }))),
    [set],
  );

  const [selected, setSelected] = useState<Tile | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [done, setDone] = useState(false);

  const flashWrong = (a: Tile, b: Tile) => {
    setMistakes((m) => m + 1);
    setWrong(new Set([a.key, b.key]));
    window.setTimeout(() => setWrong(new Set()), 450);
  };

  const tap = (tile: Tile) => {
    if (done || matched.has(tile.item.id) || wrong.has(tile.key)) return;
    if (!selected) {
      setSelected(tile);
      return;
    }
    if (selected.key === tile.key) {
      setSelected(null);
      return;
    }
    if (selected.col === tile.col) {
      setSelected(tile); // re-pick within same column
      return;
    }
    // one kana + one romaji
    if (selected.item.id === tile.item.id) {
      const next = new Set(matched);
      next.add(tile.item.id);
      setMatched(next);
      setSelected(null);
      if (next.size === set.length) {
        setDone(true);
        onResult(mistakes === 0);
      }
    } else {
      flashWrong(selected, tile);
      setSelected(null);
    }
  };

  const renderCol = (tiles: Tile[]) => (
    <div className="flex flex-col gap-2.5">
      {tiles.map((tile) => {
        const isMatched = matched.has(tile.item.id);
        const isSelected = selected?.key === tile.key;
        return (
          <motion.button
            key={tile.key}
            type="button"
            layout={!reduced}
            onClick={() => tap(tile)}
            disabled={isMatched}
            animate={
              wrong.has(tile.key) && !reduced ? { x: [0, -6, 6, -4, 0] } : { x: 0 }
            }
            transition={{ duration: 0.35 }}
            className={`min-h-[3rem] rounded-xl border px-3 py-2.5 text-center text-xl font-semibold transition ${
              isMatched
                ? 'border-neon-green/50 bg-neon-green/10 text-neon-green opacity-40'
                : wrong.has(tile.key)
                  ? 'border-neon-red/60 bg-neon-red/15 text-neon-red'
                  : isSelected
                    ? 'border-neon-violet/70 bg-neon-violet/15 text-neon-violet ring-2 ring-neon-violet/40'
                    : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-text-primary hover:border-neon-violet/40'
            }`}
          >
            {tile.label}
          </motion.button>
        );
      })}
    </div>
  );

  return (
    <div>
      <p className="mb-3 text-center text-sm text-text-muted">
        Ghép mỗi kana với romaji tương ứng — {matched.size}/{set.length} cặp
      </p>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {renderCol(kanaTiles)}
        {renderCol(romajiTiles)}
      </div>
      {done && (
        <AnswerBar
          status={mistakes === 0 ? 'correct' : 'wrong'}
          solution={mistakes === 0 ? undefined : `${mistakes} lần ghép sai`}
          onNext={onNext}
          reduced={reduced}
        />
      )}
    </div>
  );
}
