/*DU_LIEU*/
const DU_LIEU = {
 "n19-1:file:src/lib/money.ts": "// lib/money.ts — format a number as Vietnamese dong\nexport function formatVND(n: number) {\n  return n.toLocaleString('vi-VN') + '₫';\n}\n",
 "n19-1:file:src/lib/cart.ts": "// lib/cart.ts — the cart total, with a percentage discount (FIXED)\nexport type Item = { name: string; price: number; qty: number };\nexport function total(items: Item[], discountPct = 0) {\n  const sum = items.reduce((s, x) => s + x.price * x.qty, 0);\n  return Math.round((sum * (100 - discountPct)) / 100);\n}\n",
 "n19-1:file:src/app/gio/Cart.tsx": "'use client';\n// app/gio/Cart.tsx — two notebooks and one coupon button\nimport { useState } from 'react';\nimport { total } from '@/lib/cart';\nimport { formatVND } from '@/lib/money';\nconst ITEMS = [{ name: 'Notebook', price: 100000, qty: 2 }];\nexport default function Cart() {\n  const [pct, setPct] = useState(0);\n  return (\n    <main className=\"p-6\">\n      <h1 className=\"text-xl font-bold\">Your cart</h1>\n      <p>2 × Notebook · 100.000₫</p>\n      <button className=\"rounded border px-3\" onClick={() => setPct(10)}>Apply 10% off</button>\n      <p className=\"text-emerald-700\">Total: {formatVND(total(ITEMS, pct))}</p>\n    </main>\n  );\n}\n",
 "n19-1:file:src/app/gio/page.tsx": "import Cart from './Cart';\nexport default function Page() { return <Cart />; }\n",
 "n19-1:file:src/lib/cart.test.ts": "// lib/cart.test.ts — UNIT: one function, no browser\nimport { describe, it, expect } from 'vitest';\nimport { total } from './cart';\ndescribe('total', () => {\n  it('applies a percentage discount', () => {\n    expect(total([{ name: 'Notebook', price: 100000, qty: 2 }], 10)).toBe(180000);\n  });\n});\n",
 "n19-1:file:src/app/gio/Cart.test.tsx": "// app/gio/Cart.test.tsx — COMPONENT: render in a fake DOM, click like a user\nimport { render, screen } from '@testing-library/react';\nimport userEvent from '@testing-library/user-event';\nimport { it, expect } from 'vitest';\nimport Cart from './Cart';\nit('shows the discounted total after Apply', async () => {\n  render(<Cart />);\n  await userEvent.click(screen.getByRole('button', { name: 'Apply 10% off' }));\n  expect(screen.getByText('Total: 180.000₫')).toBeInTheDocument();\n});\n",
 "n19-1:file:e2e/gio.spec.ts": "// e2e/gio.spec.ts — END-TO-END: the built app in a real Chromium\nimport { test, expect } from '@playwright/test';\ntest('a shopper sees the discounted total', async ({ page }) => {\n  await page.goto('/gio');\n  await page.getByRole('button', { name: 'Apply 10% off' }).click();\n  await expect(page.getByText('Total: 180.000₫')).toBeVisible();\n});\n",
 "n19-1:file:vitest.config.mts": "import { defineConfig } from 'vitest/config';\nimport react from '@vitejs/plugin-react';\nexport default defineConfig({\n  plugins: [react()],\n  resolve: { tsconfigPaths: true },\n  test: { environment: 'jsdom', setupFiles: ['./vitest.setup.ts'], exclude: ['e2e/**', 'node_modules/**'] },\n});\n",
 "n19-1:file:vitest.setup.ts": "import '@testing-library/jest-dom/vitest';\nimport { cleanup } from '@testing-library/react';\nimport { afterEach } from 'vitest';\nafterEach(() => cleanup());\n",
 "n19-1:file:playwright.config.ts": "import { defineConfig, devices } from '@playwright/test';\nexport default defineConfig({\n  testDir: './e2e',\n  use: { baseURL: 'http://127.0.0.1:19334' },\n  webServer: { command: 'npx next start -p 19334 -H 127.0.0.1', url: 'http://127.0.0.1:19334/gio', reuseExistingServer: false },\n  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],\n});\n",
 "n19-1:lab": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/gio|rror' | sed 's/^[┌├└] //'\n✓ Compiled successfully in 2.8s\n○ /gio",
 "n19-1:do": "$ npx vitest run src/lib/cart.test.ts 2>&1 | grep -E '✓|×|FAIL|^ *[-+] [0-9]|Tests |Duration' | head -8\n     × applies a percentage discount 6ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\n FAIL  src/lib/cart.test.ts > total > applies a percentage discount\n- 180000\n+ 199990\n      Tests  1 failed (1)\n   Duration  927ms (environment 68%, setup 27%, transform 3%, tests 1%)\n$ npx vitest run src/app/gio/Cart.test.tsx 2>&1 | grep -E '✓|×|Unable to find|Tests |Duration' | cut -c1-110 | head -6\n   × shows the discounted total after Apply 74ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\nTestingLibraryElementError: Unable to find an element with the text: Total: 180.000₫. This could be because th\n        2 × Notebook · 100.000₫\n      Tests  1 failed (1)\n   Duration  674ms (environment 57%, setup 19%, tests 13%, import 8%, transform 3%)\n$ npx playwright test 2>&1 | grep -E '✘|✓|passed|failed|Timeout:|Error: element' | head -8\n  ✘  1 [chromium] › e2e/gio.spec.ts:3:5 › a shopper sees the discounted total (5.2s)\n    Error: expect(locator).toBeVisible() failed\n    Timeout: 5000ms\n    Error: element(s) not found\n  1 failed",
 "n19-1:sua": "$ npx vitest run src/lib/cart.test.ts 2>&1 | grep -E '✓|×|Tests |Duration' | head -4\n      Tests  1 passed (1)\n   Duration  617ms (environment 68%, setup 26%, transform 4%, worker 1%)\n$ npx vitest run src/app/gio/Cart.test.tsx 2>&1 | grep -E '✓|×|Tests |Duration' | head -4\n      Tests  1 passed (1)\n   Duration  634ms (environment 60%, setup 18%, tests 13%, import 6%, transform 2%, worker 1%)\n$ npx playwright test 2>&1 | grep -E '✘|✓|passed|failed' | head -4\n  ✓  1 [chromium] › e2e/gio.spec.ts:3:5 › a shopper sees the discounted total (216ms)\n  1 passed (1.6s)",
 "n19-1:file:src/app/gio/Cart.impl.test.tsx": "// app/gio/Cart.impl.test.tsx — TRAP: checks HOW it is drawn, not WHAT the user sees\nimport { render } from '@testing-library/react';\nimport { it, expect } from 'vitest';\nimport Cart from './Cart';\nit('renders the total in green (implementation detail)', () => {\n  const { container } = render(<Cart />);\n  expect(container.querySelector('.text-emerald-700')).not.toBeNull();\n});\n",
 "n19-1:impl": "$ npx vitest run src/app/gio 2>&1 | grep -E '✓|×|Tests ' | head -4\n      Tests  2 passed (2)\n$ sed -i '' 's/text-emerald-700/text-green-700/' src/app/gio/Cart.tsx   # a refactor: same green, different class name\n14:      <p className=\"text-green-700\">Total: {formatVND(total(ITEMS, pct))}</p>\n$ npx vitest run src/app/gio 2>&1 | grep -E '✓|×|Tests ' | head -4\n   × renders the total in green (implementation detail) 31ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\n      Tests  1 failed | 1 passed (2)",
 "n19-1:kho": "$ echo \"backend src/**/*.test.ts: $(find src -name '*.test.ts' | wc -l | tr -d ' ') tệp (trong đó *.db.test.ts cần CSDL: $(find src -name '*.db.test.ts' | wc -l | tr -d ' '))\"; echo \"frontend/src *.test.ts: $(find frontend/src -name '*.test.ts' | wc -l | tr -d ' ') · *.test.tsx (render component): $(find frontend/src -name '*.test.tsx' | wc -l | tr -d ' ')\"; echo \"frontend/e2e *.spec.ts: $(find frontend/e2e -name '*.spec.ts' | wc -l | tr -d ' ') · @testing-library trong frontend/package.json: $(grep -c '@testing-library' frontend/package.json)\"\nbackend src/**/*.test.ts: 329 tệp (trong đó *.db.test.ts cần CSDL: 102)\nfrontend/src *.test.ts: 62 · *.test.tsx (render component): 0\nfrontend/e2e *.spec.ts: 13 · @testing-library trong frontend/package.json: 0\n$ npx tsx --test src/services/finance/money.test.ts 2>&1 | grep -E '^# (tests|pass|fail|duration_ms)'\n# tests 4\n# pass 4\n# fail 0\n# duration_ms 271.326291",
 "n19-1:anh": "",
 "n19-1:dung": ""
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, icards, meter, thucTe4 } from './_nxj-chung.mjs';

