/**
 * CT Work đợt 8a — phần theo DỰ ÁN của kết nối Microsoft 365 / Google:
 *   - Tệp OneDrive/SharePoint/Google Drive gắn vào thẻ dưới dạng LIÊN KẾT (tên, biểu tượng, người sửa cuối) + xem trước nhúng.
 *   - Phòng họp Teams (/me/onlineMeetings) / Google Meet (conferenceData) cho cuộc họp CT Work ⇒ điền vào chỗ "Join".
 *   - Xuất danh sách thẻ / báo cáo ra Google Sheet hoặc Excel trên OneDrive — MỘT CHIỀU (CT Work → bảng tính);
 *     "Đồng bộ lại" ghi đè vùng dữ liệu.
 * Mọi thao tác chạy bằng kết nối của CHÍNH người bấm. Agent bị chặn ở tuyến (AGENT_DENIED_ROUTES `/cloud/**`) và ở
 * assertHuman() trong liveConnection().
 */

import { z } from 'zod';
import { prisma } from '../../../config/database.js';
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from '../../../middleware/errorHandler.js';
import { requireProject } from '../permissions.js';
import { auditProject } from '../audit.js';
import { emitWorkEvent } from '../events.js';
import { liveConnection, logOAuth, toUserError } from '../oauth/connections.js';
import { getProvider, providerClient } from '../oauth/registry.js';
import { adapterFor, CLOUD_PROVIDERS, googlePreviewUrl, microsoftAdapter, type Cell, type CloudFile } from './adapters.js';
import { adoptEvent, readSettings } from './calendarSync.js';

const label = (p: string) => getProvider(p)?.label ?? p;
export const providerEnum = z.enum(CLOUD_PROVIDERS);

async function issueRef(projectId: number, number: number) {
  const i = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true, number: true } });
  if (!i) throw new NotFoundError('Issue not found');
  return i;
}

// ─── Duyệt tệp (Microsoft — Google dùng Google Picker phía trình duyệt) ─────

export const browseInput = z.object({
  view: z.enum(['recent', 'root', 'shared', 'folder', 'search']).default('recent'),
  folderId: z.string().max(300).optional(),
  driveId: z.string().max(300).optional(),
  q: z.string().max(200).optional(),
});

export async function browseMicrosoft(userId: number, q: z.infer<typeof browseInput>) {
  const conn = await liveConnection(userId, 'microsoft');
  if (q.view === 'search' && !q.q?.trim()) return { items: [] as CloudFile[] };
  try {
    return { items: await microsoftAdapter.browse(conn, q) };
  } catch (err) {
    throw toUserError(err, 'Microsoft 365');
  }
}

/**
 * Google Picker chạy trong trình duyệt và CẦN access token (scope drive.file — chỉ thấy tệp người dùng chọn/ứng dụng
 * tạo). Token chỉ trả cho CHÍNH chủ kết nối, sống ≤ 1 giờ. apiKey (tuỳ chọn) đọc runtime từ CTW_GOOGLE_PICKER_API_KEY.
 */
export async function googlePickerConfig(userId: number) {
  const conn = await liveConnection(userId, 'google');
  const client = providerClient(getProvider('google')!);
  const clientId = client?.clientId ?? '';
  return {
    accessToken: conn.accessToken,
    clientId,
    // appId của Picker = số project Google Cloud = phần số đứng đầu client id ("1234567890-abc.apps.googleusercontent.com").
    appId: /^(\d+)-/.exec(clientId)?.[1] ?? null,
    apiKey: (process.env.CTW_GOOGLE_PICKER_API_KEY ?? '').trim() || null,
  };
}

// ─── Tệp gắn thẻ ─────────────────────────────────────────────────

