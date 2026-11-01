// The fix the compiler asks for: decide what happens when the lab is not found.
const LABS = [
  { code: 'BE-201', seats: 40 },
  { code: 'BE-202', seats: 30 },
];

function seatsOf(code: string): number {
  const lab = LABS.find((l) => l.code === code);
  if (lab === undefined) throw new Error('Unknown lab ' + code);
  return lab.seats;   // here TypeScript knows lab is defined
}

console.log('BE-201 has', seatsOf('BE-201'), 'seats');
console.log('BE-209 has', seatsOf('BE-209'), 'seats');
