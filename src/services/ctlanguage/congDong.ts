/**
 * CT Language — CỘNG ĐỒNG học tập theo ngôn ngữ. docs/ct-language-app.md mục "Cộng đồng".
 * 13/11/2026 (bước 6): hỏi đáp + kiểm duyệt. 14/11/2026: nâng lên mạng xã hội học tập — tab Mới nhất · Nổi bật · BTV chọn ·
 * Đang theo dõi · Đã lưu; tiêu đề + 4 loại bài + thẻ chủ đề; sửa bài; thích bài/trả lời; lượt xem; lưu; câu trả lời hay
 * nhất; @nhắc tên; tìm kiếm + lọc; thông báo trong app. Người/xếp hạng/thông báo: `congDongNguoi.ts`; Gấu AI: `congDongGau.ts`;
 * logic thuần (điểm, huy hiệu, thẻ): `congDongThuan.ts`.
 *
 * Apple 1.2 (nội dung người dùng tạo) đòi đủ bốn thứ — tất cả ở máy chủ, app chỉ là mặt tiền:
 *   1. LỌC lúc đăng/sửa — `kiemNoiDung` (bộ lọc chung của web) cho TIÊU ĐỀ, THẺ, NỘI DUNG, TRẢ LỜI ⇒ 422 `CONTENT_BLOCKED`.
 *   2. BÁO CÁO — bài / trả lời (kể cả của Gấu AI) / người. Mỗi người một lần mỗi nội dung ⇒ hộp BAO_CAO của admin
 *      (`baoAdmin`, khoá `ctw-report:ctl_bai|ctl_tra_loi:<id>:<người báo>` ⇒ nút "Gỡ nội dung" của `kiemDuyetAdmin` dùng
 *      được ngay). Đủ `NGUONG_TU_AN` người báo ⇒ TỰ ẨN chờ admin xem.
 *   3. CHẶN người — dùng lại `user_blocks`: chặn rồi thì HAI BÊN không thấy nhau ở MỌI chỗ (mọi tab, tìm kiếm, trả lời,
 *      trang người dùng, xếp hạng, thông báo); chặn cũng gỡ theo dõi hai chiều.
 *   4. Người viết bị khoá / vô hiệu ⇒ bài + trả lời ẩn theo (lọc `enabled` + `accountNonLocked` lúc đọc).
 */
import { createHash } from 'node:crypto';
import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { kiemNoiDung } from '../locNoiDung.js';
import { isAdminRoles } from '../pro.service.js';
import { dauNgayVn } from '../agent/anthropicChinhHang/hanMuc.js';
import { kiemNn, type NnTuDien } from './tuDien.js';
import { diemNoiBat, docLoai, huyHieu, LOAI_BAI, locThe, theCuaNn, timNhac, trich, type HuyHieu } from './congDongThuan.js';

export const NGUONG_TU_AN = 3;
const DAI_TOI_DA = 2000;
const TIEU_DE_TOI_DA = 150;
const LY_DO = ['spam', 'xuc-pham', 'tinh-duc', 'bao-luc', 'sai-su-that', 'khac'] as const;
export const TAB_CD = ['moi', 'noi-bat', 'btv', 'theo-doi', 'da-luu'] as const;
export type TabCD = (typeof TAB_CD)[number];

export const TAC_GIA = { id: true, username: true, fullName: true, displayName: true, avatarUrl: true } as const;
export type TacGia = { id: number; username: string; fullName: string | null; displayName: string | null; avatarUrl: string | null };
export const tacGiaGon = (u: TacGia) => ({ id: u.id, ten: u.displayName || u.fullName || u.username, avatarUrl: u.avatarUrl, username: u.username });
export const TAC_GIA_SONG = { enabled: true, accountNonLocked: true };
/** Tác giả hiển thị cho câu trả lời của Gấu (id 0 ⇒ app không hiện "Chặn" — chặn AI là vô nghĩa, vẫn báo cáo được). */
export const TAC_GIA_GAU = { id: 0, ten: 'CuongMini AI', avatarUrl: null, username: 'cuongmini' };

const loiChan = () => new AppError('Nội dung có từ ngữ không được phép (tục tĩu, xúc phạm, tình dục hoặc đe doạ). Bạn sửa lại nhé.', 422, 'CONTENT_BLOCKED');

export function kiemChu(noiDungGoc: unknown): string {
  const noiDung = String(noiDungGoc ?? '').trim();
  if (noiDung.length < 2) throw new BadRequestError('Nội dung quá ngắn.', 'CTL_CD_NGAN');
  if (noiDung.length > DAI_TOI_DA) throw new BadRequestError(`Tối đa ${DAI_TOI_DA} ký tự.`, 'CTL_CD_DAI');
  if (kiemNoiDung(noiDung).chan) throw loiChan();
  return noiDung;
}

