// store/memory.js — "kho" trong RAM của Chương 1–11, gom về sau MỘT giao diện (bài 12.3).
// Vẫn giữ để: npm test chạy không cần CSDL, và để so số đo trước/sau (bài 12.6). Mọi hàm async để route không phân biệt hai kho.
import { labs, devices, users, bookings, nextId } from '../db.js';
import { HttpError } from '../http.js';
import { fold } from '../text.js';
import { orderBy } from '../paging.js';
import { v1Status } from '../views.js';
import { publish } from '../events.js';
import { bookingEvent, bookingEventType } from './events.js';

export const kind = 'memory';
const clone = (x) => (x ? { ...x } : x);                 // trả BẢN SAO: route sửa object không được lặng lẽ sửa "CSDL"

/* ── users + API key ── */
export const getUser = async (id) => users.find((u) => u.id === id);
export const getUserByEmail = async (email) => users.find((u) => u.email === email);
export async function updateUser(id, fields) { const u = users.find((x) => x.id === id); Object.assign(u, fields); return u; }
const apiKeys = new Map();                                // sha256 ⇒ { userId, prefix, createdAt }
export async function saveApiKey(hash, meta) { apiKeys.set(hash, meta); }
export const userIdByKeyHash = async (hash) => apiKeys.get(hash)?.userId;
export const listApiKeys = async (userId) => [...apiKeys.values()].filter((k) => k.userId === userId);

/* ── labs ── */
export async function listLabs({ building, minCapacity, q } = {}) {
  let data = labs.filter((l) => !l.retiredAt);
  if (building) data = data.filter((l) => l.building === building);
  if (minCapacity) data = data.filter((l) => l.capacity >= minCapacity);
  if (q) data = data.filter((l) => fold(l.name).includes(fold(q)));
  return data;
}
export const getLab = async (id) => labs.find((l) => l.id === id);
export const allLabs = async () => labs;

/* ── devices ── */
export const listDevices = async ({ labId } = {}) => (labId ? devices.filter((d) => d.labId === labId) : devices).map(clone);
export const getDevice = async (id) => clone(devices.find((d) => d.id === id));
export const devicesById = async (ids) => new Map(devices.filter((d) => ids.includes(d.id)).map((d) => [d.id, d]));
export const serialTaken = async (serialNo, exceptId) => devices.some((d) => d.serialNo === serialNo && d.id !== exceptId);
export async function createDevice(body) { const d = { id: nextId('dev'), ...body }; devices.push(d); return clone(d); }
// expectedVersion: số phiên bản client đã thấy (If-Match). Khác ⇒ null (route trả 412)
function editable(id, expectedVersion) {
  const d = devices.find((x) => x.id === id);
  return d && (expectedVersion === undefined || (d.version ?? 1) === expectedVersion) ? d : null;
}
export async function replaceDevice(id, body, expectedVersion) {
  const d = editable(id, expectedVersion); if (!d) return null;
  const version = (d.version ?? 1) + 1;
  Object.keys(d).forEach((k) => delete d[k]);
  Object.assign(d, { id, ...body, version });
  return clone(d);
}
export async function patchDevice(id, patch, expectedVersion) {
  const d = editable(id, expectedVersion); if (!d) return null;
  for (const [k, v] of Object.entries(patch)) { if (v === null) delete d[k]; else d[k] = v; }
  d.version = (d.version ?? 1) + 1;
  return clone(d);
}
export async function deleteDevice(id) { const i = devices.findIndex((x) => x.id === id); if (i === -1) return false; devices.splice(i, 1); return true; }
export async function setManualUrl(id, url) { devices.find((d) => d.id === id).manualUrl = url; }
export async function setDeviceStatus(id, status) { devices.find((d) => d.id === id).status = status; }

/* ── bookings ── */
const overlaps = (b, labId, start, end) => b.labId === labId && b.status !== 'CANCELLED' && Date.parse(start) < Date.parse(b.endAt) && Date.parse(b.startAt) < Date.parse(end);
// ⚠ GHI KÉP (bài 10.3): lưu xong MỚI phát — phát hỏng thì sự kiện mất. Kho pg dùng outbox thay vì cách này.
const emit = (kind, b) => publish(bookingEventType(kind), b.id, bookingEvent(b)).catch((e) => console.error('publish', e.message));
export const versions = { bookings: 0, labs: 0 };
export const listVersion = async (name) => versions[name];

