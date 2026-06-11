'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Music, Plus, Search, Trash2, Edit, X,
  Loader2, ImageIcon, CheckCircle2, Headphones, Youtube
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { fileApi } from '@/lib/api';
import { useTranslation } from '@/hooks/useTranslation';

function debug(...args: unknown[]) {
  console.log('[AdminMusic]', ...args);
}

// Magic bytes for audio formats (in hex)
const AUDIO_MAGIC: { sig: number[]; mime: string }[] = [
  { sig: [0xFF, 0xFB], mime: 'audio/mpeg' },
  { sig: [0xFF, 0xFA], mime: 'audio/mpeg' },
  { sig: [0xFF, 0xF3], mime: 'audio/mpeg' },
  { sig: [0xFF, 0xF2], mime: 'audio/mpeg' },
  { sig: [0x49, 0x44, 0x33], mime: 'audio/mpeg' },
  { sig: [0x4F, 0x67, 0x67, 0x53], mime: 'audio/ogg' },
  { sig: [0x52, 0x49, 0x46, 0x46], mime: 'audio/wav' },
  { sig: [0x66, 0x4C, 0x61, 0x43], mime: 'audio/flac' },
  { sig: [0x4D, 0x54, 0x72, 0x61], mime: 'audio/mp4' },
];

function detectAudioMimeType(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer.slice(0, 16));
  for (const { sig, mime } of AUDIO_MAGIC) {
    if (sig.every((b, i) => bytes[i] === b)) return mime;
  }
  return 'audio/mpeg';
}

interface Track {
  id: number;
  title: string;
  artist: string;
  audioUrl: string;
  coverImage?: string;
  durationSeconds?: number;
  fileSize?: number;
  active?: boolean;
  createdAt?: string;
  localPath?: string;
}

interface YouTubeSearchResult {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  videoId: string;
  duration?: string;
}

