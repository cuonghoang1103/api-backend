/*DU_LIEU*/
const DU_LIEU = {
 "n19-2:cai": "$ npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths   # the line from nextjs.org/docs (fresh create-next-app)\nnpm error code ERESOLVE\nnpm error Found: @types/node@20.19.43\nnpm error peerOptional @types/node@\"^22.0.0 || >=24.0.0\" from vitest@5.1.0\n$ npm install -D @types/node@^22 vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom @playwright/test\n@playwright/test@1.61.0\n@testing-library/react@16.3.3\n@types/node@22.20.5\njsdom@31.0.1\nvitest@5.1.0\n$ npm test 2>&1 | grep -E 'Missing script'\nnpm error Missing script: \"test\"",
 "n19-2:file:vitest.config.mts": "// vitest.config.mts — Vite 8 resolves tsconfig \"paths\" itself: no plugin needed\nimport { defineConfig } from 'vitest/config';\nimport react from '@vitejs/plugin-react';\nexport default defineConfig({\n  plugins: [react()],\n  resolve: { tsconfigPaths: true },\n  test: { environment: 'jsdom' },\n});\n",
 "n19-2:file:src/lib/money.ts": "// lib/money.ts — typed: tsc is happy, and the editor knows n is a number\nexport function formatVND(n: number) {\n  return n.toLocaleString('vi-VN') + '₫';\n}\n",
 "n19-2:file:src/lib/money.test.ts": "// lib/money.test.ts — the normal case + the edge cases a human would expect\nimport { describe, it, expect } from 'vitest';\nimport { formatVND } from './money';\ndescribe('formatVND', () => {\n  it('formats thousands with dots', () => {\n    expect(formatVND(1000)).toBe('1.000₫');\n  });\n  it('handles zero and negatives', () => {\n    expect(formatVND(0)).toBe('0₫');\n    expect(formatVND(-5000)).toBe('-5.000₫');\n  });\n  it('never shows decimals (dong has no cents)', () => {\n    expect(formatVND(1234.5)).toBe('1.235₫');\n  });\n});\n",
 "n19-2:lab": "$ npx vitest run 2>&1 | grep -E 'tsconfig paths|Test Files|Tests |Duration' | cut -c1-150\nThe plugin \"vite-tsconfig-paths\" is detected. Vite now supports tsconfig paths resolution natively via the resolve.tsconfigPaths option. You can remov\n Test Files  1 passed (1)\n      Tests  1 passed (1)\n   Duration  726ms (environment 92%, transform 3%, tests 2%, import 1%)\n$ npx tsc --noEmit 2>&1 | grep -E 'money' | head -2\nsrc/lib/money.ts(2,27): error TS7006: Parameter 'n' implicitly has an 'any' type.",
 "n19-2:sua": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npx vitest run src/lib/money.test.ts 2>&1 | grep -E '✓|×|Expected:|Received:|Tests |Duration' | head -8\n     × never shows decimals (dong has no cents) 3ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\nExpected: \"1.235₫\"\nReceived: \"1.234,5₫\"\n      Tests  1 failed | 2 passed (3)\n   Duration  687ms (environment 94%, tests 3%, import 1%, transform 1%, worker 1%)",
 "n19-2:file:src/lib/save.test.ts": "// lib/save.test.ts — two honest versions\nimport { test, expect } from 'vitest';\nconst save = () => new Promise<{ ok: boolean }>((r) => setTimeout(() => r({ ok: false }), 50));   // save FAILS\ntest('saves (awaited)', async () => { const r = await save(); expect(r.ok).toBe(true); });\ntest('saves (guarded)', async () => { expect.assertions(1); save().then(r => expect(r.ok).toBe(true)) });\n",
 "n19-2:bat": "$ npx vitest run src/lib/save.test.ts 2>&1 | grep -E '✓|×|Tests |Duration' | head -4\n      Tests  1 passed (1)\n   Duration  426ms (environment 93%, transform 4%, import 2%, worker 1%)\n$ npx vitest run src/lib/save.test.ts 2>&1 | grep -E '×|expected|Tests ' | head -6\n   × saves (awaited) 56ms\n   × saves (guarded) 3ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯\nAssertionError: expected false to be true // Object.is equality\nError: expected number of assertions to be 1, but got 0\n      Tests  2 failed (2)",
 "n19-2:file:src/app/api/price/route.ts": "// app/api/price/route.ts — a Route Handler is just an exported function\nimport { total } from '@/lib/cart';\nexport async function GET(req: Request) {\n  const pct = Number(new URL(req.url).searchParams.get('pct') ?? 0);\n  if (!(pct >= 0 && pct <= 50)) return Response.json({ error: 'pct must be 0–50' }, { status: 400 });\n  return Response.json({ total: total([{ name: 'Notebook', price: 100000, qty: 2 }], pct) });\n}\n",
 "n19-2:file:src/lib/cart.ts": "// lib/cart.ts — the cart total, with a percentage discount\nexport type Item = { name: string; price: number; qty: number };\nexport function total(items: Item[], discountPct = 0) {\n  const sum = items.reduce((s, x) => s + x.price * x.qty, 0);\n  return Math.round((sum * (100 - discountPct)) / 100);\n}\n",
 "n19-2:file:src/app/api/price/route.test.ts": "// @vitest-environment node\n// app/api/price/route.test.ts — call GET() directly: no server, no browser\nimport { it, expect } from 'vitest';\nimport { GET } from './route';\nit('returns the discounted total', async () => {\n  const res = await GET(new Request('http://test/api/price?pct=10'));\n  expect(res.status).toBe(200);\n  expect(await res.json()).toEqual({ total: 180000 });\n});\nit('rejects a 90% coupon', async () => {\n  const res = await GET(new Request('http://test/api/price?pct=90'));\n  expect(res.status).toBe(400);\n});\n",
 "n19-2:route": "$ npx vitest run src/app/api/price 2>&1 | grep -E '✓|×|Tests |Duration' | head -4\n      Tests  2 passed (2)\n   Duration  139ms (transform 45%, tests 32%, import 18%, worker 5%)",
 "n19-2:xem": "$ npx vitest   # watch mode: save a file ⇒ only the affected tests re-run\n$ grep -aE 'RERUN|×|Tests |Duration' ~/.rtq-nxj/nen-c19w.log | tr -d '\\033' | sed -E 's/^c(\\[3J)? RERUN/ RERUN/' | cut -c1-90 | head -8\n     × never shows decimals (dong has no cents) 4ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\n      Tests  1 failed | 2 passed (3)\n   Duration  506ms (environment 91%, tests 5%, import 2%, transform 1%, worker 1%)\n FAIL  Tests failed. Watching for file changes...\n RERUN  src/lib/money.ts x1 \n      Tests  3 passed (3)\n   Duration  40ms",
 "n19-2:kho": "$ sed -n '1,12p' src/services/finance/money.test.ts\n/**\n * Money-math unit tests (P1-13). Run with the built-in node:test runner\n * via tsx (`npm test`). Pure functions — no DB, no network — so they run\n * fast and deterministically in CI.\n *\n * Guards the invariants that matter for correctness of every balance:\n * decimal-safe arithmetic (never JS floats) and HALF_UP rounding, plus a\n * worked debt-schedule example whose numbers are hand-verifiable.\n */\nimport { test } from 'node:test';\nimport assert from 'node:assert/strict';\nimport { round2, sum, pct } from './money.js';\n$ npx tsx --test src/services/finance/money.test.ts 2>&1 | grep -E '^ok|^not ok|^# (pass|fail|duration_ms)' | head -7\nok 1 - sum is decimal-safe — 0.1 + 0.2 === 0.3 (no float drift)\nok 2 - round2 rounds to 2 decimal places, HALF_UP\nok 3 - pct converts a percentage to a fraction\nok 4 - computeDebt FLAT_MONTHLY: 12,000,000 @ 1%/mo × 12 matches the worked example\n# pass 4\n# fail 0\n# duration_ms 325.714"
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, gantt, thucTe4 } from './_nxj-chung.mjs';

