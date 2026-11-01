import { checkSlot } from '../../../../src/rules/booking.ts';
import { slotMessage } from './messages.ts';

const tries: [string, string][] = [['08:15', '10:00'], ['10:00', '08:00'], ['06:00', '08:00'], ['08:00', '13:00'], ['08:00', '10:00']];
for (const [start, end] of tries) {
  const slot = checkSlot(start, end);
  console.log(start + '-' + end, '→', slot.ok ? 'ok, ' + slot.minutes + ' min' : slotMessage(slot.code));
}
