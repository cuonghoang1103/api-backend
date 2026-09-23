'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { userName, workApi, workError, type ProjectConfig, type WorkComponent } from '@/lib/work-api';
import { Dialog, Field, Spinner, UserAvatar } from '../ui';
import { ConfirmDialog, Section, Select } from './shared';
import { useProjectInvalidate } from './useProjectInvalidate';

type Editing = { mode: 'create' } | { mode: 'edit'; component: WorkComponent } | null;

function ComponentDialog({ editing, onClose, config, onSaved }: { editing: Editing; onClose: () => void; config: ProjectConfig; onSaved: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [leadId, setLeadId] = useState<number | ''>('');
  useEffect(() => {
    if (!editing) return;
    const c = editing.mode === 'edit' ? editing.component : null;
    setName(c?.name ?? '');
    setDescription(c?.description ?? '');
    setLeadId(c?.leadId ?? '');
  }, [editing]);

  const save = useMutation({
    mutationFn: () => {
      const body = { name: name.trim(), description: description.trim() || null, leadId: leadId || null };
      return editing?.mode === 'edit'
        ? workApi.updateComponent(config.id, editing.component.id, body)
        : workApi.createComponent(config.id, body);
    },
    onSuccess: (c) => {
      toast.success(editing?.mode === 'edit' ? 'Component updated' : `Component “${c.name}” created`);
      onSaved();
      onClose();
    },
    onError: (err) => toast.error(workError(err, 'Could not save the component')),
  });

  const leads = config.members.filter((m) => m.role === 'ADMIN' || m.role === 'MEMBER');

  return (
    <Dialog open={!!editing} onClose={onClose} title={editing?.mode === 'edit' ? 'Edit component' : 'New component'} width={460}>
      <form onSubmit={(e) => { e.preventDefault(); if (name.trim() && !save.isPending) save.mutate(); }}>
        <Field label="Name">
          <input className="w-input" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} autoFocus placeholder="e.g. Payment, Admin portal" />
        </Field>
        <Field label="Description (optional)">
          <textarea className="w-input" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <Field label="Component lead (optional)">
          <Select value={leadId} onChange={(e) => setLeadId(e.target.value ? Number(e.target.value) : '')}>
            <option value="">No lead</option>
            {leads.map((m) => <option key={m.id} value={m.id}>{userName(m)}</option>)}
          </Select>
        </Field>
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="w-btn w-btn-primary" disabled={!name.trim() || save.isPending}>
            {save.isPending && <Spinner size={12} />}
            {editing?.mode === 'edit' ? 'Save changes' : 'Create component'}
          </button>
        </div>
      </form>
    </Dialog>
  );
}

export default function ProjectComponents({ config, slug }: { config: ProjectConfig; slug: string }) {
  const invalidate = useProjectInvalidate(config.id, slug);
  const canEdit = config.permissions.settings;
  const [editing, setEditing] = useState<Editing>(null);
  const [deleting, setDeleting] = useState<WorkComponent | null>(null);
  const members = new Map(config.members.map((m) => [m.id, m]));

  const del = useMutation({
    mutationFn: (id: number) => workApi.deleteComponent(config.id, id),
    onSuccess: () => { toast.success('Component deleted'); setDeleting(null); invalidate(); },
    onError: (err) => toast.error(workError(err, 'Could not delete the component')),
  });

  return (
    <Section
      title="Components"
      description="Split the product into parts (modules, services, screens) so issues can be grouped and routed to the right person."
      action={canEdit ? <button type="button" className="w-btn w-btn-sm" onClick={() => setEditing({ mode: 'create' })}><Plus size={13} /> New component</button> : undefined}
    >
      {config.components.length ? (
        <div className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
          {config.components.map((c) => {
            const lead = c.leadId ? members.get(c.leadId) : undefined;
            return (
              <div key={c.id} className="flex items-center gap-3 border-b border-[var(--w-border)] px-3 py-2.5 last:border-b-0">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium">{c.name}</div>
                  {c.description && <div className="truncate text-[12px] text-[var(--w-text-3)]">{c.description}</div>}
                </div>
                <div className="hidden w-[170px] shrink-0 items-center gap-2 text-[12px] text-[var(--w-text-2)] sm:flex">
                  {lead ? <><UserAvatar user={lead} size={20} /><span className="truncate">{userName(lead)}</span></> : <span className="text-[var(--w-text-3)]">No lead</span>}
                </div>
                {canEdit && (
                  <div className="flex shrink-0 gap-0.5">
                    <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={() => setEditing({ mode: 'edit', component: c })} aria-label={`Edit ${c.name}`} title="Edit">
                      <Pencil size={13} />
                    </button>
                    <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={() => setDeleting(c)} aria-label={`Delete ${c.name}`} title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[8px] border border-dashed border-[var(--w-border-strong)] px-3 py-6 text-center text-[13px] text-[var(--w-text-3)]">No components yet.</div>
      )}

      <ComponentDialog editing={editing} onClose={() => setEditing(null)} config={config} onSaved={invalidate} />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete component?"
        body={<><span className="font-medium text-[var(--w-text)]">{deleting?.name}</span> will be removed from every issue that uses it.</>}
        confirmLabel="Delete component"
        pending={del.isPending}
        onConfirm={() => deleting && del.mutate(deleting.id)}
      />
    </Section>
  );
}
