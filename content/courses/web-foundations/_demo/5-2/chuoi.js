const step = (label, value) => new Promise((r) => setTimeout(() => { console.log(label, value); r(value); }, 20));

step('1. user id', 7)
  .then((id) => step('2. orders of user', id * 10))      // return a promise: the next .then waits for it
  .then((orders) => orders + 1)                          // return a plain value: passed straight on
  .then((n) => console.log('3. final', n));

// The classic bug: no return, so the chain does not wait and gets undefined
setTimeout(() => {
  step('A. start', 1)
    .then((x) => { step('B. inner (forgotten)', x + 1); })
    .then((y) => console.log('C. received', y));
}, 200);
