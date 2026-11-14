/**
 * CT Language — CỘNG ĐỒNG: trang người dùng · theo dõi · bảng xếp hạng · thông báo chuông (14/11/2026).
 * Luật chặn (Apple 1.2) áp ở MỌI hàm: hai người chặn nhau ⇒ không thấy trang nhau, không theo dõi được, không nằm trong
 * bảng xếp hạng của nhau, không thấy thông báo do người kia gây ra. Người bị khoá / vô hiệu ⇒ biến khỏi mọi danh sách.
 */
import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError, AppError } from '../../middleware/errorHandler.js';
import { isProEffective, isAdminRoles } from '../pro.service.js';
import { kiemNn } from './tuDien.js';
import { dsChan, huyHieuCho, TAC_GIA, TAC_GIA_SONG, tacGiaGon, taoThongBao } from './congDong.js';
import { diemXepHang, docKhoang, huyHieu, trich, tuNgayXepHang } from './congDongThuan.js';

// ─── Trang người dùng ────────────────────────────────────────────────────────────────────────────────────────────

export async function hoSoNguoi(id: number, xem: number | null) {
  const chan = await dsChan(xem);
  const u = await prisma.user.findFirst({
    where: { id, ...TAC_GIA_SONG }, select: { ...TAC_GIA, bio: true, createdAt: true, roles: { select: { role: { select: { name: true } } } } },
  });
  if (!u || chan.includes(id)) throw new NotFoundError('Không xem được trang này (người dùng không còn, hoặc hai bạn đã chặn nhau).');
  const [soBai, soTraLoi, soHayNhat, soNguoiTheoDoi, soDangTheoDoi, dangTheoDoi, laPro] = await Promise.all([
    prisma.ctlBai.count({ where: { userId: id, anLuc: null } }),
    prisma.ctlTraLoi.count({ where: { userId: id, anLuc: null, laAi: false } }),
    prisma.ctlTraLoi.count({ where: { userId: id, anLuc: null, laAi: false, hayNhatLuc: { not: null } } }),
    prisma.ctlTheoDoi.count({ where: { duocId: id, nguoi: TAC_GIA_SONG, ...(chan.length ? { nguoiId: { notIn: chan } } : {}) } }),
    prisma.ctlTheoDoi.count({ where: { nguoiId: id, duoc: TAC_GIA_SONG, ...(chan.length ? { duocId: { notIn: chan } } : {}) } }),
    xem && xem !== id ? prisma.ctlTheoDoi.findUnique({ where: { nguoiId_duocId: { nguoiId: xem, duocId: id } }, select: { nguoiId: true } }) : null,
    isProEffective(id),
  ]);
  const laAdmin = isAdminRoles(u.roles.map((r) => r.role.name));
  return {
    ...tacGiaGon(u), bio: u.bio ?? null, thamGia: u.createdAt,
    soBai, soTraLoi, soHayNhat, soNguoiTheoDoi, soDangTheoDoi,
    dangTheoDoi: !!dangTheoDoi, laToi: xem === id,
    huyHieu: huyHieu({ soBai, soTraLoi, soHayNhat, laPro, laAdmin }),
  };
}

/** Theo dõi / bỏ theo dõi — idempotent. Không tự theo dõi mình, không theo dõi người đã chặn nhau. */
export async function theoDoi(userId: number, duocId: number, co: boolean) {
  if (!Number.isInteger(duocId) || duocId <= 0 || duocId === userId) throw new BadRequestError('Người cần theo dõi không hợp lệ.', 'CTL_CD_THEO_DOI_SAI');
  if (co) {
    const u = await prisma.user.findFirst({ where: { id: duocId, ...TAC_GIA_SONG }, select: { id: true } });
    if (!u) throw new NotFoundError('Không tìm thấy người này.');
    if ((await dsChan(userId)).includes(duocId)) throw new AppError('Bạn và người này đã chặn nhau.', 403, 'CTL_CD_CHAN');
    const r = await prisma.ctlTheoDoi.createMany({ data: [{ nguoiId: userId, duocId }], skipDuplicates: true });
    if (r.count) await taoThongBao({ nhan: duocId, tu: userId, loai: 'theo-doi', chongTrung: true });
  } else {
    await prisma.ctlTheoDoi.deleteMany({ where: { nguoiId: userId, duocId } });
  }
  const soNguoiTheoDoi = await prisma.ctlTheoDoi.count({ where: { duocId } });
  return { dangTheoDoi: co, soNguoiTheoDoi };
}

