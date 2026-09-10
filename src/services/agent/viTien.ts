/**
 * ============================================================
 * VÍ TIỀN AI — của TỪNG NGƯỜI, cửa sổ 5 giờ TRƯỢT, tách theo mảng
 * ============================================================
 *
 * ─── VÌ SAO CÓ TỆP NÀY ───
 * Ví cũ (`quota.ts` → `xemViAgent`) là **của cả web**: nó cộng `costUsd` của
 * mọi tài khoản trong ngày rồi so với một con số duy nhất. Người dùng báo đúng
 * hậu quả ngày 11/09/2026: *"tài khoản A của tôi dùng nhiều bị giới hạn, tôi
 * vào tài khoản B chưa sử dụng vẫn bị dính limit"*. Một người tiêu hết là tất
 * cả bị chặn, kể cả tài khoản vừa tạo.
 *
 * ─── BA QUYẾT ĐỊNH, VÀ LÝ DO ───
 *
 * 1. **CỬA SỔ TRƯỢT, KHÔNG PHẢI RESET THEO MỐC.** Giống hệt lý do đã viết ở
 *    đầu `quota.ts` cho trần token: "reset mỗi 5 giờ" theo mốc cố định làm
 *    người bắt đầu lúc 04:50 chỉ được 10 phút. Cửa sổ trượt cộng tiền trong 5
 *    giờ VỪA QUA, nên hạn mức hồi lại dần và không có vách đá nào để rơi.
 *
 * 2. **TÁCH AI CHAT VÀ AI CODE.** Agent tiêu gấp hàng chục lần chat cho cùng
 *    một câu hỏi. Chung một ví nghĩa là một buổi dùng AI Code làm tắt luôn
 *    chat — hai tính năng khác hẳn nhau, người dùng không hiểu vì sao cái này
 *    hỏng vì cái kia.
 *
 * 3. **ADMIN KHÔNG BỊ CHẶN, NHƯNG VẪN ĐƯỢC ĐẾM.** Cùng lối với trần token
 *    (xem `quota.ts`): admin là người phải THỬ tính năng. Nhưng con số vẫn
 *    phải hiện đúng trên thanh đo — giấu đi thì người duy nhất sửa được lại là
 *    người duy nhất không nhìn thấy.
 *
 * ⚠️ KHÔNG có trần tuần, và KHÔNG có trần chung cho cả web (mặc định). Đó là
 * quyết định của người dùng, nêu 08/09/2026 và nhắc lại 11/09/2026.
 */
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

/** Hai mảng AI được đo riêng. */
export type MangAI = 'code' | 'chat';

/**
 * Nhãn `feature` trong bảng log ứng với từng mảng.
 *
 * ⚠️ `'chat'` chỉ có dữ liệu từ 11/09/2026 — trước đó AI Chat KHÔNG ghi log
 * chi phí lần nào (xem `ai.service.ts`). Nên ví chat của những ngày cũ là 0,
 * và đó là sự thật về dữ liệu chứ không phải lỗi tính toán.
 */
const NHAN: Record<MangAI, string> = { code: 'agent', chat: 'chat' };

/** Mặc định 100 $ mỗi 5 giờ, mỗi người, mỗi mảng. `0` = tắt trần. */
const MAC_DINH_TRAN_USD = 100;

export function tranTienCuaSo(): number {
  const raw = process.env.AI_COST_WINDOW_USD;
  if (raw === undefined || raw === '') return MAC_DINH_TRAN_USD;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : MAC_DINH_TRAN_USD;
}

export function soGioViTien(): number {
  const raw = process.env.AI_COST_WINDOW_HOURS;
  if (raw === undefined || raw === '') return 5;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 5;
}

export interface ViTien {
  mang: MangAI;
  /** Đã tiêu trong cửa sổ, USD. */
  daTieu: number;
  tran: number;
  conLai: number;
  /** 0–100, để vẽ thanh đo. */
  phanTram: number;
  soGio: number;
  /** Cạn ví ⇒ chặn lượt mới. Admin luôn `false`. */
  canVi: boolean;
  /** Không bị chặn vì là admin — nhưng số liệu vẫn thật. */
  miemTran: boolean;
  /** Lúc phần cũ nhất trôi ra khỏi cửa sổ — ví BẮT ĐẦU hồi. */
  hoiLucNao: Date | null;
  /** Lúc trôi hết — ví đầy lại hoàn toàn. */
  hoiHetLuc: Date | null;
}

