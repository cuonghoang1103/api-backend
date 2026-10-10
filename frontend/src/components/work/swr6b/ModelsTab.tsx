'use client';

/**
 * CTW đợt 6b (R14) — Mô hình phân tích của SRS (Wiegers ch.5, ch.12–13; LAB SWR302): context diagram (DFD mức 0), DFD mức 1,
 * sơ đồ trạng thái của một thực thể (Values của Data Dictionary), activity của use case, feature tree — dựng THẲNG từ dữ liệu
 * (actor/stakeholder, feature, UC, DD) thành sơ đồ ĐỀ XUẤT trong Diagram Studio; người duyệt ⇒ bản đã duyệt vào SRS Wiegers
 * (2.1 + Phụ lục B) và Report 3 §1.1. Thiếu dữ liệu ⇒ nói rõ cần thêm gì (422 song ngữ). Bảng event–response tính từ UC.
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckCircle2, ExternalLink, FileSpreadsheet, Shapes, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { workError } from '@/lib/work-api';
import { workDiagramKeys, workDiagramsApi } from '@/lib/work-diagrams-api';
import { workSwr6bApi, workSwr6bKeys, type ModelKind, type ModelsData } from '@/lib/work-swr6b-api';
import { useWT, wt, type WKey } from '@/components/work/i18n';
import { EmptyState, PageLoading, Spinner } from '../ui';
import { parseMermaid, renderDiagramSvg } from '../diagrams/render';
import { Chip, downloadFile, Note, Section, TabIntro, TableFrame, TD, TH, use6bRefresh } from './shared';

const KIND: Array<{ kind: ModelKind; title: WKey; body: WKey }> = [
  { kind: 'CONTEXT', title: 'srsx.mContext', body: 'srsx.mContextBody' },
  { kind: 'DFD1', title: 'srsx.mDfd1', body: 'srsx.mDfd1Body' },
  { kind: 'FEATURE_TREE', title: 'srsx.mTree', body: 'srsx.mTreeBody' },
  { kind: 'STATE', title: 'srsx.mState', body: 'srsx.mStateBody' },
  { kind: 'ACTIVITY', title: 'srsx.mActivity', body: 'srsx.mActivityBody' },
];
const EVENT_KEY: Record<string, WKey> = { BUSINESS: 'srsx.evBusiness', SIGNAL: 'srsx.evSignal', TEMPORAL: 'srsx.evTemporal' };
const STATUS_TONE: Record<string, 'green' | 'yellow' | 'muted'> = { APPROVED: 'green', PROPOSED: 'yellow', DRAFT: 'muted' };
const STATUS_KEY: Record<string, WKey> = { APPROVED: 'srsx.dApproved', PROPOSED: 'srsx.dProposed', DRAFT: 'common.draft' };

/** Lỗi 422 WORK_DIAGRAM_NO_SOURCE mang `data.en` / `data.vi` — chọn đúng ngôn ngữ giao diện. */
function noSourceText(e: unknown, locale: string): string | null {
  const r = (e as { response?: { data?: { code?: string; data?: { en?: string; vi?: string } } } })?.response?.data;
  if (r?.code !== 'WORK_DIAGRAM_NO_SOURCE' || !r.data) return null;
  return (locale === 'vi' ? r.data.vi : r.data.en) ?? null;
}

