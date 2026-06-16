'use client';

import { useState } from 'react';
import { Trash2, FileText, Download, X, Check, CheckCheck, Undo2 } from 'lucide-react';
import type { MessagingMessage } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useMessagingStore } from '@/store/messagingStore';
import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import ReactionBar from './ReactionBar';
import toast from 'react-hot-toast';

const RECALL_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export default function MessageBubble({
  message,
  isOwn,
  showSender = false,
}: {
  message: MessagingMessage;
  isOwn: boolean;
  showSender?: boolean;
  /** Backwards-compat: kept so we can change canDelete → isOwn without touching callers. */
  canDelete?: boolean;
  onDelete?: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const auth = useAuthStore();
  const store = useMessagingStore();

  // Recalled: show stub, hide menu/reactions/recall option
  if (message.recalled) {
    return (
      <div className="my-1 flex justify-center">
        <span className="rounded-full bg-white/[0.04] px-2.5 py-0.5 text-[10px] italic text-text-muted">
          Tin nhắn đã thu hồi
        </span>
      </div>
    );
  }

  if (message.deleted) {
    return (
      <div className="my-1 flex justify-center">
        <span className="rounded-full bg-white/[0.04] px-2.5 py-0.5 text-[10px] italic text-text-muted">
          Tin nhắn đã được xoá
        </span>
      </div>
    );
  }

  const senderName = message.sender?.displayName ?? message.sender?.username ?? 'Người dùng';

  // Read state for own messages: "sent" (1 tick) if no read receipt,
  // "delivered/read" (2 ticks, cyan) if at least one peer has read.
  const isRead = isOwn && Array.isArray(message.readBy) && message.readBy.length > 0;
  const isOptimistic = message.id < 0;

  // Recall is only allowed for the sender, only on real (not
  // optimistic) messages, and only within the 5-minute window.
  const ageMs = Date.now() - new Date(message.createdAt).getTime();
  const canRecall =
    isOwn && !isOptimistic && !message.recalled && ageMs < RECALL_WINDOW_MS;

  const handleRecall = async () => {
    setShowMenu(false);
    try {
      await store.recallMessage(message.threadId, message.id);
    } catch (e: any) {
      toast.error(e?.userFriendlyMessage ?? e?.message ?? 'Không thể thu hồi tin nhắn');
    }
  };

  const handleDelete = async () => {
    setShowMenu(false);
    try {
      await store.deleteMessage(message.threadId, message.id);
    } catch {
      // ignore
    }
  };

  const handleToggleReaction = (emoji: string) => {
    if (isOptimistic) return;
    void store.toggleReaction(message.threadId, message.id, emoji);
  };

  return (
    <div className={cn('my-1 flex gap-2', isOwn ? 'justify-end' : 'justify-start')}>
      {/* Peer avatar (left side) */}
      {!isOwn && (
        <div className="shrink-0 self-end pb-1">
          {showSender ? (
            message.sender?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={message.sender.avatarUrl} alt={senderName} className="h-7 w-7 rounded-full object-cover" />
            ) : (
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #06B6D4, #6366F1)' }}
              >
                {senderName.charAt(0).toUpperCase()}
              </div>
            )
          ) : null}
        </div>
      )}

      <div
        className={cn('group relative max-w-[80%] rounded-2xl px-3 py-2 text-sm', {
          'rounded-br-sm text-white': isOwn,
          'rounded-bl-sm text-text-primary': !isOwn,
        })}
        style={
          isOwn
            ? { background: 'linear-gradient(135deg, #06B6D4, #6366F1)' }
            : {
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }
        }
      >
        {/* Sender name for peer (grouped look) */}
        {!isOwn && showSender && (
          <p className="mb-0.5 text-[11px] font-semibold text-cyan-400">
            {senderName}
          </p>
        )}

        {message.content && <p className="whitespace-pre-wrap break-words">{message.content}</p>}

        {message.attachments.length > 0 && (
          <div className={cn('mt-1.5 space-y-1.5', message.content ? 'border-t border-white/10 pt-1.5' : '')}>
            {message.attachments.map((a) =>
              a.mimeType.startsWith('image/') ? (
                <a key={a.id} href={a.url} target="_blank" rel="noopener noreferrer" className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.url}
                    alt={a.fileName}
                    className="max-h-56 max-w-[280px] rounded-lg object-cover"
                    loading="lazy"
                  />
                </a>
              ) : (
                <a
                  key={a.id}
                  href={a.url}
                  download={a.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn('flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs', {
                    'bg-white/10 hover:bg-white/20': isOwn,
                    'bg-white/[0.04] hover:bg-white/[0.08]': !isOwn,
                  })}
                >
                  <FileText className="h-3.5 w-3.5 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{a.fileName}</span>
                  <span className="text-[10px] opacity-70">{formatBytes(a.fileSize)}</span>
                  <Download className="h-3 w-3 shrink-0" />
                </a>
              ),
            )}
          </div>
        )}

        <div
          className={cn('mt-0.5 flex items-center gap-1 text-[10px]', {
            'text-white/70': isOwn,
            'text-text-muted': !isOwn,
          })}
        >
          <span title={format(new Date(message.createdAt), 'PPpp')}>
            {format(new Date(message.createdAt), 'HH:mm')}
          </span>
          {isOwn && canRecall && (
            <span className="opacity-60" title={`Có thể thu hồi trong ${formatDistanceToNow(new Date(Date.now() + (RECALL_WINDOW_MS - ageMs)), { locale: vi })}`}>
              ·
            </span>
          )}
          {/* Read receipts for own messages */}
          {isOwn && !isOptimistic && (
            isRead ? (
              <CheckCheck className="h-3 w-3 text-cyan-200" aria-label="Đã đọc" />
            ) : (
              <Check className="h-3 w-3 opacity-70" aria-label="Đã gửi" />
            )
          )}
          {isOwn && isOptimistic && (
            <span className="opacity-70" title="Đang gửi...">·</span>
          )}
          {(isOwn || true) && (
            <div className="relative ml-1">
              <button
                onClick={() => setShowMenu((s) => !s)}
                className="opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Tuỳ chọn"
              >
                <X className="h-3 w-3" />
              </button>
              {showMenu && (
                <div
                  className={cn(
                    'absolute top-4 z-10 flex flex-col gap-0.5 rounded-lg border border-white/10 bg-[#0a0a14]/95 p-1 shadow-lg backdrop-blur',
                    isOwn ? 'right-0' : 'left-0',
                  )}
                >
                  {isOwn && canRecall && (
                    <button
                      onClick={handleRecall}
                      className="flex items-center gap-1.5 rounded px-2 py-1 text-[11px] font-medium text-amber-300 hover:bg-amber-500/15"
                    >
                      <Undo2 className="h-3 w-3" />
                      Thu hồi
                    </button>
                  )}
                  {isOwn && (
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-1.5 rounded px-2 py-1 text-[11px] font-medium text-red-300 hover:bg-red-500/15"
                    >
                      <Trash2 className="h-3 w-3" />
                      Xoá
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reactions row + picker — outside the bubble so the
          pill border doesn't get clipped by rounded corners */}
      <div className={cn('flex max-w-[80%] flex-col', isOwn ? 'items-end' : 'items-start')}>
        <ReactionBar
          reactions={message.reactions ?? []}
          myUserId={auth.user?.id}
          onToggle={handleToggleReaction}
          isOwn={isOwn}
        />
      </div>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
