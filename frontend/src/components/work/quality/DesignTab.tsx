'use client';

/**
 * CT Work đợt 6 — B2: THIẾT KẾ TEST CÓ CÔNG CỤ. Bên trái: danh sách bảng thiết kế. Bên phải: mô hình theo kỹ thuật
 * (EP+BVA · bảng quyết định · chuyển trạng thái · pairwise) ⇒ máy chủ sinh case (xem trước trực tiếp, trễ 400 ms) ⇒
 * lưu ⇒ đổ vào thư viện test (Xray) hoặc ma trận Unit Test 5.1. Mọi phép sinh nằm ở server (testDesign.ts, có test).
 */

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Send, Trash2, Wand2, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { q6Api, q6Keys, TECHNIQUES, TEST_LEVELS, TEST_TYPES, type DesignCase, type DesignResult, type Technique } from '@/lib/work-q6-api';
import { Dialog, EmptyState, PageLoading } from '../ui';
import { useWT, type WKey } from '../i18n';
import { Badge, Card, Labeled, NumberInput, Segmented, Tbl, Td, Th, splitList } from './qui';

type EpField = { name: string; kind: 'number' | 'length' | 'enum'; min?: number | null; max?: number | null; step?: number; values?: string[]; invalid?: string[]; required?: boolean };
type Model =
  | { technique: 'EP_BVA'; fields: EpField[]; bva: 2 | 3; validOutcome: string }
  | { technique: 'DECISION_TABLE'; conditions: string[]; actions: string[]; outcomes: Record<string, number[]>; collapse: boolean; impossible: string[] }
  | { technique: 'STATE_TRANSITION'; states: string[]; initial: string; transitions: Array<{ from: string; event: string; to: string; guard?: string | null; action?: string | null }>; invalid: boolean }
  | { technique: 'PAIRWISE'; parameters: Array<{ name: string; values: string[] }>; expected: string };

const STARTER: Record<Technique, Model> = {
  EP_BVA: { technique: 'EP_BVA', fields: [{ name: 'age', kind: 'number', min: 18, max: 60, step: 1 }, { name: 'role', kind: 'enum', values: ['admin', 'user'] }], bva: 2, validOutcome: 'Saved' },
  DECISION_TABLE: { technique: 'DECISION_TABLE', conditions: ['Valid username', 'Valid password'], actions: ['Log in', 'Show error'], outcomes: { TT: [0], TF: [1], FT: [1], FF: [1] }, collapse: true, impossible: [] },
  STATE_TRANSITION: { technique: 'STATE_TRANSITION', states: ['Draft', 'Submitted', 'Approved', 'Rejected'], initial: 'Draft', transitions: [{ from: 'Draft', event: 'submit', to: 'Submitted' }, { from: 'Submitted', event: 'approve', to: 'Approved' }, { from: 'Submitted', event: 'reject', to: 'Rejected' }, { from: 'Rejected', event: 'edit', to: 'Draft' }], invalid: false },
  PAIRWISE: { technique: 'PAIRWISE', parameters: [{ name: 'Browser', values: ['Chrome', 'Firefox', 'Safari'] }, { name: 'OS', values: ['Windows', 'macOS'] }, { name: 'Language', values: ['vi', 'en'] }], expected: 'Works as specified' },
};
const inputOf = (m: Model) => { const { technique: _t, ...rest } = m; return rest; };

