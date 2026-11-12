/**
 * CT Language — CỘNG ĐỒNG hỏi đáp theo ngôn ngữ (bước 6, 13/11/2026). docs/ct-language-app.md mục 2 "Cộng đồng".
 *
 * Apple 1.2 (nội dung người dùng tạo) đòi đủ bốn thứ — tất cả ở máy chủ, app chỉ là mặt tiền:
 *   1. LỌC lúc đăng — `kiemNoiDung` (bộ lọc chung của web, `locNoiDung.ts`) ⇒ 422 `CONTENT_BLOCKED`.
 *   2. BÁO CÁO — mỗi người một lần mỗi nội dung ⇒ hộp BAO_CAO của admin (`baoAdmin`, khoá chống trùng
 *      `ctw-report:ctl_bai|ctl_tra_loi:<id>:<người báo>` ⇒ nút "Gỡ nội dung"/"Khoá người viết" của `kiemDuyetAdmin`
 *      dùng được ngay). Đủ `NGUONG_TU_AN` người báo cáo ⇒ TỰ ẨN chờ admin xem (không đợi 24 giờ).
 *   3. CHẶN người — dùng lại `user_blocks` (cùng bảng chặn của tin nhắn): chặn rồi thì HAI BÊN không thấy bài nhau.
 *   4. Người viết bị khoá / vô hiệu ⇒ bài ẩn theo (lọc `enabled` + `accountNonLocked` lúc đọc).
 */
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { kiemNoiDung } from '../locNoiDung.js';
import { kiemNn, type NnTuDien } from './tuDien.js';

export const NGUONG_TU_AN = 3;
const DAI_TOI_DA = 2000;
const LOAI = ['hoi', 'thao-luan'] as const;
const LY_DO = ['spam', 'xuc-pham', 'tinh-duc', 'bao-luc', 'sai-su-that', 'khac'] as const;

const TAC_GIA = { id: true, username: true, fullName: true, displayName: true, avatarUrl: true } as const;
type TacGia = { id: number; username: string; fullName: string | null; displayName: string | null; avatarUrl: string | null };
const tacGiaGon = (u: TacGia) => ({ id: u.id, ten: u.displayName || u.fullName || u.username, avatarUrl: u.avatarUrl });
const TAC_GIA_SONG = { enabled: true, accountNonLocked: true };

function kiemChu(noiDungGoc: unknown): string {
  const noiDung = String(noiDungGoc ?? '').trim();
  if (noiDung.length < 2) throw new BadRequestError('Nội dung quá ngắn.', 'CTL_CD_NGAN');
  if (noiDung.length > DAI_TOI_DA) throw new BadRequestError(`Tối đa ${DAI_TOI_DA} ký tự.`, 'CTL_CD_DAI');
  if (kiemNoiDung(noiDung).chan) {
    throw new AppError('Nội dung có từ ngữ không được phép (tục tĩu, xúc phạm, tình dục hoặc đe doạ). Bạn sửa lại nhé.', 422, 'CONTENT_BLOCKED');
  }
  return noiDung;
}

/** Id người mình chặn + người chặn mình (hai chiều đều không thấy nhau). */
async function dsChan(userId: number | null | undefined): Promise<number[]> {
  if (!userId) return [];
  const ds = await prisma.userBlock.findMany({
    where: { OR: [{ blockerId: userId }, { blockedId: userId }] }, select: { blockerId: true, blockedId: true },
  });
  return [...new Set(ds.map((b) => (b.blockerId === userId ? b.blockedId : b.blockerId)))];
}

/** Bảng tin một ngôn ngữ, mới trước, phân trang bằng `truoc` (id). */
export async function dsBai(nnGoc: string, xem: number | null, truoc?: number, gioiHan = 20) {
  const nn = kiemNn(nnGoc);
  const chan = await dsChan(xem);
  const lim = Math.max(1, Math.min(50, gioiHan));
  const ds = await prisma.ctlBai.findMany({
    where: {
      nn, anLuc: null, user: TAC_GIA_SONG,
      ...(chan.length ? { userId: { notIn: chan } } : {}),
      ...(truoc ? { id: { lt: truoc } } : {}),
    },
    orderBy: { id: 'desc' }, take: lim + 1,
    select: { id: true, nn: true, loai: true, noiDung: true, soTraLoi: true, createdAt: true, user: { select: TAC_GIA } },
  });
  const coThem = ds.length > lim;
  return {
    items: ds.slice(0, lim).map(({ user, ...b }) => ({ ...b, tacGia: tacGiaGon(user), cuaToi: user.id === xem })),
    tiep: coThem ? ds[lim - 1].id : null,
  };
}

export async function chiTietBai(id: number, xem: number | null) {
  const chan = await dsChan(xem);
  const b = await prisma.ctlBai.findFirst({
    where: { id, anLuc: null, user: TAC_GIA_SONG, ...(chan.length ? { userId: { notIn: chan } } : {}) },
    select: { id: true, nn: true, loai: true, noiDung: true, soTraLoi: true, createdAt: true, user: { select: TAC_GIA } },
  });
  if (!b) throw new NotFoundError('Bài không còn (đã gỡ hoặc bạn đã chặn người viết).');
  const tl = await prisma.ctlTraLoi.findMany({
    where: { baiId: id, anLuc: null, user: TAC_GIA_SONG, ...(chan.length ? { userId: { notIn: chan } } : {}) },
    orderBy: { id: 'asc' }, take: 200,
    select: { id: true, noiDung: true, createdAt: true, user: { select: TAC_GIA } },
  });
  const { user, ...bai } = b;
  return {
    ...bai, tacGia: tacGiaGon(user), cuaToi: user.id === xem,
    traLoi: tl.map(({ user: u, ...t }) => ({ ...t, tacGia: tacGiaGon(u), cuaToi: u.id === xem })),
  };
}

