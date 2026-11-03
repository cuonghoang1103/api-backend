const noReturn = (x) => { x * 2; };        // braces: no automatic return
const implicit = (x) => x * 2;
console.log(noReturn(5), implicit(5));

function log(msg) { console.log(msg); }    // returns nothing
console.log(log('hello'));

const makeUser = (name) => ({ name });     // returning an object needs ( )
const broken = (name) => { name };
console.log(makeUser('Linh'), broken('Linh'));

function badReturn() {
  return                                   // a line break here ends the statement!
    { ok: true };
}
console.log(badReturn());

function firstEven(list) {                 // return stops the function immediately
  for (const n of list) {
    if (n % 2 === 0) return n;
  }
  return null;
}
console.log(firstEven([1, 3, 4, 5]), firstEven([1, 3]));
