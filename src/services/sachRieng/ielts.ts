/**
 * 🔒 Tài liệu riêng IELTS (12/11/2026) — video/audio/PDF khoá IELTS thương mại cũ, gắn vào bài của khoá IELTS
 * tự soạn, CHỈ tài khoản được phép xem (cùng cổng `coQuyen` với 📷 Sách gốc Dekiru).
 * ─────────────────────────────────────────────────────────────────────────
 * Trên R2 (mọi tệp MÃ HOÁ bằng `SACH_RIENG_KHOA`, bucket được CDN phục vụ công khai theo tên khoá):
 *   rieng/sach/ielts/danh-muc.bin            SR1  JSON `DanhMucIelts`
 *   rieng/sach/ielts/media/<id>.bin          SR2  video mp4 / audio (chia khúc 1 MiB — đọc được một KHOẢNG để tua)
 *   rieng/sach/ielts/trang/<id>/p-001.bin    SR1  ảnh WebP từng trang PDF
 *
 * Mọi byte đi qua backend; không URL ký. Thẻ <video>/<audio> của app desktop (`app://`) không mang được cookie
 * ⇒ thêm VÉ ngắn hạn HMAC (`taoVe`/`kiemVe`, khoá dẫn xuất từ SACH_RIENG_KHOA — không thêm env mới).
 *
 * Tệp này KHÔNG import prisma — script tải lên (scripts/sach-rieng/ielts-len.mts) chạy trên máy nhà dùng lại nó.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { config } from '../../config/env.js';
import { getR2Client } from '../../config/r2.js';
import { logger } from '../../utils/logger.js';
import { giaiMa, khoaTuEnv } from './maHoa.js';
import { CO_DAU_SR2, docDauSR2, docKhoangSR2, type DauSR2 } from './maHoaKhuc.js';

export const TIEN_TO_IELTS = 'rieng/sach/ielts/';
export const khoaR2Ielts = {
  danhMuc: `${TIEN_TO_IELTS}danh-muc.bin`,
  media: (id: string) => `${TIEN_TO_IELTS}media/${id}.bin`,
  trang: (id: string, p: number) => `${TIEN_TO_IELTS}trang/${id}/p-${String(p).padStart(3, '0')}.bin`,
};

/* ── Danh mục ───────────────────────────────────────────────────────── */

export type LoaiTaiLieuIelts = 'video' | 'audio' | 'pdf';
export type MocIelts = { giay: number; ghiChu: string };
export type BaiGanIelts = { lessonId: string; trongTam: string; moc?: MocIelts[] };
export type MucIelts = {
  id: string;
  loai: LoaiTaiLieuIelts;
  tieuDe: string;
  /** Tên khoá / bộ tài liệu gốc (vd "Khoá Reading online"). */
  nguon: string;
  nhom?: string;
  tomTat?: string;
  baiGan: BaiGanIelts[];
  /** Pipeline điền: */
  thoiLuongGiay?: number;
  soTrang?: number;
  /** Byte BẢN RÕ (sau chuyển mã) — với pdf là tổng ảnh trang. */
  kichThuoc: number;
  /** Content-Type khi phát (video/mp4, audio/mpeg, audio/mp4…). */
  mime?: string;
  /** Băm tệp nguồn + phiên bản xử lý — script tải lên dùng để bỏ qua tệp đã có. */
  bamNguon?: string;
};
export type DanhMucIelts = { phienBan: 1; capNhat?: string; muc: MucIelts[] };

export const ID_HOP_LE = /^[a-z0-9][a-z0-9-]{0,79}$/;
const LESSON_HOP_LE = /^[a-z0-9][a-z0-9-]{0,79}$/;

/**
 * Kiểm + chuẩn hoá danh mục (dùng ở script tải lên VÀ khi backend đọc về). Ném lỗi kèm danh sách chỗ sai.
 * `canSoLieu` = true ⇒ đòi đủ kichThuoc (+ soTrang với pdf) — bản đã qua pipeline.
 */
