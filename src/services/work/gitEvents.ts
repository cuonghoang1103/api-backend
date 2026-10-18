/**
 * CT Work — trang "Code" (18/10/2026): GHI hoạt động Git của dự án từ webhook GitHub / GitLab.
 *
 * Khác hai bảng có sẵn:
 *   - `work_dev_activity`   — chỉ thứ NHẮC mã thẻ, gắn vào thẻ (panel Development) — giữ nguyên;
 *   - `work_dev_contributions` — từng commit / PR để đếm đóng góp (A26) — giữ nguyên.
 * Ở đây: dòng thời gian như GitHub — MỖI push (người đẩy, nhánh, các commit), tạo/xoá nhánh, PR mở/merge/đóng,
 * yêu cầu review — KỂ CẢ khi không nhắc mã thẻ; cùng trạng thái nhánh (`work_git_branches`) và PR (`work_git_pulls`).
 *
 * Gửi lại (GitHub "Redeliver", GitLab retry) không ghi đôi: mỗi sự kiện có `dedupeKey` tự nhiên (`push:<ref>:<after>`,
 * `pr:<n>:<action>:<updated_at>`…) với UNIQUE (project_id, dedupe_key). Hàm ghi trả về CHỈ những sự kiện MỚI ⇒ thông báo
 * không bắn lại khi gửi lại.
 *
 * Phần rút dữ liệu là HÀM THUẦN (test không cần DB). Ghi hỏng không được làm hỏng webhook ⇒ bắt lỗi, ghi log.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

export type GitProvider = 'GITHUB' | 'GITLAB';
export type GitEventKind = 'PUSH' | 'BRANCH_CREATED' | 'BRANCH_DELETED' | 'PR_OPENED' | 'PR_REOPENED' | 'PR_MERGED' | 'PR_CLOSED' | 'REVIEW_REQUESTED';

export interface GitCommitItem {
  sha: string;
  message: string;
  authorLogin: string | null;
  authorName: string | null;
  authorEmail: string | null;
  url: string | null;
  at: string | null;
  issueNumbers: number[];
  files: number | null;
}

export interface GitEventInput {
  kind: GitEventKind;
  dedupeKey: string;
  repo: string | null;
  ref: string | null;
  actorLogin: string | null;
  actorName: string | null;
  actorEmail: string | null;
  title: string | null;
  url: string | null;
  prNumber: number | null;
  commitCount: number;
  commits: GitCommitItem[];
  data: Record<string, unknown>;
  issueNumbers: number[];
  occurredAt: Date;
  /** Chỉ dùng lúc ghi (không lưu cột riêng): BRANCH_* chống ghi đôi mềm trong 10 phút (create + push created cùng tới). */
  softDedupe?: boolean;
}

export interface GitBranchOp {
  op: 'PUSH' | 'CREATE' | 'DELETE';
  name: string;
  headSha?: string | null;
  lastCommitTitle?: string | null;
  lastCommitUrl?: string | null;
  lastAuthorLogin?: string | null;
  lastAuthorName?: string | null;
  lastAuthorEmail?: string | null;
  commitsAdded?: number;
  issueNumbers?: number[];
  at: Date;
}

export interface GitPullInput {
  number: number;
  title: string;
  url: string | null;
  state: 'open' | 'draft' | 'merged' | 'closed';
  authorLogin: string | null;
  headRef: string | null;
  baseRef: string | null;
  reviewers: string[];
  issueNumbers: number[];
  additions: number | null;
  deletions: number | null;
  changedFiles: number | null;
  mergedBy: string | null;
  openedAt: Date;
  mergedAt: Date | null;
  closedAt: Date | null;
}

export interface GitExtract { events: GitEventInput[]; branches: GitBranchOp[]; pulls: GitPullInput[] }

const EMPTY: GitExtract = { events: [], branches: [], pulls: [] };
const ZERO_SHA = /^0+$/;

