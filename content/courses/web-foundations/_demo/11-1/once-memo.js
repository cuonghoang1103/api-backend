function once(fn) {
  let done = false;
  let result;
  return (...args) => {
    if (!done) {
      done = true;
      result = fn(...args);
    }
    return result;
  };
}
const init = once(() => { console.log('connecting...'); return 'connected'; });
console.log(init(), init(), init());

function memoize(fn) {
  const cache = new Map();          // private cache, shared by every call of the returned function
  return (n) => {
    if (cache.has(n)) return cache.get(n);
    const value = fn(n);
    cache.set(n, value);
    return value;
  };
}
let calls = 0;
const slowSquare = (n) => { calls++; return n * n; };
const fastSquare = memoize(slowSquare);
console.log(fastSquare(9), fastSquare(9), fastSquare(9), fastSquare(4));
console.log('real calls:', calls);
