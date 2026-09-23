'use client';

/** Tab Issue types: đổi tên/màu, gán quy trình, lưu trữ, thêm loại thẻ mới. */

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Archive, Plus } from 'lucide-react';
import { workApi, workError, type ProjectConfig, type WorkIssueType } from '@/lib/work-api';
import { IssueTypeIcon, Spinner } from '../ui';
import { ConfirmDialog, Section, Select } from './shared';
import { ColorPicker, LABEL_COLORS } from './ProjectLabels';
import { useProjectInvalidate } from './useProjectInvalidate';

const LEVELS: Array<{ value: 0 | -1 | 1; label: string; help: string }> = [
  { value: 1, label: 'Epic level', help: 'Groups standard issues' },
  { value: 0, label: 'Standard', help: 'Stories, tasks, bugs' },
  { value: -1, label: 'Subtask', help: 'Lives under a standard issue' },
];
const levelLabel = (l: number) => LEVELS.find((x) => x.value === l)?.label ?? 'Standard';

function TypeRow({ type, config, canEdit, onChanged, onArchive }: { type: WorkIssueType; config: ProjectConfig; canEdit: boolean; onChanged: () => void; onArchive: () => void }) {
  const [name, setName] = useState(type.name);
  useEffect(() => setName(type.name), [type.name]);
  const def = config.workflows.find((w) => w.isDefault) ?? config.workflows[0];

  const update = useMutation({
    mutationFn: (body: { name?: string; color?: string; workflowId?: number | null }) => workApi.updateIssueType(config.id, type.id, body),
    onSuccess: () => onChanged(),
    onError: (err) => { toast.error(workError(err, 'Could not update the issue type')); setName(type.name); },
  });

  const commitName = () => {
    const n = name.trim();
    if (!n) { setName(type.name); return; }
    if (n !== type.name) update.mutate({ name: n });
  };
  const locked = !canEdit || update.isPending;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-[var(--w-border)] px-3 py-2 last:border-b-0 sm:flex-nowrap">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <IssueTypeIcon type={type} size={14} />
        {canEdit ? (
          <input
            className="h-7 min-w-0 flex-1 rounded-[5px] border border-transparent bg-transparent px-2 text-[13px] outline-none hover:border-[var(--w-border)] focus:border-[var(--w-accent-border)]"
            value={name}
            maxLength={40}
            onChange={(e) => setName(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key === 'Enter') e.currentTarget.blur();
              if (e.key === 'Escape') { setName(type.name); e.currentTarget.blur(); }
            }}
            aria-label="Issue type name"
          />
        ) : (
          <span className="min-w-0 flex-1 truncate px-2 text-[13px]">{type.name}</span>
        )}
        <span className="shrink-0 rounded-[4px] border border-[var(--w-border-strong)] px-1.5 text-[11px] leading-[18px] text-[var(--w-text-2)]">{levelLabel(type.level)}</span>
      </div>
      <div className="flex shrink-0 items-center gap-2 pl-6 sm:pl-0">
        {update.isPending && <Spinner size={12} />}
        <ColorPicker value={type.color} ariaLabel="Issue type colour" disabled={locked} onChange={(c) => update.mutate({ color: c })} />
        <Select
          className="!h-7 !w-[170px] text-[12px]"
          value={type.workflowId ?? ''}
          disabled={locked}
          onChange={(e) => update.mutate({ workflowId: e.target.value ? Number(e.target.value) : null })}
          aria-label={`Workflow for ${type.name}`}
          title="Workflow"
        >
          <option value="">{def ? `${def.name} (default)` : 'Default workflow'}</option>
          {config.workflows.filter((w) => w.id !== def?.id || type.workflowId === w.id).map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
        </Select>
        {canEdit && (
          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={onArchive} aria-label={`Archive ${type.name}`} title="Archive issue type">
            <Archive size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProjectIssueTypes({ config, slug }: { config: ProjectConfig; slug: string }) {
  const invalidate = useProjectInvalidate(config.id, slug);
  const canEdit = config.permissions.settings;
  const [newName, setNewName] = useState('');
  const [newLevel, setNewLevel] = useState<0 | -1 | 1>(0);
  const [newColor, setNewColor] = useState(LABEL_COLORS[5]);
  const [archiving, setArchiving] = useState<WorkIssueType | null>(null);

  const create = useMutation({
    mutationFn: () => workApi.addIssueType(config.id, { name: newName.trim(), level: newLevel, color: newColor }),
    onSuccess: () => { toast.success(`Issue type “${newName.trim()}” created`); setNewName(''); invalidate(); },
    onError: (err) => toast.error(workError(err, 'Could not create the issue type')),
  });
  const archive = useMutation({
    mutationFn: (id: number) => workApi.updateIssueType(config.id, id, { archived: true }),
    onSuccess: () => { toast.success('Issue type archived'); setArchiving(null); invalidate(); },
    onError: (err) => toast.error(workError(err, 'Could not archive the issue type')),
  });

  const types = [...config.issueTypes].sort((a, b) => b.level - a.level);

  return (
    <Section
      title="Issue types"
      description="The kinds of work this project tracks. Each type follows a workflow — changing it is only possible while the type has no issues."
    >
      <div className="max-w-[720px]">
        {canEdit && (
          <form
            className="mb-3 flex flex-wrap items-center gap-2 sm:flex-nowrap"
            onSubmit={(e) => { e.preventDefault(); if (newName.trim() && !create.isPending) create.mutate(); }}
          >
            <ColorPicker value={newColor} ariaLabel="New issue type colour" onChange={setNewColor} />
            <input className="w-input min-w-0 flex-[1_1_160px]" placeholder="New issue type name" value={newName} maxLength={40} onChange={(e) => setNewName(e.target.value)} aria-label="New issue type name" />
            <Select className="!w-[140px]" value={newLevel} onChange={(e) => setNewLevel(Number(e.target.value) as 0 | -1 | 1)} aria-label="Level">
              {LEVELS.map((l) => <option key={l.value} value={l.value} title={l.help}>{l.label}</option>)}
            </Select>
            <button type="submit" className="w-btn shrink-0" disabled={!newName.trim() || create.isPending}>
              {create.isPending ? <Spinner size={12} /> : <Plus size={14} />}
              Add
            </button>
          </form>
        )}
        <div className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
          {types.map((t) => (
            <TypeRow key={t.id} type={t} config={config} canEdit={canEdit} onChanged={invalidate} onArchive={() => setArchiving(t)} />
          ))}
          {!types.length && <div className="px-3 py-6 text-center text-[13px] text-[var(--w-text-3)]">No issue types.</div>}
        </div>
        <p className="mt-2 text-[12px] text-[var(--w-text-3)]">Epic-level types group standard issues; subtasks live under a standard issue.</p>
      </div>
      <ConfirmDialog
        open={!!archiving}
        onClose={() => setArchiving(null)}
        title="Archive issue type?"
        body={<><span className="font-medium text-[var(--w-text)]">{archiving?.name}</span> will no longer be offered when creating issues. Existing issues of this type are kept.</>}
        confirmLabel="Archive type"
        pending={archive.isPending}
        onConfirm={() => archiving && archive.mutate(archiving.id)}
      />
    </Section>
  );
}
