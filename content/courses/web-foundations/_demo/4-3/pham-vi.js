const site = 'global';

function outer() {
  const a = 'outer';
  function inner() {
    const b = 'inner';
    console.log(site, a, b);     // looks outward
  }
  inner();
  console.log(typeof b);         // cannot look inward
}
outer();

const x = 1;
{
  const x = 2;                   // shadows the outer x inside this block
  console.log('block x', x);
}
console.log('outer x', x);

function bump() { count++; }     // a global that everyone can change
let count = 0;
bump(); bump();
console.log(count);
