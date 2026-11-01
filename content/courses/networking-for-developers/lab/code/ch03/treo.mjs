// treo.mjs — 4 dns.lookup calls for names whose name server never answers, THEN a small file read.
// dns.lookup runs on libuv's thread pool (4 threads by default), the same pool as fs — who has to wait for whom?
import dns from 'node:dns';
import fs from 'node:fs';
const t0 = performance.now();
const ms = () => (performance.now() - t0).toFixed(0).padStart(5) + ' ms';
for (let i = 1; i <= 4; i++) dns.lookup(`x${i}.dead.test`, (err) => console.log(`${ms()}  lookup x${i}.dead.test: ${err ? err.code : 'ok'}`));
fs.readFile('/etc/hostname', 'utf8', (e, s) => console.log(`${ms()}  readFile /etc/hostname: ${s.trim()}`));
