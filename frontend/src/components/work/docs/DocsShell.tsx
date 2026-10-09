'use client';

/**
 * Khung trang Docs (S2a): cây tài liệu bên trái + nội dung bên phải.
 * Dùng cho /work/<ws>/<KEY>/docs (trang tổng quan) và /docs/<num> (một trang).
 *
 * UX-E (09/10/2026) — người dùng chụp iPad: 4 cột cùng lúc, nội dung còn ~400px.
 *   · Cây trang ẩn/hiện bằng nút hoặc phím `[`; ẩn thì còn thanh mảnh có nút mở lại.
 *   · Panel Details của trang (DocView) ẩn/hiện bằng nút "Details" hoặc `]`.
 *   · Không đủ chỗ (đo thật, xem shell/panes.tsx) ⇒ panel thành NGĂN TRƯỢT:
 *     Details khi khung < 1280px hoặc nội dung còn < 660px; cây trang khi khung < 1024px
 *     hoặc nội dung còn < 620px.
 *   · Focus / Full width (`F`, Esc để thoát): ẩn sidebar dự án + hai panel, nội dung
 *     rộng tối đa nhưng dòng chữ vẫn ~80 ký tự (bảng, code, sơ đồ được rộng hơn).
 * Điện thoại (<768px): /docs hiện cây toàn màn; /docs/<num> chỉ hiện nội dung, nút
 * "Pages" mở cây trong ngăn trượt.
 */

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { FilePlus2, FileText, FileUp, Search, Sparkles } from 'lucide-react';
import { openAiPanel } from '../ai/store';
import { cn } from '@/lib/utils';
import { workDocsApi, type PageStatus, type ProjectConfig, type WorkPageList } from '@/lib/work-api';
import ProjectHeader from '../ProjectHeader';
import { EmptyState, PageLoading, UserAvatar, relativeTime } from '../ui';
import { ModuleOff, studioOn } from '../studio/shared';
import { FocusToggle, PaneDrawer, PaneStrip, PaneToggle, escapePanes, focusBaseOf, toggleFocus, usePaneKeys, usePanes } from '../shell/panes';
import DocView from './DocView';
import DocsTree from './DocsTree';
import NewPageDialog from './NewPageDialog';
import ImportMarkdownDialog from './ImportMarkdownDialog';
import { PAGE_STATUS, PageStatusPill, VisibilityBadge, docsBase, useDocsList } from './shared';
import { wt } from '@/components/work/i18n';

/** Bề ngang cột cây trang / Details và chỗ tối thiểu cho nội dung (gồm lề 2×32px + khe 40px). */
const TREE_W = 272;
const DETAILS_W = 300;
const MIN_MAIN = 660;

