/**
 * CT Work 27/10/2026 — CuongMini "hỏi nhanh": GỢI Ý CHUYỂN TRẠNG THÁI thẻ của CHÍNH người dùng (Có / Chưa).
 *
 * Tín hiệu (mỗi thẻ của người đó, chưa DONE):
 *   - CODE_MERGED   PR nhắc KEY-n đã merge                      ⇒ cấu hình "PR merged ⇒ trạng thái" / Review / Done
 *   - CODE_PUSHED   commit nhắc KEY-n lên nhánh mặc định          ⇒ Review (nếu có) / Done
 *   - CHECKLIST_DONE mọi mục "- [ ]" trong mô tả đã tích          ⇒ Done
 *   - SUBTASKS_DONE  mọi thẻ con đã xong                          ⇒ Done
 *   - BASIC_STALE    thẻ cơ bản (cài đặt/đọc/tìm hiểu…) nằm im ≥ 2 ngày ⇒ CÂU HỎI "bạn làm xong chưa?" (không khẳng định)
 * Đích theo workflow THẬT của thẻ (goiYChuyenTheRules.chonDich). Bấm "Có" ⇒ chuyển qua cửa ghi chung (updateIssueAs ⇒
 * applyIssueChange: đúng quyền người đó + luật Done/DoD/review độc lập) + bình luận NỘI BỘ soạn sẵn kèm bằng chứng (cờ isAi,
 * không chữ "AI"). "Chưa" ⇒ hoãn 3 ngày. Mỗi thẻ hiện tối đa một lần / 3 ngày (WorkStatusNudge).
 * Quyền: người có `issue.transition` (ADMIN/MEMBER) — VIEWER / CLIENT / giảng viên không; AI agent không.
 */

