'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, ImageIcon, Music, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useMusicStore } from '@/store/musicStore';
import { useAddToQueue, useInvalidateTracks } from '@/hooks/useMusicQueries';
import { toast } from 'sonner';
import type { Track } from '@/types';

interface UploadTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ============================================================
// R2 upload strategy (Phase 1 — replaces the localStorage
// blob approach).
//
// The previous implementation saved audio to localStorage under
// `music-audio-blobs-v2`. That had two killer problems:
//   1. localStorage caps at ~5–10 MB per origin — a 5-minute MP3
//      blows past it instantly.
//   2. The blob was tied to the browser/device. A track uploaded
//      on desktop couldn't play on phone, and a cache clear
//      orphaned every uploaded track.
//
// New flow:
//   1. User picks file → we POST it (as multipart/form-data) to
//      /api/v1/music/tracks, the same R2-backed endpoint already
//      used by the rest of the app (see src/routes/music.routes.ts).
//      The frontend never reads the file as base64 — the browser
//      streams it as binary, so large files don't hit any
//      client-side memory cap.
//   2. The backend runs Sharp + optional FFmpeg loudnorm and
//      stores the audio under audio/songs/<ts>-<rand>.<ext>.
//      The DB row holds only the R2 key (localPath) + metadata.
//   3. We add the new track to the store so the user sees it
//      immediately.
//   4. We also "play next" the uploaded track so the user gets
//      instant feedback.
//
// IMPORTANT: if R2 credentials are missing/misconfigured in the
// local dev env, the backend returns 500 — we surface that error
// in the modal instead of silently failing.
// ============================================================

const MAX_FILE_SIZE_MB = 200; // Match backend multer cap (music.routes.ts)

function getAudioDuration(url: string): Promise<string> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.src = url;
    audio.onloadedmetadata = () => {
      const m = Math.floor(audio.duration / 60);
      const s = Math.floor(audio.duration % 60);
      URL.revokeObjectURL(url);
      resolve(`${m}:${s.toString().padStart(2, '0')}`);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      resolve('0:00');
    };
    setTimeout(() => {
      URL.revokeObjectURL(url);
      resolve('0:00');
    }, 8000);
  });
}

