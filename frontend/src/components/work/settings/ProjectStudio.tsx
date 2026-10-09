'use client';

/**
 * Cài đặt dự án → "Project type & modules" (lớp studio S1).
 *
 *   · Loại dự án (Personal · School · Software · Client) — đổi loại có thể kèm
 *     "dùng mô-đun mặc định của loại mới" (applyKindDefaults).
 *   · Bật/tắt từng mô-đun, có giải thích. Tắt chỉ ẨN tính năng — dữ liệu
 *     (giai đoạn, phê duyệt, bàn giao…) vẫn còn, bật lại là thấy.
 *   · Người duyệt cổng giai đoạn (settings.stageGate) khi Stages bật.
 * Chỉ ADMIN dự án sửa được (permissions.configureStudio; server kiểm lại).
 */

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { workS5cKeys } from '@/lib/work-s5c-api';
import { toast } from 'sonner';
import { Briefcase, Code2, GraduationCap, Plus, User, X, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  userName, workError, workStudioApi, workStudioKeys, type ApprovalMode, type ModuleMap, type ProjectConfig, type ProjectKind, type StudioModule,
} from '@/lib/work-api';
import { PageLoading, PickerList, Popover, Spinner, UserAvatar } from '../ui';
import { usePick } from '../fields';
import { Section, Select, Switch } from './shared';
import { useProjectInvalidate } from './useProjectInvalidate';
import { KIND_INFO, KINDS, LATER_MODULES, S1_MODULES } from '../studio/shared';
import ModuleUpgrade from './ModuleUpgrade';
import { wt } from '@/components/work/i18n';

const KIND_ICON: Record<ProjectKind, LucideIcon> = { PERSONAL: User, SCHOOL: GraduationCap, SOFTWARE: Code2, CLIENT: Briefcase };

/** Phụ thuộc giữa mô-đun — chỉ là lời nhắc, server không bắt buộc bật kèm. */
const NEEDS: Partial<Record<StudioModule, { on: StudioModule; text: string }>> = {
  stages: { on: 'approvals', get text() { return wt('pstudio.needStages'); } },
  handoffs: { on: 'teams', get text() { return wt('pstudio.needHandoffs'); } },
  changeRequests: { on: 'approvals', get text() { return wt('pstudio.needCr'); } },
  reports: { on: 'clientPortal', get text() { return wt('pstudio.needReports'); } },
};

