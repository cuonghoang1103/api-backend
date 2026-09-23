'use client';

/**
 * Chi tiết một thẻ — dùng cả trong ngăn kéo (board/danh sách) lẫn trang riêng
 * /work/<slug>/<KEY>/issue/<num>.
 *
 * Mọi lần sửa gửi kèm `version`: người khác vừa sửa trước thì server trả 409,
 * ta báo và tải lại thay vì đè mất thay đổi của họ.
 */

import Link from 'next/link';
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Copy, CopyPlus, ChevronDown, ChevronRight, Eye, ExternalLink, Link2, MoreHorizontal, Paperclip, Plus, Trash2, X, Download, FileText,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import {
  workApi, workError, workErrorStatus, type IssueDetail as TIssueDetail, type IssuePatch, type LinkType,
  type ProjectConfig, type TiptapDoc, type IssueAttachment,
} from '@/lib/work-api';
import CreateIssueDialog from './CreateIssueDialog';
import CustomFieldsGroup from './CustomFields';
import AiIssueMenu from './ai/AiIssueMenu';
import { ConfirmDialog } from './settings/shared';
import {
  AssigneePicker, ComponentsPicker, DateInput, FixVersionPicker, LabelsPicker, NumberInput, ParentPicker, PriorityPicker, SprintPicker,
  StatusPicker,
} from './fields';
import { useLookups, wk, type Lookups } from './hooks';
import IssueActivity from './IssueActivity';
import { MobileNavButton } from './shell/mobileNav';
import { TimeTrackingBlock } from './TimeTracking';
import DevelopmentPanel from './DevelopmentPanel';
import RichEditor, { isDocEmpty, RichView } from './RichEditor';
import {
  formatBytes, formatDate, IssueTypeIcon, Popover, PriorityIcon, relativeTime, Spinner, StatusBadge, UserAvatar, useToggle,
  EmptyState,
  publicOrigin,
} from './ui';

const LINK_PHRASE: Record<LinkType, [string, string]> = {
  BLOCKS: ['blocks', 'is blocked by'],
  RELATES: ['relates to', 'relates to'],
  DUPLICATES: ['duplicates', 'is duplicated by'],
  CLONES: ['clones', 'is cloned by'],
  TESTS: ['tests', 'is tested by'],
};

function Prop({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[108px_1fr] items-center gap-2 py-0.5">
      <div className="text-[12px] text-[var(--w-text-3)]">{label}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

// ─── Tiêu đề sửa tại chỗ ─────────────────────────────────────────

function TitleEditor({ value, editable, onSave }: { value: string; editable: boolean; onSave: (v: string) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  if (!editable) return <h1 className="text-[20px] font-semibold leading-snug">{value}</h1>;
  const commit = () => {
    const t = draft?.trim();
    setDraft(null);
    if (t && t !== value) onSave(t);
  };
  return (
    <textarea
      value={draft ?? value}
      rows={1}
      maxLength={255}
      onChange={(e) => setDraft(e.target.value.replace(/\n/g, ''))}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.nativeEvent.isComposing) { e.preventDefault(); (e.target as HTMLTextAreaElement).blur(); }
        if (e.key === 'Escape') { setDraft(null); (e.target as HTMLTextAreaElement).blur(); }
      }}
      ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = `${el.scrollHeight}px`; } }}
      className="-mx-1.5 w-[calc(100%+12px)] resize-none rounded-[6px] bg-transparent px-1.5 py-0.5 text-[20px] font-semibold leading-snug text-[var(--w-text)] outline-none hover:bg-[var(--w-hover)] focus:bg-[var(--w-panel)] focus:shadow-[0_0_0_1px_var(--w-accent-border)]"
    />
  );
}

// ─── Mô tả ───────────────────────────────────────────────────────

