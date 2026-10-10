'use client';

/**
 * CTW đợt 6b (R3) — Sổ stakeholder (Vision & Scope §3.1, Wiegers ch.2): vai, tổ chức, lớp người dùng, ảnh hưởng × quan tâm
 * (1–5), thái độ, product champion, quyền quyết định + lưới quyền lực × quan tâm (Mendelow) + ma trận RACI theo hoạt động
 * yêu cầu (đúng một A mỗi hoạt động). Sổ này đổ vào V&S §3.1, SRS §2.2 và báo cáo elicitation.
 */

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Crown, Plus, UsersRound } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { ATTITUDES, QUADRANTS, STAKEHOLDER_KINDS, workSwr6bApi, workSwr6bKeys, type Attitude, type Quadrant, type RaciRole, type Stakeholder, type StakeholderBody } from '@/lib/work-swr6b-api';
import { wt, type WKey } from '@/components/work/i18n';
import { Dialog, EmptyState, Field, PageLoading, Spinner } from '../ui';
import { RowActions } from '../swr/shared';
import { Chip, Note, Section, TabIntro, TableFrame, TD, TextArea, TH, use6bRefresh } from './shared';

export const QUADRANT_KEY: Record<Quadrant, WKey> = { MANAGE_CLOSELY: 'elic.qManage', KEEP_SATISFIED: 'elic.qSatisfied', KEEP_INFORMED: 'elic.qInformed', MONITOR: 'elic.qMonitor' };
const QUADRANT_TONE: Record<Quadrant, 'red' | 'orange' | 'blue' | 'muted'> = { MANAGE_CLOSELY: 'red', KEEP_SATISFIED: 'orange', KEEP_INFORMED: 'blue', MONITOR: 'muted' };
export const ATTITUDE_KEY: Record<Attitude, WKey> = { CHAMPION: 'elic.atChampion', SUPPORTER: 'elic.atSupporter', NEUTRAL: 'elic.atNeutral', CRITIC: 'elic.atCritic', BLOCKER: 'elic.atBlocker' };
const KIND_KEY: Record<string, WKey> = { PERSON: 'elic.kPerson', GROUP: 'elic.kGroup', ORG: 'elic.kOrg' };
const WARN_KEY: Record<string, WKey> = { NO_CHAMPION: 'elic.wNoChampion', NO_DECIDER: 'elic.wNoDecider', POWERFUL_CRITIC: 'elic.wPowerfulCritic', UNRATED: 'elic.wUnrated' };
const RACI_PROBLEM_KEY: Record<string, WKey> = { NO_A: 'elic.raciNoA', MANY_A: 'elic.raciManyA', NO_R: 'elic.raciNoR' };

const EMPTY = {
  name: '', role: '', organization: '', kind: 'PERSON', userClass: '', influence: 3, interest: 3, attitude: '' as '' | Attitude, isChampion: false,
  decisionRights: '', majorValue: '', interests: '', constraints: '', contact: '', notes: '', actorId: '', userId: '',
};

