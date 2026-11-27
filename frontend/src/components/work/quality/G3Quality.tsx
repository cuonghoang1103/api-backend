'use client';

/**
 * dm5 G3 (27/11/2026) — mảnh giao diện của gói "Kiểm thử, review & UAT":
 *   - ReviewSettingsDialog: checklist review CẤP DỰ ÁN (settings.reviewChecklists) + làm nguội (settings.reviewCoolOffHours).
 *   - CoolOffNotice: dải báo "còn N phút mới ghi được quyết định" trong chi tiết phiên review.
 *   - TestGateCard: tiêu chí VÀO của Test Plan + version kế hoạch kiểm + chế độ cổng của dự án (settings.testGate).
 *   - ReqTestGroups: 6 nhóm ca kiểm thử của thẻ Req/Story (đếm theo nhãn) + lint bước test.
 * Mọi số do máy chủ tính; ở đây chỉ vẽ + gửi bản vá.
 */

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Settings2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { workApi, workError, type ProjectConfig } from '@/lib/work-api';
import { ENTRY_KINDS, q6Api, q6Keys, type EntryCriterion, type EntryKind } from '@/lib/work-q6-api';
import { g3Api, qualitySettingsOf, TEST_GROUPS, type ProjectChecklist } from '@/lib/work-g3-api';
import { Dialog, PageLoading } from '../ui';
import { wk } from '../hooks';
import { useWT, type WKey } from '../i18n';
import { Badge, Card, Labeled, NumberInput, Segmented, Tbl, Td, Th } from './qui';

// ─── B4: checklist cấp dự án + làm nguội ─────────────────────────

export function ReviewSettingsButton({ config, pid }: { config: ProjectConfig; pid: number }) {
  const { t } = useWT();
  const [open, setOpen] = useState(false);
  if (!config.permissions.settings) return null;
  return (
    <>
      <button type="button" className="w-btn w-btn-sm" onClick={() => setOpen(true)} data-testid="g3-review-settings"><Settings2 size={14} /> {t('q6.g3ReviewSettings')}</button>
      {open && <ReviewSettingsDialog config={config} pid={pid} onClose={() => setOpen(false)} />}
    </>
  );
}