function fileRow(f: {
  id: number; provider: string; fileId: string; name: string; mimeType: string | null; iconUrl: string | null; webUrl: string;
  sizeBytes: bigint | null; lastModifiedBy: string | null; lastModifiedAt: Date | null; attachedById: number | null; createdAt: Date;
}, userId: number, canEdit: boolean) {
  return {
    id: f.id, provider: f.provider, fileId: f.fileId, name: f.name, mimeType: f.mimeType, iconUrl: f.iconUrl, webUrl: f.webUrl,
    size: f.sizeBytes === null ? null : Number(f.sizeBytes), lastModifiedBy: f.lastModifiedBy, lastModifiedAt: f.lastModifiedAt,
    attachedById: f.attachedById, createdAt: f.createdAt,
    canRemove: canEdit || f.attachedById === userId,
  };
}

export async function listIssueFiles(userId: number, projectId: number, number: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const issue = await issueRef(projectId, number);
  const canEdit = access.role === 'ADMIN' || access.role === 'MEMBER';
  const rows = await prisma.workIssueCloudFile.findMany({ where: { issueId: issue.id }, orderBy: { id: 'asc' } });
  const conns = await prisma.workOAuthConnection.findMany({ where: { userId, provider: { in: [...CLOUD_PROVIDERS] } }, select: { provider: true, status: true } });
  return {
    items: rows.map((r) => fileRow(r, userId, canEdit)),
    canEdit,
    providers: CLOUD_PROVIDERS.map((p) => ({
      id: p, label: label(p), configured: !!providerClient(getProvider(p)!),
      connected: conns.some((c) => c.provider === p && c.status === 'ACTIVE'),
    })),
  };
}

export const attachInput = z.object({
  provider: providerEnum,
  fileId: z.string().trim().min(1).max(300),
  driveId: z.string().trim().max(300).nullable().optional(),
});

