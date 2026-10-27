/**
 * CT Work 27/10/2026 — CuongMini review HÀNG LOẠT các thẻ ở cột Review (thay trưởng nhóm / mentor). Phần THUẦN
 * (test: reviewHangLoat.test.ts).
 *
 *   parseCardDecision — đọc JSON model trả cho MỘT thẻ: kết luận DONE / BACK / KEEP + tiêu chí + phát hiện (kẹp như review
 *                       code: tệp ngoài diff bị bỏ, dòng ngoài patch bị gỡ) + bình luận gửi thành viên. Còn BLOCKER/MAJOR
 *                       hoặc tiêu chí "no" ⇒ không bao giờ DONE (hạ thành BACK).
 *   autoDoneOk        — chế độ TỰ ĐỘNG chỉ được chuyển Done khi: mọi tiêu chí "Xong khi" đạt CÓ bằng chứng, không phát hiện
 *                       BLOCKER/MAJOR, và nếu thẻ có code thì PR đã merge. Thiếu một điều ⇒ không tự chuyển.
 *   autoBackOk        — tự trả về In Progress chỉ khi có lý do CỤ THỂ (tiêu chí "no" hoặc BLOCKER/MAJOR).
 */

import { parseCodeReview, type AcceptanceCheck, type CodeFinding, type DiffIndexFile } from './codeReviewRules.js';

export const CARD_DECISIONS = ['DONE', 'BACK', 'KEEP'] as const;
export type CardDecision = (typeof CARD_DECISIONS)[number];

export interface CardReview {
  decision: CardDecision;
  /** Kết luận model nói trước khi bị kẹp. */
  decisionRaw: string | null;
  summary: string;
  comment: string;
  acceptance: AcceptanceCheck[];
  findings: CodeFinding[];
}

const str = (v: unknown, max: number) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : '');

export function parseCardDecision(raw: unknown, index: DiffIndexFile[]): CardReview {
  const o = (raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}) as Record<string, unknown>;
  const base = parseCodeReview({ findings: o.findings, acceptance: o.acceptance, summary: o.summary }, index);
  const d = typeof o.decision === 'string' ? o.decision.trim().toUpperCase() : null;
  let decision: CardDecision = (CARD_DECISIONS as readonly string[]).includes(d ?? '') ? d as CardDecision : 'KEEP';
  const serious = base.findings.some((f) => f.severity === 'BLOCKER' || f.severity === 'MAJOR') || base.acceptance.some((a) => a.met === 'no');
  if (decision === 'DONE' && serious) decision = 'BACK';
  return { decision, decisionRaw: d, summary: base.summary, comment: str(o.comment, 4000), acceptance: base.acceptance, findings: base.findings };
}

export function autoDoneOk(r: Pick<CardReview, 'decision' | 'acceptance' | 'findings'>, code: { hasCode: boolean; merged: boolean }): boolean {
  if (r.decision !== 'DONE') return false;
  if (!r.acceptance.length || r.acceptance.some((a) => a.met !== 'yes' || !a.evidence)) return false;
  if (r.findings.some((f) => f.severity === 'BLOCKER' || f.severity === 'MAJOR')) return false;
  if (code.hasCode && !code.merged) return false;
  return true;
}

export function autoBackOk(r: Pick<CardReview, 'decision' | 'acceptance' | 'findings'>): boolean {
  if (r.decision !== 'BACK') return false;
  return r.acceptance.some((a) => a.met === 'no') || r.findings.some((f) => f.severity === 'BLOCKER' || f.severity === 'MAJOR');
}

/** Tên cột review (giống issueView / goiYChuyenTheRules). */
export const REVIEW_COLUMN = /review|qa\b|verify|kiểm|duyệt/i;
