'use client';

/**
 * Ma trận unit test của MỘT hàm theo mẫu FPT Report 5.1: cột = test case (UTCID01…), dòng = Condition
 * (Precondition + mỗi tham số một nhóm, mỗi giá trị một dòng) và Confirmation (Return / Exception / Log message).
 * Bấm ô ⇒ đặt/bỏ dấu "O". Hàng cuối: loại N/A/B, Passed/Failed, ngày chạy, Defect ID.
 *
 * Lưu tự động (trễ 700ms) bằng PUT thay trọn + `version` — người khác vừa lưu ⇒ 409, hiện nút tải lại.
 *
 * 24/10/2026 (xem rõ): giá trị/ghi chú dài XUỐNG DÒNG (trước bị cắt trong ô một dòng), cột nhãn kéo rộng như cũ,
 * bấm UTCID ⇒ "Xem chi tiết" mở khung bên phải liệt kê trọn điều kiện / kết quả mong đợi của case (← → sang case khác),
 * cột của case đang xem được tô sáng.
 */

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, Copy, PanelRightOpen, Plus, Sparkles, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError, workErrorStatus } from '@/lib/work-api';
import { Popover } from '../../ui';
import { fptApi, fptKeys, TYPE_LABEL, utcId, type CaseResult, type CaseType, type UnitFunction, type UnitSection } from './fptApi';
import { undoToast } from '../../settings/binApi';
import { DetailDrawer, SaveState, shortDate, todayIso } from './shared';
import AiSuggestDialog from './AiSuggestDialog';
import { wt } from '@/components/work/i18n';

export interface DRow { key: string; section: UnitSection; groupName: string; label: string; value: string }
export interface DCase { key: string; type: CaseType; result: CaseResult | null; executedAt: string | null; defectId: string; note: string }
export interface Draft { rows: DRow[]; cases: DCase[]; marks: Set<string> }

let seq = 0;
export const newKey = (p: string) => `${p}n${Date.now().toString(36)}${(seq++).toString(36)}`;
const mk = (r: string, c: string) => `${r}|${c}`;

export function draftOf(f: UnitFunction): Draft {
  const marks = new Set<string>();
  for (const c of f.cases) for (const r of c.rowIds) marks.add(mk(`r${r}`, `c${c.id}`));
  return {
    rows: f.rows.map((r) => ({ key: `r${r.id}`, section: r.section, groupName: r.groupName, label: r.label ?? '', value: r.value ?? '' })),
    cases: f.cases.map((c) => ({ key: `c${c.id}`, type: c.type, result: c.result, executedAt: c.executedAt, defectId: c.defectId ?? '', note: c.note ?? '' })),
    marks,
  };
}

/** Thứ tự nhóm = lần xuất hiện đầu; dòng của một nhóm luôn liền nhau khi hiển thị. */
function groupsOf(rows: DRow[], section: UnitSection) {
  const out: Array<{ name: string; rows: DRow[] }> = [];
  for (const r of rows) {
    if (r.section !== section) continue;
    const g = out.find((x) => x.name === r.groupName);
    if (g) g.rows.push(r); else out.push({ name: r.groupName, rows: [r] });
  }
  return out;
}

const TYPE_TONE: Record<CaseType, string> = {
  N: 'bg-[color-mix(in_srgb,var(--w-green)_16%,transparent)] text-[var(--w-green)]',
  A: 'bg-[color-mix(in_srgb,var(--w-red)_14%,transparent)] text-[var(--w-red)]',
  B: 'bg-[color-mix(in_srgb,var(--w-yellow)_18%,transparent)] text-[var(--w-yellow)]',
};
const NEXT_TYPE: Record<CaseType, CaseType> = { N: 'A', A: 'B', B: 'N' };

const COL_W = 40;

