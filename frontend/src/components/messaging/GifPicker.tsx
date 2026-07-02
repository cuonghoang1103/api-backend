'use client';

/**
 * GIPHY GIF picker popover. Shows trending GIFs by default and
 * searches as the user types. Uses the public GIPHY API; set
 * NEXT_PUBLIC_GIPHY_API_KEY to your own free key for production
 * (the bundled fallback is GIPHY's well-known public beta key,
 * which is rate-limited and only suitable for testing).
 */

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Search, Loader2, X, AlertCircle, RefreshCw } from 'lucide-react';
import { useAnchoredFixedStyle } from './useAnchoredPopover';

const GIPHY_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY || 'dc6zaTOxFJmzC';
const GIPHY_BASE = 'https://api.giphy.com/v1/gifs';
const MAX_RETRIES = 2;

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
  anchorRef,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (url: string) => void;
  anchorRef?: RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [gifs, setGifs] = useState<GifItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const fixedStyle = useAnchoredFixedStyle(anchorRef, open, 340);

  const load = useCallback(async (q: string) => {
    // Cancel any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();
    setError(null);
    setLoading(true);
    retryCountRef.current = 0;

    const attemptLoad = async (): Promise<void> => {
      try {
        const endpoint = q.trim()
          ? `${GIPHY_BASE}/search?api_key=${GIPHY_KEY}&q=${encodeURIComponent(q)}&limit=24&rating=pg-13`
          : `${GIPHY_BASE}/trending?api_key=${GIPHY_KEY}&limit=24&rating=pg-13`;

        const res = await fetch(endpoint, { signal: abortRef.current?.signal });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();
        const newGifs = (json.data ?? []).map(mapGif).filter((g: GifItem) => g.url);

        setGifs(newGifs);
        retryCountRef.current = 0;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Request was cancelled, ignore
          return;
        }

        // Retry logic with exponential backoff
        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current++;
          const delay = 500 * Math.pow(2, retryCountRef.current - 1);
          await new Promise(r => setTimeout(r, delay));
          return attemptLoad();
        }

        // All retries exhausted
        setError('Khong the tai GIF. Thu lai sau.');
        setGifs([]);
      }
    };

    await attemptLoad();
    setLoading(false);
  }, []);

  // Load trending on open; debounce search.
  useEffect(() => {
    if (!open) return;
    retryCountRef.current = 0;
    const t = setTimeout(() => load(query), query ? 300 : 0);
    return () => clearTimeout(t);
  }, [open, query, load]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const t = setTimeout(() => document.addEventListener('mousedown', onDoc), 0);
    return () => { clearTimeout(t); document.removeEventListener('mousedown', onDoc); };
  }, [open, onClose]);

  const handleRetry = () => {
    setError(null);
    load(query);
  };

  if (!open) return null;

  const body = (
    <div
      ref={ref}
      className={
        anchorRef
          ? 'w-[340px] overflow-hidden rounded-2xl border border-theme bg-theme shadow-[0_16px_48px_rgba(0,0,0,0.35)]'
          : 'absolute bottom-full left-0 z-50 mb-2 w-[340px] overflow-hidden rounded-2xl border border-theme bg-theme shadow-[0_16px_48px_rgba(0,0,0,0.35)]'
      }
      style={anchorRef ? fixedStyle : undefined}
    >
      <div className="flex items-center gap-2 border-b border-theme-light p-2">
        <div className="flex flex-1 items-center gap-2 rounded-full bg-[var(--bg-surface)] px-3 py-1.5">
          <Search className="h-3.5 w-3.5 shrink-0 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tim GIF tren GIPHY..."
            autoFocus
            className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted/70"
          />
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 text-text-muted hover:bg-[var(--bg-surface-hover)] hover:text-text-primary">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="h-[300px] overflow-y-auto p-2">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
          </div>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-xs text-text-muted">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <span className="text-center px-4">{error}</span>
            <button
              onClick={handleRetry}
              className="mt-1 flex items-center gap-1 text-neon-violet hover:underline"
            >
              <RefreshCw className="h-3 w-3" /> Thu lai
            </button>
          </div>
        ) : gifs.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-text-muted">
            {query ? 'Khong tim thay GIF nao.' : 'Khong co GIF nao.'}
          </div>
        ) : (
          <div className="columns-2 gap-2">
            {gifs.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => { onPick(g.url); onClose(); }}
                className="mb-2 block w-full overflow-hidden rounded-lg transition-transform hover:scale-[1.02]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.previewUrl} alt="" className="w-full" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="border-t border-theme-light px-3 py-1 text-center text-[10px] text-text-muted">
        Powered by GIPHY
      </div>
    </div>
  );

  return anchorRef ? createPortal(body, document.body) : body;
}
