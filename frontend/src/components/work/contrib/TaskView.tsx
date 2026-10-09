'use client';

/**
 * CTW Đóng góp — XEM THEO TASK: ai đã làm gì trên một thẻ (lịch sử + giờ + bình luận/voice + commit/PR + chạy test + review),
 * gộp theo người rồi dòng thời gian đầy đủ.
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Search } from 'lucide-react';
import { userName, workApi, workError, type ProjectConfig } from '@/lib/work-api';
import { contribKeys, workContribApi } from '@/lib/work-contrib-api';
import { EmptyState, PageLoading, StatusBadge, UserAvatar } from '@/components/work/ui';
import { Card, SectionTitle } from '../reports/shared';
import { fmtDayShort, fmtWhen } from './shared';
import { trEvent } from './serverText';
import { wt } from '@/components/work/i18n';

const KIND: Record<string, string> = { get created() { return wt('contrib.kCreated'); }, get update() { return wt('contrib.kChanged'); }, get comment() { return wt('contrib.kComment'); }, get voice() { return wt('chat.voiceNote'); }, get worklog() { return wt('contrib.kTime'); }, get code() { return wt('contrib.fCode'); }, get test() { return wt('contrib.kTest'); }, get review() { return wt('contrib.fReviews'); } };

export default function TaskView({ pid, config, num, onPick, onOpenMember }: { pid: number; config: ProjectConfig; num: number | null; onPick: (n: number) => void; onOpenMember: (id: number) => void }) {
  const [text, setText] = useState('');
  const pickQ = useQuery({
    queryKey: ['work', 'issues', pid, 'contrib-pick', text],
    queryFn: () => workApi.issues(pid, { q: text.trim() || undefined, includeDone: true, limit: 8 }),
    enabled: text.trim().length > 0,
  });
  const q = useQuery({ queryKey: contribKeys.task(pid, num ?? 0), queryFn: () => workContribApi.task(pid, num!), enabled: !!num });
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const m = /(\d+)\s*$/.exec(text.trim());
    if (m) onPick(Number(m[1]));
    else if (pickQ.data?.items[0]) onPick(pickQ.data.items[0].number);
  };
  const base = `/work/${config.workspace.slug}/${config.key}`;

  return (
    <div className="space-y-3">
      <form onSubmit={onSubmit} className="relative max-w-[520px]" role="search">
        <label htmlFor="contrib-task" className="sr-only">{wt('contrib.findIssue')}</label>
        <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" aria-hidden="true" />
        <input id="contrib-task" value={text} onChange={(e) => setText(e.target.value)} placeholder={wt('contrib.issuePh', { k: `${config.key}-12` })} className="w-input h-[32px] pl-8 text-[13px]" autoComplete="off" />
        {text.trim() && pickQ.data && pickQ.data.items.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-[8px] border border-[var(--w-border)] bg-[var(--w-raised)] shadow-[var(--w-shadow-pop)]" role="listbox" aria-label={wt('contrib.matching')}>
            {pickQ.data.items.map((i) => (
              <li key={i.id} role="option" aria-selected={i.number === num}>
                <button type="button" className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)]" onClick={() => { onPick(i.number); setText(''); }}>
                  <span className="shrink-0 font-medium text-[var(--w-text-2)]">{config.key}-{i.number}</span><span className="truncate">{i.title}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </form>

      {!num ? (
        <EmptyState title={wt('contrib.pickIssue')} body={wt('contrib.pickIssueBody')} />
      ) : q.isLoading ? <PageLoading rows={6} /> : q.error || !q.data ? (
        <EmptyState title={wt('contrib.loadIssueFailed')} body={q.error ? workError(q.error) : undefined} />
      ) : (
        <>
          <Card className="!p-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <a href={`${base}/issue/${q.data.issue.number}`} className="inline-flex items-center gap-1 text-[15px] font-semibold hover:underline">{q.data.issue.key} {q.data.issue.title}<ExternalLink size={12} aria-hidden="true" /></a>
              <StatusBadge status={{ name: q.data.issue.status.name, category: q.data.issue.status.category as 'TODO' | 'IN_PROGRESS' | 'DONE' }} />
            </div>
            <p className="mt-1 text-[12px] text-[var(--w-text-2)]">
              {wt('contrib.taskLine', { type: q.data.issue.type.name, a: userName(q.data.issue.assignee), c: fmtDayShort(q.data.issue.createdAt) })}
              {q.data.issue.dueDate && <>{wt('contrib.dueX', { d: fmtDayShort(q.data.issue.dueDate) })}</>}
              {q.data.issue.resolvedAt && <>{wt('contrib.doneX', { d: fmtDayShort(q.data.issue.resolvedAt), n: q.data.issue.leadDays, s: q.data.issue.onTime === null ? '' : q.data.issue.onTime ? wt('contrib.onTimeC') : wt('contrib.lateC') })}</>}
            </p>
          </Card>
          <Card className="!p-0">
            <div className="px-4 pt-3"><SectionTitle>{wt('contrib.whoWorked')}</SectionTitle></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-[13px]">
                <thead><tr className="border-b border-[var(--w-border)] text-left text-[11.5px] text-[var(--w-text-3)]">
                  <th scope="col" className="px-4 py-2 font-medium">{wt('finance.person')}</th><th scope="col" className="px-3 py-2 text-right font-medium">{wt('contrib.changes')}</th><th scope="col" className="px-3 py-2 text-right font-medium">{wt('contrib.ml_comments')}</th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">{wt('finance.hoursH')}</th><th scope="col" className="px-3 py-2 text-right font-medium">Commit</th><th scope="col" className="px-3 py-2 font-medium">{wt('contrib.firstLast')}</th>
                </tr></thead>
                <tbody>
                  {q.data.people.map((p, i) => (
                    <tr key={i} className="border-b border-[var(--w-border)] last:border-0">
                      <td className="px-4 py-2">
                        {p.who.user ? (
                          <button type="button" className="flex items-center gap-2 hover:underline" onClick={() => onOpenMember(p.who.user!.id)}><UserAvatar user={p.who.user} size={22} />{userName(p.who.user)}</button>
                        ) : <span className="text-[var(--w-text-2)]" title={wt('contrib.gitNotMatched')}>{p.who.label} <span className="text-[11px] text-[var(--w-text-3)]">{wt('contrib.gitAuthor')}</span></span>}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">{p.actions}</td><td className="px-3 py-2 text-right tabular-nums">{p.comments}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{p.hours || '—'}</td><td className="px-3 py-2 text-right tabular-nums">{p.commits || '—'}</td>
                      <td className="px-3 py-2 text-[12px] text-[var(--w-text-2)]">{fmtDayShort(p.firstAt)} → {fmtDayShort(p.lastAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Card>
            <SectionTitle>{wt('contrib.historyN', { n: q.data.events.length })}</SectionTitle>
            <ol className="max-h-[480px] overflow-y-auto">
              {q.data.events.map((e, i) => (
                <li key={i} className="flex min-w-0 items-baseline gap-2 border-b border-[var(--w-border)] py-1.5 text-[12.5px] last:border-0">
                  <time className="w-[92px] shrink-0 text-[11px] tabular-nums text-[var(--w-text-3)]" dateTime={e.at}>{fmtWhen(e.at)}</time>
                  <span className="w-20 shrink-0 text-[11px] font-medium text-[var(--w-text-2)]">{KIND[e.kind] ?? e.kind}</span>
                  <span className="min-w-0 flex-1 truncate"><span className="font-medium">{e.who.user ? userName(e.who.user) : e.who.label}</span> {trEvent(e.text)}</span>
                  {e.url && <a href={e.url} target="_blank" rel="noreferrer" aria-label={wt('common.open')} className="shrink-0 text-[var(--w-text-3)]"><ExternalLink size={12} /></a>}
                </li>
              ))}
            </ol>
          </Card>
        </>
      )}
    </div>
  );
}
