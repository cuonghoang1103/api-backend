/**
 * NHẮC VIỆC TIỀN NONG — nợ sắp tới hạn và chốt chi tiêu cuối ngày.
 * ─────────────────────────────────────────────────────────────────────
 * Hai lời nhắc, do người dùng đặt ra 18/09/2026:
 *
 *  · NỢ: từ 3 ngày trước hạn cho tới ngày đến hạn, mỗi ngày nhắc ở 8h,
 *    12h và 19h — chỉ khi kỳ đó CHƯA tích đã trả. Cộng thêm kỳ đã QUÁ HẠN,
 *    vì đó mới là cái tốn tiền phạt.
 *
 *  · 20h: hỏi hôm nay tiêu những gì, kèm số đã tiêu so với mục tiêu ngày.
 *
 * ⚠️ MÚI GIỜ. Container chạy UTC, người dùng sống ở +07. Mọi phép so "hôm
 * nay" phải quy về ngày Việt Nam, không dùng `new Date()` trần — lệch 7 giờ
 * nghĩa là 19h nhắc vào nửa đêm, và "hôm nay tiêu bao nhiêu" đếm nhầm ngày.
 */
import { prisma } from '../../config/database.js';
import { guiThongBao } from '../push/apns.js';
import { logger } from '../../utils/logger.js';

const MUI_GIO_VN = 7 * 60 * 60 * 1000;

/** Ngày hôm nay theo lịch Việt Nam, dạng `YYYY-MM-DD`. */
export function ngayVN(luc: Date = new Date()): string {
  return new Date(luc.getTime() + MUI_GIO_VN).toISOString().slice(0, 10);
}

