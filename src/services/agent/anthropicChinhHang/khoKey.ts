/**
 * KHO KEY ANTHROPIC NHIỀU TẦNG.
 *
 * Mỗi key một dòng `anthropic_keys`: nhãn, khoá MÃ HOÁ, 4 ký tự cuối, thứ tự
 * ưu tiên, ngân sách USD mỗi chu kỳ tháng, ngày làm mới, hạn dùng, trạng thái.
 *
 * Trạng thái:
 *   hoatDong  — dùng được.
 *   hetCredit — Anthropic báo hết credit. TỰ mở lại khi qua ngày làm mới.
 *   loi       — 401/403 hoặc không giải mã được. Chỉ mở lại bằng tay (admin
 *               bật lại hoặc bấm "Thử kết nối" thành công).
 *   tat       — admin tắt.
 *
 * Key còn bị BỎ QUA (không đổi trạng thái) khi: quá `hetHanLuc`, hoặc số TỰ
 * ĐO trong chu kỳ đã chạm `nganSachThangUsd` — credit ưu đãi hết thì thẻ của
 * chủ app bắt đầu bị trừ, nên dừng sớm theo sổ của mình là an toàn hơn.
 *
 * NẠP LẦN ĐẦU từ env `ANTHROPIC_CHINH_HANG_KEYS` (chỉ khi bảng RỖNG), theo
 * thứ tự ưu tiên, phân tách bằng dấu phẩy hoặc xuống dòng. Mỗi mục:
 *     key
 *     nhan|key
 *     nhan|ngansach|key
 *     nhan|ngansach|ngaylammoi|key
 * Khoá luôn là đoạn CUỐI. Sau lần nạp đầu, sửa trên trang admin — env không
 * được đọc lại (đổi env không ghi đè chỉnh sửa của admin).
 */
import { prisma } from '../../../config/database.js';
import { logger } from '../../../utils/logger.js';
import { duoiKhoa, giaiMaKhoa, maHoaKhoa, vanTayKhoa } from './maHoa.js';

export type TrangThaiKey = 'hoatDong' | 'hetCredit' | 'loi' | 'tat';
const TRANG_THAI: TrangThaiKey[] = ['hoatDong', 'hetCredit', 'loi', 'tat'];

const VN_MS = 7 * 3600_000;

export interface KhoaMoiTruong {
  nhan: string;
  nganSach: number;
  ngayLamMoi: number;
  khoa: string;
}

export function docKhoaMoiTruong(raw: string | undefined): KhoaMoiTruong[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/[,\n]/)
    .map((x) => x.trim())
    .filter(Boolean)
    .map((muc, i) => {
      const phan = muc.split('|').map((x) => x.trim());
      const khoa = phan.pop()!;
      const nhan = phan[0] || `Key ${i + 1}`;
      const ns = Number(phan[1]);
      const ngay = Number(phan[2]);
      return {
        nhan: nhan.slice(0, 80),
        nganSach: Number.isFinite(ns) && ns >= 0 ? ns : 0,
        ngayLamMoi: Number.isInteger(ngay) && ngay >= 1 && ngay <= 28 ? ngay : 1,
        khoa,
      };
    })
    .filter((k) => k.khoa.length >= 20);
}

/**
 * Đầu chu kỳ tháng hiện tại theo giờ Việt Nam (UTC+7, không có giờ mùa hè):
 * lần gần nhất đồng hồ VN qua 00:00 ngày `ngayLamMoi`.
 */
export function dauChuKy(ngayLamMoi: number, luc = new Date()): Date {
  const ngay = Math.min(28, Math.max(1, Math.round(ngayLamMoi) || 1));
  const vn = new Date(luc.getTime() + VN_MS);
  const y = vn.getUTCFullYear();
  const m = vn.getUTCMonth();
  const dau = vn.getUTCDate() >= ngay ? Date.UTC(y, m, ngay) : Date.UTC(y, m - 1, ngay);
  return new Date(dau - VN_MS);
}

