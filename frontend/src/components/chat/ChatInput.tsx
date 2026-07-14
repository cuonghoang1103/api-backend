'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Paperclip, FileText, X } from 'lucide-react';
import { toast } from 'sonner';
import ModelPicker from './ModelPicker';
import { useChatModelStore, getChatModel } from '@/lib/aiChatModels';

export interface ChatAttachment { images?: string[]; documents?: string[]; documentNames?: string[] }

interface ChatInputProps {
  onSend: (message: string, attach?: ChatAttachment) => void;
  isStreaming: boolean;
  disabled?: boolean;
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
const MAX_DOC_BYTES = 6 * 1024 * 1024; // 6MB per PDF (matches backend)

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

export default function ChatInput({ onSend, isStreaming, disabled }: ChatInputProps) {
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
    const pdfFiles = files.filter((f) => f.type === 'application/pdf');
    if (imageFiles.length === 0 && pdfFiles.length === 0) return;
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
      if (pdfFiles.length) {
        const room = MAX_DOCS - docs.length;
        const toAdd = pdfFiles.slice(0, Math.max(0, room));
        const loaded = await Promise.all(
          toAdd.map(async (f) => {
            if (f.size > MAX_DOC_BYTES) { toast.error(`"${f.name}" quá lớn (tối đa 6MB)`); return null; }
            return { name: f.name, dataUrl: await readAsDataURL(f) };
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
      className="px-4 py-3 border-t border-[#22d3ee]/10 bg-[#0d1117]/80 backdrop-blur-xl flex-shrink-0 z-10"
    >
      <div className="max-w-4xl mx-auto">
        {/* Model switcher */}
        <div className="mb-2 flex items-center">
          <ModelPicker disabled={isStreaming} />
        </div>

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
                    className="w-16 h-16 object-cover rounded-lg border border-[#22d3ee]/30"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#0d1117] border border-[#ef4444]/50 text-[#fca5a5] flex items-center justify-center hover:bg-[#ef4444]/20 transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {processing && (
                <div className="w-16 h-16 rounded-lg border border-[#22d3ee]/20 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-[#22d3ee] animate-spin" />
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
                <div key={d.id} className="relative flex items-center gap-2 pl-2 pr-6 py-1.5 rounded-lg border border-[#22d3ee]/30 bg-[#22d3ee]/[0.06] max-w-[220px]">
                  <FileText className="w-4 h-4 text-[#22d3ee] shrink-0" />
                  <span className="text-xs text-[#e2e8f0] truncate">{d.name}</span>
                  <button
                    type="button"
                    onClick={() => removeDoc(d.id)}
                    className="absolute top-1/2 -translate-y-1/2 right-1 w-4 h-4 rounded-full text-[#fca5a5] flex items-center justify-center hover:bg-[#ef4444]/20 transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Terminal input box */}
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
            placeholder={isVision ? 'enter command... (dán/đính kèm ảnh hoặc PDF)' : 'enter command...'}
            disabled={isDisabled}
            rows={1}
            className={`w-full pl-9 sm:pl-[170px] ${isVision ? 'pr-24' : 'pr-14'} py-3 bg-transparent text-[#f8fafc] placeholder:text-[#64748b]/40 font-mono text-base sm:text-sm focus:outline-none resize-none transition-all disabled:opacity-50`}
            style={{ minHeight: '48px', maxHeight: '160px' }}
          />

          {/* Hidden file input for the attach button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,application/pdf"
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
                title={images.length >= MAX_IMAGES && docs.length >= MAX_DOCS ? 'Đã đạt tối đa tệp đính kèm' : 'Đính kèm ảnh hoặc PDF'}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#22d3ee] hover:bg-[#22d3ee]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            )}

            {/* Execute button */}
            <motion.button
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleSubmit}
              disabled={!canSend}
              className={`
                relative w-10 h-10 rounded-xl flex items-center justify-center
                transition-all shadow-lg overflow-hidden exec-btn-glitch
                ${canSend
                  ? 'bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6] text-white shadow-[0_0_16px_rgba(34,211,238,0.3)]'
                  : 'bg-[#1a1a24] text-[#64748b] cursor-not-allowed'
                }
              `}
            >
              {isStreaming ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="w-4 h-4" />
                </motion.div>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>

        <p className="text-[11px] text-[#64748b]/50 text-center mt-1.5 font-mono">
          <span className="text-[#22d3ee]/40">//</span>
          <span className="hidden sm:inline"> Press Enter to execute &bull; Shift+Enter for new line &bull;</span> CuongMini responses may be incorrect
        </p>
      </div>
    </motion.div>
  );
}
