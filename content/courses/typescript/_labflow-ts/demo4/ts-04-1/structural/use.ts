import type { LabCode } from '../../../src/rules/schedule.ts';

type Lab = { code: LabCode; name: string; capacity: number };
type Classroom = { code: LabCode; name: string; capacity: number; projector: boolean }; // never mentions Lab

function freeSeats(lab: Lab, booked: number): number {
  return lab.capacity - booked;
}

const room: Classroom = { code: 'BE-202', name: 'Backend Lab 2', capacity: 40, projector: true };
console.log('free seats:', freeSeats(room, 15)); // a Classroom has everything a Lab needs

// Destructuring in the parameter list: the type still goes after the whole pattern.
function describe({ name, capacity }: Lab): string {
  return name + ' (' + capacity + ' seats)';
}
console.log(describe(room));
