'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';
import { isAiQuotaError, workApi, workError, type ProjectConfig, type SprintReportItem } from '@/lib/work-api';
import { wk, type Lookups } from '@/components/work/hooks';
import { EmptyState, formatDate, Spinner } from '@/components/work/ui';
import { ActionGroup, type ActionItem } from '@/components/work/ai/ActionCard';
import AiMarkdown from '@/components/work/ai/AiMarkdown';
import UpgradeDialog from '@/components/work/ai/UpgradeDialog';
import { cn } from '@/lib/utils';
import { Card, num, SectionTitle, SprintSelect, unitLabel, useAllSprints, useReportableSprints } from './shared';
import { currentWorkLocale, wt } from '@/components/work/i18n';

export default function SprintReportTab({ pid, config, lk }: { pid: number; config: ProjectConfig; lk: Lookups }) {
  const sprintsQ = useAllSprints(pid);
  const sprints = useReportableSprints(sprintsQ.data);
  const [sprintId, setSprintId] = useState<number | null>(null);

  useEffect(() => {
    if (!sprints.length) return;
    if (sprintId === null || !sprints.some((s) => s.id === sprintId)) setSprintId(sprints[0].id);
  }, [sprints, sprintId]);

  const q = useQuery({
    queryKey: [...wk.reports(pid), 'sprint', sprintId],
    queryFn: () => workApi.sprintReport(pid, sprintId!),
    enabled: sprintId !== null,
  });

  const byNumber = useMemo(() => {
    const m = new Map<number, SprintReportItem>();
    q.data?.report.completed.forEach((i) => m.set(i.number, i));
    q.data?.report.incomplete.forEach((i) => m.set(i.number, i));
    return m;
  }, [q.data]);

  if (sprintsQ.isLoading) return <div className="flex justify-center py-16"><Spinner size={20} /></div>;
  if (sprintsQ.error) return <EmptyState title={wt('rep.loadSprintsFailed')} body={workError(sprintsQ.error)} />;
  if (!sprints.length) return <EmptyState title={wt('rep.noSprints')} body={wt('rep.noSprintsReport')} />;

  const href = (n: number) => `/work/${config.workspace.slug}/${config.key}/issue/${n}`;
  const d = q.data;
  const r = d?.report;
  const u = unitLabel(r?.unit);
  const total = r ? r.completed.length + r.incomplete.length : 0;
  const scopeChanged = !!r && (r.added.length > 0 || r.removed.length > 0);

  const issueRow = (n: number, item?: SprintReportItem) => (
    <li key={n} className="flex min-w-0 items-center gap-3 border-b border-[var(--w-border)] px-3 py-2 last:border-0">
      <Link href={href(n)} className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)] hover:underline">{lk.issueKey(n)}</Link>
      <Link href={href(n)} className="min-w-0 flex-1 truncate text-[13px] hover:underline">{item?.title ?? <span className="text-[var(--w-text-3)]">{wt('rep.openIssue')}</span>}</Link>
      {item && <span className="shrink-0 text-[12px] tabular-nums text-[var(--w-text-3)]">{num(item.points)} {u}</span>}
    </li>
  );

  const section = (title: string, nums: number[], empty: string, items?: SprintReportItem[]) => (
    <section>
      <SectionTitle right={<span className="text-[12px] text-[var(--w-text-3)]">{nums.length}</span>}>{title}</SectionTitle>
      {nums.length ? (
        <ul className="rounded-[var(--w-radius-lg)] border border-[var(--w-border)] bg-[var(--w-panel)]">
          {nums.map((n, i) => issueRow(n, items?.[i] ?? byNumber.get(n)))}
        </ul>
      ) : (
        <div className="rounded-[var(--w-radius-lg)] border border-dashed border-[var(--w-border-strong)] px-3 py-3 text-[12px] text-[var(--w-text-3)]">{empty}</div>
      )}
    </section>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <SprintSelect sprints={sprints} value={sprintId} onChange={setSprintId} />
        {d && (
          <span className="text-[12px] text-[var(--w-text-3)]">
            {d.sprint.state === 'CLOSED'
              ? wt('rep.completedSnap', { d: d.sprint.completedAt ? formatDate(d.sprint.completedAt) : '' })
              : wt('rep.inProgressLive')}
          </span>
        )}
      </div>

      {q.isLoading ? (
        <div className="flex justify-center py-16"><Spinner size={20} /></div>
      ) : q.error ? (
        <EmptyState title={wt('rep.loadReportFailed')} body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>{wt('common.tryAgain')}</button>} />
      ) : r ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-[15px] font-semibold">
              {wt('rep.nOfCompleted', { a: r.completed.length, count: total })}
              <span className="text-[var(--w-text-3)]"> · </span>
              {wt('rep.ptsOf', { a: num(r.completedPoints), b: num(r.committedPoints), u })}
            </div>
            {scopeChanged && (
              <span className="rounded-full border border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--w-accent-text)]">
                {wt('rep.scopeChanged', { a: r.added.length, b: r.removed.length })}
              </span>
            )}
          </div>
          {d?.sprint.goal && (
            <div className="text-[13px] text-[var(--w-text-2)]"><span className="font-medium text-[var(--w-text)]">{wt('rep.sprintGoal')}</span> {d.sprint.goal}</div>
          )}
          {section(wt('rep.secCompleted'), r.completed.map((i) => i.number), wt('rep.noneCompleted'), r.completed)}
          {section(wt('rep.secNot'), r.incomplete.map((i) => i.number), wt('rep.allCompleted'), r.incomplete)}
          {section(wt('rep.secAdded'), r.added, wt('rep.noneAdded'))}
          {section(wt('rep.secRemoved'), r.removed, wt('rep.noneRemoved'))}
          {sprintId !== null && <RetroCard key={sprintId} pid={pid} config={config} sprintId={sprintId} />}
        </>
      ) : null}
    </div>
  );
}

