/**
 * CT Work đợt 8a — adapter Microsoft Graph / Google cho lịch, phòng họp, tệp, bảng tính.
 * Mọi lời gọi đi qua providerRequest() (Bearer + tự refresh khi 401) ⇒ test chỉ cần mock một chỗ (oauth/http.ts).
 *
 * Chống vòng lặp đồng bộ: mọi sự kiện CT Work tạo mang id CT Work —
 *   Google `extendedProperties.private.ctworkId`, Graph `singleValueExtendedProperties` (PROP_ID dưới đây).
 * Graph luôn gửi `Prefer: IdType="ImmutableId"` (id sự kiện không đổi khi bị chuyển thư mục) + `outlook.timezone="UTC"`.
 */

import crypto from 'node:crypto';
import { GRAPH } from '../oauth/providers.js';
import { ProviderApiError } from '../oauth/http.js';
import { providerJson, providerRequest, type LiveConnection } from '../oauth/connections.js';
import { xlsxWorkbook } from '../exchange.service.js';

// ─── Kiểu chung ──────────────────────────────────────────────────

export interface DesiredEvent {
  title: string;
  description: string;
  url: string;
  location?: string | null;
  allDay: boolean;
  /** allDay: 00:00Z của ngày; end = 00:00Z ngày KẾ TIẾP (không tính). */
  start: Date;
  end: Date;
  timezone: string;
  /** "issue:12" | "meeting:5" */
  ctworkId: string;
}

export interface RemoteEvent {
  id: string;
  deleted: boolean;
  start: Date | null;
  end: Date | null;
  allDay: boolean;
  updatedAt: Date | null;
  ctworkId: string | null;
}

export interface CalendarInfo { id: string; name: string; primary: boolean; canEdit: boolean }

export interface CloudFile {
  id: string; driveId: string | null; name: string; isFolder: boolean; mimeType: string | null; size: number | null;
  webUrl: string | null; iconUrl: string | null; lastModifiedBy: string | null; lastModifiedAt: string | null;
}

export interface CloudAdapter {
  listCalendars(c: LiveConnection): Promise<CalendarInfo[]>;
  createEvent(c: LiveConnection, calendarId: string, ev: DesiredEvent, opts?: { onlineMeeting?: boolean }): Promise<{ id: string; updatedAt: Date | null; joinUrl?: string | null }>;
  updateEvent(c: LiveConnection, calendarId: string, eventId: string, ev: DesiredEvent): Promise<{ updatedAt: Date | null }>;
  deleteEvent(c: LiveConnection, calendarId: string, eventId: string): Promise<void>;
  changes(c: LiveConnection, calendarId: string, cursor: string | null): Promise<{ events: RemoteEvent[]; cursor: string | null }>;
  createOnlineMeeting(c: LiveConnection, calendarId: string, ev: DesiredEvent): Promise<{ joinUrl: string; eventId: string | null; updatedAt: Date | null }>;
  getFile(c: LiveConnection, fileId: string, driveId?: string | null): Promise<CloudFile>;
  previewUrl(c: LiveConnection, file: { fileId: string; driveId: string | null; webUrl: string }): Promise<string | null>;
  createSheet(c: LiveConnection, title: string, sheetName: string, rows: Cell[][]): Promise<{ fileId: string; fileUrl: string }>;
  writeSheet(c: LiveConnection, fileId: string, sheetName: string, rows: Cell[][]): Promise<{ mode: 'range' | 'replaced' }>;
}

export type Cell = string | number | null;

const iso = (d: Date) => d.toISOString();
const day = (d: Date) => d.toISOString().slice(0, 10);
const json = (body: unknown) => ({ 'Content-Type': 'application/json', body: JSON.stringify(body) });

