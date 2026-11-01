import type { LabCode } from '../../../src/rules/schedule.ts';

// Name the inner shape: smaller types, and a name in every error message.
export type Place = { building: string; floor: number };

export type Lab = {
  code: LabCode;
  name: string;
  capacity: number;
  place: Place;
};

const be201: Lab = { code: 'BE-201', name: 'Backend Lab 1', capacity: 40, place: { building: 'Beta', floor: '2' } };
const al301: Lab = { code: 'AL-301', name: 'AI Lab', capacity: 30, place: { building: 'Alpha' } };
export { be201, al301 };
