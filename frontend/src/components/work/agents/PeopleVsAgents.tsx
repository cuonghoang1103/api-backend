'use client';

/**
 * Báo cáo "People vs Agents" (CTW-28 A15, thiết kế §5.2) — chỉ ĐỌC số do server tính (A12, phiên BE):
 *   · ProjectAgentsReport — tab Reports của dự án: GET /projects/:pid/reports/agents (khoảng ngày / sprint).
 *   · WorkspaceAgentsDashboard — tab của trang Workload: GET /workspaces/:wsId/agents/dashboard?days=.
 * Tiền agent là USD ƯỚC LƯỢNG, phần lớn agent TỰ KHAI — luôn ghi nhãn nguồn, không bao giờ trình bày như số đo.
 */

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError, type ProjectConfig, type WorkspaceDetail } from '@/lib/work-api';
import { agentKeys, agentsApi, type AgentBrief, type CostSource } from '@/lib/work-agents-api';
import { EmptyState, Spinner, UserAvatar } from '../ui';
import { axisTick, Card, fmtDay, Legend, SectionTitle, StatCell, useAllSprints } from '../reports/shared';
import { tokensFmt, usd } from './AgentBits';

const PEOPLE = 'var(--w-chart-2)';
const AGENTS = 'var(--w-chart-1)';
const COST = 'var(--w-chart-3)';

const pct = (r: number | null | undefined) => (r === null || r === undefined ? '—' : `${Math.round(r * 100)}%`);
const hours = (min: number | null | undefined) => (min === null || min === undefined ? '—' : `${Math.round((min / 60) * 10) / 10}h`);

function vnToday(): string {
  return new Date(Date.now() + 7 * 3_600_000).toISOString().slice(0, 10);
}
function addDays(day: string, n: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function sourceLabel(s: CostSource | undefined) {
  if (!s) return '';
  if (s.gateway > 0 && s.reported > 0) return `${usd(s.reported)} self-reported · ${usd(s.gateway)} measured`;
  if (s.gateway > 0) return 'measured by CT Work';
  return s.reported > 0 ? 'self-reported by agents · estimate' : 'no cost reported';
}

function AgentCell({ a }: { a: AgentBrief }) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <UserAvatar user={{ id: a.userId, username: a.username, displayName: a.displayName, fullName: null, avatarUrl: null, kind: 'AGENT' }} size={20} />
      <span className="min-w-0">
        <span className="block truncate font-medium">{a.displayName || a.username}</span>
        <span className="block truncate font-mono text-[11px] text-[var(--w-text-3)]">{a.model}{a.owner ? ` · ${userName(a.owner)}` : ''}</span>
      </span>
    </span>
  );
}

const TH = 'px-3 py-2 text-right font-medium uppercase tracking-wide';
const TD = 'px-3 py-2 text-right tabular-nums';

// ─── Dự án ───────────────────────────────────────────────────────

