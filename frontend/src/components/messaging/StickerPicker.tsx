'use client';

/**
 * Sticker picker popover. Lists active packs as tabs along the top
 * and the selected pack's stickers in a grid. Stickers are served
 * from our own storage (see stickerApi). Empty state nudges admins
 * to add packs at /admin/stickers.
 */

import { useEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, X } from 'lucide-react';
import { useAnchoredFixedStyle } from './useAnchoredPopover';
import { stickerApi, type StickerPack, type Sticker } from '@/lib/api';

export default function StickerPicker({
  open,
  onClose,
  onPick,
  anchorRef,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (url: string) => void;
  anchorRef?: RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fixedStyle = useAnchoredFixedStyle(anchorRef, open, 340);
  const [packs, setPacks] = useState<StickerPack[]>([]);
  const [activePack, setActivePack] = useState<number | null>(null);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [loadingPacks, setLoadingPacks] = useState(false);
  const [loadingStickers, setLoadingStickers] = useState(false);
  // Cache stickers per pack so flipping tabs is instant.
  const cache = useRef<Map<number, Sticker[]>>(new Map());

  useEffect(() => {
    if (!open || packs.length > 0) return;
    setLoadingPacks(true);
    stickerApi
      .listPacks()
      .then((r) => {
        const list = r.data.data ?? [];
        setPacks(list);
        if (list.length > 0) setActivePack(list[0].id);
      })
      .catch(() => setPacks([]))
      .finally(() => setLoadingPacks(false));
  }, [open, packs.length]);

  useEffect(() => {
    if (activePack == null) return;
    if (cache.current.has(activePack)) {
      setStickers(cache.current.get(activePack)!);
      return;
    }
    setLoadingStickers(true);
    stickerApi
      .listStickers(activePack)
      .then((r) => {
        const list = r.data.data ?? [];
        cache.current.set(activePack, list);
        setStickers(list);
      })
      .catch(() => setStickers([]))
      .finally(() => setLoadingStickers(false));
  }, [activePack]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const t = setTimeout(() => document.addEventListener('mousedown', onDoc), 0);
    return () => { clearTimeout(t); document.removeEventListener('mousedown', onDoc); };
  }, [open, onClose]);

  if (!open) return null;

  const body = (
    <div
      ref={ref}
      className={
        anchorRef
          ? 'w-[340px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e1218] shadow-[0_16px_48px_rgba(0,0,0,0.55)]'
          : 'absolute bottom-full left-0 z-50 mb-2 w-[340px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e1218] shadow-[0_16px_48px_rgba(0,0,0,0.55)]'
      }
      style={anchorRef ? fixedStyle : undefined}
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2">
        <span className="text-xs font-semibold text-text-secondary">Nhãn dán</span>
        <button onClick={onClose} className="rounded-lg p-1 text-text-muted hover:bg-white/[0.06] hover:text-text-primary">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="h-[300px] overflow-y-auto p-2">
        {loadingPacks ? (
          <div className="flex h-full items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-text-muted" /></div>
        ) : packs.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center text-xs text-text-muted">
            <p>Chưa có bộ nhãn dán nào.</p>
            <p className="mt-1 text-[11px] text-text-muted/70">Admin có thể thêm tại <span className="text-cyan-400">/admin/stickers</span>.</p>
          </div>
        ) : loadingStickers ? (
          <div className="flex h-full items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-text-muted" /></div>
        ) : (
          <div className="grid grid-cols-4 gap-1.5">
            {stickers.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => { onPick(s.url); onClose(); }}
                className="flex aspect-square items-center justify-center rounded-lg p-1 transition-colors hover:bg-white/[0.06]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.url} alt={s.label ?? ''} className="max-h-full max-w-full object-contain" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pack tabs */}
      {packs.length > 0 && (
        <div className="flex items-center gap-1 overflow-x-auto border-t border-white/[0.06] p-1.5">
          {packs.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePack(p.id)}
              title={p.name}
              className={`flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg transition-colors ${
                activePack === p.id ? 'bg-cyan-500/20 ring-1 ring-cyan-500/40' : 'hover:bg-white/[0.06]'
              }`}
            >
              {p.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.coverUrl} alt={p.name} className="h-7 w-7 object-contain" />
              ) : (
                <span className="text-[10px] text-text-muted">{p.name.charAt(0)}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return anchorRef ? createPortal(body, document.body) : body;
}
