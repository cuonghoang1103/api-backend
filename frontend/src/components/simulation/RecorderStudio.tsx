'use client';

/**
 * Khối điều khiển phòng thu.
 *
 * Nói thẳng với người dùng hai giới hạn thật thay vì giấu đi:
 *  1. Trình duyệt chỉ xuất được .webm — muốn .mp4 thì chuyển bằng ffmpeg.
 *  2. Vòng lặp vẽ dừng khi tab bị ẩn, nên đừng chuyển tab lúc đang quay.
 */

import { Download, Mic, MicOff, Pause, Play, Square, Trash2, Volume2, VolumeX } from 'lucide-react';
import type { Lang } from './types';
import type { useStudioRecorder } from './useStudioRecorder';

interface Props {
  recorder: ReturnType<typeof useStudioRecorder>;
  lang: Lang;
  muted: boolean;
  onToggleMute: () => void;
}

function clock(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatBytes(n: number): string {
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export default function RecorderStudio({ recorder, lang, muted, onToggleMute }: Props) {
  const vi = lang === 'vi';
  const recording = recorder.state === 'recording';
  const paused = recorder.state === 'paused';
  const live = recording || paused;

  return (
    <div className="space-y-3 rounded-xl border border-[#1d2740] bg-[#0a0f1e] p-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5d6d8c]">
          {vi ? 'Phòng thu' : 'Recording studio'}
        </h2>
        {live ? (
          <span className="inline-flex items-center gap-1.5 font-mono text-[12px] font-bold text-[#f87171]">
            <span className={`h-2 w-2 rounded-full bg-[#ef4444] ${recording ? 'animate-pulse' : ''}`} />
            {clock(recorder.elapsedMs)}
          </span>
        ) : null}
      </div>

      {!recorder.supported ? (
        <p className="rounded-lg border border-[#4a2020] bg-[#1d0c0c] p-2.5 text-[12px] leading-relaxed text-[#fca5a5]">
          {vi
            ? 'Trình duyệt này không hỗ trợ MediaRecorder/WebM. Hãy dùng Chrome, Edge hoặc Firefox bản mới để quay.'
            : 'This browser does not support MediaRecorder/WebM. Use a recent Chrome, Edge or Firefox to record.'}
        </p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {!live ? (
              <button
                type="button"
                onClick={recorder.start}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#7f1d1d] bg-[#2a0d0d] px-3 py-2 text-[13px] font-bold text-[#fca5a5] transition-colors hover:border-[#ef4444] hover:text-[#fecaca]"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
                {vi ? 'Bắt đầu quay' : 'Start recording'}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={paused ? recorder.resume : recorder.pause}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#243050] bg-[#0d1426] px-3 py-2 text-[13px] font-semibold text-[#c3cfe4] transition-colors hover:border-[#3a4d7a]"
                >
                  {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                  {paused ? (vi ? 'Tiếp tục' : 'Resume') : (vi ? 'Tạm dừng' : 'Pause')}
                </button>
                <button
                  type="button"
                  onClick={recorder.stop}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#334155] bg-[#131c2e] px-3 py-2 text-[13px] font-bold text-[#e8eefc] transition-colors hover:border-[#64748b]"
                >
                  <Square className="h-3.5 w-3.5" />
                  {vi ? 'Dừng & xuất' : 'Stop & export'}
                </button>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={recorder.toggleMic}
              aria-pressed={recorder.micEnabled}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition-colors"
              style={{
                borderColor: recorder.micEnabled ? '#4ade8066' : '#243050',
                background: recorder.micEnabled ? '#0c1f16' : '#0d1426',
                color: recorder.micEnabled ? '#86efac' : '#8496b4',
              }}
            >
              {recorder.micEnabled ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
              {vi ? 'Giọng giảng' : 'Voiceover'}
            </button>
            <button
              type="button"
              onClick={onToggleMute}
              aria-pressed={!muted}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#243050] bg-[#0d1426] px-3 py-1.5 text-[12px] font-semibold text-[#8496b4] transition-colors hover:border-[#3a4d7a]"
            >
              {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              {vi ? (muted ? 'Loa tắt' : 'Loa bật') : muted ? 'Speakers off' : 'Speakers on'}
            </button>
          </div>

          {/* Tắt loa nhưng SFX vẫn vào video — nói rõ để người dạy khỏi lo. */}
          {muted && live ? (
            <p className="text-[11px] leading-relaxed text-[#6f8098]">
              {vi
                ? 'Loa đang tắt để tránh vọng vào micro — hiệu ứng âm thanh vẫn được ghi vào video.'
                : 'Speakers are off to avoid echoing into the mic — sound effects are still recorded into the video.'}
            </p>
          ) : null}

          {recorder.error ? (
            <p className="rounded-lg border border-[#4a2020] bg-[#1d0c0c] p-2.5 text-[12px] leading-relaxed text-[#fca5a5]">
              {recorder.error}
            </p>
          ) : null}

          {live ? (
            <p className="text-[11px] leading-relaxed text-[#6f8098]">
              {vi
                ? 'Đang quay khung 1920×1080 lấy thẳng từ canvas. Giữ nguyên tab này — chuyển tab sẽ làm trình duyệt tạm dừng vòng vẽ.'
                : 'Recording the 1920×1080 canvas directly. Stay on this tab — switching tabs pauses the browser\'s render loop.'}
            </p>
          ) : null}

          {recorder.result ? (
            <div className="space-y-2 rounded-lg border border-[#1e3a2e] bg-[#08160f] p-2.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-semibold text-[#86efac]">{vi ? 'Bản ghi sẵn sàng' : 'Recording ready'}</span>
                <span className="font-mono text-[11px] text-[#6f8098]">
                  {clock(recorder.result.durationMs)} · {formatBytes(recorder.result.sizeBytes)}
                </span>
              </div>
              <video
                src={recorder.result.url}
                controls
                className="w-full rounded-md border border-[#1b2440] bg-black"
                preload="metadata"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={recorder.download}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#166534] bg-[#0c2318] px-3 py-1.5 text-[12px] font-bold text-[#86efac] transition-colors hover:border-[#22c55e]"
                >
                  <Download className="h-3.5 w-3.5" />
                  {vi ? 'Tải .webm' : 'Download .webm'}
                </button>
                <button
                  type="button"
                  onClick={recorder.discard}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#243050] bg-[#0d1426] px-3 py-1.5 text-[12px] font-semibold text-[#8496b4] transition-colors hover:border-[#7f1d1d] hover:text-[#fca5a5]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {vi ? 'Bỏ' : 'Discard'}
                </button>
              </div>
              <details className="text-[11px] text-[#6f8098]">
                <summary className="cursor-pointer select-none font-semibold text-[#7f8fab]">
                  {vi ? 'Cần file .mp4?' : 'Need an .mp4?'}
                </summary>
                <p className="mt-1.5 leading-relaxed">
                  {vi
                    ? 'Trình duyệt chỉ xuất được WebM. Ngoài ra, WebM do MediaRecorder tạo ra KHÔNG ghi tổng thời lượng vào header, nên nhiều trình phát và phần mềm dựng phim không tua được. Chạy ffmpeg (có sẵn trong container backend) vừa sửa được điều đó vừa cho ra MP4:'
                    : 'Browsers only export WebM. On top of that, MediaRecorder WebM carries no duration in its header, so many players and editors cannot seek it. Running ffmpeg (already present in the backend container) fixes that and gives you MP4:'}
                </p>
                <code className="mt-1.5 block overflow-x-auto whitespace-pre rounded-md border border-[#1b2440] bg-[#070b16] p-2 font-mono text-[10.5px] leading-relaxed text-[#93c5fd]">
                  {`ffmpeg -i ${recorder.result.filename} \\\n  -c:v libx264 -crf 20 -preset slow \\\n  -c:a aac -b:a 192k \\\n  -movflags +faststart out.mp4`}
                </code>
                <p className="mt-1.5 leading-relaxed">
                  {vi
                    ? 'Chỉ cần tua được mà vẫn giữ WebM (không mã hoá lại, chạy gần như tức thì):'
                    : 'Only need it seekable while staying WebM (no re-encode, near-instant):'}
                </p>
                <code className="mt-1.5 block overflow-x-auto whitespace-pre rounded-md border border-[#1b2440] bg-[#070b16] p-2 font-mono text-[10.5px] leading-relaxed text-[#93c5fd]">
                  {`ffmpeg -i ${recorder.result.filename} -c copy fixed.webm`}
                </code>
              </details>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
