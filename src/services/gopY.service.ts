/**
 * Góp ý & báo lỗi (08/11/2026) — trang /gop-y, hộp đánh giá 5 sao tự hiện, và /admin/gop-y.
 *
 * Mỗi góp ý mới đi ra (không cái nào được làm hỏng việc lưu — đều nuốt lỗi):
 *   1. bảng `user_feedback` — nguồn sự thật;
 *   2. hộp thư admin `baoAdmin()` — chuông /admin + Telegram;
 *   3. email tới mọi tài khoản ADMIN — CHỈ khi có nội dung chữ (một cú chấm sao trơn từ hộp tự hiện không đáng
 *      một email; nó vẫn vào hộp thư và bảng thống kê).
 * Admin trả lời ⇒ người gửi thấy ở /gop-y (mục "Góp ý của bạn") + nhận một thông báo chuông.
 */
import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { baoAdmin } from './thongBaoAdmin.service.js';
import { emailService } from './email.service.js';

export const LOAI_GOP_Y = ['BUG', 'FEATURE', 'IMPROVE', 'CONTENT', 'PRAISE', 'OTHER', 'RATING'] as const;
export type LoaiGopY = (typeof LOAI_GOP_Y)[number];
export const MUC_DO = ['THAP', 'VUA', 'CAO', 'CHAN'] as const;
export const TRANG_THAI = ['MOI', 'DANG_XEM', 'DA_XU_LY', 'BO_QUA'] as const;
export type TrangThaiGopY = (typeof TRANG_THAI)[number];

const TEN_LOAI: Record<LoaiGopY, string> = {
  BUG: 'Báo lỗi',
  FEATURE: 'Đề xuất tính năng',
  IMPROVE: 'Cải thiện trải nghiệm',
  CONTENT: 'Nội dung khoá học',
  PRAISE: 'Lời khen',
  OTHER: 'Khác',
  RATING: 'Đánh giá nhanh',
};
const TEN_MUC_DO: Record<string, string> = { THAP: 'thấp', VUA: 'vừa', CAO: 'cao', CHAN: 'chặn hẳn — không dùng được' };

export interface GopYMoi {
  loai: LoaiGopY;
  soSao?: number | null;
  tieuDe?: string | null;
  noiDung?: string | null;
  mucDo?: string | null;
  trang?: string | null;
  nguon?: 'PAGE' | 'POPUP';
  emailLienHe?: string | null;
  thietBi?: string | null;
  anhUrls?: string[];
}

const catChu = (s: string | null | undefined, max: number): string | null => {
  const t = (s ?? '').trim();
  return t ? t.slice(0, max) : null;
};

/** Chỉ nhận ảnh nằm trong kho media của chính web (đã tải qua /files/upload) — không lưu link lạ. */
export function locAnh(urls: unknown, base = config.r2.publicUrl): string[] {
  if (!Array.isArray(urls) || !base) return [];
  return urls
    .filter((u): u is string => typeof u === 'string' && u.startsWith(`${base}/`) && u.length <= 600)
    .slice(0, 3);
}

const thoat = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

