/**
 * Hai giao thức riêng:
 *   • `ctlt://app/…`              — gói giao diện đã dựng (bản đóng gói). Có CSP chặt.
 *   • `ctlt-media://thu-vien/<mục>/<tệp>` — video/phụ đề trong thư viện, cho thẻ <video>.
 *
 * `ctlt-media` đi qua `net.fetch(file://…)` nên thẻ <video> TUA được (Range) và không nạp cả tệp vào RAM. Mọi
 * đường dẫn được resolve rồi ĐỐI CHIẾU với gốc — `ctlt-media://thu-vien/..%2F..%2Fetc/passwd` bị chặn.
 */
import { net, protocol } from 'electron';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { duongDanTep } from './thuVien';

export const SCHEME_APP = 'ctlt';
export const SCHEME_MEDIA = 'ctlt-media';

export function dangKySchemeDacQuyen(): void {
  protocol.registerSchemesAsPrivileged([
    { scheme: SCHEME_APP, privileges: { standard: true, secure: true, supportFetchAPI: true } },
    { scheme: SCHEME_MEDIA, privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } },
  ]);
}

export const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: ${SCHEME_MEDIA}:`,
  `media-src ${SCHEME_MEDIA}:`,
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-src 'none'",
].join('; ');

export function phucVuGiaoDien(thuMucGiaoDien: string): void {
  const goc = path.resolve(thuMucGiaoDien);
  protocol.handle(SCHEME_APP, async (req) => {
    const u = new URL(req.url);
    if (u.host !== 'app') return new Response('Not found', { status: 404 });
    const tuongDoi = decodeURIComponent(u.pathname).replace(/^\/+/, '') || 'index.html';
    const p = path.resolve(goc, path.extname(tuongDoi) ? tuongDoi : 'index.html');
    if (p !== goc && !p.startsWith(goc + path.sep)) return new Response('Forbidden', { status: 403 });
    const r = await net.fetch(pathToFileURL(p).toString());
    const h = new Headers(r.headers);
    if (p.endsWith('.html')) h.set('Content-Security-Policy', CSP);
    h.set('X-Content-Type-Options', 'nosniff');
    return new Response(r.body, { status: r.status, headers: h });
  });
}

export function phucVuMedia(layGoc: () => string, ngheThu: (id: string, range: string | null) => Promise<Response>): void {
  protocol.handle(SCHEME_MEDIA, async (req) => {
    const u = new URL(req.url);
    if (u.host === 'nghe-thu') {
      // Nhạc nền nghe thử: main tải hộ theo MÃ bài (không theo URL renderer đưa).
      const id = decodeURIComponent(u.pathname.replace(/^\/+/, ''));
      if (!/^[A-Za-z0-9_.-]{1,64}$/.test(id)) return new Response('Bad request', { status: 400 });
      try { return await ngheThu(id, req.headers.get('range')); } catch { return new Response('Bad gateway', { status: 502 }); }
    }
    if (u.host !== 'thu-vien') return new Response('Not found', { status: 404 });
    const phan = u.pathname.split('/').filter(Boolean).map((s) => decodeURIComponent(s));
    if (phan.length !== 2) return new Response('Bad request', { status: 400 });
    const p = duongDanTep(layGoc(), phan[0], phan[1]);
    if (!p || !/\.(mp4|m4v|webm|mkv|mov|srt|vtt)$/i.test(p)) return new Response('Forbidden', { status: 403 });
    // Chuyển tiếp Range để <video> tua được.
    return net.fetch(pathToFileURL(p).toString(), { headers: req.headers });
  });
}
