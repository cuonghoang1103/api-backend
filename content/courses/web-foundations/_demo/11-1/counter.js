function makeCounter() {
  let count = 0;                 // lives in makeCounter's scope
  return function () {
    count = count + 1;           // still reachable after makeCounter returned
    return count;
  };
}

const next = makeCounter();
console.log(next());   // 1
console.log(next());   // 2
console.log(next());   // 3
console.log(typeof count);       // there is no global "count"

const a = makeCounter();
const b = makeCounter();
a(); a(); a();
console.log('a:', a(), 'b:', b());   // each call of makeCounter = a NEW count
