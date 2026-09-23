'use client';

/**
 * CT Work — bảng lệnh ⌘K / Ctrl+K.
 *
 * Tự lắng nghe phím tắt, đóng thì không render gì. Lọc tay (shouldFilter=false)
 * vì kết quả thẻ đến từ server (khớp cả mô tả) — để cmdk lọc lại theo chữ hiển
 * thị thì những thẻ khớp trong mô tả sẽ bị giấu mất.
 */

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BookOpen, CircleHelp, Columns3, CornerDownLeft, FolderKanban, LayoutGrid, List, Plus, Search, Settings, TextSearch, Users } from 'lucide-react';
import { workApi, workSearchApi, workSearchKeys, type StatusCategory } from '@/lib/work-api';
import { openCreateIssue, wk } from './hooks';
import { useWorkPath } from './WorkSidebar';
import { CATEGORY_DOT, IssueTypeIcon, Spinner, WorkPortal } from './ui';
import { searchHelp } from './help/content';
import { openContextualHelp, openHelp } from './help/store';
import { readHelpLang } from './help/HelpPanel';

const ITEM =
  'flex h-9 cursor-pointer items-center gap-2.5 rounded-[6px] px-2.5 text-[13px] text-[var(--w-text-2)] data-[selected=true]:bg-[var(--w-hover)] data-[selected=true]:text-[var(--w-text)]';
const GROUP =
  '[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-[var(--w-text-3)]';

/** Chấm trạng thái (màu theo nhóm) + tên khi đủ chỗ. */
function StatusDot({ status }: { status: { name: string; category: StatusCategory } | undefined }) {
  if (!status) return null;
  return (
    <span className="flex shrink-0 items-center gap-1.5 text-[11.5px] text-[var(--w-text-3)]" title={status.name}>
      <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full" style={{ background: CATEGORY_DOT[status.category] }} />
      <span className="max-w-[96px] truncate max-sm:hidden">{status.name}</span>
      <span className="sr-only sm:hidden">{status.name}</span>
    </span>
  );
}

const matches = (text: string, q: string) => !q || text.toLowerCase().includes(q.toLowerCase());

export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  if (!open) return null;
  return <Palette onClose={() => setOpen(false)} />;
}

