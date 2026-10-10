'use client';

/**
 * CTW đợt 6b (R7) — NFR có số đo: mỗi yêu cầu loại Quality attribute mang đặc tính ISO/IEC 25010:2023 (+ đặc tính con) và
 * thước đo Planguage (Wiegers ch.14): Scale = đo cái gì, Meter = đo bằng cách nào, Must = ngưỡng tối thiểu, Plan = mục tiêu,
 * Wish = mong muốn, điều kiện đo, cách kiểm (Test / Analysis / Inspection / Demonstration). Mẫu NFR tạo thẻ một chạm; câu
 * đọc được + bảng Planguage tự vào SRS §6 và Phụ lục B.
 */

import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Gauge, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { workError } from '@/lib/work-api';
import { workSwr6bApi, workSwr6bKeys, type Comparator, type IsoCharacteristic, type NfrData, type NfrSpec, type Verification } from '@/lib/work-swr6b-api';
import { wt, type WKey } from '@/components/work/i18n';
import KpiTile, { KpiRow } from '../KpiTile';
import { Dialog, EmptyState, Field, PageLoading, Spinner } from '../ui';
import { Chip, LifecycleChip, Note, Section, TabIntro, TableFrame, TD, TextArea, TH, use6bRefresh } from './shared';

const ISO_KEY: Record<IsoCharacteristic, WKey> = {
  FUNCTIONAL_SUITABILITY: 'srsx.isoFunctional', PERFORMANCE_EFFICIENCY: 'srsx.isoPerformance', COMPATIBILITY: 'srsx.isoCompatibility', INTERACTION_CAPABILITY: 'srsx.isoInteraction',
  RELIABILITY: 'srsx.isoReliability', SECURITY: 'srsx.isoSecurity', MAINTAINABILITY: 'srsx.isoMaintainability', FLEXIBILITY: 'srsx.isoFlexibility', SAFETY: 'srsx.isoSafety',
};
const VER_KEY: Record<Verification, WKey> = { TEST: 'srsx.vTest', ANALYSIS: 'srsx.vAnalysis', INSPECTION: 'srsx.vInspection', DEMONSTRATION: 'srsx.vDemonstration' };
type Row = NfrData['requirements'][number];
const EMPTY: NfrSpec = { characteristic: 'PERFORMANCE_EFFICIENCY', subCharacteristic: null, scale: '', meter: '', unit: null, comparator: '<=', mustValue: null, planValue: null, wishValue: null, conditions: null, verification: 'TEST' };
const num = (v: string) => (v.trim() === '' ? null : Number(v.replace(',', '.')));

