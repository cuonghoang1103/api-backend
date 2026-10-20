/**
 * "Create with CuongMini" — ÁP DỤNG kế hoạch: tạo dự án thật trong CT Work, đi qua ĐÚNG các service người dùng vẫn gọi
 * (createProject, createIssueAs, createSprint, createPage, createRaid, createSeries, createTest…) ⇒ quyền, lịch sử,
 * sự kiện, số thẻ như thật. Thẻ/trang do CuongMini soạn mang nhãn AI-assisted (actor AI).
 *
 * TẤT CẢ HOẶC KHÔNG GÌ (tới mức làm được): lỗi giữa chừng ⇒ xoá HẲN mọi dự án vừa tạo trong lượt này (FK cascade) + tệp
 * R2 đã chép. Lời mời gửi SAU CÙNG (thư đã gửi thì không rút lại được). Người chưa có tài khoản KHÔNG bao giờ được tạo
 * tài khoản: việc của họ ghi trường "Planned owner" + bản đồ `settings.cuongMiniPlannedOwners` (email ⇒ thẻ) — họ nhận
 * lời mời và vào nhóm là tự được giao (applyPlannedOwners, gọi từ acceptInvite).
 *
 * Giao việc ghi THẲNG (không qua sự kiện "issue.updated"): 600 thẻ ⇒ 600 thông báo "được giao" là spam. Mỗi người nhận
 * MỘT bình luận (brief của mình) trên thẻ Onboarding — là thông báo duy nhất.
 */

import crypto from 'node:crypto';
import type { Prisma } from '@prisma/client';
import { prisma } from '../../../config/database.js';
import { logger } from '../../../utils/logger.js';
import { AppError } from '../../../middleware/errorHandler.js';
import { auditProject } from '../audit.js';
import { frontendUrl } from '../common.js';
import { markdownToTiptap } from '../docMarkdown.js';
import { can, loadProjectAccess } from '../permissions.js';
import type { PlanItem, PlanMember, SetupPlan, SetupSource, UsageCall } from './kieu.js';
import { realModelFor, SETUP_MODEL_NAME, type SetupModelId } from './goiModel.js';
import { AGENTS_PAGE_TITLE, memberBriefs, tr } from './dungKeHoach.js';

export const PLANNED_OWNER_FIELD = 'Planned owner';

export interface ApplyProgress { (key: string, status: 'running' | 'done' | 'error' | 'skipped', detail?: string): Promise<void> }

export interface ApplyResult {
  projects: Array<{ id: number; key: string; name: string; url: string; issues: number; pages: number; sprints: number; tests: number; risks: number; meetings: number; resources: number; files: number; invited: number; added: number; planned: number }>;
  invites: { sent: number; added: number; skipped: number; reason?: string };
}

const lockedKeys = new Set<string>();

interface ApplyCtx {
  userId: number; workspaceId: number; wsSlug: string; plan: SetupPlan; sources: SetupSource[]; usage: UsageCall[];
  modelId: SetupModelId; lang: 'vi' | 'en' | 'both'; sendInvites: boolean; sprintWeeks: number; draftId: number; progress: ApplyProgress; signal?: AbortSignal;
}

const CUT = () => { throw new AppError('Cancelled', 499, 'WORK_SETUP_CANCELLED'); };

/** Mô tả thẻ: mô tả + tiêu chí (danh sách việc) + người dự kiến / ghép cặp. */
function itemMarkdown(it: PlanItem, mByRef: Map<string, PlanMember>, lang: ApplyCtx['lang']): string {
  const L: string[] = [];
  if (it.description) L.push(it.description);
  if (it.criteria.length) L.push(`### ${tr(lang, 'Tiêu chí nghiệm thu', 'Acceptance criteria')}\n${it.criteria.map((c) => `- [ ] ${c}`).join('\n')}`);
  const who = it.assigneeRef ? mByRef.get(it.assigneeRef) : undefined;
  const pair = it.pairRef ? mByRef.get(it.pairRef) : undefined;
  const meta: string[] = [];
  if (who && who.mapping !== 'USER') meta.push(`**${PLANNED_OWNER_FIELD}:** ${who.name}${who.studentId ? ` (${who.studentId})` : ''}`);
  if (pair) meta.push(`**${tr(lang, 'Làm cặp với', 'Pair with')}:** ${pair.name}${pair.studentId ? ` (${pair.studentId})` : ''}`);
  if (meta.length) L.push(meta.join(' · '));
  return L.join('\n\n');
}

