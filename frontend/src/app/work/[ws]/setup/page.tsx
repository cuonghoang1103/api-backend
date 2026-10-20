'use client';

/**
 * /work/<slug>/setup — "Create with CuongMini" (20/10/2026): đưa đề bài, mã, thành viên, lịch ⇒ CuongMini tóm tắt điều nó
 * hiểu ⇒ người dùng chấp nhận ⇒ dựng trọn dự án (hoặc cả không gian nhiều nhóm).
 *   ?draft=<id>                         mở bản nháp
 *   ?mode=workspace                     dựng nhiều dự án (lớp nhiều nhóm, công ty nhiều sản phẩm)
 *   ?name=&key=&template=&type=&kind=   mang sang từ hộp "Tạo dự án" ⇒ tự tạo bản nháp
 */

import { Suspense, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bot, Building2, ChevronRight, FolderKanban, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { workApi, workError, type ProjectKind, type ProjectTemplate, type ProjectType } from '@/lib/work-api';
import { defaultInput, setupApi, setupKeys, type DraftSummary } from '@/lib/work-setup-api';
import { wk } from '@/components/work/hooks';
import { EmptyState, PageLoading, relativeTime, Spinner } from '@/components/work/ui';
import { PageHeader } from '@/components/work/settings/shared';
import { Crumb, CrumbSep } from '@/components/work/ProjectHeader';
import SetupWizard from '@/components/work/setup/SetupWizard';
import { wt } from '@/components/work/i18n';

const TPL = ['BLANK', 'SWR302', 'SWT301', 'SWP391', 'FREELANCE', 'COMPANY', 'CAPSTONE'];
const KINDS = ['PERSONAL', 'SCHOOL', 'SOFTWARE', 'CLIENT'];

export default function SetupPage() {
  return <Suspense fallback={<PageLoading />}><SetupInner /></Suspense>;
}

function SetupInner() {
  const params = useParams<{ ws: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const qc = useQueryClient();
  const slug = decodeURIComponent(params?.ws ?? '');
  const q = useQuery({ queryKey: wk.workspace(slug), queryFn: () => workApi.workspaceBySlug(slug), enabled: !!slug, staleTime: 30_000 });
  const ws = q.data;
  const draftId = Number(search?.get('draft') ?? 0) || 0;
  const carried = !!(search?.get('name') || search?.get('template') || search?.get('from'));
  const started = useRef(false);

  const create = useMutation({
    mutationFn: (mode: 'PROJECT' | 'WORKSPACE') => {
      const g = (k: string) => search?.get(k) ?? '';
      const template = (TPL.includes(g('template')) ? g('template') : 'SWP391') as ProjectTemplate;
      const input = defaultInput({
        name: g('name').slice(0, 120), key: g('key').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10), template,
        type: (g('type') === 'KANBAN' ? 'KANBAN' : 'SCRUM') as ProjectType, kind: (KINDS.includes(g('kind')) ? g('kind') : 'SCHOOL') as ProjectKind,
      });
      return setupApi.create(ws!.id, { mode, input });
    },
    onSuccess: (d) => { qc.setQueryData(setupKeys.draft(d.id), d); router.replace(`/work/${slug}/setup?draft=${d.id}`); },
    onError: (e) => toast.error(workError(e, wt('tcm.createDraftFailed'))),
  });

  useEffect(() => {
    if (!ws || draftId || started.current || ws.role === 'GUEST') return;
    if (carried || search?.get('mode')) {
      started.current = true;
      create.mutate(search?.get('mode') === 'workspace' ? 'WORKSPACE' : 'PROJECT');
    }
  }, [ws, draftId, carried]); // eslint-disable-line react-hooks/exhaustive-deps

  if (q.isLoading) return <PageLoading />;
  const title = (
    <>
      {ws && <><Crumb href={`/work/${slug}`} className="max-w-[220px] font-normal">{ws.name}</Crumb><CrumbSep className="mx-1.5" /></>}
      <Bot size={15} className="mr-1.5 text-[var(--w-accent-text)]" /> {wt('tcm.pageTitle')}
    </>
  );
  return (
    <div className="flex h-full flex-col">
      <PageHeader title={title} />
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        {!ws ? (
          <EmptyState title={wt('pages.wsNotFound')} body={workError(q.error, wt('pages.wsNotFoundBody'))} />
        ) : ws.role === 'GUEST' ? (
          <EmptyState title={wt('tcm.pageTitle')} body={wt('tcm.guestsCannot')} />
        ) : draftId ? (
          <SetupWizard key={draftId} draftId={draftId} wsId={ws.id} slug={slug} />
        ) : create.isPending || (started.current && !create.isError) ? (
          <div className="flex h-full items-center justify-center gap-2 text-[13px] text-[var(--w-text-2)]"><Spinner size={14} /> {wt('tcm.preparing')}</div>
        ) : (
          <Start wsId={ws.id} slug={slug} onStart={(m) => create.mutate(m)} busy={create.isPending} />
        )}
      </div>
    </div>
  );
}

function Start({ wsId, slug, onStart, busy }: { wsId: number; slug: string; onStart: (m: 'PROJECT' | 'WORKSPACE') => void; busy: boolean }) {
  const qc = useQueryClient();
  const drafts = useQuery({ queryKey: setupKeys.drafts(wsId), queryFn: () => setupApi.drafts(wsId) });
  const del = useMutation({
    mutationFn: (id: number) => setupApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: setupKeys.drafts(wsId) }),
    onError: (e) => toast.error(workError(e)),
  });
  const cards = [
    { mode: 'PROJECT' as const, icon: FolderKanban, title: wt('tcm.startProject'), body: wt('tcm.startProjectBody') },
    { mode: 'WORKSPACE' as const, icon: Building2, title: wt('tcm.startWorkspace'), body: wt('tcm.startWorkspaceBody') },
  ];
  return (
    <div className="mx-auto w-full max-w-[860px] px-4 py-6 md:px-8 md:py-10">
      <div className="mb-6 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]"><Bot size={20} /></span>
        <div>
          <h2 className="text-[22px] font-semibold tracking-[-0.02em]">{wt('tcm.startTitle')}</h2>
          <p className="mt-1 max-w-[600px] text-[14px] text-[var(--w-text-2)]">{wt('tcm.startBody')}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {cards.map((c) => (
          <button key={c.mode} type="button" disabled={busy} onClick={() => onStart(c.mode)}
            className="group relative flex gap-3 rounded-[10px] border border-[var(--w-border-strong)] px-4 py-4 text-left transition-colors hover:border-[var(--w-accent-border)] hover:bg-[var(--w-accent-soft)]">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[var(--w-sunken)] text-[var(--w-text-2)]"><c.icon size={17} /></span>
            <span className="min-w-0 flex-1 pr-4">
              <span className="block text-[14px] font-semibold">{c.title}</span>
              <span className="mt-0.5 block text-[12.5px] leading-snug text-[var(--w-text-2)]">{c.body}</span>
            </span>
            <ChevronRight size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
          </button>
        ))}
      </div>
      <ol className="mt-6 grid grid-cols-1 gap-2 text-[12.5px] text-[var(--w-text-2)] sm:grid-cols-3">
        {[wt('tcm.how1'), wt('tcm.how2'), wt('tcm.how3')].map((t, i) => (
          <li key={i} className="flex gap-2 rounded-[8px] bg-[var(--w-sunken)] px-3 py-2.5"><span className="font-semibold tabular-nums text-[var(--w-accent-text)]">{i + 1}</span><span>{t}</span></li>
        ))}
      </ol>
      {(drafts.data?.length ?? 0) > 0 && (
        <div className="mt-8">
          <h3 className="w-section-title mb-2">{wt('tcm.recent')}</h3>
          <ul className="divide-y divide-[var(--w-border)] rounded-[8px] border border-[var(--w-border)]">
            {drafts.data!.map((d: DraftSummary) => (
              <li key={d.id} className="flex items-center gap-2 px-3 py-2">
                <a href={`/work/${slug}/setup?draft=${d.id}`} className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium">{d.title || wt('tcm.untitled')}</span>
                  <span className="block text-[11.5px] text-[var(--w-text-3)]">{wt(`tcm.status_${d.status}` as const)} · {d.mode === 'WORKSPACE' ? wt('tcm.modeWs') : wt('tcm.modeProject')} · {relativeTime(d.updatedAt)}</span>
                </a>
                {d.status !== 'APPLIED' && (
                  <button type="button" className="w-btn w-btn-ghost w-btn-icon h-8 w-8" aria-label={wt('tcm.deleteDraft')} onClick={() => { if (confirm(wt('tcm.deleteDraftConfirm'))) del.mutate(d.id); }}><Trash2 size={13} /></button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
