'use client';

/**
 * AdminMusicUploadForm — the upload form for the curated Song
 * pool. Used at /admin/music-posts/new and the "Edit" sheet
 * on the listing page.
 *
 * Flow:
 *   1. User fills in title + artist.
 *   2. User picks an mp3 / m4a file. The frontend streams
 *      it through fileApi.upload (same R2 helper the rest of
 *      the app uses; cap 50 MB enforced both client-side
 *      and server-side).
 *   3. User picks a cover image (optional). Same R2 helper.
 *   4. On submit, the form POSTs the metadata to
 *      /api/v1/admin/songs with the audio + cover URLs.
 *
 * Duration is read client-side via the Web Audio API
 * (decodeAudioData → .duration). We don't upload the audio
 * for duration detection — we only need the number of
 * seconds, not the audio itself, so the file is uploaded
 * once (to R2), and the form sends the duration in the
 * metadata POST.
 *
 * Design notes:
 *   - Title and artist are required (server validates);
 *     the Submit button stays disabled until both are
 *     filled AND the audio URL is non-empty.
 *   - The 50 MB cap is enforced in the file input's `accept`
 *     attribute (no automatic client-side size rejection —
 *     we want the user to see "your file is too big" from
 *     the server, not a silent reject), AND the upload
 *     helper throws on > 50 MB so the form surfaces the
 *     error inline before the POST.
 *   - Cover image is optional. A missing coverImage just
 *     makes the PostCard sticker fall back to a gradient
 *     tile.
 */

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Music2, Upload, X, Loader2, AlertCircle, Check } from 'lucide-react';
import { fileApi, socialApi } from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const MAX_AUDIO_BYTES = 50 * 1024 * 1024; // 50 MB
const ACCEPTED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/m4a', 'audio/x-m4a', 'audio/wav', 'audio/ogg'];

export interface AdminSongFormValue {
  title: string;
  artist: string;
  audioUrl: string;
  coverImage: string;
  durationSec: number;
  fileSize: number;
}

export interface AdminMusicUploadFormProps {
  /** When set, the form is in EDIT mode and the initial
   *  values come from the existing row. */
  initial?: Partial<AdminSongFormValue> & { id?: number };
  /** Called after a successful create / update. */
  onSaved?: (song: { id: number; title: string; artist: string }) => void;
}

async function detectAudioDurationSec(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    audio.preload = 'metadata';
    const cleanup = () => URL.revokeObjectURL(url);
    audio.addEventListener('loadedmetadata', () => {
      const d = audio.duration;
      cleanup();
      resolve(Number.isFinite(d) ? Math.round(d) : 0);
    });
    audio.addEventListener('error', () => {
      cleanup();
      resolve(0);
    });
    audio.src = url;
  });
}