function kiemTieuDe(goc: unknown): string | null {
  const s = String(goc ?? '').replace(/\s+/g, ' ').trim();
  if (!s) return null;
  if (s.length > TIEU_DE_TOI_DA) throw new BadRequestError(`Tiêu đề tối đa ${TIEU_DE_TOI_DA} ký tự.`, 'CTL_CD_TIEU_DE_DAI');
  if (kiemNoiDung(s).chan) throw loiChan();
  return s;
}

function kiemThe(nn: NnTuDien, goc: unknown): string[] {
  const the = locThe(nn, goc);
  // Danh sách trắng nên không bao giờ dính — vẫn kiểm (luật: MỌI chữ người dùng gửi đi qua bộ lọc).
  if (the.some((t) => kiemNoiDung(t).chan)) throw loiChan();
  return the;
}

/** Id người mình chặn + người chặn mình (hai chiều đều không thấy nhau). */
export async function dsChan(userId: number | null | undefined): Promise<number[]> {
  if (!userId) return [];
  const ds = await prisma.userBlock.findMany({
    where: { OR: [{ blockerId: userId }, { blockedId: userId }] }, select: { blockerId: true, blockedId: true },
  });
  return [...new Set(ds.map((b) => (b.blockerId === userId ? b.blockedId : b.blockerId)))];
}

export async function laAdmin(userId: number | null | undefined): Promise<boolean> {
  if (!userId) return false;
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { roles: { select: { role: { select: { name: true } } } } } });
  return isAdminRoles(u?.roles.map((r) => r.role.name));
}

/**
 * Huy hiệu cho nhiều người một lượt (thẻ bài, trả lời, xếp hạng). 4 truy vấn cho cả trang, không N+1.
 * Pro = `isPro` còn hạn (cùng luật `isProEffective`, admin đã mang "BTV").
 */
export async function huyHieuCho(ids: number[]): Promise<Map<number, HuyHieu[]>> {
  const ra = new Map<number, HuyHieu[]>();
  const ds = [...new Set(ids.filter((x) => x > 0))];
  if (!ds.length) return ra;
  const [bai, tl, hay, us] = await Promise.all([
    prisma.ctlBai.groupBy({ by: ['userId'], where: { userId: { in: ds }, anLuc: null }, _count: { _all: true } }),
    prisma.ctlTraLoi.groupBy({ by: ['userId'], where: { userId: { in: ds }, anLuc: null, laAi: false }, _count: { _all: true } }),
    prisma.ctlTraLoi.groupBy({ by: ['userId'], where: { userId: { in: ds }, anLuc: null, laAi: false, hayNhatLuc: { not: null } }, _count: { _all: true } }),
    prisma.user.findMany({ where: { id: { in: ds } }, select: { id: true, isPro: true, proExpiresAt: true, roles: { select: { role: { select: { name: true } } } } } }),
  ]);
  const dem = (arr: { userId: number; _count: { _all: number } }[]) => new Map(arr.map((x) => [x.userId, x._count._all]));
  const [mb, mt, mh] = [dem(bai), dem(tl), dem(hay)];
  const bayGio = new Date();
  for (const u of us) {
    ra.set(u.id, huyHieu({
      soBai: mb.get(u.id) ?? 0, soTraLoi: mt.get(u.id) ?? 0, soHayNhat: mh.get(u.id) ?? 0,
      laPro: u.isPro && (!u.proExpiresAt || u.proExpiresAt > bayGio),
      laAdmin: isAdminRoles(u.roles.map((r) => r.role.name)),
    }));
  }
  return ra;
}

/**
 * Ghi một thông báo chuông. Bỏ qua khi: tự gây ra cho mình, hai bên chặn nhau, hoặc (`chongTrung`) đã có thông báo
 * cùng (người nhận, người gây, loại, bài, trả lời) — thích/bỏ thích/thích lại không bắn ba lần.
 */
export async function taoThongBao(t: { nhan: number; tu: number | null; loai: string; baiId?: number | null; traLoiId?: number | null; chongTrung?: boolean }) {
  if (!t.nhan || (t.tu && t.tu === t.nhan)) return;
  if (t.tu && (await dsChan(t.nhan)).includes(t.tu)) return;
  const khoa = { userId: t.nhan, tuId: t.tu, loai: t.loai, baiId: t.baiId ?? null, traLoiId: t.traLoiId ?? null };
  if (t.chongTrung && (await prisma.ctlThongBao.findFirst({ where: khoa, select: { id: true } }))) return;
  await prisma.ctlThongBao.create({ data: khoa });
}

// ─── Đọc ─────────────────────────────────────────────────────────────────────────────────────────────────────────

