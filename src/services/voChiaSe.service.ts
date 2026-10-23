/**
 * Vở viết tay (iPad) — xem & tìm Vở trên web (23/10/2026).
 * ─────────────────────────────────────────────────────────────────────
 *   1. `luuChuNhanDang` — chữ Vision đọc trên iPad ⇒ `notes.ink_text`, CHỈ để
 *      tìm kiếm trên web. Ghi bằng SQL thô để KHÔNG đổi `updated_at` (cột
 *      `@updatedAt`): đọc lại chữ không phải là "sửa trang" — đổi mốc là trang
 *      nhảy lên đầu danh sách "gần đây" mỗi lần iPad đồng bộ.
 *   2. Link CHỈ-XEM một trang: token ngẫu nhiên trên hàng `notes`; ảnh đi QUA
 *      BACKEND (`/vo-xem/:token/anh`) chứ không đưa URL CDN, nên thu hồi link
 *      là người cầm link mất ảnh ngay (URL CDN có id người + id trang).
 *   3. PDF cả cuốn: ghép ảnh xem trước các trang (ảnh do app dựng — thứ DUY
 *      NHẤT ngoài iPad đọc được; `PKDrawing` là định dạng riêng của Apple).
 */
import crypto from 'node:crypto';
import PDFDocument from 'pdfkit';
import sharp from 'sharp';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { getObjectBytes } from '../config/r2.js';
import { AppError, BadRequestError } from '../middleware/errorHandler.js';
import { notoSansViBoldBuffer, notoSansViBuffer } from './cv/export/font.js';

const UUID_RE = /^[0-9a-fA-F-]{16,64}$/;
const TRAN_CHU = 20_000;
const TRAN_TRANG_CHU = 300;
const TRAN_TRANG_PDF = 300;

// ─── 1. Chữ nhận dạng ────────────────────────────────────────────────────

export async function luuChuNhanDang(userId: number, trangs: unknown): Promise<{ daLuu: number; khongThay: string[] }> {
  if (!Array.isArray(trangs)) throw new BadRequestError('Thiếu danh sách trang', 'INVALID_INPUT');
  if (trangs.length > TRAN_TRANG_CHU) throw new BadRequestError(`Tối đa ${TRAN_TRANG_CHU} trang một lượt`, 'TOO_MANY');
  // Gộp theo clientId (bản sau thắng) — một payload lặp lại không ghi hai lần.
  const theoClient = new Map<string, string | null>();
  for (const raw of trangs) {
    const t = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
    const clientId = typeof t.clientId === 'string' ? t.clientId.trim() : '';
    if (!UUID_RE.test(clientId)) throw new BadRequestError('clientId của trang không hợp lệ', 'INVALID_CLIENT_ID');
    const chu = String(t.chu ?? '').replace(/\u0000/g, '').trim().slice(0, TRAN_CHU);
    theoClient.set(clientId, chu || null);
  }
  if (theoClient.size === 0) return { daLuu: 0, khongThay: [] };

  const co = await prisma.note.findMany({
    where: { userId, clientId: { in: [...theoClient.keys()] }, deletedAt: null },
    select: { id: true, clientId: true },
  });
  const idTheoClient = new Map(co.map((r) => [r.clientId!, r.id]));
  let daLuu = 0;
  for (const [clientId, chu] of theoClient) {
    const id = idTheoClient.get(clientId);
    if (!id) continue;
    // SQL thô: không chạm `updated_at` (xem đầu tệp). Lọc lại userId cho chắc.
    daLuu += await prisma.$executeRaw`
      UPDATE "notes" SET "ink_text" = ${chu}, "ink_text_at" = NOW()
      WHERE "id" = ${id} AND "user_id" = ${userId} AND "deleted_at" IS NULL`;
  }
  return { daLuu, khongThay: [...theoClient.keys()].filter((c) => !idTheoClient.has(c)) };
}

// ─── 2. Link chỉ-xem ─────────────────────────────────────────────────────

async function trangVoCuaNguoi(userId: number, noteId: number) {
  if (!Number.isInteger(noteId) || noteId <= 0) throw new BadRequestError('Mã trang không hợp lệ', 'INVALID_ID');
  const t = await prisma.note.findFirst({
    where: { id: noteId, userId, deletedAt: null, clientId: { not: null } },
    select: { id: true, inkShareToken: true },
  });
  if (!t) throw new AppError('Không tìm thấy trang Vở', 404, 'NOTE_NOT_FOUND');
  return t;
}

export async function taoLinkChiXem(userId: number, noteId: number): Promise<{ token: string; duongDan: string }> {
  const t = await trangVoCuaNguoi(userId, noteId);
  if (t.inkShareToken) return { token: t.inkShareToken, duongDan: `/vo/xem/${t.inkShareToken}` };
  for (let lan = 0; lan < 3; lan++) {
    const token = crypto.randomBytes(24).toString('base64url');
    try {
      // `inkShareToken: null` trong where: hai lượt bấm cùng lúc thì lượt sau
      // không đè token lượt trước đã phát ra.
      const r = await prisma.note.updateMany({
        where: { id: t.id, userId, inkShareToken: null },
        data: { inkShareToken: token, inkShareAt: new Date() },
      });
      if (r.count === 0) {
        const lai = await trangVoCuaNguoi(userId, noteId);
        if (lai.inkShareToken) return { token: lai.inkShareToken, duongDan: `/vo/xem/${lai.inkShareToken}` };
        continue;
      }
      return { token, duongDan: `/vo/xem/${token}` };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') continue;
      throw e;
    }
  }
  throw new AppError('Chưa tạo được link — thử lại', 500, 'SHARE_FAILED');
}

