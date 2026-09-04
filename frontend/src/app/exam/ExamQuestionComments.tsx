'use client';

// Bình luận theo câu hỏi Exam Room — mở cho MỌI tài khoản (không cần Pro).
// 1 cấp trả lời. Bình luận của bot "cuongmini" (isAi=true) là câu CuongMini
// tự đăng lại sau khi trả lời trong panel chat — gắn nhãn riêng để phân biệt
// với bình luận người thật. Theo đúng mẫu ArticleComments.tsx (Tech Trends).

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { MessageSquare, Loader2, Pencil, Trash2, Send, X, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { examApi, type ExamQuestionComment } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import ChatMarkdown from '@/components/chat/ChatMarkdown';

function timeAgo(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'vừa xong';
  if (s < 3600) return `${Math.floor(s / 60)} phút trước`;
  if (s < 86400) return `${Math.floor(s / 3600)} giờ trước`;
  if (s < 604800) return `${Math.floor(s / 86400)} ngày trước`;
  try { return new Date(iso).toLocaleDateString('vi-VN'); } catch { return ''; }
}

function name(a: ExamQuestionComment['author']): string {
  return a.displayName || a.fullName || a.username || 'Người dùng';
}

function errMsg(err: unknown, fallback: string): string {
  const r = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
  return r || fallback;
}

export default function ExamQuestionComments({ questionId }: { questionId: number }) {
  const user = useAuthStore((s) => s.user);
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const myId = user?.id ? Number(user.id) : null;

  const [comments, setComments] = useState<ExamQuestionComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [draft, setDraft] = useState('');
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const r = await examApi.listQuestionComments(questionId);
      setComments(r.data.data);
    } catch { /* leave empty */ } finally { setLoading(false); }
  }, [questionId]);

  useEffect(() => { if (open) load(); }, [open, load]);

  const total = comments.reduce((n, c) => n + 1 + c.replies.length, 0);

  const post = async (content: string, parentId: number | null, after?: () => void) => {
    if (!content.trim()) return;
    setPosting(true);
    try {
      await examApi.addQuestionComment(questionId, content.trim(), parentId);
      after?.();
      await load();
    } catch (err) {
      toast.error(errMsg(err, 'Gửi bình luận thất bại'));
    } finally { setPosting(false); }
  };

  return (
    <div className="mt-4 rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold"
        style={{ color: 'var(--text-secondary)' }}>
        <MessageSquare className="h-4 w-4" /> Bình luận{total > 0 && !open ? ` (${total})` : ''}
      </button>

      {open && (
        <div className="border-t px-4 py-4" style={{ borderColor: 'var(--border-color)' }}>
          {isAuthed ? (
            <div className="mb-5 flex gap-2">
              <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2}
                placeholder="Viết bình luận, hỏi hoặc chia sẻ cách hiểu của bạn về câu này…"
                className="flex-1 resize-y rounded-lg border px-3 py-2 text-sm outline-none"
                style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }} />
              <button onClick={() => post(draft, null, () => setDraft(''))} disabled={posting || !draft.trim()}
                className="inline-flex shrink-0 items-center gap-1.5 self-end rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: '#8b5cf6' }}>
                {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Gửi
              </button>
            </div>
          ) : (
            <div className="mb-5 rounded-lg border px-3 py-2 text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
              <Link href="/login" className="underline" style={{ color: '#8b5cf6' }}>Đăng nhập</Link> để bình luận.
            </div>
          )}

          {loading ? (
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}><Loader2 className="h-4 w-4 animate-spin" /> Đang tải…</div>
          ) : comments.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Chưa có bình luận nào cho câu này. Hãy là người đầu tiên!</p>
          ) : (
            <ul className="space-y-4">
              {comments.map((c) => (
                <CommentItem key={c.id} comment={c} myId={myId} isAuthed={isAuthed} onChanged={load} onReply={post} posting={posting} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function Avatar({ author, isAi }: { author: ExamQuestionComment['author']; isAi: boolean }) {
  if (isAi) {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white" style={{ background: 'linear-gradient(135deg,#8b5cf6,#6366f1)' }}>
        <Sparkles className="h-4 w-4" />
      </div>
    );
  }
  return author.avatarUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={author.avatarUrl} alt={name(author)} className="h-8 w-8 shrink-0 rounded-full object-cover" />
  ) : (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: 'var(--bg-surface-active, #6366f1)' }}>
      {name(author).slice(0, 1).toUpperCase()}
    </div>
  );
}

// Ngưỡng "dài" tính theo SỐ KÝ TỰ, quyết định ngay lúc render — không đo
// scrollHeight của DOM sau khi mount. Bản đo DOM (useEffect + ref) từng gãy
// thật: KaTeX render công thức bằng font web riêng (KaTeX_Math…), font đó
// TẢI SAU khi component đã mount và đo xong — đo trước lúc font vào làm
// chiều cao đo được sai (nhỏ hơn thật), người dùng bấm "Xem thêm" thì bung
// đúng theo maxHeight đã bỏ, nhưng layout font mới lúc đó lại đẩy nội dung
// cao thêm khiến CẢM GIÁC vẫn còn bị cắt — phải bấm thêm lần nữa mới "thấy
// đủ". Đếm ký tự tính được ngay lúc render đầu, không phụ thuộc font/ảnh
// tải xong lúc nào — bấm 1 lần là bỏ hẳn maxHeight, hiện đủ ngay lập tức.
const LONG_CONTENT_CHARS = 480;