export async function listBookings({ userId, labId, status, from, to, q, sort, after, limit, v1 }) {
  const mine = userId ? bookings.filter((b) => b.userId === userId) : bookings;
  let rows = mine.filter((b) => (!labId || b.labId === labId)
    && (!status || status.includes(v1 ? v1Status(b.status) : b.status))
    && (!from || Date.parse(b.endAt) > Date.parse(from)) && (!to || Date.parse(b.startAt) < Date.parse(to))
    && (!q || fold(b.purpose ?? '').includes(fold(q))));
  const { cmp } = orderBy(sort);
  rows.sort(cmp);
  if (after) rows = rows.filter((b) => cmp(after, b) < 0);
  return rows.slice(0, limit + 1);
}
export const getBooking = async (id) => bookings.find((b) => b.id === id);
export const findBookingOverlap = async (labId, start, end) => bookings.find((b) => overlaps(b, labId, start, end));

export async function createBooking({ labId, userId, role, startAt, endAt, purpose, now, maxActive }) {
  const lab = labs.find((l) => l.id === labId && !l.retiredAt);
  if (!lab) throw new HttpError(422, 'UNKNOWN_LAB', { id: labId });
  if (role === 'STUDENT') {
    const active = bookings.filter((b) => b.userId === userId && b.status !== 'CANCELLED' && Date.parse(b.endAt) > now).length;
    if (active >= maxActive) throw new HttpError(422, 'TOO_MANY_ACTIVE_BOOKINGS', { max: maxActive });
  }
  const clash = bookings.find((b) => overlaps(b, labId, startAt, endAt));
  if (clash) throw new HttpError(409, 'BOOKING_CONFLICT', { other: clash.id }, { conflictWith: clash.id });
  const b = { id: nextId('bk'), labId, userId, startAt, endAt, purpose: purpose ?? null, status: 'PENDING',
    createdAt: new Date().toISOString(), version: 1 };
  bookings.push(b);
  versions.bookings++;
  emit('created', b);
  return b;
}
function change(id, from, to, stamp) {
  const b = bookings.find((x) => x.id === id);
  if (!b || !from(b.status)) return null;
  b.status = to;
  b[stamp] = new Date().toISOString();
  b.version = (b.version ?? 1) + 1;
  versions.bookings++;
  return b;
}
export async function checkInBooking(id) { const b = change(id, (s) => s === 'PENDING', 'CHECKED_IN', 'checkedInAt'); if (b) emit('checked_in', b); return b; }
export async function cancelBooking(id) { const b = change(id, (s) => s !== 'CANCELLED', 'CANCELLED', 'cancelledAt'); if (b) emit('cancelled', b); return b; }

// Lab 8 — báo cáo dùng phòng: { "2026-11-02|lab_1": { bookings, hours } } quét MỘT lần
export async function usageCells(from, days) {
  const lo = Date.parse(from), hi = lo + days * 86400000;
  const cells = new Map();
  for (const b of bookings) {
    if (b.status === 'CANCELLED') continue;
    const t = Date.parse(b.startAt);
    if (t < lo || t >= hi) continue;
    const k = `${b.startAt.slice(0, 10)}|${b.labId}`;
    const c = cells.get(k) ?? { bookings: 0, hours: 0 };
    c.bookings++;
    c.hours += (Date.parse(b.endAt) - t) / 3600000;
    cells.set(k, c);
  }
  return cells;
}

/* ── waitlist (Lab 7) ── */
const waitlist = [];
const wOverlap = (a, b) => Date.parse(a.startAt) < Date.parse(b.endAt) && Date.parse(b.startAt) < Date.parse(a.endAt);
const positionOf = (e) => waitlist.filter((x) => x.labId === e.labId && x.status === 'WAITING'
  && wOverlap(x, e) && x.createdAt <= e.createdAt && x.id !== e.id).length + 1;
const withPos = (e) => ({ ...e, position: e.status === 'WAITING' ? positionOf(e) : null });
export const findMyWaiting = async (userId, want) => waitlist.find((e) => e.userId === userId && e.labId === want.labId && e.status === 'WAITING' && wOverlap(e, want));
export async function addWaitlist(e) { const x = { id: nextId('wl'), ...e, status: 'WAITING', createdAt: new Date().toISOString() }; waitlist.push(x); return withPos(x); }
export const myWaitlist = async (userId) => waitlist.filter((e) => e.userId === userId && e.status === 'WAITING').map(withPos);
export const getWaiting = async (id) => waitlist.find((x) => x.id === id && x.status === 'WAITING');
export async function cancelWaitlist(id) { waitlist.find((x) => x.id === id).status = 'CANCELLED'; }

export async function ping() { return true; }
export async function close() {}
