/**
 * Đối kháng — lưu ván + xếp hạng Elo (05/10/2026). Xem docs/doi-khang-spec.md.
 *
 * Elo chuẩn, K = 32 (ván < 30 của người đó) rồi 20. Tiến lên nhiều người: so từng CẶP theo thứ hạng
 * về, K chia cho (n − 1) để một ván 4 người không đổi điểm gấp ba ván 2 người.
 * Ván có bot: lưu lịch sử, KHÔNG đụng Elo (nếu không thì cày bot cấp 1 là leo hạng).
 */
import { prisma } from '../../config/database.js';
import type { KetQua, MaTro } from './luat/kieu.js';

export const ELO_GOC = 1200;

/** Điểm kỳ vọng của A khi gặp B. */
export function kyVong(a: number, b: number): number {
  return 1 / (1 + 10 ** ((b - a) / 400));
}

/**
 * Elo mới cho mỗi ghế. `hang[i]` = thứ hạng ghế i (0 = nhất); hoà = cùng hạng.
 * `soVan[i]` = số ván đã chơi trước đó (quyết định K).
 */
export function tinhElo(elo: number[], hang: number[], soVan: number[]): number[] {
  const n = elo.length;
  const doi = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    const k = (soVan[i]! < 30 ? 32 : 20) / Math.max(1, n - 1);
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const thuc = hang[i]! < hang[j]! ? 1 : hang[i] === hang[j] ? 0.5 : 0;
      doi[i] += k * (thuc - kyVong(elo[i]!, elo[j]!));
    }
  }
  return elo.map((e, i) => Math.round(e + doi[i]!));
}

/** Thứ hạng mỗi ghế từ kết quả: hoà ⇒ tất cả hạng 0; tiến lên ⇒ theo thuHang; còn lại thắng 0, thua 1. */
export function hangTuKetQua(kq: KetQua, soGhe: number): number[] {
  if (kq.hoa) return new Array<number>(soGhe).fill(0);
  if (kq.thuHang && kq.thuHang.length) {
    const h = new Array<number>(soGhe).fill(soGhe - 1);
    kq.thuHang.forEach((ghe, i) => { if (ghe >= 0 && ghe < soGhe) h[ghe] = i; });
    return h;
  }
  return Array.from({ length: soGhe }, (_, i) => (kq.thang.includes(i) ? 0 : 1));
}

export interface VanXong {
  tro: MaTro;
  maPhong: string;
  nguoiChoi: number[]; // userId theo ghế, bot = 0
  ketQua: KetQua;
  soNuoc: number;
  lichSu: unknown[];
  batDau: Date;
}

/** Lưu ván + cập nhật Elo. Trả Elo trước/sau theo ghế (null nếu không tính Elo). */
export async function luuVan(v: VanXong): Promise<{ truoc: number[]; sau: number[] } | null> {
  const coBot = v.nguoiChoi.some((id) => id === 0);
  await prisma.doiKhangVan.create({
    data: {
      tro: v.tro, maPhong: v.maPhong, nguoiChoi: v.nguoiChoi, coBot, ketQua: v.ketQua as object,
      soNuoc: v.soNuoc, lichSu: v.lichSu as object[], batDau: v.batDau,
    },
  });
  // Không tính Elo: có bot, hoặc cùng một người ngồi nhiều ghế (tự đánh với mình qua hai thiết bị).
  if (coBot || new Set(v.nguoiChoi).size !== v.nguoiChoi.length) return null;

  const cu = await prisma.doiKhangHang.findMany({ where: { tro: v.tro, userId: { in: v.nguoiChoi } } });
  const theo = new Map(cu.map((h) => [h.userId, h]));
  const truoc = v.nguoiChoi.map((id) => theo.get(id)?.elo ?? ELO_GOC);
  const soVan = v.nguoiChoi.map((id) => { const h = theo.get(id); return h ? h.thang + h.thua + h.hoa : 0; });
  const hang = hangTuKetQua(v.ketQua, v.nguoiChoi.length);
  const sau = tinhElo(truoc, hang, soVan);

  await prisma.$transaction(v.nguoiChoi.map((userId, i) => {
    const thang = !v.ketQua.hoa && hang[i] === 0 ? 1 : 0;
    const hoa = v.ketQua.hoa ? 1 : 0;
    const thua = thang || hoa ? 0 : 1;
    const chuoiCu = theo.get(userId)?.chuoi ?? 0;
    const chuoi = thang ? Math.max(0, chuoiCu) + 1 : thua ? Math.min(0, chuoiCu) - 1 : 0;
    return prisma.doiKhangHang.upsert({
      where: { uk_doi_khang_hang: { userId, tro: v.tro } },
      create: { userId, tro: v.tro, elo: sau[i]!, thang, thua, hoa, chuoi },
      update: { elo: sau[i]!, thang: { increment: thang }, thua: { increment: thua }, hoa: { increment: hoa }, chuoi },
    });
  }));
  return { truoc, sau };
}

