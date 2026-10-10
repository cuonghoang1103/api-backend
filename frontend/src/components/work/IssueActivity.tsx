'use client';

/**
 * Hoạt động của thẻ: bình luận (có @nhắc tên) và lịch sử thay đổi.
 *
 * CTW đợt 5b K-1: trả lời theo luồng (một cấp, thu/mở), tệp + voice note ngay trong bình luận (kéo-thả / chọn / ghi
 * âm — comments/CommentFiles.tsx), phiên âm hiện dưới voice note, và hiện diện "ai đang xem / gõ / sửa" (K16).
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Bot, ChevronDown, ChevronRight, CornerDownRight, Flag, Paperclip, Pencil, Reply, Trash2 } from 'lucide-react';
import { connectSocket } from '@/lib/socket';
import { workCommentsApi, type ThreadComment } from '@/lib/work-comments-api';
import { CommentAttachments, DraftChips, useCommentDrafts, VoiceRecorder } from './comments/CommentFiles';
import { usePresenceFlag } from './comments/IssuePresence';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import {
  userName, workApi, workError, type CommentReportReason, type HistoryEntry, type ProjectConfig, type ReactionEmoji, type TiptapDoc, type WorkComment,
} from '@/lib/work-api';
import { wk, type Lookups } from './hooks';
import RichEditor, { isDocEmpty, RichView } from './RichEditor';
import { Dialog, PRIORITIES, relativeTime, Spinner, UserAvatar, formatDate } from './ui';
import { ConfirmDialog } from './settings/shared';
import { statusName } from './i18n/names';
import { WorklogList } from './TimeTracking';
import { ReactionBar, ReactionPickerButton, useCommentReactionsRealtime, useToggleReaction } from './comments/CommentReactions';
import { ClientPill, CommentModeToggle, InternalPill, portalStaff } from './portal/ClientShare';
import type { CommentVisibility } from '@/lib/work-api';
import { wt, wfmt } from '@/components/work/i18n';

function CommentComposer({ config, pid, num, clientShared, parent, onDone }: {
  config: ProjectConfig; pid: number; num: number; clientShared: boolean;
  /** K-1: soạn TRẢ LỜI cho bình luận này (luồng một cấp — server gắn vào gốc). */
  parent?: { id: number; name: string; visibility?: CommentVisibility } | null;
  onDone?: () => void;
}) {
  const qc = useQueryClient();
  const [doc, setDoc] = useState<TiptapDoc | null>(null);
  const [key, setKey] = useState(0);
  const [focused, setFocused] = useState(!!parent);
  const [dragOver, setDragOver] = useState(false);
  const [recording, setRecording] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  // Cổng khách (S2b): mặc định GHI CHÚ NỘI BỘ; "Reply to client" phải chọn chủ động. Trả lời một bình luận cho khách
  // ⇒ mặc định cũng là trả lời khách (đúng chỗ khách đang đọc).
  const portal = portalStaff(config);
  const [mode, setMode] = useState<CommentVisibility>(parent?.visibility === 'PUBLIC' ? 'PUBLIC' : 'INTERNAL');
  const toClient = portal && mode === 'PUBLIC' && clientShared;
  const drafts = useCommentDrafts(pid, num);
  const canAttach = config.permissions.attach;
  const add = useMutation({
    mutationFn: () => workCommentsApi.add(pid, num, {
      bodyJson: doc ?? { type: 'doc', content: [] },
      ...(portal ? { visibility: toClient ? 'PUBLIC' : 'INTERNAL' } : {}),
      ...(parent ? { parentId: parent.id } : {}),
      ...(drafts.ids.length ? { attachmentIds: drafts.ids } : {}),
    }),
    onSuccess: () => {
      setDoc(null);
      setKey((k) => k + 1);
      setFocused(false);
      setMode('INTERNAL');
      drafts.clear();
      qc.invalidateQueries({ queryKey: wk.comments(pid, num) });
      qc.invalidateQueries({ queryKey: wk.issue(pid, num) });
      onDone?.();
    },
    onError: (err) => toast.error(workError(err, wt('detail.postFailed'))),
  });
  const empty = isDocEmpty(doc) && !drafts.ids.length;
  const submit = () => !empty && !drafts.uploading && !add.isPending && add.mutate();
  const me = useAuthStore((s) => s.user);
  // Lấy đúng bản ghi thành viên của dự án (cùng nguồn với board/bình luận) — authStore có thể đặt displayName = username.
  const meMember = me ? config.members.find((m) => m.id === me.id) : undefined;
  const meUser = meMember ?? (me ? { username: me.username, fullName: me.fullName ?? null, displayName: me.displayName ?? null, avatarUrl: me.avatarUrl ?? null } : null);
  // K16: đang gõ (có chữ / đang ghi âm) ⇒ người khác thấy "… is typing a comment".
  usePresenceFlag(pid, num, 'typing', focused && (!isDocEmpty(doc) || recording));
  const onRecorded = useCallback((f: File, ms: number) => drafts.addVoice(f, ms), [drafts]);
  const cancel = () => {
    for (const d of drafts.drafts) drafts.remove(d.key);
    setFocused(false); setDoc(null); setKey((k) => k + 1);
    onDone?.();
  };
  const hasFiles = (e: React.DragEvent) => Array.from(e.dataTransfer?.types ?? []).includes('Files');

  return (
    <div className="flex gap-3">
      <UserAvatar user={meUser} size={parent ? 22 : 26} className="mt-1" />
      <div
        className={cn('min-w-0 flex-1 rounded-[8px]', dragOver && 'w-drop-target')}
        onFocusCapture={() => setFocused(true)}
        onDragOver={(e) => { if (canAttach && hasFiles(e)) { e.preventDefault(); setDragOver(true); } }}
        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(false); }}
        onDropCapture={(e) => {
          setDragOver(false);
          if (!canAttach || !hasFiles(e)) return;
          const all = Array.from(e.dataTransfer.files);
          // Chỉ có ảnh ⇒ để trình soạn chèn ảnh vào nội dung (đợt 3A). Có tệp khác ⇒ mọi tệp thành tệp đính kèm.
          if (!all.length || all.every((f) => f.type.startsWith('image/'))) return;
          e.preventDefault();
          e.stopPropagation();
          setFocused(true);
          drafts.addFiles(all);
        }}
        data-testid={parent ? 'reply-composer' : 'comment-composer'}
      >
        {parent && (
          <div className="mb-1.5 flex items-center gap-1.5 text-[12px] text-[var(--w-text-3)]">
            <CornerDownRight size={12} aria-hidden="true" /> {wt('detail.replyingTo')} <span className="font-medium text-[var(--w-text-2)]">{parent.name}</span>
          </div>
        )}
        {portal && (
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <CommentModeToggle value={toClient ? 'PUBLIC' : 'INTERNAL'} onChange={setMode} shared={clientShared} />
            {toClient
              ? <span className="text-[11.5px] text-[var(--w-yellow)]">{wt('detail.visibleClientEmail')}</span>
              : <span className="text-[11.5px] text-[var(--w-text-3)]">{wt('detail.internalNotes')}</span>}
          </div>
        )}
        <div className={cn(toClient && 'w-reply-client')}>
        <RichEditor
          key={key}
          value={doc}
          onChange={(d) => setDoc(d)}
          members={config.members}
          projectId={pid}
          placeholder={toClient ? wt('detail.phClient') : parent ? wt('detail.phReply') : wt('detail.phComment')}
          minHeight={focused ? 72 : 36}
          toolbar={focused}
          onSubmit={submit}
          autoFocus={!!parent}
          onEscape={parent ? cancel : undefined}
        />
        </div>
        <DraftChips drafts={drafts.drafts} onRemove={drafts.remove} />
        {(focused || drafts.drafts.length > 0 || recording) && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={empty || drafts.uploading || add.isPending || recording} onClick={submit}>
              {add.isPending ? wt('common.saving') : drafts.uploading ? wt('detail.uploading') : toClient ? wt('detail.replyClient') : parent ? wt('docs.reply') : portal ? wt('detail.addInternal') : wt('docs.comment')}
            </button>
            <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={cancel}>{wt('common.cancel')}</button>
            {canAttach && (
              <>
                <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('detail.attachFiles')} title={wt('detail.attachTip')} onClick={() => fileRef.current?.click()}>
                  <Paperclip size={14} />
                </button>
                <input ref={fileRef} type="file" multiple hidden aria-hidden="true" tabIndex={-1} onChange={(e) => { if (e.target.files?.length) drafts.addFiles(e.target.files); e.target.value = ''; }} />
                <VoiceRecorder onRecorded={onRecorded} onActive={setRecording} disabled={add.isPending} />
              </>
            )}
            <span className="ml-auto hidden text-[11px] text-[var(--w-text-3)] sm:inline"><span className="w-kbd">⌘</span> <span className="w-kbd">↵</span> {wt('detail.toSend')}</span>
          </div>
        )}
      </div>
    </div>
  );
}

