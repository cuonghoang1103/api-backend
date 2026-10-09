/**
 * CT Work — Đóng góp (A26): GHI commit / PR từ webhook GitHub · GitLab vào `work_dev_contributions`.
 *
 * Khác `work_dev_activity` (chỉ commit NHẮC mã thẻ, gắn vào thẻ — giữ nguyên): ở đây giữ MỌI commit của repo đã nối,
 * kèm tác giả (login / email / tên) để đếm đóng góp code từng người, và số dòng thêm/xoá KHI webhook có:
 *   - GitHub `pull_request`: additions / deletions / changed_files có sẵn trong payload ⇒ lưu.
 *   - GitHub `push`: chỉ có danh sách tệp added/removed/modified ⇒ lưu số tệp, số dòng = null (không gọi API GitHub —
 *     dự án chưa có token đọc repo; null hiện "—" chứ không bịa 0).
 *   - GitLab `push` / `merge_request`: chỉ có danh sách tệp / không có số dòng ⇒ như trên.
 * Ghi hỏng không được làm hỏng webhook (đã nhận 200 cho GitHub) ⇒ bắt lỗi, ghi log.
 */

import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

export interface DevContrib {
  kind: 'COMMIT' | 'PR';
  externalId: string;
  repo: string | null;
  title: string;
  url: string | null;
  state: string | null;
  authorLogin: string | null;
  authorName: string | null;
  authorEmail: string | null;
  additions: number | null;
  deletions: number | null;
  filesChanged: number | null;
  occurredAt: Date;
  text: string;
}

const str = (v: unknown, n: number) => (v === undefined || v === null || v === '' ? null : String(v).slice(0, n));
const int = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.round(v) : null);
const when = (v: unknown, fallback: Date) => {
  const d = v ? new Date(String(v)) : null;
  return d && !Number.isNaN(d.getTime()) ? d : fallback;
};
const fileCount = (c: any) => {
  const n = ['added', 'removed', 'modified'].reduce((s, k) => s + (Array.isArray(c?.[k]) ? c[k].length : 0), 0);
  return ['added', 'removed', 'modified'].some((k) => Array.isArray(c?.[k])) ? n : null;
};

