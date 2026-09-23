'use client';

/** Tab Board: mỗi trạng thái một cột (mặc định) hoặc cột tuỳ chỉnh gom nhiều trạng thái. */

import { useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workApi, workError, type ProjectConfig } from '@/lib/work-api';
import { Spinner } from '../ui';
import { Section, Select } from './shared';
import { useProjectInvalidate } from './useProjectInvalidate';

interface DraftCol { uid: string; name: string; wip: string }
interface Draft { mode: 'status' | 'custom'; cols: DraftCol[]; assign: Record<number, string> }

let seq = 0;
const uid = () => `n${++seq}`;

/** Bản nháp khởi đầu từ cột board hiện tại (kể cả khi đang ở chế độ mặc định). */
function fromConfig(config: ProjectConfig): Draft {
  const saved = (config.settings as { boardColumns?: unknown } | null)?.boardColumns;
  const custom = Array.isArray(saved) && saved.length > 0;
  const cols = config.boardColumns.map((c) => ({ uid: c.key, name: c.name, wip: c.wipLimit == null ? '' : String(c.wipLimit) }));
  const assign: Record<number, string> = {};
  for (const c of config.boardColumns) for (const id of c.statusIds) assign[id] = c.key;
  return { mode: custom ? 'custom' : 'status', cols, assign };
}

const sig = (d: Draft) => JSON.stringify(d.mode === 'status' ? 'status' : [d.cols.map((c) => [c.uid, c.name.trim(), c.wip.trim()]), Object.entries(d.assign).sort()]);

