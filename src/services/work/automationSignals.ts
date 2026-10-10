/**
 * CT Work đợt 7c (C13) — "tín hiệu" cho luật tự động từ những nơi KHÔNG phải sự kiện thẻ:
 *   test.failed       — nhập kết quả CI có test đỏ (testAutomation.service.ts)
 *   pr.merged         — GitHub PR / GitLab MR được merge (github.service.ts, gitlab.service.ts)
 *   sla.breached      — yêu cầu service desk vượt SLA (serviceDesk.service.ts runSlaChecks, mỗi mốc một lần)
 *   baseline.changed  — baseline yêu cầu được chụp / duyệt / bị từ chối (quality.service.ts)
 * (issue.due_soon chạy theo lịch trong automation.service.ts, không qua đây.)
 *
 * Tách khỏi bus sự kiện thẻ (events.ts) có chủ ý: tín hiệu KHÔNG đi socket tới trình duyệt, và không mang `issueId`
 * (listener cũ nhận diện sự kiện thẻ bằng `'issueId' in e`). Không phụ thuộc gì ⇒ nơi phát import được mà không vòng.
 */

import { logger } from '../../utils/logger.js';

export const SIGNALS = ['test.failed', 'pr.merged', 'sla.breached', 'baseline.changed'] as const;
export type SignalKind = (typeof SIGNALS)[number];

export interface AutomationSignal {
  signal: SignalKind;
  projectId: number;
  /** Thẻ liên quan (test case đỏ, thẻ được PR nhắc, yêu cầu vượt SLA). Rỗng ⇒ luật chạy MỘT lần không gắn thẻ. */
  issueIds: number[];
  /** Người gây ra (người nhập kết quả, người ký baseline…) — null với việc nền / webhook. */
  actorUserId?: number | null;
  /** Giá trị cho mẫu chữ {{event.x}} — chỉ chuỗi ngắn, không dữ liệu nhạy cảm. */
  data?: Record<string, string | number | null>;
}

type Listener = (s: AutomationSignal) => Promise<void> | void;
const listeners = new Set<Listener>();

export function onAutomationSignal(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Phát SAU KHI việc chính đã xong. Listener hỏng không làm hỏng việc chính (chỉ ghi log). */
export function emitAutomationSignal(s: AutomationSignal): void {
  for (const fn of listeners) {
    Promise.resolve()
      .then(() => fn(s))
      .catch((err) => logger.error('[work] automation signal lỗi', { signal: s.signal, err }));
  }
}
