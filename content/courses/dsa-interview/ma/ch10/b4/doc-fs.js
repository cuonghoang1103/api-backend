// Node.js — read ALL of stdin at once, split on any whitespace. Robust and fast: the template to memorise.
// Task: first line n, then n integers. Print "sum=<s> max=<m>".
// #region khuon
const data = require('fs').readFileSync(0, 'utf8');   // 0 = file descriptor of stdin
const tok = data.split(/\s+/).filter((t) => t.length > 0);
let p = 0;
const next = () => Number(tok[p++]);                   // one token at a time, line breaks do not matter

const n = next();
let sum = 0, max = -Infinity;
for (let i = 0; i < n; i++) {
  const x = next();
  sum += x;
  if (x > max) max = x;
}
console.log(`sum=${sum} max=${max}`);
// #endregion
