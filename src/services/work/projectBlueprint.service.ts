/**
 * CT Work — dm5 G4 (A25, 27/11/2026): tạo dự án từ THƯ VIỆN MẪU (projectBlueprints.ts) hoặc CHÉP CẤU HÌNH từ một dự án mẫu.
 *
 *   listBlueprints()                        — 5 bộ + nhóm tính năng + bản xem trước (thuần)
 *   previewFromProject(userId, srcId)       — xem trước những gì sẽ chép từ dự án mẫu (đếm, không ghi)
 *   applyBlueprint(userId, projectId, key, groups) — phủ bộ mẫu lên dự án VỪA tạo (projects.service › createProject gọi)
 *   cloneProjectConfig(userId, srcId, dstId, opts) — chép cấu hình: quy trình + trạng thái + WIP + luật chuyển, loại thẻ,
 *       nhãn, component, trường tuỳ chỉnh, settings (đổi id trường/trạng thái trong doneRequirements / readyRequirements /
 *       boardColumns), mẫu mô tả thẻ (settings.issueTemplates), giai đoạn (chưa bắt đầu), cây Docs (tiêu đề; nội dung chỉ khi
 *       copyDocBodies). KHÔNG chép thẻ, worklog, sprint, thành viên, người duyệt cổng.
 *
 * Quyền: người tạo phải XEM được dự án mẫu (thành viên không phải CLIENT/khách) và dự án mẫu cùng không gian; dự án mới do
 * createProject tạo nên người tạo là ADMIN ⇒ mọi bước áp dụng chạy dưới quyền đó. Nhóm hỏng giữa chừng không làm hỏng dự án:
 * ghi vào `skipped` kèm lý do, các nhóm khác vẫn chạy.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { markdownToTiptap } from './docMarkdown.js';
import { isClientScoped, loadProjectAccess } from './permissions.js';
import { blueprintOf, BLUEPRINTS, enabledGroups, previewBlueprint, type Blueprint, type BlueprintGroup } from './projectBlueprints.js';

type Summary = { applied: Partial<Record<BlueprintGroup | string, number | string>>; skipped: Array<{ group: string; reason: string }> };

export function listBlueprints() {
  return BLUEPRINTS.map((b) => previewBlueprint(b));
}

export function blueprintPreview(key: string, groups?: Partial<Record<string, boolean>> | null) {
  const b = blueprintOf(key);
  if (!b) throw new BadRequestError(`Unknown project template "${key}" — use one of ${BLUEPRINTS.map((x) => x.key).join(', ')}`, 'WORK_BAD_BLUEPRINT');
  return previewBlueprint(b, groups);
}

/** Dự án mẫu: người gọi là thành viên đội (không phải khách), cùng không gian với dự án sẽ tạo. */
export async function assertTemplateSource(userId: number, sourceProjectId: number, workspaceId: number) {
  const a = await loadProjectAccess(userId, sourceProjectId);
  if (!a) throw new NotFoundError('Template project not found');
  if (a.role === 'CLIENT' || isClientScoped(a)) throw new ForbiddenError('Clients cannot copy a project');
  if (a.workspaceId !== workspaceId) throw new BadRequestError('The template project must be in the same workspace', 'WORK_BAD_TEMPLATE_PROJECT');
  return a;
}

export async function previewFromProject(userId: number, workspaceId: number, sourceProjectId: number) {
  await assertTemplateSource(userId, sourceProjectId, workspaceId);
  const src = await prisma.workProject.findUniqueOrThrow({ where: { id: sourceProjectId }, select: { key: true, name: true, type: true, template: true, kind: true, settings: true } });
  const [workflows, types, labels, components, fields, stages, pages, issues] = await Promise.all([
    prisma.workWorkflow.findMany({ where: { projectId: sourceProjectId }, select: { name: true, statuses: { orderBy: { position: 'asc' }, select: { name: true, wipLimit: true } }, _count: { select: { transitions: true } } } }),
    prisma.workIssueType.findMany({ where: { projectId: sourceProjectId, archived: false }, orderBy: { position: 'asc' }, select: { key: true, name: true } }),
    prisma.workLabel.count({ where: { projectId: sourceProjectId } }),
    prisma.workComponent.count({ where: { projectId: sourceProjectId } }),
    prisma.workCustomField.findMany({ where: { projectId: sourceProjectId }, orderBy: { position: 'asc' }, select: { name: true, kind: true } }),
    prisma.workStage.count({ where: { projectId: sourceProjectId } }),
    prisma.workPage.count({ where: { projectId: sourceProjectId, deletedAt: null } }),
    prisma.workIssue.count({ where: { projectId: sourceProjectId, deletedAt: null } }),
  ]);
  const s = (src.settings ?? {}) as Record<string, unknown>;
  return {
    source: { id: sourceProjectId, key: src.key, name: src.name, type: src.type, template: src.template, kind: src.kind },
    copies: {
      workflows: workflows.map((w) => ({ name: w.name, statuses: w.statuses.map((x) => `${x.name}${x.wipLimit ? ` (WIP ${x.wipLimit})` : ''}`), transitions: w._count.transitions })),
      issueTypes: types.map((t) => t.key), labels, components, fields: fields.map((f) => `${f.name} (${f.kind.toLowerCase()})`), stages, docPages: pages,
      settings: Object.keys(s).filter((k) => !SETTINGS_NOT_COPIED.has(k)).sort(),
    },
    notCopied: { issues, note: 'Issues, work logs, sprints, members, approvers and meetings are never copied.' },
  };
}

