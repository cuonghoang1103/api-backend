'use client';

/**
 * Admin — sticker pack management.
 *
 * Create packs, upload sticker images (stored in our own storage via
 * the backend, never hotlinked), and delete stickers/packs. The
 * backend routes are admin-guarded (requireAdmin); this page is also
 * nested under the admin layout which performs the admin-check.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Plus, Trash2, Upload, Loader2, Sticker as StickerIcon } from 'lucide-react';
import { stickerApi, type StickerPack, type Sticker } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminStickersPage() {
  const [packs, setPacks] = useState<StickerPack[]>([]);
  const [activePack, setActivePack] = useState<StickerPack | null>(null);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [loadingPacks, setLoadingPacks] = useState(true);
  const [loadingStickers, setLoadingStickers] = useState(false);
  const [newPackName, setNewPackName] = useState('');
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadPacks = useCallback(async () => {
    setLoadingPacks(true);
    try {
      const r = await stickerApi.adminListPacks();
      setPacks(r.data.data ?? []);
    } catch {
      toast.error('Không tải được danh sách pack');
    } finally {
      setLoadingPacks(false);
    }
  }, []);

  const loadStickers = useCallback(async (packId: number) => {
    setLoadingStickers(true);
    try {
      const r = await stickerApi.listStickers(packId);
      setStickers(r.data.data ?? []);
    } catch {
      setStickers([]);
    } finally {
      setLoadingStickers(false);
    }
  }, []);

  useEffect(() => { loadPacks(); }, [loadPacks]);
  useEffect(() => { if (activePack) loadStickers(activePack.id); }, [activePack, loadStickers]);

  const createPack = async () => {
    const name = newPackName.trim();
    if (!name || creating) return;
    setCreating(true);
    try {
      const r = await stickerApi.adminCreatePack(name);
      setNewPackName('');
      await loadPacks();
      setActivePack(r.data.data);
      toast.success('Đã tạo pack');
    } catch {
      toast.error('Tạo pack thất bại');
    } finally {
      setCreating(false);
    }
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files || !activePack) return;
    setUploading(true);
    let ok = 0;
    for (const file of Array.from(files)) {
      try {
        await stickerApi.adminAddSticker(activePack.id, file);
        ok++;
      } catch {
        toast.error(`${file.name}: upload thất bại`);
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
    if (ok > 0) {
      toast.success(`Đã thêm ${ok} nhãn dán`);
      await loadStickers(activePack.id);
      await loadPacks(); // refresh cover/count
    }
  };

  const deleteSticker = async (id: number) => {
    try {
      await stickerApi.adminDeleteSticker(id);
      setStickers((s) => s.filter((x) => x.id !== id));
    } catch {
      toast.error('Xoá thất bại');
    }
  };

  const deletePack = async (pack: StickerPack) => {
    if (!confirm(`Xoá pack "${pack.name}" và toàn bộ nhãn dán?`)) return;
    try {
      await stickerApi.adminDeletePack(pack.id);
      if (activePack?.id === pack.id) { setActivePack(null); setStickers([]); }
      await loadPacks();
    } catch {
      toast.error('Xoá pack thất bại');
    }
  };

  const toggleActive = async (pack: StickerPack, isActive: boolean) => {
    try {
      await stickerApi.adminUpdatePack(pack.id, { isActive });
      await loadPacks();
    } catch {
      toast.error('Cập nhật thất bại');
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neon-indigo to-neon-violet">
          <StickerIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold text-text-primary">Quản lý Nhãn dán</h1>
          <p className="text-sm text-text-muted">Tạo bộ nhãn dán & upload ảnh (PNG/WebP) — lưu trên storage của bạn.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Packs column */}
        <div className="space-y-3">
          <div className="rounded-xl border border-darkborder bg-darkcard p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Tạo pack mới</p>
            <div className="flex gap-2">
              <input
                value={newPackName}
                onChange={(e) => setNewPackName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') createPack(); }}
                placeholder="Tên pack…"
                className="flex-1 rounded-lg border border-darkborder bg-white/[0.03] px-3 py-2 text-sm text-text-primary outline-none focus:border-neon-violet/40"
              />
              <button
                onClick={createPack}
                disabled={creating || !newPackName.trim()}
                className="flex items-center gap-1 rounded-lg bg-neon-violet/20 px-3 text-sm font-medium text-neon-violet hover:bg-neon-violet/30 disabled:opacity-50"
              >
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            {loadingPacks ? (
              <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-text-muted" /></div>
            ) : packs.length === 0 ? (
              <p className="px-2 py-4 text-center text-xs text-text-muted">Chưa có pack nào.</p>
            ) : (
              packs.map((p) => (
                <div
                  key={p.id}
                  className={`flex items-center gap-2 rounded-xl border p-2 transition-colors ${
                    activePack?.id === p.id ? 'border-neon-violet/40 bg-neon-violet/10' : 'border-darkborder bg-darkcard hover:bg-white/[0.03]'
                  }`}
                >
                  <button onClick={() => setActivePack(p)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/[0.04]">
                      {p.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.coverUrl} alt="" className="h-7 w-7 object-contain" />
                      ) : (
                        <StickerIcon className="h-4 w-4 text-text-muted" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text-primary">{p.name}</p>
                      <p className="text-[11px] text-text-muted">{p.stickerCount ?? 0} nhãn dán</p>
                    </div>
                  </button>
                  <input
                    type="checkbox"
                    checked={(p as any).isActive ?? true}
                    onChange={(e) => toggleActive(p, e.target.checked)}
                    title="Hiển thị trong picker"
                    className="h-4 w-4 accent-neon-violet"
                  />
                  <button onClick={() => deletePack(p)} className="rounded p-1 text-text-muted hover:bg-red-500/10 hover:text-red-400">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stickers column */}
        <div className="rounded-xl border border-darkborder bg-darkcard p-4">
          {!activePack ? (
            <div className="flex h-64 items-center justify-center text-sm text-text-muted">Chọn một pack để quản lý nhãn dán.</div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-text-primary">{activePack.name}</h2>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-1.5 rounded-lg bg-neon-violet/20 px-3 py-1.5 text-sm font-medium text-neon-violet hover:bg-neon-violet/30 disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  Upload ảnh
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/webp,image/gif,image/jpeg"
                  multiple
                  className="hidden"
                  onChange={(e) => uploadFiles(e.target.files)}
                />
              </div>

              {loadingStickers ? (
                <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-text-muted" /></div>
              ) : stickers.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center gap-2 text-sm text-text-muted">
                  <Upload className="h-6 w-6" />
                  <p>Chưa có nhãn dán. Bấm "Upload ảnh" để thêm.</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
                  {stickers.map((s) => (
                    <div key={s.id} className="group relative flex aspect-square items-center justify-center rounded-lg bg-white/[0.03] p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.url} alt={s.label ?? ''} className="max-h-full max-w-full object-contain" />
                      <button
                        onClick={() => deleteSticker(s.id)}
                        className="absolute right-1 top-1 rounded bg-black/60 p-1 text-white opacity-0 transition-opacity hover:bg-red-500 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
