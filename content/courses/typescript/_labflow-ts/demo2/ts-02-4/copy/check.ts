import type { LabCode } from './types.ts';

// Written last semester and copied by hand from types.ts — before AL-301 existed.
const LABS: readonly string[] = ['BE-201', 'BE-202'];

export function isLab(text: string): text is LabCode {
  return LABS.includes(text);
}
