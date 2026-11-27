'use client';

/**
 * dm5 G4 (D16, 27/11/2026) — trợ giúp khi luyện bảo vệ (thread chế độ DEFENSE): đồng hồ 40 giây cho mỗi câu trả lời (đếm lại
 * mỗi khi hội đồng hỏi câu mới), khung PREP (Point · Reason · Example · Point). Hội đồng (ai.service › defenseSystem) chấm và
 * đưa "Model answer (PREP)" + "Evidence to show" với link sâu do máy chủ dựng (aiLienKet).
 */

import { useEffect, useState } from 'react';
import { RotateCcw, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { wt } from '@/components/work/i18n';

const LIMIT = 40;

export default function DefenseCoach({ turnKey, busy }: { turnKey: string | number; busy: boolean }) {
  const [left, setLeft] = useState(LIMIT);
  const [runId, setRunId] = useState(0);
  useEffect(() => { setLeft(LIMIT); }, [turnKey, runId]);
  useEffect(() => {
    if (busy) return;
    const t = setInterval(() => setLeft((s) => (s > -99 ? s - 1 : s)), 1000);
    return () => clearInterval(t);
  }, [busy, turnKey, runId]);
  const up = left <= 0;
  return (
    <div className="mb-2 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-2.5 py-2 text-[12px]" data-testid="defense-coach">
      <div className="flex items-center gap-2">
        <Timer size={13} className={cn(up ? 'text-[var(--w-red-text)]' : 'text-[var(--w-accent-text)]')} aria-hidden="true" />
        <span className={cn('font-mono font-semibold tabular-nums', up ? 'text-[var(--w-red-text)]' : left <= 10 ? 'text-[var(--w-amber-text,#b45309)]' : 'text-[var(--w-text)]')} aria-live="polite" data-testid="defense-timer">
          {wt('g4.timer40', { s: Math.max(0, left) })}
        </span>
        {up && <span className="text-[var(--w-red-text)]">{wt('g4.timeUp')}</span>}
        <button type="button" className="ml-auto inline-flex items-center gap-1 text-[11.5px] text-[var(--w-text-2)] hover:text-[var(--w-text)]" onClick={() => setRunId((x) => x + 1)}>
          <RotateCcw size={11} /> {wt('g4.restartTimer')}
        </button>
      </div>
      <div className="mt-1.5 h-1 rounded-full bg-[var(--w-border)]" aria-hidden="true">
        <div className={cn('h-1 rounded-full transition-[width] duration-1000 ease-linear', up ? 'bg-[var(--w-red)]' : 'bg-[var(--w-accent)]')} style={{ width: `${Math.max(0, (left / LIMIT) * 100)}%` }} />
      </div>
      <details className="mt-1.5">
        <summary className="cursor-pointer text-[11.5px] font-medium text-[var(--w-text-2)]">{wt('g4.prepTitle')}</summary>
        <ol className="mt-1 space-y-0.5 pl-1 text-[11.5px] text-[var(--w-text-2)]">
          <li><b>P</b> · {wt('g4.prepP1')}</li>
          <li><b>R</b> · {wt('g4.prepR')}</li>
          <li><b>E</b> · {wt('g4.prepE')}</li>
          <li><b>P</b> · {wt('g4.prepP2')}</li>
        </ol>
      </details>
    </div>
  );
}
