/**
 * THƯ VIỆN SÁCH — tiến độ đọc theo người (05/10/2026).
 *
 * App desktop (mục Library) gửi một "nhịp" mỗi ~30 giây khi đang đọc thật (cửa sổ
 * mở + có cuộn/di chuột gần đây): vị trí đọc + số giây vừa đọc. Máy chủ cộng dồn
 * vào cuốn đó và vào NGÀY hôm nay (giờ Việt Nam) — từ đó ra mục tiêu ngày + chuỗi
 * ngày. Trần giây mỗi nhịp để một máy treo/đồng hồ lệch không thổi phồng số liệu.
 */
import { prisma } from '../../config/database.js';
import { BadRequestError } from '../../middleware/errorHandler.js';

const SLUG = /^[a-z0-9-]{3,120}$/;
const TRAN_GIAY_MOI_NHIP = 90;
const TOI_DA_DAU_TRANG = 50;

/** "YYYY-MM-DD" theo giờ Việt Nam (UTC+7, không có giờ mùa hè). */
export function ngayVN(d = new Date()): string {
  return new Date(d.getTime() + 7 * 3600_000).toISOString().slice(0, 10);
}
function ngayTruoc(day: string, n: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

export type DauTrang = { p: number; c: number; t: string; at: string };
function sachDauTrang(raw: unknown): DauTrang[] {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, TOI_DA_DAU_TRANG).map((x) => {
    const o = (x ?? {}) as Record<string, unknown>;
    return {
      p: Math.max(0, Math.min(100, Number(o.p) || 0)),
      c: Math.max(0, Math.floor(Number(o.c) || 0)),
      t: String(o.t ?? '').slice(0, 200),
      at: typeof o.at === 'string' ? o.at.slice(0, 40) : new Date().toISOString(),
    };
  });
}

/** Chuỗi ngày liên tiếp có đọc (≥ 60 giây), tính tới hôm nay — hôm nay chưa đọc thì đếm từ hôm qua. */
function tinhChuoi(ngayCoDoc: Set<string>, homNay: string): number {
  let d = ngayCoDoc.has(homNay) ? homNay : ngayTruoc(homNay, 1);
  let n = 0;
  while (ngayCoDoc.has(d)) { n++; d = ngayTruoc(d, 1); }
  return n;
}

/** Tổng quan thư viện của một người: mọi cuốn đang/đã đọc + số giây 14 ngày gần nhất + chuỗi ngày. */
export async function tongQuan(userId: number) {
  const homNay = ngayVN();
  const [sach, ngay] = await Promise.all([
    prisma.bookReading.findMany({ where: { userId }, orderBy: { lastReadAt: 'desc' } }),
    prisma.bookReadingDay.findMany({ where: { userId, day: { gte: ngayTruoc(homNay, 400) } }, orderBy: { day: 'desc' } }),
  ]);
  const coDoc = new Set(ngay.filter((d) => d.seconds >= 60).map((d) => d.day));
  const theoNgay = new Map(ngay.map((d) => [d.day, d.seconds]));
  return {
    homNay,
    giayHomNay: theoNgay.get(homNay) ?? 0,
    chuoiNgay: tinhChuoi(coDoc, homNay),
    soNgayDaDoc: coDoc.size,
    tuan: Array.from({ length: 14 }, (_, i) => { const d = ngayTruoc(homNay, 13 - i); return { day: d, giay: theoNgay.get(d) ?? 0 }; }),
    sach: sach.map((s) => ({
      slug: s.slug, chapter: s.chapter, percent: s.percent, seconds: s.seconds,
      bookmarks: sachDauTrang(s.bookmarks), startedAt: s.startedAt, lastReadAt: s.lastReadAt, finishedAt: s.finishedAt,
    })),
  };
}

/** Một nhịp đọc: lưu vị trí + cộng giây. `bookmarks` có mặt thì GHI ĐÈ danh sách dấu trang. */
export async function ghiNhip(userId: number, slug: string, b: { chapter?: unknown; percent?: unknown; giay?: unknown; bookmarks?: unknown }) {
  if (!SLUG.test(slug)) throw new BadRequestError('Tên sách không hợp lệ');
  const chapter = Math.max(0, Math.min(500, Math.floor(Number(b.chapter) || 0)));
  const percent = Math.max(0, Math.min(100, Number(b.percent) || 0));
  const giay = Math.max(0, Math.min(TRAN_GIAY_MOI_NHIP, Math.floor(Number(b.giay) || 0)));
  const bookmarks = b.bookmarks === undefined ? undefined : sachDauTrang(b.bookmarks);
  const now = new Date();
  const cu = await prisma.bookReading.findUnique({ where: { uk_book_reading_user_slug: { userId, slug } } });
  const xong = percent >= 98 && !cu?.finishedAt ? now : undefined;
  const ban = await prisma.bookReading.upsert({
    where: { uk_book_reading_user_slug: { userId, slug } },
    create: { userId, slug, chapter, percent, seconds: giay, lastReadAt: now, ...(bookmarks ? { bookmarks } : {}), ...(xong ? { finishedAt: xong } : {}) },
    update: { chapter, percent, seconds: { increment: giay }, lastReadAt: now, ...(bookmarks ? { bookmarks } : {}), ...(xong ? { finishedAt: xong } : {}) },
  });
  if (giay > 0) {
    const day = ngayVN(now);
    await prisma.bookReadingDay.upsert({
      where: { uk_book_reading_day: { userId, day } },
      create: { userId, day, seconds: giay },
      update: { seconds: { increment: giay } },
    });
  }
  return { slug: ban.slug, chapter: ban.chapter, percent: ban.percent, seconds: ban.seconds, finishedAt: ban.finishedAt, bookmarks: sachDauTrang(ban.bookmarks) };
}

/** Bỏ một cuốn khỏi "Đang đọc" (xoá tiến độ của cuốn đó — số phút theo ngày giữ nguyên). */
export async function xoaTienDo(userId: number, slug: string) {
  if (!SLUG.test(slug)) throw new BadRequestError('Tên sách không hợp lệ');
  await prisma.bookReading.deleteMany({ where: { userId, slug } });
  return { slug };
}