const CHON_BAI = {
  id: true, nn: true, loai: true, tieuDe: true, noiDung: true, the: true, soTraLoi: true, soThich: true, soXem: true,
  btvLuc: true, suaLuc: true, aiLuc: true, createdAt: true, user: { select: TAC_GIA },
} as const;
type DongBai = Prisma.CtlBaiGetPayload<{ select: typeof CHON_BAI }>;

/** Biến hàng CSDL ⇒ thẻ bài trả cho app. `day` = nội dung đầy đủ (chi tiết), không thì đoạn trích. */
async function dongGoi(ds: DongBai[], xem: number | null, day = false) {
  const ids = ds.map((b) => b.id);
  const [hh, thich, luu, hay] = await Promise.all([
    huyHieuCho(ds.map((b) => b.user.id)),
    xem && ids.length ? prisma.ctlThichBai.findMany({ where: { userId: xem, baiId: { in: ids } }, select: { baiId: true } }) : [],
    xem && ids.length ? prisma.ctlLuuBai.findMany({ where: { userId: xem, baiId: { in: ids } }, select: { baiId: true } }) : [],
    ids.length ? prisma.ctlTraLoi.findMany({ where: { baiId: { in: ids }, hayNhatLuc: { not: null }, anLuc: null }, select: { baiId: true } }) : [],
  ]);
  const [st, sl, sh] = [new Set(thich.map((x) => x.baiId)), new Set(luu.map((x) => x.baiId)), new Set(hay.map((x) => x.baiId))];
  return ds.map(({ user, btvLuc, suaLuc, aiLuc, noiDung, ...b }) => ({
    ...b,
    noiDung: day ? noiDung : trich(noiDung),
    btv: !!btvLuc, daSua: !!suaLuc, daNhoGau: !!aiLuc, coHayNhat: sh.has(b.id),
    tacGia: { ...tacGiaGon(user), huyHieu: hh.get(user.id)?.[0] ?? null },
    cuaToi: user.id === xem, daThich: st.has(b.id), daLuu: sl.has(b.id),
  }));
}

/** Điều kiện chung "bài còn hiện với người xem này". */
async function dieuKienHien(xem: number | null): Promise<Prisma.CtlBaiWhereInput> {
  const chan = await dsChan(xem);
  return { anLuc: null, user: TAC_GIA_SONG, ...(chan.length ? { userId: { notIn: chan } } : {}) };
}

export interface LocBai { tab?: unknown; q?: unknown; loai?: unknown; the?: unknown; tu?: unknown }

/**
 * Bảng tin một ngôn ngữ. `tab`: moi (mặc định — app cũ không gửi tab) · noi-bat · btv · theo-doi · da-luu.
 * Phân trang: tab id-giảm-dần dùng `truoc` (id); `noi-bat` dùng `tu` (vị trí) — `tiep` trả đúng thứ cần gửi lại.
 * Lọc: `q` (tiêu đề + nội dung, không phân biệt hoa thường), `loai`, `the`.
 */
export async function dsBai(nnGoc: string, xem: number | null, truoc?: number, gioiHan = 20, loc: LocBai = {}) {
  const nn = kiemNn(nnGoc);
  const lim = Math.max(1, Math.min(50, Number(gioiHan) || 20));
  const tab: TabCD = (TAB_CD as readonly string[]).includes(String(loc.tab)) ? (loc.tab as TabCD) : 'moi';
  if ((tab === 'theo-doi' || tab === 'da-luu') && !xem) return { items: [], tiep: null, canDangNhap: true };

  const and: Prisma.CtlBaiWhereInput[] = [{ nn }, await dieuKienHien(xem)];
  const q = String(loc.q ?? '').trim().slice(0, 80);
  if (q) and.push({ OR: [{ noiDung: { contains: q, mode: 'insensitive' } }, { tieuDe: { contains: q, mode: 'insensitive' } }] });
  if ((LOAI_BAI as readonly string[]).includes(String(loc.loai))) and.push({ loai: String(loc.loai) });
  const the = String(loc.the ?? '').toLowerCase();
  if (theCuaNn(nn).some((t) => t.ma === the)) and.push({ the: { has: the } });
  if (tab === 'btv') and.push({ btvLuc: { not: null } });
  if (tab === 'da-luu') and.push({ luu: { some: { userId: xem! } } });
  if (tab === 'theo-doi') {
    const td = await prisma.ctlTheoDoi.findMany({ where: { nguoiId: xem! }, select: { duocId: true }, take: 2000 });
    if (!td.length) return { items: [], tiep: null };
    and.push({ userId: { in: td.map((x) => x.duocId) } });
  }

  if (tab === 'noi-bat') {
    // Ứng viên: 30 ngày gần nhất (tối đa 400 bài) ⇒ chấm điểm trong RAM ⇒ phân trang theo vị trí.
    const tu = Math.max(0, Math.floor(Number(loc.tu) || 0));
    const ung = await prisma.ctlBai.findMany({
      where: { AND: [...and, { createdAt: { gte: new Date(Date.now() - 30 * 86_400_000) } }] },
      orderBy: { id: 'desc' }, take: 400, select: CHON_BAI,
    });
    const bayGio = new Date();
    const xep = ung.map((b) => ({ b, d: diemNoiBat({ ...b, btv: !!b.btvLuc }, bayGio) })).sort((x, y) => y.d - x.d || y.b.id - x.b.id);
    const trang = xep.slice(tu, tu + lim).map((x) => x.b);
    return { items: await dongGoi(trang, xem), tiep: tu + lim < xep.length ? tu + lim : null };
  }

  if (truoc) and.push({ id: { lt: truoc } });
  const ds = await prisma.ctlBai.findMany({ where: { AND: and }, orderBy: { id: 'desc' }, take: lim + 1, select: CHON_BAI });
  const coThem = ds.length > lim;
  return { items: await dongGoi(ds.slice(0, lim), xem), tiep: coThem ? ds[lim - 1].id : null };
}