// ─── Chép cấu hình ───────────────────────────────────────────────

/** Khoá settings KHÔNG chép: người cụ thể, dấu vết nguồn, bố cục theo id cũ, mô-đun (đi đường riêng). */
const SETTINGS_NOT_COPIED = new Set(['stageGate', 'agents', 'sampleData', 'importedFrom', 'workflowLayout', 'modules', 'cuongMiniAutoReview']);

const mapIds = (raw: unknown, m: Map<number, number>): number[] => (Array.isArray(raw) ? raw.map((x) => (typeof x === 'number' ? m.get(x) : undefined)).filter((x): x is number => typeof x === 'number') : []);

/** Đổi id trường / trạng thái trong các khoá settings biết cấu trúc (thuần — test được). */
export function remapSettings(settings: Record<string, unknown>, fieldMap: Map<number, number>, statusMap: Map<number, number>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(settings)) if (!SETTINGS_NOT_COPIED.has(k)) out[k] = structuredClone(v);
  const done = out.doneRequirements as Record<string, unknown> | null | undefined;
  if (done && typeof done === 'object') out.doneRequirements = { ...done, fieldIds: mapIds(done.fieldIds, fieldMap) };
  const ready = out.readyRequirements as Record<string, unknown> | null | undefined;
  if (ready && typeof ready === 'object') {
    out.readyRequirements = { ...ready, fieldIds: mapIds(ready.fieldIds, fieldMap), ...(Array.isArray(ready.toStatusIds) ? { toStatusIds: mapIds(ready.toStatusIds, statusMap) } : {}) };
  }
  if (Array.isArray(out.boardColumns)) {
    out.boardColumns = (out.boardColumns as Array<Record<string, unknown>>).map((c) => ({ ...c, statusIds: mapIds(c.statusIds, statusMap) })).filter((c) => (c.statusIds as number[]).length);
  }
  return out;
}

