// Node.js — readline: process the input line by line as it arrives, finish in the 'close' event.
// Task: first line n, then n integers. Print "sum=<s> max=<m>".
// #region khuon
const rl = require('readline').createInterface({ input: process.stdin });
const tok = [];
rl.on('line', (line) => {
  for (const t of line.split(/\s+/)) if (t.length > 0) tok.push(t);
});
rl.on('close', () => {                                  // fires once stdin is fully read
  let p = 0;
  const n = Number(tok[p++]);
  let sum = 0, max = -Infinity;
  for (let i = 0; i < n; i++) {
    const x = Number(tok[p++]);
    sum += x;
    if (x > max) max = x;
  }
  console.log(`sum=${sum} max=${max}`);
});
// #endregion
