import type { LabCode } from '../../../src/rules/schedule.ts';

export type Lab = {
  code: LabCode;
  name: string;
  capacity: number;
  equipment?: string[]; // absent = nobody has recorded it yet
};

export function equipmentLine(lab: Lab): string {
  return lab.name + ': ' + lab.equipment.join(', ');
}