export default function StakeholdersTab({ pid }: { pid: number }) {
  const refresh = use6bRefresh(pid);
  const q = useQuery({ queryKey: workSwr6bKeys.stakeholders(pid), queryFn: () => workSwr6bApi.stakeholders(pid) });
  const [edit, setEdit] = useState<Stakeholder | 'new' | null>(null);
  const [f, setF] = useState(EMPTY);
  useEffect(() => {
    if (!edit) return;
    setF(edit === 'new' ? EMPTY : {
      name: edit.name, role: edit.role ?? '', organization: edit.organization ?? '', kind: edit.kind, userClass: edit.userClass ?? '', influence: edit.influence, interest: edit.interest,
      attitude: edit.attitude ?? '', isChampion: edit.isChampion, decisionRights: edit.decisionRights ?? '', majorValue: edit.majorValue ?? '', interests: edit.interests ?? '',
      constraints: edit.constraints ?? '', contact: edit.contact ?? '', notes: edit.notes ?? '', actorId: edit.actorId ? String(edit.actorId) : '', userId: edit.userId ? String(edit.userId) : '',
    });
  }, [edit]);
  const save = useMutation({
    mutationFn: () => {
      const s = (v: string) => v.trim() || null;
      const body: StakeholderBody = {
        name: f.name.trim(), role: s(f.role), organization: s(f.organization), kind: f.kind, userClass: s(f.userClass), influence: f.influence, interest: f.interest,
        attitude: f.attitude || null, isChampion: f.isChampion, decisionRights: s(f.decisionRights), majorValue: s(f.majorValue), interests: s(f.interests), constraints: s(f.constraints),
        contact: s(f.contact), notes: s(f.notes), actorId: f.actorId ? Number(f.actorId) : null, userId: f.userId ? Number(f.userId) : null,
      };
      return edit === 'new' ? workSwr6bApi.createStakeholder(pid, body) : workSwr6bApi.updateStakeholder(pid, (edit as Stakeholder).number, { ...body, rev: (edit as Stakeholder).rev });
    },
    onSuccess: () => { refresh(); setEdit(null); toast.success(wt('common.saved')); },
    onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))),
  });
  const del = useMutation({ mutationFn: (n: number) => workSwr6bApi.deleteStakeholder(pid, n), onSuccess: () => { refresh(); toast.success(wt('swr.deleted')); }, onError: (e) => toast.error(workError(e, wt('common.couldNotDelete'))) });
  const seed = useMutation({ mutationFn: () => workSwr6bApi.seedStakeholders(pid), onSuccess: (r) => { refresh(); toast.success(wt('elic.seeded', { count: r.added })); }, onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))) });

  if (q.isLoading) return <PageLoading rows={5} />;
  if (!q.data) return <EmptyState title={wt('swr.loadFailed')} body={q.error ? workError(q.error) : undefined} />;
  const data = q.data;
  const byKey = new Map(data.stakeholders.map((s) => [s.key, s]));
  return (
    <div className="flex flex-col gap-5">
      <TabIntro text={wt('elic.shIntro')}>
        {data.canEdit && data.actors.some((a) => a.kind !== 'SYSTEM') && <button type="button" className="w-btn w-btn-sm" disabled={seed.isPending} onClick={() => seed.mutate()}><UsersRound size={13} /> {wt('elic.fromActors')}</button>}
        {data.canEdit && <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => setEdit('new')}><Plus size={14} /> {wt('elic.addStakeholder')}</button>}
      </TabIntro>
      {data.warnings.length > 0 && (
        <Note tone="warn">{data.warnings.map((w) => wt(WARN_KEY[w.code] ?? 'elic.wUnrated', w.params as Record<string, string | number> | undefined)).join(' · ')}</Note>
      )}
      {!data.stakeholders.length ? <EmptyState title={wt('elic.noStakeholders')} body={wt('elic.noStakeholdersBody')} /> : (
        <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_340px]">
          <TableFrame label={wt('elic.register')}>
            <table className="w-full min-w-[860px] border-separate border-spacing-0">
              <thead><tr>{[wt('elic.hId'), wt('elic.hStakeholder'), wt('elic.hUserClass'), wt('elic.hInfluence'), wt('elic.hInterest'), wt('elic.hStrategy'), wt('elic.hAttitude'), wt('elic.hDecides'), wt('elic.hTrace'), ''].map((h, i) => <th key={i} scope="col" className={TH}>{h}</th>)}</tr></thead>
              <tbody>
                {data.stakeholders.map((s) => (
                  <tr key={s.id} className="hover:bg-[var(--w-hover)]">
                    <td className={`${TD} whitespace-nowrap font-mono text-[12px] text-[var(--w-text-2)]`}>{s.key}</td>
                    <td className={`${TD} min-w-[200px]`}>
                      <span className="flex items-center gap-1 font-medium">{s.name}{s.isChampion && <Crown size={13} className="text-[var(--w-yellow-text)]" aria-label={wt('elic.champion')} />}</span>
                      <span className="block text-[12px] text-[var(--w-text-2)]">{[s.role, s.organization, wt(KIND_KEY[s.kind] ?? 'elic.kPerson')].filter(Boolean).join(' · ')}</span>
                    </td>
                    <td className={TD}>{s.userClass ?? '—'}</td>
                    <td className={`${TD} tabular-nums`}>{s.influence}/5</td>
                    <td className={`${TD} tabular-nums`}>{s.interest}/5</td>
                    <td className={TD}><Chip tone={QUADRANT_TONE[s.quadrant]}>{wt(QUADRANT_KEY[s.quadrant])}</Chip></td>
                    <td className={TD}>{s.attitude ? wt(ATTITUDE_KEY[s.attitude]) : '—'}</td>
                    <td className={`${TD} max-w-[200px]`}><span className="line-clamp-2 text-[12.5px]">{s.decisionRights ?? '—'}</span></td>
                    <td className={`${TD} whitespace-nowrap text-[12px] text-[var(--w-text-2)]`}>{wt('elic.traceCell', { s: s.sessions.length, r: s.requirements })}</td>
                    <td className={`${TD} w-20`}>{data.canEdit && <RowActions label={s.name} onEdit={() => setEdit(s)} onDelete={data.canConfigure ? () => window.confirm(wt('swr.deleteQ', { name: s.name })) && del.mutate(s.number) : undefined} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableFrame>
          <PowerGrid grid={data.grid} name={(k) => byKey.get(k)?.name ?? k} />
        </div>
      )}
      {data.stakeholders.length > 0 && <RaciMatrix pid={pid} />}

      <Dialog open={!!edit} onClose={() => setEdit(null)} title={edit === 'new' ? wt('elic.addStakeholder') : `${wt('common.edit')} ${(edit as Stakeholder | null)?.key ?? ''}`} width={680}
        footer={<><button type="button" className="w-btn" onClick={() => setEdit(null)}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={!f.name.trim() || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={12} />} {wt('common.save')}</button></>}>
        <div className="grid gap-x-3 sm:grid-cols-2">
          <Field label={wt('elic.fName')}><input className="w-input" autoFocus value={f.name} maxLength={160} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field label={wt('elic.fRole')}><input className="w-input" value={f.role} maxLength={160} placeholder={wt('elic.fRolePh')} onChange={(e) => setF({ ...f, role: e.target.value })} /></Field>
          <Field label={wt('elic.fOrg')}><input className="w-input" value={f.organization} maxLength={160} onChange={(e) => setF({ ...f, organization: e.target.value })} /></Field>
          <Field label={wt('elic.fKind')}>
            <select className="w-input" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })}>{STAKEHOLDER_KINDS.map((k) => <option key={k} value={k}>{wt(KIND_KEY[k])}</option>)}</select>
          </Field>
          <Field label={wt('elic.hUserClass')} hint={wt('elic.fUserClassHint')}><input className="w-input" value={f.userClass} maxLength={120} onChange={(e) => setF({ ...f, userClass: e.target.value })} /></Field>
          <Field label={wt('elic.fActor')}>
            <select className="w-input" value={f.actorId} onChange={(e) => setF({ ...f, actorId: e.target.value })}>
              <option value="">—</option>{data.actors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </Field>
          <Field label={`${wt('elic.hInfluence')} (1–5)`} hint={wt('elic.fInfluenceHint')}><input className="w-input" type="number" min={1} max={5} value={f.influence} onChange={(e) => setF({ ...f, influence: Math.min(5, Math.max(1, Number(e.target.value) || 1)) })} /></Field>
          <Field label={`${wt('elic.hInterest')} (1–5)`} hint={wt('elic.fInterestHint')}><input className="w-input" type="number" min={1} max={5} value={f.interest} onChange={(e) => setF({ ...f, interest: Math.min(5, Math.max(1, Number(e.target.value) || 1)) })} /></Field>
          <Field label={wt('elic.hAttitude')}>
            <select className="w-input" value={f.attitude} onChange={(e) => setF({ ...f, attitude: e.target.value as '' | Attitude })}><option value="">—</option>{ATTITUDES.map((a) => <option key={a} value={a}>{wt(ATTITUDE_KEY[a])}</option>)}</select>
          </Field>
          <Field label={wt('elic.fMember')}>
            <select className="w-input" value={f.userId} onChange={(e) => setF({ ...f, userId: e.target.value })}><option value="">—</option>{data.members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
          </Field>
        </div>
        <label className="mb-3 flex items-center gap-2 text-[13px]"><input type="checkbox" checked={f.isChampion} onChange={(e) => setF({ ...f, isChampion: e.target.checked })} /> {wt('elic.fChampion')}</label>
        <TextArea id="sh-dec" label={wt('elic.hDecides')} value={f.decisionRights} rows={2} onChange={(v) => setF({ ...f, decisionRights: v })} placeholder={wt('elic.fDecidesPh')} />
        <div className="grid gap-x-3 sm:grid-cols-3">
          <TextArea id="sh-val" label={wt('elic.fValue')} value={f.majorValue} rows={2} onChange={(v) => setF({ ...f, majorValue: v })} />
          <TextArea id="sh-int" label={wt('elic.fInterests')} value={f.interests} rows={2} onChange={(v) => setF({ ...f, interests: v })} />
          <TextArea id="sh-con" label={wt('elic.fConstraints')} value={f.constraints} rows={2} onChange={(v) => setF({ ...f, constraints: v })} />
        </div>
        <Field label={wt('elic.fContact')}><input className="w-input" value={f.contact} maxLength={200} onChange={(e) => setF({ ...f, contact: e.target.value })} /></Field>
        <TextArea id="sh-notes" label={wt('elic.fNotes')} value={f.notes} rows={2} onChange={(v) => setF({ ...f, notes: v })} />
      </Dialog>
    </div>
  );
}

