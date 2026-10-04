/**
 * CRM nhẹ của studio (CT Work đợt S5b) — LUẬT THUẦN, không đụng CSDL.
 * ─────────────────────────────────────────────────────────────────────────
 * Mọi quyết định nghiệp vụ ở đây để kiểm thử được không cần Postgres
 * (`rules.test.ts`): chuyển giai đoạn, xác suất/dự báo, đồng bộ phiếu ↔ deal,
 * chấm bảng đánh giá phù hợp, hash nội dung đề xuất, báo cáo.
 *
 * Không có LLM ở đâu cả — cron nhắc việc cũng chỉ đọc số.
 */
import { createHash } from 'node:crypto';

// ─── Giai đoạn ──────────────────────────────────────────────────

export const DEAL_STAGES = ['LEAD', 'QUALIFIED', 'DISCOVERY', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'] as const;
export type DealStage = (typeof DEAL_STAGES)[number];
export const OPEN_STAGES: DealStage[] = ['LEAD', 'QUALIFIED', 'DISCOVERY', 'PROPOSAL', 'NEGOTIATION'];
/** Các bậc của phễu (LOST không phải bậc — nó là lối ra). */
export const FUNNEL: DealStage[] = ['LEAD', 'QUALIFIED', 'DISCOVERY', 'PROPOSAL', 'NEGOTIATION', 'WON'];

/** Xác suất mặc định theo giai đoạn (%), dùng khi deal không ghi đè. */
export const STAGE_PROBABILITY: Record<DealStage, number> = {
  LEAD: 10, QUALIFIED: 20, DISCOVERY: 40, PROPOSAL: 60, NEGOTIATION: 80, WON: 100, LOST: 0,
};

/** Giai đoạn sau QUALIFIED chỉ vào được khi bảng đánh giá phù hợp đã quyết GO / GO có điều kiện. */
export const GATED_STAGES: DealStage[] = ['DISCOVERY', 'PROPOSAL', 'NEGOTIATION', 'WON'];

/** Deal được tạo tay chỉ ở hai giai đoạn đầu — không lách cổng go/no-go bằng cách tạo thẳng ở PROPOSAL. */
export const CREATE_STAGES: DealStage[] = ['LEAD', 'QUALIFIED'];

export const STALE_DAYS = 14;

export const isStage = (s: unknown): s is DealStage => typeof s === 'string' && (DEAL_STAGES as readonly string[]).includes(s);
export const isOpen = (s: string) => (OPEN_STAGES as string[]).includes(s);

/** WON = 100, LOST = 0 bất kể ghi đè; còn lại: ghi đè (0–100) hoặc mặc định của giai đoạn. */
export function effectiveProbability(stage: string, override: number | null | undefined): number {
  if (stage === 'WON') return 100;
  if (stage === 'LOST') return 0;
  if (override !== null && override !== undefined && Number.isFinite(override)) return Math.min(100, Math.max(0, Math.round(override)));
  return isStage(stage) ? STAGE_PROBABILITY[stage] : 0;
}

export function weightedValue(value: number | null | undefined, stage: string, override: number | null | undefined): number {
  if (!value || !Number.isFinite(value)) return 0;
  return Math.round((value * effectiveProbability(stage, override)) / 100 * 100) / 100;
}

export type QualificationDecision = 'GO' | 'GO_CONDITIONAL' | 'NO_GO';

export interface StageChangeContext {
  lostReason?: string | null;
  /** Quyết định của bảng đánh giá phù hợp (null = chưa chấm). */
  decision?: QualificationDecision | null;
  /** Phiếu của deal đã thành dự án CT Work ⇒ deal khoá ở WON. */
  projectCreated?: boolean;
}

export type StageCheck = { ok: true; noop?: boolean } | { ok: false; code: string; message: string };

/**
 * Luật chuyển giai đoạn (kéo thả trên Kanban đi qua đây):
 *  · cùng giai đoạn ⇒ không làm gì;
 *  · sang LOST bắt buộc có lý do thua;
 *  · vào DISCOVERY/PROPOSAL/NEGOTIATION/WON cần bảng đánh giá đã quyết GO (hoặc GO có điều kiện);
 *    NO_GO thì chỉ còn đường LOST;
 *  · deal đã có dự án CT Work thì khoá ở WON (dự án đang chạy, không "mở lại" deal được);
 *  · được nhảy cóc và được lùi (Kanban thật cần thế) — báo cáo phễu tính theo bậc CAO NHẤT đã chạm.
 */
export function checkStageChange(from: string, to: string, ctx: StageChangeContext = {}): StageCheck {
  if (!isStage(to)) return { ok: false, code: 'CRM_BAD_STAGE', message: `Unknown stage: ${to}` };
  if (from === to) return { ok: true, noop: true };
  if (ctx.projectCreated && from === 'WON') {
    return { ok: false, code: 'CRM_DEAL_LOCKED', message: 'This deal already has a CT Work project — it stays WON' };
  }
  if (to === 'LOST' && !(ctx.lostReason && ctx.lostReason.trim())) {
    return { ok: false, code: 'CRM_LOST_REASON_REQUIRED', message: 'A lost reason is required' };
  }
  if (GATED_STAGES.includes(to) && ctx.decision !== 'GO' && ctx.decision !== 'GO_CONDITIONAL') {
    return {
      ok: false,
      code: 'CRM_QUALIFICATION_REQUIRED',
      message: ctx.decision === 'NO_GO'
        ? 'Qualification decided NO-GO — this deal can only be marked LOST'
        : 'Complete the go/no-go qualification checklist (decision GO) before moving past QUALIFIED',
    };
  }
  return { ok: true };
}

// ─── Đồng bộ phiếu yêu cầu ↔ deal ───────────────────────────────

export type RequestStatus = 'NEW' | 'QUALIFYING' | 'ACCEPTED' | 'DECLINED' | 'PROJECT_CREATED';

/**
 * Deal ⇒ phiếu (chiều chính — deal chi tiết hơn phiếu):
 *   LEAD → NEW · QUALIFIED → QUALIFYING · DISCOVERY/PROPOSAL/NEGOTIATION/WON → ACCEPTED · LOST → DECLINED.
 * Phiếu đã PROJECT_CREATED thì KHÔNG đổi nữa (null). Trùng trạng thái hiện tại cũng trả null.
 */
export function requestStatusForStage(stage: string, current: RequestStatus): RequestStatus | null {
  if (current === 'PROJECT_CREATED') return null;
  const map: Record<DealStage, RequestStatus> = {
    LEAD: 'NEW', QUALIFIED: 'QUALIFYING', DISCOVERY: 'ACCEPTED', PROPOSAL: 'ACCEPTED',
    NEGOTIATION: 'ACCEPTED', WON: 'ACCEPTED', LOST: 'DECLINED',
  };
  const next = isStage(stage) ? map[stage] : null;
  return next && next !== current ? next : null;
}

/**
 * Phiếu ⇒ deal (khi admin đổi trạng thái ở /admin/project-requests): CHỈ ĐẨY TỚI, không kéo lùi —
 * phiếu thô hơn deal nên không được xoá công sức trên deal.
 *   QUALIFYING  ⇒ LEAD → QUALIFIED
 *   ACCEPTED    ⇒ LEAD/QUALIFIED → DISCOVERY
 *   DECLINED    ⇒ mọi giai đoạn mở → LOST (lý do mặc định)
 *   PROJECT_CREATED ⇒ mọi giai đoạn trừ WON → WON
 *   NEW         ⇒ không đổi
 * Deal đã LOST/WON chỉ đổi khi phiếu thành PROJECT_CREATED (dự án đã lập là sự thật cuối cùng).
 */
export function stageForRequestStatus(stage: string, status: string): DealStage | null {
  if (status === 'PROJECT_CREATED') return stage === 'WON' ? null : 'WON';
  if (!isOpen(stage)) return null;
  const idx = OPEN_STAGES.indexOf(stage as DealStage);
  if (status === 'QUALIFYING') return idx < 1 ? 'QUALIFIED' : null;
  if (status === 'ACCEPTED') return idx < 2 ? 'DISCOVERY' : null;
  if (status === 'DECLINED') return 'LOST';
  return null;
}

/** `about/nhan-du-an#goi=lms` ⇒ 'lms'. */
export function packageIdFromSource(source: string | null | undefined): string | null {
  const m = /#goi=([a-z0-9-]{1,40})/.exec(source ?? '');
  return m ? m[1] : null;
}

/** Nguồn lead gộp nhóm cho báo cáo: bỏ phần `#goi=…`, rỗng ⇒ "(manual)". */
export function normalizeSource(source: string | null | undefined): string {
  const s = (source ?? '').split('#')[0].trim();
  return s || '(manual)';
}

/**
 * Bản sao id gói của frontend/src/app/about/nhan-du-an/packages.ts — test so khớp hai bên.
 * Loại sản phẩm dùng khi phải tạo phiếu nội bộ cho deal không có phiếu.
 */
export const PACKAGE_PRODUCT_TYPES: Record<string, string[]> = {
  landing: ['WEB'],
  'ban-hang-dat-lich': ['WEB'],
  lms: ['WEB'],
  'quan-ly-noi-bo': ['TOOL'],
  'quan-ly-du-an': ['WEB', 'TOOL'],
  'tro-ly-ai-rag': ['AI'],
  'app-di-dong': ['APP'],
  'app-desktop': ['APP', 'TOOL'],
  'tu-dong-hoa-api': ['TOOL'],
};
export const PACKAGE_IDS = Object.keys(PACKAGE_PRODUCT_TYPES);

// ─── Bảng đánh giá phù hợp (content/quy-trinh/mau/checklist-danh-gia-phu-hop.md) ─

export const QUALIFICATION_CRITERIA: Array<{ n: number; vi: string; en: string; q: string; qEn: string; hard?: boolean }> = [
  { n: 1, vi: 'Nhu cầu (Need)', en: 'Need', q: 'Vấn đề có thật, có người chịu đau, đo được lợi ích?', qEn: 'Is the problem real, owned by someone, with measurable benefit?' },
  { n: 2, vi: 'Ngân sách (Budget)', en: 'Budget', q: 'Khoảng ngân sách khả thi cho phạm vi đã nghe?', qEn: 'Is the budget range feasible for the scope heard?' },
  { n: 3, vi: 'Thẩm quyền (Authority)', en: 'Authority', q: 'Người quyết định đã tham gia hoặc được báo?', qEn: 'Is the decision-maker involved or informed?' },
  { n: 4, vi: 'Thời hạn (Timeline)', en: 'Timeline', q: 'Hạn chót khả thi với nguồn lực hiện có?', qEn: 'Is the deadline feasible with current capacity?' },
  { n: 5, vi: 'Phù hợp kỹ thuật', en: 'Technical fit', q: 'Công nghệ nằm trong năng lực của đội / có người đồng hành?', qEn: 'Is the tech within the team’s capability (or with a partner)?' },
  { n: 6, vi: 'Năng lực & lịch', en: 'Capacity & schedule', q: 'Có người sẵn sàng đúng thời điểm, không xung đột dự án khác?', qEn: 'Are people available at the right time, without conflicts?' },
  { n: 7, vi: 'Rủi ro pháp lý / dữ liệu', en: 'Legal / data risk', q: 'Dữ liệu cá nhân, ngành có quản lý, lưu trữ trong nước đã rõ?', qEn: 'Are personal data, regulated industry and data residency clear?', hard: true },
  { n: 8, vi: 'Xung đột lợi ích', en: 'Conflict of interest', q: 'Không làm cho đối thủ trực tiếp của khách hiện tại?', qEn: 'Not working for a direct competitor of a current client?', hard: true },
  { n: 9, vi: 'Đạo đức & mục đích sử dụng', en: 'Ethics & intended use', q: 'Sản phẩm không phục vụ mục đích trái pháp luật / gây hại?', qEn: 'The product does not serve unlawful or harmful purposes?', hard: true },
  { n: 10, vi: 'Quan hệ lâu dài', en: 'Long-term relationship', q: 'Có khả năng bảo trì / giai đoạn tiếp theo?', qEn: 'Is there potential for maintenance / a next phase?' },
];

export interface QualificationScore {
  total: number;
  max: number;
  answered: number;
  /** Tiêu chí 7, 8 hoặc 9 bị 0 điểm ⇒ từ chối bất kể tổng. */
  hardFail: boolean;
  suggestion: QualificationDecision | null;
}

/** Điểm 0/1/2 mỗi tiêu chí. Thiếu tiêu chí nào thì chưa gợi ý (suggestion null), trừ khi đã dính luật cứng. */
export function scoreQualification(scores: Record<string, number | null | undefined>): QualificationScore {
  let total = 0;
  let answered = 0;
  let hardFail = false;
  for (const c of QUALIFICATION_CRITERIA) {
    const v = scores[String(c.n)];
    if (v === 0 || v === 1 || v === 2) {
      total += v;
      answered++;
      if (c.hard && v === 0) hardFail = true;
    }
  }
  let suggestion: QualificationDecision | null = null;
  if (hardFail) suggestion = 'NO_GO';
  else if (answered === QUALIFICATION_CRITERIA.length) suggestion = total >= 15 ? 'GO' : total >= 10 ? 'GO_CONDITIONAL' : 'NO_GO';
  return { total, max: QUALIFICATION_CRITERIA.length * 2, answered, hardFail, suggestion };
}

/**
 * Quyết định của người chấm có hợp lệ không: dính luật cứng thì chỉ được NO_GO;
 * GO / GO có điều kiện cần chấm đủ 10 tiêu chí; GO có điều kiện phải ghi điều kiện.
 */
export function checkDecision(
  decision: QualificationDecision | null,
  s: QualificationScore,
  conditions?: string | null,
): StageCheck {
  if (decision === null) return { ok: true };
  if (s.hardFail && decision !== 'NO_GO') {
    return { ok: false, code: 'CRM_HARD_FAIL', message: 'Criteria 7, 8 or 9 scored 0 — the decision must be NO-GO' };
  }
  if (decision !== 'NO_GO' && s.answered < QUALIFICATION_CRITERIA.length) {
    return { ok: false, code: 'CRM_CHECKLIST_INCOMPLETE', message: 'Score all 10 criteria before deciding GO' };
  }
  if (decision === 'GO_CONDITIONAL' && !(conditions && conditions.trim())) {
    return { ok: false, code: 'CRM_CONDITIONS_REQUIRED', message: 'Write the conditions for a conditional GO' };
  }
  return { ok: true };
}

// ─── Đề xuất ────────────────────────────────────────────────────

/**
 * Hash nội dung đề xuất — thứ khách "ký" khi bấm Chấp thuận. Phủ cả số phiên bản,
 * tiêu đề và nội dung; chuẩn hoá xuống dòng (CRLF ⇒ LF) để copy qua Windows không đổi hash.
 */
export function proposalHash(p: { dealId: number; version: number; title: string; content: string }): string {
  const canonical = JSON.stringify({ v: 1, dealId: p.dealId, version: p.version, title: p.title.trim(), content: p.content.replace(/\r\n?/g, '\n') });
  return createHash('sha256').update(canonical, 'utf8').digest('hex');
}

/** Bỏ phần hướng dẫn nội bộ của mẫu (khối "> **Mục đích/Ai điền/Khi nào…**", tiêu đề #, dòng chân "*Mẫu tham khảo…*"). */
export function stripTemplateGuidance(md: string): string {
  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  const out: string[] = [];
  let droppedTitle = false;
  let beforeFirstSection = true;
  for (const line of lines) {
    if (!droppedTitle && /^#\s/.test(line)) { droppedTitle = true; continue; }
    if (/^##\s/.test(line)) beforeFirstSection = false;
    // Khối trích dẫn đầu mẫu = hướng dẫn nội bộ (Mục đích / Ai điền / cảnh báo rà soát) — không gửi khách.
    if (beforeFirstSection && /^>/.test(line)) continue;
    if (/^\*Mẫu tham khảo/.test(line.trim())) continue;
    out.push(line);
  }
  return out.join('\n').replace(/^\s*(---\s*\n)?/, '').replace(/\n{3,}/g, '\n\n').trim();
}

export interface ProposalContext {
  dealTitle: string;
  orgName?: string | null;
  requestCode?: string | null;
  version: number;
  date: string;
}

/** Bản nháp đầu: đề xuất giải pháp + báo giá, đã điền phần đầu (khách, mã phiếu, phiên bản, ngày). */
export function composeProposalMarkdown(proposalTpl: string, quoteTpl: string, ctx: ProposalContext): string {
  const head = [
    `# ${ctx.dealTitle}`,
    '',
    `| Mã phiếu | Khách hàng | Phiên bản đề xuất | Ngày |`,
    `|---|---|---|---|`,
    `| ${ctx.requestCode ?? '—'} | ${ctx.orgName ?? '—'} | v${ctx.version} | ${ctx.date} |`,
  ].join('\n');
  // Bảng "0. Thông tin" của mẫu đề xuất trùng với phần đầu đã điền ở trên ⇒ bỏ (của báo giá giữ: có bảng hai bên).
  const dropInfo = (md: string) => md.replace(/^## 0\. Thông tin[\s\S]*?(?=^## )/m, '').trim();
  const body = dropInfo(stripTemplateGuidance(proposalTpl));
  const quote = stripTemplateGuidance(quoteTpl);
  return `${head}\n\n${body}\n\n---\n\n# Báo giá\n\n${quote}\n`;
}

export const PROPOSAL_TTL_DAYS_DEFAULT = 30;
export const PROPOSAL_TTL_DAYS_MAX = 90;

export type ProposalLinkState = 'OK' | 'EXPIRED' | 'REVOKED' | 'NOT_SENT';
export function proposalLinkState(p: { status: string; tokenExpiresAt: Date | null; tokenRevokedAt: Date | null }, now = new Date()): ProposalLinkState {
  if (p.status === 'DRAFT') return 'NOT_SENT';
  if (p.tokenRevokedAt) return 'REVOKED';
  if (p.status === 'SENT' && p.tokenExpiresAt && p.tokenExpiresAt.getTime() <= now.getTime()) return 'EXPIRED';
  return 'OK';
}

// ─── Stale + nhắc việc ──────────────────────────────────────────

/** Deal MỞ không có hoạt động quá `days` ngày ⇒ stale. Deal đã đóng không bao giờ stale. */
export function isStale(stage: string, lastActivityAt: Date, now = new Date(), days = STALE_DAYS): boolean {
  if (!isOpen(stage)) return false;
  return now.getTime() - lastActivityAt.getTime() > days * 86_400_000;
}

// ─── Tổng cột Kanban + báo cáo ──────────────────────────────────

export interface DealNumbers {
  id: number;
  stage: string;
  value: number | null;
  currency: string;
  probability: number | null;
  source: string | null;
  packageId?: string | null;
  createdAt: Date;
  wonAt: Date | null;
  lostAt: Date | null;
  expectedCloseAt: Date | null;
  /** Mọi giai đoạn deal từng ở (kể cả giai đoạn lúc tạo), theo thứ tự thời gian. */
  stagesVisited: string[];
}

export type MoneyByCurrency = Record<string, number>;
const addMoney = (m: MoneyByCurrency, cur: string, v: number) => { m[cur] = Math.round(((m[cur] ?? 0) + v) * 100) / 100; };

/** Tổng giá trị + giá trị có trọng số từng cột, TÁCH THEO TIỀN TỆ (không tự quy đổi). */
export function columnTotals(deals: Array<Pick<DealNumbers, 'stage' | 'value' | 'currency' | 'probability'>>) {
  const out: Record<string, { count: number; total: MoneyByCurrency; weighted: MoneyByCurrency }> = {};
  for (const s of DEAL_STAGES) out[s] = { count: 0, total: {}, weighted: {} };
  for (const d of deals) {
    const col = out[d.stage];
    if (!col) continue;
    col.count++;
    if (d.value) {
      addMoney(col.total, d.currency, d.value);
      addMoney(col.weighted, d.currency, weightedValue(d.value, d.stage, d.probability));
    }
  }
  return out;
}

/** Bậc phễu cao nhất deal đã chạm (WON = chạm hết). -1 nếu không xác định. */
export function maxFunnelIndex(stagesVisited: string[]): number {
  let max = -1;
  for (const s of stagesVisited) {
    const i = FUNNEL.indexOf(s as DealStage);
    if (i > max) max = i;
  }
  return max;
}

export interface CrmReport {
  funnel: Array<{ stage: DealStage; reached: number; conversionToNext: number | null }>;
  won: number;
  lost: number;
  open: number;
  /** won / (won + lost), null khi chưa đóng deal nào. */
  winRate: number | null;
  /** Trung bình ngày từ lúc tạo tới WON. */
  avgCycleDays: number | null;
  sources: Array<{ source: string; deals: number; won: number; lost: number; winRate: number | null; wonValue: MoneyByCurrency }>;
  packages: Array<{ packageId: string; deals: number; won: number }>;
  /** Dự báo theo tháng dự kiến chốt: Σ giá trị × xác suất, deal MỞ. */
  forecast: Array<{ month: string; deals: number; total: MoneyByCurrency; weighted: MoneyByCurrency }>;
  /** Deal mở chưa có ngày dự kiến chốt — không vào dự báo tháng nào. */
  unscheduled: { deals: number; weighted: MoneyByCurrency };
}

const ratio = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 1000) / 1000 : null);

/** `expectedCloseAt` là cột DATE (nửa đêm UTC) ⇒ lấy năm-tháng theo UTC. */
export const monthKey = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;

export function buildReport(deals: DealNumbers[]): CrmReport {
  const idx = deals.map((d) => (d.stage === 'WON' ? FUNNEL.length - 1 : maxFunnelIndex([...d.stagesVisited, d.stage])));
  const funnel = FUNNEL.map((stage, i) => ({ stage, reached: idx.filter((x) => x >= i).length, conversionToNext: null as number | null }));
  for (let i = 0; i < funnel.length - 1; i++) funnel[i].conversionToNext = ratio(funnel[i + 1].reached, funnel[i].reached);

  const wonDeals = deals.filter((d) => d.stage === 'WON');
  const lostDeals = deals.filter((d) => d.stage === 'LOST');
  const cycles = wonDeals.filter((d) => d.wonAt).map((d) => (d.wonAt!.getTime() - d.createdAt.getTime()) / 86_400_000);
  const avgCycleDays = cycles.length ? Math.round((cycles.reduce((a, b) => a + b, 0) / cycles.length) * 10) / 10 : null;

  const bySource = new Map<string, { deals: number; won: number; lost: number; wonValue: MoneyByCurrency }>();
  const byPackage = new Map<string, { deals: number; won: number }>();
  for (const d of deals) {
    const k = normalizeSource(d.source);
    const row = bySource.get(k) ?? { deals: 0, won: 0, lost: 0, wonValue: {} };
    row.deals++;
    if (d.stage === 'WON') { row.won++; if (d.value) addMoney(row.wonValue, d.currency, d.value); }
    if (d.stage === 'LOST') row.lost++;
    bySource.set(k, row);
    const pk = d.packageId ?? packageIdFromSource(d.source);
    if (pk) {
      const pr = byPackage.get(pk) ?? { deals: 0, won: 0 };
      pr.deals++;
      if (d.stage === 'WON') pr.won++;
      byPackage.set(pk, pr);
    }
  }
  const sources = [...bySource.entries()]
    .map(([source, r]) => ({ source, ...r, winRate: ratio(r.won, r.won + r.lost) }))
    .sort((a, b) => b.won - a.won || b.deals - a.deals || a.source.localeCompare(b.source));
  const packages = [...byPackage.entries()].map(([packageId, r]) => ({ packageId, ...r })).sort((a, b) => b.deals - a.deals);

  const byMonth = new Map<string, { deals: number; total: MoneyByCurrency; weighted: MoneyByCurrency }>();
  const unscheduled = { deals: 0, weighted: {} as MoneyByCurrency };
  for (const d of deals.filter((x) => isOpen(x.stage))) {
    const w = weightedValue(d.value, d.stage, d.probability);
    if (!d.expectedCloseAt) {
      unscheduled.deals++;
      if (d.value) addMoney(unscheduled.weighted, d.currency, w);
      continue;
    }
    const k = monthKey(d.expectedCloseAt);
    const row = byMonth.get(k) ?? { deals: 0, total: {}, weighted: {} };
    row.deals++;
    if (d.value) { addMoney(row.total, d.currency, d.value); addMoney(row.weighted, d.currency, w); }
    byMonth.set(k, row);
  }
  const forecast = [...byMonth.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([month, r]) => ({ month, ...r }));

  return {
    funnel,
    won: wonDeals.length,
    lost: lostDeals.length,
    open: deals.filter((d) => isOpen(d.stage)).length,
    winRate: ratio(wonDeals.length, wonDeals.length + lostDeals.length),
    avgCycleDays,
    sources,
    packages,
    forecast,
    unscheduled,
  };
}

// ─── Dữ liệu cá nhân ────────────────────────────────────────────

export const CHANNELS = ['EMAIL', 'PHONE', 'ZALO', 'MEETING', 'OTHER'] as const;
export const ACTIVITY_TYPES = ['CALL', 'EMAIL', 'MEETING', 'NOTE', 'TASK'] as const;
export const PROPOSAL_STATUSES = ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED'] as const;
export const ANONYMIZED_NAME = '[Đã ẩn danh]';
