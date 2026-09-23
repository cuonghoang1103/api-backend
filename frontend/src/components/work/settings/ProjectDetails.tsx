'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userName, workApi, workError, type ProjectConfig } from '@/lib/work-api';
import { Field, Spinner } from '../ui';
import { PROJECT_TYPE_LABEL, Section, Select } from './shared';
import { useProjectInvalidate } from './useProjectInvalidate';

const TEMPLATE_LABEL: Record<ProjectConfig['template'], string> = {
  BLANK: 'Blank project',
  SWP391: 'Software project (SWP391)',
  SWR302: 'Requirements (SWR302)',
  SWT301: 'Software testing (SWT301)',
  FREELANCE: 'Client project',
  COMPANY: 'Team project',
};

export default function ProjectDetails({ config, slug }: { config: ProjectConfig; slug: string }) {
  const invalidate = useProjectInvalidate(config.id, slug);
  const canEdit = config.permissions.settings;

  const [name, setName] = useState(config.name);
  const [description, setDescription] = useState(config.description ?? '');
  const [visibility, setVisibility] = useState(config.visibility);
  const [leadId, setLeadId] = useState<number | ''>(config.leadId ?? '');
  useEffect(() => {
    setName(config.name);
    setDescription(config.description ?? '');
    setVisibility(config.visibility);
    setLeadId(config.leadId ?? '');
  }, [config.name, config.description, config.visibility, config.leadId]);

  const leads = config.members.filter((m) => m.role === 'ADMIN' || m.role === 'MEMBER');
  const dirty =
    name.trim() !== config.name ||
    (description.trim() || null) !== (config.description ?? null) ||
    visibility !== config.visibility ||
    (leadId || null) !== (config.leadId ?? null);

  const save = useMutation({
    mutationFn: () => workApi.updateProject(config.id, {
      name: name.trim(),
      description: description.trim() || null,
      visibility,
      leadId: leadId || null,
    }),
    onSuccess: () => { toast.success('Project updated'); invalidate(); },
    onError: (err) => toast.error(workError(err, 'Could not save changes')),
  });

  return (
    <Section title="Project details">
      <form className="max-w-[560px]" onSubmit={(e) => { e.preventDefault(); if (canEdit && dirty && name.trim() && !save.isPending) save.mutate(); }}>
        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[1fr_140px]">
          <Field label="Name">
            <input className="w-input" value={name} onChange={(e) => setName(e.target.value)} disabled={!canEdit} maxLength={120} />
          </Field>
          <Field label="Key" hint="Cannot be changed">
            <div className="flex h-8 items-center rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-2.5 font-mono text-[12px] text-[var(--w-text-2)]">{config.key}</div>
          </Field>
        </div>
        <Field label="Description">
          <textarea className="w-input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} disabled={!canEdit} maxLength={5000} placeholder="What is this project about?" />
        </Field>
        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
          <Field label="Access">
            <Select value={visibility} onChange={(e) => setVisibility(e.target.value as 'WORKSPACE' | 'PRIVATE')} disabled={!canEdit}>
              <option value="WORKSPACE">Everyone in the workspace</option>
              <option value="PRIVATE">Only invited members</option>
            </Select>
          </Field>
          <Field label="Project lead">
            <Select value={leadId} onChange={(e) => setLeadId(e.target.value ? Number(e.target.value) : '')} disabled={!canEdit}>
              <option value="">No lead</option>
              {leads.map((m) => <option key={m.id} value={m.id}>{userName(m)}</option>)}
            </Select>
          </Field>
        </div>
        <div className="mb-5 flex flex-wrap gap-x-6 gap-y-1 text-[12px] text-[var(--w-text-3)]">
          <span>Type: <span className="text-[var(--w-text-2)]">{PROJECT_TYPE_LABEL[config.type]}</span></span>
          <span>Template: <span className="text-[var(--w-text-2)]">{TEMPLATE_LABEL[config.template]}</span></span>
        </div>
        {canEdit && (
          <button type="submit" className="w-btn w-btn-primary" disabled={!dirty || !name.trim() || save.isPending}>
            {save.isPending && <Spinner size={12} />}
            Save changes
          </button>
        )}
      </form>
    </Section>
  );
}
