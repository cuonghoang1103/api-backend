/**
 * CT Work — Resources (06/10/2026, mô-đun `resources`): thư viện link của dự án + Web links trên thẻ.
 * Backend: src/routes/work.resources.routes.ts + services/work/{resources.service,resourceRules}.ts.
 * Tách khỏi work-api.ts để không giẫm phiên khác; kiểu ở đây phải khớp service.
 */
import { api } from './api';

const B = '/work';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);

export type ResourceVisibility = 'TEAM' | 'CLIENT';
export type LinkStatus = 'OK' | 'BROKEN' | 'UNKNOWN';

export interface ResourceGithub {
  fullName: string; stars: number; lastCommitAt: string | null; description: string | null; defaultBranch: string | null; language: string | null;
  source: 'api' | 'catalog'; fetchedAt?: string;
}

export interface ResourceGroup { id: number; name: string; icon: string | null; color: string | null; rank: number; isDefault: boolean; count: number }

export interface WorkResource {
  id: number;
  groupId: number | null;
  groupName: string | null;
  title: string;
  url: string;
  description: string | null;
  tags: string[];
  kind: string;
  faviconUrl: string | null;
  pinned: boolean;
  pinnedToSidebar: boolean;
  visibility: ResourceVisibility;
  rank: number;
  github: ResourceGithub | null;
  createdAt: string;
  updatedAt: string;
  // Chỉ người của đội thấy (khách: không có).
  createdById?: number | null;
  createdByName?: string | null;
  lastOpenedAt?: string | null;
  openCount?: number;
  linkStatus?: LinkStatus;
  checkedAt?: string | null;
  check?: { status?: number | null; error?: string | null; at?: string } | null;
  canEdit?: boolean;
}

export interface ResourceList {
  groups: ResourceGroup[];
  ungrouped: number;
  items: WorkResource[];
  total: number;
  tags: Array<{ tag: string; count: number }>;
  kinds: Array<{ kind: string; count: number }>;
  canEdit: boolean;
  canManage: boolean;
  broken?: number;
}

export interface ResourceInput {
  title?: string | null;
  url?: string;
  description?: string | null;
  tags?: string[];
  groupId?: number | null;
  pinned?: boolean;
  pinnedToSidebar?: boolean;
  visibility?: ResourceVisibility;
}

export interface UrlPreview {
  url: string; kind: string; faviconUrl: string | null; title: string; description: string | null; fetched: boolean;
  github: ResourceGithub | null; duplicateOf: { id: number; title: string } | null;
}

export interface ImportResult {
  format: 'markdown' | 'csv';
  rows: Array<{ line: number; title: string; url: string; group: string | null; tags: string[]; description: string | null; status: 'new' | 'duplicate' }>;
  errors: Array<{ line: number; message: string }>;
  willCreate: number;
  duplicates: number;
  newGroups: string[];
  created: number;
}

export interface WebLink { id: number; resourceId: number | null; title: string; url: string; kind: string; faviconUrl: string | null; inResources: boolean; createdAt: string; canDelete: boolean }

export interface ResourceFilter { q?: string; group?: number | 'none'; tag?: string; kind?: string; pinned?: boolean; status?: LinkStatus }

export const resKeys = {
  all: (pid: number) => ['work', 'resources', pid] as const,
  list: (pid: number, f: ResourceFilter = {}) => ['work', 'resources', pid, 'list', f] as const,
  sidebar: (pid: number) => ['work', 'resources', pid, 'sidebar'] as const,
  webLinks: (pid: number, num: number) => ['work', 'resources', pid, 'web-links', num] as const,
  portal: (pid: number, asClient: boolean) => ['work', 'portal', pid, 'resources', asClient] as const,
};

