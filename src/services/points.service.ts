/**
 * Ví điểm — sổ cái.
 * ─────────────────────────────────────────────────────────────────────────
 * Tỉ lệ CỐ ĐỊNH: 1 điểm = 1 VND. Nạp 50.000đ → 50.000 điểm (+ thưởng nếu
 * mốc nạp có khuyến mãi). Điểm KHÔNG quy đổi ngược ra tiền, KHÔNG chuyển
 * cho người khác, KHÔNG hết hạn.
 *
 * BA NGUYÊN TẮC, vi phạm một cái là mất tiền của người dùng:
 *
 *  1. `balance` KHÔNG BAO GIỜ đổi mà không có một dòng `PointTransaction`
 *     ghi kèm trong CÙNG một transaction. Sổ cái là nguồn sự thật; `balance`
 *     chỉ là bản tổng hợp đọc nhanh. `kiemTraSoDu()` đối chiếu lại hai cái.
 *
 *  2. Trừ điểm dùng `updateMany` có điều kiện `balance >= amount` — KHÔNG
 *     đọc rồi ghi. Đọc-rồi-ghi thua cuộc đua: hai tab cùng bấm mua, cả hai
 *     đọc thấy đủ tiền, cả hai trừ, số dư xuống âm. Điều kiện nằm trong
 *     chính câu UPDATE thì Postgres khoá hàng và một trong hai lượt trả về
 *     0 dòng — đó là lượt bị từ chối.
 *
 *  3. MỌI lối vào đều PHẢI truyền `idempotencyKey`. Webhook cổng thanh toán
 *     gọi lại nhiều lần là chuyện THƯỜNG, không phải ngoại lệ. Thứ thật sự
 *     chặn cộng tiền hai lần là UNIQUE INDEX ở DB (`uk_point_tx_idem`), chứ
 *     không phải câu `if` trong mã — hai tiến trình chạy song song thì cả
 *     hai câu `if` đều thấy "chưa có".
 */
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { BadRequestError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

/** 1 điểm = 1 VND. Đổi hằng số này là đổi ý nghĩa của mọi số dư đang có. */
export const POINTS_PER_VND = 1;

/** Trần một lượt nạp, chặn nhập nhầm số 0 và mọi trò bơm số. */
export const MIN_TOPUP_VND = 10_000;
export const MAX_TOPUP_VND = 50_000_000;

export type PointKind = 'TOPUP' | 'BONUS' | 'SPEND' | 'REFUND' | 'ADMIN_ADJUST';
export type PointRefKind = 'TOPUP_ORDER' | 'SHOP_ORDER' | 'PRO_ORDER' | 'COURSE_ORDER';

/** Client của Prisma HOẶC một transaction đang mở — mọi hàm dưới nhận cả hai. */
type Db = Prisma.TransactionClient | typeof prisma;

export interface GhiSoInput {
  userId: number;
  /** Dương = cộng, âm = trừ. Không nhận 0. */
  amount: number;
  kind: PointKind;
  description: string;
  refKind?: PointRefKind | null;
  refId?: number | null;
  /** BẮT BUỘC với mọi thứ dính tới tiền. Xem nguyên tắc 3 ở đầu file. */
  idempotencyKey: string;
}

export interface KetQuaGhiSo {
  /** false nghĩa là khoá idempotency đã dùng rồi — KHÔNG ghi gì thêm. */
  applied: boolean;
  balance: number;
  transactionId: number | null;
}

/** Quy đổi tiền → điểm. Tách hàm để chỗ nào cũng dùng đúng một công thức. */
export function vndSangDiem(vnd: number): number {
  return Math.floor(vnd * POINTS_PER_VND);
}

/** Điểm thưởng của một mốc nạp. Làm tròn XUỐNG — không bao giờ tặng dư. */
export function tinhDiemThuong(basePoints: number, bonusPercent: number): number {
  if (!Number.isFinite(bonusPercent) || bonusPercent <= 0) return 0;
  return Math.floor((basePoints * bonusPercent) / 100);
}

/**
 * Lấy ví của một người, tạo nếu chưa có.
 *
 * Dùng `upsert` chứ không `findUnique` rồi `create`: hai request đầu tiên
 * của cùng một người tới cùng lúc (rất hay gặp — trang ví gọi số dư và lịch
 * sử song song) thì lối find-rồi-create sẽ có một lượt chết vì trùng khoá.
 */
export async function layVi(userId: number, db: Db = prisma) {
  return db.pointAccount.upsert({
    where: { userId },
    create: { userId, balance: 0 },
    update: {},
  });
}

/** Số dư hiện tại. 0 nếu người này chưa từng chạm tới ví. */
export async function laySoDu(userId: number, db: Db = prisma): Promise<number> {
  const acc = await db.pointAccount.findUnique({ where: { userId }, select: { balance: true } });
  return acc?.balance ?? 0;
}

/**
 * Ghi một dòng sổ và điều chỉnh số dư — NGUYÊN TỬ.
 *
 * Gọi trong một transaction đang mở (truyền `db`) khi nó là một phần của
 * việc lớn hơn (vd trừ điểm + đánh dấu đơn PAID phải cùng sống cùng chết).
 * Gọi không truyền gì thì hàm tự mở transaction riêng.
 */
export async function ghiSo(input: GhiSoInput, db?: Db): Promise<KetQuaGhiSo> {
  const { userId, amount, kind, description, refKind = null, refId = null, idempotencyKey } = input;

  if (!Number.isInteger(amount) || amount === 0) {
    throw new BadRequestError('Số điểm phải là số nguyên khác 0');
  }
  if (!idempotencyKey) {
    // Không cho phép bỏ qua. Thà chết ở đây còn hơn cộng tiền hai lần.
    throw new Error('ghiSo: thiếu idempotencyKey — xem nguyên tắc 3 ở points.service.ts');
  }

  // ── Chặn TRƯỚC, không đợi P2002 ───────────────────────────────────────
  // Lối thường gặp nhất của việc ghi trùng là webhook gửi lại — lúc đó
  // hàng cũ đã nằm sẵn trong bảng và một câu SELECT là đủ thấy.
  //
  // Phải chặn ở đây chứ không chỉ bắt P2002 ở dưới, vì khi người gọi tự mở
  // transaction thì một câu lệnh hỏng làm Postgres huỷ CẢ transaction đó
  // ("current transaction is aborted"). Bắt lỗi rồi trả về "đã ghi rồi"
  // trong tình huống ấy là trả một câu trả lời tử tế cho một transaction đã
  // chết — người gọi chạy tiếp và nổ ở câu sau.
  const daCo = await (db ?? prisma).pointTransaction.findUnique({
    where: { idempotencyKey },
    select: { id: true },
  });
  if (daCo) {
    logger.info('[points] bỏ qua lượt ghi trùng khoá', { userId, idempotencyKey, kind });
    return { applied: false, balance: await laySoDu(userId, db ?? prisma), transactionId: daCo.id };
  }

  const chay = async (tx: Db): Promise<KetQuaGhiSo> => {
    // Ví phải tồn tại trước khi đụng tới số dư.
    await layVi(userId, tx);

    // ── Trừ điểm: điều kiện `balance >= amount` nằm TRONG câu UPDATE ──
    // updateMany trả về số dòng đã sửa. 0 dòng = không đủ điểm (hoặc một
    // lượt song song đã tiêu mất). Đây là chỗ chặn số dư âm, không phải
    // câu `if` nào ở trên.
    if (amount < 0) {
      const can = -amount;
      const hit = await tx.pointAccount.updateMany({
        where: { userId, balance: { gte: can } },
        data: {
          balance: { decrement: can },
          totalSpent: { increment: can },
        },
      });
      if (hit.count === 0) {
        const cur = await laySoDu(userId, tx);
        throw new BadRequestError(
          `Không đủ điểm. Cần ${can.toLocaleString('vi-VN')} điểm, ví đang có ${cur.toLocaleString('vi-VN')} điểm.`,
        );
      }
    } else {
      await tx.pointAccount.update({
        where: { userId },
        data: {
          balance: { increment: amount },
          totalEarned: { increment: amount },
        },
      });
    }

    // Đọc lại số dư SAU khi đã sửa, để chụp vào dòng sổ.
    const sauKhiSua = await laySoDu(userId, tx);

    // Dòng sổ đi CUỐI: nếu khoá idempotency đã dùng, insert này ném P2002
    // và cả transaction cuộn ngược — số dư vừa sửa ở trên cũng mất theo.
    // Đó chính là hành vi mong muốn.
    const row = await tx.pointTransaction.create({
      data: {
        userId,
        amount,
        balanceAfter: sauKhiSua,
        kind,
        refKind,
        refId,
        description: description.slice(0, 255),
        idempotencyKey,
      },
      select: { id: true },
    });

    return { applied: true, balance: sauKhiSua, transactionId: row.id };
  };

  // Người gọi đã mở transaction → chạy thẳng trong đó. KHÔNG bắt P2002:
  // nếu hai lượt thật sự đua nhau qua được câu SELECT ở trên, lượt thua
  // phải làm hỏng transaction của người gọi để cả việc lớn cuộn ngược.
  // Nuốt lỗi ở đây sẽ để lại một đơn hàng "đã thanh toán" mà không trừ điểm.
  if (db) return chay(db);

  try {
    return await prisma.$transaction((tx) => chay(tx));
  } catch (err) {
    // Transaction của riêng hàm này thì cuộn ngược sạch sẽ, nên bắt P2002
    // ở đây là an toàn: lượt song song đã ghi xong trước ta một nhịp.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const cu = await prisma.pointTransaction.findUnique({
        where: { idempotencyKey },
        select: { id: true },
      });
      logger.info('[points] thua cuộc đua ghi trùng khoá', { userId, idempotencyKey, kind });
      return { applied: false, balance: await laySoDu(userId), transactionId: cu?.id ?? null };
    }
    throw err;
  }
}

