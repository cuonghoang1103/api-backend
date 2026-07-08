'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Paperclip, X, Loader2, FileText, Reply, Smile, Film, Sticker } from 'lucide-react';
import { useMessagingStore } from '@/store/messagingStore';
import { messagingApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import EmojiPickerPopover from './EmojiPickerPopover';
import GifPicker from './GifPicker';
import StickerPicker from './StickerPicker';

type ActivePicker = 'emoji' | 'gif' | 'sticker' | null;

interface PendingAttachment {
  id: string;
  file: File;
  previewUrl?: string;
  fileId?: number;
  url?: string;
  uploading: boolean;
  error?: string;
}

const MAX_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;
const ALLOWED_PREFIXES = ['image/', 'application/pdf', 'text/', 'application/zip', 'application/x-zip-compressed'];
const ALLOWED_EXACT = new Set([
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

export default function MessageInput({ disabled = false }: { disabled?: boolean }) {
  const store = useMessagingStore();
  const threadId = store.currentThreadId!;
  const replyTo = useMessagingStore((s) => s.replyTo);
  const setReplyTo = useMessagingStore((s) => s.setReplyTo);
  const [text, setText] = useState('');
  const [pending, setPending] = useState<PendingAttachment[]>([]);
  const [sending, setSending] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [activePicker, setActivePicker] = useState<ActivePicker>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      pending.forEach((p) => p.previewUrl && URL.revokeObjectURL(p.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [text]);

  const handlePickFiles = () => fileInputRef.current?.click();

  const ingestFiles = useCallback(async (files: FileList | File[]) => {
    const list = Array.from(files);
    for (const file of list) {
      if (pending.length >= MAX_FILES) {
        toast.error(`Tối đa ${MAX_FILES} file mỗi tin nhắn`);
        break;
      }
      if (file.size > MAX_SIZE) {
        toast.error(`${file.name}: vượt quá 10MB`);
        continue;
      }
      if (!isAllowed(file.type)) {
        toast.error(`${file.name}: định dạng không được hỗ trợ`);
        continue;
      }
      const id = `${file.name}-${file.size}-${Date.now()}-${Math.random()}`;
      const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;
      const entry: PendingAttachment = { id, file, previewUrl, uploading: true };
      setPending((p) => [...p, entry]);
      try {
        const res = await messagingApi.uploadAttachment(file);
        const data = res.data.data;
        setPending((p) =>
          p.map((x) => (x.id === id ? { ...x, fileId: data.fileId, url: data.url, uploading: false } : x)),
        );
      } catch (e: any) {
        setPending((p) =>
          p.map((x) => (x.id === id ? { ...x, uploading: false, error: 'Upload thất bại' } : x)),
        );
        toast.error(`${file.name}: upload thất bại`);
      }
    }
  }, [pending.length]);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    await ingestFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (id: string) => {
    setPending((p) => {
      const target = p.find((x) => x.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return p.filter((x) => x.id !== id);
    });
  };

  // ── Drag & drop ─────────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return;
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault();
      setDragOver(true);
    }
  };
  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget === e.target) setDragOver(false);
  };
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    if (e.dataTransfer.files?.length) {
      await ingestFiles(e.dataTransfer.files);
    }
  };

  // ── Paste images from clipboard ───────────────────────
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (disabled) return;
    const items = e.clipboardData?.items;
    if (!items) return;
    const files: File[] = [];
    for (const it of Array.from(items)) {
      if (it.kind === 'file') {
        const f = it.getAsFile();
        if (f) files.push(f);
      }
    }
    if (files.length === 0) return;
    e.preventDefault();
    await ingestFiles(files);
  };

  const handleTextChange = (v: string) => {
    setText(v);
    if (v.length > 0) {
      store.setTyping(threadId, true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => store.setTyping(threadId, false), 3000);
    } else {
      store.setTyping(threadId, false);
    }
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    const fileIds = pending.filter((p) => p.fileId).map((p) => p.fileId!);
    if (!trimmed && fileIds.length === 0) return;
    if (sending) return;

    const parentMessageId = replyTo?.id ?? null;
    setSending(true);
    try {
      await store.sendMessage(
        threadId,
        trimmed,
        fileIds.length ? fileIds : undefined,
        parentMessageId,
      );
      setText('');
      pending.forEach((p) => p.previewUrl && URL.revokeObjectURL(p.previewUrl));
      setPending([]);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      store.setTyping(threadId, false);
    } catch (e: any) {
      toast.error(e?.userFriendlyMessage ?? e?.message ?? 'Gửi thất bại');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Insert an emoji at the current caret position in the textarea.
  const insertEmoji = (emoji: string) => {
    const el = textareaRef.current;
    if (!el) { setText((t) => t + emoji); return; }
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;
    const next = text.slice(0, start) + emoji + text.slice(end);
    setText(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + emoji.length;
      el.setSelectionRange(pos, pos);
    });
  };

  // Send a GIF or sticker immediately (no text needed). Reuses the
  // store's optimistic send path.
  const sendMedia = async (url: string, kind: 'gif' | 'sticker') => {
    if (disabled) return;
    setActivePicker(null);
    try {
      await store.sendMessage(threadId, '', undefined, null, undefined, { url, kind });
    } catch (e: any) {
      toast.error(e?.userFriendlyMessage ?? e?.message ?? 'Gửi thất bại');
    }
  };

  const togglePicker = (p: ActivePicker) => setActivePicker((cur) => (cur === p ? null : p));

  const hasReadyAttachments = pending.some((p) => p.fileId);
  const hasContent = text.trim().length > 0 || hasReadyAttachments;

  return (
    // Slightly elevated bar so it feels like an "input dock" rather
    // than a divider. The linear-gradient gives a sense of light
    // coming from the top, matching the ThreadHeader above.
    <div
      // pb-[max(...)] keeps the composer above the iPhone home indicator
      // when the mobile chat renders as a full-screen fixed overlay; on
      // md+ the env() resolves to 0 so the normal p-3 applies.
      className="relative shrink-0 border-t border-white/[0.04] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:pb-3"
      style={{
        background:
          'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.25) 100%)',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Media pickers — anchored above the input bar */}
      <EmojiPickerPopover open={activePicker === 'emoji'} onClose={() => setActivePicker(null)} onPick={(e) => insertEmoji(e)} />
      <GifPicker open={activePicker === 'gif'} onClose={() => setActivePicker(null)} onPick={(url) => sendMedia(url, 'gif')} />
      <StickerPicker open={activePicker === 'sticker'} onClose={() => setActivePicker(null)} onPick={(url) => sendMedia(url, 'sticker')} />
      {/* Reply strip — shown when replying to a message */}
      <AnimatePresence>
        {replyTo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2 flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.06] px-3 py-2"
          >
            <Reply className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-cyan-400">
                {replyTo.sender.displayName ?? replyTo.sender.username}
              </p>
              <p className="truncate text-[11px] text-text-muted">
                {replyTo.content || '📎 Tệp đính kèm'}
              </p>
            </div>
            <button
              onClick={() => setReplyTo(null)}
              className="shrink-0 rounded p-0.5 text-text-muted hover:text-text-primary"
              aria-label="Huỷ trả lời"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag overlay */}
      <AnimatePresence>
        {dragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl border-2 border-dashed border-cyan-500/60 bg-cyan-500/10 backdrop-blur-sm"
            style={{ position: 'absolute', inset: '0.5rem' }}
          >
            <p className="text-sm font-medium text-cyan-300">Thả file để đính kèm</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending attachments strip */}
      <AnimatePresence>
        {pending.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2 flex flex-wrap gap-2"
          >
            {pending.map((p) => (
              <div
                key={p.id}
                className="group relative flex items-center gap-1.5 overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.04] p-1.5 text-[11px]"
              >
                {p.uploading ? (
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-white/[0.04]">
                    <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                  </div>
                ) : p.error ? (
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-red-500/10">
                    <X className="h-4 w-4 text-red-400" />
                  </div>
                ) : p.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.previewUrl} alt="" className="h-12 w-12 rounded object-cover" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-white/[0.04]">
                    <FileText className="h-5 w-5 text-text-muted" />
                  </div>
                )}
                <div className="min-w-0 max-w-[140px] pr-4">
                  <p className="truncate text-text-primary">{p.file.name}</p>
                  <p className="text-[10px] text-text-muted">
                    {p.error ? <span className="text-red-400">{p.error}</span> : formatBytes(p.file.size)}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(p.id)}
                  className="absolute right-1 top-1 rounded p-0.5 text-text-muted transition-colors hover:bg-white/[0.08] hover:text-red-400"
                  aria-label="Bỏ file"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Single unified input "pill" ──
          Paperclip on the left, textarea in the middle, send button
          embedded on the right edge of the same rounded container.
          The send button is INSIDE the input shape, not a sibling —
          this is the iOS Messages pattern: a single shape that
          contains the field, with a small action area glued to the
          trailing edge. */}
      <div
        className="flex items-end gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.03] pl-1 pr-1 py-1 transition-colors focus-within:border-cyan-500/30 focus-within:bg-white/[0.05]"
      >
        <button
          onClick={handlePickFiles}
          disabled={disabled}
          // The paperclip sits inside the input pill, not as a
          // floating button. Slightly larger + 1.75 stroke gives the
          // icon more "presence" so it reads as a real affordance
          // rather than an afterthought.
          className="shrink-0 rounded-xl p-2 text-text-secondary transition-colors hover:bg-white/[0.06] hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Đính kèm file"
          title="Đính kèm file (kéo-thả hoặc dán ảnh)"
        >
          <Paperclip className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </button>
        <button
          onClick={() => togglePicker('emoji')}
          disabled={disabled}
          className={`shrink-0 rounded-xl p-2 transition-colors hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40 ${activePicker === 'emoji' ? 'text-cyan-300' : 'text-text-secondary hover:text-text-primary'}`}
          aria-label="Emoji"
          title="Emoji"
        >
          <Smile className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </button>
        <button
          onClick={() => togglePicker('sticker')}
          disabled={disabled}
          className={`shrink-0 rounded-xl p-2 transition-colors hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40 ${activePicker === 'sticker' ? 'text-cyan-300' : 'text-text-secondary hover:text-text-primary'}`}
          aria-label="Nhãn dán"
          title="Nhãn dán"
        >
          <Sticker className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </button>
        <button
          onClick={() => togglePicker('gif')}
          disabled={disabled}
          className={`shrink-0 rounded-xl p-2 transition-colors hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40 ${activePicker === 'gif' ? 'text-cyan-300' : 'text-text-secondary hover:text-text-primary'}`}
          aria-label="GIF"
          title="GIF"
        >
          <Film className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept="image/*,application/pdf,text/*,.doc,.docx,.xls,.xlsx,.zip"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          disabled={disabled}
          placeholder={disabled ? 'Đang kết nối...' : 'Nhập tin nhắn...'}
          className="min-h-[36px] max-h-[120px] flex-1 resize-none border-0 bg-transparent px-1.5 py-2 text-sm text-text-primary placeholder:text-text-muted/70 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          style={{ letterSpacing: '-0.003em', scrollbarWidth: 'thin' }}
        />
        <button
          onClick={handleSend}
          disabled={!hasContent || sending || disabled}
          // Send button lives inside the input pill, on the right
          // edge. The gradient matches the own-message bubble so the
          // user has a consistent visual: "I write here → the message
          // looks like this." Disabled state dims to 40% (matches the
          // previous version) but we add a small scale on press so
          // it has a tactile feel.
          className="shrink-0 rounded-xl p-2 text-white transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 hover:opacity-95 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
          style={{ background: 'linear-gradient(135deg, #06B6D4, #6366F1)' }}
          aria-label="Gửi"
        >
          {sending ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <Send className="h-[18px] w-[18px]" strokeWidth={2} />}
        </button>
      </div>
    </div>
  );
}

function isAllowed(mime: string): boolean {
  if (!mime) return false;
  if (ALLOWED_EXACT.has(mime)) return true;
  return ALLOWED_PREFIXES.some((p) => mime.startsWith(p));
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
