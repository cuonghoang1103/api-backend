/**
 * MODEL CỦA AGENT PHỤ — chọn theo VIỆC như Claude Code (17/10/2026).
 *
 * Mức (`mucModelPhu` trong thân `/agent/turn` của lượt phụ):
 *   ke_thua  — MẶC ĐỊNH: cùng model với agent chính (chất lượng trước).
 *   nhanh    — dò tìm / liệt kê / đọc lướt / tóm tắt đơn giản.
 *   can_bang — phân tích vừa.
 *   manh     — suy luận sâu; không bao giờ vượt model chính ⇒ thực tế = model chính.
 *
 * Bảng theo cổng:
 *   chính hãng: nhanh = claude-haiku-5-5 · can_bang = claude-sonnet-5-5 · manh = model chính
 *   rambo:      nhanh = claude-haiku-4-5 · can_bang = claude-sonnet-5   · manh = model chính
 *   modelapi:   nhanh = gpt-5.6-luna     · can_bang = gpt-6-sol         · manh = model chính
 *
 * Luật cứng: model phụ KHÔNG BAO GIỜ đắt hơn model chính người dùng đã chọn
 * (so cả giá vào lẫn giá ra). Đắt hơn / không gọi được ⇒ dùng model chính.
 */
import { goiDuocModel, priceOf } from '../../llm/gateway.js';
import { giaCua } from './gia.js';

export type MucModelPhu = 'nhanh' | 'can_bang' | 'manh' | 'ke_thua';
export type CongModelPhu = 'anthropic' | 'rambo' | 'modelapi';

const BANG: Record<CongModelPhu, Partial<Record<MucModelPhu, string>>> = {
  anthropic: { nhanh: 'claude-haiku-5-5', can_bang: 'claude-sonnet-5-5' },
  rambo: { nhanh: 'claude-haiku-4-5', can_bang: 'claude-sonnet-5' },
  modelapi: { nhanh: 'gpt-5.6-luna', can_bang: 'gpt-6-sol' },
};

/** Khoá `model:` của file `.claude/agents/*.md` (định dạng Claude Code) ⇒ mức. */
export function mucTuKhaiBaoClaudeCode(v: unknown): MucModelPhu | null {
  const s = String(v ?? '').trim().toLowerCase();
  if (s === 'haiku') return 'nhanh';
  if (s === 'sonnet') return 'can_bang';
  if (s === 'opus') return 'manh';
  if (s === 'inherit') return 'ke_thua';
  return null;
}

export function docMucModelPhu(v: unknown): MucModelPhu {
  if (v === 'nhanh' || v === 'can_bang' || v === 'manh' || v === 'ke_thua') return v;
  return mucTuKhaiBaoClaudeCode(v) ?? 'ke_thua';
}

export function chonModelPhu(o: { cong: CongModelPhu; modelChinh: string; muc: unknown }): string {
  const muc = docMucModelPhu(o.muc);
  const ung = BANG[o.cong][muc];
  if (!ung || ung === o.modelChinh) return o.modelChinh;
  /* Model chính đã là hạng nhẹ nhất ⇒ không có gì rẻ hơn để đổi (bảng giá rambo không có haiku). */
  if (/haiku|luna/i.test(o.modelChinh)) return o.modelChinh;
  const gia = (m: string) => (o.cong === 'anthropic' ? giaCua(m) : priceOf(m));
  const a = gia(ung);
  const b = gia(o.modelChinh);
  if (a.in > b.in || a.out > b.out) return o.modelChinh;
  if (o.cong === 'modelapi' && !goiDuocModel(ung)) return o.modelChinh;
  return ung;
}
