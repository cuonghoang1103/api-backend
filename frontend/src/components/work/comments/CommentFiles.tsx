'use client';

/**
 * CTW đợt 5b K-1 — tệp + VOICE NOTE trong bình luận: hiển thị (ảnh xem trước, PDF xem trong trang, tệp khác tải về),
 * trình phát voice note (độ dài, tua, tốc độ) + bản phiên âm, và phần soạn: chip bản nháp, nút ghi âm.
 *
 * Tệp không công khai: mỗi lần xem/nghe xin URL ký sẵn ngắn hạn (`/attachments/:id/url`, kiểm quyền — khách cổng chỉ
 * được tệp của bình luận PUBLIC). URL xin LÚC CẦN (bấm phát / mở xem) chứ không lúc dựng trang, vì URL của khách chỉ
 * sống 2 phút.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Download, Eye, FileText, Image as ImageIcon, Mic, Paperclip, Pause, Play, RotateCcw, Square, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import {
  MAX_FILES_PER_COMMENT, transcriptNote, VOICE_MAX_SECONDS, workCommentsApi, type CommentFile,
} from '@/lib/work-comments-api';
import { dongHo, useGhiAm } from '../../messaging/useGhiAm';
import { Dialog, formatBytes, Spinner } from '../ui';
import { wk } from '../hooks';
import { wt } from '@/components/work/i18n';

const isImage = (m: string) => /^image\/(png|jpe?g|gif|webp|avif|bmp)$/i.test(m);
const isPdf = (m: string, name: string) => m === 'application/pdf' || /\.pdf$/i.test(name);
/** App desktop chặn mọi iframe (CSP frame-src 'none') ⇒ PDF mở bằng trình xem của máy thay vì khung trong trang. */
const inDesktopApp = () => typeof navigator !== 'undefined' && /Electron/i.test(navigator.userAgent);

const clock = (ms: number) => dongHo(Math.round(ms / 1000));

// ─── Trình phát voice note ───────────────────────────────────────

export function VoiceNotePlayer({ pid, num, file, canRetry }: { pid: number; num: number; file: CommentFile; canRetry: boolean }) {
  const qc = useQueryClient();
  const v = file.voice!;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [rate, setRate] = useState(1);
  // Độ dài: tệp webm của MediaRecorder thường báo duration = Infinity ⇒ lấy số server lưu (đồng hồ lúc ghi).
  const total = v.durationMs / 1000;

  const ensureSrc = useCallback(async () => {
    if (src) return src;
    setLoading(true);
    try {
      const url = await workCommentsApi.url(pid, file.id, true);
      setSrc(url);
      return url;
    } finally {
      setLoading(false);
    }
  }, [pid, file.id, src]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (!a.paused) { a.pause(); return; }
    try {
      if (!src) {
        a.src = await ensureSrc();
        a.playbackRate = rate;
        if (pos > 0) a.currentTime = pos; // đã kéo thanh tua trước khi phát
      }
      await a.play();
    } catch (err) {
      // URL hết hạn (≥ 2–10 phút) ⇒ xin lại một lần.
      if ((err as Error)?.name === 'NotAllowedError') return;
      try {
        const fresh = await workCommentsApi.url(pid, file.id, true);
        setSrc(fresh);
        a.src = fresh;
        await a.play();
      } catch (e2) {
        toast.error(workError(e2, wt('chat.playFailed')));
      }
    }
  };

  const seek = (sec: number) => {
    const a = audioRef.current;
    setPos(sec);
    if (a && src) a.currentTime = sec;
  };

  const retry = useMutation({
    mutationFn: () => workCommentsApi.retryTranscription(pid, file.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: wk.comments(pid, num) }),
    onError: (err) => toast.error(workError(err, wt('chat.transcribeFailed'))),
  });

  const status = v.transcriptStatus;
  const note = transcriptNote(status);
  return (
    <div className="w-voice-note" data-testid="voice-note">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          className="w-btn w-btn-icon w-btn-sm w-voice-play"
          aria-label={playing ? wt('chat.pauseVoice') : wt('chat.playVoice')}
          onClick={() => void toggle()}
          disabled={loading}
        >
          {loading ? <Spinner size={12} /> : playing ? <Pause size={13} /> : <Play size={13} />}
        </button>
        <input
          type="range"
          min={0}
          max={Math.max(total, 0.1)}
          step={0.1}
          value={Math.min(pos, total)}
          onChange={(e) => seek(Number(e.target.value))}
          className="w-voice-seek min-w-0 flex-1"
          aria-label={wt('chat.seekVoice')}
          aria-valuetext={`${dongHo(pos)} of ${dongHo(total)}`}
        />
        <span className="shrink-0 font-mono text-[11.5px] tabular-nums text-[var(--w-text-2)]">{dongHo(pos)} / {clock(v.durationMs)}</span>
        <button
          type="button"
          className="w-btn w-btn-ghost w-btn-sm shrink-0 px-1.5 font-mono text-[11px]"
          aria-label={wt('chat.playbackSpeed', { r: rate })}
          onClick={() => {
            const next = rate === 1 ? 1.5 : rate === 1.5 ? 2 : 1;
            setRate(next);
            if (audioRef.current) audioRef.current.playbackRate = next;
          }}
        >
          {rate}×
        </button>
        <audio
          ref={audioRef}
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => { setPlaying(false); setPos(0); }}
          onTimeUpdate={(e) => setPos(e.currentTarget.currentTime)}
          className="hidden"
        />
      </div>
      {status === 'DONE' && v.transcript ? (
        <p className="mt-1.5 whitespace-pre-wrap text-[12.5px] leading-relaxed text-[var(--w-text-2)]" data-testid="voice-transcript">
          <span className="sr-only">{wt('chat.transcript')} </span>{v.transcript}
        </p>
      ) : note ? (
        <p className="mt-1.5 flex flex-wrap items-center gap-2 text-[12px] text-[var(--w-text-3)]" data-testid="voice-transcript-status">
          {status === 'PENDING' && <Spinner size={11} />}
          <span>{note}</span>
          {canRetry && (status === 'FAILED' || status === 'NO_KEY' || status === 'LIMIT') && (
            <button type="button" className="w-btn w-btn-ghost w-btn-sm h-6 px-1.5 text-[12px]" disabled={retry.isPending} onClick={() => retry.mutate()}>
              <RotateCcw size={11} /> {wt('chat.retry')}
            </button>
          )}
        </p>
      ) : null}
    </div>
  );
}

