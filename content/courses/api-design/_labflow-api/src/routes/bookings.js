import { Router } from 'express';
import { bookings, labs, users, nextId } from '../db.js';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth } from '../auth.js';
import { validate } from '../validate.js';
import { BookingCreate, BookingCreateV2, BookingsQuery, BookingsQueryV2 } from '../schemas.js';
import { orderBy, encodeCursor, decodeCursor, fingerprint } from '../paging.js';
import { fold } from '../text.js';
import { viewsOf, v1Status } from '../views.js';
import { idempotent } from '../idempotency.js';
import { bookingLimit } from '../rateLimit.js';
import { authorize } from '../policy.js';
import { now } from '../deprecation.js';
import { requireDependency } from '../resilience.js';
import { notModifiedEarly, bump } from '../httpCache.js';

// Bài 6.3 (OWASP API6 — luồng nghiệp vụ nhạy cảm): một sinh viên giữ tối đa 3 lượt đặt còn hiệu lực
export const MAX_ACTIVE = 3;

export const bookingsRouter = Router();
bookingsRouter.use(requireAuth);   // mọi thao tác đặt chỗ đều cần đăng nhập

function findOwnBooking(req) {
  const b = bookings.find((x) => x.id === req.params.id);
  if (!b) throw new HttpError(404, 'BOOKING_NOT_FOUND', { id: req.params.id });
  if (b.userId !== req.user.id && req.user.role !== 'LAB_MANAGER')
    throw new HttpError(403, 'FORBIDDEN');
  return b;
}

// Bài 9.1 — danh sách RIÊNG của từng người: private (cache dùng chung không được giữ), no-cache (dùng lại phải hỏi server bằng ETag)
// LABFLOW_CACHE_BUG=1 ⇒ cố ý ghi public, max-age=60 để thấy cache dùng chung làm lộ dữ liệu (CHỈ để học)
const bookingsCacheControl = () => (process.env.LABFLOW_CACHE_BUG ? 'public, max-age=60' : 'private, no-cache');

bookingsRouter.route('/')
  .get(validate('query', { 1: BookingsQuery, 2: BookingsQueryV2 }), notModifiedEarly('bookings', bookingsCacheControl), (req, res) => {
    const { limit, cursor, fields, include, ...query } = req.valid.query;   // query = bộ lọc + sort
    const { labId, status, from, to, q, sort } = query;
    // bài 8.1: phần "db" — ở Chương 12 là một câu SQL; giờ là lọc + sắp mảng trong RAM
    let rows = req.timing.time('db', () => {
    const mine = req.user.role === 'LAB_MANAGER' ? bookings : bookings.filter((b) => b.userId === req.user.id);
    return mine.filter((b) =>
      (!labId || b.labId === labId)
      && (!status || status.includes(req.apiVersion === 1 ? v1Status(b.status) : b.status))   // lọc theo đúng cái client THẤY
      && (!from || Date.parse(b.endAt) > Date.parse(from))      // chồng lên [from, to): kết thúc sau from…
      && (!to || Date.parse(b.startAt) < Date.parse(to))        // …và bắt đầu trước to
      && (!q || fold(b.purpose ?? '').includes(fold(q))));
    });
    const { key, cmp } = orderBy(sort);
    req.timing.time('sort', () => rows.sort(cmp));
    const f = fingerprint(query);
    if (cursor) {
      const after = decodeCursor(cursor, key, f);
      rows = rows.filter((b) => cmp(after, b) < 0);           // chỉ lấy những gì đứng SAU vị trí con trỏ
    }
    const page = rows.slice(0, limit);
    const next = rows.length > limit ? encodeCursor(page[page.length - 1], key, f) : null;
    if (next) {
      const qs = new URLSearchParams(req.query);   // giữ nguyên bộ lọc, chỉ thay con trỏ
      qs.set('cursor', next);
      res.links({ next: `${req.baseUrl}?${qs}` });   // /bookings, /v1/bookings hay /v2/bookings
    }
    // include=lab: tra phòng bằng MỘT Map dựng sẵn — không tìm lại trong mảng cho từng dòng (N+1)
    const labById = include === 'lab' ? new Map(labs.map((l) => [l.id, l])) : null;
    const view = viewsOf(req);
    const data = page.map((b) => {
      let v = view.booking(b);
      if (fields) v = Object.fromEntries(['id', ...fields.filter((x) => x !== 'id')].map((k) => [k, v[k]]));
      if (labById) v.lab = view.lab(labById.get(b.labId));
      return v;
    });
    res.json({ data, page: { limit, next } });
  })
  .post(requireDependency, idempotent(), bookingLimit, validate('body', { 1: BookingCreate, 2: BookingCreateV2 }), (req, res) => {   // 5.1 trước 5.3: lần phát lại không tốn lượt
    const body = req.valid.body;                                  // 1) hình dạng đã được validate kiểm ⇒ 400
    const { labId, purpose } = body;
    const startAt = body.period?.start ?? body.startAt;           // v2 ⇒ dạng nội bộ (một chỗ duy nhất)
    const endAt = body.period?.end ?? body.endAt;
    // 2) Đúng hình dạng nhưng vô nghĩa về nghiệp vụ ⇒ 422
    const start = new Date(startAt), end = new Date(endAt);
    if (end <= start) throw new HttpError(422, 'INVALID_TIME_RANGE');
    const lab = labs.find((l) => l.id === labId && !l.retiredAt);
    if (!lab) throw new HttpError(422, 'UNKNOWN_LAB', { id: labId });
    // 3) Hợp lệ nhưng đụng trạng thái hiện tại ⇒ 409
    if (req.user.role === 'STUDENT') {
      const active = bookings.filter((b) => b.userId === req.user.id && b.status !== 'CANCELLED' && Date.parse(b.endAt) > now()).length;
      if (active >= MAX_ACTIVE) throw new HttpError(422, 'TOO_MANY_ACTIVE_BOOKINGS', { max: MAX_ACTIVE });
    }
    const clash = bookings.find((b) => b.labId === labId && b.status !== 'CANCELLED'
      && start < new Date(b.endAt) && new Date(b.startAt) < end);
    if (clash) throw new HttpError(409, 'BOOKING_CONFLICT', { other: clash.id }, { conflictWith: clash.id });
    const booking = {
      id: nextId('bk'), labId, userId: req.user.id,
      startAt: start.toISOString(), endAt: end.toISOString(),
      purpose: purpose ?? null, status: 'PENDING', createdAt: new Date().toISOString(),
    };
    bookings.push(booking);
    bump('bookings');
    res.status(201).location(`${req.baseUrl}/${booking.id}`).json(viewsOf(req).booking(booking));
  })
  .all(onlyAllow('GET', 'HEAD', 'POST'));

