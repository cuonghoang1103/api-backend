'use client';

/**
 * CTW đợt 4b (R23) — Bảng kiểm "sáu liên kết" người chấm SWR302 dò (`content/academy/swr302/assignment.mjs`): mỗi liên
 * kết một thẻ ĐẠT / ĐỨT kèm từng chỗ đứt; số đếm đã gõ trong Requirements Estimation Tool để so với tài liệu (liên kết #6);
 * danh từ không phải dữ liệu thì bỏ qua (liên kết #4). Cùng bảng này nằm cuối tệp RTM .xlsx (sheet "Six links").
 */

import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckCircle2, FileSpreadsheet, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { workError } from '@/lib/work-api';
import { COUNT_KEYS, workSwrApi, workSwrKeys, type CountKey, type LinkGap, type LinkResult } from '@/lib/work-swr-api';
import { wt, type WKey } from '@/components/work/i18n';
import { EmptyState, PageLoading, Spinner } from '../ui';
import { Chip, downloadXlsx, TabIntro, useSwrRefresh } from './shared';
import { LINK_TITLE } from './OverviewTab';

const COUNT_LABEL: Record<CountKey, WKey> = { useCases: 'swr.cntUseCases', screens: 'swr.cntScreens', reports: 'swr.cntReports', interfacingSystems: 'swr.cntInterfaces' };
const FIX_TAB: Record<string, string> = { FE_UC: 'features', UC_BR: 'requirements', FR_TRACE: 'requirements', NOUN_DD: 'dictionary', PRIORITY_REF: 'priority', COUNTS: 'six-links' };
const GAP_TEXT: Record<string, WKey> = {
  FE_NO_UC: 'swr.gFeNoUc', BR_UNKNOWN: 'swr.gBrUnknown', BR_UNLISTED: 'swr.gBrUnlisted', UC_NO_BR: 'swr.gUcNoBr', BR_UNUSED: 'swr.gBrUnused',
  FR_UNTRACED: 'swr.gFrUntraced', NOUN_MISSING: 'swr.gNounMissing', ROW_GONE: 'swr.gRowGone', ROW_BAD: 'swr.gRowBad', COUNT_MISMATCH: 'swr.gCountMismatch',
};
/** Chỗ đứt dịch theo mã (máy chủ gửi kèm câu tiếng Anh — dùng khi mã lạ). */
export function gapText(g: LinkGap): string {
  const k = g.code ? GAP_TEXT[g.code] : undefined;
  return k ? wt(k, g.params) : g.detail;
}
const FIX_LABEL: Record<string, WKey> = { FE_UC: 'swr.fixFeatures', UC_BR: 'swr.fixRules', FR_TRACE: 'swr.fixReqs', NOUN_DD: 'swr.fixDd', PRIORITY_REF: 'swr.fixPriority', COUNTS: 'swr.fixCounts' };

