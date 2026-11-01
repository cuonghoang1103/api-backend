import type { LabCode } from '../../../src/rules/schedule.ts';

// Two ways to name the same shape.
export interface LabI {
  code: LabCode;
  name: string;
  capacity: number;
}

export type LabT = {
  code: LabCode;
  name: string;
  capacity: number;
};

const a: LabI = { code: 'AL-301', name: 'AI Lab' };
const b: LabT = { code: 'AL-301', name: 'AI Lab' };
const c: LabT = a; // same shape: they are interchangeable
export { a, b, c };
