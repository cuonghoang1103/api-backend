/**
 * CT Work — đợt S5c (05/10/2026): "BẬT MÔ-ĐUN MỚI" cho dự án tạo trước khi mô-đun có tính năng thật.
 *
 * Bối cảnh: mô-đun đọc từ `settings.modules`; dự án cũ không có khoá ⇒ TẮT (S1 giữ dự án cũ y nguyên).
 * Đợt S5c cho ADMIN dự án một nút "Enable all recommended for this project type": áp MẶC ĐỊNH THEO LOẠI
 * (`defaultModulesFor(kind)`) cho các khoá CHƯA ĐƯỢC QUYẾT, KHÔNG đổi khoá đã quyết. Dự án cũ y nguyên cho
 * tới khi có người bấm (test `work.s5c.db.test.ts`).
 *
 * "Chưa được quyết" (`undecidedModules`) — hàm THUẦN, test bằng bảng ở `s5c.test.ts`:
 *   1. khoá KHÔNG có trong settings.modules (dự án trước S1, hoặc khoá ra đời sau khi dự án được tạo:
 *      `reports`, `serviceDesk` không có trong bản đồ của dự án tạo ở S1); HOẶC
 *   2. khoá = false nhưng chỉ là CHỖ GIỮ: dự án tạo TRƯỚC ngày mô-đun có tính năng (`MODULE_SINCE`) — ở S1,
 *      `noModules()` ghi sẵn docs/clientPortal/… = false khi chúng chưa làm được gì — VÀ chưa ai bật/tắt khoá
 *      đó bằng tay (không dòng audit `project.studio` nào nhắc "<khoá> on|off").
 *   Khoá = true, khoá ai đó đã bật/tắt, khoá false của dự án tạo SAU ngày mô-đun ra đời (người tạo đã thấy và
 *   bỏ chọn trong hộp tạo dự án) ⇒ ĐÃ QUYẾT, không đụng.
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { auditProject } from './audit.js';
import { STUDIO_MODULES, type ProjectKind, type StudioModule } from './constants.js';
import { emitWorkEvent, evictFromProject } from './events.js';
import { requireProject } from './permissions.js';
import { defaultModulesFor, modulesOf, type ModuleMap } from './studio.js';

/**
 * Thời điểm mô-đun có TÍNH NĂNG THẬT (giờ VN, theo migration của đợt). Trước mốc này một giá trị `false`
 * trong settings.modules chỉ có thể là chỗ giữ do `noModules()` ghi — không phải lựa chọn của ai.
 */
export const MODULE_SINCE: Record<StudioModule, string> = {
  teams: '2026-10-04T10:00:00+07:00',
  stages: '2026-10-04T10:00:00+07:00',
  approvals: '2026-10-04T10:00:00+07:00',
  handoffs: '2026-10-04T10:00:00+07:00',
  docs: '2026-10-04T16:00:00+07:00',
  clientPortal: '2026-10-04T18:00:00+07:00',
  changeRequests: '2026-10-04T20:00:00+07:00',
  raid: '2026-10-04T20:00:00+07:00',
  meetings: '2026-10-04T20:00:00+07:00',
  finance: '2026-10-04T22:00:00+07:00',
  reports: '2026-10-04T22:00:00+07:00',
  serviceDesk: '2026-10-04T23:00:00+07:00',
  resources: '2026-10-06T18:00:00+07:00',
};

/** Mô tả ngắn (tiếng Anh, hiện ở UI + trả qua API) — khớp S1_MODULES của frontend. */
export const MODULE_INFO: Record<StudioModule, { label: string; body: string }> = {
  teams: { label: 'Teams', body: 'Departments with leads and a shared queue; issues can belong to a team.' },
  stages: { label: 'Stages & gates', body: 'Project phases that open in order and close only through a gate review.' },
  approvals: { label: 'Approvals', body: 'Signed sign-offs on issues, stage gates, documents and change requests.' },
  handoffs: { label: 'Handoffs', body: 'Pass work between departments with a checklist that must be ticked.' },
  docs: { label: 'Docs', body: 'Confluence-style project documents: page tree, versions, templates, comments and approvals.' },
  clientPortal: { label: 'Client portal', body: 'Clients see only what you share: requests, approvals, documents, deliverables and UAT sign-off.' },
  changeRequests: { label: 'Change requests', body: 'Impact analysis (scope, days, cost) and a signed decision before work changes.' },
  raid: { label: 'RAID log', body: 'Risks, assumptions, issues and dependencies with likelihood × impact and review dates.' },
  meetings: { label: 'Meetings', body: 'Agendas, minutes, decisions and action items, with calendar invites.' },
  finance: { label: 'Finance', body: 'Rates, weekly timesheets, budget vs actual and payment milestones (tracking only, no invoicing).' },
  reports: { label: 'Client reports & present', body: 'Automatic weekly client report, steering report and full-screen present mode.' },
  serviceDesk: { label: 'Service desk & SLA', body: 'Request types, P1–P4 priorities, SLA clocks on working hours, queues and CSAT.' },
  resources: { label: 'Resources', body: 'A library of project links — repos, designs, docs, audio, 3D assets — in groups, pinned to the sidebar, checked weekly for dead links.' },
};

