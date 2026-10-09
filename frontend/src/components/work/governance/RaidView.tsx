'use client';

/**
 * SỔ RAID — /work/<ws>/<KEY>/raid (đợt S3b, mô-đun raid): Risks · Assumptions · Issues ·
 * Dependencies. Thẻ theo loại, ma trận 5×5 xác suất × ảnh hưởng (bấm ô ⇒ lọc), nhắc
 * "review due", hộp chi tiết (sửa + liên kết + lịch sử). `?item=<n>` mở thẳng một dòng
 * (link trong lời nhắc xem lại). Thang điểm theo so-dang-ky-rui-ro.md: ≥15 cao · 8–14 TB · ≤7 thấp.
 */

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlarmClock, FileDown, Link2, Plus, Save, ShieldAlert, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError, workStudioApi, workStudioKeys, type ProjectConfig } from '@/lib/work-api';
import {
  RAID_LABEL, RAID_RESPONSE_LABEL, RAID_STATUS_LABEL, RAID_TYPES, govApi, govKeys,
  type RaidDetail, type RaidItem, type RaidPatch, type RaidResponse, type RaidType,
} from '@/lib/work-s3b-api';
import { Dialog, EmptyState, Field, PageLoading, Spinner, StatusBadge, UserAvatar, formatDate, relativeTime } from '../ui';
import { ConfirmDialog, Select } from '../settings/shared';
import { Pill } from '../studio/shared';
import { LEVEL_COLOR, PersonSelect, RaidStatusPill, ScoreBadge, levelOf, useGovInvalidate } from './shared';
import { wt } from '@/components/work/i18n';
import ChartFrame from '../charts/ChartFrame';
import { resolveColor } from '../charts/exportChart';

const STATUSES: Record<RaidType, string[]> = {
  RISK: ['OPEN', 'MONITORING', 'MITIGATED', 'CLOSED'], ISSUE: ['OPEN', 'MONITORING', 'MITIGATED', 'CLOSED'],
  DEPENDENCY: ['OPEN', 'MONITORING', 'MITIGATED', 'CLOSED'], ASSUMPTION: ['UNVALIDATED', 'VALIDATED', 'INVALID'],
};
const pLabel = (n: number) => wt('gov.pLabels').split(',')[n] ?? '';
const iLabel = (n: number) => wt('gov.iLabels').split(',')[n] ?? '';

// ─── Ma trận ─────────────────────────────────────────────────────