export async function cloneProjectConfig(userId: number, sourceProjectId: number, projectId: number, opts: { copyDocBodies?: boolean } = {}): Promise<Summary> {
  const sum: Summary = { applied: {}, skipped: [] };
  const src = await prisma.workProject.findUniqueOrThrow({ where: { id: sourceProjectId }, select: { key: true, settings: true } });
  const [workflows, types, labels, components, fields] = await Promise.all([
    prisma.workWorkflow.findMany({ where: { projectId: sourceProjectId }, orderBy: { id: 'asc' }, include: { statuses: { orderBy: { position: 'asc' } }, transitions: true } }),
    prisma.workIssueType.findMany({ where: { projectId: sourceProjectId }, orderBy: { position: 'asc' } }),
    prisma.workLabel.findMany({ where: { projectId: sourceProjectId } }),
    prisma.workComponent.findMany({ where: { projectId: sourceProjectId } }),
    prisma.workCustomField.findMany({ where: { projectId: sourceProjectId }, orderBy: { position: 'asc' } }),
  ]);
  const statusMap = new Map<number, number>();
  const fieldMap = new Map<number, number>();
  await prisma.$transaction(async (tx) => {
    // Dự án mới chưa có thẻ: bỏ cấu hình mẫu gốc vừa seed rồi chép đúng của dự án mẫu.
    if (await tx.workIssue.count({ where: { projectId } })) throw new BadRequestError('Configuration can only be copied into a new, empty project', 'WORK_NOT_EMPTY');
    await tx.workIssueType.deleteMany({ where: { projectId } });
    await tx.workWorkflow.deleteMany({ where: { projectId } });
    await tx.workCustomField.deleteMany({ where: { projectId } });
    const wfMap = new Map<number, number>();
    for (const w of workflows) {
      const nw = await tx.workWorkflow.create({ data: { projectId, name: w.name, isDefault: w.isDefault } });
      wfMap.set(w.id, nw.id);
      for (const s of w.statuses) {
        const ns = await tx.workStatus.create({ data: { workflowId: nw.id, name: s.name, category: s.category, color: s.color, position: s.position, wipLimit: s.wipLimit } });
        statusMap.set(s.id, ns.id);
      }
      const rows = w.transitions
        .filter((t) => (t.fromStatusId === null || statusMap.has(t.fromStatusId)) && statusMap.has(t.toStatusId))
        .map((t) => ({ workflowId: nw.id, fromStatusId: t.fromStatusId === null ? null : statusMap.get(t.fromStatusId)!, toStatusId: statusMap.get(t.toStatusId)!, name: t.name, rules: (t.rules ?? {}) as Prisma.InputJsonValue }));
      if (rows.length) await tx.workTransition.createMany({ data: rows });
    }
    if (types.length) {
      await tx.workIssueType.createMany({
        data: types.map((t) => ({ projectId, key: t.key, name: t.name, icon: t.icon, color: t.color, level: t.level, position: t.position, archived: t.archived, workflowId: t.workflowId ? wfMap.get(t.workflowId) ?? null : null })),
      });
    }
    for (const f of fields) {
      const nf = await tx.workCustomField.create({ data: { projectId, name: f.name, kind: f.kind, options: f.options as Prisma.InputJsonValue, typeKeys: (f.typeKeys ?? Prisma.DbNull) as Prisma.InputJsonValue, required: f.required, position: f.position } });
      fieldMap.set(f.id, nf.id);
    }
    if (labels.length) await tx.workLabel.createMany({ data: labels.map((l) => ({ projectId, name: l.name, color: l.color })), skipDuplicates: true });
    if (components.length) await tx.workComponent.createMany({ data: components.map((c) => ({ projectId, name: c.name, description: c.description })), skipDuplicates: true });
    const cur = await tx.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { settings: true } });
    const curS = (cur.settings ?? {}) as Record<string, unknown>;
    const next = { ...remapSettings((src.settings ?? {}) as Record<string, unknown>, fieldMap, statusMap), modules: curS.modules ?? (src.settings as Record<string, unknown> | null)?.modules, copiedFrom: { projectId: sourceProjectId, key: src.key, at: new Date().toISOString() } };
    await tx.workProject.update({ where: { id: projectId }, data: { settings: next as Prisma.InputJsonValue } });
  }, { timeout: 30_000 });
  sum.applied.workflow = workflows.length;
  sum.applied.statuses = statusMap.size;
  sum.applied.types = types.length;
  sum.applied.fields = fields.length;
  sum.applied.labels = labels.length;
  sum.applied.components = components.length;

  // Giai đoạn (chưa bắt đầu, không gate issue) + cây Docs.
  const stages = await prisma.workStage.findMany({ where: { projectId: sourceProjectId }, orderBy: { n: 'asc' }, select: { n: true, slug: true, name: true, plannedStart: true, plannedEnd: true } });
  if (stages.length) {
    const existing = new Set((await prisma.workStage.findMany({ where: { projectId }, select: { slug: true } })).map((s) => s.slug));
    const add = stages.filter((s) => !existing.has(s.slug));
    const maxN = (await prisma.workStage.aggregate({ where: { projectId }, _max: { n: true } }))._max.n ?? -1;
    if (add.length) await prisma.workStage.createMany({ data: add.map((s, i) => ({ projectId, n: existing.size ? maxN + 1 + i : s.n, slug: s.slug, name: s.name })), skipDuplicates: true });
    sum.applied.stages = add.length;
  }
  const pages = await prisma.workPage.findMany({ where: { projectId: sourceProjectId, deletedAt: null }, orderBy: [{ parentId: { sort: 'asc', nulls: 'first' } }, { position: 'asc' }, { id: 'asc' }], select: { id: true, parentId: true, title: true, templateKey: true, contentJson: true, contentText: true, position: true }, take: 500 });
  if (pages.length) {
    const pageMap = new Map<number, number>();
    await prisma.$transaction(async (tx) => {
      const last = await tx.workPage.aggregate({ where: { projectId }, _max: { number: true } });
      let n = last._max.number ?? 0;
      // Cha trước con (sắp theo độ sâu).
      const byId = new Map(pages.map((p) => [p.id, p]));
      const depth = (p: { parentId: number | null }, seen = 0): number => (p.parentId && byId.has(p.parentId) && seen < 10 ? 1 + depth(byId.get(p.parentId)!, seen + 1) : 0);
      for (const p of [...pages].sort((a, b) => depth(a) - depth(b))) {
        n += 1;
        const np = await tx.workPage.create({
          data: {
            projectId, number: n, parentId: p.parentId ? pageMap.get(p.parentId) ?? null : null, title: p.title, templateKey: p.templateKey, position: p.position,
            contentJson: opts.copyDocBodies ? (p.contentJson ?? Prisma.DbNull) as Prisma.InputJsonValue : { type: 'doc', content: [{ type: 'paragraph' }] },
            contentText: opts.copyDocBodies ? p.contentText : null, ownerId: userId, lastEditedById: userId,
          },
          select: { id: true },
        });
        pageMap.set(p.id, np.id);
      }
    }, { timeout: 30_000 });
    sum.applied.docs = pageMap.size;
  }
  await auditProject(projectId, { actorId: userId, action: 'project.copy_config', targetType: 'project', targetId: projectId, summary: `Configuration copied from ${src.key}`, detail: sum.applied as Record<string, unknown> });
  return sum;
}