function LinkCard({ l, canEdit, onIgnore, onTab, onUcRules }: { l: LinkResult; canEdit: boolean; onIgnore: (n: string) => void; onTab: (t: string) => void; onUcRules: () => void }) {
  const errors = l.gaps.filter((g) => g.severity === 'error');
  const warnings = l.gaps.filter((g) => g.severity === 'warning');
  return (
    <li className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-3">
      <div className="flex flex-wrap items-start gap-2">
        {l.ok ? <CheckCircle2 size={18} className="mt-[1px] shrink-0 text-[var(--w-green-text)]" aria-hidden="true" /> : <XCircle size={18} className="mt-[1px] shrink-0 text-[var(--w-red-text)]" aria-hidden="true" />}
        <div className="min-w-0 flex-1">
          <h3 className="text-[13.5px] font-semibold">{l.n}. {wt(LINK_TITLE[l.key])}</h3>
          <p className="text-[12px] text-[var(--w-text-2)]">{wt('swr.checkedN', { count: l.checked })}{l.note ? ` · ${l.key === 'NOUN_DD' ? wt('swr.nounNote') : l.key === 'COUNTS' ? wt('swr.countsNote') : l.key === 'FE_UC' ? wt('swr.noFeaturesNote') : l.key === 'PRIORITY_REF' ? wt('swr.emptyPriorityNote') : wt('swr.noFrNote')}` : ''}</p>
        </div>
        <Chip tone={l.ok ? 'green' : 'red'}>{l.ok ? wt('swr.ok') : wt('swr.broken')}</Chip>
        {!l.ok && l.key !== 'COUNTS' && <button type="button" className="w-btn w-btn-sm" onClick={() => (l.key === 'UC_BR' ? onUcRules() : onTab(FIX_TAB[l.key]))}>{wt(FIX_LABEL[l.key])}</button>}
      </div>
      {(errors.length > 0 || warnings.length > 0) && (
        <ul className="mt-2 flex max-h-[260px] flex-col gap-1 overflow-auto border-t border-[var(--w-border)] pt-2 text-[12.5px]">
          {[...errors, ...warnings].map((g, i) => (
            <li key={`${g.ref}-${i}`} className="flex flex-wrap items-center gap-1.5">
              <span className={`font-mono ${g.severity === 'error' ? 'text-[var(--w-red-text)]' : 'text-[var(--w-orange-text)]'}`}>{g.code === 'COUNT_MISMATCH' && g.params?.key ? wt(COUNT_LABEL[g.params.key as CountKey]) : g.ref.startsWith('row ') ? wt('swr.rowN', { n: g.ref.slice(4) }) : g.ref}</span>
              <span className="text-[var(--w-text-2)]">{g.severity === 'warning' ? `(${wt('swr.warning')}) ` : ''}{gapText(g)}</span>
              {l.key === 'NOUN_DD' && canEdit && <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => onIgnore(g.ref)}>{wt('swr.notData')}</button>}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function SixLinksTab({ pid, onTab, onUcRules }: { pid: number; onTab: (t: string) => void; onUcRules: () => void }) {
  const refresh = useSwrRefresh(pid);
  const q = useQuery({ queryKey: workSwrKeys.sixLinks(pid), queryFn: () => workSwrApi.sixLinks(pid) });
  const [counts, setCounts] = useState<Record<CountKey, string>>({ useCases: '', screens: '', reports: '', interfacingSystems: '' });
  useEffect(() => {
    if (!q.data) return;
    const d = q.data.declared ?? {};
    setCounts({ useCases: d.useCases?.toString() ?? '', screens: d.screens?.toString() ?? '', reports: d.reports?.toString() ?? '', interfacingSystems: d.interfacingSystems?.toString() ?? '' });
  }, [q.data]);
  const saveCounts = useMutation({
    mutationFn: () => workSwrApi.settings(pid, { declaredCounts: Object.fromEntries(COUNT_KEYS.map((k) => [k, counts[k].trim() === '' ? null : Number(counts[k])])) as Record<CountKey, number | null> }),
    onSuccess: () => { refresh(); toast.success(wt('swr.countsSaved')); },
    onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))),
  });
  const ignore = useMutation({ mutationFn: (noun: string) => workSwrApi.settings(pid, { ignoreNoun: noun }), onSuccess: () => refresh(), onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))) });

  if (q.isLoading) return <PageLoading rows={6} />;
  if (!q.data) return <EmptyState title={wt('swr.loadFailed')} body={q.error ? workError(q.error) : undefined} />;
  const data = q.data;
  return (
    <div className="flex flex-col gap-3">
      <TabIntro text={wt('swr.sixIntro')}>
        <span className="text-[13px] font-semibold tabular-nums" style={{ color: data.ok ? 'var(--w-green-text)' : 'var(--w-orange-text)' }}>{wt('swr.passedOf', { n: data.passed })}</span>
        <button type="button" className="w-btn w-btn-sm" onClick={() => downloadXlsx(pid, 'six-links')}><FileSpreadsheet size={13} /> .xlsx</button>
      </TabIntro>
      <ol className="flex flex-col gap-2">
        {data.links.map((l) => <LinkCard key={l.key} l={l} canEdit={data.canEdit} onIgnore={(n) => ignore.mutate(n)} onTab={onTab} onUcRules={onUcRules} />)}
      </ol>
      <section aria-labelledby="six-counts-h" className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-3">
        <h2 id="six-counts-h" className="text-[13.5px] font-semibold">{wt('swr.countsTitle')}</h2>
        <p className="mb-2 text-[12px] text-[var(--w-text-2)]">{wt('swr.countsHint')}</p>
        <div className="flex flex-wrap items-end gap-3">
          {COUNT_KEYS.map((k) => (
            <label key={k} className="flex flex-col gap-1 text-[12px] text-[var(--w-text-2)]">
              {wt(COUNT_LABEL[k])}
              <span className="flex items-center gap-1.5">
                <input type="number" min={0} className="w-input h-8 w-20 tabular-nums" value={counts[k]} disabled={!data.canConfigure} onChange={(e) => setCounts({ ...counts, [k]: e.target.value })} />
                <span className="text-[12px]">{wt('swr.actualN', { n: data.actual[k] ?? '—' })}</span>
              </span>
            </label>
          ))}
          {data.canConfigure && <button type="button" className="w-btn w-btn-sm w-btn-primary" disabled={saveCounts.isPending} onClick={() => saveCounts.mutate()}>{saveCounts.isPending && <Spinner size={12} />} {wt('common.save')}</button>}
        </div>
      </section>
    </div>
  );
}