export function kiemDanhMucIelts(raw: unknown, canSoLieu = false): DanhMucIelts {
  const loi: string[] = [];
  const r = raw as { phienBan?: unknown; muc?: unknown; capNhat?: unknown };
  if (!r || typeof r !== 'object' || !Array.isArray(r.muc)) throw new Error('Danh mục IELTS: cần { phienBan: 1, muc: [...] }');
  const daCo = new Set<string>();
  const muc: MucIelts[] = [];
  const chu = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  r.muc.forEach((x0, k) => {
    const x = (x0 ?? {}) as Record<string, unknown>;
    const id = chu(x.id, 80);
    const ten = `muc[${k}]${id ? ` (${id})` : ''}`;
    if (!ID_HOP_LE.test(id)) loi.push(`${ten}: id phải khớp ${ID_HOP_LE}`);
    else if (daCo.has(id)) loi.push(`${ten}: id trùng`);
    daCo.add(id);
    const loai = x.loai as LoaiTaiLieuIelts;
    if (!['video', 'audio', 'pdf'].includes(loai)) loi.push(`${ten}: loai phải là video|audio|pdf`);
    const tieuDe = chu(x.tieuDe, 300);
    if (!tieuDe) loi.push(`${ten}: thiếu tieuDe`);
    const nguon = chu(x.nguon, 200);
    if (!nguon) loi.push(`${ten}: thiếu nguon`);
    const baiGan: BaiGanIelts[] = [];
    if (!Array.isArray(x.baiGan)) loi.push(`${ten}: baiGan phải là mảng (có thể rỗng)`);
    else x.baiGan.forEach((b0, j) => {
      const b = (b0 ?? {}) as Record<string, unknown>;
      const lessonId = chu(b.lessonId, 80);
      if (!LESSON_HOP_LE.test(lessonId)) { loi.push(`${ten}.baiGan[${j}]: lessonId sai`); return; }
      const moc: MocIelts[] = [];
      if (b.moc !== undefined && !Array.isArray(b.moc)) loi.push(`${ten}.baiGan[${j}]: moc phải là mảng`);
      for (const m0 of Array.isArray(b.moc) ? b.moc : []) {
        const m = (m0 ?? {}) as Record<string, unknown>;
        const giay = Number(m.giay);
        if (!Number.isFinite(giay) || giay < 0) { loi.push(`${ten}.baiGan[${j}]: moc.giay sai`); continue; }
        moc.push({ giay: Math.round(giay * 10) / 10, ghiChu: chu(m.ghiChu, 300) });
      }
      if (moc.length && loai === 'pdf') loi.push(`${ten}.baiGan[${j}]: pdf không có mốc thời gian`);
      baiGan.push({ lessonId, trongTam: chu(b.trongTam, 2000), ...(moc.length ? { moc: moc.sort((p, q) => p.giay - q.giay) } : {}) });
    });
    const so = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : undefined);
    const m: MucIelts = {
      id, loai, tieuDe, nguon, baiGan, kichThuoc: so(x.kichThuoc) ?? 0,
      ...(chu(x.nhom, 120) ? { nhom: chu(x.nhom, 120) } : {}),
      ...(chu(x.tomTat, 4000) ? { tomTat: chu(x.tomTat, 4000) } : {}),
      ...(so(x.thoiLuongGiay) !== undefined ? { thoiLuongGiay: so(x.thoiLuongGiay) } : {}),
      ...(so(x.soTrang) !== undefined ? { soTrang: Math.floor(so(x.soTrang)!) } : {}),
      ...(chu(x.mime, 60) && /^(video|audio)\/[a-z0-9.+-]+$/.test(chu(x.mime, 60)) ? { mime: chu(x.mime, 60) } : {}),
      ...(chu(x.bamNguon, 100) ? { bamNguon: chu(x.bamNguon, 100) } : {}),
    };
    if (canSoLieu) {
      if (!m.kichThuoc && loai !== 'pdf') loi.push(`${ten}: thiếu kichThuoc`);
      if (loai === 'pdf' && !(m.soTrang && m.soTrang > 0)) loi.push(`${ten}: thiếu soTrang`);
    }
    muc.push(m);
  });
  if (loi.length) throw new Error(`Danh mục IELTS sai ${loi.length} chỗ:\n- ${loi.slice(0, 40).join('\n- ')}`);
  return { phienBan: 1, ...(typeof r.capNhat === 'string' ? { capNhat: r.capNhat } : {}), muc };
}

export const mimeCua = (m: Pick<MucIelts, 'loai' | 'mime'>) => m.mime ?? (m.loai === 'video' ? 'video/mp4' : 'audio/mpeg');

