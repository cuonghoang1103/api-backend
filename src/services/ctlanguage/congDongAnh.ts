/**
 * CT Language — CỘNG ĐỒNG: ẢNH trong bài / câu trả lời (15/11/2026, giống Hanzii). docs/ct-language-app.md mục "Cộng đồng".
 *
 * Luồng: app gửi byte ảnh (`POST /cong-dong/anh`, thân = ảnh, như ảnh bìa CT Work — không presign, không phụ thuộc CORS)
 * ⇒ máy chủ kiểm bằng sharp: CHỈ JPEG/PNG/WebP/HEIF thật, xoay theo EXIF, BỎ metadata (GPS…), thu về cạnh dài ≤ 1600 px,
 * lưu JPEG ⇒ kho chung (R2 production; test/dev `STORAGE_SANDBOX` ⇒ kho giả) ⇒ một dòng `ctl_anh` CHƯA GẮN.
 * Đăng/sửa bài, trả lời gửi kèm `anh: [id…]` ⇒ `ganAnh` gắn (chỉ ảnh của chính mình, còn trống chỗ).
 *
 * Apple 1.2 cho ảnh:
 *   · BÁO CÁO từng ảnh (`baoCao` loại `anh`) — khoá `ctw-report:ctl_anh:<id>:<người báo>` ⇒ nút "Gỡ nội dung" của admin
 *     dùng được (kiemDuyetAdmin `ctl_anh`: ẩn + xoá tệp). Đủ `NGUONG_TU_AN` người ⇒ tự ẩn.
 *   · Ảnh đi THEO bài: bài ẩn (gỡ / đủ báo cáo / chặn người viết) ⇒ ảnh không còn đường nào trả ra.
 *   · Xoá bài/trả lời ⇒ xoá ảnh (tệp R2 + dòng). Ảnh tải lên mà không gắn ⇒ dọn sau 24 giờ.
 *   · Chưa có bộ lọc ẢNH tự động (chỉ lọc chữ) — chặn bằng báo cáo + tự ẩn + admin gỡ trong 24 giờ.
 */
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError } from '../../middleware/errorHandler.js';
import { getStorageProvider } from '../../storage/StorageProvider.js';
import { logger } from '../../utils/logger.js';

export const ANH_TOI_DA_BAI = 4;
export const ANH_TOI_DA_TRA_LOI = 2;
/** Thân ảnh tối đa (ảnh iPhone 12 MP JPEG ~3–6 MB; app đã thu nhỏ trước khi gửi). */
export const ANH_BYTE_TOI_DA = 10 * 1024 * 1024;
/** Ảnh tải lên chưa gắn tối đa mỗi người mỗi ngày — chặn dùng cộng đồng làm kho ảnh miễn phí. */
export const ANH_CHO_GAN_TOI_DA = 40;
const CANH_TOI_DA = 1600;
const DINH_DANG = new Set(['jpeg', 'png', 'webp', 'heif']);
const tienTo = (userId: number) => `ctlanguage/cong-dong/u${userId}/`;

/** Kho — test thay bằng bản giả (đếm put/delete). Mặc định là kho chung (R2 / sandbox). */
export interface KhoAnh { put(key: string, body: Buffer, ct: string): Promise<{ url: string }>; delMany(keys: string[]): Promise<void> }
const KHO_THAT: KhoAnh = {
  put: (key, body, ct) => getStorageProvider().put(key, body, ct),
  delMany: (keys) => getStorageProvider().deleteMany(keys),
};
let kho: KhoAnh = KHO_THAT;
export function __datKhoAnh(k: KhoAnh | null) { kho = k ?? KHO_THAT; }

export const CHON_ANH = { id: true, url: true, rong: true, cao: true } as const;
export type AnhGon = { id: number; url: string; rong: number; cao: number };
/** Điều kiện ảnh còn hiện (đặt trong `select: { anh: { where, orderBy, select } }`). */
export const ANH_HIEN = { where: { anLuc: null }, orderBy: [{ thuTu: 'asc' as const }, { id: 'asc' as const }], select: CHON_ANH };