// ─── Retrospective (AI) ──────────────────────────────────────────

type Lang = 'en' | 'vi';
const LANGS: Array<{ id: Lang; label: string }> = [
  { id: 'en', label: 'English' },
  { id: 'vi', label: 'Tiếng Việt' },
];

/**
 * Số liệu sprint do mã tính + ghi chú nhóm ⇒ AI viết retro. Action item là
 * ĐỀ XUẤT (ActionGroup) — chỉ thành task khi người dùng bấm Apply.
 */
function RetroCard({ pid, config, sprintId }: { pid: number; config: ProjectConfig; sprintId: number }) {
  const canUse = config.permissions.useAi;
  const [notes, setNotes] = useState('');
  const [language, setLanguage] = useState<Lang>(() => currentWorkLocale());
  const [summary, setSummary] = useState<string | null>(null);
  const [items, setItems] = useState<ActionItem[]>([]);
  const [upgrade, setUpgrade] = useState(false);

  const gen = useMutation({
    mutationFn: () => workApi.aiRetro(pid, { sprintId, notes: notes.trim() || null, language }),
    onSuccess: (r) => {
      setSummary(r.summary);
      setItems(r.actions.map((action, i) => ({ id: `retro-${Date.now()}-${i}`, action, status: 'pending' })));
    },
    onError: (err) => {
      if (isAiQuotaError(err)) setUpgrade(true);
      else toast.error(workError(err, wt('rep.retroFailed')));
    },
  });
  const onUpdate = useCallback((id: string, patch: Partial<ActionItem>) => {
    setItems((list) => list.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }, []);

  return (
    <Card className="p-0">
      <div className="flex flex-wrap items-center gap-2 px-4 pb-2 pt-3">
        <Sparkles size={14} className="text-[var(--w-accent-text)]" />
        <h3 className="text-[13px] font-semibold">{wt('rep.retroAi')}</h3>
        <span className="text-[12px] text-[var(--w-text-3)]">What went well, what didn&apos;t, and action items</span>
      </div>
      <div className="space-y-3 border-t border-[var(--w-border)] px-4 py-3">
        <div>
          <label htmlFor={`retro-notes-${sprintId}`} className="w-label">{wt('rep.teamNotes')}</label>
          <textarea
            id={`retro-notes-${sprintId}`}
            className="w-input text-[13px]"
            rows={4}
            maxLength={20_000}
            value={notes}
            disabled={!canUse}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={wt('rep.notesPh')}
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0">
            <div className="w-label">{wt('common.language')}</div>
            <div role="radiogroup" aria-label={wt('common.language')} className="inline-flex max-w-full rounded-[var(--w-radius)] border border-[var(--w-border-strong)] bg-[var(--w-sunken)] p-0.5">
              {LANGS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={language === o.id}
                  onClick={() => setLanguage(o.id)}
                  className={cn(
                    'whitespace-nowrap rounded-[5px] px-2.5 py-1 text-[12px] font-medium transition-colors',
                    language === o.id ? 'bg-[var(--w-panel)] text-[var(--w-text)] shadow-[0_1px_2px_rgba(0,0,0,0.12)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]',
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <button type="button" className="w-btn w-btn-primary w-full sm:ml-auto sm:w-auto" disabled={!canUse || gen.isPending} onClick={() => gen.mutate()}>
            {gen.isPending ? <Spinner size={14} /> : <Sparkles size={14} />}
            {gen.isPending ? wt('rep.writing') : summary ? wt('rep.regenRetro') : wt('rep.genRetro')}
          </button>
        </div>
        <p className="text-[12px] leading-relaxed text-[var(--w-text-3)]">
          {wt('rep.retroNote')}
        </p>
        {!canUse && (
          <p className="text-[12px] text-[var(--w-orange)]">{wt('rep.noAiPerm')}</p>
        )}
      </div>

      {summary && (
        <div className={cn('border-t border-[var(--w-border)] px-4 py-4', gen.isPending && 'opacity-60')}>
          <AiMarkdown text={summary} />
          {items.length > 0 && (
            <div className="mt-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.03em] text-[var(--w-accent-text)]">{wt('rep.proposed')}</div>
              <ActionGroup config={config} items={items} onUpdate={onUpdate} />
            </div>
          )}
        </div>
      )}
      <UpgradeDialog open={upgrade} onClose={() => setUpgrade(false)} />
    </Card>
  );
}
