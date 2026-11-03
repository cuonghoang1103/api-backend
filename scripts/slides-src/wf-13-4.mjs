/** Web Foundations · deck bài 13.4 — Giả lập (mock) và chạy test trong CI. */
import { deckWf, js, bash, term, box, two, steps, tbl, vsd, flow, OUT } from './_wf-bai.mjs';

export const deck = { key: 'wf-13-4', code: 'WF 13.4', title: 'Mocking & tests in CI', sub: 'Web Foundations · Chapter 13' };

const yaml = (k) => bash(k, null, { gon: false });

export const slides = deckWf({ chuong: 'Chapter 13 — Testing', bai: '13.4' }, [
  { cover: true, t: 'Mocking & tests in CI', sub: 'Tests must not depend on the internet or the clock — and they must run on every push, not when someone remembers' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Replace <b>fetch</b> with a fake so tests are fast and repeatable</li>
    <li>Test the <b>sad paths</b>: server 500, network down</li>
    <li>Control <b>time</b> with fake timers (debounce, "good morning")</li>
    <li>Check calls with <code class="i">vi.fn</code>: how many, with what</li>
    <li>Run the suite on every push with <b>GitHub Actions</b></li></ul>` },

  { t: 'Why not call the real API in tests?', to: true, giua: true, body: tbl(['Problem', 'What happens'], [
      ['Slow', 'every test waits for the network'],
      ['Flaky', 'Wi-Fi drops ⇒ red for no code reason'],
      ['Unrepeatable', 'the temperature changes every hour'],
      ['Untestable sad paths', 'you cannot make the real server return 500 on demand'],
    ]) + box('The fix', 'Make the dependency a <b>parameter</b>, and give the test a fake that answers exactly what the test needs.', 'ok') },

  { t: 'Code that can be tested', giua: true, body: `${js('_t13/src/weather.js')}
    ${box('Dependency injection, the simple way', '<code class="i">fetchFn = fetch</code>: real code uses the real fetch; a test passes its own function. No library needed.', 'info')}` },

  { t: 'A fake fetch with vi.fn', body: js('_t13/test/weather.test.js') },

  { t: 'Happy path, server error, network error', giua: true, body: `${term(null, OUT['_t13/out/mock-time'].split('\n').filter((l) => /weather.test/.test(l)).join('\n'), { title: 'npx vitest run --reporter=verbose test/weather.test.js' })}
    ${steps(['<code class="i">mockResolvedValue</code> ⇒ the fake fetch succeeds', '<code class="i">mockRejectedValue</code> ⇒ it fails like a dropped connection', '<code class="i">toHaveBeenCalledWith</code> ⇒ the URL was encoded correctly'])}` },

  { t: 'Controlling time: fake timers', body: `${js('_t13/test/time.test.js', null, { chi: [4, 18] })}
    ${two(js('_t13/src/search.js', null, { chi: [2, 8] }), box('', '<code class="i">advanceTimersByTime(299)</code> ⇒ nothing yet; one more ms ⇒ exactly one search, for "java". No real waiting.', 'ok'), 'r64')}` },

  { t: 'The whole suite: one command, one exit code', giua: true, body: `${term('_t13/out/all', null, { title: 'npx vitest run; echo "exit code: $?"' })}
    ${term('_t13/out/exit-red', null, { title: 'the same command when a test fails' })}
    ${box('Exit code', '0 = all green, 1 = something red. CI tools only look at this number.', 'info')}` },

  { t: 'CI: run the tests on every push', body: two(yaml('_t13/.github/workflows/test.yml'), flow([{ t: 'push / PR', s: 'to GitHub' }, { t: 'runner', s: 'fresh Linux VM', mau: '#2f7d4f' }, { t: 'npm ci', s: 'exact versions' }, { t: 'vitest run', s: 'exit 0 or 1', mau: '#b85a2b' }], { w: 520, h: 300, fs: 15 }), 'hai') },

  { t: 'Check the workflow before you push', giua: true, body: `${term('_t13/out/actionlint-ok', null, { title: 'actionlint .github/workflows/test.yml' })}
    ${term('_t13/out/actionlint-broken', null, { title: 'actionlint demo/wf/broken.yml   (a typo: run-on)' })}` },

  { t: 'Mocking traps', to: true, giua: true, body: vsd('<ul><li>Mocking the function you are testing</li><li>A fake that returns what the real API never does</li><li>Forgetting <code class="i">useRealTimers()</code> — the next file hangs</li></ul>', '<ul><li>Mock only the boundary (network, clock)</li><li>Copy the fake reply from a real response</li><li>Reset in <code class="i">afterEach</code></li></ul>', '✗ Tests that lie', '✓ Tests you can trust') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Inject dependencies: <code class="i">fetchFn = fetch</code></li>
    <li><code class="i">vi.fn().mockResolvedValue / mockRejectedValue</code></li>
    <li>Fake timers for debounce and dates</li>
    <li>CI runs <code class="i">vitest run</code>; exit 1 blocks the merge</li></ul>`,
    box('Practice (25 min)', 'Write <code class="i">getUserName(id, fetchFn)</code> (404 ⇒ "Guest", 500 ⇒ throw) with three tests, then add the workflow file and run <code class="i">actionlint</code>.<br><br><b>Done when</b>: all three cases pass with no network, the fake was called with <code class="i">/api/users/7</code>, and actionlint prints nothing.', 'ok')) },
]);