/** Tên vùng A1 cho n cột. */
export function colName(i: number): string {
  let s = '';
  for (let n = i + 1; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
}

/** Ô bắt đầu bằng = + - @ ⇒ thêm nháy (Excel Graph hiểu là công thức — chặn formula injection). */
export const safeCell = (v: Cell): Cell => (typeof v === 'string' && /^[=+\-@]/.test(v) ? `'${v}` : v);

// ─── Microsoft Graph ─────────────────────────────────────────────

/** GUID riêng của CT Work cho extended property (cố định — đổi là mất nhận diện sự kiện cũ). */
export const MS_PROP_ID = 'String {6a1f4c52-8c1e-4f0b-9d2a-c7e0d3b5a8f1} Name ctworkId';
const msHeaders = { Prefer: 'IdType="ImmutableId", outlook.timezone="UTC"' };
const msCal = (calendarId: string) => (calendarId === 'primary' ? `${GRAPH}/me/calendar` : `${GRAPH}/me/calendars/${encodeURIComponent(calendarId)}`);
const msDt = (d: Date) => ({ dateTime: iso(d).slice(0, 19), timeZone: 'UTC' });

/** "2026-10-12T00:00:00.0000000" + UTC ⇒ Date. Sự kiện cả ngày bị đổi múi giờ ⇒ làm tròn về nửa đêm gần nhất. */
export function msParse(t: { dateTime?: string; timeZone?: string } | undefined, allDay: boolean): Date | null {
  if (!t?.dateTime) return null;
  const d = new Date(`${t.dateTime.slice(0, 19)}Z`);
  if (Number.isNaN(d.getTime())) return null;
  if (allDay) {
    const h = d.getUTCHours();
    d.setUTCHours(0, 0, 0, 0);
    if (h >= 12) d.setUTCDate(d.getUTCDate() + 1);
  }
  return d;
}

function msBody(ev: DesiredEvent) {
  return {
    subject: ev.title.slice(0, 255),
    body: { contentType: 'text', content: `${ev.description}\n${ev.url}`.slice(0, 8000) },
    start: msDt(ev.start), end: msDt(ev.end), isAllDay: ev.allDay,
    showAs: ev.allDay ? 'free' : 'busy',
    isReminderOn: !ev.allDay,
    ...(ev.location ? { location: { displayName: ev.location.slice(0, 255) } } : {}),
    singleValueExtendedProperties: [{ id: MS_PROP_ID, value: ev.ctworkId }],
  };
}

function msFile(it: Record<string, any>): CloudFile {
  const remote = it.remoteItem as Record<string, any> | undefined;
  const src = remote ?? it;
  return {
    id: String(src.id), driveId: src.parentReference?.driveId ?? it.parentReference?.driveId ?? null,
    name: String(it.name ?? src.name ?? 'Untitled'), isFolder: !!(src.folder ?? it.folder),
    mimeType: src.file?.mimeType ?? it.file?.mimeType ?? null, size: typeof src.size === 'number' ? src.size : null,
    webUrl: src.webUrl ?? it.webUrl ?? null, iconUrl: null,
    lastModifiedBy: src.lastModifiedBy?.user?.displayName ?? it.lastModifiedBy?.user?.displayName ?? null,
    lastModifiedAt: src.lastModifiedDateTime ?? it.lastModifiedDateTime ?? null,
  };
}

const msItem = (fileId: string, driveId?: string | null) => (driveId ? `${GRAPH}/drives/${encodeURIComponent(driveId)}/items/${encodeURIComponent(fileId)}` : `${GRAPH}/me/drive/items/${encodeURIComponent(fileId)}`);

export const microsoftAdapter: CloudAdapter & {
  browse(c: LiveConnection, q: { view: 'recent' | 'root' | 'shared' | 'folder' | 'search'; folderId?: string; driveId?: string | null; q?: string }): Promise<CloudFile[]>;
} = {
  async listCalendars(c) {
    const r = await providerJson<{ value: Array<{ id: string; name: string; isDefaultCalendar?: boolean; canEdit?: boolean }> }>(c, `${GRAPH}/me/calendars?$select=id,name,isDefaultCalendar,canEdit&$top=100`, { headers: msHeaders });
    return (r.value ?? []).map((x) => ({ id: x.id, name: x.name, primary: !!x.isDefaultCalendar, canEdit: x.canEdit !== false }));
  },
  async createEvent(c, calendarId, ev) {
    const r = await providerJson<{ id: string; lastModifiedDateTime?: string }>(c, `${msCal(calendarId)}/events`, { method: 'POST', headers: { ...msHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify(msBody(ev)) });
    return { id: r.id, updatedAt: r.lastModifiedDateTime ? new Date(r.lastModifiedDateTime) : null };
  },
  async updateEvent(c, _calendarId, eventId, ev) {
    const r = await providerJson<{ lastModifiedDateTime?: string }>(c, `${GRAPH}/me/events/${encodeURIComponent(eventId)}`, { method: 'PATCH', headers: { ...msHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify(msBody(ev)) });
    return { updatedAt: r.lastModifiedDateTime ? new Date(r.lastModifiedDateTime) : null };
  },
  async deleteEvent(c, _calendarId, eventId) {
    try {
      await providerRequest(c, `${GRAPH}/me/events/${encodeURIComponent(eventId)}`, { method: 'DELETE', headers: msHeaders });
    } catch (err) {
      if (err instanceof ProviderApiError && (err.status === 404 || err.status === 410)) return;
      throw err;
    }
  },
  async changes(c, calendarId, cursor) {
    const events: RemoteEvent[] = [];
    const start = new Date(Date.now() - 30 * 86_400_000);
    const end = new Date(Date.now() + 400 * 86_400_000);
    let url = cursor ?? `${msCal(calendarId)}/calendarView/delta?startDateTime=${encodeURIComponent(iso(start))}&endDateTime=${encodeURIComponent(iso(end))}`;
    for (let page = 0; page < 50; page++) {
      let r: Record<string, any>;
      try {
        r = await providerJson<Record<string, any>>(c, url, { headers: { ...msHeaders, Prefer: `${msHeaders.Prefer}, odata.maxpagesize=100` } });
      } catch (err) {
        // deltaLink hết hạn ⇒ đồng bộ lại từ đầu.
        if (cursor && err instanceof ProviderApiError && (err.status === 410 || err.providerCode === 'syncStateNotFound' || err.providerCode === 'resyncRequired')) {
          return this.changes(c, calendarId, null);
        }
        throw err;
      }
      for (const it of (r.value ?? []) as Array<Record<string, any>>) {
        const removed = !!it['@removed'] || it.isCancelled === true;
        const allDay = !!it.isAllDay;
        events.push({
          id: String(it.id), deleted: removed, allDay,
          start: removed ? null : msParse(it.start, allDay), end: removed ? null : msParse(it.end, allDay),
          updatedAt: it.lastModifiedDateTime ? new Date(it.lastModifiedDateTime) : null, ctworkId: null,
        });
      }
      if (r['@odata.nextLink']) { url = r['@odata.nextLink']; continue; }
      return { events, cursor: r['@odata.deltaLink'] ?? cursor ?? null };
    }
    return { events, cursor: cursor ?? null };
  },
  async createOnlineMeeting(c, _calendarId, ev) {
    try {
      const r = await providerJson<{ joinWebUrl?: string; joinUrl?: string }>(c, `${GRAPH}/me/onlineMeetings`, {
        method: 'POST', ...json({ startDateTime: iso(ev.start), endDateTime: iso(ev.end), subject: ev.title.slice(0, 255) }),
        headers: { 'Content-Type': 'application/json' },
      });
      const joinUrl = r.joinWebUrl ?? r.joinUrl;
      if (!joinUrl) throw new ProviderApiError(502, 'Teams did not return a join link');
      return { joinUrl, eventId: null, updatedAt: null };
    } catch (err) {
      // Tài khoản Microsoft CÁ NHÂN không có Teams for Business (/me/onlineMeetings) — báo rõ thay vì lỗi khó hiểu.
      if (err instanceof ProviderApiError && (err.status === 400 || err.status === 403 || err.status === 404)) {
        throw new ProviderApiError(err.status, `Teams meetings need a work or school Microsoft 365 account (${err.message})`, 'TEAMS_UNSUPPORTED');
      }
      throw err;
    }
  },
  async browse(c, q) {
    const sel = '$select=id,name,size,webUrl,file,folder,lastModifiedBy,lastModifiedDateTime,parentReference,remoteItem&$top=100';
    let url: string;
    if (q.view === 'recent') url = `${GRAPH}/me/drive/recent?$top=100`;
    else if (q.view === 'shared') url = `${GRAPH}/me/drive/sharedWithMe?$top=100`;
    else if (q.view === 'search') url = `${GRAPH}/me/drive/root/search(q='${encodeURIComponent((q.q ?? '').replace(/'/g, "''"))}')?${sel}`;
    else if (q.view === 'folder' && q.folderId) url = `${msItem(q.folderId, q.driveId)}/children?${sel}`;
    else url = `${GRAPH}/me/drive/root/children?${sel}`;
    const r = await providerJson<{ value: Array<Record<string, any>> }>(c, url);
    return (r.value ?? []).map(msFile).sort((a, b) => Number(b.isFolder) - Number(a.isFolder) || a.name.localeCompare(b.name));
  },
  async getFile(c, fileId, driveId) {
    const r = await providerJson<Record<string, any>>(c, `${msItem(fileId, driveId)}?$select=id,name,size,webUrl,file,folder,lastModifiedBy,lastModifiedDateTime,parentReference`);
    return msFile(r);
  },
  async previewUrl(c, f) {
    try {
      const r = await providerJson<{ getUrl?: string }>(c, `${msItem(f.fileId, f.driveId)}/preview`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      return r.getUrl ?? null;
    } catch {
      return null;
    }
  },
  async createSheet(c, title, sheetName, rows) {
    const name = `${title.replace(/[\\/:*?"<>|#%]/g, ' ').trim().slice(0, 120) || 'CT Work export'}.xlsx`;
    const buf = xlsxWorkbook([{ name: sheetName, headers: (rows[0] ?? []).map(String), data: rows.slice(1) }]);
    const r = await providerJson<{ id: string; webUrl: string }>(c, `${GRAPH}/me/drive/root:/CT%20Work/${encodeURIComponent(name)}:/content?@microsoft.graph.conflictBehavior=rename`, {
      method: 'PUT', headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }, body: new Uint8Array(buf),
    });
    return { fileId: r.id, fileUrl: r.webUrl };
  },
  async writeSheet(c, fileId, sheetName, rows) {
    const width = Math.max(1, ...rows.map((r) => r.length));
    const values = rows.map((r) => Array.from({ length: width }, (_, i) => safeCell(r[i] ?? '')));
    const ws = `${msItem(fileId)}/workbook/worksheets/${encodeURIComponent(`'${sheetName.replace(/'/g, "''")}'`)}`;
    try {
      await providerRequest(c, `${ws}/range(address='A1:${colName(Math.max(width, 52) - 1)}20000')/clear`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ applyTo: 'Contents' }) });
      await providerRequest(c, `${ws}/range(address='A1:${colName(width - 1)}${values.length}')`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ values }) });
      return { mode: 'range' };
    } catch (err) {
      if (err instanceof ProviderApiError && (err.status === 404 || err.status === 401 || err.status === 429)) throw err;
      // Sổ tính không mở được qua workbook API (OneDrive cá nhân cũ, sheet bị đổi tên…) ⇒ thay cả tệp.
      const buf = xlsxWorkbook([{ name: sheetName, headers: (rows[0] ?? []).map(String), data: rows.slice(1) }]);
      await providerRequest(c, `${msItem(fileId)}/content`, { method: 'PUT', headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }, body: new Uint8Array(buf) });
      return { mode: 'replaced' };
    }
  },
};

