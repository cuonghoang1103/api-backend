import { Router } from 'express';
import { store } from '../store/index.js';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth } from '../auth.js';
import { validate } from '../validate.js';
import { BookingCreate, BookingCreateV2, BookingsQuery, BookingsQueryV2 } from '../schemas.js';
import { encodeCursor, decodeCursor, fingerprint } from '../paging.js';
import { viewsOf } from '../views.js';
import { idempotent } from '../idempotency.js';
import { bookingLimit } from '../rateLimit.js';
import { authorize } from '../policy.js';
import { now } from '../deprecation.js';
import { requireDependency } from '../resilience.js';
import { notModifiedEarly } from '../httpCache.js';
import { notifySync } from '../notify.js';

// Chương 12: dữ liệu đi qua `store` (RAM hoặc PostgreSQL — LABFLOW_STORE). Sự kiện lượt đặt (Chương 10) do store phát:
// kho RAM vẫn ghi kép như Chương 10, kho PostgreSQL ghi vào outbox CÙNG transaction (bài 12.5).

// Bài 6.3 (OWASP API6 — luồng nghiệp vụ nhạy cảm): một sinh viên giữ tối đa 3 lượt đặt còn hiệu lực
export const MAX_ACTIVE = 3;

export const bookingsRouter = Router();
bookingsRouter.use(requireAuth);   // mọi thao tác đặt chỗ đều cần đăng nhập

async function findOwnBooking(req) {
  const b = await store.getBooking(req.params.id);
  if (!b) throw new HttpError(404, 'BOOKING_NOT_FOUND', { id: req.params.id });
  if (b.userId !== req.user.id && req.user.role !== 'LAB_MANAGER')
    throw new HttpError(403, 'FORBIDDEN');
  return b;
}

// Bài 9.1 — danh sách RIÊNG của từng người: private (cache dùng chung không được giữ), no-cache (dùng lại phải hỏi server bằng ETag)
// LABFLOW_CACHE_BUG=1 ⇒ cố ý ghi public, max-age=60 để thấy cache dùng chung làm lộ dữ liệu (CHỈ để học)
const bookingsCacheControl = () => (process.env.LABFLOW_CACHE_BUG ? 'public, max-age=60' : 'private, no-cache');

bookingsRouter.route('/')
  .get(validate('query', { 1: BookingsQuery, 2: BookingsQueryV2 }), notModifiedEarly('bookings', bookingsCacheControl), async (req, res) => {
    const { limit, cursor, fields, include, ...query } = req.valid.query;   // query = bộ lọc + sort
    const f = fingerprint(query);
    const after = cursor ? decodeCursor(cursor, query.sort.replace('-', ''), f) : null;
    // bài 8.1: phần "db" — kho RAM lọc + sắp mảng; kho PostgreSQL là MỘT câu SQL dùng index (user_id, created_at, seq)
    const rows = await req.timing.timeAsync('db', () => store.listBookings({ ...query, after, limit,
      userId: req.user.role === 'LAB_MANAGER' ? null : req.user.id, v1: req.apiVersion === 1 }));
    const page = rows.slice(0, limit);
    const next = rows.length > limit ? encodeCursor(page[page.length - 1], query.sort.replace('-', ''), f) : null;
    if (next) {
      const qs = new URLSearchParams(req.query);   // giữ nguyên bộ lọc, chỉ thay con trỏ
      qs.set('cursor', next);
      res.links({ next: `${req.baseUrl}?${qs}` });   // /bookings, /v1/bookings hay /v2/bookings
    }
    // include=lab: tra phòng bằng MỘT lần đọc cho cả trang — không đọc lại cho từng dòng (N+1)
    const labById = include === 'lab' ? new Map((await store.allLabs()).map((l) => [l.id, l])) : null;
    const view = viewsOf(req);
    const data = page.map((b) => {
      let v = view.booking(b);
      if (fields) v = Object.fromEntries(['id', ...fields.filter((x) => x !== 'id')].map((k) => [k, v[k]]));
      if (labById) v.lab = view.lab(labById.get(b.labId));
      return v;
    });
    res.json({ data, page: { limit, next } });
  })
  .post(requireDependency, idempotent(), bookingLimit, validate('body', { 1: BookingCreate, 2: BookingCreateV2 }), async (req, res) => {   // 5.1 trước 5.3: lần phát lại không tốn lượt
    const body = req.valid.body;                                  // 1) hình dạng đã được validate kiểm ⇒ 400
    const startAt = new Date(body.period?.start ?? body.startAt); // v2 ⇒ dạng nội bộ (một chỗ duy nhất)
    const endAt = new Date(body.period?.end ?? body.endAt);
    // 2) Đúng hình dạng nhưng vô nghĩa về nghiệp vụ ⇒ 422 (phòng không có, quá 3 lượt: store kiểm, vì cần dữ liệu)
    if (endAt <= startAt) throw new HttpError(422, 'INVALID_TIME_RANGE');
    // 3) Hợp lệ nhưng đụng trạng thái hiện tại ⇒ 409 (kho PostgreSQL: ràng buộc EXCLUDE bookings_no_overlap)
    const booking = await req.timing.timeAsync('db', () => store.createBooking({ labId: body.labId, userId: req.user.id, role: req.user.role,
      startAt: startAt.toISOString(), endAt: endAt.toISOString(), purpose: body.purpose, now: now(), maxActive: MAX_ACTIVE }));
    await notifySync(req, 'created', booking);                    // bài 12.5: CHỈ để so — gửi mail ngay trong request (LABFLOW_NOTIFY=sync)
    res.status(201).location(`${req.baseUrl}/${booking.id}`).json(viewsOf(req).booking(booking));
  })
  .all(onlyAllow('GET', 'HEAD', 'POST'));

