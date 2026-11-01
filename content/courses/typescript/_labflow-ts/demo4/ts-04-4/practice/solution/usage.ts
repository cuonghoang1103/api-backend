import { LABS } from '../../../../src/rules/schedule.ts';
import type { LabCode } from '../../../../src/rules/schedule.ts';

// Closed key sets: every lab has a capacity, and the caller must say how many seats each lab has booked (0 included).
const CAPACITY: Record<LabCode, number> = { 'BE-201': 40, 'BE-202': 40, 'AL-301': 30 };

export function usageLines(booked: Record<LabCode, number>): string[] {
  return LABS.map((code) => code + ' ' + Math.round((booked[code] / CAPACITY[code]) * 100) + '%');
}

console.log(usageLines({ 'BE-201': 36, 'BE-202': 0, 'AL-301': 25 }));
