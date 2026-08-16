/**
 * ============================================================
 * HẠN MỨC AGENT — bể RIÊNG, cửa sổ 5 giờ TRƯỢT
 * ============================================================
 *
 * ─── VÌ SAO BỂ RIÊNG ───
 * `checkTokenQuota` (300k/ngày, Pro 1 triệu) là bể DÙNG CHUNG của cả web:
 * Interview, Language, Code Lab, phòng thi, chat. Agent tiêu gấp 10–50 lần
 * chat cho cùng một câu hỏi, nên nếu nó rút từ bể chung thì MỘT phiên agent
 * làm người dùng hết luôn hạn mức chấm bài và gia sư của cả ngày hôm đó — họ
 * mất những tính năng không liên quan gì tới việc họ vừa làm. Bể riêng nghĩa
 * là tiêu hết hạn mức agent thì chỉ agent dừng.
 *
 * ─── VÌ SAO CỬA SỔ TRƯỢT, KHÔNG PHẢI RESET THEO MỐC ───
 * "Reset mỗi 5 giờ" theo mốc cố định (00:00, 05:00, 10:00…) có một tính chất
 * tệ: người bắt đầu làm lúc 04:50 được đúng 10 phút rồi mất sạch hạn mức, còn
 * người bắt đầu lúc 05:00 được trọn 5 giờ. Cùng một gói tiền, trải nghiệm khác
 * hẳn nhau, và người dùng không làm gì sai cả.
 *
 * Cửa sổ trượt cộng token trong 5 giờ VỪA QUA. Hạn mức hồi lại DẦN DẦN khi
 * những lời gọi cũ trôi ra khỏi cửa sổ, nên không có vách đá nào để rơi xuống.
 * Đổi lại: không nói được một câu gọn như "reset lúc 15:00", nên hàm này trả
 * về `hoiLucNao` (lúc phần cũ nhất trôi ra — hạn mức bắt đầu hồi) và
 * `hoiHetLuc` (lúc trôi hết — đầy lại hoàn toàn) để giao diện nói cho đúng.
 *
 * ─── CON SỐ ───
 * 4 triệu token / 5 giờ cho tài khoản Pro. Đo thật 17/08/2026 trên chính repo
 * này, SAU khi có nén ngữ cảnh: một việc thường (5–12 bước) tốn 80k–250k
 * token. Tức là 4 triệu ≈ **20–40 việc mỗi 5 giờ**, và một buổi làm việc dày
 * đặc hiếm khi quá 25 việc. Trần này rộng, và rộng là có chủ ý — chốt chặn
 * thật nằm ở trần MỖI VIỆC (`turn.ts`) chứ không phải ở đây. Trần này để bắt
 * trường hợp bất thường, không phải để bóp người dùng bình thường.
 */
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

/** Mặc định. Đổi bằng env, không sửa mã. `AGENT_TOKEN_CAP=0` = tắt trần (có chủ ý). */
const MAC_DINH_TRAN = 4_000_000;
const MAC_DINH_GIO = 5;

export function tranToken(): number {
  const raw = process.env.AGENT_TOKEN_CAP;
  if (raw === undefined || raw === '') return MAC_DINH_TRAN;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : MAC_DINH_TRAN;
}

export function soGioCuaSo(): number {
  const raw = process.env.AGENT_WINDOW_HOURS;
  if (raw === undefined || raw === '') return MAC_DINH_GIO;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : MAC_DINH_GIO;
}

export interface HanMuc {
  /** Token đã tiêu trong cửa sổ (vào + ra). */
  daDung: number;
  tran: number;
  conLai: number;
  /** 0–100, để vẽ thanh đo. */
  phanTram: number;
  soGio: number;
  /** Đã cạn ⇒ chặn lượt mới. */
  hetHan: boolean;
  /** Lúc phần cũ nhất trôi ra khỏi cửa sổ — hạn mức BẮT ĐẦU hồi. null = chưa dùng gì. */
  hoiLucNao: Date | null;
  /** Lúc mọi thứ trong cửa sổ trôi hết — hạn mức đầy lại hoàn toàn. */
  hoiHetLuc: Date | null;
}

/**
 * Hạn mức hiện tại của một người dùng.
 *
 * KHÔNG ném lỗi khi CSDL hỏng: trả về trạng thái "còn hạn mức". Một cái khoá
 * tự sập khi đồng hồ đo hỏng thì tệ hơn là không có khoá — cùng lý do đã viết
 * trong `llm/budget.ts`. Ví tiền vẫn còn cầu dao ngân sách toàn site đứng sau.
 */
