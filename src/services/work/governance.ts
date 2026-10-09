/**
 * CT Work — luật THUẦN của đợt S3b (CR · RAID · họp). Không chạm DB — test bằng bảng
 * ở governance.test.ts (trong `npm test`).
 *
 * Chuẩn tham chiếu:
 *   - PMBOK® Guide 7th ed. — Perform Integrated Change Control (CR), miền Uncertainty (rủi ro);
 *   - PRINCE2 — Issue Register / Risk Register, "change authority" (ai được duyệt thay đổi);
 *   - Sổ RAID (Risks · Assumptions · Issues · Dependencies) — thang điểm theo
 *     content/quy-trinh/mau/so-dang-ky-rui-ro.md: L × I, ≥ 15 cao, 8–14 trung bình, ≤ 7 thấp.
 */

import type { CrStatus, MeetingType, RaidType } from './constants.js';

// ═══ Yêu cầu thay đổi (CR) ════════════════════════════════════════

/**
 * Chuyển trạng thái CR mà NGƯỜI bấm được (không qua phê duyệt):
 *   DRAFT → SUBMITTED (gửi) · SUBMITTED → DRAFT (rút lại để sửa) · REJECTED → DRAFT (làm lại)
 *   APPROVED → IMPLEMENTED (đã làm xong).
 * UNDER_REVIEW / APPROVED / REJECTED chỉ do phê duyệt đặt (approvals.service applyCrEffect).
 */
const CR_MANUAL: Record<CrStatus, CrStatus[]> = {
  DRAFT: ['SUBMITTED'],
  SUBMITTED: ['DRAFT'],
  UNDER_REVIEW: [],
  APPROVED: ['IMPLEMENTED'],
  REJECTED: ['DRAFT'],
  IMPLEMENTED: [],
};

export function crManualTransitionAllowed(from: string, to: string): boolean {
  return (CR_MANUAL[from as CrStatus] ?? []).includes(to as CrStatus);
}

/** Gửi duyệt được khi CR đang DRAFT (tự chuyển SUBMITTED) hoặc SUBMITTED. */
export function crCanRequestApproval(status: string): boolean {
  return status === 'DRAFT' || status === 'SUBMITTED';
}

/** CR "đang chờ quyết định" — để đếm tuổi trên portfolio. */
export function crPending(status: string): boolean {
  return status === 'SUBMITTED' || status === 'UNDER_REVIEW';
}

/** Hiệu ứng của phê duyệt CR lên CR (chạy trong transaction quyết định). */
export function crStatusAfterApproval(outcome: 'APPROVED' | 'REJECTED' | 'CANCELLED'): CrStatus {
  if (outcome === 'APPROVED') return 'APPROVED';
  if (outcome === 'REJECTED') return 'REJECTED';
  return 'SUBMITTED';
}

/**
 * Tổng của sổ CR: +ngày và chi phí của các CR ĐÃ DUYỆT (APPROVED + IMPLEMENTED). Chi phí
 * gộp THEO ĐƠN VỊ ghi tự do (không quy đổi tỉ giá — không tính giá). Đơn vị trống ⇒ "—".
 */
export function crTotals(rows: Array<{ status: string; scheduleDays: number | null; costAmount: number | null; costCurrency: string | null }>) {
  const approved = rows.filter((r) => r.status === 'APPROVED' || r.status === 'IMPLEMENTED');
  const days = approved.reduce((n, r) => n + (r.scheduleDays ?? 0), 0);
  const cost = new Map<string, number>();
  for (const r of approved) {
    if (r.costAmount === null || r.costAmount === undefined) continue;
    const cur = (r.costCurrency ?? '').trim().toUpperCase() || '—';
    cost.set(cur, Math.round(((cost.get(cur) ?? 0) + r.costAmount) * 100) / 100);
  }
  const byStatus: Record<string, number> = {};
  for (const r of rows) byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
  return {
    approvedCount: approved.length,
    approvedDays: days,
    approvedCost: [...cost.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([currency, amount]) => ({ currency, amount })),
    pending: rows.filter((r) => crPending(r.status)).length,
    byStatus,
  };
}

// ═══ Sổ RAID ═══════════════════════════════════════════════════════

export const RAID_THRESHOLDS = { HIGH: 15, MEDIUM: 8 } as const;

/** Trạng thái hợp lệ theo loại — giả định có bộ riêng. */
export function raidStatusesFor(type: RaidType): readonly string[] {
  if (type === 'QUESTION') return ['OPEN', 'ANSWERED', 'CANCELLED'];
  return type === 'ASSUMPTION' ? ['UNVALIDATED', 'VALIDATED', 'INVALID'] : ['OPEN', 'MONITORING', 'MITIGATED', 'CLOSED'];
}
export const raidDefaultStatus = (type: RaidType) => (type === 'ASSUMPTION' ? 'UNVALIDATED' : 'OPEN');
/** Dòng đã "đóng" (không còn nhắc xem lại, không vào top rủi ro). */
export const raidClosed = (status: string) => status === 'CLOSED' || status === 'VALIDATED' || status === 'INVALID' || status === 'ANSWERED' || status === 'CANCELLED';

export function riskScore(p: number | null | undefined, i: number | null | undefined): number | null {
  if (!p || !i) return null;
  return p * i;
}

export function riskLevel(score: number | null): 'HIGH' | 'MEDIUM' | 'LOW' | null {
  if (score === null) return null;
  if (score >= RAID_THRESHOLDS.HIGH) return 'HIGH';
  if (score >= RAID_THRESHOLDS.MEDIUM) return 'MEDIUM';
  return 'LOW';
}

