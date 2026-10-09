'use client';

/** Tab Issue types: đổi tên/màu, gán quy trình, mẫu mô tả, lưu trữ, thêm loại thẻ mới. */

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Archive, FileText, Plus } from 'lucide-react';
import { workApi, workError, type IssueTemplate, type ProjectConfig, type WorkIssueType } from '@/lib/work-api';
import { IssueTypeIcon, Spinner } from '../ui';
import { ConfirmDialog, Section, Select } from './shared';
import { ColorPicker, LABEL_COLORS } from './ProjectLabels';
import { useProjectInvalidate } from './useProjectInvalidate';
import TemplateEditorDialog, { TemplateBadge } from '../templates/TemplateEditorDialog';
import { useIssueTemplates } from '../templates/useIssueTemplates';
import { wt } from '@/components/work/i18n';

const LEVELS: Array<{ value: 0 | -1 | 1; label: string; help: string }> = [
  { value: 1, get label() { return wt('ptypes.lEpic'); }, get help() { return wt('ptypes.lEpicH'); } },
  { value: 0, get label() { return wt('ptypes.lStd'); }, get help() { return wt('ptypes.lStdH'); } },
  { value: -1, get label() { return wt('ptypes.lSub'); }, get help() { return wt('ptypes.lSubH'); } },
];
const levelLabel = (l: number) => LEVELS.find((x) => x.value === l)?.label ?? wt('ptypes.lStd');

