'use client';

/**
 * CTW đợt 7c (C25) — sổ tài sản & giấy phép: bảng có lọc, KPI (đang dùng / sắp hết hạn / đã hết hạn / cần ghi công /
 * giấy phép chưa rõ / chi phí năm), hộp tạo-sửa, liên kết thẻ, xuất THIRD_PARTY_LICENSES · CREDITS · CSV.
 * KHÔNG BAO GIỜ lưu mật khẩu ở đây — backend chặn (WORK_ASSET_SECRET); giao diện nhắc ngay ở ô ghi chú.
 */

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Download, ExternalLink, Package, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError, type ProjectConfig } from '@/lib/work-api';
import {
  ASSET_CATEGORIES, assetApi, c7cKeys, LICENSE_TYPES, type Asset, type AssetCategory, type AssetInput, type Billing, type LicenseType,
} from '@/lib/work-c7c-api';
import { Dialog, EmptyState, PageLoading, Spinner } from '../ui';
import { Badge, Card, Labeled, NumberInput, Tbl, Td, Th, type Tone } from '../quality/qui';
import KpiTile from '../KpiTile';
import { useWT, type WKey } from '../i18n';
import { ConfirmDialog, Select } from '../settings/shared';

const EXP_TONE: Record<Asset['expiry']['state'], Tone> = { NONE: 'muted', OK: 'green', EXPIRING: 'yellow', EXPIRED: 'red' };
const BILLING: Billing[] = ['FREE', 'ONE_TIME', 'MONTHLY', 'YEARLY'];

