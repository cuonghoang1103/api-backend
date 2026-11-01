// forEach has a "=> void" callback too: it starts every async callback and waits for none of them.
const saved: string[] = [];
const codes = ['OFF_GRID', 'TOO_LONG'];

codes.forEach(async (code) => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  saved.push(code);
});
console.log('saved after forEach:', saved.length);
setTimeout(() => console.log('saved 50 ms later :', saved.length), 50);
