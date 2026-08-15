'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AtSign, CheckCircle2, ChevronDown, ChevronUp, Loader2, MessageCircle, Reply, RotateCcw, Send, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { noteShareApi, type NoteAccessRole, type NoteComment } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import MentionAutocomplete, { type MentionSuggestion } from '@/components/social/MentionAutocomplete';

interface Props {
  noteId: number;
  noteTitle: string;
  focusCommentId?: number | null;
  onClose: () => void;
}

function nameOf(comment: NoteComment) {
  return comment.author.displayName || comment.author.fullName || comment.author.username;
}

function timeLabel(value: string) {
  return new Date(value).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
}

export default function NoteCommentsPanel({ noteId, noteTitle, focusCommentId, onClose }: Props) {
  const currentUserId = useAuthStore((state) => state.user?.id ?? 0);
  const [threads, setThreads] = useState<NoteComment[]>([]);
  const [permission, setPermission] = useState<NoteAccessRole>('viewer');
  const [loading, setLoading] = useState(true);
  const [includeResolved, setIncludeResolved] = useState(true);
  const [draft, setDraft] = useState('');
  const [mentions, setMentions] = useState<Set<number>>(new Set());
  const [replyTo, setReplyTo] = useState<NoteComment | null>(null);
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const canComment = permission === 'owner' || permission === 'editor' || permission === 'commenter';

  const load = useCallback(async () => {
    const response = await noteShareApi.listComments(noteId, includeResolved);
    setPermission(response.data.data.permission);
    setThreads(response.data.data.threads);
  }, [noteId, includeResolved]);

  useEffect(() => {
    setLoading(true);
    load().catch(() => toast.error('Không tải được bình luận')).finally(() => setLoading(false));
  }, [load]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (!focusCommentId || loading) return;
    const target = document.querySelector(`[data-note-comment-id="${focusCommentId}"]`);
    target?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [focusCommentId, loading, threads]);

  const submit = async () => {
    if (!draft.trim() || busy || !canComment) return;
    setBusy(true);
    try {
      await noteShareApi.createComment(noteId, {
        content: draft,
        parentId: replyTo?.id,
        mentions: mentions.size ? Array.from(mentions) : undefined,
      });
      setDraft('');
      setMentions(new Set());
      if (replyTo) setExpanded((current) => new Set(current).add(replyTo.id));
      setReplyTo(null);
      await load();
      toast.success(replyTo ? 'Đã gửi trả lời' : 'Đã thêm bình luận');
    } catch { toast.error('Không thể gửi bình luận'); }
    finally { setBusy(false); }
  };

  const toggleResolved = async (thread: NoteComment) => {
    try {
      if (thread.resolvedAt) await noteShareApi.reopenComment(thread.id);
      else await noteShareApi.resolveComment(thread.id);
      await load();
    } catch { toast.error('Không thể cập nhật trạng thái thảo luận'); }
  };

  const remove = async (comment: NoteComment) => {
    if (!window.confirm('Xóa bình luận này? Các câu trả lời bên dưới cũng sẽ bị xóa.')) return;
    try {
      await noteShareApi.deleteComment(comment.id);
      await load();
      toast.success('Đã xóa bình luận');
    } catch { toast.error('Không thể xóa bình luận'); }
  };

  const addMention = (item: MentionSuggestion) => {
    setMentions((current) => new Set(current).add(item.id));
  };

  return (
    <div className="fixed inset-0 z-[75] bg-black/50 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-comments-title"
        className="ml-auto flex h-full w-full max-w-lg flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#0e1218]"
      >
        <header className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-4 dark:border-white/[0.07]">
          <div className="min-w-0">
            <h2 id="note-comments-title" className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              <MessageCircle className="h-4 w-4" /> Thảo luận
            </h2>
            <p className="mt-1 truncate text-xs text-slate-500">{noteTitle}</p>
          </div>
          <button onClick={onClose} aria-label="Đóng bảng bình luận" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:hover:bg-white/[0.06]"><X className="h-4 w-4" /></button>
        </header>

        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2 dark:border-white/[0.07]">
          <span className="text-[11px] text-slate-500">{threads.length} luồng · quyền {permission}</span>
          <label className="flex min-h-9 cursor-pointer items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <input type="checkbox" checked={includeResolved} onChange={(event) => setIncludeResolved(event.target.checked)} className="h-4 w-4 accent-teal-600" />
            Hiện đã giải quyết
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3" aria-live="polite">
          {loading ? (
            <div className="flex h-40 items-center justify-center text-slate-500"><Loader2 className="h-5 w-5 animate-spin" /></div>
          ) : threads.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-center text-sm text-slate-500">
              <MessageCircle className="mb-2 h-7 w-7 opacity-40" />
              Chưa có thảo luận nào trên trang này.
            </div>
          ) : threads.map((thread) => {
            const replies = thread.replies ?? [];
            const isExpanded = expanded.has(thread.id) || focusCommentId === thread.id || replies.some((reply) => reply.id === focusCommentId);
            const canResolve = permission === 'owner' || permission === 'editor' || thread.authorId === currentUserId;
            return (
              <article key={thread.id} data-note-comment-id={thread.id} className={`mb-3 rounded-xl border p-3 ${thread.resolvedAt ? 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-500/20 dark:bg-emerald-500/[0.05]' : 'border-slate-200 bg-white dark:border-white/[0.07] dark:bg-white/[0.02]'}`}>
                <CommentHeader comment={thread} />
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-800 dark:text-slate-200">{thread.content}</p>
                <div className="mt-3 flex flex-wrap items-center gap-1">
                  {canComment && !thread.resolvedAt && <ActionButton onClick={() => { setReplyTo(thread); textareaRef.current?.focus(); }} icon={<Reply className="h-3.5 w-3.5" />} label="Trả lời" />}
                  {canResolve && <ActionButton onClick={() => toggleResolved(thread)} icon={thread.resolvedAt ? <RotateCcw className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />} label={thread.resolvedAt ? 'Mở lại' : 'Giải quyết'} />}
                  {(thread.authorId === currentUserId || permission === 'owner') && <ActionButton danger onClick={() => remove(thread)} icon={<Trash2 className="h-3.5 w-3.5" />} label="Xóa" />}
                  {replies.length > 0 && <ActionButton onClick={() => setExpanded((current) => { const next = new Set(current); if (next.has(thread.id)) next.delete(thread.id); else next.add(thread.id); return next; })} icon={isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />} label={`${replies.length} trả lời`} />}
                </div>
                {isExpanded && replies.length > 0 && (
                  <div className="mt-3 space-y-3 border-l-2 border-slate-200 pl-3 dark:border-white/[0.08]">
                    {replies.map((reply) => (
                      <div key={reply.id} data-note-comment-id={reply.id} className="rounded-lg bg-slate-50 p-2.5 dark:bg-black/15">
                        <CommentHeader comment={reply} />
                        <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-5 text-slate-700 dark:text-slate-300">{reply.content}</p>
                        {reply.authorId === currentUserId && <div className="mt-1"><ActionButton danger onClick={() => remove(reply)} icon={<Trash2 className="h-3 w-3" />} label="Xóa" /></div>}
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <footer className="border-t border-slate-200 p-3 dark:border-white/[0.07]">
          {canComment ? (
            <div className="relative">
              {replyTo && (
                <div className="mb-2 flex items-center justify-between rounded-lg bg-sky-50 px-3 py-2 text-xs text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                  <span>Đang trả lời {nameOf(replyTo)}</span>
                  <button onClick={() => setReplyTo(null)} aria-label="Hủy trả lời"><X className="h-3.5 w-3.5" /></button>
                </div>
              )}
              <label htmlFor="note-comment-draft" className="sr-only">Nội dung bình luận</label>
              <textarea
                id="note-comment-draft"
                ref={textareaRef}
                value={draft}
                onChange={(event) => { setDraft(event.target.value); if (!event.target.value) setMentions(new Set()); }}
                rows={3}
                maxLength={4000}
                placeholder="Viết bình luận… gõ @ để nhắc thành viên"
                className="w-full resize-none rounded-xl border border-slate-300 bg-white p-3 pr-12 text-base text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-white/[0.1] dark:bg-black/20 dark:text-slate-100"
              />
              <MentionAutocomplete textareaRef={textareaRef} value={draft} onChange={setDraft} onPick={addMention} offsetY={4} />
              <button onClick={submit} disabled={!draft.trim() || busy} aria-label="Gửi bình luận" className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white hover:bg-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 disabled:opacity-40">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
              {mentions.size > 0 && <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500"><AtSign className="h-3 w-3" /> {mentions.size} người sẽ được thông báo</p>}
            </div>
          ) : (
            <p className="rounded-lg bg-slate-100 px-3 py-3 text-center text-xs text-slate-600 dark:bg-white/[0.04] dark:text-slate-400">Bạn có quyền xem. Chủ sở hữu cần cấp quyền Bình luận hoặc Chỉnh sửa để bạn tham gia.</p>
          )}
        </footer>
      </aside>
    </div>
  );
}

function CommentHeader({ comment }: { comment: NoteComment }) {
  const label = nameOf(comment);
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-teal-500 to-violet-500 text-[10px] font-semibold text-white">
        {comment.author.avatarUrl ? <img src={comment.author.avatarUrl} alt="" className="h-full w-full object-cover" /> : label.slice(0, 1).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">{label}</p>
        <p className="text-[10px] text-slate-500">{timeLabel(comment.createdAt)}</p>
      </div>
      {comment.resolvedAt && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">Đã giải quyết</span>}
    </div>
  );
}

function ActionButton({ icon, label, onClick, danger = false }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return <button type="button" onClick={onClick} className={`inline-flex min-h-8 items-center gap-1 rounded-md px-2 text-[11px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${danger ? 'text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/[0.05]'}`}>{icon}{label}</button>;
}
