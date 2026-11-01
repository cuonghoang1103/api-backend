import type { LabCode } from '../../../../src/rules/schedule.ts';

type Lab = {
  readonly code: LabCode;
  name: string;
  capacity: number;
  readonly equipment: readonly string[]; // the property AND the list are read-only
};

const STANDARD: readonly string[] = ['projector', 'whiteboard'];
const be201: Lab = { code: 'BE-201', name: 'Backend Lab 1', capacity: 40, equipment: STANDARD };

be201.equipment.push('GPU server');
const upgraded: Lab = { ...be201, equipment: [...be201.equipment, 'GPU server'] }; // a new lab, a new list
console.log(upgraded.equipment, STANDARD);
