/**
 * Vở — hai mảnh đồng bộ còn thiếu (16/11/2026, đợt 5a "không mất dữ liệu"):
 *
 *   1. BIA MỘ (tombstone) của môn / cuốn đã xoá.
 *      `NoteSubject`/`NoteChapter` KHÔNG có xoá mềm, nên sau khi một máy xoá cuốn, máy THỨ HAI (còn bản cũ) đẩy cây
 *      lên là `/vo/sync` upsert theo clientId TẠO LẠI cuốn/môn — rồi máy thứ nhất kéo về thấy nó sống lại. Bia mộ
 *      ghi "clientId này đã bị xoá lúc …"; `/vo/sync` gặp clientId có bia mộ thì KHÔNG tạo lại mà trả `daXoa: true`.
 *
 *   2. MEDIA của trang: ảnh DÁN (`AnhDanVo.swift`) + GHI ÂM buổi học (`GhiAmBuoiHoc.swift`, kèm mốc từng nét).
 *      Trước đợt này chúng chỉ sống trên máy — đổi máy / cài lại app là mất.
 *
 * ⚠️ CẢ HAI CHƯA CÓ CỘT TRONG POSTGRES — cố ý, để vá không cần migration (đợt 5a cấm đổi schema). Chúng là object
 * JSON trên R2 (riêng tư, đọc bằng URL ký sẵn), cạnh nét vẽ:
 *
 *   notes/u<uid>/vo/bia-mo.json                 — { mon: {clientId: ISO}, cuon: {clientId: ISO} }
 *   notes/u<uid>/vo-media-ds/<noteId>.json      — danh sách media của MỘT trang (manifest)
 *   notes/u<uid>/vo-media/<noteId>/<sha256>.<đuôi> — từng tệp, khoá theo NỘI DUNG (đẩy lại = không tốn gì)
 *
 * Đề xuất về sau (cần migration, CHƯA làm): cột `deletedAt` cho `note_subjects`/`note_chapters` (thay bia mộ) và
 * bảng `vo_media` (thay manifest) — xem báo cáo đợt 5a. Bia mộ R2 là đọc–sửa–ghi: hai máy xoá CÙNG LÚC có thể
 * làm rơi một dòng (hiếm; hậu quả = cuốn đó có thể sống lại như trước đợt này, không mất dữ liệu).
 */
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import {
  getR2Client, putObject, headObject, getObjectText, getSignedUploadUrl, getSignedReadUrl,
  listObjects, deleteObjects,
} from '../config/r2.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

// ─── 1. Bia mộ ─────────────────────────────────────────────────────────

/** Giữ bia mộ bao lâu. Máy nào im lặng lâu hơn thế mới mở lại thì cuốn đã xoá có thể sống lại — chấp nhận. */
const GIU_BIA_MO_NGAY = 180;

export interface BiaMo {
  mon: Record<string, string>;
  cuon: Record<string, string>;
}

function khoaBiaMo(userId: number): string {
  return `notes/u${userId}/vo/bia-mo.json`;
}

/** clientId do iOS sinh là chữ HOA (`UUID().uuidString`); so sánh luôn theo chữ thường. */
export function chuanId(v: string): string {
  return v.trim().toLowerCase();
}

/**
 * Đọc bia mộ. Phân biệt "chưa có tệp" (⇒ rỗng) với "đọc hỏng" (⇒ NÉM) — đọc hỏng mà coi là rỗng rồi ghi đè thì
 * mất sạch bia mộ cũ.
 */
async function docBiaMoGoc(userId: number): Promise<BiaMo> {
  const rong: BiaMo = { mon: {}, cuon: {} };
  if (!config.r2.enabled) return rong;
  try {
    const res = await getR2Client().send(new GetObjectCommand({ Bucket: config.r2.bucketName, Key: khoaBiaMo(userId) }));
    const text = (await res.Body?.transformToString('utf-8')) ?? '';
    const j = JSON.parse(text || '{}') as Partial<BiaMo>;
    return {
      mon: j.mon && typeof j.mon === 'object' ? j.mon : {},
      cuon: j.cuon && typeof j.cuon === 'object' ? j.cuon : {},
    };
  } catch (e) {
    const ten = (e as { name?: string; Code?: string })?.name ?? (e as { Code?: string })?.Code;
    if (ten === 'NoSuchKey' || ten === 'NotFound' || (e as { $metadata?: { httpStatusCode?: number } })?.$metadata?.httpStatusCode === 404) {
      return rong;
    }
    if (e instanceof SyntaxError) {
      logger.warn(`[vo] bia mộ của u${userId} hỏng JSON — coi như rỗng`);
      return rong;
    }
    throw e;
  }
}