async function emailAdmin(id: number, g: GopYMoi, nguoi: string): Promise<void> {
  const admins = await prisma.user.findMany({
    where: { enabled: true, roles: { some: { role: { name: { in: ['ADMIN', 'ROLE_ADMIN'] } } } } },
    select: { email: true },
  });
  const web = (process.env.PUBLIC_WEB_URL || 'https://cuongthai.com').replace(/\/+$/, '');
  const sao = g.soSao ? `${'★'.repeat(g.soSao)}${'☆'.repeat(5 - g.soSao)} (${g.soSao}/5)` : '—';
  const dong = (k: string, v: string | null | undefined) =>
    v ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:4px 0">${v}</td></tr>` : '';
  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:620px;color:#0f172a">
  <h2 style="margin:0 0 4px">${thoat(TEN_LOAI[g.loai])}${g.tieuDe ? `: ${thoat(g.tieuDe)}` : ''}</h2>
  <p style="margin:0 0 16px;color:#64748b">Góp ý #${id} từ ${thoat(nguoi)}</p>
  ${g.noiDung ? `<div style="white-space:pre-wrap;background:#f1f5f9;border-radius:10px;padding:14px 16px;margin-bottom:16px">${thoat(g.noiDung)}</div>` : ''}
  <table style="font-size:14px;border-collapse:collapse">
    ${dong('Đánh giá', sao)}
    ${dong('Mức độ', g.mucDo ? thoat(TEN_MUC_DO[g.mucDo] ?? g.mucDo) : null)}
    ${dong('Trang', g.trang ? `<a href="${thoat(web + g.trang)}">${thoat(g.trang)}</a>` : null)}
    ${dong('Liên hệ', g.emailLienHe ? thoat(g.emailLienHe) : null)}
    ${dong('Thiết bị', g.thietBi ? thoat(g.thietBi) : null)}
    ${dong('Ảnh', g.anhUrls?.length ? g.anhUrls.map((u, i) => `<a href="${thoat(u)}">ảnh ${i + 1}</a>`).join(' · ') : null)}
  </table>
  <p style="margin-top:20px"><a href="${web}/admin/gop-y?id=${id}" style="background:#4f46e5;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px;display:inline-block">Mở và trả lời trong trang quản trị</a></p>
</div>`;
  for (const a of admins) {
    if (!a.email) continue;
    await emailService.send({
      to: a.email,
      subject: `[Góp ý #${id}] ${TEN_LOAI[g.loai]}${g.tieuDe ? ` — ${g.tieuDe}` : ''}`.slice(0, 180),
      html,
      ...(g.emailLienHe ? { replyTo: g.emailLienHe } : {}),
    });
  }
}

export async function taoGopY(g: GopYMoi, userId: number | null): Promise<{ id: number }> {
  if (!LOAI_GOP_Y.includes(g.loai)) throw new AppError('Loại góp ý không hợp lệ', 400, 'GOP_Y_LOAI');
  const soSao = g.soSao == null ? null : Math.round(Number(g.soSao));
  if (soSao != null && !(soSao >= 1 && soSao <= 5)) throw new AppError('Số sao phải từ 1 đến 5', 400, 'GOP_Y_SAO');
  const noiDung = catChu(g.noiDung, 5000);
  if (g.loai === 'RATING') {
    if (soSao == null) throw new AppError('Hãy chọn số sao', 400, 'GOP_Y_SAO');
  } else if (!noiDung || noiDung.length < 5) {
    throw new AppError('Hãy viết vài dòng để mình hiểu góp ý của bạn (ít nhất 5 ký tự)', 400, 'GOP_Y_NOI_DUNG');
  }
  const emailLienHe = catChu(g.emailLienHe, 200);
  if (emailLienHe && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLienHe)) {
    throw new AppError('Email liên hệ không hợp lệ', 400, 'GOP_Y_EMAIL');
  }
  const ban: GopYMoi = {
    loai: g.loai,
    soSao,
    tieuDe: catChu(g.tieuDe, 200),
    noiDung,
    mucDo: g.loai === 'BUG' && g.mucDo && (MUC_DO as readonly string[]).includes(g.mucDo) ? g.mucDo : null,
    trang: catChu(g.trang, 500),
    nguon: g.nguon === 'POPUP' ? 'POPUP' : 'PAGE',
    emailLienHe: userId ? null : emailLienHe,
    thietBi: catChu(g.thietBi, 400),
    anhUrls: userId ? locAnh(g.anhUrls) : [],
  };

  const row = await prisma.userFeedback.create({
    data: {
      userId,
      loai: ban.loai,
      soSao: ban.soSao,
      tieuDe: ban.tieuDe,
      noiDung: ban.noiDung,
      mucDo: ban.mucDo,
      trang: ban.trang,
      nguon: ban.nguon!,
      emailLienHe: ban.emailLienHe,
      thietBi: ban.thietBi,
      anhUrls: ban.anhUrls ?? [],
    },
    select: { id: true },
  });

  // Báo admin — chạy nền, không bao giờ làm rớt góp ý đã lưu.
  void (async () => {
    try {
      const u = userId
        ? await prisma.user.findUnique({ where: { id: userId }, select: { username: true, email: true } })
        : null;
      const nguoi = u ? `${u.username} <${u.email}>` : ban.emailLienHe ? `khách <${ban.emailLienHe}>` : 'khách (ẩn danh)';
      const coChu = !!ban.noiDung;
      const tom = ban.noiDung ? ban.noiDung.slice(0, 280) : `Chấm ${ban.soSao}/5 sao`;
      await baoAdmin({
        loai: 'GOP_Y',
        tieuDe: `${TEN_LOAI[ban.loai]}${ban.soSao ? ` · ${ban.soSao}★` : ''}${ban.tieuDe ? ` — ${ban.tieuDe}` : ''}`.slice(0, 190),
        noiDung: `${nguoi}${ban.trang ? ` · ${ban.trang}` : ''}\n${tom}`,
        duongDan: `/admin/gop-y?id=${row.id}`,
        mucDo: ban.loai === 'BUG' || (ban.soSao != null && ban.soSao <= 2) ? 'can_xu_ly' : 'thuong',
        userId,
        entityId: row.id,
        khoaChongTrung: `GOP_Y:${row.id}`,
      });
      if (coChu) await emailAdmin(row.id, ban, nguoi);
    } catch (err) {
      logger.warn('[gop-y] báo admin hỏng (góp ý vẫn đã lưu)', { id: row.id, error: (err as Error).message });
    }
  })();

  return row;
}