/** Khoá được nhắc trong một dòng audit `project.studio` ("Modules: docs on, raid off"). */
export function toggledKeysFrom(summaries: string[]): Set<StudioModule> {
  const out = new Set<StudioModule>();
  for (const s of summaries) {
    for (const k of STUDIO_MODULES) if (new RegExp(`(^|[\\s:,])${k} (on|off)\\b`).test(s)) out.add(k);
  }
  return out;
}

/** Khoá CHƯA ĐƯỢC QUYẾT (xem đầu file). Hàm thuần. */
export function undecidedModules(rawModules: unknown, createdAt: Date, toggled: Set<string>): StudioModule[] {
  const raw = (rawModules && typeof rawModules === 'object' ? rawModules : {}) as Record<string, unknown>;
  return STUDIO_MODULES.filter((k) => {
    if (!(k in raw)) return true;
    if (raw[k] === true) return false;
    if (toggled.has(k)) return false;
    return createdAt.getTime() < Date.parse(MODULE_SINCE[k]);
  });
}

/** Bản đồ mô-đun sau khi áp mặc định theo loại cho các khoá chưa quyết. Hàm thuần. */
export function applyKindDefaultsToUndecided(current: ModuleMap, kind: ProjectKind, undecided: StudioModule[]): { next: ModuleMap; enabled: StudioModule[] } {
  const defaults = defaultModulesFor(kind);
  const next = { ...current };
  const enabled: StudioModule[] = [];
  for (const k of undecided) {
    next[k] = defaults[k];
    if (defaults[k] && !current[k]) enabled.push(k);
  }
  return { next, enabled };
}

async function loadState(projectId: number) {
  const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { settings: true, createdAt: true } });
  const logs = await prisma.workAuditLog.findMany({ where: { projectId, action: 'project.studio' }, select: { summary: true }, take: 500, orderBy: { id: 'desc' } });
  const settings = (p.settings && typeof p.settings === 'object' ? p.settings : {}) as Record<string, unknown>;
  const undecided = undecidedModules(settings.modules, p.createdAt, toggledKeysFrom(logs.map((l) => l.summary)));
  return { settings, undecided };
}

/** Danh sách mô-đun cho Settings → Project type & modules: đang tắt / chưa quyết / được khuyên theo loại. */
export async function availableModules(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const { undecided } = await loadState(projectId);
  const defaults = defaultModulesFor(access.kind);
  const modules = STUDIO_MODULES.map((k) => ({
    key: k, ...MODULE_INFO[k], on: access.modules[k], recommended: defaults[k], undecided: undecided.includes(k),
  }));
  return {
    kind: access.kind,
    modules,
    /** Bấm "Enable all recommended" sẽ bật đúng những mô-đun này. */
    willEnable: modules.filter((m) => m.undecided && m.recommended && !m.on).map((m) => m.key),
  };
}

/**
 * POST /projects/:pid/studio/apply-defaults — chỉ ADMIN dự án (`studio.configure`), audit `project.studio`.
 * Khoá đã quyết giữ nguyên; khoá chưa quyết nhận mặc định của loại (bật hoặc tắt — tắt cũng ghi vào để
 * lần sau là "đã quyết").
 */
export async function applyStudioDefaults(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'studio.configure');
  const { settings, undecided } = await loadState(projectId);
  const before = modulesOf(settings);
  const { next, enabled } = applyKindDefaultsToUndecided(before, access.kind, undecided);
  const raw = (settings.modules && typeof settings.modules === 'object' ? settings.modules : {}) as Record<string, unknown>;
  // Ghi khi có khoá mới (thiếu trong settings) hoặc có mô-đun được bật — bấm lại lần hai không đẻ thêm audit.
  if (enabled.length || undecided.some((k) => !(k in raw))) {
    await prisma.workProject.update({ where: { id: projectId }, data: { settings: { ...settings, modules: next } as Prisma.InputJsonValue } });
    // Audit nói "on" cho khoá vừa bật ⇒ lần sau toggledKeysFrom coi là đã quyết (đúng ý: người ta vừa quyết).
    await auditProject(projectId, {
      actorId: userId, action: 'project.studio', targetType: 'project', targetId: projectId,
      summary: enabled.length
        ? `Enabled recommended modules for ${access.kind}: ${enabled.map((k) => `${k} on`).join(', ')}`
        : `Applied ${access.kind} module defaults (nothing new to enable)`,
      detail: { applyDefaults: true, kind: access.kind, undecided, enabled, modules: next },
    });
    // Bật cổng khách đổi phòng realtime của khách (như updateStudioConfig) — đuổi ra để vào lại đúng phòng.
    if (next.clientPortal !== before.clientPortal) {
      const clients = await prisma.workProjectMember.findMany({ where: { projectId, role: 'CLIENT' }, select: { userId: true } });
      for (const c of clients) evictFromProject(projectId, c.userId);
    }
    emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
  }
  return { enabled, saved: next, ...(await availableModules(userId, projectId)) };
}
