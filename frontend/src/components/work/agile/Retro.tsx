'use client';

/**
 * CT Work đợt 7a — retro board (C24). Danh sách + bảng cột theo mẫu, ghi chú (ẩn danh tuỳ chọn — máy chủ không gửi tác
 * giả), dot vote, gom nhóm, việc cần làm ⇒ thẻ, khoá theo hạn, tóm tắt AI (retro AI có sẵn), xuất .docx.
 */

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Download, Lock, Minus, Plus, Sparkles, Trash2, Unlock, UserX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError, type ProjectConfig } from '@/lib/work-api';
import { agileApi, agileKeys, type Retro, type RetroCard, type RetroRow, type RetroTemplate } from '@/lib/work-agile-api';
import DataTable, { type DataColumn } from '../table/DataTable';
import { Dialog, EmptyState, Field, PageLoading, UserAvatar } from '../ui';
import { Select } from '../settings/shared';
import { useWT, wt } from '../i18n';
import type { WKey } from '../i18n';

const colLabel = (c: string) => wt(`agile.col_${c}` as WKey);

function NewRetroDialog({ pid, config, open, onClose, onCreated }: { pid: number; config: ProjectConfig; open: boolean; onClose: () => void; onCreated: (id: number) => void }) {
  const last = config.sprints.find((s) => s.state === 'ACTIVE') ?? [...config.sprints].reverse().find((s) => s.state === 'CLOSED') ?? config.sprints[0];
  const [title, setTitle] = useState(last ? `${last.name} retro` : `Retro ${new Date().toISOString().slice(0, 10)}`);
  const [template, setTemplate] = useState<RetroTemplate>('SSC');
  const [sprintId, setSprintId] = useState<number | ''>(last?.id ?? '');
  const [anonymous, setAnonymous] = useState(true);
  const [votes, setVotes] = useState(5);
  const [lockAt, setLockAt] = useState('');
  const m = useMutation({
    mutationFn: () => agileApi.retroCreate(pid, { title: title.trim(), template, sprintId: sprintId || null, anonymous, votesPerPerson: votes, lockAt: lockAt ? new Date(lockAt).toISOString() : null }),
    onSuccess: (r) => { onCreated(r.id); onClose(); },
    onError: (e) => toast.error(workError(e, wt('agile.failed'))),
  });
  return (
    <Dialog open={open} onClose={onClose} title={wt('agile.newRetro')} width={480}
      footer={<><button type="button" className="w-btn w-btn-ghost" onClick={onClose}>{wt('agile.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!title.trim() || m.isPending} onClick={() => m.mutate()} data-testid="retro-create">{wt('agile.create')}</button></>}>
      <div className="space-y-3">
        <Field label={wt('agile.retroName')}><input className="w-input" value={title} maxLength={120} placeholder={wt('agile.retroNamePh')} onChange={(e) => setTitle(e.target.value)} autoFocus /></Field>
        <Field label={wt('agile.template')}>
          <Select value={template} onChange={(e) => setTemplate(e.target.value as RetroTemplate)}>
            {(['SSC', 'MSG', 'FOUR_L'] as const).map((t) => <option key={t} value={t}>{wt(`agile.template_${t}` as WKey)}</option>)}
          </Select>
        </Field>
        <Field label={wt('agile.sprint')}>
          <Select value={sprintId} onChange={(e) => setSprintId(e.target.value ? Number(e.target.value) : '')}>
            <option value="">{wt('agile.noSprint')}</option>
            {config.sprints.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={wt('agile.votesPerPerson')}><input className="w-input" type="number" min={1} max={20} value={votes} onChange={(e) => setVotes(Math.max(1, Math.min(20, Number(e.target.value) || 1)))} /></Field>
          <Field label={wt('agile.deadline')}><input className="w-input" type="datetime-local" value={lockAt} onChange={(e) => setLockAt(e.target.value)} /></Field>
        </div>
        <label className="flex items-start gap-2 text-[13px]">
          <input type="checkbox" className="mt-0.5" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
          <span><span className="font-medium">{wt('agile.anonymous')}</span><span className="block text-[12px] text-[var(--w-text-3)]">{wt('agile.anonymousHint')}</span></span>
        </label>
      </div>
    </Dialog>
  );
}

export function RetroList({ pid, config, onOpen }: { pid: number; config: ProjectConfig; onOpen: (id: number) => void }) {
  const { fmtDate } = useWT();
  const q = useQuery({ queryKey: agileKeys.retros(pid), queryFn: () => agileApi.retroList(pid) });
  const [open, setOpen] = useState(false);
  const cols: DataColumn<RetroRow>[] = [
    { id: 'title', header: wt('agile.retroName'), grow: true, minWidth: 220, value: (r) => r.title, cell: (r) => <span className="font-medium">{r.title}{r.anonymous && <span className="ml-2 text-[11px] text-[var(--w-text-3)]">· {wt('agile.anonBadge')}</span>}</span> },
    { id: 'tpl', header: wt('agile.template'), value: (r) => r.template, text: (r) => wt(`agile.template_${r.template}` as WKey), width: 200, hideBelow: 'md' },
    { id: 'sprint', header: wt('agile.sprint'), value: (r) => r.sprint?.name ?? '', width: 140 },
    { id: 'cards', header: wt('agile.colCards'), value: (r) => r.cards, width: 80, align: 'right' },
    { id: 'acts', header: wt('agile.colActions'), value: (r) => r.actions, width: 80, align: 'right' },
    { id: 'lock', header: wt('agile.colStatus'), value: (r) => (r.locked ? 1 : 0), text: (r) => (r.locked ? wt('agile.locked') : wt('agile.open')), width: 100 },
    { id: 'created', header: wt('agile.colCreated'), value: (r) => r.createdAt, text: (r) => fmtDate(r.createdAt), width: 120, hideBelow: 'md' },
  ];
  if (q.isLoading) return <PageLoading />;
  if (!q.data) return <EmptyState title={wt('agile.loadFailed')} body={workError(q.error)} />;
  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <h2 className="text-[15px] font-semibold">{wt('agile.retroTitle')}</h2>
        {q.data.canCreate && <button type="button" className="w-btn w-btn-primary w-btn-sm ml-auto" onClick={() => setOpen(true)} data-testid="retro-new"><Plus size={12} /> {wt('agile.newRetro')}</button>}
      </div>
      {!q.data.retros.length ? <EmptyState title={wt('agile.noRetros')} body={wt('agile.noRetrosBody')} /> : (
        <DataTable id="retros" label={wt('agile.retroTitle')} rows={q.data.retros} columns={cols} rowKey={(r) => r.id} onRowOpen={(r) => onOpen(r.id)} height="auto" paging="none" />
      )}
      {open && <NewRetroDialog pid={pid} config={config} open onClose={() => setOpen(false)} onCreated={onOpen} />}
    </div>
  );
}

function NoteCard({ card, kids, retro, pid, onAction, heads }: { card: RetroCard; kids: RetroCard[]; retro: Retro; pid: number; onAction: (c: RetroCard) => void; heads: RetroCard[] }) {
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: agileKeys.retros(pid) });
  const err = (e: unknown) => toast.error(workError(e, wt('agile.failed')));
  const vote = useMutation({ mutationFn: (d: 1 | -1) => agileApi.cardVote(pid, retro.id, card.id, d), onSuccess: refresh, onError: err });
  const upd = useMutation({ mutationFn: (b: { groupId?: number | null; body?: string }) => agileApi.cardUpdate(pid, retro.id, card.id, b), onSuccess: refresh, onError: err });
  const del = useMutation({ mutationFn: () => agileApi.cardDelete(pid, retro.id, card.id), onSuccess: refresh, onError: err });
  const total = card.votes + kids.reduce((s, k) => s + k.votes, 0);
  const canWrite = retro.me.canWrite;
  const others = heads.filter((h) => h.id !== card.id);
  return (
    <li className={cn('rounded-[8px] border bg-[var(--w-panel)] p-2.5 text-[13px]', card.mine ? 'border-[var(--w-accent-border)]' : 'border-[var(--w-border)]')} data-testid="retro-card">
      <p className="whitespace-pre-line break-words">{card.body}</p>
      {kids.length > 0 && (
        <ul className="mt-2 space-y-1 border-l-2 border-[var(--w-border)] pl-2 text-[12px] text-[var(--w-text-2)]">
          {kids.map((k) => (
            <li key={k.id} className="flex items-start gap-1">
              <span className="min-w-0 flex-1">{k.body}</span>
              {canWrite && <button type="button" className="text-[11px] text-[var(--w-text-3)] hover:underline" onClick={() => agileApi.cardUpdate(pid, retro.id, k.id, { groupId: null }).then(refresh, err)}>{wt('agile.ungroup')}</button>}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[12px] text-[var(--w-text-3)]">
        {retro.anonymous ? (card.mine ? <span>{wt('agile.you')}</span> : <UserX size={12} aria-label={wt('agile.anonBadge')} />) : card.author && <span className="inline-flex items-center gap-1"><UserAvatar user={card.author} size={16} />{userName(card.author)}</span>}
        <span className="ml-auto inline-flex items-center gap-1 tabular" aria-label={wt('agile.votes', { n: total })}>
          {canWrite && card.myVotes > 0 && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('agile.unvote')} onClick={() => vote.mutate(-1)}><Minus size={11} /></button>}
          <span className={cn('rounded-full px-1.5', card.myVotes ? 'bg-[var(--w-accent)] text-white' : 'bg-[var(--w-sunken)]')}>● {total}</span>
          {canWrite && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('agile.vote')} disabled={retro.me.votesLeft <= 0} onClick={() => vote.mutate(1)} data-testid="retro-vote"><Plus size={11} /></button>}
        </span>
      </div>
      {(canWrite || retro.me.canUseAi) && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1">
          {canWrite && others.length > 0 && (
            <Select value="" aria-label={wt('agile.group')} className="h-7 w-[130px] text-[12px]" onChange={(e) => e.target.value && upd.mutate({ groupId: Number(e.target.value) })}>
              <option value="">{wt('agile.group')}</option>
              {others.map((h) => <option key={h.id} value={h.id}>{h.body.slice(0, 40)}</option>)}
            </Select>
          )}
          {retro.me.canUseAi && <button type="button" className="w-btn w-btn-ghost w-btn-sm text-[12px]" onClick={() => onAction(card)}>{wt('agile.actionFromCard')}</button>}
          {canWrite && (card.mine || retro.me.canFacilitate) && (
            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm ml-auto" aria-label={wt('agile.delete')} onClick={() => { if (window.confirm(wt('agile.deleteCardConfirm'))) del.mutate(); }}><Trash2 size={12} /></button>
          )}
        </div>
      )}
    </li>
  );
}

function Column({ col, retro, pid, onAction }: { col: string; retro: Retro; pid: number; onAction: (c: RetroCard) => void }) {
  const qc = useQueryClient();
  const [text, setText] = useState('');
  const heads = retro.cards.filter((c) => c.column === col && !c.groupId);
  const allHeads = retro.cards.filter((c) => !c.groupId);
  const add = useMutation({
    mutationFn: () => agileApi.cardAdd(pid, retro.id, { column: col, body: text.trim() }),
    onSuccess: () => { setText(''); qc.invalidateQueries({ queryKey: agileKeys.retros(pid) }); },
    onError: (e) => toast.error(workError(e, wt('agile.failed'))),
  });
  return (
    <section className="flex min-w-[240px] flex-1 flex-col rounded-[10px] bg-[var(--w-sunken)] p-2" aria-label={colLabel(col)} data-testid={`retro-col-${col}`}>
      <h3 className="mb-2 flex items-center px-1 text-[13px] font-semibold">{colLabel(col)}<span className="ml-1.5 text-[12px] font-normal text-[var(--w-text-3)]">{heads.length}</span></h3>
      {retro.me.canWrite && (
        <textarea className="w-input mb-2 min-h-[54px] text-[13px]" value={text} maxLength={1000} placeholder={wt('agile.notePlaceholder')} aria-label={`${wt('agile.addNote')} — ${colLabel(col)}`}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); if (text.trim()) add.mutate(); } }} />
      )}
      <ul className="space-y-2">
        {heads.sort((a, b) => (b.votes - a.votes) || (a.position - b.position)).map((c) => (
          <NoteCard key={c.id} card={c} kids={retro.cards.filter((k) => k.groupId === c.id)} retro={retro} pid={pid} onAction={onAction} heads={allHeads} />
        ))}
      </ul>
    </section>
  );
}

