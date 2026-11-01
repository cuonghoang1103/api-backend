const saved: string[] = [];
const codes = ['OFF_GRID', 'TOO_LONG'];

for (const code of codes) {
  await new Promise((resolve) => setTimeout(resolve, 10));
  saved.push(code);
}
console.log('saved after the loop:', saved.length);
