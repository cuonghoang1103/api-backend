// Line diff two ways on the same two files: (1) the real `git diff --no-index` (Myers algorithm),
// (2) an LCS table walked forward, the way desktop/src/main/agent/diff.ts › soSanhDong does it.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const cu = ['A', 'B', 'C', 'B', 'D', 'A'];    // old file, one letter per line
const moi = ['B', 'D', 'C', 'A', 'B', 'A'];   // new file
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dsa-ch09-diff-'));
fs.writeFileSync(path.join(dir, 'old.txt'), cu.join('\n') + '\n');
fs.writeFileSync(path.join(dir, 'new.txt'), moi.join('\n') + '\n');
let out = '';
try { execFileSync('git', ['diff', '--no-index', '--no-color', 'old.txt', 'new.txt'], { cwd: dir, encoding: 'utf8' }); }
catch (e) { out = (e as { stdout: string }).stdout; }      // git diff exits 1 when the files differ
fs.rmSync(dir, { recursive: true, force: true });
const body = out.split('\n').filter((l) => /^[ +-]/.test(l) && !/^(\+\+\+|---)/.test(l));
console.log(`git diff --no-index (Myers): ${body.join(' ')}`);
console.log(`  kept lines: ${body.filter((l) => l.startsWith(' ')).length}`);

// #region lcs-diff
// bang[i][j] = LCS length of the SUFFIXES a[i..] and b[j..] (filled from the bottom-right corner, as in diff.ts)
function lcsDiff(a: string[], b: string[]): string[] {
  const bang = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      bang[i][j] = a[i] === b[j] ? bang[i + 1][j + 1] + 1 : Math.max(bang[i + 1][j], bang[i][j + 1]);
  const ra: string[] = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { ra.push(' ' + a[i]); i++; j++; }                // keep
    else if (bang[i + 1][j] >= bang[i][j + 1]) { ra.push('-' + a[i]); i++; } // remove from old
    else { ra.push('+' + b[j]); j++; }                                    // add from new
  }
  while (i < a.length) ra.push('-' + a[i++]);
  while (j < b.length) ra.push('+' + b[j++]);
  return ra;
}
// #endregion
const d = lcsDiff(cu, moi);
console.log(`LCS table diff:              ${d.join(' ')}`);
console.log(`  kept lines: ${d.filter((l) => l.startsWith(' ')).length}`);
console.log(`git ${execFileSync('git', ['--version'], { encoding: 'utf8' }).trim().replace('git version ', '')}`);
