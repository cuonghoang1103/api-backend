// LabFlow Lite HTTP API (Chapter 5). Express 5: errors thrown in async handlers reach the error middleware.
import express from 'express';
import { bookLab, BookingError } from '../booking/service.js';
import { BookingInput } from './schemas.js';

const RULE_CODES = ['OFF_GRID', 'END_BEFORE_START', 'OUTSIDE_HOURS', 'TOO_LONG'];
const fail = (res, status, code, extra = {}) => res.status(status).json({ error: { code, ...extra } });
const toPublic = (b) => ({ id: b.id, lab: b.lab, date: b.date, start: b.start, end: b.end, seats: b.seats, status: b.status, minutes: b.minutes });

export function createApp({ repo, auth }) {
  const app = express();
  app.use(express.json());

  const requireUser = async (req, res, next) => {
    const header = req.get('authorization') ?? '';
    if (!header.startsWith('Bearer ')) return fail(res, 401, 'UNAUTHENTICATED');
    try {
      req.user = await auth.verify(header.slice(7));
    } catch {
      return fail(res, 401, 'UNAUTHENTICATED');
    }
    next();
  };
  const requireRole = (role) => (req, res, next) => (req.user.role === role ? next() : fail(res, 403, 'FORBIDDEN'));

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  app.post('/api/bookings', requireUser, async (req, res) => {
    const parsed = BookingInput.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
      return fail(res, 400, 'VALIDATION', { details });
    }
    const booking = await bookLab(repo, { ...parsed.data, role: req.user.role, userId: req.user.id });
    res.status(201).location('/api/bookings/' + booking.id).json(toPublic(booking));
  });

  app.get('/api/bookings/:id', requireUser, async (req, res) => {
    const booking = await repo.findById(Number(req.params.id));
    const mine = booking && (booking.userId === req.user.id || req.user.role === 'ADMIN');
    if (!mine) return fail(res, 404, 'NOT_FOUND');   // someone else's booking looks exactly like a missing one
    res.json(toPublic(booking));
  });

  app.get('/api/admin/bookings', requireUser, requireRole('ADMIN'), async (req, res) => {
    res.json((await repo.list()).map(toPublic));
  });

  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') return fail(res, 400, 'BAD_JSON');
    if (err instanceof BookingError) {
      if (RULE_CODES.includes(err.code)) return fail(res, 422, err.code);
      if (err.code === 'OVERLAP') return fail(res, 409, 'OVERLAP');
      if (err.code === 'STORAGE_DOWN') return fail(res, 503, 'STORAGE_DOWN');
    }
    return fail(res, 500, 'INTERNAL');
  });
  return app;
}
