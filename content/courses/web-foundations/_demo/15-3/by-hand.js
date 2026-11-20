const letters = ['x', 'y'];
const it = letters[Symbol.iterator]();     // ask the array for an iterator
console.log(it.next());
console.log(it.next());
console.log(it.next());                    // done: true — the loop stops here
console.log(it.next());                    // stays done
