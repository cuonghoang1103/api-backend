'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { userName, workApi, workError, type ProjectConfig, type WorkComponent } from '@/lib/work-api';
import { Dialog, Field, Spinner, UserAvatar } from '../ui';
import { ConfirmDialog, Section, Select } from './shared';
import { useProjectInvalidate } from './useProjectInvalidate';
import { wt } from '@/components/work/i18n';

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
      toast.success(editing?.mode === 'edit' ? wt('settings.compUpdated') : wt('settings.compCreated', { name: c.name }));
      onSaved();
      onClose();
    },
    onError: (err) => toast.error(workError(err, wt('settings.compSaveFailed'))),
  });

  const leads = config.members.filter((m) => m.role === 'ADMIN' || m.role === 'MEMBER');

  return (
    <Dialog open={!!editing} onClose={onClose} title={editing?.mode === 'edit' ? wt('settings.editComp') : wt('settings.newComp')} width={460}>
      <form onSubmit={(e) => { e.preventDefault(); if (name.trim() && !save.isPending) save.mutate(); }}>
        <Field label={wt('common.name')}>
          <input className="w-input" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} autoFocus placeholder={wt('settings.compPh')} />
        </Field>
        <Field label={wt('create.descOptional')}>
          <textarea className="w-input" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <Field label={wt('settings.compLead')}>
          <Select value={leadId} onChange={(e) => setLeadId(e.target.value ? Number(e.target.value) : '')}>
            <option value="">{wt('home.noLead')}</option>
            {leads.map((m) => <option key={m.id} value={m.id}>{userName(m)}</option>)}
          </Select>
        </Field>
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" className="w-btn" onClick={onClose}>{wt('common.cancel')}</button>
          <button type="submit" className="w-btn w-btn-primary" disabled={!name.trim() || save.isPending}>
            {save.isPending && <Spinner size={12} />}
            {editing?.mode === 'edit' ? wt('common.saveChanges') : wt('settings.createComp')}
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
    onSuccess: () => { toast.success(wt('settings.compDeleted')); setDeleting(null); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('settings.compDeleteFailed'))),
  });

  return (
    <Section
      title={wt('common.components')}
      description={wt('settings.compDesc')}
      action={canEdit ? <button type="button" className="w-btn w-btn-sm" onClick={() => setEditing({ mode: 'create' })}><Plus size={13} /> {wt('settings.newComp')}</button> : undefined}
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
                  {lead ? <><UserAvatar user={lead} size={20} /><span className="truncate">{userName(lead)}</span></> : <span className="text-[var(--w-text-3)]">{wt('home.noLead')}</span>}
                </div>
                {canEdit && (
                  <div className="flex shrink-0 gap-0.5">
                    <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={() => setEditing({ mode: 'edit', component: c })} aria-label={`${wt('common.edit')} ${c.name}`} title={wt('common.edit')}>
                      <Pencil size={13} />
                    </button>
                    <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={() => setDeleting(c)} aria-label={`${wt('common.delete')} ${c.name}`} title={wt('common.delete')}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[8px] border border-dashed border-[var(--w-border-strong)] px-3 py-6 text-center text-[13px] text-[var(--w-text-3)]">{wt('settings.noComps')}</div>
      )}

      <ComponentDialog editing={editing} onClose={() => setEditing(null)} config={config} onSaved={invalidate} />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title={wt('settings.deleteCompQ')}
        body={wt('settings.deleteCompBody', { name: deleting?.name ?? '' })}
        confirmLabel={wt('settings.deleteComp')}
        pending={del.isPending}
        onConfirm={() => deleting && del.mutate(deleting.id)}
      />
    </Section>
  );
}
