'use client';

/**
 * Khối điều khiển phòng thu.
 *
 * Nói thẳng với người dùng hai giới hạn thật thay vì giấu đi:
 *  1. Trình duyệt chỉ xuất được .webm — muốn .mp4 thì chuyển bằng ffmpeg.
 *  2. Vòng lặp vẽ dừng khi tab bị ẩn, nên đừng chuyển tab lúc đang quay.
 */

import { useCallback, useState } from 'react';
import { Download, Film, Loader2, Mic, MicOff, Pause, Play, Share2, Square, Trash2, Volume2, VolumeX } from 'lucide-react';
import type { Lang } from './types';
import { QUALITY_PRESETS, getQuality, type useStudioRecorder } from './useStudioRecorder';
import { tr } from './types';

interface Props {
  recorder: ReturnType<typeof useStudioRecorder>;
  lang: Lang;
  muted: boolean;
  onToggleMute: () => void;
  /** Bấm quay = tự chạy lại kịch bản từ đầu rồi tự dừng khi hết vòng. */
  autoRun: boolean;
  onToggleAutoRun: () => void;
  /** Ước lượng thời lượng một lần chạy đủ số vòng, tính bằng ms. */
  estimatedMs: number;
  /** Bắt đầu quay — do trang mẹ xử lý vì nó còn phải khởi động kịch bản. */
  onStart: () => void;
  /** Tốc độ phát hiện tại — dùng để cảnh báo khi quay ở tốc độ chậm. */
  speed: number;
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

export default function RecorderStudio({ recorder, lang, muted, onToggleMute, autoRun, onToggleAutoRun, estimatedMs, onStart, speed }: Props) {
  const vi = lang === 'vi';
  const recording = recorder.state === 'recording';
  const paused = recorder.state === 'paused';
  const live = recording || paused;
  const preset = getQuality(recorder.quality);
  // Ước lượng dung lượng = (bitrate hình + tiếng) × thời lượng, cộng ~15%
  // cho phần bộ mã hoá vượt mức ở các khung khoá đầu clip (đo thực tế trên
  // clip ngắn: 4,5 Mb/s cho ra ~40 MB/phút thay vì 34 theo lý thuyết).
  const estBytes = ((preset.videoBps + 128_000) / 8) * (estimatedMs / 1000) * 1.15;

  /* ── Chuyển sang MP4 ───────────────────────────────────────────
     Trình duyệt chỉ xuất WebM (Safari là ngoại lệ), mà WebM thì QuickTime
     không mở, iOS thường không phát, và phần lớn phần mềm dựng phim từ chối.
     Chuyển ở client là bất khả: CSP `default-src 'self'` chặn ffmpeg.wasm từ
     CDN. Nên gửi lên backend — nơi đã có sẵn ffmpeg cho đường nhạc — rồi tải
     file trả về. */
  const [converting, setConverting] = useState(false);
  const [convertError, setConvertError] = useState<string | null>(null);

  const convertToMp4 = useCallback(async () => {
    const result = recorder.result;
    if (!result || converting) return;
    setConverting(true);
    setConvertError(null);
    try {
      const base = result.filename.replace(/\.[^.]+$/, '');
      const form = new FormData();
      form.append('file', result.blob, result.filename);
      form.append('name', base);

      const res = await fetch('/api/v1/simulation/convert-mp4', {
        method: 'POST',
        body: form,
        // Cookie phiên đi kèm: route yêu cầu đăng nhập để không thành một
        // trạm chuyển mã miễn phí cho cả internet.
        credentials: 'include',
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => null);
        throw new Error(detail?.message || `HTTP ${res.status}`);
      }

      const mp4 = await res.blob();
      const url = URL.createObjectURL(mp4);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${base}.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Thu hồi trễ: Safari huỷ luôn lượt tải nếu URL bị thu hồi ngay lập tức.
      window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
    } catch (err) {
      setConvertError(
        err instanceof Error && /401|Unauthor/i.test(err.message)
          ? vi
            ? 'Cần đăng nhập để dùng chức năng chuyển đổi.'
            : 'You need to be signed in to convert.'
          : err instanceof Error
            ? err.message
            : vi
              ? 'Chuyển đổi thất bại.'
              : 'Conversion failed.'
      );
    } finally {
      setConverting(false);
    }
  }, [converting, recorder.result, vi]);

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
                onClick={onStart}
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

          {/* Chất lượng — quyết định dung lượng file */}
          {!live ? (
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#5d6d8c]">
                  {vi ? 'Chất lượng' : 'Quality'}
                </span>
                <span className="font-mono text-[10.5px] text-[#6f8098]">
                  ≈ {formatBytes(estBytes)} · {clock(estimatedMs)}
                </span>
              </div>
              <div className="flex gap-1.5">
                {QUALITY_PRESETS.map((q) => {
                  const active = recorder.quality === q.id;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => recorder.setQuality(q.id)}
                      aria-pressed={active}
                      className={`flex-1 rounded-lg border px-2 py-1.5 text-[11.5px] font-bold transition-colors ${
                        active
                          ? 'border-[#2b3f6b] bg-[#101c33] text-[#7dd3fc]'
                          : 'border-[#243050] bg-[#0a0f1e] text-[#6f8098] hover:border-[#3a4d7a]'
                      }`}
                    >
                      {tr(q.label, lang)}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-[#6f8098]">{tr(preset.note, lang)}</p>
              {/* Chọn 1080p trên điện thoại là cách chắc chắn nhất để có một
                  file hỏng: bộ mã hoá không bắt kịp, rớt khung, và phần chưa
                  mã hoá bị vứt lúc dừng. Nói thẳng trước khi họ bấm quay. */}
              {recorder.lowPower && recorder.quality === 'high' ? (
                <p className="mt-1.5 rounded-md border border-[#4a2020] bg-[#1d0c0c] p-2 text-[11px] leading-relaxed text-[#fca5a5]">
                  {vi
                    ? 'Máy này có vẻ là điện thoại hoặc máy cấu hình thấp. Mã hoá 1080p thời gian thực gần như chắc chắn không kịp: video sẽ bị rớt khung, ngắn hơn thực tế và phát nhanh bất thường. Hãy chọn 720p hoặc 540p.'
                    : 'This looks like a phone or a low-power machine. Encoding 1080p in real time will almost certainly fall behind: the video ends up with dropped frames, shorter than reality and playing too fast. Pick 720p or 540p.'}
                </p>
              ) : null}
              {/* Quay ở tốc độ chậm là cách tốn dung lượng nhất: cùng một nội
                  dung nhưng file dài gấp bội, mà bộ mã hoá vẫn tiêu đủ bitrate
                  cho từng giây. Muốn video dài thì tăng SỐ VÒNG rẻ hơn nhiều. */}
              {speed < 1 ? (
                <p className="mt-1.5 rounded-md border border-[#3f3410] bg-[#1a1503] p-2 text-[11px] leading-relaxed text-[#e2cf9a]">
                  {vi
                    ? `Đang quay ở tốc độ ${speed}× nên file dài gấp ${Math.round(1 / speed)} lần và nặng tương ứng. Muốn video dài hơn để dễ theo dõi, tăng SỐ VÒNG ở thanh điều khiển sẽ tiết kiệm hơn nhiều — vì mỗi vòng là nội dung mới chứ không phải cùng một khung hình kéo giãn.`
                    : `Recording at ${speed}× makes the file ${Math.round(1 / speed)}× longer and correspondingly heavier. If you want a longer video to follow along with, raising the LOOP COUNT in the transport bar is far cheaper — each loop is fresh content rather than the same frame stretched out.`}
                </p>
              ) : null}
            </div>
          ) : null}

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

          {/* Tự chạy kịch bản khi bấm quay — dẹp hẳn cảnh quay nhầm vài giây
              màn hình đứng yên vì quên bấm Phát. */}
          <button
            type="button"
            onClick={onToggleAutoRun}
            aria-pressed={autoRun}
            disabled={live}
            className="flex w-full items-center gap-2 rounded-lg border px-3 py-1.5 text-left text-[12px] font-semibold transition-colors disabled:opacity-50"
            style={{
              borderColor: autoRun ? '#2b3f6b' : '#243050',
              background: autoRun ? '#101c33' : '#0a0f1e',
              color: autoRun ? '#7dd3fc' : '#8496b4',
            }}
          >
            <Film className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1">{vi ? 'Tự quay trọn kịch bản' : 'Auto-record full scenario'}</span>
            <span
              className="h-3.5 w-6 shrink-0 rounded-full transition-colors"
              style={{ background: autoRun ? '#38bdf8' : '#243050' }}
            >
              <span
                className="block h-3.5 w-3.5 rounded-full bg-[#e8eefc] transition-transform"
                style={{ transform: autoRun ? 'translateX(10px)' : 'translateX(0)' }}
              />
            </span>
          </button>
          {autoRun && !live ? (
            <p className="text-[11px] leading-relaxed text-[#6f8098]">
              {vi
                ? 'Bấm quay là kịch bản tự chạy lại từ đầu và tự dừng ghi khi hết vòng — không cần bấm Phát.'
                : 'Hitting record replays the scenario from the start and stops the recording when the last loop ends — no need to press Play.'}
            </p>
          ) : null}

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

          {recorder.autoPaused ? (
            <p className="rounded-lg border border-[#3f3410] bg-[#1a1503] p-2.5 text-[11.5px] leading-relaxed text-[#e2cf9a]">
              {vi
                ? 'Đã tự tạm dừng vì bạn rời khỏi trang. Quay lại đây là ghi tiếp — video sẽ liền mạch, không có đoạn đứng hình.'
                : 'Auto-paused because you left the page. Come back and it resumes — the video stays continuous, with no frozen stretch.'}
            </p>
          ) : live ? (
            <p className="text-[11px] leading-relaxed text-[#6f8098]">
              {vi
                ? `Đang quay ${preset.width}×${preset.height}. Rời khỏi trang thì bản ghi tự tạm dừng và tự ghi tiếp khi bạn quay lại.`
                : `Recording at ${preset.width}×${preset.height}. Leaving the page auto-pauses the recording and it resumes when you return.`}
            </p>
          ) : null}

          {recorder.finalising ? (
            <p className="inline-flex items-center gap-2 rounded-lg border border-[#243050] bg-[#0d1426] p-2.5 text-[12px] text-[#93a4c4]">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {vi ? 'Đang ghi thời lượng vào file…' : 'Writing the duration into the file…'}
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
              {/* Dòng chẩn đoán: định dạng thật mà trình duyệt đã chọn + độ
                  phân giải xuất. Khi người dùng báo lỗi, đây là thông tin đầu
                  tiên cần biết — Safari đi mp4, Chrome đi webm, và cách xử lý
                  hai bên khác nhau. */}
              <p className="font-mono text-[10.5px] leading-relaxed text-[#4d5b76]">
                {recorder.result.mimeType.replace('video/', '')} · {preset.width}×{preset.height} · {preset.fps}fps
              </p>
              {/* playsInline BẮT BUỘC cho iOS: thiếu nó thì bấm phát trên
                  iPhone sẽ mở trình phát toàn màn hình của hệ thống, đá người
                  dùng ra khỏi trang. */}
              <video
                src={recorder.result.url}
                controls
                playsInline
                className="w-full rounded-md border border-[#1b2440] bg-black"
                preload="metadata"
              />

              {/* Thanh tua của trình phát chỉ đáng tin khi container có khai
                  báo thời lượng. Kiểm bằng cách nạp thật rồi đọc, chứ không
                  đoán theo định dạng. */}
              {recorder.result.probedDurationSec === null ? (
                <p className="rounded-lg border border-[#3f3410] bg-[#1a1503] p-2.5 text-[11.5px] leading-relaxed text-[#e2cf9a]">
                  {vi
                    ? `Nội dung đầy đủ ${clock(recorder.result.durationMs)}, nhưng định dạng này không ghi tổng thời lượng vào file nên thanh tua của trình phát sẽ hiện sai. Lệnh ffmpeg bên dưới vá đúng chỗ đó.`
                    : `The content is a full ${clock(recorder.result.durationMs)}, but this container does not record its total duration, so the player's timeline will read wrong. The ffmpeg command below patches exactly that.`}
                </p>
              ) : null}
              <div className="flex gap-2">
                {/* Trên iPhone (nhất là PWA) thuộc tính `download` bị bỏ qua —
                    bấm tải về không ra file nào. Bảng chia sẻ của hệ điều
                    hành là con đường duy nhất để lưu vào Files/Photos. */}
                {recorder.canShareFile ? (
                  <button
                    type="button"
                    onClick={recorder.share}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#166534] bg-[#0c2318] px-3 py-1.5 text-[12px] font-bold text-[#86efac] transition-colors hover:border-[#22c55e]"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    {vi ? 'Lưu / Chia sẻ' : 'Save / Share'}
                  </button>
                ) : null}
                {/* MP4 là thứ người dùng THỰC SỰ cần: WebM của MediaRecorder
                    không mở được bằng QuickTime, iOS hay phần lớn phần mềm
                    dựng phim. Trình duyệt không tự chuyển được (CSP chặn
                    ffmpeg.wasm từ CDN), nên gửi lên backend — nơi đã có sẵn
                    ffmpeg cho đường nhạc. */}
                <button
                  type="button"
                  onClick={convertToMp4}
                  disabled={converting}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#166534] bg-[#0c2318] px-3 py-1.5 text-[12px] font-bold text-[#86efac] transition-colors hover:border-[#22c55e] disabled:cursor-wait disabled:opacity-60"
                >
                  {converting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                  {converting ? (vi ? 'Đang chuyển…' : 'Converting…') : vi ? 'Tải .mp4' : 'Download .mp4'}
                </button>
                <button
                  type="button"
                  onClick={recorder.download}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#243050] bg-[#0d1426] px-3 py-1.5 text-[12px] font-semibold text-[#8496b4] transition-colors hover:border-[#3b4a72] hover:text-[#c3cfe4]"
                >
                  <Download className="h-3.5 w-3.5" />
                  .{recorder.result.filename.split('.').pop()}
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
              {convertError ? (
                <p className="rounded-lg border border-[#4a2020] bg-[#1d0c0c] p-2 text-[11.5px] leading-relaxed text-[#fca5a5]">
                  {convertError}
                </p>
              ) : null}
              <details className="text-[11px] text-[#6f8098]">
                <summary className="cursor-pointer select-none font-semibold text-[#7f8fab]">
                  {vi ? 'Muốn tự chuyển bằng ffmpeg?' : 'Prefer to convert it yourself?'}
                </summary>
                <p className="mt-1.5 leading-relaxed">
                  {vi
                    ? 'Nút "Tải .mp4" ở trên đã làm đúng việc này trên máy chủ rồi. Nếu muốn tự chạy để chỉnh thông số (chất lượng, độ phân giải), đây là lệnh tương đương:'
                    : 'The "Download .mp4" button above already does this on the server. If you would rather run it yourself to tweak the settings, here is the equivalent command:'}
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