export default function DesignTab({ config, pid }: { config: ProjectConfig; pid: number }) {
  const { t } = useWT();
  const list = useQuery({ queryKey: [...q6Keys.tests(pid), 'designs'], queryFn: () => q6Api.designs(pid) });
  const [sel, setSel] = useState<number | 'new' | null>(null);
  const canEdit = config.permissions.editIssues;
  useEffect(() => { if (sel === null && list.data) setSel(list.data[0]?.number ?? (canEdit ? 'new' : null)); }, [list.data, sel, canEdit]);
  if (list.isLoading) return <PageLoading />;
  const rows = list.data ?? [];
  return (
    <div className="grid min-h-0 grid-cols-1 gap-3 p-4 lg:grid-cols-[260px_minmax(0,1fr)]" data-testid="q6-design-tab">
      <aside className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-semibold">{t('q6.designs')}</h2>
          {canEdit && <button type="button" className="w-btn w-btn-sm" onClick={() => setSel('new')} data-testid="q6-new-design"><Plus size={13} /> {t('q6.newDesign')}</button>}
        </div>
        <ul className="flex flex-col gap-1">
          {rows.map((d) => (
            <li key={d.number}>
              <button type="button" onClick={() => setSel(d.number)} aria-current={sel === d.number ? 'true' : undefined}
                className={cn('w-full rounded-[6px] px-2 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)]', sel === d.number && 'bg-[var(--w-accent-soft)]')}>
                <div className="flex items-center gap-1.5"><span className="font-mono text-[11.5px] text-[var(--w-text-3)]">{d.key}</span><span className="truncate font-medium">{d.name}</span></div>
                <div className="text-[11.5px] text-[var(--w-text-3)]">{t(`q6.t${d.technique}` as WKey)} · {d.caseCount ?? 0}</div>
              </button>
            </li>
          ))}
        </ul>
        {!rows.length && <p className="text-[12.5px] text-[var(--w-text-3)]">{t('q6.noDesignsBody')}</p>}
      </aside>
      <div className="min-w-0">
        {sel === null ? <EmptyState icon={<Wand2 size={20} />} title={t('q6.noDesigns')} body={t('q6.noDesignsBody')} />
          : <Editor key={String(sel)} pid={pid} num={sel === 'new' ? null : sel} canEdit={canEdit} onSaved={(n) => setSel(n)} onDeleted={() => setSel(null)} />}
      </div>
    </div>
  );
}

