'use client';

/**
 * Chi tiết một thẻ — dùng cả trong ngăn kéo (board/danh sách) lẫn trang riêng
 * /work/<slug>/<KEY>/issue/<num>.
 *
 * Mọi lần sửa gửi kèm `version`: người khác vừa sửa trước thì server trả 409,
 * ta báo và tải lại thay vì đè mất thay đổi của họ.
 */

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ArrowRightLeft, Copy, CopyPlus, ChevronDown, ChevronRight, Eye, ExternalLink, Link2, MoreHorizontal, Paperclip, Plus, Trash2, X, Download, FileText,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { ShareToChannelButton } from './chat/ShareToChannel';
import {
  issueMovedTo, workApi, workError, workErrorStatus, type IssueDetail as TIssueDetail, type IssuePatch, type LinkType,
  type ProjectConfig, type TiptapDoc, type IssueAttachment,
} from '@/lib/work-api';
import CreateIssueDialog from './CreateIssueDialog';
import CustomFieldsGroup from './CustomFields';
import AiIssueMenu from './ai/AiIssueMenu';
import { EditLockPill } from './editLock';
import { ConfirmDialog } from './settings/shared';
import {
  AssigneePicker, ComponentsPicker, DateInput, FixVersionPicker, LabelsPicker, NumberInput, ParentPicker, PriorityPicker, SprintPicker,
  StatusPicker,
} from './fields';
import { useLookups, wk, type Lookups } from './hooks';
import IssueActivity, { type ActivityView } from './IssueActivity';
import { IssuePresenceStrip, usePresenceFlag } from './comments/IssuePresence'; // CTW đợt 5b K16: ai đang xem/gõ/sửa
import { MobileNavButton } from './shell/mobileNav';
import HeaderTools from './shell/HeaderTools';
import { Crumb, CrumbSep } from './ProjectHeader';
import { TimeTrackingBlock } from './TimeTracking';
import DefectPanel from './DefectPanel'; // CTW đợt 4 (A16+B5): Severity/Activity/Product của thẻ Bug
import DevelopmentPanel from './DevelopmentPanel';
import IssueAgentActivity from './agents/IssueAgentActivity';
import { IssueApprovals, IssueHandoffs, MoveIssueDialog, StagePicker, TeamPicker } from './studio/IssueStudio';
import { studioOn } from './studio/shared';
import { LinkedDocs } from './docs/LinkedDocs';
import { IssueGovernance } from './governance/IssueGovernance';
import { IssueDesk } from './desk/IssueDesk';
import { IssueWebLinks } from './resources/IssueWebLinks';
import { IssueCloudFiles } from './cloud/IssueCloudFiles'; // CTW đợt 8a
import { AttachmentClientControls, IssueClientShare } from './portal/ClientShare';
import RichEditor, { isDocEmpty, RichView } from './RichEditor';
// Đợt S6: nhãn nguồn gốc AI (AI-assisted) của thẻ.
import { AiAssistedControl } from './spec/SpecPanel';
import { AddToCalendar, FlagControl } from './ctw';
import type { AiProvenance } from '@/lib/work-s6-api';
import { PaneToggle, usePaneKeys, usePanes } from './shell/panes'; // UX-E: cột Details ẩn/hiện
import {
  formatBytes, formatDate, IssueTypeIcon, Popover, PriorityIcon, ProjectMark, relativeTime, Spinner, StatusBadge, UserAvatar, useToggle,
  EmptyState, isTyping,
  publicOrigin, PageLoading} from './ui';
import { wt } from '@/components/work/i18n';

const LINK_PHRASE: Record<LinkType, [string, string]> = {
  get BLOCKS(): [string, string] { return [wt('detail.lBlocks'), wt('detail.lBlockedBy')]; },
  get RELATES(): [string, string] { return [wt('detail.lRelates'), wt('detail.lRelates')]; },
  get DUPLICATES(): [string, string] { return [wt('detail.lDuplicates'), wt('detail.lDuplicatedBy')]; },
  get CLONES(): [string, string] { return [wt('detail.lClones'), wt('detail.lClonedBy')]; },
  get TESTS(): [string, string] { return [wt('detail.lTests'), wt('detail.lTestedBy')]; },
};

