/**
 * tst-02-4 — Testing · Chapter 2 · Lesson 2.4 "Randomness, IDs and non-determinism" (01/11/2026). Slug: tst-2-4-ngau-nhien.
 * Output = chạy thật; demo2/chap-chon chạy 100 lượt: 86 xanh, 14 đỏ (lý thuyết 17%).
 */
import { lamDeck, js, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-02-4', code: 'TST 2.4', title: 'Randomness and IDs', sub: 'flaky tests and how to make them repeatable' };

const CODE = `// Short booking codes students can read aloud: no 0/O and no 1/I.
export const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function makeBookingCode(random = Math.random, length = 6) {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += ALPHABET[Math.floor(random() * ALPHABET.length)];
  }
  return 'LF-' + code;
}`;
const FLAKY = `it('20 short codes are all different', () => {
  const codes = Array.from({ length: 20 },
                           () => makeBookingCode(Math.random, 2)); // 2 letters
  expect(new Set(codes).size).toBe(20);
});`;
const FLAKY_OUT = ` FAIL  demo2/chap-chon.test.js > 20 short codes are all different
AssertionError: expected 19 to be 20 // Object.is equality`;
const INJECT = `expect(makeBookingCode(() => 0)).toBe('LF-AAAAAA');
expect(makeBookingCode(() => 0.999999)).toBe('LF-999999');

const random = seededRandom(42);         // same seed → same sequence
expect([makeBookingCode(random), makeBookingCode(random)])
  .toEqual(['LF-VQ5XFS', 'LF-JV5RH6']);`;
const SPY = `afterEach(() => {
  vi.restoreAllMocks();                  // put Math.random back
});

it('spy on Math.random when the code does not take a parameter', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.5);
  expect(makeBookingCode()).toBe('LF-' + ALPHABET[16].repeat(6)); // 'S'
});`;
const RORI = ` ❯ demo2/ro-ri.test.js (2 tests | 1 failed) 4ms
   ✓ A: Math.random mocked to 0 (and never restored) 1ms
   × B: two fresh codes are different 2ms

AssertionError: expected 'LF-AAAAAA' not to be 'LF-AAAAAA' // Object.is equality`;
const RORI_B = `$ npx vitest run demo2/ro-ri.test.js -t B
 ✓ demo2/ro-ri.test.js (2 tests | 1 skipped) 2ms
   ↓ A: Math.random mocked to 0 (and never restored)
   ✓ B: two fresh codes are different 1ms`;
const RECORD = `export function newBookingRecord(input,
  { newId = () => crypto.randomUUID(), now = () => new Date() } = {}) {
  return { id: newId(), code: makeBookingCode(),
           createdAt: now().toISOString(), ...input };
}

const record = newBookingRecord({ lab: 'BE-201', start: '08:00' },
  { newId: () => 'id-1', now: () => new Date('2026-11-16T01:00:00Z') });
expect(record).toEqual({
  id: 'id-1',
  code: expect.stringMatching(/^LF-/),   // still random: check the shape
  createdAt: '2026-11-16T01:00:00.000Z',
  lab: 'BE-201', start: '08:00',
});`;

export const slides = lamDeck({ chuong: 'Chapter 2 — Async code, time and errors', bai: '2.4' }, [
  { cover: true, t: 'Randomness, IDs<br>and non-determinism', sub: 'Chapter 2 · Lesson 2.4 — a flaky test measured, then made repeatable' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A flaky test, measured: 100 runs, 14 red, same code</li>
    <li>Three fixes: inject the randomness, seed it, or spy on ${c('Math.random')}</li>
    <li>The un-restored mock that breaks the <b>next</b> test</li>
    <li>IDs and timestamps as parameters — the whole record predictable</li>
    <li>When a value must stay random: assert its shape</li></ul>` },
  { t: 'LabFlow Lite booking codes', body: js(CODE, { hl: [4, 7] }) + box('A design choice already made', `${c('random')} is a parameter with ${c('Math.random')} as the default. Production calls ${c('makeBookingCode()')}; tests can pass their own generator.`, 'lam') },
  { t: 'A flaky test: same code, different results', body: js(FLAKY) + vt(FLAKY_OUT, { title: 'terminal — one of the red runs', fs: 15 }) +
    two(`<div style="font-size:22px;text-align:center"><div style="font-size:60px;font-weight:800;color:#c0392b;line-height:1.1">14 / 100</div><div>runs failed (measured, same code)</div><div class="nho">theory: 1 − ∏(1 − i/1024) for 20 codes ≈ 17%</div></div>`,
      box('Why it is so dangerous', 'It passed 86 times. On a red run a teammate re-runs it, it goes green, and everyone learns to ignore red. Chapter 8 hunts flaky tests in general.', 'do2')) },
  { t: 'Fix 1 and 2: inject the randomness, or seed it', body: js(INJECT, { hl: [4] }) + two(box('Inject', `${c('() => 0')} and ${c('() => 0.999999')} hit the first and last letter — the <b>boundaries</b> of the alphabet.`, 'xanh'), box('Seed', `${c('seededRandom(42)')} (mulberry32, 8 lines) produces random-looking but identical values on every run, on every machine.`, 'xanh')) },
  { t: 'Fix 3: spy on Math.random — and restore it', body: js(SPY, { hl: [2, 6] }) + box('When to use', `Only when you cannot change the code to accept a parameter. ${c('vi.spyOn')} replaces a method on a real object; ${c('vi.restoreAllMocks')} puts the original back.`, 'lam') },
  { t: 'The leak: a mock that is never restored', body: vt(RORI, { title: 'terminal — A then B, in one file', fs: 15 }) + vt(RORI_B, { title: 'terminal — B alone is green', fs: 15 }) +
    box('Order dependence', `Test B fails only when A runs first, because A left ${c('Math.random')} returning 0. Tests must be <b>isolated</b> (the I in F.I.R.S.T.).`, 'do2') +
    box('Safety net', `${c('restoreMocks: true')} in ${c('vitest.config.js')} restores every spy after each test automatically.`, 'xanh') },
  { t: 'IDs and clocks as parameters', body: js(RECORD, { sm: true, hl: [2, 8] }) + box('The whole record is predictable', `Fixed ${c('newId')} and ${c('now')} → exact ${c('toEqual')}. The code stays random, so the test checks its shape with ${c('expect.stringMatching')}.`, 'xanh') },
  { t: 'When the value must stay random: assert its shape', body: zm(`<table class="t"><tr><th>Value</th><th>Assert</th></tr>
    <tr><td>booking code</td><td>${c('toMatch(/^LF-[A-HJ-NP-Z2-9]{6}$/)')}</td></tr>
    <tr><td>UUID</td><td>${c('expect.stringMatching(/^[0-9a-f-]{36}$/)')}</td></tr>
    <tr><td>timestamp</td><td>${c('expect.any(String)')} — or freeze the clock (lesson 2.2)</td></tr>
    <tr><td>“all different”</td><td>a seeded generator, or a property with fast-check and a fixed seed</td></tr></table>`, 1.12) +
    box('Rule', 'A unit test must give the same answer every time. If it depends on chance, control the chance — never just re-run.', 'lam') },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `Make the 20-codes test deterministic with ${c('seededRandom(7)')}`,
      'Prove the same seed gives the same first code',
      `Add ${c('restoreMocks: true')} to a config and re-run the leak demo: A and B both green`,
      `Test ${c('newBookingRecord')} with a fixed id and clock`,
    ]) + box('Done when', `${c('demo2/th24.test.js')}: 2 passed on every run (try it ten times); ${c('ro-ri.test.js')} with ${c('--config demo2/vitest.restore.config.js')}: 2 passed.`, 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Randomness in a test makes it flaky: 14 failures in 100 runs, same code</li>
    <li>Inject the generator; use boundaries (0, 0.999999) and seeds</li>
    <li>${c('vi.spyOn(Math, …)')} only when you must — always restore</li>
    <li>Un-restored mocks create order-dependent failures</li>
    <li>IDs and clocks as parameters; check the shape of what stays random</li></ul>` },
]);
