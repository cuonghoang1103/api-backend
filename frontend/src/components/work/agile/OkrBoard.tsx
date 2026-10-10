'use client';

/**
 * CT Work đợt 7a — OKR (C7). Dùng chung cho trang dự án (`scope.pid`) và trang không gian (`scope.wid`).
 * Chu kỳ ⇒ objective ⇒ key result (số đo, nguồn tiến độ, liên kết, check-in tuần có độ tự tin) ⇒ chấm điểm cuối kỳ.
 * Tab "Dashboard": KPI + tiến độ theo tuần so với kế hoạch + objective theo trạng thái (ChartFrame).
 */

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Award, Link2, Pencil, Plus, Target, Trash2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError, type ProjectMember } from '@/lib/work-api';
import {
  agileApi, agileKeys, type KeyResult, type KrInput, type KrMetric, type KrSource, type Objective, type OkrStatus, type OkrView,
} from '@/lib/work-agile-api';
import ChartFrame from '../charts/ChartFrame';
import { AXIS_TICK, GRID, SERIES } from '../charts/chartColors';
import KpiTile, { KpiRow } from '../KpiTile';
import { Dialog, EmptyState, Field, PageLoading, UserAvatar } from '../ui';
import { Select } from '../settings/shared';
import { useWT, wt } from '../i18n';
import type { WKey } from '../i18n';

const STATUS_TONE: Record<OkrStatus, string> = {
  NOT_STARTED: 'var(--w-text-3)', ON_TRACK: 'var(--w-status-done)', AT_RISK: 'var(--w-yellow)', OFF_TRACK: 'var(--w-red)', DONE: 'var(--w-status-done)', SCORED: 'var(--w-accent)',
};
const pct = (n: number) => `${Math.round(n * 100)}%`;

function StatusChip({ s }: { s: OkrStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--w-border)] px-2 py-0.5 text-[11px] font-medium text-[var(--w-text-2)]">
      <span className="h-2 w-2 rounded-full" style={{ background: STATUS_TONE[s] }} aria-hidden="true" />
      {wt(`agile.status_${s}` as WKey)}
    </span>
  );
}

function Bar01({ value, expected, label }: { value: number; expected?: number; label: string }) {
  return (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[var(--w-sunken)]" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)} aria-label={label}>
      <div className="h-full rounded-full bg-[var(--w-accent)]" style={{ width: pct(Math.min(1, value)) }} />
      {expected !== undefined && expected > 0 && expected < 1 && <div className="absolute top-0 h-full w-px bg-[var(--w-text-2)]" style={{ left: pct(expected) }} aria-hidden="true" />}
    </div>
  );
}

// ─── Hộp thoại ───────────────────────────────────────────────────

