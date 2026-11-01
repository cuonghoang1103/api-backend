// store/pg.js — CÙNG giao diện với store/memory.js, nhưng dữ liệu nằm trong PostgreSQL (bài 12.3).
// Luật cần NGUYÊN TỬ (trùng giờ, tối đa 3 lượt, sửa trên bản cũ) đi vào ràng buộc / transaction / UPDATE … WHERE,
// không còn là "đọc rồi kiểm rồi ghi" trong JavaScript — vì giờ có nhiều instance cùng ghi.
import { HttpError } from '../http.js';
import { pool, q, tx, asHttp } from '../pg.js';
import { idNum } from '../paging.js';
import { bookingEvent, bookingEventType } from './events.js';

export const kind = 'pg';
const iso = (d) => (d ? d.toISOString() : null);
const opt = (o, k, v) => { if (v !== null && v !== undefined) o[k] = v; return o; };   // trường tuỳ chọn: vắng thì không có khoá

/* ── hàng ⇒ object nội bộ (đúng hình dạng mà views.js đã quen từ Chương 1) ── */
const toUser = (r) => r && ({ id: r.id, name: r.name, role: r.role, email: r.email, passwordHash: r.password_hash,
  failedLogins: r.failed_logins, staffNote: r.staff_note });
const toLab = (r) => r && opt({ id: r.id, code: r.code, name: r.name, building: r.building, capacity: r.capacity }, 'retiredAt', iso(r.retired_at));
const toDevice = (r) => r && opt(opt({ id: r.id, labId: r.lab_id, name: r.name, type: r.type, serialNo: r.serial_no, status: r.status,
  version: r.version }, 'note', r.note), 'manualUrl', r.manual_url);
export const toBooking = (r) => r && opt(opt({ id: r.id, labId: r.lab_id, userId: r.user_id, startAt: iso(r.start_at), endAt: iso(r.end_at),
  purpose: r.purpose, status: r.status, createdAt: iso(r.created_at), version: r.version }, 'cancelledAt', iso(r.cancelled_at)), 'checkedInAt', iso(r.checked_in_at));

/* ── users + API key ── */
export const getUser = async (id) => toUser((await q('SELECT * FROM users WHERE id = $1', [id])).rows[0]);
export const getUserByEmail = async (email) => toUser((await q('SELECT * FROM users WHERE email = $1', [email])).rows[0]);
export async function updateUser(id, { name }) {
  return toUser((await q('UPDATE users SET name = $2 WHERE id = $1 RETURNING *', [id, name])).rows[0]);
}
export async function saveApiKey(hash, { userId, prefix, createdAt }) {
  await q('INSERT INTO api_keys (hash, user_id, prefix, created_at) VALUES ($1, $2, $3, $4)', [hash, userId, prefix, createdAt]);
}
export const userIdByKeyHash = async (hash) => (await q('SELECT user_id FROM api_keys WHERE hash = $1', [hash])).rows[0]?.user_id;
export const listApiKeys = async (userId) => (await q('SELECT prefix, created_at FROM api_keys WHERE user_id = $1 ORDER BY created_at', [userId]))
  .rows.map((r) => ({ userId, prefix: r.prefix, createdAt: iso(r.created_at) }));