export default function DocsShell({ config, num }: { config: ProjectConfig; num?: number }) {
  const on = studioOn(config, 'docs');
  const list = useDocsList(config.id, on);
  const [newFor, setNewFor] = useState<{ parent: number | null } | null>(null);
  // CTW-4: nhập Markdown thành trang mới.
  const [importOpen, setImportOpen] = useState(false);
  const pathname = usePathname() ?? '';
  const panes = usePanes('docs', {
    // Cây trang cần ít chỗ hơn Details: ở 1180px (app desktop, sidebar mở) vẫn giữ cây, chữ còn ~590px.
    left: { width: TREE_W, minFrame: 1024, strip: true, minMain: 620 },
    right: num ? { width: DETAILS_W, minFrame: 1280 } : undefined,
    minMain: MIN_MAIN,
    focusable: !!num,
  });
  const { left: tree, right: details, focus } = panes;
  const onFocus = () => toggleFocus('docs', focusBaseOf(pathname));
  usePaneKeys({
    left: tree.toggle,
    right: num ? details.toggle : undefined,
    focus: num ? onFocus : undefined,
    escape: () => escapePanes('docs'),
  });

  const canEdit = !!list.data?.canEdit && !!config.permissions.editDocs;
  const parent = newFor?.parent ? list.data?.pages.find((p) => p.number === newFor.parent) : null;
  const active = num ? list.data?.pages.find((p) => p.number === num) : undefined;
  // Điện thoại, trang tổng quan: cây trang chiếm cả màn (không có gì để đọc bên cạnh).
  const mobileIndex = !num && panes.frame < 768;

  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title={active ? active.title : 'Docs'}>
        {on && list.data && !mobileIndex && (
          <PaneToggle pane={tree} side="left" label={wt('docs.pages')} shortcut="[" showLabel={tree.mode === 'drawer'} />
        )}
        {on && num && list.data && <FocusToggle on={focus} onToggle={onFocus} compact={panes.frame < 768} />}
        {on && canEdit && !focus && (
          <button type="button" className="w-btn w-btn-sm" onClick={() => setImportOpen(true)} data-testid="docs-import-md-open" title={wt('docs.importTip')}>
            <FileUp size={13} /> <span className="max-lg:hidden">{wt('docs.importMd')}</span>
          </button>
        )}
        {on && canEdit && !focus && (
          <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setNewFor({ parent: null })} data-testid="docs-new">
            <FilePlus2 size={13} /> <span className="max-sm:hidden">{wt('docs.newPage')}</span>
          </button>
        )}
      </ProjectHeader>
      {!on ? (
        <div className="min-h-0 flex-1 overflow-y-auto"><ModuleOff config={config} label={wt('studio.mod_docs')} /></div>
      ) : list.isLoading ? <PageLoading /> : !list.data ? (
        <EmptyState title={wt('docs.loadDocsFailed')} />
      ) : (
        <div ref={panes.ref} className="flex min-h-0 flex-1">
          {(mobileIndex || tree.mode === 'inline') && (
            <aside
              className={cn('shrink-0 border-r border-[var(--w-border)] bg-[var(--w-bg)]', mobileIndex ? 'w-full border-r-0' : '')}
              style={mobileIndex ? undefined : { width: TREE_W }}
              aria-label={wt('docs.docTree')}
              data-testid="docs-tree-pane"
            >
              <DocsTree config={config} list={list.data} activeNum={num} onNew={(p) => setNewFor({ parent: p })} onHide={mobileIndex ? undefined : tree.close} />
            </aside>
          )}
          {!mobileIndex && tree.mode === 'strip' && <PaneStrip label={wt('docs.pages')} shortcut="[" onOpen={tree.toggle} />}
          {!mobileIndex && (
            <main className="min-w-0 flex-1 overflow-y-auto" data-testid="docs-main">
              {num ? <DocView key={num} config={config} num={num} details={details} focus={focus} /> : <DocsHome config={config} list={list.data} onNew={() => setNewFor({ parent: null })} />}
            </main>
          )}
        </div>
      )}
      <ImportMarkdownDialog open={importOpen} onClose={() => setImportOpen(false)} config={config} />
      <NewPageDialog open={!!newFor} onClose={() => setNewFor(null)} config={config} parentNumber={newFor?.parent ?? null} parentTitle={parent?.title ?? null} stageId={parent?.stageId ?? null} />
      {list.data && (
        <PaneDrawer open={tree.drawerOpen} onClose={tree.close} side="left" label={wt('docs.pages')} width={320}>
          <div className="h-full">
            <DocsTree config={config} list={list.data} activeNum={num} onNew={(p) => { tree.close(); setNewFor({ parent: p }); }} onNavigate={tree.close} />
          </div>
        </PaneDrawer>
      )}
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
        title={canEdit ? wt('docs.noDocsYet') : wt('docs.nothingShared')}
        body={canEdit ? wt('docs.noDocsBody') : wt('docs.sharedAppear')}
        action={canEdit ? <button type="button" className="w-btn w-btn-primary" onClick={onNew}><FilePlus2 size={13} /> {wt('docs.newPage')}</button> : undefined}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[880px] px-4 py-6 md:px-8">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-[20px] font-semibold tracking-[-0.01em]">{wt('docs.projectDocs')}</h2>
        {/* Đợt S5c: AI soạn SRS từ requirement/story/epic ⇒ ĐỀ XUẤT draft_page, người dùng Apply mới tạo trang. */}
        {canEdit && config.permissions.useAi && (
          <button type="button" className="w-btn w-btn-sm ml-auto" onClick={() => openAiPanel({ pid: config.id, quick: { task: 'draft_srs' } })}>
            <Sparkles size={13} /> {wt('docs.draftSrsAi')}
          </button>
        )}
      </div>
      <p className="mt-1 text-[13px] text-[var(--w-text-2)]">{wt('docs.nPages', { count: list.pages.length })}</p>

      <div className="relative mt-4">
        <Search size={14} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
        <input className="w-input !h-10 !pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder={wt('docs.searchInside')} aria-label={wt('docs.searchInside')} />
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
          ) : <p className="py-6 text-center text-[13px] text-[var(--w-text-3)]">{wt('docs.noMention', { q: term })}</p>}
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
            <h3 className="w-section-title mb-2">{wt('docs.recentlyUpdated')}</h3>
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