/** Đọc cho `/vo/sync` và `/vo`: hỏng thì coi như RỖNG (không chặn đồng bộ vì một tệp phụ). */
export async function docBiaMo(userId: number): Promise<BiaMo> {
  try {
    return await docBiaMoGoc(userId);
  } catch (e) {
    logger.warn(`[vo] đọc bia mộ u${userId} hỏng: ${String(e)}`);
    return { mon: {}, cuon: {} };
  }
}

async function ghiBiaMo(userId: number, b: BiaMo): Promise<void> {
  await putObject(khoaBiaMo(userId), Buffer.from(JSON.stringify(b)), 'application/json', 'private, no-store');
}

function catCu(m: Record<string, string>, nay: number): Record<string, string> {
  const han = nay - GIU_BIA_MO_NGAY * 24 * 3600 * 1000;
  const ra: Record<string, string> = {};
  for (const [k, v] of Object.entries(m)) if (Date.parse(v) >= han) ra[k] = v;
  return ra;
}

/** Thêm bia mộ. Lỗi R2 KHÔNG làm hỏng lệnh xoá (hàng DB đã xoá rồi) — chỉ ghi log. */
export async function themBiaMo(userId: number, loai: { mon?: string[]; cuon?: string[] }): Promise<void> {
  if (!config.r2.enabled) return;
  const mon = (loai.mon ?? []).map(chuanId).filter(Boolean);
  const cuon = (loai.cuon ?? []).map(chuanId).filter(Boolean);
  if (!mon.length && !cuon.length) return;
  try {
    const b = await docBiaMoGoc(userId);
    const luc = new Date().toISOString();
    const nay = Date.now();
    for (const id of mon) b.mon[id] = luc;
    for (const id of cuon) b.cuon[id] = luc;
    await ghiBiaMo(userId, { mon: catCu(b.mon, nay), cuon: catCu(b.cuon, nay) });
  } catch (e) {
    logger.warn(`[vo] ghi bia mộ u${userId} hỏng: ${String(e)}`);
  }
}

/** Gỡ bia mộ — người dùng "Khôi phục lên máy chủ" trang của cuốn/môn đã xoá. */
export async function goBiaMo(userId: number, loai: { mon?: string[]; cuon?: string[] }): Promise<void> {
  if (!config.r2.enabled) return;
  const mon = (loai.mon ?? []).map(chuanId);
  const cuon = (loai.cuon ?? []).map(chuanId);
  if (!mon.length && !cuon.length) return;
  const b = await docBiaMoGoc(userId);
  let doi = false;
  for (const id of mon) if (b.mon[id]) { delete b.mon[id]; doi = true; }
  for (const id of cuon) if (b.cuon[id]) { delete b.cuon[id]; doi = true; }
  if (doi) await ghiBiaMo(userId, b);
}

// ─── 2. Media của trang (ảnh dán + ghi âm) ─────────────────────────────

const DUOI_MEDIA: Record<string, { mime: string; tran: number; loai: 'anh' | 'tieng' }> = {
  png: { mime: 'image/png', tran: 15 * 1024 * 1024, loai: 'anh' },
  jpg: { mime: 'image/jpeg', tran: 15 * 1024 * 1024, loai: 'anh' },
  // 32kbps mono AAC ≈ 14MB/giờ ⇒ 200MB ≈ 14 giờ — trần chặn client hỏng, không chặn buổi học thật.
  m4a: { mime: 'audio/mp4', tran: 200 * 1024 * 1024, loai: 'tieng' },
};
const TRAN_ANH_MOT_TRANG = 200;
const TRAN_MOC_NET = 50_000;

export function thuMucMedia(userId: number, noteId: number): string {
  return `notes/u${userId}/vo-media/${noteId}/`;
}
export function khoaDsMedia(userId: number, noteId: number): string {
  return `notes/u${userId}/vo-media-ds/${noteId}.json`;
}
function thuMucDsMedia(userId: number): string {
  return `notes/u${userId}/vo-media-ds/`;
}

/** Khoá media hợp lệ của ĐÚNG trang này: `<thư mục trang><sha256>.<đuôi>`. */
export function khoaMediaHopLe(key: unknown, userId: number, noteId: number, loai: 'anh' | 'tieng'): key is string {
  if (typeof key !== 'string') return false;
  const goc = thuMucMedia(userId, noteId);
  if (!key.startsWith(goc)) return false;
  const m = /^([0-9a-f]{64})\.(png|jpg|m4a)$/.exec(key.slice(goc.length));
  return !!m && DUOI_MEDIA[m[2]].loai === loai;
}

async function trangCuaNguoi(userId: number, noteId: number): Promise<void> {
  if (!Number.isInteger(noteId) || noteId <= 0) throw new AppError('Mã trang không hợp lệ', 400, 'INVALID_ID');
  const t = await prisma.note.findFirst({ where: { id: noteId, userId, deletedAt: null }, select: { id: true } });
  if (!t) throw new AppError('Không tìm thấy trang', 404, 'NOTE_NOT_FOUND');
}

