// Inject the schema and the seed script into every exercise of a Prisma module.
//
// A Prisma exercise needs two things a learner cannot guess: the schema the
// generated client is built from, and the rows the task talks about. Both were
// written by the generator into verify/prisma-<id>/ — reference.prisma and one
// exN.seed.ts per exercise — so this copies them into starterCodeJson beside the
// solution scaffold.
//
//   node inject-setup-prisma.mjs <payload.json> <verify/prisma-NNN> [--write]
import fs from 'node:fs';
import path from 'node:path';

const [payloadPath, verifyDir, ...flags] = process.argv.slice(2);
if (!payloadPath || !verifyDir) {
  console.error('usage: node inject-setup-prisma.mjs <payload.json> <verifyDir> [--write]');
  process.exit(1);
}
const write = flags.includes('--write');

const payload = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));
const schemaPath = path.join(verifyDir, 'reference.prisma');
const schema = fs.existsSync(schemaPath) ? fs.readFileSync(schemaPath, 'utf8').trim() : '';

let withSchema = 0; let withSeed = 0; let missingSeed = 0;
payload.exercises.forEach((ex, i) => {
  const seedPath = path.join(verifyDir, `ex${i + 1}.seed.ts`);
  // In the setup/schema module most tasks ARE "write the schema", so their
  // starter stub is already complete and adding a finished schema would hand
  // over the answer. Only the tasks that query pre-existing rows need anything.
  if (flags.includes('--only-with-seed') && !fs.existsSync(seedPath)) { missingSeed += 1; return; }

  const files = ex.starterCodeJson.filter((f) => !['schema.prisma', 'seed.ts'].includes(f.name));
  const extra = [];

  if (schema) {
    extra.push({
      name: 'schema.prisma', language: 'prisma',
      code: `// The schema this exercise runs against.\n// npx prisma db push && npx prisma generate\n${schema}`,
    });
    withSchema += 1;
  }
  if (fs.existsSync(seedPath)) {
    extra.push({
      name: 'seed.ts', language: 'typescript',
      code: `// Run once before the exercise: npx tsx seed.ts\n${fs.readFileSync(seedPath, 'utf8').trim()}`,
    });
    withSeed += 1;
  } else {
    missingSeed += 1;
  }

  // starterCodeJson allows at most three files: schema, seed, scaffold.
  ex.starterCodeJson = [...extra, ...files].slice(0, 3);
});

console.log(`${payloadPath.split('/').pop()}: schema=${withSchema} seed=${withSeed} noSeed=${missingSeed}`);
if (write) {
  fs.writeFileSync(payloadPath, JSON.stringify(payload, null, 2));
  console.log('  written');
}
