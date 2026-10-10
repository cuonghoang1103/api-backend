'use client';

/**
 * Team overview — trang của TRƯỞNG NHÓM (UX-C, 11/10/2026), mục "Team overview" trong dự án.
 *
 * Một màn trả lời các câu hỏi đứng lớp/đứng họp: ai đang làm gì, ai đang quá tải, việc nào trễ, việc nào KẸT (quá lâu ở
 * một trạng thái), review nào đang chờ, sắp họp gì, hồ sơ FPT còn thiếu gì, ai có tín hiệu Đóng góp cần nói chuyện, câu
 * hỏi nào đang chờ giảng viên. Số liệu do máy chủ tính bằng các service sẵn có (uxc.service.teamOverview) — trang này
 * KHÔNG tính lại gì ngoài việc sắp/lọc để hiển thị.
 */

import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlarmClock, AlertTriangle, CalendarClock, ChevronRight, Eye, FileCheck2, Hourglass, MessageCircleQuestion, RefreshCw, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { uxcApi, uxcKeys, type TeamOverview as TO, type TeamPerson } from '@/lib/work-uxc-api';
import { FPT_DOCS, type DocState, type FptDoc } from '../teaching/teachingApi';
import { HealthChip } from '../teaching/TeachingHub';
import { useLookups } from '../hooks';
import { EmptyState, PageLoading, StatusBadge, UserAvatar } from '../ui';
import KpiTile, { KpiRow } from '../KpiTile';
import DataTable, { type DataColumn } from '../table/DataTable';
import IssueDrawer from '../IssueDrawer';
import { STATUS_LABEL } from '../contrib/shared';
import { trSignal } from '../contrib/serverText';
import { useWT, wt, type WKey } from '@/components/work/i18n';
import { statusName } from '@/components/work/i18n/names';

const DOC_TONE: Record<DocState, string> = {
  SUBMITTED: 'bg-[var(--w-green)] border-transparent',
  DRAFT: 'bg-[var(--w-yellow)] border-transparent',
  MISSING: 'bg-transparent border-[var(--w-red-text)]',
  NA: 'bg-[var(--w-sunken)] border-[var(--w-border)]',
};

