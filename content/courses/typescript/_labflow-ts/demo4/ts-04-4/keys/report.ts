import { LABS } from '../../../src/rules/schedule.ts';
import type { LabCode } from '../../../src/rules/schedule.ts';

const CAPACITY: Record<LabCode, number> = { 'BE-201': 40, 'BE-202': 40, 'AL-301': 30 };

for (const key of Object.keys(CAPACITY)) {
  console.log(key, CAPACITY[key]);           // key is a string, not a LabCode
}
for (const code of LABS) {
  console.log(code, CAPACITY[code]);         // the one list of labs (Chapter 2): code is a LabCode
}
for (const [code, seats] of Object.entries(CAPACITY)) {
  console.log(code, seats);                  // entries: [string, number][]
}