const str = (v: unknown, n: number): string | null => (v === undefined || v === null || v === '' ? null : String(v).slice(0, n));
/** Liên kết từ payload: CHỈ http(s) — `javascript:` trong payload (ai cầm khoá webhook / GitLab tự host) là XSS khi bấm (QA 18/10/2026). */
const link = (v: unknown, n: number): string | null => {
  const s = str(v, n);
  return s && /^https?:\/\//i.test(s.trim()) ? s.trim() : null;
};
const int = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.round(v) : null);
const when = (v: unknown, fallback: Date): Date => {
  const d = v ? new Date(String(v)) : null;
  return d && !Number.isNaN(d.getTime()) ? d : fallback;
};
const fileCount = (c: any): number | null =>
  ['added', 'removed', 'modified'].some((k) => Array.isArray(c?.[k]))
    ? ['added', 'removed', 'modified'].reduce((s, k) => s + (Array.isArray(c?.[k]) ? c[k].length : 0), 0)
    : null;

/** Số thẻ `KEY-n` trong chuỗi (không phân biệt hoa thường, không bắt nhầm `XKEY-1`). */
export function keyNumbers(text: string, key: string): number[] {
  if (!key) return [];
  const re = new RegExp(`(?<![A-Za-z0-9])${key}-(\\d{1,7})(?![0-9])`, 'gi');
  return [...new Set([...String(text ?? '').matchAll(re)].map((m) => Number(m[1])))].slice(0, 20);
}

const union = (...lists: number[][]) => [...new Set(lists.flat())].slice(0, 30);
const branchOf = (ref: unknown): string | null => {
  const r = String(ref ?? '');
  if (!r.startsWith('refs/heads/')) return null; // thẻ tag (refs/tags/…) không phải nhánh
  return r.slice('refs/heads/'.length).slice(0, 255) || null;
};

// ─── GitHub ──────────────────────────────────────────────────────

function ghCommit(c: any, key: string, branch: string): GitCommitItem {
  const message = String(c?.message ?? '').slice(0, 2000);
  return {
    sha: String(c?.id ?? '').slice(0, 64), message,
    authorLogin: str(c?.author?.username, 100), authorName: str(c?.author?.name, 100), authorEmail: str(c?.author?.email, 200),
    url: link(c?.url, 500), at: c?.timestamp ? when(c.timestamp, new Date()).toISOString() : null,
    issueNumbers: keyNumbers(`${message} ${branch}`, key), files: fileCount(c),
  };
}

function ghPrState(pr: any): GitPullInput['state'] {
  return pr?.merged || pr?.merged_at ? 'merged' : pr?.state === 'closed' ? 'closed' : pr?.draft ? 'draft' : 'open';
}