/**
 * Bình luận CuongMini là markdown+LaTeX thô (giống câu trả lời trong panel
 * chat) — render bằng ChatMarkdown thay vì hiện chữ trần, và bọc `chat-studio`
 * để nó ăn theo theme sáng/tối của trang thay vì màu cứng cho nền tối
 * (xem quy ước ở ChatMarkdown.tsx + globals.css `.chat-studio`).
 */
function CollapsibleContent({ content, fadeTo }: { content: string; fadeTo: string }) {
  const [expanded, setExpanded] = useState(false);
  const long = content.length > LONG_CONTENT_CHARS;
  const MAX_PX = 220;

  return (
    <div className="chat-studio">
      <div
        className="relative overflow-hidden text-sm leading-relaxed"
        style={{ maxHeight: long && !expanded ? MAX_PX : undefined }}
      >
        <ChatMarkdown content={content} />
        {long && !expanded && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-12"
            style={{ background: `linear-gradient(to bottom, transparent, ${fadeTo})` }}
          />
        )}
      </div>
      {long && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold hover:underline"
          style={{ color: '#8b5cf6' }}
        >
          {expanded ? <>Thu gọn <ChevronUp className="h-3 w-3" /></> : <>Xem thêm <ChevronDown className="h-3 w-3" /></>}
        </button>
      )}
    </div>
  );
}

function CommentItem({ comment, myId, isAuthed, onChanged, onReply, posting }: {
  comment: ExamQuestionComment;
  myId: number | null;
  isAuthed: boolean;
  onChanged: () => void;
  onReply: (content: string, parentId: number | null, after?: () => void) => void;
  posting: boolean;
}) {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  const mine = myId != null && comment.author.id === myId;

  const saveEdit = async () => {
    if (!editText.trim()) return;
    try {
      await examApi.editQuestionComment(comment.id, editText.trim());
      setEditing(false);
      onChanged();
    } catch (err) { toast.error(errMsg(err, 'Sửa thất bại')); }
  };

  const remove = async () => {
    if (!window.confirm('Xoá bình luận này?')) return;
    try {
      await examApi.deleteQuestionComment(comment.id);
      onChanged();
    } catch (err) { toast.error(errMsg(err, 'Xoá thất bại')); }
  };

  return (
    <li className="flex gap-2.5">
      <Avatar author={comment.author} isAi={comment.isAi} />
      <div className="min-w-0 flex-1">
        <div className="rounded-xl border px-3 py-2" style={{ borderColor: 'var(--border-color)', background: comment.isAi ? 'rgba(139,92,246,.06)' : 'var(--bg-surface)' }}>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{comment.isAi ? 'CuongMini' : name(comment.author)}</span>
            {comment.isAi && (
              <span className="rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase text-white" style={{ background: 'linear-gradient(90deg,#8b5cf6,#6366f1)' }}>AI</span>
            )}
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{timeAgo(comment.createdAt)}{comment.isEdited ? ' · đã sửa' : ''}</span>
          </div>
          {editing ? (
            <div className="mt-2 flex gap-2">
              <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={2}
                className="flex-1 resize-y rounded-lg border px-2.5 py-1.5 text-sm outline-none"
                style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
              <div className="flex flex-col gap-1">
                <button onClick={saveEdit} className="rounded-lg p-1.5" style={{ background: 'rgba(139,92,246,.15)', color: '#8b5cf6' }}><Send className="h-3.5 w-3.5" /></button>
                <button onClick={() => { setEditing(false); setEditText(comment.content); }} className="rounded-lg p-1.5" style={{ color: 'var(--text-muted)' }}><X className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ) : (
            <div className="mt-1" style={{ color: 'var(--text-secondary)' }}>
              <CollapsibleContent content={comment.content} fadeTo="var(--bg-surface)" />
            </div>
          )}
        </div>

        <div className="mt-1 flex items-center gap-3 pl-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {isAuthed && (
            <button onClick={() => setReplying((v) => !v)} className="hover:underline">Trả lời</button>
          )}
          {mine && !editing && (
            <>
              <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1 hover:underline"><Pencil className="h-3 w-3" /> Sửa</button>
              <button onClick={remove} className="inline-flex items-center gap-1 hover:underline"><Trash2 className="h-3 w-3" /> Xoá</button>
            </>
          )}
        </div>

        {replying && (
          <div className="mt-2 flex gap-2">
            <input value={replyText} onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) onReply(replyText, comment.id, () => { setReplyText(''); setReplying(false); }); }}
              placeholder={`Trả lời ${comment.isAi ? 'CuongMini' : name(comment.author)}…`}
              className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }} />
            <button onClick={() => onReply(replyText, comment.id, () => { setReplyText(''); setReplying(false); })}
              disabled={posting || !replyText.trim()}
              className="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50"
              style={{ background: 'rgba(139,92,246,.15)', color: '#8b5cf6' }}>
              Gửi
            </button>
          </div>
        )}

        {comment.replies.length > 0 && (
          <ul className="mt-3 space-y-3 border-l pl-3" style={{ borderColor: 'var(--border-color)' }}>
            {comment.replies.map((r) => (
              <CommentItem key={r.id} comment={r} myId={myId} isAuthed={isAuthed} onChanged={onChanged} onReply={onReply} posting={posting} />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
