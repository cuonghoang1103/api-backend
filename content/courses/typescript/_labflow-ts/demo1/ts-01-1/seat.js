// Bug 2 — the wrong shape: "seat" instead of "seats".
import { needsApproval } from '../../js/booking.js';

console.log('approval needed?', needsApproval({ seat: 31, role: 'STUDENT' }));
