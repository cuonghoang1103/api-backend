/**
 * TẢI TỆP TỪ LINK để đính vào thẻ CT Work (19/10/2026) — `attach_from_url` + `gdoc_images` của CT Work MCP.
 *
 * Sự cố gốc: người dùng nhờ CuongMini gắn sơ đồ (ảnh nằm trong một Google Doc) vào thẻ NT-13; AI không có đường nào
 * lấy ảnh đó ⇒ bảo người dùng tự lưu PNG rồi kéo vào chat. Giờ máy chủ tự tải (có rào SSRF — `taiCongKhai`):
 *   - link Google ⇒ đổi sang URL XUẤT chính thức (Drawings ⇒ PNG, Docs ⇒ PDF, Slides ⇒ PDF hoặc PNG một trang,
 *     Sheets ⇒ XLSX, Drive ⇒ tải thẳng);
 *   - ảnh NHÚNG trong Google Doc: bản xuất HTML của Google nhúng ảnh dạng `data:` base64 (đo thật 19/10/2026 trên doc
 *     công khai của Chromium) ⇒ không có URL riêng để tải ⇒ chọn bằng SỐ THỨ TỰ (`image`), máy chủ tự giải.
 * Phần THUẦN (đổi URL, đọc thẻ <img>, tên tệp) test không cần mạng: taiTep.test.ts.
 */

import { LoiTai, taiCongKhai, type KetQuaTai } from './taiAnToan.js';
import { laDangNhapGoogle } from './nhanDien.js';

const ID_GOOGLE = /^[A-Za-z0-9_-]{20,120}$/;

export type LoaiNguon = 'gdrawing' | 'gdoc' | 'gdocpub' | 'gsheet' | 'gslide' | 'gdrive' | 'web';

export interface NguonTep {
  loai: LoaiNguon;
  /** URL đem đi tải (đã đổi sang URL xuất với link Google). */
  url: string;
  /** URL người dùng đưa (đã chuẩn hoá). */
  goc: string;
  id?: string;
}

/** Tên đẹp cho thông báo. */
export const TEN_NGUON: Record<LoaiNguon, string> = {
  gdrawing: 'Google Drawings', gdoc: 'Google Docs', gdocpub: 'Google Docs (published)', gsheet: 'Google Sheets',
  gslide: 'Google Slides', gdrive: 'Google Drive', web: 'web',
};