function Matrix({ m, cell, onCell }: { m: number[][]; cell: { p: number; i: number } | null; onCell: (c: { p: number; i: number } | null) => void }) {
  // UX-B: ma trận đi chung ChartFrame (cách tính, xuất PNG vẽ tay trên canvas + CSV). Lưới vẫn là nút bấm (lọc theo ô) —
  // Recharts không có loại heatmap, và ô phải bấm được bằng bàn phím.
  const rows: Array<{ p: number; i: number; score: number; count: number }> = [];
  for (const p of [5, 4, 3, 2, 1]) for (const i of [1, 2, 3, 4, 5]) rows.push({ p, i, score: p * i, count: m[p - 1]?.[i - 1] ?? 0 });
  const total = rows.reduce((s, r) => s + r.count, 0);
  const draw = (ctx: CanvasRenderingContext2D, w: number) => {
    const root = document.querySelector('[data-testid="raid-matrix"]') ?? document.body;
    const col = (v: string) => resolveColor(root, v);
    const size = Math.min(64, Math.floor((w - 40) / 5));
    const gap = 4;
    ctx.font = '600 13px Inter, "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    rows.forEach((r) => {
      const x = 28 + (r.i - 1) * (size + gap);
      const y = (5 - r.p) * (size + gap);
      const lv = levelOf(r.score)!;
      ctx.fillStyle = col(`color-mix(in srgb, ${LEVEL_COLOR[lv]} ${r.count ? 30 : 12}%, var(--w-panel))`);
      ctx.fillRect(x, y, size, size);
      ctx.fillStyle = col('var(--w-text)');
      if (r.count) ctx.fillText(String(r.count), x + size / 2, y + size / 2);
      ctx.fillStyle = col('var(--w-text-3)');
      ctx.font = '500 10px Inter, Arial, sans-serif';
      ctx.fillText(String(r.score), x + 9, y + 9);
      ctx.font = '600 13px Inter, "Segoe UI", Arial, sans-serif';
    });
    ctx.fillStyle = col('var(--w-text-3)');
    ctx.font = '500 11px Inter, "Segoe UI", Arial, sans-serif';
    ctx.fillText(wt('gov.impactArrow'), 28 + (5 * (size + gap)) / 2, 5 * (size + gap) + 12);
    ctx.save();
    ctx.translate(10, (5 * (size + gap)) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(wt('gov.probArrow'), 0, 0);
    ctx.restore();
  };
  return (
    <div className="min-w-0" data-testid="raid-matrix">
      <h2 className="w-section-title">{wt('gov.riskMatrix')}</h2>
      <ChartFrame
        bare title={wt('gov.riskMatrix')} description={wt('charts.riskMatrixDesc')} interactive
        toolbar={cell ? <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => onCell(null)}><X size={12} /> {wt('common.clear')}</button> : undefined}
        series={(['HIGH', 'MEDIUM', 'LOW'] as const).map((l) => ({ key: l, label: l === 'HIGH' ? wt('gov.legend') : l === 'MEDIUM' ? wt('gov.legendM') : wt('gov.legendL'), color: `color-mix(in srgb, ${LEVEL_COLOR[l]} 45%, var(--w-panel))`, fixed: true }))}
        rows={rows}
        columns={[{ key: 'p', label: wt('charts.probability') }, { key: 'i', label: wt('charts.impact') }, { key: 'score', label: wt('charts.score') }, { key: 'count', label: wt('charts.risks') }]}
        summary={wt('charts.riskMatrixSummary', { count: total })}
        drawPng={draw} drawPngSize={{ width: 380, height: 380 }}
        fileName="risk-matrix"
      >
        {() => (
          <div className="flex gap-1.5">
            <div className="flex w-4 shrink-0 items-center justify-center">
              <span className="-rotate-90 whitespace-nowrap text-[11px] font-medium text-[var(--w-text-3)]">{wt('gov.probArrow')}</span>
            </div>
            <div className="min-w-0 flex-1">
              {/* UX-A: lưới ARIA đúng cấu trúc grid › row › gridcell › button; số điểm dùng màu chữ thường (trước 2.3:1). */}
              <div className="flex flex-col gap-1" role="grid" aria-label={wt('gov.probByImpact')}>
                {[5, 4, 3, 2, 1].map((p) => (
                  <div key={p} role="row" className="grid grid-cols-5 gap-1">
                    {[1, 2, 3, 4, 5].map((i) => {
                      const n = m[p - 1]?.[i - 1] ?? 0;
                      const lv = levelOf(p * i)!;
                      const on = cell?.p === p && cell?.i === i;
                      return (
                        <div key={i} role="gridcell" className="min-w-0">
                          <button
                            type="button"
                            aria-label={wt('gov.cellAria', { p, pl: pLabel(p - 1), i, il: iLabel(i - 1), count: n })}
                            aria-pressed={on}
                            onClick={() => onCell(on ? null : { p, i })}
                            data-testid={`raid-cell-${p}-${i}`}
                            className={cn('relative flex aspect-square min-h-[34px] w-full items-center justify-center rounded-[6px] text-[13px] font-semibold tabular-nums text-[var(--w-text)] transition-[box-shadow]', on && 'ring-2 ring-[var(--w-accent)] ring-offset-1 ring-offset-[var(--w-panel)]')}
                            style={{ background: `color-mix(in srgb, ${LEVEL_COLOR[lv]} ${n ? 30 : 12}%, var(--w-panel))` }}
                          >
                            {n || ''}
                            <span aria-hidden="true" className="absolute left-1 top-0.5 text-[10px] font-medium text-[var(--w-text-2)]">{p * i}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="mt-1 text-center text-[11px] font-medium text-[var(--w-text-3)]">{wt('gov.impactArrow')}</div>
            </div>
          </div>
        )}
      </ChartFrame>
    </div>
  );
}

// ─── Form ────────────────────────────────────────────────────────

type Form = { type: RaidType; title: string; description: string; category: string; ownerId: number | null; status: string; probability: number | null; impact: number | null; response: RaidResponse | null; mitigation: string; trigger: string; reviewDate: string; clientVisible: boolean };
const emptyForm = (type: RaidType): Form => ({ type, title: '', description: '', category: '', ownerId: null, status: type === 'ASSUMPTION' ? 'UNVALIDATED' : 'OPEN', probability: null, impact: null, response: null, mitigation: '', trigger: '', reviewDate: '', clientVisible: false });
const formOf = (r: RaidDetail): Form => ({
  type: r.type, title: r.title, description: r.description ?? '', category: r.category ?? '', ownerId: r.owner?.id ?? null, status: r.status,
  probability: r.probability, impact: r.impact, response: r.response, mitigation: r.mitigation ?? '', trigger: r.trigger ?? '', reviewDate: r.reviewDate ?? '', clientVisible: !!r.clientVisible,
});
const toPatch = (f: Form): RaidPatch & { type: RaidType; title: string } => ({
  type: f.type, title: f.title.trim(), description: f.description.trim() || null, category: f.category.trim() || null, ownerId: f.ownerId, status: f.status,
  probability: f.probability, impact: f.impact, response: f.response, mitigation: f.mitigation.trim() || null, trigger: f.trigger.trim() || null, reviewDate: f.reviewDate || null, clientVisible: f.type === 'RISK' && f.clientVisible,
});

function RaidForm({ config, f, set, ro, creating }: { config: ProjectConfig; f: Form; set: (p: Partial<Form>) => void; ro: boolean; creating?: boolean }) {
  const scored = f.type === 'RISK' || f.type === 'ISSUE' || f.type === 'DEPENDENCY';
  const score = f.probability && f.impact ? f.probability * f.impact : null;
  return (
    <div>
      <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[160px_1fr]">
        <Field label={wt('common.type')}>
          <Select aria-label={wt('common.type')} value={f.type} disabled={ro || !creating} onChange={(e) => { const t = e.target.value as RaidType; set({ type: t, status: STATUSES[t].includes(f.status) ? f.status : STATUSES[t][0] }); }}>
            {RAID_TYPES.map((t) => <option key={t} value={t}>{RAID_LABEL[t].one}</option>)}
          </Select>
        </Field>
        <Field label={wt('common.title')}>
          <input className="w-input" value={f.title} maxLength={255} disabled={ro} autoFocus={creating} onChange={(e) => set({ title: e.target.value })} placeholder={f.type === 'RISK' ? wt('gov.phRisk') : f.type === 'ASSUMPTION' ? wt('gov.phAssume') : f.type === 'DEPENDENCY' ? wt('gov.phDepend') : wt('gov.phIssue')} data-testid="raid-title" />
        </Field>
      </div>
      <Field label={wt('common.description')}>
        <textarea className="w-input" rows={2} maxLength={20000} disabled={ro} value={f.description} onChange={(e) => set({ description: e.target.value })} />
      </Field>
      <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-3">
        <Field label={wt('common.status')}>
          <Select aria-label={wt('common.status')} value={f.status} disabled={ro} onChange={(e) => set({ status: e.target.value })}>
            {STATUSES[f.type].map((s) => <option key={s} value={s}>{RAID_STATUS_LABEL[s]}</option>)}
          </Select>
        </Field>
        <Field label={wt('gov.owner')}><PersonSelect config={config} value={f.ownerId} onChange={(v) => set({ ownerId: v })} label={wt('gov.owner')} staffOnly empty={creating ? wt('common.me') : wt('gov.nobody')} disabled={ro} /></Field>
        <Field label={wt('gov.category')}><input className="w-input" value={f.category} maxLength={60} disabled={ro} onChange={(e) => set({ category: e.target.value })} placeholder={wt('gov.catPh')} /></Field>
      </div>
      {scored && (
        <div className="grid grid-cols-2 gap-x-3 sm:grid-cols-[1fr_1fr_auto]">
          <Field label={wt('gov.prob15')}>
            <Select aria-label={wt('gov.probability')} value={f.probability ?? ''} disabled={ro} onChange={(e) => set({ probability: e.target.value ? Number(e.target.value) : null })} data-testid="raid-p">
              <option value="">{wt('gov.notScored')}</option>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} · {pLabel(n - 1)}</option>)}
            </Select>
          </Field>
          <Field label={wt('gov.impact15')}>
            <Select aria-label={wt('gov.impactA')} value={f.impact ?? ''} disabled={ro} onChange={(e) => set({ impact: e.target.value ? Number(e.target.value) : null })} data-testid="raid-i">
              <option value="">{wt('gov.notScored')}</option>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} · {iLabel(n - 1)}</option>)}
            </Select>
          </Field>
          <Field label={wt('gov.score')}><div className="flex h-9 items-center"><ScoreBadge score={score} /></div></Field>
        </div>
      )}
      {f.type === 'RISK' && (
        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[180px_1fr]">
          <Field label={wt('gov.response')}>
            <Select aria-label={wt('gov.response')} value={f.response ?? ''} disabled={ro} onChange={(e) => set({ response: (e.target.value || null) as RaidResponse | null })}>
              <option value="">{wt('gov.notDecided')}</option>
              {(Object.keys(RAID_RESPONSE_LABEL) as RaidResponse[]).map((r) => <option key={r} value={r}>{RAID_RESPONSE_LABEL[r]}</option>)}
            </Select>
          </Field>
          <Field label={wt('gov.earlyWarning')}><input className="w-input" value={f.trigger} maxLength={5000} disabled={ro} onChange={(e) => set({ trigger: e.target.value })} placeholder={wt('gov.triggerPh')} /></Field>
        </div>
      )}
      <Field label={f.type === 'RISK' ? wt('gov.mitigation') : f.type === 'ASSUMPTION' ? wt('gov.howValidate') : wt('gov.actionPlan')}>
        <textarea className="w-input" rows={2} maxLength={20000} disabled={ro} value={f.mitigation} onChange={(e) => set({ mitigation: e.target.value })} />
      </Field>
      <Field label={wt('gov.reviewBy')} hint={wt('gov.reviewHint')}>
        <input type="date" className="w-input !w-[180px]" value={f.reviewDate} disabled={ro} onChange={(e) => set({ reviewDate: e.target.value })} data-testid="raid-review" />
      </Field>
      {/* Đợt S4: chỉ rủi ro mới nêu được trong báo cáo tuần cho khách (và chỉ khi lịch báo cáo bật "include risks"). */}
      {f.type === 'RISK' && (
        <label className="mt-1 flex items-start gap-2 text-[13px]">
          <input type="checkbox" className="mt-0.5" checked={f.clientVisible} disabled={ro} onChange={(e) => set({ clientVisible: e.target.checked })} data-testid="raid-client-visible" />
          <span>{wt('gov.shareReports')} <span className="text-[var(--w-text-3)]">{wt('gov.shareReportsNote')}</span></span>
        </label>
      )}
    </div>
  );
}

