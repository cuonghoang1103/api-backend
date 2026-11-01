// Lab 4 — eight uses that are WRONG. Your types must make tsc refuse every one of them.
// The grader compiles this file against YOUR src/ and expects one error, with this code, on each marked line.
import { LAB_INFO } from '../src/model.ts';
import type { Lab, User, BookingRecord } from '../src/model.ts';

declare const lab: Lab;
declare const record: BookingRecord;

const ai: Lab = { code: 'AL-301', name: 'AI Lab' };                       // S1 TS2741 a lab without a capacity
const typo: Lab = { code: 'BE-201', name: 'Backend Lab 1', capasity: 40 }; // S2 TS2561 a misspelled property
const t: User = { id: 3, createdAt: '2026-11-01', email: 't@fpt.edu.vn', name: 'T', role: 'TEACHER' }; // S3 TS2322 there is no TEACHER role
record.status = 'CONFIRMED';                                               // S4 TS2540 a stored record is changed with withStatus
lab.equipment?.push('printer');                                            // S5 TS2339 nobody edits a lab's equipment list in place
const n = lab.equipment.length;                                            // S6 TS18048 equipment may not be recorded yet
const ghost = LAB_INFO['BE-999'];                                          // S7 TS7053 there is no lab BE-999
const anon: User = { email: 'x@fpt.edu.vn', name: 'X', role: 'STUDENT' };  // S8 TS2739 a user has an id and a createdAt
export { ai, typo, t, n, ghost, anon };