/** Mốc làm mới KẾ TIẾP (để hiện trên trang admin). */
export function chuKyKe(ngayLamMoi: number, luc = new Date()): Date {
  const dau = dauChuKy(ngayLamMoi, luc);
  const vn = new Date(dau.getTime() + VN_MS);
  return new Date(Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth() + 1, vn.getUTCDate()) - VN_MS);
}

// ─── Nạp lần đầu từ env ──────────────────────────────────────────────

let daNap: Promise<number> | null = null;

/** Bảng rỗng + có env ⇒ nhập. Chạy một lần mỗi tiến trình; trả số key đã nhập. */
export function napTuMoiTruong(): Promise<number> {
  if (!daNap) {
    daNap = (async () => {
      const ds = docKhoaMoiTruong(process.env.ANTHROPIC_CHINH_HANG_KEYS);
      if (!ds.length) return 0;
      const co = await prisma.anthropicKey.count();
      if (co > 0) return 0;
      let n = 0;
      for (const [i, k] of ds.entries()) {
        try {
          await prisma.anthropicKey.create({
            data: {
              nhan: k.nhan,
              khoaMaHoa: maHoaKhoa(k.khoa),
              duoiKhoa: duoiKhoa(k.khoa),
              vanTay: vanTayKhoa(k.khoa),
              thuTu: i,
              nganSachThangUsd: k.nganSach,
              ngayLamMoi: k.ngayLamMoi,
            },
          });
          n++;
        } catch (err) {
          logger.warn('[anthropic] không nhập được key từ env', { nhan: k.nhan, error: (err as Error).message });
        }
      }
      logger.info('[anthropic] đã nạp key từ ANTHROPIC_CHINH_HANG_KEYS', { soKey: n });
      xoaNho();
      return n;
    })().catch((err) => {
      daNap = null; // CSDL chưa sẵn ⇒ lần sau thử lại
      logger.warn('[anthropic] nạp key từ env hỏng', { error: (err as Error).message });
      return 0;
    });
  }
  return daNap;
}

/** Cho test: quên rằng đã nạp. */
export function datLaiNapMoiTruong(): void { daNap = null; xoaNho(); }

// ─── Chi tiêu theo chu kỳ ────────────────────────────────────────────

export async function daDungChuKy(keyId: number, ngayLamMoi: number, luc = new Date()): Promise<number> {
  const s = await prisma.anthropicUsage.aggregate({
    where: { keyId, createdAt: { gte: dauChuKy(ngayLamMoi, luc) } },
    _sum: { costUsd: true },
  });
  return s._sum.costUsd ?? 0;
}

// ─── Chọn key ────────────────────────────────────────────────────────

export interface KeyDungDuoc {
  id: number;
  nhan: string;
  khoa: string;
}

let nho: { luc: number; ds: KeyDungDuoc[] } | null = null;
const NHO_MS = 10_000;

export function xoaNho(): void { nho = null; }

/**
 * Các key ĐANG DÙNG ĐƯỢC, theo thứ tự ưu tiên. Tự mở lại key `hetCredit` đã
 * qua ngày làm mới. Nhớ 10 giây (mọi lần đánh dấu đều xoá nhớ).
 */
export async function keyKhaDung(luc = new Date()): Promise<KeyDungDuoc[]> {
  if (nho && Date.now() - nho.luc < NHO_MS) return nho.ds;
  await napTuMoiTruong();
  const rows = await prisma.anthropicKey.findMany({
    where: { trangThai: { in: ['hoatDong', 'hetCredit'] } },
    orderBy: [{ thuTu: 'asc' }, { id: 'asc' }],
  });
  const ds: KeyDungDuoc[] = [];
  for (const r of rows) {
    if (r.hetHanLuc && r.hetHanLuc <= luc) continue;
    if (r.trangThai === 'hetCredit') {
      const dau = dauChuKy(r.ngayLamMoi, luc);
      if (!r.hetCreditLuc || r.hetCreditLuc >= dau) continue;
      await prisma.anthropicKey.update({ where: { id: r.id }, data: { trangThai: 'hoatDong', hetCreditLuc: null } });
      logger.info('[anthropic] key qua ngày làm mới — mở lại', { keyId: r.id, nhan: r.nhan });
    }
    if (r.nganSachThangUsd > 0 && (await daDungChuKy(r.id, r.ngayLamMoi, luc)) >= r.nganSachThangUsd) continue;
    let khoa: string;
    try {
      khoa = giaiMaKhoa(r.khoaMaHoa);
    } catch (err) {
      await danhDauKey(r.id, 'loi', `Không giải mã được key (đổi APP_ENCRYPTION_KEY/JWT_SECRET?): ${(err as Error).message}`);
      continue;
    }
    ds.push({ id: r.id, nhan: r.nhan, khoa });
  }
  nho = { luc: Date.now(), ds };
  return ds;
}

