'use client';

/**
 * Bộ lọc đã lưu: danh sách (của mình + được chia sẻ), "Save as…", cập nhật
 * câu truy vấn của bộ lọc đang mở, đổi tên/chia sẻ, xoá.
 * Chỉ chủ bộ lọc sửa được; chủ hoặc ADMIN dự án xoá được (backend chặn y hệt).
 */

import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Bookmark, Check, ChevronDown, Pencil, Save, Trash2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { workApi, workError, type ProjectConfig, type SavedFilter } from '@/lib/work-api';
import { wk } from '../hooks';
import { ConfirmDialog } from '../settings/shared';
import { Dialog, Field, Popover, Spinner, useToggle } from '../ui';
import { wt } from '@/components/work/i18n';

export default function SavedFilters({ config, activeId, query, onLoad, onSaved }: {
  config: ProjectConfig;
  /** Bộ lọc đang mở (?filter=). */
  activeId: number | null;
  /** Câu JQL hiện tại — dùng cho "Save as…" và "Save changes". */
  query: string;
  onLoad: (f: SavedFilter) => void;
  onSaved: (f: SavedFilter) => void;
}) {
  const pid = config.id;
  const qc = useQueryClient();
  const meId = useAuthStore((s) => s.user?.id);
  const pop = useToggle();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [dialog, setDialog] = useState<{ mode: 'create' } | { mode: 'edit'; filter: SavedFilter } | null>(null);
  const [confirmDel, setConfirmDel] = useState<SavedFilter | null>(null);

  const list = useQuery({ queryKey: wk.filters(pid), queryFn: () => workApi.savedFilters(pid), staleTime: 30_000 });
  const filters = list.data ?? [];
  const active = filters.find((f) => f.id === activeId) ?? null;
  const dirty = !!active && active.query.trim() !== query.trim();
  const canEdit = (f: SavedFilter) => f.ownerId === meId;
  const canDelete = (f: SavedFilter) => f.ownerId === meId || config.role === 'ADMIN';

  const save = useMutation({
    mutationFn: (body: { id?: number; name: string; query: string; shared?: boolean }) => workApi.saveFilter(pid, body),
    onSuccess: (f, body) => {
      qc.invalidateQueries({ queryKey: wk.filters(pid) });
      toast.success(wt(body.id ? 'issues.filterUpdated' : 'issues.filterSaved', { name: f.name }));
      setDialog(null);
      onSaved(f);
    },
    onError: (err) => toast.error(workError(err, wt('issues.saveFilterFailed'))),
  });
  const del = useMutation({
    mutationFn: (id: number) => workApi.deleteFilter(pid, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: wk.filters(pid) });
      toast.success(wt('issues.filterDeleted'));
      setConfirmDel(null);
    },
    onError: (err) => toast.error(workError(err, wt('issues.deleteFilterFailed'))),
  });

  const mine = filters.filter((f) => f.ownerId === meId);
  const shared = filters.filter((f) => f.ownerId !== meId);

  const row = (f: SavedFilter) => (
    <div key={f.id} className={cn('group flex items-center gap-1 rounded-[5px] pr-1 hover:bg-[var(--w-hover)]', f.id === activeId && 'bg-[var(--w-active)]')}>
      <button
        type="button"
        onClick={() => { pop.close(); onLoad(f); }}
        className="flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5 text-left"
        title={f.query || wt('issues.allIssuesQ')}
      >
        <span className="w-3.5 shrink-0">{f.id === activeId && <Check size={13} className="text-[var(--w-accent-text)]" />}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px]">{f.name}</span>
          <span className="block truncate font-mono text-[10.5px] text-[var(--w-text-3)]">{f.query || wt('issues.allIssuesQ')}</span>
        </span>
        {f.ownerId !== meId ? (
          <span className="shrink-0 text-[11px] text-[var(--w-text-3)]">@{f.owner.username}</span>
        ) : f.shared ? (
          <Users size={12} className="shrink-0 text-[var(--w-text-3)]" aria-label={wt('issues.sharedWithProject')} />
        ) : null}
      </button>
      {canEdit(f) && (
        <button type="button" title={wt('issues.renameShare')} onClick={() => { pop.close(); setDialog({ mode: 'edit', filter: f }); }} className="w-btn w-btn-ghost w-btn-icon w-btn-sm shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100">
          <Pencil size={12} />
        </button>
      )}
      {canDelete(f) && (
        <button type="button" title={wt('issues.deleteFilter')} onClick={() => { pop.close(); setConfirmDel(f); }} className="w-btn w-btn-ghost w-btn-icon w-btn-sm shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100">
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={pop.toggle}
        className={cn('w-btn w-btn-sm gap-1', active && 'w-btn-on')}
        aria-haspopup="menu"
        aria-expanded={pop.on}
      >
        <Bookmark size={13} />
        <span className="max-w-[140px] truncate max-sm:!hidden">{active ? active.name : wt('common.filters')}</span>
        {dirty && <span className="h-1.5 w-1.5 rounded-full bg-[var(--w-accent)]" title={wt('issues.unsaved')} />}
        <ChevronDown size={12} className="opacity-60" />
      </button>
      <Popover open={pop.on} onClose={pop.close} anchorRef={btnRef} width={320} align="end">
        <div className="max-h-[360px] overflow-y-auto p-1">
          {list.isLoading ? (
            <div className="flex justify-center py-4"><Spinner /></div>
          ) : list.isError ? (
            <div className="px-2 py-3 text-[12px] text-[var(--w-red)]">{workError(list.error)}</div>
          ) : !filters.length ? (
            <div className="px-2 py-3 text-[12px] text-[var(--w-text-3)]">{wt('issues.noFilters')}</div>
          ) : (
            <>
              {mine.length > 0 && <div className="px-2 pb-0.5 pt-1.5 text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">{wt('issues.myFilters')}</div>}
              {mine.map(row)}
              {shared.length > 0 && <div className="px-2 pb-0.5 pt-2 text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">{wt('issues.sharedWithProject')}</div>}
              {shared.map(row)}
            </>
          )}
        </div>
        <div className="border-t border-[var(--w-border)] p-1">
          {active && canEdit(active) && dirty && (
            <button
              type="button"
              disabled={save.isPending}
              onClick={() => { pop.close(); save.mutate({ id: active.id, name: active.name, query, shared: active.shared }); }}
              className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)]"
            >
              <Save size={13} /> <span className="truncate">{wt('issues.saveChangesTo', { name: active.name })}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => { pop.close(); setDialog({ mode: 'create' }); }}
            className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)]"
          >
            <Bookmark size={13} /> {wt('issues.saveAs')}
          </button>
        </div>
      </Popover>

      <FilterDialog
        open={!!dialog}
        onClose={() => setDialog(null)}
        initial={dialog?.mode === 'edit' ? dialog.filter : null}
        query={dialog?.mode === 'edit' ? dialog.filter.query : query}
        pending={save.isPending}
        onSubmit={(name, sharedFlag) => {
          if (dialog?.mode === 'edit') save.mutate({ id: dialog.filter.id, name, query: dialog.filter.query, shared: sharedFlag });
          else save.mutate({ name, query, shared: sharedFlag });
        }}
      />
      <ConfirmDialog
        open={!!confirmDel}
        onClose={() => setConfirmDel(null)}
        onConfirm={() => confirmDel && del.mutate(confirmDel.id)}
        title={wt('issues.deleteFilter')}
        body={wt(confirmDel?.shared ? 'issues.deleteFilterShared' : 'issues.deleteFilterBody', { name: confirmDel?.name ?? '' })}
        confirmLabel={wt('issues.deleteFilter')}
        pending={del.isPending}
      />
    </>
  );
}