/** Sự kiện GitHub ⇒ dòng thời gian + nhánh + PR. Sự kiện khác (ping, issues, …) ⇒ rỗng. HÀM THUẦN. */
export function extractGithubGit(event: string, body: any, key: string, now = new Date()): GitExtract {
  if (!body || typeof body !== 'object') return EMPTY;
  const repo = str(body.repository?.full_name, 200);
  const actorLogin = str(body.sender?.login, 100);

  if (event === 'push') {
    const branch = branchOf(body.ref);
    if (!branch) return EMPTY;
    const before = String(body.before ?? '');
    const after = String(body.after ?? '');
    const pusherName = str(body.pusher?.name, 100);
    const pusherEmail = str(body.pusher?.email, 200);
    const actor = { actorLogin: actorLogin ?? pusherName, actorName: pusherName, actorEmail: pusherEmail };
    if (body.deleted || ZERO_SHA.test(after)) {
      return {
        events: [{
          kind: 'BRANCH_DELETED', dedupeKey: `branch_deleted:${branch}:${before.slice(0, 64)}`.slice(0, 300), repo, ref: branch, ...actor,
          title: branch, url: repo ? `https://github.com/${repo}` : null, prNumber: null, commitCount: 0, commits: [], data: { before },
          issueNumbers: keyNumbers(branch, key), occurredAt: now, softDedupe: true,
        }],
        branches: [{ op: 'DELETE', name: branch, at: now }],
        pulls: [],
      };
    }
    const all = Array.isArray(body.commits) ? body.commits : [];
    const commits: GitCommitItem[] = all.filter((c: any) => c?.id).slice(0, 50).map((c: any) => ghCommit(c, key, branch));
    const head = body.head_commit ? ghCommit(body.head_commit, key, branch) : commits[commits.length - 1] ?? null;
    // Giờ PUSH (repository.pushed_at, giây) — không phải giờ tác giả của commit (có thể cũ hàng tuần khi rebase/đẩy muộn).
    const at = typeof body.repository?.pushed_at === 'number' ? new Date(body.repository.pushed_at * 1000) : now;
    const nums = union(keyNumbers(branch, key), ...commits.map((c) => c.issueNumbers));
    const events: GitEventInput[] = [];
    // Đẩy nhánh MỚI mà không có commit mới (nhánh tách từ commit đã có) — GitHub vẫn gửi push created=true, commits=[].
    if (commits.length || !body.created) {
      events.push({
        kind: 'PUSH', dedupeKey: `push:${branch}:${after.slice(0, 64)}`.slice(0, 300), repo, ref: branch, ...actor,
        title: commits[commits.length - 1]?.message.split('\n')[0].slice(0, 500) ?? branch,
        url: link(body.compare, 500), prNumber: null, commitCount: commits.length, commits,
        data: { before, after, forced: !!body.forced, created: !!body.created, compare: link(body.compare, 500) },
        issueNumbers: nums, occurredAt: at,
      });
    }
    if (body.created) {
      events.push({
        kind: 'BRANCH_CREATED', dedupeKey: `branch_created:${branch}:${after.slice(0, 64)}`.slice(0, 300), repo, ref: branch, ...actor,
        title: branch, url: repo ? `https://github.com/${repo}/tree/${encodeURIComponent(branch)}` : null, prNumber: null, commitCount: 0, commits: [],
        data: { after }, issueNumbers: keyNumbers(branch, key), occurredAt: new Date(at.getTime() - 1), softDedupe: true,
      });
    }
    return {
      events,
      branches: [{
        op: 'PUSH', name: branch, headSha: after.slice(0, 64) || null,
        lastCommitTitle: head?.message.split('\n')[0].slice(0, 300) ?? null, lastCommitUrl: head?.url ?? null,
        lastAuthorLogin: head?.authorLogin ?? null, lastAuthorName: head?.authorName ?? null, lastAuthorEmail: head?.authorEmail ?? null,
        commitsAdded: commits.length, issueNumbers: nums, at,
      }],
      pulls: [],
    };
  }

  if (event === 'create' || event === 'delete') {
    if (body.ref_type !== 'branch') return EMPTY;
    const branch = str(body.ref, 255);
    if (!branch) return EMPTY;
    const created = event === 'create';
    return {
      events: [{
        kind: created ? 'BRANCH_CREATED' : 'BRANCH_DELETED',
        // Khoá chưa đủ (sự kiện create/delete không kèm sha) — code.service bổ sung sha từ bảng nhánh + chống đôi mềm.
        dedupeKey: `${created ? 'branch_created' : 'branch_deleted'}:${branch}:`.slice(0, 300), repo, ref: branch,
        actorLogin, actorName: null, actorEmail: null, title: branch,
        url: repo ? (created ? `https://github.com/${repo}/tree/${encodeURIComponent(branch)}` : `https://github.com/${repo}`) : null,
        prNumber: null, commitCount: 0, commits: [], data: {}, issueNumbers: keyNumbers(branch, key), occurredAt: now, softDedupe: true,
      }],
      branches: [{ op: created ? 'CREATE' : 'DELETE', name: branch, at: now, issueNumbers: keyNumbers(branch, key) }],
      pulls: [],
    };
  }

  if (event === 'pull_request' && body.pull_request) {
    const pr = body.pull_request;
    const number = int(pr.number);
    if (!number) return EMPTY;
    const state = ghPrState(pr);
    const headRef = str(pr.head?.ref, 255);
    const nums = union(keyNumbers(`${pr.title ?? ''} ${pr.body ?? ''} ${headRef ?? ''}`, key));
    const reviewers = [...new Set([
      ...(Array.isArray(pr.requested_reviewers) ? pr.requested_reviewers.map((r: any) => String(r?.login ?? '')).filter(Boolean) : []),
      ...(body.requested_reviewer?.login ? [String(body.requested_reviewer.login)] : []),
    ])].slice(0, 20).map((s) => s.slice(0, 100));
    const pull: GitPullInput = {
      number, title: String(pr.title ?? '').slice(0, 300), url: link(pr.html_url, 500), state,
      authorLogin: str(pr.user?.login, 100), headRef, baseRef: str(pr.base?.ref, 255), reviewers, issueNumbers: nums,
      additions: int(pr.additions), deletions: int(pr.deletions), changedFiles: int(pr.changed_files),
      mergedBy: str(pr.merged_by?.login, 100), openedAt: when(pr.created_at, now),
      mergedAt: pr.merged_at ? when(pr.merged_at, now) : null, closedAt: pr.closed_at ? when(pr.closed_at, now) : null,
    };
    const action = String(body.action ?? '');
    const kind: GitEventKind | null =
      action === 'opened' ? 'PR_OPENED'
        : action === 'reopened' ? 'PR_REOPENED'
          : action === 'closed' ? (pr.merged ? 'PR_MERGED' : 'PR_CLOSED')
            : action === 'review_requested' && body.requested_reviewer?.login ? 'REVIEW_REQUESTED'
              : null;
    const events: GitEventInput[] = [];
    if (kind) {
      const reviewer = kind === 'REVIEW_REQUESTED' ? str(body.requested_reviewer?.login, 100) : null;
      events.push({
        kind, dedupeKey: `pr:${number}:${action}:${reviewer ?? ''}:${String(pr.updated_at ?? pr.closed_at ?? '')}`.slice(0, 300), repo, ref: headRef,
        actorLogin: kind === 'PR_MERGED' ? str(pr.merged_by?.login, 100) ?? actorLogin : actorLogin, actorName: null, actorEmail: null,
        title: String(pr.title ?? '').slice(0, 500), url: pull.url, prNumber: number, commitCount: int(pr.commits) ?? 0, commits: [],
        data: { headRef, baseRef: pull.baseRef, draft: !!pr.draft, reviewers, ...(reviewer ? { reviewer } : {}), additions: pull.additions, deletions: pull.deletions },
        issueNumbers: nums,
        occurredAt: when(kind === 'PR_MERGED' ? pr.merged_at : kind === 'PR_CLOSED' ? pr.closed_at : kind === 'PR_OPENED' ? pr.created_at : pr.updated_at, now),
      });
    }
    return { events, branches: [], pulls: [pull] };
  }
  return EMPTY;
}

