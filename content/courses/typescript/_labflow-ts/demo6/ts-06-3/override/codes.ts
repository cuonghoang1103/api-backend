import type { SlotResult } from '../../../src/rules/booking.ts';
type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E };

type Code = 'OFF_GRID' | 'TOO_LONG';
const refused: Result<number, Code> = { ok: false, error: 'TOO_LONG' }; // E = Code, not string
const wrong: Result<number, Code> = { ok: false, error: 'typo' };       // 'typo' is not a Code
void refused; void wrong;
const _s: SlotResult = { ok: true, minutes: 120 }; void _s;
