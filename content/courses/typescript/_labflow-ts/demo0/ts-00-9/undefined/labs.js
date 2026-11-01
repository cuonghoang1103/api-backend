// LabFlow in plain JavaScript: how many seats does a lab have?
const LABS = [
  { code: 'BE-201', seats: 40 },
  { code: 'BE-202', seats: 30 },
];

function seatsOf(code) {
  return LABS.find((lab) => lab.code === code).seats;
}

console.log('BE-201 has', seatsOf('BE-201'), 'seats');
console.log('BE-209 has', seatsOf('BE-209'), 'seats');   // a lab that does not exist