const REPORT_REASONS: Array<{ value: CommentReportReason; label: string }> = [
  { value: 'spam', get label() { return wt('detail.rSpam'); } },
  { value: 'harassment', get label() { return wt('detail.rHarass'); } },
  { value: 'hate', get label() { return wt('detail.rHate'); } },
  { value: 'sexual', get label() { return wt('detail.rSexual'); } },
  { value: 'violence', get label() { return wt('detail.rViolence'); } },
  { value: 'other', get label() { return wt('detail.rOther'); } },
];

/** Báo cáo bình luận vi phạm — ADMIN dự án nhận cảnh báo, ghi vào audit log. */
function ReportCommentDialog({ open, onClose, pid, num, cid }: { open: boolean; onClose: () => void; pid: number; num: number; cid: number }) {
  const [reason, setReason] = useState<CommentReportReason>('spam');
  const [details, setDetails] = useState('');
  const send = useMutation({
    mutationFn: () => workApi.reportComment(pid, num, cid, { reason, details: details.trim() || null }),
    onSuccess: (r) => { toast.success(r.duplicate ? wt('detail.alreadyReported') : wt('detail.reportThanks')); onClose(); },
    onError: (err) => toast.error(workError(err, wt('detail.reportFailed'))),
  });
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={wt('detail.reportComment')}
      width={440}
      footer={(
        <>
          <button type="button" className="w-btn w-btn-ghost" onClick={onClose}>{wt('common.cancel')}</button>
          <button type="button" className="w-btn w-btn-danger-solid" disabled={send.isPending} onClick={() => send.mutate()}>{send.isPending && <Spinner size={12} />} {wt('detail.report')}</button>
        </>
      )}
    >
      <p className="mb-3 text-[13px] text-[var(--w-text-2)]">{wt('detail.reportIntro')}</p>
      <div className="space-y-1.5">
        {REPORT_REASONS.map((r) => (
          <label key={r.value} className="flex cursor-pointer items-center gap-2 text-[13px]">
            <input type="radio" name="report-reason" checked={reason === r.value} onChange={() => setReason(r.value)} />
            {r.label}
          </label>
        ))}
      </div>
      <textarea className="w-input mt-3 !h-auto min-h-[72px] w-full py-2" maxLength={1000} placeholder={wt('detail.detailsOpt')} value={details} onChange={(e) => setDetails(e.target.value)} />
    </Dialog>
  );
}

