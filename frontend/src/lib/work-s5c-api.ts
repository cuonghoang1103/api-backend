/**
 * CT Work — đợt S5c: mô-đun mới cho dự án cũ · thùng rác Docs · nhập lại dự án từ ZIP. Backend:
 * src/routes/work.s5c.routes.ts + services/work/{moduleUpgrade,pageTrash.service,projectImport.service}.ts.
 * Tách khỏi work-api.ts để không giẫm phiên khác; kiểu ở đây phải khớp service.
 */
import { api } from './api';
import type { ProjectKind, StudioModule, WorkUser } from './work-api';

const B = '/work';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);

// ═══ Mô-đun mới ═════════════════════════════════════════════════════

export interface AvailableModule { key: StudioModule; label: string; body: string; on: boolean; recommended: boolean; undecided: boolean }
export interface AvailableModules { kind: ProjectKind; modules: AvailableModule[]; willEnable: StudioModule[] }

// ═══ Thùng rác Docs ═════════════════════════════════════════════════

export interface TrashPage {
  id: number; number: number; title: string; visibility: 'INTERNAL' | 'CLIENT'; deletedAt: string; childCount: number;
  deletedBy: { id: number | null; name: string | null } | null; owner: WorkUser | null;
  restoresTo: { number: number; title: string } | null; canRestore: boolean;
}
export interface TrashPages { canPurge: boolean; items: TrashPage[] }

// ═══ Nhập lại dự án ═════════════════════════════════════════════════

export type ImportStatus = 'UPLOADED' | 'QUEUED' | 'RUNNING' | 'DONE' | 'FAILED' | 'CANCELLED' | 'EXPIRED';
export interface ImportPlan {
  source: { key: string; name: string; workspace: string | null; exportedAt: string | null };
  suggestedKey: string;
  tables: Array<{ table: string; rows: number; import: boolean; note?: string }>;
  people: Array<{ id: number; username: string; name: string; mappedTo: { id: number; username: string } | null; how: 'email' | 'same-account' | null }>;
  teams: Array<{ key: string; name: string; action: 'reuse' | 'create' }>;
  files: { total: number; withContent: number; missing: number; bytes: number };
  checksumsVerified: number;
  warnings: string[];
}
export interface ImportResult { tables: Record<string, { rows: number; imported: number; skipped: number }>; warnings: string[]; people: number; peopleUnmatched: number; teamsCreated: number }
export interface ProjectImport {
  id: number; workspaceId: number; status: ImportStatus; progress: number; stage: string | null; fileName: string | null; size: number | null;
  sourceKey: string | null; sourceName: string | null; projectKey: string | null; projectName: string | null; projectId: number | null;
  plan: ImportPlan | null; result: ImportResult | null; error: string | null; expiresAt: string | null; createdAt: string;
  startedAt: string | null; finishedAt: string | null; requestedById: number | null;
}
export interface ImportList { items: ProjectImport[]; maxBytes: number; formatVersion: number; storageReady: boolean }

export const workS5cKeys = {
  available: (pid: number) => ['work', 'studio-available', pid] as const,
  trashPages: (pid: number) => ['work', 'project', pid, 'trash-pages'] as const,
  imports: (wsId: number) => ['work', 'imports', wsId] as const,
  import: (wsId: number, id: number) => ['work', 'imports', wsId, id] as const,
};

export const workS5cApi = {
  availableModules: (pid: number) => d<AvailableModules>(api.get(`${B}/projects/${pid}/studio/available`)),
  applyDefaults: (pid: number) => d<AvailableModules & { enabled: StudioModule[] }>(api.post(`${B}/projects/${pid}/studio/apply-defaults`)),

  trashPages: (pid: number) => d<TrashPages>(api.get(`${B}/projects/${pid}/trash/pages`)),
  restorePage: (pid: number, num: number) => d<{ restored: number; number: number; toTopLevel: boolean }>(api.post(`${B}/projects/${pid}/trash/pages/${num}/restore`)),
  purgePage: (pid: number, num: number) => d<{ deleted: number }>(api.delete(`${B}/projects/${pid}/trash/pages/${num}`)),

  imports: (wsId: number) => d<ImportList>(api.get(`${B}/workspaces/${wsId}/imports`)),
  getImport: (wsId: number, id: number) => d<ProjectImport>(api.get(`${B}/workspaces/${wsId}/imports/${id}`)),
  /** Multipart — PHẢI ghi đè Content-Type (instance axios đặt cứng JSON ⇒ FormData bị đổi thành JSON, tệp mất). */
  uploadImport: (wsId: number, file: File, onProgress?: (pct: number) => void) => {
    const fd = new FormData();
    fd.append('file', file);
    return d<ProjectImport>(api.post(`${B}/workspaces/${wsId}/imports`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 15 * 60_000,
      onUploadProgress: (e) => { if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100)); },
    }));
  },
  startImport: (wsId: number, id: number, body: { key: string; name?: string | null }) => d<ProjectImport>(api.post(`${B}/workspaces/${wsId}/imports/${id}/start`, body)),
  cancelImport: (wsId: number, id: number) => d<{ cancelled: boolean }>(api.delete(`${B}/workspaces/${wsId}/imports/${id}`)),
};
