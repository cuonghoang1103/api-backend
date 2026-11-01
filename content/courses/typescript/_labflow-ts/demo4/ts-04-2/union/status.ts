import type { TimeRange } from '../../../src/rules/schedule.ts';

// Only a type alias can name these: a union, a tuple, a function type.
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';
export type Slot = TimeRange;
export type Rule = (seats: number) => string | null;

// An interface describes an object shape — nothing else.
export interface Status = 'PENDING' | 'CONFIRMED';
