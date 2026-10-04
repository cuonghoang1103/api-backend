/**
 * CT Work — LỚP STUDIO (đợt S1, 04/10/2026): loại dự án + mô-đun bật/tắt.
 *
 * File này THUẦN (không chạm DB) để test được bằng bảng — studio.test.ts.
 *
 * Luật giữ dự án cũ y nguyên:
 *   - Mô-đun đọc từ `settings.modules` (JSON). Dự án tạo trước đợt này KHÔNG có
 *     khoá đó ⇒ mọi mô-đun TẮT ⇒ không route studio nào chạy, không trường mới
 *     nào ghi được, không luật nào chặn thêm.
 *   - `kind` NULL (dự án cũ) ⇒ SUY RA từ mẫu lúc đọc, không ghi ngược DB, và
 *     KHÔNG kéo theo mô-đun (mô-đun chỉ theo settings.modules).
 *   - Dự án mới: tạo KÈM `kind` ⇒ mô-đun mặc định theo loại (CLIENT bật 4 mô-đun
 *     đợt S1 + `docs` từ đợt S2a). Tạo KHÔNG kèm `kind` (client cũ) ⇒ mô-đun tắt hết như trước.
 */

import crypto from 'node:crypto';
import { AppError } from '../../middleware/errorHandler.js';
import {
  PROJECT_KINDS, STUDIO_MODULES, STUDIO_MODULES_S1, STUDIO_MODULES_S2A,
  type ProjectKind, type StudioModule,
} from './constants.js';

export type ModuleMap = Record<StudioModule, boolean>;

/** Mẫu (template) ⇒ loại, cho dự án cũ chưa có cột kind. */
export function kindFromTemplate(template: string | null | undefined): ProjectKind {
  switch (template) {
    case 'SWR302':
    case 'SWT301':
    case 'SWP391':
      return 'SCHOOL';
    case 'FREELANCE':
      return 'CLIENT';
    case 'BLANK':
    case 'COMPANY':
    default:
      return 'SOFTWARE';
  }
}

/** Loại hiệu lực: cột kind nếu hợp lệ; dự án sinh từ phiếu khách ⇒ CLIENT; còn lại theo mẫu. */
export function projectKindOf(p: { kind?: string | null; template?: string | null; fromClientRequest?: boolean }): ProjectKind {
  if (p.kind && (PROJECT_KINDS as readonly string[]).includes(p.kind)) return p.kind as ProjectKind;
  if (p.fromClientRequest) return 'CLIENT';
  return kindFromTemplate(p.template);
}

export function noModules(): ModuleMap {
  return Object.fromEntries(STUDIO_MODULES.map((m) => [m, false])) as ModuleMap;
}

/**
 * Mô-đun mặc định khi TẠO dự án mới theo loại. Khoá đợt sau luôn tắt tới khi có tính năng.
 * CLIENT: 4 mô-đun S1 + tài liệu (S2a). Dự án tạo TRƯỚC S2a giữ nguyên settings.modules
 * của nó (docs không có/false ⇒ tắt) — không ai ghi ngược.
 */
export function defaultModulesFor(kind: ProjectKind): ModuleMap {
  const m = noModules();
  if (kind === 'CLIENT') for (const k of [...STUDIO_MODULES_S1, ...STUDIO_MODULES_S2A]) m[k] = true;
  return m;
}

/** Đọc settings.modules — thiếu/sai kiểu ⇒ TẮT (an toàn cho dự án cũ). */
export function modulesOf(settings: unknown): ModuleMap {
  const raw = (settings && typeof settings === 'object' ? (settings as Record<string, unknown>).modules : null) as Record<string, unknown> | null | undefined;
  const m = noModules();
  if (raw && typeof raw === 'object') for (const k of STUDIO_MODULES) m[k] = raw[k] === true;
  return m;
}

/** Hàm chung: mô-đun `key` có bật ở dự án này không. Nhận settings JSON hoặc ModuleMap đã đọc. */
export function moduleOn(project: { settings?: unknown; modules?: ModuleMap }, key: StudioModule): boolean {
  return (project.modules ?? modulesOf(project.settings))[key] === true;
}