// ─── GitLab ──────────────────────────────────────────────────────

/** Sự kiện GitLab (object_kind push | merge_request) ⇒ như trên. Tag push / khác ⇒ rỗng. HÀM THUẦN. */
export function extractGitlabGit(body: any, key: string, now = new Date()): GitExtract {
  if (!body || typeof body !== 'object') return EMPTY;
  const repo = str(body.project?.path_with_namespace, 200);
  const web = (link(body.project?.web_url, 400) ?? '').replace(/\/$/, '');
  if (body.object_kind === 'push') {
    const branch = branchOf(body.ref);
    if (!branch) return EMPTY;
    const before = String(body.before ?? '');
    const after = String(body.after ?? '');
    const actor = { actorLogin: str(body.user_username, 100), actorName: str(body.user_name, 100), actorEmail: str(body.user_email, 200) };
    if (ZERO_SHA.test(after)) {
      return {
        events: [{
          kind: 'BRANCH_DELETED', dedupeKey: `branch_deleted:${branch}:${before.slice(0, 64)}`.slice(0, 300), repo, ref: branch, ...actor, title: branch,
          url: web || null, prNumber: null, commitCount: 0, commits: [], data: { before }, issueNumbers: keyNumbers(branch, key), occurredAt: now, softDedupe: true,
        }],
        branches: [{ op: 'DELETE', name: branch, at: now }],
        pulls: [],
      };
    }
    const commits: GitCommitItem[] = (Array.isArray(body.commits) ? body.commits : []).filter((c: any) => c?.id).slice(0, 50).map((c: any) => {
      const message = String(c.message ?? c.title ?? '').slice(0, 2000);
      return {
        sha: String(c.id).slice(0, 64), message, authorLogin: null, authorName: str(c.author?.name, 100), authorEmail: str(c.author?.email, 200),
        url: link(c.url, 500), at: c.timestamp ? when(c.timestamp, now).toISOString() : null, issueNumbers: keyNumbers(`${message} ${branch}`, key), files: fileCount(c),
      };
    });
    // GitLab gửi commit cũ → mới; commit cuối = đầu nhánh.
    const head = commits.find((c) => c.sha === after) ?? commits[commits.length - 1] ?? null;
    const total = int(body.total_commits_count) ?? commits.length;
    const at = now; // GitLab không gửi giờ push; webhook tới ngay sau khi đẩy.
    const nums = union(keyNumbers(branch, key), ...commits.map((c) => c.issueNumbers));
    const created = ZERO_SHA.test(before);
    const events: GitEventInput[] = [];
    if (total || !created) {
      events.push({
        kind: 'PUSH', dedupeKey: `push:${branch}:${after.slice(0, 64)}`.slice(0, 300), repo, ref: branch, ...actor,
        title: head?.message.split('\n')[0].slice(0, 500) ?? branch,
        url: web && !created ? `${web}/-/compare/${before.slice(0, 12)}...${after.slice(0, 12)}` : web ? `${web}/-/commits/${encodeURIComponent(branch)}` : null,
        prNumber: null, commitCount: total, commits, data: { before, after, created },
        issueNumbers: nums, occurredAt: at,
      });
    }
    if (created) {
      events.push({
        kind: 'BRANCH_CREATED', dedupeKey: `branch_created:${branch}:${after.slice(0, 64)}`.slice(0, 300), repo, ref: branch, ...actor, title: branch,
        url: web ? `${web}/-/tree/${encodeURIComponent(branch)}` : null, prNumber: null, commitCount: 0, commits: [], data: { after },
        issueNumbers: keyNumbers(branch, key), occurredAt: new Date(at.getTime() - 1), softDedupe: true,
      });
    }
    return {
      events,
      branches: [{
        op: 'PUSH', name: branch, headSha: after.slice(0, 64) || null, lastCommitTitle: head?.message.split('\n')[0].slice(0, 300) ?? null,
        lastCommitUrl: head?.url ?? null, lastAuthorLogin: null, lastAuthorName: head?.authorName ?? null, lastAuthorEmail: head?.authorEmail ?? null,
        commitsAdded: total, issueNumbers: nums, at,
      }],
      pulls: [],
    };
  }
  if (body.object_kind === 'merge_request' && body.object_attributes) {
    const mr = body.object_attributes;
    const number = int(mr.iid);
    if (!number) return EMPTY;
    const state: GitPullInput['state'] = mr.state === 'merged' ? 'merged' : mr.state === 'closed' ? 'closed' : (mr.draft || mr.work_in_progress) ? 'draft' : 'open';
    const headRef = str(mr.source_branch, 255);
    const nums = union(keyNumbers(`${mr.title ?? ''} ${mr.description ?? ''} ${headRef ?? ''}`, key));
    const reviewers = (Array.isArray(body.reviewers) ? body.reviewers : []).map((r: any) => String(r?.username ?? '')).filter(Boolean).slice(0, 20);
    const actorLogin = str(body.user?.username, 100);
    const pull: GitPullInput = {
      number, title: String(mr.title ?? '').slice(0, 300), url: link(mr.url, 500), state, authorLogin: null, headRef, baseRef: str(mr.target_branch, 255),
      reviewers, issueNumbers: nums, additions: null, deletions: null, changedFiles: null, mergedBy: state === 'merged' ? actorLogin : null,
      openedAt: when(mr.created_at, now), mergedAt: state === 'merged' ? when(mr.merged_at ?? mr.updated_at, now) : null,
      closedAt: state === 'closed' ? when(mr.closed_at ?? mr.updated_at, now) : null,
    };
    // Người tạo MR chỉ có ở lần "open" (người gây sự kiện) — lần khác để null, ghi không đè (code.service).
    if (mr.action === 'open') pull.authorLogin = actorLogin;
    const action = String(mr.action ?? '');
    const events: GitEventInput[] = [];
    const base = { repo, ref: headRef, actorLogin, actorName: str(body.user?.name, 100), actorEmail: null, title: String(mr.title ?? '').slice(0, 500), url: pull.url, prNumber: number, commitCount: 0, commits: [] as GitCommitItem[], issueNumbers: nums };
    const kind: GitEventKind | null = action === 'open' ? 'PR_OPENED' : action === 'reopen' ? 'PR_REOPENED' : action === 'merge' ? 'PR_MERGED' : action === 'close' ? 'PR_CLOSED' : null;
    const stamp = String(mr.updated_at ?? '');
    if (kind) {
      events.push({ ...base, kind, dedupeKey: `mr:${number}:${action}:${stamp}`.slice(0, 300), data: { headRef, baseRef: pull.baseRef, reviewers }, occurredAt: when(mr.updated_at, now) });
    }
    // Reviewer MỚI được thêm (changes.reviewers) ⇒ một sự kiện "review requested" mỗi người.
    const ch = body.changes?.reviewers;
    if (ch && Array.isArray(ch.current)) {
      const prev = new Set((Array.isArray(ch.previous) ? ch.previous : []).map((r: any) => String(r?.username ?? '')));
      for (const r of ch.current) {
        const login = String(r?.username ?? '');
        if (!login || prev.has(login)) continue;
        events.push({ ...base, kind: 'REVIEW_REQUESTED', dedupeKey: `mr:${number}:review:${login}:${stamp}`.slice(0, 300), data: { headRef, baseRef: pull.baseRef, reviewers, reviewer: login.slice(0, 100) }, occurredAt: when(mr.updated_at, now) });
      }
    }
    if (!pull.reviewers.length && ch && Array.isArray(ch.current)) pull.reviewers = ch.current.map((r: any) => String(r?.username ?? '')).filter(Boolean).slice(0, 20);
    return { events, branches: [], pulls: [pull] };
  }
  return EMPTY;
}

