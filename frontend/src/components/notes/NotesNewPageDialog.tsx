'use client';

/**
 * "Trang mới…" từ trang chủ Sổ tay / bảng lệnh ⌘K — chọn NƠI rồi đặt TÊN.
 * (Trong thanh bên thì dùng "+ Mới", ô tên hiện ngay tại chỗ trong cây.)
 * Cùng luật với thanh bên: chưa có tên thì không tạo, trùng tên anh em thì cảnh báo.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { NoteSubjectTree } from '@/types';
import NotesNameInput from './NotesNameInput';
import { isInboxSubject, subjectCrumb, subjectName } from './notesText';

export default function NotesNewPageDialog({
  tree, defaultTarget, onCreate, onOpenExisting, onClose,
}: {
  tree: NoteSubjectTree[];
  defaultTarget: { subjectId: number; chapterId: number | null } | null;
  onCreate: (subjectId: number, chapterId: number | null, title: string) => Promise<unknown>;
  onOpenExisting: (noteId: number) => void;
  onClose: () => void;
}) {
  const hostRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    hostRef.current = (document.querySelector('.notes-theme-root') as HTMLElement | null) ?? document.body;
    setMounted(true);
  }, []);

  const ordered = useMemo(() => [...tree].sort((a, b) => Number(isInboxSubject(b)) - Number(isInboxSubject(a))), [tree]);
  const fallback = defaultTarget ?? (ordered[0] ? { subjectId: ordered[0].id, chapterId: null } : null);
  const [target, setTarget] = useState(fallback ? `${fallback.subjectId}:${fallback.chapterId ?? 0}` : '');
  const [subjectId, chapterIdRaw] = target.split(':').map(Number);
  const chapterId = chapterIdRaw ? chapterIdRaw : null;
  const subject = tree.find((s) => s.id === subjectId);
  const siblings = (chapterId ? subject?.chapters.find((c) => c.id === chapterId)?.notes : subject?.notes) ?? [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !e.isComposing) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!mounted || !hostRef.current) return null;

  return createPortal(
    <div className="fixed inset-0 z-[96] flex items-start justify-center bg-black/40 px-4 pt-[14vh] backdrop-blur-[2px]" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Tạo trang mới"
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-black/[0.08] bg-[var(--notes-surface,#fff)] p-4 text-[var(--notes-text,#1e293b)] shadow-2xl dark:border-white/[0.1] dark:bg-[#12171f]"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold">📄 Trang mới</h2>
          <button type="button" onClick={onClose} aria-label="Đóng" className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-black/[0.05] dark:hover:bg-white/[0.06]"><X className="h-4 w-4" /></button>
        </div>
        {tree.length === 0 ? (
          <p className="text-[13px] text-slate-500">Chưa có môn nào. Tạo một môn trước bằng nút “+ Mới” ở thanh bên.</p>
        ) : (
          <>
            <label className="mb-1 block text-[11.5px] font-medium text-slate-500">Đặt vào</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="mb-3 w-full rounded-md border border-black/[0.1] bg-transparent px-2 py-2 text-[13px] focus:border-teal-500 focus:outline-none dark:border-white/[0.12] dark:bg-[#12171f]"
            >
              {ordered.map((s) => (
                <optgroup key={s.id} label={subjectCrumb(s)}>
                  <option value={`${s.id}:0`}>{subjectName(s)} — gốc môn</option>
                  {s.chapters.map((c) => <option key={c.id} value={`${s.id}:${c.id}`}>📂 {c.title}</option>)}
                </optgroup>
              ))}
            </select>
            <NotesNameInput
              placeholder="Tên trang…"
              kindLabel="trang"
              icon="📄"
              siblings={siblings.map((n) => ({ id: n.id, name: n.title || 'Không có tiêu đề' }))}
              onSubmit={async (name) => { await onCreate(subjectId!, chapterId, name); onClose(); }}
              onCancel={() => { /* blur khi trống — giữ hộp thoại mở */ }}
              onEscape={onClose}
              onOpenExisting={(id) => { onClose(); onOpenExisting(id); }}
            />
          </>
        )}
      </div>
    </div>,
    hostRef.current,
  );
}
