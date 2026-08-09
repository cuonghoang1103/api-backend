'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Loader2, Star, Youtube } from 'lucide-react';
import LessonVideoManager from './LessonVideoManager';
import { toast } from 'sonner';

/**
 * The three parallel recordings of one lesson — VN, EN and a curated YouTube
 * lecture — plus which one the learn page opens on.
 *
 * VN / EN are the instructor's own videos: either a YouTube link (EMBED) or a
 * private R2 upload (DIRECT, played through a short-lived signed URL). YT is
 * always someone else's YouTube video, so it carries a credit line; the
 * "Kiểm tra" button resolves it through YouTube's public oEmbed endpoint,
 * which both proves the video still exists and fills the credit in for you.
 */
export type VideoTrackKey = 'VI' | 'EN' | 'YT';

export interface VideoTracksValue {
  videoUrlVi: string;
  videoPlatformVi: string;
  videoUrlEn: string;
  videoPlatformEn: string;
  videoUrlYt: string;
  videoYtCredit: string;
  defaultVideoTrack: VideoTrackKey;
}

export const emptyVideoTracks: VideoTracksValue = {
  videoUrlVi: '',
  videoPlatformVi: 'EMBED',
  videoUrlEn: '',
  videoPlatformEn: 'EMBED',
  videoUrlYt: '',
  videoYtCredit: '',
  defaultVideoTrack: 'YT',
};

const TRACKS: Array<{ key: VideoTrackKey; badge: string; title: string; blurb: string }> = [
  { key: 'VI', badge: 'VN', title: 'Bài giảng tiếng Việt', blurb: 'Video bạn tự quay. Dán link YouTube, hoặc chọn Direct để tải file lên R2.' },
  { key: 'EN', badge: 'EN', title: 'Bài giảng tiếng Anh', blurb: 'Bản tiếng Anh của cùng bài học.' },
  { key: 'YT', badge: 'YT', title: 'Video tuyển chọn trên YouTube', blurb: 'Video của người khác, dùng tạm khi chưa quay. Luôn ghi nguồn.' },
];

/** youtu.be/ID · watch?v=ID · /embed/ID · /shorts/ID → ID */
export function youtubeIdFrom(raw: string): string | null {
  if (!raw) return null;
  const s = raw.trim();
  const m =
    s.match(/[?&]v=([A-Za-z0-9_-]{11})/) ||
    s.match(/youtu\.be\/([A-Za-z0-9_-]{11})/) ||
    s.match(/\/embed\/([A-Za-z0-9_-]{11})/) ||
    s.match(/\/shorts\/([A-Za-z0-9_-]{11})/);
  if (m?.[1]) return m[1];
  return /^[A-Za-z0-9_-]{11}$/.test(s) ? s : null;
}