// ─── Tệp ─────────────────────────────────────────────────────────

function ImageThumb({ pid, file, onOpen }: { pid: number; file: CommentFile; onOpen: (url: string) => void }) {
  const q = useQuery({ queryKey: ['work', 'att-url', pid, file.id, 'inline'], queryFn: () => workCommentsApi.url(pid, file.id, true), staleTime: 60_000 });
  return (
    <button
      type="button"
      className="w-comment-thumb"
      aria-label={wt('chat.previewImage', { name: file.fileName })}
      onClick={() => q.data && onOpen(q.data)}
      disabled={!q.data}
    >
      {q.data ? <img src={q.data} alt="" loading="lazy" /> : <ImageIcon size={18} aria-hidden="true" />}
    </button>
  );
}

export function CommentAttachments({ pid, num, files, canRetry }: { pid: number; num: number; files: CommentFile[]; canRetry: (f: CommentFile) => boolean }) {
  const [preview, setPreview] = useState<{ kind: 'image' | 'pdf'; url: string; name: string } | null>(null);
  if (!files.length) return null;
  const voices = files.filter((f) => f.voice);
  const images = files.filter((f) => !f.voice && isImage(f.mime));
  const others = files.filter((f) => !f.voice && !isImage(f.mime));
  const download = async (f: CommentFile) => {
    try { window.open(await workCommentsApi.url(pid, f.id), '_blank', 'noopener'); } catch (err) { toast.error(workError(err, wt('chat.downloadFailed'))); }
  };
  const openPdf = async (f: CommentFile) => {
    try {
      const url = await workCommentsApi.url(pid, f.id, true);
      if (inDesktopApp()) window.open(url, '_blank', 'noopener');
      else setPreview({ kind: 'pdf', url, name: f.fileName });
    } catch (err) {
      toast.error(workError(err, wt('chat.openPdfFailed')));
    }
  };
  return (
    <div className="mt-2 space-y-2" data-testid="comment-files">
      {voices.map((f) => <VoiceNotePlayer key={f.id} pid={pid} num={num} file={f} canRetry={canRetry(f)} />)}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((f) => <ImageThumb key={f.id} pid={pid} file={f} onOpen={(url) => setPreview({ kind: 'image', url, name: f.fileName })} />)}
        </div>
      )}
      {others.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label={wt('chat.files')}>
          {others.map((f) => (
            <li key={f.id} className="w-file-chip">
              <FileText size={13} className="shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />
              <span className="min-w-0 truncate" title={f.fileName}>{f.fileName}</span>
              <span className="shrink-0 text-[11px] text-[var(--w-text-3)]">{formatBytes(f.size)}</span>
              {isPdf(f.mime, f.fileName) && (
                <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm h-6 w-6" aria-label={wt('chat.previewX', { name: f.fileName })} onClick={() => void openPdf(f)}><Eye size={12} /></button>
              )}
              <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm h-6 w-6" aria-label={wt('chat.downloadX', { name: f.fileName })} onClick={() => void download(f)}><Download size={12} /></button>
            </li>
          ))}
        </ul>
      )}
      <Dialog open={!!preview} onClose={() => setPreview(null)} width={preview?.kind === 'pdf' ? 960 : 880} title={<span className="block max-w-[60vw] truncate">{preview?.name}</span>}>
        {preview?.kind === 'image' && <img src={preview.url} alt={preview.name} className="mx-auto max-h-[70vh] max-w-full rounded-[6px]" />}
        {preview?.kind === 'pdf' && <iframe src={preview.url} title={wt('chat.pdfPreview', { name: preview.name })} className="h-[72vh] w-full rounded-[6px] border border-[var(--w-border)]" />}
      </Dialog>
    </div>
  );
}