// ── số đo (n19-2 · lab c18 (npm --dry-run) + c19 · Next.js 16.4.6 · Vitest 5.1.0 · Vite 8 · jsdom 31 · Node 22.23.3)
export const deck = { key: 'nxj-19-2', code: 'NXJ 19.2', title: 'Unit tests with Vitest', sub: 'Chapter 19 · Lesson 19.2' };
const O = (k) => { const v = DU_LIEU[`n19-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (khoi, dau) => { const l = O(khoi).split('\n'); const i = l.findIndex((x) => x.startsWith('$ ') && x.includes(dau)); if (i < 0) throw new Error('thiếu lệnh ' + dau); const r = []; for (let j = i + 1; j < l.length && !l[j].startsWith('$ '); j++) r.push(l[j]); return r; };
const tim = (ds, re) => { const l = ds.find((x) => re.test(x)); if (!l) throw new Error('thiếu dòng ' + re); return l; };
const so = (s, re) => { const m = s.match(re); if (!m) throw new Error('không khớp ' + re); return +m[1]; };
const CAI = doan('cai', 'the line from nextjs.org');
const LS = doan('cai', 'npm install -D @types/node@^22'), MISS = doan('cai', 'npm test');
const DOCS = doan('lab', 'npx vitest run'), TSC1 = doan('lab', 'npx tsc');
const EDGE = doan('sua', 'money.test.ts'), BAT1 = doan('bat', "grep -E '✓|×|Tests |Duration'"), BAT2 = doan('bat', "grep -E '×|expected|Tests '");
const ROUTE = doan('route', 'src/app/api/price'), XEM = doan('xem', 'nen-c19w.log');
const KHO1 = doan('kho', "sed -n '1,12p'"), KHO2 = doan('kho', 'tsx --test');
const T_ROUTE = so(tim(ROUTE, /Duration/), /Duration\s+(\d+)ms/), T_RERUN = so(XEM.at(-1), /Duration\s+(\d+)ms/);
if (!/resolve: \{ tsconfigPaths: true \}/.test(O('file:vitest.config.mts')) || !/n: number/.test(O('file:src/lib/money.ts'))) throw new Error('mã lab đổi');
const H_DOCS = "// vitest.config.mts — as on nextjs.org/docs\nimport { defineConfig } from 'vitest/config'\nimport react from '@vitejs/plugin-react'\nimport tsconfigPaths from 'vite-tsconfig-paths'\nexport default defineConfig({\n  plugins: [tsconfigPaths(), react()],\n  test: { environment: 'jsdom' },\n})";
const H_CFG = "// vitest.config.mts — Vite 8: no plugin needed\nexport default defineConfig({\n  plugins: [react()],\n  resolve: { tsconfigPaths: true },\n  test: { environment: 'jsdom' },\n});";
const H_LESSON = "// money.ts — the lesson's code\nexport function formatVND(n) {\n  return n.toLocaleString('vi-VN') + '₫';\n}\n// money.test.ts\ndescribe('formatVND', () => {\n  it('formats a number as Vietnamese dong', () => {\n    expect(formatVND(1000)).toBe('1.000₫');\n  });\n});";
const H_EDGE = "it('handles zero and negatives', () => {\n  expect(formatVND(0)).toBe('0₫');\n  expect(formatVND(-5000)).toBe('-5.000₫');\n});\nit('never shows decimals (dong has no cents)', () => {\n  expect(formatVND(1234.5)).toBe('1.235₫');\n});";
const H_TRAP = "const save = () => new Promise((r) =>\n  setTimeout(() => r({ ok: false }), 50));   // save FAILS\n\ntest('saves', async () => {\n  save().then(r => expect(r.ok).toBe(true))  // no await\n});";
const H_OK = "test('saves (awaited)', async () => {\n  const r = await save(); expect(r.ok).toBe(true);\n});\ntest('saves (guarded)', async () => {\n  expect.assertions(1);\n  save().then(r => expect(r.ok).toBe(true));\n});";
const H_ROUTE = "// app/api/price/route.test.ts\n// @vitest-environment node\nimport { GET } from './route';\nit('returns the discounted total', async () => {\n  const res = await GET(new Request('http://test/api/price?pct=10'));\n  expect(res.status).toBe(200);\n  expect(await res.json()).toEqual({ total: 180000 });\n});\nit('rejects a 90% coupon', async () => {\n  const res = await GET(new Request('http://test/api/price?pct=90'));\n  expect(res.status).toBe(400);\n});";
const sach = (ds) => ds.map((l) => l.trim()).filter(Boolean);

export const S = [
  { cover: true, nhan: 'Chapter 19 · Lesson 19.2', t: 'Unit tests<br>with Vitest', sub: 'Install it for real, call a function, check the answer — then the edge case that fails, the test that lies, and a Route Handler without a server',
    en: 'Lesson nineteen point two: unit tests with Vitest. Install it for real, call a function and check the answer. Then the edge case that fails, the test that lies, and a Route Handler tested without a server.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Installing on a fresh <code>create-next-app</code>: the docs’ line fails with <b>ERESOLVE</b> — and the fix</li>
    <li><code>describe</code> · <code>it</code> · <code>expect(x).toBe(y)</code>: arrange, act, assert</li>
    <li>Vitest does <b>not</b> type-check: a test can pass while <code>tsc</code> fails</li>
    <li>An edge case found a real bug: <b>“1.234,5₫”</b> for a currency with no cents</li>
    <li>The test that passes because its assertion never ran — and two ways to make it honest</li>
    <li>A Route Handler is a function: call <code>GET()</code> directly, ${T_ROUTE} ms</li></ul>`,
    en: 'Six takeaways. The install line from the docs fails on a fresh project, and how to fix it. Describe, it and expect. Vitest does not type-check. An edge case finds a real bug. The test that passes because its assertion never ran. And a Route Handler tested as a plain function.' },
  { t: 'Installing it, for real', body: two(D(tn(['$ npm install -D vitest @vitejs/plugin-react jsdom \\', '    @testing-library/react @testing-library/dom vite-tsconfig-paths', ...sach(CAI)].join('\n'), { fs: 14, wrap: 64, title: 'fresh create-next-app 16.4.6 · the docs’ line (real)' }),
      tn(['$ npm install -D @types/node@^22 vitest …', ...sach(LS), '$ npm test', ...sach(MISS)].join('\n'), { fs: 14, wrap: 64, title: 'the fix (real)' })),
    D(box('Why it fails', '<code>create-next-app</code> writes <code>@types/node: ^20</code>; Vitest 5 asks for <code>^22</code> or later. npm 10 refuses instead of guessing.', 'do2'),
      box('The fix', 'You run Node 22 anyway — upgrade <code>@types/node</code> to <code>^22</code> in the same command. No <code>--force</code>, no <code>--legacy-peer-deps</code>.', 'xanh'),
      box('And add the script', `${c('"test": "vitest"')} in <code>package.json</code> — a fresh project has no <code>npm test</code> at all.`, 'lam')), 'r64'),
    en: 'Installing it for real. On a fresh create-next-app the docs’ install line fails with ERESOLVE: the project asks for Node types twenty, Vitest five wants twenty-two. Upgrade the Node types in the same command. And add a test script: a fresh project has no npm test at all.' },
  { t: 'The config: one line the docs are behind on', body: two(D(tsx(H_DOCS, { hl: [4, 6] }), tn(sach(DOCS).map((l) => l.replace(/You can remov.*$/, 'You can remove the plugin…')).join('\n'), { fs: 14, wrap: 60, title: 'npx vitest run (real)' })),
    D(tsx(H_CFG, { hl: [4] }), box('jsdom = a fake browser in memory', '<code>environment: \'jsdom\'</code> gives tests a <code>document</code> and <code>window</code> — needed for components (19.3). Pure functions do not need it.', 'lam'),
      box('Vitest ≠ Jest', 'Same <code>describe/it/expect</code> words; Vitest runs on Vite and understands TS and ESM with no extra setup.', 'xanh')), 'r46'),
    en: 'The config. The docs’ version still works, but Vite eight now prints a notice: it resolves tsconfig paths by itself, so the plugin is no longer needed. jsdom gives the tests a fake browser in memory. And Vitest uses the same words as Jest.' },
  { t: 'The smallest test — and what it does not check', body: two(D(tsx(H_LESSON, { hl: [2, 8] })),
    D(tn(sach(DOCS).filter((l) => /Tests|Test Files/.test(l)).join('\n'), { fs: 15, wrap: 50, title: 'npx vitest run (real)' }),
      tn(sach(TSC1).join('\n'), { fs: 14, wrap: 50, title: 'npx tsc --noEmit (real)' }),
      box('Green test, red type-check', 'Vitest only <i>transforms</i> TypeScript — it never type-checks it. <code>n</code> is implicitly <code>any</code>: <code>tsc</code> fails, the test passes. Run both.', 'do2'),
      box('Read it as a sentence', '<i>describe</i> formatVND, <i>it</i> formats a number as dong: <i>expect</i> 1000 <i>to be</i> “1.000₫”.', 'lam')), 'r46'),
    en: 'The smallest test, exactly the lesson’s code. It passes. But the function has no parameter type, and tsc fails with TS seven thousand and six. Vitest only transforms TypeScript, it never type-checks it. Run both. And read a test as a sentence: describe, it, expect, to be.' },
  { t: 'Arrange, act, assert — then the edge cases', body: two(D(tsx(H_EDGE, { hl: [5, 6] })),
    D(tn(sach(EDGE).join('\n'), { fs: 15, wrap: 52, title: 'npx vitest run money.test.ts (real)' }),
      box('An edge case found a real bug', '<code>toLocaleString(\'vi-VN\')</code> keeps decimals: <b>1.234,5₫</b>. Dong has no cents — a price coming from a 10% discount would show a comma.', 'do2'),
      box('Three cases, every time', 'The normal case, an edge (0, negative, empty, a fraction), and anything that once broke.', 'xanh')), 'r46'),
    en: 'Arrange, act, assert, and then the edge cases. Zero and negatives pass. But one thousand two hundred and thirty-four point five shows a comma and a five: the dong has no cents. The lesson’s own function had a bug, and a one-line edge test found it.' },
  { t: 'Watch mode: save, and only that re-runs', body: two(D(tsx("// lib/money.ts — the fix\nreturn n.toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + '₫';", { hl: [2] }),
      tn(sach(XEM).join('\n'), { fs: 15, wrap: 58, title: 'npx vitest --watch (real)' })),
    D(box(`Re-run in ${T_RERUN} ms`, 'Vitest knows which tests import <code>money.ts</code>: one file saved, one file re-run, before you switch windows.', 'xanh'),
      box('Run them where nobody has to remember', 'Watch mode while you code; <code>vitest run</code> in CI on every push (Chapter 20 and the GitHub Actions course).', 'lam')), 'r64'),
    en: `Watch mode. Leave it running, fix the function, save: Vitest re-runs only the tests that import that file, in ${T_RERUN} milliseconds. Watch mode while you code, and vitest run in CI on every push.` },
  { t: 'The trap: a test that passes because nothing was checked', body: two(D(tsx(H_TRAP, { hl: [5], sm: true }), tn(sach(BAT1).join('\n'), { fs: 14, wrap: 50, title: 'save() fails — and the test is green (real)' }),
      box('Make it fail once on purpose', 'Before trusting a new test, break the code and watch it go red.', 'xanh')),
    D(tsx(H_OK, { hl: [2, 5], sm: true }), tn(sach(BAT2).join('\n'), { fs: 13, wrap: 56, title: 'the two honest versions (real)' }))),
    en: 'The trap. save fails, and the test is green: the test function returned before the promise resolved, so nobody was listening when the assertion ran. Await it, or declare expect dot assertions one. Both versions now fail, honestly. And make every new test fail once on purpose.' },
  { t: 'Simulation: when does the assertion run?', body: two(D(gantt([['test function', 0, 2, '#16a34a', 'returns → ✓ recorded'], ['save() promise', 0, 50, '#94a3b8', 'resolves at 50 ms'], ['expect(r.ok)', 50, 52, '#dc2626', 'fails — nobody listening'], ['awaited version', 0, 56, '#dc2626', '× fails at 56 ms']], { w: 760, nhan: 200, buoc: 20, max: 120, fs: 17 })),
    D(box('The runner only waits for what you return', 'An <code>async</code> test returns a promise that resolves when its body finishes. Without <code>await</code>, the body finishes at once.', 'do2'),
      box('Rule', 'Every promise inside a test is awaited or returned — or the test declares <code>expect.assertions(n)</code>.', 'xanh')), 'r64'),
    en: 'When does the assertion run? The test function returns almost at once, and the runner records it as passed. The save promise resolves at fifty milliseconds, and the failing assertion runs with nobody listening. The awaited version waits, and fails at fifty-six milliseconds.' },
  { t: 'Next.js: a Route Handler is just a function', body: D(tsx(H_ROUTE, { hl: [3, 5, 10], sm: true }),
    two(tn(sach(ROUTE).join('\n'), { fs: 15, wrap: 50, title: 'npx vitest run src/app/api/price (real)' }),
      D(box('No server, no browser', 'Build a <code>Request</code>, call <code>GET()</code>, read the <code>Response</code> — the objects the server would pass. The 400 path too.', 'xanh'),
        box('environment: node', 'Line 2 switches this file from jsdom to Node: the right globals, and faster.', 'lam')))),
    en: `A Next.js Route Handler is just an exported function. Build a Request, call GET, read the Response: no server, no browser, ${T_ROUTE} milliseconds. Test the error path too: a ninety percent coupon gets a four hundred.` },
  { t: 'cuongthai.com: the same idea, Node’s built-in runner', body: two(D(tn([...KHO1.slice(0, 4), ' * …', ...KHO1.slice(-3)].join('\n'), { fs: 14, wrap: 64, title: "sed -n '1,12p' src/services/finance/money.test.ts (real)" })),
    D(tn(sach(KHO2).join('\n'), { fs: 14, wrap: 54, title: 'npx tsx --test …/money.test.ts (real)' }),
      box('No framework at all', 'The backend uses <code>node:test</code> + <code>node:assert</code>: <code>test(…)</code>, <code>assert.equal(…)</code>. Same arrange-act-assert.', 'lam'),
), ''),
    en: 'This course’s own repository does the same thing without any framework: Node’s built-in test runner and assert. Its money tests check decimal-safe sums, rounding and a worked loan example. Exactly the risky logic unit tests are for.' },
  { t: 'Not learning in a vacuum: real life, what if, the attacker', to: true, body: thucTe4({
      doi: ['💸', 'Money is full of edges', ['1.234,5₫ on an invoice looks broken', 'rounding decides who loses 1 dong × a million']],
      neu: ['❓', 'What if CI only runs tsc?', ['type-check green, behaviour never checked', 'the test that never awaited stays green for years']],
      xau: ['🕵️', 'Inputs you did not imagine', ['pct = -10, 1e9, "abc", NaN', 'a route that trusts its query string']],
      phong: ['🛡️', 'Edges + honest tests', ['test the 400 path of every handler', 'await everything; see each test fail once']],
    }),
    en: 'Real life: money is full of edges, and rounding decides who loses a dong a million times. What if CI only runs tsc? Behaviour is never checked, and a test that never awaited stays green for years. Attackers send inputs you did not imagine. Test the error path of every handler, and see each test fail once.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Vitest', 'test runner on Vite'), kw('describe / it / test', 'group · one case'), kw('expect + matcher', 'toBe, toEqual'), kw('Arrange · Act · Assert', 'the shape of a test'),
      kw('Edge case', '0, negative, fraction, empty'), kw('Watch mode', 're-run on save'), kw('jsdom', 'fake DOM in memory'), kw('expect.assertions(n)', 'fail if none ran'),
      kw('ERESOLVE', 'npm peer conflict'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: Vitest; describe, it and test; expect and its matchers; arrange, act, assert; edge case; watch mode; jsdom; expect dot assertions; and ERESOLVE.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Install with ${c('@types/node@^22')}; add ${c('"test": "vitest"')}`,
      'Write 3 tests for one function: normal, edge, once-broken',
      'Break the code on purpose; see red; fix; see green',
      `Test one Route Handler by calling ${c('GET(new Request(…))')}`,
    ]), box('Keep these', `<ul><li>Vitest does not type-check — run tsc too</li><li>Edges find the real bugs</li><li>Await every promise</li><li>A handler is a function</li></ul>`, 'lam'), ''),
    en: 'Your turn: install with the newer Node types and add the test script; write three tests for one function; break the code on purpose and watch it go red; and test one Route Handler by calling GET with a Request.' },
];
export const slides = lamDeck({ chuong: 'Chapter 19 — Testing: catching bugs before your users do', bai: '19.2' }, S);
