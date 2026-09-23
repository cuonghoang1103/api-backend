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

type Row = InsightIssue & { idleDays?: number };

export default function HealthTab({ pid, config, onOpenIssue }: { pid: number; config: ProjectConfig; onOpenIssue: (num: number) => void }) {
  const q = useQuery({ queryKey: [...wk.reports(pid), 'insights'], queryFn: () => workApi.insights(pid), staleTime: 30_000 });

  if (q.isLoading) return <div className="flex justify-center py-16"><Spinner size={20} /></div>;
  if (q.error || !q.data) {
    return <EmptyState title="Could not load project health" body={q.error ? workError(q.error) : undefined} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />;
  }
  const d = q.data;
  const u = unitLabel(d.unit);

  return (
    <div className="space-y-4">
      <BriefCard pid={pid} config={config} />
      <Verdict d={d} />

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <StatCell label="Overdue" value={d.overdue.length} tone={d.overdue.length ? 'red' : 'green'} hint={d.overdue.length ? 'Past due date' : 'All on time'} />
        <StatCell label="Due in 3 days" value={d.dueSoon.length} tone={d.dueSoon.length ? 'accent' : undefined} hint="Coming up" />
        <StatCell label="Stuck > 5 days" value={d.stale.length} tone={d.stale.length ? 'red' : 'green'} hint="In progress, no update" />
        <StatCell label="Urgent & unassigned" value={d.unassignedUrgent.length} tone={d.unassignedUrgent.length ? 'red' : 'green'} hint="High priority, no owner" />
      </div>

      <IssueSection
        title="Overdue"
        icon={<AlertTriangle size={14} className="text-[var(--w-red)]" />}
        rows={d.overdue}
        empty="Nothing overdue. Nice work keeping dates honest."
        meta={(r) => <span className="font-medium text-[var(--w-red)]">Due {formatDate(r.dueDate)}</span>}
        onOpen={onOpenIssue}
      />
      <IssueSection
        title="Due in the next 3 days"
        icon={<Clock size={14} className="text-[var(--w-accent-text)]" />}
        rows={d.dueSoon}
        empty="No deadlines in the next 3 days."
        meta={(r) => <span>Due {formatDate(r.dueDate)}</span>}
        onOpen={onOpenIssue}
      />
      <IssueSection
        title="Stuck for more than 5 days"
        icon={<Hourglass size={14} className="text-[var(--w-orange)]" />}
        rows={d.stale}
        empty="Nothing is stuck. Work in progress is moving."
        meta={(r) => <span className="font-medium text-[var(--w-orange)]">Idle {r.idleDays ?? '?'} days</span>}
        onOpen={onOpenIssue}
      />
      <IssueSection
        title="Urgent & unassigned"
        icon={<UserX size={14} className="text-[var(--w-red)]" />}
        rows={d.unassignedUrgent}
        empty="Every urgent issue has an owner."
        meta={(r) => (r.dueDate ? <span>Due {formatDate(r.dueDate)}</span> : null)}
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
        No active sprint. Start a sprint to get an on-track forecast.
      </div>
    );
  }
  const risk = r.atRisk;
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-[var(--w-radius-lg)] border px-4 py-3',
        risk
          ? 'border-[color-mix(in_srgb,var(--w-red)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-red)_8%,transparent)]'
          : 'border-[color-mix(in_srgb,var(--w-green)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-green)_8%,transparent)]',
      )}
    >
      {risk ? <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[var(--w-red)]" /> : <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--w-green)]" />}
      <div className="min-w-0">
        <div className={cn('text-[14px] font-semibold', risk ? 'text-[var(--w-red)]' : 'text-[var(--w-green)]')}>
          {risk
            ? `Sprint at risk: needs ${num(r.neededPerDay)} ${u}/day, team is doing ${num(r.recentPerDay)} ${u}/day`
            : r.remaining === 0 ? 'Sprint complete — everything is done' : 'Sprint on track'}
        </div>
        <div className="mt-0.5 text-[12px] text-[var(--w-text-2)]">
          {r.sprint} · {num(r.remaining)} {u} left · {r.daysLeft} {r.daysLeft === 1 ? 'day' : 'days'} left
          {!risk && r.remaining > 0 && <> · needs {num(r.neededPerDay)} {u}/day, recent pace {num(r.recentPerDay)} {u}/day</>}
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
                  <span className="max-w-[120px] truncate">{r.assignee ? `@${r.assignee}` : 'Unassigned'}</span>
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
      <SectionTitle right={over.size ? <span className="text-[12px] font-medium text-[var(--w-orange)]">{over.size} overloaded</span> : null}>Workload</SectionTitle>
      {!loads.length ? (
        <div className="flex items-center gap-2 text-[13px] text-[var(--w-text-2)]">
          <CheckCircle2 size={14} className="shrink-0 text-[var(--w-green)]" /> No open assigned work right now.
        </div>
      ) : (
        <>
          <ul className="space-y-2.5">
            {loads.map((l) => {
              const hot = over.has(l.username);
              return (
                <li key={l.username} className="grid grid-cols-[minmax(0,100px)_1fr_auto] items-center gap-3 text-[13px] sm:grid-cols-[minmax(0,160px)_1fr_auto]">
                  <span className={cn('truncate', hot && 'font-medium text-[var(--w-orange)]')}>@{l.username}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--w-sunken)]" role="img" aria-label={`${l.username}: ${num(l.points)} ${unit}, ${l.issues} open issues`}>
                    <div className="h-full rounded-full" style={{ width: `${(l.points / max) * 100}%`, background: hot ? 'var(--w-orange)' : 'var(--w-accent)' }} />
                  </div>
                  <span className="whitespace-nowrap text-right text-[12px] tabular-nums text-[var(--w-text-2)]">
                    {num(l.points)} {unit} · {l.issues} {l.issues === 1 ? 'issue' : 'issues'}
                  </span>
                </li>
              );
            })}
          </ul>
          {over.size > 0 && (
            <p className="mt-3 text-[12px] text-[var(--w-text-3)]">Highlighted members carry more than 1.6× the team average. Consider rebalancing.</p>
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
      toast.success('Brief updated for the whole team');
    },
    onError: (err) => {
      if (isAiQuotaError(err)) setUpgrade(true);
      else toast.error(workError(err, 'Could not generate the brief'));
    },
  });

  return (
    <Card className="p-0">
      <div className="flex flex-wrap items-center gap-2 px-4 pb-2 pt-3">
        <Sparkles size={14} className="text-[var(--w-accent-text)]" />
        <h3 className="text-[13px] font-semibold">Today&apos;s brief</h3>
        {brief && (
          <span className="min-w-0 truncate text-[12px] text-[var(--w-text-3)]" title={new Date(brief.at).toLocaleString('en-US')}>
            Generated {relativeTime(brief.at)}{author ? ` by ${userName(author)}` : ''}
          </span>
        )}
        {canUse && (
          <button type="button" className="w-btn w-btn-sm ml-auto" disabled={gen.isPending} onClick={() => gen.mutate()}>
            {gen.isPending ? <Spinner size={12} /> : brief ? <RefreshCw size={12} /> : <Sparkles size={13} />}
            {gen.isPending ? 'Writing…' : brief ? 'Refresh' : 'Generate brief'}
          </button>
        )}
      </div>
      <div className={cn('border-t border-[var(--w-border)] px-4 py-3', gen.isPending && 'opacity-60')}>
        {brief ? (
          <AiMarkdown text={brief.text} />
        ) : (
          <p className="text-[13px] leading-relaxed text-[var(--w-text-2)]">
            A 3–6 bullet stand-up summary of risks and overdue work. An admin can also turn on an automatic brief at 08:00.
            {canUse ? ' Generating one uses 1 AI request and shares it with everyone on the project.' : ''}
          </p>
        )}
      </div>
      <UpgradeDialog open={upgrade} onClose={() => setUpgrade(false)} />
    </Card>
  );
}
