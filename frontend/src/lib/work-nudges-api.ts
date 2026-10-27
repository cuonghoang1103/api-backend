/**
 * CT Work 27/10/2026 — "CuongMini hỏi nhanh": gợi ý chuyển trạng thái thẻ của chính mình (Có / Chưa).
 * Backend: src/services/work/goiYChuyenThe.service.ts · tuyến ở src/routes/work.code.routes.ts.
 */
import { api } from '@/lib/api';

type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);

export type NudgeKind = 'CODE_MERGED' | 'CODE_PUSHED' | 'CHECKLIST_DONE' | 'SUBTASKS_DONE' | 'BASIC_STALE';
export interface StatusLite { id: number; name: string; category: string }
export interface StatusSuggestion {
  issue: { number: number; key: string; title: string };
  from: StatusLite; to: StatusLite; kind: NudgeKind; question: boolean; reason: string;
  evidence: Array<{ type: string; label: string; url: string | null }>;
  /** Chỉ có ở /me/nudges. */
  project?: { id: number; key: string; name: string; slug: string };
}

export const nudgesApi = {
  mine: (limit = 3) => d<{ items: StatusSuggestion[] }>(api.get(`/work/me/nudges?limit=${limit}`)),
  project: (pid: number, limit = 3) => d<{ items: StatusSuggestion[]; total: number }>(api.get(`/work/projects/${pid}/nudges?limit=${limit}`)),
  apply: (pid: number, num: number, body: { note?: string | null; attachmentIds?: number[] }) =>
    d<{ issue: string; from: string; to: string; commented: boolean }>(api.post(`/work/projects/${pid}/nudges/${num}/apply`, body)),
  snooze: (pid: number, num: number) => d<{ snoozedUntil: string }>(api.post(`/work/projects/${pid}/nudges/${num}/snooze`, {})),
};

export const nudgeKeys = {
  mine: ['work', 'nudges', 'me'] as const,
  project: (pid: number) => ['work', 'project', pid, 'nudges'] as const,
};
