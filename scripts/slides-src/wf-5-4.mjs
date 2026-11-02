/** Web Foundations · deck bài 5.4 — fetch và API. Output + ảnh thật: _demo/5-4 (Chromium), _t5/out (API Node thật). */
import { deckWf, js, con, term, anh, box, two, tbl, steps, CODE, OUT } from './_wf-bai.mjs';

export const deck = { key: 'wf-5-4', code: 'WF 5.4', title: 'fetch and APIs', sub: 'Web Foundations · Chapter 5' };
const OUT_POST = OUT['_t5/out/fetch-post'].split('\n').slice(0, 3).join('\n') + '\n──\n' + OUT['_t5/out/fetch-post-server'];
const OUT_TIME = OUT['_t5/out/fetch-post'].split('\n').slice(4).join('\n');
const cat = (k, a, b) => CODE[k].split('\n').slice(a - 1, b).join('\n');

export const slides = deckWf({ chuong: 'Chapter 5 — Asynchronous JavaScript', bai: '5.4' }, [
  { cover: true, t: 'fetch and APIs', sub: 'Asking a server for data — and handling every possible answer' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Load JSON with <b>fetch</b></li>
    <li>Read the <b>status</b> and the <b>body</b></li>
    <li>Treat <b>HTTP errors</b> as errors (res.ok)</li>
    <li>Show <b>loading, empty, error</b> states</li>
    <li>Send data with <b>POST</b>, and set a <b>timeout</b></li></ul>` },

  { t: 'Two awaits', giua: true, body: `${js(null, cat('5-4/fetch-co-ban.html', 7, 14), { gon: true })}
    ${two(con('5-4/fetch-co-ban'), steps(['await fetch ⇒ status + headers', 'await res.json() ⇒ the body', 'read the body only once']))}` },

  { t: 'fetch does not throw on 404', giua: true, body: `${con('5-4/fetch-loi')}
    ${tbl(['Failure', 'Promise', 'You see'], [['404 / 500', 'RESOLVES', 'res.ok === false'], ['error page as JSON', '—', 'SyntaxError'], ['no server / CORS', 'rejects', 'TypeError: Failed to fetch']])}
    ${box('Always', '<code class="i">if (!res.ok) throw new Error(\'HTTP \' + res.status);</code>', 'ok')}` },

  { t: 'The four states of loading', giua: true, body: `${js(null, cat('5-4/tai-du-lieu.html', 13, 27), { gon: true })}
    ${two(anh('5-4/tai-du-lieu.png', { w: 380 }), steps(['Loading', 'Success', 'Empty', 'Error']))}` },

  { t: 'Sending data with POST', giua: true, body: `${js(null, `await fetch('/api/todos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Write the report' }),
});`, { gon: false })}
    ${term(null, OUT_POST, { title: 'browser (top) · what the Node server received (bottom)' })}` },

  { t: 'Timeouts', to: true, giua: true, body: `${js(null, `await fetch('/api/slow', { signal: AbortSignal.timeout(500) });`, { gon: false })}
    ${con(null, OUT_TIME)}
    ${box('Without a signal', 'fetch waits as long as the network allows — sometimes minutes. Show a message instead of spinning for ever.', 'bad')}` },

  { t: 'A small API helper', giua: true, body: `${js(null, `async function api(path, { method = 'GET', body, timeout = 8000 } = {}) {
  const res = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(timeout),
  });
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error ?? 'HTTP ' + res.status);
  return data;
}`, { gon: false })}
    ${box('One place for the rules', 'JSON in, ok checked, the server’s message used, a timeout. axios does the same.', 'ok')}` },

  { t: 'Watch it in the Network tab', to: true, giua: true, body: steps([
      'Filter <b>Fetch/XHR</b>',
      '<b>Headers</b> · <b>Payload</b> · <b>Response</b> · <b>Timing</b>',
      'Right-click ⇒ <b>Copy as fetch / cURL</b>',
      '<b>Throttling</b> and <b>Offline</b> to test loading and error states',
    ]) + box('Server says a field is missing?', 'Check the request <b>Content-Type</b> and <b>Payload</b> first.', 'info') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Two awaits</li>
    <li>Check res.ok yourself</li>
    <li>Four states</li>
    <li>JSON.stringify + Content-Type</li>
    <li>Timeouts; one api() helper</li></ul>`,
    box('Practice (40 min)', 'A page on JSONPlaceholder with all four states, a POST form and a 5 s timeout.<br><br><b>Done when</b>: Offline shows your error message, the POST shows 201, and 999999 shows “not found”, not “undefined”.', 'ok')) },
]);
