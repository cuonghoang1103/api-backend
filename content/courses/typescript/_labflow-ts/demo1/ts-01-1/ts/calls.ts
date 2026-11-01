// Bugs 2 and 3, calling the TYPED rules in src/rules/booking.ts.
import { checkSlot, needsApproval } from '../../../src/rules/booking.ts';

needsApproval({ seat: 31, role: 'STUDENT' });
checkSlot(480, 600);
checkSlot('08:00');
needsApproval({ seats: 31, role: 'lecturer' });
