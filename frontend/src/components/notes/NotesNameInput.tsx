'use client';

/**
 * Ô đặt tên khi TẠO trang / chương / môn.
 *
 * ─── Vì sao không tạo trước rồi đổi tên sau ───
 * Bản cũ bấm "+" là tạo ngay một "Ghi chú mới" / "Môn học mới" rồi mới mở ô
 * đổi tên. Bấm hụt, bấm hai lần, hay rời chuột giữa chừng đều để lại một dòng
 * trùng tên — người dùng gửi ảnh có hai trang "Ghi chú mới" trong cùng một môn.
 * Nay: chưa có tên thì chưa có gì trong cơ sở dữ liệu.
 *
 * ─── Chặn trùng tên ───
 * Trùng với anh em cùng cấp (không phân biệt hoa thường, gộp khoảng trắng thừa)
 * ⇒ cảnh báo NGAY TẠI Ô, không tạo cho tới khi đổi tên hoặc bấm "Vẫn tạo".
 *
 * ⚠️ IME tiếng Việt (Telex/VNI qua bộ gõ hệ thống, và bộ gõ Nhật/Trung/Hàn):
 * Enter/Escape trong lúc đang dựng chữ thuộc về bộ gõ — `isComposing` thì bỏ qua.
 */
import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { normName } from './notesText';

export interface Sibling { id: number; name: string }

export default function NotesNameInput({
  placeholder, siblings, kindLabel, onSubmit, onCancel, onEscape, onOpenExisting, indent = 0, icon,
}: {
  placeholder: string;
  siblings: Sibling[];
  /** "trang" | "chương" | "môn" — dùng trong câu cảnh báo. */
  kindLabel: string;
  onSubmit: (name: string) => Promise<void> | void;
  onCancel: () => void;
  /** Esc — mặc định như onCancel. */
  onEscape?: () => void;
  onOpenExisting?: (id: number) => void;
  indent?: number;
  icon?: React.ReactNode;
}) {
  const [val, setVal] = useState('');
  const [dup, setDup] = useState<Sibling | null>(null);
  const [empty, setEmpty] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => ref.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

  const submit = async (force = false) => {
    if (busy) return;
    const name = val.trim().replace(/\s+/g, ' ');
    if (!name) { setEmpty(true); ref.current?.focus(); return; }
    if (!force) {
      const hit = siblings.find((s) => normName(s.name) === normName(name));
      if (hit) { setDup(hit); return; }
    }
    setBusy(true);
    try { await onSubmit(name); } finally { setBusy(false); }
  };

  return (
    <div className="px-1 py-0.5" style={{ paddingLeft: 4 + indent }}>
      <div
        className={`flex items-center gap-1.5 rounded-md bg-[var(--notes-surface,#fff)] px-1.5 ring-1 dark:bg-white/[0.04] ${
          dup ? 'ring-amber-400' : empty ? 'ring-rose-400' : 'ring-teal-500/60'
        }`}
      >
        {icon && <span className="shrink-0 text-[13px] leading-none">{icon}</span>}
        <input
          ref={ref}
          value={val}
          disabled={busy}
          maxLength={200}
          onChange={(e) => { setVal(e.target.value); setDup(null); setEmpty(false); }}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.nativeEvent.isComposing || e.keyCode === 229) return;
            if (e.key === 'Enter') { e.preventDefault(); void submit(Boolean(dup)); }
            if (e.key === 'Escape') { e.preventDefault(); (onEscape ?? onCancel)(); }
          }}
          onBlur={() => { if (!val.trim() && !busy) onCancel(); }}
          placeholder={placeholder}
          aria-label={placeholder}
          aria-invalid={Boolean(dup) || empty}
          className="min-h-[30px] min-w-0 flex-1 bg-transparent text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        {busy && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-slate-400" />}
      </div>
      {dup ? (
        <div role="alert" className="mt-1 rounded-md border border-amber-300/70 bg-amber-50 px-2 py-1.5 text-[11.5px] leading-snug text-amber-900 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-200">
          <div className="flex items-start gap-1.5">
            <AlertTriangle className="mt-[1px] h-3.5 w-3.5 shrink-0" />
            <span>Đã có {kindLabel} “{dup.name}” ở đây. Đổi tên khác, hoặc:</span>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5 pl-5">
            {onOpenExisting && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onOpenExisting(dup.id)}
                className="rounded border border-amber-400/60 px-2 py-0.5 font-medium hover:bg-amber-100 dark:hover:bg-amber-400/15"
              >
                Mở {kindLabel} đó
              </button>
            )}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => void submit(true)}
              className="rounded px-2 py-0.5 text-amber-800 underline-offset-2 hover:underline dark:text-amber-200"
            >
              Vẫn tạo
            </button>
          </div>
        </div>
      ) : (
        <div className={`mt-0.5 px-1 text-[10.5px] ${empty ? 'text-rose-500' : 'text-slate-400 dark:text-slate-500'}`}>
          {empty ? 'Nhập tên trước đã' : 'Enter để tạo · Esc để huỷ'}
        </div>
      )}
    </div>
  );
}