import { prisma } from '../../config/database.js';
import { BadRequestError, ConflictError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { workflowOf } from '../../mcp/issueView.js';
import { markdownToTiptap } from './docMarkdown.js';
import { addComment, updateIssueAs } from './issues.service.js';
import { assertHumanActor, isClientScoped, requireProject, type ProjectAccess } from './permissions.js';
import { projectLanguage } from './projectLanguage.js';
import { BASIC_STALE_DAYS, chonDich, isBasicIssue, nudgeVisible, NUDGE_WINDOW_MS, type NudgeKind, type StatusLite } from './goiYChuyenTheRules.js';

export interface NudgeEvidence { type: 'pr' | 'commit' | 'checklist' | 'subtasks' | 'idle'; label: string; url: string | null }
export interface StatusSuggestion {
  issue: { number: number; key: string; title: string };
  from: StatusLite; to: StatusLite; kind: NudgeKind; question: boolean;
  reason: string; evidence: NudgeEvidence[];
}

async function gate(userId: number, projectId: number): Promise<ProjectAccess> {
  await assertHumanActor(userId, 'use status suggestions');
  const access = await requireProject(userId, projectId, 'issue.transition');
  if (access.role === 'CLIENT' || isClientScoped(access)) throw new NotFoundError('Project not found');
  return access;
}

const DEFAULT_BRANCHES = ['main', 'master', 'develop', 'dev'];

/** Tính gợi ý (không đụng bảng hoãn) cho các thẻ của người dùng. `only` = chỉ thẻ này. */
async function compute(userId: number, access: ProjectAccess, only?: number): Promise<StatusSuggestion[]> {
  const projectId = access.projectId;
  const now = new Date();
  const vi = (await projectLanguage(projectId)) === 'vi';
  const [project, gh, gl] = await Promise.all([
    prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { settings: true } }),
    prisma.workGithubConnection.findUnique({ where: { projectId }, select: { config: true } }),
    prisma.workGitlabConnection.findUnique({ where: { projectId }, select: { config: true } }),
  ]);
  const reviewStatusId = ((project.settings as { agents?: { reviewStatusId?: unknown } } | null)?.agents?.reviewStatusId as number | undefined) ?? null;
  const ghCfg = (gh?.config ?? {}) as { prMergedStatusId?: number | null };
  const glCfg = (gl?.config ?? {}) as { mrMergedStatusId?: number | null };
  const prMergedStatusId = ghCfg.prMergedStatusId ?? glCfg.mrMergedStatusId ?? null;

  const issues = await prisma.workIssue.findMany({
    where: { projectId, assigneeId: userId, deletedAt: null, status: { category: { not: 'DONE' } }, ...(only ? { number: only } : {}) },
    orderBy: { updatedAt: 'asc' }, take: 200,
    select: {
      id: true, number: true, title: true, typeId: true, updatedAt: true, descriptionJson: true,
      status: { select: { id: true, name: true, category: true } },
      labels: { select: { label: { select: { name: true } } } },
      children: { where: { deletedAt: null }, select: { status: { select: { category: true } } } },
    },
  });
  if (!issues.length) return [];
  const nums = issues.map((i) => i.number);
  const [merged, pushes] = await Promise.all([
    prisma.workGitPull.findMany({ where: { projectId, state: 'merged', issueNumbers: { hasSome: nums } }, orderBy: { mergedAt: 'desc' }, select: { number: true, title: true, url: true, issueNumbers: true, provider: true } }),
    prisma.workGitEvent.findMany({ where: { projectId, kind: 'PUSH', ref: { in: DEFAULT_BRANCHES }, issueNumbers: { hasSome: nums } }, orderBy: { occurredAt: 'desc' }, take: 200, select: { ref: true, commits: true } }),
  ]);
  const { checklistOf } = await import('./toolRegistry/memberOps.js'); // nhập động: registry kéo theo nhiều service
  const wfCache = new Map<number, Awaited<ReturnType<typeof workflowOf>>>();
  const out: StatusSuggestion[] = [];
  for (const it of issues) {
    const key = `${access.key}-${it.number}`;
    const evidence: NudgeEvidence[] = [];
    let kind: NudgeKind | null = null;
    const prs = merged.filter((p) => p.issueNumbers.includes(it.number));
    if (prs.length) {
      kind = 'CODE_MERGED';
      for (const p of prs.slice(0, 3)) evidence.push({ type: 'pr', label: `${p.provider === 'GITLAB' ? '!' : '#'}${p.number} ${p.title}`.slice(0, 160), url: p.url });
    }
    if (!kind) {
      const commits = pushes.flatMap((e) => ((Array.isArray(e.commits) ? e.commits : []) as any[]).filter((c) => Array.isArray(c?.issueNumbers) && c.issueNumbers.includes(it.number)).map((c) => ({ c, ref: e.ref })));
      if (commits.length) {
        kind = 'CODE_PUSHED';
        for (const { c, ref } of commits.slice(0, 3)) evidence.push({ type: 'commit', label: `${String(c.sha ?? '').slice(0, 7)} ${String(c.message ?? '').split('\n')[0]} (${ref})`.slice(0, 160), url: c.url ? String(c.url) : null });
      }
    }
    if (!kind) {
      const cl = checklistOf(it.descriptionJson);
      if (cl.length && cl.every((x) => x.checked)) {
        kind = 'CHECKLIST_DONE';
        evidence.push({ type: 'checklist', label: vi ? `Đã tích đủ ${cl.length}/${cl.length} mục checklist` : `All ${cl.length} checklist items ticked`, url: null });
      }
    }
    if (!kind && it.children.length && it.children.every((c) => c.status.category === 'DONE')) {
      kind = 'SUBTASKS_DONE';
      evidence.push({ type: 'subtasks', label: vi ? `${it.children.length}/${it.children.length} thẻ con đã xong` : `${it.children.length}/${it.children.length} subtasks done`, url: null });
    }
    if (!kind && isBasicIssue(it.title, it.labels.map((l) => l.label.name)) && now.getTime() - it.updatedAt.getTime() >= BASIC_STALE_DAYS * 86_400_000) {
      kind = 'BASIC_STALE';
      const days = Math.floor((now.getTime() - it.updatedAt.getTime()) / 86_400_000);
      evidence.push({ type: 'idle', label: vi ? `Không cập nhật ${days} ngày` : `No update for ${days} days`, url: null });
    }
    if (!kind) continue;
    let wf = wfCache.get(it.typeId);
    if (!wf) { wf = await workflowOf(projectId, it.typeId); wfCache.set(it.typeId, wf); }
    const to = chonDich({ statuses: wf.statuses, current: it.status, allowed: wf.allowedFrom(it.status.id), kind, reviewStatusId, prMergedStatusId });
    if (!to) continue;
    const question = kind === 'BASIC_STALE';
    const reason = vi
      ? ({ CODE_MERGED: 'PR của thẻ đã được merge', CODE_PUSHED: 'Đã có commit của thẻ trên nhánh chính', CHECKLIST_DONE: 'Checklist của thẻ đã tích đủ', SUBTASKS_DONE: 'Các thẻ con đã xong hết', BASIC_STALE: `Thẻ cơ bản nằm ở "${it.status.name}" khá lâu — bạn làm xong chưa?` } as const)[kind]
      : ({ CODE_MERGED: 'Its pull request was merged', CODE_PUSHED: 'Commits for it are on the main branch', CHECKLIST_DONE: 'Its checklist is fully ticked', SUBTASKS_DONE: 'All its subtasks are done', BASIC_STALE: `A basic task sitting in "${it.status.name}" for a while — is it done?` } as const)[kind];
    out.push({ issue: { number: it.number, key, title: it.title }, from: it.status, to, kind, question, reason, evidence });
  }
  // Có bằng chứng code trước, rồi checklist/thẻ con, câu hỏi thẻ cơ bản sau cùng.
  const rank: Record<NudgeKind, number> = { CODE_MERGED: 0, CODE_PUSHED: 1, CHECKLIST_DONE: 2, SUBTASKS_DONE: 3, BASIC_STALE: 4 };
  return out.sort((a, b) => rank[a.kind] - rank[b.kind]);
}

