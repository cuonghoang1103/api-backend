// Predict the order before reading the output.
console.log('1. sync: start');
setTimeout(() => console.log('5. timer (macrotask), 0 ms'), 0);
Promise.resolve().then(() => console.log('3. promise callback (microtask)'));
queueMicrotask(() => console.log('4. queueMicrotask (microtask)'));
console.log('2. sync: end');
