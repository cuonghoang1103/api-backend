// Run every stdin template of lesson 10.4 on the SAME three small inputs, as a judge would: a real process,
// stdin redirected from a file. Inputs are written to $TMPDIR/dsa-nhap/ch10/b4/ (never committed).
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, openSync, closeSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';

const HERE = dirname(resolve(process.argv[1]));
const TMP = join(process.env.TMPDIR || tmpdir(), 'dsa-nhap', 'ch10', 'b4');
const JDIR = join(TMP, 'java-mau');
mkdirSync(JDIR, { recursive: true });

// #region dau-vao
const INPUTS: [string, string][] = [
  ['A clean', '5\n3 -1 4 1 5\n'],
  ['B CRLF + extra spaces', '5\r\n3  -1 4 1 5 \r\n'],
  ['C numbers over 3 lines', '5\n3 -1\n4 1\n5\n'],
];
// #endregion

const JAVA = ['DocScanner', 'DocSplit', 'DocTokenizer', 'DocStream', 'DocNhanh'];
const GHI = ['GhiPrintln', 'GhiPrintWriter', 'GhiQuenFlush'];
const DONG = ['BayNextLine', 'SuaNextLine'];
const c = spawnSync('javac', ['--release', '17', '-encoding', 'UTF-8', '-d', JDIR, ...[...JAVA, ...GHI, ...DONG].map((k) => join(HERE, k + '.java'))], { encoding: 'utf8' });
if (c.status !== 0) { console.log(c.stderr); process.exit(1); }

// The repo is "type": "module"; judges run Node files as CommonJS ⇒ run an identical .cjs copy.
const cjs = (f: string) => { const to = join(TMP, f.replace(/\.js$/, '.cjs')); copyFileSync(join(HERE, f), to); return to; };
const NODE = ['doc-tach-cach.js', 'doc-fs.js', 'doc-readline.js', 'doc-hackerrank.js'];
const PROGRAMS: [string, string, string[]][] = [
  ...NODE.map((f): [string, string, string[]] => [`node ${f}`, 'node', [cjs(f)]]),
  ...JAVA.map((k): [string, string, string[]] => [`java ${k}`, 'java', ['-cp', JDIR, k]]),
];

function run(cmd: string, args: string[], file: string): string {
  const fd = openSync(file, 'r');
  const r = spawnSync(cmd, args, { stdio: [fd, 'pipe', 'pipe'], encoding: 'utf8' });
  closeSync(fd);
  if (r.status === 0) return r.stdout.trim();
  const err = (r.stderr.match(/(\w+(Exception|Error))(: [^\n]*)?/) || ['?'])[0];
  return 'CRASH ' + err.replace(/^java\.\w+\./, '').slice(0, 72);
}

INPUTS.forEach(([name, text], k) => {
  const f = join(TMP, `mau-${k}.txt`);
  writeFileSync(f, text);
  console.log(`== input ${name}: ${JSON.stringify(text)}`);
  for (const [label, cmd, args] of PROGRAMS) console.log(`  ${label.padEnd(24)} -> ${run(cmd, args, f)}`);
});

// Output side: print 1..3, and show EXACTLY what reaches the judge (JSON.stringify makes \n and "" visible).
console.log('== output of "print 1..3"');
const OUT: [string, string, string[]][] = [
  ['node ghi-log.js 3', 'node', [cjs('ghi-log.js'), '3']],
  ['node ghi-join.js 3', 'node', [cjs('ghi-join.js'), '3']],
  ...GHI.map((k): [string, string, string[]] => [`java ${k} 3`, 'java', ['-cp', JDIR, k, '3']]),
];
for (const [label, cmd, args] of OUT) {
  const r = spawnSync(cmd, args, { encoding: 'utf8' });
  console.log(`  ${label.padEnd(24)} -> ${JSON.stringify(r.stdout)}  (exit ${r.status})`);
}

// Scanner: a number, then a whole line.
const tenFile = join(TMP, 'mau-ten.txt');
writeFileSync(tenFile, '20\nNguyen Van An\n');
console.log(`== input ${JSON.stringify('20\nNguyen Van An\n')}`);
for (const k of DONG) console.log(`  ${('java ' + k).padEnd(24)} -> ${run('java', ['-cp', JDIR, k], tenFile)}`);
