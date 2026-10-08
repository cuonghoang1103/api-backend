/**
 * ============================================================
 * ĐỌC `phien_ban.json` CỦA MỘT GAME CÀI RIÊNG (08/10/2026)
 * ============================================================
 *
 * Phần THUẦN (không đụng Electron, không đụng đĩa) của bộ cài game, tách ra
 * để test được bằng vitest.
 *
 * `phien_ban.json` đến từ mạng, nên mọi trường bị coi là dữ liệu lạ:
 *   • `version` đi vào ĐƯỜNG DẪN (`games/<ma>/<version>/`) ⇒ chỉ nhận chữ, số,
 *     dấu chấm, gạch ngang. Một `version: "../../.."` mà lọt qua là `rm -rf`
 *     ra ngoài thư mục game khi gỡ cài đặt.
 *   • `ten_app` cũng đi vào đường dẫn ⇒ một tên trần, đuôi `.app`, không `/`.
 *   • URL tương đối được phân giải theo URL của chính `phien_ban.json` — cho
 *     phép thử bằng máy chủ http cục bộ mà không phải sửa tệp. Chỉ nhận
 *     https, hoặc http tới máy mình (127.0.0.1/localhost) cho phép thử.
 *   • `sha256` là mỏ neo tin cậy: zip tải về phải khớp từng byte.
 */
import { isAbsolute, relative, resolve } from 'node:path';
import { z } from 'zod';
import type { TroChoiBanPhatHanh, TroChoiMedia } from '../../shared/ipc';

export const MAU_VERSION = /^[0-9A-Za-z][0-9A-Za-z.-]{0,39}$/;
const MAU_TEN_APP = /^[^/\\:]{1,80}\.app$/;

const chuHaiNgu = z.object({ vi: z.string().max(4000), en: z.string().max(4000) });

const schemaPhienBan = z.object({
  version: z.string().regex(MAU_VERSION),
  tep: z.string().max(200).optional(),
  url: z.string().max(2048).optional(),
  sha256: z.string().regex(/^[0-9a-fA-F]{64}$/),
  size: z.number().int().positive().max(8e9),
  size_giai_nen: z.number().int().positive().max(32e9).optional(),
  ngay: z.string().max(40),
  ghi_chu: chuHaiNgu,
  yeu_cau: z.string().max(200),
  ten_app: z.string().regex(MAU_TEN_APP),
  macos_toi_thieu: z.string().regex(/^\d{1,2}(\.\d{1,2})?$/).default('13.0'),
  kien_truc: z.array(z.enum(['arm64', 'x64'])).min(1).default(['arm64']),
  nhat_ky: z.array(z.object({
    version: z.string().max(40),
    ngay: z.string().max(40),
    vi: z.array(z.string().max(500)).max(40),
    en: z.array(z.string().max(500)).max(40),
  })).max(50).default([]),
  media: z.array(z.object({
    loai: z.enum(['anh', 'video']),
    url: z.string().max(2048),
    nho: z.string().max(2048).optional(),
    nguon: z.enum(['phim', 'game']),
    chu: chuHaiNgu.optional(),
  })).max(40).default([]),
});

export interface BanDayDu extends TroChoiBanPhatHanh {
  /** URL tuyệt đối của zip. */
  url: string;
  sha256: string;
  tenApp: string;
  macosToiThieu: string;
  kienTruc: ('arm64' | 'x64')[];
}

/** Có phải http tới chính máy này không — chỉ dùng cho phép thử cục bộ. */
function laMayMinh(u: URL): boolean {
  return u.hostname === '127.0.0.1' || u.hostname === 'localhost' || u.hostname === '[::1]';
}

/** Phân giải `raw` theo `goc`; trả `null` nếu không phải https (hoặc http máy mình). */
export function phanGiaiUrl(raw: string, goc: string): string | null {
  let u: URL;
  try {
    u = new URL(raw, goc);
  } catch {
    return null;
  }
  if (u.protocol === 'https:') return u.toString();
  if (u.protocol === 'http:' && laMayMinh(u)) return u.toString();
  return null;
}