function Panel({ title, icon, count, tone, children, action, testId }: { title: string; icon: ReactNode; count?: number; tone?: 'red' | 'orange' | 'accent'; children: ReactNode; action?: ReactNode; testId?: string }) {
  return (
    <section className="rounded-[var(--w-radius-lg)] border border-[var(--w-border)] bg-[var(--w-panel)]" aria-label={title} data-testid={testId}>
      <header className="flex items-center gap-2 border-b border-[var(--w-border)] px-3.5 py-2.5">
        <span className="text-[var(--w-text-3)]" aria-hidden="true">{icon}</span>
        <h2 className="shrink-0 text-[13px] font-semibold">{title}</h2>
        {count !== undefined && (
          <span className={cn('rounded-full px-1.5 text-[11.5px] font-medium tabular-nums',
            count && tone === 'red' ? 'bg-[color-mix(in_srgb,var(--w-red)_14%,transparent)] text-[var(--w-red-text)]'
              : count && tone === 'orange' ? 'bg-[color-mix(in_srgb,var(--w-orange)_14%,transparent)] text-[var(--w-orange-text)]'
                : 'bg-[var(--w-sunken)] text-[var(--w-text-2)]')}>{count}</span>
        )}
        {action && <span className="ml-auto min-w-0 truncate">{action}</span>}
      </header>
      <div className="p-1.5">{children}</div>
    </section>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="px-2.5 py-3 text-[12.5px] text-[var(--w-text-3)]">{children}</p>;
}

export default function TeamOverview({ config }: { config: ProjectConfig }) {
  const pid = config.id;
  const { t, intl, fmtShortDate, fmtDateTime, fmtNumber } = useWT();
  const lk = useLookups(config);
  const [open, setOpen] = useState<number | null>(null);
  const q = useQuery({ queryKey: uxcKeys.team(pid), queryFn: () => uxcApi.team(pid), refetchInterval: 120_000 });
  const base = `/work/${config.workspace.slug}/${config.key}`;

  if (q.isLoading) return <PageLoading rows={8} />;
  if (q.error || !q.data) {
    return <EmptyState title={t('uxc.teamLoadFailed')} body={q.error ? workError(q.error) : undefined} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>{t('common.tryAgain')}</button>} />;
  }
  const d: TO = q.data;
  const unit = d.unit === 'HOURS' ? 'h' : t('uxc.pts');
  const member = (id: number | null) => (id ? config.members.find((m) => m.id === id) ?? null : null);
  const issueBtn = (num: number, title: string, extra?: ReactNode, sub?: ReactNode) => (
    <button type="button" onClick={() => setOpen(num)} className="flex w-full min-w-0 items-center gap-2 rounded-[6px] px-2.5 py-1.5 text-left hover:bg-[var(--w-hover)]">
      <span className="shrink-0 font-mono text-[11.5px] text-[var(--w-text-3)]">{lk.issueKey(num)}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px]">{title}</span>
        {sub && <span className="block truncate text-[11.5px] text-[var(--w-text-3)]">{sub}</span>}
      </span>
      {extra}
    </button>
  );
  const maxLoad = Math.max(1, ...d.people.map((p) => p.total));

  const peopleCols: DataColumn<TeamPerson>[] = [
    {
      id: 'person', header: t('uxc.colMember'), width: 190, required: true, value: (p) => p.name, text: (p) => `${p.name} ${p.user.username}`,
      cell: (p) => {
        const st = p.contribStatus && (STATUS_LABEL as Record<string, { text: string; cls: string }>)[p.contribStatus];
        return (
          <span className="flex min-w-0 items-center gap-2">
            <UserAvatar user={p.user} size={24} />
            <span className="min-w-0">
              <span className="block truncate font-medium" title={p.name}>{p.name}</span>
              <span className="flex min-w-0 items-center gap-1 text-[11px] text-[var(--w-text-3)]">
                <span className="truncate">{p.user.kind === 'AGENT' ? 'AI agent' : t(`uxc.role_${p.role}` as WKey)}</span>
                {st && p.contribStatus !== 'ok' && <span className={cn('shrink-0 rounded-full border px-1.5 leading-[14px]', st.cls)} title={p.signals.map((s) => trSignal(s)).join('\n')}>{st.text}</span>}
              </span>
            </span>
          </span>
        );
      },
    },
    {
      id: 'doing', header: t('uxc.colDoing'), width: 220, grow: true, sortable: false, value: (p) => p.doing.map((x) => lk.issueKey(x.number)).join(', ') || null,
      cell: (p) => (p.doing.length ? (
        <span className="flex min-w-0 flex-nowrap gap-1 overflow-hidden">
          {p.doing.slice(0, 3).map((x) => (
            <button key={x.number} type="button" onClick={() => setOpen(x.number)} title={`${lk.issueKey(x.number)} ${x.title}${x.days !== null ? ` · ${t('uxc.daysInStatus', { n: x.days })}` : ''}`}
              className={cn('inline-flex min-w-0 max-w-[200px] shrink items-center gap-1 rounded-[5px] border px-1.5 py-0.5 text-[11.5px] hover:bg-[var(--w-hover)]', x.flagged ? 'border-[var(--w-red-text)]' : 'border-[var(--w-border)]')}>
              <span className="shrink-0 font-mono text-[var(--w-text-3)]">{lk.issueKey(x.number)}</span>
              <span className="truncate">{x.title}</span>
              {x.days !== null && <span className="shrink-0 tabular-nums text-[var(--w-text-3)]">{fmtNumber(x.days)}d</span>}
            </button>
          ))}
          {p.doing.length > 3 && <span className="self-center text-[11px] text-[var(--w-text-3)]">+{p.doing.length - 3}</span>}
        </span>
      ) : <span className="text-[12px] text-[var(--w-text-3)]">{t('uxc.nothingInProgress')}</span>),
    },
    { id: 'inProgress', header: t('uxc.colInProgress'), width: 88, align: 'right', value: (p) => p.inProgress },
    { id: 'todo', header: t('uxc.colTodo'), width: 72, align: 'right', value: (p) => p.todo, defaultHidden: true },
    { id: 'overdue', header: t('common.overdue'), width: 84, align: 'right', value: (p) => p.overdue, cell: (p) => <span className={cn(p.overdue > 0 && 'font-medium text-[var(--w-red-text)]')}>{p.overdue}</span> },
    { id: 'stuck', header: t('uxc.colStuck'), width: 76, align: 'right', value: (p) => p.stuck, cell: (p) => <span className={cn(p.stuck > 0 && 'font-medium text-[var(--w-orange-text)]')}>{p.stuck}</span> },
    { id: 'reviews', header: t('uxc.colReviews'), width: 84, align: 'right', value: (p) => p.reviews, defaultHidden: true },
    {
      id: 'load', header: t('uxc.colLoad'), width: 140, value: (p) => p.total, headerTitle: t('uxc.loadTip', { u: unit }),
      exportValue: (p) => p.total,
      cell: (p) => (
        <span className="flex w-full items-center gap-2" title={t('uxc.loadLine', { n: p.total, e: fmtNumber(p.estimate), u: unit })}>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--w-sunken)]" aria-hidden="true">
            <span className="block h-full rounded-full" style={{ width: `${(p.total / maxLoad) * 100}%`, background: p.overdue ? 'var(--w-red)' : 'var(--w-accent)' }} />
          </span>
          <span className="w-[56px] shrink-0 text-right text-[12px] tabular-nums">{p.total} · {fmtNumber(p.estimate)}{unit === 'h' ? 'h' : ''}</span>
        </span>
      ),
    },
  ];

  const docs = d.docs;
  const flagged = d.people.filter((p) => p.signals.length);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto" data-testid="team-overview">
      <div className="mx-auto w-full max-w-[1440px] space-y-4 px-4 py-4 md:px-6">
        <div className="flex flex-wrap items-center gap-2">
          {d.health && <HealthChip status={d.health.status} />}
          {d.health?.reasons.slice(0, 4).map((r) => (
            <span key={r.code} className={cn('rounded-full border px-2 py-0.5 text-[12px]', r.level === 'red' ? 'border-[var(--w-red-text)] text-[var(--w-red-text)]' : 'border-[var(--w-border-strong)] text-[var(--w-text-2)]')}>
              {t(`teacher.reason_${r.code}` as WKey, { count: r.n })}
            </span>
          ))}
          {d.sprint && (
            <span className="text-[12.5px] text-[var(--w-text-2)]">
              {t('uxc.sprintLine', { s: d.sprint.name, a: d.sprint.done, b: d.sprint.total, n: d.sprint.daysLeft })}
              {d.sprint.atRisk && <span className="ml-1 text-[var(--w-orange-text)]">· {t('uxc.behindPace')}</span>}
            </span>
          )}
          <span className="ml-auto flex items-center gap-2 text-[12px] text-[var(--w-text-3)]">
            {t('uxc.asOf', { t: fmtDateTime(d.asOf) })}
            <button type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" onClick={() => q.refetch()} aria-label={t('uxc.refresh')} title={t('uxc.refresh')} disabled={q.isFetching}>
              <RefreshCw size={13} className={cn(q.isFetching && 'animate-spin')} />
            </button>
          </span>
        </div>

        <KpiRow min={118} label={t('uxc.teamKpis')}>
          <KpiTile label={t('uxc.kMembers')} value={d.totals.members} hint={t('uxc.kOpen', { n: d.totals.open })} />
          <KpiTile label={t('uxc.colInProgress')} value={d.totals.inProgress} />
          <KpiTile label={t('common.overdue')} value={d.totals.overdue} tone={d.totals.overdue ? 'red' : undefined} />
          <KpiTile label={t('uxc.kStuck')} value={d.totals.stuck} tone={d.totals.stuck ? 'orange' : undefined} title={t('uxc.stuckRule', { r: d.stuckRule.reviewDays, p: d.stuckRule.inProgressDays })} hint={t('uxc.stuckRuleShort', { r: d.stuckRule.reviewDays, p: d.stuckRule.inProgressDays })} />
          <KpiTile label={t('uxc.kReviews')} value={d.totals.reviews} tone={d.totals.reviews ? 'accent' : undefined} />
          <KpiTile label={t('common.unassigned')} value={d.totals.unassigned} />
          {d.qna && <KpiTile label={t('uxc.kQna')} value={d.qna.open} tone={d.qna.overdue ? 'red' : undefined} hint={d.qna.open ? t('uxc.oldestDays', { n: d.qna.oldestDays }) : undefined} />}
          {docs && <KpiTile label={t('uxc.kDocs')} value={`${docs.submitted}/${docs.expected}`} tone={docs.missing ? 'yellow' : 'green'} hint={docs.missing ? t('uxc.docsMissing', { count: docs.missing }) : undefined} />}
        </KpiRow>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 space-y-4">
            <section className="overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-border)] bg-[var(--w-panel)]" aria-label={t('uxc.whoDoesWhat')}>
              <header className="flex items-center gap-2 border-b border-[var(--w-border)] px-3.5 py-2.5">
                <Users size={14} className="text-[var(--w-text-3)]" aria-hidden="true" />
                <h2 className="text-[13px] font-semibold">{t('uxc.whoDoesWhat')}</h2>
                {d.unassigned && d.unassigned.total > 0 && (
                  <Link href={`${base}/list?assignee=0`} className="ml-auto text-[12px] text-[var(--w-accent-text)] hover:underline">{t('uxc.unassignedLink', { count: d.unassigned.total })}</Link>
                )}
              </header>
              <DataTable
                id="team-people"
                label={t('uxc.whoDoesWhat')}
                rows={d.people}
                rowKey={(p) => p.user.id}
                columns={peopleCols}
                height="auto"
                quickFilter={d.people.length > 8}
                defaultSort={{ col: 'load', dir: 'desc' }}
                exportName={`${config.key}-team`}
                testId="team-people"
                empty={<Empty>{t('uxc.noMembers')}</Empty>}
              />
            </section>

            <div className="grid gap-4 lg:grid-cols-2">
              <Panel title={t('uxc.stuckTitle')} icon={<Hourglass size={14} />} count={d.stuck.length} tone="orange" testId="team-stuck"
                action={<span className="text-[11.5px] text-[var(--w-text-3)]" title={t('uxc.stuckRule', { r: d.stuckRule.reviewDays, p: d.stuckRule.inProgressDays })}>{t('uxc.stuckRuleShort', { r: d.stuckRule.reviewDays, p: d.stuckRule.inProgressDays })}</span>}>
                {d.stuck.length ? d.stuck.slice(0, 8).map((s) => (
                  <div key={s.issueId}>{issueBtn(s.number, s.title,
                    <span className={cn('shrink-0 rounded-full px-1.5 text-[11px] tabular-nums', s.reason === 'BLOCKED' ? 'bg-[color-mix(in_srgb,var(--w-red)_14%,transparent)] text-[var(--w-red-text)]' : 'bg-[color-mix(in_srgb,var(--w-orange)_14%,transparent)] text-[var(--w-orange-text)]')}>
                      {s.reason === 'BLOCKED' ? t('uxc.blocked') : t('uxc.nDays', { n: fmtNumber(s.days) })}
                    </span>,
                    <>{statusName(s.statusName)}{s.assigneeId ? ` · ${member(s.assigneeId)?.displayName || member(s.assigneeId)?.fullName || member(s.assigneeId)?.username || ''}` : ` · ${t('common.unassigned')}`}</>,
                  )}</div>
                )) : <Empty>{t('uxc.noStuck')}</Empty>}
              </Panel>

              <Panel title={t('uxc.reviewsTitle')} icon={<Eye size={14} />} count={d.reviews.length} tone="accent" testId="team-reviews">
                {d.reviews.length ? d.reviews.slice(0, 8).map((r) => (
                  <div key={r.number}>{issueBtn(r.number, r.title,
                    r.days !== null ? <span className="shrink-0 text-[11.5px] tabular-nums text-[var(--w-text-3)]">{t('uxc.nDays', { n: fmtNumber(r.days) })}</span> : null,
                    <span className="inline-flex items-center gap-1"><StatusBadge status={lk.statuses.get(r.statusId)} /></span>,
                  )}</div>
                )) : <Empty>{t('uxc.noReviews')}</Empty>}
              </Panel>
            </div>

            <Panel title={t('uxc.overdueTitle')} icon={<AlarmClock size={14} />} count={d.totals.overdue} tone="red" testId="team-overdue"
              action={d.totals.overdue > 0 ? <Link href={`${base}/list?mode=jql&jql=${encodeURIComponent('due < now() AND statusCategory != Done ORDER BY due ASC')}`} className="text-[12px] text-[var(--w-accent-text)] hover:underline">{t('uxc.viewAll')}</Link> : undefined}>
              {d.overdue.length ? d.overdue.slice(0, 10).map((o) => (
                <div key={o.number}>{issueBtn(o.number, o.title,
                  <span className="shrink-0 text-[11.5px] font-medium tabular-nums text-[var(--w-red-text)]">{t('uxc.nLate', { n: o.daysLate })}</span>,
                  <>{o.dueDate ? fmtShortDate(o.dueDate) : ''}{' · '}{o.assigneeId ? (member(o.assigneeId)?.displayName || member(o.assigneeId)?.username) : t('common.unassigned')}</>,
                )}</div>
              )) : <Empty>{t('uxc.noOverdue')}</Empty>}
            </Panel>
          </div>

          <div className="min-w-0 space-y-4">
            <Panel title={t('uxc.meetingsTitle')} icon={<CalendarClock size={14} />} count={d.meetings?.length} testId="team-meetings"
              action={<Link href={`${base}/meetings`} className="text-[12px] text-[var(--w-accent-text)] hover:underline">{t('uxc.viewAll')}</Link>}>
              {d.meetings === null ? <Empty>{t('uxc.meetingsOff')}</Empty> : d.meetings.length ? d.meetings.map((m) => (
                <Link key={m.number} href={`${base}/meetings/${m.number}`} className="flex items-center gap-2 rounded-[6px] px-2.5 py-1.5 hover:bg-[var(--w-hover)]">
                  <span className="w-[86px] shrink-0 text-[12px] tabular-nums text-[var(--w-text-2)]">{fmtShortDate(m.startsAt)} {new Date(m.startsAt).toLocaleTimeString(intl, { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="min-w-0 flex-1 truncate text-[13px]">{m.title}</span>
                  <ChevronRight size={13} className="shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />
                </Link>
              )) : <Empty>{t('uxc.noMeetings')}</Empty>}
            </Panel>

            {docs && (
              <Panel title={t('uxc.docsTitle')} icon={<FileCheck2 size={14} />} count={docs.missing} tone="orange" testId="team-docs"
                action={<Link href={`${base}/school`} className="text-[12px] text-[var(--w-accent-text)] hover:underline">{t('nav.n_FPTreports')}</Link>}>
                <ul className="grid grid-cols-2 gap-x-2 gap-y-0.5 px-1.5 py-1 sm:grid-cols-3 xl:grid-cols-2" aria-label={t('uxc.docsTitle')}>
                  {FPT_DOCS.filter((k: FptDoc) => docs.states[k] !== 'NA').map((k) => (
                    <li key={k} className="flex min-w-0 items-center gap-1.5 py-0.5 text-[12.5px]">
                      <span aria-hidden="true" className={cn('h-3 w-3 shrink-0 rounded-[3px] border', DOC_TONE[docs.states[k]])} />
                      <span className="truncate">{t(`teacher.doc_${k}` as WKey)}</span>
                      <span className={cn('ml-auto shrink-0 text-[11.5px]', docs.states[k] === 'MISSING' ? 'text-[var(--w-red-text)]' : 'text-[var(--w-text-3)]')}>{t(`teacher.docState_${docs.states[k]}` as WKey)}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}

            {d.qna && (
              <Panel title={t('uxc.qnaTitle')} icon={<MessageCircleQuestion size={14} />} count={d.qna.open} tone={d.qna.overdue ? 'red' : 'orange'} testId="team-qna"
                action={<Link href={`${base}/school?tab=qna`} className="text-[12px] text-[var(--w-accent-text)] hover:underline">{t('uxc.viewAll')}</Link>}>
                {d.qna.items.length ? d.qna.items.map((x) => (
                  <Link key={x.number} href={`${base}/school?tab=qna`} className="flex min-w-0 items-center gap-2 rounded-[6px] px-2.5 py-1.5 hover:bg-[var(--w-hover)]">
                    <span className="shrink-0 font-mono text-[11.5px] text-[var(--w-text-3)]">{x.key}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px]">{x.question}</span>
                      {x.askedTo && <span className="block truncate text-[11.5px] text-[var(--w-text-3)]">{t('uxc.askedTo', { p: x.askedTo })}</span>}
                    </span>
                    <span className={cn('shrink-0 text-[11.5px] tabular-nums', x.overdue ? 'font-medium text-[var(--w-red-text)]' : 'text-[var(--w-text-3)]')}>{t('uxc.nDays', { n: x.days })}</span>
                  </Link>
                )) : <Empty>{t('uxc.noQna')}</Empty>}
              </Panel>
            )}

            <Panel title={t('uxc.signalsTitle')} icon={<AlertTriangle size={14} />} count={flagged.length} tone="orange" testId="team-signals"
              action={<Link href={`${base}/reports?tab=contributions`} className="text-[12px] text-[var(--w-accent-text)] hover:underline">{t('rep.tab_contributions')}</Link>}>
              {flagged.length ? flagged.map((p) => (
                <div key={p.user.id} className="flex min-w-0 items-start gap-2 px-2.5 py-1.5 text-[12.5px]">
                  <UserAvatar user={p.user} size={20} />
                  <span className="min-w-0"><span className="font-medium">{p.name}</span><span className="text-[var(--w-text-2)]"> — {p.signals.map((s) => trSignal(s)).join(' · ')}</span></span>
                </div>
              )) : <Empty>{d.contrib ? t('uxc.noSignals') : t('uxc.signalsHidden')}</Empty>}
              {d.contrib?.silentDays !== null && d.contrib?.silentDays !== undefined && d.contrib.silentDays >= 3 && (
                <p className="px-2.5 pb-1.5 text-[12px] text-[var(--w-orange-text)]">{t('uxc.teamSilent', { n: d.contrib.silentDays })}</p>
              )}
            </Panel>
          </div>
        </div>
        <p className="text-[11.5px] text-[var(--w-text-3)]">{wt('uxc.footnote')}</p>
      </div>
      <IssueDrawer pid={pid} num={open} onClose={() => setOpen(null)} onOpenIssue={setOpen} />
    </div>
  );
}