function parseUrl(raw: string): URL {
  const s = String(raw ?? '').trim();
  let u: URL;
  try {
    u = new URL(s.includes('://') ? s : `https://${s}`);
  } catch {
    throw new LoiTai(`"${s.slice(0, 200)}" is not a valid URL`, 'CAM');
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new LoiTai('Only http(s) links can be attached', 'CAM');
  return u;
}

/** id sau đoạn "/d/" của đường dẫn Google (bỏ /d/e/<pubId>). */
function idSauD(phan: string[]): string | undefined {
  const i = phan.indexOf('d');
  const id = i >= 0 ? phan[i + 1] : undefined;
  return id && id !== 'e' && ID_GOOGLE.test(id) ? id : undefined;
}

/**
 * Link ⇒ URL để tải tệp. Link Google đổi sang URL xuất chính thức; URL đã là URL xuất / tải thì giữ nguyên.
 * Thư mục Drive ⇒ lỗi (không đính được cả thư mục). Hàm THUẦN.
 */
export function urlTepTai(raw: string): NguonTep {
  const u = parseUrl(raw);
  const goc = u.toString();
  const host = u.hostname.toLowerCase().replace(/\.$/, '');
  const phan = u.pathname.split('/').filter(Boolean);
  const daXuat = phan.includes('export') || phan.includes('pub');

  if (host === 'docs.google.com') {
    const kieu = phan[0];
    const id = idSauD(phan);
    if (kieu === 'document' && phan[phan.indexOf('d') + 1] === 'e') return { loai: 'gdocpub', url: goc, goc };
    if (!id || !['drawings', 'document', 'presentation', 'spreadsheets'].includes(kieu ?? '')) return { loai: 'web', url: goc, goc };
    const e = encodeURIComponent(id);
    if (kieu === 'drawings') return { loai: 'gdrawing', id, goc, url: daXuat ? goc : `https://docs.google.com/drawings/d/${e}/export/png` };
    if (kieu === 'document') return { loai: 'gdoc', id, goc, url: daXuat ? goc : `https://docs.google.com/document/d/${e}/export?format=pdf` };
    if (kieu === 'spreadsheets') return { loai: 'gsheet', id, goc, url: daXuat ? goc : `https://docs.google.com/spreadsheets/d/${e}/export?format=xlsx` };
    // Slides: một trang (pageid trong ?pageid= hoặc #slide=id.<pageid>) ⇒ PNG; cả bản ⇒ PDF.
    const page = u.searchParams.get('pageid') ?? /(?:^#|&)slide=id\.([A-Za-z0-9_.-]{1,80})/.exec(u.hash)?.[1] ?? null;
    if (daXuat) return { loai: 'gslide', id, goc, url: goc };
    return {
      loai: 'gslide', id, goc,
      url: page ? `https://docs.google.com/presentation/d/${e}/export/png?pageid=${encodeURIComponent(page)}` : `https://docs.google.com/presentation/d/${e}/export/pdf`,
    };
  }

  if (host === 'drive.google.com') {
    if (phan.includes('folders')) throw new LoiTai('A Google Drive folder cannot be attached — open it and share the link of one file', 'CAM');
    const id = (phan[0] === 'file' ? idSauD(phan) : undefined) ?? u.searchParams.get('id') ?? undefined;
    if (id && ID_GOOGLE.test(id)) return { loai: 'gdrive', id, goc, url: `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}` };
    return { loai: 'web', url: goc, goc };
  }

  return { loai: 'web', url: goc, goc };
}

/** Link có phải Google Doc (để liệt kê ảnh nhúng) không — trả URL bản xuất HTML. Hàm THUẦN. */
export function urlHtmlCuaDoc(raw: string): { loai: 'gdoc' | 'gdocpub'; url: string } | null {
  const n = urlTepTai(raw);
  if (n.loai === 'gdoc' && n.id) return { loai: 'gdoc', url: `https://docs.google.com/document/d/${encodeURIComponent(n.id)}/export?format=html` };
  if (n.loai === 'gdocpub') {
    const u = new URL(n.goc);
    const phan = u.pathname.split('/').filter(Boolean);
    const i = phan.indexOf('e');
    const pub = phan[i + 1];
    if (pub && /^[A-Za-z0-9_-]{20,200}$/.test(pub)) return { loai: 'gdocpub', url: `https://docs.google.com/document/d/e/${pub}/pub` };
  }
  return null;
}

// ─── Ảnh trong HTML ──────────────────────────────────────────────

export interface AnhTrongHtml {
  index: number;
  /** URL tuyệt đối, hoặc `data:` (Google nhúng ảnh base64 vào bản xuất HTML). */
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

const giaiThucThe = (s: string) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

function thuocTinh(the: string, ten: string): string | undefined {
  const m = new RegExp(`\\s${ten}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i').exec(the);
  const v = m ? (m[1] ?? m[2] ?? m[3]) : undefined;
  return v === undefined ? undefined : giaiThucThe(v);
}

function soPx(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = Number.parseFloat(v);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : undefined;
}

/**
 * Mọi thẻ <img> trong HTML theo thứ tự xuất hiện (đánh số 1…). Chỉ giữ `data:image/…` và http(s) (src tương đối ⇒
 * tuyệt đối theo `goc`). Cỡ lấy từ width/height hoặc style "width: 624.00px" (kiểu Google Docs). Hàm THUẦN.
 */
export function anhTrongHtml(html: string, goc?: string, toiDa = 100): AnhTrongHtml[] {
  const ra: AnhTrongHtml[] = [];
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const the = m[0];
    let src = thuocTinh(the, 'src')?.trim();
    if (!src) continue;
    if (!/^data:image\//i.test(src)) {
      try { src = new URL(src, goc).toString(); } catch { continue; }
      if (!/^https?:\/\//i.test(src)) continue;
    }
    const style = thuocTinh(the, 'style') ?? '';
    const alt = thuocTinh(the, 'alt')?.trim() || thuocTinh(the, 'title')?.trim();
    const width = soPx(thuocTinh(the, 'width')) ?? soPx(/(?:^|;)\s*width\s*:\s*([\d.]+)px/i.exec(style)?.[1]);
    const height = soPx(thuocTinh(the, 'height')) ?? soPx(/(?:^|;)\s*height\s*:\s*([\d.]+)px/i.exec(style)?.[1]);
    ra.push({ index: ra.length + 1, src, ...(alt ? { alt: alt.slice(0, 200) } : {}), ...(width ? { width } : {}), ...(height ? { height } : {}) });
    if (ra.length >= toiDa) break;
  }
  return ra;
}

/** `data:image/png;base64,…` ⇒ byte + kiểu. Không phải data URI ảnh base64 ⇒ null. Hàm THUẦN. */
export function giaiDataUri(src: string): { byte: Buffer; kieu: string } | null {
  const m = /^data:(image\/[a-z0-9.+-]+)(?:;[^,;]*)*;base64,([A-Za-z0-9+/=\s]*)$/i.exec(src);
  if (!m) return null;
  const byte = Buffer.from(m[2].replace(/\s+/g, ''), 'base64');
  return byte.length ? { byte, kieu: m[1].toLowerCase() } : null;
}

/** Cỡ ước tính (byte) của ảnh `data:` mà không giải. */
export function coDataUri(src: string): number | null {
  const i = src.indexOf('base64,');
  return src.startsWith('data:') && i > 0 ? Math.floor(((src.length - i - 7) * 3) / 4) : null;
}

// ─── Tên + kiểu tệp ─────────────────────────────────────────────

const DUOI_THEO_KIEU: Record<string, string> = {
  'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/webp': 'webp', 'image/svg+xml': 'svg', 'image/bmp': 'bmp',
  'image/heic': 'heic', 'application/pdf': 'pdf', 'text/plain': 'txt', 'text/csv': 'csv', 'application/zip': 'zip', 'application/json': 'json',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
};
const KIEU_THEO_DUOI: Record<string, string> = Object.fromEntries(Object.entries(DUOI_THEO_KIEU).map(([k, v]) => [v, k]));
KIEU_THEO_DUOI.jpeg = 'image/jpeg';

/** "image/png; charset=…" ⇒ "image/png". */
export const kieuGon = (ct: string) => ct.split(';')[0].trim().toLowerCase();

/** Tên tệp trong Content-Disposition (ưu tiên filename*= UTF-8). Hàm THUẦN. */
export function tenTuDispo(dispo: string): string | null {
  const sao = /filename\*\s*=\s*(?:UTF-8|utf-8)?''([^;]+)/.exec(dispo)?.[1];
  if (sao) {
    try { return decodeURIComponent(sao.trim().replace(/^"|"$/g, '')); } catch { /* rơi xuống filename= */ }
  }
  const thuong = /filename\s*=\s*(?:"([^"]*)"|([^;]+))/i.exec(dispo);
  const v = (thuong?.[1] ?? thuong?.[2] ?? '').trim();
  return v || null;
}

/**
 * Tên + kiểu tệp cuối cùng: tên người gọi đưa > Content-Disposition > đoạn cuối đường dẫn > "<gợi ý>.<đuôi>".
 * Kiểu: header (bỏ octet-stream) > đoán theo đuôi. Tên thiếu đuôi ⇒ thêm đuôi theo kiểu. Hàm THUẦN.
 */
export function tenVaKieu(o: { ten?: string | null; dispo?: string; url: string; kieu?: string; goiY?: string }): { fileName: string; contentType: string } {
  let kieu = o.kieu ? kieuGon(o.kieu) : '';
  let ten = o.ten?.trim() || tenTuDispo(o.dispo ?? '') || '';
  if (!ten) {
    try {
      const cuoi = decodeURIComponent(new URL(o.url).pathname.split('/').filter(Boolean).pop() ?? '');
      if (/\.[a-z0-9]{2,5}$/i.test(cuoi) && cuoi.length <= 120) ten = cuoi;
    } catch { /* bỏ */ }
  }
  const duoi = /\.([a-z0-9]{2,5})$/i.exec(ten)?.[1]?.toLowerCase();
  if ((!kieu || kieu === 'application/octet-stream' || kieu === 'binary/octet-stream' || kieu === 'application/binary') && duoi && KIEU_THEO_DUOI[duoi]) kieu = KIEU_THEO_DUOI[duoi];
  if (!kieu || kieu === 'binary/octet-stream' || kieu === 'application/binary') kieu = 'application/octet-stream';
  if (!ten) ten = `${o.goiY ?? 'file'}${DUOI_THEO_KIEU[kieu] ? `.${DUOI_THEO_KIEU[kieu]}` : ''}`;
  else if (!duoi && DUOI_THEO_KIEU[kieu]) ten = `${ten}.${DUOI_THEO_KIEU[kieu]}`;
  return { fileName: ten.replace(/[\\/\0]/g, '_').slice(-200), contentType: kieu.slice(0, 100) };
}

// ─── Mạng ────────────────────────────────────────────────────────

const laGoogle = (loai: LoaiNguon) => loai !== 'web';

/** Câu lỗi cho model/người dùng (tiếng Anh như mọi lỗi MCP; người dùng là sinh viên Việt nên kèm câu Việt ngắn). */
export function loiChoNguoi(e: unknown, loai: LoaiNguon): { msg: string; code: string } {
  if (!(e instanceof LoiTai)) return { msg: `Could not download the file: ${(e as Error)?.message ?? 'error'}`, code: 'WORK_URL_FETCH_FAILED' };
  if (e.ma === 'RIENG_TU') {
    return laGoogle(loai)
      ? { msg: `This ${TEN_NGUON[loai]} file is private. Its owner must set Share → "Anyone with the link" → Viewer, then try again. / Tài liệu chưa mở chia sẻ — nhờ chủ tài liệu bật "Bất kỳ ai có đường liên kết" (Người xem).`, code: 'WORK_URL_PRIVATE' }
      : { msg: `The site refused the download (HTTP ${e.status || 401}) — the link needs a login or does not exist.`, code: 'WORK_URL_PRIVATE' };
  }
  if (e.ma === 'QUA_LON') return { msg: 'The file is larger than 25 MB (the attachment limit).', code: 'WORK_FILE_TOO_LARGE' };
  if (e.ma === 'CAM') return { msg: `This link cannot be downloaded: ${e.message}.`, code: 'WORK_URL_BLOCKED' };
  return { msg: `Could not download the file (${e.message}).`, code: 'WORK_URL_FETCH_FAILED' };
}

/** Tải tệp từ link (đã đổi URL Google). HTML trả về ⇒ lỗi rõ (trang web, không phải tệp; Google ⇒ thường là riêng tư). */
export async function taiTepTuLink(raw: string, tranByte: number): Promise<{ nguon: NguonTep; kq: KetQuaTai }> {
  const nguon = urlTepTai(raw);
  const kq = await taiCongKhai(nguon.url, { tranByte, hetGioMs: 45_000 });
  if (laDangNhapGoogle(kq.url)) throw new LoiTai('cần đăng nhập', 'RIENG_TU', 401);
  if (kieuGon(kq.kieu) === 'text/html') {
    if (laGoogle(nguon.loai) && nguon.loai !== 'gdocpub') throw new LoiTai('Google trả trang HTML thay vì tệp', 'RIENG_TU', 403);
    throw new LoiTai('the link is a web page, not a file — pass the direct URL of the image/file, or call gdoc_images to list the images on that page and attach one by number', 'CAM');
  }
  if (!kq.byte.length) throw new LoiTai('the file is empty', 'HTTP');
  return { nguon, kq };
}

/** Ảnh trong một Google Doc (bản xuất HTML) hoặc một trang web công khai. Drawings ⇒ một "ảnh" = bản xuất PNG. */
export async function anhCuaLink(raw: string, tranHtml = 60 * 1024 * 1024): Promise<{ nguon: NguonTep; anh: AnhTrongHtml[] }> {
  const nguon = urlTepTai(raw);
  if (nguon.loai === 'gdrawing') return { nguon, anh: [{ index: 1, src: nguon.url, alt: 'Google Drawing (PNG export)' }] };
  if (nguon.loai === 'gslide' || nguon.loai === 'gsheet' || nguon.loai === 'gdrive') return { nguon, anh: [] };
  const doc = urlHtmlCuaDoc(raw);
  const url = doc?.url ?? nguon.url;
  const kq = await taiCongKhai(url, { tranByte: doc ? tranHtml : 8 * 1024 * 1024, hetGioMs: 45_000 });
  if (laDangNhapGoogle(kq.url)) throw new LoiTai('cần đăng nhập', 'RIENG_TU', 401);
  const kieu = kieuGon(kq.kieu);
  if (kieu.startsWith('image/')) return { nguon, anh: [{ index: 1, src: kq.url }] };
  if (kieu !== 'text/html' && kieu !== 'application/xhtml+xml') throw new LoiTai(`the link is not a web page or Google Doc (${kieu || 'unknown type'})`, 'CAM');
  return { nguon, anh: anhTrongHtml(kq.byte.toString('utf8'), kq.url) };
}

/** Byte của ảnh số `index` (từ `anhCuaLink`): giải `data:` tại chỗ, URL thì tải qua rào. */
export async function taiAnh(a: AnhTrongHtml, tranByte: number): Promise<{ byte: Buffer; kieu: string; dispo: string; url: string }> {
  const d = a.src.startsWith('data:') ? giaiDataUri(a.src) : null;
  if (a.src.startsWith('data:')) {
    if (!d) throw new LoiTai('the embedded image could not be decoded', 'HTTP');
    if (d.byte.length > tranByte) throw new LoiTai('too large', 'QUA_LON');
    return { byte: d.byte, kieu: d.kieu, dispo: '', url: '' };
  }
  const kq = await taiCongKhai(a.src, { tranByte, hetGioMs: 45_000 });
  if (laDangNhapGoogle(kq.url)) throw new LoiTai('cần đăng nhập', 'RIENG_TU', 401);
  if (kieuGon(kq.kieu) === 'text/html') throw new LoiTai('the image URL returned a web page', 'HTTP');
  return { byte: kq.byte, kieu: kq.kieu, dispo: kq.dispo, url: kq.url };
}
