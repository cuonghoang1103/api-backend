import { LABS } from '../derive/labs.ts';
import type { LabCode } from '../derive/labs.ts';

// A list of LabCode IS a list of strings, so this assignment is safe (no "as" needed).
const KNOWN: readonly string[] = LABS;

export function isLab(text: string): text is LabCode {
  return KNOWN.includes(text);
}
