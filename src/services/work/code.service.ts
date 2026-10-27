/**
 * CT Work — trang "Code" của dự án (18/10/2026): xem hoạt động Git như GitHub ngay trong CT Work.
 *
 *   overview     — repo đã nối + số liệu nhỏ (commit 7 ngày, PR mở, người đóng góp 30 ngày, biểu đồ theo ngày)
 *   activity     — dòng thời gian: push (người đẩy, nhánh, từng commit gắn người qua WorkGitIdentity/email), tạo/xoá nhánh,
 *                  PR mở/merge/đóng, yêu cầu review; lọc người / nhánh / thời gian. Dữ liệu TRƯỚC khi có bảng sự kiện
 *                  (commit/PR trong work_dev_contributions) hiện như "commit lẻ" để lịch sử không trống.
 *   branches     — nhánh, commit cuối, ai, thẻ liên quan (mã thẻ trong tên nhánh / commit), PR đang mở của nhánh
 *   pulls        — PR / MR: mở / merge / đóng, người tạo, reviewer, thẻ liên quan
 *   issueDev     — panel Development trong thẻ: commit nhóm theo PR / nhánh
 *   source*      — mã nguồn qua gitSource.ts (proxy có xác thực)
 *   notifyGit    — thông báo khi có push / PR mở / PR merge / yêu cầu review + một dòng vào kênh chat đã chọn
 *
 * QUYỀN (một chỗ: `codeGate`): thành viên dự án xem được (ADMIN/MEMBER/VIEWER/TEACHER); vai CLIENT (khách) ⇒ 403 — khách
 * không thấy mã, kể cả dự án không bật cổng khách. Agent ĐỌC được hoạt động (MCP dev_activity) nhưng KHÔNG xem mã nguồn.
 * Người ngoài dự án ⇒ 404 như mọi tuyến dự án (không cho biết dự án tồn tại).
 */

import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { displayName, type PublicUser } from './common.js';
import { identityResolver } from './contribRules.js';
import type { RecordedGitEvent } from './gitEvents.js';
import * as src from './gitSource.js';
import { agentForbidden, requireProject, type ProjectAccess } from './permissions.js';
import { projectMembers } from './projects.service.js';
import { vnDay } from './sprints.service.js';

export type Provider = 'GITHUB' | 'GITLAB';
interface ConnConfig { chatChannelId?: number | null; notify?: boolean; webBase?: string | null }

// ─── Quyền ───────────────────────────────────────────────────────

export async function codeGate(userId: number, projectId: number, opts: { source?: boolean } = {}): Promise<ProjectAccess> {
  const access = await requireProject(userId, projectId, 'project.view');
  if (access.role === 'CLIENT') throw new AppError('Code is only available to the project team', 403, 'WORK_CODE_FORBIDDEN');
  if (opts.source && access.principal === 'AGENT') throw await agentForbidden(userId, 'read the source code');
  return access;
}

// ─── Người ↔ danh tính git ───────────────────────────────────────

export interface Who { user: PublicUser | null; label: string }
interface Ctx {
  key: string;
  slug: string;
  leadId: number | null;
  members: Array<PublicUser & { role: string }>;
  users: Map<number, PublicUser>;
  resolve: (a: { login?: string | null; email?: string | null; name?: string | null }) => number | null;
}

async function loadCtx(projectId: number): Promise<Ctx> {
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true, leadId: true, workspace: { select: { slug: true } } } });
  const members = await projectMembers(projectId);
  const [identities, emails] = await Promise.all([
    prisma.workGitIdentity.findMany({ where: { projectId }, select: { identity: true, userId: true } }),
    prisma.user.findMany({ where: { id: { in: members.map((m) => m.id) } }, select: { id: true, email: true } }),
  ]);
  const emailOf = new Map(emails.map((e) => [e.id, e.email]));
  const resolve = identityResolver(
    members.map((m) => ({ id: m.id, username: m.username, fullName: m.fullName, displayName: m.displayName, email: emailOf.get(m.id) ?? null })),
    new Map(identities.map((x) => [x.identity, x.userId])),
  );
  const users = new Map<number, PublicUser>(members.map((m) => [m.id, { id: m.id, username: m.username, fullName: m.fullName, displayName: m.displayName, avatarUrl: m.avatarUrl, kind: m.kind }]));
  return { key: project.key, slug: project.workspace.slug, leadId: project.leadId, members, users, resolve };
}

function who(ctx: Ctx, a: { login?: string | null; name?: string | null; email?: string | null }): Who {
  const id = ctx.resolve(a);
  const user = id ? ctx.users.get(id) ?? null : null;
  return { user, label: a.login || a.name || (a.email ? a.email.replace(/@.*/, '') : '') || 'unknown' };
}
const whoKey = (w: Who) => (w.user ? `u:${w.user.id}` : `g:${w.label.toLowerCase()}`);
const whoName = (w: Who) => (w.user ? displayName(w.user) : w.label);

export interface IssueRef { number: number; key: string; title: string; status: { name: string; category: string } | null; assigneeId: number | null }

async function issueRefs(projectId: number, key: string, nums: Iterable<number>): Promise<Record<number, IssueRef>> {
  const list = [...new Set(nums)].filter((n) => Number.isInteger(n) && n > 0).slice(0, 500);
  if (!list.length) return {};
  const rows = await prisma.workIssue.findMany({
    where: { projectId, number: { in: list }, deletedAt: null },
    select: { number: true, title: true, assigneeId: true, status: { select: { name: true, category: true } } },
  });
  const out: Record<number, IssueRef> = {};
  for (const r of rows) out[r.number] = { number: r.number, key: `${key}-${r.number}`, title: r.title, status: r.status ? { name: r.status.name, category: r.status.category } : null, assigneeId: r.assigneeId };
  return out;
}

async function connections(projectId: number) {
  const [gh, gl] = await Promise.all([
    prisma.workGithubConnection.findUnique({ where: { projectId } }),
    prisma.workGitlabConnection.findUnique({ where: { projectId } }),
  ]);
  return { gh, gl };
}

// ─── Tổng quan + số liệu ─────────────────────────────────────────

/** Rẻ: dự án có nối GitHub/GitLab không (thanh bên chỉ hiện mục "Code" khi có). */
export async function status(userId: number, projectId: number) {
  await codeGate(userId, projectId);
  const { gh, gl } = await connections(projectId);
  return { connected: !!(gh || gl), providers: [...(gh ? ['GITHUB' as const] : []), ...(gl ? ['GITLAB' as const] : [])] };
}


