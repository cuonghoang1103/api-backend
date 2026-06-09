'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, ImageIcon, Music, Loader2, CheckCircle2 } from 'lucide-react';
import { useMusicStore } from '@/store/musicStore';
import type { Track } from '@/types';

interface UploadTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ============================================================
// Blob persistence strategy:
// 1. When user picks an MP3 file, we immediately read it as base64
//    and save to localStorage under key "music-audio-blobs".
// 2. We also create a temporary blob: URL for preview playback.
// 3. On form submit, we pass the File object to the store's addTrack.
// 4. On page reload, the store hydrates from localStorage, then
//    restoreBlobs() re-creates blob: URLs from the stored base64 data.
// 5. Tracks that can't be restored are marked broken.
// ============================================================

const BLOB_STORAGE_KEY = 'music-audio-blobs-v2';
const MAX_BLOB_SIZE_MB = 8;

function saveBlobToStorage(trackId: string, file: File): Promise<void> {
  return new Promise((resolve) => {
    if (file.size > MAX_BLOB_SIZE_MB * 1024 * 1024) {
      resolve(); // Skip large files silently
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        const stored = JSON.parse(localStorage.getItem(BLOB_STORAGE_KEY) || '{}');
        stored[trackId] = {
          data: reader.result,
          type: file.type,
          name: file.name,
        };
        localStorage.setItem(BLOB_STORAGE_KEY, JSON.stringify(stored));
      } catch {
        // localStorage quota exceeded — ignore
      }
      resolve();
    };
    reader.readAsDataURL(file);
  });
}

export default function UploadTrackModal({ isOpen, onClose }: UploadTrackModalProps) {
  const { addTrack } = useMusicStore();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
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
      setAudioPreviewUrl('');
      setIsUploading(false);
      setUploadSuccess(false);
      setDuration('');
    }
  }, [isOpen]);

  // Read audio duration from the blob URL
  const getAudioDuration = useCallback((url: string): Promise<string> => {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.addEventListener('loadedmetadata', () => {
        const m = Math.floor(audio.duration / 60);
        const s = Math.floor(audio.duration % 60);
        resolve(`${m}:${s.toString().padStart(2, '0')}`);
      });
      audio.addEventListener('error', () => resolve('0:00'));
      setTimeout(() => resolve('0:00'), 5000);
    });
  }, []);

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioFile(file);
    // Revoke previous blob URL if any
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    const blobUrl = URL.createObjectURL(file);
    setAudioPreviewUrl(blobUrl);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const url = URL.createObjectURL(file);
    setCoverUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim() || !audioFile) return;

    setIsUploading(true);

    // Determine duration
    let dur = duration;
    if (!dur && audioPreviewUrl) {
      dur = await getAudioDuration(audioPreviewUrl);
      setDuration(dur);
    }
    if (!dur) dur = '0:00';

    const trackId = `local-${Date.now()}`;

    // Save blob to localStorage BEFORE adding to store.
    // If we close before this completes, the track would be added but
    // the blob wouldn't be in storage — leading to a broken track on reload.
    await saveBlobToStorage(trackId, audioFile);

    const newTrack: Track = {
      id: trackId,
      title: title.trim(),
      artist: artist.trim(),
      duration: dur,
      audioUrl: audioPreviewUrl,
      coverImage: coverUrl || '',
    };

    addTrack(newTrack);
    setUploadSuccess(true);

    // Auto-close after brief success feedback
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(false);
      onClose();
    }, 800);
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
              <div className="bg-darkcard rounded-2xl border border-darkborder shadow-2xl w-full max-w-lg pointer-events-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-darkborder">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-neon-indigo to-neon-violet rounded-xl flex items-center justify-center">
                      <Upload className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-text-primary">Upload New Track</h2>
                      <p className="text-xs text-text-muted">Add a track to your playlist</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
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
                            <span className="text-sm text-neon-violet font-medium">{audioFile.name}</span>
                            <span className="text-xs text-text-muted mt-0.5">
                              {(audioFile.size / 1024 / 1024).toFixed(1)} MB
                            </span>
                          </>
                        ) : (
                          <>
                            <Music className="w-6 h-6 text-text-muted mb-1" />
                            <span className="text-sm text-text-muted">Drop MP3 here or click to browse</span>
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
                      className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-neon-violet/50 transition-colors"
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
                      className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-neon-violet/50 transition-colors"
                    />
                  </div>

                  {/* Cover Image */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Cover Image
                    </label>
                    <div className="flex gap-3">
                      <label
                        className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl border-2 border-dashed cursor-pointer transition-colors shrink-0 ${
                          coverUrl
                            ? 'border-neon-violet/50 bg-neon-violet/5'
                            : 'border-darkborder hover:border-neon-violet/40 bg-white/[0.02]'
                        }`}
                      >
                        {coverUrl ? (
                          <img src={coverUrl} alt="Cover preview" className="w-full h-full object-cover rounded-lg" />
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
                          className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-neon-violet/50 transition-colors h-10"
                        />
                        <p className="text-xs text-text-muted/60 mt-1.5">
                          Upload an image or paste a URL
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 text-sm text-text-muted hover:text-text-primary transition-colors"
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
                          Saving...
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
