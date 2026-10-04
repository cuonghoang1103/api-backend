'use client';

/**
 * Cây tài liệu bên trái trang Docs (S2a).
 *  · Kéo thả (chuột): thả lên NỬA TRÊN/DƯỚI một hàng ⇒ đặt trước/sau nó; thả vào
 *    GIỮA hàng ⇒ thành trang con. Server chặn thả vào chính con cháu của nó.
 *  · Bàn phím / điện thoại (không kéo được): menu ⋯ của từng hàng có Move up /
 *    Move down / Move out a level — cùng một API move.
 *  · Đổi tên tại chỗ (menu ⋯ → Rename, hoặc F2 khi hàng đang chọn).
 *  · Trạng thái mở/đóng nhánh nhớ theo dự án (localStorage, hỏng thì thôi).
 */

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ChevronRight, FileText, MoreHorizontal, Plus, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workDocsApi, workDocsKeys, workError, type ProjectConfig, type WorkPageItem, type WorkPageList } from '@/lib/work-api';
import { useAuthStore } from '@/store/authStore';
import { Popover } from '../ui';
import { ConfirmDialog } from '../settings/shared';
import { StatusDot, VisibilityBadge, buildTree, docsBase, type TreeNode } from './shared';

type Zone = 'before' | 'after' | 'inside';

/** null = chưa lưu lần nào (mở sẵn các trang gốc có con — cây mới tạo không trông rỗng). */
function loadOpen(pid: number): Set<number> | null {
  try {
    const raw = localStorage.getItem(`ctw-docs-open-${pid}`);
    return raw ? new Set(JSON.parse(raw) as number[]) : null;
  } catch {
    return null;
  }
}
function saveOpen(pid: number, s: Set<number>) {
  try { localStorage.setItem(`ctw-docs-open-${pid}`, JSON.stringify([...s].slice(0, 500))); } catch { /* chế độ riêng tư */ }
}