// ─── Google ──────────────────────────────────────────────────────

const GCAL = 'https://www.googleapis.com/calendar/v3';
const gCal = (calendarId: string) => `${GCAL}/calendars/${encodeURIComponent(calendarId)}`;

function gBody(ev: DesiredEvent) {
  return {
    summary: ev.title.slice(0, 255),
    description: `${ev.description}\n${ev.url}`.slice(0, 8000),
    ...(ev.location ? { location: ev.location.slice(0, 255) } : {}),
    start: ev.allDay ? { date: day(ev.start) } : { dateTime: iso(ev.start), timeZone: ev.timezone },
    end: ev.allDay ? { date: day(ev.end) } : { dateTime: iso(ev.end), timeZone: ev.timezone },
    transparency: ev.allDay ? 'transparent' : 'opaque',
    source: { title: 'CT Work', url: ev.url },
    extendedProperties: { private: { ctworkId: ev.ctworkId } },
  };
}

export function gParse(t: { date?: string; dateTime?: string } | undefined): { at: Date | null; allDay: boolean } {
  if (!t) return { at: null, allDay: false };
  if (t.date) return { at: new Date(`${t.date}T00:00:00Z`), allDay: true };
  if (t.dateTime) { const d = new Date(t.dateTime); return { at: Number.isNaN(d.getTime()) ? null : d, allDay: false }; }
  return { at: null, allDay: false };
}

