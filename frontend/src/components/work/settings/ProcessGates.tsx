'use client';

/**
 * dm5 G1 (27/11/2026) — "Cổng quy trình" trong Cài đặt › Chi tiết. Mỗi khối lưu MỘT khoá settings qua PATCH /projects/:pid
 * (máy chủ chuẩn hoá ở dm5a.service › normalizeProcessSettings; kiểm thật ở cửa ghi chung issueChange.ts):
 *   · Definition of Ready  readyRequirements { fieldIds, typeKeys, toStatusIds, requireMockupApproved }   (A14)
 *   · CI xanh trước Done   doneRequirements.requireCiGreen / requirePr                                (A2)
 *   · Sức chứa             capacity { focusFactor, cautionPct, warnPct }                              (A15)
 *   · Nhịp & cổng          moscowCapPct (A22) · retroActionCap (A12) · stageGateBlocksWork (A23)
 *   · Ngưỡng RAG           ragRules { schedule|scope|quality|effort: { amber, red } }                 (A19)
 * WIP chéo cột (A4) ở Cài đặt › Board; luật bình luận xác nhận / làm nguội (A6) ở Workflow.
 */

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workApi, workError, type ProjectConfig } from '@/lib/work-api';
import { Spinner } from '../ui';
import { Section, Switch } from './shared';
import { useProjectInvalidate } from './useProjectInvalidate';
import { wt } from '@/components/work/i18n';

type S = Record<string, unknown>;
const nums = (v: unknown): number[] => (Array.isArray(v) ? v.filter((x): x is number => typeof x === 'number') : []);
const strs = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);

function Chip({ on, disabled, onClick, children }: { on: boolean; disabled?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" disabled={disabled} aria-pressed={on} onClick={onClick}
      className={`inline-flex h-7 items-center rounded-full border px-2.5 text-[12.5px] disabled:opacity-50 ${on ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border)] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]'}`}>
      {children}
    </button>
  );
}

function useSave(config: ProjectConfig, slug: string, okMsg: string) {
  const invalidate = useProjectInvalidate(config.id, slug);
  return useMutation({
    mutationFn: (settings: S) => workApi.updateProject(config.id, { settings }),
    onSuccess: () => { toast.success(okMsg); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('settings.settingFailed'))),
  });
}

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

function NumberBox({ id, label, value, onChange, min, max, step = 1, disabled, suffix }: {
  id: string; label: string; value: string; onChange: (v: string) => void; min: number; max: number; step?: number; disabled?: boolean; suffix?: string;
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1 text-[12.5px]">
      <span className="font-medium">{label}</span>
      <span className="inline-flex items-center gap-1.5">
        <input id={id} type="number" min={min} max={max} step={step} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)}
          className="w-input h-8 w-[96px] text-[13px]" />
        {suffix && <span className="text-[12px] text-[var(--w-text-3)]">{suffix}</span>}
      </span>
    </label>
  );
}

export default function ProcessGates({ config, slug }: { config: ProjectConfig; slug: string }) {
  return (
    <>
      <ReadyRules config={config} slug={slug} />
      <CiGate config={config} slug={slug} />
      <CapacityRules config={config} slug={slug} />
      <RhythmRules config={config} slug={slug} />
      <RagThresholds config={config} slug={slug} />
    </>
  );
}

// ─── A14 Definition of Ready ─────────────────────────────────────