function Editor({ pid, num, canEdit, onSaved, onDeleted }: { pid: number; num: number | null; canEdit: boolean; onSaved: (n: number) => void; onDeleted: () => void }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const existing = useQuery({ queryKey: [...q6Keys.tests(pid), 'design', num], queryFn: () => q6Api.design(pid, num!), enabled: !!num });
  const [name, setName] = useState('');
  const [reqKey, setReqKey] = useState('');
  const [model, setModel] = useState<Model>(STARTER.EP_BVA);
  const [loaded, setLoaded] = useState(!num);
  useEffect(() => {
    if (!existing.data || loaded) return;
    setName(existing.data.name); setReqKey(existing.data.requirementKey ?? '');
    setModel({ technique: existing.data.technique, ...(existing.data.input as object) } as Model);
    setLoaded(true);
  }, [existing.data, loaded]);
  // Xem trước trực tiếp (trễ 400 ms sau lần sửa cuối).
  const [debounced, setDebounced] = useState(model);
  useEffect(() => { const h = setTimeout(() => setDebounced(model), 400); return () => clearTimeout(h); }, [model]);
  const preview = useQuery({ queryKey: [...q6Keys.tests(pid), 'preview', debounced], queryFn: () => q6Api.preview(pid, debounced.technique, inputOf(debounced)), enabled: loaded, retry: false, placeholderData: (p) => p });
  const save = useMutation({
    mutationFn: () => q6Api.saveDesign(pid, { number: num, name: name.trim(), technique: model.technique, requirementKey: reqKey.trim() || null, input: inputOf(model) }),
    onSuccess: (d) => { toast.success(t('q6.designSaved', { k: d.key })); qc.invalidateQueries({ queryKey: [...q6Keys.tests(pid), 'designs'] }); qc.setQueryData([...q6Keys.tests(pid), 'design', d.number], d); onSaved(d.number); },
    onError: (e) => toast.error(workError(e)),
  });
  const del = useMutation({ mutationFn: () => q6Api.deleteDesign(pid, num!), onSuccess: () => { qc.invalidateQueries({ queryKey: [...q6Keys.tests(pid), 'designs'] }); onDeleted(); } });
  const [exportOpen, setExportOpen] = useState(false);
  if (num && !loaded) return <PageLoading rows={4} />;
  return (
    <div className="flex flex-col gap-3">
      <Card
        title={num ? `TD-${num}` : t('q6.newDesign')}
        actions={canEdit && <>
          <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={!name.trim() || save.isPending || !!preview.error} onClick={() => save.mutate()} data-testid="q6-save-design">{t('q6.save')}</button>
          {num && <button type="button" className="w-btn w-btn-sm" onClick={() => setExportOpen(true)} data-testid="q6-export-design"><Send size={13} /> {t('q6.exportCases')}</button>}
          {num && <button type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" aria-label={t('q6.deleteDesign')} title={t('q6.deleteDesign')} onClick={() => window.confirm(t('q6.deleteDesign')) && del.mutate()}><Trash2 size={14} /></button>}
        </>}
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Labeled label={t('q6.designName')}><input className="w-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('q6.designNamePh')} disabled={!canEdit} data-testid="q6-design-name" /></Labeled>
          <Labeled label={t('q6.technique')}>
            <select className="w-input" value={model.technique} disabled={!canEdit || !!num} onChange={(e) => setModel(STARTER[e.target.value as Technique])} data-testid="q6-technique">
              {TECHNIQUES.map((x) => <option key={x} value={x}>{t(`q6.t${x}` as WKey)}</option>)}
            </select>
          </Labeled>
          <Labeled label={t('q6.reqKey')}><input className="w-input" value={reqKey} onChange={(e) => setReqKey(e.target.value)} placeholder={t('q6.reqKeyPh')} disabled={!canEdit} /></Labeled>
        </div>
        <div className="mt-4">
          {model.technique === 'EP_BVA' && <EpEditor m={model} set={setModel} disabled={!canEdit} />}
          {model.technique === 'DECISION_TABLE' && <DtEditor m={model} set={setModel} disabled={!canEdit} />}
          {model.technique === 'STATE_TRANSITION' && <StEditor m={model} set={setModel} disabled={!canEdit} />}
          {model.technique === 'PAIRWISE' && <PwEditor m={model} set={setModel} disabled={!canEdit} />}
        </div>
      </Card>
      <Preview result={preview.data} error={preview.error ? workError(preview.error) : null} technique={debounced.technique} />
      {existing.data?.exported?.length ? (
        <p className="text-[12px] text-[var(--w-text-3)]">{t('q6.exportHistory')}: {existing.data.exported.map((x) => `${String(x.target)} · ${String(x.at).slice(0, 10)}${Array.isArray(x.keys) ? ` (${(x.keys as string[]).slice(0, 4).join(', ')}${(x.keys as string[]).length > 4 ? '…' : ''})` : ''}`).join(' · ')}</p>
      ) : null}
      {exportOpen && num && preview.data && <ExportDialog pid={pid} num={num} cases={preview.data.cases} onClose={() => setExportOpen(false)} onDone={() => { setExportOpen(false); qc.invalidateQueries({ queryKey: [...q6Keys.tests(pid), 'design', num] }); }} />}
    </div>
  );
}

// ─── Trình soạn theo kỹ thuật ────────────────────────────────────

function EpEditor({ m, set, disabled }: { m: Extract<Model, { technique: 'EP_BVA' }>; set: (m: Model) => void; disabled: boolean }) {
  const { t } = useWT();
  const upd = (i: number, p: Partial<EpField>) => set({ ...m, fields: m.fields.map((f, k) => (k === i ? { ...f, ...p } : f)) });
  return (
    <div className="flex flex-col gap-3">
      <Tbl minWidth={900} label={t('q6.fields')}>
        <thead><tr><Th w={140}>{t('q6.fieldName')}</Th><Th w={140}>{t('q6.fieldKind')}</Th><Th w={90}>{t('q6.min')}</Th><Th w={90}>{t('q6.max')}</Th><Th w={80}>{t('q6.step')}</Th><Th>{t('q6.validValues')} / {t('q6.invalidValues')}</Th><Th w={80}>{t('q6.required')}</Th><Th w={40} /></tr></thead>
        <tbody>
          {m.fields.map((f, i) => (
            <tr key={i}>
              <Td><input aria-label={t('q6.fieldName')} className="w-input" disabled={disabled} value={f.name} onChange={(e) => upd(i, { name: e.target.value })} /></Td>
              <Td>
                <select aria-label={t('q6.fieldKind')} className="w-input" disabled={disabled} value={f.kind} onChange={(e) => upd(i, { kind: e.target.value as EpField['kind'] })}>
                  <option value="number">{t('q6.kindNumber')}</option><option value="length">{t('q6.kindLength')}</option><option value="enum">{t('q6.kindEnum')}</option>
                </select>
              </Td>
              <Td>{f.kind !== 'enum' && <NumberInput label={t('q6.min')} disabled={disabled} value={f.min} onChange={(v) => upd(i, { min: v })} />}</Td>
              <Td>{f.kind !== 'enum' && <NumberInput label={t('q6.max')} disabled={disabled} value={f.max} onChange={(v) => upd(i, { max: v })} />}</Td>
              <Td>{f.kind === 'number' && <NumberInput label={t('q6.step')} disabled={disabled} value={f.step ?? 1} min={0} step={0.01} onChange={(v) => upd(i, { step: v && v > 0 ? v : 1 })} />}</Td>
              <Td>
                <div className="flex flex-col gap-1">
                  {f.kind === 'enum' && <input aria-label={t('q6.validValues')} className="w-input" disabled={disabled} placeholder={`${t('q6.validValues')} (${t('q6.commaHint')})`} value={(f.values ?? []).join(', ')} onChange={(e) => upd(i, { values: splitList(e.target.value) })} />}
                  <input aria-label={t('q6.invalidValues')} className="w-input" disabled={disabled} placeholder={`${t('q6.invalidValues')} (${t('q6.commaHint')})`} value={(f.invalid ?? []).join(', ')} onChange={(e) => upd(i, { invalid: splitList(e.target.value) })} />
                </div>
              </Td>
              <Td><input type="checkbox" aria-label={t('q6.required')} disabled={disabled} checked={!!f.required} onChange={(e) => upd(i, { required: e.target.checked })} /></Td>
              <Td>{!disabled && m.fields.length > 1 && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('q6.remove')} onClick={() => set({ ...m, fields: m.fields.filter((_, k) => k !== i) })}><X size={13} /></button>}</Td>
            </tr>
          ))}
        </tbody>
      </Tbl>
      <div className="flex flex-wrap items-end gap-3">
        {!disabled && <button type="button" className="w-btn w-btn-sm" onClick={() => set({ ...m, fields: [...m.fields, { name: `field${m.fields.length + 1}`, kind: 'number', min: 1, max: 10, step: 1 }] })}><Plus size={13} /> {t('q6.addField')}</button>}
        <Labeled label={t('q6.bva')}>
          <Segmented<'2' | '3'> label={t('q6.bva')} disabled={disabled} value={String(m.bva) as '2' | '3'} onChange={(v) => set({ ...m, bva: Number(v) as 2 | 3 })} options={[{ value: '2', label: t('q6.bva2') }, { value: '3', label: t('q6.bva3') }]} />
        </Labeled>
        <Labeled label={t('q6.validOutcome')} className="w-[260px]"><input className="w-input" disabled={disabled} value={m.validOutcome} onChange={(e) => set({ ...m, validOutcome: e.target.value })} /></Labeled>
      </div>
    </div>
  );
}

