'use client';

/**
 * AdminMusicPostsClient — the listing + create-form for the
 * curated Song pool at /admin/music-posts.
 *
 * The page is a server-rendered shell that mounts this client.
 * The client handles:
 *   - paginated list of all songs (active + inactive)
 *   - toggle isActive inline (no full edit sheet needed)
 *   - open the upload modal to add a new song
 *   - delete with a confirmation dialog
 *   - inline edit (re-uses the same form modal)
 *
 * Auto-save: when a song is created or deleted we refresh
 * the list (router.refresh) so the new state is server-rendered
 * and SSR + client are consistent.
 */

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Music, Trash2, Power, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { socialApi, type AdminSong } from '@/lib/api';
import { toast } from 'sonner';
import AdminMusicUploadForm from '@/components/music-posts/AdminMusicUploadForm';

export default function AdminMusicPostsClient() {
  const router = useRouter();
  const [songs, setSongs] = useState<AdminSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminSong | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await socialApi.adminListSongs();
      setSongs((res.data?.data?.items ?? []) as AdminSong[]);
    } catch (err) {
      toast.error('Khong tai duoc danh sach nhac');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = (() => {
    const q = filter.trim().toLowerCase();
    if (!q) return songs;
    return songs.filter(
      (s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q),
    );
  })();

  const toggleActive = async (song: AdminSong) => {
    setBusyId(song.id);
    try {
      await socialApi.adminToggleSongActive(song.id, !song.isActive);
      toast.success(!song.isActive ? 'Da hien nhac' : 'Da an nhac');
      await load();
    } catch (err) {
      toast.error('Khong the thay doi trang thai');
    } finally {
      setBusyId(null);
    }
  };

  const deleteSong = async (song: AdminSong) => {
    if (!window.confirm(`Xoa bai hat "${song.title}" cua ${song.artist}?`)) return;
    setBusyId(song.id);
    try {
      await socialApi.adminDeleteSong(song.id);
      toast.success('Da xoa bai hat');
      await load();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Khong the xoa bai hat (co the dang duoc su dung trong bai viet)';
      toast.error(msg);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Tim theo ten bai hat hoac nghe si..."
            className="w-full rounded-lg border border-darkborder bg-darkbg/60 py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-violet to-neon-pink px-4 py-2 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Them nhac
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="rounded-2xl border border-darkborder bg-darkcard/40 p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text-primary">
                {editing ? `Sua bai hat: ${editing.title}` : 'Them bai hat moi'}
              </h2>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditing(null); }}
                className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
                aria-label="Dong"
              >
                ×
              </button>
            </div>
            <AdminMusicUploadForm
              initial={editing ?? undefined}
              onSaved={() => { setShowForm(false); setEditing(null); void load(); }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-neon-violet/20 border-t-neon-violet" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-darkborder bg-darkcard/20 p-12 text-center">
          <Music className="mx-auto mb-2 h-8 w-8 text-text-muted/40" />
          <p className="text-sm text-text-muted">
            {filter ? 'Khong tim thay bai hat phu hop.' : 'Chua co bai hat nao.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-darkborder bg-darkcard/40">
          <table className="w-full text-sm">
            <thead className="border-b border-darkborder/60 bg-darkbg/40 text-left text-[11px] uppercase tracking-wide text-text-muted">
              <tr>
                <th className="px-4 py-2.5">Bai hat</th>
                <th className="px-4 py-2.5">Nghe si</th>
                <th className="px-4 py-2.5 text-right">Thoi luong</th>
                <th className="px-4 py-2.5 text-right">Su dung</th>
                <th className="px-4 py-2.5 text-center">Trang thai</th>
                <th className="px-4 py-2.5 text-right">Hanh dong</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-darkborder/40">
              {filtered.map((song) => {
                const isBusy = busyId === song.id;
                const minSec = song.durationSec ?? 0;
                const m = Math.floor(minSec / 60);
                const s = minSec % 60;
                return (
                  <tr key={song.id} className="text-text-primary">
                    <td className="px-4 py-2.5 font-medium">
                      <div className="flex items-center gap-2">
                        {song.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={song.coverImage} alt="" className="h-7 w-7 shrink-0 rounded object-cover" />
                        ) : (
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-gradient-to-br from-neon-violet/40 to-neon-pink/40">
                            <Music className="h-3.5 w-3.5 text-white" />
                          </div>
                        )}
                        <span className="truncate">{song.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-text-secondary">{song.artist}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-text-muted">
                      {m}:{String(s).padStart(2, '0')}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-text-muted">
                      {song._count?.postMusic ?? 0}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => toggleActive(song)}
                        disabled={isBusy}
                        className={`inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
                          song.isActive ? 'bg-neon-emerald' : 'bg-darkborder'
                        }`}
                        aria-label={song.isActive ? 'Tat nhac' : 'Bat nhac'}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            song.isActive ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => { setEditing(song); setShowForm(true); }}
                          disabled={isBusy}
                          className="rounded-lg px-2 py-1 text-xs text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
                        >
                          Sua
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSong(song)}
                          disabled={isBusy}
                          className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                          aria-label="Xoa"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