function ReadyRules({ config, slug }: { config: ProjectConfig; slug: string }) {
  const canEdit = config.permissions.settings;
  const saved = (config.settings?.readyRequirements ?? null) as S | null;
  const init = useMemo(() => ({
    fieldIds: nums(saved?.fieldIds), typeKeys: strs(saved?.typeKeys), toStatusIds: nums(saved?.toStatusIds), mockup: saved?.requireMockupApproved === true,
  }), [saved]);
  const [v, setV] = useState(init);
  useEffect(() => setV(init), [init]);
  const dirty = JSON.stringify(v) !== JSON.stringify(init);
  const save = useSave(config, slug, wt('settings.dorSaved'));
  const types = config.issueTypes.filter((t) => t.key !== 'EPIC');
  const statuses = config.workflows.flatMap((w) => w.statuses.map((s) => ({ ...s, wf: w.name, isDefault: w.isDefault }))).filter((s) => s.category !== 'TODO');
  const on = !!(v.fieldIds.length || v.mockup);
  return (
    <Section title={wt('settings.dorTitle')} description={wt('settings.dorDesc')}>
      <div className="max-w-[640px] space-y-4">
        <div>
          <div className="mb-1.5 text-[12.5px] font-medium">{wt('settings.dorFields')}</div>
          {config.customFields.length ? (
            <div className="flex flex-wrap gap-1.5">
              {config.customFields.map((f) => <Chip key={f.id} on={v.fieldIds.includes(f.id)} disabled={!canEdit} onClick={() => setV((x) => ({ ...x, fieldIds: toggle(x.fieldIds, f.id) }))}>{f.name}</Chip>)}
            </div>
          ) : <p className="text-[12.5px] text-[var(--w-text-3)]">{wt('settings.addFieldFirst')}</p>}
        </div>
        <label className={`flex items-start gap-2 text-[13px] ${canEdit ? 'cursor-pointer' : ''}`}>
          <input type="checkbox" className="mt-0.5 accent-[var(--w-accent)]" checked={v.mockup} disabled={!canEdit} onChange={(e) => setV((x) => ({ ...x, mockup: e.target.checked }))} />
          <span>{wt('settings.dorMockup')}<span className="block text-[12px] text-[var(--w-text-3)]">{wt('settings.dorMockupDesc')}</span></span>
        </label>
        <div>
          <div className="mb-1.5 text-[12.5px] font-medium">{wt('settings.onlyTypes')} <span className="font-normal text-[var(--w-text-3)]">({wt('settings.noneAll')})</span></div>
          <div className="flex flex-wrap gap-1.5">
            {types.map((t) => <Chip key={t.id} on={v.typeKeys.includes(t.key)} disabled={!canEdit || !on} onClick={() => setV((x) => ({ ...x, typeKeys: toggle(x.typeKeys, t.key) }))}>{t.name}</Chip>)}
          </div>
        </div>
        <div>
          <div className="mb-1.5 text-[12.5px] font-medium">{wt('settings.dorStatuses')} <span className="font-normal text-[var(--w-text-3)]">({wt('settings.dorStatusesNone')})</span></div>
          <div className="flex flex-wrap gap-1.5">
            {statuses.map((s) => <Chip key={s.id} on={v.toStatusIds.includes(s.id)} disabled={!canEdit || !on} onClick={() => setV((x) => ({ ...x, toStatusIds: toggle(x.toStatusIds, s.id) }))}>{s.isDefault ? s.name : `${s.name} · ${s.wf}`}</Chip>)}
          </div>
        </div>
        {canEdit && (
          <button type="button" className="w-btn w-btn-primary" disabled={!dirty || save.isPending}
            onClick={() => save.mutate({ readyRequirements: on ? { fieldIds: v.fieldIds, typeKeys: v.typeKeys.length ? v.typeKeys : null, toStatusIds: v.toStatusIds.length ? v.toStatusIds : null, requireMockupApproved: v.mockup } : null })}>
            {save.isPending && <Spinner size={12} />} {wt('settings.dorSave')}
          </button>
        )}
      </div>
    </Section>
  );
}

// ─── A2 CI xanh trước Done ───────────────────────────────────────