function TypeRow({ type, config, canEdit, onChanged, onArchive, template, onTemplate }: {
  type: WorkIssueType; config: ProjectConfig; canEdit: boolean; onChanged: () => void; onArchive: () => void;
  /** undefined = đang tải / loại không dùng mẫu (Test). */
  template?: IssueTemplate; onTemplate: () => void;
}) {
  const [name, setName] = useState(type.name);
  useEffect(() => setName(type.name), [type.name]);
  const def = config.workflows.find((w) => w.isDefault) ?? config.workflows[0];

  const update = useMutation({
    mutationFn: (body: { name?: string; color?: string; workflowId?: number | null }) => workApi.updateIssueType(config.id, type.id, body),
    onSuccess: () => onChanged(),
    onError: (err) => { toast.error(workError(err, wt('ptypes.updateFailed'))); setName(type.name); },
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
            aria-label={wt('ptypes.typeName')}
          />
        ) : (
          <span className="min-w-0 flex-1 truncate px-2 text-[13px]">{type.name}</span>
        )}
        <span className="shrink-0 rounded-[4px] border border-[var(--w-border-strong)] px-1.5 text-[11px] leading-[18px] text-[var(--w-text-2)]">{levelLabel(type.level)}</span>
      </div>
      <div className="flex shrink-0 items-center gap-2 pl-6 sm:pl-0">
        {update.isPending && <Spinner size={12} />}
        <ColorPicker value={type.color} ariaLabel={wt('ptypes.typeColour')} disabled={locked} onChange={(c) => update.mutate({ color: c })} />
        <Select
          className="!h-7 !w-[170px] text-[12px]"
          value={type.workflowId ?? ''}
          disabled={locked}
          onChange={(e) => update.mutate({ workflowId: e.target.value ? Number(e.target.value) : null })}
          aria-label={wt('ptypes.workflowFor', { n: type.name })}
          title="Workflow"
        >
          <option value="">{def ? wt('ptypes.defaultSuffix', { n: def.name }) : wt('ptypes.defaultWf')}</option>
          {config.workflows.filter((w) => w.id !== def?.id || type.workflowId === w.id).map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
        </Select>
        {template && (
          <button
            type="button"
            className="w-btn w-btn-ghost w-btn-sm gap-1.5"
            onClick={onTemplate}
            title={canEdit ? wt('ptypes.editTpl') : wt('ptypes.viewTpl')}
            aria-label={wt('ptypes.tplFor', { n: type.name })}
          >
            <FileText size={13} />
            <span className="hidden md:inline">{wt('ptypes.template')}</span>
            <TemplateBadge t={template} />
          </button>
        )}
        {canEdit && (
          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={onArchive} aria-label={wt('ptypes.archiveX', { n: type.name })} title={wt('ptypes.archiveType')}>
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
  const templates = useIssueTemplates(config.id);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  // Test do trình soạn test case lo — không có mẫu mô tả.
  const templateOf = (t: WorkIssueType) => (t.key === 'TEST' ? undefined : templates.data?.find((x) => x.typeId === t.id));
  const openTemplate = editingTemplate ? templates.data?.find((x) => x.typeKey === editingTemplate) ?? null : null;

  const create = useMutation({
    mutationFn: () => workApi.addIssueType(config.id, { name: newName.trim(), level: newLevel, color: newColor }),
    onSuccess: () => { toast.success(wt('ptypes.created', { n: newName.trim() })); setNewName(''); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('ptypes.createFailed'))),
  });
  const archive = useMutation({
    mutationFn: (id: number) => workApi.updateIssueType(config.id, id, { archived: true }),
    onSuccess: () => { toast.success(wt('ptypes.archived')); setArchiving(null); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('ptypes.archiveFailed'))),
  });

  const types = [...config.issueTypes].sort((a, b) => b.level - a.level);

  return (
    <Section
      title={wt('ptypes.title')}
      description={wt('ptypes.desc')}
    >
      <div className="max-w-[720px]">
        {canEdit && (
          <form
            className="mb-3 flex flex-wrap items-center gap-2 sm:flex-nowrap"
            onSubmit={(e) => { e.preventDefault(); if (newName.trim() && !create.isPending) create.mutate(); }}
          >
            <ColorPicker value={newColor} ariaLabel={wt('ptypes.newColour')} onChange={setNewColor} />
            <input className="w-input min-w-0 flex-[1_1_160px]" placeholder={wt('ptypes.newName')} value={newName} maxLength={40} onChange={(e) => setNewName(e.target.value)} aria-label={wt('ptypes.newName')} />
            <Select className="!w-[140px]" value={newLevel} onChange={(e) => setNewLevel(Number(e.target.value) as 0 | -1 | 1)} aria-label={wt('ptypes.level')}>
              {LEVELS.map((l) => <option key={l.value} value={l.value} title={l.help}>{l.label}</option>)}
            </Select>
            <button type="submit" className="w-btn shrink-0" disabled={!newName.trim() || create.isPending}>
              {create.isPending ? <Spinner size={12} /> : <Plus size={14} />}
              {wt('common.add')}
            </button>
          </form>
        )}
        <div className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
          {types.map((t) => (
            <TypeRow
              key={t.id}
              type={t}
              config={config}
              canEdit={canEdit}
              onChanged={invalidate}
              onArchive={() => setArchiving(t)}
              template={templateOf(t)}
              onTemplate={() => setEditingTemplate(t.key)}
            />
          ))}
          {!types.length && <div className="px-3 py-6 text-center text-[13px] text-[var(--w-text-3)]">{wt('ptypes.noTypes')}</div>}
        </div>
        <p className="mt-2 text-[12px] text-[var(--w-text-3)]">{wt('ptypes.levelsNote')}</p>
      </div>
      <TemplateEditorDialog
        open={!!openTemplate}
        onClose={() => setEditingTemplate(null)}
        config={config}
        template={openTemplate}
        canEdit={canEdit}
      />
      <ConfirmDialog
        open={!!archiving}
        onClose={() => setArchiving(null)}
        title={wt('ptypes.archiveQ')}
        body={<><span className="font-medium text-[var(--w-text)]">{archiving?.name}</span> {wt('ptypes.archiveBody')}</>}
        confirmLabel={wt('ptypes.archiveTypeBtn')}
        pending={archive.isPending}
        onConfirm={() => archiving && archive.mutate(archiving.id)}
      />
    </Section>
  );
}
