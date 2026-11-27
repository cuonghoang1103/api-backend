'use client';

/**
 * dm5 G2 (27/11/2026) B9 — sổ System Messages (SM-xx): bảng "5.2 System Messages" của Report 3. Thêm/sửa/xoá, gắn UC dùng
 * thông báo, duyệt đề xuất của agent, cảnh báo mã được nhắc trong use case mà sổ chưa có.
 */

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { workError } from '@/lib/work-api';
import { workCtw4Keys, type SrsData } from '@/lib/work-ctw4-api';
import { SM_TYPES, workDm5bApi, workDm5bKeys, type SmType, type SystemMessage } from '@/lib/work-dm5b-api';
import { wt, type WKey } from '@/components/work/i18n';
import { Dialog, EmptyState, Field, PageLoading, Spinner } from '../ui';
import { Chip, Clip, TableFrame, TD, TextArea, TH, UcStatusChip } from './shared';

const TYPE_TONE: Record<SmType, 'red' | 'orange' | 'blue' | 'accent' | 'green'> = { ERROR: 'red', WARNING: 'orange', INFO: 'blue', CONFIRMATION: 'accent', SUCCESS: 'green' };
export const smTypeText = (t: string) => wt(`g2.t_${t}` as WKey);

const EMPTY = { msgType: 'ERROR' as SmType, context: '', text: '', textEn: '', httpStatus: '', useCases: '' };