const CHON_CHO_NGUOI_GUI = {
  id: true, loai: true, soSao: true, tieuDe: true, noiDung: true, mucDo: true, trang: true, anhUrls: true,
  trangThai: true, traLoi: true, traLoiLuc: true, createdAt: true,
} as const;

export async function gopYCuaToi(userId: number) {
  return prisma.userFeedback.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: CHON_CHO_NGUOI_GUI,
  });
}

/** Hộp tự hiện có nên hỏi người này không: đã chấm/góp ý trong 60 ngày qua thì thôi. */
export async function nenHoiDanhGia(userId: number): Promise<boolean> {
  const moc = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
  const gan = await prisma.userFeedback.findFirst({
    where: { userId, createdAt: { gte: moc }, soSao: { not: null } },
    select: { id: true },
  });
  return !gan;
}

// ─────────────────────────── Admin ───────────────────────────

export async function danhSachAdmin(q: { trangThai?: string; loai?: string; tim?: string; trang?: number; id?: number }) {
  const where: Record<string, unknown> = {};
  if (q.id) where.id = q.id;
  if (q.trangThai && (TRANG_THAI as readonly string[]).includes(q.trangThai)) where.trangThai = q.trangThai;
  if (q.loai && (LOAI_GOP_Y as readonly string[]).includes(q.loai)) where.loai = q.loai;
  if (q.tim?.trim()) {
    const t = q.tim.trim().slice(0, 100);
    where.OR = [
      { noiDung: { contains: t, mode: 'insensitive' } },
      { tieuDe: { contains: t, mode: 'insensitive' } },
      { trang: { contains: t, mode: 'insensitive' } },
      { emailLienHe: { contains: t, mode: 'insensitive' } },
      { user: { is: { OR: [{ username: { contains: t, mode: 'insensitive' } }, { email: { contains: t, mode: 'insensitive' } }] } } },
    ];
  }
  const kichTrang = 30;
  const trang = Math.max(1, q.trang ?? 1);
  const [items, tong] = await Promise.all([
    prisma.userFeedback.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (trang - 1) * kichTrang,
      take: kichTrang,
      include: { user: { select: { id: true, username: true, email: true, avatarUrl: true } } },
    }),
    prisma.userFeedback.count({ where }),
  ]);
  return { items, tong, trang, kichTrang };
}