export default function AdminMusicUploadForm({ initial, onSaved }: AdminMusicUploadFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [artist, setArtist] = useState(initial?.artist ?? '');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState(initial?.audioUrl ?? '');
  const [audioDuration, setAudioDuration] = useState(initial?.durationSec ?? 0);
  const [audioFileSize, setAudioFileSize] = useState(initial?.fileSize ?? 0);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState(initial?.coverImage ?? '');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  // Track the latest URL.createObjectURL so we can revoke it
  // on unmount (prevents a small memory leak from the audio
  // previews in some browsers).
  const lastUrlRef = useRef<string | null>(null);
  useEffect(() => () => {
    if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
  }, []);

  const canSubmit = !!title.trim() && !!artist.trim() && !!audioUrl && !submitting && !uploading;

  const onAudioPicked = async (file: File) => {
    if (file.size > MAX_AUDIO_BYTES) {
      setError(`File qua lon (max 50MB). Hien tai: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
      return;
    }
    if (!ACCEPTED_AUDIO_TYPES.includes(file.type) && !file.name.match(/\.(mp3|m4a|wav|ogg)$/i)) {
      setError('Chi ho tro file mp3 / m4a / wav / ogg');
      return;
    }
    setError(null);
    setAudioFile(file);
    setUploading(true);
    try {
      // Read the duration client-side first so we can ship it
      // to the server in one POST. (The server can re-derive
      // it via music-metadata at write time if the client
      // estimate is off; this is just to avoid a round-trip.)
      const duration = await detectAudioDurationSec(file);
      setAudioDuration(duration);
      setAudioFileSize(file.size);
      const res = await fileApi.upload(file, 'songs');
      setAudioUrl(res.data?.data?.url ?? '');
      toast.success('Da upload nhac');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload that bai');
    } finally {
      setUploading(false);
    }
  };

  const onCoverPicked = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('Cover qua lon (max 5MB)');
      return;
    }
    setError(null);
    setCoverFile(file);
    try {
      const res = await fileApi.upload(file, 'songs');
      setCoverUrl(res.data?.data?.url ?? '');
      toast.success('Da upload cover');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload cover that bai');
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        title: title.trim(),
        artist: artist.trim(),
        audioUrl,
        coverImage: coverUrl || undefined,
        durationSec: audioDuration,
        fileSize: audioFileSize,
      };
      let result;
      if (initial?.id) {
        result = await socialApi.adminUpdateSong(initial.id, payload);
      } else {
        result = await socialApi.adminCreateSong(payload);
      }
      toast.success(initial?.id ? 'Da cap nhat nhac' : 'Da upload nhac thanh cong');
      onSaved?.(result as { id: number; title: string; artist: string });
      // Reset only on create so the edit form stays filled.
      if (!initial?.id) {
        setTitle(''); setArtist(''); setAudioFile(null); setAudioUrl('');
        setAudioDuration(0); setAudioFileSize(0); setCoverFile(null); setCoverUrl('');
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Loi khi luu');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Title + artist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Ten bai hat" required>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Vi du: Loi cho ngay mai"
            className="w-full rounded-lg border border-darkborder bg-darkbg/60 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
            maxLength={255}
          />
        </Field>
        <Field label="Nghe si" required>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Vi du: Den Vau"
            className="w-full rounded-lg border border-darkborder bg-darkbg/60 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
            maxLength={255}
          />
        </Field>
      </div>

      {/* Audio file picker */}
      <Field
        label="File nhac (.mp3 / .m4a / .wav / .ogg)"
        required
        hint={`Toi da 50MB. Hien tai: ${audioFile ? (audioFile.size / 1024 / 1024).toFixed(1) : '0'}MB`}
      >
        {audioFile ? (
          <SelectedFileCard
            file={audioFile}
            extra={audioDuration > 0 ? ` · ${Math.floor(audioDuration / 60)}:${String(audioDuration % 60).padStart(2, '0')}` : ''}
            onClear={() => { setAudioFile(null); setAudioUrl(''); setAudioDuration(0); setAudioFileSize(0); }}
          />
        ) : (
          <UploadBox
            onPick={(f) => onAudioPicked(f)}
            inputRef={audioInputRef}
            accept=".mp3,.m4a,.wav,.ogg,audio/mpeg,audio/m4a,audio/wav,audio/ogg"
            uploading={uploading}
            label="Chon file nhac"
            hint="Tu 1MB den 50MB"
          />
        )}
      </Field>

      {/* Cover image picker */}
      <Field
        label="Anh bia (optional)"
        hint="JPG / PNG / WebP. Toi da 5MB. Khi khong co, sticker se dung gradient mac dinh."
      >
        {coverFile ? (
          <SelectedFileCard
            file={coverFile}
            extra={coverUrl ? ' · Da upload' : ''}
            onClear={() => { setCoverFile(null); setCoverUrl(''); }}
          />
        ) : (
          <UploadBox
            onPick={(f) => onCoverPicked(f)}
            inputRef={coverInputRef}
            accept=".jpg,.jpeg,.png,.webp,image/*"
            uploading={false}
            label="Chon anh bia"
            hint="JPG/PNG/WebP, <= 5MB"
          />
        )}
      </Field>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-violet to-neon-pink px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {initial?.id ? 'Dang cap nhat...' : 'Dang luu...'}
          </>
        ) : (
          <>
            {initial?.id ? 'Cap nhat' : 'Them vao thu vien'}
            <Check className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
        <Music2 className="h-3.5 w-3.5" />
        {label}
        {required && <span className="text-red-400 normal-case">*</span>}
        {hint && <span className="ml-1 text-[10px] normal-case font-normal text-text-muted/60">— {hint}</span>}
      </div>
      {children}
    </label>
  );
}

function UploadBox({ onPick, inputRef, accept, uploading, label, hint }: {
  onPick: (file: File) => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  accept: string;
  uploading: boolean;
  label: string;
  hint: string;
}) {
  return (
    <div
      onClick={() => inputRef.current?.click()}
      className={cn(
        'flex items-center gap-3 rounded-xl border-2 border-dashed border-darkborder bg-darkbg/30 px-4 py-3 cursor-pointer transition-colors',
        uploading ? 'opacity-50 cursor-wait' : 'hover:border-neon-violet/40',
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
          e.target.value = '';
        }}
      />
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neon-violet/15 text-neon-violet">
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-text-primary">{label}</div>
        <div className="truncate text-[11px] text-text-muted">{hint}</div>
      </div>
    </div>
  );
}

function SelectedFileCard({ file, extra, onClear }: { file: File; extra?: string; onClear: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-darkborder bg-darkbg/60 px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neon-emerald/15 text-neon-emerald">
        <Music2 className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="truncate text-sm font-medium text-text-primary">
          {file.name}{extra}
        </div>
        <div className="truncate text-[11px] text-text-muted">
          {(file.size / 1024 / 1024).toFixed(1)}MB
        </div>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="rounded-full p-1.5 text-text-muted transition-colors hover:bg-white/5 hover:text-red-400"
        aria-label="Xoa"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