/** Cộng/trừ ngày trên chuỗi `YYYY-MM-DD`, vẫn theo lịch VN. */
function congNgay(ngay: string, them: number): string {
  const d = new Date(`${ngay}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + them);
  return d.toISOString().slice(0, 10);
}

function tienVN(v: unknown): string {
  const n = Number(v);
  if (!Number.isFinite(n)) return '0₫';
  return `${Math.round(n).toLocaleString('vi-VN')}₫`;
}

// ─── 1. Nhắc nợ sắp tới hạn ──────────────────────────────────────────────

/** Bao nhiêu ngày trước hạn thì bắt đầu nhắc. */
const NGAY_BAO_TRUOC = 3;

/**
 * Quét mọi kỳ trả nợ CHƯA TÍCH và gửi nhắc cho chủ nợ.
 *
 * Gom theo NGƯỜI chứ không gửi từng kỳ: một người có 4 khoản cùng đến hạn
 * thì 4 thông báo liên tiếp là phiền tới mức họ tắt luôn thông báo của app.
 * Một thông báo nói đủ số tiền và số khoản thì họ còn đọc.
 */
export async function nhacNoToiHan(): Promise<{ nguoi: number; ky: number }> {
  const homNay = ngayVN();
  const hanCuoi = congNgay(homNay, NGAY_BAO_TRUOC);

  const ky = await prisma.debtScheduleItem.findMany({
    where: {
      isPaid: false,
      // Lấy cả QUÁ HẠN (dueDate < hôm nay): đó mới là kỳ đang đẻ tiền phạt.
      dueDate: { lte: new Date(`${hanCuoi}T00:00:00.000Z`) },
    },
    select: {
      id: true, userId: true, dueDate: true, amountDue: true,
      debt: { select: { lenderName: true, status: true } },
    },
    orderBy: { dueDate: 'asc' },
    take: 2000,
  });

  const theoNguoi = new Map<number, typeof ky>();
  for (const k of ky) {
    // Khoản đã tất toán mà còn sót kỳ chưa tích thì bỏ qua — nhắc trả một
    // khoản đã xong là làm người dùng mất tin vào mọi lời nhắc sau đó.
    if (k.debt?.status === 'PAID_OFF') continue;
    const ds = theoNguoi.get(k.userId);
    if (ds) ds.push(k); else theoNguoi.set(k.userId, [k]);
  }

  let soNguoi = 0;
  let soKy = 0;
  for (const [userId, ds] of theoNguoi) {
    const quaHan = ds.filter((k) => ngayVN(k.dueDate) < homNay);
    const homNayToiHan = ds.filter((k) => ngayVN(k.dueDate) === homNay);
    const sapToi = ds.filter((k) => ngayVN(k.dueDate) > homNay);
    const tong = ds.reduce((s, k) => s + Number(k.amountDue), 0);

    let tieuDe: string;
    let than: string;
    if (quaHan.length > 0) {
      const t = quaHan.reduce((s, k) => s + Number(k.amountDue), 0);
      tieuDe = `⚠️ ${quaHan.length} kỳ nợ đã QUÁ HẠN`;
      than = `${tienVN(t)} chưa trả — ${quaHan.map((k) => k.debt?.lenderName).filter(Boolean).slice(0, 3).join(', ')}`;
    } else if (homNayToiHan.length > 0) {
      const t = homNayToiHan.reduce((s, k) => s + Number(k.amountDue), 0);
      tieuDe = `Hôm nay tới hạn ${tienVN(t)}`;
      than = homNayToiHan.map((k) => k.debt?.lenderName).filter(Boolean).slice(0, 3).join(', ');
    } else {
      const gan = sapToi[0];
      const con = Math.max(0, Math.round(
        (new Date(`${ngayVN(gan.dueDate)}T00:00:00.000Z`).getTime()
         - new Date(`${homNay}T00:00:00.000Z`).getTime()) / 86400000));
      tieuDe = `Còn ${con} ngày tới hạn ${gan.debt?.lenderName ?? 'khoản nợ'}`;
      than = `${tienVN(gan.amountDue)}${ds.length > 1 ? ` · và ${ds.length - 1} kỳ khác sắp tới` : ''}`;
    }
    if (ds.length > 1 && quaHan.length === 0) {
      than += ` · tổng ${tienVN(tong)}`;
    }

    const gui = await guiThongBao(userId, {
      tieuDe,
      than,
      duLieu: { man: 'finance/debts' },
      nhom: 'finance-no',
    });
    if (gui > 0) soNguoi += 1;
    soKy += ds.length;
  }

  return { nguoi: soNguoi, ky: soKy };
}

// ─── 2. Chốt chi tiêu 20h ────────────────────────────────────────────────

/**
 * Hỏi cuối ngày: hôm nay tiêu những gì.
 *
 * Chỉ gửi cho người ĐANG DÙNG mảng tiền nong (có ví). Gửi cho mọi tài khoản
 * là spam đúng nghĩa: phần lớn người dùng web chưa từng mở /finance.
 */
export async function chotChiTieuCuoiNgay(): Promise<{ nguoi: number }> {
  const homNay = ngayVN();
  const dau = new Date(`${homNay}T00:00:00.000Z`);
  const cuoi = new Date(`${congNgay(homNay, 1)}T00:00:00.000Z`);

  const coVi = await prisma.wallet.findMany({
    where: { isArchived: false },
    select: { userId: true },
    distinct: ['userId'],
    take: 5000,
  });

  let soNguoi = 0;
  for (const { userId } of coVi) {
    const [daTieu, mucTieu] = await Promise.all([
      prisma.expense.aggregate({
        where: { userId, date: { gte: dau, lt: cuoi } },
        _sum: { amount: true },
      }),
      prisma.financeSpendingGoal.findFirst({
        where: { userId, period: 'DAY', isActive: true },
        select: { amount: true },
      }),
    ]);

    const tieu = Number(daTieu._sum?.amount ?? 0);
    let than: string;
    if (tieu === 0) {
      than = 'Chưa ghi khoản nào hôm nay. Chạm để ghi nhanh.';
    } else if (mucTieu) {
      const m = Number(mucTieu.amount);
      const conLai = m - tieu;
      than = conLai >= 0
        ? `Đã tiêu ${tienVN(tieu)} — còn ${tienVN(conLai)} trong mục tiêu ngày.`
        : `Đã tiêu ${tienVN(tieu)} — VƯỢT mục tiêu ngày ${tienVN(-conLai)}.`;
    } else {
      than = `Hôm nay đã ghi ${tienVN(tieu)}. Còn khoản nào chưa ghi không?`;
    }

    const gui = await guiThongBao(userId, {
      tieuDe: 'Hôm nay bạn đã chi tiêu những gì?',
      than,
      duLieu: { man: 'finance/expenses', hoiChiTieu: true },
      nhom: 'finance-chot-ngay',
    });
    if (gui > 0) soNguoi += 1;
  }
  return { nguoi: soNguoi };
}

// ─── 3. Mục tiêu chi tiêu ────────────────────────────────────────────────

export type KyMucTieu = 'DAY' | 'WEEK' | 'MONTH';
const KY_HOP_LE = new Set<KyMucTieu>(['DAY', 'WEEK', 'MONTH']);

/** Mốc đầu kỳ theo lịch VN, trả về `Date` ở UTC để so với cột thời gian. */
function dauKy(ky: KyMucTieu, homNay: string): Date {
  if (ky === 'DAY') return new Date(`${homNay}T00:00:00.000Z`);
  const d = new Date(`${homNay}T00:00:00.000Z`);
  if (ky === 'MONTH') {
    d.setUTCDate(1);
    return d;
  }
  // Tuần bắt đầu THỨ HAI — lịch học và lịch lương ở VN đều theo tuần đó,
  // còn `getUTCDay()` thì coi Chủ nhật là 0.
  const thu = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - thu);
  return d;
}

/** Mốc NGAY SAU kỳ (nửa khoảng `[dauKy, cuoiKy)`), vẫn theo lịch VN. */
function cuoiKy(ky: KyMucTieu, tu: Date): Date {
  const d = new Date(tu.getTime());
  if (ky === 'DAY') d.setUTCDate(d.getUTCDate() + 1);
  else if (ky === 'WEEK') d.setUTCDate(d.getUTCDate() + 7);
  else d.setUTCMonth(d.getUTCMonth() + 1);
  return d;
}

export async function layMucTieu(userId: number) {
  const homNay = ngayVN();
  const ds = await prisma.financeSpendingGoal.findMany({
    where: { userId, isActive: true },
    select: { id: true, period: true, amount: true, updatedAt: true },
  });

  const ra = await Promise.all(ds.map(async (m) => {
    const tu = dauKy(m.period as KyMucTieu, homNay);
    const den = cuoiKy(m.period as KyMucTieu, tu);
    // Chặn CẢ HAI đầu. Không chặn đầu trên thì một khoản ghi ngày mai (app cho
    // chọn ngày) bị cộng vào mục tiêu HÔM NAY, và người dùng thấy mình vượt
    // mục tiêu vì một khoản chưa tiêu.
    const tieu = await prisma.expense.aggregate({
      where: { userId, date: { gte: tu, lt: den } },
      _sum: { amount: true },
    });
    const daTieu = Number(tieu._sum?.amount ?? 0);
    const muc = Number(m.amount);
    return {
      id: m.id,
      ky: m.period,
      mucTieu: muc,
      daTieu,
      conLai: muc - daTieu,
      tiLe: muc > 0 ? Math.min(999, Math.round((daTieu / muc) * 100)) : 0,
      tuNgay: tu.toISOString().slice(0, 10),
      denNgay: new Date(den.getTime() - 86400000).toISOString().slice(0, 10),
    };
  }));

  return { mucTieu: ra, homNay };
}

export async function datMucTieu(userId: number, ky: string, soTien: number) {
  const k = String(ky).toUpperCase() as KyMucTieu;
  if (!KY_HOP_LE.has(k)) {
    throw Object.assign(new Error('Kỳ không hợp lệ'), { statusCode: 400, code: 'INVALID_INPUT' });
  }
  const tien = Number(soTien);
  if (!Number.isFinite(tien) || tien < 0 || tien > 1e12) {
    throw Object.assign(new Error('Số tiền không hợp lệ'), { statusCode: 400, code: 'INVALID_INPUT' });
  }
  // `0` = TẮT mục tiêu kỳ đó. Xoá hẳn hàng thì lần sau đặt lại mất lịch sử
  // `updatedAt`, mà đó là thứ duy nhất nói "đặt từ bao giờ".
  return prisma.financeSpendingGoal.upsert({
    where: { uk_fin_goal_user_period: { userId, period: k } },
    create: { userId, period: k, amount: tien, isActive: tien > 0 },
    update: { amount: tien, isActive: tien > 0 },
    select: { id: true, period: true, amount: true, isActive: true },
  });
}

// ─── Chạy từ cron ────────────────────────────────────────────────────────

export async function chayNhacNo(gio: string): Promise<void> {
  try {
    const kq = await nhacNoToiHan();
    if (kq.nguoi > 0) logger.info(`[finance] nhắc nợ ${gio}`, kq);
  } catch (e) {
    logger.error(`[finance] nhắc nợ ${gio} hỏng`, { error: (e as Error).message });
  }
}

export async function chayChotNgay(): Promise<void> {
  try {
    const kq = await chotChiTieuCuoiNgay();
    if (kq.nguoi > 0) logger.info('[finance] chốt chi tiêu 20h', kq);
  } catch (e) {
    logger.error('[finance] chốt chi tiêu 20h hỏng', { error: (e as Error).message });
  }
}
