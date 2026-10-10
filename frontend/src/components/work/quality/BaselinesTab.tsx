'use client';

/**
 * CT Work đợt 6 — Baseline yêu cầu/tài liệu (Wiegers ch.27 · R21/R22): chụp REQ/UC/BR/Docs ⇒ người ký phê duyệt (mã băm
 * bản chụp lưu kèm chữ ký) ⇒ đóng băng; so sánh với hiện tại / baseline khác (thêm/bỏ/đổi + CR nào cho phép); độ biến
 * động; và nối yêu cầu thay đổi với mục bị ảnh hưởng (mở khoá sửa khi CR được duyệt, liệt kê test cần chạy lại).
 */

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Lock, Plus, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { userName, workError, type ProjectConfig } from '@/lib/work-api';
import { q6Api, q6Keys, type Baseline, type BaselineKind } from '@/lib/work-q6-api';
import { Dialog, EmptyState, PageLoading } from '../ui';
import { useWT, type WKey } from '../i18n';
import { Badge, Card, Labeled, Tbl, Td, Th, splitList, type Tone } from './qui';

const BL_TONE: Record<Baseline['status'], Tone> = { DRAFT: 'muted', PENDING: 'yellow', APPROVED: 'green', REJECTED: 'red', SUPERSEDED: 'muted' };
const CH_TONE = { ADDED: 'green', REMOVED: 'red', CHANGED: 'orange' } as const;

export default function BaselinesTab({ config, pid, selected, onSelect }: { config: ProjectConfig; pid: number; selected: number | null; onSelect: (n: number | null) => void }) {
  const { t, fmtDateTime } = useWT();
  const list = useQuery({ queryKey: q6Keys.baselines(pid), queryFn: () => q6Api.baselines(pid) });
  const locked = useQuery({ queryKey: [...q6Keys.baselines(pid), 'locked'], queryFn: () => q6Api.locked(pid) });
  const [open, setOpen] = useState(false);
  const canEdit = config.permissions.editIssues;
  if (list.isLoading) return <PageLoading />;
  if (list.error) return <EmptyState title={t('q6.loadFailed')} body={workError(list.error)} />;
  const rows = list.data ?? [];
  return (
    <div className="flex flex-col gap-3" data-testid="q6-baselines">
      {locked.data?.baseline && (
        <div className="flex items-start gap-2 rounded-[var(--w-radius)] border border-[var(--w-border)] bg-[var(--w-hover)] px-3 py-2 text-[12.5px]" role="status">
          <Lock size={14} className="mt-0.5 shrink-0" />
          <span>{t('q6.blLockedBanner', { k: locked.data.baseline.key, n: locked.data.baseline.name })}</span>
        </div>
      )}
      <div className="flex items-center justify-between gap-2">
        <p className="max-w-[760px] text-[12.5px] text-[var(--w-text-2)]">{t('q6.noBaselinesBody')}</p>
        {canEdit && <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setOpen(true)} data-testid="q6-new-baseline"><Plus size={14} /> {t('q6.newBaseline')}</button>}
      </div>
      {!rows.length ? <EmptyState icon={<ShieldCheck size={20} />} title={t('q6.noBaselines')} body={t('q6.noBaselinesBody')} /> : (
        <Tbl minWidth={860} label={t('q6.tabBaselines')}>
          <thead><tr><Th w={70}>{t('q6.colKey')}</Th><Th>{t('q6.blName')}</Th><Th w={170}>{t('q6.colStatus')}</Th><Th w={220}>{t('q6.blInclude')}</Th><Th w={130}>{t('q6.blHash')}</Th><Th w={160}>{t('q6.blSignoffs')}</Th></tr></thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.number} className={cn('cursor-pointer hover:bg-[var(--w-hover)]', selected === b.number && 'bg-[var(--w-accent-soft)]')} onClick={() => onSelect(b.number)}>
                <Td className="font-mono text-[12px]">{b.key}</Td>
                <Td><div className="font-medium">{b.name}</div><div className="text-[12px] text-[var(--w-text-3)]">{fmtDateTime(b.createdAt)}</div></Td>
                <Td><Badge tone={BL_TONE[b.status]}>{b.locked && <Lock size={10} className="mr-1" />}{t(`q6.blStatus${b.status}` as WKey)}</Badge></Td>
                <Td className="text-[12px] text-[var(--w-text-2)]">REQ {b.counts.REQ} · UC {b.counts.UC} · BR {b.counts.BR} · DOC {b.counts.DOC}</Td>
                <Td className="font-mono text-[11.5px] text-[var(--w-text-3)]">{b.hash.slice(0, 12)}</Td>
                <Td className="text-[12px]">{b.signoffs.filter((s) => s.decision === 'APPROVED').length}/{b.signoffs.length}</Td>
              </tr>
            ))}
          </tbody>
        </Tbl>
      )}
      {selected && <BaselineDetail config={config} pid={pid} num={selected} others={rows.filter((b) => b.number !== selected)} />}
      <Volatility pid={pid} />
      <CrAffected pid={pid} canEdit={canEdit} />
      {open && <NewBaselineDialog config={config} pid={pid} onClose={() => setOpen(false)} onCreated={(n) => { setOpen(false); onSelect(n); }} />}
    </div>
  );
}

