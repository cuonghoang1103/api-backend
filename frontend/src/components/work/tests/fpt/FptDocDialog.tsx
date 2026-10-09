'use client';

/** Trang Cover của Report 5.1 / 5.2: thông tin dự án, người lập/duyệt, ngày phát hành, môi trường + Record of change (A/D/M). */

import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { Dialog, Field, Spinner } from '../../ui';
import { fptApi, fptKeys, type DocMeta } from './fptApi';
import { todayIso } from './shared';
import { wt } from '@/components/work/i18n';

export default function FptDocDialog({ open, onClose, pid, report }: { open: boolean; onClose: () => void; pid: number; report: 'UNIT' | 'INT' | 'SYS' }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: fptKeys.doc(pid), queryFn: () => fptApi.doc(pid), enabled: open });
  const [form, setForm] = useState<Partial<DocMeta> & { projectName?: string; projectCode?: string }>({});
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({ effectiveDate: todayIso(), version: '1.0', changeItem: '', action: 'A', description: '', reference: '' });

  useEffect(() => {
    if (!open || !q.data) return;
    const m = q.data.meta;
    setForm({ ...m, projectName: q.data.overrides.projectName ?? '', projectCode: q.data.overrides.projectCode ?? '' });
    setDraft((d) => ({ ...d, version: m.version }));
  }, [open, q.data]);

  const canEdit = !!q.data?.canEdit;
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));
  const save = async () => {
    setSaving(true);
    try {
      await fptApi.updateDoc(pid, {
        projectName: form.projectName || null, projectCode: form.projectCode || null, creator: form.creator || null, reviewer: form.reviewer || null,
        version: form.version || '1.0', unitIssueDate: form.unitIssueDate || null, intIssueDate: form.intIssueDate || null,
        environment: form.environment || null, tcPerKloc: Number(form.tcPerKloc) || 100, unitNotes: form.unitNotes || null, intNotes: form.intNotes || null,
        sysIssueDate: form.sysIssueDate || null, sysNotes: form.sysNotes || null,
      });
      await qc.invalidateQueries({ queryKey: fptKeys.all(pid) });
      toast.success(wt('fpt.docSaved'));
      onClose();
    } catch (e) {
      toast.error(workError(e, wt('common.couldNotSave')));
    } finally {
      setSaving(false);
    }
  };
  const addChange = async () => {
    try {
      await fptApi.addChange(pid, { report, effectiveDate: draft.effectiveDate, version: draft.version, changeItem: draft.changeItem || null, action: draft.action, description: draft.description || null, reference: draft.reference || null });
      setDraft((d) => ({ ...d, changeItem: '', description: '', reference: '' }));
      qc.invalidateQueries({ queryKey: fptKeys.doc(pid) });
    } catch (e) { toast.error(workError(e, wt('fpt.changeFailed'))); }
  };
  const delChange = async (id: number) => {
    try { await fptApi.deleteChange(pid, id); qc.invalidateQueries({ queryKey: fptKeys.doc(pid) }); } catch (e) { toast.error(workError(e)); }
  };

  const changes = (q.data?.changes ?? []).filter((c) => c.report === report);
  const isUnit = report === 'UNIT';
  // Ba báo cáo dùng chung Cover; ngày phát hành + ghi chú là riêng từng báo cáo.
  const dateKey = isUnit ? 'unitIssueDate' : report === 'SYS' ? 'sysIssueDate' : 'intIssueDate';
  const notesKey = isUnit ? 'unitNotes' : report === 'SYS' ? 'sysNotes' : 'intNotes';

  return (
    <Dialog
      open={open}
      onClose={() => !saving && onClose()}
      title={isUnit ? wt('fpt.docUnit') : report === 'SYS' ? wt('fpt.docSys') : wt('fpt.docInt')}
      width={860}
      footer={canEdit ? (
        <>
          <button type="button" className="w-btn" onClick={onClose} disabled={saving}>{wt('common.cancel')}</button>
          <button type="button" className="w-btn w-btn-primary" onClick={save} disabled={saving}>{saving && <Spinner size={12} />} {wt('common.save')}</button>
        </>
      ) : <button type="button" className="w-btn" onClick={onClose}>{wt('common.close')}</button>}
    >
      {!q.data ? <div className="py-8 text-center"><Spinner /></div> : (
        <>
          <div className="grid gap-x-4 sm:grid-cols-2">
            <Field label={wt('fpt.cProjectName')} hint={wt('fpt.emptyEq', { v: q.data.meta.projectName })}>
              <input className="w-input" value={form.projectName ?? ''} readOnly={!canEdit} maxLength={200} placeholder={q.data.meta.projectName} onChange={(e) => set('projectName', e.target.value)} />
            </Field>
            <Field label={wt('fpt.cProjectCode')} hint={wt('fpt.cProjectCodeHint')}>
              <input className="w-input" value={form.projectCode ?? ''} readOnly={!canEdit} maxLength={40} placeholder={q.data.meta.projectCode} onChange={(e) => set('projectCode', e.target.value)} />
            </Field>
            <Field label={wt('fpt.cCreator')}><input className="w-input" value={form.creator ?? ''} readOnly={!canEdit} maxLength={120} onChange={(e) => set('creator', e.target.value)} /></Field>
            <Field label={wt('fpt.cReviewer')}><input className="w-input" value={form.reviewer ?? ''} readOnly={!canEdit} maxLength={120} onChange={(e) => set('reviewer', e.target.value)} /></Field>
            <Field label={wt('fpt.cVersion')}><input className="w-input" value={form.version ?? ''} readOnly={!canEdit} maxLength={20} onChange={(e) => set('version', e.target.value)} /></Field>
            <Field label={wt('fpt.cIssueDate')}>
              <input type="date" className="w-input" readOnly={!canEdit} value={form[dateKey] ?? ''}
                onChange={(e) => set(dateKey, e.target.value || null)} />
            </Field>
            {isUnit && (
              <Field label={wt('fpt.cNorm')} hint={wt('fpt.cNormHint')}>
                <input type="number" min={1} max={10000} className="w-input" readOnly={!canEdit} value={form.tcPerKloc ?? 100} onChange={(e) => set('tcPerKloc', Number(e.target.value))} />
              </Field>
            )}
          </div>
          <Field label={wt('fpt.cEnv')}>
            <textarea className="w-input min-h-[70px]" readOnly={!canEdit} maxLength={4000} value={form.environment ?? ''} onChange={(e) => set('environment', e.target.value)}
              placeholder={'1. Server: Node.js 22 / Spring Boot 3\n2. Database: PostgreSQL 16\n3. Web browser: Chrome 129'} />
          </Field>
          <Field label={wt('fpt.cNotes')} hint={isUnit ? wt('fpt.cNotesHint') : undefined}>
            <textarea className="w-input min-h-[52px]" readOnly={!canEdit} maxLength={4000} value={form[notesKey] ?? ''} onChange={(e) => set(notesKey, e.target.value)} />
          </Field>

          <div className="mt-2">
            <div className="w-label">{wt('fpt.roc')} (Record of change)</div>
            <div className="overflow-x-auto rounded-[8px] border border-[var(--w-border)]">
              <table className="w-full min-w-[700px] text-[12.5px]">
                <thead className="bg-[#1e2a78] text-left text-white">
                  <tr>{['Effective date', 'Version', 'Change item', 'A/D/M', 'Change description', 'Reference', ''].map((h) => <th key={h} className="px-2 py-1.5 font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {changes.map((c) => (
                    <tr key={c.id} className="border-t border-[var(--w-border)]">
                      <td className="px-2 py-1.5 tabular-nums">{c.effectiveDate.split('-').reverse().join('/')}</td>
                      <td className="px-2">{c.version}</td>
                      <td className="px-2">{c.changeItem}</td>
                      <td className="px-2 font-mono">{c.action}</td>
                      <td className="px-2">{c.description}</td>
                      <td className="px-2">{c.reference}</td>
                      <td className="w-8 px-1">{canEdit && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={() => delChange(c.id)} aria-label={wt('fpt.deleteChange')}><Trash2 size={12} /></button>}</td>
                    </tr>
                  ))}
                  {!changes.length && <tr><td colSpan={7} className="px-2 py-2 text-[var(--w-text-3)]">{wt('fpt.noChanges')}</td></tr>}
                  {canEdit && (
                    <tr className="border-t border-[var(--w-border)] bg-[var(--w-sunken)]">
                      <td className="p-1"><input type="date" className="w-input h-[28px] text-[12px]" value={draft.effectiveDate} onChange={(e) => setDraft({ ...draft, effectiveDate: e.target.value })} /></td>
                      <td className="p-1"><input className="w-input h-[28px] w-[64px] text-[12px]" value={draft.version} onChange={(e) => setDraft({ ...draft, version: e.target.value })} /></td>
                      <td className="p-1"><input className="w-input h-[28px] text-[12px]" placeholder="Function list" value={draft.changeItem} onChange={(e) => setDraft({ ...draft, changeItem: e.target.value })} /></td>
                      <td className="p-1">
                        <select className="w-input h-[28px] text-[12px]" value={draft.action} onChange={(e) => setDraft({ ...draft, action: e.target.value })}>
                          <option value="A">A</option><option value="D">D</option><option value="M">M</option>
                        </select>
                      </td>
                      <td className="p-1"><input className="w-input h-[28px] text-[12px]" placeholder="Add unit tests of auth functions" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></td>
                      <td className="p-1"><input className="w-input h-[28px] text-[12px]" placeholder="FunctionList 1-5" value={draft.reference} onChange={(e) => setDraft({ ...draft, reference: e.target.value })} /></td>
                      <td className="p-1"><button type="button" className={cn('w-btn w-btn-sm w-btn-icon')} onClick={addChange} disabled={!draft.effectiveDate || !draft.version} aria-label={wt('fpt.addChange')}><Plus size={13} /></button></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
}