export default function ModelsTab({ pid, base }: { pid: number; base: string }) {
  const { locale } = useWT();
  const refresh = use6bRefresh(pid);
  const q = useQuery({ queryKey: workSwr6bKeys.models(pid), queryFn: () => workSwr6bApi.models(pid) });
  const [subject, setSubject] = useState<Record<string, string>>({});
  const gen = useMutation({
    mutationFn: (x: { kind: ModelKind; subject?: string }) => workSwr6bApi.generateModel(pid, x.kind, x.kind === 'ACTIVITY' ? { useCase: x.subject } : { subject: x.subject ?? null }),
    onSuccess: (r) => { refresh(); toast.success(r.created ? wt('srsx.generated', { key: r.diagram.key }) : wt('srsx.regenerated', { key: r.diagram.key })); },
    onError: (e) => toast.error(noSourceText(e, locale) ?? workError(e, wt('srsx.generateFailed'))),
  });
  if (q.isLoading) return <PageLoading rows={5} />;
  if (!q.data) return <EmptyState title={wt('swr.loadFailed')} body={q.error ? workError(q.error) : undefined} />;
  const data = q.data;
  const pickFor = (k: ModelKind) => subject[k] ?? (k === 'STATE' ? data.stateCandidates[0]?.name : k === 'ACTIVITY' ? data.useCases[0]?.key : '') ?? '';
  return (
    <div className="flex flex-col gap-5">
      <TabIntro text={wt('srsx.modelsIntro')}>
        <Link className="w-btn w-btn-sm" href={`${base}/diagrams`}><Shapes size={13} /> {wt('srsx.openStudio')}</Link>
      </TabIntro>
      <div className="grid gap-3 lg:grid-cols-2">
        {KIND.map(({ kind, title, body }) => {
          const multi = kind === 'STATE' || kind === 'ACTIVITY';
          const mine = data.models.filter((m) => m.kind === kind);
          const ready = kind === 'CONTEXT' || kind === 'DFD1' || kind === 'FEATURE_TREE' ? data.readiness[kind] : kind === 'STATE' ? (data.stateCandidates.length ? { ready: true } : { ready: false, en: wt('srsx.needStateValues'), vi: wt('srsx.needStateValues') }) : (data.useCases.length ? { ready: true } : { ready: false, en: wt('srsx.needUc'), vi: wt('srsx.needUc') });
          const pick = pickFor(kind);
          const existing = multi ? mine.find((m) => m.subject === pick) : mine[0];
          return (
            <section key={kind} aria-labelledby={`m-${kind}`} className="flex flex-col gap-2 rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-3">
              <div className="flex flex-wrap items-start gap-2">
                <div className="min-w-[200px] flex-1">
                  <h2 id={`m-${kind}`} className="text-[14px] font-semibold">{wt(title)}</h2>
                  <p className="text-[12.5px] text-[var(--w-text-2)]">{wt(body)}</p>
                </div>
                {multi && (
                  <>
                    <label className="sr-only" htmlFor={`pick-${kind}`}>{kind === 'STATE' ? wt('srsx.entity') : wt('srsx.useCase')}</label>
                    <select id={`pick-${kind}`} className="w-input h-8 max-w-[220px]" value={pick} onChange={(e) => setSubject({ ...subject, [kind]: e.target.value })}>
                      {kind === 'STATE' ? data.stateCandidates.map((c) => <option key={c.name} value={c.name}>{c.name} ({c.values.length})</option>) : data.useCases.map((u) => <option key={u.key} value={u.key}>{u.key} {u.name}</option>)}
                    </select>
                  </>
                )}
                {data.canEdit && (
                  <button type="button" className="w-btn w-btn-sm" disabled={gen.isPending || !ready.ready || (multi && !pick)} onClick={() => gen.mutate({ kind, subject: multi ? pick : undefined })}>
                    {gen.isPending && gen.variables?.kind === kind ? <Spinner size={12} /> : <Wand2 size={13} />} {existing ? wt('srsx.regenerate') : wt('srsx.generate')}
                  </button>
                )}
              </div>
              {!ready.ready && <Note tone="warn">{(locale === 'vi' ? ready.vi : ready.en) ?? ''}</Note>}
              {mine.length > 0 && (
                <ul className="flex flex-wrap gap-1.5">
                  {mine.map((m) => (
                    <li key={`${m.kind}-${m.subject}`} className="flex items-center gap-1.5 rounded-[6px] border border-[var(--w-border)] px-2 py-1 text-[12.5px]">
                      <Link className="font-mono text-[var(--w-accent-text)] hover:underline" href={`${base}/diagrams?d=${m.diagram.number}`}>{m.diagram.key}</Link>
                      {m.subject && <span>{m.subject}</span>}
                      <Chip tone={STATUS_TONE[m.diagram.status] ?? 'muted'}>{wt(STATUS_KEY[m.diagram.status] ?? 'common.draft')}</Chip>
                      <span className="text-[var(--w-text-3)]">v{m.diagram.currentVersion}</span>
                    </li>
                  ))}
                </ul>
              )}
              {existing && <Preview pid={pid} n={existing.diagram.number} base={base} />}
            </section>
          );
        })}
      </div>
      <Events data={data} pid={pid} />
    </div>
  );
}