// ── số đo (n19-1 · lab c19 · Next.js 16.4.6 · Vitest 5.1.0 + jsdom 31 + Testing Library 16.3 · Playwright 1.61 (Chromium) · next start 19334/19335)
export const deck = { key: 'nxj-19-1', code: 'NXJ 19.1', title: 'Why test, and the three kinds of test', sub: 'Chapter 19 · Lesson 19.1' };
const O = (k) => { const v = DU_LIEU[`n19-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (khoi, dau) => { const l = O(khoi).split('\n'); const i = l.findIndex((x) => x.startsWith('$ ') && x.includes(dau)); if (i < 0) throw new Error('thiếu lệnh ' + dau); const r = []; for (let j = i + 1; j < l.length && !l[j].startsWith('$ '); j++) r.push(l[j]); return r; };
const so = (s, re) => { const m = s.match(re); if (!m) throw new Error('không khớp ' + re + ' trong ' + s); return +m[1]; };
const tim = (ds, re) => { const l = ds.find((x) => re.test(x)); if (!l) throw new Error('thiếu dòng ' + re); return l; };
const U = doan('do', 'cart.test.ts'), K = doan('do', 'Cart.test.tsx'), E = doan('do', 'playwright test');
const U2 = doan('sua', 'cart.test.ts'), K2 = doan('sua', 'Cart.test.tsx'), E2 = doan('sua', 'playwright test');
const T_U = so(tim(U, /×/), /(\d+)ms/), T_K = so(tim(K, /×/), /(\d+)ms/), T_E = so(tim(E, /✘/), /\(([\d.]+)s\)/);
const T_E2 = so(tim(E2, /✓/), /\((\d+)ms\)/), RUN_U = so(tim(U2, /Duration/), /Duration\s+(\d+)ms/), RUN_K = so(tim(K2, /Duration/), /Duration\s+(\d+)ms/), RUN_E = so(tim(E2, /passed \(/), /passed \(([\d.]+)s\)/);
const IMPL1 = doan('impl', 'npx vitest run src/app/gio'), IMPL2 = O('impl').split('\n').slice(-3);
const KHO = O('kho').split('\n').filter((l) => !l.startsWith('$ '));
const N = (re) => so(tim(KHO, re), re);
if (!/return sum - discountPct;/.test(O('file:src/lib/cart.ts')) && !/Math\.round/.test(O('file:src/lib/cart.ts'))) throw new Error('mã lab đổi');
const H_BUG = "// lib/cart.ts — the cart total with a % discount\nexport function total(items: Item[], discountPct = 0) {\n  const sum = items.reduce((s, x) => s + x.price * x.qty, 0);\n  return sum - discountPct;   // BUG: 10 means 10%, not 10₫\n}";
const H_U = "// UNIT — lib/cart.test.ts\nexpect(total([{ name: 'Notebook', price: 100000, qty: 2 }], 10))\n  .toBe(180000);";
const H_K = "// COMPONENT — app/gio/Cart.test.tsx\nrender(<Cart />);\nawait userEvent.click(\n  screen.getByRole('button', { name: 'Apply 10% off' }));\nexpect(screen.getByText('Total: 180.000₫'))\n  .toBeInTheDocument();";
const H_E = "// END-TO-END — e2e/gio.spec.ts\nawait page.goto('/gio');\nawait page.getByRole('button', { name: 'Apply 10% off' })\n  .click();\nawait expect(page.getByText('Total: 180.000₫'))\n  .toBeVisible();";
const H_IMPL = "// TRAP — checks HOW it is drawn\nexpect(container.querySelector('.text-emerald-700'))\n  .not.toBeNull();\n\n// a refactor: same green, another class\n<p className=\"text-green-700\">Total: …</p>";
const K_ = (n) => n.toLocaleString('en-US');
// tháp: rộng đáy, hẹp đỉnh — mỗi tầng ghi số đo thật
const thap = () => {
  const T = [['End-to-end', `${T_E2} ms per test · +server +browser`, '#dc2626', 300], ['Component', `${T_K} ms per test · fake DOM`, '#ea580c', 520], ['Unit', `${T_U} ms per test · one function`, '#16a34a', 740]];
  let s = '<svg viewBox="0 0 760 330" width="760" height="330" font-family="Arial">';
  T.forEach(([t, g, m, w], i) => { const y = 10 + i * 106, x = (760 - w) / 2; s += `<rect x="${x}" y="${y}" width="${w}" height="96" rx="12" fill="${m}18" stroke="${m}" stroke-width="3"/><text x="380" y="${y + 42}" text-anchor="middle" font-size="26" font-weight="800" fill="${m}">${t}</text><text x="380" y="${y + 74}" text-anchor="middle" font-size="19" fill="#334155">${g}</text>`; });
  return s + '</svg>';
};

export const S = [
  { cover: true, nhan: 'Chapter 19 · Lesson 19.1', t: 'Why test, and the<br>three kinds of test', sub: 'One real bug in a cart, caught three ways — unit, component, end-to-end — with the time each one took',
    en: 'Lesson nineteen point one: why test, and the three kinds of test. One real bug in a shopping cart, caught three ways, with the time each one took.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A test is code that runs your code and checks one thing — automatically, forever</li>
    <li>One bug (<b>199.990₫</b> instead of <b>180.000₫</b>) caught by a unit, a component and an end-to-end test</li>
    <li>Speed: <b>${T_U} ms</b> · <b>${T_K} ms</b> · <b>${T_E2} ms</b> (+ a built server) — hence the pyramid</li>
    <li>What each failure <i>tells</i> you: the exact number, the missing text, “not found after 5 s”</li>
    <li>The trap: a test of <i>how</i> it is drawn breaks on a harmless refactor</li></ul>`,
    en: `Five takeaways. A test is code that runs your code and checks one thing. One bug, caught by three kinds of test. Their speed: ${T_U}, ${T_K} and ${T_E2} milliseconds, plus a server. What each failure tells you. And the trap of testing how something is drawn.` },
  { t: 'A test is a smoke alarm you write once', body: icards([
      ['check', 'Code that checks code', 'Run the real function or page with a known input, compare with the answer you expect. Green or red.'],
      ['refresh', 'Confidence to change', 'Refactor, add a feature, upgrade a library — the alarm tells you in seconds if something old broke.'],
      ['zap', 'Caught early = cheap', 'Red on your machine costs a minute. The same bug found by a customer costs money and trust.'],
      ['book', 'Living documentation', '“applies a percentage discount” — a sentence about the code that a machine re-checks on every run.'],
    ], 2),
    en: 'A test is like a smoke alarm you install once. It runs your real code with a known input and compares the answer. It gives you confidence to change code, it catches bugs early when they are cheap, and its name documents what the code should do.' },
  { t: 'The bug: 10% off, and the total went DOWN by 10₫', body: D(two(br('nxj-19-1', 'gio', { url: '127.0.0.1:3000/gio', vp: 640, h: 150, w: 640, mark: [[24, 102, 180, 24, '']] }),
      D(box('It compiles, it builds, it renders', '<code>tsc</code>: 0 errors · <code>next build</code>: ✓ Compiled · the page looks fine. Only the number is wrong.', 'do2'),
        box('Who notices?', 'Not TypeScript — <code>sum - 10</code> is a perfectly good number. A person who checks the bill, or a test.', 'lam')), 'r64'),
      tsx(H_BUG, { hl: [4] })),
    en: 'The bug. Two notebooks at a hundred thousand dong, a ten percent coupon. The page shows a hundred and ninety-nine thousand nine hundred and ninety, because the code subtracts ten dong instead of ten percent. It compiles, builds and renders. Only a person who checks the bill, or a test, notices.' },
  { t: 'Three kinds of test, the same bug', body: two(D(tsx(H_U, { sm: true }), tsx(H_K, { sm: true }), tsx(H_E, { sm: true })),
    D(tn([tim(U, /×/).trim(), ...U.filter((l) => /^[-+] \d/.test(l))].join('\n'), { fs: 14, wrap: 52, title: 'unit · vitest (real)' }),
      tn([tim(K, /×/).trim(), 'Unable to find an element with the text:', '  Total: 180.000₫'].join('\n'), { fs: 14, wrap: 52, title: 'component · vitest + jsdom (real)' }),
      tn([tim(E, /✘/).trim().replace(/^✘\s+1 \[chromium\] › /, '✘ '), ...E.filter((l) => /Timeout:|element\(s\)/.test(l)).map((l) => l.trim())].join('\n'), { fs: 14, wrap: 52, title: 'end-to-end · Playwright, Chromium (real)' })), 'r64'),
    en: 'Three kinds of test catch the same bug. The unit test calls the function: expected a hundred and eighty thousand, received a hundred and ninety-nine thousand nine hundred and ninety. The component test renders the cart in a fake page and clicks: the text is not there. The end-to-end test drives a real browser: element not found after five seconds.' },
  { t: 'Speed — and what each red tells you', body: two(D(meter([['unit (one function)', T_U, '#16a34a'], ['component (fake DOM)', T_K, '#ea580c'], ['end-to-end, green (real browser)', T_E2, '#dc2626'], ['end-to-end, red (waits 5 s)', Math.round(T_E * 1000), '#7f1d1d']], { don: 'ms', w: 560, nhan: 300, fs: 16 }),
      box('Whole runs, green (Mac of the course)', `unit file ${K_(RUN_U)} ms · component file ${K_(RUN_K)} ms · end-to-end ${RUN_E} s <i>after</i> <code>next build</code> + <code>next start</code>`, 'lam')),
    D(box('Unit: the exact place', '“expected 180000, got 199990” — you know which function and which number.', 'xanh'),
      box('Component: what the user would miss', '“no text Total: 180.000₫” — you know the screen is wrong, not why.', ''),
      box('End-to-end: the journey is broken', '“not found after 5000 ms” — somewhere, between server and browser, it fails.', 'do2')), 'r46'),
    en: `Speed, and what each red tells you. The unit test took ${T_U} milliseconds and points at the exact number. The component test took ${T_K} and says the screen is wrong. The end-to-end test needs a built app and a real browser: ${T_E2} milliseconds when green, five seconds when red, and it only says the journey is broken.` },
  { t: 'The testing pyramid', to: true, body: two(D(thap()),
    D(box('Many at the bottom', 'Unit tests are cheap and precise: write lots, for every tricky function (19.2).', 'xanh'),
      box('Some in the middle', 'Component tests for screens with behaviour: empty, error, disabled (19.3).', ''),
      box('A few at the top', 'End-to-end for the money paths: sign up, log in, pay (19.4).', 'do2')), 'r64'),
    en: 'That is why tests are drawn as a pyramid. Many cheap, precise unit tests at the bottom. Some component tests in the middle, for screens with behaviour. A few slow end-to-end tests at the top, for the paths that make money: sign up, log in, pay.' },
  { t: 'Fix one line — all three turn green', body: two(D(tsx("// lib/cart.ts — FIXED\nreturn Math.round((sum * (100 - discountPct)) / 100);", { hl: [2] }),
      tn([...U2, ...K2, ...E2].filter((l) => /Tests|passed|✓/.test(l)).map((l) => l.trim()).join('\n'), { fs: 15, wrap: 56, title: 'the same three runs, after the fix (real)' })),
    D(box('Now they guard the fix', 'If someone “simplifies” the line back next year, the unit test fails in milliseconds — before any user sees 199.990₫.', 'xanh'),
      box('A regression test', 'A test written for a bug you fixed. It stops that exact bug from coming back.', 'lam')), 'r64'),
    en: 'Fix one line: multiply by one hundred minus the percent, divide by a hundred. All three turn green. From now on they guard the fix: if someone breaks it again, the unit test fails in milliseconds. A test written for a fixed bug is called a regression test.' },
  { t: 'The trap: testing HOW it is drawn', body: two(D(tsx(H_IMPL, { hl: [2, 6] })),
    D(tn([...IMPL1, '— after renaming the class —', ...IMPL2.filter((l) => !l.startsWith('$ '))].map((l) => l.trim()).join('\n'), { fs: 15, wrap: 52, title: 'vitest src/app/gio (real)' }),
      box('Red, but nothing is broken', 'Same colour, same total, same button — the app works. The class-name test fails; the behaviour test (the text the user reads) stays green.', 'do2'),
      box('Assert what a user notices', 'Text on screen, the request sent, the value returned. A good test survives a rewrite of the code it tests.', 'xanh')), 'r46'),
    en: 'The trap: a test that checks how the total is drawn, by its class name. Rename the class during a refactor: same green, same total. The class-name test turns red although nothing is broken, while the behaviour test stays green. Assert what a user would notice.' },
  { t: 'cuongthai.com: how this course’s own repo tests', body: two(D(tn(KHO.join('\n'), { fs: 13, wrap: 70, title: 'api-backend (real, 14/11/2026)' })),
    D(box('Backend: many unit tests', `${N(/: (\d+) tệp/)} <code>*.test.ts</code> files with Node’s built-in runner (<code>tsx --test</code>); ${N(/CSDL: (\d+)/)} of them need a real database (<code>WORK_DB_TEST=1</code>).`, 'xanh'),
      box('Frontend: logic yes, components no', `${N(/frontend\/src \*\.test\.ts: (\d+)/)} logic tests, <b>${N(/component\): (\d+)/)}</b> component tests, ${N(/spec\.ts: (\d+)/)} end-to-end specs. The pyramid has a hole in the middle.`, 'do2')), 'r64'),
    en: 'This course’s own repository. The backend has hundreds of unit test files run by Node’s built-in test runner, some needing a real database. The frontend has logic tests and end-to-end specs, but zero component tests: the pyramid has a hole in the middle.' },
  { t: 'Not learning in a vacuum: real life, what if, the attacker', to: true, body: thucTe4({
      doi: ['🧾', 'The bill nobody re-checks', ['a coupon, a tax, a shipping fee', 'one wrong sign ships to every customer']],
      neu: ['❓', 'What if the test runs only “sometimes”?', ['a red test everybody ignores', 'teaches the team that red means nothing']],
      xau: ['🕵️', 'Attackers test your edges', ['coupon = 100? −5? 10 twice?', 'price logic without tests is a gift']],
      phong: ['🛡️', 'Test the money paths', ['unit-test every price rule + its edges', 'one e2e test for checkout, on every PR']],
    }),
    en: 'Real life: a bill nobody re-checks; one wrong sign in a discount ships to every customer. What if the tests run only sometimes? A red test that everyone ignores teaches the team that red means nothing. Attackers test your edges: a coupon of a hundred, minus five, applied twice. Unit-test every price rule and its edges, and keep one end-to-end test for checkout.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Test', 'code that checks code'), kw('Assertion', 'expect(x).toBe(y)'), kw('Unit test', 'one function, milliseconds'), kw('Component test', 'render + act like a user'),
      kw('End-to-end (E2E)', 'real browser, built app'), kw('Testing pyramid', 'many unit, few E2E'), kw('Regression test', 'keeps a fixed bug fixed'), kw('Implementation detail', 'class names, internal state'),
      kw('Behaviour', 'what a user notices'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: test; assertion; unit test; component test; end-to-end test; the testing pyramid; regression test; implementation detail; and behaviour.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Pick one price/date/validation function; write ${c('expect(...).toBe(...)')} for it`,
      'Break it on purpose — watch the test go red, then fix it',
      'Name one journey that must never break; that is your first E2E test',
      'Look for a test that checks a class name or internal state — rewrite it',
    ]), box('Keep these', `<ul><li>Unit: many, fast, precise</li><li>Component: some, like a user</li><li>E2E: few, the money paths</li><li>Test behaviour, not drawing</li></ul>`, 'lam'), ''),
    en: 'Your turn: pick one function with real logic and write an assertion for it; break it on purpose and watch the test turn red; name one journey that must never break; and find a test that checks a class name, and rewrite it.' },
];
export const slides = lamDeck({ chuong: 'Chapter 19 — Testing: catching bugs before your users do', bai: '19.1' }, S);
