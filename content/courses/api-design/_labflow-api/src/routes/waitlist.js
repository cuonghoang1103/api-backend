// routes/waitlist.js — Lab 7 (thiết kế trước, code sau): hàng chờ khi khung giờ đã có người đặt
import { Router } from 'express';
import { z } from 'zod';
import { labs, bookings, nextId } from '../db.js';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth } from '../auth.js';
import { validate } from '../validate.js';
import { authorize } from '../policy.js';

const instant = z.iso.datetime({ offset: true });
export const WaitlistCreate = z.strictObject({
  period: z.strictObject({ start: instant, end: instant }),
  purpose: z.string().trim().normalize('NFC').min(1).max(200).optional(),
});
export const waitlist = [];   // { id, labId, userId, startAt, endAt, purpose, status, createdAt }

const overlaps = (a, b) => Date.parse(a.startAt) < Date.parse(b.endAt) && Date.parse(b.startAt) < Date.parse(a.endAt);
// vị trí = số người CÒN chờ đăng ký trước mình cho khung giờ chồng lên, +1
const positionOf = (e) => waitlist.filter((x) => x.labId === e.labId && x.status === 'WAITING'
  && overlaps(x, e) && x.createdAt <= e.createdAt && x.id !== e.id).length + 1;
export const toEntry = (e) => ({
  id: e.id, labId: e.labId, userId: e.userId, period: { start: e.startAt, end: e.endAt },
  purpose: e.purpose ?? null, status: e.status, position: e.status === 'WAITING' ? positionOf(e) : null, createdAt: e.createdAt,
});

// POST /v2/labs/:labId/waitlist
export const joinWaitlist = [requireAuth, validate('body', WaitlistCreate), (req, res) => {
  const lab = labs.find((l) => l.id === req.params.labId && !l.retiredAt);
  if (!lab) throw new HttpError(404, 'LAB_NOT_FOUND', { id: req.params.labId });
  const { period, purpose } = req.valid.body;
  const want = { labId: lab.id, startAt: new Date(period.start).toISOString(), endAt: new Date(period.end).toISOString() };
  if (Date.parse(want.endAt) <= Date.parse(want.startAt)) throw new HttpError(422, 'INVALID_TIME_RANGE');
  const taken = bookings.find((b) => b.labId === lab.id && b.status !== 'CANCELLED' && overlaps(b, want));
  if (!taken) throw new HttpError(409, 'SLOT_AVAILABLE', { id: lab.id });               // còn trống ⇒ đặt thẳng, đừng xếp hàng
  const mine = waitlist.find((e) => e.userId === req.user.id && e.labId === lab.id && e.status === 'WAITING' && overlaps(e, want));
  if (mine) throw new HttpError(409, 'ALREADY_WAITING', { id: mine.id }, { entry: mine.id });
  const e = { id: nextId('wl'), ...want, userId: req.user.id, purpose: purpose ?? null, status: 'WAITING', createdAt: new Date().toISOString() };
  waitlist.push(e);
  res.status(201).location(`/v${req.apiVersion}/waitlist/${e.id}`).json(toEntry(e));
}];

export const myWaitlist = [requireAuth, (req, res) => {
  res.json({ data: waitlist.filter((e) => e.userId === req.user.id && e.status === 'WAITING').map(toEntry) });
}];

export const waitlistRouter = Router();
waitlistRouter.route('/:id')
  .delete(requireAuth, (req, res) => {
    const notFound = new HttpError(404, 'WAITLIST_NOT_FOUND', { id: req.params.id });
    const e = waitlist.find((x) => x.id === req.params.id && x.status === 'WAITING');
    if (!e) throw notFound;
    authorize(req, 'waitlist:cancel', e, notFound);   // của người khác ⇒ 404 như bài 6.2
    e.status = 'CANCELLED';
    res.status(204).end();
  })
  .all(onlyAllow('DELETE'));