export default function ProjectStudio({ config, slug }: { config: ProjectConfig; slug: string }) {
  const invalidateProject = useProjectInvalidate(config.id, slug);
  const qc = useQueryClient();
  const canEdit = !!config.permissions.configureStudio;
  const q = useQuery({ queryKey: workStudioKeys.studio(config.id), queryFn: () => workStudioApi.studio(config.id) });
  const [kind, setKind] = useState<ProjectKind | null>(null);
  const [applyDefaults, setApplyDefaults] = useState(true);
  const [gateIds, setGateIds] = useState<number[]>([]);
  const [gateMode, setGateMode] = useState<ApprovalMode>('SEQUENTIAL');
  const pick = usePick();
  useEffect(() => {
    if (!q.data) return;
    setKind(q.data.kind);
    setGateIds(q.data.stageGate.approverIds);
    setGateMode(q.data.stageGate.mode);
  }, [q.data]);

  const update = useMutation({
    mutationFn: (body: Parameters<typeof workStudioApi.updateStudio>[1]) => workStudioApi.updateStudio(config.id, body),
    onSuccess: () => { q.refetch(); invalidateProject(); qc.invalidateQueries({ queryKey: workS5cKeys.available(config.id) }); },
    onError: (err) => toast.error(workError(err, wt('pstudio.saveFailed'))),
  });

  if (q.isLoading || !q.data || !kind) return <PageLoading rows={6} />;
  const cur = q.data;
  const modules: ModuleMap = cur.modules;
  const kindDirty = kind !== cur.kind;
  const approverCandidates = config.members.filter((m) => m.role === 'ADMIN' || m.role === 'MEMBER' || m.role === 'TEACHER' || m.role === 'CLIENT');
  const gateDirty = gateMode !== cur.stageGate.mode || gateIds.join(',') !== cur.stageGate.approverIds.join(',');

  const toggle = (m: StudioModule, on: boolean) => update.mutate({ modules: { [m]: on } }, {
    onSuccess: () => toast.success(`${S1_MODULES.find((x) => x.key === m)?.label ?? m} ${on ? 'turned on' : 'turned off'}`),
  });

  return (
    <>
      <Section
        title={wt('pstudio.projectType')}
        description={wt('pstudio.typeDesc')}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup" aria-label={wt('pstudio.projectType')}>
          {KINDS.map((k) => {
            const Icon = KIND_ICON[k];
            const on = kind === k;
            return (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={on}
                disabled={!canEdit}
                onClick={() => setKind(k)}
                className={cn(
                  'flex gap-3 rounded-[8px] border px-3 py-2.5 text-left transition-colors disabled:cursor-default',
                  on ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border-strong)] enabled:hover:bg-[var(--w-hover)]',
                )}
              >
                <span className={cn('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px]', on ? 'bg-[var(--w-accent)] text-white' : 'bg-[var(--w-sunken)] text-[var(--w-text-2)]')}><Icon size={14} /></span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-[13px] font-medium">
                    {KIND_INFO[k].label}
                    {k === cur.kind && <span className="rounded-full bg-[var(--w-sunken)] px-1.5 text-[11px] font-normal text-[var(--w-text-3)]">{wt('pstudio.current')}</span>}
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-[var(--w-text-2)]">{KIND_INFO[k].body}</span>
                  <span className="mt-1 block text-[11px] text-[var(--w-text-3)]">
                    {wt('pstudio.modulesLine', { m: KIND_INFO[k].modules.length ? KIND_INFO[k].modules.map((m) => S1_MODULES.find((x) => x.key === m)?.label).join(' · ') : wt('common.none').toLowerCase() })}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        {cur.kindStored === null && (
          <p className="mt-2 text-[12px] text-[var(--w-text-3)]">{wt('pstudio.inferred', { k: KIND_INFO[cur.kind].label })}</p>
        )}
        {canEdit && kindDirty && (
          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2.5">
            <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-2 text-[13px]">
              <input type="checkbox" className="mt-0.5 accent-[var(--w-accent)]" checked={applyDefaults} onChange={(e) => setApplyDefaults(e.target.checked)} />
              <span>
                {wt('pstudio.alsoSwitch', { k: KIND_INFO[kind].short })}
                <span className="block text-[12px] text-[var(--w-text-2)]">{KIND_INFO[kind].modules.length ? wt('pstudio.turnsOn', { n: KIND_INFO[kind].modules.length }) : wt('pstudio.turnsOff')}</span>
              </span>
            </label>
            <button type="button" className="w-btn" onClick={() => setKind(cur.kind)}>{wt('common.cancel')}</button>
            <button type="button" className="w-btn w-btn-primary" disabled={update.isPending} onClick={() => update.mutate({ kind, applyKindDefaults: applyDefaults }, { onSuccess: () => toast.success(wt('pstudio.typeToast', { k: KIND_INFO[kind].label })) })}>
              {update.isPending && <Spinner size={12} />} {wt('pstudio.changeType')}
            </button>
          </div>
        )}
      </Section>

      {/* Đợt S5c: mô-đun có sẵn nhưng đang tắt + "Enable all recommended" (chỉ khoá chưa ai quyết). */}
      <ModuleUpgrade config={config} onChanged={() => { q.refetch(); invalidateProject(); }} />

      <Section title={wt('pstudio.modules')} description={wt('pstudio.modulesDesc')}>
        <ul className="divide-y divide-[var(--w-border)] overflow-hidden rounded-[8px] border border-[var(--w-border)]">
          {S1_MODULES.map((m) => {
            const need = NEEDS[m.key];
            const warn = modules[m.key] && need && !modules[need.on];
            return (
              <li key={m.key} className="flex items-start gap-3 px-3.5 py-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium">{m.label}</div>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--w-text-2)]">{m.body}</p>
                  {warn && <p className="mt-1 text-[12px] text-[var(--w-orange)]">{need!.text}</p>}
                </div>
                <Switch checked={modules[m.key]} disabled={!canEdit || update.isPending} onChange={(v) => toggle(m.key, v)} label={wt('pstudio.moduleX', { m: m.label })} />
              </li>
            );
          })}
          {LATER_MODULES.length > 0 && <li className="px-3.5 py-3">
            <div className="text-[12px] font-medium text-[var(--w-text-3)]">{wt('pstudio.comingLater')}</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {LATER_MODULES.map((m) => <span key={m.key} className="rounded-[5px] border border-dashed border-[var(--w-border-strong)] px-2 py-0.5 text-[12px] text-[var(--w-text-3)]">{m.label}</span>)}
            </div>
          </li>}
        </ul>
      </Section>

      {modules.stages && (
        <Section title={wt('pstudio.gateApprovers')} description={wt('pstudio.gateApproversDesc')}>
          <ol className="mb-2 max-w-[520px] space-y-1">
            {gateIds.map((id, i) => {
              const m = config.members.find((x) => x.id === id);
              return (
                <li key={id} className="flex items-center gap-2 rounded-[6px] border border-[var(--w-border)] px-2 py-1.5 text-[13px]">
                  {gateMode === 'SEQUENTIAL' && <span className="w-4 text-center text-[12px] font-semibold tabular text-[var(--w-text-3)]">{i + 1}</span>}
                  <UserAvatar user={m} size={20} />
                  <span className="min-w-0 flex-1 truncate">{m ? userName(m) : wt('pstudio.formerMember')}</span>
                  {canEdit && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={() => setGateIds((a) => a.filter((x) => x !== id))} aria-label={wt('pstudio.removeApprover')}><X size={12} /></button>}
                </li>
              );
            })}
            {!gateIds.length && <li className="text-[12px] text-[var(--w-text-3)]">{wt('pstudio.defaultApprover')}</li>}
          </ol>
          {canEdit && (
            <div className="flex max-w-[520px] flex-wrap items-center gap-2">
              <button ref={pick.ref} type="button" className="w-btn w-btn-sm" onClick={pick.toggle} disabled={gateIds.length >= 10}><Plus size={12} /> {wt('pstudio.addApprover')}</button>
              <Popover open={pick.on} onClose={pick.close} anchorRef={pick.ref} width={260}>
                <PickerList
                  options={approverCandidates.filter((m) => !gateIds.includes(m.id)).map((m) => ({ value: m.id, label: userName(m), keywords: m.username, icon: <UserAvatar user={m} size={16} /> }))}
                  selected={[]}
                  onPick={(v) => { setGateIds((a) => [...a, v]); pick.close(); }}
                  placeholder={wt('pstudio.findMember')}
                  empty={wt('pstudio.noMore')}
                />
              </Popover>
              <Select aria-label={wt('pstudio.order')} value={gateMode} onChange={(e) => setGateMode(e.target.value as ApprovalMode)} className="!h-[26px] !w-auto text-[12px]">
                <option value="SEQUENTIAL">{wt('pstudio.sequential')}</option>
                <option value="PARALLEL">{wt('pstudio.parallel')}</option>
              </Select>
              {gateDirty && (
                <button
                  type="button"
                  className="w-btn w-btn-primary w-btn-sm ml-auto"
                  disabled={update.isPending}
                  onClick={() => update.mutate({ stageGate: { approverIds: gateIds, mode: gateMode } }, { onSuccess: () => toast.success(wt('pstudio.approversSaved')) })}
                >
                  {update.isPending && <Spinner size={11} />} {wt('pstudio.saveApprovers')}
                </button>
              )}
            </div>
          )}
        </Section>
      )}
    </>
  );
}
