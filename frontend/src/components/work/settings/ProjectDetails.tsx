'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userName, workApi, workError, type ProjectConfig } from '@/lib/work-api';
import { Field, Spinner } from '../ui';
import { PROJECT_TYPE_LABEL, Section, Select, Switch } from './shared';
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
    <>
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
    <DefinitionOfDone config={config} slug={slug} />
    <TeamRules config={config} slug={slug} />
    </>
  );
}

/** Đọc danh sách DoD từ settings (mẫu dự án ghi sẵn 3 dòng). */
function readDod(settings: Record<string, unknown>): string[] {
  const v = settings?.definitionOfDone;
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
}

/**
 * Definition of Done — danh sách "thế nào là xong" của cả nhóm. Lưu ở
 * settings.definitionOfDone (mẫu dự án đã ghi sẵn). Mỗi dòng một tiêu chí.
 */
function DefinitionOfDone({ config, slug }: { config: ProjectConfig; slug: string }) {
  const invalidate = useProjectInvalidate(config.id, slug);
  const canEdit = config.permissions.settings;
  const saved = readDod(config.settings);
  const [text, setText] = useState(saved.join('\n'));
  useEffect(() => { setText(readDod(config.settings).join('\n')); }, [config.settings]);
  const items = text.split('\n').map((l) => l.replace(/^\s*[-*•]\s*/, '').trim()).filter(Boolean).slice(0, 30);
  const dirty = JSON.stringify(items) !== JSON.stringify(saved);

  const save = useMutation({
    mutationFn: () => workApi.updateProject(config.id, { settings: { definitionOfDone: items.map((i) => i.slice(0, 200)) } }),
    onSuccess: () => { toast.success('Definition of Done saved'); invalidate(); },
    onError: (err) => toast.error(workError(err, 'Could not save the Definition of Done')),
  });

  return (
    <Section
      title="Definition of Done"
      description="What every issue must meet before it can be called done. Share it with your team and lecturer so everyone uses the same bar."
    >
      {canEdit ? (
        <form className="max-w-[560px]" onSubmit={(e) => { e.preventDefault(); if (dirty && !save.isPending) save.mutate(); }}>
          <Field label="One item per line">
            <textarea
              className="w-input font-[inherit]"
              rows={Math.min(10, Math.max(4, items.length + 1))}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={'Code reviewed and merged\nAcceptance criteria verified\nNo open blocker bugs'}
            />
          </Field>
          <button type="submit" className="w-btn w-btn-primary" disabled={!dirty || save.isPending}>
            {save.isPending && <Spinner size={12} />}
            Save checklist
          </button>
        </form>
      ) : saved.length ? (
        <ul className="max-w-[560px] list-disc space-y-1 pl-5 text-[13px] text-[var(--w-text-2)]">
          {saved.map((d, i) => <li key={i}>{d}</li>)}
        </ul>
      ) : (
        <p className="text-[13px] text-[var(--w-text-3)]">No Definition of Done yet. A project admin can add one.</p>
      )}
    </Section>
  );
}

/** Quy tắc nhóm: cho MEMBER quản lý sprint (settings.membersManageSprints). */
function TeamRules({ config, slug }: { config: ProjectConfig; slug: string }) {
  const invalidate = useProjectInvalidate(config.id, slug);
  const canEdit = config.permissions.settings;
  const on = config.settings?.membersManageSprints === true;
  const save = useMutation({
    mutationFn: (v: boolean) => workApi.updateProject(config.id, { settings: { membersManageSprints: v } }),
    onSuccess: (_r, v) => { toast.success(v ? 'Members can now manage sprints' : 'Only admins can manage sprints'); invalidate(); },
    onError: (err) => toast.error(workError(err, 'Could not change the setting')),
  });
  if (config.type === 'KANBAN') return null;
  return (
    <Section title="Sprints">
      <div className="flex max-w-[560px] items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[13px] font-medium">Allow members to manage sprints</div>
          <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--w-text-2)]">
            Members can create, start and complete sprints — handy when a Scrum Master rotates each sprint.
            Admins can always manage sprints.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 pt-0.5">
          {save.isPending && <Spinner size={12} />}
          <Switch checked={on} onChange={(v) => save.mutate(v)} disabled={!canEdit || save.isPending} label="Allow members to manage sprints" />
        </div>
      </div>
    </Section>
  );
}
