'use client';

/**
 * A23 — Project Tracking theo đủ mẫu lớp (đợt 3B) + thông tin môn học dùng chung cho Weekly/AI Usage.
 * Mỗi mẫu một thẻ: tên sheet, dữ liệu lấy từ đâu, nút tải .xlsx.
 */

import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { workError } from '@/lib/work-api';
import { EmptyState, Field, PageLoading, Spinner } from '../ui';
import { schoolApi, schoolKeys, TRACKING_VARIANTS, type ReportDoc, type Student, type TrackingVariant } from './schoolApi';
import { wt } from '@/components/work/i18n';

export function TrackingTab({ pid }: { pid: number }) {
  const [busy, setBusy] = useState<TrackingVariant | null>(null);
  const get = async (v: TrackingVariant) => {
    setBusy(v);
    try { toast.success(wt('fpt.exported', { name: await schoolApi.exportTracking(pid, v) })); } catch (e) { toast.error(workError(e, wt('fpt.exportFailed'))); } finally { setBusy(null); }
  };
  return (
    <div className="mx-auto w-full max-w-[980px] p-4">
      <p className="mb-4 text-[13px] text-[var(--w-text-2)]">
        {wt('school.trackIntro')}
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {TRACKING_VARIANTS.map((v) => (
          <div key={v.id} className="flex flex-col rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-4">
            <div className="text-[14px] font-semibold">{v.title}</div>
            <div className="mt-1 font-mono text-[12px] text-[var(--w-text-2)]">{v.sheets}</div>
            <p className="mt-2 flex-1 text-[12.5px] text-[var(--w-text-2)]">{wt('school.from')} {v.from}.</p>
            <div className="mt-3">
              <button type="button" className="w-btn w-btn-sm w-btn-primary" disabled={!!busy} onClick={() => get(v.id)}>
                {busy === v.id ? <Spinner size={12} /> : <Download size={13} />} {wt('school.downloadXlsx')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CourseTab({ pid }: { pid: number }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: schoolKeys.doc(pid), queryFn: () => schoolApi.doc(pid) });
  const [f, setF] = useState<Partial<ReportDoc>>({});
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (q.data) setF(q.data); }, [q.data]);
  if (q.isLoading) return <PageLoading />;
  if (!q.data) return <EmptyState title={wt('common.couldNotLoad')} body={q.error ? workError(q.error) : undefined} />;
  const ro = !q.data.canEdit;
  const set = <K extends keyof ReportDoc>(k: K, v: ReportDoc[K]) => setF((x) => ({ ...x, [k]: v }));
  const students = f.students ?? [];
  const setStudent = (i: number, p: Partial<Student>) => set('students', students.map((s, j) => (j === i ? { ...s, ...p } : s)));
  const save = async () => {
    setSaving(true);
    try {
      const res = await schoolApi.updateDoc(pid, {
        subjectCode: f.subjectCode || null, subjectName: f.subjectName || null, classCode: f.classCode || null, semester: f.semester || null,
        lecturer: f.lecturer || null, groupCode: f.groupCode || null, projectTitle: f.projectTitle || null, week1Start: f.week1Start || null, students,
      });
      qc.setQueryData(schoolKeys.doc(pid), res);
      qc.invalidateQueries({ queryKey: ['work', 'school', pid] });
      toast.success(wt('common.saved'));
    } catch (e) { toast.error(workError(e, wt('common.couldNotSave'))); } finally { setSaving(false); }
  };
  const text = (k: 'subjectCode' | 'subjectName' | 'classCode' | 'semester' | 'lecturer' | 'groupCode' | 'projectTitle', label: string, ph: string, max: number) => (
    <Field label={label}><input className="w-input" readOnly={ro} maxLength={max} placeholder={ph} value={(f[k] as string | null) ?? ''} onChange={(e) => set(k, e.target.value)} /></Field>
  );
  return (
    <div className="mx-auto w-full max-w-[860px] p-4">
      <p className="mb-3 text-[13px] text-[var(--w-text-2)]">{wt('school.courseIntro')}</p>
      <div className="grid gap-x-4 sm:grid-cols-2">
        {text('subjectCode', wt('school.subjectCode'), 'SWP391 / SEP490', 20)}
        {text('subjectName', wt('school.subjectName'), wt('school.subjectNamePh'), 120)}
        {text('classCode', wt('school.classCode'), 'SE1801', 40)}
        {text('semester', wt('school.semester'), 'Fall 2026', 40)}
        {text('lecturer', wt('school.lecturer'), '', 120)}
        {text('groupCode', wt('school.group'), q.data.fallback.groupCode, 60)}
        {text('projectTitle', wt('school.projectTitle'), q.data.fallback.projectTitle, 200)}
        <Field label={wt('school.week1')} hint={wt('school.week1Hint')}>
          <input type="date" className="w-input" readOnly={ro} value={f.week1Start ?? ''} onChange={(e) => set('week1Start', e.target.value || null)} />
        </Field>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="w-label">{wt('school.students')}</div>
        {!ro && (
          <div className="flex gap-2">
            {!students.length && q.data.members.length > 0 && (
              <button type="button" className="w-btn w-btn-sm" onClick={() => set('students', q.data!.members.map((m) => ({ code: '', name: m.name, role: m.role, aiTools: '' })))}>{wt('school.fillMembers')}</button>
            )}
            <button type="button" className="w-btn w-btn-sm" disabled={students.length >= 30} onClick={() => set('students', [...students, { code: '', name: '', role: '', aiTools: '' }])}><Plus size={13} /> {wt('school.student')}</button>
          </div>
        )}
      </div>
      <div className="mt-1 overflow-x-auto rounded-[8px] border border-[var(--w-border)]">
        <table className="w-full min-w-[620px] text-[12.5px]">
          <thead className="bg-[var(--w-sunken)] text-left text-[11.5px] text-[var(--w-text-2)]"><tr><th className="px-2 py-1.5">{wt('school.studentCode')}</th><th>{wt('common.name')}</th><th>{wt('school.roleInGroup')}</th><th>{wt('school.aiTools')}</th><th /></tr></thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i} className="border-t border-[var(--w-border)]">
                {(['code', 'name', 'role', 'aiTools'] as const).map((k) => (
                  <td key={k} className="px-1 py-1"><input className="w-input h-[28px] text-[12.5px]" readOnly={ro} aria-label={k} value={s[k]} maxLength={k === 'aiTools' ? 200 : 120} onChange={(e) => setStudent(i, { [k]: e.target.value })} /></td>
                ))}
                <td className="w-8 text-center">{!ro && <button type="button" className="text-[var(--w-text-3)] hover:text-[var(--w-red)]" aria-label={wt('school.removeStudent')} onClick={() => set('students', students.filter((_, j) => j !== i))}><Trash2 size={13} /></button>}</td>
              </tr>
            ))}
            {!students.length && <tr><td colSpan={5} className="px-3 py-4 text-center text-[12.5px] text-[var(--w-text-3)]">{wt('school.noStudents')}</td></tr>}
          </tbody>
        </table>
      </div>
      {!ro && <div className="mt-4 flex justify-end"><button type="button" className="w-btn w-btn-primary" disabled={saving} onClick={save}>{saving && <Spinner size={12} />} {wt('common.save')}</button></div>}
    </div>
  );
}
