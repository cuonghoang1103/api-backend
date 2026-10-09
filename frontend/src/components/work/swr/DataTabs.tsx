'use client';

/**
 * CTW đợt 4b (R16) — Glossary + Data Dictionary (Deliverable 5). Glossary: một thuật ngữ một nghĩa, ghi các tên gọi khác
 * KHÔNG được dùng (chặn "năm bộ từ vựng" của bài A.4). Data Dictionary đúng 5 cột mẫu Wiegers; cấu trúc ghi bằng ký hiệu
 * "A + B + (C) + 1:n{D}"; danh từ trong luồng UC chưa có mục (liên kết #4) hiện ngay để thêm hoặc bỏ qua; Diagram Studio
 * vẽ ERD từ chính các cấu trúc này.
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AlertTriangle, FileSpreadsheet, Plus, Shapes } from 'lucide-react';
import { toast } from 'sonner';
import { workError } from '@/lib/work-api';
import { workSwrApi, workSwrKeys, type DataElement, type GlossaryTerm } from '@/lib/work-swr-api';
import { wt } from '@/components/work/i18n';
import { Dialog, EmptyState, Field, PageLoading, Spinner } from '../ui';
import { Chip, Clip, downloadXlsx, RowActions, TableFrame, TabIntro, TD, TextArea, TH, useSwrRefresh } from './shared';

// ─── Glossary ────────────────────────────────────────────────────

export function GlossaryTab({ pid }: { pid: number }) {
  const refresh = useSwrRefresh(pid);
  const q = useQuery({ queryKey: workSwrKeys.glossary(pid), queryFn: () => workSwrApi.glossary(pid) });
  const [edit, setEdit] = useState<GlossaryTerm | 'new' | null>(null);
  const [f, setF] = useState({ term: '', definition: '', aliases: '', source: '' });
  useEffect(() => { if (edit) setF(edit === 'new' ? { term: '', definition: '', aliases: '', source: '' } : { term: edit.term, definition: edit.definition, aliases: edit.aliases.join(', '), source: edit.source ?? '' }); }, [edit]);
  const save = useMutation({
    mutationFn: () => {
      const body = { term: f.term.trim(), definition: f.definition.trim(), aliases: f.aliases.split(',').map((x) => x.trim()).filter(Boolean), source: f.source.trim() || null };
      return edit === 'new' ? workSwrApi.createTerm(pid, body) : workSwrApi.updateTerm(pid, (edit as GlossaryTerm).id, body);
    },
    onSuccess: () => { refresh(); setEdit(null); toast.success(wt('common.saved')); },
    onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))),
  });
  const del = useMutation({ mutationFn: (id: number) => workSwrApi.deleteTerm(pid, id), onSuccess: () => { refresh(); toast.success(wt('swr.deleted')); }, onError: (e) => toast.error(workError(e, wt('common.couldNotDelete'))) });
  if (q.isLoading) return <PageLoading rows={5} />;
  if (!q.data) return <EmptyState title={wt('swr.loadFailed')} body={q.error ? workError(q.error) : undefined} />;
  const data = q.data;
  return (
    <div className="flex flex-col gap-3">
      <TabIntro text={wt('swr.glossaryIntro')}>
        <button type="button" className="w-btn w-btn-sm" onClick={() => downloadXlsx(pid, 'glossary')}><FileSpreadsheet size={13} /> .xlsx</button>
        {data.canEdit && <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => setEdit('new')}><Plus size={14} /> {wt('swr.addTerm')}</button>}
      </TabIntro>
      {data.clashes.length > 0 && (
        <p role="status" className="flex items-start gap-1.5 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] p-2.5 text-[12.5px] text-[var(--w-orange-text)]">
          <AlertTriangle size={14} className="mt-[1px] shrink-0" aria-hidden="true" />
          {wt('swr.clashes', { list: data.clashes.map((c) => `"${c.word}" (${c.terms.join(' / ')})`).join(', ') })}
        </p>
      )}
      {!data.terms.length ? <EmptyState title={wt('swr.noTerms')} body={wt('swr.noTermsBody')} /> : (
        <TableFrame label={wt('swr.tabGlossary')}>
          <table className="w-full min-w-[760px] border-separate border-spacing-0">
            <thead><tr>{[wt('swr.hTerm'), wt('swr.hDefinition'), wt('swr.hAliases'), wt('swr.hSource'), ''].map((h, i) => <th key={i} scope="col" className={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {data.terms.map((t) => (
                <tr key={t.id} className="hover:bg-[var(--w-hover)]">
                  <td className={`${TD} font-medium`}>{t.term}</td>
                  <td className={`${TD} max-w-[460px]`}><Clip text={t.definition} lines={3} /></td>
                  <td className={TD}>{t.aliases.length ? t.aliases.map((a) => <span key={a} className="mr-1"><Chip tone="muted">{a}</Chip></span>) : '—'}</td>
                  <td className={TD}>{t.source ?? '—'}</td>
                  <td className={`${TD} w-20`}>{data.canEdit && <RowActions label={t.term} onEdit={() => setEdit(t)} onDelete={() => window.confirm(wt('swr.deleteQ', { name: t.term })) && del.mutate(t.id)} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableFrame>
      )}
      <Dialog open={!!edit} onClose={() => setEdit(null)} title={edit === 'new' ? wt('swr.addTerm') : `${wt('common.edit')} ${(edit as GlossaryTerm | null)?.term ?? ''}`} width={560}
        footer={<><button type="button" className="w-btn" onClick={() => setEdit(null)}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={!f.term.trim() || !f.definition.trim() || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={12} />} {wt('common.save')}</button></>}>
        <Field label={wt('swr.hTerm')}><input className="w-input" autoFocus value={f.term} maxLength={160} placeholder="Fulfillment Center" onChange={(e) => setF({ ...f, term: e.target.value })} /></Field>
        <TextArea id="term-def" label={wt('swr.hDefinition')} value={f.definition} rows={3} onChange={(v) => setF({ ...f, definition: v })} />
        <Field label={wt('swr.hAliases')} hint={wt('swr.aliasesHint')}><input className="w-input" value={f.aliases} placeholder="FC, warehouse" onChange={(e) => setF({ ...f, aliases: e.target.value })} /></Field>
        <Field label={wt('swr.hSource')}><input className="w-input" value={f.source} maxLength={200} placeholder={wt('swr.sourcePh')} onChange={(e) => setF({ ...f, source: e.target.value })} /></Field>
      </Dialog>
    </div>
  );
}

// ─── Data Dictionary ─────────────────────────────────────────────

const EMPTY_EL = { name: '', description: '', kind: 'PRIMITIVE' as 'PRIMITIVE' | 'STRUCTURE', composition: '', dataType: '', length: '', values: '', isKey: false };

export function DictionaryTab({ pid, base }: { pid: number; base: string }) {
  const refresh = useSwrRefresh(pid);
  const q = useQuery({ queryKey: workSwrKeys.dictionary(pid), queryFn: () => workSwrApi.dictionary(pid) });
  const [edit, setEdit] = useState<DataElement | 'new' | null>(null);
  const [prefill, setPrefill] = useState('');
  const [f, setF] = useState(EMPTY_EL);
  useEffect(() => {
    if (!edit) return;
    setF(edit === 'new' ? { ...EMPTY_EL, name: prefill } : { name: edit.name, description: edit.description ?? '', kind: edit.kind, composition: edit.composition ?? '', dataType: edit.dataType ?? '', length: edit.length ?? '', values: edit.values ?? '', isKey: edit.isKey });
  }, [edit, prefill]);
  const save = useMutation({
    mutationFn: () => {
      const s = f.kind === 'STRUCTURE';
      const body = { name: f.name.trim(), description: f.description || null, kind: f.kind, composition: s ? f.composition || null : null, dataType: s ? null : f.dataType || null, length: s ? null : f.length || null, values: s ? null : f.values || null, isKey: !s && f.isKey };
      return edit === 'new' ? workSwrApi.createElement(pid, body) : workSwrApi.updateElement(pid, (edit as DataElement).id, body);
    },
    onSuccess: () => { refresh(); setEdit(null); toast.success(wt('common.saved')); },
    onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))),
  });
  const del = useMutation({ mutationFn: (id: number) => workSwrApi.deleteElement(pid, id), onSuccess: () => { refresh(); toast.success(wt('swr.deleted')); }, onError: (e) => toast.error(workError(e, wt('common.couldNotDelete'))) });
  const ignore = useMutation({ mutationFn: (noun: string) => workSwrApi.settings(pid, { ignoreNoun: noun }), onSuccess: () => refresh(), onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))) });
  if (q.isLoading) return <PageLoading rows={5} />;
  if (!q.data) return <EmptyState title={wt('swr.loadFailed')} body={q.error ? workError(q.error) : undefined} />;
  const data = q.data;
  const startWith = (name: string) => { setPrefill(name); setEdit('new'); };
  return (
    <div className="flex flex-col gap-3">
      <TabIntro text={wt('swr.ddIntro')}>
        {data.erd > 0 && <Link className="w-btn w-btn-sm" href={`${base}/diagrams`}><Shapes size={13} /> {wt('swr.drawErd')}</Link>}
        <button type="button" className="w-btn w-btn-sm" onClick={() => downloadXlsx(pid, 'dictionary')}><FileSpreadsheet size={13} /> .xlsx</button>
        {data.canEdit && <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => startWith('')}><Plus size={14} /> {wt('swr.addElement')}</button>}
      </TabIntro>

      {(data.missingNouns.length > 0 || data.undefinedComponents.length > 0) && (
        <section aria-labelledby="dd-gaps-h" className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-3">
          <h2 id="dd-gaps-h" className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-[var(--w-orange-text)]"><AlertTriangle size={14} aria-hidden="true" /> {wt('swr.ddGaps')}</h2>
          {data.undefinedComponents.length > 0 && (
            <p className="mb-2 text-[12.5px]">{wt('swr.undefinedComponents')}{' '}
              {data.undefinedComponents.map((c) => <button key={`${c.structure}|${c.component}`} type="button" disabled={!data.canEdit} className="mr-1.5 text-[var(--w-accent-text)] hover:underline disabled:no-underline" title={wt('swr.inStructure', { s: c.structure })} onClick={() => startWith(c.component)}>{c.component}</button>)}
            </p>
          )}
          {data.missingNouns.length > 0 && (
            <ul className="flex flex-col gap-1 text-[12.5px]">
              {data.missingNouns.slice(0, 40).map((n) => (
                <li key={n.noun} className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{n.noun}</span><span className="text-[var(--w-text-2)]">{n.useCases.join(', ')}</span>
                  {data.canEdit && <>
                    <button type="button" className="w-btn w-btn-sm" onClick={() => startWith(n.noun)}>{wt('swr.addToDd')}</button>
                    <button type="button" className="w-btn w-btn-ghost w-btn-sm" disabled={ignore.isPending} onClick={() => ignore.mutate(n.noun)}>{wt('swr.notData')}</button>
                  </>}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {!data.elements.length ? <EmptyState title={wt('swr.noElements')} body={wt('swr.noElementsBody')} /> : (
        <TableFrame label={wt('swr.tabDictionary')}>
          <table className="w-full min-w-[980px] border-separate border-spacing-0">
            <thead><tr>{[wt('swr.hElement'), wt('common.description'), wt('swr.hComposition'), wt('swr.hLength'), wt('swr.hValues'), wt('swr.hUsedIn'), ''].map((h, i) => <th key={i} scope="col" className={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {data.elements.map((e) => (
                <tr key={e.id} className="hover:bg-[var(--w-hover)]">
                  <td className={`${TD} font-medium`}>{e.name}{e.isKey && <span className="ml-1"><Chip tone="accent">{wt('swr.key')}</Chip></span>}{e.kind === 'STRUCTURE' && <span className="ml-1"><Chip tone="blue">{wt('swr.structure')}</Chip></span>}</td>
                  <td className={`${TD} max-w-[300px]`}><Clip text={e.description} /></td>
                  <td className={`${TD} max-w-[300px] font-mono text-[12px]`}>{e.kind === 'STRUCTURE' ? <Clip text={e.composition} lines={3} /> : (e.dataType ?? '—')}</td>
                  <td className={`${TD} tabular-nums`}>{e.kind === 'STRUCTURE' ? '' : e.length ?? '—'}</td>
                  <td className={`${TD} max-w-[220px]`}>{e.kind === 'STRUCTURE' ? '' : <Clip text={e.values} />}</td>
                  <td className={`${TD} font-mono text-[12px]`}>{e.usedIn.join(', ') || '—'}</td>
                  <td className={`${TD} w-20`}>{data.canEdit && <RowActions label={e.name} onEdit={() => setEdit(e)} onDelete={() => window.confirm(wt('swr.deleteQ', { name: e.name })) && del.mutate(e.id)} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableFrame>
      )}

      <Dialog open={!!edit} onClose={() => setEdit(null)} title={edit === 'new' ? wt('swr.addElement') : `${wt('common.edit')} ${(edit as DataElement | null)?.name ?? ''}`} width={600}
        footer={<><button type="button" className="w-btn" onClick={() => setEdit(null)}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={!f.name.trim() || (f.kind === 'STRUCTURE' && !f.composition.trim()) || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={12} />} {wt('common.save')}</button></>}>
        <Field label={wt('swr.hElement')}><input className="w-input" autoFocus value={f.name} maxLength={120} placeholder="Request ID" onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <Field label={wt('swr.kind')}>
          <select className="w-input" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value as 'PRIMITIVE' | 'STRUCTURE' })}>
            <option value="PRIMITIVE">{wt('swr.primitiveOpt')}</option><option value="STRUCTURE">{wt('swr.structureOpt')}</option>
          </select>
        </Field>
        <TextArea id="el-desc" label={wt('common.description')} value={f.description} rows={2} onChange={(v) => setF({ ...f, description: v })} />
        {f.kind === 'STRUCTURE' ? (
          <TextArea id="el-comp" label={wt('swr.hComposition')} value={f.composition} rows={3} mono placeholder="Request ID + Requester + (Vendor) + 1:10{Requested Chemical}" hint={wt('swr.compositionHint')} onChange={(v) => setF({ ...f, composition: v })} />
        ) : (
          <div className="grid gap-x-3 sm:grid-cols-3">
            <Field label={wt('swr.hDataType')}><input className="w-input" value={f.dataType} maxLength={60} placeholder="integer" onChange={(e) => setF({ ...f, dataType: e.target.value })} /></Field>
            <Field label={wt('swr.hLength')}><input className="w-input" value={f.length} maxLength={20} placeholder="8" onChange={(e) => setF({ ...f, length: e.target.value })} /></Field>
            <label className="mb-4 flex items-center gap-2 self-end text-[13px]"><input type="checkbox" checked={f.isKey} onChange={(e) => setF({ ...f, isKey: e.target.checked })} /> {wt('swr.isKey')}</label>
          </div>
        )}
        {f.kind === 'PRIMITIVE' && <TextArea id="el-values" label={wt('swr.hValues')} value={f.values} rows={2} placeholder={wt('swr.valuesPh')} onChange={(v) => setF({ ...f, values: v })} />}
      </Dialog>
    </div>
  );
}
