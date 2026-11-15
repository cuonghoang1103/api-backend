// @thoi-gian
// Node serves every request on ONE thread. While one handler runs naive fib(n), a timer that should fire
// in 10 ms (think: another user's request) must wait. Same handler with the O(n) loop: nobody waits.
function naive(n: number): number { return n < 2 ? n : naive(n - 1) + naive(n - 2); }
function loop(n: number): number { let a = 0, b = 1; for (let i = 0; i < n; i++) [a, b] = [b, a + b]; return a; }

function lateness(handler: () => number): Promise<number> {
  return new Promise((resolve) => {
    const asked = performance.now();
    setTimeout(() => resolve(performance.now() - asked), 10);   // "the next request", due in 10 ms
    handler();                                                  // our request handler, synchronous
  });
}
async function main() {
  for (let k = 0; k < 20; k++) { naive(22); loop(40); }      // warm up the JIT first, so we measure the algorithm
  await lateness(() => 0);                                   // and the timer machinery
  for (const n of [25, 30, 35, 40]) {
    const slow = await lateness(() => naive(n));
    const fast = await lateness(() => loop(n));
    console.log(`n=${n}: the 10 ms timer fired after ${slow.toFixed(0).padStart(5)} ms with naive fib, ${fast.toFixed(0)} ms with the loop`);
  }
  console.log(`node ${process.version} · ${process.arch}`);
}
main();
