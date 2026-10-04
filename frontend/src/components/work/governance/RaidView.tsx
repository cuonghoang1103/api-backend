'use client';

/**
 * SỔ RAID — /work/<ws>/<KEY>/raid (đợt S3b, mô-đun raid): Risks · Assumptions · Issues ·
 * Dependencies. Thẻ theo loại, ma trận 5×5 xác suất × ảnh hưởng (bấm ô ⇒ lọc), nhắc
 * "review due", hộp chi tiết (sửa + liên kết + lịch sử). `?item=<n>` mở thẳng một dòng
 * (link trong lời nhắc xem lại). Thang điểm theo so-dang-ky-rui-ro.md: ≥15 cao · 8–14 TB · ≤7 thấp.
 */

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlarmClock, FileDown, Link2, Plus, Save, ShieldAlert, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError, workStudioApi, workStudioKeys, type ProjectConfig } from '@/lib/work-api';
import {
  RAID_LABEL, RAID_RESPONSE_LABEL, RAID_STATUS_LABEL, RAID_TYPES, govApi, govKeys,
  type RaidDetail, type RaidItem, type RaidPatch, type RaidResponse, type RaidType,
} from '@/lib/work-s3b-api';
import { Dialog, EmptyState, Field, PageLoading, Spinner, StatusBadge, UserAvatar, formatDate, relativeTime } from '../ui';
import { ConfirmDialog, Select } from '../settings/shared';
import { Pill } from '../studio/shared';
import { LEVEL_COLOR, PersonSelect, RaidStatusPill, ScoreBadge, levelOf, useGovInvalidate } from './shared';

const STATUSES: Record<RaidType, string[]> = {
  RISK: ['OPEN', 'MONITORING', 'MITIGATED', 'CLOSED'], ISSUE: ['OPEN', 'MONITORING', 'MITIGATED', 'CLOSED'],
  DEPENDENCY: ['OPEN', 'MONITORING', 'MITIGATED', 'CLOSED'], ASSUMPTION: ['UNVALIDATED', 'VALIDATED', 'INVALID'],
};
const P_LABEL = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost certain'];
const I_LABEL = ['Negligible', 'Minor', 'Moderate', 'Major', 'Severe'];

// ─── Ma trận ─────────────────────────────────────────────────────

