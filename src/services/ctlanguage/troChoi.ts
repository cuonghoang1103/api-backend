/**
 * CT Language — TRÒ CHƠI (16/11/2026): gửi điểm · bảng xếp hạng theo game × chế độ × ngôn ngữ ("tuần này" / "mọi lúc")
 * · thách đấu bất đồng bộ (cùng bộ đề + seed, so điểm). Luật kiểm: `troChoiThuan.ts`.
 *
 * Bảng xếp hạng dùng chung luật với xếp hạng phút học: người chặn nhau không thấy nhau, người tự ẩn (`ctl_xep_hang_an`)
 * không lên bảng, tài khoản khoá/vô hiệu không lên bảng. Tên hiện = tên hồ sơ (như Cộng đồng) QUA bộ lọc nội dung —
 * bảng công khai cho khách, tên tục ⇒ "Người học #id".
 */
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { kiemNoiDung } from '../locNoiDung.js';
import { dsChan, TAC_GIA, TAC_GIA_SONG } from './congDong.js';
import {
  CHE_DO, chuanMa, chuLoc, dauTuanVn, docKyXH, GAME_CTL, kiemCheDo, kiemDiem, kiemGame, kiemNnGame, kiemThachDau, KHUNG_TEN,
  LoiTroChoi, sinhMa, tenHien, type MucDe,
} from './troChoiThuan.js';

const boc = <T>(f: () => T): T => {
  try { return f(); } catch (e) { if (e instanceof LoiTroChoi) throw new BadRequestError(e.message, e.ma); throw e; }
};

/** Danh mục game (app đọc để biết server nhận game nào + luật điểm). */
export function danhMucGame() {
  return {
    game: Object.entries(GAME_CTL).map(([ma, l]) => ({ ma, ten: l.ten, cheDo: l.cheDo, diemMoiCau: l.diemMoiCau, thuongChang: l.thuongChang })),
    cheDo: CHE_DO, khung: KHUNG_TEN,
  };
}

type NguoiXH = { id: number; ten: string; avatarUrl: string | null };
const nguoiGon = (u: { id: number; username: string; fullName: string | null; displayName: string | null; avatarUrl: string | null }): NguoiXH => ({
  id: u.id, ten: tenHien(u.displayName || u.fullName || u.username, u.id, (s) => kiemNoiDung(s).chan), avatarUrl: u.avatarUrl,
});

/** Điểm cao nhất mỗi người trong `where`, top `take`, kèm khung tên của ván mới nhất. */
async function bang(where: Prisma.CtlTroChoiDiemWhereInput, take: number) {
  const nhom = await prisma.ctlTroChoiDiem.groupBy({
    by: ['userId'], where, _max: { diem: true },
    orderBy: [{ _max: { diem: 'desc' } }, { userId: 'asc' }], take,
  });
  if (!nhom.length) return [];
  const ids = nhom.map((x) => x.userId);
  const [us, khung] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: ids } }, select: TAC_GIA }),
    prisma.ctlTroChoiDiem.findMany({ where: { userId: { in: ids } }, orderBy: { createdAt: 'desc' }, distinct: ['userId'], select: { userId: true, khung: true } }),
  ]);
  const theoId = new Map(us.map((u) => [u.id, u]));
  const kh = new Map(khung.map((k) => [k.userId, k.khung]));
  let hang = 0;
  return nhom.filter((x) => theoId.has(x.userId)).map((x) => ({
    hang: ++hang, diem: x._max.diem ?? 0, nguoi: nguoiGon(theoId.get(x.userId)!), khung: kh.get(x.userId) ?? null,
  }));
}

async function hangCuaToi(where: Prisma.CtlTroChoiDiemWhereInput, xem: number, items: { hang: number; nguoi: NguoiXH }[]) {
  const toi = await prisma.ctlTroChoiDiem.aggregate({ where: { ...where, userId: xem }, _max: { diem: true } });
  const diem = toi._max.diem;
  if (diem == null) return { hang: null, diem: 0 };
  const coSan = items.find((x) => x.nguoi.id === xem)?.hang;
  if (coSan) return { hang: coSan, diem };
  const hon = await prisma.ctlTroChoiDiem.groupBy({ by: ['userId'], where, _max: { diem: true }, having: { diem: { _max: { gt: diem } } } });
  return { hang: hon.length + 1, diem };
}

async function dieuKienChung(xem: number | null): Promise<Prisma.CtlTroChoiDiemWhereInput> {
  const chan = await dsChan(xem);
  return {
    ...(chan.length ? { userId: { notIn: chan } } : {}),
    user: { ...TAC_GIA_SONG, ctlXepHangAn: { is: null } },
  };
}

