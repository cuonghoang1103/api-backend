// Plant ONE change in a source file, run the given Vitest files, then always restore the file.
// node scripts/thu-loi.mjs <file> "<exact text>" "<replacement>" <vitest args…>
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const [file, from, to, ...args] = process.argv.slice(2);
const original = readFileSync(file, 'utf8');
if (original.split(from).length !== 2) throw new Error('"' + from + '" must appear exactly once in ' + file);
writeFileSync(file, original.replace(from, to));
console.log('planted in ' + file + ':  ' + from + '  →  ' + to + '\n');
try {
  const run = spawnSync('npx', ['vitest', 'run', ...args], { stdio: 'inherit', shell: process.platform === 'win32' });
  process.exitCode = run.status;
} finally {
  writeFileSync(file, original);
}
