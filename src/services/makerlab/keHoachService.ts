/**
 * ============================================================
 * Tạo / sửa kế hoạch, và chốt một lượt từ web
 * ============================================================
 *
 * Tách khỏi `keHoach.ts`: file kia là LOGIC THUẦN (giờ giấc, quét tới
 * hạn) và được bộ thử gọi thẳng, không cần đăng nhập. File này là lớp
 * có QUYỀN — mọi hàm đều nhận `ownerId` và lọc theo nó.
 */

import { MakerPlanKind, MakerRunState } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { gioDiaPhuong, docPhut } from './keHoach.js';

const KIND = new Set(Object.values(MakerPlanKind) as string[]);

interface DauVao {
  title?: unknown;
  huongDan?: unknown;
  noteId?: unknown;
  kind?: unknown;
  /** Số phút trong ngày (0..1439) HOẶC chuỗi "07:15". */
  gio?: unknown;
  tz?: unknown;
  thu?: unknown;
  ngayMot?: unknown;
  nhacTruoc?: unknown;
  active?: unknown;
  projectId?: unknown;
}

function loi(msg: string, code = 400): never {
  throw Object.assign(new Error(msg), { statusCode: code });
}

/** Nhận cả số lẫn chuỗi "07:15" — web gửi chuỗi, robot gửi số. */
function docGioVao(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    const n = Math.round(raw);
    return n >= 0 && n <= 1439 ? n : null;
  }
  if (typeof raw === 'string') return docPhut(raw);
  return null;
}

function docThu(raw: unknown): number[] {
  if (!Array.isArray(raw)) return [];
  const ra = raw
    .map((x) => Math.round(Number(x)))
    .filter((n) => Number.isInteger(n) && n >= 0 && n <= 6);
  return [...new Set(ra)].sort();
}

function docNgay(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const s = raw.trim();
  // Kiểm cả HÌNH DẠNG lẫn TÍNH CÓ THẬT: "2026-02-31" đúng khuôn nhưng
  // không tồn tại, và nếu lọt vào thì kế hoạch ONCE đó không bao giờ
  // nổ — âm thầm, vì không có gì báo lỗi cả.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00Z`);
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s ? null : s;
}

function chuan(v: DauVao, batBuoc: boolean) {
  const ra: Record<string, unknown> = {};

  if (v.title !== undefined || batBuoc) {
    const t = String(v.title ?? '').trim();
    if (!t) loi('Thiếu tên việc');
    ra.title = t.slice(0, 200);
  }

  if (v.gio !== undefined || batBuoc) {
    const g = docGioVao(v.gio);
    if (g == null) loi('Giờ không hợp lệ — dùng dạng "07:15" hoặc số phút 0–1439');
    ra.gio = g;
  }

  if (v.kind !== undefined) {
    const k = String(v.kind);
    if (!KIND.has(k)) loi(`Kiểu lặp không hợp lệ: ${k}`);
    ra.kind = k as MakerPlanKind;
  }

  if (v.thu !== undefined) ra.thu = docThu(v.thu);
  if (v.huongDan !== undefined)
    ra.huongDan = v.huongDan ? String(v.huongDan).slice(0, 4000) : null;
  if (v.noteId !== undefined)
    ra.noteId = v.noteId == null ? null : Math.round(Number(v.noteId)) || null;
  if (v.tz !== undefined) ra.tz = String(v.tz || 'Asia/Ho_Chi_Minh').slice(0, 64);
  if (v.active !== undefined) ra.active = v.active !== false;
  if (v.nhacTruoc !== undefined) {
    const n = Math.round(Number(v.nhacTruoc));
    ra.nhacTruoc = Number.isFinite(n) ? Math.max(0, Math.min(240, n)) : 0;
  }
  if (v.ngayMot !== undefined) ra.ngayMot = v.ngayMot ? docNgay(v.ngayMot) : null;

  // Kiểu ONCE mà không có ngày thì nó nằm im mãi mãi, và người dùng chỉ
  // phát hiện lúc lỡ việc. Chặn ngay lúc lưu.
  const kind = (ra.kind ?? (batBuoc ? MakerPlanKind.DAILY : undefined)) as string | undefined;
  if (kind === MakerPlanKind.ONCE && ra.ngayMot === null) loi('Kiểu "một lần" phải có ngày cụ thể');
  if (kind === MakerPlanKind.WEEKLY && Array.isArray(ra.thu) && !ra.thu.length)
    loi('Kiểu "hằng tuần" phải chọn ít nhất một thứ');

  return ra;
}

export async function taoKeHoach(ownerId: number, body: DauVao) {
  const data = chuan(body, true);

  // `projectId` chỉ để biết đọc bằng giọng của persona nào. Không gửi
  // thì lấy dự án robot đầu tiên của người này; không có robot nào thì
  // lấy dự án Maker Lab đầu tiên đang mở.
  let projectId = Math.round(Number(body.projectId)) || 0;
  if (!projectId) {
    const dev = await prisma.makerDevice.findFirst({
      where: { ownerId },
      orderBy: { id: 'asc' },
      select: { projectId: true },
    });
    projectId = dev?.projectId ?? 0;
  }
  if (!projectId) {
    const p = await prisma.makerProject.findFirst({ orderBy: { id: 'asc' }, select: { id: true } });
    projectId = p?.id ?? 0;
  }
  if (!projectId) loi('Chưa có dự án Maker Lab nào để gắn kế hoạch', 409);

  return prisma.makerPlan.create({
    data: { ...(data as Record<string, unknown>), ownerId, projectId } as never,
  });
}

export async function suaKeHoach(ownerId: number, id: number, body: DauVao) {
  const co = await prisma.makerPlan.findFirst({ where: { id, ownerId }, select: { id: true } });
  if (!co) loi('Không tìm thấy kế hoạch', 404);
  return prisma.makerPlan.update({ where: { id }, data: chuan(body, false) as never });
}

/**
 * Chốt lượt HÔM NAY của một kế hoạch, bấm từ web.
 *
 * Tự tạo hàng `run` nếu chưa có: bấm tích xanh TRƯỚC giờ hẹn là chuyện
 * bình thường ("làm sớm cho xong"), và bắt người ta đợi chuông kêu mới
 * được tích là vô lý.
 */
export async function chotLuot(ownerId: number, planId: number, kieu: string, phut = 10) {
  const plan = await prisma.makerPlan.findFirst({ where: { id: planId, ownerId } });
  if (!plan) loi('Không tìm thấy kế hoạch', 404);

  const { ngay } = gioDiaPhuong(new Date(), plan.tz);
  const run = await prisma.makerPlanRun.upsert({
    where: { planId_ngay: { planId, ngay } },
    create: { planId, ngay, state: MakerRunState.PENDING },
    update: {},
  });

  const { chamXong, boQua, hoanLai } = await import('./keHoach.js');
  switch (kieu) {
    case 'xong':
      return chamXong(run.id);
    case 'bo-qua':
      return boQua(run.id);
    case 'hoan':
      return hoanLai(run.id, phut);
    case 'mo-lai':
      // Bấm nhầm thì phải gỡ ra được. Xoá luôn `nhacLuc` để vòng quét
      // coi như chưa nhắc và còn nhắc lại trong cửa sổ ân xá.
      return prisma.makerPlanRun.update({
        where: { id: run.id },
        data: { state: MakerRunState.PENDING, xongLuc: null, hoanToi: null, nhacLuc: null },
      });
    default:
      return loi(`Không hiểu thao tác: ${kieu}`);
  }
}
