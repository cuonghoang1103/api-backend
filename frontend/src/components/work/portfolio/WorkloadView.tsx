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
import { Dialog, EmptyState, PageLoading, Popover, UserAvatar, useToggle } from '../ui';
import { fmtDay } from '../reports/shared';
import { TeamChip } from '../studio/shared';

const LEVEL: Record<LoadLevel, { bg: string; fg: string; label: string }> = {
  none: { bg: 'transparent', fg: 'var(--w-text-3)', label: 'Free' },
  low: { bg: 'color-mix(in srgb, var(--w-green) 10%, transparent)', fg: 'var(--w-text-2)', label: '< 50%' },
  ok: { bg: 'color-mix(in srgb, var(--w-green) 22%, transparent)', fg: 'var(--w-text)', label: '50–84%' },
  high: { bg: 'color-mix(in srgb, var(--w-orange) 24%, transparent)', fg: 'var(--w-text)', label: '85–100%' },
  over: { bg: 'color-mix(in srgb, var(--w-red) 26%, transparent)', fg: 'var(--w-text)', label: '> 100%' },
};

const SOURCE: Record<WorkloadIssue['source'], string> = {
  remaining: 'remaining estimate',
  original: 'original − logged',
  points: 'from story points',
  none: 'not estimated',
  children: 'counted on sub-tasks',
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
      <span className="block text-[13px] font-semibold tabular-nums" style={{ color: lv.fg }}>{w.hours ? `${h1(w.hours)}h` : '—'}</span>
      <span className="block text-[11px] tabular-nums text-[var(--w-text-3)]">
        {w.capacity ? `${w.pct ?? 0}% of ${h1(w.capacity)}h` : w.hours ? 'no capacity' : 'off'}
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
  if (q.error && !data) return <EmptyState title="Could not load the workload" body={workError(q.error)} />;
  if (!data) return null;

  const overloaded = data.people.filter((p) => p.overloaded).length;
  const issuesFor = (p: WorkloadPerson, week: number | null) => {
    if (week === null) return p.issues;
    const ids = new Set(p.weeks[week].issueIds);
    return p.issues.filter((i) => ids.has(i.id));
  };

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-5 md:px-6">
      {data.scope === 'SELF' && (
        <p className="mb-3 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[13px] text-[var(--w-text-2)]">
          You are seeing your own workload. Workspace admins see everyone; team leads see the people in their teams.
        </p>
      )}

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1" role="group" aria-label="Weeks">
          <button type="button" className="w-btn w-btn-sm w-btn-icon" onClick={() => setOffset((o) => o - 1)} aria-label="Previous week"><ChevronLeft size={14} /></button>
          <button type="button" className={cn('w-btn w-btn-sm', offset === 0 && 'w-btn-on')} onClick={() => setOffset(0)}>This week</button>
          <button type="button" className="w-btn w-btn-sm w-btn-icon" onClick={() => setOffset((o) => o + 1)} aria-label="Next week"><ChevronRight size={14} /></button>
        </div>
        <select aria-label="Weeks shown" className="w-input h-8 w-auto py-0 pr-7 text-[13px]" value={span} onChange={(e) => setSpan(Number(e.target.value))}>
          {[2, 4, 8, 12].map((n) => <option key={n} value={n}>{n} weeks</option>)}
        </select>
        {data.teamOptions.length > 0 && (
          <select aria-label="Team" className="w-input h-8 w-auto max-w-full py-0 pr-7 text-[13px]" value={teamId ?? ''} onChange={(e) => setTeamId(e.target.value ? Number(e.target.value) : undefined)}>
            <option value="">All teams</option>
            {data.teamOptions.map((t) => <option key={t.id} value={t.id}>{t.key} · {t.name}</option>)}
          </select>
        )}
        <select aria-label="Project" className="w-input h-8 w-auto max-w-full py-0 pr-7 text-[13px]" value={projectId ?? ''} onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : undefined)}>
          <option value="">All projects</option>
          {data.projectOptions.map((p) => <option key={p.id} value={p.id}>{p.key} · {p.name}</option>)}
        </select>
        <select aria-label="Hours per story point" className="w-input h-8 w-auto py-0 pr-7 text-[13px]" value={hpp ?? data.hoursPerPoint} onChange={(e) => setHpp(Number(e.target.value))}>
          {[1, 2, 4, 6, 8].map((n) => <option key={n} value={n}>1 pt = {n}h</option>)}
        </select>
        <span className="flex-1" />
        <button ref={helpBtn} type="button" className="w-btn w-btn-sm" onClick={help.toggle} aria-expanded={help.on}><CircleHelp size={13} /> How is load computed?</button>
        <Popover open={help.on} onClose={help.close} anchorRef={helpBtn} width={360} align="end">
          <div className="p-3 text-[12.5px] leading-snug">
            <p className="mb-1.5 font-semibold">Load = open, assigned work due in the week ÷ capacity</p>
            <ul className="ml-3.5 list-disc space-y-1 text-[var(--w-text-2)]">
              {data.rules.conversion.map((c, i) => <li key={i}>{c}</li>)}
              <li>Overloaded = more than {data.rules.overloadPct}% of a week’s capacity, or work in a week with no capacity.</li>
            </ul>
          </div>
        </Popover>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-[var(--w-text-2)]">
        <span className="tabular-nums"><b className="font-semibold text-[var(--w-text)]">{data.people.length}</b> {data.people.length === 1 ? 'person' : 'people'}</span>
        <span className={cn('flex items-center gap-1 tabular-nums', overloaded && 'font-semibold text-[var(--w-red)]')}>
          {overloaded > 0 && <AlertTriangle size={13} />} {overloaded} overloaded
        </span>
        <span className="flex flex-wrap items-center gap-2" aria-label="Legend">
          {(['low', 'ok', 'high', 'over'] as const).map((lv) => (
            <span key={lv} className="inline-flex items-center gap-1"><span className="h-3 w-4 rounded-[3px] border border-[var(--w-border)]" style={{ background: LEVEL[lv].bg }} />{LEVEL[lv].label}</span>
          ))}
        </span>
        {data.truncated && <span className="text-[var(--w-orange)]">Showing the first 5000 issues.</span>}
      </div>

      {data.people.length === 0 ? (
        <EmptyState title="No one to show" body="Nobody in this view has open, assigned work." />
      ) : (
        <div className="overflow-x-auto rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)]" role="region" aria-label="Workload grid" tabIndex={0}>
          <table className="w-full border-collapse text-[13px]" style={{ minWidth: 150 + data.weeks.length * 104 }}>
            <thead>
              <tr className="bg-[var(--w-sunken)] text-[11px] font-medium uppercase tracking-[0.04em] text-[var(--w-text-3)]">
                <th scope="col" className="sticky left-0 z-[1] w-[150px] min-w-[150px] bg-[var(--w-sunken)] px-3 py-2 text-left font-medium md:w-[220px] md:min-w-[220px]">Person</th>
                {data.weeks.map((w) => (
                  <th key={w.start} scope="col" className={cn('min-w-[104px] px-1.5 py-2 text-left font-medium', w.start <= data.today && data.today <= w.end && 'text-[var(--w-accent-text)]')}>
                    {fmtDay(w.start)}<span className="font-normal normal-case"> – {fmtDay(w.end)}</span>
                  </th>
                ))}
                <th scope="col" className="min-w-[88px] px-2 py-2 text-left font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <Fragment key={g.team?.id ?? 'none'}>
                  {data.teams.length > 0 && (
                    <tr className="border-t border-[var(--w-border)] bg-[var(--w-bg)]">
                      <th scope="rowgroup" className="sticky left-0 z-[1] bg-[var(--w-bg)] px-3 py-1.5 text-left">
                        {g.team ? <span className="flex min-w-0 items-center gap-1.5"><TeamChip team={g.team} /><span className="truncate text-[12px] font-medium text-[var(--w-text-2)]">{g.team.name}</span></span>
                          : <span className="text-[12px] font-medium text-[var(--w-text-3)]">No team</span>}
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
                              {h1(p.hoursPerDay)}h/day{p.capacitySource === 'default' ? ' (default)' : ''}{p.unscheduled ? ` · ${p.unscheduled} no due date` : ''}
                            </span>
                          </span>
                          {p.overloaded && <AlertTriangle size={13} className="shrink-0 text-[var(--w-red)]" aria-label="Overloaded" />}
                        </button>
                      </th>
                      {p.weeks.map((w, i) => (
                        <td key={w.start} className="p-1">
                          <LoadCell
                            w={w}
                            label={`${userName(p.user)}, week of ${fmtDay(w.start)}: ${h1(w.hours)} of ${h1(w.capacity)} hours${w.overloaded ? ', overloaded' : ''}`}
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
            <span className="truncate">{userName(open.person.user)}{open.week !== null ? ` · week of ${fmtDay(open.person.weeks[open.week].start)}` : ' · all open work'}</span>
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
                  {h1(w.hours)}h planned vs {h1(w.capacity)}h capacity ({w.workingDays} working day{w.workingDays === 1 ? '' : 's'} × {h1(open.person.hoursPerDay)}h){w.pct !== null ? ` — ${w.pct}%` : ''}.
                </p>
              )}
              {open.person.timeOff.length > 0 && (
                <p className="text-[12px] text-[var(--w-text-3)]">Time off: {open.person.timeOff.map((t) => (t.start === t.end ? fmtDay(t.start) : `${fmtDay(t.start)} – ${fmtDay(t.end)}`)).join(', ')}</p>
              )}
              <ul className="divide-y divide-[var(--w-border)] overflow-hidden rounded-[8px] border border-[var(--w-border)]">
                {list.map((i) => (
                  <li key={i.id} className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 px-3 py-2 text-[13px]">
                    <Link href={i.url} className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)] hover:underline">{i.key}</Link>
                    <span className="min-w-0 flex-1 truncate" title={i.title}>{i.title}</span>
                    <span className="shrink-0 text-[12px] tabular-nums text-[var(--w-text-2)]" title={SOURCE[i.source]}>{i.hours ? `${h1(i.hours)}h` : '—'} <span className="text-[var(--w-text-3)]">· {SOURCE[i.source]}</span></span>
                    <span className={cn('w-full text-[12px] tabular-nums sm:w-auto', i.overdue ? 'font-medium text-[var(--w-red)]' : 'text-[var(--w-text-3)]')}>
                      {i.due ? `${i.overdue ? 'Overdue · ' : 'Due '}${fmtDay(i.due)}` : 'No due date'} · {i.status.name}
                    </span>
                  </li>
                ))}
                {!list.length && <li className="px-3 py-3 text-[13px] text-[var(--w-text-3)]">No issues.</li>}
              </ul>
            </div>
          );
        })()}
      </Dialog>
    </div>
  );
}
