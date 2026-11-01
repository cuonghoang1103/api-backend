import type { LabCode } from '../../../src/rules/schedule.ts';

// A shape: which properties the object has, and the type of each one.
export type Lab = {
  code: LabCode;
  name: string;
  capacity: number;
};

export function freeSeats(lab: Lab, booked: number): number {
  return lab.capacity - booked;
}
