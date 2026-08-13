'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Paperclip, FileText, X } from 'lucide-react';
import { toast } from 'sonner';
import ModelPicker from './ModelPicker';
import { useChatModelStore, getChatModel } from '@/lib/aiChatModels';
import type { ChatSkin } from '@/store/chatSkinStore';

export interface ChatAttachment { images?: string[]; documents?: string[]; documentNames?: string[] }

interface ChatInputProps {
  onSend: (message: string, attach?: ChatAttachment) => void;
  isStreaming: boolean;
  /** Stop the in-flight generation (keeps the partial reply). */
  onStop?: () => void;
  disabled?: boolean;
  /** 'terminal' = ô lệnh bản gốc (mặc định). 'studio' = ô soạn bo tròn. */
  skin?: ChatSkin;
}

interface Attached {
  id: string;
  dataUrl: string;
}

interface AttachedDoc {
  id: string;
  name: string;
  dataUrl: string;
}

// ── Client-side attachment limits (mirror of the backend guards) ──
const MAX_IMAGES = 4;
const MAX_DIM = 1568; // Anthropic's recommended long-edge cap for vision
const MAX_DOCS = 3;
const MAX_DOC_BYTES = 6 * 1024 * 1024; // 6MB per file (matches backend)

// ── Loại file đọc được (khớp `ALLOWED_DOC_TYPES` ở src/routes/ai.routes.ts) ──
// Trình duyệt báo `file.type` không đáng tin: kéo một file .md vào thì Chrome
// trả chuỗi RỖNG, .csv có khi thành 'application/vnd.ms-excel'. Nên nhận diện
// bằng ĐUÔI FILE trước, rồi mới tự đặt lại media type cho data URL — nếu để
// nguyên chuỗi rỗng thì data URL thành `data:;base64,...` và backend từ chối.
const DOC_TYPE_BY_EXT: Record<string, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  txt: 'text/plain',
  md: 'text/markdown',
  markdown: 'text/markdown',
  csv: 'text/csv',
};
const DOC_ACCEPT = '.pdf,.docx,.txt,.md,.csv,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown,text/csv';
const FILE_ACCEPT = `image/png,image/jpeg,image/webp,image/gif,${DOC_ACCEPT}`;

/** Media type chuẩn của một file tài liệu, hoặc null nếu không đọc được. */
function docMediaType(file: File): string | null {
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (DOC_TYPE_BY_EXT[ext]) return DOC_TYPE_BY_EXT[ext];
  const t = (file.type || '').toLowerCase();
  return Object.values(DOC_TYPE_BY_EXT).includes(t) ? t : null;
}

/** Read a File as a data URL. */
function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('read failed'));
    reader.readAsDataURL(file);
  });
}

/** Load an <img> from a data URL. */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('decode failed'));
    img.src = src;
  });
}

/**
 * Downscale (long edge ≤ MAX_DIM) and re-encode to JPEG so the payload stays
 * small — vision quality is unaffected at this size and it keeps us well under
 * the request-size cap. Falls back to the original data URL if anything fails.
 */
