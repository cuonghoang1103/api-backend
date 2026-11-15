// In JavaScript, Infinity + 1 is still Infinity, so the same code is correct there.
console.log(`Infinity + 1 = ${Infinity + 1}   Math.min(Infinity, Infinity + 1) = ${Math.min(Infinity, Infinity + 1)}`);
console.log(`Number.MAX_SAFE_INTEGER + 2 = ${Number.MAX_SAFE_INTEGER + 2}   (precision is lost, but no wrap-around)`);
console.log(`(2 ** 31 - 1) + 1 = ${(2 ** 31 - 1) + 1}   but ((2 ** 31 - 1) + 1) | 0 = ${((2 ** 31 - 1) + 1) | 0}   (the | 0 trick forces 32-bit int)`);
