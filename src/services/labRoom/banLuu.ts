/**
 * Khi nào một bản AI đã soạn và lưu (giảng đề, hướng dẫn review, kết quả chấm)
 * còn dùng được.
 *
 * Bản lưu mang hai con dấu:
 *   • `_luat` — phiên bản bộ luật (tờ checklist, prompt) lúc soạn;
 *   • `_mau`  — dấu vân tay của SOURCE CHUẨN đã đưa cho AI giảng theo.
 *
 * Dấu thứ hai có vì 21/09/2026: 54 lời giải được sửa theo tờ checklist rồi nạp
 * dần từng đợt, còn bài giảng đề đã lưu thì không bao giờ tự làm mới — bài nào
 * mở giữa hai lần nạp sẽ giữ mãi bài giảng soạn khi CHƯA có source chuẩn, trong
 * khi người học gõ lại đúng source đó để thầy review.
 *
 * Tách riêng (không prisma, không LLM) để kiểm được bằng `tsx --test`.
 */
import { createHash } from 'crypto';
import { PHIEN_BAN_LUAT } from './checklistThay.js';

/** 12 ký tự hex của sha1(source chuẩn); rỗng khi bài chưa có source chuẩn. */
export function vanTayMau(mauDeDay: string | null): string {
  return mauDeDay ? createHash('sha1').update(mauDeDay).digest('hex').slice(0, 12) : '';
}

/** Bản lưu có đúng phiên bản luật hiện hành không. */
export function laLuatMoi(json: unknown): boolean {
  return !!json && typeof json === 'object' && (json as Record<string, unknown>)._luat === PHIEN_BAN_LUAT;
}

/**
 * Bài giảng đề đã lưu còn dùng được: đúng luật VÀ soạn theo đúng source chuẩn
 * đang có. Bản lưu trước khi có dấu `_mau` được coi là soạn không có source —
 * vẫn dùng nếu bài vẫn chưa có source chuẩn, soạn lại nếu nay đã có.
 */
export function giangDeConHan(json: unknown, mauDeDay: string | null): boolean {
  if (!laLuatMoi(json)) return false;
  const mau = (json as Record<string, unknown>)._mau;
  return (typeof mau === 'string' ? mau : '') === vanTayMau(mauDeDay);
}
