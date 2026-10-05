'use client';

/**
 * Khung trang Docs (S2a): cây tài liệu bên trái (280px) + nội dung bên phải.
 * Dùng cho /work/<ws>/<KEY>/docs (trang tổng quan) và /docs/<num> (một trang).
 *
 * Điện thoại (<md): /docs hiện cây toàn màn; /docs/<num> chỉ hiện nội dung, nút
 * "Pages" mở cây trong hộp thoại — không có hai cột chen nhau ở 390px.
 */

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FilePlus2, FileText, FileUp, ListTree, Search, Sparkles } from 'lucide-react';
import { openAiPanel } from '../ai/store';
import { cn } from '@/lib/utils';
import { workDocsApi, type PageStatus, type ProjectConfig, type WorkPageList } from '@/lib/work-api';
import ProjectHeader from '../ProjectHeader';
import { Dialog, EmptyState, PageLoading, UserAvatar, relativeTime } from '../ui';
import { ModuleOff, studioOn } from '../studio/shared';
import DocView from './DocView';
import DocsTree from './DocsTree';
import NewPageDialog from './NewPageDialog';
import ImportMarkdownDialog from './ImportMarkdownDialog';
import { PAGE_STATUS, PageStatusPill, VisibilityBadge, docsBase, useDocsList } from './shared';

export default function DocsShell({ config, num }: { config: ProjectConfig; num?: number }) {
  const on = studioOn(config, 'docs');
  const list = useDocsList(config.id, on);
  const [newFor, setNewFor] = useState<{ parent: number | null } | null>(null);
  const [treeOpen, setTreeOpen] = useState(false);
  // CTW-4: nhập Markdown thành trang mới.
  const [importOpen, setImportOpen] = useState(false);
  const canEdit = !!list.data?.canEdit && !!config.permissions.editDocs;
  const parent = newFor?.parent ? list.data?.pages.find((p) => p.number === newFor.parent) : null;
  const active = num ? list.data?.pages.find((p) => p.number === num) : undefined;

  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title={active ? active.title : 'Docs'}>
        {on && num && (
          <button type="button" className="w-btn w-btn-sm md:!hidden" onClick={() => setTreeOpen(true)} aria-label="Show all pages">
            <ListTree size={13} /> Pages
          </button>
        )}
        {on && canEdit && (
          <button type="button" className="w-btn w-btn-sm" onClick={() => setImportOpen(true)} data-testid="docs-import-md-open" title="Create a page from Markdown (paste or .md file)">
            <FileUp size={13} /> <span className="max-sm:hidden">Import Markdown</span>
          </button>
        )}
        {on && canEdit && (
          <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setNewFor({ parent: null })} data-testid="docs-new">
            <FilePlus2 size={13} /> <span className="max-sm:hidden">New page</span>
          </button>
        )}
      </ProjectHeader>
      {!on ? (
        <div className="min-h-0 flex-1 overflow-y-auto"><ModuleOff config={config} label="Docs" /></div>
      ) : list.isLoading ? <PageLoading /> : !list.data ? (
        <EmptyState title="Could not load documents" />
      ) : (
        <div className="flex min-h-0 flex-1">
          <aside className={cn('shrink-0 border-r border-[var(--w-border)] bg-[var(--w-bg)] md:w-[280px]', num ? 'max-md:hidden' : 'max-md:w-full max-md:border-r-0')} aria-label="Document tree">
            <DocsTree config={config} list={list.data} activeNum={num} onNew={(p) => setNewFor({ parent: p })} />
          </aside>
          <main className={cn('min-w-0 flex-1 overflow-y-auto', !num && 'max-md:hidden')}>
            {num ? <DocView key={num} config={config} num={num} /> : <DocsHome config={config} list={list.data} onNew={() => setNewFor({ parent: null })} />}
          </main>
        </div>
      )}
      <ImportMarkdownDialog open={importOpen} onClose={() => setImportOpen(false)} config={config} />
      <NewPageDialog open={!!newFor} onClose={() => setNewFor(null)} config={config} parentNumber={newFor?.parent ?? null} parentTitle={parent?.title ?? null} stageId={parent?.stageId ?? null} />
      <Dialog open={treeOpen} onClose={() => setTreeOpen(false)} title="Pages" width={420}>
        {list.data && (
          <div className="-mx-5 -my-4 h-[70vh]">
            <DocsTree config={config} list={list.data} activeNum={num} onNew={(p) => { setTreeOpen(false); setNewFor({ parent: p }); }} onNavigate={() => setTreeOpen(false)} />
          </div>
        )}
      </Dialog>
    </div>
  );
}

