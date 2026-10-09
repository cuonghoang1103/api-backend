'use client';

/**
 * CTW Đóng góp — CHI TIẾT MỘT NGƯỜI: KPI có cách tính + ▲▼, tín hiệu kèm lý do, heatmap 26 tuần, xu hướng, giờ theo hoạt
 * động, dòng thời gian, việc trễ hạn (đang mở + đã xong trễ), code, tài liệu, họp. MEMBER (SELF) chỉ mở được chính mình.
 */

import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ExternalLink, GitCommitHorizontal, GitPullRequest } from 'lucide-react';
import { userName, workError, type ProjectConfig } from '@/lib/work-api';
import { contribKeys, workContribApi, type ContribRange, type ContribSummary, type MemberDetail } from '@/lib/work-contrib-api';
import KpiTile, { KpiRow } from '@/components/work/KpiTile';
import { EmptyState, PageLoading, UserAvatar } from '@/components/work/ui';
import { useAuthStore } from '@/store/authStore';
import { Card, SectionTitle, axisTick } from '../reports/shared';
import { Delta, fmtDayShort, fmtN, fmtPct, fmtWhen, Heatmap, MetricLabel } from './shared';
import { trDef, trSignal, trTimeline, trWindowLabel } from './serverText';
import { wt } from '@/components/work/i18n';

const KIND_LABEL: Record<string, string> = { get created() { return wt('contrib.kCreated'); }, get update() { return wt('contrib.kUpdated'); }, get comment() { return wt('contrib.kComment'); }, get worklog() { return wt('contrib.kTime'); }, get doc() { return wt('contrib.fDocs'); }, get test() { return wt('contrib.kTest'); }, get review() { return wt('contrib.fReviews'); }, get code() { return wt('contrib.fCode'); }, get chat() { return 'Chat'; }, get meeting() { return wt('contrib.kMeeting'); } };

export default function MemberView({ pid, config, range, memberId, summary, onPick, onOpenTask }: {
  pid: number; config: ProjectConfig; range: ContribRange; memberId: number | null; summary: ContribSummary | undefined;
  onPick: (id: number) => void; onOpenTask: (n: number) => void;
}) {
  const me = useAuthStore((s) => s.user?.id ?? null);
  const all = summary?.access.view === 'ALL';
  // SELF luôn là chính mình; ALL mặc định người đầu bảng.
  const uid = !all ? me : memberId ?? summary?.members[0]?.user.id ?? null;
  const q = useQuery({
    queryKey: contribKeys.member(pid, uid ?? 0, range),
    queryFn: () => workContribApi.member(pid, uid!, range),
    enabled: !!uid && (range.preset !== 'sprint' || !!range.sprintId),
  });
  const base = `/work/${config.workspace.slug}/${config.key}`;

  return (
    <div className="space-y-3">
      {all && summary && (
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={wt('contrib.pickMember')}>
          {summary.members.map((r) => (
            <button key={r.user.id} type="button" aria-pressed={r.user.id === uid} onClick={() => onPick(r.user.id)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[12px] ${r.user.id === uid ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-text)]' : 'border-[var(--w-border)] text-[var(--w-text-2)] hover:text-[var(--w-text)]'}`}>
              <UserAvatar user={r.user} size={18} />{userName(r.user)}
            </button>
          ))}
        </div>
      )}
      {q.isLoading || !uid ? <PageLoading rows={8} /> : q.error || !q.data ? (
        <EmptyState title={wt('contrib.loadMemberFailed')} body={q.error ? workError(q.error) : undefined} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>{wt('common.tryAgain')}</button>} />
      ) : <Detail d={q.data} defs={Object.fromEntries(Object.entries(summary?.definitions ?? {}).map(([k, x]) => [k, trDef(k, x) ?? x]))} base={base} onOpenTask={onOpenTask} />}
    </div>
  );
}

