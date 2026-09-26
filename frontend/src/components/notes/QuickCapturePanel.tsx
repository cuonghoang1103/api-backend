'use client';

/**
 * QuickCapturePanel — ô nổi "Ghi nhanh" (tải lười bởi QuickCaptureHost).
 *
 * Hai thẻ:
 *   📝 Ghi chú — tiêu đề tuỳ chọn + nội dung (Markdown: `pwd`, ```bash …```,
 *                "- " …) → một trang mới trong 📥 Hộp thư. Chọn thêm mẫu
 *                "Ghi chú bài học" / "Nhật ký lỗi" thì khung mẫu nằm dưới.
 *   ⌨️ Sổ lệnh — Lệnh · Nghĩa · Ví dụ · Nhóm · Lỗi → máy chủ gom vào trang
 *                "⌨️ Sổ lệnh" (Hộp thư): mỗi nhóm một bảng, lệnh gốc gộp ô,
 *                `mkdir -p` nằm dưới `mkdir`, ghi trùng thì gộp dòng cũ.
 *                Nút "Ôn bằng flashcard" sinh thẻ "Lệnh nào để <nghĩa>?".
 *
 * Phím: Enter lưu · Shift+Enter xuống dòng · Esc đóng (bản nháp vẫn giữ).
 * Enter trong lúc bộ gõ đang ghép chữ (Telex/IME, `isComposing` hoặc
 * keyCode 229) KHÔNG lưu — đó là phím chốt chữ của bộ gõ.
 *
 * Bản nháp nằm trong localStorage (bọc try/catch: chế độ riêng tư / bị chặn
 * thì vẫn chạy, chỉ là không nhớ).
 */
import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { toast } from 'sonner';
import { Loader2, X, FileUp, GraduationCap, Keyboard, StickyNote } from 'lucide-react';
import { ghiNhanhApi, type MauTrangKey } from '@/lib/api';
import type { GhiNhanhMoDetail, GhiNhanhMode } from './QuickCaptureHost';

const NHAP_KEY = 'ghi-nhanh:nhap-v1';
const NHOM = ['Terminal', 'Git', 'npm', 'HTML', 'CSS', 'JavaScript', 'SQL', 'Docker', 'Khác'];
const MAU_GHI_CHU: { key: MauTrangKey; label: string }[] = [
  { key: 'ghi-chu-bai-hoc', label: '📝 Ghi chú bài học' },
  { key: 'nhat-ky-loi', label: '🐞 Nhật ký lỗi' },
];
const MAX_MD_BYTES = 512 * 1024;

interface BanNhap {
  mode: GhiNhanhMode;
  title: string;
  text: string;
  template: MauTrangKey | '';
  lenh: string;
  nghia: string;
  viDu: string;
  nhom: string;
  loi: string;
}
const TRONG: BanNhap = { mode: 'ghi-chu', title: '', text: '', template: '', lenh: '', nghia: '', viDu: '', nhom: 'Terminal', loi: '' };

function docNhap(): BanNhap {
  try {
    const raw = window.localStorage.getItem(NHAP_KEY);
    if (!raw) return TRONG;
    return { ...TRONG, ...(JSON.parse(raw) as Partial<BanNhap>) };
  } catch { return TRONG; }
}
function ghiNhap(b: BanNhap) {
  try {
    const rong = !b.title && !b.text && !b.lenh && !b.nghia && !b.viDu && !b.loi;
    if (rong) window.localStorage.removeItem(NHAP_KEY);
    else window.localStorage.setItem(NHAP_KEY, JSON.stringify(b));
  } catch { /* bộ nhớ bị chặn — bỏ qua */ }
}

/** Mở một ghi chú ở /notes (đường deep-link sẵn có `?note=ID`). */
export function moGhiChu(noteId: number) {
  window.location.href = `/notes?note=${noteId}`;
}