export async function attachFile(userId: number, projectId: number, number: number, input: z.infer<typeof attachInput>) {
  const access = await requireProject(userId, projectId, 'issue.edit');
  const issue = await issueRef(projectId, number);
  const conn = await liveConnection(userId, input.provider);
  let f: CloudFile;
  try {
    f = await adapterFor(input.provider).getFile(conn, input.fileId, input.driveId ?? null);
  } catch (err) {
    throw toUserError(err, label(input.provider));
  }
  if (f.isFolder) throw new BadRequestError('Pick a file, not a folder', 'VALIDATION_ERROR');
  if (!f.webUrl || !/^https:\/\//.test(f.webUrl)) throw new BadRequestError('This file has no shareable link', 'VALIDATION_ERROR');
  const data = {
    driveId: f.driveId?.slice(0, 300) ?? null, name: f.name.slice(0, 300), mimeType: f.mimeType?.slice(0, 200) ?? null,
    iconUrl: f.iconUrl && /^https:\/\//.test(f.iconUrl) ? f.iconUrl.slice(0, 500) : null, webUrl: f.webUrl.slice(0, 2000),
    sizeBytes: f.size === null ? null : BigInt(Math.max(0, Math.floor(f.size))),
    lastModifiedBy: f.lastModifiedBy?.slice(0, 200) ?? null, lastModifiedAt: f.lastModifiedAt ? new Date(f.lastModifiedAt) : null,
  };
  const row = await prisma.workIssueCloudFile.upsert({
    where: { issueId_provider_fileId: { issueId: issue.id, provider: input.provider, fileId: f.id } },
    create: { projectId, issueId: issue.id, provider: input.provider, fileId: f.id, attachedById: userId, ...data },
    update: data,
  });
  await auditProject(projectId, { actorId: userId, action: 'cloud.file_attach', targetType: 'issue', targetId: issue.id, summary: `Linked ${label(input.provider)} file "${f.name}" to ${access.key}-${number}`.slice(0, 300) });
  await logOAuth({ userId, provider: input.provider, kind: 'file', entityType: 'ISSUE', entityId: issue.id, projectId, summary: `Linked "${f.name}" to ${access.key}-${number}` });
  emitWorkEvent({ type: 'resources.updated', projectId, action: 'cloud-file', issueNumber: number, actor: { kind: 'USER', userId } });
  return fileRow(row, userId, true);
}

export async function removeFile(userId: number, projectId: number, number: number, fileRowId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const issue = await issueRef(projectId, number);
  const row = await prisma.workIssueCloudFile.findFirst({ where: { id: fileRowId, issueId: issue.id } });
  if (!row) throw new NotFoundError('File link not found');
  const canEdit = access.role === 'ADMIN' || access.role === 'MEMBER';
  if (!canEdit && row.attachedById !== userId) throw new ForbiddenError('You cannot remove this file link');
  await prisma.workIssueCloudFile.delete({ where: { id: row.id } });
  await auditProject(projectId, { actorId: userId, action: 'cloud.file_remove', targetType: 'issue', targetId: issue.id, summary: `Removed file link "${row.name}" from ${access.key}-${number}`.slice(0, 300) });
  emitWorkEvent({ type: 'resources.updated', projectId, action: 'cloud-file', issueNumber: number, actor: { kind: 'USER', userId } });
  return { removed: true };
}

/** Link nhúng xem trước. Microsoft: tạo bằng kết nối của NGƯỜI XEM (họ phải có quyền với tệp); không có ⇒ chỉ mở link. */
export async function filePreview(userId: number, projectId: number, fileRowId: number) {
  await requireProject(userId, projectId, 'project.view');
  const row = await prisma.workIssueCloudFile.findFirst({ where: { id: fileRowId, projectId } });
  if (!row) throw new NotFoundError('File link not found');
  if (row.provider === 'google') return { kind: 'iframe' as const, url: googlePreviewUrl(row.fileId, row.webUrl), webUrl: row.webUrl };
  const has = await prisma.workOAuthConnection.findFirst({ where: { userId, provider: row.provider, status: 'ACTIVE' }, select: { id: true } });
  if (!has) return { kind: 'link' as const, url: null, webUrl: row.webUrl };
  const conn = await liveConnection(userId, row.provider).catch(() => null);
  const url = conn ? await adapterFor(row.provider).previewUrl(conn, { fileId: row.fileId, driveId: row.driveId, webUrl: row.webUrl }) : null;
  return url ? { kind: 'iframe' as const, url, webUrl: row.webUrl } : { kind: 'link' as const, url: null, webUrl: row.webUrl };
}

// ─── Phòng họp Teams / Meet ──────────────────────────────────────

export async function createOnlineMeeting(userId: number, projectId: number, number: number, provider: 'microsoft' | 'google') {
  const { govCtx } = await import('../governanceDb.js');
  await govCtx(userId, projectId, 'meetings', { edit: true });
  const m = await prisma.workMeeting.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true, title: true, startsAt: true, endsAt: true, timezone: true, meetingUrl: true, status: true, project: { select: { key: true, name: true } } } });
  if (!m) throw new NotFoundError('Meeting not found');
  if (m.status === 'CANCELLED') throw new BadRequestError('This meeting is cancelled', 'VALIDATION_ERROR');
  if (m.meetingUrl) throw new AppError('This meeting already has a join link — remove it first', 409, 'MEETING_HAS_LINK');
  const conn = await liveConnection(userId, provider);
  const s = readSettings(conn.settings);
  const calendarId = s.calendarId ?? 'primary';
  let r: { joinUrl: string; eventId: string | null; updatedAt: Date | null };
  try {
    r = await adapterFor(provider).createOnlineMeeting(conn, calendarId, {
      title: `${m.project.key} · ${m.title}`, description: `${m.project.name} (CT Work)`, url: '',
      allDay: false, start: m.startsAt, end: m.endsAt, timezone: m.timezone, ctworkId: `meeting:${m.id}`,
    });
  } catch (err) {
    throw toUserError(err, provider === 'microsoft' ? 'Microsoft Teams' : 'Google Meet');
  }
  // Google: sự kiện có Meet nằm trên lịch — nhận làm sự kiện đồng bộ của cuộc họp này (không tạo trùng).
  if (r.eventId) await adoptEvent(conn, 'MEETING', m.id, calendarId, r.eventId, r.updatedAt);
  const { updateMeeting } = await import('../meetings.service.js');
  const out = await updateMeeting(userId, projectId, number, { meetingUrl: r.joinUrl });
  const what = provider === 'microsoft' ? 'Teams meeting' : 'Google Meet';
  await auditProject(projectId, { actorId: userId, action: 'meeting.online_create', targetType: 'meeting', targetId: m.id, summary: `Created a ${what} for M-${number}` });
  await logOAuth({ userId, provider, kind: 'meeting', entityType: 'MEETING', entityId: m.id, projectId, summary: `Created a ${what} for ${m.project.key} M-${number}` });
  return out;
}