export default function UnitMatrix({ pid, fn, canEdit, onStats }: {
  pid: number;
  fn: UnitFunction;
  canEdit: boolean;
  /** Báo số liệu theo bản nháp (để thanh đầu trang cập nhật ngay khi bấm). */
  onStats?: (s: { total: number; passed: number; failed: number }) => void;
}) {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft>(() => draftOf(fn));
  const [state, setState] = useState<'idle' | 'dirty' | 'saving' | 'saved' | 'error'>('idle');
  const [stale, setStale] = useState(false);
  const version = useRef(fn.updatedAt);
  // Sửa thông tin đầu hàm (PATCH) cũng đổi updatedAt — nhận version mới, không đụng bản nháp.
  useEffect(() => { version.current = fn.updatedAt; }, [fn.updatedAt]);
  const rev = useRef(0);
  const savedRev = useRef(0);
  const latest = useRef(draft);
  latest.current = draft;
  const [aiOpen, setAiOpen] = useState(false);

  const change = useCallback((fnc: (d: Draft) => Draft) => {
    if (!canEdit) return;
    setDraft((d) => fnc(d));
    rev.current++;
    setState('dirty');
  }, [canEdit]);

  const save = useCallback(async () => {
    if (rev.current === savedRev.current || stale) return;
    const sending = rev.current;
    const d = latest.current;
    setState('saving');
    try {
      const res = await fptApi.saveMatrix(pid, fn.id, {
        version: version.current,
        rows: d.rows.map((r) => ({ key: r.key, section: r.section, groupName: r.groupName.trim() || 'Input', label: r.label.trim() || null, value: r.value === '' ? null : r.value })),
        cases: d.cases.map((c) => ({ key: c.key, type: c.type, result: c.result, executedAt: c.executedAt, defectId: c.defectId.trim() || null, note: c.note.trim() || null })),
        marks: [...d.marks].map((m) => m.split('|') as [string, string]),
      });
      version.current = res.updatedAt;
      savedRev.current = sending;
      setState(rev.current === sending ? 'saved' : 'dirty');
      qc.setQueryData(fptKeys.fn(pid, fn.id), res);
      qc.invalidateQueries({ queryKey: fptKeys.unit(pid) });
      // 22/10/2026: UTCID / dòng bị xoá ⇒ vào thùng rác; Hoàn tác = thêm lại vào cuối rồi tải lại hàm (ma trận dựng lại).
      if (res.trashed) undoToast(pid, res.trashed.id, () => qc.resetQueries({ queryKey: fptKeys.fn(pid, fn.id) }), wt('bin.casesTrashed', { n: res.trashed.cases + res.trashed.rows }));
    } catch (e) {
      setState('error');
      if (workErrorStatus(e) === 409) {
        setStale(true);
        toast.error(wt('fpt.someoneSaved'), {
          action: { label: wt('fpt.reload'), onClick: () => qc.resetQueries({ queryKey: fptKeys.fn(pid, fn.id) }) },
          duration: 12_000,
        });
      } else toast.error(workError(e, wt('fpt.matrixFailed')));
    }
  }, [pid, fn.id, qc, stale]);

  // Lưu tự động sau 700ms yên tay; rời trang/đổi hàm thì lưu ngay.
  useEffect(() => {
    if (state !== 'dirty') return;
    const t = setTimeout(save, 700);
    return () => clearTimeout(t);
  }, [draft, state, save]);
  useEffect(() => () => { if (rev.current !== savedRev.current) void save(); }, [save]);

  const stats = useMemo(() => {
    const s = { total: draft.cases.length, passed: 0, failed: 0, n: 0, a: 0, b: 0 };
    for (const c of draft.cases) {
      if (c.result === 'P') s.passed++; else if (c.result === 'F') s.failed++;
      if (c.type === 'N') s.n++; else if (c.type === 'A') s.a++; else s.b++;
    }
    return s;
  }, [draft.cases]);
  useEffect(() => { onStats?.(stats); }, [stats, onStats]);

  // ─── Thao tác ────────────────────────────────────────────────
  const toggle = (rk: string, ck: string) => change((d) => {
    const marks = new Set(d.marks);
    const k = mk(rk, ck);
    if (marks.has(k)) marks.delete(k); else marks.add(k);
    return { ...d, marks };
  });
  const setRow = (key: string, patch: Partial<DRow>) => change((d) => ({ ...d, rows: d.rows.map((r) => (r.key === key ? { ...r, ...patch } : r)) }));
  const renameGroup = (section: UnitSection, from: string, to: string) => {
    const name = to.trim();
    if (!name || name === from) return;
    change((d) => ({ ...d, rows: d.rows.map((r) => (r.section === section && r.groupName === from ? { ...r, groupName: name.slice(0, 120) } : r)) }));
  };
  const addValue = (section: UnitSection, group: string) => change((d) => {
    const idx = d.rows.map((r, i) => (r.section === section && r.groupName === group ? i : -1)).filter((i) => i >= 0).pop();
    const row: DRow = { key: newKey('r'), section, groupName: group, label: '', value: '' };
    const rows = [...d.rows];
    rows.splice(idx === undefined ? rows.length : idx + 1, 0, row);
    return { ...d, rows };
  });
  const addGroup = (section: UnitSection, name: string) => change((d) => {
    let n = name;
    for (let i = 2; d.rows.some((r) => r.section === section && r.groupName === n); i++) n = `${name} ${i}`;
    // Nhóm Condition mới chèn trước phần Confirm cho đúng thứ tự in.
    const row: DRow = { key: newKey('r'), section, groupName: n, label: '', value: '' };
    const rows = [...d.rows];
    if (section === 'COND') {
      const firstConfirm = rows.findIndex((r) => r.section === 'CONFIRM');
      rows.splice(firstConfirm < 0 ? rows.length : firstConfirm, 0, row);
    } else rows.push(row);
    return { ...d, rows };
  });
  const deleteRow = (key: string) => change((d) => ({ ...d, rows: d.rows.filter((r) => r.key !== key), marks: new Set([...d.marks].filter((m) => !m.startsWith(`${key}|`))) }));
  const deleteGroup = (section: UnitSection, group: string) => change((d) => {
    const gone = new Set(d.rows.filter((r) => r.section === section && r.groupName === group).map((r) => r.key));
    return { ...d, rows: d.rows.filter((r) => !gone.has(r.key)), marks: new Set([...d.marks].filter((m) => !gone.has(m.split('|')[0]))) };
  });
  const addCase = (copyFrom?: string) => change((d) => {
    const key = newKey('c');
    const src = copyFrom ? d.cases.find((c) => c.key === copyFrom) : undefined;
    const c: DCase = { key, type: src?.type ?? 'N', result: null, executedAt: null, defectId: '', note: '' };
    const marks = new Set(d.marks);
    if (src) {
      for (const m of d.marks) { const [r, cc] = m.split('|'); if (cc === src.key) marks.add(mk(r, key)); }
    } else {
      // Ca mới: đánh sẵn mọi dòng Precondition như mẫu trường.
      for (const r of d.rows) if (r.section === 'COND' && /^pre-?condition/i.test(r.groupName)) marks.add(mk(r.key, key));
    }
    const cases = [...d.cases];
    const at = src ? cases.findIndex((x) => x.key === src.key) + 1 : cases.length;
    cases.splice(at, 0, c);
    return { ...d, cases, marks };
  });
  const setCase = (key: string, patch: Partial<DCase>) => change((d) => ({ ...d, cases: d.cases.map((c) => (c.key === key ? { ...c, ...patch } : c)) }));
  const deleteCase = (key: string) => change((d) => ({ ...d, cases: d.cases.filter((c) => c.key !== key), marks: new Set([...d.marks].filter((m) => !m.endsWith(`|${key}`))) }));
  const moveCase = (key: string, dir: -1 | 1) => change((d) => {
    const i = d.cases.findIndex((c) => c.key === key);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= d.cases.length) return d;
    const cases = [...d.cases];
    [cases[i], cases[j]] = [cases[j], cases[i]];
    return { ...d, cases };
  });

  const applyAi = (s: import('./fptApi').AiSuggestion) => change((d) => {
    const rows = [...d.rows];
    const keyFor = (section: UnitSection, g: { group: string; label?: string | null; value: string }) => {
      const hit = rows.find((r) => r.section === section && r.groupName.toLowerCase() === g.group.trim().toLowerCase() && r.value === g.value);
      if (hit) return hit.key;
      const row: DRow = { key: newKey('r'), section, groupName: g.group.trim().slice(0, 120) || (section === 'COND' ? 'Input' : 'Return'), label: (g.label ?? '').slice(0, 200), value: g.value };
      const last = rows.map((r, i) => (r.section === section && r.groupName === row.groupName ? i : -1)).filter((i) => i >= 0).pop();
      if (last !== undefined) rows.splice(last + 1, 0, row);
      else if (section === 'COND') { const fc = rows.findIndex((r) => r.section === 'CONFIRM'); rows.splice(fc < 0 ? rows.length : fc, 0, row); }
      else rows.push(row);
      return row.key;
    };
    const condKeys = s.conditions.map((g) => keyFor('COND', g));
    const confKeys = s.confirmations.map((g) => keyFor('CONFIRM', g));
    const pre = rows.filter((r) => r.section === 'COND' && /^pre-?condition/i.test(r.groupName)).map((r) => r.key);
    const cases = [...d.cases];
    const marks = new Set(d.marks);
    for (const c of s.cases) {
      const key = newKey('c');
      cases.push({ key, type: c.type, result: null, executedAt: null, defectId: '', note: c.title ?? '' });
      for (const k of pre) marks.add(mk(k, key));
      for (const i of c.conditions) if (condKeys[i]) marks.add(mk(condKeys[i], key));
      for (const i of c.confirmations) if (confKeys[i]) marks.add(mk(confKeys[i], key));
    }
    return { rows, cases, marks };
  });

  // ─── Popover của một test case ───────────────────────────────
  const anchor = useRef<HTMLElement | null>(null);
  const [menu, setMenu] = useState<string | null>(null);
  const openMenu = (key: string, el: HTMLElement) => { anchor.current = el; setMenu(key); };
  const menuCase = draft.cases.find((c) => c.key === menu);
  // Khung chi tiết của một test case (UTCID) — xem trọn điều kiện / kết quả mong đợi đã đánh dấu.
  const [detail, setDetail] = useState<string | null>(null);
  const detailIdx = detail ? draft.cases.findIndex((c) => c.key === detail) : -1;
  const detailCase = detailIdx >= 0 ? draft.cases[detailIdx] : null;

  // Cột nhãn (Group/Value) KÉO RỘNG ĐƯỢC để đọc rõ chữ dài — lưu theo máy (localStorage).
  const LABEL_MIN = 240, LABEL_MAX = 960;
  const [labelW, setLabelW] = useState<number>(() => {
    try { const v = Number(localStorage.getItem('fpt:unit:labelW')); return v >= LABEL_MIN && v <= LABEL_MAX ? v : 380; } catch { return 380; }
  });
  const startLabelResize = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const x0 = e.clientX, w0 = labelW;
    const move = (ev: MouseEvent) => setLabelW(Math.min(LABEL_MAX, Math.max(LABEL_MIN, w0 + ev.clientX - x0)));
    const up = () => {
      window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up);
      document.body.style.cursor = '';
      setLabelW((w) => { const r = Math.round(w); try { localStorage.setItem('fpt:unit:labelW', String(r)); } catch { /* bỏ qua */ } return r; });
    };
    document.body.style.cursor = 'col-resize';
    window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
  };

  const width = labelW + Math.max(draft.cases.length, 1) * COL_W + 44;

  const renderSection = (section: UnitSection) => {
    const groups = groupsOf(draft.rows, section);
    const title = section === 'COND' ? 'Condition' : 'Confirmation';
    return (
      <>
        <tr className="fpt-sec">
          <th scope="rowgroup" className="fpt-sticky fpt-sec-head" colSpan={1}>
            <div className="flex items-center justify-between gap-2">
              <span>{title}</span>
              {canEdit && (
                section === 'COND' ? (
                  <button type="button" className="fpt-mini" onClick={() => addGroup('COND', 'New input')}><Plus size={12} /> Input</button>
                ) : (
                  <ConfirmGroupAdder existing={groups.map((g) => g.name)} onAdd={(n) => addGroup('CONFIRM', n)} />
                )
              )}
            </div>
          </th>
          <td colSpan={draft.cases.length + 1} className="fpt-sec-fill" />
        </tr>
        {groups.length === 0 && (
          <tr><td className="fpt-sticky px-3 py-2 text-[12px] text-[var(--w-text-3)]">{wt('fpt.noRowsYet', { what: title })}</td><td colSpan={draft.cases.length + 1} /></tr>
        )}
        {groups.map((g) => (
          <GroupRows
            key={`${section}-${g.name}`}
            section={section}
            group={g}
            cases={draft.cases}
            marks={draft.marks}
            canEdit={canEdit}
            activeCase={detail}
            onRename={(to) => renameGroup(section, g.name, to)}
            onAddValue={() => addValue(section, g.name)}
            onDeleteGroup={() => deleteGroup(section, g.name)}
            onRow={setRow}
            onDeleteRow={deleteRow}
            onToggle={toggle}
          />
        ))}
      </>
    );
  };

  return (
    <div className="flex min-h-0 flex-col">
      <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-[var(--w-text-2)]">
        <span><b className="tabular-nums text-[var(--w-text)]">{stats.total}</b> test case</span>
        <span className="text-[var(--w-green)]">{stats.passed} passed</span>
        <span className="text-[var(--w-red)]">{stats.failed} failed</span>
        <span>{wt('fpt.nUntested', { n: stats.total - stats.passed - stats.failed })}</span>
        <span className="text-[var(--w-text-3)]">N {stats.n} · A {stats.a} · B {stats.b}</span>
        <span className="ml-auto flex items-center gap-2">
          <SaveState state={stale ? 'error' : state} />
          {canEdit && (
            <button type="button" className="w-btn w-btn-sm" onClick={() => setAiOpen(true)} title={wt('fpt.aiSuggestTitle')}>
              <Sparkles size={13} /> {wt('fpt.aiSuggest')}
            </button>
          )}
          {draft.cases.length > 0 && (
            <button type="button" className="w-btn w-btn-sm" onClick={() => setDetail(detail ?? draft.cases[0].key)} title={wt('fpt.caseDetailsTitle')}>
              <PanelRightOpen size={13} /> {wt('fpt.caseDetails')}
            </button>
          )}
          {canEdit && <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => addCase()}><Plus size={13} /> Test case</button>}
        </span>
      </div>

      <div className="fpt-matrix-wrap overflow-auto rounded-[8px] border border-[var(--w-border)]">
        <table className="fpt-matrix" style={{ width }}>
          <colgroup>
            <col style={{ width: labelW }} />
            {draft.cases.map((c) => <col key={c.key} style={{ width: COL_W }} />)}
            <col style={{ width: 44 }} />
          </colgroup>
          <thead>
            <tr>
              <th className="fpt-sticky fpt-corner" scope="col">
                <div className="text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">{wt('fpt.groupValue')}</div>
                <div className="mt-0.5 text-[11px] text-[var(--w-text-3)]">{wt('fpt.clickMark')} <b>O</b></div>
                {/* Tay cầm KÉO để chỉnh rộng cột nhãn — đọc chữ dài cho rõ. */}
                <div
                  onMouseDown={startLabelResize}
                  title="Kéo để chỉnh rộng cột nhãn"
                  aria-hidden
                  className="absolute right-0 top-0 h-full w-[7px] cursor-col-resize select-none hover:bg-[var(--w-accent)]"
                />
              </th>
              {draft.cases.map((c, i) => (
                <th key={c.key} scope="col" className={cn('fpt-utc', detail === c.key && 'fpt-col-on')}>
                  <button type="button" className="fpt-utc-btn" onClick={(e) => openMenu(c.key, e.currentTarget)} title={`${utcId(i)} — ${TYPE_LABEL[c.type]}${c.note ? `\n${c.note}` : ''}`}>
                    <span className="fpt-vertical">{utcId(i)}</span>
                  </button>
                </th>
              ))}
              <th className="fpt-utc" scope="col">
                {canEdit && <button type="button" className="fpt-add-case" onClick={() => addCase()} aria-label={wt('fpt.addCase')}><Plus size={14} /></button>}
              </th>
            </tr>
          </thead>
          <tbody>
            {renderSection('COND')}
            {renderSection('CONFIRM')}
            <tr className="fpt-sec">
              <th className="fpt-sticky fpt-sec-head" scope="rowgroup">Result</th>
              <td colSpan={draft.cases.length + 1} className="fpt-sec-fill" />
            </tr>
            <tr>
              <th className="fpt-sticky fpt-res-label" scope="row">Type <span className="text-[var(--w-text-3)]">(N · A · B)</span></th>
              {draft.cases.map((c) => (
                <td key={c.key} className="fpt-cell">
                  <button type="button" disabled={!canEdit} className={cn('fpt-chip', TYPE_TONE[c.type])} onClick={() => setCase(c.key, { type: NEXT_TYPE[c.type] })} title={`${TYPE_LABEL[c.type]} — ${wt('fpt.clickChange')}`}>
                    {c.type}
                  </button>
                </td>
              ))}
              <td />
            </tr>
            <tr>
              <th className="fpt-sticky fpt-res-label" scope="row">Passed / Failed</th>
              {draft.cases.map((c) => (
                <td key={c.key} className="fpt-cell">
                  <button
                    type="button"
                    disabled={!canEdit}
                    className={cn('fpt-chip', c.result === 'P' ? 'bg-[var(--w-green)] text-white' : c.result === 'F' ? 'bg-[var(--w-red)] text-white' : 'text-[var(--w-text-3)]')}
                    onClick={() => setCase(c.key, {
                      result: c.result === null ? 'P' : c.result === 'P' ? 'F' : null,
                      executedAt: c.result === null ? (c.executedAt ?? todayIso()) : c.executedAt,
                    })}
                    title={wt('fpt.clickCycle')}
                  >
                    {c.result ?? '–'}
                  </button>
                </td>
              ))}
              <td />
            </tr>
            <tr>
              <th className="fpt-sticky fpt-res-label" scope="row">Executed date</th>
              {draft.cases.map((c) => (
                <td key={c.key} className="fpt-cell">
                  <button type="button" className="fpt-tiny" onClick={(e) => openMenu(c.key, e.currentTarget)}>{shortDate(c.executedAt) || '–'}</button>
                </td>
              ))}
              <td />
            </tr>
            <tr>
              <th className="fpt-sticky fpt-res-label" scope="row">Defect ID</th>
              {draft.cases.map((c) => (
                <td key={c.key} className="fpt-cell">
                  <button type="button" className={cn('fpt-tiny', c.defectId && 'font-semibold text-[var(--w-red)]')} onClick={(e) => openMenu(c.key, e.currentTarget)} title={c.defectId || wt('fpt.noDefect')}>
                    {c.defectId ? '●' : '–'}
                  </button>
                </td>
              ))}
              <td />
            </tr>
          </tbody>
        </table>
      </div>

      <Popover open={!!menuCase} onClose={() => setMenu(null)} anchorRef={anchor as React.RefObject<HTMLElement>} width={260}>
        {menuCase && (
          <CaseMenu
            index={draft.cases.findIndex((c) => c.key === menuCase.key)}
            total={draft.cases.length}
            c={menuCase}
            canEdit={canEdit}
            onChange={(p) => setCase(menuCase.key, p)}
            onDetails={() => { setDetail(menuCase.key); setMenu(null); }}
            onDuplicate={() => { addCase(menuCase.key); setMenu(null); }}
            onDelete={() => { deleteCase(menuCase.key); setMenu(null); }}
            onMove={(dir) => moveCase(menuCase.key, dir)}
          />
        )}
      </Popover>

      <DetailDrawer
        open={!!detailCase}
        onClose={() => setDetail(null)}
        title={detailCase ? `${utcId(detailIdx)} · ${TYPE_LABEL[detailCase.type]}` : ''}
        subtitle={`${fn.moduleName} › ${fn.methodName}`}
        onPrev={detailIdx > 0 ? () => setDetail(draft.cases[detailIdx - 1].key) : null}
        onNext={detailIdx >= 0 && detailIdx < draft.cases.length - 1 ? () => setDetail(draft.cases[detailIdx + 1].key) : null}
        width={520}
      >
        {detailCase && (
          <UnitCaseDetail
            rows={draft.rows}
            marks={draft.marks}
            c={detailCase}
            fn={fn}
            canEdit={canEdit}
            onChange={(p) => setCase(detailCase.key, p)}
            onToggle={(rk) => toggle(rk, detailCase.key)}
          />
        )}
      </DetailDrawer>

      <AiSuggestDialog open={aiOpen} onClose={() => setAiOpen(false)} pid={pid} fnId={fn.id} onApply={(s) => { applyAi(s); setAiOpen(false); }} />
    </div>
  );
}

