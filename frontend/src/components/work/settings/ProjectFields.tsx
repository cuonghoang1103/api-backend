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
import { wt } from '@/components/work/i18n';

export const KIND_LABEL: Record<CustomKind, string> = {
  get TEXT() { return wt('pfields.kText'); },
  get NUMBER() { return wt('pfields.kNumber'); },
  get DATE() { return wt('pfields.kDate'); },
  get SELECT() { return wt('pfields.kSelect'); },
  get MULTISELECT() { return wt('pfields.kMulti'); },
  get USER() { return wt('pfields.kUser'); },
  URL: 'URL',
  get CHECKBOX() { return wt('pfields.kCheckbox'); },
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
      toast.success(editing?.mode === 'edit' ? wt('pfields.updated') : wt('pfields.created', { n: name.trim() }));
      onSaved();
      onClose();
    },
    onError: (err) => toast.error(workError(err, wt('pfields.saveFailed'))),
  });

  const patchOpt = (u: string, p: Partial<DraftOption>) => setOptions((os) => os.map((o) => (o.uid === u ? { ...o, ...p } : o)));
  const toggleType = (k: string) => setTypeKeys((ks) => (ks.includes(k) ? ks.filter((x) => x !== k) : [...ks, k]));

  return (
    <Dialog open={!!editing} onClose={onClose} title={editing?.mode === 'edit' ? wt('pfields.editField') : wt('pfields.newField')} width={500}>
      <form onSubmit={(e) => { e.preventDefault(); if (!invalid && !save.isPending) save.mutate(); }}>
        <Field label={wt('common.name')}>
          <input className="w-input" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} autoFocus placeholder={wt('pfields.namePh')} />
        </Field>
        <Field label={wt('pfields.fieldType')} hint={editing?.mode === 'edit' ? wt('pfields.typeLocked') : undefined}>
          <Select value={kind} disabled={editing?.mode === 'edit'} onChange={(e) => setKind(e.target.value as CustomKind)}>
            {KINDS.map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
          </Select>
        </Field>

        {hasOptions(kind) && (
          <Field label={wt('pfields.options')} hint={dupOpt ? undefined : editing?.mode === 'edit' ? wt('pfields.removeClears') : undefined}>
            <div className="flex flex-col gap-1.5">
              {options.map((o, i) => (
                <div key={o.uid} className="flex items-center gap-2">
                  <ColorPicker value={o.color} ariaLabel={wt('pfields.optColour')} onChange={(c) => patchOpt(o.uid, { color: c })} />
                  <input
                    className="w-input min-w-0 flex-1"
                    value={o.label}
                    maxLength={60}
                    placeholder={wt('pfields.optionN', { n: i + 1 })}
                    onChange={(e) => patchOpt(o.uid, { label: e.target.value })}
                    aria-label={wt('pfields.optionN', { n: i + 1 })}
                  />
                  <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" disabled={options.length <= 1} onClick={() => setOptions((os) => os.filter((x) => x.uid !== o.uid))} aria-label={wt('pfields.removeOpt')} title={wt('pfields.removeOpt')}>
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
              {wt('pfields.addOpt')}
            </button>
            {dupOpt && <p className="mt-1 text-[12px] text-[var(--w-red)]">{wt('pfields.uniqueOpt')}</p>}
          </Field>
        )}

        <Field label={wt('pfields.appliesTo')}>
          <div className="flex flex-col gap-1.5 text-[13px]">
            <label className="flex cursor-pointer items-center gap-2">
              <input type="radio" name="applies" checked={allTypes} onChange={() => setAllTypes(true)} className="accent-[var(--w-accent)]" />
              {wt('pfields.allTypes')}
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input type="radio" name="applies" checked={!allTypes} onChange={() => setAllTypes(false)} className="accent-[var(--w-accent)]" />
              {wt('pfields.onlyTypes')}
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
          {wt('pfields.required')}
        </label>

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="w-btn" onClick={onClose}>{wt('common.cancel')}</button>
          <button type="submit" className="w-btn w-btn-primary" disabled={invalid || save.isPending}>
            {save.isPending && <Spinner size={12} />}
            {editing?.mode === 'edit' ? wt('common.saveChanges') : wt('pfields.createField')}
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
    onError: (err) => toast.error(workError(err, wt('pfields.updateFailed'))),
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
                {wt('pfields.appliesTo')}
                {types.map((t) => (
                  <span key={t.id} className="inline-flex items-center gap-1 text-[var(--w-text-2)]">
                    <IssueTypeIcon type={t} size={11} />
                    {t.name}
                  </span>
                ))}
                {!types.length && <span className="italic">{wt('pfields.noActiveType')}</span>}
              </>
            ) : wt('pfields.appliesAll')}
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
            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={onEdit} aria-label={wt('pfields.editFieldX', { n: field.name })} title={wt('pfields.editField')}>
              <Pencil size={13} />
            </button>
            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={onDelete} aria-label={wt('pfields.deleteFieldX', { n: field.name })} title={wt('pfields.deleteField')}>
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
    onSuccess: () => { toast.success(wt('pfields.deleted')); setDeleting(null); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('pfields.deleteFailed'))),
  });

  const fields = [...(config.customFields ?? [])].sort((a, b) => a.position - b.position || a.id - b.id);

  return (
    <Section
      title={wt('pfields.customFields')}
      description={wt('pfields.customDesc')}
      action={canEdit ? (
        <button type="button" className="w-btn" onClick={() => setEditing({ mode: 'create' })} aria-label={wt('pfields.newField')}>
          <Plus size={14} />
          <span className="hidden sm:inline">{wt('pfields.newField')}</span>
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
        {!fields.length && <div className="px-3 py-6 text-center text-[13px] text-[var(--w-text-3)]">{wt('pfields.noCustom')}</div>}
      </div>
      <FieldDialog editing={editing} onClose={() => setEditing(null)} config={config} onSaved={invalidate} />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title={wt('pfields.deleteQ')}
        body={wt('pfields.deleteBody', { n: deleting?.name ?? '' })}
        confirmLabel={wt('pfields.deleteField')}
        pending={del.isPending}
        onConfirm={() => deleting && del.mutate(deleting.id)}
      />
    </Section>
  );
}
