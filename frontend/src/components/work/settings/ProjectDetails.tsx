'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userName, workApi, workError, type ProjectConfig } from '@/lib/work-api';
import { Field, Spinner } from '../ui';
import { projectTypeLabel, Section, Select, Switch } from './shared';
import { useProjectInvalidate } from './useProjectInvalidate';
import { ProjectIdentity } from './ProjectIdentity';
import { wt, wfmt } from '@/components/work/i18n';
import { ProjectCoverPicker } from './ProjectCoverPicker'; // UX-D

const TEMPLATE_LABEL: Record<ProjectConfig['template'], string> = {
  get BLANK() { return wt('settings.tplBLANK'); },
  get SWP391() { return wt('settings.tplSWP391'); },
  get CAPSTONE() { return wt('settings.tplCAPSTONE'); },
  get SWR302() { return wt('settings.tplSWR302'); },
  get SWT301() { return wt('settings.tplSWT301'); },
  get FREELANCE() { return wt('settings.tplFREELANCE'); },
  get COMPANY() { return wt('settings.tplCOMPANY'); },
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
    onSuccess: () => { toast.success(wt('settings.projUpdated')); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('settings.saveChangesFailed'))),
  });

  return (
    <>
    <Section title={wt('settings.projDetails')}>
      <form className="max-w-[560px]" onSubmit={(e) => { e.preventDefault(); if (canEdit && dirty && name.trim() && !save.isPending) save.mutate(); }}>
        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[1fr_140px]">
          <Field label={wt('common.name')}>
            <input className="w-input" value={name} onChange={(e) => setName(e.target.value)} disabled={!canEdit} maxLength={120} />
          </Field>
          <Field label={wt('create.key')} hint={wt('settings.cannotChange')}>
            <div className="flex h-8 items-center rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-2.5 font-mono text-[12px] text-[var(--w-text-2)]">{config.key}</div>
          </Field>
        </div>
        <Field label={wt('common.description')}>
          <textarea className="w-input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} disabled={!canEdit} maxLength={5000} placeholder={wt('settings.projDescPh')} />
        </Field>
        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
          <Field label={wt('create.access')}>
            <Select value={visibility} onChange={(e) => setVisibility(e.target.value as 'WORKSPACE' | 'PRIVATE')} disabled={!canEdit}>
              <option value="WORKSPACE">{wt('create.everyoneWs')}</option>
              <option value="PRIVATE">{wt('create.onlyInvited')}</option>
            </Select>
          </Field>
          <Field label={wt('settings.projLead')}>
            <Select value={leadId} onChange={(e) => setLeadId(e.target.value ? Number(e.target.value) : '')} disabled={!canEdit}>
              <option value="">{wt('home.noLead')}</option>
              {leads.map((m) => <option key={m.id} value={m.id}>{userName(m)}</option>)}
            </Select>
          </Field>
        </div>
        <div className="mb-5 flex flex-wrap gap-x-6 gap-y-1 text-[12px] text-[var(--w-text-3)]">
          <span>{wt('create.typeLabel')} <span className="text-[var(--w-text-2)]">{projectTypeLabel(config.type)}</span></span>
          <span>{wt('create.template')} <span className="text-[var(--w-text-2)]">{TEMPLATE_LABEL[config.template]}</span></span>
        </div>
        {canEdit && (
          <button type="submit" className="w-btn w-btn-primary" disabled={!dirty || !name.trim() || save.isPending}>
            {save.isPending && <Spinner size={12} />}
            {wt('common.saveChanges')}
          </button>
        )}
      </form>
    </Section>
    <ProjectCoverPicker config={config} slug={slug} />
    <ProjectIdentity config={config} slug={slug} />
    <AiGuidelines config={config} slug={slug} />
    <DefinitionOfDone config={config} slug={slug} />
    <DoneRules config={config} slug={slug} />
    <TeamRules config={config} slug={slug} />
    </>
  );
}

const AI_GUIDELINES_MAX = 20_000;

/**
 * Chỉ dẫn cho trợ lý AI của dự án (settings.aiInstructions) — AI hội thoại, việc một chạm và luyện bảo vệ
 * đều đọc (8.000 ký tự đầu). Dùng cho quy ước riêng: mẫu báo cáo bắt buộc của giảng viên, cách đặt tên, …
 * Tài liệu dài hơn thì đính kèm .md vào thẻ — AI đọc tệp .md/.txt của thẻ đang mở.
 */