function CycleDialog({ wid, open, onClose, onCreated }: { wid: number; open: boolean; onClose: () => void; onCreated: (id: number) => void }) {
  const q = Math.floor(new Date().getMonth() / 3);
  const y = new Date().getFullYear();
  const [name, setName] = useState(`Q${q + 1} ${y}`);
  const [start, setStart] = useState(new Date(Date.UTC(y, q * 3, 1)).toISOString().slice(0, 10));
  const [end, setEnd] = useState(new Date(Date.UTC(y, q * 3 + 3, 0)).toISOString().slice(0, 10));
  const m = useMutation({
    mutationFn: () => agileApi.createCycle(wid, { name: name.trim(), startDate: start, endDate: end }),
    onSuccess: (r) => { onCreated(r.id); onClose(); },
    onError: (e) => toast.error(workError(e, wt('agile.failed'))),
  });
  return (
    <Dialog open={open} onClose={onClose} title={wt('agile.newCycle')} width={420}
      footer={<><button type="button" className="w-btn w-btn-ghost" onClick={onClose}>{wt('agile.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!name.trim() || m.isPending} onClick={() => m.mutate()}>{wt('agile.create')}</button></>}>
      <div className="space-y-3">
        <Field label={wt('agile.cycleName')}><input className="w-input" value={name} maxLength={80} placeholder={wt('agile.cycleNamePh')} onChange={(e) => setName(e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={wt('agile.startDate')}><input className="w-input" type="date" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
          <Field label={wt('agile.endDate')}><input className="w-input" type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></Field>
        </div>
      </div>
    </Dialog>
  );
}

function KrFields({ kr, onChange, members }: { kr: KrInput; onChange: (k: KrInput) => void; members?: ProjectMember[] }) {
  const set = (p: Partial<KrInput>) => onChange({ ...kr, ...p });
  const manual = (kr.source ?? 'MANUAL') === 'MANUAL';
  return (
    <div className="space-y-2">
      <input className="w-input" value={kr.title} maxLength={200} placeholder={wt('agile.krTitlePh')} aria-label={wt('agile.krTitle')} onChange={(e) => set({ title: e.target.value })} />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Select value={kr.source ?? 'MANUAL'} aria-label={wt('agile.source')} onChange={(e) => set({ source: e.target.value as KrSource })}>
          {(['MANUAL', 'ISSUES', 'POINTS'] as const).map((s) => <option key={s} value={s}>{wt(`agile.source_${s}` as WKey)}</option>)}
        </Select>
        {manual && (
          <Select value={kr.metric ?? 'NUMBER'} aria-label={wt('agile.metric')} onChange={(e) => set({ metric: e.target.value as KrMetric })}>
            {(['NUMBER', 'PERCENT', 'BOOLEAN'] as const).map((m) => <option key={m} value={m}>{wt(`agile.metric_${m}` as WKey)}</option>)}
          </Select>
        )}
        {manual && kr.metric !== 'BOOLEAN' && (
          <>
            <input className="w-input" type="number" aria-label={wt('agile.start')} placeholder={wt('agile.start')} value={kr.startValue ?? 0} onChange={(e) => set({ startValue: Number(e.target.value) })} />
            <input className="w-input" type="number" aria-label={wt('agile.target')} placeholder={wt('agile.target')} value={kr.targetValue ?? 100} onChange={(e) => set({ targetValue: Number(e.target.value) })} />
          </>
        )}
      </div>
      {members && (
        <Select value={kr.ownerId ?? ''} aria-label={wt('agile.owner')} onChange={(e) => set({ ownerId: e.target.value ? Number(e.target.value) : null })}>
          <option value="">{wt('agile.owner')}: —</option>
          {members.filter((m) => m.role !== 'CLIENT').map((m) => <option key={m.id} value={m.id}>{m.displayName || m.fullName || m.username}</option>)}
        </Select>
      )}
    </div>
  );
}

function ObjectiveDialog({ view, scope, members, editing, open, onClose }: {
  view: OkrView; scope: { pid?: number; wid: number }; members?: ProjectMember[]; editing: Objective | null; open: boolean; onClose: () => void;
}) {
  const qc = useQueryClient();
  const [title, setTitle] = useState(editing?.title ?? '');
  const [desc, setDesc] = useState(editing?.description ?? '');
  const [parentId, setParentId] = useState<number | null>(editing?.parent?.id ?? null);
  const [krs, setKrs] = useState<KrInput[]>(editing ? [] : [{ title: '', metric: 'NUMBER', startValue: 0, targetValue: 10, source: 'MANUAL' }]);
  const m = useMutation({
    mutationFn: async () => {
      if (editing) return agileApi.updateObjective(editing.id, { title: title.trim(), description: desc.trim() || null, parentId });
      return agileApi.createObjective(scope.pid ? { pid: scope.pid } : { wid: scope.wid }, {
        cycleId: view.cycle!.id, title: title.trim(), description: desc.trim() || null, parentId,
        keyResults: krs.filter((k) => k.title.trim()).map((k) => ({ ...k, title: k.title.trim() })),
      });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: agileKeys.okrAll }); toast.success(wt('agile.saved')); onClose(); },
    onError: (e) => toast.error(workError(e, wt('agile.failed'))),
  });
  return (
    <Dialog open={open} onClose={onClose} title={editing ? wt('agile.edit') : wt('agile.newObjective')} width={640}
      footer={<><button type="button" className="w-btn w-btn-ghost" onClick={onClose}>{wt('agile.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!title.trim() || m.isPending} onClick={() => m.mutate()} data-testid="okr-save-objective">{wt('agile.save')}</button></>}>
      <div className="space-y-3">
        <Field label={wt('agile.objTitle')}><input className="w-input" value={title} maxLength={200} placeholder={wt('agile.objTitlePh')} onChange={(e) => setTitle(e.target.value)} autoFocus /></Field>
        <Field label={wt('agile.description')}><textarea className="w-input min-h-[60px]" value={desc} maxLength={5000} onChange={(e) => setDesc(e.target.value)} /></Field>
        {scope.pid && !!view.alignTo?.length && (
          <Field label={wt('agile.alignTo')}>
            <Select value={parentId ?? ''} onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : null)}>
              <option value="">{wt('agile.none')}</option>
              {view.alignTo.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
            </Select>
          </Field>
        )}
        {!editing && (
          <div>
            <div className="mb-1.5 text-[12px] font-medium text-[var(--w-text-2)]">{wt('agile.keyResults')}</div>
            <div className="space-y-3">
              {krs.map((k, i) => (
                <div key={i} className="rounded-[8px] border border-[var(--w-border)] p-2.5">
                  <KrFields kr={k} members={members} onChange={(nk) => setKrs((a) => a.map((x, j) => (j === i ? nk : x)))} />
                </div>
              ))}
            </div>
            {krs.length < 10 && (
              <button type="button" className="w-btn w-btn-ghost w-btn-sm mt-2" onClick={() => setKrs((a) => [...a, { title: '', metric: 'NUMBER', startValue: 0, targetValue: 100, source: 'MANUAL' }])}>
                <Plus size={12} /> {wt('agile.addKr')}
              </button>
            )}
          </div>
        )}
      </div>
    </Dialog>
  );
}

function AddKrDialog({ objective, members, open, onClose }: { objective: Objective; members?: ProjectMember[]; open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const [kr, setKr] = useState<KrInput>({ title: '', metric: 'NUMBER', startValue: 0, targetValue: 100, source: 'MANUAL' });
  const m = useMutation({
    mutationFn: () => agileApi.addKr(objective.id, { ...kr, title: kr.title.trim() }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: agileKeys.okrAll }); onClose(); },
    onError: (e) => toast.error(workError(e, wt('agile.failed'))),
  });
  return (
    <Dialog open={open} onClose={onClose} title={wt('agile.addKr')} width={560}
      footer={<><button type="button" className="w-btn w-btn-ghost" onClick={onClose}>{wt('agile.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!kr.title.trim() || m.isPending} onClick={() => m.mutate()}>{wt('agile.save')}</button></>}>
      <KrFields kr={kr} members={members} onChange={setKr} />
    </Dialog>
  );
}

function CheckinDialog({ kr, open, onClose }: { kr: KeyResult; open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const [value, setValue] = useState(String(kr.currentValue));
  const [conf, setConf] = useState(kr.confidence ?? 7);
  const [note, setNote] = useState('');
  const m = useMutation({
    mutationFn: () => agileApi.checkin(kr.id, { value: kr.source === 'MANUAL' ? Number(value) : undefined, confidence: conf, note: note.trim() || null }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: agileKeys.okrAll }); toast.success(wt('agile.saved')); onClose(); },
    onError: (e) => toast.error(workError(e, wt('agile.failed'))),
  });
  return (
    <Dialog open={open} onClose={onClose} title={wt('agile.checkinTitle', { t: kr.title })} width={480}
      footer={<><button type="button" className="w-btn w-btn-ghost" onClick={onClose}>{wt('agile.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={m.isPending} onClick={() => m.mutate()} data-testid="okr-checkin-save">{wt('agile.checkin')}</button></>}>
      <div className="space-y-3">
        {kr.source === 'MANUAL' ? (
          <Field label={`${wt('agile.current')}${kr.unit ? ` (${kr.unit})` : ''}`} hint={kr.metric === 'BOOLEAN' ? '0 / 1' : `${kr.startValue} → ${kr.targetValue}`}>
            {kr.metric === 'BOOLEAN'
              ? <Select value={value} onChange={(e) => setValue(e.target.value)}><option value="0">✗ 0</option><option value="1">✓ {wt('agile.status_DONE')}</option></Select>
              : <input className="w-input" type="number" value={value} onChange={(e) => setValue(e.target.value)} />}
          </Field>
        ) : (
          <p className="text-[13px] text-[var(--w-text-2)]">{wt('agile.checkinAuto', { d: kr.linkSummary?.done ?? 0, t: kr.linkSummary?.total ?? 0, u: kr.linkSummary?.unit ?? '' })}</p>
        )}
        <Field label={`${wt('agile.confidence')}: ${conf}/10`} hint={wt('agile.confidenceHint')}>
          <input type="range" min={0} max={10} step={1} value={conf} onChange={(e) => setConf(Number(e.target.value))} className="w-full" aria-label={wt('agile.confidence')} />
        </Field>
        <Field label={wt('agile.note')}><textarea className="w-input min-h-[60px]" value={note} maxLength={2000} placeholder={wt('agile.notePh')} onChange={(e) => setNote(e.target.value)} /></Field>
        <p className="text-[12px] text-[var(--w-text-3)]">{wt('agile.checkinHint')}</p>
      </div>
    </Dialog>
  );
}

function LinksDialog({ kr, pid, sprints, open, onClose }: { kr: KeyResult; pid?: number; sprints: Array<{ id: number; name: string }>; open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const initial = kr.links.filter((l) => !l.missing && !l.hidden).map((l) => ({ kind: l.kind, number: l.number, sprintId: l.sprintId, projectId: l.projectId, label: l.kind === 'SPRINT' ? l.name : `${l.key} ${l.title}` }));
  const [links, setLinks] = useState(initial);
  const [kind, setKind] = useState<'ISSUE' | 'EPIC' | 'SPRINT'>('EPIC');
  const [num, setNum] = useState('');
  const [sprint, setSprint] = useState<number | ''>('');
  const m = useMutation({
    mutationFn: () => agileApi.setLinks(kr.id, links.map((l) => ({ kind: l.kind, number: l.number, sprintId: l.sprintId, projectId: l.projectId ?? pid }))),
    onSuccess: () => { qc.invalidateQueries({ queryKey: agileKeys.okrAll }); toast.success(wt('agile.saved')); onClose(); },
    onError: (e) => toast.error(workError(e, wt('agile.failed'))),
  });
  const add = () => {
    if (kind === 'SPRINT') { if (!sprint) return; setLinks((a) => [...a, { kind, sprintId: Number(sprint), number: undefined, projectId: pid, label: sprints.find((s) => s.id === sprint)?.name }]); return; }
    const n = Number(num.replace(/^\D+-?/, ''));
    if (!Number.isInteger(n) || n <= 0) return;
    setLinks((a) => [...a, { kind, number: n, sprintId: undefined, projectId: pid, label: `#${n}` }]);
    setNum('');
  };
  return (
    <Dialog open={open} onClose={onClose} title={wt('agile.linksTitle', { t: kr.title })} width={520}
      footer={<><button type="button" className="w-btn w-btn-ghost" onClick={onClose}>{wt('agile.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={m.isPending} onClick={() => m.mutate()}>{wt('agile.save')}</button></>}>
      <p className="mb-3 text-[12px] text-[var(--w-text-3)]">{wt('agile.linksHint')}</p>
      <ul className="mb-3 space-y-1">
        {!links.length && <li className="text-[13px] text-[var(--w-text-3)]">{wt('agile.noLinks')}</li>}
        {links.map((l, i) => (
          <li key={i} className="flex items-center gap-2 text-[13px]">
            <span className="rounded border border-[var(--w-border)] px-1.5 text-[11px] text-[var(--w-text-2)]">{wt(`agile.linkKind_${l.kind}` as WKey)}</span>
            <span className="min-w-0 flex-1 truncate">{l.label}</span>
            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('agile.delete')} onClick={() => setLinks((a) => a.filter((_, j) => j !== i))}><Trash2 size={12} /></button>
          </li>
        ))}
      </ul>
      {pid ? (
        <div className="flex flex-wrap items-end gap-2">
          <Select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)} aria-label={wt('agile.links')} className="w-[120px]">
            {(['EPIC', 'ISSUE', 'SPRINT'] as const).map((k) => <option key={k} value={k}>{wt(`agile.linkKind_${k}` as WKey)}</option>)}
          </Select>
          {kind === 'SPRINT'
            ? <Select value={sprint} onChange={(e) => setSprint(e.target.value ? Number(e.target.value) : '')} aria-label={wt('agile.sprint')} className="min-w-[160px] flex-1">
                <option value="">—</option>{sprints.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
            : <input className="w-input w-[140px]" value={num} placeholder={wt('agile.issueNumber')} aria-label={wt('agile.issueNumber')} onChange={(e) => setNum(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />}
          <button type="button" className="w-btn w-btn-sm" onClick={add}><Plus size={12} /> {wt('agile.addLink')}</button>
        </div>
      ) : null}
    </Dialog>
  );
}

function ScoreDialog({ objective, open, onClose }: { objective: Objective; open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const [scores, setScores] = useState<Record<number, number>>(() => Object.fromEntries(objective.keyResults.map((k) => [k.id, k.score ?? k.suggestedScore])));
  const [note, setNote] = useState(objective.scoreNote ?? '');
  const avg = objective.keyResults.length ? Math.round((objective.keyResults.reduce((s, k) => s + (scores[k.id] ?? 0), 0) / objective.keyResults.length) * 100) / 100 : 0;
  const m = useMutation({
    mutationFn: () => agileApi.score(objective.id, { krScores: objective.keyResults.map((k) => ({ id: k.id, score: scores[k.id] ?? 0 })), note: note.trim() || null }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: agileKeys.okrAll }); toast.success(wt('agile.saved')); onClose(); },
    onError: (e) => toast.error(workError(e, wt('agile.failed'))),
  });
  return (
    <Dialog open={open} onClose={onClose} title={wt('agile.scoreTitle', { t: objective.title })} width={560}
      footer={<><button type="button" className="w-btn w-btn-ghost" onClick={onClose}>{wt('agile.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={m.isPending || !objective.keyResults.length} onClick={() => m.mutate()}>{wt('agile.save')}</button></>}>
      <p className="mb-3 text-[12px] text-[var(--w-text-3)]">{wt('agile.scoreHint')}</p>
      <ul className="space-y-2">
        {objective.keyResults.map((k) => (
          <li key={k.id} className="grid grid-cols-[1fr_auto] items-center gap-3 text-[13px]">
            <span className="min-w-0"><span className="block truncate">{k.title}</span><span className="text-[11px] text-[var(--w-text-3)]">{wt('agile.progress')} {pct(k.progress)} · {wt('agile.suggested', { n: k.suggestedScore.toFixed(1) })}</span></span>
            <input className="w-input w-[84px]" type="number" min={0} max={1} step={0.1} value={scores[k.id] ?? 0} aria-label={`${wt('agile.score')} ${k.title}`}
              onChange={(e) => setScores((s) => ({ ...s, [k.id]: Math.max(0, Math.min(1, Number(e.target.value))) }))} />
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between border-t border-[var(--w-border)] pt-3 text-[13px]">
        <span>{wt('agile.objScore')} <span className="text-[var(--w-text-3)]">({wt('agile.objScoreAuto')})</span></span>
        <span className="font-semibold tabular">{avg.toFixed(2)}</span>
      </div>
      <Field label={wt('agile.scoreNote')}><textarea className="w-input mt-1 min-h-[56px]" value={note} maxLength={1000} onChange={(e) => setNote(e.target.value)} /></Field>
    </Dialog>
  );
}

// ─── Thẻ objective ───────────────────────────────────────────────

function KrRow({ kr, onCheckin, onLinks, canEdit, closed }: { kr: KeyResult; onCheckin: () => void; onLinks: () => void; canEdit: boolean; closed: boolean }) {
  const { fmtDate } = useWT();
  const last = kr.checkins[0];
  const u = kr.unit === '%' ? '%' : kr.unit ? ` ${kr.unit}` : '';
  const value = kr.metric === 'BOOLEAN' ? (kr.currentValue >= 1 ? '✓' : '—') : `${kr.currentValue}${u} / ${kr.targetValue}${u}`;
  return (
    <li className="grid grid-cols-1 gap-2 py-2.5 sm:grid-cols-[minmax(0,1fr)_200px_auto] sm:items-center" data-testid="okr-kr">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-[13px]">
          <Target size={13} className="shrink-0 text-[var(--w-text-3)]" />
          <span className="truncate">{kr.title}</span>
          {kr.owner && <UserAvatar user={kr.owner} size={18} />}
        </div>
        <div className="mt-0.5 pl-5 text-[11px] text-[var(--w-text-3)]">
          {kr.source === 'MANUAL' ? value : `${wt(`agile.source_${kr.source}` as WKey)} · ${kr.linkSummary?.done ?? 0}/${kr.linkSummary?.total ?? 0}`}
          {' · '}{last ? wt('agile.lastCheckin', { d: fmtDate(last.at) }) : wt('agile.noCheckin')}
          {kr.confidence !== null && <> · {wt('agile.confidenceOf', { n: kr.confidence })}</>}
          {kr.score !== null && <> · {wt('agile.scored', { n: kr.score.toFixed(1) })}</>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Bar01 value={kr.progress} label={`${kr.title} ${pct(kr.progress)}`} />
        <span className="w-10 shrink-0 text-right text-[12px] tabular">{pct(kr.progress)}</span>
      </div>
      <div className="flex justify-end gap-1">
        {kr.source !== 'MANUAL' && canEdit && !closed && <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={onLinks}><Link2 size={12} /> {wt('agile.links')}</button>}
        {kr.canCheckin && !closed && <button type="button" className="w-btn w-btn-sm" onClick={onCheckin} data-testid="okr-checkin"><TrendingUp size={12} /> {wt('agile.checkin')}</button>}
      </div>
    </li>
  );
}

function ObjectiveCard({ o, view, scope, members, sprints }: { o: Objective; view: OkrView; scope: { pid?: number; wid: number }; members?: ProjectMember[]; sprints: Array<{ id: number; name: string }> }) {
  const qc = useQueryClient();
  const closed = view.cycle?.status === 'CLOSED';
  const [dialog, setDialog] = useState<null | { t: 'checkin' | 'links'; kr: KeyResult } | { t: 'edit' | 'addkr' | 'score' }>(null);
  const del = useMutation({
    mutationFn: () => agileApi.deleteObjective(o.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: agileKeys.okrAll }),
    onError: (e) => toast.error(workError(e, wt('agile.failed'))),
  });
  return (
    <section className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-4" data-testid="okr-objective">
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[15px] font-semibold">{o.title}</h3>
            <StatusChip s={o.status} />
            {o.score !== null && <span className="rounded-full bg-[var(--w-sunken)] px-2 py-0.5 text-[11px] font-semibold tabular">{wt('agile.scored', { n: o.score.toFixed(2) })}</span>}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-[12px] text-[var(--w-text-3)]">
            {scope.pid ? null : <span>{o.project ? `${o.project.key} · ${o.project.name}` : wt('agile.workspaceLevel')}</span>}
            {o.parent && <span>{wt('agile.alignedTo', { t: o.parent.title })}</span>}
            {o.owner && <span className="inline-flex items-center gap-1"><UserAvatar user={o.owner} size={16} />{o.owner.displayName || o.owner.fullName || o.owner.username}</span>}
          </div>
          {o.description && <p className="mt-1 text-[13px] text-[var(--w-text-2)]">{o.description}</p>}
        </div>
        <div className="w-full sm:w-[220px]">
          <div className="mb-1 flex justify-between text-[12px]"><span className="text-[var(--w-text-3)]">{wt('agile.progress')}</span><span className="font-semibold tabular">{pct(o.progress)}</span></div>
          <Bar01 value={o.progress} expected={o.expected} label={`${wt('agile.progress')} ${pct(o.progress)}, ${wt('agile.expected')} ${pct(o.expected)}`} />
          <div className="mt-1 text-[11px] text-[var(--w-text-3)]">{wt('agile.expected')} {pct(o.expected)}</div>
        </div>
      </div>
      <ul className="mt-2 divide-y divide-[var(--w-border)] border-t border-[var(--w-border)]">
        {o.keyResults.map((k) => <KrRow key={k.id} kr={k} canEdit={o.canEdit} closed={closed} onCheckin={() => setDialog({ t: 'checkin', kr: k })} onLinks={() => setDialog({ t: 'links', kr: k })} />)}
      </ul>
      {o.canEdit && (
        <div className="mt-2 flex flex-wrap gap-1 border-t border-[var(--w-border)] pt-2">
          {!closed && o.keyResults.length < 10 && <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => setDialog({ t: 'addkr' })}><Plus size={12} /> {wt('agile.addKr')}</button>}
          {!closed && <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => setDialog({ t: 'edit' })}><Pencil size={12} /> {wt('agile.edit')}</button>}
          <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => setDialog({ t: 'score' })} data-testid="okr-score"><Award size={12} /> {wt('agile.score')}</button>
          <button type="button" className="w-btn w-btn-ghost w-btn-sm ml-auto text-[var(--w-red-text)]" onClick={() => { if (window.confirm(wt('agile.deleteObjConfirm'))) del.mutate(); }}><Trash2 size={12} /> {wt('agile.delete')}</button>
        </div>
      )}
      {dialog?.t === 'checkin' && <CheckinDialog kr={dialog.kr} open onClose={() => setDialog(null)} />}
      {dialog?.t === 'links' && <LinksDialog kr={dialog.kr} pid={scope.pid} sprints={sprints} open onClose={() => setDialog(null)} />}
      {dialog?.t === 'edit' && <ObjectiveDialog view={view} scope={scope} members={members} editing={o} open onClose={() => setDialog(null)} />}
      {dialog?.t === 'addkr' && <AddKrDialog objective={o} members={members} open onClose={() => setDialog(null)} />}
      {dialog?.t === 'score' && <ScoreDialog objective={o} open onClose={() => setDialog(null)} />}
    </section>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────

function Dashboard({ view }: { view: OkrView }) {
  const d = view.dashboard;
  const { fmtShortDate } = useWT();
  const statusRows = (['ON_TRACK', 'AT_RISK', 'OFF_TRACK', 'NOT_STARTED', 'DONE', 'SCORED'] as OkrStatus[])
    .map((s) => ({ status: wt(`agile.status_${s}` as WKey), key: s, count: d.statusCounts[s] ?? 0 })).filter((r) => r.count > 0);
  const weeks = d.weeks.map((w) => ({ ...w, label: fmtShortDate(w.week) }));
  return (
    <div className="space-y-4">
      <KpiRow label={wt('agile.tabDashboard')}>
        <KpiTile label={wt('agile.dashObjectives')} value={d.objectives} />
        <KpiTile label={wt('agile.dashKrs')} value={d.keyResults} />
        <KpiTile label={wt('agile.dashProgress')} value={`${d.avgProgress}%`} tone="accent" />
        <KpiTile label={wt('agile.dashConfidence')} value={d.avgConfidence === null ? '—' : `${d.avgConfidence}/10`} tone={d.avgConfidence !== null && d.avgConfidence <= 4 ? 'orange' : 'muted'} />
        <KpiTile label={wt('agile.dashScore')} value={d.avgScore === null ? '—' : d.avgScore.toFixed(2)} />
      </KpiRow>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartFrame
          title={wt('agile.chartProgress')} description={wt('agile.chartProgressDesc')} status={weeks.some((w) => w.actual !== null) ? 'ready' : 'empty'} emptyText={wt('agile.chartProgressEmpty')}
          series={[{ key: 'actual', label: wt('agile.actual'), color: SERIES.completed }, { key: 'expected', label: wt('agile.plan'), color: SERIES.guideline, dashed: true }]}
          rows={weeks} columns={[{ key: 'week', label: wt('agile.week') }, { key: 'actual', label: wt('agile.actual') }, { key: 'expected', label: wt('agile.plan') }]}
          summary={weeks.length ? `${wt('agile.actual')} ${weeks.at(-1)?.actual ?? 0}% · ${wt('agile.plan')} ${weeks.at(-1)?.expected ?? 0}%` : undefined} testId="okr-chart-progress"
        >
          {(hidden) => (
            <div style={{ height: 240 }} className="w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeks} margin={{ top: 6, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid stroke={GRID} vertical={false} />
                  <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: 'var(--w-border-strong)' }} minTickGap={16} />
                  <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={AXIS_TICK} tickLine={false} axisLine={false} width={44} unit="%" />
                  <Tooltip contentStyle={{ background: 'var(--w-raised)', border: '1px solid var(--w-border-strong)', fontSize: 12 }} />
                  {!hidden.has('expected') && <Line type="linear" dataKey="expected" name={wt('agile.plan')} stroke={SERIES.guideline} strokeDasharray="5 4" dot={false} isAnimationActive={false} />}
                  {!hidden.has('actual') && <Line type="monotone" dataKey="actual" name={wt('agile.actual')} stroke={SERIES.completed} strokeWidth={2} connectNulls isAnimationActive={false} />}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartFrame>
        <ChartFrame
          title={wt('agile.chartStatus')} description={wt('agile.chartStatusDesc')} status={statusRows.length ? 'ready' : 'empty'} emptyText={wt('agile.chartStatusEmpty')}
          rows={statusRows} columns={[{ key: 'status', label: wt('agile.colStatus') }, { key: 'count', label: wt('agile.count') }]}
          summary={statusRows.map((r) => `${r.status} ${r.count}`).join(', ')} testId="okr-chart-status"
        >
          {() => (
            <div style={{ height: 240 }} className="w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusRows} layout="vertical" margin={{ top: 6, right: 16, bottom: 0, left: 8 }}>
                  <CartesianGrid stroke={GRID} horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="status" tick={AXIS_TICK} tickLine={false} axisLine={false} width={110} />
                  <Tooltip cursor={{ fill: 'var(--w-hover)' }} contentStyle={{ background: 'var(--w-raised)', border: '1px solid var(--w-border-strong)', fontSize: 12 }} />
                  <Bar dataKey="count" name={wt('agile.count')} fill={SERIES.completed} radius={[0, 4, 4, 0]} barSize={22} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartFrame>
      </div>
    </div>
  );
}

// ─── Khung chính ─────────────────────────────────────────────────

export default function OkrBoard({ scope, members, sprints = [] }: { scope: { pid?: number; wid: number }; members?: ProjectMember[]; sprints?: Array<{ id: number; name: string }> }) {
  const qc = useQueryClient();
  const [cycleId, setCycleId] = useState<number | null>(null);
  const [tab, setTab] = useState<'objectives' | 'dashboard'>('objectives');
  const [dlg, setDlg] = useState<null | 'cycle' | 'objective'>(null);
  const key = scope.pid ? agileKeys.okrProject(scope.pid, cycleId) : agileKeys.okrWorkspace(scope.wid, cycleId);
  const q = useQuery({ queryKey: key, queryFn: () => (scope.pid ? agileApi.projectOkrs(scope.pid, cycleId) : agileApi.workspaceOkrs(scope.wid, cycleId)), staleTime: 10_000 });
  const v = q.data;
  const closeCycle = useMutation({
    mutationFn: (status: 'ACTIVE' | 'CLOSED') => agileApi.updateCycle(scope.wid, v!.cycle!.id, { status }),
    onSuccess: (r, status) => { qc.invalidateQueries({ queryKey: agileKeys.okrAll }); if (status === 'CLOSED') toast.success(wt('agile.closedToast', { n: r.autoScored })); },
    onError: (e) => toast.error(workError(e, wt('agile.failed'))),
  });
  const grouped = useMemo(() => {
    if (!v || scope.pid) return null;
    const ws = v.objectives.filter((o) => !o.projectId);
    const byProject = new Map<string, Objective[]>();
    for (const o of v.objectives.filter((x) => x.projectId)) byProject.set(o.project?.key ?? '', [...(byProject.get(o.project?.key ?? '') ?? []), o]);
    return { ws, byProject: [...byProject.entries()] };
  }, [v, scope.pid]);

  if (q.isLoading) return <PageLoading />;
  if (!v) return <EmptyState title={wt('agile.loadFailed')} body={workError(q.error)} />;
  const closed = v.cycle?.status === 'CLOSED';
  const card = (o: Objective) => <ObjectiveCard key={o.id} o={o} view={v} scope={scope} members={members} sprints={sprints} />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {v.cycles.length > 0 && (
          <Select value={v.cycle?.id ?? ''} onChange={(e) => setCycleId(Number(e.target.value) || null)} aria-label={wt('agile.cycleAria')} className="w-[300px] max-w-full" data-testid="okr-cycle">
            {v.cycles.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.startDate} → {c.endDate}){c.status === 'CLOSED' ? ` · ${wt('agile.closedBadge')}` : ''}</option>)}
          </Select>
        )}
        {closed && <span className="rounded-full bg-[var(--w-sunken)] px-2 py-0.5 text-[11px] font-medium">{wt('agile.closedBadge')}</span>}
        <div className="flex gap-1" role="tablist" aria-label={wt('agile.okrTitle')}>
          {(['objectives', 'dashboard'] as const).map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
              className={cn('rounded-[6px] px-2.5 py-1 text-[13px] font-medium', tab === t ? 'bg-[var(--w-hover)] text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]')} data-testid={`okr-tab-${t}`}>
              {t === 'objectives' ? wt('agile.tabObjectives') : wt('agile.tabDashboard')}
            </button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap gap-1.5">
          {v.canManageCycle && v.cycle && (
            <button type="button" className="w-btn w-btn-ghost w-btn-sm" disabled={closeCycle.isPending}
              onClick={() => { if (closed || window.confirm(wt('agile.closeConfirm'))) closeCycle.mutate(closed ? 'ACTIVE' : 'CLOSED'); }}>
              {closed ? wt('agile.reopenCycle') : wt('agile.closeCycle')}
            </button>
          )}
          {v.canCreateCycle && <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => setDlg('cycle')} data-testid="okr-new-cycle"><Plus size={12} /> {wt('agile.newCycle')}</button>}
          {v.canEdit && v.cycle && <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setDlg('objective')} data-testid="okr-new-objective"><Plus size={12} /> {wt('agile.newObjective')}</button>}
        </div>
      </div>

      {!v.cycle ? (
        <EmptyState title={wt('agile.noCycle')} body={wt('agile.noCycleBody')} />
      ) : tab === 'dashboard' ? (
        <Dashboard view={v} />
      ) : !v.objectives.length ? (
        <EmptyState title={wt('agile.noObjectives')} body={wt('agile.noObjectivesBody')} />
      ) : grouped ? (
        <div className="space-y-6">
          {grouped.ws.length > 0 && <div className="space-y-3"><h2 className="text-[13px] font-semibold text-[var(--w-text-2)]">{wt('agile.workspaceLevel')}</h2>{grouped.ws.map(card)}</div>}
          {grouped.byProject.map(([k, list]) => (
            <div key={k} className="space-y-3"><h2 className="text-[13px] font-semibold text-[var(--w-text-2)]">{k} · {list[0].project?.name}</h2>{list.map(card)}</div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">{v.objectives.map(card)}</div>
      )}

      {dlg === 'cycle' && <CycleDialog wid={scope.wid} open onClose={() => setDlg(null)} onCreated={(id) => { setCycleId(id); qc.invalidateQueries({ queryKey: agileKeys.okrAll }); }} />}
      {dlg === 'objective' && <ObjectiveDialog view={v} scope={scope} members={members} editing={null} open onClose={() => setDlg(null)} />}
    </div>
  );
}