export async function thuHoiLinkChiXem(userId: number, noteId: number): Promise<{ ok: true }> {
  const t = await trangVoCuaNguoi(userId, noteId);
  await prisma.note.update({ where: { id: t.id }, data: { inkShareToken: null, inkShareAt: null } });
  return { ok: true };
}

const TOKEN_RE = /^[A-Za-z0-9_-]{16,64}$/;

async function trangTheoToken(token: string) {
  if (!TOKEN_RE.test(token)) throw new AppError('Link không tồn tại hoặc đã bị thu hồi', 404, 'SHARE_NOT_FOUND');
  const t = await prisma.note.findFirst({
    where: { inkShareToken: token, deletedAt: null },
    select: {
      id: true, title: true, inkPreviewKey: true, inkUpdatedAt: true, updatedAt: true,
      subject: { select: { name: true } }, chapter: { select: { title: true } },
    },
  });
  if (!t) throw new AppError('Link không tồn tại hoặc đã bị thu hồi', 404, 'SHARE_NOT_FOUND');
  return t;
}

export async function xemCongKhai(token: string) {
  const t = await trangTheoToken(token);
  return {
    tieuDe: t.title,
    monTen: t.subject?.name ?? '',
    cuonTen: t.chapter?.title ?? null,
    capNhatLuc: (t.inkUpdatedAt ?? t.updatedAt).toISOString(),
    coAnh: Boolean(t.inkPreviewKey),
  };
}

export async function anhCongKhai(token: string): Promise<Buffer> {
  const t = await trangTheoToken(token);
  if (!t.inkPreviewKey) throw new AppError('Trang chưa có ảnh xem trước', 404, 'NO_PREVIEW');
  const b = await getObjectBytes(t.inkPreviewKey);
  if (!b) throw new AppError('Không đọc được ảnh trang', 404, 'NO_PREVIEW');
  return b;
}

// ─── 3. PDF cả cuốn ──────────────────────────────────────────────────────

export function tenTepAnToan(ten: string): string {
  const goc = (ten || 'vo').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^\w-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
  return `${goc || 'vo'}.pdf`;
}

export async function pdfCuonVo(userId: number, chapterId: number): Promise<{ pdf: Buffer; tenTep: string; soTrang: number }> {
  if (!Number.isInteger(chapterId) || chapterId <= 0) throw new BadRequestError('Mã cuốn không hợp lệ', 'INVALID_ID');
  const cuon = await prisma.noteChapter.findFirst({
    where: { id: chapterId, userId },
    select: { id: true, title: true, subject: { select: { name: true } } },
  });
  if (!cuon) throw new AppError('Không tìm thấy cuốn vở', 404, 'NOT_FOUND');
  const trangs = await prisma.note.findMany({
    where: { userId, chapterId, clientId: { not: null }, deletedAt: null },
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    take: TRAN_TRANG_PDF,
    select: { id: true, title: true, inkPreviewKey: true },
  });
  if (!trangs.length) throw new AppError('Cuốn này chưa có trang Vở nào', 404, 'EMPTY_CHAPTER');

  const RONG = 595.28;
  const doc = new PDFDocument({ autoFirstPage: false, margin: 0, info: { Title: cuon.title, Creator: 'CuongThai · Vở' } });
  doc.registerFont('vi', notoSansViBuffer());
  doc.registerFont('vi-bold', notoSansViBoldBuffer());
  const manh: Uint8Array[] = [];
  doc.on('data', (d: Uint8Array) => manh.push(d));
  const xong = new Promise<Buffer>((giai, loi) => { doc.on('end', () => giai(Buffer.concat(manh))); doc.on('error', loi); });

  // Tải ảnh tuần tự theo lô nhỏ: 300 ảnh ~200KB cùng lúc là 60MB RAM một lượt.
  for (let i = 0; i < trangs.length; i += 6) {
    const lo = trangs.slice(i, i + 6);
    const anhs = await Promise.all(lo.map(async (t) => {
      if (!t.inkPreviewKey) return null;
      const b = await getObjectBytes(t.inkPreviewKey, 6 * 1024 * 1024);
      if (!b) return null;
      try {
        const m = await sharp(b).metadata();
        return m.width && m.height ? { b, w: m.width, h: m.height } : null;
      } catch { return null; }
    }));
    lo.forEach((t, k) => {
      const a = anhs[k];
      if (a) {
        const cao = Math.max(120, Math.min(RONG * 6, (RONG * a.h) / a.w));
        doc.addPage({ size: [RONG, cao], margin: 0 });
        doc.image(a.b, 0, 0, { width: RONG, height: cao });
      } else {
        doc.addPage({ size: [RONG, 841.89], margin: 0 });
        doc.font('vi-bold').fontSize(16).fillColor('#1f2937').text(t.title || `Trang ${i + k + 1}`, 48, 64, { width: RONG - 96 });
        doc.font('vi').fontSize(10).fillColor('#94a3b8')
          .text('Trang này chưa có ảnh xem trước — mở Vở trên iPad để đồng bộ.', 48, 96, { width: RONG - 96 });
      }
    });
  }
  doc.end();
  const tenTep = tenTepAnToan(`${cuon.subject?.name ?? ''} ${cuon.title}`.trim());
  return { pdf: await xong, tenTep, soTrang: trangs.length };
}

export const _chiDeKiemThu = { tenTepAnToan, TOKEN_RE };
