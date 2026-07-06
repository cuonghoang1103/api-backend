'use client';

// Shared primitives for the "My Language" admin panel: modal, form
// input classes, image/audio upload fields (with preview + spinner),
// a generic @dnd-kit sortable list, and small helpers. Kept in one
// place so every tab looks and behaves the same.

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Upload, Trash2, GripVertical, Mic, Square } from 'lucide-react';
import { toast } from 'sonner';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { languageAdminApi } from '@/lib/language-api';
import { getImageUrl } from '@/lib/utils';

// ─── Style tokens ────────────────────────────────────────────────
export const inputCls =
  'w-full rounded-lg border border-darkborder bg-[var(--bg-surface)] px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none';
export const labelCls = 'block text-xs text-text-secondary';
export const btnPrimary =
  'inline-flex items-center gap-2 rounded-lg bg-neon-violet px-4 py-2 text-sm font-medium text-white hover:bg-neon-violet/90 disabled:opacity-60 transition-colors';
export const btnGhost =
  'inline-flex items-center gap-2 rounded-lg border border-darkborder px-4 py-2 text-sm text-text-secondary hover:bg-white/5 transition-colors';
export const btnAdd =
  'inline-flex items-center gap-2 rounded-lg bg-neon-violet/20 border border-neon-violet/40 px-4 py-2 text-sm font-medium text-violet-200 hover:bg-neon-violet/30 transition-colors';

// ─── Unwrap helper ───────────────────────────────────────────────
export function unwrap<T>(res: { data: { data: T } }): T {
  return res.data.data;
}

export function errMsg(e: unknown, fallback: string): string {
  const err = e as { response?: { data?: { message?: string } } };
  return err?.response?.data?.message || fallback;
}

// ─── Modal ───────────────────────────────────────────────────────
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-lg',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          <div
            className="pointer-events-none fixed inset-0 z-[101] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97, pointerEvents: 'none' }}
              transition={{ duration: 0.2, ease: [0.32, 0.94, 0.6, 1] }}
              className={`pointer-events-auto flex max-h-[90vh] w-full ${maxWidth} flex-col overflow-hidden rounded-2xl border border-darkborder bg-darkcard shadow-[0_24px_80px_rgba(0,0,0,0.6)]`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-darkborder px-5 py-3.5">
                <h2 className="font-heading font-bold text-text-primary">{title}</h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-text-muted hover:bg-white/5 hover:text-text-primary"
                  aria-label="Đóng"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">{children}</div>
              {footer && (
                <div className="flex justify-end gap-2 border-t border-darkborder px-5 py-3.5">{footer}</div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Image upload field ──────────────────────────────────────────
export function ImageField({
  value,
  onChange,
  label = 'Ảnh',
}: {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (file: File) => {
    setBusy(true);
    try {
      const { url } = unwrap(await languageAdminApi.uploadImage(file));
      onChange(url);
    } catch (e) {
      toast.error(errMsg(e, 'Upload ảnh thất bại'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className={labelCls}>{label}</span>
      <div className="mt-1 flex items-center gap-3">
        {value ? (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-darkborder">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getImageUrl(value)} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-0.5 top-0.5 rounded bg-black/60 p-0.5 text-white hover:bg-red-500/80"
              aria-label="Xóa ảnh"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-darkborder text-text-muted">
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          </div>
        )}
        <button type="button" onClick={() => ref.current?.click()} disabled={busy} className={btnGhost}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {value ? 'Đổi ảnh' : 'Tải ảnh'}
        </button>
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void pick(f);
          e.target.value = '';
        }}
      />
    </div>
  );
}

// ─── Audio upload field (with optional in-browser recording) ─────
export function AudioField({
  value,
  onChange,
  label = 'Âm thanh',
  allowRecord = false,
}: {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
  allowRecord?: boolean;
}) {
  const ref = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const upload = async (file: File | Blob, filename?: string) => {
    setBusy(true);
    try {
      const { url } = unwrap(await languageAdminApi.uploadAudio(file, filename));
      onChange(url);
    } catch (e) {
      toast.error(errMsg(e, 'Upload âm thanh thất bại'));
    } finally {
      setBusy(false);
    }
  };

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (ev) => {
        if (ev.data.size > 0) chunksRef.current.push(ev.data);
      };
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        void upload(blob, 'recording.webm');
      };
      recorderRef.current = rec;
      rec.start();
      setRecording(true);
    } catch {
      toast.error('Không truy cập được micro');
    }
  };

  const stopRec = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div>
      <span className={labelCls}>{label}</span>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        {value && <audio controls src={getImageUrl(value)} className="h-9 max-w-full" />}
        <button type="button" onClick={() => ref.current?.click()} disabled={busy || recording} className={btnGhost}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {value ? 'Đổi file' : 'Tải file'}
        </button>
        {allowRecord &&
          (recording ? (
            <button type="button" onClick={stopRec} className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">
              <Square className="h-4 w-4" /> Dừng ghi
            </button>
          ) : (
            <button type="button" onClick={startRec} disabled={busy} className={btnGhost}>
              <Mic className="h-4 w-4" /> Ghi âm
            </button>
          ))}
        {value && (
          <button type="button" onClick={() => onChange('')} className="rounded-lg p-2 text-text-muted hover:bg-red-500/10 hover:text-red-400" aria-label="Xóa âm thanh">
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void upload(f, f.name);
          e.target.value = '';
        }}
      />
    </div>
  );
}

// ─── Generic sortable list ───────────────────────────────────────
export function SortableList<T>({
  items,
  getId,
  onReorder,
  renderItem,
}: {
  items: T[];
  getId: (item: T) => number;
  onReorder: (ordered: T[]) => void;
  renderItem: (item: T) => React.ReactNode;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex((i) => String(getId(i)) === active.id);
    const newIdx = items.findIndex((i) => String(getId(i)) === over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    onReorder(arrayMove(items, oldIdx, newIdx));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((i) => String(getId(i)))} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((item) => (
            <SortableRow key={getId(item)} id={getId(item)}>
              {renderItem(item)}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({ id, children }: { id: number; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: String(id) });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-2 rounded-xl border border-darkborder bg-[var(--bg-surface)] p-3">
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Kéo để sắp xếp"
        className="mt-1 shrink-0 cursor-grab text-text-muted hover:text-text-primary active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

// ─── Small dynamic row list helper (pronunciations, examples…) ──
export function RowActions({ onDelete }: { onDelete: () => void }) {
  return (
    <button
      type="button"
      onClick={onDelete}
      className="rounded-lg p-2 text-text-muted hover:bg-red-500/10 hover:text-red-400"
      aria-label="Xóa"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
