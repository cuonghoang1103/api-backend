/**
 * CT Work — Bảng tin nhóm (Team Feed, 21/10/2026). Hợp đồng: docs/ctw-feed-hop-dong-api.md.
 * Backend: src/routes/work.feed.routes.ts + services/work/{feed,feedMedia}.service.ts. Kiểu ở đây phải khớp service.
 */
import { api } from './api';
import type { WorkUser } from './work-api';

const B = '/work/feed';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);

export const FEED_REACTIONS = ['like', 'love', 'haha', 'wow', 'sad', 'celebrate'] as const;
export type FeedReaction = (typeof FEED_REACTIONS)[number];
export const REACTION_EMOJI: Record<FeedReaction, string> = { like: '👍', love: '❤️', haha: '😂', wow: '😮', sad: '😢', celebrate: '🎉' };
export const FEED_REPORT_REASONS = ['spam', 'harassment', 'hate', 'sexual', 'violence', 'other'] as const;
export type FeedReportReason = (typeof FEED_REPORT_REASONS)[number];
export type FeedFilter = 'all' | 'mine' | 'media' | 'saved' | 'files';
export type FollowLevel = 'ALL' | 'MENTIONS' | 'OFF';

export const FEED_BODY_MAX = 10_000;
export const FEED_COMMENT_MAX = 4_000;
export const FEED_MAX_MEDIA = 10;
export const FEED_MAX_FILES = 5;
export const FEED_DIRECT_MAX = 25 * 1024 * 1024;
export const FEED_IMAGE_MAX = 20 * 1024 * 1024;
export const FEED_VIDEO_MAX = 200 * 1024 * 1024;
export const FEED_FILE_MAX = 100 * 1024 * 1024;

export interface FeedAttachment {
  id: number; kind: 'IMAGE' | 'VIDEO' | 'FILE'; status: 'PENDING' | 'READY'; fileName: string; mime: string; size: number;
  width: number | null; height: number | null; durationMs: number | null; alt: string | null; position: number;
  url: string | null; thumbUrl: string | null; posterUrl: string | null; urlExpiresAt: string | null;
}
export interface FeedRef {
  t: 'issue' | 'test' | 'doc' | 'meeting'; key: string; n: number; url: string; title: string;
  status?: { name: string; category: string } | null;
  assignee?: { id: number; name: string; avatarUrl: string | null } | null;
  type?: { key: string; name: string; color: string } | null;
  when?: string | null; project?: string;
}
export interface FeedLinkPreview { url: string; domain: string; title: string; description: string | null; siteName: string | null; imageUrl: string | null }
export interface FeedPoll {
  options: Array<{ id: string; text: string; votes: number }>; multi: boolean; closesAt: string | null; closed: boolean;
  totalVotes: number; voters: number; myVotes: string[];
}
export interface ReactionCount { kind: FeedReaction; count: number }
export interface FeedMention { id: number; username: string; name: string }

export interface FeedComment {
  id: number; postId: number; parentId: number | null; author: WorkUser; body: string; mentions: FeedMention[];
  reactionCount: number; reactions: ReactionCount[]; myReaction: FeedReaction | null; replyCount: number; replies: FeedComment[];
  hidden: boolean; hiddenForMe: boolean; authorBlocked: boolean; reportedByMe: boolean; editedAt: string | null; createdAt: string;
  can: { edit: boolean; delete: boolean; moderate: boolean; report: boolean; reply: boolean };
}

export interface FeedPost {
  id: number;
  workspace: { id: number; slug: string; name: string; logoUrl: string | null };
  project: { id: number; key: string; name: string } | null;
  author: WorkUser; authorRole: string | null;
  body: string; mentions: FeedMention[]; hashtags: string[];
  attachments: FeedAttachment[]; linkPreview: FeedLinkPreview | null; refs: FeedRef[]; poll: FeedPoll | null;
  reactionCount: number; reactions: ReactionCount[]; myReaction: FeedReaction | null;
  commentCount: number; comments: FeedComment[]; commentsOff: boolean;
  pinned: boolean; pinnedAt: string | null; saved: boolean; hiddenForMe: boolean; hidden: boolean;
  editedAt: string | null; createdAt: string; url: string;
  can: { edit: boolean; delete: boolean; pin: boolean; moderate: boolean; comment: boolean; react: boolean; report: boolean };
}

export interface FeedScopeProject { id: number; key: string; name: string; role: string; canPost: boolean; canModerate: boolean; follow: FollowLevel }
export interface FeedScope {
  workspace: { id: number; slug: string; name: string; logoUrl: string | null };
  role: string | null; canPost: boolean; canModerate: boolean; follow: FollowLevel;
  projects: FeedScopeProject[];
}

