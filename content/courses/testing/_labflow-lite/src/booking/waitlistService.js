// Cancel a booking and offer the freed slot to the first student waiting for it (BR-09, lesson 10.1).
import { BookingError } from './service.js';
import { offerNext, OFFER_MINUTES } from '../rules/waitlist.js';

export const slotKey = (b) => b.lab + ' ' + b.date + ' ' + b.start + '-' + b.end;

// waitlists: a Map from slotKey to a queue [{ userId }]; userId is the student's e-mail address.
export async function cancelBooking({ repo, waitlists, mailer, now = () => new Date() }, id) {
  const booking = await repo.remove(id);
  if (!booking) throw new BookingError('NOT_FOUND');
  const key = slotKey(booking);
  const { offer, queue } = offerNext(waitlists.get(key) ?? [], now());
  waitlists.set(key, queue);
  if (offer) {
    await mailer.send({ to: offer.userId, subject: 'A seat is free: ' + key + ' (answer within ' + OFFER_MINUTES + ' minutes)' });
  }
  return { cancelled: booking.id, offeredTo: offer ? offer.userId : null };
}
