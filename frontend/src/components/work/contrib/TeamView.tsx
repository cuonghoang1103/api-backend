'use client';

/**
 * CTW Đóng góp — chế độ xem NHÓM: ô KPI có ▲▼ so kỳ trước, "cần chú ý" kèm lý do, bảng thành viên (sắp xếp được,
 * sparkline, nhãn trạng thái trung tính), biểu đồ: xu hướng hoạt động, việc theo trạng thái (cột chồng), tỉ lệ đúng hạn,
 * radar các mặt đóng góp, heatmap lịch 26 tuần, throughput + giờ log.
 * MEMBER (chế độ SELF): chỉ dòng của mình + trung vị nhóm; người khác ẩn — máy chủ đã không trả dữ liệu của họ.
 */

import { useMemo, useState } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart,
  ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { AlertTriangle, ArrowDown, ArrowUp, ChevronRight, EyeOff, Info } from 'lucide-react';
import { userName, workError, type ProjectConfig } from '@/lib/work-api';
import type { ContribSummary, MemberRow } from '@/lib/work-contrib-api';
import KpiTile, { KpiRow } from '@/components/work/KpiTile';
import { EmptyState, PageLoading, UserAvatar } from '@/components/work/ui';
import { cn } from '@/lib/utils';
import { Card, SectionTitle, axisTick } from '../reports/shared';
import { colorMap, Delta, fmtDayShort, fmtN, fmtPct, Heatmap, MetricLabel, Sparkline, STATUS_LABEL } from './shared';

type SortKey = 'name' | 'status' | 'completed' | 'points' | 'onTimeRate' | 'overdueOpen' | 'hours' | 'talk' | 'reviewsDone' | 'code' | 'docVersions' | 'tests' | 'meetings' | 'activeDays';

const talk = (r: MemberRow) => r.metrics.comments + (r.metrics.chatMessages ?? 0) + r.metrics.voiceNotes;
const tests = (r: MemberRow) => r.metrics.testRuns + r.metrics.testCasesCreated + r.metrics.utcidCreated + r.metrics.utcidExecuted + r.metrics.itExecuted;
const code = (r: MemberRow) => r.metrics.commits + r.metrics.prs;
const STATUS_ORDER = { attention: 0, watch: 1, ok: 2, idle: 3 } as const;

