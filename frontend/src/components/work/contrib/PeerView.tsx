'use client';

/**
 * CTW Đóng góp — ĐÁNH GIÁ CHÉO. Danh sách đợt (theo sprint / giai đoạn / tuỳ chọn) bên trái, đợt đang chọn bên phải:
 *   - thành viên: phiếu cho từng đồng đội (4–5 tiêu chí, 1–5, nhận xét), sửa được tới khi đóng; sau khi đóng xem điểm
 *     trung bình VỀ MÌNH khi có ≥ 2 người chấm;
 *   - ADMIN / giảng viên: mở/đóng đợt, ai đã nộp (không biết chấm ai bao nhiêu), điểm trung bình từng người + nhận xét ẩn danh.
 */

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check, Lock, Plus, Unlock, Users } from 'lucide-react';
import { userName, workError, type SprintFull, type StageSummary, type WorkUser } from '@/lib/work-api';
import { contribKeys, workContribApi, type PeerCriterion, type PeerRound } from '@/lib/work-contrib-api';
import { Dialog, EmptyState, PageLoading, UserAvatar } from '@/components/work/ui';
import { cn } from '@/lib/utils';
import { Card, SectionTitle } from '../reports/shared';
import { fmtDayShort } from './shared';
import { trCriterion, trPeerReason } from './serverText';
import { wt } from '@/components/work/i18n';