/** Ném 403 MODULE_DISABLED (rõ ràng, có tên mô-đun) khi mô-đun đang tắt. */
export function assertModule(project: { settings?: unknown; modules?: ModuleMap }, key: StudioModule): void {
  if (!moduleOn(project, key)) {
    throw new AppError(
      `The "${key}" module is turned off for this project. A project admin can turn it on in Project settings → Modules.`,
      403, 'MODULE_DISABLED', { module: key },
    );
  }
}

/** Gộp thay đổi bật/tắt vào bản hiện có (khoá lạ bị bỏ qua). */
export function mergeModules(current: ModuleMap, patch: Partial<Record<string, unknown>>): ModuleMap {
  const next = { ...current };
  for (const k of STUDIO_MODULES) if (typeof patch[k] === 'boolean') next[k] = patch[k] as boolean;
  return next;
}

// ─── Phê duyệt: kết quả từ các bước ──────────────────────────────

export interface StepState { decision: string }

/**
 * Trạng thái yêu cầu suy từ các bước: có người TỪ CHỐI ⇒ REJECTED (cả hai chế
 * độ — một phiếu chống là đủ dừng); mọi bước DUYỆT ⇒ APPROVED; còn lại PENDING.
 */
export function approvalOutcome(steps: StepState[]): 'PENDING' | 'APPROVED' | 'REJECTED' {
  if (steps.some((s) => s.decision === 'REJECTED')) return 'REJECTED';
  if (steps.length && steps.every((s) => s.decision === 'APPROVED')) return 'APPROVED';
  return 'PENDING';
}

// ─── Chữ ký nội dung ─────────────────────────────────────────────

/** JSON ổn định: khoá object xếp theo chữ cái ⇒ cùng nội dung ra cùng chuỗi. */
export function stableStringify(v: unknown): string {
  if (v === undefined) return 'null';
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (v instanceof Date) return JSON.stringify(v.toISOString());
  if (Array.isArray(v)) return `[${v.map(stableStringify).join(',')}]`;
  const o = v as Record<string, unknown>;
  return `{${Object.keys(o).sort().filter((k) => o[k] !== undefined).map((k) => `${JSON.stringify(k)}:${stableStringify(o[k])}`).join(',')}}`;
}

/** SHA-256 (hex) của nội dung được duyệt — "chữ ký" của một quyết định. */
export function contentHash(v: unknown): string {
  return crypto.createHash('sha256').update(stableStringify(v)).digest('hex');
}

// ─── Giai đoạn ───────────────────────────────────────────────────

export interface StageLite { id: number; n: number; status: string; name?: string }

/**
 * Kích hoạt giai đoạn `target` có hợp lệ không: mọi giai đoạn ĐỨNG TRƯỚC (n nhỏ
 * hơn) phải DONE. Trả giai đoạn đầu tiên đang chặn (để báo lỗi gọi đúng tên).
 */
export function stageActivationBlocker(stages: StageLite[], targetId: number): StageLite | null {
  const target = stages.find((s) => s.id === targetId);
  if (!target) return null;
  return stages.filter((s) => s.n < target.n && s.status !== 'DONE').sort((a, b) => a.n - b.n)[0] ?? null;
}

// ─── Luật của luồng chuyển (WorkTransition.rules) ────────────────

export interface TransitionRules { requireApproval?: boolean; teamIds?: number[] }

/** Chuẩn hoá rules từ JSON lưu trong DB (sai kiểu ⇒ bỏ). */
export function transitionRulesOf(raw: unknown): TransitionRules {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const out: TransitionRules = {};
  if (r.requireApproval === true) out.requireApproval = true;
  if (Array.isArray(r.teamIds)) {
    const ids = [...new Set(r.teamIds.filter((x): x is number => Number.isInteger(x) && x > 0))];
    if (ids.length) out.teamIds = ids;
  }
  return out;
}

export function hasRules(r: TransitionRules): boolean {
  return r.requireApproval === true || !!r.teamIds?.length;
}
