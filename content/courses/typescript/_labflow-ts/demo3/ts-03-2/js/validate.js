// The same rule list in plain JavaScript. Two teammates added a rule each — with the wrong shape.
function validate(input, rules) {
  const problems = [];
  for (const rule of rules) {
    const problem = rule(input);
    if (problem !== null) problems.push(problem);
  }
  return problems;
}

const maxSeats40 = (input) => (input.seats > 40 ? { code: 'TOO_MANY_SEATS', message: 'At most 40 seats' } : null);
const seatsOnly = (seats) => (seats > 40 ? { code: 'TOO_MANY_SEATS', message: 'At most 40 seats' } : null);   // expects a number
const tooLong = (input) => 'TOO_LONG';                                                                 // returns a string

const input = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '08:00', end: '13:00' };
console.log('right rule      →', validate(input, [maxSeats40]).map((p) => p.code));
console.log('seatsOnly rule  →', validate(input, [seatsOnly]).map((p) => p.code));
console.log('string rule     →', validate(input, [tooLong]).map((p) => p.code));
