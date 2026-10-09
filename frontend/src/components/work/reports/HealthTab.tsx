'use client';

/**
 * Tab "Health" — sức khoẻ dự án tính bằng MÃ ở backend (không tốn lượt AI):
 * trễ hạn, sắp tới hạn, kẹt lâu, gấp mà chưa ai nhận, tải từng người, rủi ro sprint.
 * Trên cùng là bản tin hằng ngày (AI) lưu ở settings.dailyBrief — cả nhóm đọc chung.
 */

import { useState, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle2, Clock, Hourglass, RefreshCw, Sparkles, UserX } from 'lucide-react';
import {
  isAiQuotaError, userName, workApi, workError, type DailyBrief, type InsightIssue, type InsightsData, type ProjectConfig,
} from '@/lib/work-api';
import { wk } from '@/components/work/hooks';
import { EmptyState, formatDate, relativeTime, Spinner } from '@/components/work/ui';
import AiMarkdown from '@/components/work/ai/AiMarkdown';
import UpgradeDialog from '@/components/work/ai/UpgradeDialog';
import { cn } from '@/lib/utils';
import { Card, num, SectionTitle, StatCell, unitLabel } from './shared';
import { wfmt, wt } from '@/components/work/i18n';

type Row = InsightIssue & { idleDays?: number };

export default function HealthTab({ pid, config, onOpenIssue }: { pid: number; config: ProjectConfig; onOpenIssue: (num: number) => void }) {
  const q = useQuery({ queryKey: [...wk.reports(pid), 'insights'], queryFn: () => workApi.insights(pid), staleTime: 30_000 });

  if (q.isLoading) return <div className="flex justify-center py-16"><Spinner size={20} /></div>;
  if (q.error || !q.data) {
    return <EmptyState title={wt('rep.loadHealthFailed')} body={q.error ? workError(q.error) : undefined} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>{wt('common.tryAgain')}</button>} />;
  }
  const d = q.data;
  const u = unitLabel(d.unit);

  return (
    <div className="space-y-4">
      <BriefCard pid={pid} config={config} />
      <Verdict d={d} />

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <StatCell label={wt('common.overdue')} value={d.overdue.length} tone={d.overdue.length ? 'red' : 'green'} hint={d.overdue.length ? wt('rep.pastDue') : wt('rep.allOnTime')} />
        <StatCell label={wt('rep.due3')} value={d.dueSoon.length} tone={d.dueSoon.length ? 'accent' : undefined} hint={wt('rep.comingUp')} />
        <StatCell label={wt('rep.stuck5')} value={d.stale.length} tone={d.stale.length ? 'red' : 'green'} hint={wt('rep.inProgNoUpdate')} />
        <StatCell label={wt('rep.urgentUnassigned')} value={d.unassignedUrgent.length} tone={d.unassignedUrgent.length ? 'red' : 'green'} hint={wt('rep.highNoOwner')} />
      </div>

      <IssueSection
        title={wt('common.overdue')}
        icon={<AlertTriangle size={14} className="text-[var(--w-red)]" />}
        rows={d.overdue}
        empty={wt('rep.nothingOverdue')}
        meta={(r) => <span className="font-medium text-[var(--w-red)]">{wt('rep.dueD', { d: formatDate(r.dueDate) })}</span>}
        onOpen={onOpenIssue}
      />
      <IssueSection
        title={wt('rep.dueNext3')}
        icon={<Clock size={14} className="text-[var(--w-accent-text)]" />}
        rows={d.dueSoon}
        empty={wt('rep.noDeadlines3')}
        meta={(r) => <span>{wt('rep.dueD', { d: formatDate(r.dueDate) })}</span>}
        onOpen={onOpenIssue}
      />
      <IssueSection
        title={wt('rep.stuckMore5')}
        icon={<Hourglass size={14} className="text-[var(--w-orange)]" />}
        rows={d.stale}
        empty={wt('rep.nothingStuck')}
        meta={(r) => <span className="font-medium text-[var(--w-orange)]">{wt('rep.idleDays', { n: r.idleDays ?? '?' })}</span>}
        onOpen={onOpenIssue}
      />
      <IssueSection
        title={wt('rep.urgentUnassigned')}
        icon={<UserX size={14} className="text-[var(--w-red)]" />}
        rows={d.unassignedUrgent}
        empty={wt('rep.everyUrgentOwner')}
        meta={(r) => (r.dueDate ? <span>{wt('rep.dueD', { d: formatDate(r.dueDate) })}</span> : null)}
        onOpen={onOpenIssue}
      />

      <Workload d={d} unit={u} />
    </div>
  );
}