// ─── Bảng tính (một chiều) ───────────────────────────────────────

export const sheetInput = z.object({
  provider: providerEnum,
  kind: z.enum(['issues', 'report']),
  title: z.string().trim().min(1).max(200),
  jql: z.string().max(2000).nullable().optional(),
});

const MAX_ROWS = 5000;
const ISSUE_COLS: Array<[string, string]> = [
  ['key', 'Issue key'], ['type', 'Type'], ['status', 'Status'], ['summary', 'Summary'], ['priority', 'Priority'], ['assignee', 'Assignee'],
  ['reporter', 'Reporter'], ['sprint', 'Sprint'], ['fixVersion', 'Fix version'], ['storyPoints', 'Story points'], ['startDate', 'Start date'],
  ['dueDate', 'Due date'], ['created', 'Created'], ['updated', 'Updated'], ['resolved', 'Resolved'], ['labels', 'Labels'], ['components', 'Components'], ['parent', 'Parent'],
];

/** Dữ liệu bảng tính — đọc bằng quyền của người gọi (exportRows kiểm quyền + JQL + lọc khách). */
export async function sheetRows(userId: number, projectId: number, kind: 'issues' | 'report', jql: string | null): Promise<Cell[][]> {
  const { exportRows } = await import('../exchange.service.js');
  const { rows } = await exportRows(userId, projectId, jql ?? '');
  if (kind === 'issues') {
    return [ISSUE_COLS.map(([, h]) => h), ...rows.slice(0, MAX_ROWS).map((r) => ISSUE_COLS.map(([k]) => {
      const v = (r as unknown as Record<string, unknown>)[k];
      return typeof v === 'number' ? v : v === null || v === undefined ? '' : String(v);
    }))];
  }
  // Báo cáo: số thẻ theo người làm × trạng thái (+ tổng, story points, quá hạn).
  const statuses = [...new Set(rows.map((r) => r.status))].sort();
  const today = new Date().toISOString().slice(0, 10);
  const by = new Map<string, { counts: Map<string, number>; total: number; points: number; overdue: number }>();
  for (const r of rows) {
    const who = r.assignee || 'Unassigned';
    const b = by.get(who) ?? { counts: new Map(), total: 0, points: 0, overdue: 0 };
    b.counts.set(r.status, (b.counts.get(r.status) ?? 0) + 1);
    b.total++;
    b.points += r.storyPoints ?? 0;
    if (r.dueDate && r.dueDate < today && !r.resolved) b.overdue++;
    by.set(who, b);
  }
  const out: Cell[][] = [['Assignee', ...statuses, 'Total', 'Story points', 'Overdue']];
  for (const [who, b] of [...by.entries()].sort((a, c) => c[1].total - a[1].total)) {
    out.push([who, ...statuses.map((s) => b.counts.get(s) ?? 0), b.total, b.points, b.overdue]);
  }
  out.push(['Total', ...statuses.map((s) => rows.filter((r) => r.status === s).length), rows.length, rows.reduce((a, r) => a + (r.storyPoints ?? 0), 0), [...by.values()].reduce((a, b) => a + b.overdue, 0)]);
  return out;
}

function sheetView(s: { id: number; provider: string; kind: string; title: string; jql: string | null; fileUrl: string; rowCount: number; lastSyncedAt: Date | null; lastError: string | null; userId: number; createdAt: Date }, userId: number) {
  return { id: s.id, provider: s.provider, kind: s.kind, title: s.title, jql: s.jql, fileUrl: s.fileUrl, rowCount: s.rowCount, lastSyncedAt: s.lastSyncedAt, lastError: s.lastError, ownerId: s.userId, createdAt: s.createdAt, mine: s.userId === userId };
}