function NewBaselineDialog({ config, pid, onClose, onCreated }: { config: ProjectConfig; pid: number; onClose: () => void; onCreated: (n: number) => void }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [reqs, setReqs] = useState(true);
  const [ucs, setUcs] = useState(true);
  const [brs, setBrs] = useState(true);
  const [pages, setPages] = useState('');
  const [approvers, setApprovers] = useState<number[]>([]);
  const people = config.members.filter((m) => m.role !== 'CLIENT' && m.kind !== 'AGENT');
  const m = useMutation({
    mutationFn: () => q6Api.createBaseline(pid, {
      name: name.trim(), description: desc.trim() || null, approverIds: approvers,
      scope: { requirements: reqs, useCases: ucs, businessRules: brs, pageNumbers: splitList(pages).map(Number).filter((n) => Number.isInteger(n) && n > 0) },
    }),
    onSuccess: (b) => { toast.success(t('q6.blCreated', { k: b.key, n: b.itemCount })); qc.invalidateQueries({ queryKey: q6Keys.baselines(pid) }); onCreated(b.number); },
    onError: (e) => toast.error(workError(e)),
  });
  const box = (label: string, v: boolean, set: (x: boolean) => void) => (
    <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" checked={v} onChange={(e) => set(e.target.checked)} /> {label}</label>
  );
  return (
    <Dialog open onClose={onClose} title={t('q6.newBaseline')} width={560}
      footer={<><button type="button" className="w-btn w-btn-sm" onClick={onClose}>{t('common.cancel')}</button><button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={!name.trim() || m.isPending} onClick={() => m.mutate()} data-testid="q6-create-baseline">{t('q6.create')}</button></>}>
      <div className="flex flex-col gap-3">
        <Labeled label={t('q6.blName')}><input className="w-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('q6.blNamePh')} autoFocus data-testid="q6-baseline-name" /></Labeled>
        <Labeled label={t('q6.blDescription')}><textarea className="w-input min-h-[56px]" value={desc} onChange={(e) => setDesc(e.target.value)} /></Labeled>
        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1 text-[12px] font-medium text-[var(--w-text-2)]">{t('q6.blInclude')}</legend>
          {box(t('q6.blReqs'), reqs, setReqs)}{box(t('q6.blUcs'), ucs, setUcs)}{box(t('q6.blBrs'), brs, setBrs)}
        </fieldset>
        <Labeled label={t('q6.blPages')}><input className="w-input" value={pages} onChange={(e) => setPages(e.target.value)} placeholder={t('q6.blPagesPh')} /></Labeled>
        <fieldset>
          <legend className="mb-1 text-[12px] font-medium text-[var(--w-text-2)]">{t('q6.blApprovers')}</legend>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {people.map((p) => (
              <label key={p.id} className="flex items-center gap-1.5 text-[13px]">
                <input type="checkbox" checked={approvers.includes(p.id)} onChange={(e) => setApprovers(e.target.checked ? [...approvers, p.id] : approvers.filter((x) => x !== p.id))} /> {userName(p)}
              </label>
            ))}
          </div>
          <p className="mt-1 text-[11.5px] text-[var(--w-text-3)]">{t('q6.blApproversHint')}</p>
        </fieldset>
      </div>
    </Dialog>
  );
}

