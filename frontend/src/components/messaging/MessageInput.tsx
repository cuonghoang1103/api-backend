'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, Loader2, FileText } from 'lucide-react';
import { useMessagingStore } from '@/store/messagingStore';
import { messagingApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface PendingAttachment {
  file: File;
  fileId?: number;
  url?: string;
  uploading: boolean;
  error?: string;
}

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_PREFIXES = ['image/', 'application/pdf', 'text/', 'application/zip', 'application/x-zip-compressed'];
const ALLOWED_EXACT = new Set([
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

export default function MessageInput() {
  const store = useMessagingStore();
  const threadId = store.currentThreadId!;
  const [text, setText] = useState('');
  const [pending, setPending] = useState<PendingAttachment[]>([]);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [text]);

  const handlePickFiles = () => fileInputRef.current?.click();

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      if (file.size > MAX_SIZE) {
        toast.error(`${file.name}: vượt quá 10MB`);
        continue;
      }
      if (!isAllowed(file.type)) {
        toast.error(`${file.name}: định dạng không được hỗ trợ`);
        continue;
      }
      const entry: PendingAttachment = { file, uploading: true };
      setPending((p) => [...p, entry]);
      try {
        const res = await messagingApi.uploadAttachment(file);
        const data = res.data.data;
        setPending((p) =>
          p.map((x) => (x.file === file ? { ...x, fileId: data.fileId, url: data.url, uploading: false } : x)),
        );
      } catch (e: any) {
        setPending((p) =>
          p.map((x) => (x.file === file ? { ...x, uploading: false, error: 'Upload thất bại' } : x)),
        );
      }
    }
  };

  const handleRemove = (file: File) => {
    setPending((p) => p.filter((x) => x.file !== file));
  };

  const handleTextChange = (v: string) => {
    setText(v);
    // Emit typing event (debounced — set true on first keystroke,
    // set false after 3s of no input)
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
    const fileIds = pending.filter((p) => p.fileId).map((p) => p.fileId!) ;
    if (!trimmed && fileIds.length === 0) return;
    if (sending) return;

    setSending(true);
    try {
      await store.sendMessage(threadId, trimmed, fileIds.length ? fileIds : undefined);
      setText('');
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

  const hasReadyAttachments = pending.some((p) => p.fileId);
  const hasContent = text.trim().length > 0 || hasReadyAttachments;

  return (
    <div
      className="shrink-0 border-t border-white/[0.06] p-2"
      style={{ background: 'rgba(0,0,0,0.2)' }}
    >
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
                key={p.file.name + p.file.size}
                className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-[11px]"
              >
                {p.uploading ? (
                  <Loader2 className="h-3 w-3 animate-spin text-cyan-400" />
                ) : p.error ? (
                  <X className="h-3 w-3 text-red-400" />
                ) : p.file.type.startsWith('image/') && p.url ? (
                  <img src={p.url} alt="" className="h-5 w-5 rounded object-cover" />
                ) : (
                  <FileText className="h-3 w-3 text-text-muted" />
                )}
                <span className="max-w-[120px] truncate">{p.file.name}</span>
                <button
                  onClick={() => handleRemove(p.file)}
                  className="rounded p-0.5 text-text-muted transition-colors hover:bg-white/[0.06] hover:text-red-400"
                  aria-label="Bỏ file"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-1.5">
        <button
          onClick={handlePickFiles}
          className="shrink-0 rounded-xl p-2 text-text-secondary transition-colors hover:bg-white/[0.06] hover:text-text-primary"
          aria-label="Đính kèm file"
        >
          <Paperclip className="h-4 w-4" />
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
          placeholder="Nhập tin nhắn..."
          className="chat-messages-scroll min-h-[36px] max-h-[120px] flex-1 resize-none rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-cyan-500/40 focus:outline-none"
          style={{ scrollbarWidth: 'thin' }}
        />
        <button
          onClick={handleSend}
          disabled={!hasContent || sending}
          className="shrink-0 rounded-xl p-2 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #06B6D4, #6366F1)' }}
          aria-label="Gửi"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function isAllowed(mime: string): boolean {
  if (ALLOWED_EXACT.has(mime)) return true;
  return ALLOWED_PREFIXES.some((p) => mime.startsWith(p));
}