export function RetroBoard({ pid, rid, config, onBack }: { pid: number; rid: number; config: ProjectConfig; onBack: () => void }) {
  const qc = useQueryClient();
  const { locale, fmtDateTime } = useWT();
  const q = useQuery({ queryKey: agileKeys.retro(pid, rid), queryFn: () => agileApi.retro(pid, rid) });
  const r = q.data;
  const refresh = () => qc.invalidateQueries({ queryKey: agileKeys.retros(pid) });
  const err = (e: unknown) => toast.error(workError(e, wt('agile.failed')));
  const [actionTitle, setActionTitle] = useState('');
  const [actionCard, setActionCard] = useState<number | null>(null);
  const [assignee, setAssignee] = useState<number | ''>('');
  const [aiActions, setAiActions] = useState<Array<{ title?: string }>>([]);
  const lock = useMutation({ mutationFn: (locked: boolean) => agileApi.retroUpdate(pid, rid, { locked }), onSuccess: refresh, onError: err });
  const addAction = useMutation({
    mutationFn: (t: string) => agileApi.actionAdd(pid, rid, { title: t, cardId: actionCard, assigneeId: assignee || null, createIssue: true }),
    onSuccess: (x) => { toast.success(wt('agile.actionCreated', { k: `${config.key}-${x.issueNumber}` })); setActionTitle(''); setActionCard(null); refresh(); },
    onError: err,
  });
  const delAction = useMutation({ mutationFn: (aid: number) => agileApi.actionDelete(pid, rid, aid), onSuccess: refresh, onError: err });
  const ai = useMutation({ mutationFn: () => agileApi.retroSummary(pid, rid, locale), onSuccess: (x) => { setAiActions(x.actions ?? []); refresh(); }, onError: err });
  const exp = useMutation({ mutationFn: () => agileApi.retroExport(pid, rid), onError: err });

  if (q.isLoading) return <PageLoading />;
  if (!r) return <EmptyState title={wt('agile.loadFailed')} body={workError(q.error)} />;
  return (
    <div className="space-y-3" data-testid="retro-board">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={onBack}>← {wt('agile.back')}</button>
        <h2 className="text-[15px] font-semibold">{r.title}</h2>
        <span className="text-[12px] text-[var(--w-text-3)]">{wt(`agile.template_${r.template}` as WKey)}{r.sprint ? ` · ${r.sprint.name}` : ''}</span>
        {r.anonymous && <span className="inline-flex items-center gap-1 rounded-full bg-[var(--w-sunken)] px-2 py-0.5 text-[11px]"><UserX size={11} /> {wt('agile.anonBadge')}</span>}
        {r.locked && <span className="inline-flex items-center gap-1 rounded-full bg-[var(--w-sunken)] px-2 py-0.5 text-[11px]"><Lock size={11} /> {wt('agile.locked')}</span>}
        {!r.locked && r.lockAt && <span className="text-[12px] text-[var(--w-text-3)]">{wt('agile.deadline')}: {fmtDateTime(r.lockAt)}</span>}
        <span className="text-[12px] text-[var(--w-text-2)]">{r.me.canWrite ? wt('agile.votesLeft', { n: r.me.votesLeft }) : ''}</span>
        <div className="ml-auto flex flex-wrap gap-1.5">
          {r.me.canFacilitate && <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => lock.mutate(!r.lockedManually)}>{r.lockedManually ? <><Unlock size={12} /> {wt('agile.unlock')}</> : <><Lock size={12} /> {wt('agile.lockNow')}</>}</button>}
          <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => exp.mutate()} disabled={exp.isPending}><Download size={12} /> {wt('agile.exportDocx')}</button>
          {r.me.canUseAi && <button type="button" className="w-btn w-btn-sm" onClick={() => ai.mutate()} disabled={ai.isPending} title={wt('agile.aiSummaryHint')} data-testid="retro-ai"><Sparkles size={12} /> {wt('agile.aiSummaryBtn')}</button>}
        </div>
      </div>
      {r.locked && <p className="rounded-[8px] border border-[var(--w-border)] px-3 py-2 text-[12px] text-[var(--w-text-2)]">{wt('agile.lockedBody')}</p>}

      <div className="flex gap-3 overflow-x-auto pb-2">
        {r.columns.map((c) => <Column key={c} col={c} retro={r} pid={pid} onAction={(card) => { setActionTitle(card.body.slice(0, 200)); setActionCard(card.id); }} />)}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-3">
          <h3 className="mb-2 text-[13px] font-semibold">{wt('agile.actions')}</h3>
          {!r.actions.length && <p className="text-[13px] text-[var(--w-text-3)]">{wt('agile.noActions')}</p>}
          <ul className="space-y-1.5">
            {r.actions.map((a) => (
              <li key={a.id} className="flex items-center gap-2 text-[13px]">
                {a.issue ? <a className="shrink-0 font-medium hover:underline" href={`/work/${config.workspace.slug}/${config.key}/issue/${a.issue.number}`}>{config.key}-{a.issue.number}</a> : null}
                <span className="min-w-0 flex-1 truncate">{a.title}</span>
                {a.assignee && <UserAvatar user={a.assignee} size={18} />}
                {r.me.canUseAi && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('agile.delete')} onClick={() => delAction.mutate(a.id)}><Trash2 size={12} /></button>}
              </li>
            ))}
          </ul>
          {r.me.canUseAi && (
            <div className="mt-3 flex flex-wrap gap-2">
              <input className="w-input min-w-[200px] flex-1" value={actionTitle} maxLength={255} placeholder={wt('agile.actionPh')} aria-label={wt('agile.actionPh')} onChange={(e) => setActionTitle(e.target.value)} />
              <Select value={assignee} aria-label={wt('agile.assignee')} className="w-[150px]" onChange={(e) => setAssignee(e.target.value ? Number(e.target.value) : '')}>
                <option value="">{wt('agile.unassigned')}</option>
                {config.members.filter((m) => m.role === 'ADMIN' || m.role === 'MEMBER').map((m) => <option key={m.id} value={m.id}>{userName(m)}</option>)}
              </Select>
              <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={!actionTitle.trim() || addAction.isPending} onClick={() => addAction.mutate(actionTitle.trim())} data-testid="retro-add-action">{wt('agile.addAction')}</button>
            </div>
          )}
        </section>
        <section className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-3">
          <h3 className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold"><Sparkles size={13} /> {wt('agile.aiSummary')}</h3>
          {r.summary ? <div className="whitespace-pre-line text-[13px] text-[var(--w-text-2)]">{r.summary}</div> : <p className="text-[12px] text-[var(--w-text-3)]">{wt('agile.aiSummaryHint')}</p>}
          {aiActions.length > 0 && (
            <div className="mt-3">
              <div className="mb-1 text-[12px] font-medium">{wt('agile.aiSuggestedActions')}</div>
              <ul className="space-y-1">
                {aiActions.filter((a) => a.title).map((a, i) => (
                  <li key={i} className="flex items-center gap-2 text-[13px]">
                    <span className="min-w-0 flex-1">{a.title}</span>
                    <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => { addAction.mutate(a.title!); setAiActions((x) => x.filter((_, j) => j !== i)); }}><Plus size={12} /> {wt('agile.addAction')}</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
