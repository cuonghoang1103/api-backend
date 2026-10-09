'use client';

/**
 * CTW-28 A13 — mảnh dùng chung của board/backlog/list:
 *   · AgentLeasesProvider + LeaseChipFor: chip "🤖 working · 72%" (lease ACTIVE, từ heartbeat) / chip đỏ "lease expired".
 *     Dữ liệu: GET /projects/:pid/agent-leases; làm tươi qua socket agentProgress (hooks.ts useProjectRealtime).
 *   · AssigneeKindFilter: All / People / Agents — chỉ hiện khi dự án CÓ agent.
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bot, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProjectConfig } from '@/lib/work-api';
import { agentKeys, agentsApi, type LeaseChip } from '@/lib/work-agents-api';
import type { Lookups } from '../hooks';
import { useWorkspaceAgents } from './directory';
import { wt } from '@/components/work/i18n';

const LeasesCtx = createContext<Map<number, LeaseChip> | null>(null);

/** Dự án có agent nào là thành viên không — không có thì không gọi API, không vẽ bộ lọc. */
export const projectHasAgents = (config: ProjectConfig) => config.members.some((m) => m.kind === 'AGENT');

export function AgentLeasesProvider({ config, children }: { config: ProjectConfig; children: ReactNode }) {
  const on = projectHasAgents(config) && !config.clientView;
  useWorkspaceAgents(config.workspace.id, on);
  const q = useQuery({
    queryKey: agentKeys.leases(config.id),
    queryFn: () => agentsApi.leases(config.id),
    enabled: on,
    staleTime: 15_000,
    // Lease hết hạn đổi màu chip mà không cần sự kiện — nhịp 60 s cũng bắt được sweeper.
    refetchInterval: on ? 60_000 : false,
  });
  const map = useMemo(() => new Map((q.data ?? []).map((l) => [l.issueId, l])), [q.data]);
  return <LeasesCtx.Provider value={on ? map : null}>{children}</LeasesCtx.Provider>;
}

export function useLeaseFor(issueId: number): LeaseChip | undefined {
  return useContext(LeasesCtx)?.get(issueId);
}

function ago(iso: string) {
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return wt('agents.secAgo', { n: s });
  const m = Math.round(s / 60);
  if (m < 60) return wt('common.minutesAgo', { n: m });
  return wt('common.hoursAgo', { n: Math.round(m / 60) });
}

export function LeaseBadge({ lease, compact }: { lease: LeaseChip; compact?: boolean }) {
  // ACTIVE nhưng quá hạn (sweeper chưa chạy) ⇒ coi như đã tắt nhịp — đỏ, không phải xanh.
  const stale = lease.status === 'ACTIVE' && new Date(lease.expiresAt).getTime() < Date.now();
  const bad = lease.status === 'EXPIRED' || stale;
  const pct = lease.progressPct;
  const label = bad ? (compact ? wt('agents.stalled') : wt('agents.agentStalled')) : pct !== null && pct !== undefined ? `${wt('agents.working')} · ${pct}%` : wt('agents.working');
  const tip = bad
    ? wt('agents.stalledTip', { when: ago(lease.heartbeatAt) })
    : wt('agents.workingTip', { progress: lease.progress ? ` — ${lease.progress}` : '', when: ago(lease.heartbeatAt) });
  return (
    <span
      title={tip}
      data-testid="lease-chip"
      className={cn(
        'inline-flex h-[18px] shrink-0 items-center gap-1 rounded-[4px] px-1.5 text-[11px] font-medium tabular',
        bad
          ? 'bg-[color-mix(in_srgb,var(--w-red)_14%,transparent)] text-[var(--w-red)]'
          : 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]',
      )}
    >
      <Bot size={11} className={cn(!bad && 'animate-pulse')} />
      {label}
      {!bad && pct !== null && pct !== undefined && !compact && (
        <span className="ml-0.5 h-1 w-8 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--w-accent)_22%,transparent)]" aria-hidden>
          <span className="block h-full rounded-full bg-[var(--w-accent)]" style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
        </span>
      )}
    </span>
  );
}

/** Chip cho một thẻ (không có lease ⇒ không vẽ gì). */
export function LeaseChipFor({ issueId, compact }: { issueId: number; compact?: boolean }) {
  const l = useLeaseFor(issueId);
  return l ? <LeaseBadge lease={l} compact={compact} /> : null;
}

// ─── Bộ lọc loại người được giao ─────────────────────────────────

export type AssigneeKind = 'ALL' | 'HUMAN' | 'AGENT';

export function assigneeKindOk(kind: AssigneeKind, assigneeId: number | null | undefined, lk: Lookups): boolean {
  if (kind === 'ALL') return true;
  if (!assigneeId) return false;
  const k = lk.members.get(assigneeId)?.kind === 'AGENT' ? 'AGENT' : 'HUMAN';
  return k === kind;
}

const KIND_OPTS: Array<{ v: AssigneeKind; label: string; icon?: typeof Bot }> = [
  { v: 'ALL', get label() { return wt('common.all'); } },
  { v: 'HUMAN', get label() { return wt('agents.people'); }, icon: Users },
  { v: 'AGENT', get label() { return wt('agents.agents'); }, icon: Bot },
];

export function AssigneeKindFilter({ config, value, onChange }: { config: ProjectConfig; value: AssigneeKind; onChange: (v: AssigneeKind) => void }) {
  if (!projectHasAgents(config) || config.clientView) return null;
  return (
    <div role="radiogroup" aria-label={wt('agents.assigneeKind')} className="inline-flex h-[28px] items-center rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] p-[2px]" data-testid="assignee-kind">
      {KIND_OPTS.map((o) => (
        <button
          key={o.v}
          type="button"
          role="radio"
          aria-checked={value === o.v}
          onClick={() => onChange(o.v)}
          title={o.v === 'ALL' ? wt('agents.kindAll') : o.v === 'HUMAN' ? wt('agents.kindHuman') : wt('agents.kindAgent')}
          className={cn(
            'inline-flex h-[22px] items-center gap-1 rounded-[4px] px-2 text-[12px] font-medium transition-colors',
            value === o.v ? 'bg-[var(--w-raised)] text-[var(--w-text)] shadow-[var(--w-shadow-card)]' : 'text-[var(--w-text-3)] hover:text-[var(--w-text-2)]',
          )}
        >
          {o.icon && <o.icon size={12} />}
          {o.label}
        </button>
      ))}
    </div>
  );
}
