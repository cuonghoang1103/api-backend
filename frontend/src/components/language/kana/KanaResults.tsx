'use client';
/**
 * Results screen: score ring, per-stage breakdown, retry / re-configure.
 * Confetti celebration at ≥90%.
 */
import { useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, SlidersHorizontal, Trophy } from 'lucide-react';
import { ProgressRing } from '@/components/language/primitives';
import type { QuestionResult, StageType } from './types';
import { STAGE_META, ACCENT_TEXT } from './stages';

export function KanaResults({
  results,
  onRetry,
  onReconfigure,
  reduced,
}: {
  results: QuestionResult[];
  onRetry: () => void;
  onReconfigure: () => void;
  reduced: boolean;
}) {
  const total = results.length;
  const correct = results.filter((r) => r.correct).length;
  const pct = total ? Math.round((correct / total) * 100) : 0;

  const perStage = useMemo(() => {
    const map = new Map<StageType, { correct: number; total: number }>();
    for (const r of results) {
      const cur = map.get(r.stage) ?? { correct: 0, total: 0 };
      cur.total += 1;
      if (r.correct) cur.correct += 1;
      map.set(r.stage, cur);
    }
    return [...map.entries()].sort((a, b) => STAGE_META[a[0]].n - STAGE_META[b[0]].n);
  }, [results]);

  useEffect(() => {
    if (pct >= 90 && !reduced) {
      const end = Date.now() + 900;
      const tick = () => {
        confetti({ particleCount: 4, spread: 70, startVelocity: 42, origin: { y: 0.35 }, scalar: 0.9 });
        if (Date.now() < end) requestAnimationFrame(tick);
      };
      tick();
    }
  }, [pct, reduced]);

  const praise =
    pct >= 90 ? 'Xuất sắc!' : pct >= 70 ? 'Làm tốt lắm!' : pct >= 50 ? 'Khá ổn, luyện thêm nhé' : 'Cùng luyện lại nào';

  return (
    <div className="mx-auto max-w-md">
      <div className="flex flex-col items-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 text-center">
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neon-violet/15 text-neon-violet">
          <Trophy size={24} />
        </span>
        <ProgressRing value={pct} size={104} stroke={9} />
        <p className="mt-3 font-heading text-xl font-bold text-text-primary">{praise}</p>
        <p className="mt-1 text-sm text-text-secondary">
          Đúng <span className="font-semibold text-neon-green">{correct}</span> / {total} câu
        </p>
      </div>

      {perStage.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-semibold text-text-secondary">Theo từng bài</h3>
          {perStage.map(([stage, s]) => {
            const meta = STAGE_META[stage];
            const Icon = meta.icon;
            const p = s.total ? Math.round((s.correct / s.total) * 100) : 0;
            return (
              <div
                key={stage}
                className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2.5"
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-card)] ${ACCENT_TEXT[meta.accent]}`}>
                  <Icon size={16} />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary">{meta.name}</span>
                <span className="text-sm text-text-secondary">
                  {s.correct}/{s.total}
                </span>
                <span className="w-10 text-right text-sm font-semibold text-text-primary">{p}%</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onReconfigure}
          className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-3 text-sm font-semibold text-text-secondary transition hover:text-text-primary"
        >
          <SlidersHorizontal size={16} /> Đổi cài đặt
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-neon-violet px-4 py-3 text-sm font-bold text-white transition hover:opacity-90"
        >
          <RotateCcw size={16} /> Làm lại
        </button>
      </div>
    </div>
  );
}
