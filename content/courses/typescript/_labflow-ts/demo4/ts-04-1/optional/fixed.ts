import type { Lab } from './lab.ts';

// Absent and empty are two different answers — say both.
export function equipmentLine(lab: Lab): string {
  if (lab.equipment === undefined) return lab.name + ': (not recorded yet)';
  if (lab.equipment.length === 0) return lab.name + ': (nothing)';
  return lab.name + ': ' + lab.equipment.join(', ');
}

const labs: Lab[] = [
  { code: 'BE-201', name: 'Backend Lab 1', capacity: 40, equipment: ['projector', 'whiteboard'] },
  { code: 'BE-202', name: 'Backend Lab 2', capacity: 40 },
  { code: 'AL-301', name: 'AI Lab', capacity: 30, equipment: [] },
];
for (const lab of labs) console.log(equipmentLine(lab));
console.log('items:', labs.map((lab) => lab.equipment?.length ?? 0));
console.log(JSON.stringify(labs[1]));
