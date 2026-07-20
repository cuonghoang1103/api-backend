// Prove that every exercise in a SQL payload is self-contained: run its
// setup.sql followed by its solution on an EMPTY database and require both to
// succeed. Running against a database that already holds the tables would pass
// even when the setup is missing or wrong — which is exactly the failure this
// script exists to catch.
//
//   node inject-setup-check.mjs <payload.json>
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const payloadPath = process.argv[2];
if (!payloadPath) {
  console.error('usage: node inject-setup-check.mjs <payload.json>');
  process.exit(1);
}
const payload = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));
const DB = 'seedcheck';

const psql = (db, sql) =>
  execFileSync('docker', ['exec', '-i', 'cl_pg', 'psql', '-U', 'postgres', '-d', db, '-v', 'ON_ERROR_STOP=1'], {
    input: sql, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'],
  });

let ok = 0; const failures = [];
payload.exercises.forEach((ex, i) => {
  const setup = ex.starterCodeJson.find((f) => f.name === 'setup.sql');
  const solution = ex.solutionCodeJson.map((f) => f.code).join('\n');
  // No setup is fine when the solution builds everything it needs — a
  // schema-design task whose whole point is the CREATE TABLE. What is not fine
  // is a solution that queries a table nobody created, so run it either way and
  // let an empty database decide.
  try {
    // A fresh database per exercise: nothing can leak in from a previous one.
    execFileSync('docker', ['exec', 'cl_pg', 'psql', '-U', 'postgres', '-c', `DROP DATABASE IF EXISTS ${DB}`], { stdio: 'ignore' });
    execFileSync('docker', ['exec', 'cl_pg', 'psql', '-U', 'postgres', '-c', `CREATE DATABASE ${DB}`], { stdio: 'ignore' });
    psql(DB, `${setup ? setup.code + '\n' : ''}${solution}\n`);
    ok += 1;
  } catch (e) {
    const msg = String(e.stderr || e.message).split('\n').filter((l) => /ERROR|FATAL/.test(l))[0] || 'failed';
    failures.push([i + 1, ex.title, msg.trim().slice(0, 110)]);
  }
});

const selfContained = payload.exercises.filter((e) => !e.starterCodeJson.find((f) => f.name === 'setup.sql')).length;
console.log(`${payloadPath.split('/').pop()}: ${ok}/${payload.exercises.length} run clean on an empty database (${selfContained} need no setup)`);
for (const [n, title, msg] of failures) console.log(`  ✗ ex${n} ${title.slice(0, 52)} — ${msg}`);
process.exitCode = failures.length ? 1 : 0;