/** Commit/PR trong một sự kiện GitHub (hàm thuần — test). Sự kiện khác ⇒ rỗng. */
export function extractGithubContribs(event: string, body: any, now = new Date()): DevContrib[] {
  const repo = str(body?.repository?.full_name, 200);
  if (event === 'push' && Array.isArray(body?.commits)) {
    const branch = String(body.ref ?? '').replace(/^refs\/heads\//, '');
    return body.commits.slice(0, 100).filter((c: any) => c?.id && c.distinct !== false).map((c: any): DevContrib => ({
      kind: 'COMMIT', externalId: String(c.id).slice(0, 200), repo,
      title: String(c.message ?? '').split('\n')[0].slice(0, 300), url: str(c.url, 500), state: null,
      authorLogin: str(c.author?.username, 100), authorName: str(c.author?.name, 100), authorEmail: str(c.author?.email, 200),
      additions: null, deletions: null, filesChanged: fileCount(c), occurredAt: when(c.timestamp, now), text: `${c.message ?? ''} ${branch}`,
    }));
  }
  if (event === 'pull_request' && body?.pull_request) {
    const pr = body.pull_request;
    const state = pr.merged ? 'merged' : pr.state === 'closed' ? 'closed' : pr.draft ? 'draft' : 'open';
    return [{
      kind: 'PR', externalId: `${repo ?? ''}#${pr.number}`.slice(0, 200), repo,
      title: `#${pr.number} ${pr.title ?? ''}`.slice(0, 300), url: str(pr.html_url, 500), state,
      authorLogin: str(pr.user?.login, 100), authorName: null, authorEmail: null,
      additions: int(pr.additions), deletions: int(pr.deletions), filesChanged: int(pr.changed_files),
      occurredAt: when(pr.created_at, now), text: `${pr.title ?? ''} ${pr.body ?? ''} ${pr.head?.ref ?? ''}`,
    }];
  }
  return [];
}

/** Commit/MR trong một sự kiện GitLab (hàm thuần — test). */
export function extractGitlabContribs(body: any, now = new Date()): DevContrib[] {
  const repo = str(body?.project?.path_with_namespace, 200);
  if (body?.object_kind === 'push' && Array.isArray(body.commits)) {
    const branch = String(body.ref ?? '').replace(/^refs\/heads\//, '');
    return body.commits.slice(0, 100).filter((c: any) => c?.id).map((c: any): DevContrib => ({
      kind: 'COMMIT', externalId: String(c.id).slice(0, 200), repo,
      title: String(c.title ?? c.message ?? '').split('\n')[0].slice(0, 300), url: str(c.url, 500), state: null,
      // GitLab push chỉ có tên + email tác giả; người đẩy (user_username) có thể khác tác giả ⇒ không dùng làm login.
      authorLogin: null, authorName: str(c.author?.name, 100), authorEmail: str(c.author?.email, 200),
      additions: null, deletions: null, filesChanged: fileCount(c), occurredAt: when(c.timestamp, now), text: `${c.message ?? ''} ${branch}`,
    }));
  }
  if (body?.object_kind === 'merge_request' && body.object_attributes) {
    const mr = body.object_attributes;
    const state = mr.state === 'merged' ? 'merged' : mr.state === 'closed' ? 'closed' : (mr.draft || mr.work_in_progress) ? 'draft' : 'open';
    return [{
      kind: 'PR', externalId: `${repo ?? ''}!${mr.iid}`.slice(0, 200), repo,
      title: `!${mr.iid} ${mr.title ?? ''}`.slice(0, 300), url: str(mr.url, 500), state,
      authorLogin: str(body.user?.username, 100), authorName: str(body.user?.name, 100), authorEmail: null,
      additions: null, deletions: null, filesChanged: null, occurredAt: when(mr.created_at, now), text: `${mr.title ?? ''} ${mr.description ?? ''} ${mr.source_branch ?? ''}`,
    }];
  }
  return [];
}

function numbersIn(text: string, key: string): number[] {
  const re = new RegExp(`(?<![A-Za-z0-9])${key}-(\\d{1,7})(?![0-9])`, 'gi');
  return [...new Set([...text.matchAll(re)].map((m) => Number(m[1])))].slice(0, 20);
}

/** Lưu (upsert theo dự án + loại + mã). PR cập nhật trạng thái / số dòng ở mỗi sự kiện sau. Không bao giờ ném. */
export async function recordDevContributions(projectId: number, projectKey: string, provider: 'GITHUB' | 'GITLAB', items: DevContrib[]): Promise<number> {
  let n = 0;
  for (const c of items) {
    try {
      const data = {
        repo: c.repo, title: c.title, url: c.url, state: c.state,
        authorLogin: c.authorLogin, authorName: c.authorName, authorEmail: c.authorEmail,
        additions: c.additions, deletions: c.deletions, filesChanged: c.filesChanged, issueNumbers: numbersIn(c.text, projectKey),
      };
      await prisma.workDevContribution.upsert({
        where: { projectId_kind_externalId: { projectId, kind: c.kind, externalId: c.externalId } },
        create: { projectId, provider, kind: c.kind, externalId: c.externalId, occurredAt: c.occurredAt, ...data },
        // Sự kiện sau của PR (synchronize, closed…) có số dòng mới nhất; commit đã có thì giữ nguyên thời điểm.
        update: c.kind === 'PR' ? data : { title: c.title },
      });
      n += 1;
    } catch (err) {
      logger.warn('[work] contrib: không lưu được commit/PR', { projectId, externalId: c.externalId, err: (err as Error).message });
    }
  }
  return n;
}
