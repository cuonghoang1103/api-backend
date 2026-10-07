/**
 * Flashcard IELTS 100 từ/ngày — lưu trạng thái lặp lại ngắt quãng theo NGƯỜI
 * (đồng bộ web + app desktop). Lịch ôn: srs.ts. Nội dung từ nằm ở web; máy chủ
 * chỉ biết khoá từ (`tu`, chữ thường).
 */
import { prisma } from '../../config/database.js';
import { BadRequestError } from '../../middleware/errorHandler.js';
import { chamThe, daThuoc, ngayVN, cuoiNgayVN, chuoiNgay, luiNgay, THE_MOI, type Diem } from './srs.js';

export const MUC_TIEU_MAC_DINH = 100;
const NGAY = 86_400_000;

/** Khoá từ hợp lệ: chữ thường, chữ/số/khoảng trắng/'-./(), tối đa 80. */
export function chuanTu(raw: unknown): string {
  const t = String(raw ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
  if (!t || t.length > 80 || !/^[\p{L}\p{N}][\p{L}\p{N}\s'’\-./(),]*$/u.test(t)) throw new BadRequestError('Từ không hợp lệ');
  return t;
}

async function mucTieu(userId: number): Promise<number> {
  const g = await prisma.ieltsDailyGoal.findUnique({ where: { userId }, select: { tuMoi: true } });
  return g?.tuMoi ?? MUC_TIEU_MAC_DINH;
}

export async function datMucTieu(userId: number, tuMoi: unknown) {
  const n = Math.round(Number(tuMoi));
  if (!Number.isFinite(n) || n < 5 || n > 300) throw new BadRequestError('Mục tiêu từ 5 đến 300 từ mới/ngày');
  await prisma.ieltsDailyGoal.upsert({ where: { userId }, create: { userId, tuMoi: n }, update: { tuMoi: n } });
  return { mucTieu: n };
}

/**
 * Hàng đợi hôm nay: thẻ ĐẾN HẠN (hiện trước) + danh sách mọi từ đã có thẻ
 * (để web chọn từ mới chưa gặp) + số từ mới đã học hôm nay.
 */
export async function homNay(userId: number) {
  const now = new Date();
  const ngay = ngayVN(now);
  const [goal, denHan, tatCa, moiHomNay] = await Promise.all([
    mucTieu(userId),
    prisma.ieltsVocabCard.findMany({
      where: { userId, hanLuc: { lte: cuoiNgayVN(now) } },
      orderBy: { hanLuc: 'asc' },
      take: 1000,
      select: { tu: true, ease: true, khoang: true, lan: true, quen: true, hanLuc: true },
    }),
    prisma.ieltsVocabCard.findMany({ where: { userId }, select: { tu: true } }),
    prisma.ieltsVocabReview.count({ where: { userId, ngay, moi: true } }),
  ]);
  return { ngay, mucTieu: goal, moiHomNay, denHan, daCo: tatCa.map((t) => t.tu) };
}

/** Chấm một thẻ (1 Quên · 2 Khó · 3 Nhớ · 4 Dễ). */
export async function danhGia(userId: number, b: { tu?: unknown; diem?: unknown }) {
  const tu = chuanTu(b.tu);
  const diem = Number(b.diem);
  if (![1, 2, 3, 4].includes(diem)) throw new BadRequestError('Điểm phải là 1–4');
  const now = new Date();
  const cu = await prisma.ieltsVocabCard.findUnique({ where: { uk_ielts_the_tu: { userId, tu } } });
  const ketQua = chamThe(cu ?? THE_MOI, diem as Diem, now);
  const cachNgay = cu?.lanCuoi ? Math.round(((now.getTime() - cu.lanCuoi.getTime()) / NGAY) * 100) / 100 : null;
  const data = { ease: ketQua.ease, khoang: ketQua.khoang, lan: ketQua.lan, quen: ketQua.quen, hanLuc: ketQua.hanLuc, lanCuoi: now };
  const [the] = await prisma.$transaction([
    prisma.ieltsVocabCard.upsert({
      where: { uk_ielts_the_tu: { userId, tu } },
      create: { userId, tu, ...data },
      update: data,
      select: { tu: true, ease: true, khoang: true, lan: true, quen: true, hanLuc: true },
    }),
    prisma.ieltsVocabReview.create({ data: { userId, tu, diem, cachNgay, moi: !cu, ngay: ngayVN(now) } }),
  ]);
  return { the, thuoc: daThuoc(the) };
}

/** Thống kê: tổng thẻ, đã thuộc, đến hạn, chuỗi ngày, 30 ngày, tỷ lệ nhớ sau ≥ 7 ngày. */
export async function thongKe(userId: number) {
  const now = new Date();
  const homNayKey = ngayVN(now);
  const tu30 = luiNgay(homNayKey, 29);
  const [the, denHan, log30, ngayHoc, nho7, tong7, goal] = await Promise.all([
    prisma.ieltsVocabCard.findMany({ where: { userId }, select: { lan: true, khoang: true } }),
    prisma.ieltsVocabCard.count({ where: { userId, hanLuc: { lte: cuoiNgayVN(now) } } }),
    prisma.ieltsVocabReview.groupBy({ by: ['ngay', 'moi'], where: { userId, ngay: { gte: tu30 } }, _count: { _all: true } }),
    prisma.ieltsVocabReview.findMany({ where: { userId, ngay: { gte: luiNgay(homNayKey, 400) } }, distinct: ['ngay'], select: { ngay: true } }),
    prisma.ieltsVocabReview.count({ where: { userId, cachNgay: { gte: 7 }, diem: { gte: 2 } } }),
    prisma.ieltsVocabReview.count({ where: { userId, cachNgay: { gte: 7 } } }),
    mucTieu(userId),
  ]);
  const ngay30: { ngay: string; moi: number; on: number }[] = [];
  for (let i = 29; i >= 0; i--) ngay30.push({ ngay: luiNgay(homNayKey, i), moi: 0, on: 0 });
  const viTri = new Map(ngay30.map((d, i) => [d.ngay, i]));
  for (const r of log30) {
    const i = viTri.get(r.ngay);
    if (i === undefined) continue;
    if (r.moi) ngay30[i].moi += r._count._all; else ngay30[i].on += r._count._all;
  }
  return {
    mucTieu: goal,
    tongThe: the.length,
    daThuoc: the.filter(daThuoc).length,
    denHan,
    chuoi: chuoiNgay(ngayHoc.map((x) => x.ngay), homNayKey),
    ngay30,
    nho7: { tong: tong7, nho: nho7, tiLe: tong7 ? Math.round((nho7 / tong7) * 1000) / 10 : null },
  };
}

/** Xoá tiến độ một từ (người học muốn học lại từ đầu). */
export async function xoaThe(userId: number, tuRaw: unknown) {
  const tu = chuanTu(tuRaw);
  await prisma.ieltsVocabCard.deleteMany({ where: { userId, tu } });
  return { tu, daXoa: true };
}