/**
 * Nhớ đệm 60 giây, khoá theo `userId:mang`.
 *
 * ⚠️ Khoá PHẢI có `mang`. Dùng chung một khoá cho hai mảng thì số của AI Code
 * hiện ra ở ô AI Chat trong đúng một phút — và người dùng nhìn thấy mình "đã
 * tiêu" ở một chỗ chưa hề mở.
 */
const dem = new Map<string, { luc: number; usd: number; cu: Date | null; moi: Date | null }>();
const NHO_MS = 60_000;

/** Xoá bộ nhớ đệm — cho bộ kiểm và cho lúc admin đổi trần. */
export function xoaDemViTien(): void { dem.clear(); }

function rong(mang: MangAI, tran: number, soGio: number, miemTran: boolean): ViTien {
  return {
    mang, daTieu: 0, tran, conLai: tran, phanTram: 0, soGio,
    canVi: false, miemTran, hoiLucNao: null, hoiHetLuc: null,
  };
}

/**
 * Ví tiền của một người dùng cho một mảng, trong cửa sổ vừa qua.
 *
 * KHÔNG ném lỗi khi CSDL hỏng: trả về "còn nguyên ví". Một cái khoá tự sập khi
 * đồng hồ đo hỏng thì tệ hơn là không có khoá — cùng lý do đã viết ở
 * `quota.ts` và `llm/budget.ts`.
 */
export async function xemViTien(userId: number, mang: MangAI): Promise<ViTien> {
  const tran = tranTienCuaSo();
  const soGio = soGioViTien();

  let miemTran = false;
  try {
    const { laAdmin } = await import('../pro.service.js');
    miemTran = await laAdmin(userId);
  } catch {
    /* Không tra được vai trò ⇒ coi như người thường. Trần là mặc định an toàn. */
  }

  if (tran <= 0) return rong(mang, tran, soGio, miemTran);

  const gio = Date.now();
  const khoa = `${userId}:${mang}`;
  const ms = soGio * 3_600_000;
  const tu = new Date(gio - ms);

  let usd: number;
  let cu: Date | null;
  let moi: Date | null;

  const nho = dem.get(khoa);
  if (nho && gio - nho.luc < NHO_MS) {
    ({ usd, cu, moi } = nho);
  } else {
    try {
      const dieuKien = { userId, feature: NHAN[mang], createdAt: { gte: tu } };
      const [tong, cuNhat, moiNhat] = await Promise.all([
        prisma.interviewLLMCallLog.aggregate({ where: dieuKien, _sum: { costUsd: true } }),
        prisma.interviewLLMCallLog.findFirst({
          where: dieuKien, orderBy: { createdAt: 'asc' }, select: { createdAt: true },
        }),
        prisma.interviewLLMCallLog.findFirst({
          where: dieuKien, orderBy: { createdAt: 'desc' }, select: { createdAt: true },
        }),
      ]);
      usd = Number(tong._sum.costUsd ?? 0);
      cu = cuNhat?.createdAt ?? null;
      moi = moiNhat?.createdAt ?? null;
      dem.set(khoa, { luc: gio, usd, cu, moi });
    } catch (err) {
      logger.warn('viTien: không đọc được ví, cho đi tiếp', { error: (err as Error).message });
      return rong(mang, tran, soGio, miemTran);
    }
  }

  return {
    mang,
    daTieu: usd,
    tran,
    conLai: Math.max(0, tran - usd),
    phanTram: Math.min(100, Math.round((usd / tran) * 100)),
    soGio,
    canVi: !miemTran && usd >= tran,
    miemTran,
    hoiLucNao: cu ? new Date(cu.getTime() + ms) : null,
    hoiHetLuc: moi ? new Date(moi.getTime() + ms) : null,
  };
}

/** Câu báo khi cạn ví. Viết cho NGƯỜI DÙNG đọc, nên phải nói được bao giờ hồi. */
export function loiCanViTien(v: ViTien): string {
  const ten = v.mang === 'code' ? 'AI Code' : 'AI Chat';
  const gio = v.hoiLucNao
    ? v.hoiLucNao.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : null;
  return (
    `Bạn đã dùng hết ngân sách ${ten} trong ${v.soGio} giờ qua `
    + `(~$${v.daTieu.toFixed(2)} / $${v.tran}). `
    + (gio ? `Hạn mức bắt đầu hồi lại từ ${gio}. ` : '')
    + `Đây là ví RIÊNG của tài khoản bạn — người khác không bị ảnh hưởng, `
    + `và ${v.mang === 'code' ? 'AI Chat' : 'AI Code'} vẫn dùng được bình thường.`
  );
}