function CiGate({ config, slug }: { config: ProjectConfig; slug: string }) {
  const canEdit = config.permissions.settings;
  const cur = (config.settings?.doneRequirements ?? null) as S | null;
  const ci = cur?.requireCiGreen === true;
  const pr = ci && cur?.requirePr === true;
  const save = useSave(config, slug, wt('settings.ciSaved'));
  const write = (requireCiGreen: boolean, requirePr: boolean) => {
    const fieldIds = nums(cur?.fieldIds);
    const typeKeys = strs(cur?.typeKeys);
    save.mutate({ doneRequirements: fieldIds.length || requireCiGreen ? { fieldIds, typeKeys: typeKeys.length ? typeKeys : null, requireCiGreen, requirePr: requireCiGreen && requirePr } : null });
  };
  return (
    <Section title={wt('settings.ciTitle')} description={wt('settings.ciDesc')}>
      <div className="max-w-[560px] space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="text-[13px] font-medium">{wt('settings.ciGreen')}</div>
          <Switch checked={ci} onChange={(x) => write(x, pr)} disabled={!canEdit || save.isPending} label={wt('settings.ciGreen')} />
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[13px] font-medium">{wt('settings.ciNeedPr')}</div>
            <p className="mt-0.5 text-[12px] text-[var(--w-text-2)]">{wt('settings.ciNeedPrDesc')}</p>
          </div>
          <Switch checked={pr} onChange={(x) => write(ci, x)} disabled={!canEdit || !ci || save.isPending} label={wt('settings.ciNeedPr')} />
        </div>
      </div>
    </Section>
  );
}

// ─── A15 sức chứa × tập trung ────────────────────────────────────

function CapacityRules({ config, slug }: { config: ProjectConfig; slug: string }) {
  const canEdit = config.permissions.settings;
  const cur = (config.settings?.capacity ?? null) as S | null;
  const init = useMemo(() => ({
    focus: String(typeof cur?.focusFactor === 'number' ? cur.focusFactor : 0.7),
    caution: String(typeof cur?.cautionPct === 'number' ? cur.cautionPct : 75),
    warn: String(typeof cur?.warnPct === 'number' ? cur.warnPct : 85),
  }), [cur]);
  const [v, setV] = useState(init);
  useEffect(() => setV(init), [init]);
  const save = useSave(config, slug, wt('settings.capSaved'));
  const dirty = JSON.stringify(v) !== JSON.stringify(init);
  return (
    <Section title={wt('settings.capTitle')} description={wt('settings.capDesc')}>
      <div className="flex max-w-[640px] flex-wrap items-end gap-4">
        <NumberBox id="cap-focus" label={wt('settings.capFocus')} value={v.focus} min={0.1} max={1} step={0.05} disabled={!canEdit} onChange={(x) => setV((s) => ({ ...s, focus: x }))} />
        <NumberBox id="cap-caution" label={wt('settings.capCaution')} value={v.caution} min={10} max={200} disabled={!canEdit} suffix="%" onChange={(x) => setV((s) => ({ ...s, caution: x }))} />
        <NumberBox id="cap-warn" label={wt('settings.capWarn')} value={v.warn} min={10} max={200} disabled={!canEdit} suffix="%" onChange={(x) => setV((s) => ({ ...s, warn: x }))} />
        {canEdit && (
          <button type="button" className="w-btn w-btn-primary" disabled={!dirty || save.isPending}
            onClick={() => save.mutate({ capacity: { focusFactor: Number(v.focus), cautionPct: Number(v.caution), warnPct: Number(v.warn) } })}>
            {save.isPending && <Spinner size={12} />} {wt('common.save')}
          </button>
        )}
      </div>
    </Section>
  );
}

// ─── A22 · A12 · A23 nhịp & cổng ─────────────────────────────────

