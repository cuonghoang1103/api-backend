/**
 * Số liệu cho trang admin cổng Claude chính hãng. TẤT CẢ là SỐ TỰ ĐO (từ
 * `usage` Anthropic trả về mỗi lời gọi × bảng giá trong `gia.ts`) — không phải
 * số dư thật. Đối chiếu số thật: `doiChieu.ts` (cần Admin API key).
 */
import { Prisma } from '@prisma/client';

import { prisma } from '../../../config/database.js';
import { chuKyKe, dauChuKy, napTuMoiTruong } from './khoKey.js';
import { dauThangVn, dauNgayVn, docTranGoi, goiCuaNguoi, xemHanMucChinhHang } from './hanMuc.js';

/** đọc đệm / (vào không đệm + đọc đệm + ghi đệm). */
export function tiLe(vao: number | null, doc: number | null, ghi: number | null): number | null {
  const tong = (vao ?? 0) + (doc ?? 0) + (ghi ?? 0);
  return tong > 0 ? Math.round(((doc ?? 0) / tong) * 1000) / 1000 : null;
}

export async function dsKeyAdmin(luc = new Date()) {
  await napTuMoiTruong();
  const rows = await prisma.anthropicKey.findMany({ orderBy: [{ thuTu: 'asc' }, { id: 'asc' }] });
  return Promise.all(rows.map(async (r) => {
    const dau = dauChuKy(r.ngayLamMoi, luc);
    const [tong, loi] = await Promise.all([
      prisma.anthropicUsage.aggregate({
        where: { keyId: r.id, createdAt: { gte: dau } },
        _sum: { costUsd: true, inputTokens: true, cacheDocTokens: true, cacheGhiTokens: true }, _count: true, _avg: { thoiGianMs: true, ttfbMs: true },
      }),
      prisma.anthropicUsage.count({ where: { keyId: r.id, createdAt: { gte: dau }, thanhCong: false } }),
    ]);
    const daDung = tong._sum.costUsd ?? 0;
    const hetHan = Boolean(r.hetHanLuc && r.hetHanLuc <= luc);
    const chamNganSach = r.nganSachThangUsd > 0 && daDung >= r.nganSachThangUsd;
    return {
      id: r.id,
      nhan: r.nhan,
      duoiKhoa: r.duoiKhoa,
      thuTu: r.thuTu,
      trangThai: r.trangThai,
      nganSachThangUsd: r.nganSachThangUsd,
      ngayLamMoi: r.ngayLamMoi,
      hetHanLuc: r.hetHanLuc?.toISOString() ?? null,
      loiCuoi: r.loiCuoi,
      loiCuoiLuc: r.loiCuoiLuc?.toISOString() ?? null,
      hetCreditLuc: r.hetCreditLuc?.toISOString() ?? null,
      chuKy: { tu: dau.toISOString(), lamMoiLuc: chuKyKe(r.ngayLamMoi, luc).toISOString() },
      daDungUsd: Math.round(daDung * 10_000) / 10_000,
      conLaiUocUsd: r.nganSachThangUsd > 0 ? Math.max(0, Math.round((r.nganSachThangUsd - daDung) * 100) / 100) : null,
      soLuot: tong._count,
      soLoi: loi,
      tbThoiGianMs: tong._avg.thoiGianMs ? Math.round(tong._avg.thoiGianMs) : null,
      tbTtfbMs: tong._avg.ttfbMs ? Math.round(tong._avg.ttfbMs) : null,
      /** Tỉ lệ token vào đọc từ đệm (0–1) trong chu kỳ — prompt caching có trúng không. */
      tiLeTrungDem: tiLe(tong._sum.inputTokens, tong._sum.cacheDocTokens, tong._sum.cacheGhiTokens),
      /** Lý do key đang bị BỎ QUA dù trạng thái còn `hoatDong`. */
      boQua: hetHan ? 'hetHan' : chamNganSach ? 'chamNganSach' : null,
      taoLuc: r.createdAt.toISOString(),
    };
  }));
}