// ─── Áp bộ mẫu ───────────────────────────────────────────────────

const EXTRA_TYPES: Record<string, { name: string; icon: string; color: string; level: number }> = {
  REQUIREMENT: { name: 'Requirement', icon: 'requirement', color: '#0891b2', level: 0 },
  TEST: { name: 'Test', icon: 'test', color: '#ca8a04', level: 0 },
  STORY: { name: 'Story', icon: 'story', color: '#16a34a', level: 0 },
  BUG: { name: 'Bug', icon: 'bug', color: '#dc2626', level: 0 },
};

/** Thứ Hai tuần này (giờ VN), dạng Date 00:00Z. */
function mondayVn(now = new Date()): Date {
  const vn = new Date(now.getTime() + 7 * 3_600_000);
  return new Date(Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate()) - ((vn.getUTCDay() + 6) % 7) * 86_400_000);
}

async function step(sum: Summary, group: string, fn: () => Promise<number | string | void>) {
  try {
    const r = await fn();
    if (r !== undefined) sum.applied[group] = r;
  } catch (err) {
    logger.warn('[work] blueprint: nhóm lỗi', { group, err: (err as Error).message });
    sum.skipped.push({ group, reason: (err as Error).message.slice(0, 300) });
  }
}

/** Dựng patch settings của nhóm gates + checklists: đổi tên trường/trạng thái ⇒ id thật của dự án. */
export function gateSettingsPatch(b: Blueprint, on: Set<BlueprintGroup>, fieldsByName: Map<string, number>, statusesByName: Map<string, number>) {
  const patch: Record<string, unknown> = {};
  if (on.has('gates') && b.gates) {
    for (const [k, v] of Object.entries(b.gates)) {
      if (k === 'doneRequirements' || k === 'readyRequirements') {
        const o = v as Record<string, unknown>;
        const ids = ((o.fieldNames as string[] | undefined) ?? []).map((n) => fieldsByName.get(n.toLowerCase())).filter((x): x is number => !!x);
        if (!ids.length) continue; // trường bị tắt (nhóm fields off) ⇒ cổng không có gì để kiểm
        const { fieldNames: _f, toStatusNames, ...rest } = o;
        const toStatusIds = Array.isArray(toStatusNames) ? toStatusNames.map((n) => statusesByName.get(String(n).toLowerCase())).filter((x): x is number => !!x) : null;
        patch[k] = { ...rest, fieldIds: ids, ...(k === 'readyRequirements' ? { toStatusIds: toStatusIds?.length ? toStatusIds : null } : {}) };
      } else patch[k] = structuredClone(v);
    }
  }
  if (on.has('checklists') && b.checklists) {
    patch.definitionOfDone = b.checklists.definitionOfDone;
    if (b.checklists.reviewChecklists?.length) patch.reviewChecklists = b.checklists.reviewChecklists;
  }
  return patch;
}

