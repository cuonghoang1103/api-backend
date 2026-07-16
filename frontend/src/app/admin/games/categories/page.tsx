'use client';

/**
 * /admin/games/categories — CRUD with inline editing.
 *
 * Deleting a category that still has games is refused by the API (the FK is
 * ON DELETE RESTRICT) and surfaces here as a readable message rather than a 500.
 */

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Plus, Trash2, Loader2, ArrowLeft, Check, X, Tags } from 'lucide-react';
import { adminGameCategoriesApi, type GameCategoryDto } from '@/lib/api';

type Draft = { name: string; nameVi: string; icon: string; color: string; sortOrder: number };

const emptyDraft: Draft = { name: '', nameVi: '', icon: '', color: '#A78BFA', sortOrder: 0 };

export default function GameCategoriesPage() {
  const [cats, setCats] = useState<GameCategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [creating, setCreating] = useState(false);
  const [newDraft, setNewDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const r = await adminGameCategoriesApi.list();
      setCats(r.data.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không tải được chuyên mục');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (c: GameCategoryDto) => {
    setEditing(c.id);
    setDraft({
      name: c.name, nameVi: c.nameVi ?? '', icon: c.icon ?? '',
      color: c.color ?? '#A78BFA', sortOrder: c.sortOrder ?? 0,
    });
  };

  const saveEdit = async (id: number) => {
    if (!draft.name.trim()) { toast.error('Tên không được trống'); return; }
    setBusy(true);
    try {
      await adminGameCategoriesApi.update(id, {
        name: draft.name.trim(),
        nameVi: draft.nameVi.trim() || null,
        icon: draft.icon.trim() || null,
        color: draft.color.trim() || null,
        sortOrder: Number(draft.sortOrder) || 0,
      });
      toast.success('Đã lưu');
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lưu thất bại');
    } finally {
      setBusy(false);
    }
  };

  const create = async () => {
    if (!newDraft.name.trim()) { toast.error('Tên không được trống'); return; }
    setBusy(true);
    try {
      await adminGameCategoriesApi.create({
        name: newDraft.name.trim(),
        nameVi: newDraft.nameVi.trim() || null,
        icon: newDraft.icon.trim() || null,
        color: newDraft.color.trim() || null,
        sortOrder: Number(newDraft.sortOrder) || 0,
      });
      toast.success('Đã tạo chuyên mục');
      setCreating(false);
      setNewDraft(emptyDraft);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Tạo thất bại');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (c: GameCategoryDto) => {
    if (!window.confirm(`Xoá chuyên mục “${c.name}”?`)) return;
    try {
      await adminGameCategoriesApi.remove(c.id);
      toast.success('Đã xoá');
      load();
    } catch (err) {
      // e.g. CATEGORY_NOT_EMPTY — the API explains exactly what to do.
      toast.error(err instanceof Error ? err.message : 'Xoá thất bại');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/games" className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.06]" aria-label="Quay lại">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-heading font-bold text-text-primary flex items-center gap-2">
            <Tags className="w-5 h-5 text-neon-violet" /> Chuyên mục game
          </h1>
          <p className="text-xs text-text-muted mt-0.5">Màu dùng cho badge trên thẻ game ở /games.</p>
        </div>
        <button onClick={() => setCreating((v) => !v)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-semibold shadow-neon hover:opacity-90 active:scale-95">
          <Plus className="w-4 h-4" /> Thêm
        </button>
      </div>

      {creating && (
        <div className="rounded-2xl bg-darkcard/60 border border-neon-violet/30 p-4">
          <Row draft={newDraft} setDraft={setNewDraft} />
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => { setCreating(false); setNewDraft(emptyDraft); }} className="px-3 py-1.5 rounded-lg text-xs text-text-secondary hover:text-text-primary">Huỷ</button>
            <button onClick={create} disabled={busy} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-violet/20 text-neon-violet text-xs font-semibold disabled:opacity-50">
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Tạo
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-darkcard/60 border border-darkborder overflow-hidden">
        {loading ? (
          <div className="py-16 text-center"><Loader2 className="w-5 h-5 mx-auto animate-spin text-neon-violet" /></div>
        ) : cats.length === 0 ? (
          <p className="py-16 text-center text-sm text-text-muted">Chưa có chuyên mục nào.</p>
        ) : (
          <ul>
            {cats.map((c) => (
              <li key={c.id} className="px-4 py-3 border-b border-darkborder/60 last:border-0">
                {editing === c.id ? (
                  <>
                    <Row draft={draft} setDraft={setDraft} />
                    <div className="flex justify-end gap-2 mt-3">
                      <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary" aria-label="Huỷ"><X className="w-4 h-4" /></button>
                      <button onClick={() => saveEdit(c.id)} disabled={busy} className="p-1.5 rounded-lg bg-neon-violet/20 text-neon-violet disabled:opacity-50" aria-label="Lưu">
                        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full shrink-0 border border-white/10" style={{ background: c.color ?? '#666' }} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-text-primary truncate">
                        {c.name} {c.nameVi && <span className="text-text-muted font-normal">· {c.nameVi}</span>}
                      </p>
                      <p className="text-[11px] text-text-muted">
                        /{c.slug} · icon: {c.icon || '—'} · thứ tự {c.sortOrder ?? 0} · {c._count?.games ?? 0} game
                      </p>
                    </div>
                    <button onClick={() => startEdit(c)} className="px-2.5 py-1 rounded-lg text-[11px] bg-white/[0.04] text-text-secondary hover:text-text-primary">Sửa</button>
                    <button onClick={() => remove(c)} className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10" aria-label="Xoá">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Row({ draft, setDraft }: { draft: Draft; setDraft: (d: Draft) => void }) {
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft({ ...draft, [k]: v });
  const inp = 'w-full px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50';
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
      <input value={draft.name} onChange={(e) => set('name', e.target.value)} placeholder="Name (EN)" className={inp} aria-label="Tên tiếng Anh" />
      <input value={draft.nameVi} onChange={(e) => set('nameVi', e.target.value)} placeholder="Tên (VI)" className={inp} aria-label="Tên tiếng Việt" />
      <input value={draft.icon} onChange={(e) => set('icon', e.target.value)} placeholder="icon key (brain)" className={inp} aria-label="Icon key" />
      <div className="flex gap-1">
        <input type="color" value={draft.color || '#A78BFA'} onChange={(e) => set('color', e.target.value)} className="w-10 h-full rounded-lg bg-darkbg border border-darkborder cursor-pointer" aria-label="Màu" />
        <input value={draft.color} onChange={(e) => set('color', e.target.value)} placeholder="#A78BFA" className={inp} aria-label="Mã màu" />
      </div>
      <input type="number" value={draft.sortOrder} onChange={(e) => set('sortOrder', Number(e.target.value))} placeholder="0" className={inp} aria-label="Thứ tự" />
    </div>
  );
}
