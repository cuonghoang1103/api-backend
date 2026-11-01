// My bookings over HTTP (Chapter 11, US-11). Mounted by createApp() in server.js.
//   GET  /api/bookings             → 200, my own bookings (cancelled ones too), by date and start
//   POST /api/bookings/:id/cancel  → 200 the cancelled booking · 404 missing or not mine · 409 already cancelled · 422 too late
import { listMyBookings, cancelMyBooking } from '../booking/myBookings.js';

const CANCEL_STATUS = { NOT_FOUND: 404, ALREADY_CANCELLED: 409, TOO_LATE_TO_CANCEL: 422 };
const MAX_ID = 2147483647;   // PostgreSQL "serial" is a 4-byte int: a bigger id is not a booking, it is a 500 waiting to happen

export function mountMyBookings(app, { repo, requireUser, now, fail, toPublic }) {
  app.get('/api/bookings', requireUser, async (req, res) => {
    res.json((await listMyBookings(repo, req.user.id)).map(toPublic));
  });

  app.post('/api/bookings/:id/cancel', requireUser, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1 || id > MAX_ID) return fail(res, 404, 'NOT_FOUND');
    const result = await cancelMyBooking(repo, { id, user: req.user, now: now() });
    if (!result.ok) return fail(res, CANCEL_STATUS[result.code], result.code);
    res.json(toPublic(result.booking));
  });
}
