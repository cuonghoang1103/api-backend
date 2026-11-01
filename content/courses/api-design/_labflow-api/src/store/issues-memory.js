// store/issues-memory.js — báo hỏng thiết bị trong RAM (Lab 1, 3, 5). Lab 12: bạn viết bản PostgreSQL cùng giao diện (issues-pg.js).
import { devices, issues, nextId } from '../db.js';
import { HttpError } from '../http.js';
import { fold } from '../text.js';
import { orderBy } from '../paging.js';

const RANKS = { severity: { LOW: 1, MEDIUM: 2, HIGH: 3 } };
export const listDeviceIssues = async (deviceId) => issues.filter((i) => i.deviceId === deviceId);
// Luật: một thiết bị không có hai báo hỏng ĐANG MỞ cùng tiêu đề (so như người đọc); HIGH ⇒ khoá thiết bị (MAINTENANCE)
export async function createIssue({ deviceId, reportedBy, title, severity, description }) {
  const same = issues.find((i) => i.deviceId === deviceId && i.status === 'OPEN' && fold(i.title) === fold(title));
  if (same) throw new HttpError(409, 'DUPLICATE_ISSUE', { existing: same.id }, { existing: same.id });
  const issue = { id: nextId('iss'), deviceId, reportedBy, title, severity, description, status: 'OPEN', createdAt: new Date().toISOString() };
  issues.push(issue);
  if (severity === 'HIGH') { const d = devices.find((x) => x.id === deviceId); if (d) d.status = 'MAINTENANCE'; }
  return issue;
}
export async function listIssues({ status, severity, deviceId, sort, after, limit }) {
  let rows = issues.filter((i) => (!status || i.status === status) && (!severity || i.severity === severity) && (!deviceId || i.deviceId === deviceId));
  const { cmp } = orderBy(sort, RANKS);
  rows.sort(cmp);
  if (after) rows = rows.filter((i) => cmp(after, i) < 0);
  return rows.slice(0, limit + 1);
}
export const getIssue = async (id) => issues.find((i) => i.id === id);
// null = có người đổi trước (version lệch) ⇒ 412; 'ALREADY' = đã xử lý ⇒ 409
export async function resolveIssue(id, resolution, expectedVersion) {
  const i = issues.find((x) => x.id === id);
  if (expectedVersion !== undefined && (i.version ?? 1) !== expectedVersion) return null;
  if (i.status === 'RESOLVED') return 'ALREADY';
  Object.assign(i, { status: 'RESOLVED', resolvedAt: new Date().toISOString(), version: (i.version ?? 1) + 1 });
  if (resolution) i.resolution = resolution;
  return i;
}