function GroupRows({ section, group, cases, marks, canEdit, activeCase, onRename, onAddValue, onDeleteGroup, onRow, onDeleteRow, onToggle }: {
  section: UnitSection;
  activeCase?: string | null;
  group: { name: string; rows: DRow[] };
  cases: DCase[];
  marks: Set<string>;
  canEdit: boolean;
  onRename: (to: string) => void;
  onAddValue: () => void;
  onDeleteGroup: () => void;
  onRow: (key: string, patch: Partial<DRow>) => void;
  onDeleteRow: (key: string) => void;
  onToggle: (rk: string, ck: string) => void;
}) {
  const [name, setName] = useState(group.name);
  useEffect(() => setName(group.name), [group.name]);
  return (
    <>
      <tr className="fpt-group">
        <th className="fpt-sticky" scope="rowgroup">
          <div className="flex items-center gap-1">
            <input
              className="fpt-input fpt-group-input"
              value={name}
              readOnly={!canEdit}
              aria-label={wt('fpt.groupName', { s: section === 'COND' ? 'Input' : 'Confirmation' })}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => (name.trim() ? onRename(name) : setName(group.name))}
              onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
            />
            {canEdit && (
              <>
                <button type="button" className="fpt-mini" onClick={onAddValue} title={wt('fpt.addValueRow')}><Plus size={12} /> Value</button>
                <button type="button" className="fpt-icon" onClick={onDeleteGroup} aria-label={wt('fpt.deleteGroupN', { name: group.name })} title={wt('fpt.deleteGroup')}><Trash2 size={12} /></button>
              </>
            )}
          </div>
        </th>
        <td colSpan={cases.length + 1} className="fpt-group-fill" />
      </tr>
      {group.rows.map((r) => (
        <tr key={r.key} className="fpt-row">
          <th className="fpt-sticky" scope="row">
            <div className="flex items-start gap-1 py-0.5 pl-3">
              <RowText className="shrink-0 text-[12px] text-[var(--w-text-2)]" style={{ width: '34%' }} title={wt('fpt.noteTitle')} value={r.label} readOnly={!canEdit} maxLength={200}
                ariaLabel={wt('fpt.noteAria')} onChange={(v) => onRow(r.key, { label: v })} />
              <RowText className="min-w-0 flex-1 font-mono text-[12px]" placeholder={section === 'COND' ? 'value' : 'expected'} value={r.value} readOnly={!canEdit}
                ariaLabel={wt('fpt.value')} onChange={(v) => onRow(r.key, { value: v })} />
              {canEdit && <button type="button" className="fpt-icon fpt-row-del mt-0.5" onClick={() => onDeleteRow(r.key)} aria-label={wt('fpt.deleteRow')}><X size={12} /></button>}
            </div>
          </th>
          {cases.map((c, i) => {
            const on = marks.has(mk(r.key, c.key));
            return (
              <td key={c.key} className={cn('fpt-cell', activeCase === c.key && 'fpt-col-on')}>
                <button
                  type="button"
                  disabled={!canEdit}
                  title={`${utcId(i)} · ${group.name}${r.label ? ` (${r.label})` : ''} = ${r.value || '∅'}`}
                  aria-pressed={on}
                  aria-label={`${utcId(i)} ${group.name} ${r.value || r.label || ''}`}
                  className={cn('fpt-mark', on && 'is-on')}
                  onClick={() => onToggle(r.key, c.key)}
                >
                  {on ? 'O' : ''}
                </button>
              </td>
            );
          })}
          <td />
        </tr>
      ))}
    </>
  );
}

