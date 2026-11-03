/**
 * _ma (bài Lab 14) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "memory": `import { BookingRepo, type Booking } from './service.ts';
export class MemoryRepo extends BookingRepo {
  #rows = new Map<number, Booking>();
  find(id: number): Booking | undefined { return this.#rows.get(id); }
  save(b: Booking): void { this.#rows.set(b.id, b); }
}`,
  "starter": `// TODO: type Booking, make BookingRepo abstract, and hide the repo with #private.
export type Booking = any;

export class BookingRepo {
  find(id: any): any { return undefined; }
  save(b: any): void {}
}

export class BookingService {
  repo: any;
  constructor(repo: any) { this.repo = repo; }
  book(id: any, lab: any): any { const b = { id, lab }; this.repo.save(b); return b; }
  find(id: any): any { return this.repo.find(id); }
}`,
  "ref": `export type Booking = { id: number; lab: string };

export abstract class BookingRepo {
  abstract find(id: number): Booking | undefined;
  abstract save(b: Booking): void;
}

export class BookingService {
  #repo: BookingRepo;
  constructor(repo: BookingRepo) { this.#repo = repo; }
  book(id: number, lab: string): Booking {
    const b: Booking = { id, lab };
    this.#repo.save(b);
    return b;
  }
  find(id: number): Booking | undefined { return this.#repo.find(id); }
}`,
  "yeu": `export type Booking = any;

export abstract class BookingRepo {
  abstract find(id: number): Booking | undefined;
  abstract save(b: Booking): void;
}

export class BookingService {
  #repo: BookingRepo;
  constructor(repo: BookingRepo) { this.#repo = repo; }
  book(id: number, lab: string): Booking {
    const b: Booking = { id, lab };
    this.#repo.save(b);
    return b;
  }
  find(id: number): Booking | undefined { return this.#repo.find(id); }
}`,
  "vua": `export type Booking = { id: number; lab: string };

export abstract class BookingRepo {
  abstract find(id: number): Booking | undefined;
  abstract save(b: Booking): void;
}

export class BookingService {
  private repo: BookingRepo;
  constructor(repo: BookingRepo) { this.repo = repo; }
  book(id: number, lab: string): Booking {
    const b: Booking = { id, lab };
    this.repo.save(b);
    return b;
  }
  find(id: number): Booking | undefined { return this.repo.find(id); }
}`,
  "sai": `import type { Booking } from '../service.ts';
import { BookingService, BookingRepo } from '../service.ts';
import { MemoryRepo } from '../memory.ts';

export const s1 = new BookingRepo(); // S1 TS2511 BookingRepo is abstract
export class S2 extends BookingRepo {} // S2 TS2654 a subclass must implement find and save
export const s3: Booking = { id: 1 }; // S3 TS2741 a Booking needs lab
export const s4: Booking = { id: 1, lab: 'x', extra: 1 }; // S4 TS2353 no extra field on Booking
export const s5: Booking = { id: '1', lab: 'x' }; // S5 TS2322 id is a number
export const s6 = new BookingService(new MemoryRepo()).book('one', 'x'); // S6 TS2345 id is a number
export const s7 = new BookingService(new MemoryRepo()).#repo; // S7 TS18013 #repo is private to the class
export const s8: BookingService = new MemoryRepo(); // S8 TS2739 a MemoryRepo is not a BookingService`,
  "dung": `import type { Booking } from '../service.ts';
import { BookingService } from '../service.ts';
import { MemoryRepo } from '../memory.ts';

const b: Booking = { id: 1, lab: 'BE-201' };
const svc = new BookingService(new MemoryRepo());
const made: Booking = svc.book(2, 'CS-101');
const found: Booking | undefined = svc.find(2);

export { b, made, found };`,
  "grader": `// Lab 14 grader — "A typed React component + hook (BookingService over an abstract repo)".
// Copies YOUR service.ts next to the grader's memory.ts, kiem/ and test/, then scores 10 points:
//   A  tsc: your service.ts compiles under the course tsconfig (strict) ...................... 2
//   B  tsc: the correct uses in kiem/phai-dung.ts compile ................................ 1
//   C  honesty: no any, no "as" cast (as const is fine), no "!", no @ts- ................. 1
//   D  node --test: the hook collects typed values and submits a CreateBooking ........... 2
//   E  the 8 wrong uses in kiem/sai.ts are each refused with the right code .............. 8 × 0.5
import { execFileSync } from 'node:child_process';
import { cpSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const i = process.argv.indexOf('--from');
const from = path.resolve(i > 0 ? process.argv[i + 1] : path.join(root, 'lab14/src'));
const tmp = path.join(root, '.cham-lab14');
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp);
const win = process.platform === 'win32';

function run(cmd, args) {
  try { return { code: 0, out: execFileSync(cmd, args, { cwd: tmp, encoding: 'utf8', stdio: 'pipe', shell: win }) }; }
  catch (e) { return { code: e.status ?? 1, out: (e.stdout || '') + (e.stderr || '') }; }
}
const tsc = (cfg) => run(path.join(root, 'node_modules/.bin/tsc' + (win ? '.cmd' : '')), ['-p', cfg]);
const errorsIn = (out, file) => out.split('\\n').filter((l) => l.startsWith(file + '(') && / error TS\\d+/.test(l));
const codeOnly = (s) => s.replace(/\\/\\*[\\s\\S]*?\\*\\//g, '').replace(/\\/\\/.*$/gm, '').replace(/'(?:[^'\\n\\\\]|\\\\.)*'|"(?:[^"\\n\\\\]|\\\\.)*"/g, "''");

try {
  cpSync(path.join(from, 'service.ts'), path.join(tmp, 'service.ts'));
  cpSync(path.join(root, 'lab14/memory.ts'), path.join(tmp, 'memory.ts'));
  cpSync(path.join(root, 'lab14/kiem'), path.join(tmp, 'kiem'), { recursive: true });
  cpSync(path.join(root, 'lab14/test'), path.join(tmp, 'test'), { recursive: true });
  const base = { extends: path.join(root, 'tsconfig.json') };
  writeFileSync(path.join(tmp, 'a.json'), JSON.stringify({ ...base, include: ['service.ts', 'memory.ts'] }));
  writeFileSync(path.join(tmp, 'b.json'), JSON.stringify({ ...base, include: ['service.ts', 'memory.ts', 'kiem/phai-dung.ts'] }));
  writeFileSync(path.join(tmp, 'e.json'), JSON.stringify({ ...base, include: ['service.ts', 'memory.ts', 'kiem/sai.ts'] }));

  let score = 0;
  const line = (ok, pts, max, label, extra = '') => {
    score += pts;
    console.log(\`\${ok ? '✓' : '✗'} \${label} — \${pts}/\${max}\${extra ? '\\n    ' + extra.trim().split('\\n').slice(0, 4).join('\\n    ') : ''}\`);
  };

  const a = tsc('a.json');
  const aErr = a.out.split('\\n').filter((l) => / error TS\\d+/.test(l) && !l.startsWith('kiem/'));
  line(aErr.length === 0, aErr.length === 0 ? 2 : 0, 2, 'A  your service.ts compiles (strict)', aErr.join('\\n'));
  const b = tsc('b.json');
  const bErr = errorsIn(b.out, 'kiem/phai-dung.ts');
  line(bErr.length === 0, bErr.length === 0 ? 1 : 0, 1, 'B  correct uses compile', bErr.join('\\n'));

  const src = codeOnly(readFileSync(path.join(tmp, 'service.ts'), 'utf8'));
  const cheats = [...src.matchAll(/\\bany\\b|@ts-(?:ignore|nocheck|expect-error)|\\bas\\s+(?!const\\b)\\w+|[\\w$)\\]]!(?=[.[;,)\\s])/g)].map((m) => m[0].trim());
  line(cheats.length === 0, cheats.length === 0 ? 1 : 0, 1, 'C  no any / as / ! / @ts-', cheats.length ? 'found: ' + [...new Set(cheats)].join(', ') : '');

  const d = run(process.execPath, ['--test', '--test-reporter=tap', 'test/service.test.ts']);
  const pass = /# pass (\\d+)/.exec(d.out); const total = /# tests (\\d+)/.exec(d.out);
  const fails = d.out.split('\\n').filter((l) => /^not ok \\d+ - /.test(l)).map((l) => l.replace(/^not ok \\d+ - /, 'failed: ')).slice(0, 4).join('\\n');
  line(d.code === 0, d.code === 0 ? 2 : 0, 2, \`D  behaviour tests pass (\${pass ? pass[1] : 0}/\${total ? total[1] : '?'})\`, d.code ? fails : '');

  const e = tsc('e.json');
  const sai = readFileSync(path.join(tmp, 'kiem/sai.ts'), 'utf8').split('\\n');
  const wanted = sai.map((t, n) => [n + 1, /\\/\\/ (S\\d) (TS\\d+) (.*)$/.exec(t)]).filter(([, m]) => m);
  let refused = 0;
  for (const [n, [, id, code, why]] of wanted) {
    const got = errorsIn(e.out, 'kiem/sai.ts').filter((l) => l.startsWith(\`kiem/sai.ts(\${n},\`)).map((l) => /error (TS\\d+)/.exec(l)[1]);
    const ok = got.includes(code);
    if (ok) refused++;
    console.log(\`    \${ok ? '✓' : '✗'} \${id} \${why} — expected \${code}, got \${got.length ? got.join(', ') : 'no error'}\`);
  }
  line(refused === wanted.length, refused * 0.5, 4, \`E  wrong uses refused (\${refused}/\${wanted.length})\`);

  console.log(\`\\nScore: \${score}/10 — \${score >= 7 ? 'PASS' : 'NOT YET'} (pass mark 7)\`);
  process.exitCode = score >= 7 ? 0 : 1;
} finally {
  rmSync(tmp, { recursive: true, force: true });
}`,
};
export const OUT = {
  'l3-starter': `$ node scripts/cham-lab-14.mjs --from lab14/src
✓ A  your service.ts compiles (strict) — 2/2
✓ B  correct uses compile — 1/1
✗ C  no any / as / ! / @ts- — 0/1
    found: any
✓ D  behaviour tests pass (1/1) — 2/2
    ✗ S1 BookingRepo is abstract — expected TS2511, got no error
    ✗ S2 a subclass must implement find and save — expected TS2654, got no error
    ✗ S3 a Booking needs lab — expected TS2741, got no error
    ✗ S4 no extra field on Booking — expected TS2353, got no error
    ✗ S5 id is a number — expected TS2322, got no error
    ✗ S6 id is a number — expected TS2345, got no error
    ✗ S7 #repo is private to the class — expected TS18013, got TS2551
    ✓ S8 a MemoryRepo is not a BookingService — expected TS2739, got TS2739
✗ E  wrong uses refused (1/8) — 0.5/4

Score: 5.5/10 — NOT YET (pass mark 7)`,
  'l4-yeu': `$ node scripts/cham-lab-14.mjs --from lab14/yeu
✓ A  your service.ts compiles (strict) — 2/2
✓ B  correct uses compile — 1/1
✗ C  no any / as / ! / @ts- — 0/1
    found: any
✓ D  behaviour tests pass (1/1) — 2/2
    ✓ S1 BookingRepo is abstract — expected TS2511, got TS2511
    ✓ S2 a subclass must implement find and save — expected TS2654, got TS2654
    ✗ S3 a Booking needs lab — expected TS2741, got no error
    ✗ S4 no extra field on Booking — expected TS2353, got no error
    ✗ S5 id is a number — expected TS2322, got no error
    ✓ S6 id is a number — expected TS2345, got TS2345
    ✓ S7 #repo is private to the class — expected TS18013, got TS18013
    ✓ S8 a MemoryRepo is not a BookingService — expected TS2739, got TS2739
✗ E  wrong uses refused (5/8) — 2.5/4

Score: 7.5/10 — PASS (pass mark 7)`,
  'l5-vua': `$ node scripts/cham-lab-14.mjs --from lab14/vua
✓ A  your service.ts compiles (strict) — 2/2
✓ B  correct uses compile — 1/1
✓ C  no any / as / ! / @ts- — 1/1
✓ D  behaviour tests pass (1/1) — 2/2
    ✓ S1 BookingRepo is abstract — expected TS2511, got TS2511
    ✓ S2 a subclass must implement find and save — expected TS2654, got TS2654
    ✓ S3 a Booking needs lab — expected TS2741, got TS2741
    ✓ S4 no extra field on Booking — expected TS2353, got TS2353
    ✓ S5 id is a number — expected TS2322, got TS2322
    ✓ S6 id is a number — expected TS2345, got TS2345
    ✗ S7 #repo is private to the class — expected TS18013, got TS2339
    ✓ S8 a MemoryRepo is not a BookingService — expected TS2739, got TS2739
✗ E  wrong uses refused (7/8) — 3.5/4

Score: 9.5/10 — PASS (pass mark 7)`,
  'l6-ref': `$ node scripts/cham-lab-14.mjs --from lab14/giai
✓ A  your service.ts compiles (strict) — 2/2
✓ B  correct uses compile — 1/1
✓ C  no any / as / ! / @ts- — 1/1
✓ D  behaviour tests pass (1/1) — 2/2
    ✓ S1 BookingRepo is abstract — expected TS2511, got TS2511
    ✓ S2 a subclass must implement find and save — expected TS2654, got TS2654
    ✓ S3 a Booking needs lab — expected TS2741, got TS2741
    ✓ S4 no extra field on Booking — expected TS2353, got TS2353
    ✓ S5 id is a number — expected TS2322, got TS2322
    ✓ S6 id is a number — expected TS2345, got TS2345
    ✓ S7 #repo is private to the class — expected TS18013, got TS18013
    ✓ S8 a MemoryRepo is not a BookingService — expected TS2739, got TS2739
✓ E  wrong uses refused (8/8) — 4/4

Score: 10/10 — PASS (pass mark 7)`,
};