function AiGuidelines({ config, slug }: { config: ProjectConfig; slug: string }) {
  const invalidate = useProjectInvalidate(config.id, slug);
  const canEdit = config.permissions.settings;
  const saved = typeof config.settings?.aiInstructions === 'string' ? config.settings.aiInstructions : '';
  const [text, setText] = useState(saved);
  useEffect(() => { setText(typeof config.settings?.aiInstructions === 'string' ? config.settings.aiInstructions : ''); }, [config.settings]);
  const dirty = text.trim() !== saved.trim();

  const save = useMutation({
    mutationFn: () => workApi.updateProject(config.id, { settings: { aiInstructions: text.trim() || null } }),
    onSuccess: () => { toast.success(text.trim() ? wt('settings.aiGuideSaved') : wt('settings.aiGuideRemoved')); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('settings.aiGuideFailed'))),
  });

  return (
    <Section
      title={wt('settings.aiGuide')}
      description={wt('settings.aiGuideDesc')}
    >
      {canEdit ? (
        <form className="max-w-[720px]" onSubmit={(e) => { e.preventDefault(); if (dirty && !save.isPending) save.mutate(); }}>
          <Field label={wt('settings.guidelines')} hint={`${wfmt.number(text.length)} / ${wfmt.number(AI_GUIDELINES_MAX)}`}>
            <textarea
              className="w-input font-[inherit]"
              rows={Math.min(18, Math.max(5, text.split('\n').length + 1))}
              value={text}
              maxLength={AI_GUIDELINES_MAX}
              onChange={(e) => setText(e.target.value)}
              placeholder={wt('settings.guidePh')}
            />
          </Field>
          <button type="submit" className="w-btn w-btn-primary" disabled={!dirty || save.isPending}>
            {save.isPending && <Spinner size={12} />}
            {wt('settings.saveGuidelines')}
          </button>
        </form>
      ) : saved ? (
        <pre className="max-w-[720px] whitespace-pre-wrap text-[13px] leading-relaxed text-[var(--w-text-2)]">{saved}</pre>
      ) : (
        <p className="text-[13px] text-[var(--w-text-3)]">{wt('settings.noGuide')}</p>
      )}
    </Section>
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
    onSuccess: () => { toast.success(wt('settings.dodSaved')); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('settings.dodFailed'))),
  });

  return (
    <Section
      title="Definition of Done"
      description={wt('settings.dodDesc')}
    >
      {canEdit ? (
        <form className="max-w-[560px]" onSubmit={(e) => { e.preventDefault(); if (dirty && !save.isPending) save.mutate(); }}>
          <Field label={wt('settings.onePerLine')}>
            <textarea
              className="w-input font-[inherit]"
              rows={Math.min(10, Math.max(4, items.length + 1))}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={wt('settings.dodPh')}
            />
          </Field>
          <button type="submit" className="w-btn w-btn-primary" disabled={!dirty || save.isPending}>
            {save.isPending && <Spinner size={12} />}
            {wt('settings.saveChecklist')}
          </button>
        </form>
      ) : saved.length ? (
        <ul className="max-w-[560px] list-disc space-y-1 pl-5 text-[13px] text-[var(--w-text-2)]">
          {saved.map((d, i) => <li key={i}>{d}</li>)}
        </ul>
      ) : (
        <p className="text-[13px] text-[var(--w-text-3)]">{wt('settings.noDod')}</p>
      )}
    </Section>
  );
}

/** Đọc settings.doneRequirements (trường bắt buộc trước khi vào Done). */
function readDoneRules(settings: Record<string, unknown>): { fieldIds: number[]; typeKeys: string[] } {
  const v = settings?.doneRequirements as { fieldIds?: unknown; typeKeys?: unknown } | null | undefined;
  return {
    fieldIds: Array.isArray(v?.fieldIds) ? v!.fieldIds.filter((x): x is number => typeof x === 'number') : [],
    typeKeys: Array.isArray(v?.typeKeys) ? v!.typeKeys.filter((x): x is string => typeof x === 'string') : [],
  };
}

