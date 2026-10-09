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
import { axisTick, Card, fmtDay, SectionTitle, StatCell, useAllSprints } from '../reports/shared';
import ChartFrame from '../charts/ChartFrame';
import { tokensFmt, usd } from './AgentBits';
import { wt, wfmt } from '@/components/work/i18n';

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
  if (s.gateway > 0 && s.reported > 0) return wt('agents.srcBoth', { a: usd(s.reported), b: usd(s.gateway) });
  if (s.gateway > 0) return wt('agents.srcMeasured');
  return s.reported > 0 ? wt('agents.srcSelf') : wt('agents.srcNone');
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
          aria-label={wt('common.sprint')}
          className="w-input !h-[28px] !w-auto py-0 text-[12px]"
          value={sprintId ?? ''}
          onChange={(e) => setSprintId(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">{wt('agents.dateRange')}</option>
          {(sprints.data ?? []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        {!sprintId && (
          <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-[var(--w-text-3)]">
            <input type="date" aria-label={wt('agents.from')} value={from} max={to} onChange={(e) => e.target.value && setFrom(e.target.value)} className="w-input !h-[28px] !w-auto py-0 text-[12px]" />
            <span>{wt('agents.toLc')}</span>
            <input type="date" aria-label={wt('agents.to')} value={to} min={from} onChange={(e) => e.target.value && setTo(e.target.value)} className="w-input !h-[28px] !w-auto py-0 text-[12px]" />
          </div>
        )}
        <span className="text-[12px] text-[var(--w-text-3)] sm:ml-auto">{d ? wt('agents.upTo92', { a: fmtDay(d.from), b: fmtDay(d.to) }) : ''}</span>
      </div>

      {q.isLoading ? <div className="flex justify-center py-16"><Spinner size={20} /></div> : q.error ? (
        <EmptyState title={wt('desk.loadReportFailed')} body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>{wt('common.tryAgain')}</button>} />
      ) : !d ? null : (
        <>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            <StatCell label={wt('agents.resolvedByAgents')} value={ta?.issuesResolved ?? 0} hint={wt('agents.ptsPeople', { p: ta?.pointsResolved ?? 0, n: th?.issuesResolved ?? 0 })} tone="accent" />
            <StatCell label={wt('agents.returnedToAgents')} value={pct(ta?.returnRate)} hint={wt('agents.sentBack', { n: ta?.returnedCount ?? 0 })} tone={(ta?.returnRate ?? 0) > 0.25 ? 'red' : undefined} />
            <StatCell label={wt('agents.agentCost')} value={usd(ta?.costUsd)} hint={sourceLabel(ta?.costSource)} />
            <StatCell label={wt('agents.costPerPoint')} value={usd(ta?.costPerPoint)} hint={wt('agents.perResolved', { v: usd(ta?.costPerResolved) })} />
          </div>

          <Card className="!p-0">
            <div className="px-4 pt-3"><SectionTitle right={<span className="text-[11.5px] text-[var(--w-text-3)]">{wt('agents.tokInOut', { a: tokensFmt(ta?.tokens.in), b: tokensFmt(ta?.tokens.out) })}</span>}>{wt('agents.aiAgents')}</SectionTitle></div>
            {!d.agents.length ? (
              <p className="px-4 pb-4 text-[13px] text-[var(--w-text-3)]">{wt('agents.noAgentRange')}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-[12.5px]">
                  <thead>
                    <tr className="border-y border-[var(--w-border)] text-[11px] text-[var(--w-text-3)]">
                      <th className="px-3 py-2 text-left font-medium uppercase tracking-wide">{wt('agents.agent')}</th>
                      <th className={TH}>{wt('agents.touched')}</th><th className={TH}>{wt('agents.resolvedCol')}</th><th className={TH}>{wt('common.points')}</th>
                      <th className={TH} title={wt('agents.returnedTip')}>{wt('agents.returnedCol')}</th>
                      <th className={TH} title={wt('agents.leaseTip')}>{wt('agents.lease')}</th>
                      <th className={TH} title={wt('agents.loggedTip')}>{wt('agents.logged')}</th>
                      <th className={TH}>{wt('agents.tokensCol')}</th><th className={TH}>{wt('agents.costCol')}</th><th className={TH}>$/pt</th>
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
                        <td className={TD} title={r.autoWorklogMinutes ? wt('agents.autoFromLeases', { t: hours(r.autoWorklogMinutes) }) : undefined}>{hours(r.worklogMinutes)}</td>
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
            <div className="px-4 pt-3"><SectionTitle right={<span className="text-[11.5px] text-[var(--w-text-3)]">{th ? wt('agents.hLogged', { h: th.hours }) : ''}</span>}>{wt('agents.people')}</SectionTitle></div>
            {!d.humans.length ? <p className="px-4 pb-4 text-[13px] text-[var(--w-text-3)]">{wt('agents.nobodyLogged')}</p> : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-[12.5px]">
                  <thead>
                    <tr className="border-y border-[var(--w-border)] text-[11px] text-[var(--w-text-3)]">
                      <th className="px-3 py-2 text-left font-medium uppercase tracking-wide">{wt('finance.person')}</th>
                      <th className={TH}>{wt('finance.hoursH')}</th><th className={TH}>{wt('agents.resolvedCol')}</th><th className={TH}>{wt('agents.costCol')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.humans.map((h) => (
                      <tr key={h.user.id} className="border-b border-[var(--w-border)] last:border-b-0">
                        <td className="px-3 py-2"><span className="flex items-center gap-2"><UserAvatar user={h.user} size={20} /><span className="truncate font-medium">{userName(h.user)}</span></span></td>
                        <td className={TD}>{h.hours}h</td>
                        <td className={TD}>{h.issuesResolved}</td>
                        <td className={TD}>{h.cost === null ? '—' : `${h.cost.toLocaleString(wfmt.intl())}${d.currency ? ` ${d.currency}` : ''}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
          <p className="flex items-start gap-1.5 text-[12px] leading-relaxed text-[var(--w-text-3)]">
            <Info size={13} className="mt-0.5 shrink-0" />
            <span>{wt('agents.costNoteA')} <code className="font-mono">report_usage</code>{wt('agents.costNoteB')}</span>
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
        <div role="radiogroup" aria-label={wt('agents.range')} className="inline-flex h-[28px] items-center rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] p-[2px]">
          {[14, 30, 90].map((n) => (
            <button key={n} type="button" role="radio" aria-checked={days === n} onClick={() => setDays(n)} className={cn('h-[22px] rounded-[4px] px-2.5 text-[12px] font-medium', days === n ? 'bg-[var(--w-raised)] text-[var(--w-text)] shadow-[var(--w-shadow-card)]' : 'text-[var(--w-text-3)] hover:text-[var(--w-text-2)]')}>
              {wt('common.days', { count: n })}
            </button>
          ))}
        </div>
        {own && <span className="text-[12px] text-[var(--w-text-3)]">{wt('agents.onlyOwn')}</span>}
        <Link href={`/work/${ws.slug}/agents`} className="ml-auto text-[12px] text-[var(--w-accent-text)] hover:underline">{wt('settings.manageAgents')}</Link>
      </div>

      {q.isLoading ? <div className="flex justify-center py-16"><Spinner size={20} /></div> : q.error ? (
        <EmptyState title={wt('agents.loadPva')} body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>{wt('common.tryAgain')}</button>} />
      ) : !d ? null : (
        <>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            <StatCell label={wt('agents.resolvedPeople')} value={t?.humanResolved ?? '—'} hint={t?.humanHours !== null && t?.humanHours !== undefined ? wt('agents.hLogged', { h: t.humanHours }) : wt('agents.adminsOnly')} />
            <StatCell label={wt('agents.resolvedAgents')} value={t?.agentResolved ?? 0} tone="accent" hint={wt('agents.nReturned', { n: t?.agentReturned ?? 0, p: pct(t?.agentReturnRate) })} />
            <StatCell label={wt('agents.agentCost')} value={usd(t?.agentCostUsd)} hint={sourceLabel(t?.costSource)} />
            <StatCell label={wt('agents.returnRate')} value={pct(t?.agentReturnRate)} tone={(t?.agentReturnRate ?? 0) > 0.25 ? 'red' : undefined} hint={wt('agents.returnRateHint')} />
          </div>

          {/* UX-B: hai biểu đồ đi qua ChartFrame (chú giải bật/tắt, xuất PNG/CSV, bảng ẩn cho trình đọc màn hình). */}
          <ChartFrame
            title={wt('agents.resolvedPerWeek')} description={wt('charts.agentsWeekDesc')} height={220}
            status={chart.length ? 'ready' : 'empty'}
            series={[...(own ? [] : [{ key: 'People', label: wt('agents.people'), color: PEOPLE }]), { key: 'Agents', label: wt('agents.agents'), color: AGENTS }]}
            rows={chart} columns={[{ key: 'week', label: wt('charts.weekOf') }, ...(own ? [] : [{ key: 'People', label: wt('agents.people') }]), { key: 'Agents', label: wt('agents.agents') }, { key: 'Returned', label: wt('charts.returned') }]}
            fileName="people-vs-agents"
          >
            {(hidden) => (
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chart} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                    <CartesianGrid stroke="var(--w-chart-grid)" vertical={false} />
                    <XAxis dataKey="week" tickFormatter={fmtDay} tick={axisTick} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
                    <Tooltip content={<WeekTip />} cursor={{ fill: 'var(--w-hover)' }} />
                    {!own && !hidden.has('People') && <Bar dataKey="People" fill={PEOPLE} radius={[3, 3, 0, 0]} maxBarSize={22} isAnimationActive={false} />}
                    {!hidden.has('Agents') && <Bar dataKey="Agents" fill={AGENTS} radius={[3, 3, 0, 0]} maxBarSize={22} isAnimationActive={false} />}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartFrame>

          <ChartFrame
            title={wt('agents.costVsHours')} description={wt('charts.agentsCostDesc')} height={200}
            status={chart.length ? 'ready' : 'empty'}
            series={[{ key: 'Cost', label: wt('agents.agentUsdEst'), color: COST }, ...(own ? [] : [{ key: 'Hours', label: wt('agents.peopleHours'), color: PEOPLE, dashed: true }])]}
            rows={chart} columns={[{ key: 'week', label: wt('charts.weekOf') }, { key: 'Cost', label: wt('agents.agentUsdEst') }, ...(own ? [] : [{ key: 'Hours', label: wt('agents.peopleHours') }])]}
            fileName="agent-cost-vs-hours"
          >
            {(hidden) => (
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chart} margin={{ top: 8, right: 0, left: -18, bottom: 0 }}>
                    <CartesianGrid stroke="var(--w-chart-grid)" vertical={false} />
                    <XAxis dataKey="week" tickFormatter={fmtDay} tick={axisTick} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="usd" tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${v}`} />
                    {!own && <YAxis yAxisId="h" orientation="right" tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}h`} />}
                    <Tooltip content={<WeekTip />} cursor={{ fill: 'var(--w-hover)' }} />
                    {!hidden.has('Cost') && <Bar yAxisId="usd" dataKey="Cost" fill={COST} radius={[3, 3, 0, 0]} maxBarSize={22} isAnimationActive={false} />}
                    {!own && !hidden.has('Hours') && <Line yAxisId="h" dataKey="Hours" stroke={PEOPLE} strokeDasharray="4 3" strokeWidth={2} dot={{ r: 2.5 }} isAnimationActive={false} />}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartFrame>

          <Card className="!p-0">
            <div className="px-4 pt-3"><SectionTitle>{wt('agents.agents')}</SectionTitle></div>
            {!d.agents.length ? <p className="px-4 pb-4 text-[13px] text-[var(--w-text-3)]">{wt('agents.noAgentsYet')}</p> : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-[12.5px]">
                  <thead>
                    <tr className="border-y border-[var(--w-border)] text-[11px] text-[var(--w-text-3)]">
                      <th className="px-3 py-2 text-left font-medium uppercase tracking-wide">{wt('agents.agent')}</th>
                      <th className={TH}>{wt('agents.workingOn')}</th><th className={TH}>{wt('agents.resolvedCol')}</th><th className={TH}>{wt('common.points')}</th><th className={TH}>{wt('agents.returnedCol')}</th>
                      <th className={TH}>{wt('agents.lease')}</th><th className={TH}>{wt('agents.tokensCol')}</th><th className={TH}>{wt('agents.costCol')}</th><th className={TH}>$/pt</th>
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
            <span>{wt('agents.weeksNote')}</span>
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
      <div className="mb-1 font-medium text-[var(--w-text)]">{wt('agents.weekOf', { d: fmtDay(String(label)) })}</div>
      {rows.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-[var(--w-text-2)]">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.fill ?? p.color ?? p.stroke }} />
          <span>{p.name === 'Cost' ? wt('agents.agentCost') : p.name === 'Hours' ? wt('agents.peopleHours') : p.name === 'People' ? wt('agents.people') : p.name === 'Agents' ? wt('agents.agents') : p.name}</span>
          <span className="ml-auto pl-3 font-medium tabular-nums text-[var(--w-text)]">{p.name === 'Cost' ? usd(Number(p.value)) : p.name === 'Hours' ? `${p.value}h` : String(p.value)}</span>
        </div>
      ))}
    </div>
  );
}
