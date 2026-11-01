// Like thu-loi.mjs, for ANY command (lesson 11.x): plant ONE change in a file, run the command, always restore the file.
// node scripts/thu-loi-lenh.mjs <file> "<exact text>" "<replacement>" -- <command and its arguments…>
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const cut = args.indexOf('--');
const [file, from, to] = args.slice(0, cut);
const [cmd, ...rest] = args.slice(cut + 1);
const original = readFileSync(file, 'utf8');
if (original.split(from).length !== 2) throw new Error('"' + from + '" must appear exactly once in ' + file);
writeFileSync(file, original.replace(from, to));
console.log('planted in ' + file + ':  ' + from + '  →  ' + to + '\n');
try {
  const run = spawnSync(cmd, rest, { stdio: 'inherit', shell: process.platform === 'win32' });
  process.exitCode = run.status;
} finally {
  writeFileSync(file, original);
}