function CommentItem({ c, config, pid, num, onReply, reply }: { c: ThreadComment; config: ProjectConfig; pid: number; num: number; onReply?: () => void; reply?: boolean }) {
  const qc = useQueryClient();
  const meId = useAuthStore((s) => s.user?.id);
  const [editing, setEditing] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [draft, setDraft] = useState<TiptapDoc>(c.bodyJson);
  const mine = !!c.author && c.author.id === meId;
  const canDelete = (mine && config.permissions.comment) || config.role === 'ADMIN';
  const files = c.attachments ?? [];
  // K16: đang sửa bình luận ⇒ người khác thấy "… is editing".
  usePresenceFlag(pid, num, 'editing', editing);
  // Cảm xúc: ai bình luận được thì bấm được (VIEWER chỉ xem chip).
  const canReact = config.permissions.comment;
  const reactions = c.reactions ?? [];
  const meMember = meId ? config.members.find((m) => m.id === meId) : undefined;
  const react = useToggleReaction(pid, num, meId ? { id: meId, name: meMember ? userName(meMember) : wt('ai.you') } : null);
  const toggleReaction = (emoji: ReactionEmoji, active: boolean) => react.mutate({ cid: c.id, emoji, active });

  const refresh = () => qc.invalidateQueries({ queryKey: wk.comments(pid, num) });
  const save = useMutation({
    mutationFn: () => workApi.editComment(pid, num, c.id, draft),
    onSuccess: () => { setEditing(false); refresh(); },
    onError: (err) => toast.error(workError(err, wt('common.couldNotSave'))),
  });
  const del = useMutation({
    mutationFn: () => workApi.deleteComment(pid, num, c.id),
    onSuccess: () => { refresh(); qc.invalidateQueries({ queryKey: wk.issue(pid, num) }); },
    onError: (err) => toast.error(workError(err, wt('common.couldNotDelete'))),
  });

  return (
    <div id={`comment-${c.id}`} className="group flex gap-3" data-testid={reply ? 'comment-reply' : 'comment'}>
      {c.isAi ? (
        <span className={cn('mt-0.5 flex shrink-0 items-center justify-center rounded-full bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]', reply ? 'h-[22px] w-[22px]' : 'h-[26px] w-[26px]')}><Bot size={14} /></span>
      ) : (
        <UserAvatar user={c.author} size={reply ? 22 : 26} className="mt-0.5" />
      )}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px]">
          <span className="whitespace-nowrap font-semibold text-[var(--w-text)]">{c.isAi ? 'CT Work AI' : userName(c.author)}</span>
          <span className="whitespace-nowrap text-[var(--w-text-3)]" title={new Date(c.createdAt).toLocaleString('en-US')}>{relativeTime(c.createdAt)}</span>
          {c.editedAt && <span className="text-[var(--w-text-3)]">{wt('detail.edited')}</span>}
          {portalStaff(config) && (c.visibility === 'PUBLIC' ? <ClientPill label={wt('detail.replyClient')} /> : <InternalPill label={wt('detail.internalNote')} />)}
          {!editing && canReact && (
            // Nút cảm xúc hiện sẵn trên màn hình cảm ứng (không có hover).
            <span className="ml-auto flex opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
              <ReactionPickerButton reactions={reactions} onPick={(e) => toggleReaction(e, !reactions.some((r) => r.emoji === e && r.mine))} />
            </span>
          )}
          {!editing && (
            <span className={cn('flex gap-0.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100', !canReact && 'ml-auto')}>
              {onReply && config.permissions.comment && (
                <button type="button" title={wt('docs.reply')} aria-label={wt('detail.replyToX', { name: c.isAi ? 'CT Work AI' : userName(c.author) })} onClick={onReply} className="w-btn w-btn-ghost w-btn-icon w-btn-sm"><Reply size={12} /></button>
              )}
              {!mine && (
                <button type="button" title={wt('detail.reportComment')} aria-label={wt('detail.reportComment')} onClick={() => setReporting(true)} className="w-btn w-btn-ghost w-btn-icon w-btn-sm"><Flag size={12} /></button>
              )}
              {mine && (
                <button type="button" title={wt('common.edit')} onClick={() => { setDraft(c.bodyJson); setEditing(true); }} className="w-btn w-btn-ghost w-btn-icon w-btn-sm"><Pencil size={12} /></button>
              )}
              {canDelete && (
                <button type="button" title={wt('common.delete')} onClick={() => setConfirmDel(true)} className="w-btn w-btn-ghost w-btn-icon w-btn-sm"><Trash2 size={12} /></button>
              )}
            </span>
          )}
        </div>
        {editing ? (
          <>
            <RichEditor value={draft} onChange={(d) => setDraft(d)} members={config.members} projectId={config.id} autoFocus onSubmit={() => save.mutate()} onEscape={() => setEditing(false)} />
            <div className="mt-2 flex gap-2">
              <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={save.isPending || (isDocEmpty(draft) && !files.length)} onClick={() => save.mutate()}>{wt('common.save')}</button>
              <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => setEditing(false)}>{wt('common.cancel')}</button>
            </div>
          </>
        ) : (
          <>
            {!isDocEmpty(c.bodyJson) && <RichView value={c.bodyJson} />}
            <CommentAttachments pid={pid} num={num} files={files} canRetry={() => mine || config.role === 'ADMIN'} />
            <ReactionBar reactions={reactions} meId={meId} canReact={canReact} onToggle={toggleReaction} />
          </>
        )}
      </div>
      <ReportCommentDialog open={reporting} onClose={() => setReporting(false)} pid={pid} num={num} cid={c.id} />
      <ConfirmDialog
        open={confirmDel}
        onClose={() => setConfirmDel(false)}
        onConfirm={() => { setConfirmDel(false); del.mutate(); }}
        title={wt('detail.deleteComment')}
        body={wt('detail.deleteCommentBody')}
        confirmLabel={wt('common.delete')}
        pending={del.isPending}
      />
    </div>
  );
}

