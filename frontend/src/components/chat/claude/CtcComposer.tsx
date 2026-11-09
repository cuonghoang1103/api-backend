'use client';

/**
 * Ô soạn kiểu Claude: một khung bo tròn, chữ tự giãn, hàng công cụ ở đáy
 * (＋ đính kèm · nói chuyện · … · chọn model · gửi/dừng). Kéo-thả / dán ảnh.
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUp, AudioLines, Check, ChevronDown, FileText, Loader2, Lock, Mic, Paperclip, Plus, Square, X } from 'lucide-react';
import { toast } from 'sonner';
import { CHAT_MODELS, DEFAULT_CHAT_MODEL_ID, getChatModel, useChatModelStore } from '@/lib/aiChatModels';
import {
  FILE_ACCEPT, MAX_DOCS, MAX_DOC_BYTES, MAX_IMAGES, compressImage, docMediaType, readAsDataURL,
} from './attachments';

export interface CtcAttach { images?: string[]; documents?: string[]; documentNames?: string[] }
export interface CtcComposerHandle { focus: () => void; setText: (t: string) => void }

interface Props {
  /** Nội dung bên TRÁI hàng dưới ô soạn (vd. chọn dự án). Model luôn ở bên phải hàng đó. */
  belowLeft?: React.ReactNode;
  /** Menu model mở lên (ô soạn ở đáy) hay xuống (màn chào). */
  menuPlacement?: 'up' | 'down';
  onSend: (text: string, attach?: CtcAttach) => void;
  onStop?: () => void;
  onVoice?: () => void;
  isStreaming: boolean;
  isPro: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

interface Img { id: string; dataUrl: string }
interface Doc { id: string; name: string; dataUrl: string }

function useClickOutside(open: boolean, ref: React.RefObject<HTMLElement | null>, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) close(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open, ref, close]);
}