/** Ma trận 5×5: cells[p-1][i-1] = số rủi ro ĐANG MỞ (chưa đóng) có xác suất p, ảnh hưởng i. */
export function riskMatrix(rows: Array<{ type: string; status: string; probability: number | null; impact: number | null }>): number[][] {
  const m = Array.from({ length: 5 }, () => [0, 0, 0, 0, 0]);
  for (const r of rows) {
    if (r.type !== 'RISK' || raidClosed(r.status) || !r.probability || !r.impact) continue;
    if (r.probability < 1 || r.probability > 5 || r.impact < 1 || r.impact > 5) continue;
    m[r.probability - 1][r.impact - 1] += 1;
  }
  return m;
}

/** Cần xem lại: có ngày xem lại ≤ hôm nay và chưa đóng. */
export function reviewDue(r: { status: string; reviewDate: string | null }, today: string): boolean {
  return !!r.reviewDate && r.reviewDate <= today && !raidClosed(r.status);
}

/** Tiền tố hiển thị: R-12, A-3, I-7, D-9 (một bộ đếm chung cho cả sổ). */
export const RAID_PREFIX: Record<RaidType, string> = { RISK: 'R', ASSUMPTION: 'A', ISSUE: 'I', DEPENDENCY: 'D', QUESTION: 'Q' };

/**
 * Rủi ro mẫu từ so-dang-ky-rui-ro.md: các dòng bảng có ID dạng R01. Cột:
 * ID | Ngày | Rủi ro | Nhóm | L | I | Mức | Chiến lược | Biện pháp | Trigger | Người theo dõi | Trạng thái | Cập nhật.
 */
export function starterRisksFromTemplate(md: string): Array<{ title: string; category: string | null; response: string | null; mitigation: string | null; trigger: string | null }> {
  const RESP: Record<string, string> = { 'tránh': 'AVOID', 'giảm': 'MITIGATE', 'chuyển giao': 'TRANSFER', 'chấp nhận': 'ACCEPT' };
  const out = [];
  for (const line of md.split('\n')) {
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 10 || !/^R\d+$/.test(cells[0])) continue;
    out.push({
      title: cells[2].slice(0, 255),
      category: cells[3] || null,
      response: RESP[cells[7].toLowerCase()] ?? null,
      mitigation: cells[8] || null,
      trigger: cells[9] || null,
    });
  }
  return out;
}

// ═══ Họp ════════════════════════════════════════════════════════════

export const MEETING_LABEL: Record<MeetingType, string> = {
  KICKOFF: 'Kick-off', DAILY: 'Daily stand-up', WEEKLY: 'Weekly', DEMO: 'Demo', RETRO: 'Retrospective',
  STEERING: 'Steering committee', CLIENT: 'Client meeting', OTHER: 'Meeting',
};

/**
 * Tách mẫu biên bản kick-off (bien-ban-kick-off.md) thành chương trình (mục "Chương trình")
 * và khung biên bản (mục 3 trở đi). Trả Markdown — service đổi sang TipTap.
 */
export function splitKickoffTemplate(md: string): { agenda: string; minutes: string } {
  const body = md.split(/\n---\n/)[1] ?? md;
  const sections = body.split(/\n(?=## )/);
  const agenda = sections.filter((s) => /^## \d+\.\s*Chương trình/i.test(s.trim())).join('\n\n');
  const minutes = sections.filter((s) => /^## [3-9]\./.test(s.trim())).join('\n\n');
  return { agenda: agenda.trim(), minutes: minutes.trim() };
}

/** Kiểm giờ họp: kết thúc sau bắt đầu, dài tối đa 24 giờ. */
export function meetingTimeError(startsAt: Date, endsAt: Date): string | null {
  if (!(endsAt.getTime() > startsAt.getTime())) return 'The meeting must end after it starts';
  if (endsAt.getTime() - startsAt.getTime() > 24 * 3_600_000) return 'A meeting can last at most 24 hours';
  return null;
}

/** Múi giờ IANA hợp lệ (Intl biết nó). */
export function validTimezone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** Link họp: chỉ http(s). Nhận diện nền tảng để hiện nhãn (KHÔNG gọi API của họ). */
export function meetingProvider(url: string | null | undefined): 'MEET' | 'ZOOM' | 'TEAMS' | 'JITSI' | 'OTHER' | null {
  if (!url) return null;
  let host = '';
  try { host = new URL(url).hostname.toLowerCase(); } catch { return null; }
  if (host === 'meet.google.com') return 'MEET';
  if (host === 'meet.jit.si' || host.endsWith('.jitsi.net') || host.startsWith('jitsi.')) return 'JITSI';
  if (host.endsWith('zoom.us')) return 'ZOOM';
  if (host.endsWith('teams.microsoft.com') || host.endsWith('teams.live.com')) return 'TEAMS';
  return 'OTHER';
}

/**
 * CTW-24 bậc 1: phòng họp Jitsi Meet miễn phí, không cần tài khoản/khoá API —
 * `https://meet.jit.si/ctwork-<ngẫu nhiên>`. Tên phòng là bí mật duy nhất của phòng nên phải
 * khó đoán: 16 ký tự [a-z0-9] từ nguồn ngẫu nhiên mật mã (~82 bit).
 */
export function newJitsiUrl(rand: (n: number) => Uint8Array = (n) => crypto.getRandomValues(new Uint8Array(n))): string {
  const abc = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = rand(16);
  let id = '';
  for (const b of bytes) id += abc[b % abc.length];
  return `https://meet.jit.si/ctwork-${id}`;
}
