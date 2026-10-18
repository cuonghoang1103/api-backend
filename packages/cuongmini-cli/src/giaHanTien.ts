/**
 * MÃ GIA HẠN THEO $ (19/10/2026) — chữ của thẻ "Nhập mã gia hạn" trong CLI (thuần, test được).
 *
 * Máy chủ gắn `giaHanTien` vào lỗi chạm trần tiền (`src/services/agent/maGiaHanTien.ts`). CLI mở ô nhập ẨN ký tự:
 * lần 1 trong kỳ ⇒ cộng ngay + làm tiếp; lần 2+ ⇒ yêu cầu chờ duyệt, tự kiểm lại mỗi 30 giây (`NHIP_KIEM_MS`).
 */
import { L } from './i18n';
import type { GiaHanTien } from './kho';

/** Nhịp tự kiểm lại yêu cầu chờ duyệt (≥ 30 s — nhẹ cho máy chủ). `CUONGMINI_NHIP_GIA_HAN_MS` CHỈ cho test PTY (≥ 1 s). */
export const NHIP_KIEM_MS = Math.max(1000, Number(process.env.CUONGMINI_NHIP_GIA_HAN_MS) || 30_000);

export type KetQuaGiaHan =
  | { ketQua: 'daCap'; id: number; soUsd: number; lanThu: number }
  | { ketQua: 'choDuyet'; id: number; soUsd: number; lanThu: number; moi?: boolean }
  | { ketQua: 'tuChoi'; id: number; soUsd: number; lyDo: string | null }
  | { ketQua: 'hetKy'; id: number; soUsd: number };

export const usd = (n: number): string => `${n.toLocaleString('en-US', { maximumFractionDigits: 2 })} $`;

/** Tiêu đề + mô tả của thẻ nhập mã. */
export function cauTheGiaHan(g: GiaHanTien): { tieuDe: string; moTa: string } {
  const ten = L(g.ten, g.tenEn);
  return {
    /* Tiêu đề ngắn (vừa một dòng ở 90 cột); số tiền xuống dòng mô tả. */
    tieuDe: L(`⏳ Đã chạm giới hạn ${ten} · Nhập mã gia hạn để dùng tiếp`, `⏳ Limit reached: ${ten} · Enter an extension code to continue`),
    moTa: [
      L(`Đã dùng ${usd(g.daDungUsd)} / ${usd(g.tranUsd)}.`, `Used ${usd(g.daDungUsd)} / ${usd(g.tranUsd)}.`),
      g.canDuyet
        ? L(`Lần ${g.lanThu} trong kỳ — mã đúng sẽ gửi yêu cầu, admin duyệt rồi mới cộng +${usd(g.mucUsd)}.`,
          `Attempt ${g.lanThu} this period — a correct code sends a request; +${usd(g.mucUsd)} after an admin approves.`)
        : L(`Mã đúng ⇒ cộng ngay +${usd(g.mucUsd)} và CuongMini làm tiếp chỗ dở.`, `Correct code ⇒ +${usd(g.mucUsd)} right away and CuongMini continues.`),
      L('Enter gửi · Esc bỏ qua (hoặc /model chọn model khác).', 'Enter to submit · Esc to skip (or /model to pick another model).'),
    ].join('\n'),
  };
}

/** Câu báo sau khi máy chủ trả kết quả (nhập mã hoặc kiểm lại). `null` = vẫn đang chờ, không cần báo. */
export function cauKetQua(kq: KetQuaGiaHan, tuNhap: boolean): { chu: string; muc: 'ok' | 'canh' | 'loi' } | null {
  if (kq.ketQua === 'daCap') {
    return tuNhap
      ? { chu: L(`Đã gia hạn +${usd(kq.soUsd)} — CuongMini làm tiếp chỗ dở.`, `Extended by +${usd(kq.soUsd)} — CuongMini continues.`), muc: 'ok' }
      : { chu: L(`Admin đã duyệt yêu cầu gia hạn #${kq.id}: +${usd(kq.soUsd)}.`, `An admin approved extension request #${kq.id}: +${usd(kq.soUsd)}.`), muc: 'ok' };
  }
  if (kq.ketQua === 'choDuyet') {
    return tuNhap
      ? { chu: L(`Đã gửi yêu cầu gia hạn #${kq.id}, chờ admin duyệt — CuongMini tự kiểm lại mỗi 30 giây.`, `Extension request #${kq.id} sent, waiting for an admin — CuongMini re-checks every 30 seconds.`), muc: 'canh' }
      : null;
  }
  if (kq.ketQua === 'tuChoi') {
    return { chu: L(`Admin đã từ chối yêu cầu gia hạn #${kq.id}${kq.lyDo ? `: ${kq.lyDo}` : '.'}`, `An admin rejected extension request #${kq.id}${kq.lyDo ? `: ${kq.lyDo}` : '.'}`), muc: 'loi' };
  }
  return { chu: L(`Yêu cầu #${kq.id} đã qua kỳ — giới hạn đã tự làm mới, cứ gửi lại câu hỏi.`, `Request #${kq.id} expired — the limit already reset; just resend.`), muc: 'canh' };
}

/** Đang chờ duyệt sẵn (máy chủ báo `dangCho`) — không hỏi mã nữa. */
export function cauDangCho(id: number): string {
  return L(`Yêu cầu gia hạn #${id} đang chờ admin duyệt — CuongMini tự kiểm lại mỗi 30 giây.`, `Extension request #${id} is waiting for an admin — CuongMini re-checks every 30 seconds.`);
}
