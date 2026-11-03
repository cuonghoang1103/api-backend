// Two type parameters: a tuple that remembers both.
function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

const slot = pair('BE-201', 40);   // [string, number]
const [code, seats] = slot;
console.log(code.toUpperCase(), seats.toFixed(0));
