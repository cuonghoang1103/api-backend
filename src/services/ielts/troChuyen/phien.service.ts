/**
 * 💾 TIẾN ĐỘ BUỔI LUYỆN CÙNG CUONGMINI (19/10/2026) — "Tiếp tục buổi trước" /
 * "Bắt đầu lại từ đầu", theo NGƯỜI + KHOÁ, đi theo tài khoản (laptop, iPad, app).
 *
 * Dùng lại bảng tiến độ sẵn có `ielts_progress` (không thêm bảng, không migration):
 *   stage = mã khoá sách (sach1 · dekiru1 · jp1 · ch1)
 *   kind  = 'cuongmini'
 *   muc   = 'tc:<chủ đề>' (trò chuyện) | 'pa:<nguồn câu>' (luyện phát âm)
 *   ghiChu = JSON trạng thái (lịch sử ngắn, vị trí câu, thống kê buổi)
 * `layTienDo` của khoá BỎ QUA kind này (ghiChu ở đây to hơn, trang bài không cần).
 */
import { prisma } from '../../../config/database.js';
import { BadRequestError, NotFoundError } from '../../../middleware/errorHandler.js';
import { CAC_SACH } from '../ielts.service.js';

export const KIND_CUONGMINI = 'cuongmini';
const TOI_DA_BYTE = 24_000;
const TOI_DA_PHIEN = 40;

export interface DuLieuPhien {
  cheDo: 'tro-chuyen' | 'phat-am';
  /** Tên hiển thị (chủ đề / bộ câu). */
  ten: string;
  lichSu?: { ai: boolean; text: string }[];
  viTri?: number;
  tongCau?: number;
  soLuot?: number;
  soLoi?: number;
  giayNoi?: number;
  diemTb?: number | null;
}

export function kiemMuc(muc: unknown): string {
  const m = String(muc ?? '').trim();
  if (!/^(tc|pa):[\w.:-]{1,100}$/.test(m)) throw new BadRequestError('Mã buổi không hợp lệ');
  return m;
}
export function kiemKhoa(stage: unknown): string {
  const s = String(stage ?? '');
  if (!(CAC_SACH as readonly string[]).includes(s)) throw new BadRequestError('Khoá không hợp lệ');
  return s;
}

/** Gọt dữ liệu web gửi về đúng khuôn + giới hạn kích thước (lịch sử giữ đuôi). */
export function gotPhien(raw: unknown): DuLieuPhien {
  const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const so = (v: unknown, max: number) => { const n = Number(v); return Number.isFinite(n) ? Math.max(0, Math.min(max, Math.round(n))) : undefined; };
  const d: DuLieuPhien = {
    cheDo: o.cheDo === 'phat-am' ? 'phat-am' : 'tro-chuyen',
    ten: String(o.ten ?? '').slice(0, 160),
    lichSu: (Array.isArray(o.lichSu) ? o.lichSu : [])
      .map((t) => ({ ai: !!(t as { ai?: unknown })?.ai, text: String((t as { text?: unknown })?.text ?? '').slice(0, 600) }))
      .filter((t) => t.text.trim())
      .slice(-24),
    viTri: so(o.viTri, 1000),
    tongCau: so(o.tongCau, 1000),
    soLuot: so(o.soLuot, 100_000),
    soLoi: so(o.soLoi, 100_000),
    giayNoi: so(o.giayNoi, 10_000_000),
    diemTb: o.diemTb === null ? null : so(o.diemTb, 100),
  };
  while (JSON.stringify(d).length > TOI_DA_BYTE && d.lichSu!.length) d.lichSu!.shift();
  return d;
}

export async function luuPhien(userId: number, stage: unknown, muc: unknown, duLieu: unknown) {
  const s = kiemKhoa(stage);
  const m = kiemMuc(muc);
  const d = gotPhien(duLieu);
  const ghiChu = JSON.stringify(d);
  await prisma.ieltsProgress.upsert({
    where: { uk_ielts_tien_do: { userId, stage: s, kind: KIND_CUONGMINI, muc: m } },
    create: { userId, stage: s, kind: KIND_CUONGMINI, muc: m, xong: false, ghiChu },
    update: { xong: false, ghiChu },
  });
  // Giữ gọn: quá TOI_DA_PHIEN buổi đã lưu thì xoá buổi cũ nhất.
  const cu = await prisma.ieltsProgress.findMany({
    where: { userId, stage: s, kind: KIND_CUONGMINI }, orderBy: { updatedAt: 'desc' }, skip: TOI_DA_PHIEN, select: { id: true },
  });
  if (cu.length) await prisma.ieltsProgress.deleteMany({ where: { id: { in: cu.map((x) => x.id) } } });
  return { muc: m };
}

/** Tóm tắt buổi đã lưu (không gửi cả lịch sử) — cho màn chọn "Tiếp tục buổi trước". */
export function tomTat(muc: string, ghiChu: string | null, capNhat: Date) {
  let d: DuLieuPhien;
  try { d = gotPhien(JSON.parse(ghiChu ?? '{}')); } catch { d = gotPhien({}); }
  const cuoi = [...(d.lichSu ?? [])].reverse().find((t) => t.ai)?.text ?? '';
  return {
    muc, cheDo: d.cheDo, ten: d.ten, soLuot: d.soLuot ?? 0, viTri: d.viTri ?? 0, tongCau: d.tongCau ?? 0,
    cauCuoi: cuoi.replace(/\[\/?en\]/gi, '').slice(0, 140), capNhat,
  };
}

export async function dsPhien(userId: number, stage: unknown, cheDo?: unknown) {
  const s = kiemKhoa(stage);
  const tienTo = cheDo === 'phat-am' ? 'pa:' : cheDo === 'tro-chuyen' ? 'tc:' : '';
  const rows = await prisma.ieltsProgress.findMany({
    where: { userId, stage: s, kind: KIND_CUONGMINI, ...(tienTo ? { muc: { startsWith: tienTo } } : {}) },
    orderBy: { updatedAt: 'desc' }, take: TOI_DA_PHIEN, select: { muc: true, ghiChu: true, updatedAt: true },
  });
  return { items: rows.map((r) => tomTat(r.muc, r.ghiChu, r.updatedAt)) };
}

export async function layPhien(userId: number, stage: unknown, muc: unknown) {
  const s = kiemKhoa(stage);
  const m = kiemMuc(muc);
  const r = await prisma.ieltsProgress.findUnique({
    where: { uk_ielts_tien_do: { userId, stage: s, kind: KIND_CUONGMINI, muc: m } }, select: { ghiChu: true, updatedAt: true },
  });
  if (!r) throw new NotFoundError('Chưa có buổi đã lưu');
  let d: DuLieuPhien;
  try { d = gotPhien(JSON.parse(r.ghiChu ?? '{}')); } catch { d = gotPhien({}); }
  return { muc: m, duLieu: d, capNhat: r.updatedAt };
}

export async function xoaPhien(userId: number, stage: unknown, muc: unknown) {
  const s = kiemKhoa(stage);
  const m = kiemMuc(muc);
  const { count } = await prisma.ieltsProgress.deleteMany({ where: { userId, stage: s, kind: KIND_CUONGMINI, muc: m } });
  return { xoa: count };
}