export async function listSheets(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.view');
  const rows = await prisma.workCloudSheet.findMany({ where: { projectId }, orderBy: { id: 'desc' }, take: 100 });
  const owners = await prisma.user.findMany({ where: { id: { in: [...new Set(rows.map((r) => r.userId))] } }, select: { id: true, username: true, displayName: true, fullName: true } });
  return {
    items: rows.map((r) => ({ ...sheetView(r, userId), owner: owners.find((o) => o.id === r.userId) ?? null })),
  };
}

export async function createSheet(userId: number, projectId: number, input: z.infer<typeof sheetInput>) {
  const access = await requireProject(userId, projectId, 'project.view');
  const rows = await sheetRows(userId, projectId, input.kind, input.jql ?? null);
  const conn = await liveConnection(userId, input.provider);
  const adapter = adapterFor(input.provider);
  let file: { fileId: string; fileUrl: string };
  try {
    file = await adapter.createSheet(conn, input.title, 'CT Work', rows);
    if (input.provider === 'google') await adapter.writeSheet(conn, file.fileId, 'CT Work', rows);
  } catch (err) {
    throw toUserError(err, label(input.provider));
  }
  const s = await prisma.workCloudSheet.create({
    data: { projectId, userId, provider: input.provider, kind: input.kind, title: input.title, jql: input.jql?.trim() || null, fileId: file.fileId, fileUrl: file.fileUrl, rowCount: rows.length - 1, lastSyncedAt: new Date() },
  });
  await auditProject(projectId, { actorId: userId, action: 'cloud.sheet_export', targetType: 'project', targetId: projectId, summary: `Exported ${input.kind === 'issues' ? 'the issue list' : 'a report'} of ${access.key} to ${label(input.provider)}: "${input.title}"`.slice(0, 300) });
  await logOAuth({ userId, provider: input.provider, kind: 'sheet', projectId, summary: `Exported ${rows.length - 1} rows of ${access.key} to "${input.title}"` });
  return sheetView(s, userId);
}

export async function resyncSheet(userId: number, projectId: number, sheetId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const s = await prisma.workCloudSheet.findFirst({ where: { id: sheetId, projectId } });
  if (!s) throw new NotFoundError('Spreadsheet not found');
  if (s.userId !== userId) throw new ForbiddenError('Only the person who created this spreadsheet can sync it (it lives in their drive)');
  const rows = await sheetRows(userId, projectId, s.kind as 'issues' | 'report', s.jql);
  const conn = await liveConnection(userId, s.provider);
  try {
    const r = await adapterFor(s.provider).writeSheet(conn, s.fileId, s.sheetName, rows);
    const u = await prisma.workCloudSheet.update({ where: { id: s.id }, data: { rowCount: rows.length - 1, lastSyncedAt: new Date(), lastError: null } });
    await logOAuth({ userId, provider: s.provider, kind: 'sheet', projectId, summary: `Re-synced "${s.title}" (${rows.length - 1} rows${r.mode === 'replaced' ? ', file replaced' : ''}) — ${access.key}` });
    return { ...sheetView(u, userId), mode: r.mode };
  } catch (err) {
    const e = toUserError(err, label(s.provider));
    await prisma.workCloudSheet.update({ where: { id: s.id }, data: { lastError: e.message.slice(0, 500) } });
    throw e;
  }
}

export async function deleteSheet(userId: number, projectId: number, sheetId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const s = await prisma.workCloudSheet.findFirst({ where: { id: sheetId, projectId } });
  if (!s) throw new NotFoundError('Spreadsheet not found');
  if (s.userId !== userId && access.role !== 'ADMIN') throw new ForbiddenError('Only the owner or a project admin can remove this');
  await prisma.workCloudSheet.delete({ where: { id: s.id } });
  return { removed: true };
}
