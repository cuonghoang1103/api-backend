// Node.js — the same task: read everything at once, collect the output, write it once.
// #region khuon
const tok = require('fs').readFileSync(0, 'utf8').split(/\s+/).filter(Boolean);
const n = Number(tok[0]);
const out = [];
let sum = 0;
for (let i = 1; i <= n; i++) {
  sum += Number(tok[i]);
  out.push(sum);
}
process.stdout.write(out.join('\n') + '\n');
// #endregion
