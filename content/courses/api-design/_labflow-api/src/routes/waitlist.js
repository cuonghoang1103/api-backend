// routes/waitlist.js — Lab 7 (thiết kế trước, code sau): hàng chờ khi khung giờ đã có người đặt
import { Router } from 'express';
import { z } from 'zod';
import { store } from '../store/index.js';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth } from '../auth.js';
import { validate } from '../validate.js';
import { authorize } from '../policy.js';

const instant = z.iso.datetime({ offset: true });
export const WaitlistCreate = z.strictObject({
  period: z.strictObject({ start: instant, end: instant }),
  purpose: z.string().trim().normalize('NFC').min(1).max(200).optional(),
});
// vị trí = số người CÒN chờ đăng ký trước mình cho khung giờ chồng lên, +1 — TÍNH lúc đọc (store), không lưu
export const toEntry = (e) => ({
  id: e.id, labId: e.labId, userId: e.userId, period: { start: e.startAt, end: e.endAt },
  purpose: e.purpose ?? null, status: e.status, position: e.status === 'WAITING' ? e.position : null, createdAt: e.createdAt,
});

// POST /v2/labs/:labId/waitlist
export const joinWaitlist = [requireAuth, validate('body', WaitlistCreate), async (req, res) => {
  const lab = await store.getLab(req.params.labId);
  if (!lab || lab.retiredAt) throw new HttpError(404, 'LAB_NOT_FOUND', { id: req.params.labId });
  const { period, purpose } = req.valid.body;
  const want = { labId: lab.id, startAt: new Date(period.start).toISOString(), endAt: new Date(period.end).toISOString() };
  if (Date.parse(want.endAt) <= Date.parse(want.startAt)) throw new HttpError(422, 'INVALID_TIME_RANGE');
  const taken = await store.findBookingOverlap(lab.id, want.startAt, want.endAt);
  if (!taken) throw new HttpError(409, 'SLOT_AVAILABLE', { id: lab.id });               // còn trống ⇒ đặt thẳng, đừng xếp hàng
  const mine = await store.findMyWaiting(req.user.id, want);
  if (mine) throw new HttpError(409, 'ALREADY_WAITING', { id: mine.id }, { entry: mine.id });
  const e = await store.addWaitlist({ ...want, userId: req.user.id, purpose: purpose ?? null });
  res.status(201).location(`/v${req.apiVersion}/waitlist/${e.id}`).json(toEntry(e));
}];

export const myWaitlist = [requireAuth, async (req, res) => {
  res.json({ data: (await store.myWaitlist(req.user.id)).map(toEntry) });
}];

export const waitlistRouter = Router();
waitlistRouter.route('/:id')
  .delete(requireAuth, async (req, res) => {
    const notFound = new HttpError(404, 'WAITLIST_NOT_FOUND', { id: req.params.id });
    const e = await store.getWaiting(req.params.id);
    if (!e) throw notFound;
    authorize(req, 'waitlist:cancel', e, notFound);   // của người khác ⇒ 404 như bài 6.2
    await store.cancelWaitlist(e.id);
    res.status(204).end();
  })
  .all(onlyAllow('DELETE'));