export default function PeerView({ pid, sprints, stages, roundId, onRound }: { pid: number; sprints: SprintFull[]; stages: StageSummary[]; roundId: number | null; onRound: (id: number) => void }) {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const list = useQuery({ queryKey: contribKeys.peer(pid), queryFn: () => workContribApi.rounds(pid) });
  const selected = roundId ?? list.data?.rounds.find((r) => r.status === 'OPEN')?.id ?? list.data?.rounds[0]?.id ?? null;
  const round = useQuery({ queryKey: contribKeys.round(pid, selected ?? 0), queryFn: () => workContribApi.round(pid, selected!), enabled: !!selected });
  const refresh = () => qc.invalidateQueries({ queryKey: contribKeys.peer(pid) });

  if (list.isLoading) return <PageLoading rows={5} />;
  if (list.error || !list.data) return <EmptyState title={wt('contrib.loadPeerFailed')} body={list.error ? workError(list.error) : undefined} />;
  const { rounds, canManage } = list.data;

  return (
    <div className="grid gap-3 lg:grid-cols-[260px_minmax(0,1fr)]">
      <div className="space-y-2">
        {canManage && <button type="button" className="w-btn w-btn-primary w-btn-sm w-full justify-center" onClick={() => setCreating(true)}><Plus size={13} /> {wt('contrib.newPeer')}</button>}
        {!rounds.length && <p className="rounded-[8px] border border-dashed border-[var(--w-border)] p-3 text-[12px] text-[var(--w-text-3)]">{canManage ? wt('contrib.openPeerHint') : wt('contrib.noPeerYet')}</p>}
        <ul className="space-y-1" aria-label={wt('contrib.peerReviews')}>
          {rounds.map((r) => (
            <li key={r.id}>
              <button type="button" onClick={() => onRound(r.id)} aria-current={r.id === selected ? 'true' : undefined}
                className={cn('w-full rounded-[8px] border px-3 py-2 text-left', r.id === selected ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border)] hover:bg-[var(--w-hover)]')}>
                <div className="flex items-center gap-1.5 text-[13px] font-medium">
                  {r.status === 'OPEN' ? <Unlock size={12} className="text-[var(--w-green-text)]" aria-label={wt('common.open')} /> : <Lock size={12} className="text-[var(--w-text-3)]" aria-label={wt('desk.psClosed')} />}
                  <span className="truncate">{r.title}</span>
                </div>
                <div className="mt-0.5 text-[11px] text-[var(--w-text-3)]">
                  {wt('contrib.ratingsLine', { a: r.submitted, b: r.expected })}{r.mine ? wt('contrib.youDone', { a: r.mine.done, b: r.mine.total }) : ''}{r.closesAt && r.status === 'OPEN' ? wt('contrib.closesOn', { d: fmtDayShort(r.closesAt) }) : ''}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="min-w-0">
        {!selected ? null : round.isLoading ? <PageLoading rows={5} /> : round.error || !round.data ? (
          <EmptyState title={wt('contrib.loadRoundFailed')} body={round.error ? workError(round.error) : undefined} />
        ) : <RoundPanel pid={pid} r={round.data} onChanged={refresh} />}
      </div>
      <CreateRound open={creating} onClose={() => setCreating(false)} pid={pid} sprints={sprints} stages={stages} defaults={list.data.defaultCriteria}
        onCreated={(id) => { setCreating(false); refresh(); onRound(id); }} />
    </div>
  );
}

function RoundPanel({ pid, r, onChanged }: { pid: number; r: PeerRound; onChanged: () => void }) {
  const qc = useQueryClient();
  const status = useMutation({
    mutationFn: (s: 'OPEN' | 'CLOSED') => workContribApi.updateRound(pid, r.id, { status: s }),
    onSuccess: () => { onChanged(); qc.invalidateQueries({ queryKey: contribKeys.round(pid, r.id) }); },
    onError: (e) => toast.error(workError(e)),
  });
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-[16px] font-semibold">{r.title}</h2>
        <span className={cn('rounded-full border px-2 py-0.5 text-[11px]', r.status === 'OPEN' ? 'border-[var(--w-green-text)] text-[var(--w-green-text)]' : 'border-[var(--w-border-strong)] text-[var(--w-text-2)]')}>{r.status === 'OPEN' ? wt('common.open') : wt('desk.psClosed')}</span>
        {r.canManage && (
          <button type="button" className="w-btn w-btn-sm ml-auto" disabled={status.isPending} onClick={() => status.mutate(r.status === 'OPEN' ? 'CLOSED' : 'OPEN')}>
            {r.status === 'OPEN' ? <><Lock size={12} /> {wt('common.close')}</> : <><Unlock size={12} /> {wt('gov.reopen')}</>}
          </button>
        )}
      </div>
      <p className="text-[12px] text-[var(--w-text-2)]">
        {wt('contrib.anonNote')}
      </p>
      {r.canParticipate && r.toReview.length > 0 && <Forms pid={pid} r={r} />}
      {!r.canParticipate && r.mine.length > 0 && <p className="text-[12px] text-[var(--w-text-3)]">{wt('contrib.youSubmitted', { count: r.mine.length })}</p>}
      {r.myResult && (
        <Card>
          <SectionTitle>{wt('contrib.yourResult')}</SectionTitle>
          {r.myResult.byCriterion ? (
            <dl className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {r.criteria.map((c) => <div key={c.key}><dt className="text-[11.5px] text-[var(--w-text-2)]">{trCriterion(c).label}</dt><dd className="text-[18px] font-semibold tabular-nums">{r.myResult!.byCriterion![c.key]}</dd></div>)}
              <div><dt className="text-[11.5px] text-[var(--w-text-2)]">{wt('contrib.overallN', { n: r.myResult.count })}</dt><dd className="text-[18px] font-semibold tabular-nums">{r.myResult.overall}</dd></div>
            </dl>
          ) : <p className="text-[12px] text-[var(--w-text-3)]">{trPeerReason(r.myResult.hiddenReason)}</p>}
        </Card>
      )}
      {r.results && <Results r={r} />}
    </div>
  );
}

function Forms({ pid, r }: { pid: number; r: PeerRound }) {
  const done = new Set(r.mine.map((m) => m.revieweeId));
  const [open, setOpen] = useState<number | null>(r.toReview.find((u) => !done.has(u.id))?.id ?? r.toReview[0]?.id ?? null);
  return (
    <Card className="!p-0">
      <div className="flex items-center gap-2 border-b border-[var(--w-border)] px-4 py-2.5">
        <Users size={14} aria-hidden="true" className="text-[var(--w-text-3)]" />
        <span className="text-[13px] font-semibold">{wt('contrib.rateTeammates')}</span>
        <span className="ml-auto text-[12px] text-[var(--w-text-2)]">{wt('contrib.nDone', { a: done.size, b: r.toReview.length })}</span>
      </div>
      <ul>
        {r.toReview.map((u) => (
          <li key={u.id} className="border-b border-[var(--w-border)] last:border-0">
            <button type="button" aria-expanded={open === u.id} onClick={() => setOpen(open === u.id ? null : u.id)} className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-[var(--w-hover)]">
              <UserAvatar user={u} size={22} /><span className="text-[13px] font-medium">{userName(u)}</span>
              {done.has(u.id) && <span className="ml-auto inline-flex items-center gap-1 text-[11.5px] text-[var(--w-green-text)]"><Check size={12} aria-hidden="true" /> {wt('contrib.submitted')}</span>}
            </button>
            {open === u.id && <ReviewForm pid={pid} r={r} u={u} onDone={() => setOpen(r.toReview.find((x) => x.id !== u.id && !done.has(x.id))?.id ?? null)} />}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ReviewForm({ pid, r, u, onDone }: { pid: number; r: PeerRound; u: WorkUser; onDone: () => void }) {
  const qc = useQueryClient();
  const prev = r.mine.find((m) => m.revieweeId === u.id);
  const [scores, setScores] = useState<Record<string, number>>(prev?.scores ?? {});
  const [comment, setComment] = useState(prev?.comment ?? '');
  useEffect(() => { setScores(prev?.scores ?? {}); setComment(prev?.comment ?? ''); }, [prev, u.id]);
  const complete = r.criteria.every((c) => scores[c.key] >= 1);
  const save = useMutation({
    mutationFn: () => workContribApi.review(pid, r.id, u.id, { scores, comment: comment.trim() || null }),
    onSuccess: () => { toast.success(wt('contrib.savedRating', { name: userName(u) })); qc.invalidateQueries({ queryKey: contribKeys.peer(pid) }); onDone(); },
    onError: (e) => toast.error(workError(e)),
  });
  return (
    <form className="space-y-3 bg-[var(--w-sunken)] px-4 py-3" onSubmit={(e) => { e.preventDefault(); if (complete) save.mutate(); }}>
      {r.criteria.map((c) => (
        <fieldset key={c.key} className="grid items-center gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
          <legend className="sr-only">{trCriterion(c).label}</legend>
          <div className="min-w-0"><div className="text-[13px] font-medium">{trCriterion(c).label}</div><div className="text-[11.5px] text-[var(--w-text-2)]">{trCriterion(c).description}</div></div>
          <div className="flex gap-1" role="radiogroup" aria-label={wt('contrib.critFor', { c: trCriterion(c).label, name: userName(u) })}>
            {[1, 2, 3, 4, 5].map((v) => (
              <button key={v} type="button" role="radio" aria-checked={scores[c.key] === v} onClick={() => setScores((s) => ({ ...s, [c.key]: v }))}
                className={cn('h-8 w-8 rounded-[6px] border text-[13px] font-medium tabular-nums', scores[c.key] === v ? 'border-[var(--w-accent)] bg-[var(--w-accent)] text-white' : 'border-[var(--w-border)] bg-[var(--w-panel)] text-[var(--w-text-2)] hover:border-[var(--w-border-strong)]')}>{v}</button>
            ))}
          </div>
        </fieldset>
      ))}
      <div>
        <label htmlFor={`peer-c-${u.id}`} className="text-[12px] font-medium">{wt('contrib.commentL')} <span className="font-normal text-[var(--w-text-3)]">{wt('contrib.commentOpt')}</span></label>
        <textarea id={`peer-c-${u.id}`} value={comment} onChange={(e) => setComment(e.target.value)} maxLength={2000} rows={2} className="w-input mt-1 text-[13px]" placeholder={wt('contrib.wentWell')} />
      </div>
      <div className="flex items-center justify-end gap-2">
        <span className="text-[11.5px] text-[var(--w-text-3)]">{wt('contrib.scale')}</span>
        <button type="submit" className="w-btn w-btn-primary w-btn-sm" disabled={!complete || save.isPending}>{prev ? wt('contrib.updateRating') : wt('contrib.submitRating')}</button>
      </div>
    </form>
  );
}

function Results({ r }: { r: PeerRound }) {
  const res = r.results ?? [];
  return (
    <>
      <Card className="!p-0">
        <div className="px-4 pt-3"><SectionTitle right={<span className="text-[11px] text-[var(--w-text-3)]">{wt('contrib.teamAvg', { v: r.teamAverage ?? '—' })}</span>}>{wt('contrib.results15')}</SectionTitle></div>
        {r.resultsHiddenReason && <p className="px-4 pb-2 text-[12px] text-[var(--w-text-2)]">{trPeerReason(r.resultsHiddenReason)}</p>}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-[13px]">
            <thead><tr className="border-b border-[var(--w-border)] text-left text-[11.5px] text-[var(--w-text-3)]">
              <th scope="col" className="px-4 py-2 font-medium">{wt('common.member')}</th>
              {r.criteria.map((c) => <th key={c.key} scope="col" className="px-3 py-2 text-right font-medium" title={trCriterion(c).description}>{trCriterion(c).label}</th>)}
              <th scope="col" className="px-3 py-2 text-right font-medium">{wt('contrib.overall')}</th><th scope="col" className="px-3 py-2 text-right font-medium">{wt('contrib.ratings')}</th>
            </tr></thead>
            <tbody>
              {res.map((x) => (
                <tr key={x.user.id} className="border-b border-[var(--w-border)] last:border-0">
                  <td className="px-4 py-2"><span className="flex items-center gap-2"><UserAvatar user={x.user} size={22} />{userName(x.user)}</span></td>
                  {r.criteria.map((c) => <td key={c.key} className="px-3 py-2 text-right tabular-nums"><ScoreCell v={x.count ? x.byCriterion[c.key] : null} /></td>)}
                  <td className="px-3 py-2 text-right font-semibold tabular-nums"><ScoreCell v={x.overall} /></td>
                  <td className="px-3 py-2 text-right tabular-nums text-[var(--w-text-2)]">{x.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <SectionTitle>{wt('contrib.whoSubmitted')}</SectionTitle>
          <ul className="space-y-1 text-[12.5px]">
            {(r.completion ?? []).map((c) => (
              <li key={c.user.id} className="flex items-center gap-2">
                <UserAvatar user={c.user} size={18} />{userName(c.user)}
                <span className={cn('ml-auto tabular-nums', c.submitted >= c.expected ? 'text-[var(--w-green-text)]' : 'text-[var(--w-text-2)]')}>{c.submitted}/{c.expected}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-[var(--w-text-3)]">{wt('contrib.whoNote')}</p>
        </Card>
        <Card>
          <SectionTitle>{wt('contrib.commentsAnon')}</SectionTitle>
          {res.some((x) => x.comments.length) ? (
            <ul className="max-h-[260px] space-y-2 overflow-y-auto text-[12.5px]">
              {res.filter((x) => x.comments.length).map((x) => (
                <li key={x.user.id}><div className="font-medium">{wt('contrib.aboutX', { name: userName(x.user) })}</div><ul className="ml-3 list-disc text-[var(--w-text-2)]">{x.comments.map((c, i) => <li key={i}>{c}</li>)}</ul></li>
              ))}
            </ul>
          ) : <p className="text-[12px] text-[var(--w-text-3)]">{wt('contrib.noComments')}</p>}
        </Card>
      </div>
    </>
  );
}

function ScoreCell({ v }: { v: number | null | undefined }) {
  if (v === null || v === undefined) return <span className="text-[var(--w-text-3)]">—</span>;
  return (
    <span className="inline-flex items-center justify-end gap-1.5">
      <span className="hidden h-1.5 w-10 overflow-hidden rounded-full bg-[var(--w-sunken)] sm:inline-block" aria-hidden="true"><span className="block h-full rounded-full bg-[var(--w-chart-2)]" style={{ width: `${(v / 5) * 100}%` }} /></span>
      {v}
    </span>
  );
}

function CreateRound({ open, onClose, pid, sprints, stages, defaults, onCreated }: {
  open: boolean; onClose: () => void; pid: number; sprints: SprintFull[]; stages: StageSummary[]; defaults: PeerCriterion[]; onCreated: (id: number) => void;
}) {
  const [scope, setScope] = useState<'sprint' | 'stage' | 'custom'>('sprint');
  const [sprintId, setSprintId] = useState<number | null>(null);
  const [stageId, setStageId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [closes, setCloses] = useState('');
  const [criteria, setCriteria] = useState<PeerCriterion[]>(defaults);
  useEffect(() => { if (open) { setCriteria(defaults.map((c) => ({ ...c, ...trCriterion(c) }))); setSprintId(sprints[0]?.id ?? null); setStageId(stages[0]?.id ?? null); setTitle(''); setCloses(''); } }, [open, defaults, sprints, stages]);
  const autoTitle = scope === 'sprint' ? wt('contrib.peerReviewT', { x: sprints.find((s) => s.id === sprintId)?.name ?? 'Sprint' }) : scope === 'stage' ? wt('contrib.peerReviewT', { x: stages.find((s) => s.id === stageId)?.name ?? wt('finance.stage') }) : wt('contrib.sPeer');
  const create = useMutation({
    mutationFn: () => workContribApi.createRound(pid, {
      title: title.trim() || autoTitle, sprintId: scope === 'sprint' ? sprintId : null, stageId: scope === 'stage' ? stageId : null,
      criteria: criteria.filter((c) => c.label.trim()).map((c) => ({ label: c.label.trim(), description: c.description })),
      closesAt: closes ? new Date(`${closes}T23:59:00`).toISOString() : null,
    }),
    onSuccess: (r) => { toast.success(wt('contrib.peerOpened')); onCreated(r.id); },
    onError: (e) => toast.error(workError(e)),
  });
  return (
    <Dialog open={open} onClose={onClose} title={wt('contrib.newPeer')} width={560} footer={<>
      <button type="button" className="w-btn" onClick={onClose}>{wt('common.cancel')}</button>
      <button type="button" className="w-btn w-btn-primary" disabled={create.isPending || criteria.filter((c) => c.label.trim()).length < 3} onClick={() => create.mutate()}>{wt('contrib.openRatings')}</button>
    </>}>
      <div className="space-y-3 text-[13px]">
        <div className="flex gap-2">
          {(['sprint', 'stage', 'custom'] as const).map((s) => (
            <label key={s} className="inline-flex items-center gap-1.5"><input type="radio" name="peer-scope" checked={scope === s} onChange={() => setScope(s)} disabled={s === 'stage' && !stages.length} />{s === 'sprint' ? 'Sprint' : s === 'stage' ? wt('finance.stage') : wt('contrib.otherPeriod')}</label>
          ))}
        </div>
        {scope === 'sprint' && (
          <select aria-label={wt('common.sprint')} className="w-input" value={sprintId ?? ''} onChange={(e) => setSprintId(Number(e.target.value))}>{sprints.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
        )}
        {scope === 'stage' && (
          <select aria-label={wt('finance.stage')} className="w-input" value={stageId ?? ''} onChange={(e) => setStageId(Number(e.target.value))}>{stages.map((s) => <option key={s.id} value={s.id}>{s.n}. {s.name}</option>)}</select>
        )}
        <label className="block"><span className="text-[12px] font-medium">{wt('common.title')}</span><input className="w-input mt-1" value={title} placeholder={autoTitle} onChange={(e) => setTitle(e.target.value)} maxLength={160} /></label>
        <label className="block"><span className="text-[12px] font-medium">{wt('contrib.closesOpt')}</span><input type="date" className="w-input mt-1 w-[180px]" value={closes} onChange={(e) => setCloses(e.target.value)} /></label>
        <fieldset>
          <legend className="text-[12px] font-medium">{wt('contrib.criteria')}</legend>
          <div className="mt-1 space-y-1.5">
            {criteria.map((c, i) => (
              <div key={i} className="flex gap-1.5">
                <input aria-label={wt('contrib.critName', { n: i + 1 })} className="w-input w-[150px]" value={c.label} onChange={(e) => setCriteria((cs) => cs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
                <input aria-label={wt('contrib.critDesc', { n: i + 1 })} className="w-input flex-1" value={c.description} onChange={(e) => setCriteria((cs) => cs.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} />
                <button type="button" className="w-btn w-btn-ghost w-btn-sm" aria-label={wt('contrib.removeX', { x: c.label || wt('contrib.criterionLc') })} disabled={criteria.length <= 3} onClick={() => setCriteria((cs) => cs.filter((_, j) => j !== i))}>×</button>
              </div>
            ))}
          </div>
          {criteria.length < 6 && <button type="button" className="w-btn w-btn-ghost w-btn-sm mt-1" onClick={() => setCriteria((cs) => [...cs, { key: '', label: wt('contrib.newCritLabel'), description: wt('contrib.newCritDesc') }])}><Plus size={12} /> {wt('contrib.addCriterion')}</button>}
        </fieldset>
      </div>
    </Dialog>
  );
}
