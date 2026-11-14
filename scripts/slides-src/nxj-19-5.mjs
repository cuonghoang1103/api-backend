/*DU_LIEU*/
const DU_LIEU = {
 "n19-5:file:vitest.config.mts": "import { defineConfig } from 'vitest/config';\nimport react from '@vitejs/plugin-react';\nexport default defineConfig({\n  plugins: [react()],\n  resolve: { tsconfigPaths: true },\n  test: { environment: 'jsdom', exclude: ['e2e/**', 'node_modules/**'] },\n});\n",
 "n19-5:file:src/lib/content.ts": "// lib/content.ts — the schema AFTER the rename: CODE → CODE_REVIEW\nexport const CONTENT_TYPES =\n  ['VLOG', 'CODE_REVIEW', 'QUIZ'] as const;\nexport type ContentType = (typeof CONTENT_TYPES)[number];\n// a stand-in for the database: like a Postgres enum, it rejects unknown values AT RUNTIME\nexport function insertPost(p: { title: string; type: ContentType }) {\n  if (!CONTENT_TYPES.includes(p.type)) throw new Error(`invalid input value for enum \"ContentType\": \"${p.type}\"`);\n  return { id: 1, ...p };\n}\n",
 "n19-5:file:prisma/seed.ts": "// prisma/seed.ts — no private copy: import the real type\nimport { insertPost, type ContentType } from '../src/lib/content';\nconst posts: { title: string; type: ContentType }[] = [{ title: 'Hello', type: 'VLOG' }, { title: 'Review my PR', type: 'CODE' }];\nfor (const p of posts) console.log('seeded', insertPost(p).id, p.title);\n",
 "n19-5:file:tsconfig.seed.json": "{ \"extends\": \"./tsconfig.json\", \"include\": [\"prisma/seed.ts\", \"src/lib/content.ts\"], \"exclude\": [] }\n",
 "n19-5:enum": "$ grep '\"exclude\"' tsconfig.json   # like the course's own backend tsconfig\n\"exclude\": [\"node_modules\",\"prisma/seed.ts\"]\n$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npx tsx prisma/seed.ts 2>&1 | grep -E '^seeded|^Error' | head -3\nseeded 1 Hello\nError: invalid input value for enum \"ContentType\": \"CODE\"\n$ npx tsc --noEmit -p tsconfig.seed.json 2>&1 | cut -c1-120 | head -2\nprisma/seed.ts(3,115): error TS2322: Type '\"CODE\"' is not assignable to type '\"VLOG\" | \"CODE_REVIEW\" | \"QUIZ\"'.",
 "n19-5:file:src/lib/authStore.ts": "// lib/authStore.ts — the fix (as committed 14/11): flip the flag AFTER create() has returned\nimport { create } from 'zustand';\nimport { persist, createJSONStorage } from 'zustand/middleware';\ntype S = { user: { name: string } | null; isHydrated: boolean; isLoading: boolean };\nexport const useAuthStore = create<S>()(persist((): S => ({ user: null, isHydrated: false, isLoading: true }), {\n  name: 'auth-storage', storage: createJSONStorage(() => localStorage),\n  partialize: (s) => ({ user: s.user }),\n}));\nconst markHydrated = () => useAuthStore.setState({ isHydrated: true, isLoading: false });\nif (useAuthStore.persist.hasHydrated()) markHydrated();\nelse useAuthStore.persist.onFinishHydration(markHydrated);\n",
 "n19-5:file:src/lib/authStore.test.ts": "// lib/authStore.test.ts — a REGRESSION test: written for the bug, kept forever\nimport { it, expect, vi, beforeEach } from 'vitest';\nbeforeEach(() => { localStorage.clear(); vi.resetModules(); });\nit('isHydrated flips after loading a saved user',\n  async () => {\n  localStorage.setItem('auth-storage', JSON.stringify({ state: { user: { name: 'An' } }, version: 0 }));\n  const { useAuthStore } = await import('./authStore');\n  await vi.waitFor(() => expect(useAuthStore.getState().isHydrated).toBe(true), { timeout: 500 });\n  expect(useAuthStore.getState().user).toEqual({ name: 'An' });\n});\nit('isHydrated flips with nothing saved', async () => {\n  const { useAuthStore } = await import('./authStore');\n  await vi.waitFor(() => expect(useAuthStore.getState().isHydrated).toBe(true), { timeout: 500 });\n});\n",
 "n19-5:hydrat": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npx vitest run src/lib/authStore.test.ts 2>&1 | grep -E '✓|×|AssertionError|Tests ' | head -5\n   × isHydrated flips after loading a saved user 516ms\n   × isHydrated flips with nothing saved 502ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯\nAssertionError: expected false to be true // Object.is equality\nAssertionError: expected false to be true // Object.is equality\n$ npx vitest run src/lib/authStore.test.ts 2>&1 | grep -E '✓|×|AssertionError|Tests ' | head -5\n      Tests  2 passed (2)",
 "n19-5:file:src/lib/ship.ts": "// lib/ship.ts — the rule: orders of 500.000₫ or more ship free\nexport function shipping(total: number) {\n  return total > 500000 ? 0 : 30000;\n}\n",
 "n19-5:file:src/lib/ship.test.ts": "// lib/ship.test.ts — test the RULE, at its edge\nimport { it, expect } from 'vitest';\nimport { shipping } from './ship';\nit('charges 30.000₫ below 500.000₫', () => expect(shipping(499999)).toBe(30000));\nit('ships free at exactly 500.000₫', () =>\n  expect(shipping(500000)).toBe(0));\n",
 "n19-5:phu": "$ npx vitest run src/lib/ship.test.ts --coverage --coverage.include=src/lib/ship.ts 2>&1 | grep -E 'Tests |fully covered|^(Statements|Branches|Lines) ' | head -5\n      Tests  1 passed (1)\n1 file fully covered.\nStatements   : 100% ( 1/1 )\nBranches     : 100% ( 2/2 )\nLines        : 100% ( 1/1 )\n$ npx vitest run src/lib/ship.test.ts 2>&1 | grep -E '✓|×|^[-+] [0-9]|Tests ' | head -6\n   × ships free at exactly 500.000₫ 3ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\n- 0\n+ 30000\n      Tests  1 failed | 1 passed (2)",
 "n19-5:kho": "$ grep -n '\"exclude\"' tsconfig.json; grep -n '\"typecheck:seed\"' package.json\n27:  \"exclude\": [\"node_modules\", \"dist\", \"prisma/seed.ts\"]\n11:    \"typecheck:seed\": \"tsc -p tsconfig.seed.json\",\n$ git show --stat --format='%h %ad %s' --date=short c9df1705f | cut -c1-100 | grep -vE '^$' | head -5\nc9df1705f 2026-11-14 fix(web): isHydrated của authStore không bao giờ lật (setState trong onRehydrat\n docs/so-loi.md                  |  7 +++++++\n frontend/src/app/saved/page.tsx |  8 +++++--\n frontend/src/store/authStore.ts | 46 +++++++++++++++++++++--------------------\n 3 files changed, 37 insertions(+), 24 deletions(-)\n$ node -e \"const s=require('./package.json').scripts.test;const L=new Set(s.split(' ').filter(x=>/\\.test\\.(ts|mjs)$/.test(x)));const all=require('child_process').execSync(\\\"find src -name '*.test.ts'\\\").toString().trim().split('\\n').filter(f=>!f.endsWith('.db.test.ts'));const miss=all.filter(f=>!L.has(f));console.log('src/ unit test (không cần CSDL):',all.length,'· có trong npm test:',all.length-miss.length,'· KHÔNG có (không bao giờ tự chạy):',miss.length);console.log('ví dụ:',miss.slice(0,3).join(', '))\"\nsrc/ unit test (không cần CSDL): 229 · có trong npm test: 137 · KHÔNG có (không bao giờ tự chạy): 92\nví dụ: src/config/dnsDuPhong.test.ts, src/utils/khachDong.test.ts, src/utils/crypto.test.ts"
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, icards, cmp, thucTe4 } from './_nxj-chung.mjs';