/** Cộng điểm. Vỏ mỏng quanh `ghiSo` cho dễ đọc ở nơi gọi. */
export async function congDiem(
  input: Omit<GhiSoInput, 'amount'> & { points: number },
  db?: Db,
): Promise<KetQuaGhiSo> {
  if (input.points <= 0) throw new BadRequestError('Số điểm cộng phải > 0');
  return ghiSo({ ...input, amount: input.points }, db);
}

/** Trừ điểm. Ném BadRequestError nếu không đủ — KHÔNG bao giờ để âm. */
export async function truDiem(
  input: Omit<GhiSoInput, 'amount'> & { points: number },
  db?: Db,
): Promise<KetQuaGhiSo> {
  if (input.points <= 0) throw new BadRequestError('Số điểm trừ phải > 0');
  return ghiSo({ ...input, amount: -input.points }, db);
}

/**
 * Hoàn điểm đã tiêu cho một chứng từ. Idempotent theo chính chứng từ đó,
 * nên admin bấm hoàn hai lần cũng chỉ hoàn một lần.
 */
export async function hoanDiem(
  userId: number,
  points: number,
  refKind: PointRefKind,
  refId: number,
  lyDo: string,
  db?: Db,
): Promise<KetQuaGhiSo> {
  return congDiem(
    {
      userId,
      points,
      kind: 'REFUND',
      refKind,
      refId,
      description: lyDo,
      idempotencyKey: `refund:${refKind}:${refId}`,
    },
    db,
  );
}

