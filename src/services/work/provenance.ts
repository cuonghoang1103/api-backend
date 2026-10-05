/**
 * CT Work — đợt S6: NGUỒN GỐC AI (provenance) của thẻ/trang + luật "AI-assisted work needs an independent reviewer".
 *
 * Nguyên tắc (báo cáo SDAD): AI viết thì KHÔNG tự duyệt phát hành, và phải biết thứ gì do AI góp tay.
 *   - Thẻ được gắn "AI-assisted" khi: (1) nội dung (tiêu đề/mô tả) được tạo/sửa qua một đề xuất AI người dùng bấm Apply
 *     (actor kind AI — issueChange tự gắn); (2) commit/PR liên kết có trailer `Co-Authored-By:` của một model AI
 *     (github/gitlab webhook ⇒ markFromDevActivity); (3) gắn tay (PATCH `aiAssisted`). Mỗi lần gắn ghi một dòng lịch
 *     sử field `aiAssisted` (model + nguồn; người + thời điểm là actor + createdAt của dòng).
 *   - Luật tuỳ chọn (settings.aiReview.requireIndependentReviewer, mặc định TẮT): thẻ AI-assisted vào cột DONE cần một
 *     phê duyệt ISSUE đã APPROVED, chữ ký còn khớp nội dung, có người duyệt KHÁC người tạo thẻ và người áp dụng AI.
 *     Kiểm trong cửa ghi chung (applyIssueChange) ⇒ kéo board, sửa hàng loạt, AI Apply đều bị chặn như nhau; luật tự
 *     động/hệ thống không bị chặn (cùng luật với Done rules).
 */

import type { Prisma } from '@prisma/client';
import { BadRequestError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { currentTargetHash, signedHash } from './approvalContent.js';
import { aiCoAuthorIn, aiReviewRuleOf, independentApprovalOk } from './specFidelity.js';

type Tx = Prisma.TransactionClient;

/** Model đang phân cho trợ lý CT Work (nhãn khi đề xuất không mang tên model). Lỗi đọc cấu hình ⇒ null. */
export async function assistantModel(): Promise<string | null> {
  try {
    const { modelFor } = await import('../llm/gateway.js');
    return modelFor('work_assistant');
  } catch {
    return null;
  }
}

export const AI_SOURCE = { apply: 'AI suggestion applied', manual: 'marked by hand', spec: 'Spec Fidelity suggestion applied' } as const;

/** Giá trị lịch sử của field `aiAssisted`: "claude-sonnet-5 · AI suggestion applied". */
export function provenanceValue(model: string | null | undefined, source: string): string {
  return `${model?.trim() || 'unknown model'} · ${source}`.slice(0, 500);
}

export async function assertAiIndependentReview(
  tx: Tx, projectId: number,
  issue: { id: number; aiAssisted: boolean; reporterId: number | null; aiAppliedById: number | null },
  issueKey: string,
) {
  if (!issue.aiAssisted) return;
  const p = await tx.workProject.findUnique({ where: { id: projectId }, select: { settings: true } });
  if (!aiReviewRuleOf(p?.settings).requireIndependentReviewer) return;
  const approvals = await tx.workApproval.findMany({
    where: { issueId: issue.id, targetType: 'ISSUE', status: 'APPROVED' },
    select: { targetType: true, issueId: true, stageId: true, contentHash: true, steps: { select: { approverId: true, decision: true, contentHash: true, decidedAt: true } } },
  });
  const now = approvals.length ? await currentTargetHash(tx, approvals[0]) : null;
  const ok = independentApprovalOk(approvals.map((a) => ({ signedHash: signedHash(a), steps: a.steps })), now, [issue.reporterId, issue.aiAppliedById]);
  if (!ok) {
    throw new BadRequestError(
      `${issueKey} is AI-assisted. Before it can move to Done it needs an approved review from someone other than its creator and the person who applied the AI suggestion (request approval on the issue).`,
      'WORK_AI_REVIEW_REQUIRED',
    );
  }
}

/**
 * Commit/PR mang trailer `Co-Authored-By:` của model AI ⇒ gắn AI-assisted cho thẻ liên kết (actor SYSTEM). Đã gắn
 * với đúng model đó ⇒ bỏ qua (webhook gửi lại không đẻ thêm lịch sử). Lỗi chỉ ghi log — không làm hỏng webhook.
 */
export async function markFromDevActivity(issueId: number, activity: { kind: string; externalId: string; text: string }): Promise<boolean> {
  const model = aiCoAuthorIn(activity.text);
  if (!model) return false;
  try {
    const { prisma } = await import('../../config/database.js');
    const cur = await prisma.workIssue.findUnique({ where: { id: issueId }, select: { aiAssisted: true, aiModel: true } });
    if (!cur || (cur.aiAssisted && cur.aiModel === model)) return false;
    const { applyIssueChange } = await import('./issueChange.js');
    const short = activity.kind === 'COMMIT' ? activity.externalId.slice(0, 7) : activity.externalId.split(/[#!]/).pop();
    await applyIssueChange(issueId, {}, { kind: 'SYSTEM', userId: null }, {
      aiProvenance: { model, source: `${activity.kind === 'COMMIT' ? 'commit' : activity.kind === 'PR' ? 'pull request' : activity.kind.toLowerCase()} ${short ?? ''} has Co-Authored-By`.trim(), appliedById: null },
    });
    return true;
  } catch (err) {
    logger.info('[work] provenance: không gắn được AI-assisted từ commit/PR', { issueId, err: (err as Error).message });
    return false;
  }
}