/** Có ít nhất một key dùng được? Không ném — CSDL hỏng ⇒ false. */
export async function coKeyKhaDung(): Promise<boolean> {
  try { return (await keyKhaDung()).length > 0; } catch { return false; }
}

/**
 * Ghi nhận lỗi của một key.
 *   'hetCredit' ⇒ đổi trạng thái, nhớ lúc hết.
 *   'loi'       ⇒ đổi trạng thái (401/403).
 *   'tamThoi'   ⇒ CHỈ ghi lỗi cuối (429/529/5xx) — không đổi trạng thái.
 */
export async function danhDauKey(id: number, loai: 'hetCredit' | 'loi' | 'tamThoi', loi: string): Promise<void> {
  const bay = new Date();
  try {
    await prisma.anthropicKey.update({
      where: { id },
      data: {
        loiCuoi: loi.slice(0, 500),
        loiCuoiLuc: bay,
        ...(loai === 'hetCredit' ? { trangThai: 'hetCredit', hetCreditLuc: bay } : {}),
        ...(loai === 'loi' ? { trangThai: 'loi' } : {}),
      },
    });
  } catch (err) {
    logger.warn('[anthropic] không ghi được lỗi key', { id, error: (err as Error).message });
  }
  if (loai !== 'tamThoi') {
    logger.warn(`[anthropic] key chuyển sang ${loai}`, { keyId: id, loi: loi.slice(0, 160) });
    xoaNho();
  }
}

// ─── Quản trị ────────────────────────────────────────────────────────

export interface KeyNhap {
  nhan?: unknown;
  khoa?: unknown;
  nganSachThangUsd?: unknown;
  ngayLamMoi?: unknown;
  hetHanLuc?: unknown;
  trangThai?: unknown;
  thuTu?: unknown;
}

export class KhoKeyLoi extends Error {
  constructor(message: string, public readonly status = 400) { super(message); }
}

function docSo(v: unknown, ten: string, min: number, max: number): number {
  const n = Number(v);
  if (!Number.isFinite(n) || n < min || n > max) throw new KhoKeyLoi(`${ten} phải trong khoảng ${min}–${max}.`);
  return n;
}

function docNgay(v: unknown): Date | null {
  if (v === null || v === '') return null;
  const d = new Date(String(v));
  if (Number.isNaN(d.getTime())) throw new KhoKeyLoi('Ngày hết hạn không hợp lệ.');
  return d;
}

function docKhoa(v: unknown): string {
  const k = String(v ?? '').trim();
  if (!/^sk-ant-[A-Za-z0-9_-]{20,}$/.test(k)) throw new KhoKeyLoi('Key không đúng dạng key Anthropic (sk-ant-…).');
  return k;
}

