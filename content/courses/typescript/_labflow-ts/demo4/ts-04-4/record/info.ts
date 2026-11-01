import type { LabCode } from '../../../src/rules/schedule.ts';

type Lab = { name: string; capacity: number };

// Record<K, V>: exactly the keys K, each with a V.
const LAB_INFO: Record<LabCode, Lab> = {
  'BE-201': { name: 'Backend Lab 1', capacity: 40 },
  'BE-202': { name: 'Backend Lab 2', capacity: 40 },
  'AL-301': { name: 'AI Lab', capacity: 30 },
};
const twoLabs: Record<LabCode, Lab> = {
  'BE-201': { name: 'Backend Lab 1', capacity: 40 },
  'BE-202': { name: 'Backend Lab 2', capacity: 40 },
};
const fourLabs: Record<LabCode, Lab> = { ...LAB_INFO, 'BE-999': { name: 'Ghost', capacity: 99 } };

export function freeSeats(code: LabCode, booked: number): number {
  return LAB_INFO[code].capacity - booked; // no undefined to check: every LabCode is a key
}
const ghost = LAB_INFO['BE-999'];
export function fromUrl(text: string): number {
  return LAB_INFO[text].capacity;
}
export { twoLabs, fourLabs, ghost };