function ListEditor({ label, items, onChange, addLabel, disabled }: { label: string; items: string[]; onChange: (v: string[]) => void; addLabel: string; disabled: boolean }) {
  const { t } = useWT();
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1 text-[12px] font-medium text-[var(--w-text-2)]">{label}</legend>
      {items.map((c, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="w-6 text-right font-mono text-[11.5px] text-[var(--w-text-3)]">{i + 1}</span>
          <input aria-label={`${label} ${i + 1}`} className="w-input" disabled={disabled} value={c} onChange={(e) => onChange(items.map((x, k) => (k === i ? e.target.value : x)))} />
          {!disabled && items.length > 1 && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('q6.remove')} onClick={() => onChange(items.filter((_, k) => k !== i))}><X size={13} /></button>}
        </div>
      ))}
      {!disabled && <button type="button" className="w-btn w-btn-sm self-start" onClick={() => onChange([...items, ''])}><Plus size={13} /> {addLabel}</button>}
    </fieldset>
  );
}

function DtEditor({ m, set, disabled }: { m: Extract<Model, { technique: 'DECISION_TABLE' }>; set: (m: Model) => void; disabled: boolean }) {
  const { t } = useWT();
  const n = Math.min(m.conditions.length, 10);
  const keys = useMemo(() => Array.from({ length: 2 ** n }, (_, i) => Array.from({ length: n }, (_, b) => ((i >> (n - 1 - b)) & 1 ? 'F' : 'T')).join('')), [n]);
  const toggle = (key: string, a: number) => {
    const cur = new Set(m.outcomes[key] ?? []);
    if (cur.has(a)) cur.delete(a); else cur.add(a);
    set({ ...m, outcomes: { ...m.outcomes, [key]: [...cur].sort() } });
  };
  // Đổi số điều kiện ⇒ khoá luật cũ không còn khớp độ dài; giữ lại phần khớp.
  const setConds = (c: string[]) => set({ ...m, conditions: c, outcomes: Object.fromEntries(Object.entries(m.outcomes).filter(([k]) => k.length === c.length)), impossible: m.impossible.filter((k) => k.length === c.length) });
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ListEditor label={t('q6.conditions')} items={m.conditions} onChange={setConds} addLabel={t('q6.addCondition')} disabled={disabled} />
        <ListEditor label={t('q6.actions')} items={m.actions} onChange={(a) => set({ ...m, actions: a, outcomes: Object.fromEntries(Object.entries(m.outcomes).map(([k, v]) => [k, v.filter((x) => x < a.length)])) })} addLabel={t('q6.addAction')} disabled={disabled} />
      </div>
      <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" disabled={disabled} checked={m.collapse} onChange={(e) => set({ ...m, collapse: e.target.checked })} /> {t('q6.collapse')}</label>
      {n > 0 && n <= 6 && (
        <Tbl minWidth={200 + keys.length * 46} label={t('q6.ruleTable')}>
          <thead><tr><Th w={200}>{t('q6.conditions')}</Th>{keys.map((k, i) => <Th key={k} w={46} className="text-center">R{i + 1}</Th>)}</tr></thead>
          <tbody>
            {m.conditions.map((c, ci) => (
              <tr key={ci}><Td className="text-[12.5px]">{c || `C${ci + 1}`}</Td>{keys.map((k) => <Td key={k} className="text-center font-mono text-[12px]">{k[ci] === 'T' ? t('q6.yes') : t('q6.no')}</Td>)}</tr>
            ))}
            {m.actions.map((a, ai) => (
              <tr key={`a${ai}`}>
                <Td className="text-[12.5px] font-medium">{a || `A${ai + 1}`}</Td>
                {keys.map((k) => (
                  <Td key={k} className="text-center">
                    <input type="checkbox" aria-label={`${a} · ${k}`} disabled={disabled || m.impossible.includes(k)} checked={(m.outcomes[k] ?? []).includes(ai)} onChange={() => toggle(k, ai)} />
                  </Td>
                ))}
              </tr>
            ))}
            <tr>
              <Td className="text-[12px] text-[var(--w-text-3)]">{t('q6.impossible')}</Td>
              {keys.map((k) => <Td key={k} className="text-center"><input type="checkbox" aria-label={`${t('q6.impossible')} ${k}`} disabled={disabled} checked={m.impossible.includes(k)} onChange={(e) => set({ ...m, impossible: e.target.checked ? [...m.impossible, k] : m.impossible.filter((x) => x !== k) })} /></Td>)}
            </tr>
          </tbody>
        </Tbl>
      )}
    </div>
  );
}

