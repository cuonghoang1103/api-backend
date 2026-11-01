import type { LabCode } from '../../../../src/rules/schedule.ts';

type Lab = {
  readonly code: LabCode;
  name: string;
  capacity: number;
  readonly equipment: string[];
};

const STANDARD: string[] = ['projector', 'whiteboard'];
const be201: Lab = { code: 'BE-201', name: 'Backend Lab 1', capacity: 40, equipment: STANDARD };
const be202: Lab = { code: 'BE-202', name: 'Backend Lab 2', capacity: 40, equipment: STANDARD };

be201.name = 'Backend Lab 1 (renovated)'; // allowed: name is not readonly
be201.code = 'BE-202';                    // the code identifies the room
be201.equipment = ['GPU server'];         // the property is readonly…
be201.equipment.push('GPU server');       // …but the array inside it is not
console.log('BE-202 now has:', be202.equipment);