export default function AssetsView({ config, pid, selected, onSelect, onOpenIssue }: {
  config: ProjectConfig; pid: number; selected: number | null; onSelect: (n: number | null) => void; onOpenIssue: (n: number) => void;
}) {
  const { t, fmtNumber } = useWT();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: c7cKeys.assets(pid), queryFn: () => assetApi.list(pid) });
  const [cat, setCat] = useState<AssetCategory | ''>('');
  const [onlyExp, setOnlyExp] = useState(false);
  const [editing, setEditing] = useState<Asset | 'new' | null>(null);
  const [deleting, setDeleting] = useState<Asset | null>(null);
  const del = useMutation({
    mutationFn: (n: number) => assetApi.remove(pid, n),
    onSuccess: () => { setDeleting(null); onSelect(null); qc.invalidateQueries({ queryKey: c7cKeys.assets(pid) }); toast.success(t('c7c.aDeleted')); },
    onError: (e) => toast.error(workError(e)),
  });
  const items = useMemo(() => (q.data?.items ?? []).filter((a) => (!cat || a.category === cat) && (!onlyExp || a.expiry.state === 'EXPIRING' || a.expiry.state === 'EXPIRED')), [q.data, cat, onlyExp]);
  if (q.isLoading) return <PageLoading />;
  if (q.error || !q.data) return <EmptyState title={t('c7c.loadFailed')} body={workError(q.error)} />;
  const d = q.data;
  const s = d.summary;
  const cur = d.items.find((a) => a.number === selected) ?? null;
  const exportFile = (kind: 'licenses' | 'credits', format: 'md' | 'txt' | 'csv') => assetApi.export(pid, kind, format).catch((e) => toast.error(workError(e)));
  const costText = Object.entries(s.annualCost).map(([c, v]) => `${fmtNumber(Math.round(v))} ${c}`).join(' · ') || '—';

  return (
    <div className="flex flex-col gap-4" data-testid="c7c-assets">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiTile label={t('c7c.kActive')} value={s.active} />
        <KpiTile label={t('c7c.kExpiring')} value={s.expiring} tone={s.expiring ? 'yellow' : undefined} />
        <KpiTile label={t('c7c.kExpired')} value={s.expired} tone={s.expired ? 'red' : undefined} />
        <KpiTile label={t('c7c.kAttribution')} value={s.needsAttribution} />
        <KpiTile label={t('c7c.kUnknown')} value={s.unknownLicense} tone={s.unknownLicense ? 'orange' : undefined} />
        <KpiTile label={t('c7c.kCost')} value={costText} size="sm" title={t('c7c.kCostHint')} />
      </div>

      <Card
        title={t('c7c.assetsTitle')}
        desc={t('c7c.assetsDesc')}
        actions={(
          <>
            <button type="button" className="w-btn w-btn-sm" onClick={() => exportFile('licenses', 'md')}><Download size={13} /> THIRD_PARTY_LICENSES.md</button>
            <button type="button" className="w-btn w-btn-sm" onClick={() => exportFile('credits', 'txt')}><Download size={13} /> CREDITS.txt</button>
            <button type="button" className="w-btn w-btn-sm" onClick={() => exportFile('licenses', 'csv')}><Download size={13} /> CSV</button>
            {d.canEdit && <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => setEditing('new')} data-testid="c7c-asset-new"><Plus size={13} /> {t('c7c.aNew')}</button>}
          </>
        )}
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Select aria-label={t('c7c.aCategory')} value={cat} onChange={(e) => setCat(e.target.value as AssetCategory | '')} className="!h-[30px] w-auto">
            <option value="">{t('c7c.aAllCategories')}</option>
            {ASSET_CATEGORIES.map((c) => <option key={c} value={c}>{t(`c7c.cat_${c}` as WKey)}</option>)}
          </Select>
          <label className="flex items-center gap-1.5 text-[12.5px] text-[var(--w-text-2)]">
            <input type="checkbox" checked={onlyExp} onChange={(e) => setOnlyExp(e.target.checked)} /> {t('c7c.aOnlyExpiring')}
          </label>
          <span className="ml-auto text-[12px] text-[var(--w-text-3)]">{t('c7c.aCount', { count: items.length })}</span>
        </div>
        {!d.items.length ? (
          <EmptyState icon={<Package size={20} />} title={t('c7c.aEmpty')} body={t('c7c.aEmptyBody')} />
        ) : (
          <Tbl minWidth={900} label={t('c7c.assetsTitle')}>
            <thead>
              <tr>
                <Th w={80}>{t('q6.colKey')}</Th><Th>{t('common.name')}</Th><Th w={120}>{t('c7c.aCategory')}</Th><Th w={190}>{t('c7c.aLicense')}</Th>
                <Th w={140}>{t('c7c.aOwner')}</Th><Th w={130}>{t('c7c.aExpires')}</Th><Th w={120}>{t('c7c.aCost')}</Th><Th w={90}>{t('c7c.aCredit')}</Th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id} className={cn('cursor-pointer hover:bg-[var(--w-hover)]', selected === a.number && 'bg-[var(--w-accent-soft)]', a.status === 'RETIRED' && 'opacity-60')} onClick={() => onSelect(a.number)}>
                  <Td className="font-mono text-[12px] text-[var(--w-text-2)]">{a.key}</Td>
                  <Td>
                    <button type="button" className="text-left font-medium hover:underline" onClick={(e) => { e.stopPropagation(); onSelect(a.number); }}>{a.name}</button>
                    {a.version && <span className="ml-1 text-[12px] text-[var(--w-text-3)]">{a.version}</span>}
                    {a.status !== 'ACTIVE' && <Badge className="ml-1.5" tone="muted">{t(`c7c.st_${a.status}` as WKey)}</Badge>}
                  </Td>
                  <Td>{t(`c7c.cat_${a.category}` as WKey)}</Td>
                  <Td><Badge tone={a.licenseType === 'UNKNOWN' ? 'orange' : 'blue'}>{a.licenseLabel}</Badge></Td>
                  <Td>{a.owner ? userName(a.owner) : <span className="text-[var(--w-text-3)]">—</span>}</Td>
                  <Td>{a.expiresAt ? <Badge tone={EXP_TONE[a.expiry.state]}>{a.expiresAt}{a.expiry.daysLeft !== null && a.expiry.state !== 'OK' ? ` · ${a.expiry.daysLeft < 0 ? t('c7c.aExpiredAgo', { count: -a.expiry.daysLeft }) : t('c7c.aDaysLeft', { count: a.expiry.daysLeft })}` : ''}</Badge> : '—'}</Td>
                  <Td className="tabular-nums">{a.cost !== null ? `${fmtNumber(a.cost)} ${a.currency}${a.billing === 'MONTHLY' ? t('c7c.perMonth') : a.billing === 'YEARLY' ? t('c7c.perYear') : ''}` : '—'}</Td>
                  <Td>{a.attributionRequired ? <Badge tone="accent">{t('c7c.aRequired')}</Badge> : '—'}</Td>
                </tr>
              ))}
            </tbody>
          </Tbl>
        )}
      </Card>

      {cur && <AssetDetail key={cur.id} a={cur} pid={pid} projectKey={config.key} canEdit={d.canEdit} onEdit={() => setEditing(cur)} onDelete={() => setDeleting(cur)} onOpenIssue={onOpenIssue} onClose={() => onSelect(null)} />}

      {editing && <AssetDialog pid={pid} config={config} initial={editing === 'new' ? null : editing} licenses={d.options.licenses} onClose={() => setEditing(null)} onSaved={(a) => { setEditing(null); onSelect(a.number); }} />}
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} title={t('c7c.aDeleteQ')} body={t('c7c.aDeleteBody', { n: deleting?.name ?? '' })} confirmLabel={t('common.delete')} pending={del.isPending} onConfirm={() => deleting && del.mutate(deleting.number)} />
    </div>
  );
}

