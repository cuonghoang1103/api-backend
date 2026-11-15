// Node.js — the "quick" way many people type first. DO NOT copy this one: it trusts the input layout.
// Task: first line n, then n integers. Print "sum=<s> max=<m>".
// #region sai
const lines = require('fs').readFileSync(0, 'utf8').split('\n');
const n = Number(lines[0]);
const a = lines[1].split(' ').map(Number);   // assumes: exactly ONE space, all numbers on line 2
let sum = 0, max = -Infinity;
for (let i = 0; i < n; i++) { sum += a[i]; if (a[i] > max) max = a[i]; }
console.log(`sum=${sum} max=${max}`);
// #endregion