function ConfirmGroupAdder({ existing, onAdd }: { existing: string[]; onAdd: (name: string) => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const opts = ['Return', 'Exception', 'Log message', 'Screen message', 'Database state'];
  return (
    <>
      <button ref={ref} type="button" className="fpt-mini" onClick={() => setOpen(true)}><Plus size={12} /> Group</button>
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={ref} width={200}>
        <div className="py-1">
          {opts.map((o) => (
            <button key={o} type="button" className="block w-full px-3 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)]" onClick={() => { onAdd(o); setOpen(false); }}>
              {o} {existing.includes(o) && <span className="text-[11px] text-[var(--w-text-3)]">({wt('fpt.another')})</span>}
            </button>
          ))}
        </div>
      </Popover>
    </>
  );
}

function CaseMenu({ index, total, c, canEdit, onChange, onDuplicate, onDelete, onMove, onDetails }: {
  index: number; total: number; c: DCase; canEdit: boolean;
  onChange: (p: Partial<DCase>) => void; onDuplicate: () => void; onDelete: () => void; onMove: (d: -1 | 1) => void; onDetails: () => void;
}) {
  return (
    <div className="space-y-2.5 p-3 text-[13px]">
      <div className="flex items-center justify-between">
        <b>{utcId(index)}</b>
        <button type="button" className="w-btn w-btn-ghost w-btn-sm ml-auto mr-1" onClick={onDetails}><PanelRightOpen size={13} /> {wt('fpt.viewDetails')}</button>
        {canEdit && (
          <span className="flex gap-1">
            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" disabled={index === 0} onClick={() => onMove(-1)} aria-label={wt('fpt.moveLeft')}><ArrowLeft size={13} /></button>
            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" disabled={index === total - 1} onClick={() => onMove(1)} aria-label={wt('fpt.moveRight')}><ArrowRight size={13} /></button>
          </span>
        )}
      </div>
      <div>
        <div className="w-label !mb-1">{wt('common.type')} (Type)</div>
        <div className="flex gap-1" role="radiogroup" aria-label={wt('common.type')}>
          {(['N', 'A', 'B'] as CaseType[]).map((t) => (
            <button key={t} type="button" role="radio" aria-checked={c.type === t} disabled={!canEdit} onClick={() => onChange({ type: t })}
              className={cn('flex-1 rounded-[5px] border px-1 py-1 text-[12px]', c.type === t ? 'border-[var(--w-accent)] bg-[var(--w-accent-soft)] font-semibold' : 'border-[var(--w-border)]')}>
              {TYPE_LABEL[t]}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="w-label !mb-1">{wt('fpt.result')} (Result)</div>
        <div className="flex gap-1" role="radiogroup" aria-label={wt('fpt.result')}>
          {([null, 'P', 'F'] as Array<CaseResult | null>).map((r) => (
            <button key={String(r)} type="button" role="radio" aria-checked={c.result === r} disabled={!canEdit}
              onClick={() => onChange({ result: r, executedAt: r && !c.executedAt ? todayIso() : c.executedAt })}
              className={cn('flex-1 rounded-[5px] border px-1 py-1 text-[12px]', c.result === r ? 'border-[var(--w-accent)] bg-[var(--w-accent-soft)] font-semibold' : 'border-[var(--w-border)]')}>
              {r === null ? wt('fpt.untested') : r === 'P' ? 'Passed' : 'Failed'}
            </button>
          ))}
        </div>
      </div>
      <label className="block">
        <span className="w-label !mb-1">{wt('fpt.executedDate')} (Executed date)</span>
        <input type="date" className="w-input h-[30px]" value={c.executedAt ?? ''} disabled={!canEdit} onChange={(e) => onChange({ executedAt: e.target.value || null })} />
      </label>
      <label className="block">
        <span className="w-label !mb-1">Defect ID</span>
        <input className="w-input h-[30px]" value={c.defectId} disabled={!canEdit} maxLength={60} placeholder={wt('create.eg', { v: 'OBS-12' })} onChange={(e) => onChange({ defectId: e.target.value })} />
      </label>
      <label className="block">
        <span className="w-label !mb-1">{wt('fpt.note')}</span>
        <input className="w-input h-[30px]" value={c.note} disabled={!canEdit} maxLength={2000} placeholder={wt('fpt.notePh')} onChange={(e) => onChange({ note: e.target.value })} />
      </label>
      {canEdit && (
        <div className="flex justify-between pt-1">
          <button type="button" className="w-btn w-btn-sm" onClick={onDuplicate}><Copy size={12} /> {wt('tests.duplicate')}</button>
          <button type="button" className="w-btn w-btn-sm text-[var(--w-red)]" onClick={onDelete}><Trash2 size={12} /> {wt('common.delete')}</button>
        </div>
      )}
    </div>
  );
}

/** Ô chữ của một dòng ma trận: tự giãn theo nội dung (giá trị dài xuống dòng), giữ NGUYÊN khoảng trắng của giá trị biên. */
function RowText({ value, onChange, readOnly, className, placeholder, ariaLabel, title, maxLength, style }: {
  value: string; onChange: (v: string) => void; readOnly: boolean; className?: string; placeholder?: string; ariaLabel: string; title?: string; maxLength?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height = `${Math.max(26, el.scrollHeight + 2)}px`;
  });
  return (
    <textarea ref={ref} rows={1} style={style} className={cn('fpt-row-text', className)} value={value} readOnly={readOnly} placeholder={readOnly ? '' : placeholder}
      aria-label={ariaLabel} title={title ?? (value.length > 40 ? value : undefined)} maxLength={maxLength}
      // Enter không xuống dòng (giá trị ma trận là một dòng, như ô Excel) — Shift+Enter vẫn được.
      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); (e.target as HTMLTextAreaElement).blur(); } }}
      onChange={(e) => onChange(e.target.value)} />
  );
}

