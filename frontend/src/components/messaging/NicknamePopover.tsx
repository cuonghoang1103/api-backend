'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AtSign, X, Check } from 'lucide-react';
import { useMessagingStore } from '@/store/messagingStore';
import type { MessagingThread } from '@/lib/api';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

/**
 * Small popover for setting/removing the local alias the
 * current user has assigned to the other participant in a
 * thread. The alias is per-(thread, owner) — the peer never
 * sees it. Empty string clears the alias.
 */
export default function NicknamePopover({
  thread,
  disabled = false,
}: {
  thread: MessagingThread;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const setNickname = useMessagingStore((s) => s.setNickname);
  const peerAlias = thread.peer?.alias ?? null;

  useEffect(() => {
    if (open) setValue(peerAlias ?? '');
  }, [open, peerAlias]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  if (!thread.peer) return null;

  const handleSave = async () => {
    const v = value.trim();
    setSaving(true);
    try {
      await setNickname(thread.id, thread.peer!.id, v);
      toast.success(v ? `Đã đặt biệt danh: ${v}` : 'Đã xoá biệt danh');
      setOpen(false);
    } catch (e: any) {
      toast.error(e?.userFriendlyMessage ?? e?.message ?? 'Không thể lưu biệt danh');
    } finally {
      setSaving(false);
    }
  };

  const handleClear = async () => {
    setSaving(true);
    try {
      await setNickname(thread.id, thread.peer!.id, '');
      setValue('');
      toast.success('Đã xoá biệt danh');
      setOpen(false);
    } catch (e: any) {
      toast.error(e?.userFriendlyMessage ?? e?.message ?? 'Không thể xoá biệt danh');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => !disabled && setOpen((s) => !s)}
        disabled={disabled}
        className={cn(
          'flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium transition-colors',
          peerAlias
            ? 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25'
            : 'text-text-muted hover:bg-white/[0.06] hover:text-text-secondary',
          disabled && 'cursor-not-allowed opacity-50',
        )}
        title={peerAlias ? `Biệt danh: ${peerAlias}` : 'Đặt biệt danh cho người này'}
      >
        <AtSign className="h-3 w-3" />
        {peerAlias ? peerAlias : 'Đặt biệt danh'}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-7 z-30 w-64 rounded-xl border border-white/10 bg-[#0a0a14]/95 p-3 shadow-2xl backdrop-blur"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-semibold text-text-primary">Biệt danh trong cuộc trò chuyện</p>
              <button
                onClick={() => setOpen(false)}
                className="rounded p-0.5 text-text-muted hover:bg-white/[0.06] hover:text-text-primary"
                aria-label="Đóng"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <p className="mb-2 text-[10px] text-text-muted">
              Chỉ mình bạn thấy biệt danh này. Người kia sẽ vẫn thấy tên gốc.
            </p>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value.slice(0, 100))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void handleSave();
                if (e.key === 'Escape') setOpen(false);
              }}
              maxLength={100}
              placeholder="Nhập biệt danh..."
              className="w-full rounded-md border border-white/10 bg-white/[0.04] px-2 py-1.5 text-[12px] text-text-primary placeholder:text-text-muted focus:border-cyan-500/40 focus:outline-none"
              autoFocus
            />
            <div className="mt-2 flex items-center justify-between gap-1.5">
              {peerAlias && (
                <button
                  onClick={handleClear}
                  disabled={saving}
                  className="rounded-md px-2 py-1 text-[10px] font-medium text-red-300 hover:bg-red-500/15 disabled:opacity-50"
                >
                  Xoá
                </button>
              )}
              <div className="flex flex-1 justify-end gap-1.5">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] text-text-secondary hover:bg-white/[0.08]"
                >
                  Huỷ
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || value.trim() === (peerAlias ?? '')}
                  className="flex items-center gap-1 rounded-md bg-cyan-500/80 px-2 py-1 text-[10px] font-semibold text-white hover:bg-cyan-500 disabled:opacity-50"
                >
                  <Check className="h-3 w-3" />
                  Lưu
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
