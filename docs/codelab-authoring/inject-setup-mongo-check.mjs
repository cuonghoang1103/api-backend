// Prove every MongoDB exercise is self-contained: run its seed.js followed by
// its solution against a FRESH database and require the script to complete.
// Reusing one database would let collections from a previous exercise stand in
// for a missing seed — the same trap the SQL checker exists to avoid.
//
//   node inject-setup-mongo-check.mjs <payload.json> [container]
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const payloadPath = process.argv[2];
const container = process.argv[3] || 'cl_mongo';
// Optional connection string: a replica set must be addressed by URI so mongosh
// routes writes to whichever member is currently primary.
const uri = process.argv[4] || '';
if (!payloadPath) {
  console.error('usage: node inject-setup-mongo-check.mjs <payload.json> [container]');
  process.exit(1);
}
const payload = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));

let ok = 0; const failures = [];
payload.exercises.forEach((ex, i) => {
  const seed = ex.starterCodeJson.find((f) => f.name === 'seed.js');
  const solution = ex.solutionCodeJson.map((f) => f.code).join('\n');
  const db = `seedcheck${i + 1}`;
  const target = uri ? uri.replace('DBNAME', db) : db;
  const script = `${seed ? seed.code + '\n' : ''}${solution}\n`;
  try {
    execFileSync('docker', ['exec', container, 'mongosh', '--quiet', target, '--eval', 'db.dropDatabase()'], { stdio: 'ignore' });
    execFileSync('docker', ['exec', '-i', container, 'mongosh', '--quiet', target], {
      input: script, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'],
    });
    ok += 1;
  } catch (e) {
    const msg = String(e.stdout || e.stderr || e.message)
      .split('\n').filter((l) => /Error|error:/.test(l))[0] || 'failed';
    failures.push([i + 1, ex.title, msg.trim().slice(0, 100)]);
  } finally {
    try { execFileSync('docker', ['exec', container, 'mongosh', '--quiet', target, '--eval', 'db.dropDatabase()'], { stdio: 'ignore' }); } catch { /* best effort */ }
  }
});

const noSeed = payload.exercises.filter((e) => !e.starterCodeJson.find((f) => f.name === 'seed.js')).length;
console.log(`${payloadPath.split('/').pop()}: ${ok}/${payload.exercises.length} run clean on a fresh database (${noSeed} need no seed)`);
for (const [n, title, msg] of failures) console.log(`  ✗ ex${n} ${title.slice(0, 50)} — ${msg}`);
process.exitCode = failures.length ? 1 : 0;