/** Khung chi tiết một UTCID: kiểu/kết quả/ngày/defect + trọn danh sách điều kiện và kết quả mong đợi đã đánh "O". */
function UnitCaseDetail({ rows, marks, c, fn, canEdit, onChange, onToggle }: {
  rows: DRow[]; marks: Set<string>; c: DCase; fn: UnitFunction; canEdit: boolean;
  onChange: (p: Partial<DCase>) => void; onToggle: (rowKey: string) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const section = (sec: UnitSection) => {
    const groups = groupsOf(rows, sec);
    const title = sec === 'COND' ? 'Condition' : 'Confirmation';
    return (
      <section>
        <h3 className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--w-text-3)]">{title}</h3>
        {groups.length === 0 && <p className="text-[12.5px] text-[var(--w-text-3)]">{wt('fpt.noRowsYet', { what: title })}</p>}
        <ul className="space-y-2">
          {groups.map((g) => {
            const on = g.rows.filter((r) => marks.has(mk(r.key, c.key)));
            const list = showAll ? g.rows : on;
            if (!list.length && !showAll) return null;
            return (
              <li key={g.name}>
                <div className="text-[12.5px] font-semibold">{g.name}</div>
                <ul className="mt-0.5 space-y-0.5">
                  {list.map((r) => {
                    const marked = marks.has(mk(r.key, c.key));
                    return (
                      <li key={r.key} className="flex items-start gap-2">
                        <button type="button" disabled={!canEdit} onClick={() => onToggle(r.key)} aria-pressed={marked}
                          className={cn('mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border text-[11px] font-bold',
                            marked ? 'border-[var(--w-accent)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text,var(--w-accent))]' : 'border-[var(--w-border)] text-transparent')}
                          aria-label={`${g.name} ${r.value || r.label || ''}`}>O</button>
                        <span className="min-w-0 flex-1 whitespace-pre-wrap break-words font-mono text-[12.5px]">
                          {r.value === '' ? <i className="font-sans text-[var(--w-text-3)]">{wt('fpt.emptyValue')}</i> : r.value}
                          {r.label && <span className="ml-2 font-sans text-[12px] text-[var(--w-text-3)]">— {r.label}</span>}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </section>
    );
  };
  return (
    <div className="space-y-4">
      {(fn.description || fn.preCondition) && (
        <div className="rounded-[6px] bg-[var(--w-sunken)] px-3 py-2 text-[12.5px] text-[var(--w-text-2)]">
          {fn.description && <p className="whitespace-pre-wrap">{fn.description}</p>}
          {fn.preCondition && <p className="mt-1 whitespace-pre-wrap"><b>Pre-condition:</b> {fn.preCondition}</p>}
        </div>
      )}
      <CaseFields c={c} canEdit={canEdit} onChange={onChange} />
      <label className="flex items-center gap-2 text-[12px] text-[var(--w-text-2)]">
        <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} /> {wt('fpt.showUnmarked')}
      </label>
      {section('COND')}
      {section('CONFIRM')}
    </div>
  );
}

function CaseFields({ c, canEdit, onChange }: { c: DCase; canEdit: boolean; onChange: (p: Partial<DCase>) => void }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[13px]">
      <div>
        <div className="w-label !mb-1">{wt('common.type')} (Type)</div>
        <div className="flex gap-1" role="radiogroup" aria-label={wt('common.type')}>
          {(['N', 'A', 'B'] as CaseType[]).map((t) => (
            <button key={t} type="button" role="radio" aria-checked={c.type === t} disabled={!canEdit} onClick={() => onChange({ type: t })}
              className={cn('flex-1 rounded-[5px] border px-1 py-1 text-[12px]', c.type === t ? 'border-[var(--w-accent)] bg-[var(--w-accent-soft)] font-semibold' : 'border-[var(--w-border)]')}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="w-label !mb-1">{wt('fpt.result')}</div>
        <div className="flex gap-1" role="radiogroup" aria-label={wt('fpt.result')}>
          {([null, 'P', 'F'] as Array<CaseResult | null>).map((r) => (
            <button key={String(r)} type="button" role="radio" aria-checked={c.result === r} disabled={!canEdit}
              onClick={() => onChange({ result: r, executedAt: r && !c.executedAt ? todayIso() : c.executedAt })}
              className={cn('flex-1 rounded-[5px] border px-1 py-1 text-[12px]', c.result === r ? 'border-[var(--w-accent)] bg-[var(--w-accent-soft)] font-semibold' : 'border-[var(--w-border)]')}>
              {r === null ? '–' : r === 'P' ? 'Passed' : 'Failed'}
            </button>
          ))}
        </div>
      </div>
      <label className="block">
        <span className="w-label !mb-1">{wt('fpt.executedDate')}</span>
        <input type="date" className="w-input h-[30px]" value={c.executedAt ?? ''} disabled={!canEdit} onChange={(e) => onChange({ executedAt: e.target.value || null })} />
      </label>
      <label className="block">
        <span className="w-label !mb-1">Defect ID</span>
        <input className="w-input h-[30px]" value={c.defectId} disabled={!canEdit} maxLength={60} onChange={(e) => onChange({ defectId: e.target.value })} />
      </label>
      <label className="col-span-2 block">
        <span className="w-label !mb-1">{wt('fpt.note')}</span>
        <input className="w-input h-[30px]" value={c.note} disabled={!canEdit} maxLength={2000} placeholder={wt('fpt.notePh')} onChange={(e) => onChange({ note: e.target.value })} />
      </label>
    </div>
  );
}
