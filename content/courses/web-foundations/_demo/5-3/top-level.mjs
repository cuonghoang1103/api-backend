// In a module (type="module", or a .mjs file in Node) you may use await at the top level.
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
console.log('module starts');
await wait(50);
console.log('50 ms later, still at the top level');
