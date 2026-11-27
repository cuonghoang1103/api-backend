/**
 * CT Work — dm5 G1 (27/11/2026): "Cổng quy trình & nhịp vận hành" — PHẦN THUẦN (không chạm DB, test bằng bảng ở
 * dm5Rules.test.ts). Phần đọc DB + chặn trong cửa ghi chung ở `dm5a.service.ts`.
 *
 * Khoá settings dự án do gói này sở hữu (mọi khoá THIẾU = tắt ⇒ dự án cũ không đổi hành vi):
 *   readyRequirements   { fieldIds, typeKeys|null, toStatusIds|null, requireMockupApproved }   — A14 Definition of Ready
 *   doneRequirements    (+ requireCiGreen, requirePr)                                          — A2 Done khi CI đỏ
 *   wipGuards           [{ whenColumn, blocksColumn, limit|null }]                              — A4 WIP chéo cột
 *   capacity            { focusFactor 0.1–1, cautionPct, warnPct }                              — A15 sức chứa × tập trung
 *   ragRules            { schedule|scope|quality|effort: { amber, red } }                       — A19 RAG dự án
 *   moscowCapPct        1–100 (null ⇒ 60 khi đọc; 0 ⇒ tắt)                                       — A22 trần Must
 *   stageGateBlocksWork true                                                                    — A23 stage chưa mở ⇒ không làm
 *   retroActionCap      0–10 (0/null ⇒ tắt)                                                     — A12 trần hành động retro
 */

// ─── Chuẩn hoá settings ──────────────────────────────────────────

const ints = (raw: unknown, max = 50): number[] =>
  Array.isArray(raw) ? [...new Set(raw.filter((x): x is number => Number.isInteger(x) && (x as number) > 0))].slice(0, max) : [];
const strs = (raw: unknown, max = 20, len = 40): string[] =>
  Array.isArray(raw) ? [...new Set(raw.filter((x): x is string => typeof x === 'string' && !!x.trim()).map((x) => x.trim().slice(0, len)))].slice(0, max) : [];
const num = (raw: unknown): number | null => (typeof raw === 'number' && Number.isFinite(raw) ? raw : null);
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** A14 — Definition of Ready. */
export interface ReadyRequirements {
  fieldIds: number[];
  /** Loại thẻ áp luật; null = mọi loại (trường vẫn lọc theo typeKeys của chính trường). */
  typeKeys: string[] | null;
  /** Trạng thái đích bị chặn; null = mọi trạng thái nhóm IN_PROGRESS (kéo từ nhóm TODO). */
  toStatusIds: number[] | null;
  /** Màn hình SRS gắn với thẻ phải có prototype đã APPROVED. */
  requireMockupApproved: boolean;
}

export function cleanReadyRequirements(raw: unknown): ReadyRequirements | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const fieldIds = ints(r.fieldIds);
  const typeKeys = strs(r.typeKeys);
  const toStatusIds = ints(r.toStatusIds);
  const requireMockupApproved = r.requireMockupApproved === true;
  if (!fieldIds.length && !requireMockupApproved) return null;
  return { fieldIds, typeKeys: typeKeys.length ? typeKeys : null, toStatusIds: toStatusIds.length ? toStatusIds : null, requireMockupApproved };
}

/** A2 — hai cờ CI gộp vào doneRequirements (fieldIds có thể rỗng). */
export interface DoneCiFlags { requireCiGreen: boolean; requirePr: boolean }
export function doneCiFlagsOf(settings: unknown): DoneCiFlags {
  const d = (settings as { doneRequirements?: Record<string, unknown> | null } | null)?.doneRequirements;
  return { requireCiGreen: d?.requireCiGreen === true, requirePr: d?.requireCiGreen === true && d?.requirePr === true };
}

/** A4 — "cột A đầy ⇒ không kéo thêm vào cột B". Cột gọi theo TÊN (không phân biệt hoa thường). */
export interface WipGuard { whenColumn: string; blocksColumn: string; limit: number | null }

