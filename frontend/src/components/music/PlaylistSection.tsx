'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListMusic, Plus, X, Upload, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePlaylists, useCreatePlaylist, usePlaylistDetail } from '@/hooks/useMusicQueries';
import type { PlaylistSummary } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { LoginRequired } from '@/components/LoginRequired';
import { toast } from 'sonner';
import PlaylistCard from './PlaylistCard';

const C = {
  primary: '#8B5CF6',
  text: '#f8fafc',
  muted: '#94a3b8',
  border: 'rgba(139,92,246,0.15)',
};

interface PlaylistSectionProps {
  onPlaylistClick: (playlist: PlaylistSummary) => void;
}

export default function PlaylistSection({ onPlaylistClick }: PlaylistSectionProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const { data, isLoading } = usePlaylists();
  const createPlaylist = useCreatePlaylist();

  const [showForm, setShowForm] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const playlists: PlaylistSummary[] = data?.data ?? [];

  const handleCreateClick = () => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setShowForm(true);
  };

  const handleLoginClick = () => {
    setShowLoginPrompt(false);
    router.push(`/login?callbackUrl=${encodeURIComponent('/music')}`);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Chi duoc upload anh');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Anh qua lon (toi da 5MB)');
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Vui long nhap ten playlist');
      return;
    }
    setCreating(true);
    setError('');
    try {
      let coverUrl = '';
      if (coverFile) {
        const formData = new FormData();
        formData.append('file', coverFile);
        formData.append('category', 'playlist-covers');
        const res = await fetch('/api/v1/files/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        const json = await res.json() as { success: boolean; data?: { url?: string }; message?: string };
        if (json.success && json.data?.url) {
          coverUrl = json.data.url;
        } else {
          throw new Error(json.message || 'Upload failed');
        }
      }
      const result = await createPlaylist.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        coverUrl: coverUrl || undefined,
      });
      if (result.success) {
        setShowForm(false);
        setName('');
        setDescription('');
        setCoverFile(null);
        setCoverPreview('');
        toast.success('Đã tạo playlist!');
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || 'Loi tao playlist');
      // If 401 → re-prompt login
      if ((err as { response?: { status?: number } })?.response?.status === 401) {
        setShowForm(false);
        setShowLoginPrompt(true);
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ListMusic className="w-5 h-5 text-neon-violet" />
          <h2 className="text-lg font-bold text-white">Playlist</h2>
          {playlists.length > 0 && (
            <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
              {playlists.length}
            </span>
          )}
        </div>
        <button
          onClick={handleCreateClick}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neon-violet/30 border border-neon-violet/50 text-neon-violet text-xs font-semibold rounded-lg hover:bg-neon-violet/40 transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-neon-violet/20"
        >
          <Plus className="w-3.5 h-3.5 shrink-0" />
          <span className="whitespace-nowrap">Tao Playlist</span>
        </button>
      </div>

      {/* Playlist grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 text-neon-violet animate-spin" />
        </div>
      ) : playlists.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <ListMusic className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Chua co playlist nao</p>
          <p className="text-xs mt-1">Tao playlist dau tien cua ban</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {playlists.map((pl) => (
            <PlaylistCard key={pl.id} playlist={pl} onClick={onPlaylistClick} />
          ))}
        </div>
      )}

      {/* Login required modal */}
      <AnimatePresence>
        {showLoginPrompt && (
          <LoginRequired
            variant="modal"
            message="Vui lòng đăng nhập để tạo playlist. Playlist sẽ được gắn với tài khoản của bạn."
            onClose={() => setShowLoginPrompt(false)}
          />
        )}
      </AnimatePresence>

      {/* Create modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-darkcard border border-darkborder rounded-2xl p-6 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ListMusic className="w-5 h-5 text-neon-violet" />
                  Tao Playlist moi
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cover preview */}
              <div className="flex justify-center mb-4">
                <label className="relative cursor-pointer group">
                  <div
                    className="w-32 h-32 rounded-xl overflow-hidden border-2 border-dashed border-darkborder group-hover:border-neon-violet/50 transition-colors flex items-center justify-center"
                    style={{
                      background: coverPreview ? 'transparent' : 'rgba(255,255,255,0.03)',
                    }}
                  >
                    {coverPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-gray-500">
                        <Upload className="w-8 h-8" />
                        <span className="text-xs">Chon anh bia</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverChange}
                  />
                </label>
              </div>

              {/* Name */}
              <div className="mb-3">
                <label className="block text-xs text-gray-400 mb-1.5">Ten playlist *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && void handleCreate()}
                  placeholder="VD: Nhac hay cua toi"
                  maxLength={100}
                  className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-violet/60"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-xs text-gray-400 mb-1.5">Mo ta (khong bat buoc)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mo ta playlist..."
                  rows={2}
                  maxLength={500}
                  className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-violet/60 resize-none"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-xs text-red-400 mb-3">{error}</p>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2.5 border border-darkborder rounded-xl text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                >
                  Huy
                </button>
                <button
                  onClick={() => void handleCreate()}
                  disabled={creating}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Tao Playlist
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