/** Bài của MỘT người (trang người dùng), mọi ngôn ngữ trừ khi truyền `nn`. */
export async function dsBaiCuaNguoi(nguoiId: number, xem: number | null, truoc?: number, nnGoc?: string) {
  const and: Prisma.CtlBaiWhereInput[] = [{ userId: nguoiId }, await dieuKienHien(xem)];
  if (nnGoc) and.push({ nn: kiemNn(nnGoc) });
  if (truoc) and.push({ id: { lt: truoc } });
  const ds = await prisma.ctlBai.findMany({ where: { AND: and }, orderBy: { id: 'desc' }, take: 21, select: CHON_BAI });
  return { items: await dongGoi(ds.slice(0, 20), xem), tiep: ds.length > 20 ? ds[19].id : null };
}

/** Khoá lượt xem: người đăng nhập theo id; khách theo IP băm (không lưu IP thô). */
export const khoaXem = (xem: number | null, ip?: string | null) =>
  xem ? `u:${xem}` : ip ? `ip:${createHash('sha256').update(ip).digest('hex').slice(0, 16)}` : null;

/** +1 lượt xem nếu (bài, người, ngày VN) chưa đếm. Tác giả tự xem không tính. Dọn dòng cũ > 3 ngày thỉnh thoảng. */
async function demXem(baiId: number, khoa: string) {
  const ngay = new Date(`${new Date(dauNgayVn().getTime() + 7 * 3_600_000).toISOString().slice(0, 10)}T00:00:00Z`);
  const r = await prisma.ctlLuotXem.createMany({ data: [{ baiId, nguoi: khoa, ngay }], skipDuplicates: true });
  if (r.count) await prisma.ctlBai.update({ where: { id: baiId }, data: { soXem: { increment: 1 } } });
  if (Math.random() < 0.01) void prisma.ctlLuotXem.deleteMany({ where: { ngay: { lt: new Date(Date.now() - 3 * 86_400_000) } } }).catch(() => undefined);
  return r.count > 0;
}

export async function chiTietBai(id: number, xem: number | null, opt: { khoaXem?: string | null } = {}) {
  const chan = await dsChan(xem);
  const b = await prisma.ctlBai.findFirst({
    where: { id, anLuc: null, user: TAC_GIA_SONG, ...(chan.length ? { userId: { notIn: chan } } : {}) },
    select: CHON_BAI,
  });
  if (!b) throw new NotFoundError('Bài không còn (đã gỡ hoặc bạn đã chặn người viết).');
  if (opt.khoaXem && b.user.id !== xem && (await demXem(id, opt.khoaXem))) b.soXem += 1;

  const tl = await prisma.ctlTraLoi.findMany({
    where: {
      baiId: id, anLuc: null, user: TAC_GIA_SONG,
      // Trả lời của Gấu mang userId người bấm — chặn người bấm không làm mất câu trả lời AI.
      ...(chan.length ? { OR: [{ laAi: true }, { userId: { notIn: chan } }] } : {}),
    },
    orderBy: { id: 'asc' }, take: 200,
    select: { id: true, noiDung: true, createdAt: true, soThich: true, laAi: true, hayNhatLuc: true, user: { select: TAC_GIA } },
  });
  const [goi] = await dongGoi([b], xem, true);
  const [hh, thichTl, theoDoi, admin] = await Promise.all([
    huyHieuCho(tl.filter((t) => !t.laAi).map((t) => t.user.id)),
    xem && tl.length ? prisma.ctlThichTraLoi.findMany({ where: { userId: xem, traLoiId: { in: tl.map((t) => t.id) } }, select: { traLoiId: true } }) : [],
    xem && xem !== b.user.id ? prisma.ctlTheoDoi.findUnique({ where: { nguoiId_duocId: { nguoiId: xem, duocId: b.user.id } }, select: { nguoiId: true } }) : null,
    laAdmin(xem),
  ]);
  const st = new Set(thichTl.map((x) => x.traLoiId));
  const traLoi = tl
    .map(({ user: u, hayNhatLuc, laAi, ...t }) => ({
      ...t, laAi, laHayNhat: !!hayNhatLuc, daThich: st.has(t.id),
      tacGia: laAi ? { ...TAC_GIA_GAU, huyHieu: null } : { ...tacGiaGon(u), huyHieu: hh.get(u.id)?.[0] ?? null },
      nhoBoi: laAi ? tacGiaGon(u).ten : null,
      cuaToi: !laAi && u.id === xem,
    }))
    // Câu hay nhất lên đầu, còn lại theo thời gian.
    .sort((x, y) => Number(y.laHayNhat) - Number(x.laHayNhat) || x.id - y.id);
  return {
    ...goi, traLoi,
    dangTheoDoiTacGia: !!theoDoi,
    coTheChonBtv: admin,
    coTheNhoGau: b.loai === 'hoi' && !b.aiLuc,
  };
}

