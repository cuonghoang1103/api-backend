/**
 * CT Work — CTW K-3b (10/10/2026): ĐỒNG SOẠN THẢO Docs (Hocuspocus + Yjs) + bình luận gắn đoạn văn.
 * Backend: src/routes/work.ctwk3b.routes.ts + src/services/work/collab.service.ts + socket/work-docs-collaboration.gateway.ts.
 * Tách khỏi lib/work-api.ts để không giẫm tệp nhiều phiên cùng sửa.
 */

import { api } from '@/lib/api';
import type { TiptapDoc, WorkUser } from '@/lib/work-api';

type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const B = '/work/projects';

interface CollabBase {
  projectEnabled: boolean;
  pageEnabled: boolean;
  /** chủ trang / ADMIN — bật tắt đồng soạn cho trang này */
  canToggle: boolean;
  /** ADMIN dự án — bật tắt cho cả dự án */
  canToggleProject: boolean;
  reason: string;
}
export type CollabSession =
  | (CollabBase & { enabled: false; mode: 'deny' })
  | (CollabBase & {
    enabled: true;
    mode: 'edit' | 'read';
    canEdit: boolean;
    token: string;
    expiresIn: number;
    documentName: string;
    websocketPath: string;
    pageId: number;
    lineage: number;
    user: { id: number; name: string; avatarUrl: string | null; color: string };
  });

export interface PageAnchor {
  anchorId: string;
  quote: string;
  resolvedAt: string | null;
  resolvedById?: number | null;
}

export interface BlockAuthors {
  live: boolean;
  blocks: Array<{ index: number; type: string; preview: string; authors: Array<{ userId: number | null; chars: number; user: WorkUser | null }> }>;
  totals: Array<{ userId: number | null; chars: number; user: WorkUser | null }>;
}

export const workCollabKeys = {
  session: (pid: number, num: number) => ['work', 'pages', pid, 'collab', num] as const,
  authors: (pid: number, num: number) => ['work', 'pages', pid, 'collab-authors', num] as const,
};

export const workCollabApi = {
  session: (pid: number, num: number) => d<CollabSession>(api.get(`${B}/${pid}/pages/${num}/collab`)),
  setPage: (pid: number, num: number, enabled: boolean) => d<CollabSession>(api.put(`${B}/${pid}/pages/${num}/collab`, { enabled })),
  setProject: (pid: number, enabled: boolean) => d<{ enabled: boolean }>(api.put(`${B}/${pid}/docs/collab`, { enabled })),
  flush: (pid: number, num: number) => d<{ flushed: boolean }>(api.post(`${B}/${pid}/pages/${num}/collab/flush`)),
  authors: (pid: number, num: number) => d<BlockAuthors>(api.get(`${B}/${pid}/pages/${num}/collab/authors`)),
  addInline: (pid: number, num: number, body: { anchorId: string; quote: string; bodyJson: TiptapDoc }) =>
    d<{ id: number; anchor: PageAnchor }>(api.post(`${B}/${pid}/pages/${num}/inline-comments`, body)),
  resolve: (pid: number, num: number, cid: number, resolved: boolean) =>
    d<{ commentId: number; anchorId: string; resolvedAt: string | null; resolvedBy: WorkUser | null }>(api.post(`${B}/${pid}/pages/${num}/inline-comments/${cid}/resolve`, { resolved })),
};

/** Mã neo ngẫu nhiên (khớp ^[A-Za-z0-9_-]{6,40}$ của server). */
export function newAnchorId(): string {
  const r = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID().replace(/-/g, '').slice(0, 16) : Math.random().toString(36).slice(2, 18);
  return `anc_${r}`;
}
