'use client';

/**
 * A21 — Weekly Report theo mẫu SEP490 (đợt 3B). Mỗi tuần một kỳ lưu trên máy chủ: tạo kỳ ⇒ tự điền từ dữ liệu tuần
 * (việc có worklog/xong/đang làm, vấn đề RAID + thẻ bị chặn, kế hoạch tuần sau, rủi ro mới, danh sách thành viên) ⇒
 * sửa ⇒ xuất .xlsx (mỗi tuần một sheet "Week n"). Kỳ đang mở nằm trong `?week=`.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError, workErrorStatus } from '@/lib/work-api';
import { Dialog, EmptyState, Field, PageLoading, Spinner } from '../ui';
import { addDaysIso, ddmm, mondayOf, schoolApi, schoolKeys, todayLocal, WEEKLY_STATUSES, type WeeklyData, type WeeklyReport } from './schoolApi';
import { wt } from '@/components/work/i18n';

export default function WeeklyTab({ pid, canEdit }: { pid: number; canEdit: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const qc = useQueryClient();
  const list = useQuery({ queryKey: schoolKeys.weekly(pid), queryFn: () => schoolApi.weeklyList(pid) });
  const [newOpen, setNewOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const reports = list.data?.reports ?? [];
  const selected = Number(search?.get('week')) || reports[0]?.id || null;
  const select = useCallback((id: number | null) => {
    const p = new URLSearchParams(search?.toString());
    if (id) p.set('week', String(id)); else p.delete('week');
    router.replace(`${pathname}?${p}`, { scroll: false });
  }, [router, pathname, search]);
  if (list.isLoading) return <PageLoading />;

  const exportAll = async () => {
    setBusy(true);
    try { toast.success(wt('fpt.exported', { name: await schoolApi.exportWeekly(pid) })); } catch (e) { toast.error(workError(e, wt('fpt.exportFailed'))); } finally { setBusy(false); }
  };
  return (
    <div className="flex min-h-0 flex-1 max-md:flex-col">
      <aside className="w-[230px] shrink-0 overflow-y-auto border-r border-[var(--w-border)] py-2 max-md:max-h-[28vh] max-md:w-full max-md:border-b max-md:border-r-0" aria-label={wt('school.weeks')}>
        <div className="flex gap-2 px-3 pb-2">
          {canEdit && <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => setNewOpen(true)}><Plus size={13} /> {wt('school.week')}</button>}
          <button type="button" className="w-btn w-btn-sm" disabled={busy || !reports.length} onClick={exportAll} title={wt('school.allWeeksTitle')}>{busy ? <Spinner size={12} /> : <Download size={13} />} {wt('common.all')}</button>
        </div>
        {reports.map((r) => (
          <button key={r.id} type="button" onClick={() => select(r.id)} aria-current={selected === r.id}
            className={cn('block w-full px-3 py-2 text-left', selected === r.id ? 'bg-[var(--w-active)]' : 'hover:bg-[var(--w-hover)]')}>
            <div className="text-[13px] font-medium">{r.weekNo ? wt('school.weekN', { n: r.weekNo }) : wt('school.weekOf', { d: ddmm(r.weekStart) })}</div>
            <div className="text-[11.5px] text-[var(--w-text-3)]">{ddmm(r.weekStart)} – {ddmm(addDaysIso(r.weekStart, 6))} · {wt('school.nTasks', { n: r.counts.status })} · {wt('school.nIssues', { n: r.counts.issues })}</div>
          </button>
        ))}
        {!list.data?.week1Start && <p className="px-3 pt-2 text-[11.5px] text-[var(--w-text-3)]">{wt('school.weekTip')}</p>}
      </aside>
      <section className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4">
        {!reports.length ? (
          <EmptyState title={wt('school.noWeekly')} body={wt('school.noWeeklyBody')}
            action={canEdit ? <button type="button" className="w-btn w-btn-primary" onClick={() => setNewOpen(true)}><Plus size={14} /> {wt('school.createWeek')}</button> : undefined} />
        ) : selected ? (
          <WeekEditor key={selected} pid={pid} id={selected} canEdit={canEdit} onDeleted={() => { qc.invalidateQueries({ queryKey: schoolKeys.weekly(pid) }); select(null); }} />
        ) : null}
      </section>
      <NewWeekDialog open={newOpen} onClose={() => setNewOpen(false)} pid={pid} onCreated={(w) => { qc.invalidateQueries({ queryKey: schoolKeys.weekly(pid) }); select(w.id); }} />
    </div>
  );
}

function NewWeekDialog({ open, onClose, pid, onCreated }: { open: boolean; onClose: () => void; pid: number; onCreated: (w: WeeklyReport) => void }) {
  const [day, setDay] = useState(todayLocal());
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (open) setDay(todayLocal()); }, [open]);
  const monday = mondayOf(day || todayLocal());
  const submit = async () => {
    setBusy(true);
    try { onCreated(await schoolApi.createWeekly(pid, monday)); onClose(); }
    catch (e) { toast.error(workError(e, wt('school.createFailed'))); } finally { setBusy(false); }
  };
  return (
    <Dialog open={open} onClose={() => !busy && onClose()} title={wt('school.newWeekly')} width={440}
      footer={<><button type="button" className="w-btn" onClick={onClose} disabled={busy}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" onClick={submit} disabled={busy}>{busy && <Spinner size={12} />} {wt('school.createFill')}</button></>}>
      <Field label={wt('school.anyDay')} hint={wt('school.anyDayHint', { a: ddmm(monday), b: ddmm(addDaysIso(monday, 6)) })}>
        <input type="date" className="w-input" value={day} onChange={(e) => setDay(e.target.value)} />
      </Field>
    </Dialog>
  );
}

type Section = 'status' | 'issues' | 'plan' | 'matters';
const SECTIONS: Array<{ id: Section; title: string; cols: Array<{ k: string; label: string; w: number; kind?: 'status' | 'date' | 'area' }>; blank: () => Record<string, string> }> = [
  { id: 'status', title: 'I. Status Report', cols: [{ k: 'task', label: 'Project task', w: 280 }, { k: 'inCharge', label: 'In-charge', w: 140 }, { k: 'status', label: 'Status', w: 120, kind: 'status' }, { k: 'notes', label: 'Notes (work item in details)', w: 300, kind: 'area' }], blank: () => ({ task: '', inCharge: '', status: 'In Progress', notes: '' }) },
  { id: 'issues', title: 'II. Project Issues', cols: [{ k: 'issue', label: 'Project issue', w: 280 }, { k: 'owner', label: 'Owner', w: 140 }, { k: 'status', label: 'Status', w: 120, kind: 'status' }, { k: 'notes', label: 'Notes (solution, suggestion…)', w: 300, kind: 'area' }], blank: () => ({ issue: '', owner: '', status: 'Pending', notes: '' }) },
  { id: 'plan', title: 'III. Next Week Plan', cols: [{ k: 'task', label: 'Project task', w: 280 }, { k: 'inCharge', label: 'In-charge', w: 140 }, { k: 'deadline', label: 'Deadline', w: 140, kind: 'date' }, { k: 'notes', label: 'Notes (task details…)', w: 280, kind: 'area' }], blank: () => ({ task: '', inCharge: '', deadline: '', notes: '' }) },
  { id: 'matters', title: 'IV. Other Project Matters / Suggestions', cols: [{ k: 'matter', label: 'Matter / suggestion', w: 280 }, { k: 'raisedBy', label: 'Raised by', w: 140 }, { k: 'date', label: 'Date', w: 140, kind: 'date' }, { k: 'notes', label: 'Notes', w: 280, kind: 'area' }], blank: () => ({ matter: '', raisedBy: '', date: '', notes: '' }) },
];

function WeekEditor({ pid, id, canEdit, onDeleted }: { pid: number; id: number; canEdit: boolean; onDeleted: () => void }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: schoolKeys.week(pid, id), queryFn: () => schoolApi.weekly(pid, id), staleTime: Infinity });
  const [data, setData] = useState<WeeklyData | null>(null);
  const [state, setState] = useState<'idle' | 'dirty' | 'saving' | 'saved' | 'error'>('idle');
  const version = useRef(0);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (q.data) { setData(q.data.data); version.current = q.data.version; setState('idle'); } }, [q.data]);

  const save = useCallback(async (d: WeeklyData) => {
    setState('saving');
    try {
      const res = await schoolApi.saveWeekly(pid, id, { version: version.current, data: d });
      version.current = res.version;
      setState('saved');
      qc.invalidateQueries({ queryKey: schoolKeys.weekly(pid) });
    } catch (e) {
      setState('error');
      if (workErrorStatus(e) === 409) toast.error(wt('school.someoneSaved'), { action: { label: wt('fpt.reload'), onClick: () => qc.resetQueries({ queryKey: schoolKeys.week(pid, id) }) }, duration: 12_000 });
      else toast.error(workError(e, wt('common.couldNotSave')));
    }
  }, [pid, id, qc]);
  useEffect(() => {
    if (state !== 'dirty' || !data) return;
    const t = setTimeout(() => save(data), 900);
    return () => clearTimeout(t);
  }, [data, state, save]);

  if (q.isLoading || !data) return <PageLoading rows={5} />;
  const w = q.data!;
  const change = (f: (d: WeeklyData) => WeeklyData) => { if (!canEdit) return; setData((d) => (d ? f(d) : d)); setState('dirty'); };
  const setCell = (sec: Section, i: number, k: string, v: string) => change((d) => ({ ...d, [sec]: (d[sec] as Array<Record<string, string>>).map((r, j) => (j === i ? { ...r, [k]: v } : r)) }));

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="text-[16px] font-semibold">{w.weekNo ? wt('school.weekN', { n: w.weekNo }) : wt('school.tabWeeklyReport')} <span className="font-normal text-[var(--w-text-2)]">· {ddmm(w.weekStart)} – {ddmm(addDaysIso(w.weekStart, 6))}</span></h2>
        <span className="text-[12px] text-[var(--w-text-3)]" aria-live="polite">{{ idle: '', dirty: wt('issues.unsaved'), saving: wt('common.saving'), saved: wt('fpt.allSaved'), error: wt('fpt.notSaved') }[state]}</span>
        <div className="ml-auto flex flex-wrap gap-2">
          {canEdit && (
            <button type="button" className="w-btn w-btn-sm" disabled={busy} title={wt('school.refillTitle')} onClick={async () => {
              if (!window.confirm(wt('school.refillConfirm'))) return;
              setBusy(true);
              try { qc.setQueryData(schoolKeys.week(pid, id), await schoolApi.refreshWeekly(pid, id)); toast.success(wt('school.refilled')); } catch (e) { toast.error(workError(e)); } finally { setBusy(false); }
            }}><RefreshCw size={13} /> {wt('school.refill')}</button>
          )}
          <button type="button" className="w-btn w-btn-sm" disabled={busy} onClick={async () => {
            setBusy(true);
            try { toast.success(wt('fpt.exported', { name: await schoolApi.exportWeekly(pid, [id]) })); } catch (e) { toast.error(workError(e, wt('fpt.exportFailed'))); } finally { setBusy(false); }
          }}><Download size={13} /> {wt('school.exportXlsx')}</button>
          {canEdit && (
            <button type="button" className="w-btn w-btn-sm text-[var(--w-red)]" onClick={async () => {
              if (!window.confirm(wt('school.deleteWeeklyQ'))) return;
              try { await schoolApi.deleteWeekly(pid, id); onDeleted(); } catch (e) { toast.error(workError(e)); }
            }}><Trash2 size={13} /></button>
          )}
        </div>
      </div>

      {SECTIONS.map((sec) => {
        const rows = data[sec.id] as Array<Record<string, string>>;
        return (
          <div key={sec.id} className="mb-5">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-[13px] font-semibold">{sec.title}</h3>
              {canEdit && <button type="button" className="w-btn w-btn-sm" onClick={() => change((d) => ({ ...d, [sec.id]: [...(d[sec.id] as unknown[]), sec.blank()] }))}><Plus size={12} /> {wt('school.row')}</button>}
            </div>
            <div className="overflow-x-auto rounded-[8px] border border-[var(--w-border)]">
              <table className="w-full border-separate border-spacing-0 text-[12.5px]" style={{ minWidth: 40 + sec.cols.reduce((s, c) => s + c.w, 0) }}>
                <thead className="bg-[#daeef3] text-left text-[11.5px] text-[#1f3b4d]">
                  <tr><th className="w-8 px-2 py-1.5">#</th>{sec.cols.map((c) => <th key={c.k} className="px-2 py-1.5 font-semibold" style={{ width: c.w }}>{c.label}</th>)}<th className="w-8" /></tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td className="border-t border-[var(--w-border)] px-2 py-1 text-[var(--w-text-3)]">{i + 1}</td>
                      {sec.cols.map((c) => (
                        <td key={c.k} className="border-t border-[var(--w-border)] px-1 py-1 align-top">
                          {c.kind === 'status' ? (
                            <select className="w-input h-[28px] text-[12px]" disabled={!canEdit} value={r[c.k]} aria-label={c.label} onChange={(e) => setCell(sec.id, i, c.k, e.target.value)}>
                              {WEEKLY_STATUSES.map((s) => <option key={s}>{s}</option>)}
                            </select>
                          ) : c.kind === 'date' ? (
                            <input type="date" className="w-input h-[28px] text-[12px]" readOnly={!canEdit} value={/^\d{4}-\d{2}-\d{2}$/.test(r[c.k]) ? r[c.k] : ''} aria-label={c.label} onChange={(e) => setCell(sec.id, i, c.k, e.target.value)} />
                          ) : (
                            <textarea rows={1} className="w-input min-h-[28px] resize-y py-1 text-[12.5px]" readOnly={!canEdit} value={r[c.k]} aria-label={c.label} maxLength={c.kind === 'area' ? 2000 : 500} onChange={(e) => setCell(sec.id, i, c.k, e.target.value)} />
                          )}
                        </td>
                      ))}
                      <td className="border-t border-[var(--w-border)] text-center">
                        {canEdit && <button type="button" className="text-[var(--w-text-3)] hover:text-[var(--w-red)]" aria-label={wt('school.removeRow')} onClick={() => change((d) => ({ ...d, [sec.id]: (d[sec.id] as unknown[]).filter((_, j) => j !== i) }))}><Trash2 size={12} /></button>}
                      </td>
                    </tr>
                  ))}
                  {!rows.length && <tr><td colSpan={sec.cols.length + 2} className="border-t border-[var(--w-border)] px-3 py-3 text-center text-[12px] text-[var(--w-text-3)]">{wt('school.nothingWeek')}</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      <div className="mb-6">
        <h3 className="mb-1 text-[13px] font-semibold">V. Personal Grade <span className="font-normal text-[var(--w-text-3)]">— {wt('school.byLecturer')}</span></h3>
        <div className="flex flex-wrap gap-2">
          {data.grades.map((g, i) => (
            <label key={i} className="flex items-center gap-2 rounded-[8px] border border-[var(--w-border)] px-2 py-1 text-[12.5px]">
              {g.name}
              <input type="number" min={0} max={10} step={0.5} className="w-input h-[26px] w-[64px] text-[12px]" readOnly={!canEdit} value={g.grade ?? ''} aria-label={wt('school.gradeFor', { name: g.name })}
                onChange={(e) => change((d) => ({ ...d, grades: d.grades.map((x, j) => (j === i ? { ...x, grade: e.target.value === '' ? null : Math.min(10, Math.max(0, Number(e.target.value))) } : x)) }))} />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