export function cleanWipGuards(raw: unknown): WipGuard[] | null {
  if (!Array.isArray(raw)) return null;
  const out: WipGuard[] = [];
  for (const g of raw.slice(0, 10)) {
    if (!g || typeof g !== 'object') continue;
    const x = g as Record<string, unknown>;
    const when = typeof x.whenColumn === 'string' ? x.whenColumn.trim().slice(0, 40) : '';
    const blocks = typeof x.blocksColumn === 'string' ? x.blocksColumn.trim().slice(0, 40) : '';
    if (!when || !blocks || when.toLowerCase() === blocks.toLowerCase()) continue;
    const lim = num(x.limit);
    out.push({ whenColumn: when, blocksColumn: blocks, limit: lim !== null && lim >= 1 ? Math.min(500, Math.round(lim)) : null });
  }
  return out.length ? out : null;
}

export function wipGuardsOf(settings: unknown): WipGuard[] {
  return cleanWipGuards((settings as { wipGuards?: unknown } | null)?.wipGuards) ?? [];
}

/** A15 — hệ số tập trung + hai ngưỡng (cam ≥ cautionPct, đỏ > warnPct). */
export interface CapacitySettings { focusFactor: number; cautionPct: number; warnPct: number }
export const CAPACITY_DEFAULTS: CapacitySettings = { focusFactor: 0.7, cautionPct: 75, warnPct: 85 };

export function cleanCapacity(raw: unknown): CapacitySettings | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const f = num(r.focusFactor);
  const warn = num(r.warnPct);
  const caution = num(r.cautionPct);
  const focusFactor = f === null ? CAPACITY_DEFAULTS.focusFactor : Math.round(clamp(f, 0.1, 1) * 100) / 100;
  const warnPct = warn === null ? CAPACITY_DEFAULTS.warnPct : Math.round(clamp(warn, 10, 200));
  const cautionPct = Math.min(warnPct, caution === null ? Math.min(CAPACITY_DEFAULTS.cautionPct, warnPct) : Math.round(clamp(caution, 10, 200)));
  return { focusFactor, cautionPct, warnPct };
}

export function capacityOf(settings: unknown): CapacitySettings {
  return cleanCapacity((settings as { capacity?: unknown } | null)?.capacity) ?? CAPACITY_DEFAULTS;
}

export type Level = 'GREEN' | 'AMBER' | 'RED';

/** Ước lượng (giờ) so với sức chứa × tập trung. capacityHours null/0 ⇒ không kết luận được. */
export function capacityVerdict(input: { estimateHours: number; capacityHours: number | null; settings: CapacitySettings }) {
  const { estimateHours, capacityHours, settings } = input;
  const focusedHours = capacityHours ? Math.round(capacityHours * settings.focusFactor * 10) / 10 : null;
  const pct = focusedHours ? Math.round((estimateHours / focusedHours) * 1000) / 10 : null;
  const level: Level | null = pct === null ? null : pct > settings.warnPct ? 'RED' : pct >= settings.cautionPct ? 'AMBER' : 'GREEN';
  return { estimateHours: Math.round(estimateHours * 10) / 10, capacityHours, focusFactor: settings.focusFactor, focusedHours, pct, cautionPct: settings.cautionPct, warnPct: settings.warnPct, level, over: level === 'RED' };
}

/** A19 — ngưỡng RAG 4 chiều. Giá trị ≥ amber ⇒ AMBER, ≥ red ⇒ RED. */
export const RAG_DIMENSIONS = ['schedule', 'scope', 'quality', 'effort'] as const;
export type RagDimension = (typeof RAG_DIMENSIONS)[number];
export type RagRules = Record<RagDimension, { amber: number; red: number }>;
export const RAG_DEFAULTS: RagRules = {
  /** % thẻ mở có hạn mà đã trễ hạn. */
  schedule: { amber: 10, red: 25 },
  /** % điểm thêm vào sprint đang chạy SAU khi Start, so với cam kết. */
  scope: { amber: 10, red: 20 },
  /** Số Bug đang mở (ưu tiên cao đếm gấp đôi). */
  quality: { amber: 3, red: 6 },
  /** % giờ đã log vượt ước lượng gốc trên thẻ có ước lượng. */
  effort: { amber: 15, red: 30 },
};

