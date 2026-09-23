'use client';

/** Tab Fields: trường tuỳ chỉnh của dự án — tạo, sửa, bật bắt buộc, xoá. */

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workApi, workError, type CustomField, type CustomKind, type ProjectConfig } from '@/lib/work-api';
import { Dialog, Field, IssueTypeIcon, Spinner } from '../ui';
import { ConfirmDialog, Section, Select } from './shared';
import { ColorPicker, LABEL_COLORS } from './ProjectLabels';
import { useProjectInvalidate } from './useProjectInvalidate';

export const KIND_LABEL: Record<CustomKind, string> = {
  TEXT: 'Text',
  NUMBER: 'Number',
  DATE: 'Date',
  SELECT: 'Select list',
  MULTISELECT: 'Multi-select',
  USER: 'User',
  URL: 'URL',
  CHECKBOX: 'Checkbox',
};
const KINDS = Object.keys(KIND_LABEL) as CustomKind[];
const hasOptions = (k: CustomKind) => k === 'SELECT' || k === 'MULTISELECT';

interface DraftOption { uid: string; id?: string; label: string; color: string }
let seq = 0;
const uid = () => `o${++seq}`;

type Editing = { mode: 'create' } | { mode: 'edit'; field: CustomField } | null;

function FieldDialog({ editing, onClose, config, onSaved }: { editing: Editing; onClose: () => void; config: ProjectConfig; onSaved: () => void }) {
  const [name, setName] = useState('');
  const [kind, setKind] = useState<CustomKind>('TEXT');
  const [options, setOptions] = useState<DraftOption[]>([]);
  const [allTypes, setAllTypes] = useState(true);
  const [typeKeys, setTypeKeys] = useState<string[]>([]);
  const [required, setRequired] = useState(false);

  useEffect(() => {
    if (!editing) return;
    const f = editing.mode === 'edit' ? editing.field : null;
    setName(f?.name ?? '');
    setKind(f?.kind ?? 'TEXT');
    setOptions(f?.options.length
      ? f.options.map((o) => ({ uid: uid(), id: o.id, label: o.label, color: o.color }))
      : [{ uid: uid(), label: '', color: LABEL_COLORS[0] }]);
    setAllTypes(!f?.typeKeys?.length);
    setTypeKeys(f?.typeKeys ?? []);
    setRequired(f?.required ?? false);
  }, [editing]);

  const cleanOpts = options.filter((o) => o.label.trim());
  const dupOpt = new Set(cleanOpts.map((o) => o.label.trim().toLowerCase())).size !== cleanOpts.length;
  const invalid = !name.trim() || (hasOptions(kind) && (!cleanOpts.length || dupOpt)) || (!allTypes && !typeKeys.length);

  const save = useMutation({
    mutationFn: () => {
      const opts = hasOptions(kind) ? cleanOpts.map((o) => ({ ...(o.id ? { id: o.id } : {}), label: o.label.trim(), color: o.color })) : undefined;
      const body = { name: name.trim(), options: opts, typeKeys: allTypes ? null : typeKeys, required };
      return editing?.mode === 'edit'
        ? workApi.updateCustomField(config.id, editing.field.id, body)
        : workApi.createCustomField(config.id, { ...body, kind });
    },
    onSuccess: () => {
      toast.success(editing?.mode === 'edit' ? 'Field updated' : `Field “${name.trim()}” created`);
      onSaved();
      onClose();
    },
    onError: (err) => toast.error(workError(err, 'Could not save the field')),
  });

  const patchOpt = (u: string, p: Partial<DraftOption>) => setOptions((os) => os.map((o) => (o.uid === u ? { ...o, ...p } : o)));
  const toggleType = (k: string) => setTypeKeys((ks) => (ks.includes(k) ? ks.filter((x) => x !== k) : [...ks, k]));

  return (
    <Dialog open={!!editing} onClose={onClose} title={editing?.mode === 'edit' ? 'Edit field' : 'New field'} width={500}>
      <form onSubmit={(e) => { e.preventDefault(); if (!invalid && !save.isPending) save.mutate(); }}>
        <Field label="Name">
          <input className="w-input" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} autoFocus placeholder="e.g. Environment, Customer, Severity" />
        </Field>
        <Field label="Field type" hint={editing?.mode === 'edit' ? 'The type of a field cannot be changed after it is created.' : undefined}>
          <Select value={kind} disabled={editing?.mode === 'edit'} onChange={(e) => setKind(e.target.value as CustomKind)}>
            {KINDS.map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
          </Select>
        </Field>

        {hasOptions(kind) && (
          <Field label="Options" hint={dupOpt ? undefined : editing?.mode === 'edit' ? 'Removing an option clears it from issues that use it.' : undefined}>
            <div className="flex flex-col gap-1.5">
              {options.map((o, i) => (
                <div key={o.uid} className="flex items-center gap-2">
                  <ColorPicker value={o.color} ariaLabel="Option colour" onChange={(c) => patchOpt(o.uid, { color: c })} />
                  <input
                    className="w-input min-w-0 flex-1"
                    value={o.label}
                    maxLength={60}
                    placeholder={`Option ${i + 1}`}
                    onChange={(e) => patchOpt(o.uid, { label: e.target.value })}
                    aria-label={`Option ${i + 1}`}
                  />
                  <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" disabled={options.length <= 1} onClick={() => setOptions((os) => os.filter((x) => x.uid !== o.uid))} aria-label="Remove option" title="Remove option">
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="w-btn w-btn-sm mt-2"
              onClick={() => setOptions((os) => [...os, { uid: uid(), label: '', color: LABEL_COLORS[os.length % LABEL_COLORS.length] }])}
            >
              <Plus size={13} />
              Add option
            </button>
            {dupOpt && <p className="mt-1 text-[12px] text-[var(--w-red)]">Option labels must be unique.</p>}
          </Field>
        )}

        <Field label="Applies to">
          <div className="flex flex-col gap-1.5 text-[13px]">
            <label className="flex cursor-pointer items-center gap-2">
              <input type="radio" name="applies" checked={allTypes} onChange={() => setAllTypes(true)} className="accent-[var(--w-accent)]" />
              All issue types
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input type="radio" name="applies" checked={!allTypes} onChange={() => setAllTypes(false)} className="accent-[var(--w-accent)]" />
              Only these issue types
            </label>
            {!allTypes && (
              <div className="ml-6 mt-1 flex flex-wrap gap-x-4 gap-y-1.5">
                {config.issueTypes.map((t) => (
                  <label key={t.id} className="flex cursor-pointer items-center gap-1.5">
                    <input type="checkbox" checked={typeKeys.includes(t.key)} onChange={() => toggleType(t.key)} className="accent-[var(--w-accent)]" />
                    <IssueTypeIcon type={t} size={12} />
                    {t.name}
                  </label>
                ))}
              </div>
            )}
          </div>
        </Field>

        <label className="mb-2 flex cursor-pointer items-center gap-2 text-[13px]">
          <input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} className="accent-[var(--w-accent)]" />
          Required — the field cannot be cleared once set
        </label>

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="w-btn w-btn-primary" disabled={invalid || save.isPending}>
            {save.isPending && <Spinner size={12} />}
            {editing?.mode === 'edit' ? 'Save changes' : 'Create field'}
          </button>
        </div>
      </form>
    </Dialog>
  );
}

function FieldRow({ field, config, canEdit, onEdit, onDelete, onChanged }: { field: CustomField; config: ProjectConfig; canEdit: boolean; onEdit: () => void; onDelete: () => void; onChanged: () => void }) {
  const toggleRequired = useMutation({
    mutationFn: (v: boolean) => workApi.updateCustomField(config.id, field.id, { required: v }),
    onSuccess: () => onChanged(),
    onError: (err) => toast.error(workError(err, 'Could not update the field')),
  });
  const types = field.typeKeys?.length ? config.issueTypes.filter((t) => field.typeKeys!.includes(t.key)) : null;

  return (
    <div className="flex flex-wrap items-start gap-x-3 gap-y-1.5 border-b border-[var(--w-border)] px-3 py-2.5 last:border-b-0 sm:flex-nowrap sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate text-[13px] font-medium">{field.name}</span>
          <span className="rounded-[4px] border border-[var(--w-border-strong)] px-1.5 text-[11px] leading-[18px] text-[var(--w-text-2)]">{KIND_LABEL[field.kind] ?? field.kind}</span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[12px] text-[var(--w-text-3)]">
          {hasOptions(field.kind) && field.options.map((o) => (
            <span key={o.id} className="inline-flex h-[20px] items-center gap-1 rounded-full border border-[var(--w-border-strong)] px-2 text-[11px] text-[var(--w-text-2)]">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: o.color }} />
              {o.label}
            </span>
          ))}
          <span className="inline-flex items-center gap-1">
            {types ? (
              <>
                Applies to
                {types.map((t) => (
                  <span key={t.id} className="inline-flex items-center gap-1 text-[var(--w-text-2)]">
                    <IssueTypeIcon type={t} size={11} />
                    {t.name}
                  </span>
                ))}
                {!types.length && <span className="italic">no active issue type</span>}
              </>
            ) : 'Applies to all issue types'}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <label className={cn('mr-2 flex items-center gap-1.5 text-[12px] text-[var(--w-text-2)]', canEdit ? 'cursor-pointer' : 'cursor-default')}>
          <input
            type="checkbox"
            checked={field.required}
            disabled={!canEdit || toggleRequired.isPending}
            onChange={(e) => toggleRequired.mutate(e.target.checked)}
            className="accent-[var(--w-accent)]"
          />
          Required
        </label>
        {toggleRequired.isPending && <Spinner size={12} />}
        {canEdit && (
          <>
            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={onEdit} aria-label={`Edit field ${field.name}`} title="Edit field">
              <Pencil size={13} />
            </button>
            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={onDelete} aria-label={`Delete field ${field.name}`} title="Delete field">
              <Trash2 size={13} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function ProjectFields({ config, slug }: { config: ProjectConfig; slug: string }) {
  const invalidate = useProjectInvalidate(config.id, slug);
  const canEdit = config.permissions.settings;
  const [editing, setEditing] = useState<Editing>(null);
  const [deleting, setDeleting] = useState<CustomField | null>(null);

  const del = useMutation({
    mutationFn: (id: number) => workApi.deleteCustomField(config.id, id),
    onSuccess: () => { toast.success('Field deleted'); setDeleting(null); invalidate(); },
    onError: (err) => toast.error(workError(err, 'Could not delete the field')),
  });

  const fields = [...(config.customFields ?? [])].sort((a, b) => a.position - b.position || a.id - b.id);

  return (
    <Section
      title="Custom fields"
      description="Extra fields shown on issues in this project — for example Environment, Customer or Severity."
      action={canEdit ? (
        <button type="button" className="w-btn" onClick={() => setEditing({ mode: 'create' })} aria-label="New field">
          <Plus size={14} />
          <span className="hidden sm:inline">New field</span>
        </button>
      ) : undefined}
    >
      <div className={cn('overflow-hidden rounded-[8px] border border-[var(--w-border)]', !fields.length && 'border-dashed')}>
        {fields.map((f) => (
          <FieldRow
            key={f.id}
            field={f}
            config={config}
            canEdit={canEdit}
            onEdit={() => setEditing({ mode: 'edit', field: f })}
            onDelete={() => setDeleting(f)}
            onChanged={invalidate}
          />
        ))}
        {!fields.length && <div className="px-3 py-6 text-center text-[13px] text-[var(--w-text-3)]">No custom fields yet.</div>}
      </div>
      <FieldDialog editing={editing} onClose={() => setEditing(null)} config={config} onSaved={invalidate} />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete field?"
        body={<>The field <span className="font-medium text-[var(--w-text)]">{deleting?.name}</span> and every value stored in it will be permanently removed from all issues.</>}
        confirmLabel="Delete field"
        pending={del.isPending}
        onConfirm={() => deleting && del.mutate(deleting.id)}
      />
    </Section>
  );
}