function FilterDialog({ open, onClose, initial, query, pending, onSubmit }: {
  open: boolean; onClose: () => void; initial: SavedFilter | null; query: string; pending: boolean;
  onSubmit: (name: string, shared: boolean) => void;
}) {
  const [name, setName] = useState('');
  const [shared, setShared] = useState(false);
  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? '');
    setShared(initial?.shared ?? false);
  }, [open, initial]);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={initial ? wt('issues.editFilter') : wt('issues.saveFilter')}
      width={460}
      footer={
        <>
          <button type="button" className="w-btn" onClick={onClose}>{wt('common.cancel')}</button>
          <button type="submit" form="work-filter-form" className="w-btn w-btn-primary" disabled={!name.trim() || pending}>
            {pending && <Spinner size={12} />} {initial ? wt('common.save') : wt('issues.saveFilter')}
          </button>
        </>
      }
    >
      <form id="work-filter-form" onSubmit={(e) => { e.preventDefault(); if (name.trim() && !pending) onSubmit(name.trim(), shared); }}>
        <Field label={wt('common.name')}>
          <input autoFocus value={name} maxLength={100} onChange={(e) => setName(e.target.value)} placeholder={wt('issues.filterNamePh')} className="w-input" />
        </Field>
        <Field label={wt('issues.query')}>
          <div className="max-h-[96px] overflow-y-auto break-words rounded-[var(--w-radius)] bg-[var(--w-sunken)] px-2.5 py-2 font-mono text-[12px] text-[var(--w-text-2)]">
            {query || wt('issues.allIssuesQ')}
          </div>
        </Field>
        <label className="flex cursor-pointer select-none items-start gap-2 text-[13px]">
          <input type="checkbox" checked={shared} onChange={(e) => setShared(e.target.checked)} className="mt-0.5 h-3.5 w-3.5 accent-[var(--w-accent)]" />
          <span>
            {wt('issues.shareWithProject')}
            <span className="block text-[12px] text-[var(--w-text-3)]">{wt('issues.shareHelp')}</span>
          </span>
        </label>
      </form>
    </Dialog>
  );
}
