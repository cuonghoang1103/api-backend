'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workApi, workError, type ProjectConfig, type WorkLabel } from '@/lib/work-api';
import { Popover, Spinner, useToggle } from '../ui';
import { ConfirmDialog, Section } from './shared';
import { useProjectInvalidate } from './useProjectInvalidate';

/** Bảng màu nhãn — màu dữ liệu, nên được phép viết cứng. */
export const LABEL_COLORS = ['#64748b', '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#0891b2', '#2563eb', '#7c3aed'];

function ColorPicker({ value, onChange, disabled }: { value: string; onChange: (c: string) => void; disabled?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const pop = useToggle();
  return (
    <>
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={pop.toggle}
        aria-label="Label colour"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border border-[var(--w-border-strong)] hover:bg-[var(--w-hover)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="h-3 w-3 rounded-full" style={{ background: value }} />
      </button>
      <Popover open={pop.on} onClose={pop.close} anchorRef={ref} width={176}>
        <div className="grid grid-cols-4 gap-1.5 p-2.5">
          {LABEL_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Colour ${c}`}
              onClick={() => { onChange(c); pop.close(); }}
              className="flex h-8 w-full items-center justify-center rounded-[6px] hover:bg-[var(--w-hover)]"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full text-white" style={{ background: c }}>
                {c.toLowerCase() === value.toLowerCase() && <Check size={12} strokeWidth={3} />}
              </span>
            </button>
          ))}
        </div>
      </Popover>
    </>
  );
}

function LabelRow({ label, pid, canEdit, onChanged, onDelete }: { label: WorkLabel; pid: number; canEdit: boolean; onChanged: () => void; onDelete: () => void }) {
  const [name, setName] = useState(label.name);
  useEffect(() => setName(label.name), [label.name]);

  const update = useMutation({
    mutationFn: (body: { name: string; color: string }) => workApi.updateLabel(pid, label.id, body),
    onSuccess: () => onChanged(),
    onError: (err) => { toast.error(workError(err, 'Could not update the label')); setName(label.name); },
  });

  const commitName = () => {
    const n = name.trim();
    if (!n) { setName(label.name); return; }
    if (n !== label.name) update.mutate({ name: n, color: label.color });
  };

  return (
    <div className="flex items-center gap-2 border-b border-[var(--w-border)] px-3 py-2 last:border-b-0">
      <ColorPicker value={label.color} disabled={!canEdit || update.isPending} onChange={(c) => update.mutate({ name: label.name, color: c })} />
      {canEdit ? (
        <input
          className="h-7 min-w-0 flex-1 rounded-[5px] border border-transparent bg-transparent px-2 text-[13px] outline-none hover:border-[var(--w-border)] focus:border-[var(--w-accent-border)]"
          value={name}
          maxLength={50}
          onChange={(e) => setName(e.target.value)}
          onBlur={commitName}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return;
            if (e.key === 'Enter') e.currentTarget.blur();
            if (e.key === 'Escape') { setName(label.name); e.currentTarget.blur(); }
          }}
          aria-label="Label name"
        />
      ) : (
        <span className="min-w-0 flex-1 truncate px-2 text-[13px]">{label.name}</span>
      )}
      {update.isPending && <Spinner size={12} />}
      {canEdit && (
        <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={onDelete} aria-label={`Delete label ${label.name}`} title="Delete label">
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
}

export default function ProjectLabels({ config, slug }: { config: ProjectConfig; slug: string }) {
  const invalidate = useProjectInvalidate(config.id, slug);
  const canEdit = config.permissions.settings;
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(LABEL_COLORS[6]);
  const [deleting, setDeleting] = useState<WorkLabel | null>(null);

  const create = useMutation({
    mutationFn: () => workApi.createLabel(config.id, { name: newName.trim(), color: newColor }),
    onSuccess: (l) => {
      toast.success(`Label “${l.name}” created`);
      setNewName('');
      setNewColor(LABEL_COLORS[(LABEL_COLORS.indexOf(newColor) + 1) % LABEL_COLORS.length]);
      invalidate();
    },
    onError: (err) => toast.error(workError(err, 'Could not create the label')),
  });
  const del = useMutation({
    mutationFn: (id: number) => workApi.deleteLabel(config.id, id),
    onSuccess: () => { toast.success('Label deleted'); setDeleting(null); invalidate(); },
    onError: (err) => toast.error(workError(err, 'Could not delete the label')),
  });

  const labels = [...config.labels].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Section title="Labels" description="Tag issues across types and sprints — for example frontend, backend or needs-design. Click a name to rename it.">
      <div className="max-w-[560px]">
        {canEdit && (
          <form
            className="mb-3 flex items-center gap-2"
            onSubmit={(e) => { e.preventDefault(); if (newName.trim() && !create.isPending) create.mutate(); }}
          >
            <ColorPicker value={newColor} onChange={setNewColor} />
            <input className="w-input min-w-0 flex-1" placeholder="New label name" value={newName} maxLength={50} onChange={(e) => setNewName(e.target.value)} />
            <button type="submit" className="w-btn shrink-0" disabled={!newName.trim() || create.isPending}>
              {create.isPending ? <Spinner size={12} /> : <Plus size={14} />}
              Add
            </button>
          </form>
        )}
        <div className={cn('overflow-hidden rounded-[8px] border border-[var(--w-border)]', !labels.length && 'border-dashed')}>
          {labels.map((l) => (
            <LabelRow key={l.id} label={l} pid={config.id} canEdit={canEdit} onChanged={invalidate} onDelete={() => setDeleting(l)} />
          ))}
          {!labels.length && <div className="px-3 py-6 text-center text-[13px] text-[var(--w-text-3)]">No labels yet.</div>}
        </div>
      </div>
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete label?"
        body={<>The label <span className="font-medium text-[var(--w-text)]">{deleting?.name}</span> will be removed from every issue that uses it.</>}
        confirmLabel="Delete label"
        pending={del.isPending}
        onConfirm={() => deleting && del.mutate(deleting.id)}
      />
    </Section>
  );
}
