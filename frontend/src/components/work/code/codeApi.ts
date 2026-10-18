/**
 * CT Work — trang "Code" (18/10/2026): client API cho /api/v1/work/projects/:pid/code/** và cài đặt Git
 * (backend: src/routes/work.code.routes.ts, src/services/work/code.service.ts). Tách khỏi work-api.ts / api.ts.
 */
import { api } from '@/lib/api';
import type { WorkUser } from '@/lib/work-api';

const B = '/work';
type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const qs = (o: Record<string, string | number | undefined | null>) => {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(o)) if (v !== undefined && v !== null && v !== '') p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : '';
};

export type GitProvider = 'GITHUB' | 'GITLAB';
export interface Who { user: WorkUser | null; label: string }
export interface IssueRef { number: number; key: string; title: string; status: { name: string; category: 'TODO' | 'IN_PROGRESS' | 'DONE' | string } | null; assigneeId: number | null }

export interface CodeOverview {
  connected: boolean;
  providers: Array<{ provider: GitProvider; repo: string | null; webUrl: string | null; lastEventAt: string | null; hasReadToken: boolean }>;
  canManage: boolean;
  canViewSource: boolean;
  trackedSince: string | null;
  stats: {
    commits7d: number; pushes7d: number; openPrs: number;
    contributors30d: Array<{ key: string; user: WorkUser | null; label: string }>;
    daily: Array<{ day: string; commits: number; pushes: number }>;
  };
}

export interface CommitOut { sha: string; message: string; url: string | null; at: string | null; author: Who; issueNumbers: number[]; files: number | null }
export type ActivityKind = 'PUSH' | 'BRANCH_CREATED' | 'BRANCH_DELETED' | 'PR_OPENED' | 'PR_REOPENED' | 'PR_MERGED' | 'PR_CLOSED' | 'REVIEW_REQUESTED' | 'COMMIT';
export interface ActivityItem {
  id: string; kind: ActivityKind; provider: GitProvider; repo: string | null; ref: string | null; actor: Who; title: string | null; url: string | null;
  prNumber: number | null; commitCount: number; commits: CommitOut[]; data: Record<string, unknown>; issueNumbers: number[]; occurredAt: string; legacy?: boolean;
}
export interface ActivityPage {
  items: ActivityItem[]; nextBefore: string | null; issues: Record<number, IssueRef>;
  filters: { actors: Array<{ value: string; label: string; user: WorkUser | null }>; branches: Array<{ name: string; deleted: boolean }> };
}
export interface ActivityQuery { actor?: string; branch?: string; from?: string; to?: string; kind?: 'push' | 'branch' | 'pr'; before?: string; limit?: number }

export interface BranchItem {
  name: string; provider: GitProvider; headSha: string | null; lastCommit: { title: string; url: string | null } | null; lastAuthor: Who | null;
  lastPushAt: string | null; commitCount: number; deleted: boolean; deletedAt: string | null; issueNumbers: number[];
  pr: { number: number; title: string; url: string | null; state: string } | null; legacy: boolean;
}
export interface PullItem {
  provider: GitProvider; number: number; title: string; url: string | null; state: string; author: Who | null; reviewers: Who[];
  headRef: string | null; baseRef: string | null; issueNumbers: number[]; additions: number | null; deletions: number | null; changedFiles: number | null;
  mergedBy: Who | null; openedAt: string; mergedAt: string | null; closedAt: string | null; legacy: boolean;
}
export interface IssueDevCommit { sha: string; title: string; url: string | null; at: string | null; author: Who; branch: string | null }
export interface IssueDevGroup { kind: 'PR' | 'BRANCH' | 'OTHER'; key: string; title: string; url: string | null; state: string | null; ref: string | null; number: number | null; author: Who | null; deleted: boolean; commits: IssueDevCommit[] }
export interface IssueDev { connected: boolean; codeHref: string; counts: { prs: number; branches: number; commits: number }; groups: IssueDevGroup[] }

export interface RepoMeta { provider: GitProvider; repo: string; hasToken: boolean; defaultBranch: string; private: boolean; description: string | null; webUrl: string }
export interface TreeEntry { name: string; path: string; type: 'dir' | 'file' | 'symlink' | 'submodule'; size: number | null }
export interface BlobView { ref: string; path: string; size: number; binary: boolean; tooLarge: boolean; content: string | null; webUrl: string }
export interface SourceCommit { sha: string; message: string; authorLogin: string | null; authorName: string | null; at: string | null; url: string; author: Who }
export interface DiffFile { filename: string; previous: string | null; status: string; additions: number; deletions: number; patch: string | null; truncated: boolean }
export interface CommitDetail extends SourceCommit { parents: string[]; stats: { additions: number; deletions: number; files: number }; files: DiffFile[]; truncated: boolean; issues: Record<number, IssueRef> }