export async function applyBlueprint(userId: number, projectId: number, key: string, picked?: Partial<Record<string, boolean>> | null): Promise<Summary> {
  const b = blueprintOf(key);
  if (!b) throw new BadRequestError(`Unknown project template "${key}"`, 'WORK_BAD_BLUEPRINT');
  const on = enabledGroups(b, picked);
  const sum: Summary = { applied: {}, skipped: [] };
  const def = await prisma.workWorkflow.findFirst({ where: { projectId, isDefault: true }, select: { id: true } });

  if (on.has('workflow') && b.workflow && def) {
    await step(sum, 'workflow', async () => {
      const wf = b.workflow!;
      await prisma.$transaction(async (tx) => {
        // Trạng thái trùng tên ⇒ cập nhật tại chỗ (thẻ mẫu gốc vừa seed — vd epic Report của CAPSTONE — giữ trạng thái);
        // trạng thái thừa không có thẻ ⇒ xoá, có thẻ ⇒ giữ ở cuối.
        const old = await tx.workStatus.findMany({ where: { workflowId: def.id }, select: { id: true, name: true, _count: { select: { issues: true } } } });
        const byName = new Map(old.map((s) => [s.name.toLowerCase(), s]));
        await tx.workTransition.deleteMany({ where: { workflowId: def.id } });
        const colors: Record<string, string> = { TODO: '#64748b', IN_PROGRESS: '#2563eb', DONE: '#16a34a' };
        const ids = new Map<string, number>();
        for (const [i, s] of wf.statuses.entries()) {
          const hit = byName.get(s.name.toLowerCase());
          const data = { name: s.name, category: s.category, color: colors[s.category], position: i, wipLimit: s.wipLimit ?? null };
          const row = hit ? await tx.workStatus.update({ where: { id: hit.id }, data }) : await tx.workStatus.create({ data: { workflowId: def.id, ...data } });
          ids.set(s.name, row.id);
        }
        const keep = new Set(ids.values());
        let pos = wf.statuses.length;
        for (const s of old) {
          if (keep.has(s.id)) continue;
          if (s._count.issues) { await tx.workStatus.update({ where: { id: s.id }, data: { position: pos++ } }); ids.set(s.name, s.id); }
          else await tx.workStatus.delete({ where: { id: s.id } });
        }
        if (wf.rules?.length) {
          const restricted = new Set(wf.rules.map((r) => r.to));
          const data: Prisma.WorkTransitionCreateManyInput[] = [];
          for (const [name, id] of ids) if (!restricted.has(name)) data.push({ workflowId: def.id, fromStatusId: null, toStatusId: id, name });
          for (const r of wf.rules) for (const f of r.onlyFrom) {
            const from = ids.get(f), to = ids.get(r.to);
            if (from && to) data.push({ workflowId: def.id, fromStatusId: from, toStatusId: to, name: r.to, rules: r.rules as Prisma.InputJsonValue });
          }
          await tx.workTransition.createMany({ data });
        }
      });
      return wf.statuses.length;
    });
  }
  if (on.has('types') && b.types?.length) {
    await step(sum, 'types', async () => {
      const have = new Set((await prisma.workIssueType.findMany({ where: { projectId }, select: { key: true } })).map((t) => t.key));
      const pos = await prisma.workIssueType.count({ where: { projectId } });
      const add = b.types!.filter((k) => !have.has(k) && EXTRA_TYPES[k]);
      if (add.length) await prisma.workIssueType.createMany({ data: add.map((k, i) => ({ projectId, key: k, ...EXTRA_TYPES[k], position: pos + i, workflowId: def?.id ?? null })) });
      return add.length;
    });
  }
  if (on.has('fields') && b.fields?.length) {
    await step(sum, 'fields', async () => {
      const { createCustomField } = await import('./customize.service.js');
      const have = new Set((await prisma.workCustomField.findMany({ where: { projectId }, select: { name: true } })).map((f) => f.name.toLowerCase()));
      let n = 0;
      for (const f of b.fields!) {
        if (have.has(f.name.toLowerCase())) continue;
        await createCustomField(userId, projectId, { name: f.name, kind: f.kind, options: f.options, typeKeys: f.typeKeys });
        n++;
      }
      return n;
    });
  }
  if (on.has('labels') && b.labels?.length) {
    await step(sum, 'labels', async () => (await prisma.workLabel.createMany({ data: b.labels!.map((l) => ({ projectId, name: l.name, color: l.color })), skipDuplicates: true })).count);
  }
  if ((on.has('gates') && b.gates) || (on.has('checklists') && b.checklists)) {
    await step(sum, 'gates', async () => {
      const [fields, statuses] = await Promise.all([
        prisma.workCustomField.findMany({ where: { projectId }, select: { id: true, name: true } }),
        prisma.workStatus.findMany({ where: { workflow: { projectId } }, select: { id: true, name: true } }),
      ]);
      const patch = gateSettingsPatch(b, on, new Map(fields.map((f) => [f.name.toLowerCase(), f.id])), new Map(statuses.map((s) => [s.name.toLowerCase(), s.id])));
      if (!Object.keys(patch).length) return 0;
      const { updateProject } = await import('./projects.service.js');
      // Đi qua updateProject ⇒ chạy đủ bộ chuẩn hoá của G1/G3/G4 (sai định dạng bị loại, không lọt vào settings).
      await updateProject(userId, projectId, { settings: patch });
      return Object.keys(patch).join(', ');
    });
  }
  const modules = ((await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { settings: true } })).settings as { modules?: Record<string, boolean> } | null)?.modules ?? {};
  if (on.has('stages') && b.stages?.length) {
    await step(sum, 'stages', async () => {
      if (!modules.stages) throw new BadRequestError('Stages module is off — turn on "Project modules" to add stages', 'MODULE_DISABLED');
      const have = new Set((await prisma.workStage.findMany({ where: { projectId }, select: { slug: true } })).map((s) => s.slug));
      const maxN = (await prisma.workStage.aggregate({ where: { projectId }, _max: { n: true } }))._max.n ?? -1;
      const mon = mondayVn();
      const add = b.stages!.filter((s) => !have.has(s.slug));
      await prisma.workStage.createMany({
        data: add.map((s, i) => ({
          projectId, n: maxN + 1 + i, slug: s.slug, name: s.name,
          plannedStart: new Date(mon.getTime() + s.startWeek * 7 * 86_400_000),
          plannedEnd: new Date(mon.getTime() + ((s.startWeek + s.weeks) * 7 - 1) * 86_400_000),
        })),
        skipDuplicates: true,
      });
      return add.length;
    });
  }
  if (on.has('cadence') && b.cadence?.length) {
    await step(sum, 'cadence', async () => {
      if (!modules.meetings) throw new BadRequestError('Meetings module is off — turn on "Project modules" to add recurring meetings', 'MODULE_DISABLED');
      const { createSeries } = await import('./meetingSeries.service.js');
      const start = new Date(mondayVn().getTime() + 7 * 86_400_000).toISOString().slice(0, 10);
      let n = 0;
      for (const c of b.cadence!) {
        await createSeries(userId, projectId, {
          title: c.title, templateKey: c.templateKey, durationMin: c.durationMin, timezone: 'Asia/Ho_Chi_Minh', sendInvites: false,
          recurrence: { freq: c.freq, byWeekday: c.byWeekday, hour: c.hour, minute: c.minute ?? 0, startDate: start },
        });
        n++;
      }
      return n;
    });
  }
  if (on.has('docs') && b.docs?.length) {
    await step(sum, 'docs', async () => {
      if (!modules.docs) throw new BadRequestError('Docs module is off — turn on "Project modules" to add the template pages', 'MODULE_DISABLED');
      const { createPage } = await import('./pages.service.js');
      const root = await createPage(userId, projectId, { title: 'Project kit (templates)', contentJson: markdownToTiptap(`# Project kit\n\nTemplates of the "${b.name}" set. Duplicate a page before filling it in — keep these as blanks.`).doc });
      for (const d of b.docs!) await createPage(userId, projectId, { title: d.title, parentNumber: root.number, contentJson: markdownToTiptap(d.markdown).doc });
      return b.docs!.length + 1;
    });
  }
  await auditProject(projectId, { actorId: userId, action: 'project.blueprint', targetType: 'project', targetId: projectId, summary: `Project set up from template set ${b.key}`, detail: { groups: [...on], applied: sum.applied, skipped: sum.skipped } });
  return sum;
}

/** Bộ mẫu ⇒ đầu vào createProject (mẫu gốc, loại, mô-đun). Nhóm "modules" tắt ⇒ chỉ mô-đun mặc định của loại. */
export function blueprintCreateBase(key: string, picked?: Partial<Record<string, boolean>> | null) {
  const b = blueprintOf(key);
  if (!b) throw new BadRequestError(`Unknown project template "${key}" — use one of ${BLUEPRINTS.map((x) => x.key).join(', ')}`, 'WORK_BAD_BLUEPRINT');
  const on = enabledGroups(b, picked);
  return { ...b.base, modules: on.has('modules') ? Object.fromEntries((b.modules ?? []).map((m) => [m, true])) : {} };
}
