/** Web Foundations · deck bài 6.3 — Mã trạng thái. Output thật: _demo/_t6 (14 mã bằng curl; fetch trong Chromium), _demo/6-3. */
import { deckWf, html, con, term, box, two, tbl, steps } from './_wf-bai.mjs';

export const deck = { key: 'wf-6-3', code: 'WF 6.3', title: 'Status codes', sub: 'Web Foundations · Chapter 6' };

export const slides = deckWf({ chuong: 'Chapter 6 — HTTP & APIs', bai: '6.3' }, [
  { cover: true, t: 'Status codes', sub: 'Three digits that decide what happens next' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Read any code by its <b>first digit</b></li>
    <li>Choose the right code for your API</li>
    <li>Tell apart <b>401/403</b> and <b>400/422</b></li>
    <li>Know when <b>fetch throws</b> — and when it does not</li>
    <li>Turn any outcome into a <b>message</b> for the user</li></ul>` },

  { t: 'Five families', to: true, giua: true, body: tbl(['First digit', 'Means', 'Send it again?'], [
      ['1xx', 'informational', '—'],
      ['2xx', 'it worked', '—'],
      ['3xx', 'look elsewhere / still fresh', 'follow Location'],
      ['4xx', 'the request was wrong', 'no — fix it first'],
      ['5xx', 'the server failed', 'maybe later'],
    ]) + two(box('Unknown code?', 'A client that has never seen <b>418</b> or <b>451</b> still knows: first digit 4 → client error.', 'info'), box('Programs read the number', 'The reason phrase ("Not Found") is only for humans — HTTP/2 does not even send it.', 'ok')) },

  { t: 'Fourteen real codes', giua: true, body: two(term('_t6/out/status-codes', null, { title: "curl -o /dev/null -w '%{http_code}'" }), box('Three kinds of success', '<b>200</b> data · <b>201</b> created (+ Location) · <b>204</b> nothing to return', 'ok') + box('One server error', 'Everything else here is the <b>client\'s</b> request being wrong.', 'info'), 'r64') },

  { t: '401 or 403, 400 or 422', to: true, giua: true, body: tbl(['Pair', 'First', 'Second'], [
      ['401 / 403', 'who are you? — log in', 'I know you, and no'],
      ['400 / 422', 'cannot read it: {oops', 'read it, values invalid'],
      ['404 / 405', 'nothing lives here', 'not with this method'],
      ['500 / 503', 'a bug threw', 'not serving right now'],
    ]) + box('Trap', '200 with <code class="i">{ "ok": false }</code> inside: res.ok is true, monitoring sees success, caches keep the error.', 'bad') },

  { t: 'The body explains the code', giua: true, body: term('_t6/out/status-bodies', null, { title: 'curl -i' }) },

  { t: 'What fetch sees (Chromium)', giua: true, body: con('_t6/out/fetch-status', null, { title: 'fetch() from a page' }) + two(box('Never throws for', 'redirects (followed), 4xx, 5xx — check <code class="i">res.ok</code>.', 'info'), box('Throws only', 'when there is <b>no response</b>: server down, offline, CORS.', 'bad')) },

  { t: 'One function for every outcome', giua: true, body: html('6-3/thong-bao.html', null, { gon: true, chi: [25, 33] }) + con('6-3/thong-bao') },

  { t: 'Summary & practice', to: true, giua: true, body: two(steps([
      'No response → "check your connection"',
      '2xx → use the body',
      '401 → log in again',
      'Other 4xx → show the server\'s reason',
      '429 / 5xx → try later',
    ]), box('Practice (30 min)', 'Produce all 14 codes with curl; add 409 and 503 messages; make <code class="i">/products/abc</code> a 400.<br><br><b>Done when</b>: 14 different codes in order and no "undefined" on screen.', 'ok')) },
]);
