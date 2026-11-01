import { freeSeats } from './lab.ts';
import type { Lab } from './lab.ts';
import type { LabCode } from '../../../src/rules/schedule.ts';

const be201: Lab = { code: 'BE-201', name: 'Backend Lab 1', capacity: 40 };
console.log('free seats:', freeSeats(be201, 12));

// The same shape, written in place instead of named. Fine once; noisy the third time.
const inline: { code: LabCode; name: string; capacity: number } = be201;
console.log('inline    :', inline.name);