export const resApi = {
  list: (pid: number, f: ResourceFilter = {}) => d<ResourceList>(api.get(`${B}/projects/${pid}/resources`, {
    params: {
      q: f.q || undefined, group: f.group, tag: f.tag || undefined, kind: f.kind || undefined, status: f.status,
      pinned: f.pinned === undefined ? undefined : f.pinned ? '1' : '0',
    },
  })),
  sidebar: (pid: number) => d<{ enabled: boolean; items: Array<{ id: number; title: string; url: string; kind: string; faviconUrl: string | null }> }>(api.get(`${B}/projects/${pid}/resources/sidebar`)),
  get: (pid: number, id: number) => d<WorkResource>(api.get(`${B}/projects/${pid}/resources/${id}`)),
  create: (pid: number, body: ResourceInput & { url: string }) => d<WorkResource>(api.post(`${B}/projects/${pid}/resources`, body)),
  update: (pid: number, id: number, body: ResourceInput) => d<WorkResource>(api.patch(`${B}/projects/${pid}/resources/${id}`, body)),
  remove: (pid: number, id: number) => d<{ deleted: boolean }>(api.delete(`${B}/projects/${pid}/resources/${id}`)),
  open: (pid: number, id: number) => d<{ id: number; url: string }>(api.post(`${B}/projects/${pid}/resources/${id}/open`)),
  refresh: (pid: number, id: number) => d<WorkResource>(api.post(`${B}/projects/${pid}/resources/${id}/refresh`)),
  preview: (pid: number, url: string) => d<UrlPreview>(api.post(`${B}/projects/${pid}/resources/preview`, { url })),
  importText: (pid: number, body: { text: string; format?: 'auto' | 'markdown' | 'csv'; groupId?: number | null; dryRun?: boolean }) =>
    d<ImportResult>(api.post(`${B}/projects/${pid}/resources/import`, body)),
  reorder: (pid: number, groupId: number | null, ids: number[]) => d<ResourceList>(api.put(`${B}/projects/${pid}/resources/reorder`, { groupId, ids })),
  checkNow: (pid: number) => d<{ checked: number; broken: number; notified: number }>(api.post(`${B}/projects/${pid}/resources/check`)),
  createGroup: (pid: number, body: { name: string; icon?: string | null; color?: string | null }) => d<ResourceGroup>(api.post(`${B}/projects/${pid}/resource-groups`, body)),
  updateGroup: (pid: number, gid: number, body: { name?: string; icon?: string | null; color?: string | null }) => d<ResourceGroup>(api.patch(`${B}/projects/${pid}/resource-groups/${gid}`, body)),
  deleteGroup: (pid: number, gid: number) => d<{ deleted: boolean; moved: number }>(api.delete(`${B}/projects/${pid}/resource-groups/${gid}`)),
  reorderGroups: (pid: number, ids: number[]) => d<ResourceList>(api.put(`${B}/projects/${pid}/resource-groups/reorder`, { ids })),
  // Web links trên thẻ.
  webLinks: (pid: number, num: number) => d<{ items: WebLink[]; canEdit: boolean }>(api.get(`${B}/projects/${pid}/issues/${num}/web-links`)),
  addWebLink: (pid: number, num: number, body: { resourceId?: number; url?: string; title?: string | null }) => d<{ items: WebLink[]; canEdit: boolean }>(api.post(`${B}/projects/${pid}/issues/${num}/web-links`, body)),
  deleteWebLink: (pid: number, num: number, lid: number) => d<{ items: WebLink[]; canEdit: boolean }>(api.delete(`${B}/projects/${pid}/issues/${num}/web-links/${lid}`)),
  saveWebLink: (pid: number, num: number, lid: number, body: { groupId?: number | null } = {}) => d<{ resourceId: number; created: boolean }>(api.post(`${B}/projects/${pid}/issues/${num}/web-links/${lid}/save`, body)),
  // Cổng khách.
  portal: (pid: number, asClient = false) => d<{ enabled: boolean; staffView?: boolean; groups: ResourceGroup[]; items: WorkResource[]; ungrouped?: number }>(api.get(`${B}/projects/${pid}/portal/resources`, { params: asClient ? { asClient: 1 } : {} })),
  portalOpen: (pid: number, id: number) => d<{ id: number; url: string }>(api.post(`${B}/projects/${pid}/portal/resources/${id}/open`)),
};

/** Nhãn hiển thị cho từng loại link. */
export const KIND_LABEL: Record<string, string> = {
  github: 'GitHub', gitlab: 'GitLab', bitbucket: 'Bitbucket', figma: 'Figma', gdrive: 'Google Drive', gdocs: 'Google Docs', gsheets: 'Google Sheets',
  gslides: 'Google Slides', youtube: 'YouTube', notion: 'Notion', unity: 'Unity', freesound: 'Freesound', mixamo: 'Mixamo', polyhaven: 'Poly Haven',
  sketchfab: 'Sketchfab', onedrive: 'OneDrive', dropbox: 'Dropbox', trello: 'Trello', miro: 'Miro', canva: 'Canva', vercel: 'Vercel', npm: 'npm',
  stackoverflow: 'Stack Overflow', meet: 'Meeting', zoom: 'Zoom', calendar: 'Calendar', mail: 'Email', link: 'Link',
};

/** Mở link trong tab mới NGAY trong cú bấm (trình duyệt chặn popup mở sau await), rồi báo đếm lượt mở ở nền. */
export function openResourceLink(pid: number, r: { id: number; url: string }, portal = false): void {
  // Lưu ý: có 'noopener' thì window.open luôn trả null — không dùng giá trị trả về để đoán bị chặn.
  window.open(r.url, '_blank', 'noopener,noreferrer');
  void (portal ? resApi.portalOpen(pid, r.id) : resApi.open(pid, r.id)).catch(() => undefined);
}