function Palette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { slug, key } = useWorkPath();
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const q = search.trim();

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 200);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [onClose]);

  // Cùng khoá + hàm với useProject() nên dùng chung cache; tự viết lại chỉ để
  // có `enabled` (ngoài trang dự án thì không có slug/key để tra).
  const inProject = !!slug && !!key;
  const resolved = useQuery({
    queryKey: wk.resolve(slug ?? '', key ?? ''),
    queryFn: () => workApi.resolve(slug!, key!),
    enabled: inProject,
    staleTime: Infinity,
    retry: false,
  });
  const pid = inProject ? resolved.data?.projectId : undefined;
  const config = useQuery({
    queryKey: wk.project(pid ?? 0),
    queryFn: () => workApi.project(pid!),
    enabled: !!pid,
    staleTime: 60_000,
  }).data;

  const issues = useQuery({
    queryKey: [...wk.issues(pid ?? 0), 'palette', debounced],
    queryFn: () => workApi.issues(pid!, { q: debounced, limit: 8, includeDone: true }),
    enabled: !!pid && debounced.length > 0,
    staleTime: 10_000,
  });

  // Mọi dự án (từ 2 ký tự): cùng endpoint với trang /work/search, xếp theo độ khớp.
  const global = useQuery({
    queryKey: [...workSearchKeys.all, 'palette', debounced],
    queryFn: () => workSearchApi.search({ q: debounced, limit: 10 }),
    enabled: debounced.length >= 2,
    staleTime: 10_000,
    placeholderData: (prev) => prev,
  });

  const workspace = useQuery({
    queryKey: wk.workspace(slug ?? ''),
    queryFn: () => workApi.workspaceBySlug(slug!),
    enabled: !!slug,
    staleTime: 30_000,
  });
  const workspaces = useQuery({ queryKey: wk.workspaces, queryFn: workApi.workspaces, staleTime: 60_000 });

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  const statusOf = (id: number) => {
    for (const w of config?.workflows ?? []) {
      const s = w.statuses.find((x) => x.id === id);
      if (s) return s;
    }
    return undefined;
  };

  const actions = useMemo(() => {
    const list: Array<{ id: string; label: string; icon: ReactNode; hint?: string; keywords?: string; run: () => void }> = [];
    if (inProject && config?.permissions.createIssues) {
      list.push({
        id: 'create',
        label: 'Create issue',
        icon: <Plus size={15} />,
        hint: 'C',
        run: () => {
          onClose();
          openCreateIssue();
        },
      });
    }
    if (inProject) {
      const base = `/work/${slug}/${key}`;
      list.push({ id: 'board', label: 'Go to board', icon: <Columns3 size={15} />, run: () => go(`${base}/board`) });
      list.push({ id: 'issues', label: 'Go to issues', icon: <List size={15} />, run: () => go(`${base}/list`) });
      list.push({ id: 'project-settings', label: 'Project settings', icon: <Settings size={15} />, run: () => go(`${base}/settings`) });
    }
    list.push({ id: 'search', label: 'Search all issues', icon: <TextSearch size={15} />, keywords: 'find filter jql query advanced', run: () => go('/work/search') });
    if (slug) {
      list.push({ id: 'projects', label: 'All projects', icon: <LayoutGrid size={15} />, run: () => go(`/work/${slug}`) });
      list.push({ id: 'ws-settings', label: 'Workspace settings', icon: <Users size={15} />, run: () => go(`/work/${slug}/settings`) });
    }
    // Trợ giúp luôn có (mọi trang), tìm được bằng cả "guide", "huong dan".
    list.push({
      id: 'help',
      label: 'Help & guide',
      icon: <CircleHelp size={15} />,
      hint: '?',
      keywords: 'guide docs how to tutorial huong dan tro giup',
      run: () => {
        onClose();
        openContextualHelp();
      },
    });
    return list.filter((a) => matches(`${a.label} ${a.keywords ?? ''}`, q));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inProject, config, slug, key, q]);

  const projects = (workspace.data?.projects ?? []).filter((p) => !p.archivedAt && matches(`${p.key} ${p.name}`, q)).slice(0, 8);
  const wsList = (workspaces.data ?? []).filter((w) => matches(w.name, q)).slice(0, 6);
  const issueItems = pid && debounced ? issues.data?.items ?? [] : [];
  // Kết quả mọi dự án, bỏ những thẻ đã hiện trong nhóm dự án hiện tại.
  const globalItems = debounced.length >= 2 ? global.data?.items ?? [] : [];
  // Gõ đúng một khoá (QA-7) ⇒ dòng đầu tiên là "mở thẳng thẻ đó".
  const keyHit = /^[A-Za-z][A-Za-z0-9]*-\d+$/.test(q) ? globalItems.find((i) => i.match === 'key' && i.key.toUpperCase() === q.toUpperCase()) : undefined;
  const localItems = issueItems.filter((i) => i.id !== keyHit?.id);
  const localIds = new Set(issueItems.map((i) => i.id));
  const otherGlobal = globalItems.filter((i) => !localIds.has(i.id) && i.id !== keyHit?.id);
  const showSearchAll = q.length >= 2;
  // Bài hướng dẫn khớp chữ đang gõ (tìm cục bộ, không gọi máy chủ).
  const helpLang = useMemo(() => readHelpLang(), []);
  const helpItems = q.length >= 2 ? searchHelp(q).slice(0, 4) : [];
  const searching = (q.length > 0 && q !== debounced) || (!!pid && issues.isFetching) || (debounced.length >= 2 && global.isFetching);
  const nothing = !actions.length && !projects.length && !wsList.length && !issueItems.length && !globalItems.length && !helpItems.length && !showSearchAll;

  return (
    <WorkPortal>
      <div className="fixed inset-0 z-[90] bg-black/40" onMouseDown={onClose} />
      <div className="pointer-events-none fixed inset-x-0 top-[15vh] z-[91] flex justify-center px-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          style={{ boxShadow: 'var(--w-shadow-pop)' }}
          className="pointer-events-auto w-full max-w-[560px] overflow-hidden rounded-[10px] bg-[var(--w-raised)] text-[var(--w-text)]"
        >
          <Command shouldFilter={false} loop label="Command palette">
            <div className="flex items-center gap-2.5 border-b border-[var(--w-border)] px-3.5">
              <Search size={15} className="shrink-0 text-[var(--w-text-3)]" />
              <Command.Input
                autoFocus
                value={search}
                onValueChange={setSearch}
                placeholder={inProject ? `Search ${key} and all issues, projects, actions…` : 'Search issues, projects, actions…'}
                className="h-12 min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[var(--w-text-3)]"
              />
              {searching && <Spinner size={14} />}
              <kbd className="w-kbd hidden sm:inline-flex">esc</kbd>
            </div>

            <Command.List className="max-h-[min(420px,55vh)] overflow-y-auto overscroll-contain p-1.5">
              {nothing && !searching && (
                <div className="py-8 text-center text-[13px] text-[var(--w-text-3)]">
                  {issues.isError || global.isError ? 'Search failed. Try again.' : 'No results'}
                </div>
              )}

              {keyHit && (
                <Command.Group heading="Jump to" className={GROUP}>
                  <Command.Item key={`key-${keyHit.id}`} value={`key-${keyHit.id}`} onSelect={() => go(keyHit.url)} className={ITEM}>
                    <IssueTypeIcon type={keyHit.type} size={13} />
                    <span className="shrink-0 font-mono text-[12px] font-semibold text-[var(--w-accent-text)]">{keyHit.key}</span>
                    <span className="min-w-0 flex-1 truncate text-[var(--w-text)]">{keyHit.title}</span>
                    <span className="hidden max-w-[120px] shrink-0 truncate text-[11.5px] text-[var(--w-text-3)] sm:inline">{keyHit.project.name}</span>
                    <ArrowRight size={13} className="shrink-0 text-[var(--w-text-3)]" />
                  </Command.Item>
                </Command.Group>
              )}

              {(localItems.length > 0 || otherGlobal.length > 0 || showSearchAll) && (
                <Command.Group heading="Issues" className={GROUP}>
                  {localItems.map((it) => {
                    const type = config?.issueTypes.find((t) => t.id === it.typeId);
                    return (
                      <Command.Item
                        key={`issue-${it.id}`}
                        value={`issue-${it.id}`}
                        onSelect={() => go(`/work/${slug}/${key}/list?issue=${it.number}`)}
                        className={ITEM}
                      >
                        <IssueTypeIcon type={type} size={13} />
                        <span className="w-[64px] shrink-0 truncate font-mono text-[11.5px] text-[var(--w-text-3)]">{`${key}-${it.number}`}</span>
                        <span className="flex min-w-0 flex-1 items-baseline gap-1.5">
                          <span className="min-w-0 truncate text-[var(--w-text)]">{it.title}</span>
                          {config && <span className="shrink-0 truncate text-[11.5px] text-[var(--w-text-3)] max-sm:hidden">· {config.name}</span>}
                        </span>
                        <StatusDot status={statusOf(it.statusId)} />
                      </Command.Item>
                    );
                  })}
                  {otherGlobal.map((it) => (
                    <Command.Item key={`g-${it.id}`} value={`g-${it.id}`} onSelect={() => go(it.url)} className={ITEM}>
                      <IssueTypeIcon type={it.type} size={13} />
                      <span className="w-[64px] shrink-0 truncate font-mono text-[11.5px] text-[var(--w-text-3)]">{it.key}</span>
                      <span className="flex min-w-0 flex-1 items-baseline gap-1.5">
                        <span className="min-w-0 truncate text-[var(--w-text)]">{it.title}</span>
                        <span className="shrink-0 truncate text-[11.5px] text-[var(--w-text-3)] max-sm:hidden">· {it.project.name}</span>
                      </span>
                      <StatusDot status={it.status} />
                    </Command.Item>
                  ))}
                  {showSearchAll && (
                    <Command.Item
                      key="search-all"
                      value="search-all"
                      onSelect={() => go(`/work/search?${new URLSearchParams({ q })}`)}
                      className={ITEM}
                    >
                      <TextSearch size={15} className="shrink-0 text-[var(--w-text-3)]" />
                      <span className="min-w-0 flex-1 truncate">
                        Search all issues for <span className="font-medium text-[var(--w-text)]">“{q}”</span>
                      </span>
                      {global.data && debounced === q && (
                        <span className="shrink-0 text-[11.5px] tabular-nums text-[var(--w-text-3)]">{global.data.total.toLocaleString('en-US')}</span>
                      )}
                    </Command.Item>
                  )}
                </Command.Group>
              )}

              {actions.length > 0 && (
                <Command.Group heading="Actions" className={GROUP}>
                  {actions.map((a) => (
                    <Command.Item key={a.id} value={`action-${a.id}`} onSelect={a.run} className={ITEM}>
                      <span className="flex w-4 shrink-0 justify-center text-[var(--w-text-3)]">{a.icon}</span>
                      <span className="min-w-0 flex-1 truncate">{a.label}</span>
                      {a.hint && <kbd className="w-kbd">{a.hint}</kbd>}
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {projects.length > 0 && (
                <Command.Group heading="Projects" className={GROUP}>
                  {projects.map((p) => (
                    <Command.Item key={`project-${p.id}`} value={`project-${p.id}`} onSelect={() => go(`/work/${slug}/${p.key}/board`)} className={ITEM}>
                      <FolderKanban size={15} className="shrink-0 text-[var(--w-text-3)]" />
                      <span className="w-[48px] shrink-0 truncate font-mono text-[11px] font-semibold text-[var(--w-text-3)]">{p.key}</span>
                      <span className="min-w-0 flex-1 truncate">{p.name}</span>
                      {p.key === key && <span className="shrink-0 text-[11px] text-[var(--w-text-3)]">Current</span>}
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {helpItems.length > 0 && (
                <Command.Group heading="Help" className={GROUP}>
                  {helpItems.map((a) => (
                    <Command.Item
                      key={`help-${a.id}`}
                      value={`help-${a.id}`}
                      onSelect={() => { onClose(); openHelp(a.id); }}
                      className={ITEM}
                    >
                      <BookOpen size={15} className="shrink-0 text-[var(--w-text-3)]" />
                      <span className="min-w-0 flex-1 truncate">{a.title[helpLang]}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {wsList.length > 0 && (
                <Command.Group heading="Workspaces" className={GROUP}>
                  {wsList.map((w) => (
                    <Command.Item key={`ws-${w.id}`} value={`ws-${w.id}`} onSelect={() => go(`/work/${w.slug}`)} className={ITEM}>
                      <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] bg-[var(--w-sunken)] text-[9px] font-bold text-[var(--w-text-2)]">
                        {w.name.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{w.name}</span>
                      {w.slug === slug && <span className="shrink-0 text-[11px] text-[var(--w-text-3)]">Current</span>}
                    </Command.Item>
                  ))}
                </Command.Group>
              )}
            </Command.List>

            <div className="flex items-center gap-4 border-t border-[var(--w-border)] px-3.5 py-2 text-[11px] text-[var(--w-text-3)]">
              <span className="flex items-center gap-1"><kbd className="w-kbd">↑</kbd><kbd className="w-kbd">↓</kbd> navigate</span>
              <span className="flex items-center gap-1"><kbd className="w-kbd"><CornerDownLeft size={10} /></kbd> open</span>
              <span className="hidden items-center gap-1 sm:flex"><kbd className="w-kbd">esc</kbd> close</span>
            </div>
          </Command>
        </div>
      </div>
    </WorkPortal>
  );
}
