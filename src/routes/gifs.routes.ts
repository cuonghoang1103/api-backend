/**
 * ============================================================
 * GIF search proxy (GIPHY)
 * ============================================================
 *
 * Endpoints:
 *   GET /api/v1/gifs?q=<query>   — search GIFs (trending when q empty)
 *
 * Why a proxy instead of calling GIPHY from the browser:
 *   1. The old client-side fallback key (GIPHY's public beta key)
 *      was killed by GIPHY (403) — that's why the picker worked
 *      intermittently and then died entirely.
 *   2. NEXT_PUBLIC_* keys are baked into the JS bundle at build
 *      time; rotating the key required a full frontend rebuild.
 *      Server-side GIPHY_API_KEY is read at request time, so the
 *      key can be added/rotated with just a container restart.
 *   3. A small in-memory cache keeps us far below GIPHY's free
 *      rate limits even if many users open the picker at once.
 */

import { Router, type Response, type Request } from 'express';
import { authenticate } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

const GIPHY_BASE = 'https://api.giphy.com/v1/gifs';

interface GifItem {
  id: string;
  url: string;
  previewUrl: string;
}

// query → { items, expiresAt }. Trending ('') and popular searches are
// shared by every user, so even a tiny TTL cache removes most upstream
// calls. Capped so a burst of unique queries can't grow memory forever.
const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_MAX_ENTRIES = 200;
const cache = new Map<string, { items: GifItem[]; expiresAt: number }>();

function mapGif(g: any): GifItem {
  const img = g?.images ?? {};
  return {
    id: String(g?.id ?? ''),
    url: img.downsized_medium?.url || img.downsized?.url || img.original?.url || '',
    previewUrl: img.fixed_width_small?.url || img.preview_gif?.url || img.fixed_width?.url || '',
  };
}

router.get('/', authenticate, async (req: Request, res: Response<ApiResponse>) => {
  const apiKey = process.env.GIPHY_API_KEY;
  if (!apiKey) {
    res.status(503).json({
      success: false,
      message: 'GIF search is not configured (missing GIPHY_API_KEY on the server)',
    });
    return;
  }

  const q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 100) : '';
  const cacheKey = q.toLowerCase();

  const hit = cache.get(cacheKey);
  if (hit && hit.expiresAt > Date.now()) {
    res.json({ success: true, data: hit.items });
    return;
  }

  try {
    const endpoint = q
      ? `${GIPHY_BASE}/search?api_key=${apiKey}&q=${encodeURIComponent(q)}&limit=24&rating=pg-13`
      : `${GIPHY_BASE}/trending?api_key=${apiKey}&limit=24&rating=pg-13`;

    const upstream = await fetch(endpoint, { signal: AbortSignal.timeout(8000) });
    if (!upstream.ok) {
      res.status(502).json({ success: false, message: `GIPHY upstream error (HTTP ${upstream.status})` });
      return;
    }

    const json = (await upstream.json()) as { data?: unknown[] };
    const items = (json.data ?? []).map(mapGif).filter((g) => g.url && g.previewUrl);

    if (cache.size >= CACHE_MAX_ENTRIES) {
      // Drop the oldest entry (Map preserves insertion order).
      const oldest = cache.keys().next().value;
      if (oldest !== undefined) cache.delete(oldest);
    }
    cache.set(cacheKey, { items, expiresAt: Date.now() + CACHE_TTL_MS });

    res.json({ success: true, data: items });
  } catch {
    res.status(502).json({ success: false, message: 'GIPHY request failed or timed out' });
  }
});

export default router;
