'use client';

/**
 * Khối lượng việc nhiều dự án (workload) — đợt S3a. CHỈ ĐỌC.
 *
 * Lưới người × tuần: ô tô màu theo % tải (giờ còn lại của thẻ được giao, rải
 * theo ngày tới hạn ÷ năng lực tuần). Bấm ô ⇒ danh sách thẻ của tuần đó. Gộp
 * theo bộ phận khi không gian có bộ phận. Quy đổi giờ do server tính và trả kèm
 * bằng chữ (nút "How is load computed?") — giao diện không tự đoán số nào.
 * Phạm vi xem do server quyết: admin = mọi người, trưởng bộ phận = bộ phận mình,
 * còn lại = chính mình.
 */

import Link from 'next/link';
import { Fragment, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, ChevronLeft, ChevronRight, CircleHelp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError, type WorkspaceDetail } from '@/lib/work-api';
import {
  portfolioKeys, workPortfolioApi, type LoadLevel, type Workload, type WorkloadIssue, type WorkloadPerson, type WorkloadWeek,
} from '@/lib/work-portfolio-api';
import { Dialog, EmptyState, PageLoading, Popover, UserAvatar, useToggle, signalText } from '../ui';
import { fmtDay } from '../reports/shared';
import { TeamChip } from '../studio/shared';
import { wt } from '@/components/work/i18n';
import { Bar, CartesianGrid, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartFrame from '../charts/ChartFrame';
import { AXIS_TICK, SERIES } from '../charts/chartColors';
import { FlowTooltip } from '../charts/FlowCharts';

const LEVEL: Record<LoadLevel, { bg: string; fg: string; label: string }> = {
  none: { bg: 'transparent', fg: 'var(--w-text-3)', get label() { return wt('wl.free'); } },
  low: { bg: 'color-mix(in srgb, var(--w-green) 10%, transparent)', fg: 'var(--w-text-2)', label: '< 50%' },
  ok: { bg: 'color-mix(in srgb, var(--w-green) 22%, transparent)', fg: 'var(--w-text)', label: '50–84%' },
  high: { bg: 'color-mix(in srgb, var(--w-orange) 24%, transparent)', fg: 'var(--w-text)', label: '85–100%' },
  over: { bg: 'color-mix(in srgb, var(--w-red) 26%, transparent)', fg: 'var(--w-text)', label: '> 100%' },
};

const SOURCE: Record<WorkloadIssue['source'], string> = {
  get remaining() { return wt('wl.srcRemaining'); },
  get original() { return wt('wl.srcOriginal'); },
  get points() { return wt('wl.srcPoints'); },
  get none() { return wt('wl.srcNone'); },
  get children() { return wt('wl.srcChildren'); },
};

/** Thứ Hai của tuần làm việc hiện tại theo giờ VN (khớp server). Thứ Bảy/CN ⇒ tuần tới — tuần đã hết ngày làm thì năng lực 0, nhìn vô ích. */
function vnMonday(offsetWeeks = 0): string {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const t = Date.parse(`${today}T00:00:00Z`);
  const w = new Date(t).getUTCDay();
  const weekend = w === 0 || w === 6 ? 1 : 0;
  return new Date(t - ((w + 6) % 7) * 86_400_000 + (offsetWeeks + weekend) * 7 * 86_400_000).toISOString().slice(0, 10);
}
const plusDays = (d: string, n: number) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
const h1 = (n: number) => String(Math.round(n * 10) / 10);

function LoadCell({ w, onOpen, label }: { w: WorkloadWeek; onOpen?: () => void; label: string }) {
  const lv = LEVEL[w.level];
  const body = (
    <>
      <span className="block text-[13px] font-semibold tabular-nums" style={{ color: signalText(lv.fg) }}>{w.hours ? `${h1(w.hours)}h` : '—'}</span>
      {/* UX-B: ô tải cao/vượt có nền cam/đỏ ⇒ dòng phụ dùng --w-text-2 (text-3 tụt dưới 4.5:1 trên nền đó). */}
      <span className={cn('block text-[11px] tabular-nums', w.level === 'high' || w.level === 'over' ? 'text-[var(--w-text-2)]' : 'text-[var(--w-text-3)]')}>
        {w.capacity ? wt('wl.pctOf', { p: w.pct ?? 0, h: h1(w.capacity) }) : w.hours ? wt('wl.noCapacity') : wt('wl.off')}
      </span>
    </>
  );
  const cls = cn('flex h-full min-h-[46px] w-full flex-col justify-center rounded-[6px] px-2 text-left', w.overloaded && 'ring-1 ring-inset ring-[var(--w-red)]');
  return onOpen ? (
    <button type="button" onClick={onOpen} className={cn(cls, 'hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--w-accent-border)]')} style={{ background: lv.bg }} aria-label={label} data-level={w.level}>
      {body}
    </button>
  ) : (
    <div className={cls} style={{ background: lv.bg }} aria-label={label} data-level={w.level}>{body}</div>
  );
}

/**
 * UX-B: tải cả nhóm theo tuần — giờ đã lên kế hoạch so với năng lực (Recharts trong ChartFrame, xuất PNG/CSV).
 * Cột đỏ khi vượt năng lực (đỏ = xấu), còn lại màu "đang làm"; năng lực là đường bậc thang xám.
 */
function TeamLoadChart({ data }: { data: Workload }) {
  const rows = useMemo(() => data.weeks.map((w, i) => {
    const hours = Math.round(data.people.reduce((s, p) => s + (p.weeks[i]?.hours ?? 0), 0) * 10) / 10;
    const capacity = Math.round(data.people.reduce((s, p) => s + (p.weeks[i]?.capacity ?? 0), 0) * 10) / 10;
    return { week: w.start, hours, capacity, pct: capacity ? Math.round((hours / capacity) * 100) : null, over: capacity > 0 && hours > capacity };
  }), [data]);
  const empty = rows.every((r) => !r.hours && !r.capacity);
  return (
    <ChartFrame
      title={wt('charts.teamLoad')} description={wt('charts.teamLoadDesc')} height={180} className="mb-3"
      status={empty ? 'empty' : 'ready'} emptyText={wt('charts.teamLoadEmpty')}
      series={[{ key: 'hours', label: wt('charts.plannedHours'), color: SERIES.inProgress }, { key: 'capacity', label: wt('charts.capacity'), color: SERIES.capacity, dashed: true }]}
      rows={rows}
      columns={[{ key: 'week', label: wt('charts.weekOf') }, { key: 'hours', label: wt('charts.plannedHours') }, { key: 'capacity', label: wt('charts.capacity') }, { key: 'pct', label: '%' }]}
      summary={wt('charts.teamLoadSummary', { n: rows.length, o: rows.filter((r) => r.over).length })}
      fileName="team-load"
      testId="chart-team-load"
    >
      {(hidden) => (
        <div className="h-[180px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={rows} margin={{ top: 6, right: 8, bottom: 0, left: -12 }}>
              <CartesianGrid stroke="var(--w-chart-grid)" vertical={false} />
              <XAxis dataKey="week" tickFormatter={fmtDay} tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: 'var(--w-border-strong)' }} />
              <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={48} tickFormatter={(v: number) => `${v}h`} />
              <Tooltip content={<FlowTooltip labelFormat={(l) => wt('charts.weekOfX', { d: fmtDay(l) })} fmt={(v) => `${h1(v)} h`} />} cursor={{ fill: 'var(--w-hover)' }} />
              {!hidden.has('hours') && (
                <Bar dataKey="hours" name={wt('charts.plannedHours')} radius={[3, 3, 0, 0]} maxBarSize={36} isAnimationActive={false}>
                  {rows.map((r) => <Cell key={r.week} fill={r.over ? SERIES.overdue : SERIES.inProgress} />)}
                </Bar>
              )}
              {!hidden.has('capacity') && <Line type="stepAfter" dataKey="capacity" name={wt('charts.capacity')} stroke={SERIES.capacity} strokeDasharray="5 4" strokeWidth={1.5} dot={false} isAnimationActive={false} />}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartFrame>
  );
}

export default function WorkloadView({ ws }: { ws: WorkspaceDetail }) {
  const [offset, setOffset] = useState(0);
  const [span, setSpan] = useState(4);
  const [teamId, setTeamId] = useState<number | undefined>();
  const [projectId, setProjectId] = useState<number | undefined>();
  const [hpp, setHpp] = useState<number | undefined>();
  const [open, setOpen] = useState<{ person: WorkloadPerson; week: number | null } | null>(null);
  const helpBtn = useRef<HTMLButtonElement>(null);
  const help = useToggle(false);

  const from = vnMonday(offset);
  const query = { from, to: plusDays(from, span * 7 - 1), teamId, projectId, hoursPerPoint: hpp };
  const q = useQuery({
    queryKey: portfolioKeys.workload(ws.id, query),
    queryFn: () => workPortfolioApi.workload(ws.id, query),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
  const data = q.data;

  // Nhóm theo bộ phận (một người ở nhiều bộ phận thì hiện ở mỗi bộ phận); ai không thuộc bộ phận nào ⇒ "No team".
  const groups = useMemo(() => {
    if (!data) return [];
    if (!data.teams.length) return [{ team: null, people: data.people }];
    const out: Array<{ team: Workload['teams'][number] | null; people: WorkloadPerson[] }> = data.teams.map((t) => ({
      team: t, people: data.people.filter((p) => t.memberIds.includes(p.user.id)),
    }));
    const rest = data.people.filter((p) => !data.teams.some((t) => t.memberIds.includes(p.user.id)));
    if (rest.length) out.push({ team: null, people: rest });
    return out;
  }, [data]);

  if (q.isLoading && !data) return <PageLoading rows={6} />;
  if (q.error && !data) return <EmptyState title={wt('wl.loadFailed')} body={workError(q.error)} />;
  if (!data) return null;

  const overloaded = data.people.filter((p) => p.overloaded).length;
  const issuesFor = (p: WorkloadPerson, week: number | null) => {
    if (week === null) return p.issues;
    const ids = new Set(p.weeks[week].issueIds);
    return p.issues.filter((i) => ids.has(i.id));
  };

  return (
    <div className="w-page">
      {data.scope === 'SELF' && (
        <p className="mb-3 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[13px] text-[var(--w-text-2)]">
          You are seeing your own workload. Workspace admins see everyone; team leads see the people in their teams.
        </p>
      )}

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1" role="group" aria-label={wt('wl.weeks')}>
          <button type="button" className="w-btn w-btn-sm w-btn-icon" onClick={() => setOffset((o) => o - 1)} aria-label={wt('wl.prevWeek')}><ChevronLeft size={14} /></button>
          <button type="button" className={cn('w-btn w-btn-sm', offset === 0 && 'w-btn-on')} onClick={() => setOffset(0)}>{wt('wl.thisWeek')}</button>
          <button type="button" className="w-btn w-btn-sm w-btn-icon" onClick={() => setOffset((o) => o + 1)} aria-label={wt('wl.nextWeek')}><ChevronRight size={14} /></button>
        </div>
        <select aria-label={wt('wl.weeksShown')} className="w-input h-8 w-auto py-0 pr-7 text-[13px]" value={span} onChange={(e) => setSpan(Number(e.target.value))}>
          {[2, 4, 8, 12].map((n) => <option key={n} value={n}>{wt('wl.nWeeks', { n })}</option>)}
        </select>
        {data.teamOptions.length > 0 && (
          <select aria-label={wt('wl.team')} className="w-input h-8 w-auto max-w-full py-0 pr-7 text-[13px]" value={teamId ?? ''} onChange={(e) => setTeamId(e.target.value ? Number(e.target.value) : undefined)}>
            <option value="">{wt('wl.allTeams')}</option>
            {data.teamOptions.map((t) => <option key={t.id} value={t.id}>{t.key} · {t.name}</option>)}
          </select>
        )}
        <select aria-label={wt('common.project')} className="w-input h-8 w-auto max-w-full py-0 pr-7 text-[13px]" value={projectId ?? ''} onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : undefined)}>
          <option value="">{wt('pf.allProjects')}</option>
          {data.projectOptions.map((p) => <option key={p.id} value={p.id}>{p.key} · {p.name}</option>)}
        </select>
        <select aria-label={wt('wl.hpp')} className="w-input h-8 w-auto py-0 pr-7 text-[13px]" value={hpp ?? data.hoursPerPoint} onChange={(e) => setHpp(Number(e.target.value))}>
          {[1, 2, 4, 6, 8].map((n) => <option key={n} value={n}>{wt('wl.ptEq', { n })}</option>)}
        </select>
        <span className="flex-1" />
        <button ref={helpBtn} type="button" className="w-btn w-btn-sm" onClick={help.toggle} aria-expanded={help.on}><CircleHelp size={13} /> {wt('wl.howLoad')}</button>
        <Popover open={help.on} onClose={help.close} anchorRef={helpBtn} width={360} align="end">
          <div className="p-3 text-[12.5px] leading-snug">
            <p className="mb-1.5 font-semibold">{wt('wl.loadFormula')}</p>
            <ul className="ml-3.5 list-disc space-y-1 text-[var(--w-text-2)]">
              {data.rules.conversion.map((c, i) => <li key={i}>{c}</li>)}
              <li>{wt('wl.overloadedRule', { p: data.rules.overloadPct })}</li>
            </ul>
          </div>
        </Popover>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-[var(--w-text-2)]">
        <span className="tabular-nums"><b className="font-semibold text-[var(--w-text)]">{data.people.length}</b> {wt('wl.nPeople', { count: data.people.length })}</span>
        <span className={cn('flex items-center gap-1 tabular-nums', overloaded && 'font-semibold text-[var(--w-red)]')}>
          {overloaded > 0 && <AlertTriangle size={13} />} {wt('wl.nOverloaded', { n: overloaded })}
        </span>
        <span className="flex flex-wrap items-center gap-2" aria-label={wt('wl.legend')}>
          {(['low', 'ok', 'high', 'over'] as const).map((lv) => (
            <span key={lv} className="inline-flex items-center gap-1"><span className="h-3 w-4 rounded-[3px] border border-[var(--w-border)]" style={{ background: LEVEL[lv].bg }} />{LEVEL[lv].label}</span>
          ))}
        </span>
        {data.truncated && <span className="text-[var(--w-orange)]">{wt('wl.first5000')}</span>}
      </div>

      {data.people.length > 0 && <TeamLoadChart data={data} />}

      {data.people.length === 0 ? (
        <EmptyState title={wt('wl.noOne')} body={wt('wl.noOneBody')} />
      ) : (
        <div className="overflow-x-auto rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)]" role="region" aria-label={wt('wl.grid')} tabIndex={0}>
          <table className="w-full border-collapse text-[13px]" style={{ minWidth: 150 + data.weeks.length * 104 }}>
            <thead>
              <tr className="bg-[var(--w-sunken)] text-[11px] font-medium uppercase tracking-[0.04em] text-[var(--w-text-3)]">
                <th scope="col" className="sticky left-0 z-[1] w-[150px] min-w-[150px] bg-[var(--w-sunken)] px-3 py-2 text-left font-medium md:w-[220px] md:min-w-[220px]">{wt('finance.person')}</th>
                {data.weeks.map((w) => (
                  <th key={w.start} scope="col" className={cn('min-w-[104px] px-1.5 py-2 text-left font-medium', w.start <= data.today && data.today <= w.end && 'text-[var(--w-accent-text)]')}>
                    {fmtDay(w.start)}<span className="font-normal normal-case"> – {fmtDay(w.end)}</span>
                  </th>
                ))}
                <th scope="col" className="min-w-[88px] px-2 py-2 text-left font-medium">{wt('common.total')}</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <Fragment key={g.team?.id ?? 'none'}>
                  {data.teams.length > 0 && (
                    <tr className="border-t border-[var(--w-border)] bg-[var(--w-bg)]">
                      <th scope="rowgroup" className="sticky left-0 z-[1] bg-[var(--w-bg)] px-3 py-1.5 text-left">
                        {g.team ? <span className="flex min-w-0 items-center gap-1.5"><TeamChip team={g.team} /><span className="truncate text-[12px] font-medium text-[var(--w-text-2)]">{g.team.name}</span></span>
                          : <span className="text-[12px] font-medium text-[var(--w-text-3)]">{wt('studio.noTeam')}</span>}
                      </th>
                      {g.team ? g.team.weeks.map((w, i) => (
                        <td key={i} className="px-1.5 py-1"><span className="text-[12px] tabular-nums text-[var(--w-text-2)]">{h1(w.hours)}h <span className="text-[var(--w-text-3)]">/ {h1(w.capacity)}h</span></span></td>
                      )) : data.weeks.map((w) => <td key={w.start} />)}
                      <td className="px-2 py-1 text-[12px] text-[var(--w-text-3)]">{g.team?.overloadedPeople ? <span className="font-semibold text-[var(--w-red)]">{g.team.overloadedPeople} over</span> : ''}</td>
                    </tr>
                  )}
                  {g.people.map((p) => (
                    <tr key={`${g.team?.id ?? 'n'}-${p.user.id}`} className="border-t border-[var(--w-border)]" data-person={p.user.username}>
                      <th scope="row" className="sticky left-0 z-[1] bg-[var(--w-panel)] px-3 py-1.5 text-left font-normal">
                        <button type="button" onClick={() => setOpen({ person: p, week: null })} className="flex w-full min-w-0 items-center gap-2 text-left hover:underline">
                          <UserAvatar user={p.user} size={22} />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium">{userName(p.user)}</span>
                            <span className="block truncate text-[11px] text-[var(--w-text-3)]">
                              {wt('wl.hDay', { h: h1(p.hoursPerDay), d: p.capacitySource === 'default' ? wt('wl.defaultP') : '', u: p.unscheduled ? wt('wl.noDue', { n: p.unscheduled }) : '' })}
                            </span>
                          </span>
                          {p.overloaded && <AlertTriangle size={13} className="shrink-0 text-[var(--w-red)]" aria-label={wt('wl.overloaded')} />}
                        </button>
                      </th>
                      {p.weeks.map((w, i) => (
                        <td key={w.start} className="p-1">
                          <LoadCell
                            w={w}
                            label={wt('wl.cellLabel', { n: userName(p.user), w: fmtDay(w.start), a: h1(w.hours), b: h1(w.capacity), o: w.overloaded ? wt('wl.overloadedC') : '' })}
                            onOpen={w.issueIds.length ? () => setOpen({ person: p, week: i }) : undefined}
                          />
                        </td>
                      ))}
                      <td className="px-2 py-1.5 text-[12px] tabular-nums">
                        <span className="font-semibold">{h1(p.totalHours)}h</span>
                        <span className="block text-[11px] text-[var(--w-text-3)]">{p.totalCapacity ? `${p.pct ?? 0}%` : '—'}</span>
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog
        open={!!open}
        onClose={() => setOpen(null)}
        width={620}
        title={open ? (
          <span className="flex min-w-0 items-center gap-2">
            <UserAvatar user={open.person.user} size={20} />
            <span className="truncate">{userName(open.person.user)}{open.week !== null ? wt('wl.weekOf', { w: fmtDay(open.person.weeks[open.week].start) }) : wt('wl.allOpen')}</span>
          </span>
        ) : undefined}
      >
        {open && (() => {
          const list = issuesFor(open.person, open.week);
          const w = open.week !== null ? open.person.weeks[open.week] : null;
          return (
            <div className="space-y-3">
              {w && (
                <p className={cn('text-[13px]', w.overloaded ? 'font-medium text-[var(--w-red)]' : 'text-[var(--w-text-2)]')}>
                  {wt('wl.planned', { a: h1(w.hours), b: h1(w.capacity), count: w.workingDays, h: h1(open.person.hoursPerDay), p: w.pct !== null ? ` — ${w.pct}%` : '' })}
                </p>
              )}
              {open.person.timeOff.length > 0 && (
                <p className="text-[12px] text-[var(--w-text-3)]">{wt('wl.timeOff', { s: open.person.timeOff.map((t) => (t.start === t.end ? fmtDay(t.start) : `${fmtDay(t.start)} – ${fmtDay(t.end)}`)).join(', ') })}</p>
              )}
              <ul className="divide-y divide-[var(--w-border)] overflow-hidden rounded-[8px] border border-[var(--w-border)]">
                {list.map((i) => (
                  <li key={i.id} className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 px-3 py-2 text-[13px]">
                    <Link href={i.url} className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)] hover:underline">{i.key}</Link>
                    <span className="min-w-0 flex-1 truncate" title={i.title}>{i.title}</span>
                    <span className="shrink-0 text-[12px] tabular-nums text-[var(--w-text-2)]" title={SOURCE[i.source]}>{i.hours ? `${h1(i.hours)}h` : '—'} <span className="text-[var(--w-text-3)]">· {SOURCE[i.source]}</span></span>
                    <span className={cn('w-full text-[12px] tabular-nums sm:w-auto', i.overdue ? 'font-medium text-[var(--w-red)]' : 'text-[var(--w-text-3)]')}>
                      {i.due ? `${i.overdue ? wt('wl.overdueDot') : wt('wl.dueSp')}${fmtDay(i.due)}` : i.planDue ? wt(i.planSource === 'version' ? 'wl.byVersion' : 'wl.bySprint', { d: fmtDay(i.planDue), n: i.planLabel ?? '' }) : wt('wl.noDueDate')} · {i.status.name}
                    </span>
                  </li>
                ))}
                {!list.length && <li className="px-3 py-3 text-[13px] text-[var(--w-text-3)]">{wt('wl.noIssues')}</li>}
              </ul>
            </div>
          );
        })()}
      </Dialog>
    </div>
  );
}
