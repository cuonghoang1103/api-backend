import type { LabCode } from '../../../../src/rules/schedule.ts';

// capacity is required
type Lab = {
  code: LabCode;
  name: string;
  capacity: number;
};

function freeSeats(lab: Lab, booked: number): number {
  return lab.capacity - booked;
}

const code: LabCode = 'BE-201';
const fromForm = { code, name: 'Backend Lab 1', capasity: 40 }; // built first, with the typo
const lab: Lab = fromForm;                                       // not a fresh literal any more
console.log('free seats:', freeSeats(lab, 12));