/**
 * Gợi ý đang được HIỆN cho người dùng ở dự án (đã lọc hoãn/cửa sổ 3 ngày). Ghi lastShownAt khi mở cửa sổ hỏi mới.
 * `limit` mặc định 3 (thẻ nhỏ "CuongMini hỏi nhanh").
 */
export async function goiYChuyenThe(userId: number, projectId: number, opts: { limit?: number; record?: boolean } = {}): Promise<{ items: StatusSuggestion[]; total: number }> {
  const access = await gate(userId, projectId);
  const all = await compute(userId, access);
  if (!all.length) return { items: [], total: 0 };
  const issueIds = await prisma.workIssue.findMany({ where: { projectId, number: { in: all.map((s) => s.issue.number) } }, select: { id: true, number: true } });
  const idOf = new Map(issueIds.map((r) => [r.number, r.id]));
  const rows = await prisma.workStatusNudge.findMany({ where: { userId, issueId: { in: [...idOf.values()] } } });
  const rowOf = new Map(rows.map((r) => [r.issueId, r]));
  const now = new Date();
  const visible: StatusSuggestion[] = [];
  const open: number[] = [];
  for (const s of all) {
    const id = idOf.get(s.issue.number)!;
    const v = nudgeVisible(rowOf.get(id) ?? null, now);
    if (!v.show) continue;
    visible.push(s);
    if (v.openWindow) open.push(id);
  }
  const limit = Math.min(Math.max(opts.limit ?? 3, 1), 20);
  const items = visible.slice(0, limit);
  if (opts.record !== false) {
    const shownIds = new Set(items.map((s) => idOf.get(s.issue.number)!));
    for (const id of open.filter((x) => shownIds.has(x))) {
      await prisma.workStatusNudge.upsert({
        where: { issueId_userId: { issueId: id, userId } },
        create: { projectId, issueId: id, userId, lastShownAt: now },
        update: { lastShownAt: now, snoozedUntil: null, answer: null, answeredAt: null },
      });
    }
  }
  return { items, total: visible.length };
}

/** Gợi ý của mọi dự án người dùng làm (trang "Việc của tôi") — tối đa `limit`, dự án nào lỗi quyền thì bỏ qua. */
export async function goiYCuaToi(userId: number, opts: { limit?: number } = {}) {
  await assertHumanActor(userId, 'use status suggestions');
  const pids = await prisma.workIssue.findMany({
    where: { assigneeId: userId, deletedAt: null, status: { category: { not: 'DONE' } }, project: { deletedAt: null, archivedAt: null } },
    distinct: ['projectId'], select: { projectId: true, project: { select: { key: true, name: true, workspace: { select: { slug: true } } } } }, take: 30,
  });
  const limit = Math.min(Math.max(opts.limit ?? 3, 1), 20);
  const out: Array<StatusSuggestion & { project: { id: number; key: string; name: string; slug: string } }> = [];
  for (const p of pids) {
    if (out.length >= limit) break;
    try {
      const r = await goiYChuyenThe(userId, p.projectId, { limit: limit - out.length });
      for (const s of r.items) out.push({ ...s, project: { id: p.projectId, key: p.project.key, name: p.project.name, slug: p.project.workspace.slug } });
    } catch { /* không còn quyền chuyển ở dự án này ⇒ bỏ qua */ }
  }
  return { items: out.slice(0, limit) };
}