export interface FeedQuery {
  workspaceId?: number; projectId?: number; level?: 'workspace'; filter?: FeedFilter; author?: number; q?: string; cursor?: string | null; limit?: number;
}
export interface FeedPage { posts: FeedPost[]; pinned: FeedPost[]; nextCursor: string | null }

export interface FeedReport {
  id: number; status: 'OPEN' | 'RESOLVED' | 'DISMISSED'; reason: FeedReportReason; detail: string | null; createdAt: string; reporter: WorkUser; reportCount: number;
  target: { type: 'post' | 'comment'; postId: number | null; commentId: number | null; excerpt: string; author: WorkUser | null; hidden: boolean; deleted: boolean };
  workspace: { id: number; slug: string; name: string }; project: { id: number; key: string; name: string } | null;
  resolvedAt: string | null; action: 'remove' | 'dismiss' | null; url: string;
}

export interface CreatePostBody {
  workspaceId: number; projectId?: number | null; body?: string; attachmentIds?: number[];
  poll?: { options: string[]; multi?: boolean; closesAt?: string | null } | null; commentsOff?: boolean; clientKey?: string;
}

const qs = (o: Record<string, unknown>) => {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(o)) if (v !== undefined && v !== null && v !== '') p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : '';
};

export const feedKeys = {
  all: ['work', 'feed'] as const,
  scopes: ['work', 'feed', 'scopes'] as const,
  list: (q: FeedQuery) => ['work', 'feed', 'list', q] as const,
  post: (id: number) => ['work', 'feed', 'post', id] as const,
  comments: (postId: number, parentId?: number | null) => ['work', 'feed', 'comments', postId, parentId ?? 0] as const,
  reports: (wsId?: number, status?: string) => ['work', 'feed', 'reports', wsId ?? 0, status ?? 'OPEN'] as const,
};