export function ProjectAgentsReport({ config }: { config: ProjectConfig }) {
  const pid = config.id;
  const sprints = useAllSprints(pid);
  const [sprintId, setSprintId] = useState<number | null>(null);
  const [from, setFrom] = useState(() => addDays(vnToday(), -29));
  const [to, setTo] = useState(() => vnToday());
  const q = useQuery({
    queryKey: [...agentKeys.report(pid, sprintId ? '' : from, sprintId ? '' : to), sprintId ?? 0],
    queryFn: () => agentsApi.projectReport(pid, sprintId ? { sprintId } : { from, to }),
    enabled: !!sprintId || (!!from && !!to && from <= to),
    retry: false,
  });
  const d = q.data;
  const ta = d?.totals.agents;
  const th = d?.totals.humans;

  return (
    <div className="space-y-4" data-testid="people-vs-agents">
      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label="Sprint"
          className="w-input !h-[28px] !w-auto py-0 text-[12px]"
          value={sprintId ?? ''}
          onChange={(e) => setSprintId(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Date range</option>
          {(sprints.data ?? []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        {!sprintId && (
          <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-[var(--w-text-3)]">
            <input type="date" aria-label="From" value={from} max={to} onChange={(e) => e.target.value && setFrom(e.target.value)} className="w-input !h-[28px] !w-auto py-0 text-[12px]" />
            <span>to</span>
            <input type="date" aria-label="To" value={to} min={from} onChange={(e) => e.target.value && setTo(e.target.value)} className="w-input !h-[28px] !w-auto py-0 text-[12px]" />
          </div>
        )}
        <span className="text-[12px] text-[var(--w-text-3)] sm:ml-auto">{d ? `${fmtDay(d.from)} – ${fmtDay(d.to)} · up to 92 days` : ''}</span>
      </div>

      {q.isLoading ? <div className="flex justify-center py-16"><Spinner size={20} /></div> : q.error ? (
        <EmptyState title="Could not load the report" body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />
      ) : !d ? null : (
        <>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            <StatCell label="Resolved by agents" value={ta?.issuesResolved ?? 0} hint={`${ta?.pointsResolved ?? 0} points · people resolved ${th?.issuesResolved ?? 0}`} tone="accent" />
            <StatCell label="Returned to agents" value={pct(ta?.returnRate)} hint={`${ta?.returnedCount ?? 0} sent back by a person`} tone={(ta?.returnRate ?? 0) > 0.25 ? 'red' : undefined} />
            <StatCell label="Agent cost" value={usd(ta?.costUsd)} hint={sourceLabel(ta?.costSource)} />
            <StatCell label="Cost per point" value={usd(ta?.costPerPoint)} hint={`per resolved issue ${usd(ta?.costPerResolved)}`} />
          </div>

          <Card className="!p-0">
            <div className="px-4 pt-3"><SectionTitle right={<span className="text-[11.5px] text-[var(--w-text-3)]">{tokensFmt(ta?.tokens.in)} in · {tokensFmt(ta?.tokens.out)} out</span>}>AI agents</SectionTitle></div>
            {!d.agents.length ? (
              <p className="px-4 pb-4 text-[13px] text-[var(--w-text-3)]">No agent worked in this project in the range.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-[12.5px]">
                  <thead>
                    <tr className="border-y border-[var(--w-border)] text-[11px] text-[var(--w-text-3)]">
                      <th className="px-3 py-2 text-left font-medium uppercase tracking-wide">Agent</th>
                      <th className={TH}>Touched</th><th className={TH}>Resolved</th><th className={TH}>Points</th>
                      <th className={TH} title="Returned by a person from review/done to to-do/in progress">Returned</th>
                      <th className={TH} title="Time holding a lease (claim → release)">Lease</th>
                      <th className={TH} title="Logged work, incl. the automatic timesheet from leases">Logged</th>
                      <th className={TH}>Tokens</th><th className={TH}>Cost</th><th className={TH}>$/pt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.agents.map((r) => (
                      <tr key={r.agent.id} className="border-b border-[var(--w-border)] last:border-b-0">
                        <td className="px-3 py-2"><AgentCell a={r.agent} /></td>
                        <td className={TD}>{r.issuesTouched}</td>
                        <td className={TD}>{r.issuesResolved}</td>
                        <td className={TD}>{r.pointsResolved}</td>
                        <td className={cn(TD, r.returnRate > 0.25 && 'text-[var(--w-red)]')}>{r.returnedCount} <span className="text-[var(--w-text-3)]">({pct(r.returnRate)})</span></td>
                        <td className={TD}>{hours(r.leaseMinutes)}</td>
                        <td className={TD} title={r.autoWorklogMinutes ? `${hours(r.autoWorklogMinutes)} automatic from leases` : undefined}>{hours(r.worklogMinutes)}</td>
                        <td className={TD}>{tokensFmt(r.tokens.in + r.tokens.out)}</td>
                        <td className={TD} title={sourceLabel(r.costSource)}>{usd(r.costUsd)}{r.costSource.reported > 0 && r.costSource.gateway === 0 && <sup className="ml-0.5 text-[var(--w-text-3)]">*</sup>}</td>
                        <td className={TD}>{usd(r.costPerPoint)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card className="!p-0">
            <div className="px-4 pt-3"><SectionTitle right={<span className="text-[11.5px] text-[var(--w-text-3)]">{th ? `${th.hours}h logged` : ''}</span>}>People</SectionTitle></div>
            {!d.humans.length ? <p className="px-4 pb-4 text-[13px] text-[var(--w-text-3)]">Nobody logged time or resolved issues in the range.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-[12.5px]">
                  <thead>
                    <tr className="border-y border-[var(--w-border)] text-[11px] text-[var(--w-text-3)]">
                      <th className="px-3 py-2 text-left font-medium uppercase tracking-wide">Person</th>
                      <th className={TH}>Hours</th><th className={TH}>Resolved</th><th className={TH}>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.humans.map((h) => (
                      <tr key={h.user.id} className="border-b border-[var(--w-border)] last:border-b-0">
                        <td className="px-3 py-2"><span className="flex items-center gap-2"><UserAvatar user={h.user} size={20} /><span className="truncate font-medium">{userName(h.user)}</span></span></td>
                        <td className={TD}>{h.hours}h</td>
                        <td className={TD}>{h.issuesResolved}</td>
                        <td className={TD}>{h.cost === null ? '—' : `${h.cost.toLocaleString('en-US')}${d.currency ? ` ${d.currency}` : ''}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
          <p className="flex items-start gap-1.5 text-[12px] leading-relaxed text-[var(--w-text-3)]">
            <Info size={13} className="mt-0.5 shrink-0" />
            <span>* Agent cost is an estimate in USD. External agents declare it themselves (MCP <code className="font-mono">report_usage</code>), so treat it as self-reported. People&apos;s cost appears only when Finance is on and you can see it.</span>
          </p>
        </>
      )}
    </div>
  );
}

// ─── Không gian ──────────────────────────────────────────────────

export function WorkspaceAgentsDashboard({ ws }: { ws: WorkspaceDetail }) {
  const [days, setDays] = useState(30);
  const q = useQuery({ queryKey: agentKeys.dashboard(ws.id, days), queryFn: () => agentsApi.dashboard(ws.id, days), retry: false });
  const d = q.data;
  const chart = useMemo(() => (d?.weeks ?? []).map((w) => ({
    week: w.weekStart, People: w.humanResolved, Agents: w.agentResolved, Returned: w.agentReturned, Cost: w.agentCostUsd, Hours: w.humanHours,
  })), [d]);
  const t = d?.totals;
  const own = d?.scope === 'OWN';
  return (
    <div className="w-page space-y-4" data-testid="agents-dashboard">
      <div className="flex flex-wrap items-center gap-2">
        <div role="radiogroup" aria-label="Range" className="inline-flex h-[28px] items-center rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] p-[2px]">
          {[14, 30, 90].map((n) => (
            <button key={n} type="button" role="radio" aria-checked={days === n} onClick={() => setDays(n)} className={cn('h-[22px] rounded-[4px] px-2.5 text-[12px] font-medium', days === n ? 'bg-[var(--w-raised)] text-[var(--w-text)] shadow-[var(--w-shadow-card)]' : 'text-[var(--w-text-3)] hover:text-[var(--w-text-2)]')}>
              {n} days
            </button>
          ))}
        </div>
        {own && <span className="text-[12px] text-[var(--w-text-3)]">Showing only the agents you own. Team numbers are visible to workspace admins.</span>}
        <Link href={`/work/${ws.slug}/agents`} className="ml-auto text-[12px] text-[var(--w-accent-text)] hover:underline">Manage agents</Link>
      </div>

      {q.isLoading ? <div className="flex justify-center py-16"><Spinner size={20} /></div> : q.error ? (
        <EmptyState title="Could not load People vs Agents" body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />
      ) : !d ? null : (
        <>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            <StatCell label="Resolved · people" value={t?.humanResolved ?? '—'} hint={t?.humanHours !== null && t?.humanHours !== undefined ? `${t.humanHours}h logged` : 'admins only'} />
            <StatCell label="Resolved · agents" value={t?.agentResolved ?? 0} tone="accent" hint={`${t?.agentReturned ?? 0} returned (${pct(t?.agentReturnRate)})`} />
            <StatCell label="Agent cost" value={usd(t?.agentCostUsd)} hint={sourceLabel(t?.costSource)} />
            <StatCell label="Return rate" value={pct(t?.agentReturnRate)} tone={(t?.agentReturnRate ?? 0) > 0.25 ? 'red' : undefined} hint="Agent work sent back by a person" />
          </div>

          <Card>
            <SectionTitle right={<Legend items={[...(own ? [] : [{ label: 'People', color: PEOPLE }]), { label: 'Agents', color: AGENTS }]} />}>Issues resolved per week</SectionTitle>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chart} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="var(--w-chart-grid)" vertical={false} />
                  <XAxis dataKey="week" tickFormatter={fmtDay} tick={axisTick} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
                  <Tooltip content={<WeekTip />} cursor={{ fill: 'var(--w-hover)' }} />
                  {!own && <Bar dataKey="People" fill={PEOPLE} radius={[3, 3, 0, 0]} maxBarSize={22} isAnimationActive={false} />}
                  <Bar dataKey="Agents" fill={AGENTS} radius={[3, 3, 0, 0]} maxBarSize={22} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <SectionTitle right={<Legend items={[{ label: 'Agent $ (estimate)', color: COST }, ...(own ? [] : [{ label: 'People hours', color: PEOPLE, dashed: true }])]} />}>Agent cost vs people hours</SectionTitle>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chart} margin={{ top: 8, right: 0, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="var(--w-chart-grid)" vertical={false} />
                  <XAxis dataKey="week" tickFormatter={fmtDay} tick={axisTick} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="usd" tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${v}`} />
                  {!own && <YAxis yAxisId="h" orientation="right" tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}h`} />}
                  <Tooltip content={<WeekTip />} cursor={{ fill: 'var(--w-hover)' }} />
                  <Bar yAxisId="usd" dataKey="Cost" fill={COST} radius={[3, 3, 0, 0]} maxBarSize={22} isAnimationActive={false} />
                  {!own && <Line yAxisId="h" dataKey="Hours" stroke={PEOPLE} strokeDasharray="4 3" strokeWidth={2} dot={{ r: 2.5 }} isAnimationActive={false} />}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="!p-0">
            <div className="px-4 pt-3"><SectionTitle>Agents</SectionTitle></div>
            {!d.agents.length ? <p className="px-4 pb-4 text-[13px] text-[var(--w-text-3)]">No agents yet.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-[12.5px]">
                  <thead>
                    <tr className="border-y border-[var(--w-border)] text-[11px] text-[var(--w-text-3)]">
                      <th className="px-3 py-2 text-left font-medium uppercase tracking-wide">Agent</th>
                      <th className={TH}>Working on</th><th className={TH}>Resolved</th><th className={TH}>Points</th><th className={TH}>Returned</th>
                      <th className={TH}>Lease</th><th className={TH}>Tokens</th><th className={TH}>Cost</th><th className={TH}>$/pt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.agents.map((r) => (
                      <tr key={r.agent.id} className="border-b border-[var(--w-border)] last:border-b-0">
                        <td className="px-3 py-2"><Link href={`/work/${ws.slug}/agents/${r.agent.id}`} className="hover:underline"><AgentCell a={r.agent} /></Link></td>
                        <td className={TD}>{r.activeLeases}</td>
                        <td className={TD}>{r.issuesResolved}</td>
                        <td className={TD}>{r.pointsResolved}</td>
                        <td className={cn(TD, r.returnRate > 0.25 && 'text-[var(--w-red)]')}>{r.returnedCount} <span className="text-[var(--w-text-3)]">({pct(r.returnRate)})</span></td>
                        <td className={TD}>{hours(r.leaseMinutes)}</td>
                        <td className={TD}>{tokensFmt(r.tokens.in + r.tokens.out)}</td>
                        <td className={TD} title={sourceLabel(r.costSource)}>{usd(r.costUsd)}</td>
                        <td className={TD}>{usd(r.costPerPoint)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
          <p className="flex items-start gap-1.5 text-[12px] leading-relaxed text-[var(--w-text-3)]">
            <Info size={13} className="mt-0.5 shrink-0" />
            <span>Weeks start on Monday (Vietnam time). Agent cost is an estimate in USD — external agents report it themselves. People hours come from work logs.</span>
          </p>
        </>
      )}
    </div>
  );
}

type TipRow = { name?: string | number; value?: number | string | null | (number | string)[]; color?: string; fill?: string; stroke?: string };
function WeekTip({ active, payload, label }: { active?: boolean; payload?: TipRow[]; label?: string | number }) {
  if (!active || !payload?.length) return null;
  const rows = payload.filter((p) => p.value !== null && p.value !== undefined);
  if (!rows.length) return null;
  return (
    <div className="rounded-[var(--w-radius)] border border-[var(--w-border-strong)] bg-[var(--w-raised)] px-2.5 py-2 text-[12px] shadow-[var(--w-shadow-pop)]">
      <div className="mb-1 font-medium text-[var(--w-text)]">Week of {fmtDay(String(label))}</div>
      {rows.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-[var(--w-text-2)]">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.fill ?? p.color ?? p.stroke }} />
          <span>{p.name === 'Cost' ? 'Agent cost' : p.name === 'Hours' ? 'People hours' : p.name}</span>
          <span className="ml-auto pl-3 font-medium tabular-nums text-[var(--w-text)]">{p.name === 'Cost' ? usd(Number(p.value)) : p.name === 'Hours' ? `${p.value}h` : String(p.value)}</span>
        </div>
      ))}
    </div>
  );
}