function StEditor({ m, set, disabled }: { m: Extract<Model, { technique: 'STATE_TRANSITION' }>; set: (m: Model) => void; disabled: boolean }) {
  const { t } = useWT();
  const upd = (i: number, p: Partial<Extract<Model, { technique: 'STATE_TRANSITION' }>['transitions'][number]>) => set({ ...m, transitions: m.transitions.map((x, k) => (k === i ? { ...x, ...p } : x)) });
  const opts = m.states.map((s) => <option key={s} value={s}>{s}</option>);
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
        <Labeled label={t('q6.states')} hint={t('q6.statesHint')}><input className="w-input" disabled={disabled} value={m.states.join(', ')} onChange={(e) => set({ ...m, states: splitList(e.target.value) })} /></Labeled>
        <Labeled label={t('q6.initialState')}><select className="w-input" disabled={disabled} value={m.initial} onChange={(e) => set({ ...m, initial: e.target.value })}>{opts}</select></Labeled>
      </div>
      <Tbl minWidth={760} label={t('q6.transitions')}>
        <thead><tr><Th w={150}>{t('q6.from')}</Th><Th w={150}>{t('q6.event')}</Th><Th w={150}>{t('q6.to')}</Th><Th>{t('q6.guard')}</Th><Th>{t('q6.action')}</Th><Th w={40} /></tr></thead>
        <tbody>
          {m.transitions.map((x, i) => (
            <tr key={i}>
              <Td><select aria-label={t('q6.from')} className="w-input" disabled={disabled} value={x.from} onChange={(e) => upd(i, { from: e.target.value })}>{opts}</select></Td>
              <Td><input aria-label={t('q6.event')} className="w-input" disabled={disabled} value={x.event} onChange={(e) => upd(i, { event: e.target.value })} /></Td>
              <Td><select aria-label={t('q6.to')} className="w-input" disabled={disabled} value={x.to} onChange={(e) => upd(i, { to: e.target.value })}>{opts}</select></Td>
              <Td><input aria-label={t('q6.guard')} className="w-input" disabled={disabled} value={x.guard ?? ''} onChange={(e) => upd(i, { guard: e.target.value || null })} /></Td>
              <Td><input aria-label={t('q6.action')} className="w-input" disabled={disabled} value={x.action ?? ''} onChange={(e) => upd(i, { action: e.target.value || null })} /></Td>
              <Td>{!disabled && m.transitions.length > 1 && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('q6.remove')} onClick={() => set({ ...m, transitions: m.transitions.filter((_, k) => k !== i) })}><X size={13} /></button>}</Td>
            </tr>
          ))}
        </tbody>
      </Tbl>
      <div className="flex flex-wrap items-center gap-3">
        {!disabled && <button type="button" className="w-btn w-btn-sm" onClick={() => set({ ...m, transitions: [...m.transitions, { from: m.states[0] ?? '', event: 'event', to: m.states[1] ?? m.states[0] ?? '' }] })}><Plus size={13} /> {t('q6.addTransition')}</button>}
        <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" disabled={disabled} checked={m.invalid} onChange={(e) => set({ ...m, invalid: e.target.checked })} /> {t('q6.invalidTransitions')}</label>
      </div>
    </div>
  );
}

