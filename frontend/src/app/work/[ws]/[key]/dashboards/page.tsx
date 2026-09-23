'use client';

/**
 * Dashboard của dự án: nhiều dashboard (của mình + được chia sẻ), mỗi cái là
 * một lưới widget. Dashboard đang xem nằm trong `?d=`, thẻ đang mở trong
 * `?issue=` để link chia sẻ được.
 *
 * Chế độ "Edit dashboard" sửa trên BẢN NHÁP cục bộ; chỉ bấm Save mới gửi —
 * backend kiểm lại mọi JQL của widget trước khi lưu.
 */

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ArrowDown, ArrowUp, Check, ChevronDown, LayoutDashboard, Lock, MoreHorizontal, Pencil, Plus, Trash2, Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { userName, workApi, workError, type DashboardWidget, type ProjectConfig, type WorkDashboard } from '@/lib/work-api';
import ProjectHeader from '@/components/work/ProjectHeader';
import IssueDrawer from '@/components/work/IssueDrawer';
import { useLookups, useProject, useProjectRealtime, wk } from '@/components/work/hooks';
import { Dialog, EmptyState, Field, Popover, Spinner, useToggle } from '@/components/work/ui';
import { ConfirmDialog } from '@/components/work/settings/shared';
import { defaultWidgets, WIDGET_META, WidgetBody } from '@/components/work/dashboards/widgets';
import WidgetDialog from '@/components/work/dashboards/WidgetDialog';

// useSearchParams bắt buộc nằm trong <Suspense> — thiếu là Next 14 báo lỗi lúc build.
export default function DashboardsPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner size={20} /></div>}>
      <DashboardsPageInner />
    </Suspense>
  );
}

function DashboardsPageInner() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(decodeURIComponent(params.ws), decodeURIComponent(params.key).toUpperCase());
  if (isLoading) return <div className="flex h-full items-center justify-center"><Spinner size={20} /></div>;
  if (error || !config || !pid) {
    return <EmptyState title="Project not found" body={error ? workError(error) : 'It may have been deleted, or you do not have access.'} />;
  }
  return <DashboardsView config={config} pid={pid} />;
}

/** Bản nháp gắn với id dashboard — đổi sang dashboard khác thì bản nháp tự hết hiệu lực. */
type Draft = { id: number; name: string; shared: boolean; widgets: DashboardWidget[] };