// ─── Soạn: bản nháp + ghi âm ─────────────────────────────────────

export interface Draft { key: string; name: string; pct: number; voiceMs?: number; file?: CommentFile; error?: string }

/** Bản nháp của ô bình luận: tải lên ngay khi chọn/thả/ghi xong; gửi bình luận thì gắn theo id. */
export function useCommentDrafts(pid: number, num: number) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const patch = (key: string, p: Partial<Draft>) => setDrafts((ds) => ds.map((d) => (d.key === key ? { ...d, ...p } : d)));
  const room = () => MAX_FILES_PER_COMMENT - drafts.filter((d) => !d.error).length;

  const addFiles = (list: FileList | File[]) => {
    const files = Array.from(list).slice(0, Math.max(0, room()));
    if (Array.from(list).length > files.length) toast.error(wt('chat.maxFilesComment', { n: MAX_FILES_PER_COMMENT }));
    for (const f of files) {
      const key = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setDrafts((ds) => [...ds, { key, name: f.name, pct: 0 }]);
      workCommentsApi.uploadFile(pid, num, f, (pct) => patch(key, { pct }))
        .then((file) => patch(key, { file, pct: 100 }))
        .catch((err) => { patch(key, { error: workError(err, wt('chat.uploadFailed')) }); toast.error(workError(err, wt('chat.uploadX', { name: f.name }))); });
    }
  };
  const addVoice = (f: File, ms: number) => {
    if (room() <= 0) { toast.error(wt('chat.maxFilesComment', { n: MAX_FILES_PER_COMMENT })); return; }
    const key = `v${Date.now()}`;
    setDrafts((ds) => [...ds, { key, name: wt('chat.voiceNote'), pct: 0, voiceMs: ms }]);
    workCommentsApi.uploadVoice(pid, num, f, ms)
      .then((file) => patch(key, { file, pct: 100 }))
      .catch((err) => { patch(key, { error: workError(err, wt('chat.uploadFailed')) }); toast.error(workError(err, wt('chat.voiceFailed'))); });
  };
  const remove = (key: string) => {
    const d = drafts.find((x) => x.key === key);
    setDrafts((ds) => ds.filter((x) => x.key !== key));
    if (d?.file) void workCommentsApi.discardDraft(pid, d.file.id).catch(() => {});
  };
  const ids = drafts.filter((d) => d.file && !d.error).map((d) => d.file!.id);
  const uploading = drafts.some((d) => !d.file && !d.error);
  return { drafts, addFiles, addVoice, remove, ids, uploading, clear: () => setDrafts([]) };
}