function Detail({ d, defs, base, onOpenTask }: { d: MemberDetail; defs: Record<string, { label: string; how: string }>; base: string; onOpenTask: (n: number) => void }) {
  const m = d.metrics;
  const unit = d.unit === 'HOURS' ? 'h' : wt('contrib.pts');
  const acts = Object.entries(m.hoursByActivity).sort((a, b) => b[1] - a[1]).map(([name, hours]) => ({ name, hours }));
  const trend = d.trend.keys.map((k, i) => ({ k, actions: d.trend.actions[i] ?? 0 }));
  const issueLink = (n: number, title: string) => (
    <button type="button" className="min-w-0 truncate text-left hover:underline" onClick={() => onOpenTask(n)} title={wt('contrib.seeWho')}>
      <span className="font-medium text-[var(--w-text-2)]">#{n}</span> {title}
    </button>
  );
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <UserAvatar user={d.user} size={40} />
        <div className="min-w-0">
          <h2 className="truncate text-[17px] font-semibold tracking-[-0.01em]">{userName(d.user)}{d.self && <span className="ml-2 text-[12px] font-normal text-[var(--w-text-3)]">{wt('contrib.youParen')}</span>}</h2>
          <p className="text-[12px] text-[var(--w-text-3)]">{wt('contrib.memberLine', { role: d.user.isAgent ? 'AI agent' : d.user.role === 'ADMIN' ? wt('common.admin') : d.user.role === 'MEMBER' ? wt('common.member') : d.user.role === 'TEACHER' ? wt('contrib.teacher') : d.user.role.toLowerCase(), u: d.user.username, w: trWindowLabel(d.window.label), a: d.window.fromDay, b: d.window.toDay, last: m.lastActiveDay ? fmtDayShort(m.lastActiveDay) : wt('contrib.never') })}</p>
        </div>
      </div>

      {d.signals.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label={wt('contrib.signals')}>
          {d.signals.map((s) => (
            <li key={s.code} className={`rounded-full border px-2 py-0.5 text-[12px] ${s.level === 'warn' ? 'border-[var(--w-red-text)] text-[var(--w-red-text)]' : 'border-[var(--w-yellow-text)] text-[var(--w-yellow-text)]'}`}>{trSignal(s)}</li>
          ))}
        </ul>
      )}

      <KpiRow min={140} label={wt('contrib.memberMetrics')}>
        <KpiTile label={<MetricLabel label={wt('contrib.kCompleted')} how={defs.completed?.how} />} value={m.completed} hint={<span className="inline-flex gap-1.5">{fmtN(m.points)} {unit}{m.subtasksDone ? wt('contrib.subtasksPlus', { n: m.subtasksDone }) : ''}<Delta value={d.delta.completed} /></span>} />
        <KpiTile label={<MetricLabel label={wt('contrib.kOnTime')} how={defs.onTimeRate?.how} />} value={fmtPct(m.onTimeRate)} hint={m.withDue ? wt('contrib.avgLate', { a: m.onTime, b: m.withDue, d: fmtN(m.avgLateDays) }) : wt('contrib.noDatedIssues')} />
        <KpiTile label={<MetricLabel label={wt('contrib.kOverdue')} how={defs.overdueOpen?.how} />} value={m.overdueOpen} tone={m.overdueOpen ? 'red' : undefined} hint={wt('contrib.assignedRange', { n: m.assigned })} />
        <KpiTile label={<MetricLabel label={wt('contrib.cycleLead')} how={`${defs.cycleDays?.how} ${defs.leadDays?.how}`} />} value={`${fmtN(m.cycleDays)} / ${fmtN(m.leadDays)}`} hint={wt('contrib.daysAvg')} />
        <KpiTile label={<MetricLabel label={wt('contrib.kHours')} how={defs.hours?.how} />} value={fmtN(m.hours)} hint={<span className="inline-flex gap-1.5">{wt('contrib.hThisWeek', { v: fmtN(m.hoursThisWeek) })}<Delta value={d.delta.hours} good="none" /></span>} />
        <KpiTile label={<MetricLabel label={wt('contrib.kConv')} how={`${defs.comments?.how} ${defs.responseHours?.how}`} />} value={m.comments + (m.chatMessages ?? 0)} hint={wt('contrib.convHint', { a: m.comments, b: m.chatMessages ?? '—', c: m.voiceNotes })} />
        <KpiTile label={<MetricLabel label={wt('contrib.mentionsL')} how={defs.responseHours?.how} />} value={`${m.mentionsAnswered}/${m.mentions}`} hint={wt('contrib.answeredMedian', { v: fmtN(m.responseHours) })} />
        <KpiTile label={<MetricLabel label={wt('contrib.fReviews')} how={`${defs.reviewsDone?.how} ${defs.reviewRequests?.how}`} />} value={m.reviewsDone} hint={wt('contrib.nRequested', { n: m.reviewRequests })} />
        <KpiTile label={<MetricLabel label={wt('contrib.fCode')} how={`${defs.commits?.how} ${defs.lines?.how}`} />} value={m.commits + m.prs} hint={`${wt('contrib.commitsPrs', { a: m.commits, b: m.prs })}${m.additions !== null ? ` · +${m.additions}/−${m.deletions}` : ''}`} />
        <KpiTile label={<MetricLabel label={wt('contrib.fDocs')} how={defs.docVersions?.how} />} value={m.docVersions} hint={wt('contrib.pagesNew', { a: m.pagesEdited, b: m.pagesCreated })} />
        <KpiTile label={<MetricLabel label={wt('contrib.fTests')} how={`${defs.testRuns?.how} ${defs.utcid?.how} ${defs.defectsFound?.how}`} />} value={m.testRuns + m.utcidExecuted + m.itExecuted} hint={wt('contrib.testHint', { a: m.testCasesCreated + m.utcidCreated, b: m.defectsFound, c: m.bugsReported })} />
        <KpiTile label={<MetricLabel label={wt('contrib.fMeet')} how={defs.meetings?.how} />} value={m.meetingsInvited ? `${m.meetingsAttended}/${m.meetingsInvited}` : '—'} hint={wt('contrib.attendedInvited')} />
        <KpiTile label={<MetricLabel label={wt('contrib.kActive')} how={defs.activeDays?.how} />} value={`${m.activeDays}/${d.window.days}`} hint={wt('contrib.streakGap', { a: m.longestStreak, b: m.longestSilence })} />
      </KpiRow>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <SectionTitle>{wt('contrib.activity26')}</SectionTitle>
          <Heatmap data={d.heatmap} label={wt('contrib.activity26Aria', { name: userName(d.user) })} />
        </Card>
        <Card>
          <SectionTitle>{wt('contrib.actionsPer', { u: d.trend.bucket === 'week' ? wt('contrib.weekLc') : wt('common.day').toLowerCase() })}</SectionTitle>
          <div className="h-[150px]" role="img" aria-label={wt('contrib.actionsPerRange', { u: d.trend.bucket === 'week' ? wt('contrib.weekLc') : wt('common.day').toLowerCase() })}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="var(--w-chart-grid)" vertical={false} />
                <XAxis dataKey="k" tick={axisTick} tickFormatter={fmtDayShort} tickLine={false} axisLine={false} minTickGap={18} />
                <YAxis tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} width={36} />
                <Tooltip cursor={{ fill: 'var(--w-hover)' }} contentStyle={{ background: 'var(--w-raised)', border: '1px solid var(--w-border-strong)', borderRadius: 8, fontSize: 12 }} labelFormatter={(l) => fmtDayShort(String(l))} />
                <Bar dataKey="actions" name="Actions" fill="var(--w-chart-1)" radius={[3, 3, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {acts.length > 0 && (
            <div className="mt-3">
              <div className="mb-1 text-[11.5px] text-[var(--w-text-2)]">{wt('contrib.hoursByAct')}</div>
              <ul className="space-y-1">
                {acts.map((a) => (
                  <li key={a.name} className="flex items-center gap-2 text-[12px]">
                    <span className="w-24 shrink-0 truncate text-[var(--w-text-2)]">{a.name}</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--w-sunken)]"><span className="block h-full rounded-full bg-[var(--w-chart-3)]" style={{ width: `${(a.hours / Math.max(...acts.map((x) => x.hours))) * 100}%` }} /></span>
                    <span className="w-12 shrink-0 text-right tabular-nums">{a.hours} h</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Card className="min-w-0">
          <SectionTitle right={<span className="text-[11px] text-[var(--w-text-3)]">{d.timelineTotal > d.timeline.length ? wt('contrib.latestOf', { a: d.timeline.length, b: d.timelineTotal }) : wt('contrib.nEvents', { n: d.timelineTotal })}</span>}>{wt('contrib.timeline')}</SectionTitle>
          {d.timeline.length ? (
            <ol className="max-h-[440px] space-y-0 overflow-y-auto pr-1">
              {d.timeline.map((e, i) => (
                <li key={i} className="flex min-w-0 items-baseline gap-2 border-b border-[var(--w-border)] py-1.5 text-[12.5px] last:border-0">
                  <time className="w-[92px] shrink-0 tabular-nums text-[11px] text-[var(--w-text-3)]" dateTime={e.at}>{fmtWhen(e.at)}</time>
                  <span className="w-16 shrink-0 text-[11px] font-medium text-[var(--w-text-2)]">{KIND_LABEL[e.kind] ?? e.kind}</span>
                  <span className="min-w-0 flex-1 truncate">
                    {trTimeline(e.text)}{e.issue && <>{/ of$/.test(e.text) ? ' ' : ' · '}{issueLink(e.issue.number, e.issue.title)}</>}
                    {e.url && e.kind === 'doc' && <a className="ml-1 text-[var(--w-accent-text)] hover:underline" href={`${base}/${e.url}`}>{wt('common.open').toLowerCase()}</a>}
                  </span>
                </li>
              ))}
            </ol>
          ) : <p className="py-8 text-center text-[12px] text-[var(--w-text-3)]">{wt('contrib.noActions')}</p>}
        </Card>

        <div className="min-w-0 space-y-3">
          <Card>
            <SectionTitle>{wt('contrib.overdueN', { n: d.overdue.length })}</SectionTitle>
            {d.overdue.length ? (
              <ul className="space-y-1 text-[12.5px]">
                {d.overdue.slice(0, 12).map((x) => <li key={x.number} className="flex min-w-0 items-center gap-2">{issueLink(x.number, x.title)}<span className="ml-auto shrink-0 text-[11px] text-[var(--w-red-text)]">{wt('contrib.dLate', { n: x.daysLate })}</span></li>)}
              </ul>
            ) : <p className="text-[12px] text-[var(--w-text-3)]">{wt('contrib.nothingOverdue')}</p>}
            {d.lateDone.length > 0 && (
              <>
                <div className="mb-1 mt-3 text-[11.5px] text-[var(--w-text-2)]">{wt('contrib.finishedLate')}</div>
                <ul className="space-y-1 text-[12.5px]">
                  {d.lateDone.slice(0, 8).map((x) => <li key={x.number} className="flex min-w-0 items-center gap-2">{issueLink(x.number, x.title)}<span className="ml-auto shrink-0 text-[11px] text-[var(--w-text-3)]">{wt('contrib.dueLate', { d: fmtDayShort(x.dueDate), n: x.daysLate })}</span></li>)}
                </ul>
              </>
            )}
          </Card>
          <Card>
            <SectionTitle>{wt('contrib.codeN', { n: d.code.length })}</SectionTitle>
            {d.code.length ? (
              <ul className="space-y-1 text-[12.5px]">
                {d.code.slice(0, 10).map((c, i) => (
                  <li key={i} className="flex min-w-0 items-center gap-2">
                    {c.kind === 'PR' ? <GitPullRequest size={13} className="shrink-0 text-[var(--w-text-3)]" aria-label={wt('contrib.tlPr')} /> : <GitCommitHorizontal size={13} className="shrink-0 text-[var(--w-text-3)]" aria-label="Commit" />}
                    <span className="min-w-0 flex-1 truncate">{c.title}</span>
                    {c.additions !== null && <span className="shrink-0 text-[11px] tabular-nums text-[var(--w-text-2)]">+{c.additions} −{c.deletions}</span>}
                    {c.url && <a href={c.url} target="_blank" rel="noreferrer" aria-label={wt('contrib.openGit')} className="shrink-0 text-[var(--w-text-3)] hover:text-[var(--w-text)]"><ExternalLink size={12} /></a>}
                  </li>
                ))}
              </ul>
            ) : <p className="text-[12px] text-[var(--w-text-3)]">{wt('contrib.noCommitsMatched')}</p>}
          </Card>
          <Card>
            <SectionTitle>{wt('contrib.docsMeetings')}</SectionTitle>
            {d.docs.length ? (
              <ul className="space-y-1 text-[12.5px]">
                {d.docs.slice(0, 8).map((p) => <li key={p.number} className="flex min-w-0 items-center gap-2"><a href={`${base}/docs/${p.number}`} className="min-w-0 flex-1 truncate hover:underline">{p.title}</a><span className="shrink-0 text-[11px] text-[var(--w-text-3)]">{wt('contrib.nVersions', { n: p.versions })}</span></li>)}
              </ul>
            ) : <p className="text-[12px] text-[var(--w-text-3)]">{wt('contrib.noDocEdits')}</p>}
            {d.meetings.length > 0 && (
              <ul className="mt-2 space-y-1 border-t border-[var(--w-border)] pt-2 text-[12.5px]">
                {d.meetings.map((x) => <li key={x.number} className="flex min-w-0 items-center gap-2"><span className="min-w-0 flex-1 truncate">{x.title}</span><span className="shrink-0 text-[11px] text-[var(--w-text-3)]">{fmtDayShort(x.startsAt)} · {x.attended ? wt('contrib.attended') : x.status === 'DONE' ? wt('contrib.missed') : wt('contrib.upcomingLc')}</span></li>)}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