function gEvent(it: Record<string, any>): RemoteEvent {
  const deleted = it.status === 'cancelled';
  const s = gParse(it.start);
  const e = gParse(it.end);
  return {
    id: String(it.id), deleted, allDay: s.allDay, start: deleted ? null : s.at, end: deleted ? null : e.at,
    updatedAt: it.updated ? new Date(it.updated) : null, ctworkId: it.extendedProperties?.private?.ctworkId ?? null,
  };
}

const DRIVE_FIELDS = 'id,name,mimeType,iconLink,webViewLink,size,modifiedTime,lastModifyingUser(displayName),driveId';

export const googleAdapter: CloudAdapter = {
  async listCalendars(c) {
    // Scope calendar.events KHÔNG cho đọc calendarList ⇒ lỗi 403 thì chỉ có "primary" (người dùng vẫn gõ được id lịch khác).
    try {
      const r = await providerJson<{ items?: Array<{ id: string; summary: string; primary?: boolean; accessRole?: string }> }>(c, `${GCAL}/users/me/calendarList?minAccessRole=writer&maxResults=100`);
      const items = (r.items ?? []).map((x) => ({ id: x.id, name: x.summary, primary: !!x.primary, canEdit: x.accessRole === 'owner' || x.accessRole === 'writer' }));
      if (items.length) return items;
    } catch (err) {
      if (!(err instanceof ProviderApiError) || (err.status !== 403 && err.status !== 401)) throw err;
    }
    return [{ id: 'primary', name: 'Primary calendar', primary: true, canEdit: true }];
  },
  async createEvent(c, calendarId, ev, opts = {}) {
    const body: Record<string, unknown> = gBody(ev);
    if (opts.onlineMeeting) body.conferenceData = { createRequest: { requestId: crypto.randomUUID(), conferenceSolutionKey: { type: 'hangoutsMeet' } } };
    const r = await providerJson<Record<string, any>>(c, `${gCal(calendarId)}/events${opts.onlineMeeting ? '?conferenceDataVersion=1' : ''}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const joinUrl = r.hangoutLink ?? (r.conferenceData?.entryPoints as Array<{ entryPointType: string; uri: string }> | undefined)?.find((p) => p.entryPointType === 'video')?.uri ?? null;
    return { id: String(r.id), updatedAt: r.updated ? new Date(r.updated) : null, joinUrl };
  },
  async updateEvent(c, calendarId, eventId, ev) {
    const r = await providerJson<{ updated?: string }>(c, `${gCal(calendarId)}/events/${encodeURIComponent(eventId)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(gBody(ev)) });
    return { updatedAt: r.updated ? new Date(r.updated) : null };
  },
  async deleteEvent(c, calendarId, eventId) {
    try {
      await providerRequest(c, `${gCal(calendarId)}/events/${encodeURIComponent(eventId)}`, { method: 'DELETE' });
    } catch (err) {
      if (err instanceof ProviderApiError && (err.status === 404 || err.status === 410)) return;
      throw err;
    }
  },
  async changes(c, calendarId, cursor) {
    const events: RemoteEvent[] = [];
    let pageToken: string | null = null;
    for (let page = 0; page < 40; page++) {
      const q = new URLSearchParams({ showDeleted: 'true', maxResults: '250' });
      if (cursor) q.set('syncToken', cursor);
      if (pageToken) q.set('pageToken', pageToken);
      let r: Record<string, any>;
      try {
        r = await providerJson<Record<string, any>>(c, `${gCal(calendarId)}/events?${q.toString()}`);
      } catch (err) {
        // 410 Gone = syncToken hết hạn ⇒ đồng bộ lại từ đầu.
        if (cursor && err instanceof ProviderApiError && err.status === 410) return this.changes(c, calendarId, null);
        throw err;
      }
      for (const it of (r.items ?? []) as Array<Record<string, any>>) events.push(gEvent(it));
      if (r.nextPageToken) { pageToken = r.nextPageToken; continue; }
      return { events, cursor: r.nextSyncToken ?? cursor ?? null };
    }
    return { events, cursor: cursor ?? null };
  },
  async createOnlineMeeting(c, calendarId, ev) {
    const r = await this.createEvent(c, calendarId, ev, { onlineMeeting: true });
    if (!r.joinUrl) throw new ProviderApiError(502, 'Google did not return a Meet link (Meet may be turned off for this account)');
    return { joinUrl: r.joinUrl, eventId: r.id, updatedAt: r.updatedAt };
  },
  async getFile(c, fileId) {
    const r = await providerJson<Record<string, any>>(c, `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?fields=${encodeURIComponent(DRIVE_FIELDS)}&supportsAllDrives=true`);
    return {
      id: String(r.id), driveId: r.driveId ?? null, name: String(r.name ?? 'Untitled'), isFolder: r.mimeType === 'application/vnd.google-apps.folder',
      mimeType: r.mimeType ?? null, size: r.size ? Number(r.size) : null, webUrl: r.webViewLink ?? `https://drive.google.com/file/d/${r.id}/view`,
      iconUrl: r.iconLink ?? null, lastModifiedBy: r.lastModifyingUser?.displayName ?? null, lastModifiedAt: r.modifiedTime ?? null,
    };
  },
  async previewUrl(_c, f) {
    return googlePreviewUrl(f.fileId, f.webUrl);
  },
  async createSheet(c, title, sheetName) {
    const r = await providerJson<{ spreadsheetId: string; spreadsheetUrl: string }>(c, 'https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ properties: { title: title.slice(0, 200) || 'CT Work export' }, sheets: [{ properties: { title: sheetName, gridProperties: { frozenRowCount: 1 } } }] }),
    });
    return { fileId: r.spreadsheetId, fileUrl: r.spreadsheetUrl };
  },
  async writeSheet(c, fileId, sheetName, rows) {
    const base = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(fileId)}/values`;
    const range = (a: string) => encodeURIComponent(`'${sheetName.replace(/'/g, "''")}'!${a}`);
    await providerRequest(c, `${base}/${range('A1:ZZ')}:clear`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    // RAW: chuỗi "=…" là CHỮ, không thành công thức.
    await providerRequest(c, `${base}/${range('A1')}?valueInputOption=RAW`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ range: `'${sheetName}'!A1`, majorDimension: 'ROWS', values: rows }) });
    return { mode: 'range' };
  },
};

/** Link nhúng Google Drive: tài liệu gốc Google ⇒ docs.google.com/<loại>/d/<id>/preview; tệp khác ⇒ drive.google.com/file/d/<id>/preview. */
export function googlePreviewUrl(fileId: string, webUrl: string | null): string {
  const m = /docs\.google\.com\/(document|spreadsheets|presentation|drawings)\/d\/([A-Za-z0-9_-]+)/.exec(webUrl ?? '');
  if (m) return `https://docs.google.com/${m[1]}/d/${m[2]}/preview`;
  return `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/preview`;
}

export function adapterFor(provider: string): CloudAdapter {
  if (provider === 'microsoft') return microsoftAdapter;
  if (provider === 'google') return googleAdapter;
  throw new ProviderApiError(400, `No cloud adapter for ${provider}`);
}

export const CLOUD_PROVIDERS = ['microsoft', 'google'] as const;
export type CloudProvider = (typeof CLOUD_PROVIDERS)[number];