function Description({ issue, config, editable, onSave, saving }: {
  issue: TIssueDetail; config: ProjectConfig; editable: boolean; onSave: (d: TiptapDoc | null) => Promise<unknown>; saving: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<TiptapDoc | null>(issue.descriptionJson);
  const empty = isDocEmpty(issue.descriptionJson);
  const start = () => { setDraft(issue.descriptionJson); setEditing(true); };
  const save = async () => {
    await onSave(isDocEmpty(draft) ? null : draft);
    setEditing(false);
  };
  if (editing) {
    return (
      <div>
        <RichEditor value={draft} onChange={(d) => setDraft(d)} members={config.members} autoFocus minHeight={140} onSubmit={save} onEscape={() => setEditing(false)} />
        <div className="mt-2 flex gap-2">
          <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save'}</button>
          <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </div>
    );
  }
  if (empty) {
    return editable ? (
      <button type="button" onClick={start} className="w-full rounded-[6px] px-2 py-2 text-left text-[13px] text-[var(--w-text-3)] hover:bg-[var(--w-hover)]">
        Add a description…
      </button>
    ) : <p className="text-[13px] text-[var(--w-text-3)]">No description.</p>;
  }
  return (
    <div
      onClick={(e) => { if (editable && !(e.target as HTMLElement).closest('a,input')) start(); }}
      className={cn('-mx-2 rounded-[6px] px-2 py-1', editable && 'cursor-text hover:bg-[var(--w-hover)]')}
    >
      <RichView value={issue.descriptionJson} />
    </div>
  );
}

// ─── Việc con ────────────────────────────────────────────────────

function Subtasks({ issue, config, lk, onOpen, onAdd }: { issue: TIssueDetail; config: ProjectConfig; lk: Lookups; onOpen: (n: number) => void; onAdd: () => void }) {
  const hasSubtaskType = config.issueTypes.some((t) => t.level === -1);
  const type = lk.types.get(issue.typeId);
  if (!type || type.level === -1) return null;
  const isEpic = type.level === 1;
  const kids = issue.children;
  const done = kids.filter((k) => lk.statuses.get(k.statusId)?.category === 'DONE').length;
  if (!kids.length && (isEpic || !hasSubtaskType || !config.permissions.editIssues)) return null;
  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-[13px] font-semibold">{isEpic ? 'Issues in this epic' : 'Sub-tasks'}</h3>
        {kids.length > 0 && (
          <>
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[var(--w-sunken)]">
              <div className="h-full bg-[var(--w-green)]" style={{ width: `${(done / kids.length) * 100}%` }} />
            </div>
            <span className="text-[12px] text-[var(--w-text-3)] tabular">{done}/{kids.length} done</span>
          </>
        )}
        {!isEpic && hasSubtaskType && config.permissions.editIssues && (
          <button type="button" onClick={onAdd} className="w-btn w-btn-ghost w-btn-sm ml-auto"><Plus size={13} /> Add sub-task</button>
        )}
      </div>
      {kids.length > 0 && (
        <div className="overflow-hidden rounded-[6px] border border-[var(--w-border)]">
          {kids.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => onOpen(k.number)}
              className="flex w-full items-center gap-2 border-b border-[var(--w-border)] px-2.5 py-1.5 text-left text-[13px] last:border-b-0 hover:bg-[var(--w-hover)]"
            >
              <IssueTypeIcon type={lk.types.get(k.typeId)} size={12} />
              <span className="shrink-0 font-mono text-[11px] text-[var(--w-text-3)]">{lk.issueKey(k.number)}</span>
              <span className={cn('min-w-0 flex-1 truncate', lk.statuses.get(k.statusId)?.category === 'DONE' && 'text-[var(--w-text-3)] line-through')}>{k.title}</span>
              <PriorityIcon priority={k.priority} size={13} />
              <UserAvatar user={k.assigneeId ? lk.members.get(k.assigneeId) : null} size={18} />
              <StatusBadge status={lk.statuses.get(k.statusId)} />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Liên kết ────────────────────────────────────────────────────

function Links({ issue, pid, lk, editable, onOpenKey }: { issue: TIssueDetail; pid: number; lk: Lookups; editable: boolean; onOpenKey: (key: string) => void }) {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [type, setType] = useState<LinkType>('RELATES');
  const [target, setTarget] = useState('');
  const refresh = () => qc.invalidateQueries({ queryKey: wk.issue(pid, issue.number) });
  const add = useMutation({
    mutationFn: () => workApi.addLink(pid, issue.number, { type, targetKey: target.trim() }),
    onSuccess: () => { setTarget(''); setAdding(false); refresh(); },
    onError: (err) => toast.error(workError(err, 'Could not link the issue')),
  });
  const remove = useMutation({
    mutationFn: (linkId: number) => workApi.removeLink(pid, issue.number, linkId),
    onSuccess: refresh,
    onError: (err) => toast.error(workError(err, 'Could not remove the link')),
  });
  if (!issue.links.length && !editable) return null;
  const groups = new Map<string, typeof issue.links>();
  for (const l of issue.links) {
    const phrase = LINK_PHRASE[l.type][l.direction === 'outward' ? 0 : 1];
    groups.set(phrase, [...(groups.get(phrase) ?? []), l]);
  }
  return (
    <section>
      <div className="mb-2 flex items-center">
        <h3 className="text-[13px] font-semibold">Linked issues</h3>
        {editable && !adding && <button type="button" onClick={() => setAdding(true)} className="w-btn w-btn-ghost w-btn-sm ml-auto"><Link2 size={13} /> Link issue</button>}
      </div>
      {adding && (
        <form className="mb-3 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); if (target.trim()) add.mutate(); }}>
          <select value={type} onChange={(e) => setType(e.target.value as LinkType)} className="w-input w-auto">
            {(Object.keys(LINK_PHRASE) as LinkType[]).map((t) => <option key={t} value={t}>{LINK_PHRASE[t][0]}</option>)}
          </select>
          <input autoFocus value={target} onChange={(e) => setTarget(e.target.value)} placeholder={`e.g. ${lk.issueKey(1)}`} className="w-input w-[140px] font-mono uppercase" />
          <button type="submit" className="w-btn w-btn-primary" disabled={!target.trim() || add.isPending}>Link</button>
          <button type="button" className="w-btn w-btn-ghost" onClick={() => setAdding(false)}>Cancel</button>
        </form>
      )}
      {[...groups.entries()].map(([phrase, links]) => (
        <div key={phrase} className="mb-2">
          <div className="mb-1 text-[12px] text-[var(--w-text-3)]">{phrase}</div>
          <div className="overflow-hidden rounded-[6px] border border-[var(--w-border)]">
            {links.map((l) => (
              <div key={l.id} className="group flex items-center gap-2 border-b border-[var(--w-border)] px-2.5 py-1.5 text-[13px] last:border-b-0">
                <IssueTypeIcon type={lk.types.get(l.issue.typeId)} size={12} />
                <button type="button" onClick={() => onOpenKey(l.issue.key)} className="shrink-0 font-mono text-[11px] text-[var(--w-accent-text)] hover:underline">{l.issue.key}</button>
                <span className="min-w-0 flex-1 truncate">{l.issue.title}</span>
                <StatusBadge status={lk.statuses.get(l.issue.statusId)} />
                {editable && (
                  <button type="button" title="Remove link" onClick={() => remove.mutate(l.id)} className="w-btn w-btn-ghost w-btn-icon w-btn-sm opacity-0 group-hover:opacity-100"><X size={12} /></button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

// ─── Đính kèm ────────────────────────────────────────────────────

function AttachmentItem({ a, pid, canDelete, onDeleted }: { a: IssueAttachment; pid: number; canDelete: boolean; onDeleted: () => void }) {
  const isImage = a.mime.startsWith('image/');
  const thumb = useQuery({
    queryKey: ['work', 'att', pid, a.id],
    queryFn: () => workApi.attachmentUrl(pid, a.id, true),
    enabled: isImage,
    staleTime: 8 * 60_000, // URL ký sẵn sống 10 phút
  });
  const download = async () => {
    try {
      window.open(await workApi.attachmentUrl(pid, a.id), '_blank', 'noopener');
    } catch (err) {
      toast.error(workError(err, 'Could not download'));
    }
  };
  const [confirmDel, setConfirmDel] = useState(false);
  const del = async () => {
    setConfirmDel(false);
    try { await workApi.deleteAttachment(pid, a.id); onDeleted(); } catch (err) { toast.error(workError(err, 'Could not remove')); }
  };
  return (
    <div className="group relative w-[148px] overflow-hidden rounded-[6px] border border-[var(--w-border)]">
      <button type="button" onClick={download} className="flex h-[92px] w-full items-center justify-center bg-[var(--w-sunken)]">
        {isImage && thumb.data ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb.data} alt={a.fileName} className="h-full w-full object-cover" />
        ) : (
          <FileText size={28} className="text-[var(--w-text-3)]" />
        )}
      </button>
      <div className="px-2 py-1.5">
        <div className="truncate text-[12px] font-medium" title={a.fileName}>{a.fileName}</div>
        <div className="text-[11px] text-[var(--w-text-3)]">{formatBytes(a.size)} · {relativeTime(a.createdAt)}</div>
      </div>
      <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button type="button" title="Download" onClick={download} className="w-btn w-btn-icon w-btn-sm"><Download size={12} /></button>
        {canDelete && <button type="button" title="Remove" onClick={() => setConfirmDel(true)} className="w-btn w-btn-icon w-btn-sm"><Trash2 size={12} /></button>}
      </div>
      <ConfirmDialog open={confirmDel} onClose={() => setConfirmDel(false)} onConfirm={del} title="Remove attachment" body={`${a.fileName} will be removed from this issue.`} confirmLabel="Remove" />
    </div>
  );
}

function Attachments({ issue, pid, config }: { issue: TIssueDetail; pid: number; config: ProjectConfig }) {
  const qc = useQueryClient();
  const meId = useAuthStore((s) => s.user?.id);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<Array<{ name: string; pct: number }>>([]);
  const [drag, setDrag] = useState(false);
  const refresh = () => qc.invalidateQueries({ queryKey: wk.issue(pid, issue.number) });

  const upload = async (files: FileList | File[]) => {
    for (const file of Array.from(files)) {
      if (file.size > 25 * 1024 * 1024) { toast.error(`${file.name} is larger than 25 MB`); continue; }
      setUploads((u) => [...u, { name: file.name, pct: 0 }]);
      try {
        await workApi.uploadAttachment(pid, issue.number, file, (pct) => setUploads((u) => u.map((x) => (x.name === file.name ? { ...x, pct } : x))));
      } catch (err) {
        toast.error(workError(err, `Could not upload ${file.name}`));
      } finally {
        setUploads((u) => u.filter((x) => x.name !== file.name));
        refresh();
      }
    }
  };

  if (!issue.attachments.length && !config.permissions.attach) return null;
  return (
    <section
      onDragOver={(e) => { if (config.permissions.attach && e.dataTransfer.types.includes('Files')) { e.preventDefault(); setDrag(true); } }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); if (config.permissions.attach) void upload(e.dataTransfer.files); }}
      className={cn('rounded-[8px] transition-colors', drag && 'bg-[var(--w-accent-soft)] outline-dashed outline-1 outline-[var(--w-accent-border)]')}
    >
      <div className="mb-2 flex items-center">
        <h3 className="text-[13px] font-semibold">Attachments {issue.attachments.length > 0 && <span className="font-normal text-[var(--w-text-3)]">{issue.attachments.length}</span>}</h3>
        {config.permissions.attach && (
          <>
            <button type="button" onClick={() => inputRef.current?.click()} className="w-btn w-btn-ghost w-btn-sm ml-auto"><Paperclip size={13} /> Attach</button>
            <input ref={inputRef} type="file" multiple hidden onChange={(e) => { if (e.target.files) void upload(e.target.files); e.target.value = ''; }} />
          </>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {issue.attachments.map((a) => (
          <AttachmentItem key={a.id} a={a} pid={pid} canDelete={a.uploader?.id === meId || config.role === 'ADMIN'} onDeleted={refresh} />
        ))}
        {uploads.map((u) => (
          <div key={u.name} className="flex h-[132px] w-[148px] flex-col items-center justify-center gap-2 rounded-[6px] border border-dashed border-[var(--w-border-strong)] px-2 text-center">
            <Spinner />
            <div className="w-full truncate text-[11px] text-[var(--w-text-2)]">{u.name}</div>
            <div className="text-[11px] tabular text-[var(--w-text-3)]">{u.pct}%</div>
          </div>
        ))}
        {!issue.attachments.length && !uploads.length && (
          <p className="text-[12px] text-[var(--w-text-3)]">Drop files here or click Attach (max 25 MB each).</p>
        )}
      </div>
    </section>
  );
}

// ─── Thẻ ─────────────────────────────────────────────────────────

export default function IssueDetail({ pid, num, config, onClose, onOpenIssue, variant = 'drawer' }: {
  pid: number;
  num: number;
  config: ProjectConfig;
  onClose?: () => void;
  /** Mở thẻ khác (việc con, thẻ liên kết) — trong ngăn kéo thì đổi số, ở trang riêng thì điều hướng. */
  onOpenIssue: (num: number) => void;
  variant?: 'drawer' | 'page';
}) {
  const qc = useQueryClient();
  const lk = useLookups(config);
  const meId = useAuthStore((s) => s.user?.id);
  const menu = useToggle();
  const menuRef = useRef<HTMLButtonElement>(null);
  const [subtaskOpen, setSubtaskOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  // Trang riêng trên điện thoại/iPad dọc: thẻ "Details" ngay dưới tiêu đề, mở sẵn.
  const [detailsOpen, setDetailsOpen] = useState(true);

  const q = useQuery({ queryKey: wk.issue(pid, num), queryFn: () => workApi.issue(pid, num), retry: (n, err) => workErrorStatus(err) !== 404 && n < 2 });
  const issue = q.data;
  const editable = config.permissions.editIssues;
  const base = `/work/${config.workspace.slug}/${config.key}`;

  const update = useMutation({
    mutationFn: (patch: IssuePatch) => workApi.updateIssue(pid, num, { ...patch, version: issue?.version }),
    onSuccess: (data) => {
      qc.setQueryData(wk.issue(pid, num), data);
      qc.invalidateQueries({ queryKey: wk.board(pid) });
      qc.invalidateQueries({ queryKey: wk.issues(pid) });
      qc.invalidateQueries({ queryKey: wk.history(pid, num) });
    },
    onError: (err) => {
      if (workErrorStatus(err) === 409) {
        toast.error('Someone else just changed this issue. Showing the latest version.');
        qc.invalidateQueries({ queryKey: wk.issue(pid, num) });
      } else {
        toast.error(workError(err, 'Could not save the change'));
      }
    },
  });
  const set = useCallback((patch: IssuePatch) => update.mutateAsync(patch).catch(() => {}), [update]);

  const watch = useMutation({
    mutationFn: (on: boolean) => workApi.watch(pid, num, on),
    onSuccess: () => qc.invalidateQueries({ queryKey: wk.issue(pid, num) }),
  });
  const del = useMutation({
    mutationFn: () => workApi.deleteIssue(pid, num),
    onSuccess: () => {
      toast.success(`${lk.issueKey(num)} deleted`);
      qc.invalidateQueries({ queryKey: wk.board(pid) });
      qc.invalidateQueries({ queryKey: wk.issues(pid) });
      onClose?.();
    },
    onError: (err) => toast.error(workError(err, 'Could not delete')),
  });

  const clone = useMutation({
    mutationFn: () => workApi.cloneIssue(pid, num),
    onSuccess: (copy) => {
      qc.invalidateQueries({ queryKey: wk.board(pid) });
      qc.invalidateQueries({ queryKey: wk.issues(pid) });
      qc.invalidateQueries({ queryKey: wk.backlog(pid) });
      qc.invalidateQueries({ queryKey: wk.issue(pid, num) });
      toast.success(`Cloned as ${lk.issueKey(copy.number)}`, { action: { label: 'Open', onClick: () => onOpenIssue(copy.number) } });
    },
    onError: (err) => toast.error(workError(err, 'Could not clone the issue')),
  });

  const subtaskDefaults = useMemo(() => (issue ? { parent: { id: issue.id, number: issue.number, title: issue.title } } : undefined), [issue]);

  const openKey = (key: string) => {
    const [k, n] = key.split('-');
    if (k === config.key) onOpenIssue(Number(n));
    else window.location.href = `/work/${config.workspace.slug}/${k}/issue/${n}`;
  };

  if (q.isLoading) return <div className="flex h-full items-center justify-center"><Spinner size={20} /></div>;
  if (!issue) {
    return (
      <div className="flex h-full flex-col">
        {onClose && <div className="flex justify-end p-2"><button type="button" onClick={onClose} className="w-btn w-btn-ghost w-btn-icon"><X size={16} /></button></div>}
        <EmptyState title="Issue not found" body={workErrorStatus(q.error) === 404 ? 'It may have been deleted or you no longer have access.' : workError(q.error)} />
      </div>
    );
  }

  const type = lk.types.get(issue.typeId);
  const url = `${publicOrigin()}${base}/issue/${num}`;

  const properties = (
    <div className="space-y-0.5">
      <div className="mb-3">
        <StatusPicker lk={lk} issue={issue} onChange={(statusId) => set({ statusId })} disabled={!config.permissions.transition} />
      </div>
      <Prop label="Assignee">
        <AssigneePicker config={config} value={issue.assigneeId} onChange={(assigneeId) => set({ assigneeId })} meId={meId} bare disabled={!editable} />
        {editable && issue.assigneeId !== meId && config.members.some((m) => m.id === meId && (m.role === 'ADMIN' || m.role === 'MEMBER')) && (
          <button type="button" onClick={() => set({ assigneeId: meId })} className="px-2 text-[12px] text-[var(--w-accent-text)] hover:underline">Assign to me</button>
        )}
      </Prop>
      <Prop label="Reporter">
        <div className="flex items-center gap-2 px-2 text-[13px]"><UserAvatar user={issue.reporter} size={18} /><span className="truncate">{issue.reporter ? (issue.reporter.displayName || issue.reporter.fullName || issue.reporter.username) : 'Unknown'}</span></div>
      </Prop>
      <Prop label="Priority"><PriorityPicker value={issue.priority} onChange={(priority) => set({ priority })} bare disabled={!editable} /></Prop>
      <Prop label="Labels"><LabelsPicker config={config} value={issue.labelIds} onChange={(labelIds) => set({ labelIds })} bare disabled={!editable} /></Prop>
      {type && type.level !== 1 && (
        <Prop label={type.level === -1 ? 'Parent' : 'Epic'}>
          <ParentPicker
            config={config} lk={lk} childLevel={type.level} excludeId={issue.id}
            value={issue.parent ? { id: issue.parent.id, number: issue.parent.number, title: issue.parent.title } : null}
            onChange={(p) => set({ parentId: p?.id ?? null })}
            bare disabled={!editable}
          />
        </Prop>
      )}
      {config.type !== 'KANBAN' && type?.level === 0 && (
        <Prop label="Sprint"><SprintPicker config={config} value={issue.sprintId} onChange={(sprintId) => set({ sprintId })} bare disabled={!editable} /></Prop>
      )}
      <Prop label="Fix version"><FixVersionPicker config={config} value={issue.fixVersionId} onChange={(fixVersionId) => set({ fixVersionId })} bare disabled={!editable} /></Prop>
      {type?.level !== 1 && (
        <Prop label={config.settings?.estimation === 'HOURS' ? 'Estimate (h)' : 'Story points'}>
          {config.settings?.estimation === 'HOURS' ? (
            <NumberInput
              value={issue.originalEstimateMin === null ? null : Math.round((issue.originalEstimateMin / 60) * 10) / 10}
              onCommit={(v) => set({ originalEstimateMin: v === null ? null : Math.round(v * 60) })}
              disabled={!editable}
            />
          ) : (
            <NumberInput value={issue.storyPoints} onCommit={(storyPoints) => set({ storyPoints })} disabled={!editable} />
          )}
        </Prop>
      )}
      <Prop label="Start date"><DateInput value={issue.startDate} onChange={(startDate) => set({ startDate })} disabled={!editable} /></Prop>
      <Prop label="Due date"><DateInput value={issue.dueDate} onChange={(dueDate) => set({ dueDate })} disabled={!editable} /></Prop>
      {config.components.length > 0 && (
        <Prop label="Components"><ComponentsPicker config={config} value={issue.componentIds} onChange={(componentIds) => set({ componentIds })} bare disabled={!editable} /></Prop>
      )}
      <CustomFieldsGroup pid={pid} num={num} typeKey={type?.key} config={config} editable={editable} />
      <TimeTrackingBlock pid={pid} issue={issue} config={config} />
      <DevelopmentPanel pid={pid} num={num} issueKey={lk.issueKey(num)} />
      <div className="mt-4 space-y-1 border-t border-[var(--w-border)] pt-3 text-[12px] text-[var(--w-text-3)]">
        <div>Created {formatDate(issue.createdAt)} · {relativeTime(issue.createdAt)}</div>
        <div>Updated {relativeTime(issue.updatedAt)}</div>
        {issue.resolvedAt && <div>Resolved {formatDate(issue.resolvedAt)}</div>}
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      {/* Thanh trên */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-[var(--w-border)] px-4">
        {/* Trang riêng: nút ☰ của điện thoại nằm ở header này (thay thanh dự phòng của layout). */}
        {variant === 'page' && <MobileNavButton />}
        <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-[var(--w-text-3)]">
          {issue.parent && (
            <>
              <button type="button" onClick={() => onOpenIssue(issue.parent!.number)} className="flex items-center gap-1 hover:text-[var(--w-text)]">
                <IssueTypeIcon type={lk.types.get(issue.parent.typeId)} size={11} />
                <span className="font-mono">{lk.issueKey(issue.parent.number)}</span>
              </button>
              <span>/</span>
            </>
          )}
          <IssueTypeIcon type={type} size={12} />
          <span className="font-mono text-[var(--w-text-2)]">{lk.issueKey(issue.number)}</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          {type && <AiIssueMenu config={config} issueNumber={issue.number} typeKey={type.key} />}
          <button
            type="button"
            title={issue.isWatching ? 'Stop watching' : 'Watch — get notified about changes'}
            onClick={() => watch.mutate(!issue.isWatching)}
            className="w-btn w-btn-ghost w-btn-sm"
          >
            <Eye size={13} className={issue.isWatching ? 'text-[var(--w-accent-text)]' : undefined} />
            <span className={cn('tabular', issue.isWatching && 'text-[var(--w-accent-text)]')}>{issue.watcherCount}</span>
          </button>
          <button type="button" title="Copy link" onClick={() => { void navigator.clipboard.writeText(url); toast.success('Link copied'); }} className="w-btn w-btn-ghost w-btn-icon w-btn-sm"><Copy size={13} /></button>
          {variant === 'drawer' && (
            <Link href={`${base}/issue/${num}`} title="Open full page" className="w-btn w-btn-ghost w-btn-icon w-btn-sm"><ExternalLink size={13} /></Link>
          )}
          {(issue.canDelete || config.permissions.createIssues) && (
            <>
              <button ref={menuRef} type="button" onClick={menu.toggle} className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label="More actions"><MoreHorizontal size={14} /></button>
              <Popover open={menu.on} onClose={menu.close} anchorRef={menuRef} width={200} align="end">
                <div className="p-1">
                  {config.permissions.createIssues && (
                    <button
                      type="button"
                      disabled={clone.isPending}
                      onClick={() => { menu.close(); clone.mutate(); }}
                      title="Create a copy with the same fields, labels and description"
                      className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)] disabled:opacity-50"
                    >
                      <CopyPlus size={13} /> Clone
                    </button>
                  )}
                  {issue.canDelete && (
                    <button
                      type="button"
                      onClick={() => { menu.close(); setConfirmDelete(true); }}
                      className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px] text-[var(--w-red)] hover:bg-[var(--w-hover)]"
                    >
                      <Trash2 size={13} /> Delete issue
                    </button>
                  )}
                </div>
              </Popover>
            </>
          )}
          {onClose && <button type="button" onClick={onClose} title="Close (Esc)" className="w-btn w-btn-ghost w-btn-icon w-btn-sm"><X size={15} /></button>}
        </div>
      </div>

      {/* Thân */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className={cn('flex flex-col gap-6 p-5', variant === 'page' ? 'lg:flex-row lg:gap-10 lg:px-8' : 'xl:flex-row')}>
          <div className="min-w-0 flex-1 space-y-6">
            <TitleEditor value={issue.title} editable={editable} onSave={(title) => set({ title })} />
            <div className="xl:hidden">{variant === 'drawer' && properties}</div>
            {variant === 'page' && (
              // Dưới lg: thuộc tính nằm ngay dưới tiêu đề (không bị đẩy xuống sau mọi bình luận).
              <section className="rounded-[8px] border border-[var(--w-border)] lg:hidden">
                <button
                  type="button"
                  onClick={() => setDetailsOpen((v) => !v)}
                  aria-expanded={detailsOpen}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13px] font-semibold"
                >
                  {detailsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  Details
                  {!detailsOpen && (
                    <span className="ml-auto flex min-w-0 items-center gap-2 font-normal">
                      <StatusBadge status={lk.statuses.get(issue.statusId)} />
                      <PriorityIcon priority={issue.priority} size={13} />
                      <UserAvatar user={issue.assignee} size={18} />
                    </span>
                  )}
                </button>
                {detailsOpen && <div className="border-t border-[var(--w-border)] px-3 pb-3 pt-3">{properties}</div>}
              </section>
            )}
            <section>
              <h3 className="mb-1.5 text-[13px] font-semibold">Description</h3>
              <Description issue={issue} config={config} editable={editable} onSave={(d) => set({ descriptionJson: d })} saving={update.isPending} />
            </section>
            <Subtasks issue={issue} config={config} lk={lk} onOpen={onOpenIssue} onAdd={() => setSubtaskOpen(true)} />
            <Links issue={issue} pid={pid} lk={lk} editable={editable} onOpenKey={openKey} />
            <Attachments issue={issue} pid={pid} config={config} />
            <IssueActivity pid={pid} num={num} config={config} lk={lk} />
          </div>
          <aside className={cn('shrink-0', variant === 'page' ? 'hidden lg:block lg:w-[300px]' : 'hidden xl:block xl:w-[280px]')}>
            <div className={cn(variant === 'page' && 'lg:sticky lg:top-0')}>{properties}</div>
          </aside>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => { setConfirmDelete(false); del.mutate(); }}
        title={`Delete ${lk.issueKey(num)}`}
        body="The issue and its sub-tasks will be deleted. Comments and history go with it."
        confirmLabel="Delete issue"
        pending={del.isPending}
      />
      <CreateIssueDialog open={subtaskOpen} onClose={() => setSubtaskOpen(false)} config={config} defaults={subtaskDefaults} onCreated={onOpenIssue} />
    </div>
  );
}
