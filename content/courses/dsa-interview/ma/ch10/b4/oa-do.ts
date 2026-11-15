// @thoi-gian
// Measure stdin readers and stdout writers the way a judge runs them: a fresh process, stdin redirected from a
// file, stdout to a file. Wall time of the WHOLE process, best of 3. Input files are generated here, in
// $TMPDIR/dsa-nhap/ch10/b4/ (about 11 MB for 10^6 numbers) and are never committed.
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, openSync, closeSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';

const HERE = dirname(resolve(process.argv[1]));
const TMP = join(process.env.TMPDIR || tmpdir(), 'dsa-nhap', 'ch10', 'b4');
const JDIR = join(TMP, 'java-do');
mkdirSync(JDIR, { recursive: true });

const READ_JAVA = ['DocScanner', 'DocSplit', 'DocTokenizer', 'DocStream', 'DocNhanh'];
const WRITE_JAVA = ['GhiPrintln', 'GhiPrintWriter', 'TongDanCham', 'TongDanNhanh'];
const c = spawnSync('javac', ['--release', '17', '-encoding', 'UTF-8', '-d', JDIR, ...[...READ_JAVA, ...WRITE_JAVA].map((k) => join(HERE, k + '.java'))], { encoding: 'utf8' });
if (c.status !== 0) { console.log(c.stderr); process.exit(1); }
const cjs = (f: string) => { const to = join(TMP, f.replace(/\.js$/, '.cjs')); copyFileSync(join(HERE, f), to); return to; };

// Park–Miller generator: seed * 48271 stays below 2^53, so it is exact in JS numbers.
let seed = 20261115;
const rnd = () => (seed = (seed * 48271) % 2147483647);
function makeInput(n: number): string {
  const a: number[] = [];
  for (let i = 0; i < n; i++) a.push((rnd() % 2000000001) - 1000000000);   // |x| <= 1e9
  const f = join(TMP, `input-${n}.txt`);
  writeFileSync(f, `${n}\n${a.join(' ')}\n`);
  return f;
}

function wall(cmd: string, args: string[], inFile: string | null, outFile: string | null, laps = 3): { ms: number; out: string } {
  let best = Infinity, out = '';
  for (let k = 0; k < laps; k++) {
    const fin = inFile ? openSync(inFile, 'r') : 'ignore';
    const fout = outFile ? openSync(outFile, 'w') : 'pipe';
    const t = performance.now();
    const r = spawnSync(cmd, args, { stdio: [fin, fout, 'pipe'], encoding: 'utf8', maxBuffer: 1 << 26 });
    const ms = performance.now() - t;
    if (typeof fin === 'number') closeSync(fin);
    if (typeof fout === 'number') closeSync(fout);
    if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')}: ${r.stderr}`);
    best = Math.min(best, ms);
    out = (r.stdout ?? '').trim();
  }
  return { ms: best, out };
}

const SIZES = [100_000, 1_000_000];
const files = SIZES.map(makeInput);
const pad = (s: string | number, w: number) => String(s).padStart(w);
const row = (label: string, cells: string[]) => console.log(`${label.padEnd(30)} | ${cells.map((x) => pad(x, 11)).join(' | ')}`);

// #region doc
const READERS: [string, string, string[]][] = [
  ['node fs.readFileSync(0)', 'node', [cjs('doc-fs.js')]],
  ['node readline', 'node', [cjs('doc-readline.js')]],
  ['node HackerRank boilerplate', 'node', [cjs('doc-hackerrank.js')]],
  ['java Scanner', 'java', ['-cp', JDIR, 'DocScanner']],
  ['java BufferedReader+split', 'java', ['-cp', JDIR, 'DocSplit']],
  ['java BufferedReader+StringTok', 'java', ['-cp', JDIR, 'DocTokenizer']],
  ['java StreamTokenizer', 'java', ['-cp', JDIR, 'DocStream']],
  ['java DataInputStream (bytes)', 'java', ['-cp', JDIR, 'DocNhanh']],
];
// #endregion

console.log('READ n integers from stdin (ms, whole process, best of 3)');
row('program', SIZES.map((n) => `n=${n.toLocaleString('en-US')}`));
row('start-up only: node', [String(wall('node', [cjs('ghi-log.js'), '0'], null, null).ms.toFixed(0)), '']);
row('start-up only: java', [String(wall('java', ['-cp', JDIR, 'GhiPrintln', '0'], null, null).ms.toFixed(0)), '']);
const answers = new Set<string>();
for (const [label, cmd, args] of READERS) {
  const cells = files.map((f, k) => {
    const r = wall(cmd, args, f, null);
    if (k === files.length - 1) answers.add(r.out);
    return r.ms.toFixed(0);
  });
  row(label, cells);
}
console.log(`all readers print the same answer for n=10^6: ${answers.size === 1 ? 'yes' : 'NO'} (${[...answers][0]})`);

console.log('');
console.log('WRITE the numbers 1..n, one per line, stdout to a file (ms, whole process, best of 3)');
row('program', SIZES.map((n) => `n=${n.toLocaleString('en-US')}`));
const WRITERS: [string, string, string[]][] = [
  ['node console.log per line', 'node', [cjs('ghi-log.js')]],
  ['node one write(join)', 'node', [cjs('ghi-join.js')]],
  ['java System.out.println', 'java', ['-cp', JDIR, 'GhiPrintln']],
  ['java PrintWriter + flush', 'java', ['-cp', JDIR, 'GhiPrintWriter']],
];
for (const [label, cmd, args] of WRITERS) {
  row(label, SIZES.map((n) => wall(cmd, [...args, String(n)], null, join(TMP, 'out.txt')).ms.toFixed(0)));
}

console.log('');
console.log('READ n numbers AND print the running sum after each (n lines out) — a typical OA task (ms, best of 3)');
row('program', SIZES.map((n) => `n=${n.toLocaleString('en-US')}`));
const BOTH: [string, string, string[]][] = [
  ['node readline + console.log', 'node', [cjs('tong-dan-cham.js')]],
  ['node readFileSync + one write', 'node', [cjs('tong-dan-nhanh.js')]],
  ['java Scanner + println', 'java', ['-cp', JDIR, 'TongDanCham']],
  ['java Tokenizer + PrintWriter', 'java', ['-cp', JDIR, 'TongDanNhanh']],
];
const lastLines = new Set<string>();
for (const [label, cmd, args] of BOTH) {
  row(label, files.map((f) => wall(cmd, args, f, join(TMP, 'out.txt')).ms.toFixed(0)));
  const tail = spawnSync('tail', ['-n', '1', join(TMP, 'out.txt')], { encoding: 'utf8' }).stdout.trim();
  lastLines.add(tail);
}
console.log(`all four print the same last line for n=10^6: ${lastLines.size === 1 ? 'yes' : 'NO'} (${[...lastLines][0]})`);
const jv = spawnSync('java', ['-version'], { encoding: 'utf8' }).stderr.split('\n')[0];
console.log(`node ${process.version} · ${jv} · ${process.arch}`);