function RhythmRules({ config, slug }: { config: ProjectConfig; slug: string }) {
  const canEdit = config.permissions.settings;
  const s = config.settings ?? {};
  const init = useMemo(() => ({
    moscow: s.moscowCapPct === 0 ? '0' : String(typeof s.moscowCapPct === 'number' ? s.moscowCapPct : 60),
    retro: String(typeof s.retroActionCap === 'number' ? s.retroActionCap : 0),
  }), [s.moscowCapPct, s.retroActionCap]);
  const [v, setV] = useState(init);
  useEffect(() => setV(init), [init]);
  const save = useSave(config, slug, wt('settings.rhythmSaved'));
  const dirty = JSON.stringify(v) !== JSON.stringify(init);
  const stagesOn = config.modules?.stages === true;
  return (
    <Section title={wt('settings.rhythmTitle')} description={wt('settings.rhythmDesc')}>
      <div className="max-w-[640px] space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <NumberBox id="moscow-cap" label={wt('settings.moscowCap')} value={v.moscow} min={0} max={100} suffix={wt('settings.zeroOff')} disabled={!canEdit} onChange={(x) => setV((y) => ({ ...y, moscow: x }))} />
          <NumberBox id="retro-cap" label={wt('settings.retroCap')} value={v.retro} min={0} max={10} suffix={wt('settings.zeroOff')} disabled={!canEdit} onChange={(x) => setV((y) => ({ ...y, retro: x }))} />
          {canEdit && (
            <button type="button" className="w-btn w-btn-primary" disabled={!dirty || save.isPending}
              onClick={() => save.mutate({ moscowCapPct: Number(v.moscow), retroActionCap: Number(v.retro) })}>
              {save.isPending && <Spinner size={12} />} {wt('common.save')}
            </button>
          )}
        </div>
        {stagesOn && (
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[13px] font-medium">{wt('settings.stageBlocks')}</div>
              <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--w-text-2)]">{wt('settings.stageBlocksDesc')}</p>
            </div>
            <Switch checked={s.stageGateBlocksWork === true} onChange={(x) => save.mutate({ stageGateBlocksWork: x })} disabled={!canEdit || save.isPending} label={wt('settings.stageBlocks')} />
          </div>
        )}
      </div>
    </Section>
  );
}

// ─── A19 ngưỡng RAG ──────────────────────────────────────────────

const DIMS = ['schedule', 'scope', 'quality', 'effort'] as const;
const RAG_DEF: Record<(typeof DIMS)[number], { amber: number; red: number }> = { schedule: { amber: 10, red: 25 }, scope: { amber: 10, red: 20 }, quality: { amber: 3, red: 6 }, effort: { amber: 15, red: 30 } };

function RagThresholds({ config, slug }: { config: ProjectConfig; slug: string }) {
  const canEdit = config.permissions.settings;
  const cur = (config.settings?.ragRules ?? null) as Record<string, { amber?: number; red?: number }> | null;
  const init = useMemo(() => Object.fromEntries(DIMS.map((d) => [d, { amber: String(cur?.[d]?.amber ?? RAG_DEF[d].amber), red: String(cur?.[d]?.red ?? RAG_DEF[d].red) }])) as Record<(typeof DIMS)[number], { amber: string; red: string }>, [cur]);
  const [v, setV] = useState(init);
  useEffect(() => setV(init), [init]);
  const save = useSave(config, slug, wt('settings.ragSaved'));
  const dirty = JSON.stringify(v) !== JSON.stringify(init);
  return (
    <Section title={wt('settings.ragTitle')} description={wt('settings.ragDesc')}>
      <div className="max-w-[640px] overflow-x-auto">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-[var(--w-text-3)]">
              <th className="py-1 pr-3 font-medium">{wt('settings.ragDim')}</th>
              <th className="py-1 pr-3 font-medium text-[var(--w-orange)]">{wt('settings.ragAmber')}</th>
              <th className="py-1 font-medium text-[var(--w-red)]">{wt('settings.ragRed')}</th>
            </tr>
          </thead>
          <tbody>
            {DIMS.map((d) => (
              <tr key={d} className="border-t border-[var(--w-border)]">
                <td className="py-1.5 pr-3">
                  <div className="font-medium">{wt(`settings.rag_${d}` as never)}</div>
                  <div className="text-[11.5px] text-[var(--w-text-3)]">{wt(`settings.ragHint_${d}` as never)}</div>
                </td>
                {(['amber', 'red'] as const).map((k) => (
                  <td key={k} className="py-1.5 pr-3">
                    <input type="number" min={0} aria-label={`${d} ${k}`} className="w-input h-8 w-[84px] text-[13px]" value={v[d][k]} disabled={!canEdit}
                      onChange={(e) => setV((x) => ({ ...x, [d]: { ...x[d], [k]: e.target.value } }))} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {canEdit && (
          <button type="button" className="w-btn w-btn-primary mt-3" disabled={!dirty || save.isPending}
            onClick={() => save.mutate({ ragRules: Object.fromEntries(DIMS.map((d) => [d, { amber: Number(v[d].amber), red: Number(v[d].red) }])) })}>
            {save.isPending && <Spinner size={12} />} {wt('common.save')}
          </button>
        )}
      </div>
    </Section>
  );
}
