// Bug 3 — the wrong value: a lower-case role.
import { needsApproval } from '../../js/booking.js';

console.log("LECTURER, 31 seats → needs approval?", needsApproval({ seats: 31, role: 'LECTURER' }));
console.log("lecturer, 31 seats → needs approval?", needsApproval({ seats: 31, role: 'lecturer' }));