export function NewRaidDialog({ config, open, onClose, type }: { config: ProjectConfig; open: boolean; onClose: () => void; type: RaidType }) {
  const invalidate = useGovInvalidate(config.id);
  const [f, setF] = useState<Form>(() => emptyForm(type));
  useEffect(() => { if (open) setF(emptyForm(type)); }, [open, type]);
  const create = useMutation({
    mutationFn: () => govApi.createRaid(config.id, toPatch(f)),
    onSuccess: (r) => { toast.success(`${r.key} added`); invalidate(); onClose(); },
    onError: (err) => toast.error(workError(err, wt('gov.addFailed'))),
  });
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={wt('gov.addX', { x: RAID_LABEL[f.type].one.toLowerCase() })}
      width={640}
      footer={<>
        <button type="button" className="w-btn" onClick={onClose}>{wt('common.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!f.title.trim() || create.isPending} onClick={() => create.mutate()} data-testid="raid-create">{create.isPending ? <Spinner size={12} /> : <Plus size={13} />} {wt('common.add')}</button>
      </>}
    >
      <RaidForm config={config} f={f} set={(p) => setF((x) => ({ ...x, ...p }))} ro={false} creating />
    </Dialog>
  );
}

function RaidItemDialog({ config, num, onClose }: { config: ProjectConfig; num: number | null; onClose: () => void }) {
  const pid = config.id;
  const invalidate = useGovInvalidate(pid);
  const q = useQuery({ queryKey: govKeys.raidItem(pid, num ?? 0), queryFn: () => govApi.raidItem(pid, num!), enabled: !!num });
  const r = q.data;
  const [f, setF] = useState<Form | null>(null);
  useEffect(() => { if (r) setF(formOf(r)); }, [r]);
  const [linkKind, setLinkKind] = useState<'issue' | 'cr' | 'stage'>('issue');
  const [linkVal, setLinkVal] = useState('');
  const [confirmDel, setConfirmDel] = useState(false);
  const stages = useQuery({ queryKey: workStudioKeys.stages(pid), queryFn: () => workStudioApi.stages(pid), enabled: !!num && !!config.modules?.stages && linkKind === 'stage' });
  const save = useMutation({
    mutationFn: () => govApi.updateRaid(pid, num!, { ...toPatch(f!), version: r!.version }),
    onSuccess: () => { toast.success(wt('common.saved')); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('common.couldNotSave'))),
  });
  const link = useMutation({
    mutationFn: () => govApi.linkRaid(pid, num!, linkKind === 'issue' ? { issueNumber: Number(linkVal.replace(/^[A-Z0-9]+-/i, '')) } : linkKind === 'cr' ? { crNumber: Number(linkVal.replace(/^CR-/i, '')) } : { stageId: Number(linkVal) }),
    onSuccess: () => { setLinkVal(''); invalidate(); },
    onError: (err) => toast.error(workError(err, wt('desk.linkFailed'))),
  });
  const unlink = useMutation({ mutationFn: (id: number) => govApi.unlinkRaid(pid, num!, id), onSuccess: () => invalidate(), onError: (err) => toast.error(workError(err)) });
  const del = useMutation({
    mutationFn: () => govApi.deleteRaid(pid, num!),
    onSuccess: () => { toast.success(wt('gov.deleted')); setConfirmDel(false); invalidate(); onClose(); },
    onError: (err) => toast.error(workError(err, wt('common.couldNotDelete'))),
  });
  const dirty = !!(r && f && JSON.stringify(f) !== JSON.stringify(formOf(r)));
  const base = `/work/${config.workspace.slug}/${config.key}`;
  return (
    <Dialog
      open={!!num}
      onClose={onClose}
      width={720}
      title={r ? <span className="flex min-w-0 items-center gap-2"><span className="font-mono text-[13px] text-[var(--w-accent-text)]">{r.key}</span><span className="truncate">{r.title}</span></span> : wt('common.loading')}
      footer={r?.canEdit ? <>
        {r.canDelete && <button type="button" className="w-btn w-btn-ghost w-btn-danger mr-auto" onClick={() => setConfirmDel(true)}><Trash2 size={13} /> {wt('common.delete')}</button>}
        <button type="button" className="w-btn" onClick={onClose}>{wt('common.close')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!dirty || !f?.title.trim() || save.isPending} onClick={() => save.mutate()} data-testid="raid-save">{save.isPending ? <Spinner size={12} /> : <Save size={13} />} {wt('common.save')}</button>
      </> : undefined}
    >
      {q.isLoading || !f ? <PageLoading rows={4} /> : q.error || !r ? <EmptyState title={wt('gov.notFound')} body={workError(q.error)} /> : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-[var(--w-text-3)]">
            <RaidStatusPill status={r.status} />
            {r.score !== null && <ScoreBadge score={r.score} />}
            {r.reviewDue && <Pill tone="orange">{wt('gov.reviewDue')}</Pill>}
            <span>{wt('gov.addedBy', { name: userName(r.createdBy), when: relativeTime(r.createdAt) })}</span>
          </div>
          <RaidForm config={config} f={f} set={(p) => setF((x) => (x ? { ...x, ...p } : x))} ro={!r.canEdit} />
          <section>
            <h3 className="w-section-title mb-2">{wt('gov.linked')}</h3>
            {r.links.length ? (
              <ul className="mb-2 divide-y divide-[var(--w-border)] rounded-[6px] border border-[var(--w-border)]">
                {r.links.map((l) => (
                  <li key={l.id} className="flex min-w-0 items-center gap-2 px-3 py-2 text-[13px]">
                    {l.issue && <><Link href={`${base}/issue/${l.issue.number}`} className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)] hover:underline">{l.issue.key}</Link><span className="min-w-0 flex-1 truncate">{l.issue.title}</span><StatusBadge status={l.issue.status} /></>}
                    {l.changeRequest && <><Link href={`${base}/changes/${l.changeRequest.number}`} className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)] hover:underline">{l.changeRequest.key}</Link><span className="min-w-0 flex-1 truncate">{l.changeRequest.title}</span></>}
                    {l.stage && <><span className="shrink-0 text-[12px] text-[var(--w-text-3)]">{wt('gov.stage')}</span><span className="min-w-0 flex-1 truncate">{l.stage.n}. {l.stage.name}</span></>}
                    {r.canEdit && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('gov.removeLink')} onClick={() => unlink.mutate(l.id)}><X size={13} /></button>}
                  </li>
                ))}
              </ul>
            ) : <p className="mb-2 text-[13px] text-[var(--w-text-3)]">{wt('gov.notLinked')}</p>}
            {r.canEdit && (
              <div className="flex flex-wrap items-center gap-2">
                <Select aria-label={wt('gov.linkType')} value={linkKind} onChange={(e) => { setLinkKind(e.target.value as typeof linkKind); setLinkVal(''); }} className="!w-auto">
                  <option value="issue">{wt('common.issue')}</option>
                  {config.modules?.changeRequests && <option value="cr">{wt('gov.changeRequest')}</option>}
                  {config.modules?.stages && <option value="stage">{wt('gov.stage')}</option>}
                </Select>
                {linkKind === 'stage' ? (
                  <Select aria-label={wt('gov.stage')} value={linkVal} onChange={(e) => setLinkVal(e.target.value)} className="!w-auto max-w-full">
                    <option value="">{wt('gov.chooseStage')}</option>
                    {(stages.data ?? []).map((s) => <option key={s.id} value={s.id}>{s.n}. {s.name}</option>)}
                  </Select>
                ) : <input className="w-input !w-[150px]" value={linkVal} onChange={(e) => setLinkVal(e.target.value)} placeholder={linkKind === 'cr' ? 'CR-3' : `${config.key}-12`} aria-label={wt('common.key')} />}
                <button type="button" className="w-btn w-btn-sm" disabled={!linkVal || link.isPending} onClick={() => link.mutate()}><Link2 size={13} /> {wt('desk.link')}</button>
              </div>
            )}
          </section>
          <section>
            <h3 className="w-section-title mb-2">{wt('gov.history')}</h3>
            <ol className="space-y-1.5 text-[12.5px]" data-testid="raid-history">
              {r.history.map((h) => (
                <li key={h.id} className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 text-[var(--w-text-2)]">
                  <span className="font-medium text-[var(--w-text)]">{userName(h.actor)}</span>
                  {h.field === 'created' ? <span>{wt('gov.hAdded', { v: h.toValue })}</span>
                    : h.field === 'link' ? <span>{wt('gov.hLinked', { v: h.toValue })}</span>
                      : h.field === 'unlink' ? <span>{wt('gov.hUnlinked')}</span>
                        : <span className="min-w-0 [overflow-wrap:anywhere]">{wt('gov.hChanged')} <b className="font-medium">{h.field}</b>{h.fromValue ? <> {wt('gov.hFrom', { v: RAID_STATUS_LABEL[h.fromValue] ?? h.fromValue })}</> : null} {wt('gov.hTo', { v: h.toValue ? (RAID_STATUS_LABEL[h.toValue] ?? h.toValue) : wt('gov.empty') })}</span>}
                  <span className="text-[var(--w-text-3)]">· {relativeTime(h.createdAt)}</span>
                </li>
              ))}
            </ol>
          </section>
          <ConfirmDialog open={confirmDel} onClose={() => setConfirmDel(false)} title={wt('gov.deleteKeyQ', { key: r.key })} body={wt('gov.raidDelBody')} confirmLabel={wt('common.delete')} pending={del.isPending} onConfirm={() => del.mutate()} />
        </div>
      )}
    </Dialog>
  );
}