export function cleanRagRules(raw: unknown): RagRules | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const out = structuredClone(RAG_DEFAULTS);
  let any = false;
  for (const d of RAG_DIMENSIONS) {
    const v = r[d] as Record<string, unknown> | undefined;
    if (!v || typeof v !== 'object') continue;
    const amber = num(v.amber), red = num(v.red);
    if (amber !== null) { out[d].amber = clamp(amber, 0, 10_000); any = true; }
    if (red !== null) { out[d].red = clamp(red, 0, 10_000); any = true; }
    if (out[d].red < out[d].amber) out[d].red = out[d].amber;
  }
  return any ? out : null;
}

export function ragRulesOf(settings: unknown): RagRules {
  return cleanRagRules((settings as { ragRules?: unknown } | null)?.ragRules) ?? RAG_DEFAULTS;
}

export function ragLevel(value: number | null, t: { amber: number; red: number }): Level {
  if (value === null || !Number.isFinite(value)) return 'GREEN';
  return value >= t.red ? 'RED' : value >= t.amber ? 'AMBER' : 'GREEN';
}

const RANK: Record<Level, number> = { GREEN: 0, AMBER: 1, RED: 2 };
/** RAG tổng = chiều TỆ NHẤT. */
export function worstLevel(levels: Level[]): Level {
  return levels.reduce<Level>((w, l) => (RANK[l] > RANK[w] ? l : w), 'GREEN');
}

/** A22 — trần % effort của Must. null/không đặt ⇒ 60; 0 ⇒ tắt. */
export function moscowCapOf(settings: unknown): number | null {
  const v = (settings as { moscowCapPct?: unknown } | null)?.moscowCapPct;
  if (v === 0) return null;
  return typeof v === 'number' && Number.isFinite(v) ? clamp(Math.round(v), 1, 100) : 60;
}

export function cleanMoscowCap(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null;
  const n = num(raw);
  if (n === null) return null;
  return n <= 0 ? 0 : clamp(Math.round(n), 1, 100);
}

/** A12 — trần hành động mỗi retro. 0/null ⇒ tắt. */
export function retroActionCapOf(settings: unknown): number | null {
  const v = (settings as { retroActionCap?: unknown } | null)?.retroActionCap;
  return typeof v === 'number' && Number.isInteger(v) && v > 0 ? Math.min(10, v) : null;
}
export function cleanRetroActionCap(raw: unknown): number | null {
  const n = num(raw);
  return n === null || n <= 0 ? null : Math.min(10, Math.round(n));
}

// ─── A19: % hoàn thành có trọng số theo bậc trạng thái ───────────

export interface WeightStatus { id: number; name: string; category: string; position: number; workflowId: number }

const REVIEW_RE = /review|qa|test|verify|retest|fixed|kiểm|duyệt|uat/i;

/**
 * Bậc của một trạng thái: TODO đầu quy trình 0 · TODO sau (Selected/Ready) 20 · IN_PROGRESS 50 ·
 * IN_PROGRESS kiểu review/QA (hoặc cột IN_PROGRESS cuối khi có ≥ 2) 75 · DONE 100.
 */
export function statusWeights(statuses: WeightStatus[]): Map<number, number> {
  const out = new Map<number, number>();
  const byWf = new Map<number, WeightStatus[]>();
  for (const s of statuses) byWf.set(s.workflowId, [...(byWf.get(s.workflowId) ?? []), s]);
  for (const list of byWf.values()) {
    const sorted = [...list].sort((a, b) => a.position - b.position);
    const todo = sorted.filter((s) => s.category === 'TODO');
    const prog = sorted.filter((s) => s.category === 'IN_PROGRESS');
    for (const s of sorted) {
      if (s.category === 'DONE') out.set(s.id, 100);
      else if (s.category === 'TODO') out.set(s.id, s.id === todo[0]?.id || /reopen/i.test(s.name) ? 0 : 20);
      else {
        const review = REVIEW_RE.test(s.name) || (prog.length >= 2 && s.id === prog[prog.length - 1].id);
        out.set(s.id, review ? 75 : 50);
      }
    }
  }
  return out;
}