function canKho(): void {
  if (!config.r2.enabled) throw new AppError('Máy chủ chưa cấu hình kho tệp', 503, 'STORAGE_UNAVAILABLE');
}

/** Xin URL đẩy MỘT tệp media (khoá theo sha256 ⇒ đã có thì `daCo: true`, khỏi đẩy). */
export async function xinDuongMedia(
  userId: number, noteId: number, sha256: string, duoi: string, soByte: number,
): Promise<{ khoa: string; url: string | null; daCo: boolean; expiresIn: number }> {
  canKho();
  const sha = String(sha256 || '').toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(sha)) throw new AppError('sha256 không hợp lệ', 400, 'INVALID_INPUT');
  const d = String(duoi || '').toLowerCase();
  const loai = DUOI_MEDIA[d];
  if (!loai) throw new AppError('Chỉ nhận png, jpg, m4a', 400, 'INVALID_INPUT');
  const n = Number(soByte);
  if (!Number.isFinite(n) || n <= 0) throw new AppError('Thiếu kích thước tệp', 400, 'INVALID_INPUT');
  if (n > loai.tran) throw new AppError(`Tệp quá ${Math.round(loai.tran / 1024 / 1024)}MB`, 413, 'FILE_TOO_LARGE');
  await trangCuaNguoi(userId, noteId);

  const khoa = `${thuMucMedia(userId, noteId)}${sha}.${d}`;
  if (await headObject(khoa)) return { khoa, url: null, daCo: true, expiresIn: 0 };
  const url = await getSignedUploadUrl(khoa, loai.mime, 900);
  return { khoa, url, daCo: false, expiresIn: 900 };
}

export interface AnhMedia { id: string; khoa: string; x: number; y: number; rong: number; cao: number; nguon: string | null; luc: number }
export interface GhiAmMedia { khoa: string; dai: number; mocNet: number[] }
export interface DsMedia { v: 1; anh: AnhMedia[]; ghiAm: GhiAmMedia | null; phien: string; luc: string }

function so(v: unknown, ten: string): number {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new AppError(`${ten} không hợp lệ`, 400, 'INVALID_INPUT');
  return n;
}

/** Kiểm + chuẩn hoá thân `POST /vo/trang/:id/media`. Thuần — có kiểm thử. */
export function chuanDsMedia(userId: number, noteId: number, than: unknown): Omit<DsMedia, 'luc'> {
  const b = (than ?? {}) as Record<string, unknown>;
  const anhVao = Array.isArray(b.anh) ? b.anh : [];
  if (anhVao.length > TRAN_ANH_MOT_TRANG) throw new AppError(`Quá ${TRAN_ANH_MOT_TRANG} ảnh trên một trang`, 400, 'TOO_MANY');
  const anh: AnhMedia[] = anhVao.map((a) => {
    const o = (a ?? {}) as Record<string, unknown>;
    const id = typeof o.id === 'string' ? o.id.trim() : '';
    if (!/^[0-9a-fA-F-]{16,64}$/.test(id)) throw new AppError('id ảnh không hợp lệ', 400, 'INVALID_INPUT');
    if (!khoaMediaHopLe(o.khoa, userId, noteId, 'anh')) throw new AppError('Khoá ảnh không hợp lệ', 400, 'INVALID_KEY');
    const rong = so(o.rong, 'rong'), cao = so(o.cao, 'cao');
    if (rong <= 0 || cao <= 0) throw new AppError('Kích thước ảnh không hợp lệ', 400, 'INVALID_INPUT');
    return {
      id, khoa: o.khoa as string, x: so(o.x, 'x'), y: so(o.y, 'y'), rong, cao,
      nguon: typeof o.nguon === 'string' && o.nguon.trim() ? o.nguon.trim().slice(0, 300) : null,
      luc: Number.isFinite(Number(o.luc)) ? Number(o.luc) : 0,
    };
  });
  let ghiAm: GhiAmMedia | null = null;
  if (b.ghiAm != null) {
    const g = b.ghiAm as Record<string, unknown>;
    if (!khoaMediaHopLe(g.khoa, userId, noteId, 'tieng')) throw new AppError('Khoá ghi âm không hợp lệ', 400, 'INVALID_KEY');
    const moc = Array.isArray(g.mocNet) ? g.mocNet : [];
    if (moc.length > TRAN_MOC_NET) throw new AppError('Quá nhiều mốc nét', 400, 'TOO_MANY');
    ghiAm = {
      khoa: g.khoa as string,
      dai: Math.max(0, so(g.dai, 'dai')),
      mocNet: moc.map((v) => { const n = Number(v); return Number.isFinite(n) ? n : -1; }),
    };
  }
  const phien = typeof b.phien === 'string' ? b.phien.slice(0, 64) : '';
  return { v: 1, anh, ghiAm, phien };
}

