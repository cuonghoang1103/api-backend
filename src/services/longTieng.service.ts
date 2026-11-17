/**
 * CT Lồng Tiếng (18/11/2026) — hàng việc lồng tiếng Việt bằng giọng chủ kênh. Hợp đồng: docs/long-tieng-hop-dong.md
 * ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
 * Ba bên:
 *   • trang web /long-tieng + app "CT Lồng Tiếng" (JWT ADMIN hoặc mã kết nối `ctlt_…`) — tạo việc, xem tiến độ, tải kết quả;
 *   • trạm máy nhà (`tools/long-tieng-tram/`, header x-internal-token) — giành việc, báo tiến độ, đẩy kết quả, nhờ dịch;
 *   • R2 — tệp vào/ra ở khoá RIÊNG TƯ `long-tieng/<userId>/<jobId>/…` (jobId = UUID ngẫu nhiên ⇒ khoá không đoán được),
 *     đi bằng URL ký sẵn, không qua máy chủ này (video vài GB không ăn RAM API, không đụng trần 100 MB của Cloudflare).
 *
 * Vòng đời: cho_tai_len → (da-tai-len) → cho → (trạm nhận) tai → lam → xong | loi | huy.
 * Không giữ bản sao video người khác lâu: tệp vào xoá khi xong; tệp ra xoá khi app báo đã tải về, hoặc sau 7 ngày (cron).
 */
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import path from 'node:path';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import {
  deleteObjects, getObjectText, getSignedAttachmentUrl, getSignedDownloadUrl, getSignedReadUrl, getSignedUploadUrl, headObject, listObjects,
} from '../config/r2.js';
import { AppError, BadRequestError, ConflictError, NotFoundError } from '../middleware/errorHandler.js';
import { checkTokenQuota, llmComplete } from './interview/llm/index.js';
import { tachJson } from './voVietLai.service.js';
import { logger } from '../utils/logger.js';

// ─── Hằng số ───────────────────────────────────────────────────────────────

export const TRANG_THAI = ['cho_tai_len', 'cho', 'tai', 'lam', 'xong', 'loi', 'huy'] as const;
export type TrangThai = (typeof TRANG_THAI)[number];
export const LOAI_KET_QUA = ['vi', 'vi-goc', 'srt-vi', 'srt-goc', 'thong-tin'] as const;
export type LoaiKetQua = (typeof LOAI_KET_QUA)[number];
export const NHIP = ['cho-giong', 'tang-toc'] as const;
export const LOAI_NHAC = ['goc', 'thu-vien', 'tep', 'khong'] as const;
export type LoaiNhac = (typeof LOAI_NHAC)[number];
/** Nhạc thư viện: tệp + danh sách (kèm nguồn + giấy phép từng bài) ở R2 dưới tiền tố này. Cron dọn KHÔNG đụng vào. */
export const THU_MUC_NHAC = 'long-tieng/nhac/';
export const KHOA_DANH_SACH_NHAC = `${THU_MUC_NHAC}danh-sach.json`;
const TRAN_NHAC_BYTE = 300 * 1024 * 1024;

/** R2 nhận một PUT đơn tối đa ~5 GiB — quá thì phải multipart, app chưa cần. */
export const TRAN_TEP_BYTE = 5 * 1024 * 1024 * 1024;
/** Trạm im quá lâu ⇒ coi như chết, việc về hàng `cho`. */
export const NHIP_TIM_HET_MS = 20 * 60_000;
/** Giành lại quá số lần này mà vẫn mất nhịp tim ⇒ báo lỗi, không quay vòng mãi. */
export const TRAN_LAN_NHAN = 5;
export const GIU_TEP_NGAY = 7;
const HAN_TAI_LEN_GIAY = 6 * 3600;   // tệp vài GB qua mạng nhà chậm — URL PUT chỉ cần còn hạn lúc BẮT ĐẦU gửi
const HAN_VAO_GIAY = 6 * 3600;       // trạm có thể chờ GPU lâu trước khi tải
const HAN_KET_QUA_GIAY = 3600;       // hợp đồng: URL GET kết quả sống 1 giờ
const TRAN_MA_CON_HIEU_LUC = 20;
const DANG_CHAY: TrangThai[] = ['tai', 'lam'];

export const thuMucViec = (userId: number, id: string) => `long-tieng/${userId}/${id}/`;
const KIEU_HOP_LE = /^[\w.+-]+\/[\w.+-]+$/;
const KIEU_MAC_DINH: Record<LoaiKetQua, string> = {
  vi: 'video/mp4', 'vi-goc': 'video/mp4', 'srt-vi': 'application/x-subrip', 'srt-goc': 'application/x-subrip', 'thong-tin': 'application/json',
};

// ─── Kiểu ──────────────────────────────────────────────────────────────────

export interface TepVao { ten: string; kichThuoc: number; kieu: string }
interface KetQuaLuu { loai: LoaiKetQua; ten: string; kichThuoc: number; kieu: string; khoa: string | null }
export interface NhacNen { loai: LoaiNhac; id?: string; amLuong: number; tep?: TepVao }
/** Một bài trong thư viện nhạc (`long-tieng/nhac/danh-sach.json` → `bai[]`). */
export interface BaiNhac {
  id: string; ten: string; tamTrang: string; thoiLuong: number; khoa: string;
  nguon: string; giayPhep: string; tacGia?: string | null;
}
type Viec = Prisma.LongTiengViecGetPayload<object>;