function Verdict({ d }: { d: InsightsData }) {
  const r = d.sprintRisk;
  const u = unitLabel(d.unit);
  if (!r) {
    return (
      <div className="rounded-[var(--w-radius-lg)] border border-[var(--w-border)] bg-[var(--w-panel)] px-4 py-3 text-[13px] text-[var(--w-text-2)]">
        {wt('rep.noActiveSprint')}
      </div>
    );
  }
  const risk = r.atRisk;
  // Trạng thái trung tính: chưa ước lượng / mới ngày đầu — không xanh, không đỏ.
  const neutral = !risk && (r.status === 'NO_ESTIMATES' || r.status === 'TOO_EARLY');
  const headline = risk
    ? r.daysLeft === 0
      ? wt('rep.sprintOverdue', { n: num(r.remaining), u })
      : wt('rep.sprintAtRisk', { a: num(r.neededPerDay), b: num(r.recentPerDay), u })
    : r.status === 'NO_ESTIMATES'
      ? wt('rep.noEstimates')
      : r.status === 'TOO_EARLY'
        ? wt('rep.tooEarly', { n: r.elapsedDays ?? 1 })
        : r.remaining === 0 ? wt('rep.sprintComplete') : wt('rep.sprintOnTrack');
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-[var(--w-radius-lg)] border px-4 py-3',
        neutral
          ? 'border-[var(--w-border)] bg-[var(--w-panel)]'
          : risk
            ? 'border-[color-mix(in_srgb,var(--w-red)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-red)_8%,transparent)]'
            : 'border-[color-mix(in_srgb,var(--w-green)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-green)_8%,transparent)]',
      )}
    >
      {risk ? <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[var(--w-red)]" />
        : neutral ? <Clock size={18} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" />
          : <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--w-green)]" />}
      <div className="min-w-0">
        <div className={cn('text-[14px] font-semibold', neutral ? 'text-[var(--w-text)]' : risk ? 'text-[var(--w-red)]' : 'text-[var(--w-green)]')}>
          {headline}
        </div>
        <div className="mt-0.5 text-[12px] text-[var(--w-text-2)]">
          {wt('rep.leftLine', { s: r.sprint, n: num(r.remaining), u, of: r.total !== undefined && r.total > 0 ? wt('rep.ofTotal', { n: num(r.total) }) : '', count: r.daysLeft })}
          {r.status === 'TOO_EARLY' && r.done !== undefined && <>{wt('rep.doneSoFar', { n: num(r.done), u })}</>}
          {!risk && !neutral && r.remaining > 0 && <>{wt('rep.needsPace', { a: num(r.neededPerDay), b: num(r.recentPerDay), u })}</>}
        </div>
      </div>
    </div>
  );
}