/** Danh sách người theo dõi (`chieu = 'nguoi-theo-doi'`) hoặc đang theo dõi của một người — ẩn người chặn nhau. */
export async function dsTheoDoi(id: number, xem: number | null, chieu: 'nguoi-theo-doi' | 'dang-theo-doi') {
  const chan = await dsChan(xem);
  if (chan.includes(id)) throw new NotFoundError('Không xem được danh sách này.');
  const ds = chieu === 'nguoi-theo-doi'
    ? (await prisma.ctlTheoDoi.findMany({
        where: { duocId: id, nguoi: TAC_GIA_SONG, ...(chan.length ? { nguoiId: { notIn: chan } } : {}) },
        orderBy: { createdAt: 'desc' }, take: 200, select: { nguoi: { select: TAC_GIA } },
      })).map((x) => x.nguoi)
    : (await prisma.ctlTheoDoi.findMany({
        where: { nguoiId: id, duoc: TAC_GIA_SONG, ...(chan.length ? { duocId: { notIn: chan } } : {}) },
        orderBy: { createdAt: 'desc' }, take: 200, select: { duoc: { select: TAC_GIA } },
      })).map((x) => x.duoc);
  const hh = await huyHieuCho(ds.map((u) => u.id));
  return { items: ds.map((u) => ({ ...tacGiaGon(u), huyHieu: hh.get(u.id)?.[0] ?? null })) };
}

// ─── Bảng xếp hạng ───────────────────────────────────────────────────────────────────────────────────────────────

type Dem = { user_id: number; n: bigint | number };

/**
 * Top người giúp đỡ của một ngôn ngữ trong 7 / 30 ngày gần nhất. Điểm = trả lời×2 + lượt thích nhận được trên câu trả
 * lời + hay nhất×10 (`diemXepHang`). KHÔNG tính: trả lời của Gấu AI, trả lời trong bài của chính mình, tự thích mình,
 * nội dung đã ẩn. Người chặn nhau / bị khoá không xuất hiện.
 */
export async function xepHang(nnGoc: string, khoangGoc: unknown, xem: number | null) {
  const nn = kiemNn(nnGoc);
  const khoang = docKhoang(khoangGoc);
  const tu = tuNgayXepHang(khoang);
  const [tl, thich, hay] = await Promise.all([
    prisma.$queryRaw<Dem[]>`
      SELECT t.user_id, COUNT(*) AS n FROM ctl_tra_loi t JOIN ctl_bai b ON b.id = t.bai_id
      WHERE b.nn = ${nn} AND t.la_ai = false AND t.an_luc IS NULL AND b.an_luc IS NULL
        AND t.created_at >= ${tu} AND t.user_id <> b.user_id
      GROUP BY t.user_id`,
    prisma.$queryRaw<Dem[]>`
      SELECT t.user_id, COUNT(*) AS n FROM ctl_thich_tra_loi l
        JOIN ctl_tra_loi t ON t.id = l.tra_loi_id JOIN ctl_bai b ON b.id = t.bai_id
      WHERE b.nn = ${nn} AND t.la_ai = false AND t.an_luc IS NULL AND b.an_luc IS NULL
        AND l.created_at >= ${tu} AND l.user_id <> t.user_id
      GROUP BY t.user_id`,
    prisma.$queryRaw<Dem[]>`
      SELECT t.user_id, COUNT(*) AS n FROM ctl_tra_loi t JOIN ctl_bai b ON b.id = t.bai_id
      WHERE b.nn = ${nn} AND t.la_ai = false AND t.an_luc IS NULL AND b.an_luc IS NULL
        AND t.hay_nhat_luc >= ${tu} AND t.user_id <> b.user_id
      GROUP BY t.user_id`,
  ]);
  const gop = new Map<number, { traLoi: number; duocThich: number; hayNhat: number }>();
  const lay = (id: number) => gop.get(id) ?? (gop.set(id, { traLoi: 0, duocThich: 0, hayNhat: 0 }), gop.get(id)!);
  for (const r of tl) lay(Number(r.user_id)).traLoi = Number(r.n);
  for (const r of thich) lay(Number(r.user_id)).duocThich = Number(r.n);
  for (const r of hay) lay(Number(r.user_id)).hayNhat = Number(r.n);

  const chan = new Set(await dsChan(xem));
  const ids = [...gop.keys()].filter((id) => !chan.has(id));
  const us = ids.length ? await prisma.user.findMany({ where: { id: { in: ids }, ...TAC_GIA_SONG }, select: TAC_GIA }) : [];
  const xep = us
    .map((u) => ({ u, d: gop.get(u.id)!, diem: diemXepHang(gop.get(u.id)!) }))
    .sort((a, b) => b.diem - a.diem || b.d.hayNhat - a.d.hayNhat || a.u.id - b.u.id)
    .slice(0, 50);
  const hh = await huyHieuCho(xep.map((x) => x.u.id));
  const items = xep.map((x, i) => ({ hang: i + 1, diem: x.diem, ...x.d, tacGia: { ...tacGiaGon(x.u), huyHieu: hh.get(x.u.id)?.[0] ?? null } }));
  return { khoang, tu, items, hangCuaToi: xem ? (items.find((x) => x.tacGia.id === xem)?.hang ?? null) : null };
}

