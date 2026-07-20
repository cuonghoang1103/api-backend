// Inject a runnable setup block into every exercise of a SQL module payload.
//
// Why: exercises describe their dataset in prose ("a sales table with 9 rows")
// but never ship it. Code Lab has no seeded database and no code runner, so an
// exercise that says FROM sales is not reproducible unless it carries its data.
// The data already exists in the verify artifact each generator wrote.
//
// Two artifact layouts are in use and both must be handled:
//   A) per-exercise setup, marked by a check line:
//        \echo '===== EX n: title ====='
//        <DDL + INSERTs>            <-- the setup
//        \echo '--- check (expected result) ---'
//        <solution>
//   B) one shared setup at the top of the file, then one solution per EX:
//        <DDL + INSERTs>            <-- shared by all ten exercises
//        \echo '===== EX 1: ... ====='
//        <solution>
//
// A block that contains no DDL falls back to the shared preamble. Getting this
// wrong silently injects a solution as the "setup", which then appears to work
// only because a previous run left the table behind — so always follow this
// with inject-setup-check.mjs, which runs each pair on an empty database.
//
//   node inject-setup-sql.mjs <payload.json> <verify.sql> [--write]
import fs from 'node:fs';

const [payloadPath, verifyPath, ...flags] = process.argv.slice(2);
if (!payloadPath || !verifyPath) {
  console.error('usage: node inject-setup-sql.mjs <payload.json> <verify.sql> [--write]');
  process.exit(1);
}
const write = flags.includes('--write');
const DDL = /\b(CREATE\s+TABLE|INSERT\s+INTO|CREATE\s+TYPE|CREATE\s+SCHEMA|COPY)\b/i;

const payload = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));
const verify = fs.readFileSync(verifyPath, 'utf8');

const stripMeta = (s) => s.split('\n').filter((l) => !l.trim().startsWith('\\')).join('\n').trim();

// Everything before the first EX marker is the shared preamble (layout B).
const marker = /\\echo '=+ EX (\d+):[^\n]*\n/g;
const parts = verify.split(marker);
const shared = stripMeta(parts[0] ?? '');
const sharedSetup = DDL.test(shared) ? shared : '';

const perExercise = new Map();
for (let i = 1; i < parts.length; i += 2) {
  const n = Number(parts[i]);
  const body = parts[i + 1] ?? '';
  // Artifacts label the boundary differently — '--- solution ---',
  // '--- run solution ---' or '--- check ...'. Splitting on only one of them
  // swallows the solution into the "setup" and the injected block then fights
  // with the solution it is supposed to prepare for.
  const [beforeCheck] = body.split(/\\echo '-+ *(check|solution|run solution)/i);
  const candidate = stripMeta(beforeCheck);
  // Only treat it as this exercise's own setup when it actually creates data.
  if (DDL.test(candidate)) perExercise.set(n, candidate);
}

let own = 0; let fromShared = 0; let missing = 0;
payload.exercises.forEach((ex, i) => {
  const setup = perExercise.get(i + 1) ?? sharedSetup;
  if (!setup) { missing += 1; return; }
  if (perExercise.has(i + 1)) own += 1; else fromShared += 1;
  const rest = ex.starterCodeJson.filter((f) => f.name !== 'setup.sql');
  ex.starterCodeJson = [
    { name: 'setup.sql', language: 'sql', code: `-- Run this once to create the data this exercise works with.\n${setup}` },
    ...rest,
  ];
});

console.log(`${payloadPath.split('/').pop()}: own=${own} shared=${fromShared} missing=${missing}`);
if (missing) console.log(`  ⚠️  ${missing} exercise(s) got no setup — inspect by hand`);
if (write) {
  fs.writeFileSync(payloadPath, JSON.stringify(payload, null, 2));
  console.log('  written');
}
