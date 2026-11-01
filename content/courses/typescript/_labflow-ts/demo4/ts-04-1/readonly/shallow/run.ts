import type { LabCode } from '../../../../src/rules/schedule.ts';

type Lab = { readonly code: LabCode; name: string; capacity: number; readonly equipment: string[] };

const STANDARD: string[] = ['projector', 'whiteboard'];
const be201: Lab = { code: 'BE-201', name: 'Backend Lab 1', capacity: 40, equipment: STANDARD };
const be202: Lab = { code: 'BE-202', name: 'Backend Lab 2', capacity: 40, equipment: STANDARD };

be201.equipment.push('GPU server'); // meant for BE-201 only — compiles
console.log('BE-201 has:', be201.equipment);
console.log('BE-202 has:', be202.equipment);
