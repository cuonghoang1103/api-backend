'use client';

/**
 * Hộp thoại thêm/sửa widget. Câu JQL được kiểm ngay tại đây (gọi search
 * limit 1) để lỗi hiện đúng chỗ, thay vì đợi lúc lưu cả dashboard mới báo.
 */

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { workApi, type DashboardWidget, type GroupBy, type ProjectConfig, type WidgetKind } from '@/lib/work-api';
import { Dialog, Field, Spinner } from '../ui';
import { JqlInput } from '../search/JqlInput';
import { jqlErrorOf } from '../search/jql';
import { useAllSprints } from '../reports/shared';
import { GROUP_BY_OPTIONS, newWidgetId, WIDGET_KINDS, WIDGET_META } from './widgets';

const DAY_OPTIONS = [7, 14, 30, 60, 90];

export default function WidgetDialog({ open, onClose, config, initial, onSubmit }: {
  open: boolean;
  onClose: () => void;
  config: ProjectConfig;
  /** null = thêm mới. */
  initial: DashboardWidget | null;
  onSubmit: (w: DashboardWidget) => void;
}) {
  const pid = config.id;
  const [kind, setKind] = useState<WidgetKind>('filter');
  const [title, setTitle] = useState('');
  const [query, setQuery] = useState('');
  const [groupBy, setGroupBy] = useState<GroupBy>('status');
  const [days, setDays] = useState(30);
  const [sprintId, setSprintId] = useState<number | null>(null);
  const [text, setText] = useState('');
  const [size, setSize] = useState<'half' | 'full'>('half');
  const [checking, setChecking] = useState(false);
  const [jqlErr, setJqlErr] = useState<{ message: string; position: number; q: string } | null>(null);
  const [tested, setTested] = useState<{ q: string; total: number } | null>(null);
  const [otherErr, setOtherErr] = useState<string | null>(null);
  const sprints = useAllSprints(pid);

  useEffect(() => {
    if (!open) return;
    setKind(initial?.kind ?? 'filter');
    setTitle(initial?.title ?? '');
    setQuery(initial?.query ?? '');
    setGroupBy(initial?.groupBy ?? 'status');
    setDays(initial?.days ?? 30);
    setSprintId(initial?.sprintId ?? null);
    setText(initial?.text ?? '');
    setSize(initial?.size ?? 'half');
    setJqlErr(null);
    setTested(null);
    setOtherErr(null);
  }, [open, initial]);

  const meta = WIDGET_META[kind];

  /** Trả true nếu câu truy vấn hợp lệ (hoặc widget không dùng truy vấn). */
  const check = async (q: string): Promise<boolean> => {
    if (!meta.usesQuery) return true;
    setChecking(true);
    setOtherErr(null);
    try {
      const r = await workApi.search(pid, q, { limit: 1 });
      setJqlErr(null);
      setTested({ q, total: r.total });
      return true;
    } catch (err) {
      const j = jqlErrorOf(err);
      setTested(null);
      if (j) setJqlErr({ ...j, q });
      else setOtherErr('Could not check the query. Try again.');
      return false;
    } finally {
      setChecking(false);
    }
  };

  const submit = async () => {
    const q = query.trim();
    if (!(await check(q))) return;
    onSubmit({
      id: initial?.id ?? newWidgetId(),
      kind,
      title: title.trim() || meta.defaultTitle,
      size,
      ...(meta.usesQuery ? { query: q } : {}),
      ...(kind === 'pie' || kind === 'bar' ? { groupBy } : {}),
      ...(kind === 'created_resolved' ? { days } : {}),
      ...(kind === 'burndown' ? { sprintId } : {}),
      ...(kind === 'text' ? { text } : {}),
    });
  };

  const reportable = (sprints.data ?? []).filter((s) => s.state !== 'PLANNED');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={initial ? 'Edit widget' : 'Add widget'}
      width={560}
      footer={
        <>
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="w-btn w-btn-primary" disabled={checking} onClick={() => void submit()}>
            {checking && <Spinner size={12} />} {initial ? 'Update widget' : 'Add widget'}
          </button>
        </>
      }
    >
      <Field label="Widget type">
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
          {WIDGET_KINDS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => { setKind(k); setJqlErr(null); setTested(null); }}
              aria-pressed={kind === k}
              title={WIDGET_META[k].description}
              className={cn(
                'rounded-[6px] border px-2.5 py-1.5 text-left text-[12.5px] transition-colors',
                kind === k
                  ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]'
                  : 'border-[var(--w-border-strong)] hover:bg-[var(--w-hover)]',
              )}
            >
              {WIDGET_META[k].label}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-[12px] text-[var(--w-text-3)]">{meta.description}.</p>
      </Field>

      <Field label="Title">
        <input value={title} maxLength={80} onChange={(e) => setTitle(e.target.value)} placeholder={meta.defaultTitle} className="w-input" />
      </Field>

      {meta.usesQuery && (
        <Field label="Query (JQL)" hint={jqlErr ? undefined : 'Leave empty to include every issue in the project.'}>
          <JqlInput
            value={query}
            onChange={(v) => { setQuery(v); setTested(null); }}
            onRun={(v) => void check(v)}
            config={config}
            error={jqlErr}
            ranQuery={jqlErr?.q}
            runLabel="Test"
            placeholder="e.g. statusCategory != Done"
          />
          {tested && tested.q === query.trim() && (
            <p className="mt-1 text-[12px] text-[var(--w-green)]">Valid query · {tested.total} {tested.total === 1 ? 'issue matches' : 'issues match'}</p>
          )}
          {otherErr && <p className="mt-1 text-[12px] text-[var(--w-red)]">{otherErr}</p>}
        </Field>
      )}

      {(kind === 'pie' || kind === 'bar') && (
        <Field label="Group by">
          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value as GroupBy)} className="w-input">
            {GROUP_BY_OPTIONS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </Field>
      )}

      {kind === 'created_resolved' && (
        <Field label="Period">
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-input">
            {DAY_OPTIONS.map((d) => <option key={d} value={d}>Last {d} days</option>)}
          </select>
        </Field>
      )}

      {kind === 'burndown' && (
        <Field label="Sprint" hint="The active sprint follows your team from sprint to sprint.">
          <select value={sprintId ?? ''} onChange={(e) => setSprintId(e.target.value ? Number(e.target.value) : null)} className="w-input">
            <option value="">Active sprint (automatic)</option>
            {reportable.map((s) => <option key={s.id} value={s.id}>{s.name}{s.state === 'ACTIVE' ? ' (active)' : ''}</option>)}
          </select>
        </Field>
      )}

      {kind === 'text' && (
        <Field label="Text" hint="Plain text. Leave a blank line between paragraphs.">
          <textarea value={text} maxLength={5000} rows={6} onChange={(e) => setText(e.target.value)} className="w-input" placeholder="Team agreements, links, release notes…" />
        </Field>
      )}

      <Field label="Width">
        <div className="inline-flex rounded-[var(--w-radius)] border border-[var(--w-border-strong)] p-0.5" role="radiogroup" aria-label="Width">
          {(['half', 'full'] as const).map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={size === s}
              onClick={() => setSize(s)}
              className={cn(
                'h-[26px] rounded-[4px] px-3 text-[12px] font-medium',
                size === s ? 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]',
              )}
            >
              {s === 'half' ? 'Half width' : 'Full width'}
            </button>
          ))}
        </div>
      </Field>
    </Dialog>
  );
}
