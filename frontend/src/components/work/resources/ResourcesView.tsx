'use client';

/**
 * RESOURCES — /work/<ws>/<KEY>/resources (06/10/2026, mô-đun resources): thư viện link của dự án.
 *
 * Lưới thẻ theo nhóm (biểu tượng loại, favicon, tiêu đề, mô tả, nhãn, ghim ⭐), kéo-thả giữa nhóm (HTML5 DnD — thả
 * lên một thẻ ⇒ chèn trước nó, thả vào vùng trống của nhóm ⇒ cuối nhóm), ô tìm (bỏ dấu — server lọc), lọc nhóm /
 * nhãn / loại / trạng thái link, "Add link" (dán URL ⇒ tự điền tiêu đề), "Import" (Markdown / CSV, chạy thử trước),
 * chế độ danh sách gọn. `?status=BROKEN` (link trong thông báo link chết) mở thẳng bộ lọc.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  AlertTriangle, Eye, FileUp, LayoutGrid, List, MoreHorizontal, PanelLeft, Pencil, Plus, RefreshCw, Search, Star, Trash2, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError, type ProjectConfig } from '@/lib/work-api';
import {
  openResourceLink, resApi, resKeys, type ImportResult, type LinkStatus, type ResourceFilter, type ResourceGroup, type ResourceList, type WorkResource,
} from '@/lib/work-resources-api';
import { Dialog, EmptyState, PageLoading, Popover, Spinner, relativeTime, useToggle } from '../ui';
import { ConfirmDialog, Select } from '../settings/shared';
import { studioOn } from '../studio/shared';
import { Favicon, GroupDialog, KindIcon, ResourceDialog, ResourcePreviewDialog, compactNumber, kindLabel } from './shared';
import { wt } from '@/components/work/i18n';

const VIEW_KEY = 'ctw-resources-view';

function useDebounced<T>(v: T, ms = 250): T {
  const [x, setX] = useState(v);
  useEffect(() => { const t = setTimeout(() => setX(v), ms); return () => clearTimeout(t); }, [v, ms]);
  return x;
}

// ─── Một link ────────────────────────────────────────────────────

function StatusDot({ r }: { r: WorkResource }) {
  if (r.linkStatus !== 'BROKEN') return null;
  const why = r.check?.error === 'DNS' ? wt('res.domainNotFound') : r.check?.status ? `HTTP ${r.check.status}` : wt('res.notReachable');
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,#dc2626_14%,transparent)] px-1.5 py-0.5 text-[11px] font-medium text-[#dc2626]" title={wt('res.brokenTitle', { w: why, t: r.checkedAt ? relativeTime(r.checkedAt) : '' })}>
      <AlertTriangle size={11} /> {wt('res.broken')}
    </span>
  );
}

function ItemMenu({ r, canEdit, onEdit, onDelete, onToggle, onRefresh }: {
  r: WorkResource; canEdit: boolean; onEdit: () => void; onDelete: () => void; onRefresh: () => void;
  onToggle: (p: Partial<Pick<WorkResource, 'pinned' | 'pinnedToSidebar'>>) => void;
}) {
  const m = useToggle();
  const anchor = useRef<HTMLButtonElement>(null);
  if (!canEdit) return null;
  return (
    <>
      <button ref={anchor} type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('res.moreFor', { t: r.title })} onClick={(e) => { e.stopPropagation(); m.toggle(); }}>
        <MoreHorizontal size={14} />
      </button>
      <Popover open={m.on} onClose={m.close} anchorRef={anchor} width={210} align="end">
        <div className="p-1 text-[13px]" role="menu">
          <button type="button" role="menuitem" className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 hover:bg-[var(--w-hover)]" onClick={() => { m.close(); onEdit(); }}><Pencil size={13} /> {wt('common.edit')}</button>
          <button type="button" role="menuitem" className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 hover:bg-[var(--w-hover)]" onClick={() => { m.close(); onToggle({ pinnedToSidebar: !r.pinnedToSidebar }); }}>
            <PanelLeft size={13} /> {r.pinnedToSidebar ? wt('res.unpinSidebar') : wt('res.pinToSidebar')}
          </button>
          {r.kind === 'github' && <button type="button" role="menuitem" className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 hover:bg-[var(--w-hover)]" onClick={() => { m.close(); onRefresh(); }}><RefreshCw size={13} /> {wt('res.refreshGh')}</button>}
          <button type="button" role="menuitem" className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-[var(--w-danger,#dc2626)] hover:bg-[var(--w-hover)]" onClick={() => { m.close(); onDelete(); }}><Trash2 size={13} /> {wt('common.delete')}</button>
        </div>
      </Popover>
    </>
  );
}

interface ItemProps {
  r: WorkResource; pid: number; compact: boolean; dragging: boolean; canDrag: boolean;
  onEdit: () => void; onDelete: () => void; onRefresh: () => void; onPreview: () => void;
  onToggle: (p: Partial<Pick<WorkResource, 'pinned' | 'pinnedToSidebar'>>) => void;
  onTag: (t: string) => void;
  onDragStart: () => void; onDragEnd: () => void; onDropBefore: () => void;
}

function ResourceItem({ r, pid, compact, dragging, canDrag, onEdit, onDelete, onRefresh, onPreview, onToggle, onTag, onDragStart, onDragEnd, onDropBefore }: ItemProps) {
  const [over, setOver] = useState(false);
  const canEdit = !!r.canEdit;
  const dnd = {
    draggable: canDrag,
    onDragStart: (e: React.DragEvent) => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(r.id)); onDragStart(); },
    onDragEnd: () => { setOver(false); onDragEnd(); },
    onDragOver: (e: React.DragEvent) => { if (!dragging) return; e.preventDefault(); e.stopPropagation(); setOver(true); },
    onDragLeave: () => setOver(false),
    onDrop: (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setOver(false); onDropBefore(); },
  };
  // Màu sao bằng style: .w-btn (work.css nạp SAU Tailwind) đè class text-*.
  const star = (
    <button type="button" aria-pressed={r.pinned} aria-label={r.pinned ? wt('res.unstar') : wt('res.star')} title={r.pinned ? wt('res.starredTop') : wt('res.star')}
      disabled={!canEdit} onClick={(e) => { e.stopPropagation(); onToggle({ pinned: !r.pinned }); }}
      style={{ color: r.pinned ? '#eab308' : 'var(--w-text-3)' }}
      className={cn('w-btn w-btn-ghost w-btn-icon w-btn-sm', !canEdit && 'pointer-events-none')}>
      <Star size={14} fill={r.pinned ? 'currentColor' : 'none'} />
    </button>
  );
  const open = () => openResourceLink(pid, r);
  const preview = r.embeddable ? (
    <button type="button" aria-label={wt('res.previewOf', { t: r.title })} title={wt('res.preview')}
      onClick={(e) => { e.stopPropagation(); onPreview(); }}
      className="w-btn w-btn-ghost w-btn-icon w-btn-sm" data-testid={`resource-preview-${r.id}`}>
      <Eye size={14} />
    </button>
  ) : null;

  if (compact) {
    return (
      <div {...dnd} data-testid={`resource-${r.id}`} className={cn('group flex items-center gap-2.5 border-b border-[var(--w-border)] px-2 py-1.5 last:border-b-0', over && 'shadow-[inset_0_2px_0_var(--w-accent)]')}>
        <Favicon r={r} size={16} />
        <button type="button" onClick={open} className="min-w-0 flex-1 truncate text-left text-[13.5px] font-medium hover:underline" title={r.url}>{r.title}</button>
        <span className="hidden max-w-[30%] truncate text-[12px] text-[var(--w-text-3)] md:inline">{r.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
        {r.tags.slice(0, 3).map((t) => <button key={t} type="button" onClick={() => onTag(t)} className="hidden rounded-full bg-[var(--w-hover)] px-1.5 text-[11px] text-[var(--w-text-2)] sm:inline">#{t}</button>)}
        <StatusDot r={r} />
        {r.visibility === 'CLIENT' && <span title={wt('res.visibleClient')}><Eye size={13} className="text-[var(--w-text-3)]" /></span>}
        {preview}
        {star}
        <ItemMenu r={r} canEdit={canEdit} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} onRefresh={onRefresh} />
      </div>
    );
  }

  return (
    <div {...dnd} data-testid={`resource-${r.id}`}
      className={cn('w-card group relative flex min-w-0 flex-col gap-1.5 p-3 transition-shadow', over && 'ring-2 ring-[var(--w-accent)]', canDrag && 'cursor-grab active:cursor-grabbing')}>
      <div className="flex items-start gap-2.5">
        <Favicon r={r} size={20} />
        <div className="min-w-0 flex-1">
          <button type="button" onClick={open} className="block max-w-full truncate text-left text-[14px] font-semibold leading-snug hover:underline" title={wt('res.openUrl', { u: r.url })}>{r.title}</button>
          <div className="flex items-center gap-1 truncate text-[11.5px] text-[var(--w-text-3)]">
            <KindIcon kind={r.kind} size={11} /> {kindLabel(r.kind)} · <span className="truncate">{r.url.replace(/^(https?:\/\/|mailto:)(www\.)?/, '')}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center">{preview}{star}<ItemMenu r={r} canEdit={canEdit} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} onRefresh={onRefresh} /></div>
      </div>
      {(r.description || r.github?.description) && <p className="line-clamp-2 text-[12.5px] leading-snug text-[var(--w-text-2)]">{r.description || r.github?.description}</p>}
      {r.github && (
        <p className="text-[11.5px] text-[var(--w-text-3)]">
          ★ {compactNumber(r.github.stars)}{r.github.language ? ` · ${r.github.language}` : ''}{r.github.defaultBranch ? ` · ${r.github.defaultBranch}` : ''}{r.github.lastCommitAt ? wt('res.pushedT', { t: relativeTime(r.github.lastCommitAt) }) : ''}
        </p>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-1 pt-0.5">
        {r.tags.map((t) => <button key={t} type="button" onClick={() => onTag(t)} className="rounded-full bg-[var(--w-hover)] px-1.5 py-0.5 text-[11px] text-[var(--w-text-2)] hover:text-[var(--w-text)]">#{t}</button>)}
        <StatusDot r={r} />
        {r.visibility === 'CLIENT' && <span className="inline-flex items-center gap-1 text-[11px] text-[var(--w-text-3)]" title={wt('res.visibleClient')}><Eye size={11} /> {wt('docs.clientTag')}</span>}
        {r.pinnedToSidebar && <span className="inline-flex items-center gap-1 text-[11px] text-[var(--w-text-3)]" title={wt('res.pinnedSidebar')}><PanelLeft size={11} /></span>}
        {typeof r.openCount === 'number' && r.openCount > 0 && <span className="ml-auto text-[11px] text-[var(--w-text-3)]" title={r.lastOpenedAt ? wt('res.lastOpened', { t: relativeTime(r.lastOpenedAt) }) : undefined}>{wt('res.nOpens', { count: r.openCount })}</span>}
      </div>
    </div>
  );
}

// ─── Nhập hàng loạt ──────────────────────────────────────────────

const IMPORT_EXAMPLE = `## Source code
- [Game repo](https://github.com/your-team/game) main Unity project #unity
## Audio
- Footsteps: https://freesound.org/people/x/sounds/1/ #sfx

or CSV:
title,url,group,tags
Mixamo idle,https://www.mixamo.com/,3D & Images,anim;mixamo`;

function ImportDialog({ pid, open, onClose, onDone }: { pid: number; open: boolean; onClose: () => void; onDone: () => void }) {
  const [text, setText] = useState('');
  const [format, setFormat] = useState<'auto' | 'markdown' | 'csv'>('auto');
  const [plan, setPlan] = useState<ImportResult | null>(null);
  useEffect(() => { if (open) { setText(''); setPlan(null); setFormat('auto'); } }, [open]);
  const dry = useMutation({ mutationFn: () => resApi.importText(pid, { text, format, dryRun: true }), onSuccess: setPlan, onError: (e) => toast.error(workError(e)) });
  const run = useMutation({
    mutationFn: () => resApi.importText(pid, { text, format }),
    onSuccess: (r) => { toast.success(wt('res.imported', { count: r.created, d: r.duplicates ? wt('res.alreadyThere', { n: r.duplicates }) : '' })); onDone(); onClose(); },
    onError: (e) => toast.error(workError(e)),
  });
  return (
    <Dialog open={open} onClose={onClose} title={wt('res.importLinks')} width={680}
      footer={(
        <>
          <button type="button" className="w-btn" onClick={onClose}>{wt('common.cancel')}</button>
          <button type="button" className="w-btn" disabled={!text.trim() || dry.isPending} onClick={() => dry.mutate()}>{dry.isPending && <Spinner size={12} />}{wt('common.preview')}</button>
          <button type="button" className="w-btn w-btn-primary" disabled={!text.trim() || run.isPending || (plan !== null && plan.willCreate === 0)} onClick={() => run.mutate()} data-testid="resource-import-run">
            {run.isPending && <Spinner size={12} />}Import{plan ? ` ${plan.willCreate}` : ''}
          </button>
        </>
      )}
    >
      <div className="space-y-3">
        <p className="text-[12.5px] text-[var(--w-text-2)]">{wt('res.importHelpA')}<code>## Group</code>{wt('res.importHelpB')}<code>- [Title](url) #tag</code>{wt('res.importHelpC')}<code>title, url, group, tags</code>{wt('res.importHelpD')}</p>
        <div className="flex items-center gap-2 text-[13px]">
          <span className="text-[var(--w-text-2)]">{wt('res.format')}</span>
          <Select value={format} onChange={(e) => { setFormat(e.target.value as typeof format); setPlan(null); }} className="w-auto">
            <option value="auto">{wt('res.detect')}</option><option value="markdown">Markdown</option><option value="csv">CSV</option>
          </Select>
        </div>
        <textarea className="w-input font-mono text-[12.5px]" rows={9} value={text} placeholder={IMPORT_EXAMPLE} onChange={(e) => { setText(e.target.value); setPlan(null); }} data-testid="resource-import-text" />
        {plan && (
          <div className="rounded-[8px] border border-[var(--w-border)]">
            <div className="flex flex-wrap gap-x-4 gap-y-1 border-b border-[var(--w-border)] px-3 py-2 text-[12.5px]">
              <span><b>{plan.willCreate}</b> {wt('res.newLc')}</span>
              <span>{wt('res.alreadyInRes', { n: plan.duplicates })}</span>
              {plan.newGroups.length > 0 && <span>{wt('res.newGroups', { s: plan.newGroups.join(', ') })}</span>}
              <span className="text-[var(--w-text-3)]">{plan.format.toUpperCase()}</span>
            </div>
            <div className="max-h-56 overflow-auto text-[12.5px]">
              {plan.rows.map((r) => (
                <div key={`${r.line}-${r.url}`} className={cn('flex gap-2 px-3 py-1', r.status === 'duplicate' && 'opacity-50')}>
                  <span className="w-8 shrink-0 text-right text-[var(--w-text-3)]">{r.line}</span>
                  <span className="min-w-0 flex-1 truncate">{r.title} <span className="text-[var(--w-text-3)]">{r.url}</span></span>
                  <span className="shrink-0 text-[var(--w-text-3)]">{r.status === 'duplicate' ? wt('res.skip') : r.group ?? wt('res.ungrouped')}</span>
                </div>
              ))}
              {plan.errors.map((e) => (
                <div key={`e${e.line}`} className="flex gap-2 px-3 py-1 text-[#dc2626]"><span className="w-8 shrink-0 text-right">{e.line}</span><span>{e.message}</span></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}

// ─── Trang ───────────────────────────────────────────────────────

export default function ResourcesView({ config }: { config: ProjectConfig }) {
  const pid = config.id;
  const qc = useQueryClient();
  const search = useSearchParams();
  const [q, setQ] = useState('');
  const dq = useDebounced(q);
  const [group, setGroup] = useState<number | 'none' | ''>('');
  const [tag, setTag] = useState('');
  const [kind, setKind] = useState('');
  const [status, setStatus] = useState<LinkStatus | ''>((search?.get('status') as LinkStatus | null) ?? '');
  const [compact, setCompact] = useState(false);
  useEffect(() => { try { setCompact(localStorage.getItem(VIEW_KEY) === 'list'); } catch { /* bỏ qua */ } }, []);
  const setView = (c: boolean) => { setCompact(c); try { localStorage.setItem(VIEW_KEY, c ? 'list' : 'grid'); } catch { /* bỏ qua */ } };

  const filter: ResourceFilter = { q: dq.trim() || undefined, group: group === '' ? undefined : group, tag: tag || undefined, kind: kind || undefined, status: status || undefined };
  const filtered = !!(filter.q || filter.group !== undefined || filter.tag || filter.kind || filter.status);
  const list = useQuery({ queryKey: resKeys.list(pid, filter), queryFn: () => resApi.list(pid, filter), placeholderData: (p) => p });
  const data = list.data;
  const invalidate = () => qc.invalidateQueries({ queryKey: resKeys.all(pid) });

  const [adding, setAdding] = useState<{ groupId: number | null } | null>(null);
  const [editing, setEditing] = useState<WorkResource | null>(null);
  const [previewing, setPreviewing] = useState<WorkResource | null>(null);
  const [deleting, setDeleting] = useState<WorkResource | null>(null);
  const [importing, setImporting] = useState(false);
  const [groupDlg, setGroupDlg] = useState<{ group: ResourceGroup | null } | null>(null);
  const [groupDel, setGroupDel] = useState<ResourceGroup | null>(null);
  const [dragId, setDragId] = useState<number | null>(null);

  const patch = useMutation({
    mutationFn: (v: { id: number; body: Partial<WorkResource> }) => resApi.update(pid, v.id, { pinned: v.body.pinned, pinnedToSidebar: v.body.pinnedToSidebar }),
    onSuccess: invalidate,
    onError: (e) => toast.error(workError(e)),
  });
  const del = useMutation({ mutationFn: (id: number) => resApi.remove(pid, id), onSuccess: () => { toast.success(wt('res.linkDeleted')); setDeleting(null); invalidate(); }, onError: (e) => toast.error(workError(e)) });
  const refresh = useMutation({ mutationFn: (id: number) => resApi.refresh(pid, id), onSuccess: invalidate, onError: (e) => toast.error(workError(e)) });
  const reorder = useMutation({
    mutationFn: (v: { groupId: number | null; ids: number[] }) => resApi.reorder(pid, v.groupId, v.ids),
    onSuccess: invalidate,
    onError: (e) => { toast.error(workError(e)); invalidate(); },
  });
  const saveGroup = useMutation({
    mutationFn: (v: { id?: number; name: string; icon: string | null; color: string | null }) => (v.id ? resApi.updateGroup(pid, v.id, v) : resApi.createGroup(pid, v)),
    onSuccess: () => { setGroupDlg(null); invalidate(); },
    onError: (e) => toast.error(workError(e)),
  });
  const delGroup = useMutation({
    mutationFn: (gid: number) => resApi.deleteGroup(pid, gid),
    onSuccess: (r) => { toast.success(r.moved ? wt('res.groupDeletedMoved', { count: r.moved }) : wt('res.groupDeleted')); setGroupDel(null); invalidate(); },
    onError: (e) => toast.error(workError(e)),
  });
  const moveGroup = useMutation({ mutationFn: (ids: number[]) => resApi.reorderGroups(pid, ids), onSuccess: invalidate, onError: (e) => toast.error(workError(e)) });
  const check = useMutation({
    mutationFn: () => resApi.checkNow(pid),
    onSuccess: (r) => { toast.success(wt('res.checkedN', { count: r.checked, b: r.broken ? wt('res.nBroken', { n: r.broken }) : '' })); invalidate(); },
    onError: (e) => toast.error(workError(e)),
  });

  const sections = useMemo(() => {
    if (!data) return [];
    const by = (gid: number | null) => data.items.filter((r) => r.groupId === gid);
    const out: Array<{ group: ResourceGroup | null; items: WorkResource[] }> = data.groups.map((g) => ({ group: g, items: by(g.id) }));
    const un = by(null);
    if (un.length || (!filtered && data.ungrouped)) out.push({ group: null, items: un });
    // Đang lọc: ẩn nhóm trống cho gọn.
    return filtered ? out.filter((s) => s.items.length) : out;
  }, [data, filtered]);
  const starred = useMemo(() => (data?.items ?? []).filter((r) => r.pinned), [data]);

  if (list.isLoading && !data) return <PageLoading />;
  if (list.error && !data) return <EmptyState title={wt('res.loadResFailed')} body={workError(list.error)} />;
  if (!data) return null;

  const canEdit = data.canEdit;
  const canManage = data.canManage;
  const clientPortal = studioOn(config, 'clientPortal');
  // Kéo-thả chỉ khi không lọc (thứ tự hiển thị = thứ tự thật).
  const dragOn = canEdit && !filtered;

  /** Thả link `dragId` vào nhóm `gid`, trước link `beforeId` (null = cuối nhóm). */
  const dropInto = (gid: number | null, beforeId: number | null) => {
    const id = dragId;
    setDragId(null);
    if (!id || id === beforeId) return;
    const target = data.items.filter((r) => r.groupId === gid && r.id !== id).map((r) => r.id);
    const at = beforeId ? target.indexOf(beforeId) : -1;
    if (at >= 0) target.splice(at, 0, id); else target.push(id);
    // Lạc quan: sửa cache ngay để thẻ không nhảy về chỗ cũ trong lúc chờ server.
    qc.setQueryData<ResourceList>(resKeys.list(pid, filter), (old) => old && ({
      ...old,
      items: [...old.items.filter((r) => r.id !== id && r.groupId !== gid), ...target.map((rid, i) => ({ ...old.items.find((r) => r.id === rid)!, groupId: gid, rank: i }))]
        .sort((a, b) => (a.groupId ?? 1e9) - (b.groupId ?? 1e9) || a.rank - b.rank),
    }));
    reorder.mutate({ groupId: gid, ids: target });
  };

  const groupIds = data.groups.map((g) => g.id);
  const shiftGroup = (gid: number, dir: -1 | 1) => {
    const i = groupIds.indexOf(gid);
    const j = i + dir;
    if (j < 0 || j >= groupIds.length) return;
    const next = [...groupIds];
    [next[i], next[j]] = [next[j], next[i]];
    moveGroup.mutate(next);
  };

  const itemProps = (r: WorkResource, gid: number | null) => ({
    r, pid, compact, dragging: dragId !== null, canDrag: dragOn && (canManage || !!r.canEdit),
    onEdit: () => setEditing(r), onDelete: () => setDeleting(r), onRefresh: () => refresh.mutate(r.id), onPreview: () => setPreviewing(r),
    onToggle: (p: Partial<Pick<WorkResource, 'pinned' | 'pinnedToSidebar'>>) => patch.mutate({ id: r.id, body: p }),
    onTag: (t: string) => setTag(t),
    onDragStart: () => setDragId(r.id), onDragEnd: () => setDragId(null), onDropBefore: () => dropInto(gid, r.id),
  });

  const grid = compact ? 'w-card overflow-hidden' : 'grid gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]';

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 pb-10 pt-3 md:px-6" data-testid="resources-view">
      {/* Thanh công cụ */}
      <div className="sticky top-0 z-10 -mx-4 mb-3 flex flex-wrap items-center gap-2 bg-[var(--w-panel)] px-4 py-2 md:-mx-6 md:px-6">
        <div className="relative min-w-[180px] flex-1 sm:max-w-[320px]">
          <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
          <input className="w-input pl-8" value={q} onChange={(e) => setQ(e.target.value)} placeholder={wt('res.searchPh')} aria-label={wt('res.searchRes')} data-testid="resources-search" />
          {q && <button type="button" className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" aria-label={wt('res.clearSearch')} onClick={() => setQ('')}><X size={13} /></button>}
        </div>
        <Select value={String(group)} onChange={(e) => setGroup(e.target.value === '' ? '' : e.target.value === 'none' ? 'none' : Number(e.target.value))} className="w-auto" aria-label={wt('res.group')}>
          <option value="">{wt('res.allGroups')}</option>
          {data.groups.map((g) => <option key={g.id} value={g.id}>{g.icon ? `${g.icon} ` : ''}{g.name}</option>)}
          <option value="none">{wt('res.ungrouped')}</option>
        </Select>
        {data.tags.length > 0 && (
          <Select value={tag} onChange={(e) => setTag(e.target.value)} className="w-auto" aria-label={wt('res.tag')}>
            <option value="">{wt('res.allTags')}</option>
            {data.tags.map((t) => <option key={t.tag} value={t.tag}>#{t.tag} ({t.count})</option>)}
          </Select>
        )}
        {data.kinds.length > 1 && (
          <Select value={kind} onChange={(e) => setKind(e.target.value)} className="w-auto" aria-label={wt('res.typeL')}>
            <option value="">{wt('res.allTypes')}</option>
            {data.kinds.map((k) => <option key={k.kind} value={k.kind}>{kindLabel(k.kind)} ({k.count})</option>)}
          </Select>
        )}
        {typeof data.broken === 'number' && (data.broken > 0 || status) && (
          <button type="button" className={cn('w-btn w-btn-sm', status === 'BROKEN' && 'w-btn-primary')} onClick={() => setStatus(status === 'BROKEN' ? '' : 'BROKEN')}>
            <AlertTriangle size={13} /> {wt('res.brokenN', { n: data.broken })}
          </button>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          <div className="flex rounded-[6px] border border-[var(--w-border)] p-0.5" role="group" aria-label={wt('res.viewL')}>
            <button type="button" aria-pressed={!compact} className={cn('w-btn w-btn-ghost w-btn-icon w-btn-sm', !compact && 'bg-[var(--w-active)]')} onClick={() => setView(false)} title={wt('res.cards')}><LayoutGrid size={14} /></button>
            <button type="button" aria-pressed={compact} className={cn('w-btn w-btn-ghost w-btn-icon w-btn-sm', compact && 'bg-[var(--w-active)]')} onClick={() => setView(true)} title={wt('res.compactList')}><List size={14} /></button>
          </div>
          {canManage && <button type="button" className="w-btn w-btn-sm" disabled={check.isPending} onClick={() => check.mutate()} title={wt('res.checkDead')}>{check.isPending ? <Spinner size={12} /> : <RefreshCw size={13} />}<span className="hidden lg:inline">{wt('res.checkLinks')}</span></button>}
          {canEdit && <button type="button" className="w-btn w-btn-sm" onClick={() => setGroupDlg({ group: null })}><Plus size={13} /><span className="hidden lg:inline">{wt('res.group')}</span></button>}
          {canEdit && <button type="button" className="w-btn w-btn-sm" onClick={() => setImporting(true)} data-testid="resources-import"><FileUp size={13} /> {wt('res.import')}</button>}
          {canEdit && <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setAdding({ groupId: typeof group === 'number' ? group : null })} data-testid="resources-add"><Plus size={13} /> {wt('res.addLink')}</button>}
        </div>
      </div>

      {data.total === 0 && !filtered && (
        <div className="mb-6 rounded-[10px] border border-dashed border-[var(--w-border)] px-5 py-6 text-center">
          <p className="text-[14px] font-semibold">{wt('res.keepAll')}</p>
          <p className="mx-auto mt-1 max-w-[560px] text-[13px] text-[var(--w-text-2)]">{wt('res.keepAllBody')}</p>
          {canEdit && <div className="mt-3 flex justify-center gap-2"><button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setAdding({ groupId: null })}><Plus size={13} /> {wt('res.addLink')}</button><button type="button" className="w-btn w-btn-sm" onClick={() => setImporting(true)}><FileUp size={13} /> {wt('res.importList')}</button></div>}
        </div>
      )}
      {filtered && data.items.length === 0 && <EmptyState title={wt('res.noMatch')} body={wt('res.noMatchBody')} />}

      {starred.length > 0 && !filtered && (
        <section className="mb-5" aria-label={wt('res.starred')}>
          <h2 className="w-section-title mb-2 flex items-center gap-1.5"><Star size={13} className="text-[#eab308]" fill="currentColor" /> {wt('res.starred')}</h2>
          <div className="flex flex-wrap gap-1.5">
            {starred.map((r) => (
              <button key={r.id} type="button" onClick={() => openResourceLink(pid, r)} className="w-card flex max-w-[260px] items-center gap-2 px-2.5 py-1.5 text-[13px] hover:bg-[var(--w-hover)]" title={r.url}>
                <Favicon r={r} size={15} /><span className="truncate">{r.title}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="space-y-5">
        {sections.map(({ group: g, items }, si) => {
          const gid = g?.id ?? null;
          return (
            <section key={gid ?? 'none'} aria-label={g?.name ?? wt('res.ungrouped')} data-testid={`resource-group-${gid ?? 'none'}`}
              onDragOver={(e) => { if (dragId !== null) e.preventDefault(); }}
              onDrop={(e) => { e.preventDefault(); dropInto(gid, null); }}
              className={cn('rounded-[10px] transition-colors', dragId !== null && 'outline-dashed outline-1 outline-offset-4 outline-[var(--w-border)]')}>
              <div className="mb-2 flex items-center gap-2">
                {g?.color && <span className="h-3 w-1 rounded-full" style={{ background: g.color }} />}
                <h2 className="w-section-title flex items-center gap-1.5">{g?.icon && <span aria-hidden="true">{g.icon}</span>}{g?.name ?? wt('res.ungrouped')}</h2>
                <span className="w-count">{items.length}</span>
                <div className="ml-auto flex items-center gap-0.5">
                  {canEdit && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('res.addLinkTo', { g: g?.name ?? wt('res.ungrouped') })} onClick={() => setAdding({ groupId: gid })}><Plus size={13} /></button>}
                  {canManage && g && !filtered && (
                    <>
                      <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('res.moveGroupUp')} disabled={si === 0} onClick={() => shiftGroup(g.id, -1)}>↑</button>
                      <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('res.moveGroupDown')} disabled={g.id === groupIds[groupIds.length - 1]} onClick={() => shiftGroup(g.id, 1)}>↓</button>
                      <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('res.editGroupN', { n: g.name })} onClick={() => setGroupDlg({ group: g })}><Pencil size={13} /></button>
                      <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('res.deleteGroupN', { n: g.name })} onClick={() => setGroupDel(g)}><Trash2 size={13} /></button>
                    </>
                  )}
                </div>
              </div>
              {items.length ? (
                <div className={grid}>{items.map((r) => <ResourceItem key={r.id} {...itemProps(r, gid)} />)}</div>
              ) : (
                <div className="rounded-[8px] border border-dashed border-[var(--w-border)] px-3 py-3 text-[12.5px] text-[var(--w-text-3)]">
                  {dragId !== null ? wt('res.dropHere') : canEdit ? wt('res.noLinksDrag') : wt('res.noLinks')}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <ResourceDialog pid={pid} open={!!adding || !!editing} onClose={() => { setAdding(null); setEditing(null); }} groups={data.groups} editing={editing}
        defaultGroupId={adding?.groupId ?? null} clientPortal={clientPortal} onSaved={invalidate} />
      <ResourcePreviewDialog pid={pid} resource={previewing} onClose={() => setPreviewing(null)} />
      <ImportDialog pid={pid} open={importing} onClose={() => setImporting(false)} onDone={invalidate} />
      <GroupDialog open={!!groupDlg} onClose={() => setGroupDlg(null)} initial={groupDlg?.group ?? null} pending={saveGroup.isPending}
        onSubmit={(v) => saveGroup.mutate({ ...v, id: groupDlg?.group?.id })} />
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} title={wt('res.deleteLink')} confirmLabel={wt('common.delete')} pending={del.isPending}
        body={wt('res.deleteLinkBody', { t: deleting?.title ?? '' })} onConfirm={() => deleting && del.mutate(deleting.id)} />
      <ConfirmDialog open={!!groupDel} onClose={() => setGroupDel(null)} title={wt('res.deleteGroup')} confirmLabel={wt('res.deleteGroup')} pending={delGroup.isPending}
        body={wt('res.deleteGroupBody', { n: groupDel?.name ?? '', count: groupDel?.count ?? 0 })}
        onConfirm={() => groupDel && delGroup.mutate(groupDel.id)} />
    </div>
  );
}