/* ── labs ── */
const like = (s) => `%${s.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;            // người dùng gõ "%" thì tìm đúng chữ "%"
export async function listLabs({ building, minCapacity, q: text } = {}) {
  const { rows } = await q(`SELECT * FROM labs WHERE retired_at IS NULL
    AND ($1::text IS NULL OR building = $1) AND ($2::int IS NULL OR capacity >= $2)
    AND ($3::text IS NULL OR lower(unaccent(name)) LIKE lower(unaccent($3)))
    ORDER BY id`, [building ?? null, minCapacity ?? null, text ? like(text) : null]);
  return rows.map(toLab);
}
export const getLab = async (id) => toLab((await q('SELECT * FROM labs WHERE id = $1', [id])).rows[0]);
export const allLabs = async () => (await q('SELECT * FROM labs ORDER BY id')).rows.map(toLab);

/* ── devices ── */
const DEV_COLS = { labId: 'lab_id', name: 'name', type: 'type', serialNo: 'serial_no', status: 'status', note: 'note' };
export const listDevices = async ({ labId } = {}) => (await q(`SELECT * FROM devices WHERE ($1::text IS NULL OR lab_id = $1)
  ORDER BY substr(id, 5)::int`, [labId ?? null])).rows.map(toDevice);
export const getDevice = async (id) => toDevice((await q('SELECT * FROM devices WHERE id = $1', [id])).rows[0]);
export const devicesById = async (ids) => new Map((await q('SELECT * FROM devices WHERE id = ANY($1)', [ids])).rows.map((r) => [r.id, toDevice(r)]));
export const serialTaken = async (serialNo, exceptId) =>
  (await q('SELECT 1 FROM devices WHERE serial_no = $1 AND id IS DISTINCT FROM $2', [serialNo, exceptId ?? null])).rowCount > 0;
// Hai quản lý cùng thêm một serial trong cùng khoảnh khắc: kiểm ở route lọt cả hai, UNIQUE chặn người sau ⇒ vẫn 409
const dupSerial = (e, body) => (e.code === '23505' ? new HttpError(409, 'DUPLICATE_SERIAL', { serialNo: body.serialNo }) : asHttp(e));
export async function createDevice(body) {
  try {
    return toDevice((await pool.query(`INSERT INTO devices (lab_id, name, type, serial_no, status, note) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [body.labId, body.name, body.type, body.serialNo, body.status, body.note ?? null])).rows[0]);
  } catch (e) { throw dupSerial(e, body); }
}
// KHOÁ LẠC QUAN trong MỘT câu lệnh (bài 5.4 làm trên nhiều instance): "sửa NẾU version vẫn là số client đã thấy"
// 0 dòng đổi ⇒ có người sửa trước ⇒ null ⇒ 412. Không có khoảng hở giữa "kiểm" và "ghi".
export async function replaceDevice(id, body, expectedVersion) {
  try {
    return toDevice((await pool.query(`UPDATE devices SET lab_id = $3, name = $4, type = $5, serial_no = $6, status = $7, note = $8, manual_url = NULL,
      version = version + 1 WHERE id = $1 AND ($2::int IS NULL OR version = $2) RETURNING *`,
    [id, expectedVersion ?? null, body.labId, body.name, body.type, body.serialNo, body.status, body.note ?? null])).rows[0]) ?? null;
  } catch (e) { throw dupSerial(e, body); }
}
// LABFLOW_NAIVE_UPDATE=1 — CHỈ để học (bài 12.4): bỏ điều kiện version trong UPDATE ⇒ thấy "mất cập nhật" giữa hai instance
const NAIVE = process.env.LABFLOW_NAIVE_UPDATE === '1';
export async function patchDevice(id, patch, expectedVersion) {
  const sets = [], args = [id, NAIVE ? null : expectedVersion ?? null];
  for (const [k, v] of Object.entries(patch)) { args.push(v); sets.push(`${DEV_COLS[k]} = $${args.length}`); }   // tên cột lấy từ danh sách CỐ ĐỊNH
  try {
    return toDevice((await pool.query(`UPDATE devices SET ${[...sets, 'version = version + 1'].join(', ')}
      WHERE id = $1 AND ($2::int IS NULL OR version = $2) RETURNING *`, args)).rows[0]) ?? null;
  } catch (e) { throw dupSerial(e, patch); }
}
export const deleteDevice = async (id) => (await q('DELETE FROM devices WHERE id = $1', [id])).rowCount > 0;
export async function setManualUrl(id, url) { await q('UPDATE devices SET manual_url = $2 WHERE id = $1', [id, url]); }
export async function setDeviceStatus(id, status, client = pool) { await client.query('UPDATE devices SET status = $2 WHERE id = $1', [id, status]); }

/* ── bookings ── */
// ETag danh sách (bài 9.1) đọc số phiên bản CHUNG từ một SEQUENCE ⇒ instance nào trả 304 cũng đúng
export async function listVersion(name) {
  if (name !== 'bookings') return 0;
  const r = (await q('SELECT last_value, is_called FROM bookings_list_version')).rows[0];
  return r.is_called ? r.last_value : 0;
}
// Tăng SAU khi commit: đọc giữa lúc chưa commit thì chỉ tốn thêm một 200 — không bao giờ ra 304 sai
const bumpList = () => pool.query("SELECT nextval('bookings_list_version')").catch((e) => console.error('list version', e.message));

