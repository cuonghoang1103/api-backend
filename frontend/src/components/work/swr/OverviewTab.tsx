'use client';

/**
 * CTW đợt 4b — tab "Tổng quan" của trang Wiegers: năm tài liệu Wiegers (điền từ dữ liệu dự án / xuất Word·PDF), số đếm của
 * hồ sơ và tóm tắt sáu liên kết. Xuất: lấy nội dung đã điền ⇒ vẽ sẵn PNG Mermaid (ERD §4.1) ở trình duyệt ⇒ gửi kèm.
 */

import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckCircle2, FileDown, FileText, Wand2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { workError } from '@/lib/work-api';
import { mermaidPngsOf, saveBlob } from '@/lib/work-docs3a-api';
import { DOC_KINDS, workSwrApi, workSwrKeys, type DocKind } from '@/lib/work-swr-api';
import { wt, type WKey } from '@/components/work/i18n';
import { EmptyState, PageLoading, Spinner } from '../ui';
import { useSwrRefresh } from './shared';

export const DOC_LABEL: Record<DocKind, WKey> = {
  'vision-scope': 'swr.docVisionScope', 'use-cases': 'swr.docUseCases', 'business-rules': 'swr.docBusinessRules', srs: 'swr.docSrs', 'data-dictionary': 'swr.docDataDictionary',
};
const DOC_HINT: Record<DocKind, WKey> = {
  'vision-scope': 'swr.docVisionScopeHint', 'use-cases': 'swr.docUseCasesHint', 'business-rules': 'swr.docBusinessRulesHint', srs: 'swr.docSrsHint', 'data-dictionary': 'swr.docDataDictionaryHint',
};
export const LINK_TITLE: Record<string, WKey> = {
  FE_UC: 'swr.link1', UC_BR: 'swr.link2', FR_TRACE: 'swr.link3', NOUN_DD: 'swr.link4', PRIORITY_REF: 'swr.link5', COUNTS: 'swr.link6',
};