/** Lưới 2×2: trục dọc = quyền lực (ảnh hưởng), trục ngang = quan tâm. */
function PowerGrid({ grid, name }: { grid: Record<Quadrant, string[]>; name: (k: string) => string }) {
  return (
    <section aria-labelledby="power-grid-h" className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-3">
      <h2 id="power-grid-h" className="mb-2 text-[13.5px] font-semibold">{wt('elic.gridTitle')}</h2>
      <div className="grid grid-cols-[18px_1fr] gap-1">
        <div className="flex items-center justify-center"><span className="-rotate-90 whitespace-nowrap text-[11px] text-[var(--w-text-3)]">{wt('elic.axisPower')} →</span></div>
        <div className="grid grid-cols-2 gap-1">
          {QUADRANTS.map((qd) => (
            <div key={qd} className={cn('min-h-[92px] rounded-[6px] border border-[var(--w-border)] p-2', qd === 'MANAGE_CLOSELY' ? 'bg-[color-mix(in_srgb,var(--w-red)_8%,transparent)]' : 'bg-[var(--w-sunken)]')}>
              <div className="mb-1 text-[11.5px] font-semibold text-[var(--w-text-2)]">{wt(QUADRANT_KEY[qd])}</div>
              <ul className="flex flex-wrap gap-1">
                {grid[qd].map((k) => <li key={k} className="rounded-[4px] bg-[var(--w-panel)] px-1.5 py-0.5 text-[12px]" title={k}>{name(k)}</li>)}
                {!grid[qd].length && <li className="text-[12px] text-[var(--w-text-3)]">—</li>}
              </ul>
            </div>
          ))}
        </div>
        <div />
        <div className="text-center text-[11px] text-[var(--w-text-3)]">{wt('elic.axisInterest')} →</div>
      </div>
    </section>
  );
}