export interface ConnStats { hasReadToken?: boolean; events24h?: number; lastEvent?: { kind: string; title: string | null; ref: string | null; actorLogin: string | null; actorName: string | null; prNumber: number | null; commitCount: number; createdAt: string } | null }
export interface TestSendResult { bellSent: boolean; chat: { posted: boolean; channel: string | null }; notifyEnabled: boolean; recipientsOnPush: Array<{ id: number; name: string }>; note: string }

const P = (pid: number) => `${B}/projects/${pid}`;
const host = (p: GitProvider) => (p === 'GITLAB' ? 'gitlab' : 'github');

export const codeApi = {
  status: (pid: number) => d<{ connected: boolean; providers: GitProvider[] }>(api.get(`${P(pid)}/code/status`)),
  overview: (pid: number) => d<CodeOverview>(api.get(`${P(pid)}/code/overview`)),
  activity: (pid: number, q: ActivityQuery) => d<ActivityPage>(api.get(`${P(pid)}/code/activity${qs({ ...q })}`)),
  branches: (pid: number) => d<{ items: BranchItem[]; issues: Record<number, IssueRef> }>(api.get(`${P(pid)}/code/branches`)),
  pulls: (pid: number, state: 'open' | 'merged' | 'closed' | 'all') =>
    d<{ items: PullItem[]; counts: { open: number; merged: number; closed: number }; issues: Record<number, IssueRef> }>(api.get(`${P(pid)}/code/pulls${qs({ state })}`)),
  issueDev: (pid: number, num: number) => d<IssueDev>(api.get(`${P(pid)}/code/issues/${num}`)),
  meta: (pid: number, provider?: GitProvider) => d<RepoMeta>(api.get(`${P(pid)}/code/source/meta${qs({ provider })}`)),
  refs: (pid: number, provider?: GitProvider) => d<Array<{ name: string; sha: string | null }>>(api.get(`${P(pid)}/code/source/refs${qs({ provider })}`)),
  tree: (pid: number, q: { ref?: string; path?: string; provider?: GitProvider }) => d<{ ref: string; path: string; entries: TreeEntry[] }>(api.get(`${P(pid)}/code/source/tree${qs(q)}`)),
  blob: (pid: number, q: { ref?: string; path?: string; provider?: GitProvider }) => d<BlobView>(api.get(`${P(pid)}/code/source/blob${qs(q)}`)),
  commits: (pid: number, q: { ref?: string; path?: string; provider?: GitProvider }) => d<{ ref: string; items: SourceCommit[] }>(api.get(`${P(pid)}/code/source/commits${qs(q)}`)),
  commit: (pid: number, sha: string, provider?: GitProvider) => d<CommitDetail>(api.get(`${P(pid)}/code/source/commit/${encodeURIComponent(sha)}${qs({ provider })}`)),
  // Cài đặt (ADMIN) — token gửi đi một chiều, không bao giờ đọc lại được.
  setReadToken: (pid: number, provider: GitProvider, token: string | null) =>
    d<{ hasReadToken: boolean; verified: boolean | null }>(api.put(`${P(pid)}/${host(provider)}/read-token`, { token })),
  setActivity: (pid: number, provider: GitProvider, body: { chatChannelId?: number | null; notify?: boolean }) =>
    d<{ chatChannelId: number | null; notify: boolean }>(api.put(`${P(pid)}/${host(provider)}/activity`, body)),
  testSend: (pid: number, provider: GitProvider) => d<TestSendResult>(api.post(`${P(pid)}/${host(provider)}/test`, {})),
};

export const codeKeys = {
  all: (pid: number) => ['work', 'project', pid, 'code'] as const,
  status: (pid: number) => ['work', 'project', pid, 'code', 'status'] as const,
  overview: (pid: number) => ['work', 'project', pid, 'code', 'overview'] as const,
  activity: (pid: number, q: ActivityQuery) => ['work', 'project', pid, 'code', 'activity', q] as const,
  branches: (pid: number) => ['work', 'project', pid, 'code', 'branches'] as const,
  pulls: (pid: number, state: string) => ['work', 'project', pid, 'code', 'pulls', state] as const,
  issueDev: (pid: number, num: number) => ['work', 'project', pid, 'code', 'issue', num] as const,
  meta: (pid: number) => ['work', 'project', pid, 'code', 'meta'] as const,
  refs: (pid: number) => ['work', 'project', pid, 'code', 'refs'] as const,
  tree: (pid: number, ref: string, path: string) => ['work', 'project', pid, 'code', 'tree', ref, path] as const,
  blob: (pid: number, ref: string, path: string) => ['work', 'project', pid, 'code', 'blob', ref, path] as const,
  commits: (pid: number, ref: string, path: string) => ['work', 'project', pid, 'code', 'commits', ref, path] as const,
  commit: (pid: number, sha: string) => ['work', 'project', pid, 'code', 'commit', sha] as const,
};
