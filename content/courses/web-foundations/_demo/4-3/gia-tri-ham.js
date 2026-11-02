// A function is a value: store it, pass it, return it.
const shout = (s) => s.toUpperCase() + '!';
const fns = { shout, whisper: (s) => s.toLowerCase() + '...' };
console.log(fns.shout('hi'), fns.whisper('HI'));

function twice(fn, value) {          // fn is a callback
  return fn(fn(value));
}
console.log(twice((n) => n * 3, 2));

const nums = [1, 2, 3, 4];
console.log(nums.map((n) => n * n));
console.log(nums.filter((n) => n % 2 === 0));

function makeCounter() {             // returns a function (Lesson 11.1 explains why this works)
  let n = 0;
  return () => ++n;
}
const next = makeCounter();
console.log(next(), next(), next());

// Passing vs calling
const button = { onClick: null };
button.onClick = shout;              // passes the function
console.log(typeof button.onClick);
button.onClick = shout('x');         // calls it now and stores the result
console.log(typeof button.onClick);