/** % hoàn thành = Σ(bậc × trọng số thẻ) / Σ(100 × trọng số thẻ). Trọng số = điểm/giờ ước lượng, thiếu ⇒ 1. */
export function weightedCompletion(issues: Array<{ statusId: number; weight: number }>, weights: Map<number, number>): number | null {
  let num = 0, den = 0;
  for (const i of issues) {
    const w = i.weight > 0 ? i.weight : 1;
    num += (weights.get(i.statusId) ?? 0) * w;
    den += 100 * w;
  }
  return den ? Math.round((num / den) * 1000) / 10 : null;
}

// ─── A18: cảnh báo sớm ───────────────────────────────────────────

/**
 * Số ngày CUỐI liên tiếp burndown không giảm (remaining không nhỏ hơn ngày trước). Ngày điểm: YYYY-MM-DD đã sắp xếp.
 * [10, 8, 8, 8, 8] ⇒ 3 (ba ngày sau cùng đi ngang).
 */
export function flatTailDays(points: Array<{ day: string; remaining: number }>): number {
  const p = [...points].sort((a, b) => a.day.localeCompare(b.day));
  let n = 0;
  for (let i = p.length - 1; i > 0; i--) {
    if (p[i].remaining >= p[i - 1].remaining) n += 1;
    else break;
  }
  return n;
}

/** Ngày nguyên giữa hai mốc (làm tròn xuống, tối thiểu 0). */
export function daysBetween(from: Date, to: Date): number {
  return Math.max(0, Math.floor((to.getTime() - from.getTime()) / 86_400_000));
}

// ─── A22: tỉ lệ Must ─────────────────────────────────────────────

const MOSCOW_KEY: Record<string, 'must' | 'should' | 'could' | 'wont'> = {
  must: 'must', 'must have': 'must', m: 'must',
  should: 'should', 'should have': 'should', s: 'should',
  could: 'could', 'could have': 'could', c: 'could',
  wont: 'wont', "won't": 'wont', 'won’t': 'wont', 'will not': 'wont', w: 'wont',
};
export function moscowKeyOf(v: unknown, options?: Array<{ id: string; label: string }>): 'must' | 'should' | 'could' | 'wont' | null {
  if (typeof v !== 'string' || !v.trim()) return null;
  const s = v.trim().toLowerCase();
  if (MOSCOW_KEY[s]) return MOSCOW_KEY[s];
  const opt = options?.find((o) => o.id === v);
  return opt ? MOSCOW_KEY[opt.label.trim().toLowerCase()] ?? null : null;
}

/** % effort của Must trên tổng effort đã xếp loại MoSCoW (Won't không tính vào mẫu số — nó không nằm trong phạm vi). */
export function moscowShare(rows: Array<{ key: 'must' | 'should' | 'could' | 'wont' | null; effort: number }>) {
  const sum = { must: 0, should: 0, could: 0, wont: 0, unclassified: 0 };
  for (const r of rows) {
    const e = r.effort > 0 ? r.effort : 1;
    if (r.key) sum[r.key] += e; else sum.unclassified += e;
  }
  const scope = sum.must + sum.should + sum.could;
  const mustPct = scope ? Math.round((sum.must / scope) * 1000) / 10 : null;
  return { ...Object.fromEntries(Object.entries(sum).map(([k, v]) => [k, Math.round(v * 10) / 10])) as typeof sum, mustPct };
}

// ─── A12: số liệu retro ──────────────────────────────────────────

/** Tỉ lệ % làm tròn 1 chữ số; mẫu 0 ⇒ null. */
export function pct(n: number, d: number): number | null {
  return d > 0 ? Math.round((n / d) * 1000) / 10 : null;
}
