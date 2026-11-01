import { checkSlot, needsApproval } from '../../../../src/rules/booking.ts';

const role = 'STUDENT';
console.log(needsApproval({ seats: 31, role }));
console.log(needsApproval({ seats: 12, role }));
console.log(needsApproval({ seats: 45, role }));

const morning = checkSlot('08:00', '10:00');
if (morning.ok) console.log(morning.minutes);