function formatDuration(seconds?: number): string {
  if (!seconds) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatSize(bytes?: number): string {
  if (!bytes) return '-';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// All music API calls go through the /api/v1/* proxy which handles auth cookies
const API_BASE = '/api/v1/music';

/**
 * Unified fetch wrapper for all admin music API calls.
 * Uses the frontend Next.js proxy at /api/v1/music/* which reads
 * the backend_token httpOnly cookie and forwards it to the backend.
 */
async function apiFetch(path: string, options: RequestInit = {}): Promise<any> {
  const headers = new Headers(options.headers as Record<string, string>);

  if (!(options.body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  } else {
    // FormData sets its own Content-Type with boundary; don't override
    headers.delete('Content-Type');
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  const contentType = res.headers.get('content-type') || '';
  let errData: any;

  if (!res.ok) {
    if (contentType.includes('application/json')) {
      errData = await res.json().catch(() => null);
    }
    const msg = errData?.message || `HTTP ${res.status}`;
    throw Object.assign(new Error(msg), { status: res.status, data: errData });
  }

  if (contentType.includes('application/json')) {
    return res.json();
  }
  return { success: true };
}

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80';

function TrackCoverImage({ track, className }: { track: { coverImage?: string; title: string }; className?: string }) {
  const [imgError, setImgError] = useState(false);
  const src = !imgError && track.coverImage ? track.coverImage : DEFAULT_COVER;
  return (
    <Image
      src={src}
      alt={track.title}
      fill
      className={className}
      onError={() => setImgError(true)}
      unoptimized={src.startsWith('http')}
    />
  );
}

export default function AdminMusicPage() {
  const { t } = useTranslation();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // YouTube search state
  const [showYouTubeSearch, setShowYouTubeSearch] = useState(false);
  const [youTubeQuery, setYouTubeQuery] = useState('');
  const [youTubeResults, setYouTubeResults] = useState<YouTubeSearchResult[]>([]);
  const [youTubeSearching, setYouTubeSearching] = useState(false);
  const [youTubeError, setYouTubeError] = useState('');

  // YouTube URL import state
  const [showYouTubeUrlImport, setShowYouTubeUrlImport] = useState(false);
  const [youTubeUrl, setYouTubeUrl] = useState('');
  const [youTubeImporting, setYouTubeImporting] = useState(false);
  const [youTubeImportError, setYouTubeImportError] = useState('');
  const [youTubeImportSuccess, setYouTubeImportSuccess] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch tracks list — goes through the proxy so auth cookie is forwarded
  const fetchTracks = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/admin/tracks');
      debug('fetchTracks OK, count:', data.data?.length);
      setTracks(data.data || []);
    } catch (err: any) {
      console.error('[AdminMusic] fetchTracks error:', err);
      toast.error('Khong the tai danh sach nhac: ' + (err?.message || String(err)));
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTracks(); }, []);

  const filtered = tracks.filter((t) =>
    !search ||
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.artist.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setTitle('');
    setArtist('');
    setCoverImage('');
    setAudioUrl('');
    setDurationSeconds(0);
    setAudioFile(null);
    setCoverFile(null);
    setAudioPreviewUrl('');
    setIsActive(true);
    if (audioInputRef.current) audioInputRef.current.value = '';
    if (coverInputRef.current) coverInputRef.current.value = '';
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    setUploadProgress(0);
  };

  const openCreate = (initial?: { title?: string; artist?: string; coverImage?: string; audioUrl?: string; durationSeconds?: number }) => {
    debug('openCreate', initial);
    resetForm();
    if (initial) {
      if (initial.title) setTitle(initial.title);
      if (initial.artist) setArtist(initial.artist);
      if (initial.coverImage) setCoverImage(initial.coverImage);
      if (initial.audioUrl) setAudioUrl(initial.audioUrl);
      if (initial.durationSeconds) setDurationSeconds(initial.durationSeconds);
    }
    setEditingId(null);
    setShowForm(true);
    setShowYouTubeSearch(false);
  };

  const openEdit = (track: Track) => {
    debug('openEdit', { trackId: track.id, title: track.title });
    setTitle(track.title);
    setArtist(track.artist);
    setCoverImage(track.coverImage || '');
    setAudioUrl(track.audioUrl || track.localPath || '');
    setDurationSeconds(track.durationSeconds || 0);
    setIsActive(track.active !== false);
    setAudioFile(null);
    setCoverFile(null);
    // Show audio preview for existing tracks (even without new file)
    const audioSrc = track.audioUrl || (track.localPath ? '/uploads/' + track.localPath.replace(/^\/+/, '') : '');
    setAudioPreviewUrl(audioSrc);
    if (audioInputRef.current) audioInputRef.current.value = '';
    if (coverInputRef.current) coverInputRef.current.value = '';
    setEditingId(track.id);
    setShowForm(true);
    setShowYouTubeSearch(false);
  };

  const handleAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const buffer = await file.slice(0, 16).arrayBuffer();
    const realMime = detectAudioMimeType(buffer);
    debug('handleAudioChange', { file: file.name, detected: realMime });

    const correctedFile = new File([file], file.name, { type: realMime });
    setAudioFile(correctedFile);
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    const blobUrl = URL.createObjectURL(file);
    setAudioPreviewUrl(blobUrl);

    const audio = new Audio(blobUrl);
    audio.addEventListener('loadedmetadata', () => {
      setDurationSeconds(Math.floor(audio.duration));
    });
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    if (coverImage && !coverImage.startsWith('http') && !coverImage.startsWith('blob:')) {
      setCoverImage('');
    }
    const blobUrl = URL.createObjectURL(file);
    setCoverImage(blobUrl);
  };

  // YouTube search
  const handleYouTubeSearch = async () => {
    if (!youTubeQuery.trim()) return;
    setYouTubeSearching(true);
    setYouTubeError('');
    setYouTubeResults([]);
    try {
      const res = await apiFetch(`/admin/youtube-search?q=${encodeURIComponent(youTubeQuery.trim())}`);
      if (res.success && Array.isArray(res.data)) {
        setYouTubeResults(res.data);
        if (res.data.length === 0) {
          setYouTubeError('Khong tim thay ket qua nao');
        }
      } else {
        setYouTubeError(res.message || 'Loi tim kiem YouTube');
      }
    } catch (err: any) {
      setYouTubeError(err?.message || 'Loi tim kiem YouTube');
    } finally {
      setYouTubeSearching(false);
    }
  };

  const handleSelectYouTube = (result: YouTubeSearchResult) => {
    setYouTubeQuery('');
    setYouTubeResults([]);
    setShowYouTubeSearch(false);
    openCreate({
      title: result.title,
      artist: result.artist,
      coverImage: result.thumbnail,
      audioUrl: `https://www.youtube.com/watch?v=${result.videoId}`,
      durationSeconds: result.duration ? parseYTDuration(result.duration) : 0,
    });
  };

  // YouTube URL import handler
  const handleYouTubeUrlImport = async () => {
    if (!youTubeUrl.trim()) {
      setYouTubeImportError('Vui long nhap link YouTube');
      return;
    }
    setYouTubeImporting(true);
    setYouTubeImportError('');
    setYouTubeImportSuccess('');
    try {
      const res = await apiFetch('/admin/youtube-import', {
        method: 'POST',
        body: JSON.stringify({ url: youTubeUrl.trim() }),
      });
      if (res.success) {
        setYouTubeImportSuccess(`Da them "${res.data?.title}" thanh cong!`);
        setYouTubeUrl('');
        fetchTracks();
        setTimeout(() => {
          setShowYouTubeUrlImport(false);
          setYouTubeImportSuccess('');
        }, 2000);
      } else {
        setYouTubeImportError(res.message || 'Loi them tu YouTube');
      }
    } catch (err: any) {
      setYouTubeImportError(err?.message || 'Loi them tu YouTube');
    } finally {
      setYouTubeImporting(false);
    }
  };

  // Save handler — handles both create and edit
  const handleSave = async () => {
    if (!title.trim() || !artist.trim()) {
      toast.error('Vui long dien day du thong tin');
      return;
    }

    if (!editingId && !audioFile) {
      toast.error('Vui long tai len file nhac');
      return;
    }

    setSaving(true);
    setUploading(true);
    setUploadProgress(0);

    try {
      if (editingId) {
        // === EDIT EXISTING TRACK ===
        let coverImageValue: string | undefined;

        if (coverFile) {
          setUploadProgress(30);
          const coverRes = await fileApi.upload(coverFile, 'images');
          coverImageValue = coverRes.data?.data?.url;
          if (!coverImageValue) {
            toast.warning('Upload anh bia that bai — giu anh hien tai');
          }
          setUploadProgress(70);
        } else if (coverImage && !coverImage.startsWith('blob:')) {
          coverImageValue = coverImage;
        }

        const body: Record<string, unknown> = {
          title: title.trim(),
          artist: artist.trim(),
          durationSeconds,
          active: isActive,
        };
        if (coverImageValue) body.coverImage = coverImageValue;

        setUploadProgress(90);
        await apiFetch(`/tracks/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        });

        toast.success('Cap nhat thanh cong');
      } else {
        // === CREATE NEW TRACK ===
        // Build FormData and send through the proxy
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('artist', artist.trim());
        formData.append('durationSeconds', String(durationSeconds || 0));

        // Add audio file (correct MIME type already set in handleAudioChange)
        if (audioFile) {
          formData.append('audio', audioFile);
        }

        // Add cover image
        if (coverFile) {
          formData.append('cover', coverFile);
        }

        setUploadProgress(50);

        // Use the apiFetch wrapper — it goes through /api/v1/music/ proxy
        const response = await apiFetch('/tracks', {
          method: 'POST',
          body: formData,
        });

        setUploadProgress(100);

        if (!response?.success) {
          throw new Error(response?.message || 'Tao track that bai');
        }

        toast.success('Tao track thanh cong!');
      }

      setShowForm(false);
      resetForm();
      fetchTracks();
    } catch (err: any) {
      const msg = err?.message || 'Luu that bai';
      console.error('[AdminMusic] handleSave error:', msg, err);
      toast.error(msg);
    } finally {
      setSaving(false);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Delete handler
  const handleDelete = async (id: number) => {
    if (!confirm('Ban co chac muon xoa track nay?')) return;
    try {
      await apiFetch('/tracks/' + id, { method: 'DELETE' });
      toast.success('Xoa thanh cong');
      fetchTracks();
    } catch (err: any) {
      toast.error(err?.message || 'Xoa that bai');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary flex items-center gap-3">
            <Headphones className="w-6 h-6 text-neon-violet" />
            Quan ly Nhac
          </h1>
          <p className="text-text-muted text-sm mt-1">{tracks.length} tracks</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowYouTubeSearch(!showYouTubeSearch);
              setShowForm(false);
            }}
            className="flex items-center gap-2 px-4 py-2.5 border border-red-500/30 text-red-400 font-medium rounded-xl hover:bg-red-500/10 transition-colors"
          >
            <Youtube className="w-4 h-4" />
            Tim YouTube
          </button>
          <button
            onClick={() => {
              setShowYouTubeUrlImport(!showYouTubeUrlImport);
              setShowForm(false);
            }}
            className="flex items-center gap-2 px-4 py-2.5 border border-red-500/30 text-red-400 font-medium rounded-xl hover:bg-red-500/10 transition-colors"
          >
            <Youtube className="w-4 h-4" />
            Tai YouTube URL
          </button>
          <button
            onClick={() => openCreate()}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Them Track
          </button>
        </div>
      </div>

      {/* YouTube Search Panel */}
      {showYouTubeSearch && (
        <div className="mb-6 bg-darkcard border border-red-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Youtube className="w-5 h-5 text-red-400" />
            <h3 className="font-semibold text-text-primary">Tim kiem YouTube</h3>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={youTubeQuery}
              onChange={(e) => setYouTubeQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void handleYouTubeSearch()}
              placeholder="VD: Chopin Nocturne, Beethoven Symphony..."
              className="flex-1 px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-500/50"
            />
            <button
              onClick={() => void handleYouTubeSearch()}
              disabled={youTubeSearching || !youTubeQuery.trim()}
              className="px-5 py-2.5 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {youTubeSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Tim kiem
            </button>
          </div>
          {youTubeError && (
            <p className="mt-2 text-sm text-red-400">{youTubeError}</p>
          )}
          {youTubeResults.length > 0 && (
            <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
              {youTubeResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={() => handleSelectYouTube(result)}
                >
                  <div className="relative w-14 h-10 rounded overflow-hidden flex-shrink-0">
                    <img src={result.thumbnail} alt={result.title} className="w-full h-full object-cover" />
                    {result.duration && (
                      <span className="absolute bottom-1 right-1 text-[10px] bg-black/70 text-white px-1 rounded">
                        {result.duration}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{result.title}</p>
                    <p className="text-xs text-text-muted truncate">{result.artist}</p>
                  </div>
                  <Plus className="w-4 h-4 text-neon-violet flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* YouTube URL Import Panel */}
      {showYouTubeUrlImport && (
        <div className="mb-6 bg-darkcard border border-red-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Youtube className="w-5 h-5 text-red-400" />
            <h3 className="font-semibold text-text-primary">Tai tu YouTube URL</h3>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={youTubeUrl}
              onChange={(e) => {
                setYouTubeUrl(e.target.value);
                setYouTubeImportError('');
                setYouTubeImportSuccess('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && void handleYouTubeUrlImport()}
              placeholder="Dán link YouTube: https://www.youtube.com/watch?v=..."
              className="flex-1 px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-500/50"
            />
            <button
              onClick={() => void handleYouTubeUrlImport()}
              disabled={youTubeImporting || !youTubeUrl.trim()}
              className="px-5 py-2.5 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {youTubeImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Youtube className="w-4 h-4" />}
              Tai vao he thong
            </button>
          </div>
          {youTubeImportError && (
            <p className="mt-2 text-sm text-red-400">{youTubeImportError}</p>
          )}
          {youTubeImportSuccess && (
            <p className="mt-2 text-sm text-green-400">{youTubeImportSuccess}</p>
          )}
          <p className="mt-2 text-xs text-text-muted">
            Dán link video YouTube (VD: youtube.com/watch?v=abc123) de tai truc tiep vao he thong. Anh bia se duoc lay tu YouTube.
          </p>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tim kiem theo ten hoac artist..."
          className="w-full pl-9 pr-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
        />
      </div>

      {/* Table */}
      <div className="bg-darkcard border border-darkborder rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-darkborder">
                <th className="text-left px-4 py-3 text-text-muted font-medium">Track</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium hidden md:table-cell">Artist</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium hidden sm:table-cell">Thoi luong</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium hidden lg:table-cell">Kich thuoc</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium hidden xl:table-cell">Trang thai</th>
                <th className="text-right px-4 py-3 text-text-muted font-medium">Hanh dong</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-neon-violet mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-text-muted">
                    {search ? 'Khong tim thay track nao' : 'Chua co track nao'}
                  </td>
                </tr>
              ) : (
                filtered.map((track) => (
                  <tr key={track.id} className="border-b border-darkborder/50 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-darkbg">
                          <TrackCoverImage track={track} className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-text-primary truncate max-w-[200px]">{track.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-text-secondary">{track.artist}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-text-muted text-xs">
                        {track.durationSeconds ? formatDuration(track.durationSeconds) : '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-text-muted text-xs">{formatSize(track.fileSize)}</span>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      {track.active === false ? (
                        <span className="text-xs px-2 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20">
                          Da xoa
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Hoat dong
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(track)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-neon-violet hover:bg-neon-violet/10 transition-colors"
                          title="Chinh sua"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(track.id)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Xoa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowForm(false); }} />
          <form
            className="relative w-full max-w-lg max-h-[90vh] bg-darkcard border border-darkborder rounded-2xl shadow-2xl overflow-y-auto"
            onSubmit={(e) => { e.preventDefault(); void handleSave(); }}
          >
            <div className="sticky top-0 bg-darkcard border-b border-darkborder px-6 py-4 flex items-center justify-between z-10">
              <h2 className="font-heading font-bold text-text-primary">
                {editingId ? 'Chinh sua Track' : 'Them Track moi'}
              </h2>
              <button type="button" onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Audio File */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">
                  File nhac <span className="text-red-400">*</span>
                  {!editingId && <span className="text-text-muted/50 ml-1">(bat buoc)</span>}
                </label>
                <audio ref={audioRef} className="hidden" />
                <label className={`flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                  audioFile || audioUrl
                    ? 'border-neon-violet/50 bg-neon-violet/5'
                    : 'border-darkborder hover:border-neon-violet/40 bg-white/[0.02]'
                }`}>
                  <div className="flex flex-col items-center justify-center pt-3 pb-3">
                    {audioFile ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-neon-violet mb-1" />
                        <span className="text-sm text-neon-violet font-medium">{audioFile.name}</span>
                        <span className="text-xs text-text-muted mt-0.5">{(audioFile.size / 1024 / 1024).toFixed(1)} MB</span>
                      </>
                    ) : audioUrl ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-neon-emerald mb-1" />
                        <span className="text-sm text-neon-emerald font-medium">Da co file</span>
                        {editingId && <span className="text-xs text-text-muted mt-0.5">Tai file khac de thay the</span>}
                      </>
                    ) : (
                      <>
                        <Music className="w-6 h-6 text-text-muted mb-1" />
                        <span className="text-sm text-text-muted">Drop MP3 here hoac click de chon</span>
                      </>
                    )}
                  </div>
                  <input ref={audioInputRef} type="file" accept="audio/*" onChange={handleAudioChange} className="hidden" />
                </label>
                {audioUrl && audioUrl.includes('youtube.com') && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <Youtube className="w-3 h-3" />
                    Day la link YouTube — khong can upload file
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">Tieu de <span className="text-red-400">*</span></label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Midnight Code"
                  className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50" />
              </div>

              {/* Artist */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">Artist <span className="text-red-400">*</span></label>
                <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)}
                  placeholder="VD: LoFi Beats"
                  className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50" />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">Anh bia</label>
                <div className="flex gap-3">
                  <label className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl border-2 border-dashed cursor-pointer transition-colors shrink-0 ${
                    coverImage ? 'border-neon-violet/50 bg-neon-violet/5' : 'border-darkborder hover:border-neon-violet/40 bg-white/[0.02]'
                  }`}>
                    {coverImage ? (
                      <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-text-muted" />
                    )}
                    <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                  </label>
                  <div className="flex-1">
                    <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="Hoac paste URL..."
                      className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50" />
                    <p className="text-xs text-text-muted/60 mt-1.5">Upload anh hoac paste URL</p>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">Thoi luong (giay)</label>
                <input type="number" value={durationSeconds} onChange={(e) => setDurationSeconds(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50" />
                <p className="text-xs text-text-muted mt-1">Tu dong tinh khi chon file nhac</p>
              </div>

              {/* Active toggle — only shown when editing */}
              {editingId && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isActive ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-red-500/20 border border-red-500/30'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isActive ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {isActive ? 'Hoat dong' : 'Da vo hieu hoa'}
                    </p>
                    <p className="text-xs text-text-muted">
                      {isActive ? 'Hien thi tren trang nhac' : 'Bi an khoi trang nhac'}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 text-sm text-text-muted hover:text-text-primary transition-colors"
                  disabled={saving}>
                  Huy
                </button>
                <button
                  type="submit"
                  disabled={saving || (!editingId && !audioFile)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {(saving || uploading) && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving
                    ? uploading
                      ? `Dang upload ${uploadProgress > 0 ? uploadProgress + '%' : '...'}`
                      : 'Dang luu...'
                    : 'Luu'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// Parse YouTube duration format "PT4M13S" → seconds
function parseYTDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const h = parseInt(match[1] || '0', 10);
  const m = parseInt(match[2] || '0', 10);
  const s = parseInt(match[3] || '0', 10);
  return h * 3600 + m * 60 + s;
}