function TipBox({ active, payload, label, fmt }: { active?: boolean; payload?: Array<{ name?: string; value?: number; color?: string; fill?: string; stroke?: string }>; label?: string | number; fmt?: (l: string) => string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[var(--w-radius)] border border-[var(--w-border-strong)] bg-[var(--w-raised)] px-2.5 py-2 text-[12px] shadow-[var(--w-shadow-pop)]">
      {label !== undefined && <div className="mb-1 font-medium text-[var(--w-text)]">{fmt ? fmt(String(label)) : label}</div>}
      {payload.filter((p) => p.value !== undefined && p.value !== null).map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-[var(--w-text-2)]">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.color ?? p.fill ?? p.stroke }} />
          <span className="max-w-[160px] truncate">{p.name}</span>
          <span className="ml-auto pl-3 font-medium tabular-nums text-[var(--w-text)]">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function TeamView({ q, onOpenMember }: { pid: number; config: ProjectConfig; q: UseQueryResult<ContribSummary>; onOpenMember: (id: number) => void }) {
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'points', dir: 'desc' });
  const [showDefs, setShowDefs] = useState(false);
  const [radarIds, setRadarIds] = useState<number[] | null>(null);
  const data = q.data;
  const def = data?.definitions ?? {};
  const colors = useMemo(() => colorMap((data?.members ?? []).map((r) => r.user.id)), [data]);

  const rows = useMemo(() => {
    const list = [...(data?.members ?? [])];
    const val = (r: MemberRow): number | string => {
      switch (sort.key) {
        case 'name': return userName(r.user).toLowerCase();
        case 'status': return STATUS_ORDER[r.status];
        case 'talk': return talk(r);
        case 'code': return code(r);
        case 'tests': return tests(r);
        case 'meetings': return r.metrics.meetingsAttended;
        default: return (r.metrics[sort.key] as number | null) ?? -1;
      }
    };
    list.sort((a, b) => {
      if (a.user.isAgent !== b.user.isAgent) return a.user.isAgent ? 1 : -1;
      const x = val(a), y = val(b);
      const c = x < y ? -1 : x > y ? 1 : 0;
      return sort.dir === 'asc' ? c : -c;
    });
    return list;
  }, [data, sort]);

  const humans = rows.filter((r) => !r.user.isAgent);
  const facets = useMemo(() => {
    // Radar: mỗi mặt chuẩn hoá theo người cao nhất nhóm (0–100) — chỉ so TƯƠNG ĐỐI trong nhóm, không phải điểm.
    const F: Array<{ key: string; label: string; get: (r: MemberRow) => number }> = [
      { key: 'delivery', label: 'Delivery', get: (r) => r.metrics.points },
      { key: 'deadlines', label: 'Deadlines', get: (r) => r.metrics.onTimeRate ?? 0 },
      { key: 'talk', label: 'Communication', get: talk },
      { key: 'reviews', label: 'Reviews', get: (r) => r.metrics.reviewsDone + r.metrics.reviewRequests },
      { key: 'code', label: 'Code', get: code },
      { key: 'docs', label: 'Docs', get: (r) => r.metrics.docVersions },
      { key: 'tests', label: 'Testing', get: tests },
      { key: 'meet', label: 'Meetings', get: (r) => r.metrics.meetingsAttended },
    ];
    const max = Object.fromEntries(F.map((f) => [f.key, Math.max(1, ...humans.map(f.get))]));
    return F.map((f) => ({ facet: f.label, ...Object.fromEntries(humans.map((r) => [String(r.user.id), Math.round((f.get(r) / max[f.key]) * 100)])) }));
  }, [humans]);

  if (q.isLoading) return <PageLoading rows={8} />;
  if (q.error || !data) {
    return <EmptyState title="Could not load contributions" body={q.error ? workError(q.error) : undefined} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />;
  }

  const t = data.team.totals;
  const dl = data.team.delta ?? {};
  const all = data.access.view === 'ALL';
  const unit = data.unit === 'HOURS' ? 'h' : 'pts';
  const shownRadar = (radarIds ?? humans.slice(0, 3).map((r) => r.user.id)).filter((id) => humans.some((r) => r.user.id === id));
  const flagged = humans.filter((r) => r.signals.length);
  const keyFmt = (k: string) => (data.charts.bucket === 'week' ? `Week of ${fmtDayShort(k)}` : fmtDayShort(k));
  const trend = data.charts.keys.map((k, i) => ({ k, ...Object.fromEntries((all ? humans : []).map((r) => [String(r.user.id), r.spark[i] ?? 0])), team: data.charts.teamActivity[i] ?? 0, me: !all ? rows[0]?.spark[i] ?? 0 : 0, completed: data.charts.completed[i] ?? 0, hours: data.charts.hours[i] ?? 0 }));
  const mix = humans.map((r) => ({ name: userName(r.user), done: r.mix.done, inProgress: r.mix.inProgress, todo: r.mix.todo, overdue: r.mix.overdue }));
  const onTime = humans.filter((r) => r.metrics.withDue > 0).map((r) => ({ name: userName(r.user), rate: r.metrics.onTimeRate ?? 0, of: r.metrics.withDue }));

  const th = (k: SortKey, label: string, how?: string, right = true) => {
    const on = sort.key === k;
    return (
      <th key={k} scope="col" className={cn('whitespace-nowrap px-2.5 py-2 font-medium', right && 'text-right', k === 'name' && 'sticky left-0 z-[1] bg-[var(--w-panel)] text-left')} aria-sort={on ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
        <button type="button" onClick={() => setSort((s) => ({ key: k, dir: s.key === k ? (s.dir === 'asc' ? 'desc' : 'asc') : k === 'name' || k === 'status' ? 'asc' : 'desc' }))}
          className={cn('inline-flex items-center gap-1 hover:text-[var(--w-text)]', on && 'text-[var(--w-text)]')}>
          <MetricLabel label={label} how={how} />
          {on && (sort.dir === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />)}
        </button>
      </th>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start gap-2 rounded-[var(--w-radius-lg)] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2.5 text-[12px] text-[var(--w-text-2)]">
        <Info size={14} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />
        <p className="min-w-0 flex-1">
          <span className="font-medium text-[var(--w-text)]">{data.window.label}</span> · {data.window.fromDay} → {data.window.toDay} ({data.window.tz})
          {data.previous && <> · compared with {data.previous.fromDay} → {data.previous.toDay}</>}. {data.note}
          {!data.chatConnected && ' Project chat is not set up yet, so chat messages show as —.'}
        </p>
        <button type="button" className="w-btn w-btn-ghost w-btn-sm" aria-expanded={showDefs} onClick={() => setShowDefs((v) => !v)}>How numbers are counted</button>
        {showDefs && (
          <dl className="grid w-full gap-x-6 gap-y-1.5 pt-1 sm:grid-cols-2">
            {Object.entries(def).map(([k, d]) => (
              <div key={k} className="min-w-0"><dt className="font-medium text-[var(--w-text)]">{d.label}</dt><dd className="text-[var(--w-text-2)]">{d.how}</dd></div>
            ))}
          </dl>
        )}
      </div>

      <KpiRow min={128} label="Team totals">
        <KpiTile label={<MetricLabel label="Completed" how={def.completed?.how} />} value={t.completed} hint={<span className="inline-flex items-center gap-1.5">{fmtN(t.points)} {unit}<Delta value={dl.completed} /></span>} title={def.completed?.how} />
        <KpiTile label={<MetricLabel label="On time" how={def.onTimeRate?.how} />} value={fmtPct(t.onTimeRate)} hint={<span className="inline-flex items-center gap-1.5">{t.onTime}/{t.withDue} dated<Delta value={dl.onTimeRate} /></span>} />
        <KpiTile label={<MetricLabel label="Overdue now" how={def.overdueOpen?.how} />} value={t.overdueOpen} tone={t.overdueOpen ? 'red' : undefined} hint="open, past due date" />
        <KpiTile label={<MetricLabel label="Hours logged" how={def.hours?.how} />} value={fmtN(t.hours)} hint={<span className="inline-flex items-center gap-1.5">median {fmtN(data.team.medians.hours)} h each<Delta value={dl.hours} good="none" /></span>} />
        <KpiTile label={<MetricLabel label="Conversation" how={`${def.comments?.how} ${def.chatMessages?.how}`} />} value={t.comments + (t.chatMessages ?? 0)} hint={<span className="inline-flex items-center gap-1.5">{t.comments} comments · {t.chatMessages ?? '—'} chat<Delta value={dl.comments} good="none" /></span>} />
        <KpiTile label={<MetricLabel label="Code" how={def.commits?.how} />} value={t.commits + t.prs} hint={<span className="inline-flex items-center gap-1.5">{t.commits} commits · {t.prs} PRs{t.additions !== null && ` · +${t.additions}/−${t.deletions}`}</span>} />
        <KpiTile label={<MetricLabel label="Docs & tests" how={`${def.docVersions?.how} ${def.testRuns?.how}`} />} value={t.docVersions + t.testRuns + t.utcidExecuted + t.itExecuted} hint={`${t.docVersions} doc versions · ${t.testRuns + t.utcidExecuted + t.itExecuted} test runs`} />
        <KpiTile label={<MetricLabel label="Active days" how={def.activeDays?.how} />} value={fmtN(t.activeDaysAvg)} hint={`avg of ${data.window.days} days`} />
      </KpiRow>

      {flagged.length > 0 && (
        <Card className="!p-3">
          <SectionTitle>Worth a conversation</SectionTitle>
          <ul className="grid gap-x-6 gap-y-1.5 md:grid-cols-2" aria-label="Members with signals">
            {flagged.map((r) => (
              <li key={r.user.id} className="flex min-w-0 items-start gap-2 text-[12.5px]">
                <UserAvatar user={r.user} size={20} />
                <div className="min-w-0">
                  <button type="button" className="font-medium hover:underline" onClick={() => onOpenMember(r.user.id)}>{userName(r.user)}</button>
                  <span className="text-[var(--w-text-2)]"> — {r.signals.map((s) => s.text).join(' · ')}</span>
                </div>
                {r.signals.some((s) => s.level === 'warn') && <AlertTriangle size={13} className="mt-0.5 shrink-0 text-[var(--w-red-text)]" aria-label="Warning" />}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-[var(--w-text-3)]">These are observations with reasons, not judgements. Check with the person before drawing conclusions.</p>
        </Card>
      )}

      <div className="overflow-x-auto rounded-[var(--w-radius-lg)] border border-[var(--w-border)] bg-[var(--w-panel)]">
        <table className="w-full min-w-[1080px] text-[13px]" data-testid="contrib-table">
          <caption className="sr-only">Contribution per member, {data.window.label}</caption>
          <thead className="sticky top-0 z-[2] bg-[var(--w-panel)]">
            <tr className="border-b border-[var(--w-border)] text-left text-[11.5px] text-[var(--w-text-3)]">
              {th('name', 'Member', undefined, false)}
              {th('status', 'Status', 'Observation based on the signals below — never a rating of the person.', false)}
              {th('completed', 'Done', def.completed?.how)}
              {th('points', `Points`, def.points?.how)}
              {th('onTimeRate', 'On time', def.onTimeRate?.how)}
              {th('overdueOpen', 'Overdue', def.overdueOpen?.how)}
              {th('hours', 'Hours', def.hours?.how)}
              {th('talk', 'Talk', `${def.comments?.how} ${def.chatMessages?.how} ${def.voiceNotes?.how}`)}
              {th('reviewsDone', 'Reviews', def.reviewsDone?.how)}
              {th('code', 'Code', def.commits?.how)}
              {th('docVersions', 'Docs', def.docVersions?.how)}
              {th('tests', 'Tests', `${def.testRuns?.how} ${def.utcid?.how}`)}
              {th('meetings', 'Meetings', def.meetings?.how)}
              {th('activeDays', 'Active', def.activeDays?.how)}
              <th scope="col" className="px-2.5 py-2 text-left font-medium"><MetricLabel label="Trend" how="Actions per day (per week for long ranges)." /></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const m = r.metrics;
              const sl = STATUS_LABEL[r.status];
              return (
                <tr key={r.user.id} className="group border-b border-[var(--w-border)] last:border-0 hover:bg-[var(--w-hover)]">
                  <td className="sticky left-0 z-[1] bg-[var(--w-panel)] px-2.5 py-2 group-hover:bg-[var(--w-hover)]">
                    <button type="button" onClick={() => onOpenMember(r.user.id)} className="flex min-w-0 max-w-[200px] items-center gap-2 text-left" aria-label={`Open details for ${userName(r.user)}`}>
                      <span className="h-6 w-1 shrink-0 rounded-full" style={{ background: colors.get(r.user.id) }} aria-hidden="true" />
                      <UserAvatar user={r.user} size={24} />
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{userName(r.user)}</span>
                        <span className="block truncate text-[11px] text-[var(--w-text-3)]">{r.user.isAgent ? 'AI agent' : r.user.role.toLowerCase()} · @{r.user.username}</span>
                      </span>
                      <ChevronRight size={13} className="shrink-0 opacity-0 group-hover:opacity-60" aria-hidden="true" />
                    </button>
                  </td>
                  <td className="px-2.5 py-2">
                    <span className={cn('inline-flex whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium', sl.cls)} title={r.signals.map((s) => s.text).join('\n') || 'No signals in this range'}>
                      {sl.text}{r.signals.length > 0 && <span className="sr-only">: {r.signals.map((s) => s.text).join('; ')}</span>}
                    </span>
                  </td>
                  <td className="px-2.5 py-2 text-right tabular-nums">{m.completed}{m.subtasksDone > 0 && <span className="text-[11px] text-[var(--w-text-3)]"> +{m.subtasksDone}</span>}<div><Delta value={r.delta.completed} /></div></td>
                  <td className="px-2.5 py-2 text-right tabular-nums">{fmtN(m.points)}<div className="text-[11px] text-[var(--w-text-3)]">{t.points ? `${Math.round((m.points / t.points) * 100)}%` : ''}</div></td>
                  <td className="px-2.5 py-2 text-right tabular-nums">{fmtPct(m.onTimeRate)}<div className="text-[11px] text-[var(--w-text-3)]">{m.withDue ? `${m.onTime}/${m.withDue}` : ''}</div></td>
                  <td className={cn('px-2.5 py-2 text-right tabular-nums', m.overdueOpen > 0 && 'font-medium text-[var(--w-red-text)]')}>{m.overdueOpen}</td>
                  <td className="px-2.5 py-2 text-right tabular-nums">{fmtN(m.hours)}</td>
                  <td className="px-2.5 py-2 text-right tabular-nums" title={`${m.comments} comments · ${m.chatMessages ?? '—'} chat · ${m.voiceNotes} voice · reply ${m.responseHours ?? '—'} h`}>{talk(r)}</td>
                  <td className="px-2.5 py-2 text-right tabular-nums" title={`${m.reviewsDone} done · ${m.reviewRequests} requested`}>{m.reviewsDone}</td>
                  <td className="px-2.5 py-2 text-right tabular-nums" title={`${m.commits} commits · ${m.prs} PRs${m.additions !== null ? ` · +${m.additions} −${m.deletions}` : ''}`}>{code(r)}</td>
                  <td className="px-2.5 py-2 text-right tabular-nums">{m.docVersions}</td>
                  <td className="px-2.5 py-2 text-right tabular-nums">{tests(r)}</td>
                  <td className="px-2.5 py-2 text-right tabular-nums">{m.meetingsInvited ? `${m.meetingsAttended}/${m.meetingsInvited}` : '—'}</td>
                  <td className="px-2.5 py-2 text-right tabular-nums">{m.activeDays}<span className="text-[11px] text-[var(--w-text-3)]">/{data.window.days}</span></td>
                  <td className="px-2.5 py-2"><Sparkline data={r.spark} color={colors.get(r.user.id)} label={`${userName(r.user)} activity`} /></td>
                </tr>
              );
            })}
            {!all && (
              <tr className="bg-[var(--w-sunken)] text-[var(--w-text-2)]">
                <td className="sticky left-0 bg-[var(--w-sunken)] px-2.5 py-2" colSpan={2}>
                  <span className="inline-flex items-center gap-1.5 text-[12px]"><EyeOff size={13} aria-hidden="true" /> Team median of {data.team.humans} people · {data.hiddenMembers} others hidden</span>
                </td>
                <td className="px-2.5 py-2 text-right tabular-nums">{fmtN(data.team.medians.completed)}</td>
                <td className="px-2.5 py-2 text-right tabular-nums">{fmtN(data.team.medians.points)}</td>
                <td className="px-2.5 py-2 text-right tabular-nums">{fmtPct(t.onTimeRate)}</td>
                <td className="px-2.5 py-2 text-right tabular-nums" colSpan={1}>—</td>
                <td className="px-2.5 py-2 text-right tabular-nums">{fmtN(data.team.medians.hours)}</td>
                <td className="px-2.5 py-2 text-[11px]" colSpan={6}>Only project admins and teachers see each member. Ask an admin to turn on “Team can see details”.</td>
                <td className="px-2.5 py-2 text-right tabular-nums">{fmtN(data.team.medians.activeDays)}</td>
                <td />
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!rows.length && <EmptyState title="No members to show" body="Add members to the project to see their contribution." />}

      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <SectionTitle>{all ? 'Activity by member' : 'Your activity vs the team'}</SectionTitle>
          <div className="h-[220px]" role="img" aria-label="Actions per day by member">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="var(--w-chart-grid)" vertical={false} />
                <XAxis dataKey="k" tick={axisTick} tickFormatter={fmtDayShort} tickLine={false} axisLine={false} minTickGap={24} />
                <YAxis tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} width={40} />
                <Tooltip content={<TipBox fmt={keyFmt} />} />
                {all
                  ? humans.slice(0, 8).map((r) => <Area key={r.user.id} type="monotone" dataKey={String(r.user.id)} name={userName(r.user)} stackId="a" stroke={colors.get(r.user.id)} fill={colors.get(r.user.id)} fillOpacity={0.35} strokeWidth={1.5} isAnimationActive={false} />)
                  : <>
                      <Area type="monotone" dataKey="team" name="Whole team" stroke="var(--w-chart-8)" fill="var(--w-chart-8)" fillOpacity={0.15} strokeWidth={1.5} isAnimationActive={false} />
                      {rows[0] && <Area type="monotone" dataKey="me" name="You" stroke="var(--w-chart-1)" fill="var(--w-chart-1)" fillOpacity={0.3} strokeWidth={1.5} isAnimationActive={false} />}
                    </>}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <Legendish items={all ? humans.slice(0, 8).map((r) => ({ label: userName(r.user), color: colors.get(r.user.id)! })) : [{ label: 'Whole team (all actions)', color: 'var(--w-chart-8)' }, { label: 'You', color: 'var(--w-chart-1)' }]} />
        </Card>

        <Card>
          <SectionTitle>Work by status</SectionTitle>
          <div className="h-[220px]" role="img" aria-label="Issues assigned in the range by current status, per member">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mix} layout="vertical" margin={{ top: 4, right: 12, left: 4, bottom: 0 }} barCategoryGap={6}>
                <CartesianGrid stroke="var(--w-chart-grid)" horizontal={false} />
                <XAxis type="number" tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={axisTick} tickLine={false} axisLine={false} width={92} />
                <Tooltip content={<TipBox />} cursor={{ fill: 'var(--w-hover)' }} />
                <Bar dataKey="done" name="Done" stackId="s" fill="var(--w-green)" stroke="var(--w-panel)" strokeWidth={1} maxBarSize={26} isAnimationActive={false} />
                <Bar dataKey="inProgress" name="In progress" stackId="s" fill="var(--w-chart-1)" stroke="var(--w-panel)" strokeWidth={1} maxBarSize={26} isAnimationActive={false} />
                <Bar dataKey="todo" name="To do" stackId="s" fill="var(--w-chart-8)" stroke="var(--w-panel)" strokeWidth={1} maxBarSize={26} isAnimationActive={false} />
                <Bar dataKey="overdue" name="Overdue" stackId="s" fill="var(--w-red)" stroke="var(--w-panel)" strokeWidth={1} radius={[0, 4, 4, 0]} maxBarSize={26} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Legendish items={[{ label: 'Done', color: 'var(--w-green)' }, { label: 'In progress', color: 'var(--w-chart-1)' }, { label: 'To do', color: 'var(--w-chart-8)' }, { label: 'Overdue', color: 'var(--w-red)' }]} />
        </Card>

        <Card>
          <SectionTitle right={<span className="text-[11px] text-[var(--w-text-3)]">team {fmtPct(t.onTimeRate)}</span>}>On-time rate</SectionTitle>
          {onTime.length ? (
            <div className="h-[200px]" role="img" aria-label="Share of dated issues finished by the due date, per member">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={onTime} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }} barCategoryGap={8}>
                  <CartesianGrid stroke="var(--w-chart-grid)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={axisTick} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" tick={axisTick} tickLine={false} axisLine={false} width={92} />
                  <Tooltip content={<TipBox />} cursor={{ fill: 'var(--w-hover)' }} />
                  {t.onTimeRate !== null && <ReferenceLine x={t.onTimeRate} stroke="var(--w-text-3)" strokeDasharray="4 3" />}
                  <Bar dataKey="rate" name="On time %" fill="var(--w-chart-2)" radius={[0, 4, 4, 0]} maxBarSize={26} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <p className="py-10 text-center text-[12px] text-[var(--w-text-3)]">No completed issues with a due date in this range.</p>}
          <p className="text-[11px] text-[var(--w-text-3)]">Dashed line = team rate. Only issues that had a due date count.</p>
        </Card>

        {all && humans.length > 1 && <Card>
          <SectionTitle right={all && humans.length > 1 ? (
            <div className="flex flex-wrap justify-end gap-1" role="group" aria-label="Members on the radar">
              {humans.slice(0, 8).map((r) => {
                const on = shownRadar.includes(r.user.id);
                return (
                  <button key={r.user.id} type="button" aria-pressed={on} onClick={() => setRadarIds(on ? shownRadar.filter((x) => x !== r.user.id) : [...shownRadar, r.user.id].slice(-3))}
                    className={cn('inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[11px]', on ? 'border-[var(--w-border-strong)] text-[var(--w-text)]' : 'border-[var(--w-border)] text-[var(--w-text-3)]')}>
                    <span className="h-2 w-2 rounded-full" style={{ background: colors.get(r.user.id) }} aria-hidden="true" />{userName(r.user).split(' ').slice(-1)[0]}
                  </button>
                );
              })}
            </div>
          ) : undefined}>Shape of contribution</SectionTitle>
          <div className="h-[230px]" role="img" aria-label="Each member's contribution across eight areas, relative to the highest in the team">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={facets} outerRadius="72%">
                <PolarGrid stroke="var(--w-chart-grid)" />
                <PolarAngleAxis dataKey="facet" tick={{ ...axisTick, fontSize: 10.5 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip content={<TipBox />} />
                {shownRadar.map((id) => {
                  const r = humans.find((x) => x.user.id === id)!;
                  return <Radar key={id} dataKey={String(id)} name={userName(r.user)} stroke={colors.get(id)} fill={colors.get(id)} fillOpacity={0.12} strokeWidth={1.5} isAnimationActive={false} />;
                })}
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-[var(--w-text-3)]">Each axis is relative to the most active teammate on that axis (100). It shows where someone spends effort, not how good it is.</p>
        </Card>}

        <Card>
          <SectionTitle>Team activity — last 26 weeks</SectionTitle>
          <Heatmap data={data.charts.heatmap} label="Team actions per day over the last 26 weeks" />
        </Card>

        <Card>
          <SectionTitle>Throughput and logged hours</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            {([['completed', 'Issues completed', 'var(--w-chart-1)'], ['hours', 'Hours logged', 'var(--w-chart-3)']] as const).map(([k, label, color]) => (
              <div key={k} className="min-w-0">
                <div className="mb-1 text-[11.5px] text-[var(--w-text-2)]">{label}</div>
                <div className="h-[150px]" role="img" aria-label={`${label} per ${data.charts.bucket}`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trend} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                      <CartesianGrid stroke="var(--w-chart-grid)" vertical={false} />
                      <XAxis dataKey="k" tick={axisTick} tickFormatter={fmtDayShort} tickLine={false} axisLine={false} minTickGap={18} />
                      <YAxis tick={axisTick} tickLine={false} axisLine={false} allowDecimals={k === 'hours'} width={36} />
                      <Tooltip content={<TipBox fmt={keyFmt} />} cursor={{ fill: 'var(--w-hover)' }} />
                      <Bar dataKey={k} name={label} fill={color} radius={[3, 3, 0, 0]} isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      {data.team.agents > 0 && data.team.agentTotals && (
        <p className="text-[12px] text-[var(--w-text-3)]">AI agents ({data.team.agents}) are listed at the bottom and are not counted in team totals: {data.team.agentTotals.completed} issue{data.team.agentTotals.completed === 1 ? '' : 's'} completed, {data.team.agentTotals.commits} commit{data.team.agentTotals.commits === 1 ? '' : 's'}.</p>
      )}
    </div>
  );
}

function Legendish({ items }: { items: Array<{ label: string; color: string }> }) {
  return (
    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] text-[var(--w-text-2)]">
      {items.map((it) => <span key={it.label} className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-[2px]" style={{ background: it.color }} aria-hidden="true" />{it.label}</span>)}
    </div>
  );
}
