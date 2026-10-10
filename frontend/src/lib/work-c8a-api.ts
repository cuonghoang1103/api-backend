/**
 * CT Work đợt 8a — kết nối Microsoft 365 / Google theo người: kết nối của tôi, lịch hai chiều, Teams/Meet,
 * tệp OneDrive/Drive trên thẻ, xuất Google Sheets / Excel. Backend: src/routes/work.ctw8a.routes.ts.
 */
import { api } from './api';

const B = '/work';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const P = (pid: number) => `${B}/projects/${pid}/cloud`;

export const c8aKeys = {
  connections: ['work', 'c8a', 'connections'] as const,
  calendars: (p: string) => ['work', 'c8a', 'calendars', p] as const,
  files: (pid: number, num: number) => ['work', 'c8a', pid, 'files', num] as const,
  sheets: (pid: number) => ['work', 'c8a', pid, 'sheets'] as const,
  msFiles: (view: string, folder: string, q: string) => ['work', 'c8a', 'ms-files', view, folder, q] as const,
};

export type CloudProvider = 'microsoft' | 'google';

export interface CalendarSettings { enabled: boolean; calendarId: string | null; calendarName: string | null; syncIssues: boolean; syncMeetings: boolean }

export interface ProviderState {
  id: string; label: string; configured: boolean; capabilities: string[]; scopes: string[]; manageUrl: string | null; redirectUri: string;
  connection: null | {
    status: 'ACTIVE' | 'ERROR'; accountEmail: string | null; accountName: string | null; grantedScopes: string[];
    expiresAt: string | null; lastError: string | null; lastErrorAt: string | null; lastSyncAt: string | null; lastUsedAt: string | null;
    createdAt: string; settings: Partial<CalendarSettings>;
  };
}
export interface ConnectionsView {
  agent: boolean;
  providers: ProviderState[];
  activity: Array<{ id: number; provider: string; kind: string; summary: string; entityType: string | null; entityId: number | null; projectId: number | null; createdAt: string }>;
}

export interface CloudFileRow {
  id: number; provider: CloudProvider; fileId: string; name: string; mimeType: string | null; iconUrl: string | null; webUrl: string;
  size: number | null; lastModifiedBy: string | null; lastModifiedAt: string | null; attachedById: number | null; createdAt: string; canRemove: boolean;
}
export interface BrowseItem { id: string; driveId: string | null; name: string; isFolder: boolean; mimeType: string | null; size: number | null; webUrl: string | null; lastModifiedBy: string | null; lastModifiedAt: string | null }

export interface CloudSheet {
  id: number; provider: CloudProvider; kind: 'issues' | 'report'; title: string; jql: string | null; fileUrl: string; rowCount: number;
  lastSyncedAt: string | null; lastError: string | null; ownerId: number; createdAt: string; mine: boolean;
  owner?: { id: number; username: string; displayName: string | null; fullName: string | null } | null;
}

export interface SyncResult {
  pulled: { applied: number; echoes: number; conflicts: number; detached: number; ignored: number } | null;
  pushed: Record<'created' | 'updated' | 'deleted' | 'unchanged' | 'skipped', number>;
}

export const c8aApi = {
  connections: () => d<ConnectionsView>(api.get(`${B}/integrations`)),
  /** URL trang xin quyền — chuyển trình duyệt sang đó (cookie gắn trình duyệt đã đặt trong phản hồi). */
  startUrl: (provider: string, returnTo = '/work/connections') => d<{ url: string }>(api.get(`${B}/integrations/${provider}/start`, { params: { format: 'json', returnTo } })),
  disconnect: (provider: string, removeEvents: boolean) => d<{ disconnected: boolean; revoked: boolean; manageUrl: string | null }>(api.delete(`${B}/integrations/${provider}`, { params: removeEvents ? { removeEvents: 1 } : {} })),
  calendars: (provider: string) => d<{ items: Array<{ id: string; name: string; primary: boolean; canEdit: boolean }>; settings: CalendarSettings }>(api.get(`${B}/integrations/${provider}/calendars`)),
  saveCalendar: (provider: string, body: Partial<CalendarSettings> & { resync?: boolean }) => d<{ settings: CalendarSettings; result: SyncResult | { error: string } }>(api.put(`${B}/integrations/${provider}/calendar`, body)),
  syncNow: (provider: string) => d<SyncResult>(api.post(`${B}/integrations/${provider}/sync`)),
  msFiles: (q: { view: string; folderId?: string; driveId?: string | null; q?: string }) => d<{ items: BrowseItem[] }>(api.get(`${B}/integrations/microsoft/files`, { params: { ...q, driveId: q.driveId ?? undefined } })),
  googlePicker: () => d<{ accessToken: string; clientId: string; appId: string | null; apiKey: string | null }>(api.get(`${B}/integrations/google/picker`)),

  files: (pid: number, num: number) => d<{ items: CloudFileRow[]; canEdit: boolean; providers: Array<{ id: CloudProvider; label: string; configured: boolean; connected: boolean }> }>(api.get(`${P(pid)}/issues/${num}/files`)),
  attach: (pid: number, num: number, body: { provider: CloudProvider; fileId: string; driveId?: string | null }) => d<CloudFileRow>(api.post(`${P(pid)}/issues/${num}/files`, body)),
  removeFile: (pid: number, num: number, id: number) => d<{ removed: boolean }>(api.delete(`${P(pid)}/issues/${num}/files/${id}`)),
  preview: (pid: number, id: number) => d<{ kind: 'iframe' | 'link'; url: string | null; webUrl: string }>(api.get(`${P(pid)}/files/${id}/preview`)),

  onlineMeeting: (pid: number, num: number, provider: CloudProvider) => d<{ meetingUrl: string | null }>(api.post(`${P(pid)}/meetings/${num}/online`, { provider })),

  sheets: (pid: number) => d<{ items: CloudSheet[] }>(api.get(`${P(pid)}/sheets`)),
  createSheet: (pid: number, body: { provider: CloudProvider; kind: 'issues' | 'report'; title: string; jql?: string | null }) => d<CloudSheet>(api.post(`${P(pid)}/sheets`, body)),
  resyncSheet: (pid: number, id: number) => d<CloudSheet & { mode: 'range' | 'replaced' }>(api.post(`${P(pid)}/sheets/${id}/sync`)),
  deleteSheet: (pid: number, id: number) => d<{ removed: boolean }>(api.delete(`${P(pid)}/sheets/${id}`)),
};

/**
 * Bắt đầu kết nối. Web: lấy URL rồi chuyển trang CÙNG cửa sổ (cookie gắn trình duyệt đặt trong phản hồi phải đi cùng
 * callback). App desktop (baseURL tuyệt đối): mở thẳng tuyến /start trong TRÌNH DUYỆT HỆ THỐNG — start, cookie và
 * callback cùng nằm ở đó (trình duyệt đó cần đang đăng nhập cuongthai.com).
 */
export async function beginConnect(provider: string, returnTo?: string) {
  const goc = String(api.defaults.baseURL ?? '/api/v1').replace(/\/+$/, '');
  if (/^https?:\/\//.test(goc)) {
    const u = `${goc}/work/integrations/${encodeURIComponent(provider)}/start?returnTo=${encodeURIComponent(returnTo ?? '/work/connections')}`;
    window.open(u, '_blank', 'noopener');
    return;
  }
  const { url } = await c8aApi.startUrl(provider, returnTo);
  window.location.assign(url);
}