// ─── Lịch sử ─────────────────────────────────────────────────────

const FIELD_LABEL: Record<string, string> = {
  get title() { return wt('detail.fTitle'); }, get description() { return wt('detail.fDesc'); }, get statusId() { return wt('detail.fStatus'); }, get assigneeId() { return wt('detail.fAssignee'); }, get priority() { return wt('detail.fPriority'); },
  get storyPoints() { return wt('detail.fPoints'); }, get originalEstimateMin() { return wt('detail.fOrigEst'); }, get remainingEstimateMin() { return wt('detail.fRemEst'); },
  get startDate() { return wt('detail.fStart'); }, get dueDate() { return wt('detail.fDue'); }, get parentId() { return wt('detail.fParent'); }, get sprintId() { return 'sprint'; }, get labels() { return wt('detail.fLabels'); }, get components() { return wt('detail.fComponents'); },
  get timeSpentMin() { return wt('detail.fSpent'); }, get fixVersionId() { return wt('detail.fFixVersion'); },
};

function describe(h: HistoryEntry, lk: Lookups, config: ProjectConfig): { text: string; from?: string; to?: string } {
  const status = (v: string | null) => (v ? statusName(lk.statuses.get(Number(v))?.name ?? wt('detail.unknown')) : wt('common.none'));
  const person = (v: string | null) => (v ? userName(lk.members.get(Number(v))) : wt('common.unassigned'));
  const prio = (v: string | null) => PRIORITIES.find((p) => String(p.value) === v)?.label ?? v ?? wt('common.none');
  const sprint = (v: string | null) => (v ? config.sprints.find((s) => String(s.id) === v)?.name ?? `Sprint #${v}` : wt('share.vBacklog'));
  const minutes = (v: string | null) => (v ? `${Math.round(Number(v) / 60 * 10) / 10}h` : wt('common.none'));
  switch (h.field) {
    case 'created': return { text: wt('contrib.evCreated') };
    case 'deleted': return { text: wt('detail.hDeleted') };
    case 'link': return { text: wt('detail.hLinked', { x: h.toValue?.toLowerCase() ?? '' }) };
    case 'attachment': return h.toValue ? { text: wt('detail.hAttached', { f: h.toValue }) } : { text: wt('detail.hRemovedAtt', { f: h.fromValue ?? '' }) };
    case 'description': return { text: wt('detail.hDesc') };
    case 'statusId': return { text: wt('detail.hStatus'), from: status(h.fromValue), to: status(h.toValue) };
    case 'assigneeId': return { text: wt('detail.hAssignee'), from: person(h.fromValue), to: person(h.toValue) };
    case 'priority': return { text: wt('detail.hPriority'), from: prio(h.fromValue), to: prio(h.toValue) };
    case 'sprintId': return { text: wt('detail.hMoved'), from: sprint(h.fromValue), to: sprint(h.toValue) };
    case 'originalEstimateMin':
    case 'remainingEstimateMin':
    case 'timeSpentMin': return { text: wt('detail.hChangedThe', { f: FIELD_LABEL[h.field] }), from: minutes(h.fromValue), to: minutes(h.toValue) };
    case 'startDate':
    case 'dueDate': return { text: wt('detail.hChangedThe', { f: FIELD_LABEL[h.field] }), from: formatDate(h.fromValue) || wt('common.none'), to: formatDate(h.toValue) || wt('common.none') };
    case 'fixVersionId': return { text: h.toValue ? wt('detail.hFixV') : wt('detail.hFixVRemoved') };
    case 'parentId': return { text: h.toValue ? wt('detail.hParent') : wt('detail.hParentRemoved') };
    // CTW-28: agent kéo Done ⇒ server đổi đích sang cột Review (thiết kế §3.4).
    case 'agentReview': return { text: wt('detail.hAgentReview', { to: statusName(h.toValue ?? 'review'), from: statusName(h.fromValue ?? 'Done') }) };
    case 'clientVisible': return { text: h.toValue === 'true' ? wt('detail.hShared') : wt('detail.hUnshared') };
    case 'deliverable':
    case 'attachmentShared': return { text: wt('detail.hSharing', { f: h.toValue ?? wt('detail.aFile') }) };
    default: return { text: wt('detail.hChangedThe', { f: FIELD_LABEL[h.field] ?? h.field }), from: h.fromValue ?? wt('common.none'), to: h.toValue ?? wt('common.none') };
  }
}

