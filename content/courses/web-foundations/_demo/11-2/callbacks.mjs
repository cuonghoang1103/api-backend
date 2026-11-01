class Timer {
  constructor(label) { this.label = label; this.ticks = 0; }
  tick() { this.ticks++; return this.label + ' ' + this.ticks; }
}
const t = new Timer('lap');

// Passing a method as a callback detaches it from the object
try {
  [1, 2].map(t.tick);
} catch (e) {
  console.log('map(t.tick)        ->', e.name + ': ' + e.message);
}

// Fix 1: wrap it in an arrow function — the call is t.tick() again
console.log('map(() => t.tick())->', [1, 2].map(() => t.tick()));

// Fix 2: bind once, use the bound copy
const boundTick = t.tick.bind(t);
console.log('map(boundTick)     ->', [1, 2].map(boundTick));

// setTimeout has the same problem
setTimeout(function () {
  console.log('setTimeout(fn) this ->', String(this));
}, 0);
