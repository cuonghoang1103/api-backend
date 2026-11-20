let produced = 0;
function* naturals() {                     // infinite — fine, because it is lazy
  let n = 1;
  while (true) { produced++; yield n++; }
}
function* filter(source, test) {
  for (const x of source) if (test(x)) yield x;
}
function* take(source, count) {
  if (count <= 0) return;
  for (const x of source) {
    yield x;
    if (--count === 0) return;             // return ⇒ the loop above stops pulling
  }
}

const firstFiveMultiplesOf7 = [...take(filter(naturals(), (n) => n % 7 === 0), 5)];
console.log(firstFiveMultiplesOf7);
console.log('numbers produced: ' + produced + ' (not infinity, not a million)');