function PwEditor({ m, set, disabled }: { m: Extract<Model, { technique: 'PAIRWISE' }>; set: (m: Model) => void; disabled: boolean }) {
  const { t } = useWT();
  return (
    <div className="flex flex-col gap-3">
      <Tbl minWidth={560} label={t('q6.parameters')}>
        <thead><tr><Th w={180}>{t('q6.parameters')}</Th><Th>{t('q6.values')} ({t('q6.commaHint')})</Th><Th w={40} /></tr></thead>
        <tbody>
          {m.parameters.map((p, i) => (
            <tr key={i}>
              <Td><input aria-label={t('q6.parameters')} className="w-input" disabled={disabled} value={p.name} onChange={(e) => set({ ...m, parameters: m.parameters.map((x, k) => (k === i ? { ...x, name: e.target.value } : x)) })} /></Td>
              <Td><input aria-label={t('q6.values')} className="w-input" disabled={disabled} value={p.values.join(', ')} onChange={(e) => set({ ...m, parameters: m.parameters.map((x, k) => (k === i ? { ...x, values: splitList(e.target.value) } : x)) })} /></Td>
              <Td>{!disabled && m.parameters.length > 2 && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('q6.remove')} onClick={() => set({ ...m, parameters: m.parameters.filter((_, k) => k !== i) })}><X size={13} /></button>}</Td>
            </tr>
          ))}
        </tbody>
      </Tbl>
      <div className="flex flex-wrap items-end gap-3">
        {!disabled && <button type="button" className="w-btn w-btn-sm" onClick={() => set({ ...m, parameters: [...m.parameters, { name: `P${m.parameters.length + 1}`, values: ['a', 'b'] }] })}><Plus size={13} /> {t('q6.addParameter')}</button>}
        <Labeled label={t('q6.expectedResult')} className="w-[280px]"><input className="w-input" disabled={disabled} value={m.expected} onChange={(e) => set({ ...m, expected: e.target.value })} /></Labeled>
      </div>
    </div>
  );
}