export async function xemHanMuc(userId: number): Promise<HanMuc> {
  const tran = tranToken();
  const soGio = soGioCuaSo();
  const trong = (d: Partial<HanMuc> = {}): HanMuc => ({
    daDung: 0, tran, conLai: tran, phanTram: 0, soGio,
    hetHan: false, hoiLucNao: null, hoiHetLuc: null, ...d,
  });

  if (tran <= 0) return trong(); // 0 = tắt trần

  const tu = new Date(Date.now() - soGio * 3_600_000);
  try {
    const [tong, cuNhat, moiNhat] = await Promise.all([
      prisma.interviewLLMCallLog.aggregate({
        where: { userId, feature: 'agent', createdAt: { gte: tu } },
        _sum: { inputTokens: true, outputTokens: true },
      }),
      prisma.interviewLLMCallLog.findFirst({
        where: { userId, feature: 'agent', createdAt: { gte: tu } },
        orderBy: { createdAt: 'asc' },
        select: { createdAt: true },
      }),
      prisma.interviewLLMCallLog.findFirst({
        where: { userId, feature: 'agent', createdAt: { gte: tu } },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
    ]);

    // Cộng cả lượt HỎNG: token vào đã gửi đi rồi thì đã tiêu rồi, dù câu trả
    // lời không bao giờ về. Chỉ đếm lượt thành công là mở đúng một đường cho
    // một vòng lặp hỏng chạy vô hạn mà không bao giờ chạm trần.
    const daDung = (tong._sum.inputTokens ?? 0) + (tong._sum.outputTokens ?? 0);
    const ms = soGio * 3_600_000;
    return {
      daDung,
      tran,
      conLai: Math.max(0, tran - daDung),
      phanTram: Math.min(100, Math.round((daDung / tran) * 100)),
      soGio,
      hetHan: daDung >= tran,
      hoiLucNao: cuNhat ? new Date(cuNhat.createdAt.getTime() + ms) : null,
      hoiHetLuc: moiNhat ? new Date(moiNhat.createdAt.getTime() + ms) : null,
    };
  } catch (err) {
    logger.warn('agent: không đọc được hạn mức, cho đi tiếp', { error: (err as Error).message });
    return trong();
  }
}

// ─── Trần TIỀN riêng cho agent, tính trên CẢ SITE ──────────────────

/**
 * VÌ SAO CẦN CÁI NÀY, KHI ĐÃ CÓ `llm/budget.ts`.
 *
 * Cầu dao trong `budget.ts` là trần CHUNG: chạm 40 $/ngày thì MỌI thứ tắt —
 * chat, chấm bài, gia sư, mổ CV, của tất cả mọi người. Đo thật 17/08/2026:
 * một việc agent 12 bước trên mã thật tốn ~141k token ≈ 0,18 $. Hạn mức 4
 * triệu token/5 giờ vì thế đáng khoảng **5 $ mỗi cửa sổ**, tức tối đa
 * **~24 $/ngày cho MỘT người dùng** nếu họ dùng cạn cả 4,8 cửa sổ.
 *
 * Nghĩa là MỘT người dùng Pro chăm chỉ ăn 60% ngân sách AI của cả web, và HAI
 * người như thế làm tắt AI của tất cả những người còn lại — những người không
 * hề chạm vào agent và đã trả tiền cho các tính năng khác.
 *
 * Trần này ngăn đúng chuyện đó: agent có ví riêng. Cạn ví thì AGENT dừng, phần
 * còn lại của web vẫn chạy bằng ngân sách chưa ai đụng tới. Đây là cùng một ý
 * với trần MỀM trong `budget.ts` (cắt việc nền trước, giữ việc người dùng
 * bấm), chỉ khác chiều cắt.
 *
 * Mặc định 20 $ = một nửa trần cứng của site, nên phần còn lại của web luôn
 * còn ít nhất 20 $ dư địa dù agent có tiêu thế nào.
 */
const MAC_DINH_TRAN_TIEN = 20;

export function tranTienNgay(): number {
  const raw = process.env.AGENT_DAILY_COST_USD;
  if (raw === undefined || raw === '') return MAC_DINH_TRAN_TIEN;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : MAC_DINH_TRAN_TIEN;
}

export interface ViAgent { daTieu: number; tran: number; canVi: boolean }

/** Tiền agent đã tiêu hôm nay, cả site. Nhớ 60 giây như `budget.ts`. */
let demTien: { luc: number; usd: number } | null = null;

export async function xemViAgent(): Promise<ViAgent> {
  const tran = tranTienNgay();
  if (tran <= 0) return { daTieu: 0, tran, canVi: false };

  const gio = Date.now();
  if (demTien && gio - demTien.luc < 60_000) {
    return { daTieu: demTien.usd, tran, canVi: demTien.usd >= tran };
  }

  const dau = new Date();
  dau.setHours(0, 0, 0, 0);
  try {
    const agg = await prisma.interviewLLMCallLog.aggregate({
      where: { feature: 'agent', createdAt: { gte: dau } },
      _sum: { costUsd: true },
    });
    const usd = Number(agg._sum.costUsd ?? 0);
    demTien = { luc: gio, usd };
    return { daTieu: usd, tran, canVi: usd >= tran };
  } catch (err) {
    // Đồng hồ đo hỏng ⇒ cho đi tiếp. Trần cứng toàn site vẫn đứng sau.
    logger.warn('agent: không đọc được ví agent, cho đi tiếp', { error: (err as Error).message });
    return { daTieu: 0, tran, canVi: false };
  }
}

/** Xoá bộ đếm — dùng trong kiểm thử và sau khi admin đổi trần. */
export function xoaDemTienAgent(): void {
  demTien = null;
}

export function loiCanVi(v: ViAgent): string {
  return (
    `Ngân sách AI dành cho chế độ Lập trình hôm nay đã hết ` +
    `(~$${v.daTieu.toFixed(2)} / $${v.tran}). Chế độ này mở lại vào 00:00; ` +
    `các tính năng AI khác vẫn hoạt động bình thường.`
  );
}

/** Câu báo cho người dùng khi cạn hạn mức. */
export function loiHetHan(h: HanMuc): string {
  const trieu = (n: number): string => (n / 1_000_000).toFixed(2).replace(/\.?0+$/, '');
  const gio = h.hoiLucNao
    ? h.hoiLucNao.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : null;
  return (
    `Bạn đã dùng hết hạn mức agent trong ${h.soGio} giờ qua ` +
    `(${trieu(h.daDung)}/${trieu(h.tran)} triệu token).` +
    (gio ? ` Hạn mức bắt đầu hồi lại từ khoảng ${gio}.` : '')
  );
}
