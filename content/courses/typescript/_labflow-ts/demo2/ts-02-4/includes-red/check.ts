import { LABS } from '../derive/labs.ts';
import type { LabCode } from '../derive/labs.ts';

export function isLab(text: string): text is LabCode {
  return LABS.includes(text);
}

const fromQuery = new URLSearchParams('lab=BE-201').get('lab');
const lab: LabCode = fromQuery;
