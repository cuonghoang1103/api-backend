'use client';

/**
 * "Create with CuongMini" — bảng thành viên: gõ tay, dán từ Excel/Sheets (máy chủ đọc tiêu đề tiếng Việt/Anh, MSSV…),
 * hoặc tải .xlsx/.csv. Bảng cuộn ngang trong khung riêng ⇒ cửa sổ hẹp không vỡ trang.
 */

import { useRef, useState } from 'react';
import { ClipboardPaste, Plus, Trash2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { workError } from '@/lib/work-api';
import { emptyRow, setupApi, type RosterRow } from '@/lib/work-setup-api';
import { Spinner } from '@/components/work/ui';
import { wt } from '@/components/work/i18n';

const LEVELS = [1, 2, 3, 4, 5] as const;

export default function RosterEditor({ wsId, rows, onChange, showGroup, disabled }: {
  wsId: number; rows: RosterRow[]; onChange: (rows: RosterRow[]) => void; showGroup: boolean; disabled?: boolean;
}) {
  const [paste, setPaste] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const merge = (incoming: RosterRow[], warnings: string[]) => {
    const key = (r: RosterRow) => (r.studentId || r.email || r.name).toLowerCase();
    const have = new Set(rows.map(key));
    const add = incoming.filter((r) => !have.has(key(r)));
    onChange([...rows.filter((r) => r.name.trim()), ...add]);
    toast.success(wt('tcm.rosterAdded', { n: add.length }));
    if (warnings.length) toast.message(warnings.slice(0, 3).join(' · '));
  };
  const parseText = async () => {
    if (!paste?.trim()) return;
    setBusy(true);
    try {
      const r = await setupApi.parseRosterText(wsId, paste);
      merge(r.rows, r.warnings);
      setPaste(null);
    } catch (e) { toast.error(workError(e, wt('tcm.rosterFailed'))); } finally { setBusy(false); }
  };
  const parseFile = async (f: File) => {
    setBusy(true);
    try {
      const r = await setupApi.parseRosterFile(wsId, f);
      merge(r.rows, r.warnings);
    } catch (e) { toast.error(workError(e, wt('tcm.rosterFailed'))); } finally { setBusy(false); }
  };
  const set = (i: number, patch: Partial<RosterRow>) => onChange(rows.map((r, k) => (k === i ? { ...r, ...patch } : r)));

  return (
    <div className="min-w-0">
      <div className="mb-2 flex flex-wrap gap-1.5">
        <button type="button" className="w-btn w-btn-sm" disabled={disabled} onClick={() => setPaste(paste === null ? '' : null)}><ClipboardPaste size={13} /> {wt('tcm.rosterPaste')}</button>
        <button type="button" className="w-btn w-btn-sm" disabled={disabled || busy} onClick={() => fileRef.current?.click()}>{busy ? <Spinner size={12} /> : <Upload size={13} />} {wt('tcm.rosterUpload')}</button>
        <input ref={fileRef} type="file" hidden accept=".xlsx,.csv,.tsv,.txt" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void parseFile(f); }} />
        <button type="button" className="w-btn w-btn-sm" disabled={disabled} onClick={() => onChange([...rows, emptyRow()])}><Plus size={13} /> {wt('tcm.rosterAddRow')}</button>
        {rows.length > 0 && <span className="ml-auto self-center text-[12px] text-[var(--w-text-3)]">{wt('tcm.rosterCount', { n: rows.length })}</span>}
      </div>
      {paste !== null && (
        <div className="mb-3 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] p-2.5">
          <textarea
            className="w-input min-h-[110px] font-mono text-[12px]" autoFocus value={paste} onChange={(e) => setPaste(e.target.value)}
            placeholder={wt('tcm.rosterPastePh')} aria-label={wt('tcm.rosterPaste')}
          />
          <div className="mt-2 flex items-center gap-2">
            <span className="min-w-0 flex-1 text-[11.5px] text-[var(--w-text-3)]">{wt('tcm.rosterPasteHint')}</span>
            <button type="button" className="w-btn w-btn-sm" onClick={() => setPaste(null)}><X size={13} /> {wt('tcm.cancel')}</button>
            <button type="button" className="w-btn w-btn-sm w-btn-primary" disabled={busy || !paste.trim()} onClick={() => void parseText()}>{busy ? <Spinner size={12} /> : null} {wt('tcm.rosterRead')}</button>
          </div>
        </div>
      )}
      {rows.length === 0 ? (
        <p className="rounded-[8px] border border-dashed border-[var(--w-border-strong)] px-3 py-4 text-center text-[12.5px] text-[var(--w-text-3)]">{wt('tcm.rosterEmpty')}</p>
      ) : (
        <div className="max-w-full overflow-x-auto rounded-[8px] border border-[var(--w-border)]">
          <table className="w-full min-w-[820px] border-collapse text-[12.5px]">
            <thead className="bg-[var(--w-sunken)] text-left text-[11.5px] text-[var(--w-text-2)]">
              <tr>
                <th className="px-2 py-1.5 font-medium">{wt('tcm.colName')}</th>
                <th className="w-[110px] px-2 py-1.5 font-medium">{wt('tcm.colStudentId')}</th>
                <th className="px-2 py-1.5 font-medium">{wt('tcm.colEmail')}</th>
                <th className="w-[110px] px-2 py-1.5 font-medium">{wt('tcm.colRole')}</th>
                <th className="w-[128px] px-2 py-1.5 font-medium" title={wt('tcm.colLevelHint')}>{wt('tcm.colLevel')}</th>
                <th className="w-[64px] px-2 py-1.5 font-medium">{wt('tcm.colHours')}</th>
                <th className="px-2 py-1.5 font-medium">{wt('tcm.colSkills')}</th>
                {showGroup && <th className="w-[90px] px-2 py-1.5 font-medium">{wt('tcm.colGroup')}</th>}
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-[var(--w-border)]">
                  {(['name', 'studentId', 'email', 'role'] as const).map((k) => (
                    <td key={k} className="p-0.5">
                      <input className="w-input-bare h-8 w-full rounded-[5px] px-1.5 hover:bg-[var(--w-hover)] focus:bg-[var(--w-sunken)]" value={r[k]} disabled={disabled}
                        aria-label={wt(k === 'name' ? 'tcm.colName' : k === 'studentId' ? 'tcm.colStudentId' : k === 'email' ? 'tcm.colEmail' : 'tcm.colRole')}
                        onChange={(e) => set(i, { [k]: e.target.value } as Partial<RosterRow>)} />
                    </td>
                  ))}
                  <td className="p-0.5">
                    <select className="w-input-bare h-8 w-full rounded-[5px] px-1 hover:bg-[var(--w-hover)]" value={r.level} disabled={disabled} aria-label={wt('tcm.colLevel')} onChange={(e) => set(i, { level: Number(e.target.value) })}>
                      {LEVELS.map((l) => <option key={l} value={l}>{l} · {wt(`tcm.level${l}` as const)}</option>)}
                    </select>
                  </td>
                  <td className="p-0.5">
                    <input type="number" min={0} max={80} className="w-input-bare h-8 w-full rounded-[5px] px-1.5 tabular-nums hover:bg-[var(--w-hover)]" value={r.hoursPerWeek} disabled={disabled} aria-label={wt('tcm.colHours')}
                      onChange={(e) => set(i, { hoursPerWeek: Math.max(0, Math.min(80, Number(e.target.value) || 0)) })} />
                  </td>
                  <td className="p-0.5">
                    <input className="w-input-bare h-8 w-full rounded-[5px] px-1.5 hover:bg-[var(--w-hover)] focus:bg-[var(--w-sunken)]" value={r.skills} placeholder={wt('tcm.colSkillsPh')} disabled={disabled} aria-label={wt('tcm.colSkills')}
                      onChange={(e) => set(i, { skills: e.target.value })} />
                  </td>
                  {showGroup && (
                    <td className="p-0.5">
                      <input className="w-input-bare h-8 w-full rounded-[5px] px-1.5 hover:bg-[var(--w-hover)]" value={r.group} disabled={disabled} aria-label={wt('tcm.colGroup')} onChange={(e) => set(i, { group: e.target.value })} />
                    </td>
                  )}
                  <td className="p-0.5 text-center">
                    <button type="button" className="w-btn w-btn-ghost w-btn-icon h-7 w-7" disabled={disabled} aria-label={wt('tcm.remove')} onClick={() => onChange(rows.filter((_, k) => k !== i))}><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