const COL = { createdAt: 'created_at', startAt: 'start_at' };
export async function listBookings({ userId, labId, status, from, to, q: text, sort, after, limit, v1 }) {
  const desc = sort.startsWith('-'), col = COL[sort.replace('-', '')];
  const args = [], w = [];
  const add = (sql, v) => { args.push(v); w.push(sql.replaceAll('?', `$${args.length}`)); };
  if (userId) add('user_id = ?', userId);
  if (labId) add('lab_id = ?', labId);
  // v1 không biết CHECKED_IN (bài 4.4): client v1 lọc PENDING thì phải ra cả lượt đã check-in
  if (status) add(`${v1 ? "CASE WHEN status = 'CHECKED_IN' THEN 'PENDING' ELSE status END" : 'status'} = ANY(?)`, status);
  if (from) add('end_at > ?', from);
  if (to) add('start_at < ?', to);
  if (text) add("lower(unaccent(coalesce(purpose, ''))) LIKE lower(unaccent(?))", like(text));
  if (after) {                                                     // keyset (bài 3.2): (giá trị, seq) đứng SAU con trỏ
    args.push(after[sort.replace('-', '')], idNum(after.id));
    w.push(`(${col}, seq) ${desc ? '<' : '>'} ($${args.length - 1}::timestamptz, $${args.length})`);
  }
  args.push(limit + 1);
  const { rows } = await q(`SELECT * FROM bookings ${w.length ? `WHERE ${w.join(' AND ')}` : ''}
    ORDER BY ${col} ${desc ? 'DESC' : 'ASC'}, seq ${desc ? 'DESC' : 'ASC'} LIMIT $${args.length}`, args);
  return rows.map(toBooking);
}
export const getBooking = async (id) => toBooking((await q('SELECT * FROM bookings WHERE id = $1', [id])).rows[0]);
export const findBookingOverlap = async (labId, start, end) => toBooking((await q(`SELECT * FROM bookings WHERE lab_id = $1 AND status <> 'CANCELLED'
  AND tstzrange(start_at, end_at) && tstzrange($2, $3) LIMIT 1`, [labId, start, end])).rows[0]);

// Sự kiện vào bảng outbox TRONG CÙNG transaction (bài 10.3): lượt đặt có ⇔ sự kiện có. Relay (src/relay.js) chuyển sang Redis.
async function outbox(c, kind, b) {
  await c.query('INSERT INTO outbox (type, subject, data) VALUES ($1, $2, $3)', [bookingEventType(kind), b.id, bookingEvent(b)]);
  await c.query("SELECT pg_notify('labflow_outbox', '')");          // đánh thức relay ngay khi COMMIT (không phải chờ vòng hỏi)
}

