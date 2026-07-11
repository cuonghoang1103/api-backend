'use client';

import { useState } from 'react';
import { Trash2, FileText, Download, X, Check, CheckCheck, Undo2, Reply } from 'lucide-react';
import { motion } from 'framer-motion';
import type { MessagingMessage } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useMessagingStore } from '@/store/messagingStore';
import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { linkifyToNodes } from '@/lib/linkify';
import ReactionBar from './ReactionBar';
import toast from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.cuongthai.com';

// Ensure attachment URLs are absolute. Old serializer produced relative
// "/uploads/..." paths; new serializer returns full URLs from the storage
// provider. This guard handles both so cached/old messages still render.
function resolveUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return `${API_BASE}/${url}`;
}

const RECALL_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

// iOS-style spring for bubble appear animation. The (0.16, 1, 0.3, 1)
// curve overshoots slightly then settles, matching iMessage's new
// bubble drop-in.
const BUBBLE_ENTER = {
  initial: { opacity: 0, y: 8, scale: 0.92 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

export default function MessageBubble({
  message,
  isOwn,
  showSender = false,
  onReply,
}: {
  message: MessagingMessage;
  isOwn: boolean;
  showSender?: boolean;
  canDelete?: boolean;
  onDelete?: () => void;
  onReply?: (message: MessagingMessage) => void;
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

  // A sticker sent on its own renders "bare" (no chat-bubble
  // background/tail), matching Messenger. GIFs and stickers-with-text
  // still sit inside the bubble.
  const isStickerOnly =
    message.mediaKind === 'sticker' &&
    !message.content &&
    (message.attachments?.length ?? 0) === 0;

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
    // `items-end` keeps short bubbles anchored to the bottom of the
    // row, which matters when a long message is followed by a short
    // one (the timestamp/read-receipts should still align).
    <div className={cn('my-1 flex items-end gap-2', isOwn ? 'justify-end' : 'justify-start')}>
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

      <div className="flex max-w-[65%] min-w-0 flex-col">
        <motion.div
          {...BUBBLE_ENTER}
          // iOS-style bubble shape:
          //   - width fits the content (short messages don't stretch
          //     to the max-width unnecessarily)
          //   - rounded-2xl (16px) on the outer corners
          //   - the "tail" corner is the sender side of the LAST
          //     message in a run; intermediate messages get a fully
          //     rounded shape on the sender side too so the row of
          //     bubbles reads as a group
          // For own messages: tail on bottom-right (sender)
          // For peer messages: tail on bottom-left (sender)
          className={cn(
            'group relative w-fit max-w-full text-sm leading-relaxed',
            isOwn
              ? 'ml-auto rounded-2xl rounded-br-md text-white'
              : 'mr-auto rounded-2xl rounded-bl-md text-text-primary',
          )}
          style={
            isStickerOnly
              ? { background: 'transparent' }
              : isOwn
              ? {
                  background:
                    'linear-gradient(135deg, #06B6D4 0%, #6366F1 100%)',
                  boxShadow:
                    '0 1px 0 rgba(255,255,255,0.06) inset, 0 4px 14px rgba(6,182,212,0.18)',
                }
              : {
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.02) inset',
                }
          }
        >
        {/* Sender name for peer (grouped look) */}
        {!isOwn && showSender && (
          <p className="mb-0.5 px-3.5 pt-1.5 text-[11px] font-semibold text-cyan-400">
            {senderName}
          </p>
        )}

        {/* Quoted / reply snippet */}
        {message.parentMessage && (
          <div className={cn(
            'mx-3 mt-2 mb-1 rounded-lg border-l-2 px-2.5 py-1.5 text-[11px] leading-snug',
            isOwn
              ? 'border-white/40 bg-white/10 text-white/70'
              : 'border-cyan-500/60 bg-white/[0.04] text-text-muted',
          )}>
            <span className="font-semibold text-cyan-400">
              {message.parentMessage.senderName}
            </span>
            <p className="mt-0.5 line-clamp-2 break-words opacity-80">
              {message.parentMessage.content || '📎 Tệp đính kèm'}
            </p>
          </div>
        )}

        {message.content && (
          <p className="whitespace-pre-wrap break-words px-3.5 py-1.5">
            {linkifyToNodes(
              message.content,
              // Own bubbles have a colored background + white text, so
              // make links white/underlined instead of the default blue.
              isOwn
                ? {
                    linkClassName:
                      'font-medium underline decoration-1 underline-offset-2 break-all hover:opacity-80 text-white',
                    linkStyle: undefined,
                  }
                : {},
            )}
          </p>
        )}

        {/* Rich media: GIF or sticker. */}
        {message.mediaUrl && message.mediaKind === 'sticker' && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={message.mediaUrl}
            alt="sticker"
            className={cn('h-28 w-28 object-contain', isStickerOnly ? '' : 'mx-3.5 my-1.5')}
            loading="lazy"
          />
        )}
        {message.mediaUrl && message.mediaKind === 'gif' && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={message.mediaUrl}
            alt="gif"
            className={cn('block max-w-[220px] rounded-lg', message.content ? 'mx-3.5 mb-1.5' : 'm-1')}
            loading="lazy"
          />
        )}

        {(message.attachments?.length ?? 0) > 0 && (
          <div className={cn('mt-1 space-y-1.5 px-3.5 pb-1.5', message.content ? 'border-t border-white/10 pt-1.5' : '')}>
            {message.attachments!.map((a) => {
              const resolvedUrl = resolveUrl(a.url);
              if (a.mimeType.startsWith('image/')) {
                return (
                  <a key={a.id} href={resolvedUrl} target="_blank" rel="noopener noreferrer" className="block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resolvedUrl}
                      alt={a.fileName}
                      className="max-h-56 max-w-[280px] rounded-lg object-cover"
                      loading="lazy"
                    />
                  </a>
                );
              }
              // Determine icon by MIME type
              const ext = a.fileName.split('.').pop()?.toLowerCase() ?? '';
              return (
                <a
                  key={a.id}
                  href={resolvedUrl}
                  download={a.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn('flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs', {
                    'bg-white/10 hover:bg-white/20': isOwn,
                    'bg-white/[0.04] hover:bg-white/[0.08]': !isOwn,
                  })}
                >
                  <FileText className="h-3.5 w-3.5 shrink-0 opacity-70" />
                  <span className="min-w-0 flex-1 truncate">{a.fileName}</span>
                  <span className="text-[10px] opacity-50">{ext.toUpperCase()}</span>
                  <span className="text-[10px] opacity-70">{formatBytes(a.fileSize)}</span>
                  <Download className="h-3 w-3 shrink-0" />
                </a>
              );
            })}
          </div>
        )}

        {/* Shared post preview card — opens the post via the home comment
            modal (`/?post=N`). The old `/social/post/[id]` route never
            existed → this link used to 404. Same-tab so the SPA handles it. */}
        {message.postShare && (
          <a
            href={`/?post=${message.postShare.postId}`}
            className={cn(
              'mt-2 mx-3.5 mb-1 block rounded-xl overflow-hidden transition-opacity hover:opacity-90',
              isOwn
                ? 'bg-white/10 border border-white/10'
                : 'bg-white/[0.04] border border-white/[0.06]',
            )}
          >
            {/* Thumbnail if available */}
            {message.postShare.mediaThumbnail && (
              <div className="w-full h-32 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveUrl(message.postShare.mediaThumbnail)}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
            {/* Content */}
            <div className="p-2.5">
              {/* Author row */}
              <div className="flex items-center gap-2 mb-1.5">
                {message.postShare.authorAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={message.postShare.authorAvatar}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: 'linear-gradient(135deg, #06B6D4, #6366F1)', color: 'white' }}
                  >
                    {(message.postShare.authorDisplay || message.postShare.authorUsername).charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold text-text-primary truncate">
                  {message.postShare.authorDisplay || `@${message.postShare.authorUsername}`}
                </span>
              </div>
              {/* Content preview */}
              <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                {message.postShare.contentPreview || 'Bài viết đã được chia sẻ'}
              </p>
              {/* Link indicator */}
              <div className="mt-1.5 flex items-center gap-1 text-[10px] text-text-muted">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                Xem bài viết
              </div>
            </div>
          </a>
        )}

        <div
          className={cn('mt-0.5 flex items-center gap-1 px-3.5 pb-1.5 text-[10px]', {
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
                  {onReply && (
                    <button
                      onClick={() => { setShowMenu(false); onReply(message); }}
                      className="flex items-center gap-1.5 rounded px-2 py-1 text-[11px] font-medium text-cyan-300 hover:bg-cyan-500/15"
                    >
                      <Reply className="h-3 w-3" />
                      Trả lời
                    </button>
                  )}
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
        </motion.div>

      {/* Reactions row + picker — outside the bubble so the
          pill border doesn't get clipped by rounded corners. Sits
          at the sender's edge so the heart/laugh lines up with the
          bubble's tail. */}
      <div className={cn('mt-0.5', isOwn ? 'self-end' : 'self-start')}>
        <ReactionBar
          reactions={message.reactions ?? []}
          myUserId={auth.user?.id}
          onToggle={handleToggleReaction}
          isOwn={isOwn}
        />
      </div>
      </div>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