export async function dangBai(userId: number, nnGoc: string, than: { noiDung?: unknown; loai?: unknown }) {
  const nn: NnTuDien = kiemNn(nnGoc);
  const noiDung = kiemChu(than.noiDung);
  const loai = (LOAI as readonly string[]).includes(String(than.loai)) ? String(than.loai) : 'hoi';
  const b = await prisma.ctlBai.create({ data: { nn, userId, loai, noiDung }, select: { id: true } });
  return chiTietBai(b.id, userId);
}

export async function traLoi(userId: number, baiId: number, than: { noiDung?: unknown }) {
  const noiDung = kiemChu(than.noiDung);
  const chan = await dsChan(userId);
  const b = await prisma.ctlBai.findFirst({ where: { id: baiId, anLuc: null }, select: { id: true, userId: true } });
  if (!b) throw new NotFoundError('Bài không còn.');
  if (chan.includes(b.userId)) throw new AppError('Bạn không trả lời được bài của người đã chặn/bị chặn.', 403, 'CTL_CD_CHAN');
  await prisma.$transaction([
    prisma.ctlTraLoi.create({ data: { baiId, userId, noiDung } }),
    prisma.ctlBai.update({ where: { id: baiId }, data: { soTraLoi: { increment: 1 } } }),
  ]);
  return chiTietBai(baiId, userId);
}

/** Tác giả xoá bài/trả lời của mình (ẩn mềm — báo cáo cũ vẫn đối chiếu được). */
export async function xoaCuaToi(userId: number, loai: 'bai' | 'tra-loi', id: number) {
  const now = new Date();
  if (loai === 'bai') {
    const r = await prisma.ctlBai.updateMany({ where: { id, userId, anLuc: null }, data: { anLuc: now, anBoi: userId } });
    if (!r.count) throw new NotFoundError('Không tìm thấy bài của bạn.');
  } else {
    const t = await prisma.ctlTraLoi.findFirst({ where: { id, userId, anLuc: null }, select: { baiId: true } });
    if (!t) throw new NotFoundError('Không tìm thấy câu trả lời của bạn.');
    await prisma.$transaction([
      prisma.ctlTraLoi.update({ where: { id }, data: { anLuc: now, anBoi: userId } }),
      prisma.ctlBai.update({ where: { id: t.baiId }, data: { soTraLoi: { decrement: 1 } } }),
    ]);
  }
  return { daXoa: true };
}

/**
 * Báo cáo. Một người một lần (khoá chống trùng của `admin_notifications`); lần thứ `NGUONG_TU_AN` (người khác nhau)
 * ⇒ ẩn ngay chờ admin. Trả `{ trung }` khi đã báo trước đó.
 */
export async function baoCao(userId: number, than: { loai?: unknown; id?: unknown; lyDo?: unknown; chiTiet?: unknown }) {
  const loai = than.loai === 'tra-loi' ? 'tra-loi' : than.loai === 'bai' ? 'bai' : null;
  const id = Number(than.id);
  if (!loai || !Number.isInteger(id) || id <= 0) throw new BadRequestError('Thiếu nội dung cần báo cáo.', 'CTL_CD_BAO_CAO');
  const lyDo = (LY_DO as readonly string[]).includes(String(than.lyDo)) ? String(than.lyDo) : 'khac';
  const chiTiet = String(than.chiTiet ?? '').trim().slice(0, 500);
  const m = loai === 'bai'
    ? await prisma.ctlBai.findUnique({ where: { id }, select: { userId: true, noiDung: true, nn: true, anLuc: true } })
    : await prisma.ctlTraLoi.findUnique({ where: { id }, select: { userId: true, noiDung: true, anLuc: true, bai: { select: { nn: true, id: true } } } });
  if (!m) throw new NotFoundError('Nội dung không còn.');
  if (m.userId === userId) throw new BadRequestError('Bạn không báo cáo được nội dung của chính mình.', 'CTL_CD_BAO_CAO_MINH');
  const kind = loai === 'bai' ? 'ctl_bai' : 'ctl_tra_loi';
  const nn = 'nn' in m ? m.nn : m.bai.nn;

  const { baoAdmin } = await import('../thongBaoAdmin.service.js');
  const row = await baoAdmin({
    loai: 'BAO_CAO', mucDo: 'can_xu_ly',
    tieuDe: `Báo cáo cộng đồng CT Language (${nn}): ${loai === 'bai' ? 'bài' : 'trả lời'} #${id}`,
    noiDung: [`Lý do: ${lyDo}`, chiTiet && `Chi tiết: ${chiTiet}`, `Tác giả: user #${m.userId}`, `Nội dung: ${m.noiDung.slice(0, 600)}`].filter(Boolean).join('\n'),
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
  await prisma.userBlock.upsert({
    where: { uk_block_pair: { blockerId: userId, blockedId: nguoiBiChan } },
    update: {}, create: { blockerId: userId, blockedId: nguoiBiChan, reason: 'ctlanguage' },
  });
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
