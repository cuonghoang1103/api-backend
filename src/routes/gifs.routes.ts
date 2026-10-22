/**
 * ============================================================
 * GIF search proxy (GIPHY)
 * ============================================================
 *
 * Endpoints:
 *   GET /api/v1/gifs?q=<query>&offset=<n>   — search GIFs (trending when q empty)
 *
 * Paging (22/10/2026, app iOS CT Work 1.1 — bảng chọn GIF cuộn vô tận): `offset` (bội của
 * GIF_PAGE_SIZE, mặc định 0) đi thẳng sang GIPHY. Phản hồi vẫn là MẢNG như cũ — client tự tính
 * trang sau = offset + GIF_PAGE_SIZE và dừng khi nhận < GIF_PAGE_SIZE mục. Máy chủ cũ bỏ qua
 * `offset` ⇒ trả lại đúng trang đầu ⇒ client lọc trùng theo id, không có mục mới ⇒ dừng.
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

/** Số GIF mỗi trang — client iOS dùng cùng số để biết đã hết trang. */
export const GIF_PAGE_SIZE = 24;
/** GIPHY từ chối `offset` > 4999 (search) — chặn sớm thay vì để upstream trả lỗi. */
export const GIF_MAX_OFFSET = 4999 - GIF_PAGE_SIZE;

/** `offset` từ query: số nguyên ≥ 0, làm tròn XUỐNG về bội của trang, trần GIF_MAX_OFFSET. Rác ⇒ 0. */
export function parseGifOffset(raw: unknown): number {
  const n = typeof raw === 'string' ? Number.parseInt(raw, 10) : typeof raw === 'number' ? raw : NaN;
  if (!Number.isFinite(n) || n <= 0) return 0;
  const capped = Math.min(Math.floor(n), GIF_MAX_OFFSET);
  return capped - (capped % GIF_PAGE_SIZE);
}

/** URL gọi GIPHY (thuần — có kiểm thử). */
export function giphyUrl(apiKey: string, q: string, offset: number): string {
  const tail = `&limit=${GIF_PAGE_SIZE}&offset=${offset}&rating=pg`; // App Store: PG (không PG-13) — khớp hạng tuổi 13+ khai "nội dung tình dục: Không"
  return q
    ? `${GIPHY_BASE}/search?api_key=${apiKey}&q=${encodeURIComponent(q)}${tail}`
    : `${GIPHY_BASE}/trending?api_key=${apiKey}${tail}`;
}

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
  const offset = parseGifOffset(req.query.offset);
  // Trang đầu giữ khoá cũ (không hậu tố) — bộ đệm đang nóng của trang đầu không bị bỏ.
  const cacheKey = offset ? `${q.toLowerCase()}@${offset}` : q.toLowerCase();

  const hit = cache.get(cacheKey);
  if (hit && hit.expiresAt > Date.now()) {
    res.json({ success: true, data: hit.items });
    return;
  }

  try {
    const endpoint = giphyUrl(apiKey, q, offset);

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