// Bài 6.2 — biên nhận có tên và email sinh viên: dữ liệu của MỘT người ⇒ kiểm quyền theo BẢN GHI
bookingsRouter.route('/:id/receipt')
  .get(async (req, res) => {
    const notFound = new HttpError(404, 'BOOKING_NOT_FOUND', { id: req.params.id });
    const b = await store.getBooking(req.params.id);
    if (!b) throw notFound;
    authorize(req, 'booking:read', b, notFound);                   // không có quyền ⇒ cũng 404: không lộ là bản ghi tồn tại
    const [lab, student] = await Promise.all([store.getLab(b.labId), store.getUser(b.userId)]);
    res.json({ bookingId: b.id, lab: { code: lab.code, name: lab.name }, student: { name: student.name, email: student.email },
      period: { start: b.startAt, end: b.endAt }, status: b.status });
  })
  .all(onlyAllow('GET', 'HEAD'));

bookingsRouter.route('/:id')
  .get(async (req, res) => res.json(viewsOf(req).booking(await findOwnBooking(req))))
  .all(onlyAllow('GET', 'HEAD'));

// Bài 4.4 — check-in: CHỈ có ở v2 (v1 không biết trạng thái CHECKED_IN); ở v1 đường này không tồn tại ⇒ 404
const v2Only = (req, res, next) => (req.apiVersion === 2 ? next() : next('router'));
bookingsRouter.route('/:id/check-in')
  .post(v2Only, requireDependency, async (req, res) => {
    const b = await findOwnBooking(req);
    if (b.status !== 'PENDING') throw new HttpError(409, 'NOT_PENDING', { id: b.id, status: b.status });
    const done = await store.checkInBooking(b.id);                 // UPDATE … WHERE status = 'PENDING'
    if (!done) throw new HttpError(409, 'NOT_PENDING', { id: b.id, status: (await store.getBooking(b.id)).status });   // ai đó đổi trước
    res.json(viewsOf(req).booking(done));
  })
  .all(v2Only, onlyAllow('POST'));

// Hành động nghiệp vụ có luật riêng ⇒ một "tài nguyên hành động" dùng POST
bookingsRouter.route('/:id/cancel')
  .post(requireDependency, async (req, res) => {
    const b = await findOwnBooking(req);
    if (b.status === 'CANCELLED') throw new HttpError(409, 'ALREADY_CANCELLED', { id: b.id });
    const done = await store.cancelBooking(b.id);                  // UPDATE … WHERE status <> 'CANCELLED': hai người cùng huỷ ⇒ một 200, một 409
    if (!done) throw new HttpError(409, 'ALREADY_CANCELLED', { id: b.id });
    await notifySync(req, 'cancelled', done);
    res.json(viewsOf(req).booking(done));
  })
  .all(onlyAllow('POST'));