// ─── Ghi ─────────────────────────────────────────────────────────

export interface RecordedGitEvent { id: number; kind: GitEventKind; ref: string | null; prNumber: number | null }

const isUnique = (err: unknown) => err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002';

/**
 * Ghi một lượt webhook: nhánh, PR, sự kiện. Trả CHỈ sự kiện vừa ghi MỚI (gửi lại ⇒ rỗng ⇒ không thông báo lần hai).
 * Không bao giờ ném.
 */
export async function recordGit(projectId: number, provider: GitProvider, x: GitExtract): Promise<RecordedGitEvent[]> {
  const out: RecordedGitEvent[] = [];
  /** Nhánh có sự kiện PUSH là bản GỬI LẠI (trùng dedupeKey) ⇒ không cộng commitCount lần hai (QA 18/10/2026). */
  const pushGuiLai = new Set<string>();
  try {
    for (const p of x.pulls) await upsertPull(projectId, provider, p);
    for (const e of x.events) {
      try {
        let dedupeKey = e.dedupeKey;
        if (e.softDedupe && e.ref) {
          // create + push(created) / delete + push(deleted) cùng tới cho MỘT thao tác ⇒ chỉ một dòng.
          const recent = await prisma.workGitEvent.findFirst({
            where: { projectId, provider, kind: e.kind, ref: e.ref, occurredAt: { gte: new Date(e.occurredAt.getTime() - 10 * 60_000) } },
            select: { id: true },
          });
          if (recent) continue;
          if (dedupeKey.endsWith(':')) dedupeKey = `${dedupeKey}${Math.floor(e.occurredAt.getTime() / 60_000)}`;
        }
        const row = await prisma.workGitEvent.create({
          data: {
            projectId, provider, kind: e.kind, dedupeKey, repo: e.repo, ref: e.ref, actorLogin: e.actorLogin, actorName: e.actorName, actorEmail: e.actorEmail,
            title: e.title, url: e.url, prNumber: e.prNumber, commitCount: e.commitCount, commits: e.commits as unknown as Prisma.InputJsonValue,
            data: e.data as Prisma.InputJsonValue, issueNumbers: e.issueNumbers, occurredAt: e.occurredAt,
          },
          select: { id: true },
        });
        out.push({ id: row.id, kind: e.kind, ref: e.ref, prNumber: e.prNumber });
      } catch (err) {
        if (!isUnique(err)) throw err;
        if (e.kind === 'PUSH' && e.ref) pushGuiLai.add(e.ref);
      }
    }
    // Nhánh SAU sự kiện: GitHub "Redeliver" / GitLab gửi lại cùng một push thì `commitCount: { increment }` từng cộng đôi.
    for (const b of x.branches) {
      if (b.op === 'PUSH' && pushGuiLai.has(b.name)) continue;
      await upsertBranch(projectId, provider, b);
    }
  } catch (err) {
    logger.warn('[work] code: không lưu được hoạt động Git', { projectId, provider, err: (err as Error).message });
  }
  return out;
}