export async function tongQuanDung(soNgay = 30, luc = new Date()) {
  const tu = new Date(luc.getTime() - Math.min(366, Math.max(1, soNgay)) * 86_400_000);
  const [theoNguoiRaw, theoModel, theoNgay, thang] = await Promise.all([
    prisma.anthropicUsage.groupBy({
      by: ['userId', 'hang'],
      where: { createdAt: { gte: tu } },
      _sum: { costUsd: true, inputTokens: true, outputTokens: true, cacheDocTokens: true },
      _count: true,
    }),
    prisma.anthropicUsage.groupBy({
      by: ['model', 'hang'],
      where: { createdAt: { gte: tu } },
      _sum: { costUsd: true, inputTokens: true, outputTokens: true, cacheDocTokens: true, cacheGhiTokens: true },
      _count: true,
      _avg: { thoiGianMs: true, ttfbMs: true },
    }),
    prisma.$queryRaw<Array<{ ngay: string; hang: string; usd: number; luot: bigint }>>(Prisma.sql`
      SELECT to_char((created_at + interval '7 hours')::date, 'YYYY-MM-DD') AS ngay,
             hang, COALESCE(SUM(cost_usd), 0)::float8 AS usd, COUNT(*) AS luot
      FROM anthropic_usage_logs
      WHERE created_at >= ${tu}
      GROUP BY 1, 2 ORDER BY 1`),
    prisma.anthropicUsage.aggregate({
      where: { createdAt: { gte: dauThangVn(luc) } },
      _sum: { costUsd: true, inputTokens: true, cacheDocTokens: true, cacheGhiTokens: true }, _count: true,
    }),
  ]);

  const ids = [...new Set(theoNguoiRaw.map((r) => r.userId).filter((x): x is number => x !== null))];
  const users = ids.length
    ? await prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true, email: true, username: true, fullName: true } })
    : [];
  const gop = new Map<number | null, { userId: number | null; usd: number; usdFree: number; usdCao: number; luot: number }>();
  for (const r of theoNguoiRaw) {
    const cu = gop.get(r.userId) ?? { userId: r.userId, usd: 0, usdFree: 0, usdCao: 0, luot: 0 };
    const u = r._sum.costUsd ?? 0;
    cu.usd += u;
    if (r.hang === 'free') cu.usdFree += u; else cu.usdCao += u;
    cu.luot += r._count;
    gop.set(r.userId, cu);
  }
  const theoNguoi = [...gop.values()]
    .sort((a, b) => b.usd - a.usd)
    .slice(0, 100)
    .map((r) => {
      const u = users.find((x) => x.id === r.userId);
      return { ...r, email: u?.email ?? null, ten: u?.fullName || u?.username || null };
    });

  return {
    soNgay,
    tu: tu.toISOString(),
    thangNay: {
      usd: thang._sum.costUsd ?? 0, luot: thang._count,
      tiLeTrungDem: tiLe(thang._sum.inputTokens, thang._sum.cacheDocTokens, thang._sum.cacheGhiTokens),
    },
    theoNguoi,
    theoModel: theoModel.map((r) => ({
      model: r.model, hang: r.hang, usd: r._sum.costUsd ?? 0, luot: r._count,
      token: { vao: r._sum.inputTokens ?? 0, ra: r._sum.outputTokens ?? 0, cacheDoc: r._sum.cacheDocTokens ?? 0, cacheGhi: r._sum.cacheGhiTokens ?? 0 },
      tbThoiGianMs: r._avg.thoiGianMs ? Math.round(r._avg.thoiGianMs) : null,
      tbTtfbMs: r._avg.ttfbMs ? Math.round(r._avg.ttfbMs) : null,
    })),
    theoNgay: theoNgay.map((r) => ({ ngay: r.ngay, hang: r.hang, usd: Number(r.usd), luot: Number(r.luot) })),
  };
}

/** Một người: gói, đã dùng / trần (free + cao), trần riêng nếu có. */
export async function hanMucNguoiAdmin(userId: number) {
  const [goi, free, cao, rieng] = await Promise.all([
    goiCuaNguoi(userId).catch(() => 'khac' as const),
    xemHanMucChinhHang(userId, 'free'),
    xemHanMucChinhHang(userId, 'cao'),
    prisma.anthropicUserCap.findUnique({ where: { userId } }),
  ]);
  return { userId, goi, free, cao, rieng };
}

/** Tìm người theo email/username/tên — cho ô tìm trên trang admin. */
export async function timNguoi(q: string) {
  const s = q.trim();
  if (s.length < 2) return [];
  const so = Number(s);
  const ds = await prisma.user.findMany({
    where: {
      OR: [
        ...(Number.isInteger(so) && so > 0 ? [{ id: so }] : []),
        { email: { contains: s, mode: 'insensitive' as const } },
        { username: { contains: s, mode: 'insensitive' as const } },
        { fullName: { contains: s, mode: 'insensitive' as const } },
      ],
    },
    select: { id: true, email: true, username: true, fullName: true },
    take: 10,
  });
  return Promise.all(ds.map(async (u) => ({
    id: u.id, email: u.email, ten: u.fullName || u.username, ...(await hanMucNguoiAdmin(u.id)),
  })));
}

/** Mọi người đang có trần riêng, kèm số đã dùng tháng/ngày. */
export async function dsTranRieng(luc = new Date()) {
  const caps = await prisma.anthropicUserCap.findMany({ orderBy: { updatedAt: 'desc' }, take: 200 });
  if (!caps.length) return [];
  const ids = caps.map((c) => c.userId);
  const [users, thang, ngay] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true, email: true, username: true, fullName: true } }),
    prisma.anthropicUsage.groupBy({ by: ['userId', 'hang'], where: { userId: { in: ids }, createdAt: { gte: dauThangVn(luc) } }, _sum: { costUsd: true } }),
    prisma.anthropicUsage.groupBy({ by: ['userId', 'hang'], where: { userId: { in: ids }, createdAt: { gte: dauNgayVn(luc) } }, _sum: { costUsd: true } }),
  ]);
  const lay = (ds: typeof thang, id: number, hang: string) => ds.find((r) => r.userId === id && r.hang === hang)?._sum.costUsd ?? 0;
  return caps.map((c) => {
    const u = users.find((x) => x.id === c.userId);
    return {
      ...c,
      updatedAt: c.updatedAt.toISOString(),
      email: u?.email ?? null,
      ten: u?.fullName || u?.username || null,
      daDung: {
        freeThang: lay(thang, c.userId, 'free'), freeNgay: lay(ngay, c.userId, 'free'),
        caoThang: lay(thang, c.userId, 'cao'), caoNgay: lay(ngay, c.userId, 'cao'),
      },
    };
  });
}

export { docTranGoi };