// Bài 6.2 — biên nhận có tên và email sinh viên: dữ liệu của MỘT người ⇒ kiểm quyền theo BẢN GHI
bookingsRouter.route('/:id/receipt')
  .get((req, res) => {
    const notFound = new HttpError(404, 'BOOKING_NOT_FOUND', { id: req.params.id });
    const b = bookings.find((x) => x.id === req.params.id);
    if (!b) throw notFound;
    authorize(req, 'booking:read', b, notFound);                   // không có quyền ⇒ cũng 404: không lộ là bản ghi tồn tại
    const lab = labs.find((l) => l.id === b.labId);
    const student = users.find((u) => u.id === b.userId);
    res.json({ bookingId: b.id, lab: { code: lab.code, name: lab.name }, student: { name: student.name, email: student.email },
      period: { start: b.startAt, end: b.endAt }, status: b.status });
  })
  .all(onlyAllow('GET', 'HEAD'));

bookingsRouter.route('/:id')
  .get((req, res) => res.json(viewsOf(req).booking(findOwnBooking(req))))
  .all(onlyAllow('GET', 'HEAD'));

// Bài 4.4 — check-in: CHỈ có ở v2 (v1 không biết trạng thái CHECKED_IN); ở v1 đường này không tồn tại ⇒ 404
const v2Only = (req, res, next) => (req.apiVersion === 2 ? next() : next('router'));
bookingsRouter.route('/:id/check-in')
  .post(v2Only, (req, res) => {
    const b = findOwnBooking(req);
    if (b.status !== 'PENDING') throw new HttpError(409, 'NOT_PENDING', { id: b.id, status: b.status });
    b.status = 'CHECKED_IN';
    bump('bookings');
    b.checkedInAt = new Date().toISOString();
    res.json(viewsOf(req).booking(b));
  })
  .all(v2Only, onlyAllow('POST'));

// Hành động nghiệp vụ có luật riêng ⇒ một "tài nguyên hành động" dùng POST
bookingsRouter.route('/:id/cancel')
  .post((req, res) => {
    const b = findOwnBooking(req);
    if (b.status === 'CANCELLED') throw new HttpError(409, 'ALREADY_CANCELLED', { id: b.id });
    b.status = 'CANCELLED';
    bump('bookings');
    b.cancelledAt = new Date().toISOString();
    res.json(viewsOf(req).booking(b));
  })
  .all(onlyAllow('POST'));