async function nudgeRow(userId: number, projectId: number, number: number) {
  const issue = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true, assigneeId: true } });
  if (!issue) throw new NotFoundError('Issue not found');
  return issue;
}

/** "Chưa" ⇒ hoãn 3 ngày. */
export async function snoozeGoiY(userId: number, projectId: number, number: number) {
  await gate(userId, projectId);
  const issue = await nudgeRow(userId, projectId, number);
  const now = new Date();
  const until = new Date(now.getTime() + NUDGE_WINDOW_MS);
  await prisma.workStatusNudge.upsert({
    where: { issueId_userId: { issueId: issue.id, userId } },
    create: { projectId, issueId: issue.id, userId, lastShownAt: now, snoozedUntil: until, answer: 'NOT_YET', answeredAt: now },
    update: { snoozedUntil: until, answer: 'NOT_YET', answeredAt: now },
  });
  return { snoozedUntil: until.toISOString() };
}

/**
 * "Có, chuyển" ⇒ tính LẠI gợi ý của đúng thẻ này (dữ liệu có thể đã đổi), chuyển trạng thái dưới quyền người bấm (cửa ghi
 * chung — luật Done/DoD/review độc lập vẫn áp), rồi bình luận NỘI BỘ kèm bằng chứng + ghi chú/ảnh người dùng gửi.
 */
export async function applyGoiY(userId: number, projectId: number, number: number, input: { note?: string | null; attachmentIds?: number[] } = {}) {
  const access = await gate(userId, projectId);
  const issue = await nudgeRow(userId, projectId, number);
  if (issue.assigneeId !== userId) throw new BadRequestError('This issue is not assigned to you', 'WORK_NUDGE_NOT_YOURS');
  const [s] = await compute(userId, access, number);
  if (!s) throw new ConflictError('There is nothing to suggest for this issue any more — it may have moved already');
  await updateIssueAs(userId, projectId, number, { statusId: s.to.id });
  const vi = (await projectLanguage(projectId)) === 'vi';
  const lines = [
    vi ? `**Chuyển ${s.from.name} → ${s.to.name}** — ${s.reason.replace(/ — bạn làm xong chưa\?$/, '')}` : `**Moved ${s.from.name} → ${s.to.name}** — ${s.reason.replace(/ — is it done\?$/, '')}`,
    s.question ? (vi ? 'Thành viên xác nhận đã làm xong.' : 'The member confirmed it is done.') : '',
    s.evidence.length ? `${vi ? 'Bằng chứng' : 'Evidence'}:\n${s.evidence.map((e) => `- ${e.url ? `[${e.label}](${e.url})` : e.label}`).join('\n')}` : '',
    input.note?.trim() ? `${vi ? 'Ghi chú' : 'Note'}: ${input.note.trim().slice(0, 2000)}` : '',
  ].filter(Boolean).join('\n\n');
  let commented = false;
  try {
    await addComment(userId, projectId, number, markdownToTiptap(lines).doc as never, 'AI', undefined, { attachmentIds: (input.attachmentIds ?? []).slice(0, 10) });
    commented = true;
  } catch (err) {
    logger.warn('[work] gợi ý chuyển thẻ: không đăng được bình luận', { projectId, number, err: (err as Error).message });
  }
  const now = new Date();
  await prisma.workStatusNudge.upsert({
    where: { issueId_userId: { issueId: issue.id, userId } },
    create: { projectId, issueId: issue.id, userId, lastShownAt: now, answer: 'APPLIED', answeredAt: now },
    update: { answer: 'APPLIED', answeredAt: now, snoozedUntil: null },
  });
  return { issue: s.issue.key, number, from: s.from.name, to: s.to.name, commented };
}
