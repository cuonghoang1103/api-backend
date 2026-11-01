// Plain JavaScript that calls LabFlow's rules — three wrong calls.
import { checkSlot, needsApproval, usageRate } from './booking.js';

console.log(checkSlot(480, 600));                       // numbers, not "HH:MM"
console.log(needsApproval({ seat: 31, role: 'STUDENT' })); // typo: seat
console.log(usageRate([{ minute: 60 }]));                // typo: minute
