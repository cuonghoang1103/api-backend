'use client';

/**
 * CT Work đợt 4 (09/10/2026) — /work/<slug>/<KEY>/requirements: SRS CÓ CẤU TRÚC theo mẫu FPT Report 3 + RTM.
 * Tab trong `?tab=` (use-cases | actors | rules | screens | authorization | non-ui | traceability) để chia sẻ link;
 * `?uc=N` mở đặc tả một UC, `?issue=N` mở ngăn kéo thẻ.
 * Hành động: Draft from issue (AI ⇒ đề xuất), Fill the Report 3 page (một phiên bản mới), Export Report 3 (.docx/.pdf —
 * vẽ sẵn sơ đồ Mermaid ở trình duyệt rồi gửi kèm như xuất trang Docs của đợt 3A).
 */

import Link from 'next/link';
import { Suspense, useCallback, useState } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FileDown, FileText, Sparkles, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { mermaidPngsOf, saveBlob } from '@/lib/work-docs3a-api';
import { SRS_SECTION_LABEL, workCtw4Api, workCtw4Keys } from '@/lib/work-ctw4-api';
import ProjectHeader from '@/components/work/ProjectHeader';
import { PageFocusButton } from '@/components/work/shell/panes'; // UX-E: Focus / Full width
import IssueDrawer from '@/components/work/IssueDrawer';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading, Spinner } from '@/components/work/ui';
import UseCasesTab, { SuggestDialog } from '@/components/work/srs/UseCasesTab';
import { ActorsTab, FunctionsTab, RulesTab } from '@/components/work/srs/CatalogTabs';
import { AuthMatrixTab, ScreensTab } from '@/components/work/srs/ScreensTab';
import RtmTab from '@/components/work/srs/RtmTab';
import { wt } from '@/components/work/i18n';

const TABS = [
  { id: 'use-cases', get label() { return wt('srs.tabUseCases'); } },
  { id: 'actors', get label() { return wt('srs.tabActors'); } },
  { id: 'rules', get label() { return wt('srs.tabBusinessRules'); } },
  { id: 'screens', get label() { return wt('srs.tabScreensFlow'); } },
  { id: 'authorization', get label() { return wt('srs.tabScreenAuthorization'); } },
  { id: 'non-ui', get label() { return wt('srs.tabNonUiFunctions'); } },
  { id: 'traceability', get label() { return wt('srs.tabTraceabilityRtm'); } },
] as const;
type TabId = (typeof TABS)[number]['id'];