function BaselineDetail({ config, pid, num, others }: { config: ProjectConfig; pid: number; num: number; others: Baseline[] }) {
  const { t, fmtDateTime } = useWT();
  const qc = useQueryClient();
  const meId = useAuthStore((st) => st.user?.id) ?? null;
  const q = useQuery({ queryKey: [...q6Keys.baselines(pid), num], queryFn: () => q6Api.baseline(pid, num) });
  const [against, setAgainst] = useState<'current' | number>('current');
  const cmp = useQuery({ queryKey: [...q6Keys.baselines(pid), num, 'cmp', against], queryFn: () => q6Api.compare(pid, num, against) });
  const done = (b: Baseline) => { qc.setQueryData([...q6Keys.baselines(pid), num], b); qc.invalidateQueries({ queryKey: q6Keys.baselines(pid) }); };
  const sign = useMutation({ mutationFn: (v: { d: 'APPROVE' | 'REJECT'; c?: string }) => q6Api.sign(pid, num, v.d, v.c), onSuccess: (b) => { done(b); toast.success(t('q6.blSigned')); }, onError: (e) => toast.error(workError(e)) });
  const [asked, setAsked] = useState<number[]>([]);
  const request = useMutation({ mutationFn: () => q6Api.requestSignoff(pid, num, asked), onSuccess: done, onError: (e) => toast.error(workError(e)) });
  if (q.isLoading) return <PageLoading rows={3} />;
  if (!q.data) return null;
  const b = q.data;
  const mine = b.signoffs.find((s) => s.userId === meId && s.decision === 'PENDING');
  const people = config.members.filter((m) => m.role !== 'CLIENT' && m.kind !== 'AGENT');
  return (
    <Card title={`${b.key} · ${b.name}`} desc={b.description ?? undefined} testId="q6-baseline-detail"
      actions={<Badge tone={BL_TONE[b.status]}>{t(`q6.blStatus${b.status}` as WKey)}</Badge>}>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="text-[12px] text-[var(--w-text-2)]">{t('q6.blHash')}: <span className="font-mono">{b.hash}</span></div>
          <h3 className="text-[13px] font-semibold">{t('q6.blSignoffs')}</h3>
          <ul className="flex flex-col gap-1 text-[13px]">
            {b.signoffs.map((s) => (
              <li key={s.userId} className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{s.user ? userName(s.user) : `#${s.userId}`}</span>
                <Badge tone={s.decision === 'APPROVED' ? 'green' : s.decision === 'REJECTED' ? 'red' : 'yellow'}>{s.decision}</Badge>
                {s.decidedAt && <span className="text-[12px] text-[var(--w-text-3)]">{fmtDateTime(s.decidedAt)}</span>}
                {s.hashMatches !== null && <span className={cn('text-[12px]', s.hashMatches ? 'text-[var(--w-green-text)]' : 'text-[var(--w-red-text)]')}>{s.hashMatches ? t('q6.blHashOk') : t('q6.blHashBad')}</span>}
                {s.comment && <span className="text-[12px] text-[var(--w-text-2)]">— {s.comment}</span>}
              </li>
            ))}
          </ul>
          {mine && b.status === 'PENDING' && (
            <div className="flex gap-2">
              <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={sign.isPending} onClick={() => sign.mutate({ d: 'APPROVE' })} data-testid="q6-sign">{t('q6.blSign')}</button>
              <button type="button" className="w-btn w-btn-danger w-btn-sm" disabled={sign.isPending} onClick={() => { const c = window.prompt(t('q6.blRejectReason')); if (c?.trim()) sign.mutate({ d: 'REJECT', c }); }}>{t('q6.blReject')}</button>
            </div>
          )}
          {(b.status === 'DRAFT' || b.status === 'REJECTED') && config.permissions.editIssues && (
            <div className="flex flex-wrap items-center gap-2">
              <select className="w-input w-[220px]" value="" aria-label={t('q6.blApprovers')} onChange={(e) => e.target.value && setAsked([...new Set([...asked, Number(e.target.value)])])}>
                <option value="">+ {t('q6.blApprovers')}</option>
                {people.map((p) => <option key={p.id} value={p.id}>{userName(p)}</option>)}
              </select>
              <span className="text-[12px]">{asked.map((id) => userName(people.find((p) => p.id === id)!)).join(', ')}</span>
              <button type="button" className="w-btn w-btn-sm" disabled={!asked.length || request.isPending} onClick={() => request.mutate()}>{t('q6.blRequestSignoff')}</button>
            </div>
          )}
          <Tbl minWidth={420} maxHeight={320} label={t('q6.blItems', { n: b.itemCount })}>
            <thead><tr><Th w={70}>{t('q6.colKey')}</Th><Th>{t('q6.colItem')}</Th><Th w={80}>{t('q6.colVersion')}</Th></tr></thead>
            <tbody>{(b.items ?? []).map((i) => <tr key={`${i.kind}:${i.refId}`}><Td className="font-mono text-[12px]">{i.ref}</Td><Td>{i.title}</Td><Td className="text-[12px] text-[var(--w-text-3)]">{i.version}</Td></tr>)}</tbody>
          </Tbl>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] font-semibold">{t('q6.blCompare')}</h3>
            <select className="w-input w-[220px]" aria-label={t('q6.blCompareWith')} value={String(against)} onChange={(e) => setAgainst(e.target.value === 'current' ? 'current' : Number(e.target.value))} data-testid="q6-compare-with">
              <option value="current">{t('q6.blCurrent')}</option>
              {others.map((o) => <option key={o.number} value={o.number}>{o.key} · {o.name}</option>)}
            </select>
          </div>
          {cmp.data && (
            <>
              <div className="text-[12px] text-[var(--w-text-2)]">
                {t('q6.chADDED')} {cmp.data.counts.added} · {t('q6.chREMOVED')} {cmp.data.counts.removed} · {t('q6.chCHANGED')} {cmp.data.counts.changed}
                {cmp.data.volatility !== null && <> · {t('q6.blVolatility')} {cmp.data.volatility}%</>}
              </div>
              {!cmp.data.rows.length ? <p className="text-[12.5px] text-[var(--w-text-3)]">{t('q6.blNoDiff')}</p> : (
                <Tbl minWidth={520} maxHeight={380} label={t('q6.blCompare')}>
                  <thead><tr><Th w={90}>{t('q6.blChange')}</Th><Th w={70}>{t('q6.colKey')}</Th><Th>{t('q6.colItem')}</Th><Th w={90}>{t('q6.colVersion')}</Th><Th w={150}>{t('q6.blAuthorized')}</Th></tr></thead>
                  <tbody>
                    {cmp.data.rows.map((r) => (
                      <tr key={`${r.kind}:${r.refId}`} data-testid="q6-diff-row">
                        <Td><Badge tone={CH_TONE[r.change]}>{t(`q6.ch${r.change}` as WKey)}</Badge></Td>
                        <Td className="font-mono text-[12px]">{r.ref}</Td>
                        <Td>{r.title}{r.fromTitle && <div className="text-[12px] text-[var(--w-text-3)] line-through">{r.fromTitle}</div>}</Td>
                        <Td className="text-[12px]">{r.fromVersion ?? '—'} → {r.toVersion ?? '—'}</Td>
                        <Td className="text-[12px]">{r.changeRequests.length ? r.changeRequests.map((c) => `${c.key} (${c.status})`).join(', ') : <span className={r.change === 'CHANGED' ? 'text-[var(--w-red-text)]' : 'text-[var(--w-text-3)]'}>{t('q6.blUnauthorized')}</span>}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Tbl>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

function Volatility({ pid }: { pid: number }) {
  const { t, fmtDate } = useWT();
  const q = useQuery({ queryKey: [...q6Keys.baselines(pid), 'volatility'], queryFn: () => q6Api.volatility(pid) });
  if (!q.data?.length) return null;
  return (
    <Card title={t('q6.blVolatility')} desc={t('q6.blVolatilityDesc')}>
      <Tbl minWidth={560} label={t('q6.blVolatility')}>
        <thead><tr><Th w={70}>{t('q6.colKey')}</Th><Th>{t('q6.blName')}</Th><Th w={110}>{t('q6.blApprovedAt')}</Th><Th w={70} className="text-right">{t('q6.blItemCount')}</Th><Th w={70} className="text-right">{t('q6.chADDED')}</Th><Th w={70} className="text-right">{t('q6.chREMOVED')}</Th><Th w={70} className="text-right">{t('q6.chCHANGED')}</Th><Th w={90} className="text-right">%</Th></tr></thead>
        <tbody>
          {q.data.map((v) => (
            <tr key={v.key}><Td className="font-mono text-[12px]">{v.key}</Td><Td>{v.name}</Td><Td className="text-[12px]">{v.approvedAt ? fmtDate(v.approvedAt) : '—'}</Td><Td className="text-right tabular-nums">{v.items}</Td><Td className="text-right tabular-nums">{v.added ?? '—'}</Td><Td className="text-right tabular-nums">{v.removed ?? '—'}</Td><Td className="text-right tabular-nums">{v.changed ?? '—'}</Td><Td className="text-right tabular-nums">{v.volatility ?? '—'}</Td></tr>
          ))}
        </tbody>
      </Tbl>
    </Card>
  );
}

/** Nối CR ↔ mục bị ảnh hưởng. Nhập mỗi dòng "REQ KEY-12" · "UC UC-3" · "BR BR-2" · "DOC 5". */
export function CrAffected({ pid, canEdit, crNumber }: { pid: number; canEdit: boolean; crNumber?: number }) {
  const { t } = useWT();
  const [num, setNum] = useState<number | null>(crNumber ?? null);
  const [input, setInput] = useState('');
  const [text, setText] = useState('');
  const q = useQuery({ queryKey: [...q6Keys.base(pid), 'cr', num], queryFn: () => q6Api.crImpact(pid, num!), enabled: !!num, retry: false });
  const initial = useMemo(() => (q.data?.items ?? []).map((i) => `${i.kind} ${i.ref}`).join('\n'), [q.data]);
  useEffect(() => setText(initial), [initial]);
  const save = useMutation({
    mutationFn: () => q6Api.setCrAffected(pid, num!, text.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
      const [kind, ...rest] = l.split(/\s+/);
      return { kind: kind.toUpperCase() as BaselineKind, ref: rest.join(' ') || kind };
    })),
    onSuccess: () => { toast.success(t('q6.saved')); q.refetch(); },
    onError: (e) => toast.error(workError(e)),
  });
  return (
    <Card title={t('q6.crSection')} desc={t('q6.crSectionDesc')} testId="q6-cr-affected">
      {!crNumber && (
        <div className="mb-3 flex items-end gap-2">
          <Labeled label={t('q6.crNumber')} className="w-[140px]"><input className="w-input" inputMode="numeric" value={input} onChange={(e) => setInput(e.target.value.replace(/\D/g, ''))} placeholder="1" /></Labeled>
          <button type="button" className="w-btn w-btn-sm" disabled={!input} onClick={() => setNum(Number(input))}>{t('q6.crLoad')}</button>
        </div>
      )}
      {q.error && <p className="text-[12.5px] text-[var(--w-red-text)]">{workError(q.error)}</p>}
      {q.data && (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="text-[13px]"><span className="font-mono">{q.data.changeRequest.key}</span> · {q.data.changeRequest.title} · <Badge tone={q.data.changeRequest.unlocksEditing ? 'green' : 'yellow'}>{q.data.changeRequest.status}</Badge></div>
            <p className="text-[12px] text-[var(--w-text-2)]">{q.data.changeRequest.unlocksEditing ? t('q6.crUnlocks') : t('q6.crNotApproved')}</p>
            <Labeled label={t('q6.crAffected')}>
              <textarea className="w-input min-h-[110px] font-mono text-[12.5px]" disabled={!canEdit} value={text} onChange={(e) => setText(e.target.value)} placeholder={t('q6.crAffectedPh')} />
            </Labeled>
            {canEdit && <button type="button" className="w-btn w-btn-sm self-start" disabled={save.isPending} onClick={() => save.mutate()}>{t('q6.crSaveAffected')}</button>}
          </div>
          <div className="flex flex-col gap-2">
            <Tbl minWidth={380} label={t('q6.crAffected')}>
              <thead><tr><Th w={80}>{t('q6.colKey')}</Th><Th>{t('q6.colItem')}</Th><Th w={110}>{t('q6.crInBaselines')}</Th></tr></thead>
              <tbody>{q.data.items.map((i) => <tr key={`${i.kind}:${i.refId}`}><Td className="font-mono text-[12px]">{i.ref}</Td><Td>{i.title}</Td><Td className="text-[12px]">{i.baselines.join(', ') || '—'}</Td></tr>)}</tbody>
            </Tbl>
            <div className="text-[12.5px]"><span className="font-medium">{t('q6.crTestsToRerun')}:</span> {q.data.testsToRerun.length ? q.data.testsToRerun.join(', ') : '—'}</div>
          </div>
        </div>
      )}
    </Card>
  );
}
