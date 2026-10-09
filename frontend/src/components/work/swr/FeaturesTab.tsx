'use client';

/**
 * CTW đợt 4b (R5) — Sổ Feature FE-n (Vision & Scope §2.1): mã tự tăng, phạm vi (trong / ngoài ⇒ §2.4), bản phát hành,
 * ưu tiên, epic; liên kết tới UC (liên kết #1) và thẻ yêu cầu (liên kết #3). UC ghi "FE-3" hoặc đúng tên feature ở ô
 * Feature cũng được tính (nối mềm — hiện chữ "auto").
 */

import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FileSpreadsheet, Link2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { workError } from '@/lib/work-api';
import { workSwrApi, workSwrKeys, type Feature, type P3 } from '@/lib/work-swr-api';
import { wt } from '@/components/work/i18n';
import { Dialog, EmptyState, Field, PageLoading, Spinner } from '../ui';
import { Chip, Clip, downloadXlsx, P3_KEY, RowActions, TableFrame, TabIntro, TD, TextArea, TH, useSwrRefresh } from './shared';

const EMPTY = { name: '', description: '', scope: 'IN' as 'IN' | 'OUT', priority: '' as '' | P3, versionId: '', epic: '' };

export default function FeaturesTab({ pid, onOpenIssue }: { pid: number; onOpenIssue: (n: number) => void }) {
  const refresh = useSwrRefresh(pid);
  const q = useQuery({ queryKey: workSwrKeys.features(pid), queryFn: () => workSwrApi.features(pid) });
  const [edit, setEdit] = useState<Feature | 'new' | null>(null);
  const [f, setF] = useState(EMPTY);
  const [linkFor, setLinkFor] = useState<Feature | null>(null);
  const [link, setLink] = useState({ kind: 'UC' as 'UC' | 'ISSUE', ref: '' });
  useEffect(() => {
    if (!edit) return;
    setF(edit === 'new' ? EMPTY : { name: edit.name, description: edit.description ?? '', scope: edit.scope, priority: edit.priority ?? '', versionId: edit.versionId ? String(edit.versionId) : '', epic: edit.epic?.key ?? '' });
  }, [edit]);
  const save = useMutation({
    mutationFn: () => {
      const body = { name: f.name.trim(), description: f.description || null, scope: f.scope, priority: f.priority || null, versionId: f.versionId ? Number(f.versionId) : null, epic: f.epic.trim() || null };
      return edit === 'new' ? workSwrApi.createFeature(pid, body) : workSwrApi.updateFeature(pid, (edit as Feature).key, body);
    },
    onSuccess: (r) => { refresh(); setEdit(null); toast.success(wt('swr.savedKey', { key: r.key })); },
    onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))),
  });
  const del = useMutation({ mutationFn: (fe: string) => workSwrApi.deleteFeature(pid, fe), onSuccess: () => { refresh(); toast.success(wt('swr.deleted')); }, onError: (e) => toast.error(workError(e, wt('common.couldNotDelete'))) });
  const addLink = useMutation({
    mutationFn: () => workSwrApi.linkFeature(pid, linkFor!.key, { kind: link.kind, ref: link.ref.trim() }),
    onSuccess: () => { refresh(); setLink({ ...link, ref: '' }); toast.success(wt('swr.linked')); },
    onError: (e) => toast.error(workError(e, wt('swr.linkFailed'))),
  });
  const unlink = useMutation({ mutationFn: (x: { fe: string; id: number }) => workSwrApi.unlinkFeature(pid, x.fe, x.id), onSuccess: () => refresh(), onError: (e) => toast.error(workError(e, wt('swr.linkFailed'))) });

  if (q.isLoading) return <PageLoading rows={5} />;
  if (!q.data) return <EmptyState title={wt('swr.loadFailed')} body={q.error ? workError(q.error) : undefined} />;
  const data = q.data;
  const current = linkFor ? data.features.find((x) => x.id === linkFor.id) ?? linkFor : null;
  return (
    <div className="flex flex-col gap-3">
      <TabIntro text={wt('swr.featuresIntro')}>
        <button type="button" className="w-btn w-btn-sm" onClick={() => downloadXlsx(pid, 'features')}><FileSpreadsheet size={13} /> .xlsx</button>
        {data.canEdit && <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => setEdit('new')}><Plus size={14} /> {wt('swr.addFeature')}</button>}
      </TabIntro>
      {!data.features.length ? <EmptyState title={wt('swr.noFeatures')} body={wt('swr.noFeaturesBody')} /> : (
        <TableFrame label={wt('swr.tabFeatures')}>
          <table className="w-full min-w-[980px] border-separate border-spacing-0">
            <thead><tr>{['ID', wt('swr.hFeature'), wt('swr.hScope'), wt('swr.hRelease'), wt('common.priority'), wt('swr.hUseCases'), wt('swr.hRequirements'), wt('common.epic'), ''].map((h, i) => <th key={i} scope="col" className={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {data.features.map((fe) => (
                <tr key={fe.id} className="hover:bg-[var(--w-hover)]">
                  <td className={`${TD} font-mono text-[12px]`}>{fe.key}</td>
                  <td className={`${TD} max-w-[320px]`}><span className="font-medium">{fe.name}</span><Clip text={fe.description} /></td>
                  <td className={TD}><Chip tone={fe.scope === 'OUT' ? 'muted' : 'green'}>{fe.scope === 'OUT' ? wt('swr.outOfScope') : wt('swr.inScope')}</Chip></td>
                  <td className={TD}>{fe.release ?? <span className="text-[var(--w-text-2)]">{wt('swr.notScheduled')}</span>}</td>
                  <td className={TD}>{fe.priority ? wt(P3_KEY[fe.priority]) : '—'}</td>
                  <td className={`${TD} text-[12px]`}>
                    {fe.useCases.length ? fe.useCases.map((u) => <span key={u.number} className="mr-1.5 inline-block font-mono" title={u.name}>{u.key}{!u.manual && <span className="ml-0.5 text-[var(--w-text-2)]">({wt('swr.auto')})</span>}</span>)
                      : fe.scope === 'OUT' ? '—' : <Chip tone="red">{wt('swr.noUc')}</Chip>}
                  </td>
                  <td className={`${TD} text-[12px]`}>{fe.issues.length ? fe.issues.map((i) => <button key={i.linkId} type="button" className="mr-1.5 font-mono text-[var(--w-accent-text)] hover:underline" title={i.title} onClick={() => onOpenIssue(i.number)}>{i.key}</button>) : '—'}</td>
                  <td className={`${TD} text-[12px]`}>{fe.epic ? <button type="button" className="font-mono text-[var(--w-accent-text)] hover:underline" title={fe.epic.title} onClick={() => onOpenIssue(fe.epic!.number)}>{fe.epic.key}</button> : '—'}</td>
                  <td className={`${TD} w-28`}>
                    {data.canEdit && (
                      <span className="flex justify-end gap-1">
                        <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${wt('swr.links')} ${fe.key}`} title={wt('swr.links')} onClick={() => setLinkFor(fe)}><Link2 size={13} /></button>
                        <RowActions label={fe.key} onEdit={() => setEdit(fe)} onDelete={() => window.confirm(wt('swr.deleteQ', { name: `${fe.key} ${fe.name}` })) && del.mutate(fe.key)} />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableFrame>
      )}

      <Dialog open={!!edit} onClose={() => setEdit(null)} title={edit === 'new' ? wt('swr.addFeature') : `${wt('common.edit')} ${(edit as Feature | null)?.key ?? ''}`} width={560}
        footer={<><button type="button" className="w-btn" onClick={() => setEdit(null)}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={!f.name.trim() || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={12} />} {wt('common.save')}</button></>}>
        <Field label={wt('swr.hFeature')}><input className="w-input" autoFocus value={f.name} maxLength={160} placeholder={wt('swr.featurePh')} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <TextArea id="fe-desc" label={wt('common.description')} value={f.description} rows={3} onChange={(v) => setF({ ...f, description: v })} />
        <div className="grid gap-x-3 sm:grid-cols-2">
          <Field label={wt('swr.hScope')}>
            <select className="w-input" value={f.scope} onChange={(e) => setF({ ...f, scope: e.target.value as 'IN' | 'OUT' })}>
              <option value="IN">{wt('swr.inScope')}</option><option value="OUT">{wt('swr.outOfScopeOpt')}</option>
            </select>
          </Field>
          <Field label={wt('common.priority')}>
            <select className="w-input" value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value as '' | P3 })}>
              <option value="">—</option>{(['HIGH', 'MEDIUM', 'LOW'] as const).map((p) => <option key={p} value={p}>{wt(P3_KEY[p])}</option>)}
            </select>
          </Field>
          <Field label={wt('swr.hRelease')}>
            <select className="w-input" value={f.versionId} onChange={(e) => setF({ ...f, versionId: e.target.value })}>
              <option value="">{wt('swr.notScheduled')}</option>{data.releases.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </Field>
          <Field label={wt('swr.epicOpt')}><input className="w-input" value={f.epic} placeholder={`${data.key}-3`} onChange={(e) => setF({ ...f, epic: e.target.value })} /></Field>
        </div>
      </Dialog>

      <Dialog open={!!current} onClose={() => setLinkFor(null)} title={current ? wt('swr.linksOf', { key: current.key, name: current.name }) : ''} width={560}
        footer={<button type="button" className="w-btn" onClick={() => setLinkFor(null)}>{wt('common.close')}</button>}>
        {current && (
          <>
            <ul className="mb-3 flex flex-col gap-1 text-[13px]">
              {current.useCases.map((u) => (
                <li key={`u${u.number}`} className="flex items-center gap-2"><span className="font-mono">{u.key}</span><span className="flex-1 truncate">{u.name}</span>
                  {u.manual && u.linkId ? <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${wt('common.remove')} ${u.key}`} onClick={() => unlink.mutate({ fe: current.key, id: u.linkId! })}><X size={13} /></button> : <span className="text-[12px] text-[var(--w-text-2)]">{wt('swr.autoHint')}</span>}
                </li>
              ))}
              {current.issues.map((i) => (
                <li key={`i${i.linkId}`} className="flex items-center gap-2"><span className="font-mono">{i.key}</span><span className="flex-1 truncate">{i.title}</span>
                  <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${wt('common.remove')} ${i.key}`} onClick={() => unlink.mutate({ fe: current.key, id: i.linkId })}><X size={13} /></button>
                </li>
              ))}
              {!current.useCases.length && !current.issues.length && <li className="text-[var(--w-text-2)]">{wt('swr.noLinks')}</li>}
            </ul>
            <div className="flex flex-wrap items-end gap-2">
              <Field label={wt('swr.linkTo')}>
                <select className="w-input" value={link.kind} onChange={(e) => setLink({ ...link, kind: e.target.value as 'UC' | 'ISSUE' })}>
                  <option value="UC">{wt('swr.useCaseOpt')}</option><option value="ISSUE">{wt('swr.issueOpt')}</option>
                </select>
              </Field>
              <Field label={wt('swr.refLabel')}><input className="w-input" value={link.ref} placeholder={link.kind === 'UC' ? 'UC-03' : `${data.key}-12`} onChange={(e) => setLink({ ...link, ref: e.target.value })} /></Field>
              <div className="mb-4"><button type="button" className="w-btn w-btn-primary" disabled={!link.ref.trim() || addLink.isPending} onClick={() => addLink.mutate()}>{addLink.isPending && <Spinner size={12} />} {wt('common.add')}</button></div>
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}