export async function overview(userId: number, projectId: number) {
  const access = await codeGate(userId, projectId);
  const { gh, gl } = await connections(projectId);
  const ctx = await loadCtx(projectId);
  const now = Date.now();
  const since30 = new Date(now - 30 * 86_400_000);
  const since7 = new Date(now - 7 * 86_400_000);
  const [commits30, pushes30, openPulls, legacyOpenPrs, eventCount] = await Promise.all([
    prisma.workDevContribution.findMany({ where: { projectId, kind: 'COMMIT', occurredAt: { gte: since30 } }, select: { occurredAt: true, authorLogin: true, authorName: true, authorEmail: true }, take: 5000 }),
    prisma.workGitEvent.findMany({ where: { projectId, kind: 'PUSH', occurredAt: { gte: since30 } }, select: { occurredAt: true, actorLogin: true, actorName: true, actorEmail: true }, take: 5000 }),
    prisma.workGitPull.findMany({ where: { projectId, state: { in: ['open', 'draft'] } }, select: { provider: true, number: true } }),
    prisma.workDevContribution.findMany({ where: { projectId, kind: 'PR', state: { in: ['open', 'draft'] } }, select: { externalId: true } }),
    prisma.workGitEvent.count({ where: { projectId } }),
  ]);
  const known = new Set(openPulls.map((p) => p.number));
  const legacyOpen = legacyOpenPrs.map((p) => prNumberOf(p.externalId)).filter((n): n is number => n !== null && !known.has(n));

  const days: Array<{ day: string; commits: number; pushes: number }> = [];
  const idx = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = vnDay(new Date(now - i * 86_400_000));
    idx.set(d, days.length);
    days.push({ day: d, commits: 0, pushes: 0 });
  }
  const people = new Map<string, Who>();
  for (const c of commits30) {
    const i = idx.get(vnDay(c.occurredAt));
    if (i !== undefined) days[i].commits += 1;
    const w = who(ctx, { login: c.authorLogin, name: c.authorName, email: c.authorEmail });
    people.set(whoKey(w), w);
  }
  for (const p of pushes30) {
    const i = idx.get(vnDay(p.occurredAt));
    if (i !== undefined) days[i].pushes += 1;
    const w = who(ctx, { login: p.actorLogin, name: p.actorName, email: p.actorEmail });
    people.set(whoKey(w), w);
  }
  const providers = [
    ...(gh ? [{ provider: 'GITHUB' as const, repo: gh.repoFullName, webUrl: gh.repoFullName ? `https://github.com/${gh.repoFullName}` : null, lastEventAt: gh.lastEventAt, hasReadToken: !!gh.readToken }] : []),
    ...(gl ? [{ provider: 'GITLAB' as const, repo: gl.repoPath, webUrl: gl.repoPath ? `${gitlabWeb(gl.config)}/${gl.repoPath}` : null, lastEventAt: gl.lastEventAt, hasReadToken: !!gl.readToken }] : []),
  ];
  return {
    connected: providers.length > 0,
    providers,
    canManage: access.role === 'ADMIN',
    canViewSource: access.principal !== 'AGENT',
    trackedSince: eventCount ? (await prisma.workGitEvent.findFirst({ where: { projectId }, orderBy: { occurredAt: 'asc' }, select: { occurredAt: true } }))?.occurredAt ?? null : null,
    stats: {
      commits7d: commits30.filter((c) => c.occurredAt >= since7).length,
      pushes7d: pushes30.filter((p) => p.occurredAt >= since7).length,
      openPrs: openPulls.length + legacyOpen.length,
      contributors30d: [...people.values()].map((w) => ({ key: whoKey(w), user: w.user, label: w.label })).slice(0, 50),
      daily: days,
    },
  };
}