/** Một dòng lịch sử (dùng chung cho tab History và luồng Activity gộp — UX-C). */
function HistoryItem({ h, lk, config }: { h: HistoryEntry; lk: Lookups; config: ProjectConfig }) {
  const d = describe(h, lk, config);
  const who = h.actorKind === 'AI' ? 'CT Work AI' : h.actorKind === 'AUTOMATION' ? wt('detail.automation') : h.actorKind === 'SYSTEM' ? wt('detail.system') : userName(h.actor);
  return (
    <li className="flex gap-3 text-[13px]">
      <UserAvatar user={h.actor} size={20} className="mt-0.5" />
      <div className="min-w-0 flex-1 leading-relaxed text-[var(--w-text-2)]">
        <span className="font-medium text-[var(--w-text)]">{who}</span> {d.text}
        <span className="ml-2 text-[12px] text-[var(--w-text-3)]" title={new Date(h.createdAt).toLocaleString(wfmt.intl())}>{relativeTime(h.createdAt)}</span>
        {d.from !== undefined && (
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[12px]">
            <span className="rounded-[4px] bg-[var(--w-sunken)] px-1.5 py-0.5 line-through decoration-[var(--w-text-3)]">{d.from}</span>
            <span className="text-[var(--w-text-3)]">→</span>
            <span className="rounded-[4px] bg-[var(--w-sunken)] px-1.5 py-0.5 text-[var(--w-text)]">{d.to}</span>
          </div>
        )}
      </div>
    </li>
  );
}

