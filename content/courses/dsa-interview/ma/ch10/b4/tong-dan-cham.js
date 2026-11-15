// Node.js — read n numbers with readline, console.log the running sum after each one.
// #region sai
const rl = require('readline').createInterface({ input: process.stdin });
const tok = [];
rl.on('line', (line) => { for (const t of line.split(/\s+/)) if (t) tok.push(t); });
rl.on('close', () => {
  const n = Number(tok[0]);
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += Number(tok[i]);
    console.log(sum);
  }
});
// #endregion