// ─── Ghi bài ─────────────────────────────────────────────────────────────────────────────────────────────────────

export async function dangBai(userId: number, nnGoc: string, than: { noiDung?: unknown; loai?: unknown; tieuDe?: unknown; the?: unknown }) {
  const nn: NnTuDien = kiemNn(nnGoc);
  const noiDung = kiemChu(than.noiDung);
  const tieuDe = kiemTieuDe(than.tieuDe);
  const the = kiemThe(nn, than.the);
  const b = await prisma.ctlBai.create({ data: { nn, userId, loai: docLoai(than.loai), noiDung, tieuDe, the }, select: { id: true } });
  return chiTietBai(b.id, userId);
}

/** Tác giả sửa bài của mình. Chỉ trường có gửi mới đổi; đi qua đủ bộ lọc như lúc đăng. */
export async function suaBai(userId: number, id: number, than: { noiDung?: unknown; loai?: unknown; tieuDe?: unknown; the?: unknown }) {
  const b = await prisma.ctlBai.findFirst({ where: { id, userId, anLuc: null }, select: { nn: true } });
  if (!b) throw new NotFoundError('Không tìm thấy bài của bạn.');
  const data: Prisma.CtlBaiUpdateInput = { suaLuc: new Date() };
  if (than.noiDung !== undefined) data.noiDung = kiemChu(than.noiDung);
  if (than.tieuDe !== undefined) data.tieuDe = kiemTieuDe(than.tieuDe);
  if (than.the !== undefined) data.the = kiemThe(b.nn as NnTuDien, than.the);
  if (than.loai !== undefined) data.loai = docLoai(than.loai);
  await prisma.ctlBai.update({ where: { id }, data });
  return chiTietBai(id, userId);
}

export async function traLoi(userId: number, baiId: number, than: { noiDung?: unknown }) {
  const noiDung = kiemChu(than.noiDung);
  const chan = await dsChan(userId);
  const b = await prisma.ctlBai.findFirst({ where: { id: baiId, anLuc: null, user: TAC_GIA_SONG }, select: { id: true, userId: true } });
  if (!b) throw new NotFoundError('Bài không còn.');
  if (chan.includes(b.userId)) throw new AppError('Bạn không trả lời được bài của người đã chặn/bị chặn.', 403, 'CTL_CD_CHAN');
  const [tl] = await prisma.$transaction([
    prisma.ctlTraLoi.create({ data: { baiId, userId, noiDung }, select: { id: true } }),
    prisma.ctlBai.update({ where: { id: baiId }, data: { soTraLoi: { increment: 1 } } }),
  ]);
  await taoThongBao({ nhan: b.userId, tu: userId, loai: 'tra-loi', baiId, traLoiId: tl.id });
  // @nhắc tên: chỉ người có thật, còn hoạt động, không chặn nhau; tác giả bài đã có thông báo "trả lời" thì thôi.
  const nhac = timNhac(noiDung);
  if (nhac.length) {
    const us = await prisma.user.findMany({
      where: { username: { in: nhac, mode: 'insensitive' }, ...TAC_GIA_SONG, id: { notIn: [userId, b.userId, ...chan] } },
      select: { id: true }, take: 5,
    });
    for (const u of us) await taoThongBao({ nhan: u.id, tu: userId, loai: 'nhac', baiId, traLoiId: tl.id });
  }
  return chiTietBai(baiId, userId);
}