// ─── Kết quả sinh ra ─────────────────────────────────────────────

const TYPE_TONE = { N: 'green', A: 'red', B: 'yellow' } as const;

function Preview({ result, error, technique }: { result?: DesignResult; error: string | null; technique: Technique }) {
  const { t } = useWT();
  if (error) return <div className="rounded-[var(--w-radius)] border border-[var(--w-border)] px-3 py-2 text-[12.5px] text-[var(--w-red-text)]" role="alert">{t('q6.previewError', { e: error })}</div>;
  if (!result) return <PageLoading rows={3} />;
  const table = result.table as Record<string, unknown>;
  return (
    <Card title={t('q6.generated')} testId="q6-design-preview"
      desc={<>
        {t('q6.coverage', { c: result.coverage.covered, t: result.coverage.total, l: result.coverage.label })}
        {technique === 'PAIRWISE' && ` · ${t('q6.pairsReduction', { r: Number(table.rows), e: Number(table.exhaustive), p: Number(table.reduction) })}`}
      </>}
    >
      {result.warnings.length > 0 && <ul className="mb-2 list-disc pl-5 text-[12.5px] text-[var(--w-orange-text)]">{result.warnings.map((w) => <li key={w}>{w}</li>)}</ul>}
      {technique === 'EP_BVA' && Array.isArray(result.table) && (
        <details className="mb-3">
          <summary className="cursor-pointer text-[12.5px] font-medium">{t('q6.partitions')}</summary>
          <ul className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            {(result.table as Array<{ field: string; classes: Array<{ label: string; valid: boolean; boundary: boolean; sample: string }> }>).map((f) => (
              <li key={f.field} className="rounded-[6px] border border-[var(--w-border)] p-2 text-[12px]">
                <div className="mb-1 font-semibold">{f.field}</div>
                {f.classes.map((c, i) => <div key={i} className="flex gap-2"><Badge tone={c.valid ? 'green' : 'red'}>{c.valid ? t('q6.valid') : t('q6.invalid')}</Badge>{c.boundary && <Badge tone="yellow">BVA</Badge>}<span>{c.label}</span></div>)}
              </li>
            ))}
          </ul>
        </details>
      )}
      {technique === 'STATE_TRANSITION' && table?.rows ? (
        <details className="mb-3" open>
          <summary className="cursor-pointer text-[12.5px] font-medium">{t('q6.stateTable')}</summary>
          <div className="mt-2"><Tbl minWidth={400} label={t('q6.stateTable')}>
            <thead><tr><Th>{t('q6.states')}</Th>{(table.events as string[]).map((e) => <Th key={e}>{e}</Th>)}</tr></thead>
            <tbody>{(table.rows as Array<{ state: string; cells: Array<string | null> }>).map((r) => <tr key={r.state}><Td className="font-medium">{r.state}</Td>{r.cells.map((c, i) => <Td key={i} className="text-[12px]">{c ?? '—'}</Td>)}</tr>)}</tbody>
          </Tbl></div>
        </details>
      ) : null}
      <Tbl minWidth={760} maxHeight={480} label={t('q6.generated')}>
        <thead><tr><Th w={70}>ID</Th><Th w={90}>{t('q6.caseType')}</Th><Th>{t('q6.colTitle')}</Th><Th>{t('q6.inputs')}</Th><Th>{t('q6.expected')}</Th></tr></thead>
        <tbody>
          {result.cases.map((c: DesignCase) => (
            <tr key={c.id}>
              <Td className="font-mono text-[12px]">{c.id}</Td>
              <Td><Badge tone={TYPE_TONE[c.type]}>{t(`q6.type${c.type}` as WKey)}</Badge></Td>
              <Td className="text-[12.5px]">{c.title}{c.steps?.length ? <div className="mt-0.5 text-[11.5px] text-[var(--w-text-3)]">{c.steps.map((s) => s.action).join(' → ')}</div> : null}</Td>
              <Td className="font-mono text-[11.5px]">{Object.entries(c.inputs).map(([k, v]) => <div key={k}>{k} = {v === '' ? '(empty)' : v.length > 40 ? `${v.slice(0, 37)}…` : v}</div>)}</Td>
              <Td className="text-[12.5px]">{c.expected}</Td>
            </tr>
          ))}
        </tbody>
      </Tbl>
    </Card>
  );
}