async function compressImage(file: File): Promise<string> {
  const original = await readAsDataURL(file);
  try {
    const img = await loadImage(original);
    let { width, height } = img;
    if (Math.max(width, height) > MAX_DIM) {
      const scale = MAX_DIM / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return original;
    // White backdrop so transparent PNGs don't turn black when flattened to JPEG.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', 0.85);
  } catch {
    return original;
  }
}

export default function ChatInput({ onSend, isStreaming, onStop, disabled, skin = 'terminal' }: ChatInputProps) {
  const isStudio = skin === 'studio';
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [images, setImages] = useState<Attached[]>([]);
  const [docs, setDocs] = useState<AttachedDoc[]>([]);
  const [processing, setProcessing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDisabled = disabled || isStreaming;

  // Vision (image input) is a perk of the Pro/Max tiers only.
  const modelId = useChatModelStore((s) => s.modelId);
  const isVision = getChatModel(modelId).tier !== 'default';

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [value]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // If the user switches back to a non-vision model, drop any staged
  // attachments (the default model can't read them).
  useEffect(() => {
    if (!isVision) { if (images.length) setImages([]); if (docs.length) setDocs([]); }
  }, [isVision, images.length, docs.length]);

  const addFiles = useCallback(async (files: File[]) => {
    if (!isVision || files.length === 0) return;
    const imageFiles = files.filter((f) => f.type.startsWith('image/'));
    const docFiles = files
      .map((f) => ({ file: f, media: docMediaType(f) }))
      .filter((x): x is { file: File; media: string } => x.media !== null);
    const rejected = files.length - imageFiles.length - docFiles.length;
    if (rejected > 0) {
      toast.error('Chỉ nhận ảnh, PDF, Word (.docx) hoặc file văn bản (.txt/.md/.csv)');
    }
    if (imageFiles.length === 0 && docFiles.length === 0) return;
    setProcessing(true);
    try {
      if (imageFiles.length) {
        const room = MAX_IMAGES - images.length;
        const toAdd = imageFiles.slice(0, Math.max(0, room));
        const compressed = await Promise.all(toAdd.map((f) => compressImage(f)));
        setImages((prev) => [
          ...prev,
          ...compressed.map((dataUrl, i) => ({ id: `${Date.now()}_i${i}_${prev.length}`, dataUrl })),
        ].slice(0, MAX_IMAGES));
      }
      if (docFiles.length) {
        const room = MAX_DOCS - docs.length;
        const toAdd = docFiles.slice(0, Math.max(0, room));
        const loaded = await Promise.all(
          toAdd.map(async ({ file: f, media }) => {
            if (f.size > MAX_DOC_BYTES) { toast.error(`"${f.name}" quá lớn (tối đa 6MB)`); return null; }
            const raw = await readAsDataURL(f);
            // Đặt lại media type: trình duyệt có thể trả rỗng (file .md), mà
            // `data:;base64,...` thì backend từ chối thẳng.
            const b64 = raw.slice(raw.indexOf(',') + 1);
            return { name: f.name, dataUrl: `data:${media};base64,${b64}` };
          }),
        );
        setDocs((prev) => [
          ...prev,
          ...loaded.filter((x): x is { name: string; dataUrl: string } => !!x)
            .map((d, i) => ({ id: `${Date.now()}_d${i}_${prev.length}`, name: d.name, dataUrl: d.dataUrl })),
        ].slice(0, MAX_DOCS));
      }
    } finally {
      setProcessing(false);
    }
  }, [isVision, images.length, docs.length]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!isVision) return;
    const files = Array.from(e.clipboardData?.files || []).filter((f) => f.type.startsWith('image/'));
    if (files.length > 0) {
      e.preventDefault();
      void addFiles(files);
    }
  }, [isVision, addFiles]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    void addFiles(files);
    e.target.value = ''; // allow re-selecting the same file
  }, [addFiles]);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }, []);
  const removeDoc = useCallback((id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const handleSubmit = useCallback(() => {
    const text = value.trim();
    if ((!text && images.length === 0 && docs.length === 0) || isDisabled || processing) return;
    onSend(text, {
      images: images.length > 0 ? images.map((i) => i.dataUrl) : undefined,
      documents: docs.length > 0 ? docs.map((d) => d.dataUrl) : undefined,
      documentNames: docs.length > 0 ? docs.map((d) => d.name) : undefined,
    });
    setValue('');
    setImages([]);
    setDocs([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, images, docs, isDisabled, processing, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;   // Enter đang chốt chữ cho bộ gõ CJK
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const attachCount = images.length + docs.length;
  const canSend = (!!value.trim() || attachCount > 0) && !isDisabled && !processing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={
        isStudio
          ? 'px-4 pb-4 pt-2 border-t border-[color:var(--studio-border-soft)] bg-[var(--studio-bg)] flex-shrink-0 z-10'
          : 'px-4 py-3 border-t border-[#22d3ee]/10 bg-[#0d1117]/80 backdrop-blur-xl flex-shrink-0 z-10'
      }
    >
      <div className={isStudio ? 'max-w-3xl mx-auto' : 'max-w-4xl mx-auto'}>
        {/* Model switcher — bản studio đặt nó BÊN TRONG ô soạn (như
            ChatGPT/Claude) nên hàng riêng này chỉ có ở bản terminal. */}
        {!isStudio && (
          <div className="mb-2 flex items-center">
            <ModelPicker disabled={isStreaming} />
          </div>
        )}

        {/* Image previews (Pro/Max only) */}
        <AnimatePresence>
          {isVision && images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-2 flex flex-wrap gap-2"
            >
              {images.map((img) => (
                <div key={img.id} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.dataUrl}
                    alt="attachment"
                    className={`w-16 h-16 object-cover rounded-lg border ${isStudio ? 'border-[color:var(--studio-border)]' : 'border-[#22d3ee]/30'}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      isStudio
                        ? 'bg-[var(--studio-panel)] border border-[color:var(--studio-border)] text-[color:var(--studio-text-soft)] hover:text-rose-500'
                        : 'bg-[#0d1117] border border-[#ef4444]/50 text-[#fca5a5] hover:bg-[#ef4444]/20'
                    }`}
                    aria-label="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {processing && (
                <div className={`w-16 h-16 rounded-lg border flex items-center justify-center ${isStudio ? 'border-[color:var(--studio-border)]' : 'border-[#22d3ee]/20'}`}>
                  <Loader2 className={`w-4 h-4 animate-spin ${isStudio ? 'text-[color:var(--studio-text-soft)]' : 'text-[#22d3ee]'}`} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* PDF chips (Pro/Max only) */}
        <AnimatePresence>
          {isVision && docs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-2 flex flex-wrap gap-2"
            >
              {docs.map((d) => (
                <div
                  key={d.id}
                  className={`relative flex items-center gap-2 pl-2 pr-6 py-1.5 rounded-lg border max-w-[220px] ${
                    isStudio
                      ? 'border-[color:var(--studio-border)] bg-[var(--studio-panel)]'
                      : 'border-[#22d3ee]/30 bg-[#22d3ee]/[0.06]'
                  }`}
                >
                  <FileText className={`w-4 h-4 shrink-0 ${isStudio ? 'text-[color:var(--studio-text-soft)]' : 'text-[#22d3ee]'}`} />
                  <span className={`text-xs truncate ${isStudio ? 'text-[color:var(--studio-text)]' : 'text-[#e2e8f0]'}`}>{d.name}</span>
                  <button
                    type="button"
                    onClick={() => removeDoc(d.id)}
                    className={`absolute top-1/2 -translate-y-1/2 right-1 w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                      isStudio ? 'text-[color:var(--studio-text-faint)] hover:text-rose-500' : 'text-[#fca5a5] hover:bg-[#ef4444]/20'
                    }`}
                    aria-label="Remove file"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Ô soạn bản STUDIO ────────────────────────────────────
            Bo tròn, nền panel, model picker + nút đính kèm nằm ngay
            trong ô như ChatGPT/Claude. Dùng chung state/handler với ô
            lệnh bản terminal bên dưới — chỉ khác lớp áo. */}
        {isStudio ? (
          <div
            className="rounded-[26px] border transition-colors"
            style={{
              background: 'var(--studio-panel)',
              borderColor: focused ? 'var(--studio-accent)' : 'var(--studio-border)',
              boxShadow: 'var(--studio-shadow)',
            }}
          >
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={isVision ? 'Nhắn cho CuongMini… (đính kèm ảnh, PDF, Word)' : 'Nhắn cho CuongMini…'}
              disabled={isDisabled}
              rows={1}
              className="w-full resize-none bg-transparent px-5 pt-4 pb-1 text-base sm:text-[15px] leading-6 text-[color:var(--studio-text)] placeholder:text-[color:var(--studio-text-faint)] focus:outline-none disabled:opacity-50"
              style={{ minHeight: '52px', maxHeight: '160px' }}
            />

            {/* Hidden file input for the attach button */}
            <input
              ref={fileInputRef}
              type="file"
              accept={FILE_ACCEPT}
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="flex items-center justify-between gap-2 px-3 pb-2.5 pt-1">
              <div className="flex items-center gap-1">
                <ModelPicker disabled={isStreaming} variant="studio" />
                {isVision && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isDisabled || (images.length >= MAX_IMAGES && docs.length >= MAX_DOCS)}
                    title={images.length >= MAX_IMAGES && docs.length >= MAX_DOCS ? 'Đã đạt tối đa tệp đính kèm' : 'Đính kèm ảnh, PDF, Word (.docx) hoặc file văn bản'}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--studio-text-soft)] transition-colors hover:bg-[var(--studio-panel-soft)] hover:text-[color:var(--studio-text)] disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--studio-accent)]"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={isStreaming && onStop ? onStop : handleSubmit}
                disabled={isStreaming ? !onStop : !canSend}
                aria-label={isStreaming ? 'Dừng sinh câu trả lời' : 'Gửi'}
                title={isStreaming ? 'Dừng sinh câu trả lời' : 'Gửi'}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--studio-accent)]"
                style={
                  isStreaming && onStop
                    ? { background: 'var(--studio-text)', color: 'var(--studio-panel)' }
                    : canSend
                      ? { background: 'var(--studio-accent)', color: '#ffffff' }
                      : { background: 'var(--studio-panel-soft)', color: 'var(--studio-text-faint)' }
                }
              >
                {isStreaming ? (
                  onStop ? (
                    <span className="block h-3 w-3 rounded-[3px] bg-current" />
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </motion.button>
            </div>
          </div>
        ) : (
        /* Terminal input box */
        <div
          className={`
            relative bg-[#0a0a0f] border rounded-xl
            transition-all duration-300
            ${focused
              ? 'border-[#22d3ee]/50 input-circuit-focus data-card-glow-cyan'
              : 'border-[#22d3ee]/15'
            }
          `}
        >
          {/* Terminal prompt prefix */}
          {/* Terminal prompt — the full host string is hidden on mobile
              (it ate the typing space); just the `>` caret remains. */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none select-none">
            <span className="text-[#22d3ee] font-mono text-sm font-bold">&gt;</span>
            <span className="hidden sm:inline text-[#64748b] font-mono text-xs">root@cuongmini-os</span>
            <span className="hidden sm:inline text-[#64748b] font-mono text-xs">:</span>
            <span className="hidden sm:inline text-[#22d3ee]/60 font-mono text-xs">~</span>
            <span className="hidden sm:inline text-[#64748b] font-mono text-xs">$</span>
          </div>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={isVision ? 'enter command... (đính kèm ảnh, PDF, Word)' : 'enter command...'}
            disabled={isDisabled}
            rows={1}
            className={`w-full pl-9 sm:pl-[170px] ${isVision ? 'pr-24' : 'pr-14'} py-3 bg-transparent text-[#f8fafc] placeholder:text-[#64748b]/40 font-mono text-base sm:text-sm focus:outline-none resize-none transition-all disabled:opacity-50`}
            style={{ minHeight: '48px', maxHeight: '160px' }}
          />

          {/* Hidden file input for the attach button */}
          <input
            ref={fileInputRef}
            type="file"
            accept={FILE_ACCEPT}
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
            {/* Attach image or PDF (Pro/Max only) */}
            {isVision && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isDisabled || (images.length >= MAX_IMAGES && docs.length >= MAX_DOCS)}
                title={images.length >= MAX_IMAGES && docs.length >= MAX_DOCS ? 'Đã đạt tối đa tệp đính kèm' : 'Đính kèm ảnh, PDF, Word (.docx) hoặc file văn bản'}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#22d3ee] hover:bg-[#22d3ee]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            )}

            {/* Execute button */}
            <motion.button
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.92 }}
              onClick={isStreaming && onStop ? onStop : handleSubmit}
              disabled={isStreaming ? !onStop : !canSend}
              aria-label={isStreaming ? 'Dừng sinh câu trả lời' : 'Gửi'}
              title={isStreaming ? 'Dừng sinh câu trả lời' : 'Gửi'}
              className={`
                relative w-10 h-10 rounded-xl flex items-center justify-center
                transition-all shadow-lg overflow-hidden exec-btn-glitch
                ${isStreaming && onStop
                  ? 'bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white shadow-[0_0_16px_rgba(239,68,68,0.35)]'
                  : canSend
                    ? 'bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6] text-white shadow-[0_0_16px_rgba(34,211,238,0.3)]'
                    : 'bg-[#1a1a24] text-[#64748b] cursor-not-allowed'
                }
              `}
            >
              {isStreaming ? (
                onStop ? (
                  <span className="block h-3 w-3 rounded-[3px] bg-white" />
                ) : (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 className="w-4 h-4" />
                  </motion.div>
                )
              ) : (
                <Send className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>
        )}

        {isStudio ? (
          <p className="mt-2 text-center text-[11px] text-[color:var(--studio-text-faint)]">
            <span className="hidden sm:inline">Enter để gửi &bull; Shift+Enter xuống dòng &bull; </span>
            CuongMini có thể mắc lỗi — hãy kiểm tra lại thông tin quan trọng.
          </p>
        ) : (
          <p className="text-[11px] text-[#64748b]/50 text-center mt-1.5 font-mono">
            <span className="text-[#22d3ee]/40">//</span>
            <span className="hidden sm:inline"> Press Enter to execute &bull; Shift+Enter for new line &bull;</span> CuongMini responses may be incorrect
          </p>
        )}
      </div>
    </motion.div>
  );
}