function IssueSection({ title, icon, rows, empty, meta, onOpen }: {
  title: string; icon: ReactNode; rows: Row[]; empty: string; meta: (r: Row) => ReactNode; onOpen: (n: number) => void;
}) {
  return (
    <Card className="p-0">
      <div className="flex items-center gap-2 px-4 pb-2 pt-3">
        {icon}
        <h3 className="text-[13px] font-semibold">{title}</h3>
        <span className="ml-auto text-[12px] tabular-nums text-[var(--w-text-3)]">{rows.length}</span>
      </div>
      {!rows.length ? (
        <div className="flex items-center gap-2 border-t border-[var(--w-border)] px-4 py-3 text-[13px] text-[var(--w-text-2)]">
          <CheckCircle2 size={14} className="shrink-0 text-[var(--w-green)]" /> {empty}
        </div>
      ) : (
        <ul>
          {rows.map((r) => (
            <li key={r.key} className="border-t border-[var(--w-border)]">
              <button
                type="button"
                onClick={() => onOpen(r.number)}
                className="flex w-full min-w-0 flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 text-left text-[13px] hover:bg-[var(--w-hover)] md:flex-nowrap"
              >
                <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{r.key}</span>
                <span className="min-w-0 flex-1 basis-[60%] truncate font-medium md:basis-auto">{r.title}</span>
                <span className="flex max-w-full flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[var(--w-text-2)] md:shrink-0 md:flex-nowrap">
                  <span className="max-w-[120px] truncate">{r.assignee ? `@${r.assignee}` : wt('common.unassigned')}</span>
                  <span className="max-w-[110px] truncate rounded-[4px] bg-[var(--w-sunken)] px-1.5 py-px text-[11px]">{r.status}</span>
                  {meta(r)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function Workload({ d, unit }: { d: InsightsData; unit: string }) {
  const loads = [...d.loads].sort((a, b) => b.points - a.points || b.issues - a.issues);
  const over = new Set(d.overloaded.map((o) => o.username));
  const max = Math.max(1, ...loads.map((l) => l.points));
  return (
    <Card>
      <SectionTitle right={over.size ? <span className="text-[12px] font-medium text-[var(--w-orange)]">{wt('rep.nOverloaded', { n: over.size })}</span> : null}>{wt('rep.workload')}</SectionTitle>
      {d.loadScope && <p className="-mt-1 mb-2 text-[12px] text-[var(--w-text-3)]">{wt('rep.countingWork', { where: d.loadScope.kind === 'sprint' ? wt('rep.inThe', { s: d.loadScope.label }) : d.loadScope.label, count: d.loadScope.workingDaysLeft })}</p>}
      {!loads.length ? (
        <div className="flex items-center gap-2 text-[13px] text-[var(--w-text-2)]">
          <CheckCircle2 size={14} className="shrink-0 text-[var(--w-green)]" /> {wt('rep.noOpenAssigned')}
        </div>
      ) : (
        <>
          <ul className="space-y-2.5">
            {loads.map((l) => {
              const hot = over.has(l.username);
              return (
                <li key={l.username} className="grid grid-cols-[minmax(0,100px)_1fr_auto] items-center gap-3 text-[13px] sm:grid-cols-[minmax(0,160px)_1fr_auto]">
                  <span className={cn('truncate', hot && 'font-medium text-[var(--w-orange)]')}>@{l.username}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--w-sunken)]" role="img" aria-label={wt('rep.loadAria', { u: l.username, n: num(l.points), unit, count: l.issues })}>
                    <div className="h-full rounded-full" style={{ width: `${(l.points / max) * 100}%`, background: hot ? 'var(--w-orange)' : 'var(--w-accent)' }} />
                  </div>
                  <span className="whitespace-nowrap text-right text-[12px] tabular-nums text-[var(--w-text-2)]">
                    {num(l.points)}{l.capacity != null ? ` / ${num(l.capacity)}` : ''} {unit} · {wt('rep.nIssues', { count: l.issues })}
                  </span>
                </li>
              );
            })}
          </ul>
          {over.size > 0 && (
            <p className="mt-3 text-[12px] text-[var(--w-text-3)]">{wt('rep.overNote')}</p>
          )}
        </>
      )}
    </Card>
  );
}

// ─── Bản tin hôm nay (AI) ────────────────────────────────────────

function readBrief(settings: Record<string, unknown>): DailyBrief | null {
  const b = settings?.dailyBrief as Partial<DailyBrief> | undefined;
  return b && typeof b.text === 'string' && typeof b.at === 'string' ? { text: b.text, at: b.at, by: Number(b.by) } : null;
}

function BriefCard({ pid, config }: { pid: number; config: ProjectConfig }) {
  const qc = useQueryClient();
  const canUse = config.permissions.useAi;
  const brief = readBrief(config.settings);
  const author = brief ? config.members.find((m) => m.id === brief.by) : undefined;
  const [upgrade, setUpgrade] = useState(false);

  const gen = useMutation({
    mutationFn: () => workApi.aiDailyBrief(pid),
    onSuccess: (r) => {
      // Vá ngay để không nháy bản cũ, rồi tải lại cấu hình dự án cho chắc.
      qc.setQueryData<ProjectConfig>(wk.project(pid), (old) => (old ? { ...old, settings: { ...old.settings, dailyBrief: { text: r.text, at: r.at, by: r.by } } } : old));
      qc.invalidateQueries({ queryKey: wk.project(pid), exact: true });
      toast.success(wt('rep.briefUpdated'));
    },
    onError: (err) => {
      if (isAiQuotaError(err)) setUpgrade(true);
      else toast.error(workError(err, wt('rep.briefFailed')));
    },
  });

  return (
    <Card className="p-0">
      <div className="flex flex-wrap items-center gap-2 px-4 pb-2 pt-3">
        <Sparkles size={14} className="text-[var(--w-accent-text)]" />
        <h3 className="text-[13px] font-semibold">{wt('rep.todaysBrief')}</h3>
        {brief && (
          <span className="min-w-0 truncate text-[12px] text-[var(--w-text-3)]" title={new Date(brief.at).toLocaleString(wfmt.intl())}>
            {wt('rep.generatedBy', { t: relativeTime(brief.at), by: author ? wt('rep.byName', { n: userName(author) }) : '' })}
          </span>
        )}
        {canUse && (
          <button type="button" className="w-btn w-btn-sm ml-auto" disabled={gen.isPending} onClick={() => gen.mutate()}>
            {gen.isPending ? <Spinner size={12} /> : brief ? <RefreshCw size={12} /> : <Sparkles size={13} />}
            {gen.isPending ? wt('rep.writing') : brief ? wt('rep.refresh') : wt('rep.genBrief')}
          </button>
        )}
      </div>
      <div className={cn('border-t border-[var(--w-border)] px-4 py-3', gen.isPending && 'opacity-60')}>
        {brief ? (
          <AiMarkdown text={brief.text} />
        ) : (
          <p className="text-[13px] leading-relaxed text-[var(--w-text-2)]">
            {wt('rep.briefIntro')}
            {canUse ? wt('rep.briefUses') : ''}
          </p>
        )}
      </div>
      <UpgradeDialog open={upgrade} onClose={() => setUpgrade(false)} />
    </Card>
  );
}