// ── số đo (n19-5 · lab c19 · Next.js 16.4.6 · TypeScript 5 · tsx · Vitest 5.1.0 + @vitest/coverage-v8 5.1.0 · zustand 5.1.0 · kho api-backend 14/11/2026)
export const deck = { key: 'nxj-19-5', code: 'NXJ 19.5', title: 'What to test — and why type-checking is not enough', sub: 'Chapter 19 · Lesson 19.5' };
const O = (k) => { const v = DU_LIEU[`n19-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (khoi, dau) => { const l = O(khoi).split('\n'); const i = l.findIndex((x) => x.startsWith('$ ') && x.includes(dau)); if (i < 0) throw new Error('thiếu lệnh ' + dau); const r = []; for (let j = i + 1; j < l.length && !l[j].startsWith('$ '); j++) r.push(l[j]); return r; };
const tim = (ds, re) => { const l = ds.find((x) => re.test(x)); if (!l) throw new Error('thiếu dòng ' + re); return l; };
const so = (s, re) => { const m = s.match(re); if (!m) throw new Error('không khớp ' + re); return +m[1]; };
const sach = (ds) => ds.map((l) => l.trim()).filter(Boolean);
const EX = doan('enum', 'like the course'), TSC = doan('enum', 'npx tsc --noEmit &&'), SEED = doan('enum', 'prisma/seed.ts 2>&1'), TSEED = doan('enum', 'tsconfig.seed.json');
const H1 = doan('hydrat', "grep -E '✓|×|AssertionError"), H2 = O('hydrat').split('\n').slice(-1);
const COV = doan('phu', '--coverage'), EDGE = doan('phu', "grep -E '✓|×|^[-+] [0-9]");
const KHO = O('kho').split('\n'), KX = doan('kho', 'grep -n \'"exclude"\''), KG = doan('kho', 'git show'), KN = doan('kho', 'node -e');
const MISS = so(tim(KN, /KHÔNG có/), /KHÔNG có[^:]*: (\d+)/), ALL = so(tim(KN, /không cần CSDL/), /CSDL\): (\d+)/);
if (!/'CODE_REVIEW'/.test(O('file:src/lib/content.ts')) || !/total > 500000/.test(O('file:src/lib/ship.ts'))) throw new Error('mã lab đổi');
const H_SCHEMA = "// lib/content.ts — the schema AFTER the rename\nexport const CONTENT_TYPES =\n  ['VLOG', 'CODE_REVIEW', 'QUIZ'] as const;\nexport type ContentType = (typeof CONTENT_TYPES)[number];\n\n// prisma/seed.ts — written months ago\ntype Kind = 'VLOG' | 'CODE' | 'QUIZ';          // its OWN copy\nconst posts: { title: string; type: Kind }[] = [\n  { title: 'Hello', type: 'VLOG' },\n  { title: 'Review my PR', type: 'CODE' }];";
const H_HYD = "// the shape of authStore.ts before 14/11\npersist(…, { onRehydrateStorage: () => () => {\n  // runs INSIDE create():\n  useAuthStore.setState({ isHydrated: true });\n} })\n\n// the regression test — written for the bug, kept forever\nit('isHydrated flips after loading a saved user',\n  async () => {\n  localStorage.setItem('auth-storage', '…An…');\n  const { useAuthStore } = await import('./authStore');\n  await vi.waitFor(() =>\n    expect(useAuthStore.getState().isHydrated).toBe(true));\n});";
const H_SHIP = "// lib/ship.ts — rule: 500.000₫ or more ships free\nreturn total > 500000 ? 0 : 30000;          // BUG: should be >=\n\n// 100% coverage, zero assertions\nit('runs shipping', () => {\n  shipping(100000); shipping(600000);\n});\n\n// test the RULE, at its edge\nit('ships free at exactly 500.000₫', () =>\n  expect(shipping(500000)).toBe(0));";

export const S = [
  { cover: true, nhan: 'Chapter 19 · Lesson 19.5', t: 'What to test — and why<br>type-checking is not enough', sub: 'cuongthai.com’s own expensive lesson replayed — tsc green, production broken — plus a regression test for a real bug, and 100% coverage that catches nothing',
    en: 'Lesson nineteen point five: what to test, and why type-checking is not enough. This course’s own expensive lesson, replayed: tsc green, production broken. Plus a regression test for a real bug, and one hundred percent coverage that catches nothing.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Spend tests where a bug would hurt: risky logic, money paths, every bug you fixed</li>
    <li>Replayed: <code>tsc</code> <b>0 errors</b>, then the seed crashes — a file tsc never saw</li>
    <li>A regression test for cuongthai’s <code>isHydrated</code> bug: <b>red</b> on the old code, <b>green</b> on the fix</li>
    <li><b>100%</b> coverage with zero assertions — and the boundary bug it missed</li>
    <li>${ALL} backend unit-test files; <b>${MISS}</b> are not in <code>npm test</code></li></ul>`,
    en: `Five takeaways. Spend tests where a bug would hurt. The seed story replayed: zero type errors, then a crash. A regression test for a real bug in this course’s frontend. One hundred percent coverage that catches nothing. And ${MISS} of this repo’s unit test files that npm test never runs.` },
  { t: 'Where to spend the testing budget', body: icards([
      ['calc', 'Pure logic — many', 'Prices, permissions, dates, validation. Milliseconds each; this is where subtle bugs hide (19.2).'],
      ['layout', 'Components — some', 'The ones with branches: empty, error, disabled, loading (19.3).'],
      ['route', 'Journeys — a few', 'Sign up, log in, pay. End-to-end, against a build, on every PR (19.4).'],
      ['bug', 'Every bug you fix — one test', 'Fails on the old behaviour, passes on the fix. The bug cannot come back.'],
    ], 2),
    en: 'Where to spend the testing budget. Many tests for pure logic: prices, permissions, dates, validation. Some component tests, for the ones with branches. A few end-to-end journeys that pay. And one test for every bug you fix, so it cannot come back.' },
  { t: 'Types and tests catch different things', body: cmp(['Mistake', 'tsc', 'a test that runs'], [
      ['Wrong shape, misspelled field', '✓ catches', '✓ (if it gets there)'],
      ['Right type, wrong value (10 instead of 10%)', '✗ — a number is a number', '✓ catches (19.1)'],
      ['Async assertion never awaited', '✗', '✗ unless written honestly (19.2)'],
      ['A file tsc never looks at', '✗ — excluded', '✓ only if you run it'],
      ['Runtime order: code runs before a variable exists', '✗', '✓ catches (this lesson)'],
    ], { hl: [3, 4] }),
    en: 'Types and tests catch different things. tsc catches wrong shapes and misspelled fields. It cannot catch a right type with a wrong value, a file it never looks at, or code that runs in the wrong order. Only running the code catches those.' },
  { t: 'Replayed: rename an enum, tsc says 0 errors', body: two(D(tsx(H_SCHEMA, { hl: [7, 10], sm: true })),
    D(tn([...sach(EX), ...sach(TSC)].join('\n'), { fs: 14, wrap: 52, title: 'grep exclude · npx tsc --noEmit (real)' }),
      tn(sach(SEED).join('\n'), { fs: 14, wrap: 52, title: 'npx tsx prisma/seed.ts (real)' }),
      box('Two holes at once', 'The seed was <b>excluded</b> from tsconfig, and it checked against its <b>own copy</b> of the union. The database (here, a stand-in) rejected <code>CODE</code> at runtime.', 'do2')), 'r64'),
    en: 'Replayed in the lab. The schema renames CODE to CODE_REVIEW. The seed file was written months ago, with its own copy of the union, and the tsconfig excludes it. tsc: zero errors. Run the seed: the first post goes in, the second crashes with an invalid enum value.' },
  { t: 'Closing the hole — what the repo did', body: two(D(tsx("// prisma/seed.ts — no private copy: import the real type\nimport { insertPost, type ContentType } from '../src/lib/content';\n\n// tsconfig.seed.json — type-check the file the main config skips\n{ \"extends\": \"./tsconfig.json\", \"include\": [\"prisma/seed.ts\", …] }", { hl: [2, 5], sm: true }),
      tn(sach(TSEED).join('\n'), { fs: 14, wrap: 60, title: 'npx tsc -p tsconfig.seed.json (real)' })),
    D(tn(sach(KX).join('\n'), { fs: 14, wrap: 52, title: 'api-backend (real)' }),
      box('This exact fix is in the repo', 'Production broke on 08/08/2026. Since then: <code>npm run typecheck:seed</code> + <code>npx prisma db seed</code> in the checklist — “the ONLY way to catch runtime-only seed breakage”.', 'xanh')), 'r64'),
    en: 'Closing the hole. Import the real type instead of a private copy, and give the excluded file its own type-check config: now tsc says CODE is not assignable. This course’s repository did exactly that after production broke: a seed type-check, and actually running the seed.' },
  { t: 'A regression test for a real bug: isHydrated', body: two(D(tsx(H_HYD, { hl: [4, 12], sm: true })),
    D(tn([...sach(H1).filter((l) => !/^\$/.test(l)), '— after the fix —', ...sach(H2)].join('\n'), { fs: 13, wrap: 56, title: 'vitest authStore.test.ts (real)' }),
      box('tsc never complained', 'The callback ran inside <code>create()</code>, before <code>useAuthStore</code> existed. The error was swallowed; the flag stayed <code>false</code>; pages said “Loading…” forever.', 'do2'),
      box('The fix shipped without one', `<code>${tim(KG, /^c9df1705f/).slice(0, 9)}</code> changed 3 files — none of them a test. This test would keep it fixed.`, 'lam')), ''),
    en: 'A regression test for a real bug in this course’s frontend. The store flipped isHydrated inside a callback that ran before the store existed. tsc never complained; the flag stayed false and pages loaded forever. The test is red on the old shape and green on the fix. The real fix shipped without a test.' },
  { t: '100% coverage, and the bug is still there', body: two(D(tsx(H_SHIP, { hl: [2, 6, 11], sm: true })),
    D(tn(sach(COV).join('\n'), { fs: 15, wrap: 50, title: 'vitest --coverage (real)' }), tn(sach(EDGE).join('\n'), { fs: 15, wrap: 50, title: 'the edge test (real)' }),
      box('Coverage counts lines that ran', 'Not lines that were checked. A coverage target is met most cheaply by tests like the first one.', 'do2')), 'r64'),
    en: 'One hundred percent coverage, and the bug is still there. The rule says five hundred thousand or more ships free, but the code says greater than. A test that calls every line with no assertions: one hundred percent statements, branches and lines. One test at the edge: red, zero expected, thirty thousand received.' },
  { t: 'cuongthai.com: a test only helps if it runs', body: two(D(tn(sach(KN).join('\n'), { fs: 14, wrap: 58, title: 'api-backend · package.json "test" vs src/ (real)' })),
    D(box(`${MISS} of ${ALL} files never run by npm test`, '<code>npm test</code> lists its test files by hand. A new test that nobody adds to the list is written, committed — and never executed.', 'do2'),
      box('Prefer a pattern', 'Run tests by glob or by the runner’s discovery; add a check that fails when a test file is not wired in.', 'xanh')), 'r64'),
    en: `This course’s own repository: npm test lists its test files by hand. Of ${ALL} backend unit test files, ${MISS} are not on the list, so they are written, committed, and never run. Run tests by pattern, or add a check that fails when a test file is not wired in.` },
  { t: 'Not learning in a vacuum: real life, what if, the attacker', to: true, body: thucTe4({
      doi: ['🏗️', 'Green checklist, broken production', ['tsc + build passed; the seed crashed', 'a file nobody type-checked']],
      neu: ['❓', 'What if the target is a number?', ['“90% coverage” is met by easy lines', 'the permission check stays untested']],
      xau: ['🕵️', 'Attackers live at the edges', ['exactly 500.000₫, exactly the limit', 'off-by-one in a rule = free stuff']],
      phong: ['🛡️', 'Risk first, then run it', ['test edges + every fixed bug', 'run the real thing: seed, build, start']],
    }),
    en: 'Real life: a green checklist and a broken production, because of a file nobody type-checked. What if the target is a coverage number? It is met by easy lines while the permission check stays untested. Attackers live at the edges: exactly the limit, off by one. Test risk first, every fixed bug, and run the real thing.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Risk-based testing', 'test where it hurts'), kw('Regression test', 'keeps a fixed bug fixed'), kw('Type-check', 'shapes, not values'), kw('Runtime-only bug', 'only running finds it'),
      kw('Coverage', 'lines that ran ≠ checked'), kw('Boundary / edge', '500.000 vs 500.001'), kw('Excluded file', 'tsc never sees it'), kw('Single source of truth', 'import the type'), kw('Wired-in test', 'actually executed'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: risk-based testing; regression test; type-check; runtime-only bug; coverage; boundary; excluded file; single source of truth; and a wired-in test.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Find files your ${c('tsconfig')} excludes; type-check or run them`,
      'Pick your last fixed bug; write the test that would have caught it',
      `Run ${c('vitest --coverage')}; find a 100% file and test its edges`,
      'Check that every test file is actually executed by CI',
    ]), box('Chapter 19, in one breath', `<ul><li>Unit for logic, component like a user, E2E for journeys</li><li>Types ≠ tests: run the code</li><li>Every fixed bug gets a test</li><li>Coverage is a hint, not a goal</li></ul>`, 'lam'), ''),
    en: 'Your turn: find the files your tsconfig excludes and type-check or run them; write the test your last fixed bug deserved; run coverage and test the edges of a fully covered file; and check that every test file is actually executed. That closes Chapter 19.' },
];
export const slides = lamDeck({ chuong: 'Chapter 19 — Testing: catching bugs before your users do', bai: '19.5' }, S);