/** Tổng quan khi chưa chọn trang: tìm toàn văn, đếm theo trạng thái, trang sửa gần đây. */
function DocsHome({ config, list, onNew }: { config: ProjectConfig; list: WorkPageList; onNew: () => void }) {
  const [q, setQ] = useState('');
  const term = q.trim();
  const search = useQuery({
    queryKey: ['work', 'pages', config.id, 'search', term],
    queryFn: () => workDocsApi.search(config.id, term),
    enabled: term.length >= 2,
  });
  const counts = useMemo(() => {
    const c: Record<PageStatus, number> = { DRAFT: 0, IN_REVIEW: 0, APPROVED: 0, ARCHIVED: 0 };
    for (const p of list.pages) c[p.status]++;
    return c;
  }, [list.pages]);
  const recent = useMemo(() => [...list.pages].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 10), [list.pages]);
  const base = docsBase(config);
  const canEdit = list.canEdit && !!config.permissions.editDocs;

  if (!list.pages.length) {
    return (
      <EmptyState
        icon={<FileText size={20} />}
        title={canEdit ? 'No documents yet' : 'Nothing shared with you yet'}
        body={canEdit ? 'Write requirements, contracts, test plans and runbooks next to the issues they describe. Start blank or from one of 36 studio templates.' : 'Documents the team shares with you will appear here.'}
        action={canEdit ? <button type="button" className="w-btn w-btn-primary" onClick={onNew}><FilePlus2 size={13} /> New page</button> : undefined}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[880px] px-4 py-6 md:px-8">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-[20px] font-semibold tracking-[-0.01em]">Project documents</h2>
        {/* Đợt S5c: AI soạn SRS từ requirement/story/epic ⇒ ĐỀ XUẤT draft_page, người dùng Apply mới tạo trang. */}
        {canEdit && config.permissions.useAi && (
          <button type="button" className="w-btn w-btn-sm ml-auto" onClick={() => openAiPanel({ pid: config.id, quick: { task: 'draft_srs' } })}>
            <Sparkles size={13} /> Draft SRS with AI
          </button>
        )}
      </div>
      <p className="mt-1 text-[13px] text-[var(--w-text-2)]">{list.pages.length} page{list.pages.length === 1 ? '' : 's'} · pick one on the left, or search the text of every page.</p>

      <div className="relative mt-4">
        <Search size={14} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
        <input className="w-input !h-10 !pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search inside documents" aria-label="Search inside documents" />
      </div>

      {term.length >= 2 ? (
        <section className="mt-4">
          {search.isLoading ? <PageLoading rows={3} /> : (search.data ?? []).length ? (
            <ul className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
              {search.data!.map((h) => (
                <li key={h.id} className="border-b border-[var(--w-border)] last:border-b-0">
                  <Link href={`${base}/${h.number}`} className="block px-3 py-2.5 hover:bg-[var(--w-hover)]">
                    <span className="flex items-center gap-2 text-[13.5px] font-medium"><FileText size={13} className="shrink-0 text-[var(--w-text-3)]" /><span className="truncate">{h.title}</span></span>
                    <span className="mt-0.5 block text-[12.5px] leading-relaxed text-[var(--w-text-2)] [overflow-wrap:anywhere]">{h.snippet}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="py-6 text-center text-[13px] text-[var(--w-text-3)]">No page mentions “{term}”.</p>}
        </section>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(Object.keys(counts) as PageStatus[]).map((s) => (
              <div key={s} className="rounded-[8px] border border-[var(--w-border)] px-3 py-2.5">
                <div className="text-[20px] font-semibold tabular">{counts[s]}</div>
                <div className="text-[12px] text-[var(--w-text-3)]">{PAGE_STATUS[s].label}</div>
              </div>
            ))}
          </div>
          <section className="mt-6">
            <h3 className="w-section-title mb-2">Recently updated</h3>
            <ul className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
              {recent.map((p) => (
                <li key={p.id} className="border-b border-[var(--w-border)] last:border-b-0">
                  <Link href={`${base}/${p.number}`} className="flex min-w-0 items-center gap-2.5 px-3 py-2.5 text-[13.5px] hover:bg-[var(--w-hover)]">
                    <FileText size={14} className="shrink-0 text-[var(--w-text-3)]" />
                    <span className="min-w-0 flex-1 truncate">{p.title}</span>
                    <VisibilityBadge visibility={p.visibility} compact />
                    {p.status !== 'DRAFT' && <PageStatusPill status={p.status} className="max-sm:hidden" />}
                    {p.owner && <UserAvatar user={p.owner} size={18} />}
                    <span className="shrink-0 text-[12px] text-[var(--w-text-3)]">{relativeTime(p.updatedAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
