'use client';

/**
 * dm5 G1 (A12): bảng số liệu sprint ngay trong retro — thảo luận dựa trên số, không dựa trên cảm giác
 * (GET /projects/:pid/retros/:rid/facts). "CI xanh lượt đầu" là ước lượng: CI success và không có lượt đẩy nào lên nhánh
 * sau khi mở PR (CT Work không lưu lịch sử từng lượt chạy CI).
 */

import { useQuery } from '@tanstack/react-query';
import { BarChart3 } from 'lucide-react';
import { agileApi, agileKeys } from '@/lib/work-agile-api';
import { Spinner } from '../ui';
import { wt } from '../i18n';

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="min-w-0 rounded-[8px] bg-[var(--w-sunken)] px-2.5 py-2">
      <div className="truncate text-[11px] uppercase tracking-wide text-[var(--w-text-3)]">{label}</div>
      <div className="text-[15px] font-semibold tabular">{value}</div>
      {hint && <div className="truncate text-[11px] text-[var(--w-text-3)]" title={hint}>{hint}</div>}
    </div>
  );
}

const pctText = (p: number | null | undefined) => (p == null ? '—' : `${p}%`);

export default function RetroFacts({ pid, rid }: { pid: number; rid: number }) {
  const q = useQuery({ queryKey: [...agileKeys.retro(pid, rid), 'facts'], queryFn: () => agileApi.retroFacts(pid, rid), staleTime: 30_000 });
  return (
    <section className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-3" data-testid="retro-facts">
      <h3 className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold"><BarChart3 size={13} /> {wt('agile.factsTitle')}{q.data?.sprint ? ` · ${q.data.sprint.name}` : ''}</h3>
      {q.isLoading ? <div className="flex items-center gap-2 text-[12px] text-[var(--w-text-3)]"><Spinner size={12} /> {wt('agile.factsLoading')}</div>
        : !q.data?.sprint ? <p className="text-[12px] text-[var(--w-text-3)]">{wt('agile.factsNoSprint')}</p>
          : (() => {
            const f = q.data;
            const u = f.unit === 'HOURS' ? 'h' : wt('agile.factsPts');
            const bugs = Object.entries(f.bugs?.byActivity ?? {}).map(([k, n]) => `${k === 'UNKNOWN' ? '?' : k} ${n}`).join(' · ');
            return (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <Stat label={wt('agile.factsDone')} value={`${f.done?.points ?? 0}/${f.done?.planned ?? 0} ${u}`} hint={wt('agile.factsDoneHint', { pct: pctText(f.done?.pct), done: f.done?.issuesDone ?? 0, total: f.done?.issuesTotal ?? 0, added: f.done?.added ?? 0 })} />
                <Stat label={wt('agile.factsHours')} value={`${f.hours?.logged ?? 0}/${f.hours?.estimated ?? 0}h`} hint={wt('agile.factsHoursHint', { pct: pctText(f.hours?.pct) })} />
                <Stat label={wt('agile.factsBugs')} value={String(f.bugs?.total ?? 0)} hint={bugs ? `${bugs}${f.bugs?.leakage ? ` · ${wt('agile.factsLeak', { n: f.bugs.leakage })}` : ''}` : undefined} />
                <Stat label={wt('agile.factsCi')} value={pctText(f.ciFirstTry?.pct)} hint={wt('agile.factsCiHint', { g: f.ciFirstTry?.green ?? 0, n: f.ciFirstTry?.withCi ?? 0 })} />
                <Stat label={wt('agile.factsBigPr')} value={f.biggestPr ? `#${f.biggestPr.number}` : '—'} hint={f.biggestPr ? wt('agile.factsLines', { n: f.biggestPr.lines }) : undefined} />
              </div>
            );
          })()}
    </section>
  );
}