function HistoryList({ pid, num, config, lk }: { pid: number; num: number; config: ProjectConfig; lk: Lookups }) {
  const q = useQuery({ queryKey: wk.history(pid, num), queryFn: () => workApi.history(pid, num) });
  if (q.isLoading) return <div className="py-4"><Spinner /></div>;
  if (!q.data?.length) return <p className="text-[13px] text-[var(--w-text-3)]">{wt('detail.noHistory')}</p>;
  return (
    <ol className="space-y-3">
      {q.data.map((h) => <HistoryItem key={h.id} h={h} lk={lk} config={config} />)}
    </ol>
  );
}

const ACTIVITY_TABS = [
  { id: 'comments', get label() { return wt('detail.tComments'); } },
  { id: 'history', get label() { return wt('docs.history'); } },
  { id: 'worklog', get label() { return wt('detail.tWorklog'); } },
] as const;

/** K-1: phiên âm voice note xong (chạy nền trên server) ⇒ tải lại bình luận của thẻ đang mở. */
function useCommentVoiceRealtime(pid: number, num: number) {
  const qc = useQueryClient();
  useEffect(() => {
    let alive = true;
    let socket: Awaited<ReturnType<typeof connectSocket>> | null = null;
    const handler = (e: { projectId: number; number: number }) => {
      if (e.projectId === pid && e.number === num) qc.invalidateQueries({ queryKey: wk.comments(pid, num) });
    };
    connectSocket().then((s) => { if (!alive) return; socket = s; s.on('work:comment-voice', handler); }).catch(() => {});
    return () => { alive = false; socket?.off('work:comment-voice', handler); };
  }, [pid, num, qc]);
}