/** Tác giả xoá bài/trả lời của mình (ẩn mềm — báo cáo cũ vẫn đối chiếu được). */
export async function xoaCuaToi(userId: number, loai: 'bai' | 'tra-loi', id: number) {
  const now = new Date();
  if (loai === 'bai') {
    const r = await prisma.ctlBai.updateMany({ where: { id, userId, anLuc: null }, data: { anLuc: now, anBoi: userId } });
    if (!r.count) throw new NotFoundError('Không tìm thấy bài của bạn.');
  } else {
    const t = await prisma.ctlTraLoi.findFirst({ where: { id, userId, anLuc: null, laAi: false }, select: { baiId: true } });
    if (!t) throw new NotFoundError('Không tìm thấy câu trả lời của bạn.');
    await prisma.$transaction([
      prisma.ctlTraLoi.update({ where: { id }, data: { anLuc: now, anBoi: userId, hayNhatLuc: null } }),
      prisma.ctlBai.update({ where: { id: t.baiId }, data: { soTraLoi: { decrement: 1 } } }),
    ]);
  }
  return { daXoa: true };
}

// ─── Tương tác ───────────────────────────────────────────────────────────────────────────────────────────────────

/** Bài còn hiện + không chặn nhau với người thao tác ⇒ trả tác giả. */
async function baiChoThaoTac(userId: number, baiId: number) {
  const b = await prisma.ctlBai.findFirst({ where: { id: baiId, anLuc: null, user: TAC_GIA_SONG }, select: { userId: true, loai: true, aiLuc: true, nn: true, tieuDe: true, noiDung: true, the: true } });
  if (!b) throw new NotFoundError('Bài không còn.');
  if ((await dsChan(userId)).includes(b.userId)) throw new AppError('Bạn và người viết đã chặn nhau.', 403, 'CTL_CD_CHAN');
  return b;
}
export { baiChoThaoTac };

/** Thích / bỏ thích bài — idempotent (khoá chính đôi), đếm chỉ đổi khi thật sự thêm/bớt một dòng. */
export async function thichBai(userId: number, baiId: number, co: boolean) {
  const b = await baiChoThaoTac(userId, baiId);
  if (co) {
    const r = await prisma.ctlThichBai.createMany({ data: [{ userId, baiId }], skipDuplicates: true });
    if (r.count) {
      await prisma.ctlBai.update({ where: { id: baiId }, data: { soThich: { increment: 1 } } });
      await taoThongBao({ nhan: b.userId, tu: userId, loai: 'thich-bai', baiId, chongTrung: true });
    }
  } else {
    const r = await prisma.ctlThichBai.deleteMany({ where: { userId, baiId } });
    if (r.count) await prisma.ctlBai.update({ where: { id: baiId }, data: { soThich: { decrement: 1 } } });
  }
  const sau = await prisma.ctlBai.findUnique({ where: { id: baiId }, select: { soThich: true } });
  return { daThich: co, soThich: Math.max(0, sau?.soThich ?? 0) };
}

export async function thichTraLoi(userId: number, traLoiId: number, co: boolean) {
  const t = await prisma.ctlTraLoi.findFirst({ where: { id: traLoiId, anLuc: null, user: TAC_GIA_SONG }, select: { baiId: true, userId: true, laAi: true } });
  if (!t) throw new NotFoundError('Câu trả lời không còn.');
  await baiChoThaoTac(userId, t.baiId);
  if (!t.laAi && (await dsChan(userId)).includes(t.userId)) throw new AppError('Bạn và người viết đã chặn nhau.', 403, 'CTL_CD_CHAN');
  if (co) {
    const r = await prisma.ctlThichTraLoi.createMany({ data: [{ userId, traLoiId }], skipDuplicates: true });
    if (r.count) {
      await prisma.ctlTraLoi.update({ where: { id: traLoiId }, data: { soThich: { increment: 1 } } });
      if (!t.laAi) await taoThongBao({ nhan: t.userId, tu: userId, loai: 'thich-tra-loi', baiId: t.baiId, traLoiId, chongTrung: true });
    }
  } else {
    const r = await prisma.ctlThichTraLoi.deleteMany({ where: { userId, traLoiId } });
    if (r.count) await prisma.ctlTraLoi.update({ where: { id: traLoiId }, data: { soThich: { decrement: 1 } } });
  }
  const sau = await prisma.ctlTraLoi.findUnique({ where: { id: traLoiId }, select: { soThich: true } });
  return { daThich: co, soThich: Math.max(0, sau?.soThich ?? 0) };
}

export async function luuBai(userId: number, baiId: number, co: boolean) {
  if (co) {
    await baiChoThaoTac(userId, baiId);
    await prisma.ctlLuuBai.createMany({ data: [{ userId, baiId }], skipDuplicates: true });
  } else {
    await prisma.ctlLuuBai.deleteMany({ where: { userId, baiId } });
  }
  return { daLuu: co };
}