export default function DocsTree({ config, list, activeNum, onNew, onNavigate }: {
  config: ProjectConfig;
  list: WorkPageList;
  activeNum?: number;
  /** Mở hộp "New page" với cha đã chọn (null = gốc). */
  onNew: (parentNumber: number | null) => void;
  onNavigate?: () => void;
}) {
  const pid = config.id;
  const qc = useQueryClient();
  const meId = useAuthStore((s) => s.user?.id);
  const canEdit = list.canEdit && !!config.permissions.editDocs;
  const tree = useMemo(() => buildTree(list.pages), [list.pages]);
  const byId = useMemo(() => new Map(list.pages.map((p) => [p.id, p])), [list.pages]);
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  const [filter, setFilter] = useState('');
  const [drag, setDrag] = useState<number | null>(null);
  const [over, setOver] = useState<{ id: number; zone: Zone } | null>(null);
  const [renaming, setRenaming] = useState<number | null>(null);
  const [menu, setMenu] = useState<number | null>(null);
  const [confirmDel, setConfirmDel] = useState<WorkPageItem | null>(null);
  const menuAnchor = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const saved = loadOpen(pid);
    if (saved) { setOpen(saved); return; }
    setOpen(new Set(list.pages.filter((p) => p.parentId === null && list.pages.some((c) => c.parentId === p.id)).map((p) => p.id)));
    // Chỉ khi đổi dự án — danh sách đổi (realtime) không được mở lại nhánh người dùng đã đóng.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pid]);
  // Mở sẵn nhánh chứa trang đang xem.
  useEffect(() => {
    const active = list.pages.find((p) => p.number === activeNum);
    if (!active) return;
    setOpen((cur) => {
      const next = new Set(cur);
      let p = active.parentId;
      let changed = false;
      for (let i = 0; p !== null && i < 20; i++) {
        if (!next.has(p)) { next.add(p); changed = true; }
        p = byId.get(p)?.parentId ?? null;
      }
      if (!changed) return cur;
      saveOpen(pid, next);
      return next;
    });
  }, [activeNum, list.pages, byId, pid]);

  const toggle = (id: number) => setOpen((cur) => {
    const next = new Set(cur);
    if (next.has(id)) next.delete(id); else next.add(id);
    saveOpen(pid, next);
    return next;
  });

  const setList = (l: WorkPageList) => qc.setQueryData(workDocsKeys.list(pid), l);
  const move = useMutation({
    mutationFn: (v: { num: number; parentNumber: number | null; index: number }) => workDocsApi.move(pid, v.num, v.parentNumber, v.index),
    onSuccess: (l) => { setList(l); qc.invalidateQueries({ queryKey: workDocsKeys.all(pid) }); },
    onError: (err) => toast.error(workError(err, 'Could not move the page')),
  });
  const rename = useMutation({
    mutationFn: (v: { num: number; title: string }) => workDocsApi.update(pid, v.num, { title: v.title }),
    onSuccess: () => qc.invalidateQueries({ queryKey: workDocsKeys.all(pid) }),
    onError: (err) => toast.error(workError(err, 'Could not rename the page')),
  });
  const remove = useMutation({
    mutationFn: (num: number) => workDocsApi.remove(pid, num),
    onSuccess: (r) => {
      toast.success(r.deleted > 1 ? `Deleted the page and ${r.deleted - 1} sub-page${r.deleted > 2 ? 's' : ''}` : 'Page deleted');
      setConfirmDel(null);
      qc.invalidateQueries({ queryKey: workDocsKeys.all(pid) });
    },
    onError: (err) => toast.error(workError(err, 'Could not delete the page')),
  });

  /** Anh em (cùng cha), theo thứ tự hiển thị. */
  const siblingsOf = (p: WorkPageItem) => list.pages
    .filter((x) => (x.parentId !== null && byId.has(x.parentId) ? x.parentId : null) === (p.parentId !== null && byId.has(p.parentId) ? p.parentId : null))
    .sort((a, b) => a.position - b.position || a.id - b.id);
  const numOf = (id: number | null) => (id === null ? null : byId.get(id)?.number ?? null);

  const drop = (target: WorkPageItem, zone: Zone) => {
    const src = drag !== null ? byId.get(drag) : null;
    setDrag(null);
    setOver(null);
    if (!src || src.id === target.id) return;
    if (zone === 'inside') {
      const n = list.pages.filter((x) => x.parentId === target.id && x.id !== src.id).length;
      move.mutate({ num: src.number, parentNumber: target.number, index: n });
      setOpen((cur) => { const next = new Set(cur).add(target.id); saveOpen(pid, next); return next; });
      return;
    }
    const sibs = siblingsOf(target).filter((x) => x.id !== src.id);
    const i = sibs.findIndex((x) => x.id === target.id);
    move.mutate({ num: src.number, parentNumber: numOf(target.parentId), index: zone === 'before' ? i : i + 1 });
  };

  const nudge = (p: WorkPageItem, d: -1 | 1) => {
    const sibs = siblingsOf(p);
    const i = sibs.findIndex((x) => x.id === p.id);
    const j = i + d;
    if (j < 0 || j >= sibs.length) return;
    move.mutate({ num: p.number, parentNumber: numOf(p.parentId), index: j });
  };
  const outdent = (p: WorkPageItem) => {
    const parent = p.parentId !== null ? byId.get(p.parentId) : null;
    if (!parent) return;
    const sibs = siblingsOf(parent);
    move.mutate({ num: p.number, parentNumber: numOf(parent.parentId), index: sibs.findIndex((x) => x.id === parent.id) + 1 });
  };

  const q = filter.trim().toLowerCase();
  const matches = q ? list.pages.filter((p) => p.title.toLowerCase().includes(q)) : null;
  const base = docsBase(config);
  const menuPage = menu !== null ? byId.get(menu) ?? null : null;

  const renderRow = (p: WorkPageItem, depth: number, hasKids: boolean, isOpen: boolean) => {
    const active = p.number === activeNum;
    const z = over?.id === p.id ? over.zone : null;
    return (
      <div
        key={p.id}
        draggable={canEdit && renaming !== p.id}
        onDragStart={(e) => { setDrag(p.id); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(p.number)); }}
        onDragEnd={() => { setDrag(null); setOver(null); }}
        onDragOver={(e) => {
          if (drag === null || drag === p.id) return;
          e.preventDefault();
          const r = e.currentTarget.getBoundingClientRect();
          const y = (e.clientY - r.top) / r.height;
          setOver({ id: p.id, zone: y < 0.28 ? 'before' : y > 0.72 ? 'after' : 'inside' });
        }}
        onDragLeave={() => setOver((o) => (o?.id === p.id ? null : o))}
        onDrop={(e) => { e.preventDefault(); if (z) drop(p, z); }}
        className={cn(
          'group relative flex h-8 items-center gap-1 rounded-[6px] pr-1 text-[13.5px]',
          active ? 'bg-[var(--w-active)] font-medium text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text)]',
          z === 'inside' && 'bg-[var(--w-accent-soft)] shadow-[inset_0_0_0_1px_var(--w-accent-border)]',
          drag === p.id && 'opacity-50',
        )}
        style={{ paddingLeft: 4 + depth * 14 }}
        data-doc-row={p.number}
      >
        {z === 'before' && <span aria-hidden="true" className="pointer-events-none absolute inset-x-1 top-0 h-[2px] rounded bg-[var(--w-accent)]" />}
        {z === 'after' && <span aria-hidden="true" className="pointer-events-none absolute inset-x-1 bottom-0 h-[2px] rounded bg-[var(--w-accent)]" />}
        <button
          type="button"
          onClick={() => hasKids && toggle(p.id)}
          aria-label={hasKids ? (isOpen ? `Collapse ${p.title}` : `Expand ${p.title}`) : undefined}
          aria-hidden={!hasKids}
          tabIndex={hasKids ? 0 : -1}
          className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] text-[var(--w-text-3)]', hasKids ? 'hover:bg-[var(--w-hover)]' : 'invisible')}
        >
          <ChevronRight size={13} className={cn('transition-transform', isOpen && 'rotate-90')} />
        </button>
        {renaming === p.id ? (
          <RenameInput
            initial={p.title}
            onDone={(t) => {
              setRenaming(null);
              if (t && t !== p.title) rename.mutate({ num: p.number, title: t });
            }}
          />
        ) : (
          <Link
            href={`${base}/${p.number}`}
            onClick={onNavigate}
            onKeyDown={(e) => { if (e.key === 'F2' && canEdit) { e.preventDefault(); setRenaming(p.id); } }}
            aria-current={active ? 'page' : undefined}
            className="flex min-w-0 flex-1 items-center gap-1.5 truncate py-1"
            title={p.title}
          >
            <FileText size={14} className={cn('shrink-0', active ? 'text-[var(--w-accent-text)]' : 'opacity-70')} />
            <span className="min-w-0 truncate">{p.title}</span>
            <StatusDot status={p.status} />
            <VisibilityBadge visibility={p.visibility} compact />
          </Link>
        )}
        {canEdit && renaming !== p.id && (
          <span className="absolute right-1 top-1/2 hidden -translate-y-1/2 items-center rounded-[6px] bg-[var(--w-raised)] shadow-[0_0_0_1px_var(--w-border)] focus-within:flex group-hover:flex max-md:static max-md:flex max-md:translate-y-0 max-md:bg-transparent max-md:shadow-none">
            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`Add a page inside ${p.title}`} title="Add a sub-page" onClick={() => onNew(p.number)}>
              <Plus size={13} />
            </button>
            <button
              type="button"
              className="w-btn w-btn-ghost w-btn-icon w-btn-sm"
              aria-label={`More actions for ${p.title}`}
              onClick={(e) => { menuAnchor.current = e.currentTarget; setMenu(p.id); }}
            >
              <MoreHorizontal size={13} />
            </button>
          </span>
        )}
      </div>
    );
  };

  const renderNodes = (nodes: TreeNode[]): React.ReactNode =>
    nodes.map((n) => {
      const isOpen = open.has(n.page.id);
      return (
        <div key={n.page.id} role="treeitem" aria-expanded={n.children.length ? isOpen : undefined} aria-selected={n.page.number === activeNum}>
          {renderRow(n.page, n.depth, n.children.length > 0, isOpen)}
          {isOpen && n.children.length > 0 && <div role="group">{renderNodes(n.children)}</div>}
        </div>
      );
    });

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-1.5 px-3 pb-2 pt-3">
        <div className="relative min-w-0 flex-1">
          <Search size={13} aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
          <input
            className="w-input !h-8 !pl-7"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter pages"
            aria-label="Filter pages by title"
          />
          {filter && (
            <button type="button" className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--w-text-3)] hover:text-[var(--w-text)]" aria-label="Clear filter" onClick={() => setFilter('')}><X size={12} /></button>
          )}
        </div>
        {canEdit && (
          <button type="button" className="w-btn w-btn-icon !h-8 !w-8" aria-label="New page" title="New page" onClick={() => onNew(null)}>
            <Plus size={14} />
          </button>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4" role="tree" aria-label="Project documents">
        {matches ? (
          matches.length ? matches.map((p) => renderRow(p, 0, false, false)) : <p className="px-3 py-6 text-center text-[12px] text-[var(--w-text-3)]">No page title matches “{filter}”.</p>
        ) : tree.length ? (
          renderNodes(tree)
        ) : (
          <p className="px-3 py-6 text-center text-[12px] leading-relaxed text-[var(--w-text-3)]">
            {canEdit ? 'No pages yet. Start from a template — SRS, SOW, test plan, runbook…' : 'No documents have been shared with you yet.'}
          </p>
        )}
        {canEdit && tree.length > 0 && !matches && (
          <div
            onDragOver={(e) => { if (drag !== null) e.preventDefault(); }}
            onDrop={(e) => {
              e.preventDefault();
              const src = drag !== null ? byId.get(drag) : null;
              setDrag(null);
              setOver(null);
              if (src) move.mutate({ num: src.number, parentNumber: null, index: tree.length });
            }}
            className={cn('mt-1 h-8 rounded-[6px] border border-dashed border-transparent text-center text-[11px] leading-8 text-[var(--w-text-3)]', drag !== null && 'border-[var(--w-border-strong)]')}
          >
            {drag !== null ? 'Drop here to move to the top level' : ''}
          </div>
        )}
      </div>

      <Popover open={!!menuPage} onClose={() => setMenu(null)} anchorRef={menuAnchor} width={210} align="end">
        {menuPage && (
          <div className="p-1" role="menu">
            {[
              { label: 'Rename', run: () => setRenaming(menuPage.id) },
              { label: 'Add a sub-page', run: () => onNew(menuPage.number) },
              { label: 'Move up', run: () => nudge(menuPage, -1) },
              { label: 'Move down', run: () => nudge(menuPage, 1) },
              ...(menuPage.parentId !== null && byId.has(menuPage.parentId) ? [{ label: 'Move out one level', run: () => outdent(menuPage) }] : []),
              ...(list.canManage || (meId !== undefined && menuPage.ownerId === meId) ? [{ label: 'Delete…', danger: true, run: () => setConfirmDel(menuPage) }] : []),
            ].map((it) => (
              <button
                key={it.label}
                type="button"
                role="menuitem"
                className={cn('flex w-full items-center rounded-[5px] px-2 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)]', 'danger' in it && it.danger && 'text-[var(--w-red)]')}
                onClick={() => { setMenu(null); it.run(); }}
              >
                {it.label}
              </button>
            ))}
          </div>
        )}
      </Popover>
      <ConfirmDialog
        open={!!confirmDel}
        onClose={() => setConfirmDel(null)}
        onConfirm={() => confirmDel && remove.mutate(confirmDel.number)}
        pending={remove.isPending}
        title="Delete page"
        body={confirmDel ? `“${confirmDel.title}” and every page inside it will be deleted. Only the page owner or a project admin can do this.` : ''}
        confirmLabel="Delete"
      />
    </div>
  );
}

function RenameInput({ initial, onDone }: { initial: string; onDone: (title: string | null) => void }) {
  const [v, setV] = useState(initial);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); ref.current?.select(); }, []);
  return (
    <input
      ref={ref}
      className="w-input !h-7 min-w-0 flex-1 !px-1.5"
      value={v}
      maxLength={255}
      aria-label="Page title"
      onChange={(e) => setV(e.target.value)}
      onBlur={() => onDone(v.trim() || null)}
      onKeyDown={(e) => {
        if (e.nativeEvent.isComposing) return;
        if (e.key === 'Enter') { e.preventDefault(); onDone(v.trim() || null); }
        if (e.key === 'Escape') { e.preventDefault(); onDone(null); }
      }}
    />
  );
}
