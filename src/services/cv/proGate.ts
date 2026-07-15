/**
 * CV Builder — Pro gate for AI features (user request 2026-07-16).
 * ─────────────────────────────────────────────────────────────────────────
 * Every LLM-backed feature (critique, intake, cover letter, per-bullet rewrite,
 * bilingual translate) is Pro-only — same entitlement the Interview module uses
 * (isProEffective: admins always Pro, proExpiresAt honoured). The STATIC tier
 * (rules-engine review, import, export, recruiter view, JD coverage) stays free
 * for everyone — that split is the product's free/paid line AND the token-cost
 * control.
 */
import { isProEffective } from '../pro.service.js';
import { BadRequestError } from '../../middleware/errorHandler.js';

export const CV_AI_PRO_MESSAGE =
  'Tính năng AI của CV Builder dành cho tài khoản Pro. Nâng cấp tại /pro — các tính năng miễn phí (chấm rules-engine, nhập CV, xuất file, recruiter view, so JD) vẫn dùng đầy đủ.';

/** Throw a friendly 400 when the user is not Pro. */
export async function assertCvAiPro(userId: number): Promise<void> {
  if (!(await isProEffective(userId))) throw new BadRequestError(CV_AI_PRO_MESSAGE);
}

/** Non-throwing check for status endpoints. */
export function cvAiIsPro(userId: number): Promise<boolean> {
  return isProEffective(userId);
}