// ─── Thông báo chuông ────────────────────────────────────────────────────────────────────────────────────────────

async function dieuKienThongBao(userId: number) {
  const chan = await dsChan(userId);
  return {
    userId,
    AND: [
      // Người gây ra còn hoạt động + không chặn nhau (null = hệ thống/BTV).
      { OR: [{ tuId: null }, { tu: { ...TAC_GIA_SONG, ...(chan.length ? { id: { notIn: chan } } : {}) } }] },
      // Bài/trả lời liên quan đã bị gỡ ⇒ thông báo biến theo.
      { OR: [{ baiId: null }, { bai: { anLuc: null } }] },
      { OR: [{ traLoiId: null }, { traLoi: { anLuc: null } }] },
    ],
  };
}

export async function soChuaDoc(userId: number) {
  return { chuaDoc: await prisma.ctlThongBao.count({ where: { ...(await dieuKienThongBao(userId)), daDoc: false } }) };
}

export async function dsThongBao(userId: number, truoc?: number) {
  const dk = await dieuKienThongBao(userId);
  const ds = await prisma.ctlThongBao.findMany({
    where: { ...dk, ...(truoc ? { id: { lt: truoc } } : {}) },
    orderBy: { id: 'desc' }, take: 31,
    select: {
      id: true, loai: true, daDoc: true, createdAt: true, baiId: true, traLoiId: true,
      tu: { select: TAC_GIA },
      bai: { select: { id: true, nn: true, tieuDe: true, noiDung: true } },
      traLoi: { select: { noiDung: true } },
    },
  });
  const { chuaDoc } = await soChuaDoc(userId);
  return {
    chuaDoc,
    tiep: ds.length > 30 ? ds[29].id : null,
    items: ds.slice(0, 30).map((t) => ({
      id: t.id, loai: t.loai, daDoc: t.daDoc, createdAt: t.createdAt, traLoiId: t.traLoiId,
      tu: t.tu ? tacGiaGon(t.tu) : null,
      bai: t.bai ? { id: t.bai.id, nn: t.bai.nn, tieuDe: t.bai.tieuDe || trich(t.bai.noiDung, 80) } : null,
      trich: t.traLoi ? trich(t.traLoi.noiDung, 100) : null,
    })),
  };
}

/** Đánh dấu đã đọc: `ids` (mảng) hoặc tất cả khi không gửi. */
export async function docThongBao(userId: number, ids?: unknown) {
  const ds = Array.isArray(ids) ? ids.map(Number).filter((x) => Number.isInteger(x) && x > 0).slice(0, 200) : null;
  await prisma.ctlThongBao.updateMany({ where: { userId, daDoc: false, ...(ds ? { id: { in: ds } } : {}) }, data: { daDoc: true } });
  return soChuaDoc(userId);
}