/** Chuẩn hoá ảnh: kiểm định dạng thật, xoay EXIF, bỏ metadata, ≤ 1600 px, JPEG. Thuần (không đụng CSDL) — test được. */
export async function chuanHoaAnh(than: Buffer): Promise<{ jpg: Buffer; rong: number; cao: number }> {
  if (!than?.length) throw new BadRequestError('Chưa có ảnh — gửi byte ảnh làm thân yêu cầu.', 'CTL_CD_ANH_TRONG');
  if (than.length > ANH_BYTE_TOI_DA) throw new BadRequestError('Ảnh quá lớn (tối đa 10 MB).', 'CTL_CD_ANH_LON');
  let fmt: string | undefined;
  let w = 0, h = 0;
  try {
    const m = await sharp(than, { animated: false }).metadata();
    fmt = m.format; w = m.width ?? 0; h = m.height ?? 0;
  } catch { fmt = undefined; }
  if (!fmt || !DINH_DANG.has(fmt)) throw new BadRequestError('Chỉ nhận ảnh JPEG, PNG hoặc WebP.', 'CTL_CD_ANH_SAI');
  if (w < 16 || h < 16) throw new BadRequestError('Ảnh nhỏ quá.', 'CTL_CD_ANH_NHO');
  if (w / h > 8 || h / w > 8) throw new BadRequestError('Ảnh dài quá — cắt bớt rồi gửi lại nhé.', 'CTL_CD_ANH_TI_LE');
  const { data, info } = await sharp(than, { animated: false })
    .rotate()
    .resize({ width: CANH_TOI_DA, height: CANH_TOI_DA, fit: 'inside', withoutEnlargement: true })
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });
  return { jpg: data, rong: info.width, cao: info.height };
}

/** Tải một ảnh lên (chưa gắn bài). Trả `{id, url, rong, cao}` cho app xem trước + gửi kèm khi đăng. */
export async function taiAnh(userId: number, than: Buffer): Promise<AnhGon> {
  const homQua = new Date(Date.now() - 86_400_000);
  const cho = await prisma.ctlAnh.count({ where: { userId, baiId: null, traLoiId: null, createdAt: { gte: homQua } } });
  if (cho >= ANH_CHO_GAN_TOI_DA) throw new AppError('Bạn tải nhiều ảnh quá mà chưa đăng — đăng bài trước rồi tải tiếp nhé.', 429, 'CTL_CD_ANH_NHIEU');
  const { jpg, rong, cao } = await chuanHoaAnh(than);
  const khoa = `${tienTo(userId)}${randomUUID()}.jpg`;
  const { url } = await kho.put(khoa, jpg, 'image/jpeg');
  const r = await prisma.ctlAnh.create({ data: { userId, khoa, url, rong, cao, kichThuoc: jpg.length }, select: CHON_ANH });
  if (Math.random() < 0.05) void donAnhMoCoi().catch(() => undefined);
  return r;
}

/** Đọc `anh` từ thân yêu cầu: mảng id số nguyên dương, bỏ trùng, giữ thứ tự. `undefined` = không gửi (không đổi). */
export function docDsAnh(goc: unknown, toiDa: number): number[] | undefined {
  if (goc === undefined) return undefined;
  if (goc === null) return [];
  if (!Array.isArray(goc)) throw new BadRequestError('`anh` phải là danh sách id ảnh.', 'CTL_CD_ANH_DS');
  const ids = [...new Set(goc.map(Number))].filter((x) => Number.isInteger(x) && x > 0);
  if (ids.length !== goc.length) throw new BadRequestError('Danh sách ảnh có id không hợp lệ.', 'CTL_CD_ANH_DS');
  if (ids.length > toiDa) throw new BadRequestError(`Tối đa ${toiDa} ảnh.`, 'CTL_CD_ANH_QUA');
  return ids;
}

/**
 * Gắn danh sách ảnh `ids` (đúng thứ tự) vào bài hoặc câu trả lời. Chỉ ảnh của `userId`, chưa gắn nơi khác (hoặc đã gắn
 * đúng chỗ này — sửa bài). Ảnh đang gắn chỗ này mà không còn trong `ids` ⇒ xoá (tệp + dòng).
 */
