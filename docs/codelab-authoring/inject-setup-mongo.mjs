// Inject a runnable seed into every exercise of a MongoDB module payload.
//
// The mongo artifacts are one script per module laid out as
//     print("========== EX n: title ==========")
//     <db.x.drop(); db.x.insertMany([...])>     <-- the seed
//     <the solution commands>
// with no marker between the two halves. But the solution text is already in
// the payload, so the seed is simply the block with the solution subtracted:
// everything before the solution's first line starts.
//
//   node inject-setup-mongo.mjs <payload.json> <verify.js> [--write]
import fs from 'node:fs';

const [payloadPath, verifyPath, ...flags] = process.argv.slice(2);
if (!payloadPath || !verifyPath) {
  console.error('usage: node inject-setup-mongo.mjs <payload.json> <verify.js> [--write]');
  process.exit(1);
}
const write = flags.includes('--write');

const payload = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));
const verify = fs.readFileSync(verifyPath, 'utf8');

const parts = verify.split(/print\("=+ EX (\d+):[^\n]*\n/);
const blocks = new Map();
for (let i = 1; i < parts.length; i += 2) blocks.set(Number(parts[i]), parts[i + 1] ?? '');

const SEEDISH = /\b(drop\(\)|insertMany|insertOne|createIndex|createCollection)\b/;

// Some modules seed once at the top of the artifact and let all ten exercises
// share that collection (the indexing module builds 60,000 documents in a loop).
// Anything before the first EX marker is that shared seed.
const preamble = (parts[0] ?? '').trim();
const sharedSeed = SEEDISH.test(preamble) ? preamble : '';

let injected = 0; const problems = [];
payload.exercises.forEach((ex, i) => {
  const n = i + 1;
  const block = blocks.get(n);
  if (!block) { problems.push(`ex${n}: no block in artifact`); return; }
  const solution = ex.solutionCodeJson.map((f) => f.code).join('\n').trim();

  // Prefer an exact match of the whole solution; fall back to its first line.
  let cut = block.indexOf(solution);
  if (cut === -1) {
    const firstLine = solution.split('\n').find((l) => l.trim().length > 0)?.trim() ?? '';
    cut = firstLine ? block.indexOf(firstLine) : -1;
  }
  if (cut === -1) { problems.push(`ex${n}: solution not found in block`); return; }

  const ownSeed = block.slice(0, cut).trim();
  const seed = SEEDISH.test(ownSeed) ? ownSeed : sharedSeed;
  if (!seed) { problems.push(`ex${n}: no seed — solution appears self-contained`); return; }

  const rest = ex.starterCodeJson.filter((f) => f.name !== 'seed.js');
  ex.starterCodeJson = [
    { name: 'seed.js', language: 'javascript', code: `// Run once in mongosh to create the data this exercise works with.\n${seed}` },
    ...rest,
  ].slice(0, 3);
  injected += 1;
});

console.log(`${payloadPath.split('/').pop()}: seeded=${injected}/${payload.exercises.length}`);
for (const p of problems) console.log(`  · ${p}`);
if (write) {
  fs.writeFileSync(payloadPath, JSON.stringify(payload, null, 2));
  console.log('  written');
}
