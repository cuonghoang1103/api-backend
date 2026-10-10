'use client';

/**
 * CT Work đợt 7a — planning poker (C23). Danh sách phiên + phòng ước lượng thời gian thực.
 * Lá bài úp tới khi lật — máy chủ KHÔNG gửi lá của người khác trước đó (chỉ "đã bỏ"), nên giao diện chỉ việc vẽ đúng
 * thứ nhận được. Hẹn giờ: hết giờ ⇒ làm tươi một lần, máy chủ tự lật.
 */

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check, Eye, Lightbulb, Plus, RotateCcw, SkipForward, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError, type ProjectConfig } from '@/lib/work-api';
import { agileApi, agileKeys, type PokerDeck, type PokerItem, type PokerSessionRow } from '@/lib/work-agile-api';
import DataTable, { type DataColumn } from '../table/DataTable';
import { Dialog, EmptyState, Field, IssueTypeIcon, PageLoading, UserAvatar } from '../ui';
import { Select } from '../settings/shared';
import { useWT, wt } from '../i18n';
import type { WKey } from '../i18n';

function NewSessionDialog({ pid, config, open, onClose, onCreated }: { pid: number; config: ProjectConfig; open: boolean; onClose: () => void; onCreated: (id: number) => void }) {
  const active = config.sprints.find((s) => s.state === 'ACTIVE') ?? config.sprints.find((s) => s.state === 'PLANNED');
  const [title, setTitle] = useState(active ? `${active.name} estimation` : `Estimation ${new Date().toISOString().slice(0, 10)}`);
  const [deck, setDeck] = useState<PokerDeck>('FIBONACCI');
  const [sprintId, setSprintId] = useState<number | ''>(active?.id ?? '');
  const [issues, setIssues] = useState('');
  const m = useMutation({
    mutationFn: () => agileApi.pokerCreate(pid, {
      title: title.trim(), deck, sprintId: sprintId || null,
      issues: issues.split(/[\s,;]+/).map((x) => Number(x.replace(/^\D+-?/, ''))).filter((n) => Number.isInteger(n) && n > 0),
    }),
    onSuccess: (r) => { onCreated(r.id); onClose(); },
    onError: (e) => toast.error(workError(e, wt('agile.failed'))),
  });
  return (
    <Dialog open={open} onClose={onClose} title={wt('agile.newSession')} width={480}
      footer={<><button type="button" className="w-btn w-btn-ghost" onClick={onClose}>{wt('agile.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!title.trim() || m.isPending} onClick={() => m.mutate()} data-testid="poker-create">{wt('agile.create')}</button></>}>
      <div className="space-y-3">
        <Field label={wt('agile.sessionTitle')}><input className="w-input" value={title} maxLength={120} placeholder={wt('agile.sessionTitlePh')} onChange={(e) => setTitle(e.target.value)} autoFocus /></Field>
        <Field label={wt('agile.deck')}>
          <Select value={deck} onChange={(e) => setDeck(e.target.value as PokerDeck)}>
            {(['FIBONACCI', 'TSHIRT'] as const).map((d) => <option key={d} value={d}>{wt(`agile.deck_${d}` as WKey)}</option>)}
          </Select>
        </Field>
        <Field label={wt('agile.fromSprint')}>
          <Select value={sprintId} onChange={(e) => setSprintId(e.target.value ? Number(e.target.value) : '')}>
            <option value="">{wt('agile.noSprint')}</option>
            {config.sprints.filter((s) => s.state !== 'CLOSED').map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
        </Field>
        <Field label={wt('agile.orIssues')}><input className="w-input" value={issues} placeholder={wt('agile.issuesPh')} onChange={(e) => setIssues(e.target.value)} /></Field>
      </div>
    </Dialog>
  );
}

export function PokerList({ pid, config, onOpen }: { pid: number; config: ProjectConfig; onOpen: (id: number) => void }) {
  const { fmtDate } = useWT();
  const q = useQuery({ queryKey: agileKeys.poker(pid), queryFn: () => agileApi.pokerList(pid) });
  const [open, setOpen] = useState(false);
  const cols: DataColumn<PokerSessionRow>[] = [
    { id: 'title', header: wt('agile.sessionTitle'), grow: true, minWidth: 220, value: (r) => r.title, cell: (r) => <span className="font-medium">{r.title}</span> },
    { id: 'sprint', header: wt('agile.sprint'), value: (r) => r.sprint?.name ?? '', width: 140 },
    { id: 'deck', header: wt('agile.deck'), value: (r) => r.deck, width: 110, hideBelow: 'md' },
    { id: 'items', header: wt('agile.colItems'), value: (r) => r.items, width: 80, align: 'right' },
    { id: 'est', header: wt('agile.colEstimated'), value: (r) => r.estimated, width: 100, align: 'right' },
    { id: 'pts', header: wt('agile.colPoints'), value: (r) => r.points, width: 80, align: 'right' },
    { id: 'status', header: wt('agile.colStatus'), value: (r) => r.status, width: 100, cell: (r) => (r.status === 'OPEN' ? wt('agile.open') : wt('agile.closed')) },
    { id: 'created', header: wt('agile.colCreated'), value: (r) => r.createdAt, text: (r) => fmtDate(r.createdAt), width: 120, hideBelow: 'md' },
  ];
  if (q.isLoading) return <PageLoading />;
  if (!q.data) return <EmptyState title={wt('agile.loadFailed')} body={workError(q.error)} />;
  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <h2 className="text-[15px] font-semibold">{wt('agile.pokerTitle')}</h2>
        {q.data.canCreate && <button type="button" className="w-btn w-btn-primary w-btn-sm ml-auto" onClick={() => setOpen(true)} data-testid="poker-new"><Plus size={12} /> {wt('agile.newSession')}</button>}
      </div>
      {!q.data.sessions.length ? (
        <EmptyState title={wt('agile.noSessions')} body={wt('agile.noSessionsBody')} />
      ) : (
        <DataTable id="poker-sessions" label={wt('agile.pokerTitle')} rows={q.data.sessions} columns={cols} rowKey={(r) => r.id} onRowOpen={(r) => onOpen(r.id)} height="auto" paging="none" />
      )}
      {open && <NewSessionDialog pid={pid} config={config} open onClose={() => setOpen(false)} onCreated={onOpen} />}
    </div>
  );
}

function useCountdown(endsAt: string | null, serverNow: string | undefined, onZero: () => void) {
  const offset = useMemo(() => (serverNow ? Date.parse(serverNow) - Date.now() : 0), [serverNow]);
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    if (!endsAt) { setLeft(null); return; }
    let fired = false;
    const tick = () => {
      const l = Math.max(0, Math.ceil((Date.parse(endsAt) - (Date.now() + offset)) / 1000));
      setLeft(l);
      if (l === 0 && !fired) { fired = true; onZero(); }
    };
    tick();
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endsAt, offset]);
  return left;
}

function Distribution({ item }: { item: PokerItem }) {
  const d = item.distribution!;
  const max = Math.max(1, ...d.counts.map((c) => c.count));
  return (
    <div className="space-y-3" data-testid="poker-distribution">
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
        {d.consensus && <span className="font-semibold text-[var(--w-green-text)]">{wt('agile.consensus')}</span>}
        {d.average !== null && <span>{wt('agile.avg', { n: d.average })}</span>}
        {d.median !== null && <span>{wt('agile.median', { n: d.median })}</span>}
        {d.suggested && <span className="font-medium">{wt('agile.suggestedCard', { v: d.suggested })}</span>}
      </div>
      <div className="flex items-end gap-2" role="img" aria-label={d.counts.map((c) => `${c.value}: ${c.count}`).join(', ')}>
        {d.counts.map((c) => (
          <div key={c.value} className="flex w-12 flex-col items-center gap-1">
            <span className="text-[11px] tabular text-[var(--w-text-3)]">{c.count}</span>
            <div className="w-8 rounded-t bg-[var(--w-accent)]" style={{ height: `${(c.count / max) * 72 + 4}px` }} />
            <span className="text-[13px] font-semibold">{c.value}</span>
          </div>
        ))}
      </div>
      {!d.consensus && d.low && d.high && d.low !== d.high && <p className="text-[12px] text-[var(--w-text-2)]">{wt('agile.spread', { a: d.low, b: d.high })}</p>}
      <ul className="flex flex-wrap gap-2">
        {(item.votes ?? []).map((v, i) => (
          <li key={i} className="flex items-center gap-1.5 rounded-full border border-[var(--w-border)] py-0.5 pl-0.5 pr-2 text-[12px]">
            <UserAvatar user={v.user} size={20} />{v.user ? userName(v.user) : '—'} <span className="font-semibold">{v.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PokerRoomView({ pid, sid, onBack }: { pid: number; sid: number; onBack: () => void }) {
  const qc = useQueryClient();
  const key = agileKeys.pokerRoom(pid, sid);
  const q = useQuery({ queryKey: key, queryFn: () => agileApi.pokerRoom(pid, sid), refetchInterval: 30_000 });
  const r = q.data;
  const [selected, setSelected] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addText, setAddText] = useState('');
  const [suggest, setSuggest] = useState<null | Awaited<ReturnType<typeof agileApi.pokerSuggest>>>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: agileKeys.poker(pid) });
  const left = useCountdown(r?.timerEndsAt ?? null, r?.serverNow, () => setTimeout(() => qc.invalidateQueries({ queryKey: key }), 400));
  const err = (e: unknown) => toast.error(workError(e, wt('agile.failed')));
  const act = useMutation({ mutationFn: ({ iid, a }: { iid: number; a: 'start' | 'reveal' | 'revote' | 'skip' }) => agileApi.pokerAct(pid, sid, iid, a), onSuccess: refresh, onError: err });
  const vote = useMutation({ mutationFn: ({ iid, v }: { iid: number; v: string | null }) => agileApi.pokerVote(pid, sid, iid, v), onSuccess: refresh, onError: err });
  const fin = useMutation({ mutationFn: ({ iid, v }: { iid: number; v: string }) => agileApi.pokerFinalize(pid, sid, iid, v), onSuccess: (x) => { toast.success(wt('agile.storyPoints', { n: x.storyPoints })); refresh(); }, onError: err });
  const timer = useMutation({ mutationFn: (s: number) => agileApi.pokerTimer(pid, sid, s), onSuccess: refresh, onError: err });
  const close = useMutation({ mutationFn: () => agileApi.pokerClose(pid, sid), onSuccess: refresh, onError: err });
  const add = useMutation({
    mutationFn: () => agileApi.pokerAdd(pid, sid, addText.split(/[\s,;]+/).map((x) => Number(x.replace(/^\D+-?/, ''))).filter((n) => Number.isInteger(n) && n > 0)),
    onSuccess: () => { setAddOpen(false); setAddText(''); refresh(); }, onError: err,
  });
  const sug = useMutation({ mutationFn: (iid: number) => agileApi.pokerSuggest(pid, sid, iid), onSuccess: setSuggest, onError: err });
  useEffect(() => { setSuggest(null); }, [selected, r?.currentItemId]);

  if (q.isLoading) return <PageLoading />;
  if (!r) return <EmptyState title={wt('agile.loadFailed')} body={workError(q.error)} />;
  const focusId = selected ?? r.currentItemId ?? r.items.find((i) => i.state === 'PENDING')?.id ?? r.items[0]?.id ?? null;
  const item = r.items.find((i) => i.id === focusId) ?? null;
  const voting = item?.state === 'VOTING';
  const fac = r.me.canFacilitate;

  return (
    <div className="space-y-3" data-testid="poker-room">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={onBack}>← {wt('agile.back')}</button>
        <h2 className="text-[15px] font-semibold">{r.title}</h2>
        {r.sprint && <span className="text-[12px] text-[var(--w-text-3)]">{r.sprint.name}</span>}
        <span className="text-[12px] text-[var(--w-text-3)]">{r.facilitator ? wt('agile.facilitator', { n: userName(r.facilitator) }) : ''}</span>
        {r.status === 'CLOSED' && <span className="rounded-full bg-[var(--w-sunken)] px-2 py-0.5 text-[11px]">{wt('agile.closed')}</span>}
        {fac && <button type="button" className="w-btn w-btn-ghost w-btn-sm ml-auto" onClick={() => { if (window.confirm(wt('agile.closeSessionConfirm'))) close.mutate(); }}>{wt('agile.closeSession')}</button>}
      </div>
      {!r.me.canVote && r.status === 'OPEN' && <p className="text-[12px] text-[var(--w-text-3)]">{wt('agile.readonlyViewer')}</p>}
      {r.status === 'CLOSED' && <p className="text-[12px] text-[var(--w-text-3)]">{wt('agile.closedSession')}</p>}

      <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)]">
          <div className="flex items-center border-b border-[var(--w-border)] px-3 py-2 text-[12px] font-medium text-[var(--w-text-2)]">
            {wt('agile.queue')} · {r.items.length}
            {fac && <button type="button" className="w-btn w-btn-ghost w-btn-sm ml-auto" onClick={() => setAddOpen(true)}><Plus size={12} /> {wt('agile.addIssues')}</button>}
          </div>
          <ul className="max-h-[60vh] overflow-y-auto p-1" aria-label={wt('agile.queue')}>
            {r.items.map((i) => (
              <li key={i.id}>
                <button type="button" aria-current={i.id === focusId ? 'true' : undefined} onClick={() => setSelected(i.id)}
                  className={cn('flex w-full items-center gap-2 rounded-[6px] px-2 py-1.5 text-left text-[13px]', i.id === focusId ? 'bg-[var(--w-hover)]' : 'hover:bg-[var(--w-hover)]')}>
                  <IssueTypeIcon type={i.issue.type} />
                  <span className="shrink-0 text-[12px] text-[var(--w-text-3)]">#{i.issue.number}</span>
                  <span className="min-w-0 flex-1 truncate">{i.issue.title}</span>
                  <span className={cn('shrink-0 rounded px-1.5 text-[11px]', i.state === 'ESTIMATED' ? 'bg-[var(--w-sunken)] font-semibold' : 'text-[var(--w-text-3)]')}>
                    {i.state === 'ESTIMATED' ? i.finalValue : wt(`agile.state_${i.state}` as WKey)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="min-w-0 rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-4">
          {!item ? <p className="text-[13px] text-[var(--w-text-3)]">{wt('agile.pickIssue')}</p> : (
            <div className="space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-[12px] text-[var(--w-text-3)]">
                  <IssueTypeIcon type={item.issue.type} /> #{item.issue.number} · {item.issue.status.name}
                  {item.issue.storyPoints !== null && <> · {wt('agile.storyPoints', { n: item.issue.storyPoints })}</>}
                  <span className="rounded bg-[var(--w-sunken)] px-1.5">{wt(`agile.state_${item.state}` as WKey)}</span>
                  <span>{wt('agile.round', { n: item.round })}</span>
                </div>
                <h3 className="mt-1 text-[16px] font-semibold">{item.issue.title}</h3>
                {item.issue.description && <p className="mt-1 line-clamp-4 whitespace-pre-line text-[13px] text-[var(--w-text-2)]">{item.issue.description}</p>}
                {item.state === 'ESTIMATED' && <p className="mt-1 text-[13px] font-medium">{wt('agile.estimatedAs', { v: item.finalValue ?? '', p: item.finalPoints ?? '' })}{item.previousPoints !== null ? ` (${wt('agile.previous', { p: item.previousPoints })})` : ''}</p>}
              </div>

              {/* Người bỏ phiếu: ai đã bỏ (không lộ lá) */}
              {voting && (
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px] text-[var(--w-text-2)]">
                    <span aria-live="polite">{wt('agile.votedCount', { n: item.voted.length, t: r.voters.length })}</span>
                    {left !== null && <span className={cn('inline-flex items-center gap-1 font-medium tabular', left <= 10 && 'text-[var(--w-orange-text)]')}><Timer size={12} />{wt('agile.timerLeft', { s: left })}</span>}
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {r.voters.map((u) => {
                      const done = item.voted.includes(u.id);
                      return (
                        <li key={u.id} className={cn('flex items-center gap-1.5 rounded-full border py-0.5 pl-0.5 pr-2 text-[12px]', done ? 'border-[var(--w-accent-border)]' : 'border-[var(--w-border)] text-[var(--w-text-3)]')}>
                          <UserAvatar user={u} size={20} />{userName(u)}{done ? <Check size={12} aria-label={wt('agile.votedBadge')} /> : <span className="sr-only">{wt('agile.notVoted')}</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Bộ bài */}
              {voting && r.me.canVote && (
                <div>
                  <div className="mb-2 text-[12px] font-medium text-[var(--w-text-2)]">{wt('agile.yourCard')}</div>
                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={wt('agile.yourCard')}>
                    {r.cards.map((c) => {
                      const on = item.myVote === c.value;
                      return (
                        <button key={c.value} type="button" role="radio" aria-checked={on} aria-label={wt('agile.cardAria', { v: c.value })} data-testid={`poker-card-${c.value}`}
                          onClick={() => vote.mutate({ iid: item.id, v: on ? null : c.value })}
                          className={cn('flex h-16 w-11 items-center justify-center rounded-[8px] border-2 text-[16px] font-semibold transition-transform',
                            on ? '-translate-y-1 border-[var(--w-accent)] bg-[var(--w-accent)] text-white' : 'border-[var(--w-border-strong)] hover:-translate-y-0.5 hover:border-[var(--w-accent)]')}>
                          {c.value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {item.state === 'PENDING' && !fac && <p className="text-[13px] text-[var(--w-text-3)]">{wt('agile.waitingFacilitator')}</p>}

              {item.distribution && <Distribution item={item} />}

              {/* Điều phối */}
              {fac && (
                <div className="flex flex-wrap items-center gap-2 border-t border-[var(--w-border)] pt-3">
                  {(item.state === 'PENDING' || item.state === 'SKIPPED') && <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => act.mutate({ iid: item.id, a: 'start' })} data-testid="poker-start">{wt('agile.startVoting')}</button>}
                  {voting && <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => act.mutate({ iid: item.id, a: 'reveal' })} data-testid="poker-reveal"><Eye size={12} /> {wt('agile.reveal')}</button>}
                  {voting && (
                    <Select value="" aria-label={wt('agile.timer')} className="w-[130px]" onChange={(e) => e.target.value !== '' && timer.mutate(Number(e.target.value))}>
                      <option value="">{wt('agile.timer')}…</option>
                      {[30, 60, 90, 120, 180, 300].map((s) => <option key={s} value={s}>{wt('agile.timerSec', { n: s })}</option>)}
                      <option value="0">{wt('agile.timerOff')}</option>
                    </Select>
                  )}
                  {(item.state === 'REVEALED' || item.state === 'ESTIMATED') && (
                    <>
                      {r.cards.filter((c) => c.points !== null).map((c) => (
                        <button key={c.value} type="button" className={cn('w-btn w-btn-sm', item.distribution?.suggested === c.value && 'w-btn-primary')}
                          onClick={() => fin.mutate({ iid: item.id, v: c.value })} title={wt('agile.finalize', { v: c.value })} data-testid={`poker-final-${c.value}`}>
                          {c.value}
                        </button>
                      ))}
                      <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => act.mutate({ iid: item.id, a: 'revote' })}><RotateCcw size={12} /> {wt('agile.revote')}</button>
                    </>
                  )}
                  {item.state !== 'ESTIMATED' && item.state !== 'SKIPPED' && <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => act.mutate({ iid: item.id, a: 'skip' })}><SkipForward size={12} /> {wt('agile.skip')}</button>}
                  <button type="button" className="w-btn w-btn-ghost w-btn-sm ml-auto" onClick={() => sug.mutate(item.id)} data-testid="poker-suggest"><Lightbulb size={12} /> {wt('agile.suggestBtn')}</button>
                </div>
              )}
              {!fac && <div className="flex justify-end"><button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => sug.mutate(item.id)}><Lightbulb size={12} /> {wt('agile.suggestBtn')}</button></div>}

              {suggest && (
                <div className="rounded-[8px] border border-dashed border-[var(--w-border-strong)] p-3 text-[13px]" data-testid="poker-suggestion">
                  <div className="mb-1 flex items-center gap-2 font-medium"><Lightbulb size={13} /> {wt('agile.suggestTitle')}
                    <span className="rounded bg-[var(--w-sunken)] px-1.5 text-[11px] font-normal text-[var(--w-text-2)]">{wt('agile.suggestLabel')}</span></div>
                  {suggest.suggested ? (
                    <>
                      <div className="text-[15px] font-semibold">{wt('agile.suggestedCard', { v: suggest.suggested })}</div>
                      <ul className="mt-1 space-y-0.5 text-[12px] text-[var(--w-text-2)]">
                        {suggest.basis.map((b) => <li key={b.key}>{b.key} · {b.title} — {wt('agile.storyPoints', { n: b.points })} ({Math.round(b.similarity * 100)}%)</li>)}
                      </ul>
                    </>
                  ) : <p className="text-[var(--w-text-3)]">{wt('agile.suggestNone')}</p>}
                </div>
              )}

              {item.rounds.length > 0 && (
                <details className="text-[12px]">
                  <summary className="cursor-pointer text-[var(--w-text-2)]">{wt('agile.roundsHistory')} ({item.rounds.length})</summary>
                  <ul className="mt-1 space-y-1">
                    {item.rounds.map((rd) => <li key={rd.round}>{wt('agile.round', { n: rd.round })}: {rd.votes.map((v) => `${v.user ? userName(v.user) : '—'} ${v.value}`).join(' · ')}</li>)}
                  </ul>
                </details>
              )}
            </div>
          )}
        </section>
      </div>
      {addOpen && (
        <Dialog open onClose={() => setAddOpen(false)} title={wt('agile.addIssues')} width={420}
          footer={<><button type="button" className="w-btn w-btn-ghost" onClick={() => setAddOpen(false)}>{wt('agile.cancel')}</button>
            <button type="button" className="w-btn w-btn-primary" disabled={!addText.trim() || add.isPending} onClick={() => add.mutate()}>{wt('agile.addLink')}</button></>}>
          <Field label={wt('agile.orIssues')}><input className="w-input" value={addText} placeholder={wt('agile.issuesPh')} onChange={(e) => setAddText(e.target.value)} autoFocus /></Field>
        </Dialog>
      )}
    </div>
  );
}