/** Bản gửi trình duyệt: bỏ trường nội bộ (bamNguon). */
export function choTrinhDuyet(m: MucIelts) {
  const { bamNguon: _b, ...con } = m;
  return con;
}

/* ── Đọc R2 ─────────────────────────────────────────────────────────── */

const laKhongCo = (e: unknown) => ['NoSuchKey', 'NotFound'].includes((e as { name?: string }).name ?? '') || (e as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 404;

async function taiR2(key: string, range?: string): Promise<Buffer | null> {
  try {
    const res = await getR2Client().send(new GetObjectCommand({ Bucket: config.r2.bucketName, Key: key, ...(range ? { Range: range } : {}) }));
    return Buffer.from(await res.Body!.transformToByteArray());
  } catch (e) {
    if (laKhongCo(e)) return null;
    logger.warn('sachRieng/ielts: đọc R2 hỏng', { key, error: (e as Error).message });
    throw e;
  }
}

let dmDem: { luc: number; dm: DanhMucIelts } | null = null;
const DM_SONG_MS = 5 * 60_000;

/** Danh mục (đệm 5 phút). Chưa tải lên / thiếu khoá ⇒ danh mục rỗng. */
export async function danhMucIelts(): Promise<DanhMucIelts> {
  if (dmDem && Date.now() - dmDem.luc < DM_SONG_MS) return dmDem.dm;
  const khoa = khoaTuEnv();
  let dm: DanhMucIelts = { phienBan: 1, muc: [] };
  if (khoa && config.r2.enabled) {
    const b = await taiR2(khoaR2Ielts.danhMuc);
    if (b) dm = kiemDanhMucIelts(JSON.parse(giaiMa(b, khoa).toString('utf8')));
  }
  dmDem = { luc: Date.now(), dm };
  return dm;
}
export function _xoaDemIelts() { dmDem = null; dauDem.clear(); khucDem.clear(); trangDem.clear(); }

export async function mucIelts(id: string): Promise<MucIelts | null> {
  if (!ID_HOP_LE.test(id)) return null;
  return (await danhMucIelts()).muc.find((m) => m.id === id) ?? null;
}

export async function mucCuaBai(lessonId: string): Promise<MucIelts[]> {
  if (!LESSON_HOP_LE.test(lessonId)) return [];
  return (await danhMucIelts()).muc.filter((m) => m.baiGan.some((b) => b.lessonId === lessonId));
}

/* Ảnh trang PDF (SR1) — đệm LRU nhỏ. */
const trangDem = new Map<string, Buffer>();
export async function anhTrangIelts(id: string, p: number): Promise<Buffer | null> {
  const m = await mucIelts(id);
  if (!m || m.loai !== 'pdf' || !Number.isInteger(p) || p < 1 || p > (m.soTrang ?? 0)) return null;
  const key = khoaR2Ielts.trang(id, p);
  const hit = trangDem.get(key);
  if (hit) { trangDem.delete(key); trangDem.set(key, hit); return hit; }
  const khoa = khoaTuEnv();
  const b = khoa ? await taiR2(key) : null;
  if (!b || !khoa) return null;
  const du = giaiMa(b, khoa);
  trangDem.set(key, du);
  while (trangDem.size > 40) trangDem.delete(trangDem.keys().next().value!);
  return du;
}

/* Media (SR2): đầu tệp đệm theo id, khúc đã giải mã đệm LRU (~32 MiB) để tua tới lui không tải lại. */
const dauDem = new Map<string, { luc: number; dau: DauSR2 }>();
const khucDem = new Map<string, Buffer>();
const KHUC_DEM_TOI_DA = 32;
/** Trần mỗi phản hồi: 8 khúc (= 8 MiB với khúc 1 MiB). Trình duyệt tự xin tiếp phần sau. */
export const KHUC_MOI_PHAN_HOI = 8;

export async function dauMedia(id: string, lamMoi = false): Promise<DauSR2 | null> {
  const d = dauDem.get(id);
  if (!lamMoi && d && Date.now() - d.luc < DM_SONG_MS) return d.dau;
  const b = await taiR2(khoaR2Ielts.media(id), `bytes=0-${CO_DAU_SR2 - 1}`);
  if (!b) return null;
  const dau = docDauSR2(b);
  dauDem.set(id, { luc: Date.now(), dau });
  return dau;
}

/** Đọc bản rõ [a,b] của media `id` (b bị kẹp ≤ KHUC_MOI_PHAN_HOI khúc). Đầu tệp đổi (tải lên lại) ⇒ đọc lại đầu một lần. */
export async function docMedia(id: string, dau: DauSR2, a: number, b: number): Promise<{ a: number; b: number; du: Buffer; dau: DauSR2 }> {
  const khoa = khoaTuEnv();
  if (!khoa) throw new Error('Thiếu SACH_RIENG_KHOA');
  const key = khoaR2Ielts.media(id);
  const doc = (d: DauSR2) => docKhoangSR2(khoa, d, a, b, async (tu, den) => {
    // Đệm theo KHÚC (bản mã + tag): tua lùi / trình duyệt xin lại khoảng chồng lấn ⇒ khỏi tải R2 lần nữa.
    const ivHex = d.iv.toString('hex');
    const ka = (tu - CO_DAU_SR2) / (d.coKhuc + 16);
    const ds: Buffer[] = [];
    let thieu = false;
    for (let i = ka, o = tu; o <= den; i++) {
      const hit = khucDem.get(`${ivHex}:${i}`);
      if (!hit) { thieu = true; break; }
      ds.push(hit); o += hit.length;
    }
    if (!thieu) return Buffer.concat(ds);
    const goi = await taiR2(key, `bytes=${tu}-${den}`);
    if (!goi) throw Object.assign(new Error('Media đã bị gỡ'), { name: 'NoSuchKey' });
    for (let i = ka, o = 0; o < goi.length; i++) {
      const dai = Math.min(d.coKhuc + 16, goi.length - o);
      const k = `${ivHex}:${i}`;
      khucDem.delete(k);
      khucDem.set(k, Buffer.from(goi.subarray(o, o + dai))); // chép: không giữ cả bộ đệm 8 MiB vì một khúc
      o += dai;
    }
    while (khucDem.size > KHUC_DEM_TOI_DA) khucDem.delete(khucDem.keys().next().value!);
    return goi;
  }, KHUC_MOI_PHAN_HOI);
  try {
    return { ...(await doc(dau)), dau };
  } catch (e) {
    if (e instanceof RangeError) throw e;
    const moi = await dauMedia(id, true);
    if (!moi || moi.iv.equals(dau.iv)) throw e;
    return { ...(await doc(moi)), dau: moi };
  }
}

/* ── Vé ngắn hạn cho thẻ <video>/<audio> (không mang được header Authorization; app desktop không có cookie) ── */

export const VE_SONG_GIAY = 30 * 60;

function khoaVe(): Buffer | null {
  const k = khoaTuEnv();
  return k ? createHmac('sha256', k).update('ielts-ve-v1').digest() : null;
}
const kyVe = (k: Buffer, userId: number, id: string, het: number) => createHmac('sha256', k).update(`ielts|${userId}|${id}|${het}`).digest('base64url');

/** Vé `<userId>.<hết hạn giây>.<chữ ký>` gắn với ĐÚNG một tệp. */
export function taoVe(userId: number, id: string, nowMs = Date.now()): { ve: string; het: number } | null {
  const k = khoaVe();
  if (!k) return null;
  const het = Math.floor(nowMs / 1000) + VE_SONG_GIAY;
  return { ve: `${userId}.${het}.${kyVe(k, userId, id, het)}`, het };
}

/** userId nếu vé đúng chữ ký, đúng tệp, chưa hết hạn; ngược lại null. */
export function kiemVe(ve: unknown, id: string, nowMs = Date.now()): number | null {
  const k = khoaVe();
  if (!k || typeof ve !== 'string' || ve.length > 200) return null;
  const m = /^(\d{1,12})\.(\d{1,12})\.([A-Za-z0-9_-]{43})$/.exec(ve);
  if (!m) return null;
  const userId = Number(m[1]);
  const het = Number(m[2]);
  if (!(userId > 0) || het * 1000 < nowMs || het * 1000 > nowMs + (VE_SONG_GIAY + 60) * 1000) return null;
  const a = Buffer.from(kyVe(k, userId, id, het));
  const b = Buffer.from(m[3]);
  return a.length === b.length && timingSafeEqual(a, b) ? userId : null;
}
