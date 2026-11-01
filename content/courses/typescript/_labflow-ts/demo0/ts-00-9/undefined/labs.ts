// The same code in TypeScript (strict). Nothing else changed except the parameter type.
const LABS = [
  { code: 'BE-201', seats: 40 },
  { code: 'BE-202', seats: 30 },
];

function seatsOf(code: string): number {
  return LABS.find((lab) => lab.code === code).seats;
}

console.log('BE-201 has', seatsOf('BE-201'), 'seats');
console.log('BE-209 has', seatsOf('BE-209'), 'seats');