function AssetDetail({ a, pid, projectKey, canEdit, onEdit, onDelete, onOpenIssue, onClose }: {
  a: Asset; pid: number; projectKey: string; canEdit: boolean; onEdit: () => void; onDelete: () => void; onOpenIssue: (n: number) => void; onClose: () => void;
}) {
  const { t } = useWT();
  const qc = useQueryClient();
  const [links, setLinks] = useState(a.links.filter((l) => l.kind === 'ISSUE').map((l) => l.key).join(', '));
  const save = useMutation({
    mutationFn: () => assetApi.setLinks(pid, a.number, { issues: links.split(/[,\s]+/).map((x) => x.trim()).filter(Boolean), pages: a.links.filter((l) => l.kind === 'PAGE').map((l) => l.number) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: c7cKeys.assets(pid) }); toast.success(t('c7c.aLinksSaved')); },
    onError: (e) => toast.error(workError(e)),
  });
  return (
    <Card
      title={<span>{a.key} · {a.name}</span>}
      desc={a.licenseLabel}
      actions={(
        <>
          {canEdit && <button type="button" className="w-btn w-btn-sm" onClick={onEdit}>{t('common.edit')}</button>}
          {canEdit && <button type="button" className="w-btn w-btn-sm" onClick={onDelete} aria-label={t('common.delete')}><Trash2 size={13} /></button>}
          <button type="button" className="w-btn w-btn-sm" onClick={onClose}>{t('common.close')}</button>
        </>
      )}
    >
      <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-[13px] sm:grid-cols-2">
        <div><dt className="text-[12px] text-[var(--w-text-3)]">{t('c7c.aSource')}</dt><dd>{a.source ?? '—'} {a.sourceUrl && <a className="inline-flex items-center gap-0.5 text-[var(--w-accent-text)] hover:underline" href={a.sourceUrl} target="_blank" rel="noreferrer noopener"><ExternalLink size={12} /> {t('c7c.aOpen')}</a>}</dd></div>
        <div><dt className="text-[12px] text-[var(--w-text-3)]">{t('c7c.aLicense')}</dt><dd>{a.licenseLabel} {a.licenseUrl && <a className="text-[var(--w-accent-text)] hover:underline" href={a.licenseUrl} target="_blank" rel="noreferrer noopener">{t('c7c.aLicenseText')}</a>}</dd></div>
        <div><dt className="text-[12px] text-[var(--w-text-3)]">{t('c7c.aSeats')}</dt><dd>{a.seats ?? '—'}</dd></div>
        <div><dt className="text-[12px] text-[var(--w-text-3)]">{t('c7c.aRemind')}</dt><dd>{t('c7c.aRemindDays', { count: a.remindDays })}</dd></div>
        {a.attribution && <div className="sm:col-span-2"><dt className="text-[12px] text-[var(--w-text-3)]">{t('c7c.aAttribution')}</dt><dd className="whitespace-pre-wrap">{a.attribution}</dd></div>}
        {a.notes && <div className="sm:col-span-2"><dt className="text-[12px] text-[var(--w-text-3)]">{t('c7c.aNotes')}</dt><dd className="whitespace-pre-wrap">{a.notes}</dd></div>}
      </dl>
      <div className="mt-4">
        <div className="mb-1 text-[12px] font-medium text-[var(--w-text-2)]">{t('c7c.aUsedIn')}</div>
        <div className="mb-2 flex flex-wrap gap-1.5">
          {a.links.length ? a.links.map((l) => (
            l.kind === 'ISSUE'
              ? <button key={`i${l.number}`} type="button" className="w-btn w-btn-sm" onClick={() => onOpenIssue(l.number)} title={l.title}><span className="font-mono">{l.key}</span> {l.title.slice(0, 40)}</button>
              : <Badge key={`p${l.number}`} tone="muted">{l.key} {l.title.slice(0, 40)}</Badge>
          )) : <span className="text-[12.5px] text-[var(--w-text-3)]">{t('c7c.aNoLinks')}</span>}
        </div>
        {canEdit && (
          <form className="flex flex-wrap items-center gap-2" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
            <label className="sr-only" htmlFor="c7c-links">{t('c7c.aLinkIssues')}</label>
            <input id="c7c-links" className="w-input min-w-[220px] flex-1 font-mono" placeholder={`${projectKey}-12, ${projectKey}-15`} value={links} onChange={(e) => setLinks(e.target.value)} />
            <button type="submit" className="w-btn w-btn-sm" disabled={save.isPending}>{save.isPending && <Spinner size={12} />} {t('c7c.aSaveLinks')}</button>
          </form>
        )}
      </div>
    </Card>
  );
}