export async function xepHang(gameGoc: string, q: Record<string, unknown>, xem: number | null) {
  const { game, cheDo, nn } = boc(() => {
    const l = kiemGame(gameGoc);
    return { game: gameGoc, cheDo: kiemCheDo(q.cheDo ?? 'vuot-chang', l), nn: kiemNnGame(q.nn) };
  });
  if (cheDo === 'thach-dau') throw new BadRequestError('Bảng thách đấu xem theo mã.', 'CTL_TC_CHE_DO');
  const ky = docKyXH(q.ky);
  const tuNgay = ky === 'tuan' ? dauTuanVn() : null;
  const where: Prisma.CtlTroChoiDiemWhereInput = {
    game, cheDo, nn, ...(tuNgay ? { createdAt: { gte: tuNgay } } : {}), ...(await dieuKienChung(xem)),
  };
  const items = await bang(where, 50);
  const cuaToi = xem ? await hangCuaToi(where, xem, items) : null;
  return { game, cheDo, nn, ky, tuNgay, items, cuaToi };
}

export async function guiDiem(userId: number, body: Record<string, unknown>) {
  const d = boc(() => kiemDiem(body));
  let thachDauId: number | null = null;
  if (d.maThachDau) {
    const td = await prisma.ctlThachDau.findUnique({ where: { ma: d.maThachDau }, select: { id: true, game: true, nn: true, hetHan: true } });
    if (!td || td.hetHan < new Date()) throw new NotFoundError('Thách đấu không còn (sai mã hoặc đã hết hạn).');
    if (td.game !== d.game || td.nn !== d.nn) throw new BadRequestError('Điểm không khớp trò chơi của thách đấu.', 'CTL_TC_THACH_DAU');
    thachDauId = td.id;
  }
  const truoc = await prisma.ctlTroChoiDiem.aggregate({ where: { userId, game: d.game, cheDo: d.cheDo, nn: d.nn, thachDauId }, _max: { diem: true } });
  let trung = false;
  try {
    await prisma.ctlTroChoiDiem.create({
      data: {
        userId, game: d.game, cheDo: d.cheDo, nn: d.nn, diem: d.diem, dung: d.dung, sai: d.sai, chang: d.chang,
        thoiGianMs: d.thoiGianMs, maVan: d.maVan, thachDauId, khung: d.khung,
      },
    });
  } catch (e) {
    // Gửi lại cùng ván (mạng chập chờn) ⇒ coi như đã nhận, không thành hai dòng.
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') trung = true;
    else throw e;
  }
  const kyLucCu = truoc._max.diem ?? 0;
  return { daNhan: true, trung, kyLuc: !trung && d.diem > kyLucCu, kyLucCu };
}

// ─── Thách đấu ───────────────────────────────────────────────────────────────────────────────────────────────────

const NGAY_SONG = 30;
const TAO_MOI_NGAY = 40;

export async function taoThachDau(userId: number, body: Record<string, unknown>) {
  const t = boc(() => kiemThachDau(body));
  if (kiemNoiDung(chuLoc(t)).chan) {
    throw new AppError('Bộ từ có từ ngữ không được phép — bỏ từ đó khỏi sổ rồi tạo lại nhé.', 422, 'CONTENT_BLOCKED');
  }
  const homQua = new Date(Date.now() - 86_400_000);
  if (await prisma.ctlThachDau.count({ where: { userId, createdAt: { gte: homQua } } }) >= TAO_MOI_NGAY) {
    throw new AppError('Hôm nay bạn đã tạo nhiều thách đấu — mai tạo tiếp nhé.', 429, 'CTL_TC_TRAN_NGAY');
  }
  const hetHan = new Date(Date.now() + NGAY_SONG * 86_400_000);
  for (let lan = 0; lan < 5; lan++) {
    try {
      const r = await prisma.ctlThachDau.create({
        data: { ma: sinhMa(), userId, game: t.game, nn: t.nn, cachHien: t.cachHien, seed: t.seed, tenBo: t.tenBo, de: t.de as unknown as Prisma.InputJsonValue, hetHan },
        select: { ma: true, hetHan: true },
      });
      return { ma: r.ma, hetHan: r.hetHan, soTu: t.de.length };
    } catch (e) {
      if (!(e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002')) throw e;
    }
  }
  throw new AppError('Chưa tạo được mã — thử lại nhé.', 503, 'CTL_TC_MA_TRUNG');
}

export async function xemThachDau(maGoc: string, xem: number | null) {
  const ma = boc(() => chuanMa(maGoc));
  const td = await prisma.ctlThachDau.findUnique({
    where: { ma }, include: { user: { select: TAC_GIA } },
  });
  if (!td || td.hetHan < new Date()) throw new NotFoundError('Thách đấu không còn (sai mã hoặc đã hết hạn).');
  // Hai người chặn nhau ⇒ không mở được thách đấu của nhau (như trang người dùng).
  if (xem && (await dsChan(xem)).includes(td.userId)) throw new NotFoundError('Thách đấu không còn (sai mã hoặc đã hết hạn).');
  const where: Prisma.CtlTroChoiDiemWhereInput = { thachDauId: td.id, ...(await dieuKienChung(xem)) };
  const items = await bang(where, 50);
  const cuaToi = xem ? await hangCuaToi(where, xem, items) : null;
  return {
    ma: td.ma, game: td.game, nn: td.nn, cachHien: td.cachHien, seed: td.seed, tenBo: td.tenBo,
    de: td.de as unknown as MucDe[], hetHan: td.hetHan, nguoiTao: nguoiGon(td.user), laCuaToi: xem === td.userId,
    items, cuaToi,
  };
}