function Preview({ pid, n, base }: { pid: number; n: number; base: string }) {
  const refresh = use6bRefresh(pid);
  const q = useQuery({ queryKey: workDiagramKeys.one(pid, n), queryFn: () => workDiagramsApi.get(pid, n) });
  const [svg, setSvg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const read = () => setDark(el.classList.contains('theme-dark'));
    read();
    const mo = new MutationObserver(read);
    mo.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, []);
  const src = q.data?.source ?? '';
  useEffect(() => {
    if (!src) return;
    let live = true;
    renderDiagramSvg(src, dark ? 'dark' : 'light').then((s) => { if (live) { setSvg(s); setErr(null); } }).catch((e: Error) => live && setErr(e.message));
    return () => { live = false; };
  }, [src, dark]);
  const approve = useMutation({
    mutationFn: async () => { const p = await parseMermaid(src); return workDiagramsApi.approve(pid, n, true, p.ok); },
    onSuccess: () => { refresh(); q.refetch(); toast.success(wt('srsx.approved')); },
    onError: (e) => toast.error(workError(e, wt('swr.saveFailed'))),
  });
  if (!q.data) return <div className="flex h-24 items-center justify-center"><Spinner /></div>;
  const d = q.data;
  return (
    <div className="flex flex-col gap-2">
      {/* Khung cuộn được (tab tới được — axe scrollable-region-focusable); SVG co theo bề ngang, giữ tỉ lệ (viewBox). */}
      <div className="max-h-[320px] overflow-auto rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] p-2" tabIndex={0} role="region" aria-label={d.title}>
        {err ? <pre className="text-[11.5px]">{src}</pre> : svg ? <div role="img" aria-label={d.title} className="[&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-h-[296px] [&_svg]:w-full [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: svg }} /> : <div className="flex h-20 items-center justify-center"><Spinner /></div>}
      </div>
      {(d.origin?.assumptions?.length ?? 0) > 0 && <Note tone="warn">{d.origin!.assumptions!.join(' · ')}</Note>}
      {(d.origin?.notes?.length ?? 0) > 0 && <p className="text-[12px] text-[var(--w-text-2)]">{d.origin!.notes!.join(' · ')}</p>}
      <div className="flex flex-wrap items-center gap-2">
        {d.status !== 'APPROVED' && d.canApprove && <button type="button" className="w-btn w-btn-sm w-btn-primary" disabled={approve.isPending} onClick={() => approve.mutate()}><CheckCircle2 size={13} /> {wt('srsx.approve')}</button>}
        {d.status === 'APPROVED' && <span className="text-[12.5px] text-[var(--w-green-text)]">{wt('srsx.inSrs', { v: d.approvedVersion ?? d.currentVersion })}</span>}
        <Link className="w-btn w-btn-sm w-btn-ghost" href={`${base}/diagrams?d=${n}`}><ExternalLink size={13} /> {wt('srsx.openInStudio')}</Link>
      </div>
    </div>
  );
}

function Events({ data, pid }: { data: ModelsData; pid: number }) {
  return (
    <Section id="ev-h" title={wt('srsx.eventsTitle')} actions={<button type="button" className="w-btn w-btn-sm" disabled={!data.events.length} onClick={() => downloadFile(() => workSwr6bApi.exportEvents(pid))}><FileSpreadsheet size={13} /> .xlsx</button>}>
      <p className="text-[12.5px] text-[var(--w-text-2)]">{wt('srsx.eventsIntro')}</p>
      {!data.events.length ? <p className="text-[12.5px] text-[var(--w-text-3)]">{wt('srsx.needUc')}</p> : (
        <TableFrame label={wt('srsx.eventsTitle')} maxH="420px">
          <table className="w-full min-w-[760px] border-separate border-spacing-0">
            <thead><tr>{[wt('srsx.hEvent'), wt('srsx.hEventType'), wt('srsx.hState'), wt('srsx.hResponse'), wt('srsx.hSource')].map((h) => <th key={h} scope="col" className={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {data.events.map((e) => (
                <tr key={e.ref} className="hover:bg-[var(--w-hover)]">
                  <td className={TD}>{e.event}</td>
                  <td className={TD}><Chip tone={e.type === 'TEMPORAL' ? 'blue' : e.type === 'SIGNAL' ? 'accent' : 'muted'}>{wt(EVENT_KEY[e.type])}</Chip></td>
                  <td className={`${TD} text-[12.5px]`}>{e.state}</td>
                  <td className={`${TD} text-[12.5px]`}>{e.response}</td>
                  <td className={`${TD} font-mono text-[12px]`}>{e.ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableFrame>
      )}
    </Section>
  );
}