function AssetDialog({ pid, config, initial, licenses, onClose, onSaved }: {
  pid: number; config: ProjectConfig; initial: Asset | null; licenses: Array<{ key: LicenseType; label: string; attribution: boolean }>; onClose: () => void; onSaved: (a: Asset) => void;
}) {
  const { t } = useWT();
  const qc = useQueryClient();
  const [f, setF] = useState<AssetInput & { name: string }>(() => initial ? {
    name: initial.name, category: initial.category, licenseType: initial.licenseType, licenseName: initial.licenseName, licenseUrl: initial.licenseUrl,
    source: initial.source, sourceUrl: initial.sourceUrl, version: initial.version, ownerId: initial.ownerId, status: initial.status, expiresAt: initial.expiresAt,
    remindDays: initial.remindDays, cost: initial.cost, currency: initial.currency, billing: initial.billing, seats: initial.seats,
    attributionRequired: initial.attributionRequired, attribution: initial.attribution, notes: initial.notes,
  } : { name: '', category: 'LIBRARY', licenseType: 'MIT', currency: 'VND', billing: 'FREE', remindDays: 30, attributionRequired: true });
  const set = (p: Partial<AssetInput & { name: string }>) => setF((x) => ({ ...x, ...p }));
  const save = useMutation({
    mutationFn: () => {
      const body = { ...f, name: f.name.trim(), expiresAt: f.expiresAt || null, licenseUrl: f.licenseUrl || null, sourceUrl: f.sourceUrl || null };
      return initial ? assetApi.update(pid, initial.number, body) : assetApi.create(pid, body);
    },
    onSuccess: (a) => { qc.invalidateQueries({ queryKey: c7cKeys.assets(pid) }); toast.success(initial ? t('c7c.aSaved') : t('c7c.aCreated', { k: a.key })); onSaved(a); },
    onError: (e) => toast.error(workError(e)),
  });
  const team = config.members.filter((m) => m.role !== 'CLIENT');
  return (
    <Dialog
      open
      onClose={onClose}
      width={720}
      title={initial ? t('c7c.aEditTitle', { k: initial.key }) : t('c7c.aNew')}
      footer={(
        <>
          <button type="button" className="w-btn" onClick={onClose}>{t('common.cancel')}</button>
          <button type="button" className="w-btn w-btn-primary" disabled={!f.name.trim() || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={12} />} {t('common.save')}</button>
        </>
      )}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Labeled label={t('common.name')}><input className="w-input" maxLength={160} value={f.name} onChange={(e) => set({ name: e.target.value })} autoFocus /></Labeled>
        <Labeled label={t('c7c.aVersion')}><input className="w-input" maxLength={60} value={f.version ?? ''} onChange={(e) => set({ version: e.target.value || null })} /></Labeled>
        <Labeled label={t('c7c.aCategory')}>
          <Select value={f.category} onChange={(e) => set({ category: e.target.value as AssetCategory })}>{ASSET_CATEGORIES.map((c) => <option key={c} value={c}>{t(`c7c.cat_${c}` as WKey)}</option>)}</Select>
        </Labeled>
        <Labeled label={t('c7c.aLicense')}>
          <Select value={f.licenseType} onChange={(e) => { const k = e.target.value as LicenseType; set({ licenseType: k, ...(initial ? {} : { attributionRequired: licenses.find((l) => l.key === k)?.attribution ?? false }) }); }}>
            {LICENSE_TYPES.map((k) => <option key={k} value={k}>{licenses.find((l) => l.key === k)?.label ?? k}</option>)}
          </Select>
        </Labeled>
        {f.licenseType === 'CUSTOM' && <Labeled label={t('c7c.aLicenseName')}><input className="w-input" maxLength={120} value={f.licenseName ?? ''} onChange={(e) => set({ licenseName: e.target.value || null })} /></Labeled>}
        <Labeled label={t('c7c.aLicenseUrl')}><input className="w-input" type="url" maxLength={500} placeholder="https://" value={f.licenseUrl ?? ''} onChange={(e) => set({ licenseUrl: e.target.value })} /></Labeled>
        <Labeled label={t('c7c.aSource')} hint={t('c7c.aSourceHint')}><input className="w-input" maxLength={300} value={f.source ?? ''} onChange={(e) => set({ source: e.target.value || null })} /></Labeled>
        <Labeled label={t('c7c.aSourceUrl')}><input className="w-input" type="url" maxLength={500} placeholder="https://" value={f.sourceUrl ?? ''} onChange={(e) => set({ sourceUrl: e.target.value })} /></Labeled>
        <Labeled label={t('c7c.aOwner')}>
          <Select value={f.ownerId ?? ''} onChange={(e) => set({ ownerId: e.target.value ? Number(e.target.value) : null })}>
            <option value="">{t('common.unassigned')}</option>
            {team.map((m) => <option key={m.id} value={m.id}>{userName(m)}</option>)}
          </Select>
        </Labeled>
        <Labeled label={t('c7c.aStatus')}>
          <Select value={f.status ?? 'ACTIVE'} onChange={(e) => set({ status: e.target.value as Asset['status'] })}>{(['ACTIVE', 'EXPIRED', 'RETIRED'] as const).map((s) => <option key={s} value={s}>{t(`c7c.st_${s}` as WKey)}</option>)}</Select>
        </Labeled>
        <Labeled label={t('c7c.aExpires')}><input className="w-input" type="date" value={f.expiresAt ?? ''} onChange={(e) => set({ expiresAt: e.target.value || null })} /></Labeled>
        <Labeled label={t('c7c.aRemind')} hint={t('c7c.aRemindHint')}><NumberInput label={t('c7c.aRemind')} min={0} max={365} value={f.remindDays} onChange={(v) => set({ remindDays: v ?? 30 })} /></Labeled>
        <div className="grid grid-cols-[1fr_90px] gap-2">
          <Labeled label={t('c7c.aCost')}><NumberInput label={t('c7c.aCost')} min={0} value={f.cost} onChange={(v) => set({ cost: v })} /></Labeled>
          <Labeled label={t('c7c.aCurrency')}><input className="w-input uppercase" maxLength={3} value={f.currency ?? 'VND'} onChange={(e) => set({ currency: e.target.value.toUpperCase() })} /></Labeled>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Labeled label={t('c7c.aBilling')}><Select value={f.billing} onChange={(e) => set({ billing: e.target.value as Billing })}>{BILLING.map((b) => <option key={b} value={b}>{t(`c7c.bill_${b}` as WKey)}</option>)}</Select></Labeled>
          <Labeled label={t('c7c.aSeats')}><NumberInput label={t('c7c.aSeats')} min={0} value={f.seats} onChange={(v) => set({ seats: v })} /></Labeled>
        </div>
        <label className="flex items-center gap-2 text-[13px] sm:col-span-2">
          <input type="checkbox" checked={!!f.attributionRequired} onChange={(e) => set({ attributionRequired: e.target.checked })} /> {t('c7c.aRequiresCredit')}
        </label>
        <Labeled className="sm:col-span-2" label={t('c7c.aAttribution')} hint={t('c7c.aAttributionHint')}>
          <textarea className="w-input !h-auto py-2" rows={2} maxLength={4000} value={f.attribution ?? ''} onChange={(e) => set({ attribution: e.target.value || null })} />
        </Labeled>
        <Labeled className="sm:col-span-2" label={t('c7c.aNotes')} hint={t('c7c.aNoSecrets')}>
          <textarea className="w-input !h-auto py-2" rows={3} maxLength={8000} value={f.notes ?? ''} onChange={(e) => set({ notes: e.target.value || null })} />
        </Labeled>
      </div>
    </Dialog>
  );
}