function RequirementsView({ config, pid }: { config: ProjectConfig; pid: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const qc = useQueryClient();
  useProjectRealtime(pid);
  const raw = search?.get('tab');
  const tab: TabId = TABS.some((t) => t.id === raw) ? (raw as TabId) : 'use-cases';
  const setParam = useCallback((patch: Record<string, string | null>, push = false) => {
    const p = new URLSearchParams(search?.toString());
    for (const [k, v] of Object.entries(patch)) { if (v === null) p.delete(k); else p.set(k, v); }
    const s = p.toString();
    (push ? router.push : router.replace)(s ? `${pathname}?${s}` : pathname!, { scroll: false });
  }, [router, pathname, search]);
  const setTab = (id: TabId) => setParam({ tab: id === 'use-cases' ? null : id, uc: null });
  const issue = Number(search?.get('issue')) || null;
  const uc = Number(search?.get('uc')) || null;
  const q = useQuery({ queryKey: workCtw4Keys.srs(pid), queryFn: () => workCtw4Api.srs(pid) });
  const [suggest, setSuggest] = useState(false);
  const [exporting, setExporting] = useState<'docx' | 'pdf' | null>(null);
  const base = `/work/${config.workspace.slug}/${config.key}`;

  const fill = useMutation({
    mutationFn: () => workCtw4Api.fillReport3(pid, q.data!.report3Page!.number),
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: ['work'] });
      if (!r.filled.length) { toast.message(wt('srs.nothingFill')); return; }
      toast.success(wt('srs.filled', { list: r.filled.map((x) => SRS_SECTION_LABEL[x]).join(', '), v: r.page.currentVersion }), {
        action: { label: wt('srs.openPage'), onClick: () => router.push(`${base}/docs/${q.data!.report3Page!.number}`) },
      });
    },
    onError: (e) => toast.error(workError(e, wt('srs.fillFailed'))),
  });
  const exportR3 = async (format: 'docx' | 'pdf') => {
    setExporting(format);
    try {
      const pre = await workCtw4Api.report3Doc(pid);
      const diagrams = await mermaidPngsOf(pre.doc);
      const f = await workCtw4Api.exportReport3(pid, format, diagrams);
      saveBlob(f.blob, f.fileName);
      toast.success(wt('srs.downloaded', { name: f.fileName }));
    } catch (e) { toast.error(workError(e, wt('srs.exportFailed'))); } finally { setExporting(null); }
  };

  if (q.isLoading) return <PageLoading />;
  if (!q.data) return <EmptyState title={wt('srs.loadFailed')} body={q.error ? workError(q.error) : undefined} />;
  const data = q.data;
  const count: Partial<Record<TabId, number>> = { 'use-cases': data.useCases.length, actors: data.actors.length, rules: data.rules.length, screens: data.screens.length, 'non-ui': data.functions.length };

  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title={wt('srs.title')}>
        <PageFocusButton scope="requirements" />
        {data.canEdit && (
          <button type="button" className="w-btn w-btn-sm" onClick={() => setSuggest(true)} aria-label={wt('srs.draftTitle')} title={wt('srs.draftHint')}>
            <Sparkles size={13} /> <span className="max-sm:hidden">{wt('srs.draftFromIssue')}</span>
          </button>
        )}
        {data.report3Page ? (
          <button type="button" className="w-btn w-btn-sm" disabled={fill.isPending || !data.canEdit} onClick={() => fill.mutate()} aria-label={wt('srs.fillR3')} title={wt('srs.fillR3Title', { t: data.report3Page.title })}>
            {fill.isPending ? <Spinner size={12} /> : <Wand2 size={13} />} <span className="max-sm:hidden">{wt('srs.fillR3')}</span>
          </button>
        ) : null}
        <button type="button" className="w-btn w-btn-sm w-btn-primary" disabled={!!exporting} onClick={() => exportR3('docx')} aria-label={wt('srs.exportWord')} title={wt('srs.exportWordTitle')}>
          {exporting === 'docx' ? <Spinner size={12} /> : <FileDown size={13} />} <span className="max-sm:hidden">Report 3</span> .docx
        </button>
        <button type="button" className="w-btn w-btn-sm" disabled={!!exporting} onClick={() => exportR3('pdf')} aria-label={wt('srs.exportPdf')}>
          {exporting === 'pdf' ? <Spinner size={12} /> : null} PDF
        </button>
      </ProjectHeader>
      <div className="shrink-0 overflow-x-auto border-b border-[var(--w-border)] px-4">
        <div className="flex gap-1" role="tablist" aria-label={wt('srs.title')}>
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} data-testid={`req-tab-${t.id}`}
              className={cn('-mb-px flex items-center gap-1.5 whitespace-nowrap border-b-2 px-2.5 py-2.5 text-[13px] font-medium transition-colors',
                tab === t.id ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
              {t.label}{count[t.id] !== undefined && <span className="w-count">{count[t.id]}</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-[1400px] p-4">
          {data.report3Page ? null : (
            <p className="mb-3 flex items-center gap-1.5 text-[12.5px] text-[var(--w-text-2)]">
              <FileText size={13} aria-hidden="true" /> {wt('srs.noR3')}
              <Link className="text-[var(--w-accent-text)] hover:underline" href={`${base}/docs`}>{wt('srs.openDocs')}</Link>
            </p>
          )}
          {tab === 'use-cases' && <UseCasesTab pid={pid} data={data} openUc={uc} onOpenUc={(n) => setParam({ uc: n ? String(n) : null })} onOpenIssue={(n) => setParam({ issue: String(n) }, true)} />}
          {tab === 'actors' && <ActorsTab pid={pid} data={data} />}
          {tab === 'rules' && <RulesTab pid={pid} data={data} />}
          {tab === 'screens' && <ScreensTab pid={pid} data={data} />}
          {tab === 'authorization' && <AuthMatrixTab pid={pid} data={data} />}
          {tab === 'non-ui' && <FunctionsTab pid={pid} data={data} />}
          {tab === 'traceability' && <RtmTab pid={pid} onOpenIssue={(n) => setParam({ issue: String(n) }, true)} onOpenUc={(n) => setParam({ tab: null, uc: String(n) })} />}
        </div>
      </div>
      <SuggestDialog pid={pid} open={suggest} onClose={() => setSuggest(false)} />
      <IssueDrawer pid={pid} num={issue} onClose={() => setParam({ issue: null }, true)} onOpenIssue={(n) => setParam({ issue: String(n) }, true)} />
    </div>
  );
}

// useSearchParams bắt buộc nằm trong <Suspense> — thiếu là Next 14 báo lỗi lúc build.
export default function RequirementsPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title={wt('common.projectNotFound')} body={error ? workError(error) : wt('common.projectNotFoundBody')} />;
  if (config.role === 'CLIENT' || config.clientView) return <EmptyState title={wt('school.notAvail')} body={wt('srs.notAvailBody')} />;
  return <RequirementsView config={config} pid={pid} />;
}