export default function ProjectBoard({ config, slug }: { config: ProjectConfig; slug: string }) {
  const invalidate = useProjectInvalidate(config.id, slug);
  const canEdit = config.permissions.settings;
  const initial = useMemo(() => fromConfig(config), [config]);
  const initialSig = sig(initial);
  const [draft, setDraft] = useState<Draft>(initial);
  // Cấu hình máy chủ đổi thật sự ⇒ nạp lại bản nháp.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setDraft(initial), [initialSig]);

  const dirty = sig(draft) !== initialSig;
  const workflows = [...config.workflows].sort((a, b) => Number(b.isDefault) - Number(a.isDefault) || a.id - b.id);
  const allStatuses = workflows.flatMap((w) => [...w.statuses].sort((a, b) => a.position - b.position).map((s) => ({ ...s, wf: w.name })));
  const unassigned = allStatuses.filter((s) => !draft.cols.some((c) => c.uid === draft.assign[s.id]));
  const badWip = draft.cols.some((c) => c.wip.trim() && !(Number(c.wip) >= 1));
  const emptyName = draft.cols.some((c) => !c.name.trim());

  const save = useMutation({
    mutationFn: () => {
      if (draft.mode === 'status') return workApi.setBoardColumns(config.id, null);
      const columns = draft.cols.map((c) => ({
        name: c.name.trim(),
        statusIds: allStatuses.filter((s) => draft.assign[s.id] === c.uid).map((s) => s.id),
        wipLimit: c.wip.trim() ? Math.floor(Number(c.wip)) : null,
      }));
      return workApi.setBoardColumns(config.id, columns);
    },
    onSuccess: () => { toast.success('Board columns saved'); invalidate(); },
    onError: (err) => toast.error(workError(err, 'Could not save the board columns')),
  });

  const patchCol = (u: string, p: Partial<DraftCol>) => setDraft((d) => ({ ...d, cols: d.cols.map((c) => (c.uid === u ? { ...c, ...p } : c)) }));
  const moveCol = (i: number, dir: -1 | 1) => setDraft((d) => {
    const cols = [...d.cols];
    const j = i + dir;
    if (j < 0 || j >= cols.length) return d;
    [cols[i], cols[j]] = [cols[j], cols[i]];
    return { ...d, cols };
  });
  const removeCol = (u: string) => setDraft((d) => {
    // Trạng thái của cột bị bỏ chuyển sang cột kề bên (không để rơi khỏi board).
    const rest = d.cols.filter((c) => c.uid !== u);
    const idx = d.cols.findIndex((c) => c.uid === u);
    const fallback = rest[Math.max(0, idx - 1)]?.uid;
    const assign = { ...d.assign };
    for (const k of Object.keys(assign)) if (assign[Number(k)] === u && fallback) assign[Number(k)] = fallback;
    return { ...d, cols: rest, assign };
  });
  const addCol = () => setDraft((d) => ({ ...d, cols: [...d.cols, { uid: uid(), name: 'New column', wip: '' }] }));

  return (
    <Section
      title="Board columns"
      description="Choose how statuses map to columns on the board. Group several statuses into one column, or keep one column per status."
    >
      <div className="max-w-[640px]">
        <div className="mb-4 flex flex-col gap-1.5 text-[13px]">
          <label className={cn('flex items-center gap-2', canEdit ? 'cursor-pointer' : 'cursor-default')}>
            <input type="radio" name="board-mode" checked={draft.mode === 'status'} disabled={!canEdit} onChange={() => setDraft((d) => ({ ...d, mode: 'status' }))} className="accent-[var(--w-accent)]" />
            Use one column per status
          </label>
          <label className={cn('flex items-center gap-2', canEdit ? 'cursor-pointer' : 'cursor-default')}>
            <input type="radio" name="board-mode" checked={draft.mode === 'custom'} disabled={!canEdit} onChange={() => setDraft((d) => ({ ...d, mode: 'custom' }))} className="accent-[var(--w-accent)]" />
            Use custom columns
          </label>
        </div>

        {draft.mode === 'status' && (
          <div className="flex flex-wrap gap-1.5">
            {config.boardColumns.length > 0 && initial.mode === 'status'
              ? config.boardColumns.map((c) => (
                <span key={c.key} className="inline-flex h-7 items-center rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-2.5 text-[12px] text-[var(--w-text-2)]">{c.name}</span>
              ))
              : <p className="text-[13px] text-[var(--w-text-3)]">Each status of the default workflow becomes a column. Statuses of other workflows join the closest matching column.</p>}
          </div>
        )}

        {draft.mode === 'custom' && (
          <>
            <h4 className="mb-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--w-text-3)]">Columns</h4>
            <div className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
              {draft.cols.map((c, i) => (
                <div key={c.uid} className="flex items-center gap-2 border-b border-[var(--w-border)] px-3 py-2 last:border-b-0">
                  {canEdit && (
                    <div className="flex shrink-0 flex-col">
                      <button type="button" className="flex h-3.5 w-5 items-center justify-center text-[var(--w-text-3)] hover:text-[var(--w-text)] disabled:opacity-30" disabled={i === 0} onClick={() => moveCol(i, -1)} aria-label={`Move ${c.name} up`}>
                        <ArrowUp size={12} />
                      </button>
                      <button type="button" className="flex h-3.5 w-5 items-center justify-center text-[var(--w-text-3)] hover:text-[var(--w-text)] disabled:opacity-30" disabled={i === draft.cols.length - 1} onClick={() => moveCol(i, 1)} aria-label={`Move ${c.name} down`}>
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  )}
                  <input
                    className="w-input !h-7 min-w-0 flex-1 text-[13px] disabled:opacity-60"
                    value={c.name}
                    maxLength={40}
                    disabled={!canEdit}
                    onChange={(e) => patchCol(c.uid, { name: e.target.value })}
                    aria-label="Column name"
                  />
                  <input
                    type="number"
                    min={1}
                    inputMode="numeric"
                    className="w-input !h-7 !w-[72px] shrink-0 !px-2 text-[12px] disabled:opacity-60"
                    placeholder="No limit"
                    title="WIP limit (leave empty for no limit)"
                    value={c.wip}
                    disabled={!canEdit}
                    onChange={(e) => patchCol(c.uid, { wip: e.target.value })}
                    aria-label={`WIP limit for ${c.name}`}
                  />
                  <span className="hidden w-[64px] shrink-0 text-right text-[12px] text-[var(--w-text-3)] sm:inline">
                    {allStatuses.filter((s) => draft.assign[s.id] === c.uid).length} status{allStatuses.filter((s) => draft.assign[s.id] === c.uid).length === 1 ? '' : 'es'}
                  </span>
                  {canEdit && (
                    <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" disabled={draft.cols.length <= 1} onClick={() => removeCol(c.uid)} aria-label={`Remove column ${c.name}`} title="Remove column">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {canEdit && (
              <button type="button" className="w-btn w-btn-sm mt-2" onClick={addCol}>
                <Plus size={13} />
                Add column
              </button>
            )}

            <h4 className="mb-2 mt-6 text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--w-text-3)]">Status mapping</h4>
            <div className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
              {workflows.map((w) => (
                <div key={w.id}>
                  {workflows.length > 1 && (
                    <div className="border-b border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-1.5 text-[12px] font-medium text-[var(--w-text-2)]">{w.name}</div>
                  )}
                  {allStatuses.filter((s) => s.wf === w.name).map((s) => {
                    const missing = !draft.cols.some((c) => c.uid === draft.assign[s.id]);
                    return (
                      <div key={s.id} className="flex items-center gap-2 border-b border-[var(--w-border)] px-3 py-2 last:border-b-0">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
                        <span className="min-w-0 flex-1 truncate text-[13px]">{s.name}</span>
                        <Select
                          className={cn('!h-7 !w-[160px] text-[12px] sm:!w-[200px]', missing && '!border-[var(--w-red)]')}
                          value={missing ? '' : draft.assign[s.id]}
                          disabled={!canEdit}
                          onChange={(e) => setDraft((d) => ({ ...d, assign: { ...d.assign, [s.id]: e.target.value } }))}
                          aria-label={`Column for ${s.name}`}
                        >
                          {missing && <option value="">Choose a column…</option>}
                          {draft.cols.map((c) => <option key={c.uid} value={c.uid}>{c.name.trim() || 'Untitled column'}</option>)}
                        </Select>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            {unassigned.length > 0 && (
              <p className="mt-2 flex items-center gap-1.5 text-[12px] text-[var(--w-red)]">
                <AlertTriangle size={12} className="shrink-0" />
                {unassigned.length} status{unassigned.length === 1 ? ' is' : 'es are'} not on any column — issues in them would disappear from the board.
              </p>
            )}
          </>
        )}

        {canEdit && dirty && (
          <div className="mt-5 flex items-center justify-end gap-2">
            <button type="button" className="w-btn" onClick={() => setDraft(initial)}>Discard</button>
            <button
              type="button"
              className="w-btn w-btn-primary"
              disabled={save.isPending || (draft.mode === 'custom' && (!draft.cols.length || unassigned.length > 0 || badWip || emptyName))}
              onClick={() => save.mutate()}
            >
              {save.isPending && <Spinner size={12} />}
              Save columns
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}
