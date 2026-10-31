// Like thu-loi.mjs, for Playwright: plant ONE change, run the given Playwright args, always restore the file.
// node scripts/thu-loi-pw.mjs <file> "<exact text>" "<replacement>" <playwright args…>
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const [file, from, to, ...args] = process.argv.slice(2);
const original = readFileSync(file, 'utf8');
if (original.split(from).length !== 2) throw new Error('"' + from + '" must appear exactly once in ' + file);
writeFileSync(file, original.replace(from, to));
console.log('planted in ' + file + ':  ' + from + '  →  ' + to + '\n');
try {
  const run = spawnSync('npx', ['playwright', 'test', ...args], { stdio: 'inherit', shell: process.platform === 'win32' });
  process.exitCode = run.status;
} finally {
  writeFileSync(file, original);
}
