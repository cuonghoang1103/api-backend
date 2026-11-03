// cho: 1500
const save = (n) => new Promise((r) => setTimeout(() => { console.log('  saved', n); r(n); }, 30 * (4 - n)));

async function withForEach() {
  [1, 2, 3].forEach(async (n) => { await save(n); });
  console.log('forEach: "done" printed before anything was saved');
}
async function withForOf() {
  for (const n of [1, 2, 3]) await save(n);     // one after another, in order
  console.log('for...of: done after all three, in order');
}
withForEach();
setTimeout(withForOf, 300);