function RaciMatrix({ pid }: { pid: number }) {
  const refresh = use6bRefresh(pid);
  const q = useQuery({ queryKey: workSwr6bKeys.raci(pid), queryFn: () => workSwr6bApi.raci(pid) });
  const [name, setName] = useState('');
  const add = useMutation({ mutationFn: (b: { name?: string; defaults?: boolean }) => workSwr6bApi.addRaciActivity(pid, b), onSuccess: () => { refresh(); setName(''); }, onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))) });
  const set = useMutation({ mutationFn: (b: { activityId: number; stakeholder: number; role: RaciRole | null }) => workSwr6bApi.setRaci(pid, b), onSuccess: () => refresh(), onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))) });
  const del = useMutation({ mutationFn: (id: number) => workSwr6bApi.deleteRaciActivity(pid, id), onSuccess: () => refresh(), onError: (e) => toast.error(workError(e, wt('common.couldNotDelete'))) });
  const cell = useMemo(() => new Map((q.data?.cells ?? []).map((c) => [`${c.activityId}:${c.stakeholderId}`, c.role])), [q.data]);
  if (!q.data) return null;
  const r = q.data;
  return (
    <Section id="raci-h" title={wt('elic.raciTitle')} actions={r.canEdit && !r.activities.length ? <button type="button" className="w-btn w-btn-sm" onClick={() => add.mutate({ defaults: true })}>{wt('elic.raciDefaults')}</button> : undefined}>
      <p className="text-[12.5px] text-[var(--w-text-2)]">{wt('elic.raciIntro')}</p>
      {r.problems.length > 0 && <Note tone="warn">{r.problems.map((p) => wt(RACI_PROBLEM_KEY[p.code], { activity: p.activity, count: p.count })).join(' · ')}</Note>}
      {r.activities.length > 0 && (
        <TableFrame label={wt('elic.raciTitle')} maxH="none">
          <table className="w-full border-separate border-spacing-0">
            <thead><tr><th scope="col" className={TH}>{wt('elic.raciActivity')}</th>{r.stakeholders.map((s) => <th key={s.id} scope="col" className={`${TH} text-center`} title={s.role ?? undefined}>{s.name}</th>)}<th className={TH} /></tr></thead>
            <tbody>
              {r.activities.map((a) => (
                <tr key={a.id}>
                  <th scope="row" className={`${TD} text-left font-medium`}>{a.name}</th>
                  {r.stakeholders.map((s) => {
                    const v = cell.get(`${a.id}:${s.id}`) ?? '';
                    return (
                      <td key={s.id} className={`${TD} text-center`}>
                        {r.canEdit ? (
                          <select aria-label={`${a.name} — ${s.name}`} className="w-input h-7 w-[58px] px-1 text-center" value={v} onChange={(e) => set.mutate({ activityId: a.id, stakeholder: Number(s.key.slice(3)), role: (e.target.value || null) as RaciRole | null })}>
                            <option value="">—</option>{(['R', 'A', 'C', 'I'] as const).map((x) => <option key={x} value={x}>{x}</option>)}
                          </select>
                        ) : <span className={cn('font-semibold', v === 'A' && 'text-[var(--w-accent-text)]')}>{v || '—'}</span>}
                      </td>
                    );
                  })}
                  <td className={`${TD} w-10`}>{r.canEdit && <RowActions label={a.name} onDelete={() => window.confirm(wt('swr.deleteQ', { name: a.name })) && del.mutate(a.id)} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableFrame>
      )}
      {r.canEdit && (
        <form className="flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); if (name.trim()) add.mutate({ name: name.trim() }); }}>
          <label className="sr-only" htmlFor="raci-new">{wt('elic.raciAdd')}</label>
          <input id="raci-new" className="w-input h-8 max-w-[320px]" value={name} maxLength={160} placeholder={wt('elic.raciAddPh')} onChange={(e) => setName(e.target.value)} />
          <button type="submit" className="w-btn w-btn-sm" disabled={!name.trim() || add.isPending}><Plus size={13} /> {wt('elic.raciAdd')}</button>
        </form>
      )}
      <p className="text-[12px] text-[var(--w-text-3)]">{wt('elic.raciLegend')}</p>
    </Section>
  );
}