/** Lịch sử giao dịch, mới nhất trước. */
export async function layLichSu(userId: number, opts: { page?: number; size?: number } = {}) {
  const size = Math.min(100, Math.max(1, opts.size ?? 20));
  const page = Math.max(0, opts.page ?? 0);
  const [rows, total] = await Promise.all([
    prisma.pointTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: page * size,
      take: size,
    }),
    prisma.pointTransaction.count({ where: { userId } }),
  ]);
  return {
    items: rows.map((r) => ({
      id: r.id,
      amount: r.amount,
      balanceAfter: r.balanceAfter,
      kind: r.kind,
      refKind: r.refKind,
      refId: r.refId,
      description: r.description,
      createdAt: r.createdAt.toISOString(),
    })),
    pagination: { page, limit: size, total, totalPages: Math.ceil(total / size) },
  };
}

/**
 * Đối chiếu `balance` với tổng sổ cái của MỘT người.
 *
 * Bất biến này phải luôn đúng. Lệch nghĩa là ở đâu đó có chỗ sửa `balance`
 * mà không ghi sổ — đi tìm chỗ đó, ĐỪNG "sửa" bằng cách ghi đè số dư.
 */
export async function kiemTraSoDu(userId: number): Promise<{
  userId: number;
  balance: number;
  tongSoCai: number;
  khop: boolean;
}> {
  const [acc, agg] = await Promise.all([
    prisma.pointAccount.findUnique({ where: { userId }, select: { balance: true } }),
    prisma.pointTransaction.aggregate({ where: { userId }, _sum: { amount: true } }),
  ]);
  const balance = acc?.balance ?? 0;
  const tongSoCai = agg._sum.amount ?? 0;
  return { userId, balance, tongSoCai, khop: balance === tongSoCai };
}