export default function NfrTab({ pid, onOpenIssue }: { pid: number; onOpenIssue: (n: number) => void }) {
  const refresh = use6bRefresh(pid);
  const q = useQuery({ queryKey: workSwr6bKeys.nfr(pid), queryFn: () => workSwr6bApi.nfr(pid) });
  const [edit, setEdit] = useState<Row | null>(null);
  const [f, setF] = useState(EMPTY);
  const [vals, setVals] = useState({ must: '', plan: '', wish: '' });
  const [tpl, setTpl] = useState('');
  useEffect(() => {
    if (!edit) return;
    const s = edit.spec ?? { ...EMPTY, characteristic: edit.suggestedCharacteristic ?? EMPTY.characteristic };
    setF(s);
    setVals({ must: s.mustValue === null ? '' : String(s.mustValue), plan: s.planValue === null ? '' : String(s.planValue), wish: s.wishValue === null ? '' : String(s.wishValue) });
  }, [edit]);
  const save = useMutation({
    mutationFn: () => workSwr6bApi.setNfr(pid, edit!.number, { ...f, mustValue: num(vals.must), planValue: num(vals.plan), wishValue: num(vals.wish) }),
    onSuccess: (r) => { refresh(); setEdit(null); toast.success(r.statement); },
    onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))),
  });
  const fromTpl = useMutation({
    mutationFn: () => workSwr6bApi.nfrFromTemplate(pid, tpl),
    onSuccess: (r) => { refresh(); setTpl(''); toast.success(wt('srsx.nfrCreated', { key: r.key })); },
    onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))),
  });
  if (q.isLoading) return <PageLoading rows={5} />;
  if (!q.data) return <EmptyState title={wt('swr.loadFailed')} body={q.error ? workError(q.error) : undefined} />;
  const data = q.data;
  const subs = data.characteristics.find((c) => c.key === f.characteristic)?.subs ?? [];
  const invalid = !f.scale.trim() || f.scale.trim().length < 3 || !f.meter.trim() || f.meter.trim().length < 3 || [vals.must, vals.plan, vals.wish].some((v) => v.trim() !== '' && !Number.isFinite(num(v)));
  return (
    <div className="flex flex-col gap-4">
      <TabIntro text={wt('srsx.nfrIntro')} />
      <KpiRow label={wt('srsx.nfrKpis')}>
        <KpiTile label={wt('srsx.kQuality')} value={data.requirements.length} />
        <KpiTile label={wt('srsx.kMeasured')} value={data.measured} tone={data.measured < data.requirements.length ? 'orange' : 'green'} />
      </KpiRow>
      {data.canEdit && (
        <Section id="nfr-tpl" title={wt('srsx.templates')}>
          <div className="flex flex-wrap gap-2">
            <label className="sr-only" htmlFor="nfr-tpl-pick">{wt('srsx.templates')}</label>
            <select id="nfr-tpl-pick" className="w-input h-8 max-w-[420px]" value={tpl} onChange={(e) => setTpl(e.target.value)}>
              <option value="">{wt('srsx.pickTemplate')}</option>
              {data.characteristics.map((c) => (
                <optgroup key={c.key} label={wt(ISO_KEY[c.key])}>
                  {data.templates.filter((t) => t.characteristic === c.key).map((t) => <option key={t.id} value={t.id}>{t.title} — {t.comparator} {t.must} {t.unit}</option>)}
                </optgroup>
              ))}
            </select>
            <button type="button" className="w-btn w-btn-sm w-btn-primary" disabled={!tpl || fromTpl.isPending} onClick={() => fromTpl.mutate()}><Plus size={13} /> {wt('srsx.createFromTpl')}</button>
          </div>
          {tpl && (() => { const t = data.templates.find((x) => x.id === tpl)!; return <Note>{`${t.scale} — ${t.meter}. ${wt('srsx.tplMust', { c: t.comparator, must: t.must, plan: t.plan, unit: t.unit })}`}</Note>; })()}
        </Section>
      )}
      {!data.requirements.length ? <EmptyState title={wt('srsx.noNfr')} body={wt('srsx.noNfrBody')} /> : (
        <TableFrame label={wt('srsx.nfrTitle')}>
          <table className="w-full min-w-[900px] border-separate border-spacing-0">
            <thead><tr>{[wt('elic.hRequirement'), wt('srsx.hIso'), wt('srsx.hStatement'), wt('elic.hStatus'), ''].map((h, i) => <th key={i} scope="col" className={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {data.requirements.map((r) => (
                <tr key={r.number} className="hover:bg-[var(--w-hover)]">
                  <td className={TD}><button type="button" className="mr-1.5 font-mono text-[12px] text-[var(--w-accent-text)] hover:underline" onClick={() => onOpenIssue(r.number)}>{r.key}</button>{r.title}</td>
                  <td className={`${TD} text-[12.5px]`}>{r.spec ? <>{wt(ISO_KEY[r.spec.characteristic])}{r.spec.subCharacteristic && <span className="block text-[var(--w-text-2)]">{r.spec.subCharacteristic}</span>}</> : r.suggestedCharacteristic ? <span className="text-[var(--w-text-3)]">{wt(ISO_KEY[r.suggestedCharacteristic])}?</span> : '—'}</td>
                  <td className={`${TD} max-w-[460px] text-[12.5px]`}>{r.statement ?? <Chip tone="orange">{wt('srsx.noMetric')}</Chip>}</td>
                  <td className={TD}><LifecycleChip lc={r.lifecycle} /></td>
                  <td className={`${TD} w-28`}>{data.canEdit && <button type="button" className="w-btn w-btn-sm" onClick={() => setEdit(r)}><Gauge size={13} /> {r.spec ? wt('common.edit') : wt('srsx.addMetric')}</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableFrame>
      )}
      <Dialog open={!!edit} onClose={() => setEdit(null)} title={edit ? `${edit.key} · ${edit.title}` : ''} width={680}
        footer={<><button type="button" className="w-btn" onClick={() => setEdit(null)}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={invalid || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={12} />} {wt('common.save')}</button></>}>
        <div className="grid gap-x-3 sm:grid-cols-2">
          <Field label={wt('srsx.hIso')}>
            <select className="w-input" value={f.characteristic} onChange={(e) => setF({ ...f, characteristic: e.target.value as IsoCharacteristic, subCharacteristic: null })}>{data.characteristics.map((c) => <option key={c.key} value={c.key}>{wt(ISO_KEY[c.key])}</option>)}</select>
          </Field>
          <Field label={wt('srsx.sub')}>
            <select className="w-input" value={f.subCharacteristic ?? ''} onChange={(e) => setF({ ...f, subCharacteristic: e.target.value || null })}><option value="">—</option>{subs.map((s) => <option key={s} value={s}>{s}</option>)}</select>
          </Field>
        </div>
        <TextArea id="nfr-scale" label={wt('srsx.scale')} hint={wt('srsx.scaleHint')} value={f.scale} rows={2} onChange={(v) => setF({ ...f, scale: v })} />
        <TextArea id="nfr-meter" label={wt('srsx.meter')} hint={wt('srsx.meterHint')} value={f.meter} rows={2} onChange={(v) => setF({ ...f, meter: v })} />
        <div className="grid gap-x-3 sm:grid-cols-5">
          <Field label={wt('srsx.comparator')}><select className="w-input" value={f.comparator} onChange={(e) => setF({ ...f, comparator: e.target.value as Comparator })}>{data.comparators.map((c) => <option key={c} value={c}>{c}</option>)}</select></Field>
          <Field label={wt('srsx.must')}><input className="w-input" inputMode="decimal" value={vals.must} onChange={(e) => setVals({ ...vals, must: e.target.value })} /></Field>
          <Field label={wt('srsx.planV')}><input className="w-input" inputMode="decimal" value={vals.plan} onChange={(e) => setVals({ ...vals, plan: e.target.value })} /></Field>
          <Field label={wt('srsx.wish')}><input className="w-input" inputMode="decimal" value={vals.wish} onChange={(e) => setVals({ ...vals, wish: e.target.value })} /></Field>
          <Field label={wt('srsx.unit')}><input className="w-input" value={f.unit ?? ''} maxLength={24} placeholder="ms" onChange={(e) => setF({ ...f, unit: e.target.value || null })} /></Field>
        </div>
        <div className="grid gap-x-3 sm:grid-cols-2">
          <TextArea id="nfr-cond" label={wt('srsx.conditions')} value={f.conditions ?? ''} rows={2} onChange={(v) => setF({ ...f, conditions: v || null })} placeholder={wt('srsx.conditionsPh')} />
          <Field label={wt('srsx.verification')}><select className="w-input" value={f.verification} onChange={(e) => setF({ ...f, verification: e.target.value as Verification })}>{data.verifications.map((v) => <option key={v} value={v}>{wt(VER_KEY[v])}</option>)}</select></Field>
        </div>
        {vals.must.trim() === '' && <Note tone="warn">{wt('srsx.mustMissing')}</Note>}
      </Dialog>
    </div>
  );
}