/**
 * Done rules — BẮT BUỘC một số trường có giá trị trước khi thẻ vào cột Done
 * (vd Evidence: link PR / test report / demo). Server chặn ở cửa ghi chung nên
 * kéo board, sửa hàng loạt, app mobile hay AI "Apply" đều bị chặn như nhau.
 * Luật tự động và GitHub/GitLab (PR merge) không bị chặn.
 */
function DoneRules({ config, slug }: { config: ProjectConfig; slug: string }) {
  const invalidate = useProjectInvalidate(config.id, slug);
  const canEdit = config.permissions.settings;
  const saved = readDoneRules(config.settings);
  const [fieldIds, setFieldIds] = useState<number[]>(saved.fieldIds);
  const [typeKeys, setTypeKeys] = useState<string[]>(saved.typeKeys);
  useEffect(() => { const r = readDoneRules(config.settings); setFieldIds(r.fieldIds); setTypeKeys(r.typeKeys); }, [config.settings]);
  const dirty = JSON.stringify([...fieldIds].sort()) !== JSON.stringify([...saved.fieldIds].sort()) || JSON.stringify([...typeKeys].sort()) !== JSON.stringify([...saved.typeKeys].sort());
  const fields = config.customFields;
  const types = config.issueTypes.filter((t) => t.key !== 'EPIC');

  const save = useMutation({
    mutationFn: () => workApi.updateProject(config.id, { settings: { doneRequirements: fieldIds.length ? { fieldIds, typeKeys: typeKeys.length ? typeKeys : null } : null } }),
    onSuccess: () => { toast.success(fieldIds.length ? wt('settings.doneRulesSaved') : wt('settings.doneRulesOff')); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('settings.doneRulesFailed'))),
  });
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <Section
      title={wt('settings.doneRules')}
      description={wt('settings.doneRulesDesc')}
    >
      {!fields.length ? (
        <p className="text-[13px] text-[var(--w-text-3)]">{wt('settings.addFieldFirst')}</p>
      ) : (
        <div className="max-w-[640px] space-y-4">
          <div>
            <div className="mb-1.5 text-[12.5px] font-medium">{wt('settings.requiredBeforeDone')}</div>
            <div className="flex flex-wrap gap-1.5">
              {fields.map((f) => {
                const on = fieldIds.includes(f.id);
                return (
                  <button key={f.id} type="button" disabled={!canEdit} aria-pressed={on} onClick={() => setFieldIds((l) => toggle(l, f.id))}
                    className={`inline-flex h-7 items-center rounded-full border px-2.5 text-[12.5px] ${on ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border)] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]'}`}>
                    {f.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <div className="mb-1.5 text-[12.5px] font-medium">{wt('settings.onlyTypes')} <span className="font-normal text-[var(--w-text-3)]">({wt('settings.noneAll')})</span></div>
            <div className="flex flex-wrap gap-1.5">
              {types.map((t) => {
                const on = typeKeys.includes(t.key);
                return (
                  <button key={t.id} type="button" disabled={!canEdit || !fieldIds.length} aria-pressed={on} onClick={() => setTypeKeys((l) => toggle(l, t.key))}
                    className={`inline-flex h-7 items-center rounded-full border px-2.5 text-[12.5px] disabled:opacity-50 ${on ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border)] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]'}`}>
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>
          {canEdit && (
            <button type="button" className="w-btn w-btn-primary" disabled={!dirty || save.isPending} onClick={() => save.mutate()}>
              {save.isPending && <Spinner size={12} />} {wt('settings.saveDoneRules')}
            </button>
          )}
        </div>
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
    onSuccess: (_r, v) => { toast.success(v ? wt('settings.membersSprints') : wt('backlog.noSprintPerm')); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('settings.settingFailed'))),
  });
  if (config.type === 'KANBAN') return null;
  return (
    <Section title="Sprint">
      <div className="flex max-w-[560px] items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[13px] font-medium">{wt('settings.allowMembersSprints')}</div>
          <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--w-text-2)]">
            {wt('settings.allowMembersHelp')}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 pt-0.5">
          {save.isPending && <Spinner size={12} />}
          <Switch checked={on} onChange={(v) => save.mutate(v)} disabled={!canEdit || save.isPending} label={wt('settings.allowMembersSprints')} />
        </div>
      </div>
    </Section>
  );
}