async function upsertBranch(projectId: number, provider: GitProvider, b: GitBranchOp) {
  const where = { projectId_provider_name: { projectId, provider, name: b.name } };
  if (b.op === 'DELETE') {
    await prisma.workGitBranch.upsert({ where, create: { projectId, provider, name: b.name, deletedAt: b.at }, update: { deletedAt: b.at } });
    return;
  }
  const cur = await prisma.workGitBranch.findUnique({ where, select: { issueNumbers: true, lastPushAt: true } });
  const nums = union(cur?.issueNumbers ?? [], b.issueNumbers ?? []);
  if (b.op === 'CREATE') {
    await prisma.workGitBranch.upsert({ where, create: { projectId, provider, name: b.name, issueNumbers: nums }, update: { deletedAt: null, issueNumbers: nums } });
    return;
  }
  // Push cũ tới muộn (thứ tự giao không đảm bảo) không đè đầu nhánh mới hơn.
  const newer = !cur?.lastPushAt || cur.lastPushAt.getTime() <= b.at.getTime();
  const head = newer ? {
    headSha: b.headSha ?? null, lastCommitTitle: b.lastCommitTitle ?? null, lastCommitUrl: b.lastCommitUrl ?? null,
    lastAuthorLogin: b.lastAuthorLogin ?? null, lastAuthorName: b.lastAuthorName ?? null, lastAuthorEmail: b.lastAuthorEmail ?? null, lastPushAt: b.at,
  } : {};
  await prisma.workGitBranch.upsert({
    where,
    create: { projectId, provider, name: b.name, ...head, commitCount: b.commitsAdded ?? 0, issueNumbers: nums },
    update: { ...head, deletedAt: null, commitCount: { increment: b.commitsAdded ?? 0 }, issueNumbers: nums },
  });
}

async function upsertPull(projectId: number, provider: GitProvider, p: GitPullInput) {
  const where = { projectId_provider_number: { projectId, provider, number: p.number } };
  const cur = await prisma.workGitPull.findUnique({ where, select: { reviewers: true, authorLogin: true, additions: true, deletions: true, changedFiles: true } });
  const reviewers = [...new Set([...(cur?.reviewers ?? []), ...p.reviewers])].slice(0, 20);
  const data = {
    title: p.title || '(untitled)', url: p.url, state: p.state, headRef: p.headRef, baseRef: p.baseRef, reviewers, issueNumbers: p.issueNumbers,
    authorLogin: p.authorLogin ?? cur?.authorLogin ?? null,
    additions: p.additions ?? cur?.additions ?? null, deletions: p.deletions ?? cur?.deletions ?? null, changedFiles: p.changedFiles ?? cur?.changedFiles ?? null,
    mergedBy: p.mergedBy, mergedAt: p.mergedAt, closedAt: p.closedAt,
  };
  await prisma.workGitPull.upsert({ where, create: { projectId, provider, number: p.number, openedAt: p.openedAt, ...data }, update: data });
}