export function DraftChips({ drafts, onRemove }: { drafts: Draft[]; onRemove: (key: string) => void }) {
  if (!drafts.length) return null;
  return (
    <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={wt('chat.filesToSend')} data-testid="comment-drafts">
      {drafts.map((d) => (
        <li key={d.key} className={cn('w-file-chip', d.error && 'w-file-chip-error')}>
          {d.voiceMs !== undefined ? <Mic size={13} className="shrink-0 text-[var(--w-accent-text)]" aria-hidden="true" /> : <Paperclip size={13} className="shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />}
          <span className="min-w-0 truncate">{d.voiceMs !== undefined ? `${wt('chat.voiceNote')} · ${clock(d.voiceMs)}` : d.name}</span>
          {d.error ? <span className="shrink-0 text-[11px] text-[var(--w-red-text)]">{wt('chat.failed')}</span>
            : !d.file ? <span className="shrink-0 text-[11px] tabular-nums text-[var(--w-text-3)]" aria-live="polite">{d.pct}%</span> : null}
          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm h-5 w-5" aria-label={wt('chat.removeX', { name: d.voiceMs !== undefined ? wt('chat.voiceNote') : d.name })} onClick={() => onRemove(d.key)}><X size={11} /></button>
        </li>
      ))}
    </ul>
  );
}

const MIC_ERROR: Record<string, string> = {
  get 'khong-ho-tro'() { return wt('chat.micUnsupported'); },
  get 'bi-tu-choi'() { return wt('chat.micBlocked'); },
  get 'khong-co-micro'() { return wt('chat.micNone'); },
  get khac() { return wt('chat.micFailed'); },
};

/**
 * Nút ghi âm của ô bình luận — dùng lại `useGhiAm` (định dạng theo máy: webm/opus ↔ Safari mp4, dọn micro đúng lúc),
 * trần 3 phút: chạm trần thì tự dừng và đưa vào bản nháp.
 */
export function VoiceRecorder({ onRecorded, onActive, disabled }: { onRecorded: (f: File, ms: number) => void; onActive?: (on: boolean) => void; disabled?: boolean }) {
  const rec = useGhiAm({ giayToiDa: VOICE_MAX_SECONDS });
  const t0 = useRef(0);
  const stopping = useRef(false);

  useEffect(() => {
    if (rec.trangThai === 'dang-ghi' && !t0.current) t0.current = performance.now();
    onActive?.(rec.trangThai !== 'roi');
  }, [rec.trangThai, onActive]);
  useEffect(() => {
    if (rec.maLoi) toast.error(MIC_ERROR[rec.maLoi] ?? MIC_ERROR.khac);
  }, [rec.maLoi]);

  const stop = useCallback(async () => {
    if (stopping.current) return;
    stopping.current = true;
    const ms = t0.current ? Math.min(performance.now() - t0.current, VOICE_MAX_SECONDS * 1000) : rec.giay * 1000;
    const f = await rec.ketThuc();
    t0.current = 0;
    stopping.current = false;
    if (f) onRecorded(f, Math.max(ms, rec.giay * 1000, 500));
    else toast.info(wt('chat.tooShort'));
  }, [rec, onRecorded]);

  // Chạm trần 3 phút ⇒ máy ghi đã tự dừng; gom tệp ngay.
  useEffect(() => {
    if (rec.trangThai === 'dang-ghi' && rec.giay >= VOICE_MAX_SECONDS) void stop();
  }, [rec.trangThai, rec.giay, stop]);

  if (rec.trangThai === 'roi') {
    return (
      <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('chat.recordVoice')} title={wt('chat.recordUpTo', { m: VOICE_MAX_SECONDS / 60 })} disabled={disabled} onClick={() => { t0.current = 0; void rec.batDau(); }} data-testid="voice-record">
        <Mic size={14} />
      </button>
    );
  }
  return (
    <div className="w-recording" role="group" aria-label={wt('chat.recording')} data-testid="voice-recording">
      <span className="w-rec-dot" aria-hidden="true" />
      <span className="font-mono text-[12px] tabular-nums" aria-live="off">{dongHo(rec.giay)} / {dongHo(VOICE_MAX_SECONDS)}</span>
      {rec.trangThai === 'dang-xu-ly' ? <Spinner size={12} /> : (
        <>
          <button type="button" className="w-btn w-btn-primary w-btn-sm h-6 px-2" onClick={() => void stop()} data-testid="voice-stop"><Square size={10} /> {wt('chat.stopRec')}</button>
          <button type="button" className="w-btn w-btn-ghost w-btn-sm h-6 px-2" onClick={() => { t0.current = 0; rec.huy(); }}>{wt('common.cancel')}</button>
        </>
      )}
    </div>
  );
}
