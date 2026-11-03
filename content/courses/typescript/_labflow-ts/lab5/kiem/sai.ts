// Lab 5 — eight uses that are WRONG. Your labelled union must make tsc refuse every one of them.
// The grader compiles this file against YOUR src/ and expects one error, with this code, on each marked line.
import { describe } from '../src/state.ts';
import type { BookingState, ActiveState } from '../src/state.ts';
import type { BookingRecord } from '../src/model.ts';

declare const rec: BookingRecord;
declare const s: BookingState;

describe({ step: 'pending' });                                            // S1 TS2345 pending must carry its record
describe({ step: 'cancelled', record: rec });                             // S2 TS2345 cancelled must carry a reason
describe({ step: 'draft', record: rec });                                 // S3 TS2353 a draft has no record
if (s.step === 'draft') { const id = s.record.id; void id; }              // S4 TS2339 a draft has no record to read
if (s.step === 'xpired') { void 0; }                                      // S5 TS2367 'xpired' is not one of the steps
function make(): BookingState { return { step: 'invalid' }; }             // S6 TS2322 an invalid state needs its code
const active: ActiveState = { step: 'cancelled', record: rec, reason: 'x' }; // S7 TS2322 cancelled is not an active state
describe({ step: 'confimed', record: rec });                              // S8 TS2820 a misspelled step
export { make, active };
