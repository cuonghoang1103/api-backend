'use client';

/**
 * CT Work đợt 6 — T9 KIỂM THỬ THEO RỦI RO: ma trận 5×5 khả năng × tác động, danh sách rủi ro sản phẩm (mức ⇒ ưu tiên +
 * độ sâu kiểm thử), liên kết yêu cầu bị đe doạ + test phủ, cảnh báo rủi ro cao chưa có test. Rủi ro nằm trong sổ RAID.
 */

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { q6Api, q6Keys, type RiskLevel, type RiskRow } from '@/lib/work-q6-api';
import { Dialog, EmptyState, PageLoading } from '../ui';
import { useWT, type WKey } from '../i18n';
import { Badge, Card, Labeled, Segmented, Tbl, Td, Th, splitList, type Tone } from './qui';

export const LEVEL_TONE: Record<RiskLevel, Tone> = { LOW: 'green', MEDIUM: 'yellow', HIGH: 'orange', CRITICAL: 'red' };
const cellLevel = (l: number, i: number): RiskLevel => { const s = l * i; return s >= 20 ? 'CRITICAL' : s >= 10 ? 'HIGH' : s >= 5 ? 'MEDIUM' : 'LOW'; };
const CELL_BG: Record<RiskLevel, string> = {
  LOW: 'color-mix(in srgb, var(--w-green) 16%, transparent)', MEDIUM: 'color-mix(in srgb, var(--w-yellow) 20%, transparent)',
  HIGH: 'color-mix(in srgb, var(--w-orange) 22%, transparent)', CRITICAL: 'color-mix(in srgb, var(--w-red) 24%, transparent)',
};

