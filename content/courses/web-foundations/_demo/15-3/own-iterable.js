// "Numbers from 1 to 5" without building an array first
const oneToFive = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        return current <= last ? { value: current++, done: false } : { value: undefined, done: true };
      },
    };
  },
};

const seen = [];
for (const n of oneToFive) seen.push(n);
console.log('for...of      →', seen);
console.log('spread        →', [...oneToFive]);
const [first, second] = oneToFive;
console.log('destructuring → first ' + first + ', second ' + second);
console.log('Array.from    →', Array.from(oneToFive, (n) => n * 10));
console.log('Math.max      → ' + Math.max(...oneToFive));
