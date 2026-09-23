'use client';

/**
 * Bảng bước test sửa được: #, Action, Test data, Expected result. Mỗi ô là
 * textarea tự giãn. Tab đi qua các ô theo hàng (nút thao tác có tabIndex=-1
 * để không chen vào), ⌘/Ctrl+Enter thêm bước ngay dưới. Kéo tay nắm để đổi thứ tự.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Copy, GripVertical, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TestStep } from '@/lib/work-api';
import { Popover } from '../ui';

export interface DraftStep { key: string; action: string; data: string; expected: string }

let seq = 0;
export const newStepKey = () => `s${Date.now().toString(36)}${(seq++).toString(36)}`;
export const emptyStep = (): DraftStep => ({ key: newStepKey(), action: '', data: '', expected: '' });
export const toDraft = (s: { action: string; data: string | null; expected: string | null }): DraftStep =>
  ({ key: newStepKey(), action: s.action, data: s.data ?? '', expected: s.expected ?? '' });

/** Bước trống hoàn toàn bị bỏ; còn lại gửi nguyên (backend kiểm "action không rỗng"). */
export function stepsForSave(steps: DraftStep[]): TestStep[] {
  return steps
    .filter((s) => s.action.trim() || s.data.trim() || s.expected.trim())
    .map((s) => ({ action: s.action.trim(), data: s.data.trim() || null, expected: s.expected.trim() || null }));
}

/** Lỗi phía client trùng luật backend, để báo trước khi gửi. */
export function stepsProblem(steps: DraftStep[]): string | null {
  const real = stepsForSave(steps);
  if (real.length > 100) return 'A test can have at most 100 steps.';
  const i = real.findIndex((s) => !s.action);
  if (i >= 0) return `Step ${i + 1} needs an action.`;
  return null;
}

function AutoTextarea({ value, onChange, placeholder, readOnly, onKeyDown, cellId, invalid }: {
  value: string; onChange: (v: string) => void; placeholder: string; readOnly?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void; cellId: string; invalid?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const fit = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height = `${Math.max(el.scrollHeight, 30)}px`;
  }, []);
  useLayoutEffect(fit, [value, fit]);
  useEffect(() => {
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [fit]);
  return (
    <textarea
      ref={ref}
      data-cell={cellId}
      rows={1}
      value={value}
      readOnly={readOnly}
      placeholder={readOnly ? '' : placeholder}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      aria-invalid={invalid || undefined}
      className={cn(
        'block w-full resize-none overflow-hidden rounded-[5px] border border-transparent bg-transparent px-2 py-[5px] text-[13px] leading-[1.45] text-[var(--w-text)] outline-none placeholder:text-[var(--w-text-3)]',
        !readOnly && 'hover:bg-[var(--w-hover)] focus:border-[var(--w-accent-border)] focus:bg-[var(--w-panel)]',
        invalid && 'border-[color-mix(in_srgb,var(--w-red)_55%,transparent)]',
      )}
    />
  );
}

function RowMenu({ index, count, onInsert, onDuplicate, onDelete, onMove }: {
  index: number; count: number; onInsert: () => void; onDuplicate: () => void; onDelete: () => void; onMove: (dir: -1 | 1) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const item = 'flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)] disabled:opacity-40 disabled:hover:bg-transparent';
  const run = (fn: () => void) => () => { fn(); setOpen(false); };
  return (
    <>
      <button ref={ref} type="button" tabIndex={-1} onClick={() => setOpen((v) => !v)} className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`Step ${index + 1} actions`}>
        <MoreHorizontal size={14} />
      </button>
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={ref} width={190} align="end" className="p-1">
        <button type="button" className={item} onClick={run(onInsert)}><Plus size={13} /> Insert step below</button>
        <button type="button" className={item} onClick={run(onDuplicate)}><Copy size={13} /> Duplicate</button>
        <button type="button" className={item} disabled={index === 0} onClick={run(() => onMove(-1))}><ArrowUp size={13} /> Move up</button>
        <button type="button" className={item} disabled={index === count - 1} onClick={run(() => onMove(1))}><ArrowDown size={13} /> Move down</button>
        <div className="my-1 border-t border-[var(--w-border)]" />
        <button type="button" className={cn(item, 'text-[var(--w-red)]')} onClick={run(onDelete)}><Trash2 size={13} /> Delete step</button>
      </Popover>
    </>
  );
}

