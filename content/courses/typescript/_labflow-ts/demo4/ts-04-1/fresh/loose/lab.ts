import type { LabCode } from '../../../../src/rules/schedule.ts';

// capacity is optional now
type Lab = {
  code: LabCode;
  name: string;
  capacity?: number; // "made optional: the seed did not compile without it"
};

function freeSeats(lab: Lab, booked: number): number {
  return (lab.capacity ?? 0) - booked;
}

const code: LabCode = 'BE-201';
const fromForm = { code, name: 'Backend Lab 1', capasity: 40 }; // built first, with the typo
const lab: Lab = fromForm;                                       // not a fresh literal any more
console.log('free seats:', freeSeats(lab, 12));