function Matrix({ m, cell, onCell }: { m: number[][]; cell: { p: number; i: number } | null; onCell: (c: { p: number; i: number } | null) => void }) {
  return (
    <div className="min-w-0" data-testid="raid-matrix">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="w-section-title">Risk matrix</h2>
        {cell && <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => onCell(null)}><X size={12} /> Clear</button>}
      </div>
      <div className="flex gap-1.5">
        <div className="flex w-4 shrink-0 items-center justify-center">
          <span className="-rotate-90 whitespace-nowrap text-[11px] font-medium text-[var(--w-text-3)]">Probability →</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-5 gap-1" role="grid" aria-label="Probability by impact">
            {[5, 4, 3, 2, 1].map((p) => [1, 2, 3, 4, 5].map((i) => {
              const n = m[p - 1]?.[i - 1] ?? 0;
              const lv = levelOf(p * i)!;
              const on = cell?.p === p && cell?.i === i;
              return (
                <button
                  key={`${p}-${i}`}
                  type="button"
                  role="gridcell"
                  aria-label={`Probability ${p} (${P_LABEL[p - 1]}), impact ${i} (${I_LABEL[i - 1]}): ${n} open risk${n === 1 ? '' : 's'}`}
                  aria-pressed={on}
                  onClick={() => onCell(on ? null : { p, i })}
                  data-testid={`raid-cell-${p}-${i}`}
                  className={cn('relative flex aspect-square min-h-[34px] items-center justify-center rounded-[6px] text-[13px] font-semibold tabular-nums transition-[box-shadow]', on && 'ring-2 ring-[var(--w-accent)] ring-offset-1 ring-offset-[var(--w-panel)]')}
                  style={{
                    background: `color-mix(in srgb, ${LEVEL_COLOR[lv]} ${n ? 30 : 10}%, var(--w-panel))`,
                    color: n ? 'var(--w-text)' : 'var(--w-text-3)',
                  }}
                >
                  {n || ''}
                  <span className="absolute left-1 top-0.5 text-[9px] font-normal opacity-60">{p * i}</span>
                </button>
              );
            }))}
          </div>
          <div className="mt-1 text-center text-[11px] font-medium text-[var(--w-text-3)]">Impact →</div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] text-[var(--w-text-3)]">
        {(['HIGH', 'MEDIUM', 'LOW'] as const).map((l) => (
          <span key={l} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: `color-mix(in srgb, ${LEVEL_COLOR[l]} 45%, var(--w-panel))` }} />{l === 'HIGH' ? 'High ≥ 15' : l === 'MEDIUM' ? 'Medium 8–14' : 'Low ≤ 7'}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Form ────────────────────────────────────────────────────────

type Form = { type: RaidType; title: string; description: string; category: string; ownerId: number | null; status: string; probability: number | null; impact: number | null; response: RaidResponse | null; mitigation: string; trigger: string; reviewDate: string };
const emptyForm = (type: RaidType): Form => ({ type, title: '', description: '', category: '', ownerId: null, status: type === 'ASSUMPTION' ? 'UNVALIDATED' : 'OPEN', probability: null, impact: null, response: null, mitigation: '', trigger: '', reviewDate: '' });
const formOf = (r: RaidDetail): Form => ({
  type: r.type, title: r.title, description: r.description ?? '', category: r.category ?? '', ownerId: r.owner?.id ?? null, status: r.status,
  probability: r.probability, impact: r.impact, response: r.response, mitigation: r.mitigation ?? '', trigger: r.trigger ?? '', reviewDate: r.reviewDate ?? '',
});
const toPatch = (f: Form): RaidPatch & { type: RaidType; title: string } => ({
  type: f.type, title: f.title.trim(), description: f.description.trim() || null, category: f.category.trim() || null, ownerId: f.ownerId, status: f.status,
  probability: f.probability, impact: f.impact, response: f.response, mitigation: f.mitigation.trim() || null, trigger: f.trigger.trim() || null, reviewDate: f.reviewDate || null,
});

function RaidForm({ config, f, set, ro, creating }: { config: ProjectConfig; f: Form; set: (p: Partial<Form>) => void; ro: boolean; creating?: boolean }) {
  const scored = f.type === 'RISK' || f.type === 'ISSUE' || f.type === 'DEPENDENCY';
  const score = f.probability && f.impact ? f.probability * f.impact : null;
  return (
    <div>
      <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[160px_1fr]">
        <Field label="Type">
          <Select aria-label="Type" value={f.type} disabled={ro || !creating} onChange={(e) => { const t = e.target.value as RaidType; set({ type: t, status: STATUSES[t].includes(f.status) ? f.status : STATUSES[t][0] }); }}>
            {RAID_TYPES.map((t) => <option key={t} value={t}>{RAID_LABEL[t].one}</option>)}
          </Select>
        </Field>
        <Field label="Title">
          <input className="w-input" value={f.title} maxLength={255} disabled={ro} autoFocus={creating} onChange={(e) => set({ title: e.target.value })} placeholder={f.type === 'RISK' ? 'If … then …' : f.type === 'ASSUMPTION' ? 'We assume that …' : f.type === 'DEPENDENCY' ? 'We depend on …' : 'What is wrong now'} data-testid="raid-title" />
        </Field>
      </div>
      <Field label="Description">
        <textarea className="w-input" rows={2} maxLength={20000} disabled={ro} value={f.description} onChange={(e) => set({ description: e.target.value })} />
      </Field>
      <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-3">
        <Field label="Status">
          <Select aria-label="Status" value={f.status} disabled={ro} onChange={(e) => set({ status: e.target.value })}>
            {STATUSES[f.type].map((s) => <option key={s} value={s}>{RAID_STATUS_LABEL[s]}</option>)}
          </Select>
        </Field>
        <Field label="Owner"><PersonSelect config={config} value={f.ownerId} onChange={(v) => set({ ownerId: v })} label="Owner" staffOnly empty={creating ? 'Me' : 'Nobody'} disabled={ro} /></Field>
        <Field label="Category"><input className="w-input" value={f.category} maxLength={60} disabled={ro} onChange={(e) => set({ category: e.target.value })} placeholder="Scope, Schedule, Vendor…" /></Field>
      </div>
      {scored && (
        <div className="grid grid-cols-2 gap-x-3 sm:grid-cols-[1fr_1fr_auto]">
          <Field label="Probability (1–5)">
            <Select aria-label="Probability" value={f.probability ?? ''} disabled={ro} onChange={(e) => set({ probability: e.target.value ? Number(e.target.value) : null })} data-testid="raid-p">
              <option value="">Not scored</option>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} · {P_LABEL[n - 1]}</option>)}
            </Select>
          </Field>
          <Field label="Impact (1–5)">
            <Select aria-label="Impact" value={f.impact ?? ''} disabled={ro} onChange={(e) => set({ impact: e.target.value ? Number(e.target.value) : null })} data-testid="raid-i">
              <option value="">Not scored</option>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} · {I_LABEL[n - 1]}</option>)}
            </Select>
          </Field>
          <Field label="Score"><div className="flex h-9 items-center"><ScoreBadge score={score} /></div></Field>
        </div>
      )}
      {f.type === 'RISK' && (
        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[180px_1fr]">
          <Field label="Response">
            <Select aria-label="Response" value={f.response ?? ''} disabled={ro} onChange={(e) => set({ response: (e.target.value || null) as RaidResponse | null })}>
              <option value="">Not decided</option>
              {(Object.keys(RAID_RESPONSE_LABEL) as RaidResponse[]).map((r) => <option key={r} value={r}>{RAID_RESPONSE_LABEL[r]}</option>)}
            </Select>
          </Field>
          <Field label="Early warning (trigger)"><input className="w-input" value={f.trigger} maxLength={5000} disabled={ro} onChange={(e) => set({ trigger: e.target.value })} placeholder="What tells you it is happening" /></Field>
        </div>
      )}
      <Field label={f.type === 'RISK' ? 'Mitigation plan' : f.type === 'ASSUMPTION' ? 'How to validate' : 'Action plan'}>
        <textarea className="w-input" rows={2} maxLength={20000} disabled={ro} value={f.mitigation} onChange={(e) => set({ mitigation: e.target.value })} />
      </Field>
      <Field label="Review by" hint="The owner gets a reminder on this day">
        <input type="date" className="w-input !w-[180px]" value={f.reviewDate} disabled={ro} onChange={(e) => set({ reviewDate: e.target.value })} data-testid="raid-review" />
      </Field>
    </div>
  );
}

