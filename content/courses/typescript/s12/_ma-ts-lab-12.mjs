/**
 * _ma (bài Lab 12) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "reactModel": `// A tiny typed model of React's surface (the shapes @types/react provides).
export type ReactNode = El | string | number | boolean | null;
export type El = { tag: string; props: Record<string, unknown>; children: ReactNode[] };
export type FC<P> = (props: P) => El;
export function h(tag: string, props: Record<string, unknown> = {}, ...children: ReactNode[]): El {
  return { tag, props, children };
}
export type ChangeEvent = { target: { value: string } };`,
  "starter": `import { h } from './react.ts';

// TODO: replace the 'any' types with real ones (CreateBooking, BookingFormProps, BookingForm).
export type CreateBooking = any;
export type BookingFormProps = any;
export type BookingForm = any;

export function useBookingForm(): any {
  const form: any = {
    lab: '',
    seats: 0,
    onLabChange(e: any) { form.lab = e.target.value; },
    onSeatsChange(e: any) { form.seats = e.target.value; },   // bug: forgot Number()
    submit() { return { lab: form.lab, seats: form.seats }; },
  };
  return form;
}

export const BookingFormView: any = (props: any) => h('form', {});`,
  "ref": `import type { ChangeEvent, FC } from './react.ts';
import { h } from './react.ts';

export type CreateBooking = { lab: string; seats: number };
export type BookingFormProps = { onSubmit: (booking: CreateBooking) => void };
export type BookingForm = {
  lab: string;
  seats: number;
  onLabChange(e: ChangeEvent): void;
  onSeatsChange(e: ChangeEvent): void;
  submit(): CreateBooking;
};

export function useBookingForm(): BookingForm {
  const form: BookingForm = {
    lab: '',
    seats: 0,
    onLabChange(e) { form.lab = e.target.value; },
    onSeatsChange(e) { form.seats = Number(e.target.value); },
    submit() { return { lab: form.lab, seats: form.seats }; },
  };
  return form;
}

export const BookingFormView: FC<BookingFormProps> = (props) => {
  const form = useBookingForm();
  return h('form', { onSubmit: props.onSubmit, 'data-lab': form.lab }, 'seats: ' + form.seats);
};`,
  "yeu": `import { h } from './react.ts';

export type CreateBooking = { lab: string; seats: number };
export type BookingFormProps = { onSubmit: (booking: CreateBooking) => void };
export type BookingForm = any;

export function useBookingForm(): any {
  const form: any = {
    lab: '',
    seats: 0,
    onLabChange(e: any) { form.lab = e.target.value; },
    onSeatsChange(e: any) { form.seats = Number(e.target.value); },
    submit() { return { lab: form.lab, seats: form.seats }; },
  };
  return form;
}

export const BookingFormView = (props: BookingFormProps) => h('form', { onSubmit: props.onSubmit });`,
  "vua": `import type { ChangeEvent, FC } from './react.ts';
import { h } from './react.ts';

export type CreateBooking = { lab: string; seats?: number };
export type BookingFormProps = { onSubmit: (booking: CreateBooking) => void };
export type BookingForm = {
  lab: string;
  seats: number;
  onLabChange(e: ChangeEvent): void;
  onSeatsChange(e: ChangeEvent): void;
  submit(): CreateBooking;
};

export function useBookingForm(): BookingForm {
  const form: BookingForm = {
    lab: '',
    seats: 0,
    onLabChange(e) { form.lab = e.target.value; },
    onSeatsChange(e) { form.seats = Number(e.target.value); },
    submit() { return { lab: form.lab, seats: form.seats }; },
  };
  return form;
}

export const BookingFormView: FC<BookingFormProps> = (props) =>
  h('form', { onSubmit: props.onSubmit }, 'seats: ' + useBookingForm().seats);`,
  "sai": `import type { CreateBooking, BookingForm, BookingFormProps } from '../form.ts';
import { useBookingForm } from '../form.ts';

const s1: CreateBooking = { lab: 'BE-201' };                          // S1 TS2741 a create body is missing seats
const s2: CreateBooking = { lab: 'BE-201', seats: 40, id: 'bk_1' };   // S2 TS2353 a create body must not carry a server id
const s3: CreateBooking = { lab: 'BE-201', seats: 'forty' };          // S3 TS2322 seats must be a number
const s4 = useBookingForm().onSeatsChange({ value: '40' });           // S4 TS2353 a change event needs target.value, not a bare value
const s5: BookingFormProps = {};                                      // S5 TS2741 props is missing onSubmit
const s6: BookingFormProps = { onSubmit: (n: number) => { void n; } };// S6 TS2322 onSubmit takes a CreateBooking
const s7: string = useBookingForm().seats;                            // S7 TS2322 seats is a number, not a string
const s8 = useBookingForm().submit().purpose;                         // S8 TS2339 CreateBooking has no purpose
const _bf: BookingForm = useBookingForm();

export { s1, s2, s3, s4, s5, s6, s7, s8, _bf };`,
  "dung": `import type { CreateBooking, BookingFormProps } from '../form.ts';
import { useBookingForm } from '../form.ts';

const booking: CreateBooking = { lab: 'BE-201', seats: 40 };
const props: BookingFormProps = { onSubmit: (b: CreateBooking) => { void b; } };

const form = useBookingForm();
form.onLabChange({ target: { value: 'BE-201' } });
form.onSeatsChange({ target: { value: '40' } });
const made: CreateBooking = form.submit();

export { booking, props, made };`,
  "grader": `// Lab 12 grader — "A typed React component + hook (BookingForm)".
// Copies YOUR form.ts next to the grader's react.ts, kiem/ and test/, then scores 10 points:
//   A  tsc: your form.ts compiles under the course tsconfig (strict) ...................... 2
//   B  tsc: the correct uses in kiem/phai-dung.ts compile ................................ 1
//   C  honesty: no any, no "as" cast (as const is fine), no "!", no @ts- ................. 1
//   D  node --test: the hook collects typed values and submits a CreateBooking ........... 2
//   E  the 8 wrong uses in kiem/sai.ts are each refused with the right code .............. 8 × 0.5
import { execFileSync } from 'node:child_process';
import { cpSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const i = process.argv.indexOf('--from');
const from = path.resolve(i > 0 ? process.argv[i + 1] : path.join(root, 'lab12/src'));
const tmp = path.join(root, '.cham-lab12');
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
  cpSync(path.join(from, 'form.ts'), path.join(tmp, 'form.ts'));
  cpSync(path.join(root, 'lab12/react.ts'), path.join(tmp, 'react.ts'));
  cpSync(path.join(root, 'lab12/kiem'), path.join(tmp, 'kiem'), { recursive: true });
  cpSync(path.join(root, 'lab12/test'), path.join(tmp, 'test'), { recursive: true });
  const base = { extends: path.join(root, 'tsconfig.json') };
  writeFileSync(path.join(tmp, 'a.json'), JSON.stringify({ ...base, include: ['form.ts', 'react.ts'] }));
  writeFileSync(path.join(tmp, 'b.json'), JSON.stringify({ ...base, include: ['form.ts', 'react.ts', 'kiem/phai-dung.ts'] }));
  writeFileSync(path.join(tmp, 'e.json'), JSON.stringify({ ...base, include: ['form.ts', 'react.ts', 'kiem/sai.ts'] }));

  let score = 0;
  const line = (ok, pts, max, label, extra = '') => {
    score += pts;
    console.log(\`\${ok ? '✓' : '✗'} \${label} — \${pts}/\${max}\${extra ? '\\n    ' + extra.trim().split('\\n').slice(0, 4).join('\\n    ') : ''}\`);
  };

  const a = tsc('a.json');
  const aErr = a.out.split('\\n').filter((l) => / error TS\\d+/.test(l) && !l.startsWith('kiem/'));
  line(aErr.length === 0, aErr.length === 0 ? 2 : 0, 2, 'A  your form.ts compiles (strict)', aErr.join('\\n'));
  const b = tsc('b.json');
  const bErr = errorsIn(b.out, 'kiem/phai-dung.ts');
  line(bErr.length === 0, bErr.length === 0 ? 1 : 0, 1, 'B  correct uses compile', bErr.join('\\n'));

  const src = codeOnly(readFileSync(path.join(tmp, 'form.ts'), 'utf8'));
  const cheats = [...src.matchAll(/\\bany\\b|@ts-(?:ignore|nocheck|expect-error)|\\bas\\s+(?!const\\b)\\w+|[\\w$)\\]]!(?=[.[;,)\\s])/g)].map((m) => m[0].trim());
  line(cheats.length === 0, cheats.length === 0 ? 1 : 0, 1, 'C  no any / as / ! / @ts-', cheats.length ? 'found: ' + [...new Set(cheats)].join(', ') : '');

  const d = run(process.execPath, ['--test', '--test-reporter=tap', 'test/form.test.ts']);
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
  'l3-starter': `$ node scripts/cham-lab-12.mjs --from lab12/src
✓ A  your form.ts compiles (strict) — 2/2
✓ B  correct uses compile — 1/1
✗ C  no any / as / ! / @ts- — 0/1
    found: any
✗ D  behaviour tests pass (0/2) — 0/2
    failed: the form collects typed values and submits a CreateBooking
    failed: seats parses from the input string to a number
    ✗ S1 a create body is missing seats — expected TS2741, got no error
    ✗ S2 a create body must not carry a server id — expected TS2353, got no error
    ✗ S3 seats must be a number — expected TS2322, got no error
    ✗ S4 a change event needs target.value, not a bare value — expected TS2353, got no error
    ✗ S5 props is missing onSubmit — expected TS2741, got no error
    ✗ S6 onSubmit takes a CreateBooking — expected TS2322, got no error
    ✗ S7 seats is a number, not a string — expected TS2322, got no error
    ✗ S8 CreateBooking has no purpose — expected TS2339, got no error
✗ E  wrong uses refused (0/8) — 0/4

Score: 3/10 — NOT YET (pass mark 7)`,
  'l4-yeu': `$ node scripts/cham-lab-12.mjs --from lab12/yeu
✓ A  your form.ts compiles (strict) — 2/2
✓ B  correct uses compile — 1/1
✗ C  no any / as / ! / @ts- — 0/1
    found: any
✓ D  behaviour tests pass (2/2) — 2/2
    ✓ S1 a create body is missing seats — expected TS2741, got TS2741
    ✓ S2 a create body must not carry a server id — expected TS2353, got TS2353
    ✓ S3 seats must be a number — expected TS2322, got TS2322
    ✗ S4 a change event needs target.value, not a bare value — expected TS2353, got no error
    ✓ S5 props is missing onSubmit — expected TS2741, got TS2741
    ✓ S6 onSubmit takes a CreateBooking — expected TS2322, got TS2322
    ✗ S7 seats is a number, not a string — expected TS2322, got no error
    ✗ S8 CreateBooking has no purpose — expected TS2339, got no error
✗ E  wrong uses refused (5/8) — 2.5/4

Score: 7.5/10 — PASS (pass mark 7)`,
  'l5-vua': `$ node scripts/cham-lab-12.mjs --from lab12/vua
✓ A  your form.ts compiles (strict) — 2/2
✓ B  correct uses compile — 1/1
✓ C  no any / as / ! / @ts- — 1/1
✓ D  behaviour tests pass (2/2) — 2/2
    ✗ S1 a create body is missing seats — expected TS2741, got no error
    ✓ S2 a create body must not carry a server id — expected TS2353, got TS2353
    ✓ S3 seats must be a number — expected TS2322, got TS2322
    ✓ S4 a change event needs target.value, not a bare value — expected TS2353, got TS2353
    ✓ S5 props is missing onSubmit — expected TS2741, got TS2741
    ✓ S6 onSubmit takes a CreateBooking — expected TS2322, got TS2322
    ✓ S7 seats is a number, not a string — expected TS2322, got TS2322
    ✓ S8 CreateBooking has no purpose — expected TS2339, got TS2339
✗ E  wrong uses refused (7/8) — 3.5/4

Score: 9.5/10 — PASS (pass mark 7)`,
  'l6-ref': `$ node scripts/cham-lab-12.mjs --from lab12/giai
✓ A  your form.ts compiles (strict) — 2/2
✓ B  correct uses compile — 1/1
✓ C  no any / as / ! / @ts- — 1/1
✓ D  behaviour tests pass (2/2) — 2/2
    ✓ S1 a create body is missing seats — expected TS2741, got TS2741
    ✓ S2 a create body must not carry a server id — expected TS2353, got TS2353
    ✓ S3 seats must be a number — expected TS2322, got TS2322
    ✓ S4 a change event needs target.value, not a bare value — expected TS2353, got TS2353
    ✓ S5 props is missing onSubmit — expected TS2741, got TS2741
    ✓ S6 onSubmit takes a CreateBooking — expected TS2322, got TS2322
    ✓ S7 seats is a number, not a string — expected TS2322, got TS2322
    ✓ S8 CreateBooking has no purpose — expected TS2339, got TS2339
✓ E  wrong uses refused (8/8) — 4/4

Score: 10/10 — PASS (pass mark 7)`,
};