export default function LessonVideoTracks({
  lessonId,
  value,
  onChange,
}: {
  lessonId?: number;
  value: VideoTracksValue;
  onChange: (patch: Partial<VideoTracksValue>) => void;
}) {
  const [checking, setChecking] = useState(false);

  const urlOf = (k: VideoTrackKey) => (k === 'VI' ? value.videoUrlVi : k === 'EN' ? value.videoUrlEn : value.videoUrlYt);
  const platformOf = (k: VideoTrackKey) => (k === 'VI' ? value.videoPlatformVi : value.videoPlatformEn);

  // Ask YouTube whether the video is real, and take its title + channel as
  // the credit line. A dead / private / region-blocked id returns non-200,
  // which is exactly the link rot we want to catch before it reaches a learner.
  const checkYouTube = async () => {
    const id = youtubeIdFrom(value.videoUrlYt);
    if (!id) { toast.error('Không nhận ra ID video YouTube trong link này'); return; }
    setChecking(true);
    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`);
      if (!res.ok) { toast.error(`Video không tồn tại hoặc bị chặn nhúng (HTTP ${res.status})`); return; }
      const data = (await res.json()) as { title?: string; author_name?: string };
      const credit = [data.author_name, data.title].filter(Boolean).join(' — ');
      onChange({ videoUrlYt: `https://youtu.be/${id}`, videoYtCredit: credit || value.videoYtCredit });
      toast.success(`Video hợp lệ: ${credit}`);
    } catch {
      toast.error('Không kiểm tra được (mạng hoặc CORS)');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="rounded-xl border border-darkborder bg-darkbg/40 p-4 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm font-medium text-text-secondary">Video bài học — 3 phiên bản</p>
        <p className="text-xs text-text-muted">Học viên thấy nút <b>VN / EN / YT</b>; phiên bản chưa có sẽ hiện &ldquo;sắp có&rdquo;.</p>
      </div>

      {TRACKS.map((t) => {
        const url = urlOf(t.key);
        const isDefault = value.defaultVideoTrack === t.key;
        return (
          <div
            key={t.key}
            className={`rounded-lg border p-3 space-y-2.5 transition-colors ${
              isDefault ? 'border-neon-violet/50 bg-neon-violet/5' : 'border-darkborder bg-darkcard/50'
            }`}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-md text-xs font-bold tracking-wide ${
                url ? 'bg-neon-violet/20 text-neon-violet' : 'bg-darkbg text-text-muted'
              }`}>
                {t.badge}
              </span>
              <span className="text-sm text-text-primary">{t.title}</span>
              {url
                ? <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-label="đã có video" />
                : <Circle className="w-4 h-4 text-text-muted/50" aria-label="chưa có video" />}
              <button
                type="button"
                onClick={() => onChange({ defaultVideoTrack: t.key })}
                title="Đặt làm video mặc định khi mở bài"
                className={`ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  isDefault
                    ? 'bg-neon-violet/20 text-neon-violet'
                    : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${isDefault ? 'fill-current' : ''}`} />
                {isDefault ? 'Mặc định' : 'Đặt mặc định'}
              </button>
            </div>

            <p className="text-xs text-text-muted">{t.blurb}</p>

            <div className={`grid gap-2 ${t.key === 'YT' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
              {t.key !== 'YT' && (
                <select
                  value={platformOf(t.key)}
                  onChange={(e) => onChange(t.key === 'VI' ? { videoPlatformVi: e.target.value } : { videoPlatformEn: e.target.value })}
                  className="px-3 py-2.5 rounded-lg bg-darkbg border border-darkborder text-sm text-text-primary cursor-pointer"
                >
                  <option value="EMBED">YouTube / Embed</option>
                  <option value="DIRECT">Direct (tải file lên R2)</option>
                </select>
              )}
              <input
                value={url}
                onChange={(e) => onChange(
                  t.key === 'VI' ? { videoUrlVi: e.target.value }
                    : t.key === 'EN' ? { videoUrlEn: e.target.value }
                      : { videoUrlYt: e.target.value },
                )}
                placeholder={t.key === 'YT' ? 'https://youtu.be/…' : platformOf(t.key) === 'DIRECT' ? 'Link .mp4 ngoài — hoặc tải lên bên dưới' : 'YouTube URL'}
                className="px-3 py-2.5 rounded-lg bg-darkbg border border-darkborder text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 lg:col-span-2"
              />
              {t.key === 'YT' && (
                <button
                  type="button"
                  onClick={checkYouTube}
                  disabled={checking || !value.videoUrlYt}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium bg-red-500/10 text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                >
                  {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Youtube className="w-4 h-4" />}
                  Kiểm tra &amp; lấy nguồn
                </button>
              )}
            </div>

            {t.key === 'YT' && (
              <input
                value={value.videoYtCredit}
                onChange={(e) => onChange({ videoYtCredit: e.target.value })}
                placeholder="Nguồn hiển thị dưới video — vd: Fireship — React in 100 Seconds"
                className="w-full px-3 py-2.5 rounded-lg bg-darkbg border border-darkborder text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
              />
            )}

            {t.key !== 'YT' && platformOf(t.key) === 'DIRECT' && (
              <LessonVideoManager
                lessonId={lessonId}
                videoUrl={url}
                track={t.key}
                onSaved={(data) => onChange(
                  t.key === 'VI'
                    ? { videoUrlVi: data.videoUrl, videoPlatformVi: 'DIRECT' }
                    : { videoUrlEn: data.videoUrl, videoPlatformEn: 'DIRECT' },
                )}
                onDeleted={() => onChange(t.key === 'VI' ? { videoUrlVi: '' } : { videoUrlEn: '' })}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