// ─── Trang ───────────────────────────────────────────────────────

export default function RaidView({ config }: { config: ProjectConfig }) {
  const pid = config.id;
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const tab = (RAID_TYPES as string[]).includes(sp?.get('type') ?? '') ? (sp!.get('type') as RaidType) : 'RISK';
  const item = Number(sp?.get('item')) || null;
  const setParams = useCallback((patch: Record<string, string | null>) => {
    const next = new URLSearchParams(sp?.toString() ?? '');
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    const s = next.toString();
    router.replace(s ? `${pathname}?${s}` : pathname!, { scroll: false });
  }, [sp, pathname, router]);
  const [cell, setCell] = useState<{ p: number; i: number } | null>(null);
  const [dueOnly, setDueOnly] = useState(false);
  const [showClosed, setShowClosed] = useState(false);
  const [adding, setAdding] = useState(false);
  const invalidate = useGovInvalidate(pid);
  const q = useQuery({ queryKey: govKeys.raid(pid), queryFn: () => govApi.raid(pid) });
  const starter = useMutation({
    mutationFn: () => govApi.starterRisks(pid),
    onSuccess: (r) => { toast.success(r.added ? wt('gov.starterAdded', { count: r.added }) : wt('gov.starterAlready')); invalidate(); },
    onError: (err) => toast.error(workError(err)),
  });
  const items = useMemo(() => (q.data?.items ?? []).filter((r) => r.type === tab
    && (showClosed || !r.closed || !!cell)
    && (!cell || (r.probability === cell.p && r.impact === cell.i))
    && (!dueOnly || r.reviewDue))
    .sort((a, b) => Number(a.closed) - Number(b.closed) || (b.score ?? -1) - (a.score ?? -1) || b.number - a.number), [q.data, tab, cell, dueOnly, showClosed]);

  if (q.isLoading) return <PageLoading rows={6} />;
  if (q.error || !q.data) return <EmptyState title={wt('gov.loadRaidFailed')} body={workError(q.error)} />;
  const d = q.data;

  const row = (r: RaidItem) => (
    <li key={r.id}>
      <button type="button" onClick={() => setParams({ item: String(r.number) })} className={cn('flex w-full min-w-0 items-start gap-3 px-3 py-2.5 text-left hover:bg-[var(--w-hover)] md:items-center', r.closed && 'opacity-70')} data-testid={`raid-row-${r.number}`}>
        {tab !== 'ASSUMPTION' ? <ScoreBadge score={r.score} className="mt-0.5 md:mt-0" /> : null}
        <span className="min-w-0 flex-1 md:flex md:items-center md:gap-3">
          <span className="flex min-w-0 items-center gap-2 md:flex-1">
            <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{r.key}</span>
            <span className="truncate text-[13.5px] font-medium">{r.title}</span>
          </span>
          <span className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] text-[var(--w-text-3)] md:mt-0 md:shrink-0 md:flex-nowrap">
            <RaidStatusPill status={r.status} />
            {r.response && <span>{RAID_RESPONSE_LABEL[r.response]}</span>}
            {r.reviewDue ? <Pill tone="orange"><AlarmClock size={11} /> {wt('gov.reviewDue')}</Pill> : r.reviewDate ? <span>{wt('gov.reviewOn', { d: formatDate(r.reviewDate) })}</span> : null}
            <span className="flex items-center gap-1">{r.owner && <UserAvatar user={r.owner} size={16} />}<span className="max-w-[110px] truncate">{r.owner ? userName(r.owner) : wt('gov.noOwner')}</span></span>
          </span>
        </span>
      </button>
    </li>
  );

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
      <div className="w-page">
        <nav className="-mx-4 mb-4 overflow-x-auto px-4 md:mx-0 md:px-0" aria-label={wt('gov.raidSections')}>
          <div className="inline-flex min-w-max gap-1 border-b border-[var(--w-border)]" role="tablist">
            {RAID_TYPES.map((t) => (
              <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => { setParams({ type: t === 'RISK' ? null : t }); setCell(null); }} data-testid={`raid-tab-${t}`}
                className={cn('-mb-px flex h-9 items-center gap-1.5 whitespace-nowrap border-b-2 px-2.5 text-[13px] font-medium', tab === t ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-3)] hover:text-[var(--w-text-2)]')}>
                {RAID_LABEL[t].many} <span className="w-count">{d.counts[t]?.open ?? 0}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className={cn('grid grid-cols-1 gap-4', tab === 'RISK' && 'lg:grid-cols-[minmax(0,1fr)_300px]')}>
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <button type="button" className={cn('w-btn w-btn-sm', dueOnly && 'w-btn-on')} onClick={() => setDueOnly((v) => !v)} aria-pressed={dueOnly} data-testid="raid-due">
                <AlarmClock size={13} /> {wt('gov.reviewDue')} <span className="w-count">{d.reviewDue}</span>
              </button>
              <label className="flex items-center gap-1.5 text-[12.5px] text-[var(--w-text-2)]"><input type="checkbox" checked={showClosed} onChange={(e) => setShowClosed(e.target.checked)} /> {wt('gov.showClosed')}</label>
              {cell && <Pill tone="accent">P{cell.p} × I{cell.i}</Pill>}
              <span className="ml-auto flex flex-wrap gap-2">
                {d.canEdit && tab === 'RISK' && <button type="button" className="w-btn w-btn-sm" disabled={starter.isPending} onClick={() => starter.mutate()} title={wt('gov.starterTip')}><FileDown size={13} /> {wt('gov.starterRisks')}</button>}
                {d.canEdit && <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setAdding(true)} data-testid="raid-add"><Plus size={13} /> {wt('gov.addX', { x: RAID_LABEL[tab].one.toLowerCase() })}</button>}
              </span>
            </div>
            {items.length ? (
              <ul className="w-card divide-y divide-[var(--w-border)] overflow-hidden" data-testid="raid-list">{items.map(row)}</ul>
            ) : (
              <EmptyState
                icon={<ShieldAlert size={20} />}
                title={cell ? wt('gov.noCellRisks') : wt('gov.noXYet', { x: RAID_LABEL[tab].many.toLowerCase() })}
                body={tab === 'RISK' ? wt('gov.emptyRisk') : tab === 'ASSUMPTION' ? wt('gov.emptyAssume') : tab === 'ISSUE' ? wt('gov.emptyIssue') : wt('gov.emptyDepend')}
              />
            )}
          </div>
          {tab === 'RISK' && (
            <aside className="w-card h-fit p-4 lg:sticky lg:top-4" aria-label={wt('gov.riskMatrix')}>
              <Matrix m={d.matrix} cell={cell} onCell={setCell} />
              <p className="mt-3 text-[12px] text-[var(--w-text-3)]">{d.highRisks ? wt('gov.highRisks', { count: d.highRisks }) : wt('gov.noHighRisks')}</p>
            </aside>
          )}
        </div>
      </div>
      <NewRaidDialog config={config} open={adding} onClose={() => setAdding(false)} type={tab} />
      <RaidItemDialog config={config} num={item} onClose={() => setParams({ item: null })} />
    </div>
  );
}
