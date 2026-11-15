// Node.js — collect the lines in an array, write them with ONE call.
// #region khuon
const n = Number(process.argv[2]);
const out = [];
for (let i = 1; i <= n; i++) out.push(i);
process.stdout.write(out.join('\n') + '\n');
// #endregion
