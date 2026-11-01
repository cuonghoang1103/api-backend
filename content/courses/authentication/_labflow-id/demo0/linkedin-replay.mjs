// demo0/linkedin-replay.mjs — Start here (2/2): why "we hashed the passwords" was not enough in 2012.
// Unsalted SHA-1 (what the 2012 LinkedIn dump contained): hash every common password ONCE, then look leaked hashes up.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const sha1 = (s) => createHash('sha1').update(s).digest('hex');

// A "leaked table": three LabFlow users, passwords stored as unsalted SHA-1.
const leaked = { an: sha1('an-lab-2026'), binh: sha1('123456'), lan: sha1('lan-lab-2026') };

const t0 = performance.now();
const list = fs.readFileSync('wordlists/10k-most-common.txt', 'utf8').split('\n').filter(Boolean);
const table = new Map(list.map((p) => [sha1(p), p])); // computed ONCE, reused for every victim, forever
const ms = performance.now() - t0;
console.log(`lookup table: ${table.size} common passwords hashed in ${ms.toFixed(1)} ms`);
for (const [user, h] of Object.entries(leaked)) {
  console.log(`${user.padEnd(5)} ${h.slice(0, 16)}… → ${table.has(h) ? 'CRACKED: ' + JSON.stringify(table.get(h)) : 'not in the table (this time)'}`);
}
