'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, Video, Trash2, Save, X, UploadCloud } from 'lucide-react';
import { coursesApi } from '@/lib/api';
import { toast } from 'sonner';

/**
 * Professional R2 video upload for a single lesson.
 *
 * Flow that avoids orphaned / duplicated R2 objects:
 *   1. Pick a file → INSTANT local preview (blob URL). Nothing is uploaded
 *      yet, so bailing out / closing the tab leaves ZERO objects on R2.
 *   2. Review the preview, then click "Lưu video" → only NOW does it PUT to
 *      R2 (progress to 100%) + register on the lesson. Replacing a video
 *      deletes the previous R2 object server-side.
 *   3. A saved video is previewed via a short signed URL and can be removed
 *      with "Xoá video", which also deletes the R2 object.
 */
export default function LessonVideoManager({
  lessonId,
  videoUrl,
  onSaved,
  onDeleted,
}: {
  lessonId?: number;
  videoUrl?: string;
  onSaved: (data: { videoUrl: string; videoDurationSeconds?: number }) => void;
  onDeleted: () => void;
}) {
  const hasSaved = Boolean(lessonId && videoUrl);

  // Pending (chosen, not yet uploaded) file.
  const [file, setFile] = useState<File | null>(null);
  const [blobUrl, setBlobUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [pct, setPct] = useState(0);

  // Saved-video signed preview.
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const blobRef = useRef<string>('');
  useEffect(() => () => { if (blobRef.current) URL.revokeObjectURL(blobRef.current); }, []);

  // Fetch a signed preview URL for the saved video (unless the admin is
  // currently reviewing a freshly-picked local file).
  useEffect(() => {
    if (!hasSaved || file) { setPreviewUrl(''); return; }
    let cancelled = false;
    setLoadingPreview(true);
    coursesApi.getLessonVideoPreview(lessonId!)
      .then((res) => { if (!cancelled) setPreviewUrl(res.data?.data?.videoUrl || ''); })
      .catch(() => { if (!cancelled) setPreviewUrl(''); })
      .finally(() => { if (!cancelled) setLoadingPreview(false); });
    return () => { cancelled = true; };
  }, [hasSaved, lessonId, videoUrl, file]);

  const probeDuration = (f: File): Promise<number> =>
    new Promise((resolve) => {
      try {
        const el = document.createElement('video');
        el.preload = 'metadata';
        const url = URL.createObjectURL(f);
        el.onloadedmetadata = () => { URL.revokeObjectURL(url); resolve(Number.isFinite(el.duration) ? el.duration : 0); };
        el.onerror = () => { URL.revokeObjectURL(url); resolve(0); };
        el.src = url;
      } catch { resolve(0); }
    });

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (!f.type.startsWith('video/')) { toast.error('Vui lòng chọn tệp video (mp4, webm, mov…)'); return; }
    if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    const url = URL.createObjectURL(f);
    blobRef.current = url;
    setBlobUrl(url);
    setFile(f);
  };

  const cancelPending = () => {
    if (blobRef.current) { URL.revokeObjectURL(blobRef.current); blobRef.current = ''; }
    setBlobUrl('');
    setFile(null);
    setPct(0);
  };

  const save = async () => {
    if (!file) return;
    if (!lessonId) { toast.error('Hãy lưu bài học trước khi tải video'); return; }
    setUploading(true);
    setPct(0);
    try {
      const duration = await probeDuration(file);
      const res = await coursesApi.uploadLessonVideoDirect(lessonId, file, (frac) => setPct(Math.round(frac * 100)), duration);
      const data = res.data?.data as { videoUrl?: string; videoDurationSeconds?: number } | undefined;
      onSaved({ videoUrl: data?.videoUrl || '', videoDurationSeconds: data?.videoDurationSeconds ?? (duration ? Math.round(duration) : undefined) });
      cancelPending();
      toast.success('Đã lưu video lên R2 (riêng tư, phát qua link ký ngắn hạn)');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Tải video thất bại');
    } finally {
      setUploading(false);
    }
  };

  const remove = async () => {
    if (!lessonId) return;
    if (!confirm('Xoá video này khỏi bài học và khỏi bộ nhớ R2?')) return;
    setDeleting(true);
    try {
      await coursesApi.deleteLessonVideo(lessonId);
      setPreviewUrl('');
      onDeleted();
      toast.success('Đã xoá video (kể cả trên R2)');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Xoá video thất bại');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-xl border border-dashed border-neon-violet/40 bg-neon-violet/5 p-3 space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-text-muted">Video R2 riêng tư (tối đa 2GB). Chọn file để xem trước — chỉ khi bấm <b>Lưu video</b> mới tải lên.</p>
        {!lessonId && <span className="text-xs text-amber-400">Lưu bài học trước để tải video.</span>}
      </div>

      {/* Pending file: local preview + Save/Cancel */}
      {file ? (
        <div className="space-y-2">
          <video src={blobUrl} controls className="w-full max-h-64 rounded-lg bg-black" />
          <p className="text-xs text-text-muted truncate">Đã chọn: {file.name} ({(file.size / (1024 * 1024)).toFixed(1)} MB) — chưa tải lên</p>
          {uploading && (
            <div className="h-1.5 w-full rounded-full bg-darkbg overflow-hidden">
              <div className="h-full bg-neon-violet transition-all" style={{ width: `${pct}%` }} />
            </div>
          )}
          <div className="flex items-center gap-2">
            <button onClick={save} disabled={uploading || !lessonId} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-neon-violet/20 text-neon-violet hover:bg-neon-violet/30 disabled:opacity-50">
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {uploading ? `Đang tải ${pct}%` : 'Lưu video'}
            </button>
            <button onClick={cancelPending} disabled={uploading} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border border-darkborder text-text-secondary hover:bg-white/5 disabled:opacity-50">
              <X className="w-3.5 h-3.5" /> Huỷ
            </button>
          </div>
        </div>
      ) : hasSaved ? (
        /* Saved video: signed preview + replace/delete */
        <div className="space-y-2">
          {loadingPreview ? (
            <div className="flex items-center gap-2 text-xs text-text-muted"><Loader2 className="w-4 h-4 animate-spin" /> Đang tải video…</div>
          ) : previewUrl ? (
            <video src={previewUrl} controls className="w-full max-h-64 rounded-lg bg-black" />
          ) : (
            <p className="text-xs text-green-400">✓ Đã có video (không tải được bản xem trước)</p>
          )}
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-neon-violet/15 text-neon-violet hover:bg-neon-violet/25 cursor-pointer">
              <Video className="w-3.5 h-3.5" /> Thay video khác
              <input type="file" accept="video/*" className="hidden" onChange={pickFile} />
            </label>
            <button onClick={remove} disabled={deleting} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-50">
              {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} Xoá video
            </button>
          </div>
        </div>
      ) : (
        /* No video yet */
        <label className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium ${lessonId ? 'bg-neon-violet/15 text-neon-violet hover:bg-neon-violet/25 cursor-pointer' : 'bg-darkbg text-text-muted cursor-not-allowed'}`}>
          <UploadCloud className="w-4 h-4" /> Chọn video…
          <input type="file" accept="video/*" className="hidden" disabled={!lessonId} onChange={pickFile} />
        </label>
      )}
    </div>
  );
}
