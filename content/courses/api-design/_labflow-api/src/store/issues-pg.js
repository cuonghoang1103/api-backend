// store/issues-pg.js — Lab 12 (LỜI GIẢI): báo hỏng trên PostgreSQL, cùng giao diện với issues-memory.js.
// Ba luật trước đây "đúng vì chỉ có một tiến trình" nay phải đúng với nhiều instance:
//   1) trùng tiêu đề đang mở ⇒ index duy nhất có điều kiện (issues_open_title) chặn, kể cả hai request cùng lúc
//   2) HIGH ⇒ thiết bị MAINTENANCE trong CÙNG transaction với báo hỏng (không có trạng thái nửa vời)
//   3) If-Match ⇒ UPDATE … WHERE version = $n (bài 12.4), không đọc-rồi-ghi
import { HttpError } from '../http.js';
import { q, tx } from '../pg.js';
import { idNum } from '../paging.js';
import { fold } from '../text.js';

const iso = (d) => (d ? d.toISOString() : null);
const toIssue = (r) => {
  if (!r) return r;
  const i = { id: r.id, deviceId: r.device_id, reportedBy: r.reported_by, title: r.title, severity: r.severity,
    description: r.description, status: r.status, createdAt: iso(r.created_at), version: r.version };
  if (r.resolved_at) i.resolvedAt = iso(r.resolved_at);
  if (r.resolution) i.resolution = r.resolution;
  return i;
};

export const listDeviceIssues = async (deviceId) =>
  (await q('SELECT * FROM issues WHERE device_id = $1 ORDER BY seq', [deviceId])).rows.map(toIssue);

export async function createIssue({ deviceId, reportedBy, title, severity, description }) {
  try {
    return await tx(async (c) => {
      const row = (await c.query(`INSERT INTO issues (device_id, reported_by, title, title_key, severity, description)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [deviceId, reportedBy, title, fold(title), severity, description ?? null])).rows[0];
      if (severity === 'HIGH') await c.query("UPDATE devices SET status = 'MAINTENANCE', version = version + 1 WHERE id = $1", [deviceId]);
      return toIssue(row);
    });
  } catch (e) {
    if (e.code !== '23505') throw e;                               // unique_violation trên issues_open_title
    const same = (await q("SELECT id FROM issues WHERE device_id = $1 AND title_key = $2 AND status = 'OPEN'", [deviceId, fold(title)])).rows[0];
    throw new HttpError(409, 'DUPLICATE_ISSUE', { existing: same?.id ?? '?' }, { existing: same?.id ?? null });
  }
}

const SORT = { createdAt: 'created_at', severity: 'severity_rank' };
const RANK = { LOW: 1, MEDIUM: 2, HIGH: 3 };
export async function listIssues({ status, severity, deviceId, sort, after, limit }) {
  const desc = sort.startsWith('-'), key = sort.replace('-', ''), col = SORT[key];
  const args = [], w = [];
  const add = (sql, v) => { args.push(v); w.push(sql.replace('?', `$${args.length}`)); };
  if (status) add('status = ?', status);
  if (severity) add('severity = ?', severity);
  if (deviceId) add('device_id = ?', deviceId);
  if (after) {
    args.push(key === 'severity' ? RANK[after.severity] : after[key], idNum(after.id));
    w.push(`(${col}, seq) ${desc ? '<' : '>'} ($${args.length - 1}${key === 'severity' ? '::smallint' : '::timestamptz'}, $${args.length})`);
  }
  args.push(limit + 1);
  const { rows } = await q(`SELECT * FROM issues ${w.length ? `WHERE ${w.join(' AND ')}` : ''}
    ORDER BY ${col} ${desc ? 'DESC' : 'ASC'}, seq ${desc ? 'DESC' : 'ASC'} LIMIT $${args.length}`, args);
  return rows.map(toIssue);
}
export const getIssue = async (id) => toIssue((await q('SELECT * FROM issues WHERE id = $1', [id])).rows[0]);

export async function resolveIssue(id, resolution, expectedVersion) {
  const row = (await q(`UPDATE issues SET status = 'RESOLVED', resolved_at = now(), resolution = coalesce($2, resolution), version = version + 1
    WHERE id = $1 AND status = 'OPEN' AND ($3::int IS NULL OR version = $3) RETURNING *`, [id, resolution ?? null, expectedVersion ?? null])).rows[0];
  if (row) return toIssue(row);
  const now = (await q('SELECT status, version FROM issues WHERE id = $1', [id])).rows[0];
  if (expectedVersion !== undefined && now.version !== expectedVersion) return null;   // có người sửa trước ⇒ 412
  return 'ALREADY';                                                                     // đã RESOLVED ⇒ 409
}