/**
 * Kiểm + chuẩn hoá `phien_ban.json`. Ném `Error` với câu tiếng Việt đọc được
 * khi hỏng — giao diện in thẳng câu đó.
 */
export function docPhienBan(json: unknown, urlPhienBan: string): BanDayDu {
  const kq = schemaPhienBan.safeParse(json);
  if (!kq.success) {
    const dau = kq.error.issues[0];
    throw new Error(`Tệp phiên bản trên máy chủ sai dạng (${dau?.path.join('.') || '?'}).`);
  }
  const d = kq.data;
  const thoUrl = d.url ?? d.tep;
  if (!thoUrl) throw new Error('Tệp phiên bản không nói tải zip ở đâu (thiếu url/tep).');
  const url = phanGiaiUrl(thoUrl, urlPhienBan);
  if (!url) throw new Error('Địa chỉ tải game không phải https — từ chối.');

  const media: TroChoiMedia[] = [];
  for (const m of d.media) {
    const u = phanGiaiUrl(m.url, urlPhienBan);
    if (!u) continue; // bỏ riêng mục hỏng, không bỏ cả trang
    const nho = m.nho ? phanGiaiUrl(m.nho, urlPhienBan) : null;
    media.push({
      loai: m.loai,
      url: u,
      nguon: m.nguon,
      ...(nho ? { nho } : {}),
      ...(m.chu ? { chu: m.chu } : {}),
    });
  }

  return {
    version: d.version,
    size: d.size,
    ...(d.size_giai_nen ? { sizeGiaiNen: d.size_giai_nen } : {}),
    ngay: d.ngay,
    ghiChu: d.ghi_chu,
    yeuCau: d.yeu_cau,
    nhatKy: d.nhat_ky,
    media,
    url,
    sha256: d.sha256.toLowerCase(),
    tenApp: d.ten_app,
    macosToiThieu: d.macos_toi_thieu,
    kienTruc: d.kien_truc,
  };
}

/**
 * `con` có nằm TRONG `cha` không (sau khi chuẩn hoá). Chặn mọi đường dẫn mà
 * dữ liệu từ mạng có thể bẻ ra ngoài thư mục game.
 */
export function namTrong(cha: string, con: string): boolean {
  const r = relative(resolve(cha), resolve(con));
  return r !== '' && !r.startsWith('..') && !isAbsolute(r);
}

/**
 * Số hiệu macOS từ số hiệu nhân Darwin (`os.release()`).
 * Darwin 22 = macOS 13, 23 = 14, 24 = 15, rồi Apple nhảy thẳng lên 26 (Darwin 25).
 */
export function macosTuDarwin(darwin: string): number {
  const chinh = Number.parseInt(darwin.split('.')[0] ?? '', 10);
  if (!Number.isFinite(chinh)) return 0;
  return chinh >= 25 ? chinh + 1 : chinh - 9;
}

/** Máy này chạy được bản phát hành không. */
export function kiemHoTro(
  ban: Pick<BanDayDu, 'macosToiThieu' | 'kienTruc'> | null,
  may: { nenTang: string; kienTruc: string; darwin: string },
): { ok: boolean; lyDo?: string } {
  if (may.nenTang !== 'darwin') {
    return { ok: false, lyDo: 'Bản thử hiện chỉ có cho macOS (Apple Silicon). Bản Windows sẽ có sau.' };
  }
  const kienTruc = ban?.kienTruc ?? ['arm64'];
  if (!kienTruc.includes(may.kienTruc as 'arm64' | 'x64')) {
    return { ok: false, lyDo: 'Bản thử cần máy Mac chip Apple (M1 trở lên). Máy Mac chip Intel chưa được hỗ trợ.' };
  }
  const toiThieu = Number.parseInt((ban?.macosToiThieu ?? '13').split('.')[0] ?? '13', 10);
  const nay = macosTuDarwin(may.darwin);
  if (nay > 0 && nay < toiThieu) {
    return { ok: false, lyDo: `Cần macOS ${toiThieu} trở lên (máy này đang chạy macOS ${nay}).` };
  }
  return { ok: true };
}
