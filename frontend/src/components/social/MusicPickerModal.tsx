'use client';

/**
 * MusicPickerModal — Instagram-style music picker for the post
 * composer. Opens a modal that lets the user search the music
 * library and pick one track to attach to the post (as an
 * Instagram-style "Music" sticker). When the user picks a
 * track, the parent's `onPick` callback is called with the
 * track id + the optional start-seconds offset.
 *
 * Data flow:
 *   - composer calls <MusicPickerModal onPick={(id) => ...} />
 *   - we fetch the music library via musicApi.getTracks
 *   - we render a list with a search box at the top
 *   - the user can search by title/artist, scroll the list,
 *     and pick one. We keep the search term in local state so
 *     the user can refine without losing their typing.
 *
 * Note: we don't play audio in the picker (that would compete
 * with the music they're attaching to the post). Picking a
 * track here is just "set the musicTrackId field" — playback
 * is handled by MusicSticker on the post card after publish.
 */

import { useEffect, useState } from 'react';
import { Search, X, Music as MusicIcon, Loader2, Check } from 'lucide-react';
import { musicApi } from '@/lib/api';
import { cn } from '@/lib/utils';

export interface MusicPickerTrack {
  id: number;
  title: string;
  artist: string;
  coverImage?: string | null;
  durationSeconds?: number | null;
  active?: boolean;
}

export interface MusicPickerModalProps {
  open: boolean;
  onClose: () => void;
  onPick: (track: { musicTrackId: number; musicStartSec?: number; title: string; artist: string; coverImage?: string | null }) => void;
  /** Optional: pre-selected track id, so the modal can show
   *  it already-selected. Useful for editing an existing
   *  post. */
  selectedTrackId?: number;
}

function formatDuration(seconds?: number | null): string {
  if (seconds == null) return '';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MusicPickerModal({
  open, onClose, onPick, selectedTrackId,
}: MusicPickerModalProps) {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState<MusicPickerTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | undefined>(selectedTrackId);

  useEffect(() => {
    if (!open) return;
    setSelectedId(selectedTrackId);
  }, [open, selectedTrackId]);

  // Fetch tracks whenever the modal opens or the query
  // changes. A debounce would be nice but for 1k tracks on the
  // server side it's a no-op; we just do a simple input-debounce
  // by tracking the timeout id.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const handle = setTimeout(() => {
      setLoading(true);
      musicApi
        .getTracks({ q: query || undefined, limit: 30 } as never)
        .then((res) => {
          if (cancelled) return;
          const raw = (res.data?.data as { tracks?: MusicPickerTrack[] })
            || (res.data?.data as MusicPickerTrack[]);
          const list = Array.isArray(raw) ? raw : (raw?.tracks ?? []);
          setTracks(list.filter((t) => t.active !== false));
        })
        .catch(() => {
          if (cancelled) return;
          setTracks([]);
        })
        .finally(() => {
          if (cancelled) return;
          setLoading(false);
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [open, query]);

  if (!open) return null;

  const handleSelect = (track: MusicPickerTrack) => {
    setSelectedId(track.id);
    // We start playback at 0 by default; the composer can
    // extend to a custom offset via a future slider. For now
    // the sticker just renders the snippet metadata.
    onPick({
      musicTrackId: track.id,
      musicStartSec: 0,
      title: track.title,
      artist: track.artist,
      coverImage: track.coverImage ?? null,
    });
    onClose();
  };

  return (
    <div
      data-testid="music-picker-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-darkborder bg-[#0d0f18] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-darkborder/60 px-5 py-3.5">
          <div className="flex items-center gap-2.5 text-text-primary">
            <MusicIcon className="h-4 w-4 text-neon-violet" />
            <h2 className="text-base font-semibold">Chọn nhạc cho bài viết</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
            aria-label="Đóng"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search box */}
        <div className="border-b border-darkborder/60 px-5 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo tên bài hát hoặc nghệ sĩ…"
              className="w-full rounded-lg border border-darkborder bg-darkbg/60 py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Track list */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && tracks.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-10 text-text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Đang tải…</span>
            </div>
          ) : tracks.length === 0 ? (
            <div className="py-10 text-center text-sm text-text-muted">
              Không tìm thấy bài hát phù hợp.
            </div>
          ) : (
            <ul className="divide-y divide-darkborder/40">
              {tracks.map((t) => {
                const isSelected = t.id === selectedId;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(t)}
                      data-testid={`music-track-${t.id}`}
                      className={cn(
                        'flex w-full items-center gap-3 px-5 py-2.5 text-left transition-colors',
                        isSelected
                          ? 'bg-neon-violet/15'
                          : 'hover:bg-white/[0.04]',
                      )}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-neon-violet/30 to-neon-pink/30">
                        {t.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={t.coverImage}
                            alt={t.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <MusicIcon className="h-4 w-4 text-white/80" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-text-primary">
                          {t.title}
                        </div>
                        <div className="truncate text-xs text-text-muted">
                          {t.artist}
                        </div>
                      </div>
                      {formatDuration(t.durationSeconds) && (
                        <span className="text-xs text-text-muted">
                          {formatDuration(t.durationSeconds)}
                        </span>
                      )}
                      {isSelected && (
                        <Check className="h-4 w-4 shrink-0 text-neon-violet" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-darkborder/60 px-5 py-2.5 text-center text-[11px] text-text-muted">
          {selectedId
            ? 'Đã chọn nhạc. Nhấn ra ngoài để đóng hoặc chọn bài khác.'
            : 'Chọn một bài hát để gắn vào bài viết như Instagram Music.'}
        </div>
      </div>
    </div>
  );
}