/** Gom bình luận phẳng thành luồng một cấp (khớp buildThreads ở server). Trả lời mồ côi đứng như gốc. */
function threadsOf(list: ThreadComment[]) {
  const roots = new Map<number, { root: ThreadComment; replies: ThreadComment[]; orphan: boolean }>();
  const out: Array<{ root: ThreadComment; replies: ThreadComment[]; orphan: boolean }> = [];
  for (const c of list) if (!c.parentId) { const t = { root: c, replies: [], orphan: false }; roots.set(c.id, t); out.push(t); }
  for (const c of list) {
    if (!c.parentId) continue;
    const t = roots.get(c.parentId);
    if (t) t.replies.push(c); else out.push({ root: c, replies: [], orphan: true });
  }
  return out;
}

/** Một luồng: gốc + trả lời (thu/mở được) + ô trả lời. */
function CommentThread({ t, config, pid, num, clientShared }: { t: ReturnType<typeof threadsOf>[number]; config: ProjectConfig; pid: number; num: number; clientShared: boolean }) {
  const [open, setOpen] = useState(t.replies.length <= 3);
  const [replying, setReplying] = useState<ThreadComment | null>(null);
  const name = (c: ThreadComment) => (c.isAi ? 'CT Work AI' : userName(c.author));
  const n = t.replies.length;
  return (
    <div data-testid="comment-thread">
      {t.orphan && <p className="mb-1 ml-[38px] text-[11.5px] text-[var(--w-text-3)]">{wt('detail.orphan')}</p>}
      <CommentItem c={t.root} config={config} pid={pid} num={num} onReply={() => setReplying(t.root)} />
      {(n > 0 || replying) && (
        <div className="ml-[13px] mt-2 border-l-2 border-[var(--w-border)] pl-[22px]">
          {n > 0 && (
            <button
              type="button"
              className="mb-2 flex items-center gap-1 text-[12px] font-medium text-[var(--w-accent-text)] hover:underline"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              {open ? wt('detail.hideReplies', { count: n }) : wt('detail.showReplies', { count: n })}
            </button>
          )}
          {open && n > 0 && (
            <div className="space-y-4">
              {t.replies.map((r) => <CommentItem key={r.id} c={r} config={config} pid={pid} num={num} reply onReply={() => setReplying(r)} />)}
            </div>
          )}
          {replying && config.permissions.comment && (
            <div className={cn(n > 0 && open && 'mt-4')}>
              <CommentComposer
                config={config} pid={pid} num={num} clientShared={clientShared}
                parent={{ id: replying.id, name: name(replying), visibility: replying.visibility }}
                onDone={() => { setReplying(null); setOpen(true); }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export type ActivityView = 'all' | 'comments' | 'history' | 'worklog';

export default function IssueActivity({ pid, num, config, lk, clientShared = false, view }: {
  pid: number; num: number; config: ProjectConfig; lk: Lookups; clientShared?: boolean;
  /** UX-C: chi tiết thẻ tự vẽ thanh tab (Activity / Comments / History / Links / Agent) ⇒ truyền `view`, ở đây không vẽ tab. */
  view?: ActivityView;
}) {
  const [tab, setTab] = useState<(typeof ACTIVITY_TABS)[number]['id']>('comments');
  const comments = useQuery({ queryKey: wk.comments(pid, num), queryFn: () => workApi.comments(pid, num) as Promise<ThreadComment[]> });
  const history = useQuery({ queryKey: wk.history(pid, num), queryFn: () => workApi.history(pid, num), enabled: view === 'all' });
  useCommentReactionsRealtime(pid, num);
  useCommentVoiceRealtime(pid, num);
  if (view) {
    const composer = config.permissions.comment
      ? <CommentComposer config={config} pid={pid} num={num} clientShared={clientShared} />
      : <p className="text-[12px] text-[var(--w-text-3)]">{wt('detail.viewOnly')}</p>;
    if (view === 'history') return <HistoryList pid={pid} num={num} config={config} lk={lk} />;
    if (view === 'worklog') return <WorklogList pid={pid} num={num} config={config} />;
    if (view === 'comments') {
      return (
        <div className="space-y-5">
          {comments.isLoading && <Spinner />}
          {threadsOf(comments.data ?? []).map((t) => <CommentThread key={t.root.id} t={t} config={config} pid={pid} num={num} clientShared={clientShared} />)}
          {composer}
        </div>
      );
    }
    // Activity: bình luận (theo luồng) + lịch sử đổi trường, xếp theo thời gian (cũ → mới, ô viết ở cuối như Jira).
    const feed: Array<{ at: string; key: string; node: ReactNode }> = [
      ...threadsOf(comments.data ?? []).map((t) => ({ at: t.root.createdAt, key: `c${t.root.id}`, node: <CommentThread t={t} config={config} pid={pid} num={num} clientShared={clientShared} /> })),
      ...(history.data ?? []).map((h) => ({ at: h.createdAt, key: `h${h.id}`, node: <ol><HistoryItem h={h} lk={lk} config={config} /></ol> })),
    ].sort((a, b) => a.at.localeCompare(b.at));
    return (
      <div className="space-y-4" data-testid="issue-activity-all">
        {(comments.isLoading || history.isLoading) && <Spinner />}
        {feed.map((f) => <div key={f.key}>{f.node}</div>)}
        {!feed.length && !comments.isLoading && !history.isLoading && <p className="text-[13px] text-[var(--w-text-3)]">{wt('uxc.noActivity')}</p>}
        {composer}
      </div>
    );
  }
  return (
    <section>
      <div className="mb-4 flex items-center gap-1 border-b border-[var(--w-border)]">
        {ACTIVITY_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn('-mb-px whitespace-nowrap border-b-2 px-2 pb-2 text-[13px] font-medium', tab === t.id ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-3)] hover:text-[var(--w-text-2)]')}
          >
            {t.label}{t.id === 'comments' && comments.data?.length ? <span className="ml-1.5 text-[var(--w-text-3)]">{comments.data.length}</span> : null}
          </button>
        ))}
      </div>
      {tab === 'comments' ? (
        <div className="space-y-5">
          {comments.isLoading && <Spinner />}
          {threadsOf(comments.data ?? []).map((t) => <CommentThread key={t.root.id} t={t} config={config} pid={pid} num={num} clientShared={clientShared} />)}
          {config.permissions.comment ? (
            <CommentComposer config={config} pid={pid} num={num} clientShared={clientShared} />
          ) : (
            <p className="text-[12px] text-[var(--w-text-3)]">{wt('detail.viewOnly')}</p>
          )}
        </div>
      ) : tab === 'history' ? (
        <HistoryList pid={pid} num={num} config={config} lk={lk} />
      ) : (
        <WorklogList pid={pid} num={num} config={config} />
      )}
    </section>
  );
}
