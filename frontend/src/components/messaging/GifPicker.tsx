'use client';

/**
 * GIPHY GIF picker popover. Shows trending GIFs by default and
 * searches as the user types. Uses the public GIPHY API; set
 * NEXT_PUBLIC_GIPHY_API_KEY to your own free key for production
 * (the bundled fallback is GIPHY's well-known public beta key,
 * which is rate-limited and only suitable for testing).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Search, Loader2, X } from 'lucide-react';

const GIPHY_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY || 'dc6zaTOxFJmzC';
const GIPHY_BASE = 'https://api.giphy.com/v1/gifs';

interface GifItem {
  id: string;
  url: string; // downsized image URL we actually send
  previewUrl: string; // small still/preview for the grid
}

function mapGif(g: any): GifItem {
  const img = g.images ?? {};
  return {
    id: g.id,
    url: img.downsized_medium?.url || img.downsized?.url || img.original?.url,
    previewUrl: img.fixed_width_small?.url || img.preview_gif?.url || img.fixed_width?.url,
  };
}

export default function GifPicker({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (url: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [gifs, setGifs] = useState<GifItem[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const endpoint = q.trim()
        ? `${GIPHY_BASE}/search?api_key=${GIPHY_KEY}&q=${encodeURIComponent(q)}&limit=24&rating=pg-13`
        : `${GIPHY_BASE}/trending?api_key=${GIPHY_KEY}&limit=24&rating=pg-13`;
      const res = await fetch(endpoint);
      const json = await res.json();
      setGifs((json.data ?? []).map(mapGif).filter((g: GifItem) => g.url));
    } catch {
      setGifs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load trending on open; debounce search.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => load(query), query ? 300 : 0);
    return () => clearTimeout(t);
  }, [open, query, load]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const t = setTimeout(() => document.addEventListener('mousedown', onDoc), 0);
    return () => { clearTimeout(t); document.removeEventListener('mousedown', onDoc); };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute bottom-full left-0 z-50 mb-2 w-[340px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e1218] shadow-[0_16px_48px_rgba(0,0,0,0.55)]"
    >
      <div className="flex items-center gap-2 border-b border-white/[0.06] p-2">
        <div className="flex flex-1 items-center gap-2 rounded-full bg-white/[0.05] px-3 py-1.5">
          <Search className="h-3.5 w-3.5 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm GIF trên GIPHY…"
            autoFocus
            className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted/70"
          />
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 text-text-muted hover:bg-white/[0.06] hover:text-text-primary">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="h-[300px] overflow-y-auto p-2">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
          </div>
        ) : gifs.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-text-muted">Không có GIF nào.</div>
        ) : (
          <div className="columns-2 gap-2 [&>button]:mb-2">
            {gifs.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => { onPick(g.url); onClose(); }}
                className="block w-full overflow-hidden rounded-lg transition-transform hover:scale-[1.02]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.previewUrl} alt="" className="w-full" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="border-t border-white/[0.06] px-3 py-1 text-center text-[10px] text-text-muted">
        Powered by GIPHY
      </div>
    </div>
  );
}