function baoDaLuu(noteId: number, tenMon: string, loiNhan = 'Đã lưu vào') {
  // Thanh bên Notes (nếu đang mở) nghe sự kiện này để tải lại cây.
  try { window.dispatchEvent(new CustomEvent('notes:tai-lai-cay', { detail: { noteId } })); } catch { /* ignore */ }
  toast.success(`${loiNhan} ${tenMon}`, {
    action: { label: 'Mở', onClick: () => moGhiChu(noteId) },
    duration: 6000,
  });
}

export function loiApi(e: unknown, macDinh: string): string {
  const msg = (e as { response?: { data?: { message?: string; error?: { message?: string } } } })?.response?.data;
  return msg?.message || msg?.error?.message || macDinh;
}

/**
 * Ô chữ tự giãn theo nội dung. Trước đây Nghĩa/Ví dụ/Lỗi là <input> một dòng:
 * câu dài trôi khuất sang trái (không thấy mình gõ đúng hay sai) và
 * Shift+Enter không làm gì. Enter vẫn lưu — do `onKeyDown` truyền vào quyết.
 */
function OTuGian(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight + 2, 200)}px`;
  }, [props.value]);
  return <textarea ref={ref} rows={1} {...props} className={`${props.className ?? ''} resize-none overflow-y-auto leading-snug`} />;
}

/** Xem trước chỗ lệnh sẽ nằm trong sổ — cùng quy tắc với `tachLenh` phía máy chủ (ghiNhanhNoiDung.ts). */
const CONG_CU_CO_LENH_CON = new Set(['git', 'npm', 'npx', 'pnpm', 'yarn', 'docker', 'gh', 'brew', 'kubectl', 'prisma', 'systemctl', 'pip', 'pip3']);
function xemTruocLenh(lenh: string): { goc: string; co: string } | null {
  const tu = lenh.trim().split(/\s+/).filter(Boolean);
  if (tu.length === 0) return null;
  const n = CONG_CU_CO_LENH_CON.has(tu[0].toLowerCase()) && tu[1] && /^[a-z][\w:.-]*$/i.test(tu[1]) ? 2 : 1;
  const con = tu.slice(n);
  const co = con.filter((t) => t.startsWith('-'));
  return { goc: tu.slice(0, n).join(' '), co: co.length ? co.join(' ') : con.join(' ') };
}

/** Enter (không Shift, không đang ghép chữ) → true. */
function laEnterLuu(e: ReactKeyboardEvent): boolean {
  return e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.nativeEvent.keyCode !== 229;
}

interface Props {
  open: boolean;
  prefill: GhiNhanhMoDetail | null;
  onClose: () => void;
  /** Sổ lệnh → sinh thẻ rồi mở màn ôn (Host giữ màn ôn). */
  onOnThe: (noteId: number) => Promise<void>;
}

export default function QuickCapturePanel({ open, prefill, onClose, onOnThe }: Props) {
  const [b, setB] = useState<BanNhap>(TRONG);
  const [dangLuu, setDangLuu] = useState(false);
  const [dangTaoThe, setDangTaoThe] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const lenhRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const napRef = useRef(false);

  // Mỗi lần mở: nạp bản nháp, áp prefill (nếu có), focus ô chính.
  useEffect(() => {
    if (!open) { napRef.current = false; return; }
    if (napRef.current) return;
    napRef.current = true;
    let s = docNhap();
    if (prefill) {
      s = {
        ...s,
        mode: prefill.mode ?? s.mode,
        title: prefill.title ?? s.title,
        text: prefill.text ? (s.text ? `${s.text}\n\n${prefill.text}` : prefill.text) : s.text,
      };
    }
    setB(s);
    requestAnimationFrame(() => {
      (s.mode === 'so-lenh' ? lenhRef.current : textRef.current)?.focus();
    });
  }, [open, prefill]);

  const sua = useCallback((patch: Partial<BanNhap>) => {
    setB((cu) => {
      const moi = { ...cu, ...patch };
      ghiNhap(moi);
      return moi;
    });
  }, []);

  const dong = useCallback(() => { onClose(); }, [onClose]);

  // Esc đóng — bắt ở window để cả khi focus nằm ngoài ô nhập.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.isComposing) { e.preventDefault(); dong(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, dong]);

  const luuGhiChu = useCallback(async () => {
    if (dangLuu) return;
    if (!b.text.trim() && !b.template) { textRef.current?.focus(); return; }
    setDangLuu(true);
    try {
      const r = await ghiNhanhApi.luu({ title: b.title.trim() || undefined, text: b.text, template: b.template || undefined });
      const { note, subject } = r.data.data;
      const giu = { ...TRONG, mode: b.mode, template: b.template };
      setB(giu); ghiNhap(giu);
      onClose();
      baoDaLuu(note.id, subject.name);
    } catch (e) {
      toast.error(loiApi(e, 'Không lưu được ghi nhanh'));
    } finally { setDangLuu(false); }
  }, [b, dangLuu, onClose]);

  const luuLenh = useCallback(async () => {
    if (dangLuu) return;
    if (!b.lenh.trim()) { lenhRef.current?.focus(); return; }
    if (!b.nghia.trim()) { toast.error('Ghi nghĩa của lệnh bằng lời của bạn'); return; }
    setDangLuu(true);
    try {
      const r = await ghiNhanhApi.themLenh({ lenh: b.lenh, nghia: b.nghia, viDu: b.viDu, nhom: b.nhom, loi: b.loi });
      const giu = { ...TRONG, mode: 'so-lenh' as const, nhom: b.nhom };
      setB(giu); ghiNhap(giu);
      baoDaLuu(r.data.data.noteId, '⌨️ Sổ lệnh', `Đã thêm “${b.lenh.trim()}” vào`);
      // Giữ ô mở để ghi lệnh tiếp — học terminal là ghi liền vài lệnh một lúc.
      requestAnimationFrame(() => lenhRef.current?.focus());
    } catch (e) {
      toast.error(loiApi(e, 'Không thêm được lệnh'));
    } finally { setDangLuu(false); }
  }, [b, dangLuu]);

  const onTap = useCallback(async () => {
    if (dangTaoThe) return;
    setDangTaoThe(true);
    try {
      const so = await ghiNhanhApi.soLenh();
      await onOnThe(so.data.data.noteId);
    } catch (e) {
      toast.error(loiApi(e, 'Không mở được Sổ lệnh'));
    } finally { setDangTaoThe(false); }
  }, [dangTaoThe, onOnThe]);

  const nhapMd = useCallback(async (file: File | undefined) => {
    if (!file) return;
    if (!/\.(md|markdown|txt)$/i.test(file.name)) { toast.error('Chỉ nhận file .md / .markdown / .txt'); return; }
    if (file.size > MAX_MD_BYTES) { toast.error('File quá lớn (tối đa 512 KB)'); return; }
    setDangLuu(true);
    try {
      const markdown = await file.text();
      const r = await ghiNhanhApi.nhapMd({ filename: file.name, markdown });
      onClose();
      baoDaLuu(r.data.data.note.id, r.data.data.subject.name, `Đã nhập "${r.data.data.note.title}" vào`);
    } catch (e) {
      toast.error(loiApi(e, 'Không nhập được file'));
    } finally {
      setDangLuu(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }, [onClose]);

  if (!open) return null;

  const oNhap = 'w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/40';
  const oStyle = { background: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' } as const;
  const onEnter = (luu: () => void) => (e: ReactKeyboardEvent) => {
    if (laEnterLuu(e)) { e.preventDefault(); void luu(); }
  };

  return (
    <div
      role="dialog"
      aria-label="Ghi nhanh"
      className="fixed z-[110] left-4 right-4 sm:left-auto sm:right-6 sm:w-[420px] rounded-2xl border shadow-2xl"
      style={{
        bottom: 'calc(16px + var(--app-chrome-bottom, 0px) + env(safe-area-inset-bottom, 0px))',
        background: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)',
        maxHeight: 'calc(100dvh - 96px)',
        overflowY: 'auto',
      }}
    >
      <div className="flex items-center gap-1 border-b px-3 py-2" style={{ borderColor: 'var(--border-color)' }}>
        {([['ghi-chu', 'Ghi chú', StickyNote], ['so-lenh', 'Sổ lệnh', Keyboard]] as const).map(([m, label, Icon]) => (
          <button
            key={m}
            type="button"
            onClick={() => { sua({ mode: m }); requestAnimationFrame(() => (m === 'so-lenh' ? lenhRef.current : textRef.current)?.focus()); }}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${b.mode === m ? 'bg-violet-500/15 text-violet-500' : 'hover:bg-black/5'}`}
            style={b.mode === m ? undefined : { color: 'var(--text-secondary)' }}
            aria-pressed={b.mode === m}
          >
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
        {/* Nút xem lại chỗ đã lưu (26/09: người dùng hỏi "lưu rồi xem lại ở đâu?") —
            thẻ Sổ lệnh mở thẳng trang ⌨️ Sổ lệnh, thẻ Ghi chú mở /notes (Hộp thư ở đầu cây). */}
        <button
          type="button"
          onClick={async () => {
            let dich = '/notes';
            if (b.mode === 'so-lenh') {
              try { dich = `/notes?note=${(await ghiNhanhApi.soLenh()).data.data.noteId}`; } catch { /* về /notes */ }
            }
            onClose();
            window.location.assign(dich);
          }}
          className="ml-auto rounded-lg px-2 py-1 text-[11px] font-medium hover:bg-black/5"
          style={{ color: 'var(--text-secondary)' }}
          title={b.mode === 'so-lenh' ? 'Mở trang ⌨️ Sổ lệnh để xem mọi lệnh đã lưu' : 'Mở Sổ tay — 📥 Hộp thư nằm ở đầu cây'}
        >
          {b.mode === 'so-lenh' ? 'Xem Sổ lệnh ↗' : 'Xem 📥 Hộp thư ↗'}
        </button>
        <button type="button" onClick={dong} className="ml-1 rounded-lg p-1.5 hover:bg-black/5" aria-label="Đóng (Esc)" style={{ color: 'var(--text-secondary)' }}>
          <X className="h-4 w-4" />
        </button>
      </div>

      {b.mode === 'ghi-chu' ? (
        <div className="space-y-2 p-3">
          <input
            value={b.title}
            onChange={(e) => sua({ title: e.target.value })}
            onKeyDown={onEnter(luuGhiChu)}
            placeholder="Tiêu đề (tuỳ chọn)"
            maxLength={300}
            className={oNhap}
            style={oStyle}
          />
          <textarea
            ref={textRef}
            value={b.text}
            onChange={(e) => sua({ text: e.target.value })}
            onKeyDown={onEnter(luuGhiChu)}
            placeholder={'Ghi gì đó… vd: `pwd` in ra thư mục đang đứng\nShift+Enter xuống dòng · Markdown dùng được'}
            rows={5}
            maxLength={20000}
            className={`${oNhap} resize-y font-[inherit]`}
            style={oStyle}
          />
          <div className="flex flex-wrap items-center gap-1.5">
            {MAU_GHI_CHU.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => sua({ template: b.template === m.key ? '' : m.key })}
                className={`rounded-full border px-2.5 py-1 text-[11px] ${b.template === m.key ? 'border-violet-500 bg-violet-500/15 text-violet-500' : ''}`}
                style={b.template === m.key ? undefined : { borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                aria-pressed={b.template === m.key}
              >
                Mẫu: {m.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => { sua({ mode: 'so-lenh' }); requestAnimationFrame(() => lenhRef.current?.focus()); }}
              className="rounded-full border px-2.5 py-1 text-[11px]"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            >
              Mẫu: ⌨️ Sổ lệnh
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2 p-3">
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <input
              ref={lenhRef}
              value={b.lenh}
              onChange={(e) => sua({ lenh: e.target.value })}
              onKeyDown={onEnter(luuLenh)}
              placeholder="Lệnh — vd: mkdir -p du-an"
              maxLength={300}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              className={`${oNhap} font-mono`}
              style={oStyle}
            />
            <select
              value={b.nhom}
              onChange={(e) => sua({ nhom: e.target.value })}
              className="rounded-lg border px-2 text-sm"
              style={oStyle}
              aria-label="Nhóm"
            >
              {NHOM.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          {(() => {
            const x = xemTruocLenh(b.lenh);
            if (!x) return null;
            return (
              <p className="px-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                Sẽ nằm trong nhóm <b>{b.nhom}</b> → lệnh <code className="font-mono">{x.goc}</code>
                {x.co ? <> → tuỳ chọn <code className="font-mono">{x.co}</code></> : ' (dòng lệnh gốc)'}
                {' '}· ghi trùng thì gộp vào dòng cũ
              </p>
            );
          })()}
          <OTuGian
            value={b.nghia}
            onChange={(e) => sua({ nghia: e.target.value })}
            onKeyDown={onEnter(luuLenh)}
            placeholder="Nghĩa (lời của bạn) — vd: tạo thư mục mới"
            maxLength={1000}
            className={oNhap}
            style={oStyle}
          />
          <OTuGian
            value={b.viDu}
            onChange={(e) => sua({ viDu: e.target.value })}
            onKeyDown={onEnter(luuLenh)}
            placeholder="Ví dụ (tuỳ chọn)"
            maxLength={1000}
            className={`${oNhap} font-mono`}
            style={oStyle}
          />
          <OTuGian
            value={b.loi}
            onChange={(e) => sua({ loi: e.target.value })}
            onKeyDown={onEnter(luuLenh)}
            placeholder="Lỗi từng gặp (tuỳ chọn)"
            maxLength={2000}
            className={oNhap}
            style={oStyle}
          />
          <button
            type="button"
            onClick={() => void onTap()}
            disabled={dangTaoThe}
            className="flex items-center gap-1.5 rounded-lg border border-teal-500/40 bg-teal-500/10 px-2.5 py-1.5 text-xs font-medium text-teal-600 hover:bg-teal-500/20 disabled:opacity-60"
          >
            {dangTaoThe ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <GraduationCap className="h-3.5 w-3.5" />}
            Ôn bằng flashcard
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 border-t px-3 py-2" style={{ borderColor: 'var(--border-color)' }}>
        <input
          ref={fileRef}
          type="file"
          accept=".md,.markdown,.txt,text/markdown,text/plain"
          className="hidden"
          onChange={(e) => void nhapMd(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={dangLuu}
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs hover:bg-black/5 disabled:opacity-60"
          style={{ color: 'var(--text-secondary)' }}
          title="Nhập file Markdown (vd SO-TAY.md) thành một trang trong Hộp thư"
        >
          <FileUp className="h-3.5 w-3.5" /> Nhập .md
        </button>
        <span className="ml-auto hidden text-[11px] sm:inline" style={{ color: 'var(--text-muted)' }}>Enter lưu · Shift+Enter xuống dòng · Esc đóng</span>
        <button
          type="button"
          onClick={() => void (b.mode === 'so-lenh' ? luuLenh() : luuGhiChu())}
          disabled={dangLuu}
          className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
        >
          {dangLuu && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {b.mode === 'so-lenh' ? 'Thêm lệnh' : 'Lưu'}
        </button>
      </div>
    </div>
  );
}