export async function layElo(tro: MaTro, userIds: number[]): Promise<Map<number, number>> {
  const ds = await prisma.doiKhangHang.findMany({ where: { tro, userId: { in: userIds } }, select: { userId: true, elo: true } });
  return new Map(ds.map((h) => [h.userId, h.elo]));
}

const chonNguoi = { id: true, username: true, displayName: true, fullName: true, avatarUrl: true } as const;
type NguoiGon = { id: number; username: string; displayName: string | null; fullName: string | null; avatarUrl: string | null };
export const tenHienThi = (u: NguoiGon) => u.displayName || u.fullName || u.username;

export async function layNguoi(ids: number[]): Promise<Map<number, NguoiGon>> {
  const ds = await prisma.user.findMany({ where: { id: { in: ids } }, select: chonNguoi });
  return new Map(ds.map((u) => [u.id, u]));
}

export async function xepHang(tro: MaTro, gioiHan = 50) {
  const ds = await prisma.doiKhangHang.findMany({
    where: { tro, OR: [{ thang: { gt: 0 } }, { thua: { gt: 0 } }, { hoa: { gt: 0 } }] },
    orderBy: [{ elo: 'desc' }, { thang: 'desc' }], take: gioiHan,
  });
  const nguoi = await layNguoi(ds.map((h) => h.userId));
  return ds.map((h, i) => {
    const u = nguoi.get(h.userId);
    return { hang: i + 1, userId: h.userId, ten: u ? tenHienThi(u) : 'Người chơi', username: u?.username ?? '', avatar: u?.avatarUrl ?? null, elo: h.elo, thang: h.thang, thua: h.thua, hoa: h.hoa, chuoi: h.chuoi };
  });
}

export async function cuaToi(userId: number) {
  const [hang, van] = await Promise.all([
    prisma.doiKhangHang.findMany({ where: { userId } }),
    prisma.doiKhangVan.findMany({ where: { nguoiChoi: { has: userId } }, orderBy: { ketThuc: 'desc' }, take: 30, select: { id: true, tro: true, nguoiChoi: true, ketQua: true, soNuoc: true, ketThuc: true, coBot: true } }),
  ]);
  const nguoi = await layNguoi([...new Set(van.flatMap((v) => v.nguoiChoi).filter((id) => id > 0))]);
  return {
    hang: hang.map((h) => ({ tro: h.tro, elo: h.elo, thang: h.thang, thua: h.thua, hoa: h.hoa, chuoi: h.chuoi })),
    van: van.map((v) => {
      const kq = v.ketQua as unknown as KetQua;
      const ghe = v.nguoiChoi.indexOf(userId);
      return {
        id: v.id, tro: v.tro, soNuoc: v.soNuoc, ketThuc: v.ketThuc, coBot: v.coBot, lyDo: kq.lyDo,
        ketQua: kq.hoa ? 'hoa' : kq.thang.includes(ghe) ? 'thang' : 'thua',
        doiThu: v.nguoiChoi.filter((id, i) => i !== ghe).map((id) => (id === 0 ? 'Máy' : (nguoi.get(id) ? tenHienThi(nguoi.get(id)!) : 'Người chơi'))),
      };
    }),
  };
}

/** Bạn bè (ACCEPTED) đang online — để mời. */
export async function banOnline(userId: number, online: Set<number>) {
  const ds = await prisma.friendship.findMany({
    where: { status: 'ACCEPTED', OR: [{ requesterId: userId }, { addresseeId: userId }] },
    select: { requesterId: true, addresseeId: true },
  });
  const ids = ds.map((f) => (f.requesterId === userId ? f.addresseeId : f.requesterId));
  const nguoi = await layNguoi(ids);
  return ids.map((id) => nguoi.get(id)).filter((u): u is NguoiGon => !!u)
    .map((u) => ({ userId: u.id, ten: tenHienThi(u), username: u.username, avatar: u.avatarUrl, online: online.has(u.id) }))
    .sort((a, b) => Number(b.online) - Number(a.online) || a.ten.localeCompare(b.ten, 'vi'));
}
