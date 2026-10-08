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
    try { toast.success(`Exported ${await schoolApi.exportWeekly(pid)}`); } catch (e) { toast.error(workError(e, 'Could not export')); } finally { setBusy(false); }
  };
  return (
    <div className="flex min-h-0 flex-1 max-md:flex-col">
      <aside className="w-[230px] shrink-0 overflow-y-auto border-r border-[var(--w-border)] py-2 max-md:max-h-[28vh] max-md:w-full max-md:border-b max-md:border-r-0" aria-label="Weeks">
        <div className="flex gap-2 px-3 pb-2">
          {canEdit && <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => setNewOpen(true)}><Plus size={13} /> Week</button>}
          <button type="button" className="w-btn w-btn-sm" disabled={busy || !reports.length} onClick={exportAll} title="All weeks in one workbook, one sheet per week">{busy ? <Spinner size={12} /> : <Download size={13} />} All</button>
        </div>
        {reports.map((r) => (
          <button key={r.id} type="button" onClick={() => select(r.id)} aria-current={selected === r.id}
            className={cn('block w-full px-3 py-2 text-left', selected === r.id ? 'bg-[var(--w-active)]' : 'hover:bg-[var(--w-hover)]')}>
            <div className="text-[13px] font-medium">{r.weekNo ? `Week ${r.weekNo}` : `Week of ${ddmm(r.weekStart)}`}</div>
            <div className="text-[11.5px] text-[var(--w-text-3)]">{ddmm(r.weekStart)} – {ddmm(addDaysIso(r.weekStart, 6))} · {r.counts.status} tasks · {r.counts.issues} issues</div>
          </button>
        ))}
        {!list.data?.week1Start && <p className="px-3 pt-2 text-[11.5px] text-[var(--w-text-3)]">Tip: set “Monday of week 1” on the Course tab to number weeks like the template (Week 2, Week 3…).</p>}
      </aside>
      <section className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4">
        {!reports.length ? (
          <EmptyState title="No weekly reports yet" body="Create the report for a week — CT Work fills in finished and ongoing tasks, open issues, next week’s plan and risks from your project. Edit it, then export the FPT Weekly Report .xlsx (one sheet per week)."
            action={canEdit ? <button type="button" className="w-btn w-btn-primary" onClick={() => setNewOpen(true)}><Plus size={14} /> Create this week’s report</button> : undefined} />
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
    catch (e) { toast.error(workError(e, 'Could not create the report')); } finally { setBusy(false); }
  };
  return (
    <Dialog open={open} onClose={() => !busy && onClose()} title="New weekly report" width={440}
      footer={<><button type="button" className="w-btn" onClick={onClose} disabled={busy}>Cancel</button><button type="button" className="w-btn w-btn-primary" onClick={submit} disabled={busy}>{busy && <Spinner size={12} />} Create &amp; fill in</button></>}>
      <Field label="Any day in the week" hint={`Week ${ddmm(monday)} – ${ddmm(addDaysIso(monday, 6))} (Monday to Sunday, project time zone)`}>
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
      if (workErrorStatus(e) === 409) toast.error('Someone else saved this week a moment ago.', { action: { label: 'Reload', onClick: () => qc.resetQueries({ queryKey: schoolKeys.week(pid, id) }) }, duration: 12_000 });
      else toast.error(workError(e, 'Could not save'));
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
        <h2 className="text-[16px] font-semibold">{w.weekNo ? `Week ${w.weekNo}` : 'Weekly report'} <span className="font-normal text-[var(--w-text-2)]">· {ddmm(w.weekStart)} – {ddmm(addDaysIso(w.weekStart, 6))}</span></h2>
        <span className="text-[12px] text-[var(--w-text-3)]" aria-live="polite">{{ idle: '', dirty: 'Unsaved changes', saving: 'Saving…', saved: 'All changes saved', error: 'Not saved' }[state]}</span>
        <div className="ml-auto flex flex-wrap gap-2">
          {canEdit && (
            <button type="button" className="w-btn w-btn-sm" disabled={busy} title="Re-fill sections from this week’s data (keeps grades)" onClick={async () => {
              if (!window.confirm('Re-fill sections I–IV from this week’s data? Your manual edits in those sections will be replaced; grades are kept.')) return;
              setBusy(true);
              try { qc.setQueryData(schoolKeys.week(pid, id), await schoolApi.refreshWeekly(pid, id)); toast.success('Refilled from project data'); } catch (e) { toast.error(workError(e)); } finally { setBusy(false); }
            }}><RefreshCw size={13} /> Refill</button>
          )}
          <button type="button" className="w-btn w-btn-sm" disabled={busy} onClick={async () => {
            setBusy(true);
            try { toast.success(`Exported ${await schoolApi.exportWeekly(pid, [id])}`); } catch (e) { toast.error(workError(e, 'Could not export')); } finally { setBusy(false); }
          }}><Download size={13} /> Export .xlsx</button>
          {canEdit && (
            <button type="button" className="w-btn w-btn-sm text-[var(--w-red)]" onClick={async () => {
              if (!window.confirm('Delete this weekly report?')) return;
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
              {canEdit && <button type="button" className="w-btn w-btn-sm" onClick={() => change((d) => ({ ...d, [sec.id]: [...(d[sec.id] as unknown[]), sec.blank()] }))}><Plus size={12} /> Row</button>}
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
                        {canEdit && <button type="button" className="text-[var(--w-text-3)] hover:text-[var(--w-red)]" aria-label="Remove row" onClick={() => change((d) => ({ ...d, [sec.id]: (d[sec.id] as unknown[]).filter((_, j) => j !== i) }))}><Trash2 size={12} /></button>}
                      </td>
                    </tr>
                  ))}
                  {!rows.length && <tr><td colSpan={sec.cols.length + 2} className="border-t border-[var(--w-border)] px-3 py-3 text-center text-[12px] text-[var(--w-text-3)]">Nothing this week.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      <div className="mb-6">
        <h3 className="mb-1 text-[13px] font-semibold">V. Personal Grade <span className="font-normal text-[var(--w-text-3)]">— usually filled in by the lecturer</span></h3>
        <div className="flex flex-wrap gap-2">
          {data.grades.map((g, i) => (
            <label key={i} className="flex items-center gap-2 rounded-[8px] border border-[var(--w-border)] px-2 py-1 text-[12.5px]">
              {g.name}
              <input type="number" min={0} max={10} step={0.5} className="w-input h-[26px] w-[64px] text-[12px]" readOnly={!canEdit} value={g.grade ?? ''} aria-label={`Grade for ${g.name}`}
                onChange={(e) => change((d) => ({ ...d, grades: d.grades.map((x, j) => (j === i ? { ...x, grade: e.target.value === '' ? null : Math.min(10, Math.max(0, Number(e.target.value))) } : x)) }))} />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