// LABFLOW_NO_USER_LOCK=1 — CHỈ để học (bài 12.3): bỏ khoá dòng users ⇒ thấy "tối đa 3 lượt" bị vượt khi bấm song song
const USER_LOCK = process.env.LABFLOW_NO_USER_LOCK !== '1';
export async function createBooking({ labId, userId, role, startAt, endAt, purpose, now, maxActive }) {
  let b;
  try {
    b = await tx(async (c) => {
      const lab = (await c.query('SELECT 1 FROM labs WHERE id = $1 AND retired_at IS NULL', [labId])).rowCount;
      if (!lab) throw new HttpError(422, 'UNKNOWN_LAB', { id: labId });
      if (role === 'STUDENT') {
        // Đếm-rồi-chèn là cuộc đua (bài 11.6). Khoá DÒNG của người này: hai request của CÙNG một người xếp hàng ở đây,
        // người khác không bị chặn.
        if (USER_LOCK) await c.query('SELECT 1 FROM users WHERE id = $1 FOR UPDATE', [userId]);
        const { rows: [{ n }] } = await c.query(`SELECT count(*)::int AS n FROM bookings
          WHERE user_id = $1 AND status <> 'CANCELLED' AND end_at > $2`, [userId, new Date(now)]);
        if (n >= maxActive) throw new HttpError(422, 'TOO_MANY_ACTIVE_BOOKINGS', { max: maxActive });
      }
      const row = (await c.query(`INSERT INTO bookings (lab_id, user_id, start_at, end_at, purpose) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [labId, userId, startAt, endAt, purpose ?? null])).rows[0];
      const bk = toBooking(row);
      await outbox(c, 'created', bk);
      return bk;
    });
  } catch (e) {
    if (e.code !== '23P01') throw e;                               // exclusion_violation: EXCLUDE bookings_no_overlap chặn
    const clash = await findBookingOverlap(labId, startAt, endAt);  // tìm lượt đang giữ giờ để trả conflictWith như Chương 2
    throw new HttpError(409, 'BOOKING_CONFLICT', { other: clash?.id ?? '?' }, { conflictWith: clash?.id ?? null });
  }
  bumpList();
  return b;
}
// Đổi trạng thái bằng MỘT câu UPDATE có điều kiện: hai người cùng huỷ ⇒ một người đổi được, người kia nhận null (409)
async function change(id, where, set, kind) {
  const b = await tx(async (c) => {
    const row = (await c.query(`UPDATE bookings SET ${set}, version = version + 1 WHERE id = $1 AND ${where} RETURNING *`, [id])).rows[0];
    if (!row) return null;
    const bk = toBooking(row);
    await outbox(c, kind, bk);
    return bk;
  });
  if (b) bumpList();
  return b;
}
export const checkInBooking = (id) => change(id, "status = 'PENDING'", "status = 'CHECKED_IN', checked_in_at = now()", 'checked_in');
export const cancelBooking = (id) => change(id, "status <> 'CANCELLED'", "status = 'CANCELLED', cancelled_at = now()", 'cancelled');

export async function usageCells(from, days) {
  const { rows } = await q(`SELECT to_char(start_at AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS day, lab_id, count(*)::int AS n,
      sum(extract(epoch FROM end_at - start_at) / 3600)::float8 AS hours
    FROM bookings WHERE status <> 'CANCELLED' AND start_at >= $1::timestamptz AND start_at < $1::timestamptz + make_interval(days => $2)
    GROUP BY 1, 2`, [`${from}T00:00:00Z`, days]);
  return new Map(rows.map((r) => [`${r.day}|${r.lab_id}`, { bookings: r.n, hours: r.hours }]));
}

/* ── waitlist (Lab 7): vị trí vẫn TÍNH lúc đọc, không lưu ── */
const W_SELECT = `SELECT w.*, CASE WHEN w.status = 'WAITING' THEN 1 + (SELECT count(*) FROM waitlist x WHERE x.lab_id = w.lab_id
  AND x.status = 'WAITING' AND x.start_at < w.end_at AND w.start_at < x.end_at AND x.created_at <= w.created_at AND x.id <> w.id) END AS position
  FROM waitlist w`;
const toEntry = (r) => r && ({ id: r.id, labId: r.lab_id, userId: r.user_id, startAt: iso(r.start_at), endAt: iso(r.end_at),
  purpose: r.purpose, status: r.status, createdAt: iso(r.created_at), position: r.position ?? null });
export const findMyWaiting = async (userId, w) => toEntry((await q(`SELECT * FROM waitlist WHERE user_id = $1 AND lab_id = $2 AND status = 'WAITING'
  AND start_at < $4 AND $3 < end_at LIMIT 1`, [userId, w.labId, w.startAt, w.endAt])).rows[0]);
export async function addWaitlist(e) {
  const id = (await q('INSERT INTO waitlist (lab_id, user_id, start_at, end_at, purpose) VALUES ($1, $2, $3, $4, $5) RETURNING id',
    [e.labId, e.userId, e.startAt, e.endAt, e.purpose])).rows[0].id;
  return toEntry((await q(`${W_SELECT} WHERE w.id = $1`, [id])).rows[0]);
}
export const myWaitlist = async (userId) => (await q(`${W_SELECT} WHERE w.user_id = $1 AND w.status = 'WAITING' ORDER BY w.created_at, w.id`, [userId])).rows.map(toEntry);
export const getWaiting = async (id) => toEntry((await q("SELECT * FROM waitlist WHERE id = $1 AND status = 'WAITING'", [id])).rows[0]);
export async function cancelWaitlist(id) { await q("UPDATE waitlist SET status = 'CANCELLED' WHERE id = $1", [id]); }

export async function ping() { await pool.query('SELECT 1'); return true; }
export const close = () => pool.end();