function DashboardsView({ config, pid }: { config: ProjectConfig; pid: number }) {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const sp = useSearchParams();
  const qc = useQueryClient();
  const lk = useLookups(config);
  const meId = useAuthStore((s) => s.user?.id);
  useProjectRealtime(pid);

  const setParams = useCallback((patch: Record<string, string | null>) => {
    const p = new URLSearchParams(sp?.toString());
    Object.entries(patch).forEach(([k, v]) => (v === null ? p.delete(k) : p.set(k, v)));
    const s = p.toString();
    router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
  }, [sp, pathname, router]);

  const list = useQuery({ queryKey: wk.dashboards(pid), queryFn: () => workApi.dashboards(pid), staleTime: 30_000 });
  const dashboards = useMemo(() => list.data ?? [], [list.data]);
  const dParam = Number(sp?.get('d'));
  const current = dashboards.find((d) => d.id === dParam) ?? dashboards[0] ?? null;
  const canEdit = !!current && (current.ownerId === meId || config.role === 'ADMIN');

  const issueParam = Number(sp?.get('issue'));
  const openNum = Number.isInteger(issueParam) && issueParam > 0 ? issueParam : null;
  const openIssue = useCallback((n: number | null) => setParams({ issue: n ? String(n) : null }), [setParams]);

  // ── Sửa ──
  const [rawDraft, setDraft] = useState<Draft | null>(null);
  const draft = rawDraft && current && rawDraft.id === current.id ? rawDraft : null;
  const editing = !!draft;
  const startEdit = (d: WorkDashboard): Draft => ({ id: d.id, name: d.name, shared: d.shared, widgets: d.widgets });

  const save = useMutation({
    mutationFn: (body: { id?: number; name: string; shared?: boolean; widgets: DashboardWidget[] }) => workApi.saveDashboard(pid, body),
    onSuccess: (d) => {
      qc.setQueryData<WorkDashboard[]>(wk.dashboards(pid), (old) => (old?.some((x) => x.id === d.id) ? old.map((x) => (x.id === d.id ? d : x)) : [...(old ?? []), d]));
      qc.invalidateQueries({ queryKey: wk.dashboards(pid) });
      setParams({ d: String(d.id) });
    },
    onError: (err) => toast.error(workError(err, 'Could not save the dashboard')),
  });
  const del = useMutation({
    mutationFn: (id: number) => workApi.deleteDashboard(pid, id),
    onSuccess: (_r, id) => {
      qc.setQueryData<WorkDashboard[]>(wk.dashboards(pid), (old) => old?.filter((x) => x.id !== id));
      qc.invalidateQueries({ queryKey: wk.dashboards(pid) });
      setParams({ d: null });
      toast.success('Dashboard deleted');
    },
    onError: (err) => toast.error(workError(err, 'Could not delete the dashboard')),
  });

  const [nameDialog, setNameDialog] = useState<null | 'create' | 'rename'>(null);
  const [confirmDel, setConfirmDel] = useState(false);
  const [widgetDialog, setWidgetDialog] = useState<{ index: number | null } | null>(null);
  const switcher = useToggle();
  const switcherRef = useRef<HTMLButtonElement>(null);
  const more = useToggle();
  const moreRef = useRef<HTMLButtonElement>(null);

  const createDashboard = (name: string, shared: boolean, seed: boolean) =>
    save.mutate(
      { name, shared, widgets: seed ? defaultWidgets() : [] },
      { onSuccess: (d) => { setNameDialog(null); toast.success(`Dashboard “${d.name}” created`); if (!seed) setDraft(startEdit(d)); } },
    );

  const saveDraft = () => {
    if (!current || !draft) return;
    save.mutate({ id: current.id, name: draft.name, shared: draft.shared, widgets: draft.widgets }, {
      onSuccess: () => { setDraft(null); toast.success('Dashboard saved'); },
    });
  };

  const widgets = draft?.widgets ?? current?.widgets ?? [];
  const move = (i: number, dir: -1 | 1) => setDraft((d) => {
    if (!d) return d;
    const j = i + dir;
    if (j < 0 || j >= d.widgets.length) return d;
    const next = [...d.widgets];
    [next[i], next[j]] = [next[j], next[i]];
    return { ...d, widgets: next };
  });
  const remove = (i: number) => setDraft((d) => (d ? { ...d, widgets: d.widgets.filter((_, k) => k !== i) } : d));

  const ownerName = (d: WorkDashboard) => {
    if (d.ownerId === meId) return 'You';
    const m = lk.members.get(d.ownerId);
    return m ? userName(m) : 'a former member';
  };

  // ── Hiển thị ──
  if (list.isLoading) {
    return (
      <div className="flex h-full flex-col">
        <ProjectHeader config={config} title="Dashboards" />
        <div className="flex flex-1 items-center justify-center"><Spinner size={20} /></div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-w-0 flex-col">
      <ProjectHeader config={config} title="Dashboards" />

      {list.isError ? (
        <EmptyState title="Couldn't load dashboards" body={workError(list.error)} action={<button type="button" className="w-btn" onClick={() => list.refetch()}>Try again</button>} />
      ) : !current ? (
        <EmptyState
          title="No dashboards yet"
          body="Dashboards put charts, counts and issue lists for this project on one page. Start with a recommended layout and adjust it to your team."
          action={
            <button type="button" className="w-btn w-btn-primary" disabled={save.isPending} onClick={() => createDashboard('Project overview', true, true)}>
              {save.isPending ? <Spinner size={12} /> : <Plus size={14} />} Create dashboard
            </button>
          }
        />
      ) : (
        <>
          {/* Thanh công cụ */}
          <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[var(--w-border)] px-3 py-2 md:px-4">
            {editing ? (
              <>
                <input
                  value={draft.name}
                  maxLength={100}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  aria-label="Dashboard name"
                  className="w-input !h-[28px] w-full min-w-0 !text-[13px] font-medium sm:w-[240px]"
                />
                <label className="flex h-[28px] cursor-pointer select-none items-center gap-1.5 px-1 text-[12px] text-[var(--w-text-2)]">
                  <input type="checkbox" checked={draft.shared} onChange={(e) => setDraft({ ...draft, shared: e.target.checked })} className="h-3.5 w-3.5 accent-[var(--w-accent)]" />
                  Shared with project
                </label>
                <div className="flex-1" />
                <button type="button" className="w-btn w-btn-sm" onClick={() => setWidgetDialog({ index: null })} disabled={draft.widgets.length >= 30}>
                  <Plus size={13} /> Add widget
                </button>
                <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => setDraft(null)} disabled={save.isPending}>Cancel</button>
                <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={saveDraft} disabled={save.isPending || !draft.name.trim()}>
                  {save.isPending && <Spinner size={12} />} Save
                </button>
              </>
            ) : (
              <>
                <button
                  ref={switcherRef}
                  type="button"
                  onClick={switcher.toggle}
                  className="flex h-[28px] min-w-0 max-w-full items-center gap-1.5 rounded-[6px] px-2 text-[14px] font-semibold hover:bg-[var(--w-hover)]"
                  aria-haspopup="menu"
                  aria-expanded={switcher.on}
                >
                  <LayoutDashboard size={14} className="shrink-0 text-[var(--w-text-3)]" />
                  <span className="truncate">{current.name}</span>
                  <ChevronDown size={13} className="shrink-0 text-[var(--w-text-3)]" />
                </button>
                <span className="inline-flex items-center gap-1 text-[12px] text-[var(--w-text-3)]" title={current.shared ? 'Everyone in this project can see it' : 'Only you can see it'}>
                  {current.shared ? <Users size={12} /> : <Lock size={12} />}
                  {current.shared ? 'Shared' : 'Private'}
                  <span className="max-sm:!hidden">· by {ownerName(current)}</span>
                </span>
                <div className="flex-1" />
                {canEdit && (
                  <button type="button" className="w-btn w-btn-sm" onClick={() => setDraft(startEdit(current))}>
                    <Pencil size={13} /> Edit dashboard
                  </button>
                )}
                {canEdit && (
                  <>
                    <button ref={moreRef} type="button" onClick={more.toggle} className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label="More dashboard actions">
                      <MoreHorizontal size={14} />
                    </button>
                    <Popover open={more.on} onClose={more.close} anchorRef={moreRef} width={220} align="end">
                      <div className="p-1">
                        <MenuItem onClick={() => { more.close(); setNameDialog('rename'); }}><Pencil size={13} /> Rename</MenuItem>
                        <MenuItem
                          onClick={() => {
                            more.close();
                            save.mutate({ id: current.id, name: current.name, shared: !current.shared, widgets: current.widgets }, {
                              onSuccess: (d) => toast.success(d.shared ? 'Dashboard shared with the project' : 'Dashboard is now private'),
                            });
                          }}
                        >
                          {current.shared ? <Lock size={13} /> : <Users size={13} />} {current.shared ? 'Make private' : 'Share with project'}
                        </MenuItem>
                        <div className="my-1 border-t border-[var(--w-border)]" />
                        <MenuItem danger onClick={() => { more.close(); setConfirmDel(true); }}><Trash2 size={13} /> Delete dashboard</MenuItem>
                      </div>
                    </Popover>
                  </>
                )}
              </>
            )}
          </div>

          <Popover open={switcher.on} onClose={switcher.close} anchorRef={switcherRef} width={280}>
            <div className="max-h-[320px] overflow-y-auto p-1">
              {dashboards.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => { switcher.close(); setParams({ d: String(d.id) }); }}
                  className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left hover:bg-[var(--w-hover)]"
                >
                  <span className="w-3.5 shrink-0">{d.id === current.id && <Check size={13} className="text-[var(--w-accent-text)]" />}</span>
                  <span className="min-w-0 flex-1 truncate text-[13px]">{d.name}</span>
                  <span className="shrink-0 text-[11px] text-[var(--w-text-3)]">{d.shared ? (d.ownerId === meId ? 'Shared' : ownerName(d)) : 'Private'}</span>
                </button>
              ))}
            </div>
            <div className="border-t border-[var(--w-border)] p-1">
              <MenuItem onClick={() => { switcher.close(); setNameDialog('create'); }}><Plus size={13} /> Create dashboard</MenuItem>
            </div>
          </Popover>

          {/* Lưới */}
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mx-auto w-full max-w-[1200px] px-3 py-4 md:px-4">
              {!widgets.length ? (
                <EmptyState
                  title="This dashboard is empty"
                  body={canEdit ? 'Add widgets to track counts, charts and issue lists for this project.' : 'The owner hasn’t added any widgets yet.'}
                  action={canEdit ? (
                    <button type="button" className="w-btn w-btn-primary" onClick={() => {
                      if (!draft) setDraft(startEdit(current));
                      setWidgetDialog({ index: null });
                    }}>
                      <Plus size={14} /> Add widget
                    </button>
                  ) : undefined}
                />
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {widgets.map((w, i) => (
                    <section
                      key={w.id || i}
                      className={cn(
                        'min-w-0 rounded-[var(--w-radius-lg)] border bg-[var(--w-panel)]',
                        w.size === 'full' && 'md:col-span-2',
                        editing ? 'border-dashed border-[var(--w-border-strong)]' : 'border-[var(--w-border)]',
                      )}
                    >
                      <div className="flex min-h-[40px] items-center gap-1 border-b border-[var(--w-border)] py-1.5 pl-4 pr-2">
                        <h3 className="min-w-0 flex-1 truncate text-[13px] font-semibold" title={w.query || undefined}>{w.title || WIDGET_META[w.kind]?.defaultTitle}</h3>
                        {editing && (
                          <div className="flex shrink-0 items-center">
                            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" title="Move up" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp size={13} /></button>
                            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" title="Move down" aria-label="Move down" disabled={i === widgets.length - 1} onClick={() => move(i, 1)}><ArrowDown size={13} /></button>
                            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" title="Edit widget" aria-label="Edit widget" onClick={() => setWidgetDialog({ index: i })}><Pencil size={13} /></button>
                            <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" title="Remove widget" aria-label="Remove widget" onClick={() => remove(i)}><Trash2 size={13} /></button>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 p-4">
                        <WidgetBody w={w} pid={pid} config={config} lk={lk} onOpenIssue={(n) => openIssue(n)} />
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <NameDialog
        open={!!nameDialog}
        mode={nameDialog ?? 'create'}
        initialName={nameDialog === 'rename' ? current?.name ?? '' : ''}
        pending={save.isPending}
        onClose={() => setNameDialog(null)}
        onSubmit={(name, shared, seed) => {
          if (nameDialog === 'rename' && current) {
            save.mutate({ id: current.id, name, shared: current.shared, widgets: current.widgets }, {
              onSuccess: () => { setNameDialog(null); toast.success('Dashboard renamed'); },
            });
          } else {
            createDashboard(name, shared, seed);
          }
        }}
      />
      <ConfirmDialog
        open={confirmDel}
        onClose={() => setConfirmDel(false)}
        onConfirm={() => { if (current) del.mutate(current.id, { onSettled: () => setConfirmDel(false) }); }}
        title="Delete dashboard"
        body={<>“{current?.name}” and its widgets will be deleted{current?.shared ? ' for everyone in this project' : ''}. Issues are not affected.</>}
        confirmLabel="Delete dashboard"
        pending={del.isPending}
      />
      <WidgetDialog
        open={!!widgetDialog}
        onClose={() => setWidgetDialog(null)}
        config={config}
        initial={widgetDialog?.index != null ? widgets[widgetDialog.index] ?? null : null}
        onSubmit={(w) => {
          setDraft((d) => {
            const base = d && current && d.id === current.id ? d : current ? startEdit(current) : null;
            if (!base) return d;
            const idx = widgetDialog?.index;
            const next = idx != null ? base.widgets.map((x, k) => (k === idx ? w : x)) : [...base.widgets, w];
            return { ...base, widgets: next };
          });
          setWidgetDialog(null);
        }}
      />
      <IssueDrawer pid={pid} num={openNum} onClose={() => openIssue(null)} onOpenIssue={(n) => openIssue(n)} />
    </div>
  );
}

function MenuItem({ children, onClick, danger }: { children: ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)]', danger && 'text-[var(--w-red)]')}
    >
      {children}
    </button>
  );
}

function NameDialog({ open, mode, initialName, pending, onClose, onSubmit }: {
  open: boolean; mode: 'create' | 'rename'; initialName: string; pending: boolean; onClose: () => void;
  onSubmit: (name: string, shared: boolean, seed: boolean) => void;
}) {
  const [name, setName] = useState('');
  const [shared, setShared] = useState(true);
  const [seed, setSeed] = useState(true);
  useEffect(() => {
    if (!open) return;
    setName(initialName);
    setShared(true);
    setSeed(true);
  }, [open, initialName]);
  const ok = name.trim().length > 0 && !pending;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Create dashboard' : 'Rename dashboard'}
      width={460}
      footer={
        <>
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="submit" form="work-dashboard-form" className="w-btn w-btn-primary" disabled={!ok}>
            {pending && <Spinner size={12} />} {mode === 'create' ? 'Create dashboard' : 'Save'}
          </button>
        </>
      }
    >
      <form id="work-dashboard-form" onSubmit={(e) => { e.preventDefault(); if (ok) onSubmit(name.trim(), shared, seed); }}>
        <Field label="Name">
          <input autoFocus value={name} maxLength={100} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sprint overview" className="w-input" />
        </Field>
        {mode === 'create' && (
          <div className="space-y-3">
            <label className="flex cursor-pointer select-none items-start gap-2 text-[13px]">
              <input type="checkbox" checked={shared} onChange={(e) => setShared(e.target.checked)} className="mt-0.5 h-3.5 w-3.5 accent-[var(--w-accent)]" />
              <span>
                Share with project
                <span className="block text-[12px] text-[var(--w-text-3)]">Everyone in this project can view it. Only you and project admins can change it.</span>
              </span>
            </label>
            <label className="flex cursor-pointer select-none items-start gap-2 text-[13px]">
              <input type="checkbox" checked={seed} onChange={(e) => setSeed(e.target.checked)} className="mt-0.5 h-3.5 w-3.5 accent-[var(--w-accent)]" />
              <span>
                Start with recommended widgets
                <span className="block text-[12px] text-[var(--w-text-3)]">Open and overdue counts, status and assignee charts, created vs resolved, your open issues and project health.</span>
              </span>
            </label>
          </div>
        )}
      </form>
    </Dialog>
  );
}