const doc = (md: string) => markdownToTiptap(md || ' ').doc as unknown as Prisma.InputJsonValue;

export async function applyPlan(c: ApplyCtx): Promise<ApplyResult> {
  const projects = await import('../projects.service.js');
  const issues = await import('../issues.service.js');
  const sprintsSvc = await import('../sprints.service.js');
  const planning = await import('../planning.service.js');
  const pages = await import('../pages.service.js');
  const raid = await import('../raid.service.js');
  const series = await import('../meetingSeries.service.js');
  const tests = await import('../tests.service.js');
  const resources = await import('../resources.service.js');
  const customize = await import('../customize.service.js');
  const { commentStore } = await import('../commentFiles.service.js');

  // Kiểm trước khi tạo bất cứ gì: mã trùng trong không gian / trong lượt, trần số dự án.
  const keys = c.plan.projects.map((p) => p.key);
  if (new Set(keys).size !== keys.length) throw new AppError('Two planned projects use the same key — change one in the draft.', 409, 'WORK_SETUP_KEY_TAKEN');
  const taken = await prisma.workProject.findMany({ where: { workspaceId: c.workspaceId, key: { in: keys } }, select: { key: true } });
  if (taken.length) throw new AppError(`Project key ${taken.map((t) => t.key).join(', ')} is already used in this workspace — change it in the draft.`, 409, 'WORK_SETUP_KEY_TAKEN');
  const lockKey = `${c.workspaceId}:${keys.join(',')}`;
  if (lockedKeys.has(lockKey)) throw new AppError('These projects are being created right now.', 409, 'WORK_SETUP_BUSY');
  lockedKeys.add(lockKey);

  const created: number[] = [];
  const copiedKeys: string[] = [];
  const store = commentStore();
  const mByRef = new Map(c.plan.members.map((m) => [m.ref, m]));
  const result: ApplyResult = { projects: [], invites: { sent: 0, added: 0, skipped: 0 } };
  const plannedPerProject = new Map<number, Array<{ ref: string; email: string; name: string; studentId: string; issueIds: number[] }>>();
  const onboardingIssue = new Map<string, { projectId: number; number: number }>();
  const aiModel = SETUP_MODEL_NAME[c.modelId];

  try {
    for (const [pi, p] of c.plan.projects.entries()) {
      if (c.signal?.aborted) CUT();
      const tag = c.plan.projects.length > 1 ? `${p.key}: ` : '';
      await c.progress(`project:${p.ref}`, 'running', `${tag}${tr(c.lang, 'tạo dự án', 'creating project')}`);
      const proj = await projects.createProject(c.userId, c.workspaceId, {
        key: p.key, name: p.name, description: p.description || null, type: p.type, template: p.template, kind: p.kind,
        visibility: 'WORKSPACE', firstSprint: false,
        modules: { docs: true, raid: true, meetings: true, resources: true },
      });
      created.push(proj.id);
      const pid = proj.id;
      const members = c.plan.members.filter((m) => m.projectRef === p.ref);
      // Thành viên có tài khoản trong không gian mà KHÔNG giao việc được (khách, viewer) ⇒ coi như chưa có tài khoản.
      for (const m of members) {
        if (m.mapping !== 'USER' || !m.userId) continue;
        const a = await loadProjectAccess(m.userId, pid);
        if (!a || !can(a.role, 'issue.edit')) { m.mapping = m.email ? 'INVITE' : 'PLACEHOLDER'; m.userId = null; }
      }
      const uid = (ref: string | null | undefined) => { const m = ref ? mByRef.get(ref) : undefined; return m?.mapping === 'USER' && m.userId ? m.userId : null; };
      // Trưởng nhóm có tài khoản ⇒ ADMIN của dự án (duyệt PR, xếp sprint).
      for (const m of members.filter((x) => x.leader && x.mapping === 'USER' && x.userId && x.userId !== c.userId)) {
        await projects.setProjectMember(c.userId, pid, m.userId!, 'ADMIN').catch((e) => logger.warn('[tao-cuongmini] không đặt được trưởng nhóm', { error: (e as Error).message }));
      }
      const cfg = await prisma.workProject.findUniqueOrThrow({
        where: { id: pid },
        select: { settings: true, issueTypes: { where: { archived: false }, select: { id: true, key: true } }, labels: { select: { id: true, name: true } }, components: { select: { id: true, name: true } } },
      });
      const settings = (cfg.settings ?? {}) as Record<string, unknown>;
      const hours = settings.estimation === 'HOURS';
      const typeId = (k: string) => cfg.issueTypes.find((t) => t.key === k)?.id;
      const typeFor = (kind: PlanItem['kind']) => kind === 'EPIC' ? typeId('EPIC') : kind === 'SUBTASK' ? typeId('SUBTASK')
        : kind === 'BUG' ? typeId('BUG') ?? typeId('TASK') ?? typeId('STORY') : kind === 'TASK' ? typeId('TASK') ?? typeId('STORY') : typeId('STORY') ?? typeId('TASK');

      // Cài đặt: DoD, chỉ dẫn cho trợ lý AI, ngôn ngữ chữ máy chủ.
      await projects.updateProject(c.userId, pid, {
        settings: {
          ...(p.dod.length ? { definitionOfDone: p.dod.slice(0, 20) } : {}),
          aiInstructions: [`Project set up by CuongMini on ${new Date().toISOString().slice(0, 10)}.`, p.description, `Read the page “${AGENTS_PAGE_TITLE}” for conventions.`].filter(Boolean).join('\n').slice(0, 20_000),
          language: c.lang === 'en' ? 'en' : 'vi',
        },
      });

      // Nhãn + mô-đun + mốc + sprint.
      const labelId = new Map(cfg.labels.map((l) => [l.name.toLowerCase(), l.id]));
      const allLabels = new Map<string, string>();
      for (const l of p.labels) allLabels.set(l.name.toLowerCase(), l.color);
      for (const it of p.items) for (const l of it.labels) if (!allLabels.has(l.toLowerCase())) allLabels.set(l.toLowerCase(), '#64748b');
      for (const [name, color] of [...allLabels.entries()].slice(0, 60)) {
        if (labelId.has(name) || !name.trim()) continue;
        const l = await projects.upsertLabel(c.userId, pid, { name, color: /^#[0-9a-f]{6}$/i.test(color) ? color : '#64748b' });
        labelId.set(name, l.id);
      }
      const compId = new Map(cfg.components.map((x) => [x.name.toLowerCase(), x.id]));
      for (const comp of p.components) {
        if (!comp.name || compId.has(comp.name.toLowerCase())) continue;
        const r = await projects.upsertComponent(c.userId, pid, { name: comp.name, description: comp.description || null, leadId: uid(comp.ownerRef) });
        compId.set(comp.name.toLowerCase(), r.id);
      }
      const versionId = new Map<string, number>();
      for (const m of p.milestones) {
        const v = await planning.createVersion(c.userId, pid, { name: m.name, description: m.description || null, releaseDate: m.date });
        versionId.set(m.ref, v.id);
      }
      const sprintId = new Map<string, number>();
      for (const s of p.sprints) {
        const r = await sprintsSvc.createSprint(c.userId, pid, { name: s.name, goal: s.goal || null });
        await sprintsSvc.updateSprint(c.userId, pid, r.id, { startAt: new Date(`${s.start}T09:00:00+07:00`), endAt: new Date(`${s.end}T18:00:00+07:00`) });
        sprintId.set(s.ref, r.id);
      }
      await c.progress(`project:${p.ref}`, 'running', `${tag}${tr(c.lang, 'tạo thẻ', 'creating issues')} (${p.items.length})`);

      // Trường "Planned owner" khi có người chưa có tài khoản.
      const needsPlanned = p.items.some((i) => i.assigneeRef && !uid(i.assigneeRef));
      const plannedField = needsPlanned ? await customize.createCustomField(c.userId, pid, { name: PLANNED_OWNER_FIELD, kind: 'TEXT' }).catch(() => null) : null;

      // Thẻ: cha trước con (epic ⇒ story/task ⇒ subtask). Người giao: ghi thẳng sau khi tạo (không spam thông báo).
      const order = { EPIC: 0, STORY: 1, TASK: 1, BUG: 1, SUBTASK: 2 } as const;
      const sorted = [...p.items].sort((a, b) => order[a.kind] - order[b.kind]);
      const idOf = new Map<string, { id: number; number: number }>();
      const assign = new Map<number, number[]>();
      const planned = new Map<string, number[]>();
      let made = 0;
      for (const it of sorted) {
        if (c.signal?.aborted) CUT();
        const t = typeFor(it.kind);
        if (!t) continue;
        const parent = it.parentRef ? idOf.get(it.parentRef) : undefined;
        if (it.kind === 'SUBTASK' && !parent) continue;
        const iss = await issues.createIssueAs(c.userId, pid, {
          typeId: t, title: it.title.slice(0, 255), descriptionJson: doc(itemMarkdown(it, mByRef, c.lang)), priority: it.priority,
          ...(it.kind === 'EPIC' || it.kind === 'SUBTASK' || it.points === null ? {} : hours ? { originalEstimateMin: Math.round(it.points * 4 * 60) } : { storyPoints: it.points }),
          parentId: parent?.id,
          sprintId: it.kind !== 'EPIC' && it.kind !== 'SUBTASK' && it.sprintRef ? sprintId.get(it.sprintRef) : undefined,
          dueDate: it.due ? new Date(`${it.due}T17:00:00+07:00`) : undefined,
          fixVersionId: it.milestoneRef ? versionId.get(it.milestoneRef) : undefined,
          labelIds: it.labels.map((l) => labelId.get(l.toLowerCase())).filter((x): x is number => !!x),
          componentIds: it.component && compId.get(it.component.toLowerCase()) ? [compId.get(it.component.toLowerCase())!] : [],
        }, 'AI');
        idOf.set(it.ref, { id: iss.id, number: iss.number });
        made += 1;
        const u = uid(it.assigneeRef);
        if (u) assign.set(u, [...(assign.get(u) ?? []), iss.id]);
        else if (it.assigneeRef) planned.set(it.assigneeRef, [...(planned.get(it.assigneeRef) ?? []), iss.id]);
        if (it.labels.includes('onboarding') && it.assigneeRef) onboardingIssue.set(it.assigneeRef, { projectId: pid, number: iss.number });
        if (made % 25 === 0) await c.progress(`project:${p.ref}`, 'running', `${tag}${tr(c.lang, 'tạo thẻ', 'creating issues')} ${made}/${p.items.length}`);
      }
      if (assign.size) {
        await prisma.$transaction(async (tx) => {
          for (const [userId, ids] of assign) {
            await tx.workIssue.updateMany({ where: { id: { in: ids }, projectId: pid }, data: { assigneeId: userId } });
            await tx.workHistory.createMany({ data: ids.map((issueId) => ({ issueId, actorId: c.userId, actorKind: 'AI', field: 'assigneeId', toValue: String(userId) })) });
            await tx.workWatcher.createMany({ data: ids.map((issueId) => ({ issueId, userId })), skipDuplicates: true });
          }
        });
      }
      if (plannedField) {
        for (const [ref, ids] of planned) {
          const m = mByRef.get(ref);
          if (!m) continue;
          const nums = sorted.filter((x) => ids.includes(idOf.get(x.ref)?.id ?? -1)).map((x) => idOf.get(x.ref)!.number);
          for (const n of nums) await customize.setCustomValues(c.userId, pid, n, { [plannedField.id]: `${m.name}${m.studentId ? ` (${m.studentId})` : ''}` }).catch(() => undefined);
        }
      }
      plannedPerProject.set(pid, [...planned.entries()].map(([ref, ids]) => {
        const m = mByRef.get(ref)!;
        return { ref, email: m.email.toLowerCase(), name: m.name, studentId: m.studentId, issueIds: ids };
      }));
      // Phụ thuộc "blocks".
      for (const it of p.items) {
        const to = idOf.get(it.ref);
        if (!to) continue;
        for (const b of it.blockedBy) {
          const from = idOf.get(b);
          if (from) await issues.addLink(c.userId, pid, from.number, { type: 'BLOCKS', targetKey: `${p.key}-${to.number}` }).catch(() => undefined);
        }
      }

      // Test case + kế hoạch test.
      let testsMade = 0;
      if (p.tests.length) {
        await c.progress(`project:${p.ref}`, 'running', `${tag}${tr(c.lang, 'tạo test case', 'creating test cases')}`);
        if (!typeId('TEST')) await tests.enableTesting(c.userId, pid);
        const nums: number[] = [];
        for (const tc of p.tests) {
          const story = tc.storyRef ? idOf.get(tc.storyRef) : undefined;
          const r = await tests.createTest(c.userId, pid, {
            title: tc.title, preconditions: tc.preconditions || null,
            steps: tc.steps.filter((s) => s.action).map((s) => ({ action: s.action, expected: s.expected || null })),
            requirementKeys: story ? [`${p.key}-${story.number}`] : [],
          });
          nums.push(r.number);
          testsMade += 1;
        }
        if (nums.length) await tests.createPlan(c.userId, pid, { name: tr(c.lang, 'Kế hoạch test', 'Test plan'), description: tr(c.lang, 'Do CuongMini soạn — các ca kiểm thử chính.', 'Drafted by CuongMini — the key test cases.'), numbers: nums });
      }

      // RAID: rủi ro ban đầu.
      for (const r of p.risks) {
        await raid.createRaid(c.userId, pid, {
          type: 'RISK', title: r.title, description: r.description || null, category: r.category || null, probability: r.probability, impact: r.impact,
          mitigation: r.mitigation || null, response: 'MITIGATE', ownerId: uid(r.ownerRef),
        });
      }

      // Họp định kỳ.
      const attendees = members.map((m) => uid(m.ref)).filter((x): x is number => !!x && x !== c.userId);
      for (const mt of p.meetings) {
        await series.createSeries(c.userId, pid, {
          title: mt.title, type: mt.type,
          recurrence: { freq: 'WEEKLY', interval: mt.intervalWeeks, byWeekday: [mt.weekday], hour: mt.hour, minute: mt.minute, startDate: mt.startDate, endDate: mt.endDate ?? undefined },
          durationMin: mt.durationMin, attendeeIds: attendees, agendaItems: mt.agenda.map((a) => ({ title: a })),
          sendInvites: false,
        });
      }

      // Trang Docs (cha "Sổ tay dự án" + các trang con).
      await c.progress(`project:${p.ref}`, 'running', `${tag}${tr(c.lang, 'viết Docs', 'writing Docs')}`);
      const pageList = [...p.pages, ...(c.plan.portfolio ? [c.plan.portfolio] : [])];
      let pagesMade = 0;
      if (pageList.length) {
        const root = await pages.createPage(c.userId, pid, {
          title: tr(c.lang, 'Sổ tay dự án', 'Project handbook'),
          contentJson: markdownToTiptap(`# ${tr(c.lang, 'Sổ tay dự án', 'Project handbook')}\n\n${tr(c.lang, 'CuongMini dựng bộ tài liệu này từ đề bài, danh sách thành viên và lịch của nhóm. Mọi trang sửa được.', 'CuongMini drafted these pages from the brief, the team list and the timeline. Every page is editable.')}\n\n${pageList.map((x) => `- ${x.title}`).join('\n')}`).doc,
          aiProvenance: { model: aiModel },
        });
        pagesMade += 1;
        for (const pg of pageList) {
          // AGENTS.md đứng ở GỐC (app CuongMini tìm theo tiêu đề trong danh sách trang).
          const isAgents = pg.title === AGENTS_PAGE_TITLE;
          await pages.createPage(c.userId, pid, {
            title: pg.title, parentNumber: isAgents ? null : root.number, contentJson: markdownToTiptap(pg.markdown).doc, aiProvenance: { model: aiModel },
          });
          pagesMade += 1;
        }
      }

      // Tài nguyên: link (repo, Google…) + tệp tải lên ⇒ đính kèm thẻ "Tài liệu dự án".
      let resMade = 0;
      let filesMade = 0;
      const files = c.sources.filter((s) => s.kind === 'FILE' && s.r2Key);
      const links = [...c.sources.filter((s) => (s.kind === 'LINK' || s.kind === 'REPO') && s.url).map((s) => ({ title: s.name, url: s.url!, note: s.note })), ...p.resources];
      let group: { id: number } | null = null;
      if (links.length || files.length) group = await resources.createGroup(c.userId, pid, { name: tr(c.lang, 'Nguồn của CuongMini', 'CuongMini sources'), icon: '🤖' });
      const seenUrl = new Set<string>();
      for (const l of links.slice(0, 60)) {
        if (seenUrl.has(l.url)) continue;
        seenUrl.add(l.url);
        try {
          await resources.createResource(c.userId, pid, { url: l.url, title: l.title, description: l.note || null, groupId: group?.id ?? null, pinned: /github|gitlab/.test(l.url) });
          resMade += 1;
        } catch (e) { logger.warn('[tao-cuongmini] bỏ một link tài nguyên', { url: l.url, error: (e as Error).message }); }
      }
      if (files.length) {
        const matType = typeId('TASK') ?? typeId('STORY');
        if (matType) {
          const mat = await issues.createIssueAs(c.userId, pid, {
            typeId: matType, title: tr(c.lang, '📎 Tài liệu dự án (đề bài, mẫu, dữ liệu mẫu)', '📎 Project materials (brief, templates, sample data)'),
            descriptionJson: doc(`${tr(c.lang, 'Các tệp nhóm đã đưa cho CuongMini khi dựng dự án:', 'Files the team gave CuongMini when setting up the project:')}\n\n${files.map((f) => `- **${f.name}** — ${f.category}${f.note ? `: ${f.note}` : ''}`).join('\n')}`),
            priority: 3,
          }, 'AI');
          for (const f of files) {
            if (c.signal?.aborted) CUT();
            try {
              const buf = await store.read(f.r2Key!);
              const key = `work/${pid}/${mat.id}/${crypto.randomUUID()}/${f.name.replace(/[^\w.\- ]/g, '_').slice(-120)}`;
              await store.put(key, buf, f.mime || 'application/octet-stream');
              copiedKeys.push(key);
              await prisma.workAttachment.create({ data: { issueId: mat.id, uploaderId: c.userId, r2Key: key, fileName: f.name.slice(0, 255), mime: (f.mime || 'application/octet-stream').slice(0, 100), size: buf.length } });
              filesMade += 1;
            } catch (e) { logger.warn('[tao-cuongmini] không chép được tệp', { name: f.name, error: (e as Error).message }); }
          }
          const wsP = await prisma.workSpace.findUnique({ where: { id: c.workspaceId }, select: { slug: true } });
          try {
            await resources.createResource(c.userId, pid, { url: frontendUrl(`/work/${wsP?.slug ?? c.wsSlug}/${p.key}/issue/${mat.number}`), title: tr(c.lang, 'Tệp đính kèm của dự án', 'Project files'), groupId: group?.id ?? null, pinned: true });
            resMade += 1;
          } catch { /* đã có */ }
        }
      }

      // Bản đồ "người dự kiến" (email ⇒ thẻ) cho người chưa có tài khoản.
      const plannedList = plannedPerProject.get(pid) ?? [];
      if (plannedList.length) {
        const cur = await prisma.workProject.findUniqueOrThrow({ where: { id: pid }, select: { settings: true } });
        await prisma.workProject.update({
          where: { id: pid },
          data: { settings: { ...((cur.settings as object) ?? {}), cuongMiniPlannedOwners: plannedList.filter((x) => x.email).map(({ email, name, studentId, issueIds }) => ({ email, name, studentId, issueIds })) } as Prisma.InputJsonValue },
        });
      }

      await auditProject(pid, {
        actorId: c.userId, action: 'project.cuongmini_setup', targetType: 'project', targetId: pid,
        summary: `Set up with CuongMini: ${made} issues, ${pagesMade} pages, ${p.sprints.length} sprints, ${p.risks.length} risks, ${p.meetings.length} meeting series`,
        detail: { draftId: c.draftId, model: aiModel },
      });
      result.projects.push({
        id: pid, key: p.key, name: p.name, url: `/work/${c.wsSlug}/${p.key}/board`, issues: made, pages: pagesMade, sprints: p.sprints.length,
        tests: testsMade, risks: p.risks.length, meetings: p.meetings.length, resources: resMade, files: filesMade, invited: 0, added: 0,
        planned: plannedList.length,
      });
      await c.progress(`project:${p.ref}`, 'done', `${tag}${made} ${tr(c.lang, 'thẻ', 'issues')} · ${pagesMade} ${tr(c.lang, 'trang', 'pages')}`);
      void pi;
    }
  } catch (err) {
    // Trả về như chưa có gì: xoá HẲN dự án vừa tạo (cascade mọi bảng con) + tệp đã chép.
    for (const id of created.reverse()) await prisma.workProject.delete({ where: { id } }).catch((e) => logger.error('[tao-cuongmini] không gỡ được dự án dở', { id, error: (e as Error).message }));
    for (const k of copiedKeys) await store.del(k).catch(() => undefined);
    lockedKeys.delete(lockKey);
    throw err;
  }
  lockedKeys.delete(lockKey);

  // ── Sau khi mọi dự án đã đứng vững: brief từng người (bình luận Onboarding), lời mời, sổ AI usage. Lỗi ở đây không gỡ dự án.
  for (const p of c.plan.projects) {
    const briefs = memberBriefs(p, c.plan.members, c.lang, c.sprintWeeks);
    for (const [ref, md] of briefs) {
      const ob = onboardingIssue.get(ref);
      if (!ob) continue;
      await issues.addComment(c.userId, ob.projectId, ob.number, doc(`${tr(c.lang, '👋 Brief của bạn (CuongMini soạn)', '👋 Your brief (drafted by CuongMini)')}\n\n${md}`), 'AI').catch(() => undefined);
    }
  }

  if (c.sendInvites) {
    await c.progress('invites', 'running');
    const ws = await import('../workspaces.service.js');
    const { requireWorkspace } = await import('../permissions.js');
    const canInvite = await requireWorkspace(c.userId, c.workspaceId, 'workspace.members').then(() => true).catch(() => false);
    if (!canInvite) {
      result.invites.reason = 'Only workspace admins can send invitations — ask an admin to invite the team.';
      result.invites.skipped = c.plan.members.filter((m) => m.mapping === 'INVITE').length;
    } else {
      for (const rp of result.projects) {
        const p = c.plan.projects.find((x) => x.key === rp.key)!;
        const toInvite = c.plan.members.filter((m) => m.projectRef === p.ref && m.mapping === 'INVITE' && m.email);
        for (const role of ['ADMIN', 'MEMBER'] as const) {
          const emails = toInvite.filter((m) => (role === 'ADMIN') === m.leader).map((m) => m.email);
          for (let i = 0; i < emails.length; i += 50) {
            const batch = emails.slice(i, i + 50);
            try {
              const r = await ws.inviteByEmail(c.userId, c.workspaceId, { emails: batch, role: 'MEMBER', projectId: rp.id, projectRole: role });
              for (const x of r) {
                if (x.status === 'INVITED') { rp.invited += 1; result.invites.sent += 1; }
                else { rp.added += 1; result.invites.added += 1; await applyPlannedOwnersForEmail(rp.id, x.email).catch(() => undefined); }
              }
            } catch (e) {
              result.invites.skipped += batch.length;
              result.invites.reason = (e as Error).message?.slice(0, 200);
            }
          }
        }
      }
    }
    await c.progress('invites', 'done', `${result.invites.sent} sent · ${result.invites.added} added`);
  }

  // Sổ CT Work AI usage: lời gọi model của lượt dựng ghi vào dự án đầu tiên (chưa có dự án lúc gọi).
  const first = result.projects[0];
  if (first) {
    const { recordLlmCall } = await import('../aiUsage.service.js');
    for (const u of c.usage) {
      await recordLlmCall({ userId: c.userId, feature: 'work', purpose: 'work_setup', model: realModelFor(u), inputTokens: u.inputTokens, outputTokens: u.outputTokens, costUsd: u.usd, success: u.ok }, { projectId: first.id });
    }
  }
  return result;
}

/**
 * Người được mời (chưa có tài khoản lúc dựng) vừa vào nhóm ⇒ giao các thẻ đang chờ họ (còn trống người làm) và gỡ khỏi
 * bản đồ. Gọi từ acceptInvite + sau inviteByEmail (email đã có tài khoản ⇒ vào thẳng). Không ném lỗi ra ngoài.
 */
export async function applyPlannedOwners(userId: number, workspaceId: number): Promise<number> {
  const me = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (!me?.email) return 0;
  const ps = await prisma.workProject.findMany({ where: { workspaceId, deletedAt: null }, select: { id: true, settings: true } });
  let n = 0;
  for (const p of ps) {
    const list = ((p.settings as { cuongMiniPlannedOwners?: unknown } | null)?.cuongMiniPlannedOwners ?? null) as Array<{ email: string }> | null;
    if (Array.isArray(list) && list.some((x) => x.email?.toLowerCase() === me.email.toLowerCase())) n += await applyPlannedOwnersForEmail(p.id, me.email);
  }
  return n;
}

async function applyPlannedOwnersForEmail(projectId: number, email: string): Promise<number> {
  const user = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } }, select: { id: true } });
  if (!user) return 0;
  const a = await loadProjectAccess(user.id, projectId);
  if (!a || !can(a.role, 'issue.edit')) return 0;
  const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { settings: true } });
  const settings = { ...((p.settings as Record<string, unknown>) ?? {}) };
  const list = (Array.isArray(settings.cuongMiniPlannedOwners) ? settings.cuongMiniPlannedOwners : []) as Array<{ email: string; issueIds: number[] }>;
  const mine = list.filter((x) => x.email?.toLowerCase() === email.toLowerCase());
  if (!mine.length) return 0;
  const ids = mine.flatMap((x) => x.issueIds).filter((x) => Number.isInteger(x));
  const free = await prisma.workIssue.findMany({ where: { id: { in: ids }, projectId, assigneeId: null, deletedAt: null }, select: { id: true } });
  if (free.length) {
    await prisma.$transaction(async (tx) => {
      await tx.workIssue.updateMany({ where: { id: { in: free.map((f) => f.id) } }, data: { assigneeId: user.id } });
      await tx.workHistory.createMany({ data: free.map((f) => ({ issueId: f.id, actorId: null, actorKind: 'SYSTEM', field: 'assigneeId', toValue: String(user.id) })) });
      await tx.workWatcher.createMany({ data: free.map((f) => ({ issueId: f.id, userId: user.id })), skipDuplicates: true });
    });
  }
  settings.cuongMiniPlannedOwners = list.filter((x) => x.email?.toLowerCase() !== email.toLowerCase());
  await prisma.workProject.update({ where: { id: projectId }, data: { settings: settings as Prisma.InputJsonValue } });
  return free.length;
}
