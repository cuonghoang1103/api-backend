/**
 * CT Work đợt 8c (12/10/2026) — ẢNH SƠ ĐỒ MERMAID VẼ SẴN — phần THUẦN (test ở ctw8c.test.ts).
 *
 * Vì sao không vẽ trên máy chủ: Mermaid cần trình duyệt thật để đo chữ (getBBox) — `@mermaid-js/mermaid-cli` kéo theo
 * Puppeteer + Chromium (~300 MB, thêm thư viện hệ thống vào ảnh alpine) — đúng thứ đề giao dặn KHÔNG thêm vào ảnh backend.
 * Thay vào đó: trình duyệt của thành viên (đã vẽ sơ đồ để hiển thị) gửi SVG + PNG lên một lần theo MÃ BĂM nguồn; API/MCP và
 * xuất Docs đọc ảnh đó. Tuỳ chọn: biến `CTW_MERMAID_RENDER_URL` trỏ tới một máy Kroki TỰ DỰNG (container riêng, không nằm
 * trong ảnh backend) ⇒ khi chưa có ảnh, máy chủ hỏi Kroki. Không đặt ⇒ không bao giờ gửi nguồn sơ đồ ra ngoài.
 */

import crypto from 'node:crypto';

export const MAX_SVG_BYTES = 2 * 1024 * 1024;
export const MAX_PNG_BYTES = 4 * 1024 * 1024;

/** Nguồn chuẩn hoá trước khi băm: bỏ CR, khoảng trắng cuối dòng, dòng trống đầu/cuối. */
export function normalizeMermaid(src: string): string {
  return String(src ?? '').replace(/\r\n?/g, '\n').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').trim();
}
export const renderHash = (src: string) => crypto.createHash('sha256').update(normalizeMermaid(src)).digest('hex');

/**
 * Kiểm + làm sạch SVG trước khi lưu và phục vụ lại (SVG mở trực tiếp trong trình duyệt CHẠY được script):
 *  - phải là <svg …>…</svg>;
 *  - bỏ <script>, thuộc tính on*, href/xlink:href không phải "#…" hay data:image/*, <foreignObject> chứa <iframe|object|embed>;
 *  - bỏ khai báo <!DOCTYPE>/<!ENTITY> (XXE khi ai đó đọc lại bằng bộ đọc XML).
 * Trả null khi không phải SVG hợp lệ / quá lớn.
 */
export function sanitizeSvg(svg: string): string | null {
  let s = String(svg ?? '').trim();
  if (!s || Buffer.byteLength(s) > MAX_SVG_BYTES) return null;
  s = s.replace(/<\?xml[\s\S]*?\?>/gi, '').replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*?\])?\s*>/gi, '').replace(/<!ENTITY[\s\S]*?>/gi, '').trim();
  if (!/^<svg[\s>]/i.test(s) || !/<\/svg>\s*$/i.test(s)) return null;
  s = s.replace(/<script[\s\S]*?<\/script\s*>/gi, '').replace(/<script[^>]*\/>/gi, '');
  s = s.replace(/<(iframe|object|embed|audio|video)[\s\S]*?(<\/\1\s*>|\/>)/gi, '');
  s = s.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  s = s.replace(/\s(href|xlink:href)\s*=\s*("([^"]*)"|'([^']*)')/gi, (m, _a, _q, d1, d2) => {
    const v = String(d1 ?? d2 ?? '').trim();
    return v.startsWith('#') || /^data:image\/(png|jpeg|gif|webp);base64,/i.test(v) ? m : '';
  });
  s = s.replace(/javascript:/gi, '');
  return s;
}

/** Ảnh PNG từ data URL hoặc base64 trần ⇒ Buffer (chỉ kiểm chữ ký PNG + trần cỡ; sharp kiểm sâu ở tầng service). */
export function decodePng(dataUrlOrB64: string | null | undefined): Buffer | null {
  if (!dataUrlOrB64) return null;
  const m = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(dataUrlOrB64) ?? /^([A-Za-z0-9+/=]+)$/.exec(dataUrlOrB64);
  if (!m) return null;
  const buf = Buffer.from(m[1], 'base64');
  if (buf.length < 8 || buf.length > MAX_PNG_BYTES) return null;
  return buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) ? buf : null;
}

/** Kroki: POST <base>/mermaid/<svg|png>, thân = nguồn (text/plain). */
export function krokiUrl(base: string, format: 'svg' | 'png'): string | null {
  try {
    const u = new URL(base);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    return `${u.toString().replace(/\/+$/, '')}/mermaid/${format}`;
  } catch { return null; }
}
