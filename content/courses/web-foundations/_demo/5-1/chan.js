// A timer cannot interrupt code that is running. It waits until the call stack is empty.
const t0 = performance.now();
setTimeout(() => {
  console.log('timer asked for 0 ms, ran after', Math.round(performance.now() - t0), 'ms');
}, 0);

const end = performance.now() + 300;
while (performance.now() < end) { /* busy for 300 ms: nothing else can run */ }
console.log('busy loop finished after', Math.round(performance.now() - t0), 'ms');