export default function OverviewTab({ pid, base, onTab }: { pid: number; base: string; onTab: (t: string) => void }) {
  const refresh = useSwrRefresh(pid);
  const q = useQuery({ queryKey: workSwrKeys.overview(pid), queryFn: () => workSwrApi.overview(pid) });
  const [busy, setBusy] = useState<string | null>(null);
  const fill = useMutation({
    mutationFn: (kind: DocKind) => workSwrApi.fillDoc(pid, kind, { create: true }),
    onSuccess: (r, kind) => {
      refresh();
      if (!r.filled.length) { toast.message(wt('swr.nothingToFill')); return; }
      toast.success(wt(r.created ? 'swr.docCreatedFilled' : 'swr.docFilled', { doc: wt(DOC_LABEL[kind]), v: r.page.currentVersion }));
    },
    onError: (e) => toast.error(workError(e, wt('swr.fillFailed'))),
  });
  const exportDoc = async (kind: DocKind, format: 'docx' | 'pdf') => {
    setBusy(`${kind}:${format}`);
    try {
      const pre = await workSwrApi.doc(pid, kind);
      const diagrams = await mermaidPngsOf(pre.doc);
      const f = await workSwrApi.exportDoc(pid, kind, format, diagrams);
      saveBlob(f.blob, f.fileName);
      toast.success(wt('swr.downloaded', { name: f.fileName }));
    } catch (e) { toast.error(workError(e, wt('swr.exportFailed'))); } finally { setBusy(null); }
  };

  if (q.isLoading) return <PageLoading rows={4} />;
  if (!q.data) return <EmptyState title={wt('swr.loadFailed')} body={q.error ? workError(q.error) : undefined} />;
  const o = q.data;
  const counts: Array<[WKey, number, string]> = [
    ['swr.cFeatures', o.counts.features, 'features'], ['swr.cRequirements', o.counts.requirements, 'requirements'], ['swr.cPriorityRows', o.counts.priorityRows, 'priority'],
    ['swr.cGlossary', o.counts.glossary, 'glossary'], ['swr.cDataElements', o.counts.dataElements, 'dictionary'],
  ];
  return (
    <div className="flex flex-col gap-5">
      <p className="text-[13px] text-[var(--w-text-2)]">{wt('swr.overviewIntro')}</p>

      <section aria-labelledby="swr-six-h" className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h2 id="swr-six-h" className="flex-1 text-[14px] font-semibold">{wt('swr.sixLinksTitle')}</h2>
          <span className="text-[13px] font-medium tabular-nums" style={{ color: o.sixLinks.ok ? 'var(--w-green-text)' : 'var(--w-orange-text)' }}>{wt('swr.passedOf', { n: o.sixLinks.passed })}</span>
          <button type="button" className="w-btn w-btn-sm" onClick={() => onTab('six-links')}>{wt('swr.openCheck')}</button>
        </div>
        <ol className="grid gap-1.5 sm:grid-cols-2">
          {o.sixLinks.links.map((l) => (
            <li key={l.key} className="flex items-start gap-2 text-[13px]">
              {l.ok ? <CheckCircle2 size={15} className="mt-[2px] shrink-0 text-[var(--w-green-text)]" aria-label={wt('swr.ok')} /> : <XCircle size={15} className="mt-[2px] shrink-0 text-[var(--w-red-text)]" aria-label={wt('swr.broken')} />}
              <span><span className="font-medium">{l.n}.</span> {wt(LINK_TITLE[l.key])}{l.gaps ? <span className="text-[var(--w-red-text)]"> — {wt('swr.gapCount', { count: l.gaps })}</span> : null}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="swr-docs-h">
        <h2 id="swr-docs-h" className="mb-2 text-[14px] font-semibold">{wt('swr.docsTitle')}</h2>
        <ul className="grid gap-2 lg:grid-cols-2">
          {DOC_KINDS.map((k) => {
            const d = o.docs.find((x) => x.kind === k);
            return (
              <li key={k} className="flex flex-col gap-2 rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-3">
                <div className="flex items-start gap-2">
                  <FileText size={16} className="mt-[1px] shrink-0 text-[var(--w-text-2)]" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium">{wt(DOC_LABEL[k])}</p>
                    <p className="text-[12px] text-[var(--w-text-2)]">{wt(DOC_HINT[k])}</p>
                    <p className="mt-1 text-[12px]">
                      {d?.page
                        ? <Link className="text-[var(--w-accent-text)] hover:underline" href={`${base}/docs/${d.page.number}`}>{d.page.title}</Link>
                        : <span className="text-[var(--w-text-2)]">{wt('swr.noPageYet')}</span>}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {o.canEdit && (
                    <button type="button" className="w-btn w-btn-sm" disabled={fill.isPending} onClick={() => fill.mutate(k)} title={d?.page ? wt('swr.fillTitle') : wt('swr.createFillTitle')}>
                      {fill.isPending && fill.variables === k ? <Spinner size={12} /> : <Wand2 size={13} />} {d?.page ? wt('swr.fillFromData') : wt('swr.createAndFill')}
                    </button>
                  )}
                  <button type="button" className="w-btn w-btn-sm w-btn-primary" disabled={!!busy} onClick={() => exportDoc(k, 'docx')} aria-label={`${wt(DOC_LABEL[k])} .docx`}>
                    {busy === `${k}:docx` ? <Spinner size={12} /> : <FileDown size={13} />} .docx
                  </button>
                  <button type="button" className="w-btn w-btn-sm" disabled={!!busy} onClick={() => exportDoc(k, 'pdf')} aria-label={`${wt(DOC_LABEL[k])} PDF`}>
                    {busy === `${k}:pdf` ? <Spinner size={12} /> : null} PDF
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="swr-counts-h">
        <h2 id="swr-counts-h" className="mb-2 text-[14px] font-semibold">{wt('swr.packageTitle')}</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {counts.map(([label, n, tab]) => (
            <button key={tab} type="button" onClick={() => onTab(tab)} className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-3 text-left hover:bg-[var(--w-hover)]">
              <span className="block text-[20px] font-semibold tabular-nums">{n}</span>
              <span className="text-[12px] text-[var(--w-text-2)]">{wt(label)}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
