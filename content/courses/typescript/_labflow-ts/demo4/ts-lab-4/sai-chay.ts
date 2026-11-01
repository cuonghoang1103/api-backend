// Lab 4 — the eight wrong uses, run by Node against the STARTER model (lab4/src/model.ts). Types are erased: this is what users would see.
import { LAB_INFO, freeSeats, labName, indexById } from '../../lab4/src/model.ts';
import { needsApproval } from '../../lab4/src/booking.ts';

const run = (id: string, what: () => unknown) => {
  try {
    console.log(id, JSON.stringify(what()));
  } catch (e) {
    console.log(id, 'throws', (e as Error).constructor.name + ':', (e as Error).message);
  }
};
const record = { id: 11, createdAt: '2026-11-01', lab: 'AL-301', userId: 2, range: [600, 720], seats: 25, status: 'PENDING', note: null };
const pendingList = [record];

run('S1 a lab without a capacity: free seats =', () => freeSeats(JSON.parse('{"code":"AL-301","name":"AI Lab","equipment":[]}'), 10));
run('S2 capasity: free seats =', () => freeSeats(JSON.parse('{"code":"BE-201","name":"Backend Lab 1","capasity":40,"equipment":[]}'), 10));
run('S3 a TEACHER books 40 seats, needs approval =', () => needsApproval(JSON.parse('{"seats":40,"role":"TEACHER"}')));
run('S4 record.status = CONFIRMED, the pending list now shows =', () => { record.status = 'CONFIRMED'; return pendingList.map((b) => b.status); });
run('S5 push printer into BE-202, LAB_INFO now says =', () => { LAB_INFO['BE-202']?.equipment.push('printer'); return LAB_INFO['BE-202']?.equipment; });
run('S6 equipment.length of a lab from the database =', () => JSON.parse('{"code":"BE-202","name":"Backend Lab 2","capacity":40}').equipment.length);
run('S7 BE-999: lab, name =', () => String(LAB_INFO['BE-999']) + ', ' + labName('BE-999'));
run('S8 a user without an id, indexed by id: keys =', () => Object.keys(indexById([JSON.parse('{"email":"x@fpt.edu.vn","name":"X","role":"STUDENT"}')])));