export const feedApi = {
  scopes: () => d<{ scopes: FeedScope[]; openReports: number }>(api.get(`${B}/scopes`)),
  follow: (body: { workspaceId: number; projectId?: number | null; level: FollowLevel }) => d<{ level: FollowLevel }>(api.put(`${B}/follow`, body)),
  mentionable: (q: { workspaceId: number; projectId?: number | null; q?: string }) =>
    d<{ users: WorkUser[] }>(api.get(`${B}/mentionable${qs({ workspaceId: q.workspaceId, projectId: q.projectId ?? undefined, q: q.q })}`)),
  list: (q: FeedQuery) => d<FeedPage>(api.get(`${B}${qs({ ...q })}`)),
  newCount: (q: { since: string; workspaceId?: number; projectId?: number }) => d<{ count: number }>(api.get(`${B}/new-count${qs(q)}`)),

  create: (body: CreatePostBody) => d<FeedPost>(api.post(`${B}/posts`, body)),
  get: (id: number) => d<FeedPost>(api.get(`${B}/posts/${id}`)),
  update: (id: number, body: { body?: string; attachmentIds?: number[]; removeAttachmentIds?: number[]; alts?: Array<{ id: number; alt: string | null }>; commentsOff?: boolean }) =>
    d<FeedPost>(api.patch(`${B}/posts/${id}`, body)),
  remove: (id: number) => d<{ deleted: boolean }>(api.delete(`${B}/posts/${id}`)),
  pin: (id: number, pinned: boolean) => d<FeedPost>(api.put(`${B}/posts/${id}/pin`, { pinned })),
  moderate: (id: number, hidden: boolean) => d<FeedPost>(api.put(`${B}/posts/${id}/moderation`, { hidden })),
  react: (id: number, kind: FeedReaction | null) =>
    d<{ reactionCount: number; reactions: ReactionCount[]; myReaction: FeedReaction | null }>(kind ? api.put(`${B}/posts/${id}/reaction`, { kind }) : api.delete(`${B}/posts/${id}/reaction`)),
  reactions: (id: number, kind?: FeedReaction | null, cursor?: string | null) =>
    d<{ items: Array<{ user: WorkUser; kind: FeedReaction; createdAt: string }>; reactions: ReactionCount[]; nextCursor: string | null }>(api.get(`${B}/posts/${id}/reactions${qs({ kind: kind ?? undefined, cursor })}`)),
  save: (id: number, saved: boolean) => d<{ saved: boolean }>(api.put(`${B}/posts/${id}/save`, { saved })),
  hide: (id: number, hidden: boolean) => d<{ hidden: boolean }>(api.put(`${B}/posts/${id}/hide`, { hidden })),
  report: (id: number, reason: FeedReportReason, detail?: string | null) => d<{ reported: boolean; duplicate: boolean }>(api.post(`${B}/posts/${id}/report`, { reason, detail: detail || null })),
  vote: (id: number, optionIds: string[]) => d<FeedPoll>(api.put(`${B}/posts/${id}/vote`, { optionIds })),

  comments: (postId: number, q: { parentId?: number | null; cursor?: string | null; limit?: number } = {}) =>
    d<{ comments: FeedComment[]; nextCursor: string | null }>(api.get(`${B}/posts/${postId}/comments${qs({ parentId: q.parentId ?? undefined, cursor: q.cursor, limit: q.limit })}`)),
  addComment: (postId: number, body: { body: string; parentId?: number | null; clientKey?: string }) => d<FeedComment>(api.post(`${B}/posts/${postId}/comments`, body)),
  editComment: (id: number, body: string) => d<FeedComment>(api.patch(`${B}/comments/${id}`, { body })),
  removeComment: (id: number) => d<{ deleted: boolean }>(api.delete(`${B}/comments/${id}`)),
  reactComment: (id: number, kind: FeedReaction | null) =>
    d<{ reactionCount: number; reactions: ReactionCount[]; myReaction: FeedReaction | null }>(kind ? api.put(`${B}/comments/${id}/reaction`, { kind }) : api.delete(`${B}/comments/${id}/reaction`)),
  moderateComment: (id: number, hidden: boolean) => d<FeedComment>(api.put(`${B}/comments/${id}/moderation`, { hidden })),
  reportComment: (id: number, reason: FeedReportReason, detail?: string | null) => d<{ reported: boolean; duplicate: boolean }>(api.post(`${B}/comments/${id}/report`, { reason, detail: detail || null })),

  /** Đường A — qua backend (ảnh ≤ 20 MB, tệp/video ≤ 25 MB). */
  upload: (workspaceId: number, file: File, onProgress?: (pct: number) => void, alt?: string) => {
    const form = new FormData();
    form.append('workspaceId', String(workspaceId));
    if (alt) form.append('alt', alt);
    form.append('file', file, file.name);
    return d<FeedAttachment>(api.post(`${B}/uploads`, form, {
      timeout: 300_000, onUploadProgress: (e) => e.total && onProgress?.(Math.round((e.loaded / e.total) * 100)),
    }));
  },
  presign: (body: { workspaceId: number; fileName: string; mime: string; size: number; kind: 'VIDEO' | 'FILE' }) =>
    d<{ attachment: FeedAttachment; uploadUrl: string; method: 'PUT'; headers: Record<string, string>; expiresAt: string }>(api.post(`${B}/uploads/presign`, body)),
  complete: (id: number, body: { width?: number | null; height?: number | null; durationMs?: number | null }) => d<FeedAttachment>(api.post(`${B}/uploads/${id}/complete`, body)),
  poster: (id: number, blob: Blob) => {
    const form = new FormData();
    form.append('file', blob, 'poster.jpg');
    return d<FeedAttachment>(api.post(`${B}/uploads/${id}/poster`, form, { timeout: 60_000 }));
  },
  setAlt: (id: number, alt: string | null) => d<FeedAttachment>(api.patch(`${B}/uploads/${id}`, { alt })),
  discard: (id: number) => d<{ deleted: boolean }>(api.delete(`${B}/uploads/${id}`)),
  attachmentUrl: (id: number, opts: { download?: boolean; variant?: 'full' | 'thumb' | 'poster' } = {}) =>
    d<{ url: string; expiresAt: string }>(api.get(`${B}/attachments/${id}/url${qs({ download: opts.download ? '1' : undefined, variant: opts.variant })}`)).then((r) => r.url),
  linkPreview: (url: string) => d<FeedLinkPreview>(api.post(`${B}/link-preview`, { url })),

  reports: (q: { workspaceId?: number; status?: 'OPEN' | 'RESOLVED' | 'DISMISSED' | 'ALL'; cursor?: string | null }) =>
    d<{ reports: FeedReport[]; nextCursor: string | null; openCount: number }>(api.get(`${B}/reports${qs(q)}`)),
  resolveReport: (id: number, action: 'remove' | 'dismiss') => d<{ id: number; status: string }>(api.post(`${B}/reports/${id}/resolve`, { action })),
};

/** PUT thẳng R2 bằng URL ký sẵn (XHR để có % tiến độ). Lỗi mạng/CSP (app desktop) ⇒ reject để bên gọi lùi về đường A. */
export function putSigned(url: string, file: File, headers: Record<string, string>, onProgress?: (pct: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    for (const [k, v] of Object.entries(headers)) xhr.setRequestHeader(k, v);
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100)); };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (HTTP ${xhr.status})`)));
    xhr.onerror = () => reject(new Error('Upload failed'));
    xhr.send(file);
  });
}