function ReviewSettingsDialog({ config, pid, onClose }: { config: ProjectConfig; pid: number; onClose: () => void }) {
  const { t, locale } = useWT();
  const qc = useQueryClient();
  const initial = qualitySettingsOf(config.settings);
  const [lists, setLists] = useState<ProjectChecklist[]>(initial.reviewChecklists);
  const [cool, setCool] = useState<number | null>(initial.reviewCoolOffHours);
  const builtins = useQuery({ queryKey: [...q6Keys.base(pid), 'checklists', locale], queryFn: () => q6Api.checklists(pid, locale) });
  const save = useMutation({
    mutationFn: () => g3Api.saveQualitySettings(pid, {
      reviewChecklists: lists.map((c) => ({ ...c, sections: c.sections.map((s) => ({ ...s, items: s.items.map((q) => q.trim()).filter(Boolean) })) })),
      reviewCoolOffHours: cool || null,
    }),
    onSuccess: () => { toast.success(t('q6.saved')); qc.invalidateQueries({ queryKey: wk.project(pid) }); qc.invalidateQueries({ queryKey: q6Keys.base(pid) }); onClose(); },
    onError: (e) => toast.error(workError(e)),
  });
  const upd = (i: number, c: ProjectChecklist) => setLists(lists.map((x, k) => (k === i ? c : x)));
  const copyBuiltin = (key: string) => {
    const b = (builtins.data ?? []).find((c) => c.key === key);
    if (!b) return;
    setLists([...lists, { name: `${b.name} (copy)`, kind: b.kind, sections: b.sections.map((s) => ({ name: s.name, items: s.questions ?? [] })) }]);
  };
  return (
    <Dialog open onClose={onClose} title={t('q6.g3ReviewSettings')} width={760}
      footer={<>
        <button type="button" className="w-btn w-btn-sm" onClick={onClose}>{t('common.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={save.isPending} onClick={() => save.mutate()} data-testid="g3-review-settings-save">{t('q6.save')}</button>
      </>}>
      <p className="mb-3 text-[12.5px] leading-relaxed text-[var(--w-text-2)]">{t('q6.g3ReviewSettingsDesc')}</p>
      <Labeled label={t('q6.g3CoolOffHours')} className="mb-4 w-[220px]">
        <NumberInput label={t('q6.g3CoolOffHours')} value={cool} min={0} max={72} step={0.5} onChange={setCool} />
      </Labeled>
      <div className="flex flex-col gap-3">
        {lists.map((c, i) => (
          <div key={i} className="rounded-[var(--w-radius)] border border-[var(--w-border)] p-3" data-testid="g3-project-checklist">
            <div className="mb-2 flex flex-wrap items-end gap-2">
              <Labeled label={t('q6.g3ChecklistName')} className="min-w-[240px] flex-1"><input className="w-input" value={c.name} onChange={(e) => upd(i, { ...c, name: e.target.value })} /></Labeled>
              <Segmented label={t('q6.reviewKind')} value={c.kind} onChange={(v) => upd(i, { ...c, kind: v })} options={[{ value: 'DOC', label: t('q6.kindDOC') }, { value: 'CODE', label: t('q6.kindCODE') }]} />
              <button type="button" className="w-btn w-btn-sm" onClick={() => setLists(lists.filter((_, k) => k !== i))}><Trash2 size={13} /> {t('q6.g3Remove')}</button>
            </div>
            {c.sections.map((s, si) => (
              <div key={si} className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-[200px_1fr_auto]">
                <Labeled label={t('q6.g3SectionName')}><input className="w-input" value={s.name} onChange={(e) => upd(i, { ...c, sections: c.sections.map((x, k) => (k === si ? { ...x, name: e.target.value } : x)) })} /></Labeled>
                <Labeled label={t('q6.g3Questions')}>
                  <textarea className="w-input min-h-[72px]" value={s.items.join('\n')} onChange={(e) => upd(i, { ...c, sections: c.sections.map((x, k) => (k === si ? { ...x, items: e.target.value.split('\n') } : x)) })} />
                </Labeled>
                <button type="button" className="w-btn w-btn-sm self-end" aria-label={t('q6.g3Remove')} onClick={() => upd(i, { ...c, sections: c.sections.filter((_, k) => k !== si) })}><Trash2 size={13} /></button>
              </div>
            ))}
            <button type="button" className="w-btn w-btn-sm" onClick={() => upd(i, { ...c, sections: [...c.sections, { name: '', items: [] }] })}><Plus size={13} /> {t('q6.g3AddSection')}</button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className="w-btn w-btn-sm" onClick={() => setLists([...lists, { name: '', kind: 'DOC', sections: [{ name: '', items: [] }] }])} data-testid="g3-add-checklist"><Plus size={13} /> {t('q6.g3AddChecklist')}</button>
        <select className="w-input w-[300px]" value="" onChange={(e) => e.target.value && copyBuiltin(e.target.value)} aria-label={t('q6.g3CopyBuiltin')}>
          <option value="">{t('q6.g3CopyBuiltin')}</option>
          {(builtins.data ?? []).filter((c) => !c.custom).map((c) => <option key={c.key} value={c.key}>{c.name} ({c.items})</option>)}
        </select>
      </div>
    </Dialog>
  );
}

export function CoolOffNotice({ coolOff }: { coolOff?: { hours: number; readyAt: string; remainingMinutes: number } | null }) {
  const { t, fmtDateTime } = useWT();
  if (!coolOff) return null;
  const waiting = coolOff.remainingMinutes > 0;
  return (
    <div role="status" data-testid="g3-cooloff"
      className={waiting ? 'rounded-[6px] border border-[var(--w-yellow)] bg-[color-mix(in_srgb,var(--w-yellow)_12%,transparent)] px-3 py-2 text-[12.5px] text-[var(--w-yellow-text)]' : 'rounded-[6px] bg-[var(--w-hover)] px-3 py-2 text-[12.5px] text-[var(--w-text-2)]'}>
      {waiting ? t('q6.g3CoolOffActive', { at: fmtDateTime(coolOff.readyAt), m: coolOff.remainingMinutes }) : t('q6.g3CoolOffDone', { h: coolOff.hours })}
    </div>
  );
}

// ─── D2: tiêu chí vào + cổng ─────────────────────────────────────

export function TestGateCard({ config, pid, planId }: { config: ProjectConfig; pid: number; planId: number | null }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const canEdit = config.permissions.editIssues;
  const mode = qualitySettingsOf(config.settings).testGate;
  const plan = useQuery({ queryKey: [...q6Keys.tests(pid), 'plan', planId], queryFn: () => q6Api.planSettings(pid, planId!), enabled: !!planId });
  const versions = useQuery({ queryKey: ['work', 'versions', pid], queryFn: () => workApi.versions(pid), enabled: !!planId });
  const [entry, setEntry] = useState<EntryCriterion[]>([]);
  const [versionId, setVersionId] = useState<number | null>(null);
  useEffect(() => { setEntry(plan.data?.settings.entry ?? []); setVersionId(plan.data?.settings.versionId ?? null); }, [plan.data]);
  const refresh = () => { qc.invalidateQueries({ queryKey: q6Keys.tests(pid) }); };
  const save = useMutation({
    mutationFn: () => q6Api.savePlanSettings(pid, planId!, { entry, versionId }),
    onSuccess: () => { toast.success(t('q6.saved')); refresh(); },
    onError: (e) => toast.error(workError(e)),
  });
  const setMode = useMutation({
    mutationFn: (m: 'block' | 'warn' | null) => g3Api.saveQualitySettings(pid, { testGate: m }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: wk.project(pid) }); refresh(); },
    onError: (e) => toast.error(workError(e)),
  });
  const gate = plan.data?.gate;
  const numeric = (k: EntryKind) => k === 'CASES_READY' || k === 'REQ_COVERAGE' || k === 'MAX_OPEN_CRITICAL';
  return (
    <Card title={t('q6.g3Gate')} desc={t('q6.g3GateDesc')} testId="g3-test-gate"
      actions={<>
        {gate && <Badge tone={gate.entry.met ? 'green' : 'red'}>{gate.entry.met ? t('q6.g3EntryMet') : t('q6.g3EntryNotMet')}</Badge>}
        {canEdit && planId && <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={save.isPending} onClick={() => save.mutate()} data-testid="g3-save-entry">{t('q6.save')}</button>}
      </>}>
      <div className="mb-3 flex flex-wrap items-end gap-3">
        <Labeled label={t('q6.g3GateMode')}>
          <Segmented<'off' | 'warn' | 'block'> label={t('q6.g3GateMode')} disabled={!config.permissions.settings || setMode.isPending} value={mode ?? 'off'}
            onChange={(v) => setMode.mutate(v === 'off' ? null : v)} testId="g3-gate-mode"
            options={[{ value: 'off', label: t('q6.g3GateOff') }, { value: 'warn', label: t('q6.g3GateWarn'), tone: 'yellow' }, { value: 'block', label: t('q6.g3GateBlock'), tone: 'red' }]} />
        </Labeled>
        {planId && (
          <Labeled label={t('q6.g3TargetVersion')} className="w-[240px]">
            <select className="w-input" disabled={!canEdit} value={versionId ?? ''} onChange={(e) => setVersionId(e.target.value ? Number(e.target.value) : null)}>
              <option value="">{t('q6.g3NoVersion')}</option>
              {(versions.data ?? []).map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </Labeled>
        )}
      </div>
      {!planId ? <p className="text-[12.5px] text-[var(--w-text-3)]">{t('q6.planDocNeedsPlan')}</p> : plan.isLoading ? <PageLoading rows={2} /> : (
        <>
          <h3 className="mb-2 text-[13px] font-semibold">{t('q6.g3EntryTitle')}</h3>
          {!entry.length && <p className="mb-2 text-[12.5px] text-[var(--w-text-3)]">{t('q6.g3EntryNone')}</p>}
          {!!entry.length && (
            <Tbl minWidth={560} label={t('q6.g3EntryTitle')}>
              <thead><tr><Th>{t('q6.g3EntryTitle')}</Th><Th w={130}>{t('q6.target')}</Th><Th w={100}>{t('q6.actual')}</Th><Th w={60}>{t('q6.met')}</Th><Th w={44} /></tr></thead>
              <tbody>
                {entry.map((c, i) => {
                  const row = gate?.entry.rows[i];
                  const setC = (x: EntryCriterion) => setEntry(entry.map((y, k) => (k === i ? x : y)));
                  return (
                    <tr key={i}>
                      <Td>
                        <select className="w-input" disabled={!canEdit} value={c.kind} onChange={(e) => setC({ kind: e.target.value as EntryKind, ...(e.target.value === 'MANUAL' ? { text: c.text ?? '' } : {}) })} aria-label={t('q6.g3EntryTitle')}>
                          {ENTRY_KINDS.map((k) => <option key={k} value={k}>{t(`q6.ek_${k}` as WKey)}</option>)}
                        </select>
                        {c.kind === 'MANUAL' && (
                          <div className="mt-1 flex items-center gap-2">
                            <input type="checkbox" disabled={!canEdit} checked={c.done === true} onChange={(e) => setC({ ...c, done: e.target.checked })} aria-label={t('q6.met')} />
                            <input className="w-input" disabled={!canEdit} value={c.text ?? ''} maxLength={300} onChange={(e) => setC({ ...c, text: e.target.value })} />
                          </div>
                        )}
                      </Td>
                      <Td>{numeric(c.kind) ? <NumberInput label={t('q6.target')} disabled={!canEdit} value={c.target ?? null} min={0} onChange={(v) => setC({ ...c, target: v })} /> : <span className="text-[12px] text-[var(--w-text-3)]">{row?.target ?? '—'}</span>}</Td>
                      <Td className="tabular-nums">{row?.actual ?? '—'}</Td>
                      <Td>{row ? <Badge tone={row.met ? 'green' : 'red'}>{row.met ? '✓' : '✗'}</Badge> : '—'}</Td>
                      <Td>{canEdit && <button type="button" className="w-btn w-btn-sm" aria-label={t('q6.g3Remove')} onClick={() => setEntry(entry.filter((_, k) => k !== i))}><Trash2 size={13} /></button>}</Td>
                    </tr>
                  );
                })}
              </tbody>
            </Tbl>
          )}
          {canEdit && (
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" className="w-btn w-btn-sm" onClick={() => setEntry([...entry, { kind: 'CASES_READY', target: 1 }])} data-testid="g3-add-entry"><Plus size={13} /> {t('q6.g3EntryAdd')}</button>
              {!entry.length && plan.data?.suggestedEntry && <button type="button" className="w-btn w-btn-sm" onClick={() => setEntry(plan.data!.suggestedEntry!)}>{t('q6.g3EntrySuggest')}</button>}
            </div>
          )}
        </>
      )}
    </Card>
  );
}

// ─── D4: 6 nhóm ca kiểm thử của thẻ Req ──────────────────────────

export function ReqTestGroups({ pid, num }: { pid: number; num: number }) {
  const { t } = useWT();
  const q = useQuery({ queryKey: [...q6Keys.tests(pid), 'groups', num], queryFn: () => g3Api.testGroups(pid, num), retry: false });
  const d = q.data;
  if (!d || !d.isRequirement) return null;
  const linted = d.tests.filter((x) => x.lint.length);
  return (
    <section aria-labelledby={`g3-groups-${num}`} className="mt-4 border-t border-[var(--w-border)] pt-3" data-testid="g3-req-groups">
      <div className="mb-1 flex flex-wrap items-baseline gap-2">
        <span id={`g3-groups-${num}`} className="text-[12px] font-medium text-[var(--w-text-2)]">{t('q6.g3Groups')}</span>
        <span className="text-[11.5px] text-[var(--w-text-3)]">{t('q6.g3GroupsDesc')}</span>
      </div>
      {!d.tests.length ? <p className="text-[12px] text-[var(--w-text-3)]">{t('q6.g3NoLinkedTests')}</p> : (
        <>
          <div className="flex flex-wrap gap-1.5">
            {TEST_GROUPS.map((g) => {
              const row = d.groups.find((x) => x.group === g);
              return <Badge key={g} tone={row?.count ? 'green' : 'red'} title={row?.tests.join(', ')}>{g} · {row?.count ?? 0}</Badge>;
            })}
          </div>
          <p className="mt-1 text-[12px] text-[var(--w-text-2)]">{d.missing.length ? t('q6.g3GroupsMissing', { g: d.missing.join(', ') }) : t('q6.g3GroupsAll')}</p>
          {!!d.ungrouped.length && <p className="text-[12px] text-[var(--w-text-3)]">{t('q6.g3Ungrouped', { k: d.ungrouped.join(', ') })}</p>}
          {!!linted.length && (
            <ul className="mt-1 list-disc pl-5 text-[12px] text-[var(--w-yellow-text)]">
              {linted.map((x) => <li key={x.key}>{x.key}: {x.lint.map((l) => t(`q6.lint_${l.code}` as WKey, { s: (l.steps ?? []).join(', ') })).join(' · ')}</li>)}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