export interface ViecDto {
  id: string;
  nguon: 'url' | 'tep';
  url: string | null;
  tep: TepVao | null;
  tenVideo: string | null;
  lang: string;
  goc: number;
  nhip: string;
  nhacNen: NhacNen;
  trangThai: TrangThai;
  buoc: string | null;
  phanTram: number;
  loi: string | null;
  ketQua: Array<{ loai: LoaiKetQua; ten: string; kichThuoc: number; url: string | null }>;
  thoiLuong: number | null;
  tao: string;
  xong: string | null;
  daTaiVe: string | null;
}

// ─── Tiện ích ──────────────────────────────────────────────────────────────

const loi410 = () => new AppError('Việc này không còn ở trạm (đã huỷ, đã xoá hoặc đã xếp lại hàng).', 410, 'LT_VIEC_KHONG_CON');

function chuoi(v: unknown, tran: number): string {
  // eslint-disable-next-line no-control-regex
  return String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, tran);
}

/** Tên tệp hiển thị: bỏ ký tự điều khiển + dấu gạch thư mục, giữ tiếng Việt/ngoặc vuông. */
function tenTep(v: unknown): string {
  return chuoi(v, 250).replace(/[/\\]/g, '-');
}

function soDuong(v: unknown): number | null {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function docTep(v: unknown): TepVao | null {
  if (!v || typeof v !== 'object') return null;
  const o = v as Record<string, unknown>;
  const kq: TepVao = { ten: tenTep(o.ten), kichThuoc: Number(o.kichThuoc) || 0, kieu: String(o.kieu ?? '') };
  return kq.ten ? kq : null;
}

/** Âm lượng mặc định: nhạc nền gốc giữ như bản mẫu (0,9); nhạc thay thế nhỏ hơn hẳn (còn tự né giọng). */
export const AM_LUONG_MAC_DINH: Record<LoaiNhac, number> = { goc: 0.9, 'thu-vien': 0.3, tep: 0.3, khong: 0 };

function docNhac(v: unknown): NhacNen {
  const o = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>;
  const loai = (LOAI_NHAC as readonly string[]).includes(String(o.loai)) ? (String(o.loai) as LoaiNhac) : 'goc';
  const amLuong = o.amLuong != null && Number.isFinite(Number(o.amLuong)) ? Number(o.amLuong) : AM_LUONG_MAC_DINH[loai];
  const tep = docTep(o.tep);
  return { loai, amLuong, ...(o.id ? { id: String(o.id) } : {}), ...(tep ? { tep } : {}) };
}

// ─── Thư viện nhạc ─────────────────────────────────────────────────────────

let dsNhacDem: { luc: number; bai: BaiNhac[] } | null = null;
/** Đọc danh sách nhạc (đệm 5 phút). Thiếu tệp danh sách ⇒ thư viện rỗng, không phải lỗi. */
export async function docDsNhac(boDem = false): Promise<BaiNhac[]> {
  if (!boDem && dsNhacDem && Date.now() - dsNhacDem.luc < 5 * 60_000) return dsNhacDem.bai;
  let bai: BaiNhac[] = [];
  try {
    const raw = await getObjectText(KHOA_DANH_SACH_NHAC);
    const o = raw ? JSON.parse(raw) : null;
    bai = (Array.isArray(o?.bai) ? o.bai : []).filter((b: BaiNhac) => b?.id && typeof b.khoa === 'string' && b.khoa.startsWith(THU_MUC_NHAC));
  } catch (e) {
    logger.warn('long-tieng: đọc danh sách nhạc lỗi', { loi: String(e) });
  }
  dsNhacDem = { luc: Date.now(), bai };
  return bai;
}

export async function thuVienNhac() {
  const bai = await docDsNhac();
  return Promise.all(bai.map(async (b) => ({
    id: b.id, ten: b.ten, tamTrang: b.tamTrang, thoiLuong: b.thoiLuong, nguon: b.nguon, giayPhep: b.giayPhep, tacGia: b.tacGia ?? null,
    nghe: await getSignedReadUrl(b.khoa).catch(() => null),
  })));
}

function docKetQua(v: unknown): KetQuaLuu[] {
  return Array.isArray(v) ? (v as KetQuaLuu[]) : [];
}

async function toDto(v: Viec): Promise<ViecDto> {
  const ketQua: ViecDto['ketQua'] = [];
  for (const k of docKetQua(v.ketQua)) {
    let url: string | null = null;
    if (k.khoa && !v.daTaiVe) {
      try { url = await getSignedAttachmentUrl(k.khoa, k.ten, HAN_KET_QUA_GIAY); } catch { url = null; }
    }
    ketQua.push({ loai: k.loai, ten: k.ten, kichThuoc: k.kichThuoc, url });
  }
  return {
    id: v.id,
    nguon: v.url ? 'url' : 'tep',
    url: v.url,
    tep: docTep(v.tep),
    tenVideo: v.tenVideo,
    lang: v.lang,
    goc: v.goc,
    nhip: v.nhip,
    nhacNen: docNhac(v.nhacNen),
    trangThai: v.trangThai as TrangThai,
    buoc: v.buoc,
    phanTram: v.phanTram,
    loi: v.loi,
    ketQua,
    thoiLuong: v.thoiLuong,
    tao: v.tao.toISOString(),
    xong: v.xong?.toISOString() ?? null,
    daTaiVe: v.daTaiVe?.toISOString() ?? null,
  };
}

async function cuaToi(userId: number, id: string): Promise<Viec> {
  const v = await prisma.longTiengViec.findFirst({ where: { id: String(id), userId } });
  if (!v) throw new NotFoundError('Không có việc này.');
  return v;
}

/** Xoá MỌI tệp R2 dưới thư mục của việc (liệt kê theo tiền tố ⇒ không sót tệp nào kể cả tệp trạm đẩy dở). */
export async function xoaTepCuaViec(userId: number, id: string, chiThuMucCon?: 'vao/' | 'ra/'): Promise<number> {
  const tienTo = thuMucViec(userId, id) + (chiThuMucCon ?? '');
  const ds = await listObjects(tienTo).catch((e) => { logger.warn('long-tieng: liệt kê R2 lỗi', { tienTo, loi: String(e) }); return []; });
  if (ds.length) await deleteObjects(ds.map((o) => o.key));
  return ds.length;
}

// ─── Web / app ─────────────────────────────────────────────────────────────

type TaiLen = { url: string; het: string; kieu: string };
const duoiCua = (ten: string) => (path.extname(ten).toLowerCase().match(/^\.[a-z0-9]{1,6}$/)?.[0]) ?? '';

async function docNhacVao(v: unknown): Promise<NhacNen> {
  if (v != null && (typeof v !== 'object' || Array.isArray(v))) throw new BadRequestError('nhacNen phải là object.', 'LT_NHAC');
  const o = (v ?? {}) as Record<string, unknown>;
  const loai = String(o.loai ?? 'goc');
  if (!(LOAI_NHAC as readonly string[]).includes(loai)) throw new BadRequestError('nhacNen.loai phải là goc, thu-vien, tep hoặc khong.', 'LT_NHAC');
  const nhac: NhacNen = { loai: loai as LoaiNhac, amLuong: AM_LUONG_MAC_DINH[loai as LoaiNhac] };
  if (o.amLuong != null) {
    const a = Number(o.amLuong);
    if (!Number.isFinite(a) || a < 0 || a > 1) throw new BadRequestError('nhacNen.amLuong phải trong 0..1.', 'LT_NHAC');
    nhac.amLuong = a;
  }
  if (nhac.loai === 'thu-vien') {
    const id = String(o.id ?? '');
    if (!(await docDsNhac()).some((b) => b.id === id)) throw new BadRequestError('Không có bài nhạc này trong thư viện.', 'LT_NHAC_ID');
    nhac.id = id;
  }
  if (nhac.loai === 'tep') {
    const t = docTep(o.tep);
    if (!t || !Number.isInteger(t.kichThuoc) || t.kichThuoc <= 0) throw new BadRequestError('nhacNen.tep cần { ten, kichThuoc, kieu }.', 'LT_NHAC_TEP');
    if (t.kichThuoc > TRAN_NHAC_BYTE) throw new BadRequestError('Tệp nhạc quá 300 MB.', 'LT_NHAC_TEP');
    t.kieu = t.kieu.trim() || 'application/octet-stream';
    if (!KIEU_HOP_LE.test(t.kieu)) throw new BadRequestError('nhacNen.tep.kieu phải là kiểu MIME (vd audio/mpeg).', 'LT_NHAC_TEP');
    nhac.tep = t;
  }
  return nhac;
}

export async function taoViec(userId: number, body: Record<string, unknown>): Promise<{ job: ViecDto; taiLen?: TaiLen; taiLenNhac?: TaiLen }> {
  const url = body.url == null || body.url === '' ? null : chuoi(body.url, 2000);
  const tep = body.tep == null ? null : docTep(body.tep);
  if (!!url === !!tep) throw new BadRequestError('Cần ĐÚNG MỘT trong hai: "url" (link video) hoặc "tep" (tệp tải lên).', 'LT_NGUON');
  if (url && !/^https?:\/\/[^\s]+$/i.test(url)) throw new BadRequestError('Link phải bắt đầu bằng http:// hoặc https://', 'LT_URL');
  const lang = String(body.lang ?? 'auto');
  if (!['auto', 'zh', 'en'].includes(lang)) throw new BadRequestError('lang phải là auto, zh hoặc en.', 'LT_LANG');
  const goc = body.goc == null ? 0.15 : Number(body.goc);
  if (!Number.isFinite(goc) || goc < 0 || goc > 0.4) throw new BadRequestError('goc (âm lượng giọng gốc) phải trong 0..0,4.', 'LT_GOC');
  const nhip = String(body.nhip ?? 'cho-giong');
  if (!(NHIP as readonly string[]).includes(nhip)) throw new BadRequestError('nhip phải là cho-giong hoặc tang-toc.', 'LT_NHIP');
  const tenVideo = chuoi(body.tenVideo, 300) || (tep ? tep.ten.replace(/\.[^.]{1,6}$/, '') : null);
  const nhac = await docNhacVao(body.nhacNen);

  const id = randomUUID();
  let khoaVao: string | null = null;
  if (tep) {
    if (!Number.isInteger(tep.kichThuoc) || tep.kichThuoc <= 0) throw new BadRequestError('tep.kichThuoc phải là số byte > 0.', 'LT_TEP');
    if (tep.kichThuoc > TRAN_TEP_BYTE) throw new BadRequestError('Tệp quá 5 GB — hãy cắt nhỏ hoặc nén lại.', 'LT_TEP_LON');
    tep.kieu = tep.kieu.trim() || 'application/octet-stream';
    if (!KIEU_HOP_LE.test(tep.kieu)) throw new BadRequestError('tep.kieu phải là kiểu MIME (vd video/mp4).', 'LT_TEP_KIEU');
    khoaVao = `${thuMucViec(userId, id)}vao/goc${duoiCua(tep.ten)}`;
  }
  const khoaNhac = nhac.tep ? `${thuMucViec(userId, id)}vao/nhac${duoiCua(nhac.tep.ten)}` : null;
  const choTaiLen = !!(khoaVao || khoaNhac);

  const v = await prisma.longTiengViec.create({
    data: {
      id, userId, url, tep: tep ? (tep as unknown as Prisma.InputJsonValue) : Prisma.DbNull, khoaVao, tenVideo, lang, goc, nhip,
      nhacNen: nhac as unknown as Prisma.InputJsonValue, khoaNhac,
      trangThai: choTaiLen ? 'cho_tai_len' : 'cho',
      buoc: choTaiLen ? 'Chờ tải tệp lên' : 'Chờ trạm nhận việc',
    },
  });
  const ra: { job: ViecDto; taiLen?: TaiLen; taiLenNhac?: TaiLen } = { job: await toDto(v) };
  const het = new Date(Date.now() + HAN_TAI_LEN_GIAY * 1000).toISOString();
  if (tep && khoaVao) ra.taiLen = { url: await getSignedUploadUrl(khoaVao, tep.kieu, HAN_TAI_LEN_GIAY), het, kieu: tep.kieu };
  if (nhac.tep && khoaNhac) ra.taiLenNhac = { url: await getSignedUploadUrl(khoaNhac, nhac.tep.kieu, HAN_TAI_LEN_GIAY), het, kieu: nhac.tep.kieu };
  return ra;
}

export async function dsViec(userId: number): Promise<ViecDto[]> {
  const ds = await prisma.longTiengViec.findMany({ where: { userId }, orderBy: { tao: 'desc' }, take: 200 });
  return Promise.all(ds.map(toDto));
}

export async function layViec(userId: number, id: string): Promise<ViecDto> {
  return toDto(await cuaToi(userId, id));
}

export async function daTaiLen(userId: number, id: string): Promise<ViecDto> {
  const v = await cuaToi(userId, id);
  if (v.trangThai !== 'cho_tai_len' || (!v.khoaVao && !v.khoaNhac)) throw new ConflictError('Việc này không chờ tải tệp lên.');
  const h = v.khoaVao ? await headObject(v.khoaVao) : null;
  if (v.khoaVao && (!h || h.size <= 0)) throw new AppError('Chưa thấy tệp video trên kho — tải lên chưa xong hoặc đã hỏng.', 409, 'LT_CHUA_CO_TEP');
  const hn = v.khoaNhac ? await headObject(v.khoaNhac) : null;
  if (v.khoaNhac && (!hn || hn.size <= 0)) throw new AppError('Chưa thấy tệp nhạc nền trên kho — tải lên chưa xong hoặc đã hỏng.', 409, 'LT_CHUA_CO_NHAC');
  const tep = docTep(v.tep);
  const nhac = docNhac(v.nhacNen);
  if (hn && nhac.tep) nhac.tep.kichThuoc = hn.size;
  const moi = await prisma.longTiengViec.update({
    where: { id: v.id },
    data: {
      trangThai: 'cho', buoc: 'Chờ trạm nhận việc',
      ...(tep && h ? { tep: { ...tep, kichThuoc: h.size } as unknown as Prisma.InputJsonValue } : {}),
      ...(hn ? { nhacNen: nhac as unknown as Prisma.InputJsonValue } : {}),
    },
  });
  return toDto(moi);
}

export async function thuLai(userId: number, id: string): Promise<ViecDto> {
  const v = await cuaToi(userId, id);
  if (v.trangThai !== 'loi') throw new ConflictError('Chỉ thử lại được việc đang lỗi.');
  if ((v.khoaVao && !(await headObject(v.khoaVao))) || (v.khoaNhac && !(await headObject(v.khoaNhac)))) {
    throw new AppError('Tệp đã tải lên bị xoá khỏi kho (quá 7 ngày?) — hãy tạo việc mới và tải tệp lên lại.', 409, 'LT_MAT_TEP_VAO');
  }
  const moi = await prisma.longTiengViec.update({
    where: { id: v.id },
    data: { trangThai: 'cho', loi: null, phanTram: 0, buoc: 'Chờ trạm nhận lại (giữ các bước đã xong)', soLanNhan: 0, nhipTim: null },
  });
  return toDto(moi);
}

/** Đang chạy ở trạm ⇒ đánh dấu `huy` (trạm thấy 410 ở nhịp tim kế tiếp thì dừng); còn lại ⇒ xoá hẳn. Luôn xoá mọi tệp R2. */
export async function xoaViec(userId: number, id: string): Promise<{ xoa: boolean; huy: boolean; soTep: number }> {
  const v = await cuaToi(userId, id);
  const dangChay = DANG_CHAY.includes(v.trangThai as TrangThai);
  if (dangChay) {
    await prisma.longTiengViec.update({ where: { id: v.id }, data: { trangThai: 'huy', buoc: 'Đã huỷ', ketQua: Prisma.DbNull, khoaVao: null, khoaNhac: null } });
  } else {
    await prisma.longTiengViec.delete({ where: { id: v.id } });
  }
  const soTep = await xoaTepCuaViec(userId, v.id);
  return { xoa: !dangChay, huy: dangChay, soTep };
}

export async function daTaiVe(userId: number, id: string): Promise<ViecDto> {
  const v = await cuaToi(userId, id);
  if (v.trangThai !== 'xong') throw new ConflictError('Việc chưa xong.');
  await xoaTepCuaViec(userId, v.id);
  const moi = await prisma.longTiengViec.update({
    where: { id: v.id },
    data: { daTaiVe: v.daTaiVe ?? new Date(), ketQua: docKetQua(v.ketQua).map((k) => ({ ...k, khoa: null })) as unknown as Prisma.InputJsonValue },
  });
  return toDto(moi);
}

// ─── Trạm ──────────────────────────────────────────────────────────────────

export interface ViecChoTram {
  id: string; url: string | null; tep: TepVao | null; tenVideo: string | null; lang: string; goc: number; nhip: string;
  nhacNen: NhacNen & { ten?: string }; soLanNhan: number; tao: string;
}

/** Việc `tai/lam` im quá 20 phút ⇒ về `cho` (hoặc `loi` nếu đã giành quá nhiều lần). Trả số việc đã xếp lại. */
export async function xepLaiViecMatNhip(now = new Date()): Promise<number> {
  const moc = new Date(now.getTime() - NHIP_TIM_HET_MS);
  const cu = { trangThai: { in: DANG_CHAY }, OR: [{ nhipTim: { lt: moc } }, { nhipTim: null, capNhat: { lt: moc } }] };
  await prisma.longTiengViec.updateMany({
    where: { ...cu, soLanNhan: { gte: TRAN_LAN_NHAN } },
    data: { trangThai: 'loi', loi: `Trạm mất liên lạc ${TRAN_LAN_NHAN} lần liền khi làm việc này — bấm Thử lại khi trạm ổn định.` },
  });
  const r = await prisma.longTiengViec.updateMany({ where: cu, data: { trangThai: 'cho', buoc: 'Trạm mất nhịp tim — xếp lại hàng' } });
  return r.count;
}

export async function nhanViec(): Promise<{ job: ViecChoTram; vao?: { url: string }; nhac?: { url: string } } | null> {
  await xepLaiViecMatNhip();
  const rows = await prisma.$queryRaw<Array<{ id: string }>>`
    UPDATE "long_tieng_viec"
       SET "trang_thai" = 'tai', "buoc" = 'Trạm đã nhận việc', "phan_tram" = 0, "nhip_tim" = NOW(),
           "so_lan_nhan" = "so_lan_nhan" + 1, "updated_at" = NOW()
     WHERE "id" = (SELECT "id" FROM "long_tieng_viec" WHERE "trang_thai" = 'cho'
                    ORDER BY "created_at" ASC LIMIT 1 FOR UPDATE SKIP LOCKED)
 RETURNING "id"`;
  if (!rows.length) return null;
  const v = await prisma.longTiengViec.findUniqueOrThrow({ where: { id: rows[0]!.id } });
  const nhacNen: ViecChoTram['nhacNen'] = docNhac(v.nhacNen);
  let khoaNhac = v.khoaNhac;
  if (nhacNen.loai === 'thu-vien') {
    const bai = (await docDsNhac()).find((b) => b.id === nhacNen.id);
    // Bài bị gỡ khỏi thư viện sau khi tạo việc ⇒ lùi về nhạc nền gốc (vẫn ra video) thay vì hỏng cả việc.
    if (bai) { khoaNhac = bai.khoa; nhacNen.ten = bai.ten; } else { nhacNen.loai = 'goc'; nhacNen.amLuong = AM_LUONG_MAC_DINH.goc; }
  }
  const job: ViecChoTram = {
    id: v.id, url: v.url, tep: docTep(v.tep), tenVideo: v.tenVideo, lang: v.lang, goc: v.goc, nhip: v.nhip, nhacNen,
    soLanNhan: v.soLanNhan, tao: v.tao.toISOString(),
  };
  const ra: { job: ViecChoTram; vao?: { url: string }; nhac?: { url: string } } = { job };
  if (v.khoaVao) ra.vao = { url: await getSignedDownloadUrl(v.khoaVao, HAN_VAO_GIAY) };
  if (khoaNhac && (nhacNen.loai === 'thu-vien' || nhacNen.loai === 'tep')) ra.nhac = { url: await getSignedDownloadUrl(khoaNhac, HAN_VAO_GIAY) };
  return ra;
}

async function dangChayOTram(id: string): Promise<Viec> {
  const v = await prisma.longTiengViec.findUnique({ where: { id: String(id) } });
  if (!v || !DANG_CHAY.includes(v.trangThai as TrangThai)) throw loi410();
  return v;
}

export async function tienDo(id: string, body: Record<string, unknown>): Promise<{ ok: true }> {
  const trangThai = String(body.trangThai ?? 'lam');
  if (!DANG_CHAY.includes(trangThai as TrangThai)) throw new BadRequestError('trangThai phải là tai hoặc lam.');
  const phanTram = Math.max(0, Math.min(99, Math.round(Number(body.phanTram) || 0)));
  const tenVideo = chuoi(body.tenVideo, 300);
  const r = await prisma.longTiengViec.updateMany({
    where: { id: String(id), trangThai: { in: DANG_CHAY } },
    data: { trangThai, buoc: chuoi(body.buoc, 200) || null, phanTram, nhipTim: new Date(), ...(tenVideo ? { tenVideo } : {}) },
  });
  if (!r.count) throw loi410();
  return { ok: true };
}

function docDsTep(v: unknown): Array<{ loai: LoaiKetQua; ten: string; kichThuoc: number; kieu: string }> {
  if (!Array.isArray(v) || !v.length || v.length > LOAI_KET_QUA.length) throw new BadRequestError(`Cần 1..${LOAI_KET_QUA.length} tệp.`);
  const thay = new Set<string>();
  return v.map((x) => {
    const o = (x ?? {}) as Record<string, unknown>;
    const loai = String(o.loai) as LoaiKetQua;
    if (!LOAI_KET_QUA.includes(loai)) throw new BadRequestError(`loai không hợp lệ: ${String(o.loai)}`);
    if (thay.has(loai)) throw new BadRequestError(`loai trùng: ${loai}`);
    thay.add(loai);
    const ten = tenTep(o.ten);
    if (!ten) throw new BadRequestError(`Thiếu tên tệp cho ${loai}.`);
    const kieu = String(o.kieu ?? '').trim() || KIEU_MAC_DINH[loai];
    if (!KIEU_HOP_LE.test(kieu)) throw new BadRequestError(`kieu không hợp lệ cho ${loai}.`);
    const kichThuoc = Number(o.kichThuoc) || 0;
    if (kichThuoc > TRAN_TEP_BYTE) throw new BadRequestError(`${loai} quá 5 GB.`);
    return { loai, ten, kichThuoc, kieu };
  });
}

/** Khoá R2 của một tệp kết quả: theo LOẠI (mỗi việc mỗi loại một tệp), đuôi lấy từ tên hiển thị. */
export function khoaKetQua(userId: number, id: string, loai: LoaiKetQua, ten: string): string {
  const duoi = path.extname(ten).toLowerCase().match(/^\.[a-z0-9]{1,6}$/)?.[0] ?? '';
  return `${thuMucViec(userId, id)}ra/${loai}${duoi}`;
}

export async function lenKetQua(id: string, body: Record<string, unknown>): Promise<{ tep: Array<{ loai: LoaiKetQua; url: string; kieu: string; het: string }> }> {
  const v = await dangChayOTram(id);
  const ds = docDsTep(body.tep);
  const het = new Date(Date.now() + HAN_TAI_LEN_GIAY * 1000).toISOString();
  const tep = await Promise.all(ds.map(async (t) => ({
    loai: t.loai, kieu: t.kieu, het, url: await getSignedUploadUrl(khoaKetQua(v.userId, v.id, t.loai, t.ten), t.kieu, HAN_TAI_LEN_GIAY),
  })));
  await prisma.longTiengViec.update({ where: { id: v.id }, data: { nhipTim: new Date() } });
  return { tep };
}

export async function xongViec(id: string, body: Record<string, unknown>): Promise<ViecDto> {
  const v = await dangChayOTram(id);
  const ds = docDsTep(body.ketQua);
  const ketQua: KetQuaLuu[] = [];
  for (const t of ds) {
    const khoa = khoaKetQua(v.userId, v.id, t.loai, t.ten);
    const h = await headObject(khoa);
    if (!h) throw new BadRequestError(`Chưa thấy tệp ${t.loai} trên kho — PUT lên trước rồi mới báo xong.`, 'LT_THIEU_KET_QUA');
    ketQua.push({ ...t, kichThuoc: h.size, khoa });
  }
  const tenVideo = chuoi(body.tenVideo, 300);
  const moi = await prisma.longTiengViec.update({
    where: { id: v.id },
    data: {
      trangThai: 'xong', buoc: chuoi(body.buoc, 200) || 'Xong', phanTram: 100, loi: null, xong: new Date(), nhipTim: new Date(),
      thoiLuong: soDuong(body.thoiLuong), ketQua: ketQua as unknown as Prisma.InputJsonValue, khoaVao: null, khoaNhac: null,
      ...(tenVideo ? { tenVideo } : {}),
    },
  });
  // Tệp vào hết việc ⇒ xoá ngay (không giữ bản sao video người khác lâu hơn cần).
  await xoaTepCuaViec(v.userId, v.id, 'vao/').catch((e) => logger.warn('long-tieng: xoá tệp vào lỗi', { id: v.id, loi: String(e) }));
  return toDto(moi);
}

export async function baoLoi(id: string, body: Record<string, unknown>): Promise<{ ok: true }> {
  const v = await dangChayOTram(id);
  const loi = String(body.loi ?? '').trim().slice(-2000) || 'Trạm báo lỗi không rõ lý do.';
  await prisma.longTiengViec.update({ where: { id: v.id }, data: { trangThai: 'loi', loi, nhipTim: new Date() } });
  return { ok: true };
}

// ─── Dịch (trạm không giữ khoá LLM) ────────────────────────────────────────

export interface CauDich { i: number; giay: number; toiDa: number; src: string }
const TRAN_CAU_MOT_LO = 60;

export function promptDich(ngonNgu: string, cau: CauDich[], truoc: string): string {
  const tenNgu = ngonNgu === 'zh' ? 'tiếng Trung' : ngonNgu === 'en' ? 'tiếng Anh' : `ngôn ngữ "${ngonNgu}"`;
  return `Bạn lồng tiếng Việt cho video kiến thức kỹ thuật (${tenNgu}) để một sinh viên Việt tự học.
Dịch MỖI câu sang tiếng Việt NÓI tự nhiên, dễ hiểu, đúng thuật ngữ. Giữ nguyên thuật ngữ/tên riêng tiếng Anh quen dùng (CPU, RAM, PCIe, chipset, BIOS, VRM, M.2, USB, API, Docker…); tên tiếng Trung của sản phẩm thì dùng tên tiếng Anh nếu biết.
ĐỘ DÀI là bắt buộc: "toiDa" = số ký tự tối đa để đọc kịp trong "giay" giây với nhịp nói bình thường — ngắn gọn hơn bản gốc nếu cần, bỏ từ đệm, nhưng không bỏ ý chính. Không thêm giải thích.
Ngữ cảnh câu trước: ${truoc || '(đầu video)'}
Trả về DUY NHẤT JSON: {"ds":[{"i":số,"vi":"…"}]} đủ ${cau.length} câu.
${JSON.stringify(cau)}`;
}

function docCauDich(v: unknown): CauDich[] {
  if (!Array.isArray(v) || !v.length) throw new BadRequestError('Cần "cau" là mảng không rỗng.');
  if (v.length > TRAN_CAU_MOT_LO) throw new BadRequestError(`Tối đa ${TRAN_CAU_MOT_LO} câu mỗi lô.`);
  return v.map((x) => {
    const o = (x ?? {}) as Record<string, unknown>;
    const i = Number(o.i);
    if (!Number.isInteger(i) || i < 0) throw new BadRequestError('Mỗi câu cần "i" là số nguyên ≥ 0.');
    return { i, giay: Math.max(0, Number(o.giay) || 0), toiDa: Math.max(4, Math.round(Number(o.toiDa) || 0)), src: chuoi(o.src, 1500) };
  });
}

/** Một lượt gọi model cho một lô; trả map i → câu Việt (có thể thiếu câu — nơi gọi tự hỏi lại phần thiếu). */
async function goiDich(userId: number, ngonNgu: string, cau: CauDich[], truoc: string): Promise<Map<number, string>> {
  const kq = await llmComplete({
    step: 'generation', feature: 'creator', purpose: 'long_tieng_dich', userId,
    system: 'Bạn là biên dịch viên lồng tiếng. Chỉ trả về JSON đúng khuôn được yêu cầu.',
    messages: [{ role: 'user', content: promptDich(ngonNgu, cau, truoc) }],
    maxTokens: Math.min(12_000, 800 + cau.length * 160), timeoutMs: 150_000, maxRetries: 2,
  });
  const o = tachJson(kq?.text ?? '');
  const ra = new Map<number, string>();
  const can = new Set(cau.map((c) => c.i));
  for (const d of Array.isArray(o?.ds) ? (o!.ds as Array<Record<string, unknown>>) : []) {
    const i = Number(d?.i);
    const vi = chuoi(d?.vi, 2000);
    if (can.has(i) && vi) ra.set(i, vi);
  }
  return ra;
}

let goiDichImpl = goiDich;
/** Chỉ test dùng: thay lời gọi model (test KHÔNG BAO GIỜ gọi cổng LLM thật). */
export const _chiDeKiemThu = { datGoiDich: (fn: typeof goiDich | null) => { goiDichImpl = fn ?? goiDich; } };

export async function dich(body: Record<string, unknown>): Promise<{ ds: Array<{ i: number; vi: string }> }> {
  const v = await dangChayOTram(String(body.jobId ?? ''));
  const ngonNgu = chuoi(body.ngonNgu, 8) || 'auto';
  const cau = docCauDich(body.cau);
  const truoc = chuoi(body.truoc, 1500);
  if (!(await checkTokenQuota(v.userId))) throw new AppError('Hết hạn mức token AI hôm nay.', 429, 'LT_HET_HAN_MUC');

  const ra = await goiDichImpl(v.userId, ngonNgu, cau, truoc);
  const thieu = cau.filter((c) => !ra.has(c.i));
  if (thieu.length) {
    // Model bỏ sót vài câu ⇒ hỏi lại ĐÚNG phần thiếu một lần (bản mẫu: dịch lại cả lô — tốn gấp mấy lần).
    const bu = await goiDichImpl(v.userId, ngonNgu, thieu, truoc);
    for (const [i, vi] of bu) ra.set(i, vi);
  }
  const conThieu = cau.filter((c) => !ra.has(c.i)).map((c) => c.i);
  if (conThieu.length) throw new AppError(`Model bỏ sót ${conThieu.length} câu (${conThieu.slice(0, 8).join(', ')}) — thử lại lô này.`, 502, 'LT_DICH_THIEU');
  await prisma.longTiengViec.update({ where: { id: v.id }, data: { nhipTim: new Date() } });
  return { ds: cau.map((c) => ({ i: c.i, vi: ra.get(c.i)! })) };
}

// ─── Mã kết nối app ────────────────────────────────────────────────────────

export const bamMa = (ma: string) => createHash('sha256').update(ma).digest('hex');

export async function taoMa(userId: number, ten: unknown): Promise<{ id: number; ma: string; ten: string | null; dau: string; tao: string }> {
  const conHieuLuc = await prisma.longTiengMaKetNoi.count({ where: { userId, thuHoi: null } });
  if (conHieuLuc >= TRAN_MA_CON_HIEU_LUC) throw new ConflictError(`Đã có ${TRAN_MA_CON_HIEU_LUC} mã còn hiệu lực — thu hồi bớt mã cũ trước.`);
  const ma = `ctlt_${randomBytes(24).toString('base64url')}`;
  const r = await prisma.longTiengMaKetNoi.create({ data: { userId, ten: chuoi(ten, 100) || null, bam: bamMa(ma), dau: ma.slice(0, 9) } });
  return { id: r.id, ma, ten: r.ten, dau: r.dau, tao: r.tao.toISOString() };
}

export async function dsMa(userId: number) {
  const ds = await prisma.longTiengMaKetNoi.findMany({ where: { userId }, orderBy: { tao: 'desc' }, take: 100 });
  return ds.map((m) => ({
    id: m.id, ten: m.ten, dau: m.dau, tao: m.tao.toISOString(), dungLanCuoi: m.dungLanCuoi?.toISOString() ?? null, thuHoi: m.thuHoi?.toISOString() ?? null,
  }));
}

export async function thuHoiMa(userId: number, id: number): Promise<{ ok: true }> {
  const r = await prisma.longTiengMaKetNoi.updateMany({ where: { id, userId, thuHoi: null }, data: { thuHoi: new Date() } });
  if (!r.count) throw new NotFoundError('Không có mã này (hoặc đã thu hồi).');
  return { ok: true };
}

/**
 * Xác thực `ctlt_…`. Trả user khi mã còn hiệu lực VÀ chủ mã vẫn là ADMIN đang hoạt động — mất vai ADMIN / bị khoá ⇒ mã
 * chết theo ngay (không chờ thu hồi tay).
 */
export async function xacThucMa(ma: string): Promise<{ userId: number; username: string; email: string; roleVersion: number } | { loi: 401 | 403 }> {
  if (!/^ctlt_[A-Za-z0-9_-]{16,64}$/.test(ma)) return { loi: 401 };
  const m = await prisma.longTiengMaKetNoi.findUnique({
    where: { bam: bamMa(ma) },
    include: { user: { select: { id: true, username: true, email: true, enabled: true, accountNonLocked: true, kind: true, roleVersion: true, roles: { include: { role: true } } } } },
  });
  if (!m || m.thuHoi) return { loi: 401 };
  const u = m.user;
  const laAdmin = u.roles.some((r) => r.role.name.toUpperCase().replace('ROLE_', '') === 'ADMIN');
  if (!u.enabled || !u.accountNonLocked || u.kind === 'AGENT' || !laAdmin) return { loi: 403 };
  if (!m.dungLanCuoi || Date.now() - m.dungLanCuoi.getTime() > 5 * 60_000) {
    await prisma.longTiengMaKetNoi.update({ where: { id: m.id }, data: { dungLanCuoi: new Date() } }).catch(() => {});
  }
  return { userId: u.id, username: u.username, email: u.email, roleVersion: Number(u.roleVersion ?? 0) };
}

// ─── Dọn tự động (cron mỗi giờ) ────────────────────────────────────────────

/**
 * 1. việc `cho_tai_len` quá 24 giờ (app tắt giữa chừng) ⇒ xoá việc + tệp dở;
 * 2. việc `huy` quá 1 ngày ⇒ xoá dòng (tệp đã xoá lúc huỷ);
 * 3. việc `xong` quá 7 ngày chưa tải về ⇒ xoá tệp kết quả, giữ dòng (lịch sử);
 * 4. việc `loi` quá 7 ngày ⇒ xoá tệp vào (thử lại sẽ báo cần tải lên lại);
 * 5. quét tiền tố `long-tieng/`: tệp > 7 ngày không thuộc việc đang chạy/chờ ⇒ xoá (bắt cả tệp mồ côi khi user bị xoá).
 */
export async function donDep(now = new Date()): Promise<{ xoaViec: number; xoaTep: number }> {
  const truoc = (ms: number) => new Date(now.getTime() - ms);
  let xoaViecN = 0, xoaTepN = 0;

  const treo = await prisma.longTiengViec.findMany({ where: { trangThai: 'cho_tai_len', tao: { lt: truoc(24 * 3600_000) } }, select: { id: true, userId: true } });
  for (const v of treo) { xoaTepN += await xoaTepCuaViec(v.userId, v.id); }
  if (treo.length) xoaViecN += (await prisma.longTiengViec.deleteMany({ where: { id: { in: treo.map((v) => v.id) } } })).count;
  xoaViecN += (await prisma.longTiengViec.deleteMany({ where: { trangThai: 'huy', capNhat: { lt: truoc(24 * 3600_000) } } })).count;

  const han = truoc(GIU_TEP_NGAY * 24 * 3600_000);
  const xongCu = await prisma.longTiengViec.findMany({ where: { trangThai: 'xong', daTaiVe: null, xong: { lt: han } } });
  for (const v of xongCu) {
    const kq = docKetQua(v.ketQua);
    if (!kq.some((k) => k.khoa)) continue;
    xoaTepN += await xoaTepCuaViec(v.userId, v.id);
    await prisma.longTiengViec.update({
      where: { id: v.id },
      data: { buoc: `Tệp kết quả đã quá ${GIU_TEP_NGAY} ngày — đã xoá khỏi kho`, ketQua: kq.map((k) => ({ ...k, khoa: null })) as unknown as Prisma.InputJsonValue },
    });
  }
  const loiCu = await prisma.longTiengViec.findMany({
    where: { trangThai: 'loi', capNhat: { lt: han }, OR: [{ khoaVao: { not: null } }, { khoaNhac: { not: null } }] }, select: { id: true, userId: true },
  });
  for (const v of loiCu) { xoaTepN += await xoaTepCuaViec(v.userId, v.id); }

  // Quét mồ côi: chỉ khi R2 bật; không đụng việc còn đang chờ/chạy.
  try {
    const ds = await listObjects('long-tieng/');
    // Thư viện nhạc (`long-tieng/nhac/`) là tài sản lâu dài, không phải tệp của việc — không bao giờ dọn.
    const cu = ds.filter((o) => o.lastModified && o.lastModified < han && !o.key.startsWith(THU_MUC_NHAC));
    if (cu.length) {
      const ids = [...new Set(cu.map((o) => o.key.split('/')[2]).filter(Boolean))] as string[];
      const conSong = new Set((await prisma.longTiengViec.findMany({
        where: { id: { in: ids }, trangThai: { in: ['cho_tai_len', 'cho', 'tai', 'lam'] } }, select: { id: true },
      })).map((v) => v.id));
      const xoa = cu.filter((o) => !conSong.has(o.key.split('/')[2] ?? '')).map((o) => o.key);
      if (xoa.length) { await deleteObjects(xoa); xoaTepN += xoa.length; }
    }
  } catch (e) {
    logger.warn('long-tieng: quét mồ côi R2 lỗi', { loi: String(e) });
  }
  return { xoaViec: xoaViecN, xoaTep: xoaTepN };
}
