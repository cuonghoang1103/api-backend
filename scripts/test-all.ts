/**
 * Run every smoke test in series. Used as a single entry point
 * in CI / pre-deploy: `npm run test:smoke`.
 */
import { spawnSync } from 'child_process';
import path from 'path';

const tests = [
  'test-image-optimizer',
  'test-r2',
  'test-pipeline',
  'test-migration',
  'test-music-stream',
  'test-errors',
  'test-cdn',
];

const env: NodeJS.ProcessEnv = { ...process.env };
// Load .env.test
import fs from 'fs';
const envTestPath = path.join(process.cwd(), '.env.test');
if (fs.existsSync(envTestPath)) {
  const lines = fs.readFileSync(envTestPath, 'utf-8').split('\n');
  for (const line of lines) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) env[m[1]] = m[2];
  }
}

let failed = 0;
for (const t of tests) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`RUN: ${t}`);
  console.log('='.repeat(60));
  const r = spawnSync('npx', ['tsx', `scripts/${t}.ts`], {
    stdio: 'inherit',
    env,
  });
  if (r.status !== 0) {
    failed++;
    console.error(`✗ ${t} failed`);
  } else {
    console.log(`✓ ${t} passed`);
  }
}

console.log(`\n${'='.repeat(60)}`);
if (failed > 0) {
  console.error(`❌ ${failed}/${tests.length} test files failed`);
  process.exit(1);
}
console.log(`✅ All ${tests.length} test files passed`);
