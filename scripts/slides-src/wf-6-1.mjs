/** Web Foundations · deck bài 6.1 — Request và response. Output thật: _demo/_t6 (API Node + curl + raw.mjs), _demo/6-1 (URL trong Chromium). */
import { deckWf, js, con, term, box, two, tbl, steps } from './_wf-bai.mjs';

export const deck = { key: 'wf-6-1', code: 'WF 6.1', title: 'Request and response', sub: 'Web Foundations · Chapter 6' };

export const slides = deckWf({ chuong: 'Chapter 6 — HTTP & APIs', bai: '6.1' }, [
  { cover: true, t: 'Request and response', sub: 'The shape of every conversation between a browser and a server' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Name every part of a <b>URL</b></li>
    <li>Read a raw <b>request</b> and <b>response</b> line by line</li>
    <li>Send any request with <b>curl</b></li>
    <li>Explain why HTTP is <b>stateless</b></li>
    <li>Know what HTTP/2 and /3 change — and what they do not</li></ul>` },

  { t: 'HTTP is text', giua: true, body: two(js('_t6/raw.mjs', null, { gon: true, chi: [3, 8] }), term('_t6/out/raw', null, { title: 'node raw.mjs' }), 'r46') },

  { t: 'Anatomy of a request', to: true, giua: true, body: steps([
      '<b>Request line</b>: <code class="i">GET /api/products/3 HTTP/1.1</code>',
      '<b>Headers</b>: <code class="i">Name: value</code>, one per line — <code class="i">Host</code> is required',
      '<b>Empty line</b>: the headers are over',
      '<b>Body</b> (optional): JSON for a new product…',
    ]) + con('6-1/url', null, { title: 'new URL(…) in Chromium' }) },

  { t: 'Anatomy of a response', to: true, giua: true, body: tbl(['Part', 'Example', 'For'], [
      ['Status line', 'HTTP/1.1 200 OK', 'programs read the number'],
      ['Headers', 'Content-Type, ETag, Cache-Control', 'describe the body'],
      ['Empty line', '', 'end of headers'],
      ['Body', '{"id":3,"name":"Pen",…}', 'the data — or nothing (204, 304)'],
    ]) + box('Same shape both ways', 'Start line, headers, empty line, body. Once you see it, every tool output becomes readable.', 'ok') },

  { t: 'curl shows both sides', giua: true, body: two(term('_t6/out/http-v', null, { title: 'curl -v' }), term('_t6/out/server-log', null, { title: 'server log' }), 'r64') },

  { t: 'Stateless', to: true, giua: true, body: tbl(['The server needs…', 'So the request carries it in…'], [
      ['which resource', 'the path: /api/products/3'],
      ['which options', 'the query: ?sort=-price'],
      ['which format', 'headers: Accept, Content-Type'],
      ['who you are', 'a cookie or Authorization — every time'],
    ]) + box('Trap', 'A <code class="i">let currentUser</code> on the server works alone, then mixes users up with two. Per-user state goes with the request.', 'bad') },

  { t: 'HTTP/1.1, 2 and 3', to: true, giua: true, body: tbl(['Version', 'On the wire', 'Meaning'], [
      ['HTTP/1.1', 'text', 'method, path, headers, status, body'],
      ['HTTP/2', 'binary frames, one shared connection', 'identical'],
      ['HTTP/3', 'binary over QUIC (UDP)', 'identical'],
    ]) + box('Good news', 'Everything in this chapter works the same on all three.', 'ok') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Start line · headers · empty line · body</li>
    <li>curl -v shows both directions</li>
    <li>Test the API alone first</li>
    <li>Every request carries everything</li></ul>`,
    box('Practice (25 min)', 'Run the chapter server, label every line of <code class="i">curl -v</code>, ask for CSV, read a raw 404.<br><br><b>Done when</b>: you can point at both empty lines and name 3 headers the browser sends that curl does not.', 'ok')) },
]);