export function NewRaidDialog({ config, open, onClose, type }: { config: ProjectConfig; open: boolean; onClose: () => void; type: RaidType }) {
  const invalidate = useGovInvalidate(config.id);
  const [f, setF] = useState<Form>(() => emptyForm(type));
  useEffect(() => { if (open) setF(emptyForm(type)); }, [open, type]);
  const create = useMutation({
    mutationFn: () => govApi.createRaid(config.id, toPatch(f)),
    onSuccess: (r) => { toast.success(`${r.key} added`); invalidate(); onClose(); },
    onError: (err) => toast.error(workError(err, 'Could not add the item')),
  });
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Add ${RAID_LABEL[f.type].one.toLowerCase()}`}
      width={640}
      footer={<>
        <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!f.title.trim() || create.isPending} onClick={() => create.mutate()} data-testid="raid-create">{create.isPending ? <Spinner size={12} /> : <Plus size={13} />} Add</button>
      </>}
    >
      <RaidForm config={config} f={f} set={(p) => setF((x) => ({ ...x, ...p }))} ro={false} creating />
    </Dialog>
  );
}

function RaidItemDialog({ config, num, onClose }: { config: ProjectConfig; num: number | null; onClose: () => void }) {
  const pid = config.id;
  const invalidate = useGovInvalidate(pid);
  const q = useQuery({ queryKey: govKeys.raidItem(pid, num ?? 0), queryFn: () => govApi.raidItem(pid, num!), enabled: !!num });
  const r = q.data;
  const [f, setF] = useState<Form | null>(null);
  useEffect(() => { if (r) setF(formOf(r)); }, [r]);
  const [linkKind, setLinkKind] = useState<'issue' | 'cr' | 'stage'>('issue');
  const [linkVal, setLinkVal] = useState('');
  const [confirmDel, setConfirmDel] = useState(false);
  const stages = useQuery({ queryKey: workStudioKeys.stages(pid), queryFn: () => workStudioApi.stages(pid), enabled: !!num && !!config.modules?.stages && linkKind === 'stage' });
  const save = useMutation({
    mutationFn: () => govApi.updateRaid(pid, num!, { ...toPatch(f!), version: r!.version }),
    onSuccess: () => { toast.success('Saved'); invalidate(); },
    onError: (err) => toast.error(workError(err, 'Could not save')),
  });
  const link = useMutation({
    mutationFn: () => govApi.linkRaid(pid, num!, linkKind === 'issue' ? { issueNumber: Number(linkVal.replace(/^[A-Z0-9]+-/i, '')) } : linkKind === 'cr' ? { crNumber: Number(linkVal.replace(/^CR-/i, '')) } : { stageId: Number(linkVal) }),
    onSuccess: () => { setLinkVal(''); invalidate(); },
    onError: (err) => toast.error(workError(err, 'Could not link')),
  });
  const unlink = useMutation({ mutationFn: (id: number) => govApi.unlinkRaid(pid, num!, id), onSuccess: () => invalidate(), onError: (err) => toast.error(workError(err)) });
  const del = useMutation({
    mutationFn: () => govApi.deleteRaid(pid, num!),
    onSuccess: () => { toast.success('Deleted'); setConfirmDel(false); invalidate(); onClose(); },
    onError: (err) => toast.error(workError(err, 'Could not delete')),
  });
  const dirty = !!(r && f && JSON.stringify(f) !== JSON.stringify(formOf(r)));
  const base = `/work/${config.workspace.slug}/${config.key}`;
  return (
    <Dialog
      open={!!num}
      onClose={onClose}
      width={720}
      title={r ? <span className="flex min-w-0 items-center gap-2"><span className="font-mono text-[13px] text-[var(--w-accent-text)]">{r.key}</span><span className="truncate">{r.title}</span></span> : 'Loading…'}
      footer={r?.canEdit ? <>
        {r.canDelete && <button type="button" className="w-btn w-btn-ghost w-btn-danger mr-auto" onClick={() => setConfirmDel(true)}><Trash2 size={13} /> Delete</button>}
        <button type="button" className="w-btn" onClick={onClose}>Close</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!dirty || !f?.title.trim() || save.isPending} onClick={() => save.mutate()} data-testid="raid-save">{save.isPending ? <Spinner size={12} /> : <Save size={13} />} Save</button>
      </> : undefined}
    >
      {q.isLoading || !f ? <PageLoading rows={4} /> : q.error || !r ? <EmptyState title="Not found" body={workError(q.error)} /> : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-[var(--w-text-3)]">
            <RaidStatusPill status={r.status} />
            {r.score !== null && <ScoreBadge score={r.score} />}
            {r.reviewDue && <Pill tone="orange">Review due</Pill>}
            <span>Added by {userName(r.createdBy)} {relativeTime(r.createdAt)}</span>
          </div>
          <RaidForm config={config} f={f} set={(p) => setF((x) => (x ? { ...x, ...p } : x))} ro={!r.canEdit} />
          <section>
            <h3 className="w-section-title mb-2">Linked</h3>
            {r.links.length ? (
              <ul className="mb-2 divide-y divide-[var(--w-border)] rounded-[6px] border border-[var(--w-border)]">
                {r.links.map((l) => (
                  <li key={l.id} className="flex min-w-0 items-center gap-2 px-3 py-2 text-[13px]">
                    {l.issue && <><Link href={`${base}/issue/${l.issue.number}`} className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)] hover:underline">{l.issue.key}</Link><span className="min-w-0 flex-1 truncate">{l.issue.title}</span><StatusBadge status={l.issue.status} /></>}
                    {l.changeRequest && <><Link href={`${base}/changes/${l.changeRequest.number}`} className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)] hover:underline">{l.changeRequest.key}</Link><span className="min-w-0 flex-1 truncate">{l.changeRequest.title}</span></>}
                    {l.stage && <><span className="shrink-0 text-[12px] text-[var(--w-text-3)]">Stage</span><span className="min-w-0 flex-1 truncate">{l.stage.n}. {l.stage.name}</span></>}
                    {r.canEdit && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label="Remove link" onClick={() => unlink.mutate(l.id)}><X size={13} /></button>}
                  </li>
                ))}
              </ul>
            ) : <p className="mb-2 text-[13px] text-[var(--w-text-3)]">Not linked to anything yet.</p>}
            {r.canEdit && (
              <div className="flex flex-wrap items-center gap-2">
                <Select aria-label="Link type" value={linkKind} onChange={(e) => { setLinkKind(e.target.value as typeof linkKind); setLinkVal(''); }} className="!w-auto">
                  <option value="issue">Issue</option>
                  {config.modules?.changeRequests && <option value="cr">Change request</option>}
                  {config.modules?.stages && <option value="stage">Stage</option>}
                </Select>
                {linkKind === 'stage' ? (
                  <Select aria-label="Stage" value={linkVal} onChange={(e) => setLinkVal(e.target.value)} className="!w-auto max-w-full">
                    <option value="">Choose a stage</option>
                    {(stages.data ?? []).map((s) => <option key={s.id} value={s.id}>{s.n}. {s.name}</option>)}
                  </Select>
                ) : <input className="w-input !w-[150px]" value={linkVal} onChange={(e) => setLinkVal(e.target.value)} placeholder={linkKind === 'cr' ? 'CR-3' : `${config.key}-12`} aria-label="Key" />}
                <button type="button" className="w-btn w-btn-sm" disabled={!linkVal || link.isPending} onClick={() => link.mutate()}><Link2 size={13} /> Link</button>
              </div>
            )}
          </section>
          <section>
            <h3 className="w-section-title mb-2">History</h3>
            <ol className="space-y-1.5 text-[12.5px]" data-testid="raid-history">
              {r.history.map((h) => (
                <li key={h.id} className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 text-[var(--w-text-2)]">
                  <span className="font-medium text-[var(--w-text)]">{userName(h.actor)}</span>
                  {h.field === 'created' ? <span>added it ({h.toValue})</span>
                    : h.field === 'link' ? <span>linked {h.toValue}</span>
                      : h.field === 'unlink' ? <span>removed a link</span>
                        : <span className="min-w-0 [overflow-wrap:anywhere]">changed <b className="font-medium">{h.field}</b>{h.fromValue ? <> from “{RAID_STATUS_LABEL[h.fromValue] ?? h.fromValue}”</> : null} to “{h.toValue ? (RAID_STATUS_LABEL[h.toValue] ?? h.toValue) : 'empty'}”</span>}
                  <span className="text-[var(--w-text-3)]">· {relativeTime(h.createdAt)}</span>
                </li>
              ))}
            </ol>
          </section>
          <ConfirmDialog open={confirmDel} onClose={() => setConfirmDel(false)} title={`Delete ${r.key}?`} body="It disappears from the RAID log and its links are removed." confirmLabel="Delete" pending={del.isPending} onConfirm={() => del.mutate()} />
        </div>
      )}
    </Dialog>
  );
}

// ─── Trang ───────────────────────────────────────────────────────

export default function RaidView({ config }: { config: ProjectConfig }) {
  const pid = config.id;
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const tab = (RAID_TYPES as string[]).includes(sp?.get('type') ?? '') ? (sp!.get('type') as RaidType) : 'RISK';
  const item = Number(sp?.get('item')) || null;
  const setParams = useCallback((patch: Record<string, string | null>) => {
    const next = new URLSearchParams(sp?.toString() ?? '');
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    const s = next.toString();
    router.replace(s ? `${pathname}?${s}` : pathname!, { scroll: false });
  }, [sp, pathname, router]);
  const [cell, setCell] = useState<{ p: number; i: number } | null>(null);
  const [dueOnly, setDueOnly] = useState(false);
  const [showClosed, setShowClosed] = useState(false);
  const [adding, setAdding] = useState(false);
  const invalidate = useGovInvalidate(pid);
  const q = useQuery({ queryKey: govKeys.raid(pid), queryFn: () => govApi.raid(pid) });
  const starter = useMutation({
    mutationFn: () => govApi.starterRisks(pid),
    onSuccess: (r) => { toast.success(r.added ? `Added ${r.added} starter risk${r.added === 1 ? '' : 's'} — score them` : 'The starter risks are already in your log'); invalidate(); },
    onError: (err) => toast.error(workError(err)),
  });
  const items = useMemo(() => (q.data?.items ?? []).filter((r) => r.type === tab
    && (showClosed || !r.closed || !!cell)
    && (!cell || (r.probability === cell.p && r.impact === cell.i))
    && (!dueOnly || r.reviewDue))
    .sort((a, b) => Number(a.closed) - Number(b.closed) || (b.score ?? -1) - (a.score ?? -1) || b.number - a.number), [q.data, tab, cell, dueOnly, showClosed]);

  if (q.isLoading) return <PageLoading rows={6} />;
  if (q.error || !q.data) return <EmptyState title="Could not load the RAID log" body={workError(q.error)} />;
  const d = q.data;

  const row = (r: RaidItem) => (
    <li key={r.id}>
      <button type="button" onClick={() => setParams({ item: String(r.number) })} className={cn('flex w-full min-w-0 items-start gap-3 px-3 py-2.5 text-left hover:bg-[var(--w-hover)] md:items-center', r.closed && 'opacity-70')} data-testid={`raid-row-${r.number}`}>
        {tab !== 'ASSUMPTION' ? <ScoreBadge score={r.score} className="mt-0.5 md:mt-0" /> : null}
        <span className="min-w-0 flex-1 md:flex md:items-center md:gap-3">
          <span className="flex min-w-0 items-center gap-2 md:flex-1">
            <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{r.key}</span>
            <span className="truncate text-[13.5px] font-medium">{r.title}</span>
          </span>
          <span className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] text-[var(--w-text-3)] md:mt-0 md:shrink-0 md:flex-nowrap">
            <RaidStatusPill status={r.status} />
            {r.response && <span>{RAID_RESPONSE_LABEL[r.response]}</span>}
            {r.reviewDue ? <Pill tone="orange"><AlarmClock size={11} /> Review due</Pill> : r.reviewDate ? <span>review {formatDate(r.reviewDate)}</span> : null}
            <span className="flex items-center gap-1">{r.owner && <UserAvatar user={r.owner} size={16} />}<span className="max-w-[110px] truncate">{r.owner ? userName(r.owner) : 'No owner'}</span></span>
          </span>
        </span>
      </button>
    </li>
  );

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1180px] px-4 py-5 md:px-6">
        <nav className="-mx-4 mb-4 overflow-x-auto px-4 md:mx-0 md:px-0" aria-label="RAID sections">
          <div className="inline-flex min-w-max gap-1 border-b border-[var(--w-border)]" role="tablist">
            {RAID_TYPES.map((t) => (
              <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => { setParams({ type: t === 'RISK' ? null : t }); setCell(null); }} data-testid={`raid-tab-${t}`}
                className={cn('-mb-px flex h-9 items-center gap-1.5 whitespace-nowrap border-b-2 px-2.5 text-[13px] font-medium', tab === t ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-3)] hover:text-[var(--w-text-2)]')}>
                {RAID_LABEL[t].many} <span className="w-count">{d.counts[t]?.open ?? 0}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className={cn('grid grid-cols-1 gap-4', tab === 'RISK' && 'lg:grid-cols-[minmax(0,1fr)_300px]')}>
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <button type="button" className={cn('w-btn w-btn-sm', dueOnly && 'w-btn-on')} onClick={() => setDueOnly((v) => !v)} aria-pressed={dueOnly} data-testid="raid-due">
                <AlarmClock size={13} /> Review due <span className="w-count">{d.reviewDue}</span>
              </button>
              <label className="flex items-center gap-1.5 text-[12.5px] text-[var(--w-text-2)]"><input type="checkbox" checked={showClosed} onChange={(e) => setShowClosed(e.target.checked)} /> Show closed</label>
              {cell && <Pill tone="accent">P{cell.p} × I{cell.i}</Pill>}
              <span className="ml-auto flex flex-wrap gap-2">
                {d.canEdit && tab === 'RISK' && <button type="button" className="w-btn w-btn-sm" disabled={starter.isPending} onClick={() => starter.mutate()} title="Adds the example risks of the risk register template (so-dang-ky-rui-ro.md)"><FileDown size={13} /> Starter risks</button>}
                {d.canEdit && <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setAdding(true)} data-testid="raid-add"><Plus size={13} /> Add {RAID_LABEL[tab].one.toLowerCase()}</button>}
              </span>
            </div>
            {items.length ? (
              <ul className="w-card divide-y divide-[var(--w-border)] overflow-hidden" data-testid="raid-list">{items.map(row)}</ul>
            ) : (
              <EmptyState
                icon={<ShieldAlert size={20} />}
                title={cell ? 'No open risks in this cell' : `No ${RAID_LABEL[tab].many.toLowerCase()} yet`}
                body={tab === 'RISK' ? 'Write risks down early as “If … then …”, score probability × impact, give each an owner and a review date.' : tab === 'ASSUMPTION' ? 'Things you take as true without proof — validate them before they bite.' : tab === 'ISSUE' ? 'Problems that are happening now and need a decision or action.' : 'What this project waits on — other teams, vendors, the client.'}
              />
            )}
          </div>
          {tab === 'RISK' && (
            <aside className="w-card h-fit p-4 lg:sticky lg:top-4">
              <Matrix m={d.matrix} cell={cell} onCell={setCell} />
              <p className="mt-3 text-[12px] text-[var(--w-text-3)]">{d.highRisks ? `${d.highRisks} open risk${d.highRisks === 1 ? '' : 's'} scored 15 or more — these turn the project amber (20+ red) on Portfolio.` : 'No open risk scores 15 or more.'}</p>
            </aside>
          )}
        </div>
      </div>
      <NewRaidDialog config={config} open={adding} onClose={() => setAdding(false)} type={tab} />
      <RaidItemDialog config={config} num={item} onClose={() => setParams({ item: null })} />
    </div>
  );
}