export default function MessagesTab({ pid, data }: { pid: number; data: SrsData }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: workDm5bKeys.messages(pid), queryFn: () => workDm5bApi.messages(pid) });
  const refresh = () => { qc.invalidateQueries({ queryKey: workDm5bKeys.messages(pid) }); qc.invalidateQueries({ queryKey: workCtw4Keys.srs(pid) }); };
  const [edit, setEdit] = useState<SystemMessage | 'new' | null>(null);
  const [f, setF] = useState(EMPTY);
  useEffect(() => {
    if (!edit) return;
    setF(edit === 'new' ? EMPTY : {
      msgType: edit.msgType, context: edit.context ?? '', text: edit.text, textEn: edit.textEn ?? '',
      httpStatus: edit.httpStatus ? String(edit.httpStatus) : '', useCases: edit.useCases.map((u) => u.key).join(', '),
    });
  }, [edit]);
  const save = useMutation({
    mutationFn: () => {
      const body = {
        msgType: f.msgType, context: f.context.trim() || null, text: f.text.trim(), textEn: f.textEn.trim() || null,
        httpStatus: f.httpStatus.trim() ? Number(f.httpStatus) : null, useCases: f.useCases.split(/[,\s]+/).map((x) => x.trim()).filter(Boolean),
      };
      return edit === 'new' ? workDm5bApi.createMessage(pid, body) : workDm5bApi.updateMessage(pid, (edit as SystemMessage).key, { ...body, version: (edit as SystemMessage).version });
    },
    onSuccess: (r) => { refresh(); setEdit(null); toast.success(wt('srs.savedKey', { key: r.key })); },
    onError: (e) => toast.error(workError(e, wt('g2.smSaveFailed'))),
  });
  const approve = useMutation({ mutationFn: (m: SystemMessage) => workDm5bApi.updateMessage(pid, m.key, { status: m.status === 'PROPOSED' ? 'DRAFT' : 'APPROVED' }), onSuccess: refresh, onError: (e) => toast.error(workError(e, wt('srs.acceptFailed'))) });
  const del = useMutation({ mutationFn: (key: string) => workDm5bApi.deleteMessage(pid, key), onSuccess: () => { refresh(); toast.success(wt('g2.smDeleted')); }, onError: (e) => toast.error(workError(e, wt('common.couldNotDelete'))) });
  if (q.isLoading || !q.data) return <PageLoading />;
  const r = q.data;
  const ucHint = data.useCases.filter((u) => u.status !== 'PROPOSED').map((u) => u.key).slice(0, 12).join(', ');
  return (
    <div className="flex flex-col gap-3" data-testid="req-messages">
      <div className="flex items-center gap-2">
        <p className="flex-1 text-[13px] text-[var(--w-text-2)]">{wt('g2.smIntro')}</p>
        {r.canEdit && <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => setEdit('new')}><Plus size={14} /> {wt('g2.smAdd')}</button>}
      </div>
      {r.unknown.length > 0 && (
        <div role="alert" className="rounded-md border border-[var(--w-red-border,var(--w-border))] bg-[var(--w-red-bg,var(--w-sunken))] px-3 py-2 text-[13px] text-[var(--w-red-text)]">
          {wt('g2.smUnknown', { list: r.unknown.map((u) => `${u.key} (${u.mentionedIn.join(', ')})`).join(' · ') })}
        </div>
      )}
      {!r.items.length ? <EmptyState title={wt('g2.smNone')} body={wt('g2.smNoneBody')} /> : (
        <TableFrame label={wt('g2.tabMessages')}>
          <table className="w-full min-w-[820px] border-separate border-spacing-0">
            <thead><tr>{['ID', wt('g2.smType'), wt('g2.smContext'), wt('g2.smText'), 'Use case', 'HTTP', wt('common.status'), ''].map((h, i) => <th key={i} scope="col" className={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {r.items.map((m) => {
                const used = [...new Set([...m.useCases.map((u) => u.key), ...m.mentionedIn])];
                return (
                  <tr key={m.id} className="hover:bg-[var(--w-hover)]">
                    <td className={`${TD} font-mono text-[12px]`}>{m.key}</td>
                    <td className={TD}><Chip tone={TYPE_TONE[m.msgType] ?? 'muted'}>{smTypeText(m.msgType)}</Chip></td>
                    <td className={`${TD} max-w-[200px]`}><Clip text={m.context} /></td>
                    <td className={`${TD} max-w-[360px]`}>
                      <Clip text={m.text} lines={3} />
                      {m.textEn && <div className="mt-0.5 text-[12px] text-[var(--w-text-2)]">EN: {m.textEn}</div>}
                    </td>
                    <td className={`${TD} font-mono text-[12px]`}>{used.length ? used.join(', ') : <span className="font-sans text-[var(--w-orange-text)]">{wt('g2.smUnused')}</span>}</td>
                    <td className={`${TD} font-mono text-[12px]`}>{m.httpStatus ?? '—'}</td>
                    <td className={TD}>
                      <span className="flex items-center gap-1.5">
                        <UcStatusChip status={m.status} />
                        {m.status !== 'APPROVED' && r.canApprove && <button type="button" className="w-btn w-btn-sm" disabled={approve.isPending} onClick={() => approve.mutate(m)}>{m.status === 'PROPOSED' ? wt('srs.acceptShort') : wt('g2.smApprove')}</button>}
                      </span>
                    </td>
                    <td className={`${TD} w-20`}>
                      {r.canEdit && (
                        <span className="flex justify-end gap-1">
                          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${wt('common.edit')} ${m.key}`} title={wt('common.edit')} onClick={() => setEdit(m)}><Pencil size={13} /></button>
                          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${wt('common.delete')} ${m.key}`} title={wt('common.delete')} onClick={() => window.confirm(wt('g2.smDeleteConfirm', { key: m.key })) && del.mutate(m.key)}><Trash2 size={13} /></button>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableFrame>
      )}
      <Dialog open={!!edit} onClose={() => setEdit(null)} title={edit === 'new' ? wt('g2.smAdd') : wt('g2.smEdit', { key: (edit as SystemMessage | null)?.key ?? '' })} width={580}
        footer={<><button type="button" className="w-btn" onClick={() => setEdit(null)}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={!f.text.trim() || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={12} />} {wt('common.save')}</button></>}>
        <Field label={wt('g2.smType')}>
          <select className="w-input" value={f.msgType} onChange={(e) => setF({ ...f, msgType: e.target.value as SmType })}>{SM_TYPES.map((t) => <option key={t} value={t}>{smTypeText(t)}</option>)}</select>
        </Field>
        <Field label={wt('g2.smContext')}><input className="w-input" value={f.context} maxLength={2000} onChange={(e) => setF({ ...f, context: e.target.value })} /></Field>
        <TextArea id="sm-text" label={wt('g2.smText')} value={f.text} rows={3} onChange={(v) => setF({ ...f, text: v })} />
        <TextArea id="sm-text-en" label={wt('g2.smTextEn')} value={f.textEn} rows={2} onChange={(v) => setF({ ...f, textEn: v })} />
        <div className="grid grid-cols-[1fr_140px] gap-3">
          <Field label={wt('g2.smUseCases')} hint={`${wt('g2.smUseCasesHint')}${ucHint ? ` — ${ucHint}` : ''}`}><input className="w-input font-mono" value={f.useCases} onChange={(e) => setF({ ...f, useCases: e.target.value })} /></Field>
          <Field label={wt('g2.smHttp')}><input className="w-input" inputMode="numeric" value={f.httpStatus} maxLength={3} onChange={(e) => setF({ ...f, httpStatus: e.target.value.replace(/\D/g, '') })} /></Field>
        </div>
      </Dialog>
    </div>
  );
}