export default function UploadTrackModal({ isOpen, onClose }: UploadTrackModalProps) {
  const { addTrack } = useMusicStore();
  const addToQueueApi = useAddToQueue();
  const invalidateTracks = useInvalidateTracks();

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState('');
  const [coverPreviewUrl, setCoverPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [duration, setDuration] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  // Reset form whenever modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setArtist('');
      setCoverUrl('');
      setAudioFile(null);
      setCoverFile(null);
      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
      setAudioPreviewUrl('');
      setCoverPreviewUrl('');
      setIsUploading(false);
      setUploadSuccess(false);
      setUploadError('');
      setDuration('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`File too large. Max ${MAX_FILE_SIZE_MB} MB.`);
      e.target.value = '';
      return;
    }
    setAudioFile(file);
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    const blobUrl = URL.createObjectURL(file);
    setAudioPreviewUrl(blobUrl);
    getAudioDuration(blobUrl).then(setDuration);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    const url = URL.createObjectURL(file);
    setCoverPreviewUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim() || !audioFile) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('artist', artist.trim());
      formData.append('audio', audioFile);
      if (coverFile) formData.append('cover', coverFile);

      // POST to the existing R2-backed endpoint.
      const res = await fetch('/api/v1/music/tracks', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
        throw new Error(errBody?.message || `Upload failed (${res.status})`);
      }
      const json = await res.json();
      const raw = json?.data;
      if (!raw || typeof raw.id === 'undefined') {
        throw new Error('Server returned no track data');
      }

      // Build a Track with the URL the rest of the app understands.
      // We leave audioUrl empty and store the R2 key in `localPath`;
      // the audio controller + the global resolver
      // (lib/utils.ts#getMediaUrl) pick it up at play time.
      const newTrack: Track = {
        id: String(raw.id),
        title: raw.title || title.trim(),
        artist: raw.artist || artist.trim(),
        duration: raw.durationSeconds
          ? `${Math.floor(raw.durationSeconds / 60)}:${(raw.durationSeconds % 60).toString().padStart(2, '0')}`
          : duration || '0:00',
        durationSeconds: raw.durationSeconds || undefined,
        audioUrl: '',
        coverImage: raw.coverImage || coverUrl || '',
        localPath: raw.localPath || undefined,
      };

      // Add to store + invalidate the tracks query so a refetch
      // would also pick it up. (Adding to store is instant UX;
      // the invalidate is for cross-tab consistency.)
      addTrack(newTrack);
      invalidateTracks();

      // Auto-enqueue so the user can hear the upload immediately.
      const numericId = Number(newTrack.id);
      if (Number.isFinite(numericId) && numericId > 0) {
        addToQueueApi.mutate({ trackId: numericId, intent: 'next' });
      }

      setUploadSuccess(true);
      toast.success(`Uploaded "${newTrack.title}" — playing next`);

      // Auto-close after a brief success indicator
      setTimeout(() => {
        setIsUploading(false);
        setUploadSuccess(false);
        onClose();
      }, 800);
    } catch (err: any) {
      const msg = err?.message || 'Upload failed';
      setUploadError(msg);
      toast.error(msg);
      setIsUploading(false);
    }
  };

  const isValid = title.trim() && artist.trim() && audioFile;

  return (
    <>
      <audio ref={audioRef} className="hidden" />
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-darkcard rounded-2xl border border-darkborder shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-darkborder">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-neon-indigo to-neon-violet rounded-xl flex items-center justify-center">
                      <Upload className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-text-primary">Upload New Track</h2>
                      <p className="text-xs text-text-muted">R2-backed audio (up to {MAX_FILE_SIZE_MB} MB)</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                  {/* Audio File */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Audio File <span className="text-red-400">*</span>
                    </label>
                    <label
                      className={`flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                        audioFile
                          ? 'border-neon-violet/50 bg-neon-violet/5'
                          : 'border-darkborder hover:border-neon-violet/40 bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center pt-3 pb-3">
                        {audioFile ? (
                          <>
                            <CheckCircle2 className="w-6 h-6 text-neon-violet mb-1" />
                            <span className="text-sm text-neon-violet font-medium truncate max-w-[90%]">{audioFile.name}</span>
                            <span className="text-xs text-text-muted mt-0.5">
                              {(audioFile.size / 1024 / 1024).toFixed(1)} MB
                              {duration ? ` · ${duration}` : ''}
                            </span>
                          </>
                        ) : (
                          <>
                            <Music className="w-6 h-6 text-text-muted mb-1" />
                            <span className="text-sm text-text-muted">Drop MP3 here or click to browse</span>
                            <span className="text-[10px] text-text-muted/60 mt-0.5">
                              MP3, WAV, FLAC, AAC, OGG, M4A
                            </span>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Track title"
                      // Mobile: 16px prevents iOS zoom-on-focus.
                      className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-base sm:text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-neon-violet/50 transition-colors"
                    />
                  </div>

                  {/* Artist */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Artist <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                      placeholder="Artist name"
                      className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-base sm:text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-neon-violet/50 transition-colors"
                    />
                  </div>

                  {/* Cover Image */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Cover Image
                    </label>
                    <div className="flex gap-3">
                      <label
                        className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl border-2 border-dashed cursor-pointer transition-colors shrink-0 overflow-hidden ${
                          coverPreviewUrl
                            ? 'border-neon-violet/50 bg-neon-violet/5'
                            : 'border-darkborder hover:border-neon-violet/40 bg-white/[0.02]'
                        }`}
                      >
                        {coverPreviewUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={coverPreviewUrl} alt="Cover preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-text-muted" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverChange}
                          className="hidden"
                        />
                      </label>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={coverUrl}
                          onChange={(e) => setCoverUrl(e.target.value)}
                          placeholder="Or paste image URL..."
                          className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-base sm:text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-neon-violet/50 transition-colors h-10"
                        />
                        <p className="text-xs text-text-muted/60 mt-1.5">
                          Upload an image or paste a URL
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Error banner */}
                  {uploadError && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-300">{uploadError}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isUploading}
                      className="px-4 py-2.5 text-sm text-text-muted hover:text-text-primary transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!isValid || isUploading}
                      className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl text-white transition-all ${
                        isValid && !isUploading
                          ? 'bg-gradient-to-r from-neon-indigo to-neon-violet hover:opacity-90 shadow-lg shadow-neon-violet/20'
                          : 'bg-darkborder text-text-muted cursor-not-allowed'
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {uploadSuccess ? 'Done!' : 'Uploading...'}
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Upload Track
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}