export function CtcModelPicker({ isPro, disabled, placement = 'up' }: { isPro: boolean; disabled?: boolean; placement?: 'up' | 'down' }) {
  const router = useRouter();
  const { modelId, setModelId } = useChatModelStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(open, ref, useCallback(() => setOpen(false), []));
  const effective = !isPro && getChatModel(modelId).tier !== 'default' ? DEFAULT_CHAT_MODEL_ID : modelId;
  const active = getChatModel(effective);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        className="ctc-model-btn"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        data-testid="ctc-model-btn"
      >
        {active.label}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="ctc-menu ctc-model-menu" data-place={placement} role="menu">
          <div className="ctc-menu-label">Chọn model</div>
          {CHAT_MODELS.map((m) => {
            const locked = m.tier !== 'default' && !isPro;
            return (
              <button
                key={m.id}
                type="button"
                role="menuitemradio"
                aria-checked={m.id === effective}
                className="ctc-menu-item ctc-model-item"
                onClick={() => {
                  setOpen(false);
                  if (locked) {
                    toast.info(`${m.label} dành cho tài khoản Pro`, { action: { label: 'Nâng cấp', onClick: () => router.push('/pro') } });
                    return;
                  }
                  setModelId(m.id);
                }}
              >
                <span style={{ minWidth: 0 }}>
                  <b>
                    {m.label}
                    {locked && <span className="ctc-lock"><Lock size={10} /> Pro</span>}
                  </b>
                  <small>{m.desc}</small>
                </span>
                {m.id === effective && <Check size={16} className="ctc-model-check" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export const CtcComposer = forwardRef<CtcComposerHandle, Props>(function CtcComposer(
  { onSend, onStop, onVoice, isStreaming, isPro, placeholder = 'Nhắn cho CuongMini…', autoFocus, belowLeft, menuPlacement = 'up' },
  ref,
) {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [images, setImages] = useState<Img[]>([]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [plusOpen, setPlusOpen] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const plusRef = useRef<HTMLDivElement>(null);
  useClickOutside(plusOpen, plusRef, useCallback(() => setPlusOpen(false), []));

  const modelId = useChatModelStore((s) => s.modelId);
  const setModelId = useChatModelStore((s) => s.setModelId);
  const isVision = isPro && getChatModel(modelId).tier !== 'default';

  useImperativeHandle(ref, () => ({
    focus: () => taRef.current?.focus(),
    setText: (t: string) => { setValue(t); requestAnimationFrame(() => taRef.current?.focus()); },
  }), []);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 340)}px`;
  }, [value]);

  useEffect(() => { if (autoFocus) taRef.current?.focus(); }, [autoFocus]);

  // Về model mặc định (không đọc được file) ⇒ bỏ file đang chờ.
  useEffect(() => {
    if (!isVision && (images.length || docs.length)) { setImages([]); setDocs([]); }
  }, [isVision, images.length, docs.length]);

  const addFiles = useCallback(async (files: File[]) => {
    if (!files.length) return;
    if (!isPro) {
      toast.info('Gửi ảnh và tài liệu cần tài khoản Pro', { action: { label: 'Nâng cấp', onClick: () => router.push('/pro') } });
      return;
    }
    if (getChatModel(modelId).tier === 'default') {
      // CuongMini 3.11 không đọc được file ⇒ tự chuyển lên Pro 2 và nói ra.
      setModelId('cuongmini-pro-2');
      toast.info('Đã chuyển sang CuongMini Pro 2 để đọc ảnh/tài liệu');
    }
    const imgs = files.filter((f) => f.type.startsWith('image/'));
    const ds = files.map((f) => ({ f, media: docMediaType(f) })).filter((x): x is { f: File; media: string } => !!x.media);
    if (files.length - imgs.length - ds.length > 0) toast.error('Chỉ nhận ảnh, PDF, Word, Excel, PowerPoint hoặc .txt/.md/.csv');
    setBusy(true);
    try {
      if (imgs.length) {
        const room = Math.max(0, MAX_IMAGES - images.length);
        if (imgs.length > room) toast.info(`Tối đa ${MAX_IMAGES} ảnh mỗi tin`);
        const out = await Promise.all(imgs.slice(0, room).map(compressImage));
        setImages((p) => [...p, ...out.map((dataUrl, i) => ({ id: `${Date.now()}i${i}`, dataUrl }))].slice(0, MAX_IMAGES));
      }
      if (ds.length) {
        const room = Math.max(0, MAX_DOCS - docs.length);
        if (ds.length > room) toast.info(`Tối đa ${MAX_DOCS} tài liệu mỗi tin`);
        const out = await Promise.all(ds.slice(0, room).map(async ({ f, media }) => {
          if (f.size > MAX_DOC_BYTES) { toast.error(`"${f.name}" quá lớn (tối đa 6MB)`); return null; }
          const raw = await readAsDataURL(f);
          return { name: f.name, dataUrl: `data:${media};base64,${raw.slice(raw.indexOf(',') + 1)}` };
        }));
        setDocs((p) => [...p, ...out.filter((x): x is { name: string; dataUrl: string } => !!x)
          .map((d, i) => ({ id: `${Date.now()}d${i}`, ...d }))].slice(0, MAX_DOCS));
      }
    } finally {
      setBusy(false);
    }
  }, [isPro, modelId, setModelId, images.length, docs.length, router]);

  const submit = useCallback(() => {
    const text = value.trim();
    if ((!text && !images.length && !docs.length) || isStreaming || busy) return;
    onSend(text, {
      images: images.length ? images.map((i) => i.dataUrl) : undefined,
      documents: docs.length ? docs.map((d) => d.dataUrl) : undefined,
      documentNames: docs.length ? docs.map((d) => d.name) : undefined,
    });
    setValue('');
    setImages([]);
    setDocs([]);
  }, [value, images, docs, isStreaming, busy, onSend]);

  const canSend = (!!value.trim() || images.length + docs.length > 0) && !busy;

  return (
    <div className="ctc-comp-wrap">
    <div
      className="ctc-composer"
      data-drag={drag}
      onDragOver={(e) => { if (e.dataTransfer?.types?.includes('Files')) { e.preventDefault(); setDrag(true); } }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        if (!e.dataTransfer?.files?.length) return;
        e.preventDefault();
        setDrag(false);
        void addFiles(Array.from(e.dataTransfer.files));
      }}
    >
      {(images.length > 0 || docs.length > 0 || busy) && (
        <div className="ctc-comp-files">
          {images.map((img) => (
            <div key={img.id} className="ctc-comp-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.dataUrl} alt="Ảnh đính kèm" />
              <button type="button" className="ctc-comp-x" aria-label="Bỏ ảnh" onClick={() => setImages((p) => p.filter((x) => x.id !== img.id))}><X size={12} /></button>
            </div>
          ))}
          {docs.map((d) => (
            <div key={d.id} className="ctc-comp-thumb">
              <div className="ctc-file"><span className="ctc-file-ic"><FileText size={16} /></span><span>{d.name}</span></div>
              <button type="button" className="ctc-comp-x" aria-label="Bỏ tệp" onClick={() => setDocs((p) => p.filter((x) => x.id !== d.id))}><X size={12} /></button>
            </div>
          ))}
          {busy && <div className="ctc-file"><Loader2 size={16} className="animate-spin" /><span>Đang xử lý…</span></div>}
        </div>
      )}

      <textarea
        ref={taRef}
        rows={1}
        value={value}
        placeholder={placeholder}
        aria-label="Nhắn cho CuongMini"
        onChange={(e) => setValue(e.target.value)}
        onPaste={(e) => {
          const files = Array.from(e.clipboardData?.files || []);
          if (files.length) { e.preventDefault(); void addFiles(files); }
        }}
        onKeyDown={(e) => {
          if (e.nativeEvent.isComposing) return; // nhường Enter cho bộ gõ tiếng Việt / CJK
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
        }}
      />

      <div className="ctc-comp-row">
        <div ref={plusRef} style={{ position: 'relative' }}>
          <button type="button" className="ctc-comp-tool" aria-label="Thêm" title="Thêm tệp, ảnh…" onClick={() => setPlusOpen((v) => !v)}>
            <Plus size={17} />
          </button>
          {plusOpen && (
            <div className="ctc-menu ctc-plus-menu" role="menu">
              <button type="button" className="ctc-menu-item" onClick={() => { setPlusOpen(false); fileRef.current?.click(); }}>
                <Paperclip size={16} /> Tải ảnh hoặc tệp lên
                {!isPro && <span className="ctc-lock"><Lock size={10} /> Pro</span>}
              </button>
              {onVoice && (
                <button type="button" className="ctc-menu-item" onClick={() => { setPlusOpen(false); onVoice(); }}>
                  <Mic size={16} /> Nói chuyện bằng giọng
                </button>
              )}
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept={FILE_ACCEPT}
          hidden
          onChange={(e) => { void addFiles(Array.from(e.target.files || [])); e.target.value = ''; }}
        />
        <span className="ctc-comp-spacer" />
        {isStreaming ? (
          <button type="button" className="ctc-send" data-stop aria-label="Dừng" title="Dừng" onClick={onStop}>
            <Square size={13} fill="currentColor" />
          </button>
        ) : canSend || !onVoice ? (
          <button type="button" className="ctc-send" aria-label="Gửi" title="Gửi (Enter)" disabled={!canSend} onClick={submit} data-testid="ctc-send">
            <ArrowUp size={18} strokeWidth={2.4} />
          </button>
        ) : (
          <button type="button" className="ctc-voice" aria-label="Nói chuyện bằng giọng" title="Nói chuyện bằng giọng" onClick={onVoice} data-testid="ctc-voice">
            <AudioLines size={18} />
          </button>
        )}
      </div>
    </div>
      <div className="ctc-below">
        <div className="ctc-below-left">{belowLeft}</div>
        <CtcModelPicker isPro={isPro} disabled={isStreaming} placement={menuPlacement} />
      </div>
    </div>
  );
});