export default function StepsTable({ steps, onChange, readOnly, showErrors }: {
  steps: DraftStep[];
  onChange: (steps: DraftStep[]) => void;
  readOnly?: boolean;
  /** Tô đỏ ô Action trống của bước có nội dung (sau khi bấm Save). */
  showErrors?: boolean;
}) {
  const tableRef = useRef<HTMLDivElement>(null);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const pendingFocus = useRef<string | null>(null);

  useEffect(() => {
    if (!pendingFocus.current) return;
    const el = tableRef.current?.querySelector<HTMLTextAreaElement>(`[data-cell="${pendingFocus.current}"]`);
    pendingFocus.current = null;
    el?.focus();
  });

  const update = (i: number, patch: Partial<DraftStep>) => onChange(steps.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const insertAt = (i: number, s: DraftStep = emptyStep()) => {
    if (steps.length >= 100) return;
    const next = [...steps];
    next.splice(i, 0, s);
    pendingFocus.current = `${s.key}:action`;
    onChange(next);
  };
  const remove = (i: number) => onChange(steps.filter((_, j) => j !== i));
  const move = (from: number, to: number) => {
    if (to < 0 || to >= steps.length || from === to) return;
    const next = [...steps];
    const [s] = next.splice(from, 1);
    next.splice(to, 0, s);
    onChange(next);
  };

  const keyHandler = (i: number) => (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      insertAt(i + 1);
    }
  };

  const cols = 'grid grid-cols-[36px_minmax(170px,1.2fr)_minmax(130px,0.9fr)_minmax(170px,1.2fr)_36px]';

  return (
    <div className="overflow-x-auto rounded-[8px] border border-[var(--w-border)]">
      <div ref={tableRef} className="min-w-[600px]">
        <div className={cn(cols, 'border-b border-[var(--w-border)] bg-[var(--w-sunken)] text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]')}>
          <div className="px-2 py-2 text-center">#</div>
          <div className="px-2 py-2">Action</div>
          <div className="px-2 py-2">Test data</div>
          <div className="px-2 py-2">Expected result</div>
          <div />
        </div>
        {steps.map((s, i) => {
          const hasContent = !!(s.data.trim() || s.expected.trim());
          return (
            <div
              key={s.key}
              onDragOver={(e) => { if (dragFrom === null) return; e.preventDefault(); setDragOver(i); }}
              onDrop={(e) => { e.preventDefault(); if (dragFrom !== null) move(dragFrom, i); setDragFrom(null); setDragOver(null); }}
              className={cn(
                cols, 'group items-start border-b border-[var(--w-border)] last:border-b-0',
                dragFrom === i && 'opacity-50',
                dragOver === i && dragFrom !== null && dragFrom !== i && (dragFrom < i ? 'shadow-[inset_0_-2px_0_var(--w-accent)]' : 'shadow-[inset_0_2px_0_var(--w-accent)]'),
              )}
            >
              <div className="flex items-center justify-center gap-0.5 py-[7px] text-[12px] tabular text-[var(--w-text-3)]">
                {!readOnly && (
                  <span
                    draggable
                    onDragStart={(e) => { setDragFrom(i); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(i)); }}
                    onDragEnd={() => { setDragFrom(null); setDragOver(null); }}
                    title="Drag to reorder"
                    className="hidden cursor-grab text-[var(--w-text-3)] md:inline-flex md:opacity-0 md:group-hover:opacity-100"
                  >
                    <GripVertical size={12} />
                  </span>
                )}
                <span>{i + 1}</span>
              </div>
              <div className="p-1"><AutoTextarea cellId={`${s.key}:action`} value={s.action} onChange={(v) => update(i, { action: v })} placeholder="Describe the action" readOnly={readOnly} onKeyDown={keyHandler(i)} invalid={showErrors && hasContent && !s.action.trim()} /></div>
              <div className="p-1"><AutoTextarea cellId={`${s.key}:data`} value={s.data} onChange={(v) => update(i, { data: v })} placeholder="Input values" readOnly={readOnly} onKeyDown={keyHandler(i)} /></div>
              <div className="p-1"><AutoTextarea cellId={`${s.key}:expected`} value={s.expected} onChange={(v) => update(i, { expected: v })} placeholder="What should happen" readOnly={readOnly} onKeyDown={keyHandler(i)} /></div>
              <div className="flex justify-center py-1">
                {!readOnly && (
                  <RowMenu
                    index={i}
                    count={steps.length}
                    onInsert={() => insertAt(i + 1)}
                    onDuplicate={() => insertAt(i + 1, { ...s, key: newStepKey() })}
                    onDelete={() => remove(i)}
                    onMove={(d) => move(i, i + d)}
                  />
                )}
              </div>
            </div>
          );
        })}
        {!steps.length && (
          <div className="px-4 py-6 text-center text-[13px] text-[var(--w-text-3)]">
            {readOnly ? 'This test has no steps.' : 'No steps yet. Add the first step below.'}
          </div>
        )}
      </div>
      {!readOnly && (
        <div className="flex items-center gap-3 border-t border-[var(--w-border)] px-2 py-1.5">
          <button type="button" className="w-btn w-btn-ghost w-btn-sm" disabled={steps.length >= 100} onClick={() => insertAt(steps.length)}>
            <Plus size={13} /> Add step
          </button>
          <span className="hidden text-[11px] text-[var(--w-text-3)] sm:inline">
            <span className="w-kbd">Tab</span> next cell · <span className="w-kbd">⌘</span>+<span className="w-kbd">Enter</span> new step below
          </span>
          {steps.length >= 100 && <span className="text-[11px] text-[var(--w-orange)]">Maximum of 100 steps reached</span>}
        </div>
      )}
    </div>
  );
}