export async function themKey(d: KeyNhap): Promise<number> {
  const khoa = docKhoa(d.khoa);
  const vanTay = vanTayKhoa(khoa);
  if (await prisma.anthropicKey.findUnique({ where: { vanTay } })) throw new KhoKeyLoi('Key này đã có trong kho.', 409);
  const cuoi = await prisma.anthropicKey.aggregate({ _max: { thuTu: true } });
  const r = await prisma.anthropicKey.create({
    data: {
      nhan: String(d.nhan ?? '').trim().slice(0, 80) || `Key …${duoiKhoa(khoa)}`,
      khoaMaHoa: maHoaKhoa(khoa),
      duoiKhoa: duoiKhoa(khoa),
      vanTay,
      thuTu: d.thuTu !== undefined ? Math.round(docSo(d.thuTu, 'Thứ tự', 0, 10_000)) : (cuoi._max.thuTu ?? -1) + 1,
      nganSachThangUsd: d.nganSachThangUsd !== undefined ? docSo(d.nganSachThangUsd, 'Ngân sách', 0, 1_000_000) : 0,
      ngayLamMoi: d.ngayLamMoi !== undefined ? Math.round(docSo(d.ngayLamMoi, 'Ngày làm mới', 1, 28)) : 1,
      hetHanLuc: d.hetHanLuc !== undefined ? docNgay(d.hetHanLuc) : null,
    },
  });
  xoaNho();
  return r.id;
}

export async function suaKey(id: number, d: KeyNhap): Promise<void> {
  const data: Record<string, unknown> = {};
  if (d.nhan !== undefined) data.nhan = String(d.nhan).trim().slice(0, 80) || 'Key';
  if (d.khoa !== undefined && d.khoa !== '') {
    const khoa = docKhoa(d.khoa);
    const vanTay = vanTayKhoa(khoa);
    const trung = await prisma.anthropicKey.findUnique({ where: { vanTay } });
    if (trung && trung.id !== id) throw new KhoKeyLoi('Key này đã có ở dòng khác.', 409);
    Object.assign(data, {
      khoaMaHoa: maHoaKhoa(khoa), duoiKhoa: duoiKhoa(khoa), vanTay,
      trangThai: 'hoatDong', loiCuoi: null, loiCuoiLuc: null, hetCreditLuc: null,
    });
  }
  if (d.nganSachThangUsd !== undefined) data.nganSachThangUsd = docSo(d.nganSachThangUsd, 'Ngân sách', 0, 1_000_000);
  if (d.ngayLamMoi !== undefined) data.ngayLamMoi = Math.round(docSo(d.ngayLamMoi, 'Ngày làm mới', 1, 28));
  if (d.hetHanLuc !== undefined) data.hetHanLuc = docNgay(d.hetHanLuc);
  if (d.thuTu !== undefined) data.thuTu = Math.round(docSo(d.thuTu, 'Thứ tự', 0, 10_000));
  if (d.trangThai !== undefined) {
    if (!TRANG_THAI.includes(d.trangThai as TrangThaiKey)) throw new KhoKeyLoi('Trạng thái không hợp lệ.');
    data.trangThai = d.trangThai;
    if (d.trangThai === 'hoatDong') Object.assign(data, { hetCreditLuc: null });
  }
  if (!Object.keys(data).length) throw new KhoKeyLoi('Không có gì để đổi.');
  await prisma.anthropicKey.update({ where: { id }, data });
  xoaNho();
}

export async function xoaKey(id: number): Promise<void> {
  await prisma.anthropicKey.delete({ where: { id } });
  xoaNho();
}

/** `ids` theo thứ tự mới; id không có trong danh sách giữ nguyên. */
export async function doiThuTu(ids: unknown): Promise<void> {
  if (!Array.isArray(ids) || !ids.every((x) => Number.isInteger(x))) throw new KhoKeyLoi('ids phải là mảng số nguyên.');
  await prisma.$transaction((ids as number[]).map((id, i) => prisma.anthropicKey.update({ where: { id }, data: { thuTu: i } })));
  xoaNho();
}

/** Khoá thô của MỘT key — chỉ cho "Thử kết nối" và đối chiếu. Không bao giờ trả ra client. */
export async function khoaThoCua(id: number): Promise<string> {
  const r = await prisma.anthropicKey.findUnique({ where: { id } });
  if (!r) throw new KhoKeyLoi('Không có key này.', 404);
  return giaiMaKhoa(r.khoaMaHoa);
}
