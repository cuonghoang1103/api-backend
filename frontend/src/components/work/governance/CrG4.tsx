'use client';

/**
 * dm5 G4 (C8, 27/11/2026) — phần mới của một CR: phân tích ảnh hưởng 6 chiều CÓ CẤU TRÚC, 3 phương án A/B/C,
 * tách CR con (CR-3a / CR-3b) và checklist đồng bộ 5 điểm sau khi duyệt (SRS RoC · Tracking Q&A / Issues / WBS · RTM).
 * Máy chủ: changeRequests.service (cleanImpactMatrix / cleanCrOptions / splitChangeRequest / setChangeRequestSync).
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { GitFork, Plus, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError, type ProjectConfig } from '@/lib/work-api';
import type { CrDetail } from '@/lib/work-s3b-api';
import { g4Api, IMPACT_DIMS, IMPACT_LEVELS, type CrG4, type CrOption, type ImpactLevel, type ImpactMatrix } from '@/lib/work-dm5g4-api';
import { Spinner } from '../ui';
import { Section, useGovInvalidate } from './shared';
import { wt } from '@/components/work/i18n';

type Cr = CrDetail & CrG4;
const LEVEL_TONE: Record<ImpactLevel, string> = {
  NONE: 'text-[var(--w-text-3)]', LOW: 'text-[var(--w-green)]', MEDIUM: 'text-[var(--w-amber-text,#b45309)]', HIGH: 'text-[var(--w-red-text)]',
};
const emptyMatrix = (): ImpactMatrix => Object.fromEntries(IMPACT_DIMS.map((d) => [d, { level: 'NONE' as ImpactLevel, note: null }])) as ImpactMatrix;
const emptyOptions = (): CrOption[] => ['A', 'B', 'C'].map(() => ({ title: '', effortDays: null, pros: null, cons: null, chosen: false }));

export function CrStructured({ config, cr: raw }: { config: ProjectConfig; cr: CrDetail }) {
  const cr = raw as Cr;
  const pid = config.id;
  const invalidate = useGovInvalidate(pid);
  const ro = !cr.canEdit || cr.status === 'IMPLEMENTED';
  const [m, setM] = useState<ImpactMatrix>(() => ({ ...emptyMatrix(), ...(cr.impactMatrix ?? {}) }));
  const [opts, setOpts] = useState<CrOption[]>(() => { const o = cr.options ?? []; return [...o, ...emptyOptions()].slice(0, 3); });
  useEffect(() => {
    setM({ ...emptyMatrix(), ...(cr.impactMatrix ?? {}) });
    const o = cr.options ?? [];
    setOpts([...o, ...emptyOptions()].slice(0, 3));
  }, [cr.impactMatrix, cr.options]);
  const save = useMutation({
    mutationFn: () => g4Api.updateCr(pid, cr.number, { impactMatrix: m, options: opts.filter((o) => o.title.trim()).map((o) => ({ ...o, title: o.title.trim() })) }),
    onSuccess: () => { toast.success(wt('g4.savedImpact')); invalidate(); },
    onError: (err) => toast.error(workError(err)),
  });
  const setOpt = (i: number, patch: Partial<CrOption>) => setOpts((xs) => xs.map((x, j) => (j === i ? { ...x, ...patch } : patch.chosen ? { ...x, chosen: false } : x)));

  return (
    <Section
      title={<span className="inline-flex items-center gap-2">{wt('g4.impactTitle')}{cr.impactLevel && cr.impactLevel !== 'NONE' && <span className={cn('text-[12px] font-semibold', LEVEL_TONE[cr.impactLevel])}>{wt(`g4.lvl_${cr.impactLevel}` as 'g4.lvl_NONE')}</span>}</span>}
      action={!ro && <button type="button" className="w-btn w-btn-sm" disabled={save.isPending} onClick={() => save.mutate()} data-testid="cr-impact-save">{save.isPending ? <Spinner size={12} /> : <Save size={13} />} {wt('g4.saveImpact')}</button>}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-[13px]" data-testid="cr-impact-matrix">
          <tbody>
            {IMPACT_DIMS.map((d) => (
              <tr key={d} className="border-b border-[var(--w-border)] last:border-b-0">
                <th scope="row" className="w-[170px] py-1.5 pr-2 text-left font-medium">{wt(`g4.dim_${d}` as 'g4.dim_scope')}</th>
                <td className="w-[120px] py-1.5 pr-2">
                  <select className="w-input !h-7 text-[12.5px]" value={m[d].level} disabled={ro} onChange={(e) => setM((x) => ({ ...x, [d]: { ...x[d], level: e.target.value as ImpactLevel } }))} aria-label={wt(`g4.dim_${d}` as 'g4.dim_scope')}>
                    {IMPACT_LEVELS.map((l) => <option key={l} value={l}>{wt(`g4.lvl_${l}` as 'g4.lvl_NONE')}</option>)}
                  </select>
                </td>
                <td className="py-1.5">
                  <input className="w-input !h-7 w-full text-[12.5px]" value={m[d].note ?? ''} disabled={ro} maxLength={1000} placeholder={wt('g4.notePh')} onChange={(e) => setM((x) => ({ ...x, [d]: { ...x[d], note: e.target.value || null } }))} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 className="mb-1.5 mt-4 text-[12.5px] font-semibold text-[var(--w-text-2)]">{wt('g4.optionsTitle')}</h3>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3" data-testid="cr-options">
        {opts.map((o, i) => {
          const k = ['A', 'B', 'C'][i];
          return (
            <div key={k} className={cn('rounded-[8px] border p-2.5', o.chosen ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border)]')}>
              <div className="mb-1 flex items-center gap-2">
                <span className="font-mono text-[12px] font-semibold">{k}</span>
                <label className="ml-auto inline-flex items-center gap-1 text-[11.5px]"><input type="radio" name={`cr-opt-${cr.number}`} checked={o.chosen} disabled={ro} onChange={() => setOpt(i, { chosen: true })} /> {wt('g4.chosen')}</label>
              </div>
              <input className="w-input !h-7 mb-1 w-full text-[12.5px]" value={o.title} disabled={ro} maxLength={200} placeholder={wt('g4.optTitlePh', { k })} onChange={(e) => setOpt(i, { title: e.target.value })} />
              <input type="number" min={0} step={0.5} className="w-input !h-7 mb-1 w-full text-[12.5px]" value={o.effortDays ?? ''} disabled={ro} placeholder={wt('g4.effortDays')} onChange={(e) => setOpt(i, { effortDays: e.target.value === '' ? null : Number(e.target.value) })} />
              <textarea className="w-input mb-1 min-h-[44px] w-full py-1 text-[12px]" value={o.pros ?? ''} disabled={ro} maxLength={1000} placeholder={wt('g4.pros')} onChange={(e) => setOpt(i, { pros: e.target.value || null })} />
              <textarea className="w-input min-h-[44px] w-full py-1 text-[12px]" value={o.cons ?? ''} disabled={ro} maxLength={1000} placeholder={wt('g4.cons')} onChange={(e) => setOpt(i, { cons: e.target.value || null })} />
            </div>
          );
        })}
      </div>
    </Section>
  );
}

export function CrSplit({ config, cr: raw }: { config: ProjectConfig; cr: CrDetail }) {
  const cr = raw as Cr;
  const pid = config.id;
  const invalidate = useGovInvalidate(pid);
  const [open, setOpen] = useState(false);
  const [parts, setParts] = useState<string[]>(['', '']);
  const base = `/work/${config.workspace.slug}/${config.key}`;
  const split = useMutation({
    mutationFn: () => g4Api.splitCr(pid, cr.number, parts.map((t) => ({ title: t.trim() })).filter((p) => p.title)),
    onSuccess: (r) => { toast.success(wt('g4.splitDone', { keys: r.created.map((c) => `${c.splitKey} (${c.key})`).join(', ') })); setOpen(false); setParts(['', '']); invalidate(); },
    onError: (err) => toast.error(workError(err)),
  });
  const canSplit = cr.canEdit && !cr.parentNumber && cr.status !== 'IMPLEMENTED' && cr.status !== 'REJECTED';
  if (!canSplit && !cr.children?.length && !cr.parentNumber) return null;
  return (
    <Section
      title={cr.parentNumber ? <>{cr.splitKey} · <Link href={`${base}/changes/${cr.parentNumber}`} className="text-[var(--w-accent-text)] hover:underline">CR-{cr.parentNumber}</Link></> : wt('g4.children')}
      action={canSplit && !open && <button type="button" className="w-btn w-btn-sm" onClick={() => setOpen(true)} data-testid="cr-split"><GitFork size={13} /> {wt('g4.split')}</button>}
    >
      {!!cr.children?.length && (
        <ul className="mb-2 divide-y divide-[var(--w-border)] rounded-[6px] border border-[var(--w-border)]">
          {cr.children.map((c) => (
            <li key={c.number} className="flex items-center gap-2 px-3 py-1.5 text-[13px]">
              <span className="font-mono text-[12px] text-[var(--w-accent-text)]">{c.splitKey}</span>
              <Link href={`${base}/changes/${c.number}`} className="min-w-0 flex-1 truncate hover:underline">{c.title}</Link>
              <span className="text-[11.5px] text-[var(--w-text-3)]">{c.key} · {c.status}</span>
            </li>
          ))}
        </ul>
      )}
      {open && (
        <div className="space-y-1.5" data-testid="cr-split-form">
          <p className="text-[12px] text-[var(--w-text-2)]">{wt('g4.splitTitle')}</p>
          {parts.map((t, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <input className="w-input !h-8 flex-1" value={t} maxLength={255} placeholder={wt('g4.splitPart', { n: i + 1 })} onChange={(e) => setParts((xs) => xs.map((x, j) => (j === i ? e.target.value : x)))} />
              {parts.length > 1 && <button type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" aria-label="×" onClick={() => setParts((xs) => xs.filter((_, j) => j !== i))}><X size={13} /></button>}
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            {parts.length < 5 && <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => setParts((xs) => [...xs, ''])}><Plus size={13} /> {wt('g4.addPart')}</button>}
            <button type="button" className="w-btn w-btn-sm ml-auto" onClick={() => setOpen(false)}>{wt('common.cancel')}</button>
            <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={split.isPending || !parts.some((p) => p.trim())} onClick={() => split.mutate()}>{split.isPending && <Spinner size={12} />} {wt('g4.split')}</button>
          </div>
        </div>
      )}
    </Section>
  );
}

export function CrSync({ config, cr: raw }: { config: ProjectConfig; cr: CrDetail }) {
  const cr = raw as Cr;
  const pid = config.id;
  const invalidate = useGovInvalidate(pid);
  const sync = useMutation({
    mutationFn: (patch: Record<string, boolean>) => g4Api.syncCr(pid, cr.number, patch),
    onSuccess: () => invalidate(),
    onError: (err) => toast.error(workError(err)),
  });
  if (!cr.syncItems) return null;
  return (
    <Section title={wt('g4.syncTitle')} action={cr.syncOpen && <span className="text-[12px] tabular-nums text-[var(--w-text-2)]">{wt('g4.syncProgress', { done: cr.syncDone ?? 0, total: cr.syncTotal ?? 5 })}</span>}>
      {!cr.syncOpen ? <p className="text-[12.5px] text-[var(--w-text-3)]">{wt('g4.syncLocked')}</p> : (
        <>
          <p className="mb-2 text-[12px] text-[var(--w-text-2)]">{wt('g4.syncHint')}</p>
          <ul className="space-y-1" data-testid="cr-sync">
            {cr.syncItems.map((i) => (
              <li key={i.key}>
                <label className="flex items-center gap-2 text-[13px]">
                  <input type="checkbox" checked={i.done} disabled={!cr.canEdit || sync.isPending || config.role === 'CLIENT'} onChange={(e) => sync.mutate({ [i.key]: e.target.checked })} />
                  {wt(`g4.sync_${i.key}` as 'g4.sync_rtm')}
                </label>
              </li>
            ))}
          </ul>
        </>
      )}
    </Section>
  );
}