function Prop({ label, children, field, kbd }: { label: string; children: ReactNode; field?: string; kbd?: string }) {
  return (
    <div className="group/prop grid grid-cols-[108px_1fr] items-center gap-2 py-0.5" data-field={field}>
      <div className="flex items-center gap-1 text-[12px] text-[var(--w-text-3)]">
        <span className="truncate">{label}</span>
        {kbd && <kbd className="w-kbd hidden !h-[16px] !min-w-[16px] !px-1 !text-[10px] opacity-0 transition-opacity group-hover/prop:opacity-100 md:inline-flex" aria-hidden="true">{kbd}</kbd>}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** UX-C: nhóm thuộc tính (Details / Planning / More) — tiêu đề nhỏ, gập được, nhớ theo trình duyệt. */
function PropGroup({ id, title, children, defaultOpen = true }: { id: string; title: string; children: ReactNode; defaultOpen?: boolean }) {
  const key = `ctwork:issue-group:${id}`;
  const [open, setOpen] = useState(defaultOpen);
  useEffect(() => {
    try { const v = window.localStorage.getItem(key); if (v === '0' || v === '1') setOpen(v === '1'); } catch { /* riêng tư */ }
  }, [key]);
  const toggle = () => setOpen((o) => { try { window.localStorage.setItem(key, o ? '0' : '1'); } catch { /* bỏ qua */ } return !o; });
  return (
    <div className="border-t border-[var(--w-border)] pt-2 first:border-t-0 first:pt-0">
      <button type="button" onClick={toggle} aria-expanded={open} className="mb-1 flex w-full items-center gap-1 text-left text-[12px] font-semibold text-[var(--w-text-2)] hover:text-[var(--w-text)]">
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />} {title}
      </button>
      {open && <div className="space-y-0.5 pb-1">{children}</div>}
    </div>
  );
}

// ─── Tiêu đề sửa tại chỗ ─────────────────────────────────────────

function TitleEditor({ value, editable, onSave }: { value: string; editable: boolean; onSave: (v: string) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  if (!editable) return <h1 className="text-[20px] font-semibold leading-snug tracking-[-0.015em] [overflow-wrap:anywhere]">{value}</h1>;
  const commit = () => {
    const t = draft?.trim();
    setDraft(null);
    if (t && t !== value) onSave(t);
  };
  return (
    <textarea
      aria-label={wt('detail.issueTitle')}
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
      className="-mx-1.5 w-[calc(100%+12px)] resize-none rounded-[6px] bg-transparent px-1.5 py-0.5 text-[20px] font-semibold leading-snug tracking-[-0.015em] text-[var(--w-text)] outline-none hover:bg-[var(--w-hover)] focus:bg-[var(--w-panel)] focus:shadow-[0_0_0_1px_var(--w-accent-border)]"
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
  usePresenceFlag(config.id, issue.number, 'editing', editing);
  const start = () => { setDraft(issue.descriptionJson); setEditing(true); };
  const save = async () => {
    await onSave(isDocEmpty(draft) ? null : draft);
    setEditing(false);
  };
  if (editing) {
    return (
      <div>
        <RichEditor value={draft} onChange={(d) => setDraft(d)} members={config.members} projectId={config.id} autoFocus minHeight={140} onSubmit={save} onEscape={() => setEditing(false)} />
        <div className="mt-2 flex gap-2">
          <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={saving} onClick={save}>{saving ? wt('common.saving') : wt('common.save')}</button>
          <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => setEditing(false)}>{wt('common.cancel')}</button>
        </div>
      </div>
    );
  }
  if (empty) {
    return editable ? (
      <button type="button" onClick={start} className="w-full rounded-[6px] px-2 py-2 text-left text-[13px] text-[var(--w-text-3)] hover:bg-[var(--w-hover)]">
        {wt('detail.addDesc')}
      </button>
    ) : <p className="text-[13px] text-[var(--w-text-3)]">{wt('detail.noDesc')}</p>;
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

function Subtasks({ issue, config, lk, onOpen, onAdd, pid }: { issue: TIssueDetail; config: ProjectConfig; lk: Lookups; onOpen: (n: number) => void; onAdd: () => void; pid: number }) {
  const qc = useQueryClient();
  const [quick, setQuick] = useState('');
  const [adding, setAdding] = useState(false);
  const subType = config.issueTypes.find((t) => t.level === -1);
  const hasSubtaskType = !!subType;
  const type = lk.types.get(issue.typeId);
  if (!type || type.level === -1) return null;
  const isEpic = type.level === 1;
  const kids = issue.children;
  const done = kids.filter((k) => lk.statuses.get(k.statusId)?.category === 'DONE').length;
  const canAdd = !isEpic && hasSubtaskType && config.permissions.editIssues && config.permissions.createIssues;
  if (!kids.length && !canAdd) return null;
  const pct = kids.length ? Math.round((done / kids.length) * 100) : 0;
  // UX-C: thêm nhanh việc con ngay tại chỗ (Enter) — như checklist; "Chi tiết…" vẫn mở hộp thoại đầy đủ.
  const quickAdd = async () => {
    const title = quick.trim();
    if (!title || !subType || adding) return;
    setAdding(true);
    try {
      await workApi.createIssue(pid, { typeId: subType.id, title, parentId: issue.id });
      setQuick('');
      qc.invalidateQueries({ queryKey: wk.issue(pid, issue.number) });
      qc.invalidateQueries({ queryKey: wk.board(pid) });
      qc.invalidateQueries({ queryKey: wk.issues(pid) });
    } catch (err) {
      toast.error(workError(err, wt('uxc.subtaskFailed')));
    } finally { setAdding(false); }
  };
  return (
    <section aria-label={isEpic ? wt('detail.inEpic') : wt('detail.subtasks')}>
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-[13px] font-semibold">{isEpic ? wt('detail.inEpic') : wt('detail.subtasks')}</h3>
        {kids.length > 0 && (
          <>
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-[var(--w-sunken)]" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={wt('uxc.subtaskProgress')}>
              <div className="h-full bg-[var(--w-green)]" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[12px] text-[var(--w-text-3)] tabular">{wt('detail.nDone', { a: done, b: kids.length })} · {pct}%</span>
          </>
        )}
        {canAdd && (
          <button type="button" onClick={onAdd} className="w-btn w-btn-ghost w-btn-sm ml-auto" title={wt('uxc.subtaskDetailsTip')}><Plus size={13} /> {wt('uxc.subtaskDetails')}</button>
        )}
      </div>
      <div className="overflow-hidden rounded-[6px] border border-[var(--w-border)]">
        {kids.map((k) => {
          const st = lk.statuses.get(k.statusId);
          const isDone = st?.category === 'DONE';
          return (
            <button
              key={k.id}
              type="button"
              onClick={() => onOpen(k.number)}
              className="flex w-full items-center gap-2 border-b border-[var(--w-border)] px-2.5 py-1.5 text-left text-[13px] last:border-b-0 hover:bg-[var(--w-hover)]"
            >
              <span aria-hidden="true" className={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border text-[10px]', isDone ? 'border-[var(--w-green)] bg-[var(--w-green)] text-white' : st?.category === 'IN_PROGRESS' ? 'border-[var(--w-accent)]' : 'border-[var(--w-border-strong)]')}>{isDone ? '✓' : ''}</span>
              <span className="shrink-0 font-mono text-[11px] text-[var(--w-text-3)]">{lk.issueKey(k.number)}</span>
              <span className={cn('min-w-0 flex-1 truncate', isDone && 'text-[var(--w-text-3)] line-through')}>{k.title}</span>
              <PriorityIcon priority={k.priority} size={13} />
              <UserAvatar user={k.assigneeId ? lk.members.get(k.assigneeId) : null} size={18} />
              <StatusBadge status={st} />
            </button>
          );
        })}
        {canAdd && (
          <form className="flex items-center gap-2 px-2.5 py-1" onSubmit={(e) => { e.preventDefault(); void quickAdd(); }}>
            <Plus size={13} className="shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />
            <input
              value={quick} onChange={(e) => setQuick(e.target.value)} maxLength={255} disabled={adding}
              placeholder={wt('uxc.quickSubtaskPh')} aria-label={wt('uxc.quickSubtask')}
              className="h-7 min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[var(--w-text-3)]"
              data-testid="quick-subtask"
            />
            {quick.trim() && <button type="submit" className="w-btn w-btn-sm w-btn-primary" disabled={adding}>{adding ? <Spinner size={11} /> : wt('common.add')}</button>}
          </form>
        )}
      </div>
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
    onError: (err) => toast.error(workError(err, wt('detail.linkFailed'))),
  });
  const remove = useMutation({
    mutationFn: (linkId: number) => workApi.removeLink(pid, issue.number, linkId),
    onSuccess: refresh,
    onError: (err) => toast.error(workError(err, wt('detail.removeLinkFailed'))),
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
        <h3 className="text-[13px] font-semibold">{wt('detail.linkedIssues')}</h3>
        {editable && !adding && <button type="button" onClick={() => setAdding(true)} className="w-btn w-btn-ghost w-btn-sm ml-auto"><Link2 size={13} /> {wt('detail.linkIssue')}</button>}
      </div>
      {adding && (
        <form className="mb-3 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); if (target.trim()) add.mutate(); }}>
          <select value={type} onChange={(e) => setType(e.target.value as LinkType)} className="w-input w-auto">
            {(Object.keys(LINK_PHRASE) as LinkType[]).map((t) => <option key={t} value={t}>{LINK_PHRASE[t][0]}</option>)}
          </select>
          <input autoFocus value={target} onChange={(e) => setTarget(e.target.value)} placeholder={wt('detail.egKey', { k: lk.issueKey(1) })} className="w-input w-[140px] font-mono uppercase" />
          <button type="submit" className="w-btn w-btn-primary" disabled={!target.trim() || add.isPending}>{wt('desk.link')}</button>
          <button type="button" className="w-btn w-btn-ghost" onClick={() => setAdding(false)}>{wt('common.cancel')}</button>
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
                  <button type="button" title={wt('detail.removeLink')} onClick={() => remove.mutate(l.id)} className="w-btn w-btn-ghost w-btn-icon w-btn-sm opacity-0 group-hover:opacity-100"><X size={12} /></button>
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

function AttachmentItem({ a, pid, canDelete, onDeleted, share }: { a: IssueAttachment; pid: number; canDelete: boolean; onDeleted: () => void; share?: ReactNode }) {
  const isImage = a.mime.startsWith('image/');
  const thumb = useQuery({
    queryKey: ['work', 'att', pid, a.id],
    queryFn: () => workApi.attachmentUrl(pid, a.id, true),
    enabled: isImage,
    // URL ký sẵn sống 10 phút với nhân viên nhưng chỉ 2 phút với khách cổng (issues.service
    // CLIENT_URL_TTL_S) — giữ dưới mức ngắn hơn để mở lại thẻ không vấp URL hết hạn.
    staleTime: 90_000,
  });
  const download = async () => {
    try {
      window.open(await workApi.attachmentUrl(pid, a.id), '_blank', 'noopener');
    } catch (err) {
      toast.error(workError(err, wt('chat.downloadFailed')));
    }
  };
  const [confirmDel, setConfirmDel] = useState(false);
  const del = async () => {
    setConfirmDel(false);
    try { await workApi.deleteAttachment(pid, a.id); onDeleted(); } catch (err) { toast.error(workError(err, wt('detail.removeFailed'))); }
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
      {share}
      <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button type="button" title={wt('common.download')} onClick={download} className="w-btn w-btn-icon w-btn-sm"><Download size={12} /></button>
        {canDelete && <button type="button" title={wt('common.remove')} onClick={() => setConfirmDel(true)} className="w-btn w-btn-icon w-btn-sm"><Trash2 size={12} /></button>}
      </div>
      <ConfirmDialog open={confirmDel} onClose={() => setConfirmDel(false)} onConfirm={del} title={wt('detail.removeAttachment')} body={wt('detail.removeAttBody', { f: a.fileName })} confirmLabel={wt('common.remove')} />
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
      if (file.size > 25 * 1024 * 1024) { toast.error(wt('detail.tooBig25', { f: file.name })); continue; }
      setUploads((u) => [...u, { name: file.name, pct: 0 }]);
      try {
        await workApi.uploadAttachment(pid, issue.number, file, (pct) => setUploads((u) => u.map((x) => (x.name === file.name ? { ...x, pct } : x))));
      } catch (err) {
        toast.error(workError(err, wt('detail.uploadX', { f: file.name })));
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
        <h3 className="text-[13px] font-semibold">{wt('detail.attachments')} {issue.attachments.length > 0 && <span className="font-normal text-[var(--w-text-3)]">{issue.attachments.length}</span>}</h3>
        {config.permissions.attach && (
          <>
            <button type="button" onClick={() => inputRef.current?.click()} className="w-btn w-btn-ghost w-btn-sm ml-auto"><Paperclip size={13} /> {wt('detail.attach')}</button>
            <input ref={inputRef} type="file" multiple hidden onChange={(e) => { if (e.target.files) void upload(e.target.files); e.target.value = ''; }} />
          </>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {issue.attachments.map((a) => (
          <AttachmentItem
            key={a.id} a={a} pid={pid} canDelete={a.uploader?.id === meId || config.role === 'ADMIN'} onDeleted={refresh}
            share={<AttachmentClientControls config={config} pid={pid} issueNumber={issue.number} issueShared={!!issue.clientVisible} a={a} />}
          />
        ))}
        {uploads.map((u) => (
          <div key={u.name} className="flex h-[132px] w-[148px] flex-col items-center justify-center gap-2 rounded-[6px] border border-dashed border-[var(--w-border-strong)] px-2 text-center">
            <Spinner />
            <div className="w-full truncate text-[11px] text-[var(--w-text-2)]">{u.name}</div>
            <div className="text-[11px] tabular text-[var(--w-text-3)]">{u.pct}%</div>
          </div>
        ))}
        {!issue.attachments.length && !uploads.length && (
          <p className="text-[12px] text-[var(--w-text-3)]">{wt('detail.dropHint')}</p>
        )}
      </div>
    </section>
  );
}

// ─── Tab dưới thân thẻ (UX-C) ────────────────────────────────────

type DetailTab = 'activity' | 'comments' | 'history' | 'worklog' | 'links' | 'agent';
const DETAIL_TABS: Array<{ id: DetailTab; label: string }> = [
  { id: 'activity', get label() { return wt('uxc.tActivity'); } },
  { id: 'comments', get label() { return wt('detail.tComments'); } },
  { id: 'history', get label() { return wt('docs.history'); } },
  { id: 'worklog', get label() { return wt('detail.tWorklog'); } },
  { id: 'links', get label() { return wt('uxc.tLinks'); } },
  { id: 'agent', get label() { return wt('uxc.tAgent'); } },
];

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
  const [moving, setMoving] = useState(false);
  const router = useRouter();
  // Trang riêng trên điện thoại/iPad dọc: thẻ "Details" ngay dưới tiêu đề, mở sẵn.
  const [detailsOpen, setDetailsOpen] = useState(true);
  // UX-E: cột Details bên phải (trang riêng) — ẩn/hiện bằng nút hoặc `]`, nhớ lựa chọn. Không đủ chỗ
  // (nội dung còn < 640px — iPad dọc, app desktop 1180 khi sidebar mở) ⇒ tự về khối "Details" gập
  // được ngay dưới tiêu đề, nội dung dùng hết bề ngang.
  const panes = usePanes('issue', { right: { width: 352, minFrame: 1024 }, minMain: 640 });
  const sidePane = panes.right;
  const sideOn = variant === 'page' && sidePane.mode === 'inline';
  usePaneKeys(variant === 'page' ? {
    right: () => (sidePane.mode === 'drawer' ? setDetailsOpen((v) => !v) : sidePane.toggle()),
  } : {});

  const q = useQuery({ queryKey: wk.issue(pid, num), queryFn: () => workApi.issue(pid, num), retry: (n, err) => workErrorStatus(err) !== 404 && n < 2 });
  const issue = q.data;

  // UX-C: tab dưới thân thẻ (Activity / Comments / History / Work log / Links / Agent) — nhớ lựa chọn (trình duyệt).
  const rootRef = useRef<HTMLDivElement>(null);
  const [tab, setTabState] = useState<DetailTab>('activity');
  useEffect(() => {
    try { const v = window.localStorage.getItem('ctwork:issue-tab') as DetailTab | null; if (v && DETAIL_TABS.some((t) => t.id === v)) setTabState(v); } catch { /* riêng tư */ }
  }, []);
  const setTab = (t: DetailTab) => { setTabState(t); try { window.localStorage.setItem('ctwork:issue-tab', t); } catch { /* bỏ qua */ } };

  // UX-C: phím tắt sửa nhanh trường — a người làm · s trạng thái · p ưu tiên · l nhãn · d hạn · e ước lượng · i giao cho tôi.
  // Ngăn kéo: luôn nhận (nó là lớp trên cùng); trang riêng: khi focus ở trong thẻ hoặc ở body. Có hộp thoại thật ⇒ nhường.
  const meRef = useRef<{ id?: number; canTake: boolean }>({ canTake: false });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      if (isTyping(e.target)) return;
      const root = rootRef.current;
      if (!root || !q.data) return;
      if (document.querySelector('[role="dialog"]')) return;
      const ae = document.activeElement;
      if (variant === 'page' && ae && ae !== document.body && !root.contains(ae)) return;
      const k = e.key.toLowerCase();
      if (k === 'i') {
        if (!meRef.current.canTake || !meRef.current.id) return;
        e.preventDefault();
        void set({ assigneeId: meRef.current.id });
        return;
      }
      const f = ({ a: 'assignee', s: 'status', p: 'priority', l: 'labels', d: 'due', e: 'estimate' } as Record<string, string>)[k];
      if (!f) return;
      const el = root.querySelector<HTMLElement>(`[data-field="${f}"] button:not([disabled]), [data-field="${f}"] input:not([disabled])`)
        ?? (f === 'status' ? root.querySelector<HTMLElement>('[data-field="status-head"] button:not([disabled])') : null);
      if (!el) return;
      e.preventDefault();
      el.focus();
      if (el.tagName === 'BUTTON') el.click();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `set` đổi mỗi lần render; đọc qua q.data/meRef
  }, [q.data, variant]);
  const editable = config.permissions.editIssues;
  const base = `/work/${config.workspace.slug}/${config.key}`;

  // Mã cũ của thẻ đã chuyển dự án (S1) ⇒ server trả 404 WORK_ISSUE_MOVED kèm mã mới: tự sang mã mới.
  const moved = issueMovedTo(q.error);
  useEffect(() => {
    if (!moved) return;
    const projectKey = moved.key.slice(0, moved.key.lastIndexOf('-'));
    toast.info(wt('detail.movedTo', { a: `${config.key}-${num}`, b: moved.key }));
    router.replace(`/work/${config.workspace.slug}/${projectKey}/issue/${moved.number}`);
  }, [moved?.key]); // eslint-disable-line react-hooks/exhaustive-deps

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
        toast.error(wt('detail.someoneChanged'));
        qc.invalidateQueries({ queryKey: wk.issue(pid, num) });
      } else {
        toast.error(workError(err, wt('detail.saveChangeFailed')));
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
    onError: (err) => toast.error(workError(err, wt('common.couldNotDelete'))),
  });

  const clone = useMutation({
    mutationFn: () => workApi.cloneIssue(pid, num),
    onSuccess: (copy) => {
      qc.invalidateQueries({ queryKey: wk.board(pid) });
      qc.invalidateQueries({ queryKey: wk.issues(pid) });
      qc.invalidateQueries({ queryKey: wk.backlog(pid) });
      qc.invalidateQueries({ queryKey: wk.issue(pid, num) });
      toast.success(wt('detail.clonedAs', { k: lk.issueKey(copy.number) }), { action: { label: wt('common.open'), onClick: () => onOpenIssue(copy.number) } });
    },
    onError: (err) => toast.error(workError(err, wt('detail.cloneFailed'))),
  });

  const subtaskDefaults = useMemo(() => (issue ? { parent: { id: issue.id, number: issue.number, title: issue.title } } : undefined), [issue]);

  const openKey = (key: string) => {
    const [k, n] = key.split('-');
    if (k === config.key) onOpenIssue(Number(n));
    else window.location.href = `/work/${config.workspace.slug}/${k}/issue/${n}`;
  };

  if (q.isLoading || moved) return <PageLoading />;
  if (!issue) {
    return (
      <div className="flex h-full flex-col">
        {onClose && <div className="flex justify-end p-2"><button type="button" onClick={onClose} className="w-btn w-btn-ghost w-btn-icon"><X size={16} /></button></div>}
        <EmptyState title={wt('detail.notFound')} body={workErrorStatus(q.error) === 404 ? wt('detail.notFoundBody') : workError(q.error)} />
      </div>
    );
  }

  const type = lk.types.get(issue.typeId);
  const url = `${publicOrigin()}${base}/issue/${num}`;

  // UX-C: thuộc tính NHÓM LẠI (Details / Planning / More), mỗi trường có phím tắt (a s p l d e i) — xem useFieldKeys.
  const meCanTake = editable && issue.assigneeId !== meId && config.members.some((m) => m.id === meId && (m.role === 'ADMIN' || m.role === 'MEMBER'));
  meRef.current = { id: meId, canTake: meCanTake };
  const properties = (
    <div className="space-y-2">
      <div className="mb-2" data-field="status">
        <StatusPicker lk={lk} issue={issue} onChange={(statusId) => set({ statusId })} disabled={!config.permissions.transition} />
      </div>
      <PropGroup id="details" title={wt('uxc.gDetails')}>
        <Prop label={wt('common.assignee')} field="assignee" kbd="A">
          <AssigneePicker config={config} value={issue.assigneeId} onChange={(assigneeId) => set({ assigneeId })} meId={meId} bare disabled={!editable} />
          {meCanTake && (
            <button type="button" onClick={() => set({ assigneeId: meId })} className="px-2 text-[12px] text-[var(--w-accent-text)] hover:underline" title={wt('uxc.kAssignMe')}>{wt('detail.assignMe')}</button>
          )}
        </Prop>
        <Prop label={wt('common.reporter')}>
          <div className="flex items-center gap-2 px-2 text-[13px]"><UserAvatar user={issue.reporter} size={18} /><span className="truncate">{issue.reporter ? (issue.reporter.displayName || issue.reporter.fullName || issue.reporter.username) : wt('detail.unknown')}</span></div>
        </Prop>
        <Prop label={wt('common.priority')} field="priority" kbd="P"><PriorityPicker value={issue.priority} onChange={(priority) => set({ priority })} bare disabled={!editable} /></Prop>
        <Prop label={wt('common.labels')} field="labels" kbd="L"><LabelsPicker config={config} value={issue.labelIds} onChange={(labelIds) => set({ labelIds })} bare disabled={!editable} /></Prop>
        {/* CTW-11: cờ "Bị chặn" (khách không thấy). */}
        {!config.clientView && (
          <Prop label={wt('detail.blocked')}>
            <FlagControl pid={pid} num={issue.number} flaggedAt={issue.flaggedAt} reason={issue.flagReason} editable={editable} onChanged={() => void qc.invalidateQueries({ queryKey: wk.issue(pid, issue.number) })} />
          </Prop>
        )}
      </PropGroup>
      <PropGroup id="planning" title={wt('uxc.gPlanning')}>
        {type && type.level !== 1 && (
          <Prop label={type.level === -1 ? wt('common.parent') : wt('common.epic')}>
            <ParentPicker
              config={config} lk={lk} childLevel={type.level} excludeId={issue.id}
              value={issue.parent ? { id: issue.parent.id, number: issue.parent.number, title: issue.parent.title } : null}
              onChange={(p) => set({ parentId: p?.id ?? null })}
              bare disabled={!editable}
            />
          </Prop>
        )}
        {config.type !== 'KANBAN' && type?.level === 0 && (
          <Prop label={wt('common.sprint')}><SprintPicker config={config} value={issue.sprintId} onChange={(sprintId) => set({ sprintId })} bare disabled={!editable} /></Prop>
        )}
        <Prop label={wt('detail.fixVersion')}><FixVersionPicker config={config} value={issue.fixVersionId} onChange={(fixVersionId) => set({ fixVersionId })} bare disabled={!editable} /></Prop>
        {type?.level !== 1 && (
          <Prop label={config.settings?.estimation === 'HOURS' ? wt('detail.estimateH') : wt('common.storyPoints')} field="estimate" kbd="E">
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
        <Prop label={wt('common.startDate')}><DateInput value={issue.startDate} onChange={(startDate) => set({ startDate })} disabled={!editable} /></Prop>
        <Prop label={wt('common.dueDate')} field="due" kbd="D">
          <div className="flex min-w-0 items-center">
          <DateInput value={issue.dueDate} onChange={(dueDate) => set({ dueDate })} disabled={!editable} />
          {/* CTW-25: thêm hạn thẻ vào Google Calendar / Outlook (deep link). */}
          {issue.dueDate && (
            <AddToCalendar
              label={wt('detail.calendar')} className="ml-1 !h-6 !px-1.5 text-[11.5px]"
              event={{ title: wt('detail.dueTitle', { k: lk.issueKey(issue.number), t: issue.title }), start: issue.dueDate.slice(0, 10), allDay: true, details: `${config.name}\n${typeof window !== 'undefined' ? window.location.origin : ''}${base}/issue/${issue.number}` }}
            />
          )}
          </div>
        </Prop>
        {studioOn(config, 'teams') && (
          <Prop label={wt('detail.team')}><TeamPicker config={config} value={issue.teamId} onChange={(teamId) => set({ teamId })} disabled={!editable} /></Prop>
        )}
        {studioOn(config, 'stages') && (
          <Prop label={wt('detail.stage')}><StagePicker config={config} value={issue.stageId} onChange={(stageId) => set({ stageId })} disabled={!editable} /></Prop>
        )}
        {config.components.length > 0 && (
          <Prop label={wt('common.components')}><ComponentsPicker config={config} value={issue.componentIds} onChange={(componentIds) => set({ componentIds })} bare disabled={!editable} /></Prop>
        )}
      </PropGroup>
      <PropGroup id="more" title={wt('uxc.gMore')}>
        <Prop label={wt('detail.aiAssisted')}>
          <AiAssistedControl
            on={!!(issue as typeof issue & AiProvenance).aiAssisted}
            model={(issue as AiProvenance).aiModel}
            at={(issue as AiProvenance).aiAssistedAt}
            editable={editable}
            onToggle={(v) => set({ aiAssisted: v } as unknown as IssuePatch)}
          />
        </Prop>
        <CustomFieldsGroup pid={pid} num={num} typeKey={type?.key} config={config} editable={editable} />
        {type?.key === 'BUG' && <DefectPanel pid={pid} num={num} editable={editable} />}
        <TimeTrackingBlock pid={pid} issue={issue} config={config} />
        <DevelopmentPanel pid={pid} num={num} issueKey={lk.issueKey(num)} />
      </PropGroup>
      <div className="mt-3 space-y-1 border-t border-[var(--w-border)] pt-3 text-[12px] text-[var(--w-text-3)]">
        <div>{wt('detail.createdLine', { d: formatDate(issue.createdAt), r: relativeTime(issue.createdAt) })}</div>
        <div>{wt('detail.updatedLine', { r: relativeTime(issue.updatedAt) })}</div>
        {issue.resolvedAt && <div>{wt('detail.resolvedLine', { d: formatDate(issue.resolvedAt) })}</div>}
        {editable && <div className="hidden pt-1 md:block" data-testid="issue-field-keys">{wt('uxc.fieldKeys')}</div>}
      </div>
    </div>
  );

  return (
    <div ref={rootRef} className="flex h-full flex-col">
      {/* Thanh trên */}
      <div className={cn('w-header flex shrink-0 items-center gap-2 border-b border-[var(--w-border)] px-4', variant === 'page' ? 'h-[52px] md:px-5' : 'h-12')}>
        {/* Trang riêng: nút ☰ của điện thoại nằm ở header này (thay thanh dự phòng của layout). */}
        {variant === 'page' && <MobileNavButton />}
        {variant === 'page' && (
          <nav aria-label={wt('detail.breadcrumb')} className="flex min-w-0 shrink items-center gap-1.5 text-[13px] max-md:!hidden">
            <Crumb href={`/work/${config.workspace.slug}`} className="max-w-[160px] max-lg:!hidden">{config.workspace.name}</Crumb>
            <CrumbSep className="max-lg:!hidden" />
            <Crumb href={`${base}/board`} className="max-w-[200px]">
              <ProjectMark k={config.key} size={18} brand={config} />
              <span className="truncate">{config.name}</span>
            </Crumb>
            <CrumbSep />
          </nav>
        )}
        <div className={cn('flex min-w-0 items-center gap-1.5 text-[var(--w-text-3)]', variant === 'page' ? 'text-[13px]' : 'text-[12px]')}>
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
        {/* UX-C: đổi trạng thái ngay trên thanh đầu (phím S). */}
        <div className="ml-1 hidden w-auto max-w-[200px] shrink-0 sm:block" data-field="status-head" data-testid="issue-status-head">
          <StatusPicker lk={lk} issue={issue} onChange={(statusId) => set({ statusId })} bare disabled={!config.permissions.transition} />
        </div>
        <div className="w-header-actions ml-auto flex items-center gap-1">
          <EditLockPill config={config} />
          {type && <AiIssueMenu config={config} issueNumber={issue.number} typeKey={type.key} />}
          <button
            type="button"
            title={issue.isWatching ? wt('detail.stopWatching') : wt('detail.watch')}
            onClick={() => watch.mutate(!issue.isWatching)}
            className="w-btn w-btn-ghost w-btn-sm"
          >
            <Eye size={13} className={issue.isWatching ? 'text-[var(--w-accent-text)]' : undefined} />
            <span className={cn('tabular', issue.isWatching && 'text-[var(--w-accent-text)]')}>{issue.watcherCount}</span>
          </button>
          <button type="button" title={wt('common.copyLink')} onClick={() => { void navigator.clipboard.writeText(url); toast.success(wt('common.linkCopied')); }} className="w-btn w-btn-ghost w-btn-icon w-btn-sm"><Copy size={13} /></button>
          {/* CTW K-3: chia sẻ thẻ vào kênh chat (thẻ xem trước theo quyền người xem). Khách không có kênh nội bộ. */}
          {config.role !== 'CLIENT' && <ShareToChannelButton pid={config.id} path={`/work/${config.workspace.slug}/${config.key}/issue/${issue.number}`} label={`${lk.issueKey(issue.number)}: ${issue.title}`} wsSlug={config.workspace.slug} projectKey={config.key} compact className="w-btn-ghost" />}
          {variant === 'drawer' && (
            <Link href={`${base}/issue/${num}`} title={wt('detail.openFull')} className="w-btn w-btn-ghost w-btn-icon w-btn-sm"><ExternalLink size={13} /></Link>
          )}
          {(issue.canDelete || config.permissions.createIssues) && (
            <>
              <button ref={menuRef} type="button" onClick={menu.toggle} className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('common.moreActions')}><MoreHorizontal size={14} /></button>
              <Popover open={menu.on} onClose={menu.close} anchorRef={menuRef} width={230} align="end">
                <div className="p-1">
                  {config.permissions.createIssues && (
                    <button
                      type="button"
                      disabled={clone.isPending}
                      onClick={() => { menu.close(); clone.mutate(); }}
                      title={wt('detail.cloneTip')}
                      className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)] disabled:opacity-50"
                    >
                      <CopyPlus size={13} /> {wt('detail.clone')}
                    </button>
                  )}
                  {issue.canDelete && (
                    <button
                      type="button"
                      onClick={() => { menu.close(); setMoving(true); }}
                      title={wt('detail.moveTip')}
                      className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)]"
                    >
                      <ArrowRightLeft size={13} /> {wt('detail.moveProject')}
                    </button>
                  )}
                  {issue.canDelete && (
                    <button
                      type="button"
                      onClick={() => { menu.close(); setConfirmDelete(true); }}
                      className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px] text-[var(--w-red)] hover:bg-[var(--w-hover)]"
                    >
                      <Trash2 size={13} /> {wt('detail.deleteIssue')}
                    </button>
                  )}
                </div>
              </Popover>
            </>
          )}
          {onClose && <button type="button" onClick={onClose} title={wt('detail.closeEsc')} className="w-btn w-btn-ghost w-btn-icon w-btn-sm"><X size={15} /></button>}
          {variant === 'page' && sidePane.mode !== 'drawer' && (
            <PaneToggle pane={sidePane} side="right" label={wt('common.details')} shortcut="]" showLabel={false} className="w-btn-ghost" />
          )}
        </div>
        {variant === 'page' && <HeaderTools />}
      </div>

      {/* Thân */}
      <div ref={variant === 'page' ? panes.ref : undefined} className="min-h-0 flex-1 overflow-y-auto">
        <div className={cn('flex flex-col gap-6 p-5', variant === 'page' ? cn('mx-auto w-full max-w-[1240px] lg:px-8 lg:py-7', sideOn && 'flex-row gap-8') : 'xl:flex-row')}>
          <div className={cn('min-w-0 flex-1 space-y-7', variant === 'page' && (sideOn ? 'max-w-[820px]' : 'mx-auto w-full max-w-[860px]'))}>
            <TitleEditor value={issue.title} editable={editable} onSave={(title) => set({ title })} />
            <IssueClientShare config={config} pid={pid} issue={issue} />
            <IssuePresenceStrip pid={pid} num={issue.number} enabled={config.role !== 'CLIENT'} />
            <div className="xl:hidden">{variant === 'drawer' && properties}</div>
            {variant === 'page' && !sideOn && (
              // Không có cột Details (hẹp, hoặc người dùng ẩn): thuộc tính nằm ngay dưới tiêu đề
              // (không bị đẩy xuống sau mọi bình luận).
              <section className="rounded-[8px] border border-[var(--w-border)]" data-testid="issue-details-inline">
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
            {/* Đợt S5a: service desk — P1–P4, đồng hồ SLA, chờ khách (tự ẩn khi mô-đun tắt / khách / thẻ không qua desk
                mà người xem không xử lý được). Đặt TRƯỚC mô tả: với yêu cầu của khách, đồng hồ là thứ cần thấy đầu tiên. */}
            <IssueDesk config={config} issueNumber={issue.number} />
            <section>
              <h3 className="w-section-title mb-2">{wt('common.description')}</h3>
              <Description issue={issue} config={config} editable={editable} onSave={(d) => set({ descriptionJson: d })} saving={update.isPending} />
            </section>
            <Subtasks issue={issue} config={config} lk={lk} onOpen={onOpenIssue} onAdd={() => setSubtaskOpen(true)} pid={pid} />
            {studioOn(config, 'approvals') && <IssueApprovals config={config} issue={issue} issueKey={lk.issueKey(issue.number)} />}
            <IssueDesk config={config} issueNumber={issue.number} show="add" />
            <Attachments issue={issue} pid={pid} config={config} />
            {/* UX-C: các khối hay trống (liên kết, tài liệu, CR/rủi ro, agent, bàn giao) vào TAB — không còn 5 khối trống
                ~80px đẩy Activity xuống xa. Tab nào không có gì thì hiện một dòng gợi ý. */}
            <section aria-label={wt('uxc.issueTabs')}>
              <div className="mb-4 flex items-center gap-1 overflow-x-auto border-b border-[var(--w-border)]" role="tablist" aria-label={wt('uxc.issueTabs')}>
                {DETAIL_TABS.map((t) => (
                  <button
                    key={t.id} type="button" role="tab" id={`itab-${t.id}`} aria-selected={tab === t.id} aria-controls={`ipanel-${t.id}`}
                    onClick={() => setTab(t.id)}
                    className={cn('-mb-px whitespace-nowrap border-b-2 px-2 pb-2 text-[13px] font-medium', tab === t.id ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-3)] hover:text-[var(--w-text-2)]')}
                    data-testid={`issue-tab-${t.id}`}
                  >
                    {t.label}
                    {t.id === 'links' && issue.links.length > 0 && <span className="ml-1.5 text-[var(--w-text-3)]">{issue.links.length}</span>}
                  </button>
                ))}
              </div>
              <div role="tabpanel" id={`ipanel-${tab}`} aria-labelledby={`itab-${tab}`}>
                {(tab === 'activity' || tab === 'comments' || tab === 'history' || tab === 'worklog') && (
                  <IssueActivity pid={pid} num={num} config={config} lk={lk} clientShared={!!issue.clientVisible} view={(tab === 'activity' ? 'all' : tab) as ActivityView} />
                )}
                {tab === 'links' && (
                  <>
                    <div className="peer space-y-6">
                      <Links issue={issue} pid={pid} lk={lk} editable={editable} onOpenKey={openKey} />
                      {studioOn(config, 'docs') && <LinkedDocs config={config} issueNumber={issue.number} />}
                      {/* Resources (06/10/2026): Web links kiểu Jira (tự ẩn khi mô-đun tắt / khách). */}
                      <IssueWebLinks config={config} issueNumber={issue.number} />
                      {/* CTW đợt 8a: tệp OneDrive/SharePoint/Google Drive gắn dưới dạng liên kết (ẩn với khách). */}
                      <IssueCloudFiles config={config} issueNumber={issue.number} />
                      {/* Đợt S3b: CR liên quan + rủi ro liên quan (tự ẩn khi mô-đun tắt / khách). */}
                      <IssueGovernance config={config} issueNumber={issue.number} />
                    </div>
                    <p className="hidden text-[13px] text-[var(--w-text-3)] peer-empty:block">{wt('uxc.noLinks')}</p>
                  </>
                )}
                {tab === 'agent' && (
                  <>
                    <div className="peer space-y-6">
                      {/* CTW-28: agent đang làm / đã làm thẻ này + chi phí của thẻ (tự ẩn khi thẻ chưa từng dính agent). */}
                      <IssueAgentActivity config={config} issue={issue} done={lk.statuses.get(issue.statusId)?.category === 'DONE'} />
                      {studioOn(config, 'handoffs') && <IssueHandoffs config={config} issue={issue} issueKey={lk.issueKey(issue.number)} />}
                    </div>
                    <p className="hidden text-[13px] text-[var(--w-text-3)] peer-empty:block">{wt('uxc.noAgent')}</p>
                  </>
                )}
              </div>
            </section>
          </div>
          {(variant !== 'page' || sideOn) && (
          <aside aria-label={wt('detail.issueDetails')} className={cn('shrink-0', variant === 'page' ? 'w-[320px]' : 'hidden xl:block xl:w-[290px]')} data-testid={variant === 'page' ? 'issue-details-pane' : undefined}>
            <div className={cn('rounded-[12px] border border-[var(--w-border)] bg-[var(--w-raised)] p-3.5 shadow-[var(--w-shadow-card)]', variant === 'page' && 'sticky top-0')}>
              {properties}
            </div>
          </aside>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => { setConfirmDelete(false); del.mutate(); }}
        title={wt('detail.deleteKey', { k: lk.issueKey(num) })}
        body={wt('detail.deleteBody')}
        confirmLabel={wt('detail.deleteIssue')}
        pending={del.isPending}
      />
      {issue.canDelete && <MoveIssueDialog open={moving} onClose={() => setMoving(false)} config={config} issue={issue} lk={lk} />}
      <CreateIssueDialog open={subtaskOpen} onClose={() => setSubtaskOpen(false)} config={config} defaults={subtaskDefaults} onCreated={onOpenIssue} />
    </div>
  );
}
