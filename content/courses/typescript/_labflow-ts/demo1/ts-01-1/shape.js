// Bug 2 — three wrong calls, each wrapped so we can see what JavaScript does with it.
import { checkSlot, needsApproval } from '../../js/booking.js';

function attempt(label, call) {
  try {
    console.log(label, '→ returns', JSON.stringify(call()));
  } catch (e) {
    console.log(label, '→ throws', e.name + ':', e.message);
  }
}

attempt("needsApproval({ seat: 31, role: 'STUDENT' })", () => needsApproval({ seat: 31, role: 'STUDENT' }));
attempt('checkSlot(480, 600)', () => checkSlot(480, 600));
attempt("checkSlot('08:00')", () => checkSlot('08:00'));
