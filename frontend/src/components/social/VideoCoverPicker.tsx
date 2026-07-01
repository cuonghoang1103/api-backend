'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Check, Film, Loader2 } from 'lucide-react';

interface VideoCoverPickerProps {
  videoUrl: string;
  serverThumbnail?: string | null;
  currentThumbnail?: string | null;
  onSelect: (thumbnailUrl: string) => void;
  itemId: string;
}

const NUM_FRAMES = 8;

/**
 * TikTok-style video cover picker.
 *
 * Renders a horizontal strip of thumbnail frames extracted from the video
 * at evenly-spaced timestamps. The selected frame is used as the video poster.
 *
 * - Uses canvas + video element for client-side extraction (no extra upload)
 * - Shows "Auto (server thumbnail)" as the default selected option
 * - Updates the parent via onSelect(thumbnailUrl) — parent stores it in composerMedia
 */
export default function VideoCoverPicker({
  videoUrl,
  serverThumbnail,
  currentThumbnail,
  onSelect,
  itemId,
}: VideoCoverPickerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frames, setFrames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [expanded, setExpanded] = useState(false);

  // Determine which thumbnail is initially selected
  const initialSelection = currentThumbnail || serverThumbnail || null;

  const extractFrames = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas size for thumbnails — 120x68 (16:9-ish, fits in strip)
    canvas.width = 120;
    canvas.height = 68;

    const timestamps: number[] = [];
    for (let i = 0; i < NUM_FRAMES; i++) {
      timestamps.push((duration * i) / NUM_FRAMES);
    }

    const extracted: string[] = [];

    for (const ts of timestamps) {
      // eslint-disable-next-line no-await-in-loop
      const dataUrl = await seekAndCapture(video, ctx, ts);
      extracted.push(dataUrl);
    }

    setFrames(extracted);
    setLoading(false);
  }, [duration]);

  function seekAndCapture(
    video: HTMLVideoElement,
    ctx: CanvasRenderingContext2D,
    targetTime: number,
  ): Promise<string> {
    return new Promise((resolve) => {
      const onSeeked = () => {
        video.removeEventListener('seeked', onSeeked);
        ctx.drawImage(video, 0, 0, ctx.canvas.width, ctx.canvas.height);
        resolve(ctx.canvas.toDataURL('image/jpeg', 0.7));
      };

      video.addEventListener('seeked', onSeeked, { once: true });
      video.currentTime = Math.min(targetTime, video.duration - 0.1);
    });
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    return () => video.removeEventListener('loadedmetadata', onLoadedMetadata);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      extractFrames();
    }
  }, [duration, extractFrames]);

  // Sync initial selection
  useEffect(() => {
    if (initialSelection) {
      setSelected(initialSelection);
    }
  }, [initialSelection]);

  const handleSelect = (frame: string, index: number) => {
    setSelected(frame);
    onSelect(frame);
  };

  const handleAutoSelect = () => {
    if (serverThumbnail) {
      setSelected(serverThumbnail);
      onSelect(serverThumbnail);
    }
  };

  return (
    <div className="mt-2">
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mb-2 flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs transition-colors"
        style={{
          background: 'rgba(99,102,241,0.15)',
          color: '#818cf8',
          border: '1px solid rgba(99,102,241,0.25)',
        }}
      >
        <Film size={12} />
        {expanded ? 'Thu gọn bìa' : 'Chọn ảnh bìa video'}
        {selected && (
          <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-neon-indigo">
            <Check size={8} className="text-white" />
          </span>
        )}
      </button>

      {/* Hidden video + canvas for extraction */}
      <video
        ref={videoRef}
        src={videoUrl}
        crossOrigin="anonymous"
        preload="auto"
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Frame strip */}
      {expanded && (
        <div
          className="overflow-x-auto rounded-xl p-2"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Auto (server thumbnail) option */}
          {serverThumbnail && (
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs text-text-muted">Mặc định:</span>
              <button
                type="button"
                onClick={handleAutoSelect}
                className="relative overflow-hidden rounded-lg transition-all"
                style={{
                  width: 60,
                  height: 34,
                  border:
                    selected === serverThumbnail
                      ? '2px solid #6366f1'
                      : '2px solid transparent',
                  opacity: selected === serverThumbnail ? 1 : 0.6,
                }}
              >
                <img
                  src={serverThumbnail}
                  alt="Auto thumbnail"
                  className="h-full w-full object-cover"
                />
                {selected === serverThumbnail && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </button>
              <span className="text-xs text-text-muted">Tự động</span>
            </div>
          )}

          {/* Divider */}
          {serverThumbnail && frames.length > 0 && (
            <div className="mb-2 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          )}

          {/* Frame thumbnails */}
          <div className="flex gap-1.5">
            {loading ? (
              <div className="flex items-center gap-2 py-2">
                <Loader2 size={14} className="animate-spin text-text-muted" />
                <span className="text-xs text-text-muted">Đang trích xuất khung hình...</span>
              </div>
            ) : (
              frames.map((frame, i) => {
                const timestamp = duration > 0 ? (duration * i) / NUM_FRAMES : 0;
                const isSelected = selected === frame;
                return (
                  <button
                    key={`${itemId}-frame-${i}`}
                    type="button"
                    onClick={() => handleSelect(frame, i)}
                    title={`${Math.floor(timestamp)}s`}
                    className="relative shrink-0 overflow-hidden rounded-lg transition-all"
                    style={{
                      width: 60,
                      height: 34,
                      border: isSelected ? '2px solid #6366f1' : '2px solid transparent',
                      opacity: isSelected ? 1 : 0.55,
                    }}
                  >
                    <img
                      src={frame}
                      alt={`Frame at ${Math.floor(timestamp)}s`}
                      className="h-full w-full object-cover"
                      style={{ imageRendering: 'auto' }}
                    />
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Check size={10} className="text-white" />
                      </div>
                    )}
                    <span
                      className="absolute bottom-0.5 right-0.5 rounded px-1 py-0.5 text-xs leading-none"
                      style={{
                        background: 'rgba(0,0,0,0.65)',
                        color: '#e2e8f0',
                        fontSize: 9,
                      }}
                    >
                      {Math.floor(timestamp)}s
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
