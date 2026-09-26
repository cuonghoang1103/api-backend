/**
 * ============================================================
 * HẠN MỨC CUONG FABLE 5 (`claude-fable-5`) — riêng, 30 ngày trượt
 * ============================================================
 *
 * Người dùng 26/09/2026: *"fable tốn token gấp 3,5 lần bình thường nên bạn
 * giới hạn và cảnh báo user dùng model này. Chỉ tài khoản admin dùng không
 * giới hạn, còn tài khoản Pro thì có giới hạn — dùng hết sẽ có nút gửi yêu cầu
 * cho admin, admin duyệt thì được dùng thêm một chút nữa."*
 *
 * ─── ĐẾM TỪ SỔ CÓ SẴN, KHÔNG THÊM BỘ ĐẾM ───
 * Mỗi lượt agent đã ghi một dòng `interview_llm_call_logs` kèm `model` (xem
 * `ghiSo` trong `turn.ts`), kể cả lượt hỏng. Cộng các dòng `claude-fable-5`
 * của người đó trong 30 ngày qua là ra số đã dùng — không có bộ đếm thứ hai
 * để lệch khỏi sổ. Bảng `fable_quota_requests` chỉ giữ các lần XIN THÊM.
 *
 * ─── CỬA SỔ ───
 * Trượt 30 ngày, cùng lý do hạn mức 5 giờ trượt (`quota.ts`): không có mốc
 * reset để người bắt đầu sát mốc mất trắng. Phần XIN THÊM được duyệt cũng chỉ
 * tính trong 30 ngày kể từ lúc duyệt — "thêm một chút", không phải cộng dồn
 * vĩnh viễn.
 *
 * Đổi bằng env, không sửa mã:
 *   FABLE_TOKEN_PRO      hạn mức gốc mỗi 30 ngày cho Pro (mặc định 400.000)
 *   FABLE_THEM_MAC_DINH  số token admin cộng khi duyệt nếu không tự nhập (200.000)
 */
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

export const MODEL_FABLE = 'claude-fable-5';
/** Hệ số tiêu hao so với model thường — dùng để quy đổi trong hạn mức 5 giờ. */
export const HE_SO_FABLE = 3.5;

const NGAY_CUA_SO = 30;
const MAC_DINH_GOC = 400_000;
const MAC_DINH_THEM = 200_000;

function soEnv(ten: string, macDinh: number): number {
  const raw = process.env[ten];
  if (raw === undefined || raw === '') return macDinh;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : macDinh;
}

export function tranFableGoc(): number { return soEnv('FABLE_TOKEN_PRO', MAC_DINH_GOC); }
export function soTokenThemMacDinh(): number { return soEnv('FABLE_THEM_MAC_DINH', MAC_DINH_THEM); }

export interface HanMucFable {
  /** Admin ⇒ không giới hạn (vẫn đếm để thấy mức tiêu). */
  khongGioiHan: boolean;
  daDung: number;
  /** Gốc + phần được duyệt thêm trong cửa sổ. */
  tran: number;
  conLai: number;
  phanTram: number;
  hetHan: boolean;
  soNgay: number;
  /** Có một yêu cầu xin thêm đang chờ admin ⇒ app ẩn nút xin, hiện "đang chờ". */
  dangChoDuyet: boolean;
  /** Lần xin gần nhất bị từ chối (để app nói lý do). */
  tuChoiGanNhat: { adminNote: string | null; luc: string } | null;
}

export async function xemHanMucFable(userId: number): Promise<HanMucFable> {
  const tu = new Date(Date.now() - NGAY_CUA_SO * 86_400_000);
  const goc = tranFableGoc();

  let khongGioiHan = false;
  try {
    const { laAdmin } = await import('../pro.service.js');
    khongGioiHan = await laAdmin(userId);
  } catch { /* không tra được vai trò ⇒ coi như người thường */ }

  try {
    const [dung, them, cho, tuChoi] = await Promise.all([
      prisma.interviewLLMCallLog.aggregate({
        where: { userId, feature: 'agent', model: MODEL_FABLE, createdAt: { gte: tu } },
        _sum: { inputTokens: true, outputTokens: true },
      }),
      prisma.fableQuotaRequest.aggregate({
        where: { userId, status: 'APPROVED', resolvedAt: { gte: tu } },
        _sum: { soToken: true },
      }),
      prisma.fableQuotaRequest.count({ where: { userId, status: 'PENDING' } }),
      prisma.fableQuotaRequest.findFirst({
        where: { userId, status: 'REJECTED', resolvedAt: { gte: tu } },
        orderBy: { resolvedAt: 'desc' },
        select: { adminNote: true, resolvedAt: true },
      }),
    ]);
    const daDung = (dung._sum.inputTokens ?? 0) + (dung._sum.outputTokens ?? 0);
    const tran = goc + (them._sum.soToken ?? 0);
    return {
      khongGioiHan,
      daDung,
      tran,
      conLai: Math.max(0, tran - daDung),
      phanTram: tran > 0 ? Math.min(100, Math.round((daDung / tran) * 100)) : 100,
      hetHan: !khongGioiHan && daDung >= tran,
      soNgay: NGAY_CUA_SO,
      dangChoDuyet: cho > 0,
      tuChoiGanNhat: tuChoi?.resolvedAt
        ? { adminNote: tuChoi.adminNote, luc: tuChoi.resolvedAt.toISOString() }
        : null,
    };
  } catch (err) {
    /* ⚠️ Đọc hỏng thì CHẶN, không cho đi tiếp như `quota.ts`. Ở đó cho qua
       là an toàn vì còn ví tiền phía sau; đây là model đắt gấp 3,5 lần, và
       "hỏng thì thả cửa" là đúng lỗ hổng hạn mức này sinh ra để bịt. Admin
       vẫn đi được. */
    logger.warn('fable: không đọc được hạn mức', { error: (err as Error).message });
    return {
      khongGioiHan, daDung: 0, tran: goc, conLai: 0, phanTram: 100,
      hetHan: !khongGioiHan, soNgay: NGAY_CUA_SO, dangChoDuyet: false, tuChoiGanNhat: null,
    };
  }
}

/** Câu báo khi hết hạn mức — app hiện kèm nút "Xin thêm". */
export function loiHetFable(h: HanMucFable): string {
  const k = (n: number) => `${Math.round(n / 1000).toLocaleString('vi-VN')}k`;
  return `Bạn đã dùng hết hạn mức Cuong Fable 5 (${k(h.daDung)}/${k(h.tran)} token trong ${h.soNgay} ngày). `
    + (h.dangChoDuyet
      ? 'Yêu cầu xin thêm của bạn đang chờ admin duyệt. '
      : 'Bấm "Xin thêm hạn mức" để gửi yêu cầu cho admin. ')
    + 'Trong lúc chờ, hãy chọn CuongMini Max 5 — mạnh mà rẻ hơn nhiều.';
}