type ChoGan = { baiId: number } | { traLoiId: number };

/** Mọi id ảnh phải là của `userId`, còn hiện, và chưa gắn nơi nào (hoặc đã gắn đúng `cho` — sửa bài). */
export async function kiemAnh(userId: number, ids: number[], cho: ChoGan | null) {
  if (!ids.length) return;
  const ds = await prisma.ctlAnh.findMany({ where: { id: { in: ids }, userId, anLuc: null }, select: { id: true, baiId: true, traLoiId: true } });
  const hopLe = ds.filter((a) => (a.baiId === null && a.traLoiId === null)
    || (cho !== null && ('baiId' in cho ? a.baiId === cho.baiId : a.traLoiId === cho.traLoiId)));
  if (hopLe.length !== ids.length) throw new BadRequestError('Có ảnh không còn hoặc không phải của bạn — chọn lại ảnh nhé.', 'CTL_CD_ANH_KHONG_CO');
}

export async function ganAnh(userId: number, cho: ChoGan, ids: number[]) {
  const choNay = 'baiId' in cho ? { baiId: cho.baiId } : { traLoiId: cho.traLoiId };
  await kiemAnh(userId, ids, cho);
  const bo = await prisma.ctlAnh.findMany({ where: { ...choNay, id: { notIn: ids.length ? ids : [0] } }, select: { id: true, khoa: true } });
  await prisma.$transaction([
    ...ids.map((id, i) => prisma.ctlAnh.update({ where: { id }, data: { ...choNay, thuTu: i } })),
    ...(bo.length ? [prisma.ctlAnh.deleteMany({ where: { id: { in: bo.map((a) => a.id) } } })] : []),
  ]);
  if (bo.length) await xoaTep(bo.map((a) => a.khoa));
}

/** Xoá mọi ảnh của bài (kể cả ảnh trong các câu trả lời của bài) hoặc của một câu trả lời: tệp + dòng. */
export async function xoaAnhCua(cho: ChoGan) {
  const where = 'baiId' in cho ? { OR: [{ baiId: cho.baiId }, { traLoi: { baiId: cho.baiId } }] } : { traLoiId: cho.traLoiId };
  const ds = await prisma.ctlAnh.findMany({ where, select: { id: true, khoa: true } });
  if (!ds.length) return 0;
  await prisma.ctlAnh.deleteMany({ where: { id: { in: ds.map((a) => a.id) } } });
  await xoaTep(ds.map((a) => a.khoa));
  return ds.length;
}

/** Admin gỡ một ảnh: ẩn dòng (đối chiếu báo cáo) + xoá tệp ngay (URL công khai không còn mở được). */
export async function goAnh(id: number, adminId: number): Promise<boolean> {
  const a = await prisma.ctlAnh.findUnique({ where: { id }, select: { khoa: true, anBoi: true } });
  if (!a || a.anBoi) return false;
  await prisma.ctlAnh.update({ where: { id }, data: { anLuc: new Date(), anBoi: adminId } });
  await xoaTep([a.khoa]);
  return true;
}

/** Ảnh tải lên quá 24 giờ mà không gắn ⇒ xoá. Chạy ngẫu nhiên khi có lượt tải (không cần cron). */
export async function donAnhMoCoi(truoc = new Date(Date.now() - 86_400_000)) {
  const ds = await prisma.ctlAnh.findMany({ where: { baiId: null, traLoiId: null, createdAt: { lt: truoc } }, select: { id: true, khoa: true }, take: 500 });
  if (!ds.length) return 0;
  await prisma.ctlAnh.deleteMany({ where: { id: { in: ds.map((a) => a.id) } } });
  await xoaTep(ds.map((a) => a.khoa));
  return ds.length;
}

async function xoaTep(khoa: string[]) {
  const ds = khoa.filter((k) => k.startsWith('ctlanguage/cong-dong/'));
  if (!ds.length) return;
  try { await kho.delMany(ds); } catch (e) { logger.warn('[ctl-cong-dong] xoá tệp ảnh lỗi', { n: ds.length, error: (e as Error)?.message }); }
}
