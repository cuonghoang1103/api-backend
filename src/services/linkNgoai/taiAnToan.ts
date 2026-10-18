/**
 * Bộ tải CÓ RÀO cho link ngoài (Google / Figma / GitHub) — máy chủ.
 *
 * Bốn lớp, cùng tinh thần `agent/webTool.ts` + bản vá QA của `work/gitSource.ts` (`fetchCungNguon`):
 *   1. CHỈ https, và CHỈ host trong danh sách của loại link (`hostChoPhep`) — mọi chặng, kể cả chặng chuyển hướng;
 *   2. phân giải DNS rồi kiểm MỌI IP (`ipBiCam`) — tên miền "đúng" mà trỏ vào 127.0.0.1 vẫn bị chặn;
 *   3. tự theo chuyển hướng (`redirect: 'manual'`), tối đa 4 chặng; sang host ngoài danh sách ⇒ DỪNG, không theo
 *      (riêng trang đăng nhập Google ⇒ báo "link riêng tư", không gọi tới);
 *   4. trần byte khi đọc thân (đọc theo mẩu, vượt trần là cắt — không `res.arrayBuffer()` một file 2GB).
 * Header bí mật (token Figma) KHÔNG bao giờ gửi sang chặng khác host đầu.
 */
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { ipBiCam } from '../agent/webTool.js';
import { hostChoPhep, laDangNhapGoogle, type LoaiLink } from './nhanDien.js';

export type FetchLike = (url: string, init: { headers: Record<string, string>; redirect: 'manual'; signal?: AbortSignal }) => Promise<Response>;
export type LookupLike = (host: string) => Promise<Array<{ address: string }>>;

let fetchImpl: FetchLike = (url, init) => fetch(url, init);
let lookupImpl: LookupLike = (host) => lookup(host, { all: true });

/** CHỈ cho test: thay fetch / DNS (null ⇒ thật). */
export function __datMangChoTest(f: FetchLike | null, l: LookupLike | null = null): void {
  fetchImpl = f ?? ((url, init) => fetch(url, init));
  lookupImpl = l ?? ((host) => lookup(host, { all: true }));
}

export class LoiTai extends Error {
  constructor(message: string, readonly ma: 'CAM' | 'RIENG_TU' | 'HTTP' | 'QUA_LON' | 'MANG', readonly status = 0) {
    super(message);
  }
}

export interface KetQuaTai { byte: Buffer; kieu: string; url: string; status: number; /** content-disposition (tên file Drive). */ dispo: string }

async function kiemHost(loai: LoaiLink, u: URL): Promise<void> {
  if (u.protocol !== 'https:') throw new LoiTai(`chỉ gọi https (${u.protocol})`, 'CAM');
  const host = u.hostname.replace(/^\[|\]$/g, '');
  if (isIP(host)) throw new LoiTai(`không gọi thẳng địa chỉ IP (${host})`, 'CAM');
  if (!hostChoPhep(loai, host)) throw new LoiTai(`host "${host}" không nằm trong danh sách được phép`, 'CAM');
  let ds: Array<{ address: string }>;
  try {
    ds = await lookupImpl(host);
  } catch {
    throw new LoiTai(`không phân giải được "${host}"`, 'MANG');
  }
  const ban = ds.find((r) => ipBiCam(r.address));
  if (ban || !ds.length) throw new LoiTai(`"${host}" trỏ vào địa chỉ nội bộ`, 'CAM');
}

/**
 * GET có rào. `headers` (vd. X-Figma-Token) CHỈ gửi cho chặng cùng host với URL đầu.
 * 401/403/404 ⇒ ném `RIENG_TU` (link chưa mở chia sẻ / không tồn tại) — người gọi tự diễn giải theo loại link.
 */
export async function taiCoRao(loai: LoaiLink, url: string, o: { tranByte: number; headers?: Record<string, string>; hetGioMs?: number } ): Promise<KetQuaTai> {
  let u: URL;
  try { u = new URL(url); } catch { throw new LoiTai('URL hỏng', 'CAM'); }
  const hostDau = u.hostname;
  const signal = AbortSignal.timeout(o.hetGioMs ?? 20_000);
  let res: Response | null = null;
  for (let i = 0; i <= 4; i++) {
    await kiemHost(loai, u);
    const headers: Record<string, string> = {
      'User-Agent': 'CuongThaiAgent/1.0 (+https://cuongthai.com)',
      Accept: '*/*',
      ...(u.hostname === hostDau ? (o.headers ?? {}) : {}),
    };
    try {
      res = await fetchImpl(u.toString(), { headers, redirect: 'manual', signal });
    } catch (e) {
      throw new LoiTai((e as Error).name === 'TimeoutError' ? 'quá thời gian chờ' : 'không kết nối được', 'MANG');
    }
    if (res.status < 300 || res.status >= 400 || res.status === 304) break;
    const loc = res.headers.get('location');
    void res.body?.cancel().catch(() => undefined);
    if (!loc) break;
    let tiep: URL;
    try { tiep = new URL(loc, u); } catch { throw new LoiTai('chuyển hướng hỏng', 'CAM'); }
    if (laDangNhapGoogle(tiep.toString())) throw new LoiTai('cần đăng nhập', 'RIENG_TU', 401);
    if (!hostChoPhep(loai, tiep.hostname) || tiep.protocol !== 'https:') {
      throw new LoiTai(`chuyển hướng sang "${tiep.hostname}" — không theo`, 'CAM');
    }
    u = tiep;
    if (i === 4) throw new LoiTai('chuyển hướng quá nhiều lần', 'CAM');
  }
  if (!res) throw new LoiTai('không có phản hồi', 'MANG');
  if (res.status === 401 || res.status === 403 || res.status === 404) {
    void res.body?.cancel().catch(() => undefined);
    throw new LoiTai(`HTTP ${res.status}`, 'RIENG_TU', res.status);
  }
  if (!res.ok) {
    void res.body?.cancel().catch(() => undefined);
    throw new LoiTai(`máy chủ trả HTTP ${res.status}`, 'HTTP', res.status);
  }
  const khai = Number(res.headers.get('content-length'));
  if (Number.isFinite(khai) && khai > o.tranByte) {
    void res.body?.cancel().catch(() => undefined);
    throw new LoiTai(`tệp lớn hơn ${Math.round(o.tranByte / 1048576)}MB`, 'QUA_LON');
  }
  const doc = res.body?.getReader();
  const cuc: Uint8Array[] = [];
  let tong = 0;
  if (doc) {
    for (;;) {
      const { done, value } = await doc.read();
      if (done) break;
      tong += value.byteLength;
      if (tong > o.tranByte) { void doc.cancel(); throw new LoiTai(`tệp lớn hơn ${Math.round(o.tranByte / 1048576)}MB`, 'QUA_LON'); }
      cuc.push(value);
    }
  }
  return { byte: Buffer.concat(cuc), kieu: (res.headers.get('content-type') ?? '').toLowerCase(), url: u.toString(), status: res.status, dispo: res.headers.get('content-disposition') ?? '' };
}
