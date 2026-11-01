import { LABS } from '../derive/labs.ts';
import type { LabCode } from '../derive/labs.ts';

// The same widening written with "as". It compiles too — but "as" can also lie (lesson 1.2), so prefer the assignment.
export function isLabAs(text: string): text is LabCode {
  return (LABS as readonly string[]).includes(text);
}