/** Người hỏi chọn (hoặc bỏ chọn — `traLoiId` null) câu trả lời hay nhất. Không tự chọn câu của mình. */
export async function chonHayNhat(userId: number, baiId: number, traLoiId: number | null) {
  const b = await prisma.ctlBai.findFirst({ where: { id: baiId, anLuc: null }, select: { userId: true } });
  if (!b) throw new NotFoundError('Bài không còn.');
  if (b.userId !== userId) throw new ForbiddenError('Chỉ người đăng bài mới chọn được câu trả lời hay nhất.');
  if (traLoiId === null) {
    await prisma.ctlTraLoi.updateMany({ where: { baiId, hayNhatLuc: { not: null } }, data: { hayNhatLuc: null } });
    return chiTietBai(baiId, userId);
  }
  const t = await prisma.ctlTraLoi.findFirst({ where: { id: traLoiId, baiId, anLuc: null }, select: { userId: true, laAi: true, hayNhatLuc: true } });
  if (!t) throw new NotFoundError('Câu trả lời không còn.');
  if (!t.laAi && t.userId === userId) throw new BadRequestError('Bạn không chọn câu trả lời của chính mình được.', 'CTL_CD_HAY_NHAT_MINH');
  if (!t.hayNhatLuc) {
    await prisma.$transaction([
      prisma.ctlTraLoi.updateMany({ where: { baiId, hayNhatLuc: { not: null } }, data: { hayNhatLuc: null } }),
      prisma.ctlTraLoi.update({ where: { id: traLoiId }, data: { hayNhatLuc: new Date() } }),
    ]);
    if (!t.laAi) await taoThongBao({ nhan: t.userId, tu: userId, loai: 'hay-nhat', baiId, traLoiId, chongTrung: true });
  }
  return chiTietBai(baiId, userId);
}

/** Admin: đánh dấu / bỏ "BTV chọn". */
export async function btvChon(adminId: number, baiId: number, chon: boolean) {
  const b = await prisma.ctlBai.findFirst({ where: { id: baiId, anLuc: null }, select: { userId: true, btvLuc: true } });
  if (!b) throw new NotFoundError('Bài không còn.');
  await prisma.ctlBai.update({ where: { id: baiId }, data: chon ? { btvLuc: b.btvLuc ?? new Date(), btvBoi: adminId } : { btvLuc: null, btvBoi: null } });
  if (chon && !b.btvLuc) await taoThongBao({ nhan: b.userId, tu: null, loai: 'btv-chon', baiId, chongTrung: true });
  return { btv: chon };
}

// ─── Kiểm duyệt: báo cáo · chặn ──────────────────────────────────────────────────────────────────────────────────

/**
 * Báo cáo bài / trả lời / người. Một người một lần (khoá chống trùng của `admin_notifications`); lần thứ `NGUONG_TU_AN`
 * (người khác nhau) ⇒ ẩn bài/trả lời ngay chờ admin. Trả `{ trung }` khi đã báo trước đó.
 * Câu trả lời của Gấu báo cáo được — kể cả bởi chính người đã bấm "Nhờ Gấu" (userId của dòng đó là người bấm).
 */