/**
 * Ghi danh sách media của trang. Mọi tệp được nhắc tới PHẢI đã nằm trên kho (HEAD) — thiếu thì 409
 * `MEDIA_MISSING` kèm danh sách, máy đẩy lại đúng các tệp đó. Không tin lời client (cùng lý do `xacNhanNet`).
 */
export async function luuDsMedia(userId: number, noteId: number, than: unknown): Promise<{ luc: string; phien: string }> {
  canKho();
  await trangCuaNguoi(userId, noteId);
  const ds = chuanDsMedia(userId, noteId, than);
  const khoa = [...new Set([...ds.anh.map((a) => a.khoa), ...(ds.ghiAm ? [ds.ghiAm.khoa] : [])])];
  const co = await Promise.all(khoa.map((k) => headObject(k)));
  const thieu = khoa.filter((_, i) => !co[i]);
  if (thieu.length) throw new AppError('Thiếu tệp media trên kho', 409, 'MEDIA_MISSING', { thieu });

  const luc = new Date().toISOString();
  const ghi: DsMedia = { ...ds, luc };
  await putObject(khoaDsMedia(userId, noteId), Buffer.from(JSON.stringify(ghi)), 'application/json', 'private, no-store');

  // Dọn tệp KHÔNG còn được nhắc tới (ghi âm lại thay bản cũ, gỡ ảnh dán). Chỉ dọn tệp cũ hơn 1 giờ: máy khác có
  // thể vừa đẩy tệp mới mà chưa kịp ghi danh sách của nó.
  void (async () => {
    const giu = new Set(khoa);
    const han = Date.now() - 3600 * 1000;
    const ton = await listObjects(thuMucMedia(userId, noteId));
    const xoa = ton.filter((o) => !giu.has(o.key) && (o.lastModified?.getTime() ?? 0) < han).map((o) => o.key);
    if (xoa.length) await deleteObjects(xoa);
  })().catch((e) => logger.warn(`[vo] dọn media cũ của trang ${noteId} hỏng: ${String(e)}`));

  return { luc, phien: ds.phien };
}

/** Đọc danh sách media + URL đọc ký sẵn cho từng tệp. `ds: null` = trang chưa có media trên máy chủ. */
export async function layDsMedia(userId: number, noteId: number): Promise<{ ds: DsMedia | null; urls: Record<string, string> }> {
  canKho();
  await trangCuaNguoi(userId, noteId);
  const text = await getObjectText(khoaDsMedia(userId, noteId), 4 * 1024 * 1024);
  if (!text) return { ds: null, urls: {} };
  let ds: DsMedia;
  try { ds = JSON.parse(text) as DsMedia; } catch { return { ds: null, urls: {} }; }
  const khoa = [...new Set([...(ds.anh ?? []).map((a) => a.khoa), ...(ds.ghiAm ? [ds.ghiAm.khoa] : [])])];
  const urls: Record<string, string> = {};
  await Promise.all(khoa.map(async (k) => { urls[k] = await getSignedReadUrl(k); }));
  return { ds, urls };
}

/** noteId → lúc danh sách media đổi gần nhất (ISO). MỘT lượt liệt kê cho cả người dùng — `/vo` dùng để máy biết
 *  trang nào cần tải media về, khỏi hỏi từng trang. R2 hỏng ⇒ rỗng (không chặn kéo cây). */
export async function lucMediaTheoTrang(userId: number): Promise<Map<number, string>> {
  const ra = new Map<number, string>();
  if (!config.r2.enabled) return ra;
  try {
    const goc = thuMucDsMedia(userId);
    for (const o of await listObjects(goc)) {
      const m = /^(\d+)\.json$/.exec(o.key.slice(goc.length));
      if (m) ra.set(Number(m[1]), (o.lastModified ?? new Date(0)).toISOString());
    }
  } catch (e) {
    logger.warn(`[vo] liệt kê media u${userId} hỏng: ${String(e)}`);
  }
  return ra;
}

/** Khoá media cần dọn khi một trang bị xoá HẲN (job thùng rác 30 ngày). */
export async function khoaMediaCanDon(trangs: Array<{ id: number; userId: number }>): Promise<string[]> {
  const ra: string[] = [];
  for (let i = 0; i < trangs.length; i += 5) {
    const lo = trangs.slice(i, i + 5);
    const ds = await Promise.all(lo.map((t) => listObjects(thuMucMedia(t.userId, t.id)).catch(() => [])));
    for (const d of ds) for (const o of d) ra.push(o.key);
    for (const t of lo) ra.push(khoaDsMedia(t.userId, t.id));
  }
  return ra;
}