/** "owner/repo#12" | "group/p!12" | "#12 title" ⇒ 12. */
export function prNumberOf(s: string | null | undefined): number | null {
  const m = /[#!](\d{1,9})(?!\d)/.exec(String(s ?? ''));
  return m ? Number(m[1]) : null;
}

const gitlabWeb = (config: unknown) => src.safeGitlabBase((config as ConnConfig | null)?.webBase) ?? 'https://gitlab.com';

// ─── Dòng thời gian ──────────────────────────────────────────────

export const ACTIVITY_KINDS = ['PUSH', 'BRANCH_CREATED', 'BRANCH_DELETED', 'PR_OPENED', 'PR_REOPENED', 'PR_MERGED', 'PR_CLOSED', 'REVIEW_REQUESTED'] as const;
export interface ActivityQuery { actor?: string; branch?: string; from?: string; to?: string; kind?: 'push' | 'branch' | 'pr'; before?: string; limit?: number }

interface CommitOut { sha: string; message: string; url: string | null; at: string | null; author: Who; issueNumbers: number[]; files: number | null }
interface ActivityItem {
  id: string; kind: string; provider: string; repo: string | null; ref: string | null; actor: Who; title: string | null; url: string | null;
  prNumber: number | null; commitCount: number; commits: CommitOut[]; data: Record<string, unknown>; issueNumbers: number[]; occurredAt: string; legacy?: boolean;
}

const dayStart = (d: string) => new Date(`${d}T00:00:00+07:00`);
const dayEnd = (d: string) => new Date(new Date(`${d}T00:00:00+07:00`).getTime() + 86_400_000);

export async function activity(userId: number, projectId: number, q: ActivityQuery) {
  await codeGate(userId, projectId);
  const ctx = await loadCtx(projectId);
  const limit = Math.min(Math.max(q.limit ?? 30, 1), 100);
  const before = q.before ? new Date(q.before) : null;
  if (before && Number.isNaN(before.getTime())) throw new BadRequestError('Invalid cursor', 'VALIDATION_ERROR');
  const occurred: { lt?: Date; gte?: Date } = {};
  if (q.from) occurred.gte = dayStart(q.from);
  const toEnd = q.to ? dayEnd(q.to) : null;
  const lt = [before, toEnd].filter((d): d is Date => !!d).sort((a, b) => a.getTime() - b.getTime())[0];
  if (lt) occurred.lt = lt;
  const kinds = q.kind === 'push' ? ['PUSH'] : q.kind === 'branch' ? ['BRANCH_CREATED', 'BRANCH_DELETED'] : q.kind === 'pr' ? ['PR_OPENED', 'PR_REOPENED', 'PR_MERGED', 'PR_CLOSED', 'REVIEW_REQUESTED'] : null;
  const scan = q.actor ? 400 : limit + 1;

  const rows = await prisma.workGitEvent.findMany({
    where: { projectId, ...(q.branch ? { ref: q.branch } : {}), ...(kinds ? { kind: { in: kinds } } : {}), ...(Object.keys(occurred).length ? { occurredAt: occurred } : {}) },
    orderBy: [{ occurredAt: 'desc' }, { id: 'desc' }],
    take: scan,
  });
  const mapCommit = (c: any): CommitOut => ({
    sha: String(c.sha ?? ''), message: String(c.message ?? ''), url: c.url ?? null, at: c.at ?? null,
    author: who(ctx, { login: c.authorLogin, name: c.authorName, email: c.authorEmail }), issueNumbers: Array.isArray(c.issueNumbers) ? c.issueNumbers : [], files: c.files ?? null,
  });
  let items: ActivityItem[] = rows.map((r) => ({
    id: `e${r.id}`, kind: r.kind, provider: r.provider, repo: r.repo, ref: r.ref,
    actor: who(ctx, { login: r.actorLogin, name: r.actorName, email: r.actorEmail }), title: r.title, url: r.url, prNumber: r.prNumber,
    commitCount: r.commitCount, commits: (Array.isArray(r.commits) ? r.commits : []).map(mapCommit), data: (r.data ?? {}) as Record<string, unknown>,
    issueNumbers: r.issueNumbers, occurredAt: r.occurredAt.toISOString(),
  }));

  // Lịch sử TRƯỚC khi có bảng sự kiện: commit / PR lẻ từ work_dev_contributions (không có nhánh ⇒ bỏ khi lọc theo nhánh).
  if (!q.branch && q.kind !== 'branch') {
    const first = await prisma.workGitEvent.findFirst({ where: { projectId }, orderBy: { occurredAt: 'asc' }, select: { occurredAt: true } });
    const cut = [first?.occurredAt, occurred.lt].filter((d): d is Date => !!d).sort((a, b) => a.getTime() - b.getTime())[0];
    const legacy = await prisma.workDevContribution.findMany({
      where: { projectId, ...(q.kind === 'push' ? { kind: 'COMMIT' } : q.kind === 'pr' ? { kind: 'PR' } : {}), occurredAt: { ...(cut ? { lt: cut } : {}), ...(occurred.gte ? { gte: occurred.gte } : {}) } },
      orderBy: [{ occurredAt: 'desc' }, { id: 'desc' }],
      take: scan,
    });
    items = items.concat(legacy.map((c): ActivityItem => {
      const author = who(ctx, { login: c.authorLogin, name: c.authorName, email: c.authorEmail });
      return c.kind === 'COMMIT'
        ? {
          id: `c${c.id}`, kind: 'COMMIT', provider: c.provider, repo: c.repo, ref: null, actor: author, title: c.title, url: c.url, prNumber: null, commitCount: 1,
          commits: [{ sha: c.externalId, message: c.title ?? '', url: c.url, at: c.occurredAt.toISOString(), author, issueNumbers: c.issueNumbers, files: c.filesChanged }],
          data: { additions: c.additions, deletions: c.deletions }, issueNumbers: c.issueNumbers, occurredAt: c.occurredAt.toISOString(), legacy: true,
        }
        : {
          id: `c${c.id}`, kind: c.state === 'merged' ? 'PR_MERGED' : c.state === 'closed' ? 'PR_CLOSED' : 'PR_OPENED', provider: c.provider, repo: c.repo, ref: null, actor: author,
          title: (c.title ?? '').replace(/^[#!]\d+\s*/, ''), url: c.url, prNumber: prNumberOf(c.externalId), commitCount: 0, commits: [], data: { additions: c.additions, deletions: c.deletions },
          issueNumbers: c.issueNumbers, occurredAt: c.occurredAt.toISOString(), legacy: true,
        };
    }));
    items.sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : a.occurredAt > b.occurredAt ? -1 : 0));
  }

  if (q.actor) {
    const want = q.actor.toLowerCase();
    items = items.filter((i) => whoKey(i.actor) === want || i.commits.some((c) => whoKey(c.author) === want));
  }
  const page = items.slice(0, limit);
  const more = items.length > limit;
  const issues = await issueRefs(projectId, ctx.key, page.flatMap((i) => [...i.issueNumbers, ...i.commits.flatMap((c) => c.issueNumbers)]));

  // Lựa chọn cho bộ lọc: người (đã khớp trước, rồi danh tính git) + nhánh.
  const [recentActors, legacyAuthors, branchRows] = await Promise.all([
    prisma.workGitEvent.findMany({ where: { projectId }, orderBy: { occurredAt: 'desc' }, take: 300, select: { actorLogin: true, actorName: true, actorEmail: true, commits: true } }),
    prisma.workDevContribution.groupBy({ by: ['authorLogin', 'authorName', 'authorEmail'], where: { projectId }, _count: { _all: true } }),
    prisma.workGitBranch.findMany({ where: { projectId }, orderBy: [{ lastPushAt: { sort: 'desc', nulls: 'last' } }], take: 200, select: { name: true, deletedAt: true } }),
  ]);
  const actors = new Map<string, Who>();
  const addActor = (w: Who) => { if (w.label !== 'unknown' || w.user) actors.set(whoKey(w), w); };
  for (const r of recentActors) {
    addActor(who(ctx, { login: r.actorLogin, name: r.actorName, email: r.actorEmail }));
    for (const c of (Array.isArray(r.commits) ? r.commits : []) as any[]) addActor(who(ctx, { login: c.authorLogin, name: c.authorName, email: c.authorEmail }));
  }
  for (const a of legacyAuthors) addActor(who(ctx, { login: a.authorLogin, name: a.authorName, email: a.authorEmail }));

  return {
    items: page,
    nextBefore: more ? page[page.length - 1]?.occurredAt ?? null : null,
    issues,
    filters: {
      actors: [...actors.entries()].map(([value, w]) => ({ value, label: whoName(w), user: w.user })).sort((a, b) => Number(!!b.user) - Number(!!a.user) || a.label.localeCompare(b.label)),
      branches: branchRows.map((b) => ({ name: b.name, deleted: !!b.deletedAt })),
    },
  };
}

// ─── Nhánh ───────────────────────────────────────────────────────

export async function branches(userId: number, projectId: number) {
  await codeGate(userId, projectId);
  const ctx = await loadCtx(projectId);
  const [rows, open, legacy] = await Promise.all([
    prisma.workGitBranch.findMany({ where: { projectId }, orderBy: [{ lastPushAt: { sort: 'desc', nulls: 'last' } }, { name: 'asc' }], take: 500 }),
    prisma.workGitPull.findMany({ where: { projectId, state: { in: ['open', 'draft'] } }, select: { number: true, title: true, url: true, state: true, headRef: true, provider: true } }),
    prisma.workDevActivity.findMany({ where: { projectId, kind: 'BRANCH' }, select: { title: true, url: true, author: true, createdAt: true, issue: { select: { number: true } } } }),
  ]);
  const prOf = new Map(open.filter((p) => p.headRef).map((p) => [`${p.provider}:${p.headRef}`, p]));
  const items = rows.map((b) => ({
    name: b.name, provider: b.provider, headSha: b.headSha, lastCommit: b.lastCommitTitle ? { title: b.lastCommitTitle, url: b.lastCommitUrl } : null,
    lastAuthor: b.lastAuthorLogin || b.lastAuthorName || b.lastAuthorEmail ? who(ctx, { login: b.lastAuthorLogin, name: b.lastAuthorName, email: b.lastAuthorEmail }) : null,
    lastPushAt: b.lastPushAt?.toISOString() ?? null, commitCount: b.commitCount, deleted: !!b.deletedAt, deletedAt: b.deletedAt?.toISOString() ?? null,
    issueNumbers: b.issueNumbers, pr: prOf.get(`${b.provider}:${b.name}`) ?? null, legacy: false,
  }));
  // Nhánh chỉ có ở panel Development cũ (trước khi có bảng nhánh).
  const known = new Set(rows.map((r) => r.name));
  for (const l of legacy) {
    if (known.has(l.title)) continue;
    known.add(l.title);
    items.push({
      name: l.title, provider: l.url.includes('github.com') ? 'GITHUB' : 'GITLAB', headSha: null, lastCommit: null,
      lastAuthor: l.author ? who(ctx, { login: l.author }) : null, lastPushAt: l.createdAt.toISOString(), commitCount: 0, deleted: false, deletedAt: null,
      issueNumbers: [l.issue.number], pr: null, legacy: true,
    });
  }
  items.sort((a, b) => Number(a.deleted) - Number(b.deleted) || (b.lastPushAt ?? '').localeCompare(a.lastPushAt ?? ''));
  return { items, issues: await issueRefs(projectId, ctx.key, items.flatMap((i) => i.issueNumbers)) };
}

// ─── Pull request ────────────────────────────────────────────────

export async function pulls(userId: number, projectId: number, state: 'open' | 'merged' | 'closed' | 'all' = 'all') {
  await codeGate(userId, projectId);
  const ctx = await loadCtx(projectId);
  const [rows, legacy] = await Promise.all([
    prisma.workGitPull.findMany({ where: { projectId }, orderBy: [{ openedAt: 'desc' }], take: 500 }),
    prisma.workDevContribution.findMany({ where: { projectId, kind: 'PR' }, orderBy: { occurredAt: 'desc' }, take: 500 }),
  ]);
  const all = rows.map((p) => ({
    provider: p.provider, number: p.number, title: p.title, url: p.url, state: p.state,
    author: p.authorLogin ? who(ctx, { login: p.authorLogin }) : null, reviewers: p.reviewers.map((r) => who(ctx, { login: r })),
    headRef: p.headRef, baseRef: p.baseRef, issueNumbers: p.issueNumbers, additions: p.additions, deletions: p.deletions, changedFiles: p.changedFiles,
    mergedBy: p.mergedBy ? who(ctx, { login: p.mergedBy }) : null, openedAt: p.openedAt.toISOString(), mergedAt: p.mergedAt?.toISOString() ?? null,
    closedAt: p.closedAt?.toISOString() ?? null, legacy: false,
  }));
  const known = new Set(rows.map((r) => `${r.provider}:${r.number}`));
  for (const c of legacy) {
    const n = prNumberOf(c.externalId);
    if (n === null || known.has(`${c.provider}:${n}`)) continue;
    known.add(`${c.provider}:${n}`);
    all.push({
      provider: c.provider, number: n, title: (c.title ?? '').replace(/^[#!]\d+\s*/, ''), url: c.url, state: c.state ?? 'open',
      author: c.authorLogin || c.authorName ? who(ctx, { login: c.authorLogin, name: c.authorName, email: c.authorEmail }) : null, reviewers: [],
      headRef: null, baseRef: null, issueNumbers: c.issueNumbers, additions: c.additions, deletions: c.deletions, changedFiles: c.filesChanged,
      mergedBy: null, openedAt: c.occurredAt.toISOString(), mergedAt: null, closedAt: null, legacy: true,
    });
  }
  const counts = { open: 0, merged: 0, closed: 0 };
  for (const p of all) counts[p.state === 'merged' ? 'merged' : p.state === 'closed' ? 'closed' : 'open'] += 1;
  const items = all
    .filter((p) => state === 'all' || (state === 'open' ? p.state === 'open' || p.state === 'draft' : p.state === state))
    .sort((a, b) => b.openedAt.localeCompare(a.openedAt));
  return { items, counts, issues: await issueRefs(projectId, ctx.key, items.flatMap((i) => i.issueNumbers)) };
}

// ─── Panel Development trong thẻ ─────────────────────────────────

export async function issueDev(userId: number, projectId: number, number: number) {
  await codeGate(userId, projectId);
  const issue = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true } });
  if (!issue) throw new NotFoundError('Issue not found');
  const ctx = await loadCtx(projectId);
  const { gh, gl } = await connections(projectId);
  const [prs, branchRows, legacy] = await Promise.all([
    prisma.workGitPull.findMany({ where: { projectId, issueNumbers: { has: number } }, orderBy: { openedAt: 'desc' }, take: 30 }),
    prisma.workGitBranch.findMany({ where: { projectId, issueNumbers: { has: number } }, take: 30 }),
    prisma.workDevActivity.findMany({ where: { issueId: issue.id }, orderBy: { updatedAt: 'desc' }, take: 100 }),
  ]);
  const refs = new Set<string>([...branchRows.map((b) => b.name), ...prs.map((p) => p.headRef).filter((r): r is string => !!r)]);
  const events = await prisma.workGitEvent.findMany({
    where: { projectId, kind: 'PUSH', OR: [{ issueNumbers: { has: number } }, ...(refs.size ? [{ ref: { in: [...refs] } }] : [])] },
    orderBy: { occurredAt: 'desc' }, take: 100,
  });
  type C = { sha: string; title: string; url: string | null; at: string | null; author: Who; branch: string | null };
  const seen = new Set<string>();
  const commits: C[] = [];
  for (const e of events) {
    for (const c of ((Array.isArray(e.commits) ? e.commits : []) as any[]).slice().reverse()) {
      const sha = String(c.sha ?? '');
      if (!sha || seen.has(sha)) continue;
      const mentions = Array.isArray(c.issueNumbers) && c.issueNumbers.includes(number);
      if (!mentions && !(e.ref && refs.has(e.ref))) continue;
      seen.add(sha);
      commits.push({ sha, title: String(c.message ?? '').split('\n')[0], url: c.url ?? null, at: c.at ?? e.occurredAt.toISOString(), author: who(ctx, { login: c.authorLogin, name: c.authorName, email: c.authorEmail }), branch: e.ref });
    }
  }
  // Dữ liệu cũ (trước bảng sự kiện): commit / PR / nhánh của panel Development cũ.
  const knownPr = new Set(prs.map((p) => p.number));
  const legacyPrs = legacy.filter((l) => l.kind === 'PR' && !knownPr.has(prNumberOf(l.externalId) ?? -1));
  for (const l of legacy) {
    if (l.kind !== 'COMMIT' || seen.has(l.externalId)) continue;
    seen.add(l.externalId);
    commits.push({ sha: l.externalId, title: l.title, url: l.url, at: l.createdAt.toISOString(), author: who(ctx, { login: l.author, name: l.author }), branch: null });
  }
  const knownBranch = new Set(branchRows.map((b) => b.name));
  const legacyBranches = legacy.filter((l) => l.kind === 'BRANCH' && !knownBranch.has(l.title));

  type Group = { kind: 'PR' | 'BRANCH' | 'OTHER'; key: string; title: string; url: string | null; state: string | null; ref: string | null; number: number | null; author: Who | null; deleted: boolean; commits: C[] };
  const groups: Group[] = [];
  const used = new Set<string>();
  for (const p of prs) {
    const cs = p.headRef ? commits.filter((c) => c.branch === p.headRef) : [];
    if (p.headRef) used.add(p.headRef);
    groups.push({ kind: 'PR', key: `pr-${p.provider}-${p.number}`, title: p.title, url: p.url, state: p.state, ref: p.headRef, number: p.number, author: p.authorLogin ? who(ctx, { login: p.authorLogin }) : null, deleted: false, commits: cs });
  }
  for (const l of legacyPrs) {
    groups.push({ kind: 'PR', key: `lpr-${l.id}`, title: l.title.replace(/^[#!]\d+\s*/, ''), url: l.url, state: l.state, ref: null, number: prNumberOf(l.externalId), author: l.author ? who(ctx, { login: l.author }) : null, deleted: false, commits: [] });
  }
  for (const b of branchRows) {
    if (used.has(b.name)) continue;
    used.add(b.name);
    groups.push({ kind: 'BRANCH', key: `br-${b.provider}-${b.name}`, title: b.name, url: null, state: null, ref: b.name, number: null, author: null, deleted: !!b.deletedAt, commits: commits.filter((c) => c.branch === b.name) });
  }
  for (const l of legacyBranches) {
    if (used.has(l.title)) continue;
    used.add(l.title);
    groups.push({ kind: 'BRANCH', key: `lbr-${l.id}`, title: l.title, url: l.url, state: null, ref: l.title, number: null, author: null, deleted: false, commits: [] });
  }
  const rest = commits.filter((c) => !c.branch || !used.has(c.branch));
  const restBranches = [...new Set(rest.map((c) => c.branch).filter((b): b is string => !!b))];
  for (const name of restBranches) groups.push({ kind: 'BRANCH', key: `rb-${name}`, title: name, url: null, state: null, ref: name, number: null, author: null, deleted: false, commits: rest.filter((c) => c.branch === name) });
  const orphan = rest.filter((c) => !c.branch);
  if (orphan.length) groups.push({ kind: 'OTHER', key: 'other', title: '', url: null, state: null, ref: null, number: null, author: null, deleted: false, commits: orphan });

  return {
    connected: !!(gh || gl),
    codeHref: `/work/${ctx.slug}/${ctx.key}/code`,
    counts: { prs: prs.length + legacyPrs.length, branches: groups.filter((g) => g.kind === 'BRANCH').length, commits: commits.length },
    groups,
  };
}

// ─── Mã nguồn (proxy) ────────────────────────────────────────────

async function target(projectId: number, provider?: Provider): Promise<src.RepoTarget> {
  const { gh, gl } = await connections(projectId);
  const pick: Provider | null = provider ?? (gh?.repoFullName ? 'GITHUB' : gl?.repoPath ? 'GITLAB' : gh ? 'GITHUB' : gl ? 'GITLAB' : null);
  if (pick === 'GITHUB' && gh) {
    if (!gh.repoFullName) throw new AppError('The repository is not known yet — set it in Settings → GitHub, or wait for the first webhook', 409, 'WORK_GIT_NO_REPO');
    return { provider: 'GITHUB', repo: gh.repoFullName, apiBase: 'https://api.github.com', webBase: 'https://github.com', token: src.openReadToken('GITHUB', projectId, gh.readToken), projectId };
  }
  if (pick === 'GITLAB' && gl) {
    if (!gl.repoPath) throw new AppError('The repository is not known yet — set it in Settings → GitLab, or wait for the first webhook', 409, 'WORK_GIT_NO_REPO');
    const web = gitlabWeb(gl.config);
    return { provider: 'GITLAB', repo: gl.repoPath, apiBase: `${web}/api/v4`, webBase: web, token: src.openReadToken('GITLAB', projectId, gl.readToken), projectId };
  }
  throw new NotFoundError('This project is not connected to GitHub or GitLab');
}

export async function sourceMeta(userId: number, projectId: number, provider?: Provider) {
  await codeGate(userId, projectId, { source: true });
  const t = await target(projectId, provider);
  const meta = await src.repoMeta(t);
  return { provider: t.provider, repo: t.repo, hasToken: !!t.token, ...meta };
}
export async function sourceRefs(userId: number, projectId: number, provider?: Provider) {
  await codeGate(userId, projectId, { source: true });
  return src.listRefs(await target(projectId, provider));
}
async function refOrDefault(t: src.RepoTarget, ref: string | null) {
  return ref ?? (await src.repoMeta(t)).defaultBranch;
}
export async function sourceTree(userId: number, projectId: number, q: { ref?: string; path?: string; provider?: Provider }) {
  await codeGate(userId, projectId, { source: true });
  const t = await target(projectId, q.provider);
  const ref = await refOrDefault(t, src.cleanRef(q.ref));
  const path = src.cleanPath(q.path);
  return { ref, path, entries: await src.tree(t, ref, path) };
}
export async function sourceBlob(userId: number, projectId: number, q: { ref?: string; path?: string; provider?: Provider }) {
  await codeGate(userId, projectId, { source: true });
  const t = await target(projectId, q.provider);
  const ref = await refOrDefault(t, src.cleanRef(q.ref));
  return { ref, ...(await src.blob(t, ref, src.cleanPath(q.path))) };
}
export async function sourceCommits(userId: number, projectId: number, q: { ref?: string; path?: string; provider?: Provider }) {
  await codeGate(userId, projectId, { source: true });
  const t = await target(projectId, q.provider);
  const ref = await refOrDefault(t, src.cleanRef(q.ref));
  const ctx = await loadCtx(projectId);
  const list = await src.commits(t, ref, src.cleanPath(q.path));
  return { ref, items: list.map((c) => ({ ...c, author: who(ctx, { login: c.authorLogin, name: c.authorName, email: c.authorEmail }), authorEmail: undefined })) };
}
export async function sourceCommit(userId: number, projectId: number, shaRaw: string, provider?: Provider) {
  await codeGate(userId, projectId, { source: true });
  const t = await target(projectId, provider);
  const ctx = await loadCtx(projectId);
  const c = await src.commit(t, src.cleanSha(shaRaw));
  const issues = await issueRefs(projectId, ctx.key, keyNums(c.message, ctx.key));
  return { ...c, authorEmail: undefined, author: who(ctx, { login: c.authorLogin, name: c.authorName, email: c.authorEmail }), issues };
}

/** 27/10/2026: một PR/MR — tiêu đề, MÔ TẢ, nhánh head/base + sha, tác giả (khớp thành viên), +/−, thẻ nhắc tới. */
export async function sourcePull(userId: number, projectId: number, nRaw: unknown, provider?: Provider) {
  await codeGate(userId, projectId, { source: true });
  const t = await target(projectId, provider);
  const ctx = await loadCtx(projectId);
  const p = await src.pull(t, src.cleanPrNumber(nRaw));
  const issues = await issueRefs(projectId, ctx.key, keyNums(`${p.title}\n${p.headRef}\n${p.body ?? ''}`, ctx.key));
  return { provider: t.provider, repo: t.repo, ...p, author: p.authorLogin ? who(ctx, { login: p.authorLogin }) : null, issues };
}

/** Tệp đổi của một PR/MR kèm patch (trần như commit). */
export async function sourcePullFiles(userId: number, projectId: number, nRaw: unknown, provider?: Provider) {
  await codeGate(userId, projectId, { source: true });
  const t = await target(projectId, provider);
  const n = src.cleanPrNumber(nRaw);
  return { number: n, ...(await src.pullFiles(t, n)) };
}

/** So sánh base...head (base trống ⇒ nhánh mặc định) — commit + tệp + patch. Email tác giả không trả ra. */
export async function sourceCompare(userId: number, projectId: number, q: { base?: string; head?: string; provider?: Provider }) {
  await codeGate(userId, projectId, { source: true });
  const t = await target(projectId, q.provider);
  const head = src.cleanRef(q.head);
  if (!head) throw new BadRequestError('Pick the branch or commit to compare (head)', 'VALIDATION_ERROR');
  const base = await refOrDefault(t, src.cleanRef(q.base));
  const ctx = await loadCtx(projectId);
  const c = await src.compare(t, base, head);
  return { ...c, commits: c.commits.map((x) => ({ ...x, author: who(ctx, { login: x.authorLogin, name: x.authorName, email: x.authorEmail }), authorEmail: undefined })) };
}

/** Thành viên ứng với một danh tính git (login / tên / email; bảng ánh xạ tay + khớp tự động) — null nếu không khớp. */
export async function memberForGit(projectId: number, a: { login?: string | null; name?: string | null; email?: string | null }): Promise<number | null> {
  return (await loadCtx(projectId)).resolve(a);
}

/** Repo đã nối (nhánh mặc định) — cho review / code_read khi cần biết base. */
export async function sourceDefaultBranch(userId: number, projectId: number, provider?: Provider): Promise<string> {
  await codeGate(userId, projectId, { source: true });
  return (await src.repoMeta(await target(projectId, provider))).defaultBranch;
}

// ─── Hoạt động Git THEO NGƯỜI (27/10/2026 — "Khoa đã push gì, tuần này ai commit bao nhiêu") ──

export interface MemberActivityQuery { member?: string | null; since?: string | null; until?: string | null; branch?: string | null; provider?: Provider }

/**
 * Hoạt động Git theo NGƯỜI trong một khoảng thời gian (mặc định 7 ngày): commit (đã khử trùng theo sha — một commit đẩy
 * lên nhiều nhánh chỉ đếm một lần), lần push, nhánh, PR mở/merge, commit gần nhất. Lọc một người (`member` = username /
 * tên / login git) ⇒ thêm "tệp đổi nhiều nhất" từ diff THẬT của ≤ 5 commit mới nhất (proxy có đệm; hết hạn mức thì bỏ qua).
 * Quyền như xem mã nguồn: thành viên đội (không CLIENT, không agent).
 */
export async function memberActivity(userId: number, projectId: number, q: MemberActivityQuery) {
  await codeGate(userId, projectId, { source: true });
  const { parseWhen } = await import('./codeText.js');
  const now = new Date();
  const since = parseWhen(q.since, now, 'start') ?? new Date(now.getTime() - 7 * 86_400_000);
  const until = parseWhen(q.until, now, 'end') ?? now;
  if (since > until) throw new BadRequestError('"since" is after "until"', 'VALIDATION_ERROR');
  const ctx = await loadCtx(projectId);
  const branch = q.branch?.trim() || null;

  // Người được hỏi: thành viên (username / tên hiển thị) hoặc danh tính git thô.
  let want: { userId: number | null; label: string } | null = null;
  if (q.member?.trim()) {
    const m = q.member.trim().replace(/^@/, '').toLowerCase();
    const partial = ctx.members.filter((x) => [x.displayName, x.fullName, x.username].some((n) => n && n.toLowerCase().includes(m)));
    const hit = ctx.members.find((x) => x.username.toLowerCase() === m)
      ?? ctx.members.find((x) => [x.displayName, x.fullName].some((n) => n && n.toLowerCase() === m))
      ?? (partial.length === 1 ? partial[0] : undefined);
    if (!hit && partial.length > 1) {
      throw new BadRequestError(`"${q.member}" matches several members: ${partial.slice(0, 8).map((x) => `@${x.username}`).join(', ')} — use the username`, 'WORK_AMBIGUOUS_MEMBER');
    }
    const viaGit = hit ? null : ctx.resolve({ login: m, name: m, email: m.includes('@') ? m : null });
    want = hit ? { userId: hit.id, label: displayName(hit) } : viaGit ? { userId: viaGit, label: displayName(ctx.users.get(viaGit)!) } : { userId: null, label: m };
  }
  const matches = (w: Who) => !want || (want.userId ? w.user?.id === want.userId : w.label.toLowerCase() === want.label || (w.user ? false : w.label.toLowerCase().includes(want.label)));

  const [events, prRows, legacy] = await Promise.all([
    prisma.workGitEvent.findMany({
      where: { projectId, kind: 'PUSH', occurredAt: { gte: since, lte: until }, ...(branch ? { ref: branch } : {}) },
      orderBy: { occurredAt: 'desc' }, take: 1000,
      select: { ref: true, actorLogin: true, actorName: true, actorEmail: true, commits: true, occurredAt: true, data: true },
    }),
    prisma.workGitPull.findMany({
      where: { projectId, OR: [{ openedAt: { gte: since, lte: until } }, { mergedAt: { gte: since, lte: until } }, { closedAt: { gte: since, lte: until } }], ...(branch ? { headRef: branch } : {}) },
      orderBy: { openedAt: 'desc' }, take: 300,
      select: { number: true, title: true, state: true, authorLogin: true, headRef: true, baseRef: true, openedAt: true, mergedAt: true, issueNumbers: true },
    }),
    branch ? Promise.resolve([]) : prisma.workDevContribution.findMany({
      where: { projectId, kind: 'COMMIT', occurredAt: { gte: since, lte: until } }, orderBy: { occurredAt: 'desc' }, take: 500,
      select: { externalId: true, title: true, authorLogin: true, authorName: true, authorEmail: true, occurredAt: true, filesChanged: true, issueNumbers: true },
    }),
  ]);

  type Row = { who: Who; commits: Map<string, { sha: string; message: string; at: string; branch: string | null; files: number | null; issues: number[] }>; pushes: number; branches: Set<string>; prs: Array<{ number: number; title: string; state: string; branch: string | null; issues: number[] }> };
  const rows = new Map<string, Row>();
  const rowOf = (w: Who): Row => {
    const k = whoKey(w);
    let r = rows.get(k);
    if (!r) { r = { who: w, commits: new Map(), pushes: 0, branches: new Set(), prs: [] }; rows.set(k, r); }
    return r;
  };
  for (const e of events) {
    const pusher = who(ctx, { login: e.actorLogin, name: e.actorName, email: e.actorEmail });
    if (matches(pusher)) { const r = rowOf(pusher); r.pushes += 1; if (e.ref) r.branches.add(e.ref); }
    for (const c of (Array.isArray(e.commits) ? e.commits : []) as any[]) {
      const sha = String(c?.sha ?? '');
      if (!sha) continue;
      const at = c.at ? new Date(String(c.at)) : e.occurredAt;
      if (Number.isNaN(at.getTime()) || at < since || at > until) continue;
      const a = who(ctx, { login: c.authorLogin, name: c.authorName, email: c.authorEmail });
      if (!matches(a)) continue;
      const r = rowOf(a);
      if (e.ref) r.branches.add(e.ref);
      if (!r.commits.has(sha)) r.commits.set(sha, { sha, message: String(c.message ?? '').split('\n')[0].slice(0, 200), at: at.toISOString(), branch: e.ref, files: typeof c.files === 'number' ? c.files : null, issues: Array.isArray(c.issueNumbers) ? c.issueNumbers : [] });
    }
  }
  const knownSha = new Set([...rows.values()].flatMap((r) => [...r.commits.keys()]));
  for (const l of legacy) {
    if (knownSha.has(l.externalId)) continue;
    const a = who(ctx, { login: l.authorLogin, name: l.authorName, email: l.authorEmail });
    if (!matches(a)) continue;
    rowOf(a).commits.set(l.externalId, { sha: l.externalId, message: (l.title ?? '').slice(0, 200), at: l.occurredAt.toISOString(), branch: null, files: l.filesChanged, issues: l.issueNumbers });
  }
  for (const p of prRows) {
    const a = p.authorLogin ? who(ctx, { login: p.authorLogin }) : { user: null, label: 'unknown' };
    if (!matches(a)) continue;
    rowOf(a).prs.push({ number: p.number, title: p.title, state: p.state, branch: p.headRef, issues: p.issueNumbers });
  }

  const people = [...rows.values()].map((r) => {
    const list = [...r.commits.values()].sort((a, b) => b.at.localeCompare(a.at));
    return {
      member: r.who.user ? { username: r.who.user.username, name: displayName(r.who.user) } : null, gitName: r.who.user ? null : r.who.label,
      commits: list.length, pushes: r.pushes, branches: [...r.branches].slice(0, 20),
      prs: r.prs.slice(0, 20), issues: [...new Set([...list.flatMap((c) => c.issues), ...r.prs.flatMap((p) => p.issues)])].slice(0, 30).map((n) => `${ctx.key}-${n}`),
      latest: list.slice(0, 10).map((c) => ({ sha: c.sha.slice(0, 12), at: c.at, branch: c.branch, message: c.message, files: c.files })),
      topFiles: [] as Array<{ file: string; commits: number; changes: number }>,
      _shas: list.slice(0, 5).map((c) => c.sha),
    };
  }).sort((a, b) => b.commits - a.commits || b.pushes - a.pushes || b.prs.length - a.prs.length);

  // Một người ⇒ tệp đổi nhiều nhất từ diff thật của ≤ 5 commit mới nhất (sha ⇒ đệm 1 giờ). Lỗi (hết hạn mức, repo
  // private chưa có token, commit đã bị force-push mất) ⇒ bỏ qua, ghi chú.
  let filesNote: string | null = null;
  if (want && people.length === 1 && people[0]._shas.length) {
    try {
      const t = await target(projectId, q.provider);
      const agg = new Map<string, { commits: number; changes: number }>();
      for (const sha of people[0]._shas) {
        const c = await src.commit(t, sha).catch(() => null);
        if (!c) continue;
        for (const f of c.files) {
          const x = agg.get(f.filename) ?? { commits: 0, changes: 0 };
          x.commits += 1;
          x.changes += f.additions + f.deletions;
          agg.set(f.filename, x);
        }
      }
      people[0].topFiles = [...agg.entries()].map(([file, v]) => ({ file, ...v })).sort((a, b) => b.commits - a.commits || b.changes - a.changes).slice(0, 10);
    } catch (err) {
      filesNote = `changed files not available: ${(err as Error).message.slice(0, 160)}`;
    }
  }
  return {
    since: since.toISOString(), until: until.toISOString(), branch, member: want ? (want.userId ? want.label : `${want.label} (git name, not matched to a member)`) : null,
    people: people.map(({ _shas, ...p }) => p), filesNote,
    totals: { commits: people.reduce((s, p) => s + p.commits, 0), pushes: people.reduce((s, p) => s + p.pushes, 0), prs: people.reduce((s, p) => s + p.prs.length, 0) },
  };
}

function keyNums(text: string, key: string): number[] {
  const re = new RegExp(`(?<![A-Za-z0-9])${key}-(\\d{1,7})(?![0-9])`, 'gi');
  return [...new Set([...text.matchAll(re)].map((m) => Number(m[1])))];
}

// ─── Cài đặt (ADMIN dự án): token chỉ đọc, kênh chat, thông báo, gửi thử ──

async function connOf(projectId: number, provider: Provider) {
  const c = provider === 'GITHUB'
    ? await prisma.workGithubConnection.findUnique({ where: { projectId } })
    : await prisma.workGitlabConnection.findUnique({ where: { projectId } });
  if (!c) throw new NotFoundError(`${provider === 'GITHUB' ? 'GitHub' : 'GitLab'} is not connected`);
  return c;
}

export async function setReadToken(userId: number, projectId: number, provider: Provider, token: string | null) {
  await requireProject(userId, projectId, 'project.settings');
  const c = await connOf(projectId, provider);
  const host = provider === 'GITHUB' ? 'GitHub' : 'GitLab';
  const save = (readToken: string | null) => provider === 'GITHUB'
    ? prisma.workGithubConnection.update({ where: { projectId }, data: { readToken } })
    : prisma.workGitlabConnection.update({ where: { projectId }, data: { readToken } });
  if (token === null || token.trim() === '') {
    await save(null);
    await auditProject(projectId, { actorId: userId, action: `${provider.toLowerCase()}.read_token_remove`, targetType: 'project', targetId: projectId, summary: `Removed the ${host} read-only token` });
    return { hasReadToken: false, verified: null as boolean | null };
  }
  const t = token.trim();
  if (!src.validReadTokenShape(t)) throw new BadRequestError('That does not look like an access token', 'WORK_GIT_TOKEN_SHAPE');
  const repo = provider === 'GITHUB' ? (c as { repoFullName: string | null }).repoFullName : (c as { repoPath: string | null }).repoPath;
  let verified: boolean | null = null;
  if (repo) {
    const web = provider === 'GITHUB' ? 'https://github.com' : gitlabWeb(c.config);
    verified = await src.verifyToken({ provider, repo, apiBase: provider === 'GITHUB' ? 'https://api.github.com' : `${web}/api/v4`, webBase: web, token: t, projectId });
    if (verified === false) throw new BadRequestError(`This token cannot read ${repo} — give it Contents: Read and Metadata: Read on that repository`, 'WORK_GIT_TOKEN_NO_ACCESS');
  }
  await save(src.sealReadToken(provider, projectId, t));
  src.clearSourceCache(); // đổi token ⇒ bỏ đệm (đệm của token cũ không còn đúng quyền)
  await auditProject(projectId, { actorId: userId, action: `${provider.toLowerCase()}.read_token_set`, targetType: 'project', targetId: projectId, summary: `Saved a ${host} read-only token for viewing code` });
  return { hasReadToken: true, verified };
}

export async function setActivitySettings(userId: number, projectId: number, provider: Provider, input: { chatChannelId?: number | null; notify?: boolean }) {
  await requireProject(userId, projectId, 'project.settings');
  const c = await connOf(projectId, provider);
  if (input.chatChannelId) {
    const ch = await prisma.workChannel.findFirst({ where: { id: input.chatChannelId, projectId, archivedAt: null }, select: { kind: true, name: true } });
    // Không đăng vào kênh khách (CLIENT) — hoạt động mã là nội bộ — và không vào tin nhắn riêng.
    if (!ch || ch.kind === 'CLIENT' || ch.name.startsWith('dm-')) throw new BadRequestError('Pick a team channel of this project', 'WORK_BAD_CHANNEL');
  }
  const cfg = { ...((c.config ?? {}) as ConnConfig) };
  if (input.chatChannelId !== undefined) cfg.chatChannelId = input.chatChannelId;
  if (input.notify !== undefined) cfg.notify = input.notify;
  if (provider === 'GITHUB') await prisma.workGithubConnection.update({ where: { projectId }, data: { config: cfg as object } });
  else await prisma.workGitlabConnection.update({ where: { projectId }, data: { config: cfg as object } });
  return { chatChannelId: cfg.chatChannelId ?? null, notify: cfg.notify !== false };
}

/** Thống kê cho thẻ trạng thái ở trang cài đặt (getConnection của github/gitlab gọi). */
export async function connectionStats(projectId: number, provider: Provider) {
  const [events24h, last] = await Promise.all([
    prisma.workGitEvent.count({ where: { projectId, provider, createdAt: { gte: new Date(Date.now() - 86_400_000) } } }),
    prisma.workGitEvent.findFirst({ where: { projectId, provider }, orderBy: { createdAt: 'desc' }, select: { kind: true, title: true, ref: true, actorLogin: true, actorName: true, prNumber: true, commitCount: true, createdAt: true } }),
  ]);
  return { events24h, lastEvent: last ? { ...last, createdAt: last.createdAt.toISOString() } : null };
}

/**
 * "Gửi thử": một chuông thử cho CHÍNH người bấm (người gửi = một thành viên khác — chuông không tự báo cho mình) + một
 * dòng thử vào kênh chat đã chọn. Trả danh sách ai sẽ nhận thông báo khi có push để ADMIN soát.
 */
export async function testSend(userId: number, projectId: number, provider: Provider) {
  await requireProject(userId, projectId, 'project.settings');
  const c = await connOf(projectId, provider);
  const cfg = (c.config ?? {}) as ConnConfig;
  const ctx = await loadCtx(projectId);
  const host = provider === 'GITHUB' ? 'GitHub' : 'GitLab';
  const repo = provider === 'GITHUB' ? (c as { repoFullName: string | null }).repoFullName : (c as { repoPath: string | null }).repoPath;
  const humans = ctx.members.filter((m) => m.kind !== 'AGENT');
  const sender = [ctx.leadId, ...humans.filter((m) => m.role === 'ADMIN').map((m) => m.id), ...humans.map((m) => m.id)].find((id) => id && id !== userId) ?? null;
  let bellSent = false;
  if (sender) {
    const { notifyWork } = await import('./notify.js');
    await notifyWork({
      receiverId: userId, senderId: sender, type: 'WORK_ALERT', entityId: projectId,
      payload: { git: true, test: true, issueKey: ctx.key, title: repo ?? host, message: `Test: ${host} activity notifications for ${repo ?? 'this project'} are working`, url: `/work/${ctx.slug}/${ctx.key}/code` },
    });
    bellSent = true;
  }
  let chat: { posted: boolean; channel: string | null } = { posted: false, channel: null };
  if (cfg.chatChannelId) {
    const ch = await prisma.workChannel.findFirst({ where: { id: cfg.chatChannelId, projectId, archivedAt: null }, select: { name: true } });
    if (ch) {
      const { postAutomationNotice } = await import('./chat.service.js');
      await postAutomationNotice(projectId, ch.name, userId, `🔧 Test — ${host} activity for ${repo ?? 'this project'} will be posted here.`, { git: true, test: true });
      chat = { posted: true, channel: ch.name };
    }
  }
  const admins = humans.filter((m) => m.role === 'ADMIN').map((m) => ({ id: m.id, name: displayName(m) }));
  return { bellSent, chat, notifyEnabled: cfg.notify !== false, recipientsOnPush: admins, note: 'Assignees of issues mentioned in a push also get notified. The person who pushed never does.' };
}

// ─── Thông báo khi có hoạt động ──────────────────────────────────

const NOTIFY_KINDS = new Set(['PUSH', 'PR_OPENED', 'PR_MERGED', 'REVIEW_REQUESTED']);
const CHAT_KINDS = new Set(['PUSH', 'BRANCH_CREATED', 'BRANCH_DELETED', 'PR_OPENED', 'PR_REOPENED', 'PR_MERGED', 'PR_CLOSED']);

/** Câu cho chuông / chat (CT Work nói tiếng Anh ở thông báo — như các loại WORK_* khác). HÀM THUẦN. */
export function gitMessage(e: { kind: string; ref: string | null; prNumber: number | null; title: string | null; commitCount: number }, actor: string, forChat = false): string {
  const title = (e.title ?? '').split('\n')[0].slice(0, 120);
  const pr = `${e.prNumber ? `#${e.prNumber}` : ''}`;
  switch (e.kind) {
    case 'PUSH': return `${actor} pushed ${e.commitCount} commit${e.commitCount === 1 ? '' : 's'} to ${e.ref ?? 'a branch'}${title ? `: “${title}”` : ''}`;
    case 'BRANCH_CREATED': return `${actor} created branch ${e.ref ?? ''}`.trim();
    case 'BRANCH_DELETED': return `${actor} deleted branch ${e.ref ?? ''}`.trim();
    case 'PR_OPENED': return `${actor} opened pull request ${pr}${title ? `: ${title}` : ''}`;
    case 'PR_REOPENED': return `${actor} reopened pull request ${pr}${title ? `: ${title}` : ''}`;
    case 'PR_MERGED': return `${actor} merged pull request ${pr}${title ? `: ${title}` : ''}`;
    case 'PR_CLOSED': return `${actor} closed pull request ${pr}${title ? `: ${title}` : ''}`;
    case 'REVIEW_REQUESTED': return forChat ? `${actor} requested a review on ${pr}` : `${actor} requested your review on pull request ${pr}${title ? `: ${title}` : ''}`;
    default: return `${actor}: ${title}`;
  }
}

/**
 * Gửi thông báo cho các sự kiện VỪA ghi (gửi lại ⇒ không có sự kiện mới ⇒ không gửi lại). Một sự kiện = một thông báo
 * mỗi người (push nhiều commit ⇒ MỘT chuông). Người nhận: người được giao các thẻ nhắc tới + ADMIN dự án (PR được yêu cầu
 * review: người được yêu cầu + người được giao), KHÔNG BAO GIỜ người gây ra sự kiện, không agent, theo công tắc cá nhân
 * `push.git` (cài đặt thông báo). Không bao giờ ném.
 */
export async function notifyGit(projectId: number, provider: Provider, recorded: RecordedGitEvent[]): Promise<void> {
  if (!recorded.length) return;
  try {
    const c = await connOf(projectId, provider);
    const cfg = (c.config ?? {}) as ConnConfig;
    const ctx = await loadCtx(projectId);
    const rows = await prisma.workGitEvent.findMany({ where: { id: { in: recorded.map((r) => r.id) } }, orderBy: { occurredAt: 'asc' } });
    const refs = await issueRefs(projectId, ctx.key, rows.flatMap((r) => r.issueNumbers));
    const memberIds = new Set(ctx.members.filter((m) => m.kind !== 'AGENT' && m.role !== 'CLIENT').map((m) => m.id));
    const admins = ctx.members.filter((m) => m.role === 'ADMIN' && m.kind !== 'AGENT').map((m) => m.id);
    const optedOut = new Set(
      (await prisma.workNotifySetting.findMany({ where: { userId: { in: [...memberIds] } }, select: { userId: true, pushPrefs: true } }))
        .filter((s) => (s.pushPrefs as Record<string, unknown> | null)?.git === false).map((s) => s.userId),
    );
    const { notifyWork } = await import('./notify.js');
    const channel = cfg.chatChannelId ? await prisma.workChannel.findFirst({ where: { id: cfg.chatChannelId, projectId, archivedAt: null }, select: { name: true } }) : null;

    for (const r of rows) {
      const actorW = who(ctx, { login: r.actorLogin, name: r.actorName, email: r.actorEmail });
      const actorId = actorW.user?.id ?? null;
      const actor = whoName(actorW);
      const nums = r.issueNumbers.filter((n) => refs[n]);
      const first = nums.length ? refs[nums[0]] : null;
      const tab = r.kind.startsWith('PR_') || r.kind === 'REVIEW_REQUESTED' ? `tab=pulls&pr=${r.prNumber ?? ''}` : `tab=activity&event=${r.id}`;
      const url = `/work/${ctx.slug}/${ctx.key}/code?${tab}`;

      if (cfg.notify !== false && NOTIFY_KINDS.has(r.kind) && !(r.kind === 'PUSH' && r.commitCount === 0)) {
        const to = new Set<number>();
        for (const n of nums) { const a = refs[n].assigneeId; if (a) to.add(a); }
        const data = (r.data ?? {}) as { reviewer?: string; reviewers?: string[] };
        if (r.kind === 'REVIEW_REQUESTED') {
          const rid = data.reviewer ? ctx.resolve({ login: data.reviewer }) : null;
          if (rid) to.add(rid);
        } else {
          admins.forEach((a) => to.add(a));
          if (r.kind === 'PR_OPENED') for (const login of data.reviewers ?? []) { const rid = ctx.resolve({ login }); if (rid) to.add(rid); }
        }
        if (actorId) to.delete(actorId);
        const message = gitMessage(r, actor);
        for (const uid of to) {
          if (!memberIds.has(uid) || optedOut.has(uid)) continue;
          // Chuông cần người gửi khác người nhận: người gây sự kiện (nếu khớp được), không thì trưởng dự án / một ADMIN khác.
          const sender = [actorId, ctx.leadId, ...admins, ...memberIds].find((x) => x && x !== uid) ?? null;
          if (!sender) continue;
          await notifyWork({
            receiverId: uid, senderId: sender, type: 'WORK_ALERT', entityId: projectId, secondaryEntityId: r.id,
            payload: { git: true, gitKind: r.kind, issueKey: first?.key ?? ctx.key, title: r.title ?? '', message, url, actor, provider },
          }).catch((err) => logger.warn('[work] code: thông báo lỗi', { projectId, err: (err as Error).message }));
        }
      }

      if (channel && CHAT_KINDS.has(r.kind)) {
        const poster = actorId ?? ctx.leadId ?? admins[0] ?? null;
        if (!poster) continue;
        const keys = nums.map((n) => refs[n].key).slice(0, 5);
        const text = `${gitMessage(r, actor, true)}${keys.length ? ` · ${keys.join(', ')}` : ''}`;
        const { postAutomationNotice } = await import('./chat.service.js');
        await postAutomationNotice(projectId, channel.name, poster, text.slice(0, 900), { git: true, gitKind: r.kind, url, externalUrl: r.url })
          .catch((err) => logger.warn('[work] code: đăng chat lỗi', { projectId, err: (err as Error).message }));
      }
    }
  } catch (err) {
    logger.warn('[work] code: thông báo hoạt động Git lỗi', { projectId, err: (err as Error).message });
  }
}