export async function baoCao(userId: number, than: { loai?: unknown; id?: unknown; lyDo?: unknown; chiTiet?: unknown }) {
  const loai = than.loai === 'tra-loi' ? 'tra-loi' : than.loai === 'bai' ? 'bai' : than.loai === 'nguoi' ? 'nguoi' : null;
  const id = Number(than.id);
  if (!loai || !Number.isInteger(id) || id <= 0) throw new BadRequestError('Thiếu nội dung cần báo cáo.', 'CTL_CD_BAO_CAO');
  const lyDo = (LY_DO as readonly string[]).includes(String(than.lyDo)) ? String(than.lyDo) : 'khac';
  const chiTiet = String(than.chiTiet ?? '').trim().slice(0, 500);
  const { baoAdmin } = await import('../thongBaoAdmin.service.js');

  if (loai === 'nguoi') {
    if (id === userId) throw new BadRequestError('Bạn không báo cáo chính mình được.', 'CTL_CD_BAO_CAO_MINH');
    const u = await prisma.user.findUnique({ where: { id }, select: { username: true } });
    if (!u) throw new NotFoundError('Không tìm thấy người này.');
    const row = await baoAdmin({
      loai: 'BAO_CAO', mucDo: 'can_xu_ly',
      tieuDe: `Báo cáo NGƯỜI DÙNG cộng đồng CT Language: @${u.username} (#${id})`,
      noiDung: [`Lý do: ${lyDo}`, chiTiet && `Chi tiết: ${chiTiet}`, `Người bị báo cáo: user #${id}`].filter(Boolean).join('\n'),
      userId, entityId: id, khoaChongTrung: `ctl-report-user:${id}:${userId}`,
    });
    return { daBao: true, trung: !row, daAn: false };
  }

  const m = loai === 'bai'
    ? await prisma.ctlBai.findUnique({ where: { id }, select: { userId: true, noiDung: true, nn: true, anLuc: true } })
    : await prisma.ctlTraLoi.findUnique({ where: { id }, select: { userId: true, noiDung: true, anLuc: true, laAi: true, bai: { select: { nn: true, id: true } } } });
  if (!m) throw new NotFoundError('Nội dung không còn.');
  const laAi = 'laAi' in m && m.laAi;
  if (m.userId === userId && !laAi) throw new BadRequestError('Bạn không báo cáo được nội dung của chính mình.', 'CTL_CD_BAO_CAO_MINH');
  const kind = loai === 'bai' ? 'ctl_bai' : 'ctl_tra_loi';
  const nn = 'nn' in m ? m.nn : m.bai.nn;

  const row = await baoAdmin({
    loai: 'BAO_CAO', mucDo: 'can_xu_ly',
    tieuDe: `Báo cáo cộng đồng CT Language (${nn}): ${loai === 'bai' ? 'bài' : laAi ? 'trả lời của 🐻 Gấu AI' : 'trả lời'} #${id}`,
    noiDung: [
      `Lý do: ${lyDo}`, chiTiet && `Chi tiết: ${chiTiet}`,
      laAi ? `⚠️ Câu này do AI viết (user #${m.userId} chỉ bấm "Nhờ Gấu") — chỉ "Gỡ nội dung", ĐỪNG khoá người bấm.` : `Tác giả: user #${m.userId}`,
      `Nội dung: ${m.noiDung.slice(0, 600)}`,
    ].filter(Boolean).join('\n'),
    userId,
    entityId: id,
    khoaChongTrung: `ctw-report:${kind}:${id}:${userId}`,
  });
  if (!row) return { daBao: true, trung: true };

  const capNhat = loai === 'bai'
    ? await prisma.ctlBai.update({ where: { id }, data: { soBaoCao: { increment: 1 } }, select: { soBaoCao: true, anLuc: true } })
    : await prisma.ctlTraLoi.update({ where: { id }, data: { soBaoCao: { increment: 1 } }, select: { soBaoCao: true, anLuc: true } });
  let daAn = false;
  if (!capNhat.anLuc && capNhat.soBaoCao >= NGUONG_TU_AN) {
    daAn = true;
    if (loai === 'bai') await prisma.ctlBai.update({ where: { id }, data: { anLuc: new Date() } });
    else await prisma.ctlTraLoi.update({ where: { id }, data: { anLuc: new Date() } });
  }
  return { daBao: true, trung: false, daAn };
}

export async function chan(userId: number, nguoiBiChan: number) {
  if (!Number.isInteger(nguoiBiChan) || nguoiBiChan <= 0 || nguoiBiChan === userId) throw new BadRequestError('Người cần chặn không hợp lệ.', 'CTL_CD_CHAN_SAI');
  const co = await prisma.user.findUnique({ where: { id: nguoiBiChan }, select: { id: true } });
  if (!co) throw new NotFoundError('Không tìm thấy người này.');
  await prisma.$transaction([
    prisma.userBlock.upsert({
      where: { uk_block_pair: { blockerId: userId, blockedId: nguoiBiChan } },
      update: {}, create: { blockerId: userId, blockedId: nguoiBiChan, reason: 'ctlanguage' },
    }),
    // Chặn ⇒ thôi theo dõi nhau (hai chiều), không thì tab "Đang theo dõi" vẫn còn dây nối.
    prisma.ctlTheoDoi.deleteMany({ where: { OR: [{ nguoiId: userId, duocId: nguoiBiChan }, { nguoiId: nguoiBiChan, duocId: userId }] } }),
  ]);
  return { daChan: true };
}

export async function boChan(userId: number, nguoiBiChan: number) {
  await prisma.userBlock.deleteMany({ where: { blockerId: userId, blockedId: nguoiBiChan } });
  return { daBoChan: true };
}

export async function dsDaChan(userId: number) {
  const ds = await prisma.userBlock.findMany({
    where: { blockerId: userId }, orderBy: { createdAt: 'desc' }, take: 200,
    select: { createdAt: true, blocked: { select: TAC_GIA } },
  });
  return { items: ds.map((b) => ({ ...tacGiaGon(b.blocked), luc: b.createdAt })) };
}

/** Danh mục thẻ + loại bài của một ngôn ngữ (app dựng bộ lọc / ô chọn thẻ). */
export function danhMuc(nnGoc: string) {
  const nn = kiemNn(nnGoc);
  return {
    the: theCuaNn(nn),
    loai: [
      { ma: 'hoi', ten: 'Hỏi' }, { ma: 'thao-luan', ten: 'Thảo luận' }, { ma: 'chia-se', ten: 'Chia sẻ' }, { ma: 'tim-ban', ten: 'Tìm bạn học' },
    ],
  };
}