function ExportDialog({ pid, num, cases, onClose, onDone }: { pid: number; num: number; cases: DesignCase[]; onClose: () => void; onDone: () => void }) {
  const { t } = useWT();
  const [target, setTarget] = useState<'XRAY' | 'UNIT'>('XRAY');
  const [picked, setPicked] = useState<Set<string>>(() => new Set(cases.map((c) => c.id)));
  const [level, setLevel] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [moduleName, setModuleName] = useState('');
  const [methodName, setMethodName] = useState('');
  const go = useMutation({
    mutationFn: () => q6Api.exportDesign(pid, num, { target, caseIds: [...picked], level: level || null, testType: type || null, moduleName: moduleName || null, methodName: methodName || null }),
    onSuccess: (r) => { toast.success(target === 'XRAY' ? t('q6.exportedXray', { n: r.numbers?.length ?? 0, k: (r.keys ?? []).slice(0, 3).join(', ') }) : t('q6.exportedUnit', { n: r.cases ?? 0 })); onDone(); },
    onError: (e) => toast.error(workError(e)),
  });
  return (
    <Dialog open onClose={onClose} title={t('q6.exportTitle')} width={620}
      footer={<><button type="button" className="w-btn w-btn-sm" onClick={onClose}>{t('common.cancel')}</button><button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={!picked.size || go.isPending} onClick={() => go.mutate()} data-testid="q6-export-go">{t('q6.exportCases')}</button></>}>
      <div className="flex flex-col gap-3">
        <Labeled label={t('q6.exportTarget')}>
          <Segmented<'XRAY' | 'UNIT'> label={t('q6.exportTarget')} value={target} onChange={setTarget} options={[{ value: 'XRAY', label: t('q6.targetXRAY') }, { value: 'UNIT', label: t('q6.targetUNIT') }]} />
        </Labeled>
        {target === 'XRAY' ? (
          <div className="grid grid-cols-2 gap-3">
            <Labeled label={t('q6.level')}><select className="w-input" value={level} onChange={(e) => setLevel(e.target.value)}><option value="">{t('q6.none')}</option>{TEST_LEVELS.map((l) => <option key={l} value={l}>{t(`q6.lv${l}` as WKey)}</option>)}</select></Labeled>
            <Labeled label={t('q6.testType')}><select className="w-input" value={type} onChange={(e) => setType(e.target.value)}><option value="">{t('q6.none')}</option>{TEST_TYPES.map((l) => <option key={l} value={l}>{t(`q6.tt${l}` as WKey)}</option>)}</select></Labeled>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Labeled label={t('q6.moduleName')}><input className="w-input" value={moduleName} onChange={(e) => setModuleName(e.target.value)} placeholder="UserService" /></Labeled>
            <Labeled label={t('q6.methodName')}><input className="w-input" value={methodName} onChange={(e) => setMethodName(e.target.value)} placeholder="register" /></Labeled>
          </div>
        )}
        <div className="flex items-center justify-between text-[12.5px]">
          <span>{t('q6.selectedCases', { n: picked.size })}</span>
          <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => setPicked(picked.size === cases.length ? new Set() : new Set(cases.map((c) => c.id)))}>{t('q6.selectAll')}</button>
        </div>
        <ul className="max-h-[280px] overflow-auto rounded-[6px] border border-[var(--w-border)]">
          {cases.map((c) => (
            <li key={c.id} className="border-b border-[var(--w-border)] px-2 py-1 last:border-b-0">
              <label className="flex items-start gap-2 text-[12.5px]">
                <input type="checkbox" className="mt-0.5" checked={picked.has(c.id)} onChange={(e) => { const s = new Set(picked); if (e.target.checked) s.add(c.id); else s.delete(c.id); setPicked(s); }} />
                <span className="font-mono text-[11.5px] text-[var(--w-text-3)]">{c.id}</span><span>{c.title}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </Dialog>
  );
}