export default function RisksTab({ config, pid, onOpenIssue }: { config: ProjectConfig; pid: number; onOpenIssue: (n: number) => void }) {
  const { t } = useWT();
  const q = useQuery({ queryKey: [...q6Keys.tests(pid), 'risks'], queryFn: () => q6Api.risks(pid) });
  const [edit, setEdit] = useState<RiskRow | 'new' | null>(null);
  const canEdit = config.permissions.editIssues;
  if (q.isLoading) return <PageLoading />;
  if (q.error || !q.data) return <EmptyState title={t('q6.loadFailed')} body={workError(q.error)} />;
  const d = q.data;
  return (
    <div className="flex flex-col gap-3 p-4" data-testid="q6-risks-tab">
      <Card title={t('q6.riskTitle')} desc={t('q6.riskDesc')} actions={canEdit && <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setEdit('new')} data-testid="q6-new-risk"><Plus size={13} /> {t('q6.newRisk')}</button>}>
        {d.summary.highUncovered > 0 && <p className="mb-2 text-[12.5px] font-medium text-[var(--w-red-text)]" role="status">{t('q6.highUncovered', { n: d.summary.highUncovered })}</p>}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <figure aria-label={t('q6.heatmap')}>
            <table className="border-separate border-spacing-1 text-[12px]">
              <caption className="mb-1 text-left text-[12px] font-medium text-[var(--w-text-2)]">{t('q6.heatmap')}</caption>
              <tbody>
                {d.grid.map((row, ri) => (
                  <tr key={ri}>
                    <th scope="row" className="pr-1 text-right font-normal text-[var(--w-text-3)]">{5 - ri}</th>
                    {row.map((keys, ci) => {
                      const lv = cellLevel(5 - ri, ci + 1);
                      return (
                        <td key={ci} title={`${t('q6.likelihood')} ${5 - ri} × ${t('q6.impact')} ${ci + 1}: ${keys.join(', ') || '—'}`}
                          className="h-11 w-11 rounded-[4px] text-center align-middle font-semibold tabular-nums" style={{ background: CELL_BG[lv] }}>
                          {keys.length || ''}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr><td />{[1, 2, 3, 4, 5].map((n) => <td key={n} className="text-center text-[var(--w-text-3)]">{n}</td>)}</tr>
              </tbody>
            </table>
            <figcaption className="mt-1 text-[11.5px] text-[var(--w-text-3)]">↑ {t('q6.likelihood')} · → {t('q6.impact')}</figcaption>
          </figure>
          {!d.rows.length ? <EmptyState icon={<ShieldAlert size={20} />} title={t('q6.noRisks')} body={t('q6.riskDesc')} /> : (
            <Tbl minWidth={900} label={t('q6.riskTitle')}>
              <thead><tr><Th w={80}>{t('q6.colKey')}</Th><Th>{t('q6.colTitle')}</Th><Th w={80} className="text-right">{t('q6.score')}</Th><Th w={110}>{t('q6.riskLevel')}</Th><Th w={200}>{t('q6.priority')}</Th><Th w={190}>{t('q6.linkedIssues')}</Th><Th w={40} /></tr></thead>
              <tbody>
                {d.rows.map((r) => (
                  <tr key={r.number} data-testid="q6-risk-row">
                    <Td className="font-mono text-[12px]">{r.key}</Td>
                    <Td><div className="font-medium">{r.title}</div>{r.riskKind && <div className="text-[11.5px] text-[var(--w-text-3)]">{t(`q6.rk${r.riskKind}` as WKey)}{r.mitigation ? ` · ${r.mitigation}` : ''}</div>}</Td>
                    <Td className="text-right tabular-nums">{r.score ?? '—'}<div className="text-[11px] text-[var(--w-text-3)]">{r.likelihood ?? '?'}×{r.impact ?? '?'}</div></Td>
                    <Td>{r.level ? <Badge tone={LEVEL_TONE[r.level]}>{t(`q6.lv${r.level}` as WKey)}</Badge> : '—'}</Td>
                    <Td className="text-[12px]">{r.policy ? <><span className="font-semibold">{r.policy.priority}</span> · {r.policy.depth}</> : '—'}</Td>
                    <Td className="text-[12px]">
                      <div className="flex flex-wrap gap-1">
                        {r.requirements.map((x) => <button key={x.key} type="button" className="font-mono hover:underline" onClick={() => onOpenIssue(x.number)}>{x.key}</button>)}
                      </div>
                      <div className="mt-0.5 flex flex-wrap gap-1">
                        {r.tests.length ? r.tests.map((x) => <button key={x.key} type="button" className={cn('font-mono hover:underline', x.lastStatus === 'PASS' ? 'text-[var(--w-green-text)]' : x.lastStatus === 'FAIL' ? 'text-[var(--w-red-text)]' : '')} onClick={() => onOpenIssue(x.number)}>{x.key}</button>)
                          : <Badge tone={r.level === 'HIGH' || r.level === 'CRITICAL' ? 'red' : 'muted'}>{t('q6.uncovered')}</Badge>}
                      </div>
                    </Td>
                    <Td>{canEdit && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('q6.editRisk')} onClick={() => setEdit(r)}><Pencil size={13} /></button>}</Td>
                  </tr>
                ))}
              </tbody>
            </Tbl>
          )}
        </div>
      </Card>
      {edit && <RiskDialog pid={pid} row={edit === 'new' ? null : edit} onClose={() => setEdit(null)} />}
    </div>
  );
}

function RiskDialog({ pid, row, onClose }: { pid: number; row: RiskRow | null; onClose: () => void }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const [title, setTitle] = useState(row?.title ?? '');
  const [l, setL] = useState<number>(row?.likelihood ?? 3);
  const [i, setI] = useState<number>(row?.impact ?? 3);
  const [kind, setKind] = useState<'PRODUCT' | 'PROJECT'>(row?.riskKind ?? 'PRODUCT');
  const [mit, setMit] = useState(row?.mitigation ?? '');
  const [links, setLinks] = useState([...(row?.requirements ?? []), ...(row?.tests ?? [])].map((x) => x.number).join(', '));
  const save = useMutation({
    mutationFn: () => q6Api.saveRisk(pid, { number: row?.number ?? null, title: title.trim(), likelihood: l, impact: i, riskKind: kind, mitigation: mit.trim() || null, issueNumbers: splitList(links).map((x) => Number(x.replace(/^[A-Z]+-/i, ''))).filter((n) => Number.isInteger(n) && n > 0) }),
    onSuccess: (d) => { toast.success(t('q6.riskSaved')); qc.setQueryData([...q6Keys.tests(pid), 'risks'], d); onClose(); },
    onError: (e) => toast.error(workError(e)),
  });
  const scale = [1, 2, 3, 4, 5].map((n) => ({ value: String(n) as '1', label: String(n) }));
  const lv = cellLevel(l, i);
  return (
    <Dialog open onClose={onClose} title={row ? `${t('q6.editRisk')} ${row.key}` : t('q6.newRisk')} width={560}
      footer={<><button type="button" className="w-btn w-btn-sm" onClick={onClose}>{t('common.cancel')}</button><button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={!title.trim() || save.isPending} onClick={() => save.mutate()} data-testid="q6-save-risk">{t('q6.save')}</button></>}>
      <div className="flex flex-col gap-3">
        <Labeled label={t('q6.colTitle')}><input className="w-input" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus data-testid="q6-risk-title" /></Labeled>
        <div className="flex flex-wrap items-end gap-4">
          <Labeled label={t('q6.likelihood')}><Segmented label={t('q6.likelihood')} value={String(l) as '1'} onChange={(v) => setL(Number(v))} options={scale} /></Labeled>
          <Labeled label={t('q6.impact')}><Segmented label={t('q6.impact')} value={String(i) as '1'} onChange={(v) => setI(Number(v))} options={scale} /></Labeled>
          <div className="pb-1 text-[13px]">{t('q6.score')} <span className="font-semibold tabular-nums">{l * i}</span> · <Badge tone={LEVEL_TONE[lv]}>{t(`q6.lv${lv}` as WKey)}</Badge></div>
        </div>
        <Labeled label={t('q6.riskKind')}><Segmented label={t('q6.riskKind')} value={kind} onChange={setKind} options={[{ value: 'PRODUCT', label: t('q6.rkPRODUCT') }, { value: 'PROJECT', label: t('q6.rkPROJECT') }]} /></Labeled>
        <Labeled label={t('q6.mitigation')}><textarea className="w-input min-h-[56px]" value={mit} onChange={(e) => setMit(e.target.value)} /></Labeled>
        <Labeled label={t('q6.linkedIssues')}><input className="w-input" value={links} onChange={(e) => setLinks(e.target.value)} placeholder={t('q6.linkedIssuesPh')} /></Labeled>
      </div>
    </Dialog>
  );
}