export async function thongKeAdmin() {
  const moc30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [theoTrangThai, theoLoai, sao, sao30, phanBoSao] = await Promise.all([
    prisma.userFeedback.groupBy({ by: ['trangThai'], _count: { _all: true } }),
    prisma.userFeedback.groupBy({ by: ['loai'], _count: { _all: true } }),
    prisma.userFeedback.aggregate({ where: { soSao: { not: null } }, _avg: { soSao: true }, _count: { soSao: true } }),
    prisma.userFeedback.aggregate({ where: { soSao: { not: null }, createdAt: { gte: moc30 } }, _avg: { soSao: true }, _count: { soSao: true } }),
    prisma.userFeedback.groupBy({ by: ['soSao'], where: { soSao: { not: null } }, _count: { _all: true } }),
  ]);
  return {
    theoTrangThai: Object.fromEntries(theoTrangThai.map((r) => [r.trangThai, r._count._all])),
    theoLoai: Object.fromEntries(theoLoai.map((r) => [r.loai, r._count._all])),
    saoTrungBinh: sao._avg.soSao,
    soLuotSao: sao._count.soSao,
    saoTrungBinh30: sao30._avg.soSao,
    soLuotSao30: sao30._count.soSao,
    phanBoSao: Object.fromEntries(phanBoSao.map((r) => [String(r.soSao), r._count._all])),
  };
}

export async function capNhatAdmin(
  id: number,
  adminId: number,
  d: { trangThai?: string; traLoi?: string | null; ghiChuNoiBo?: string | null },
) {
  const cu = await prisma.userFeedback.findUnique({ where: { id }, select: { id: true, userId: true, traLoi: true, tieuDe: true, loai: true } });
  if (!cu) throw new AppError('Không tìm thấy góp ý', 404, 'GOP_Y_NOT_FOUND');
  const data: Record<string, unknown> = {};
  if (d.trangThai !== undefined) {
    if (!(TRANG_THAI as readonly string[]).includes(d.trangThai)) throw new AppError('Trạng thái không hợp lệ', 400, 'GOP_Y_TRANG_THAI');
    data.trangThai = d.trangThai;
  }
  if (d.ghiChuNoiBo !== undefined) data.ghiChuNoiBo = catChu(d.ghiChuNoiBo, 5000);
  const traLoiMoi = d.traLoi !== undefined ? catChu(d.traLoi, 5000) : undefined;
  if (traLoiMoi !== undefined) {
    data.traLoi = traLoiMoi;
    data.traLoiBoiId = traLoiMoi ? adminId : null;
    data.traLoiLuc = traLoiMoi ? new Date() : null;
  }
  const row = await prisma.userFeedback.update({ where: { id }, data });

  // Trả lời mới (hoặc sửa) ⇒ báo người gửi qua chuông, bấm vào mở thẳng lịch sử góp ý.
  if (traLoiMoi && traLoiMoi !== cu.traLoi && cu.userId && cu.userId !== adminId) {
    try {
      await prisma.socialNotification.create({
        data: {
          receiverId: cu.userId,
          senderId: adminId,
          type: 'ADMIN_ANNOUNCEMENT',
          entityId: null,
          payload: {
            title: 'Admin đã trả lời góp ý của bạn',
            body: traLoiMoi.slice(0, 300),
            loai: 'GOP_Y_TRA_LOI',
            url: `/gop-y?xem=${id}#lich-su`,
          },
        },
      });
    } catch (err) {
      logger.warn('[gop-y] báo người gửi hỏng', { id, error: (err as Error).message });
    }
  }
  return row;
}
