/** Web Foundations · deck bài 6.4 — Header và JSON. Output thật: _demo/_t6 (curl: 415/201/CSV/304; Chromium + CDP: 304 mà JS thấy 200), _demo/6-4/json.js. */
import { deckWf, js, con, term, box, two, tbl, steps, OUT } from './_wf-bai.mjs';

const doan = (key, ...n) => { const p = OUT[key].split(/\n+(?=\$ )/); return n.map((i) => p[i].trim()).join('\n\n'); };

export const deck = { key: 'wf-6-4', code: 'WF 6.4', title: 'Headers and JSON', sub: 'Web Foundations · Chapter 6' };

export const slides = deckWf({ chuong: 'Chapter 6 — HTTP & APIs', bai: '6.4' }, [
  { cover: true, t: 'Headers and JSON', sub: 'What describes the message, and what the message carries' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Read the headers that <b>matter</b></li>
    <li>Set <b>Content-Type</b>, <b>Accept</b>, <b>Authorization</b></li>
    <li>Explain <b>ETag → 304</b></li>
    <li>Predict what <b>JSON</b> keeps — and drops</li>
    <li>Recognise <b>Unexpected token '&lt;'</b></li></ul>` },

  { t: 'Content-Type describes the body', giua: true, body: term(null, doan('_t6/out/headers', 3, 4), { title: 'same JSON, with and without the header' }) + box('Trap', '<code class="i">fetch(url, { method: \'POST\', body: JSON.stringify(x) })</code> sends <b>text/plain</b>: 415, or an empty <code class="i">req.body</code> in Express.', 'bad') },

  { t: 'Accept asks for a format', giua: true, body: two(term(null, doan('_t6/out/headers', 2), { title: 'curl -H "Accept: text/csv"' }), box('Content negotiation', 'One resource, several representations. Read <b>Content-Type</b> to know what you got; no match → 406.', 'info'), 'r64') },

  { t: 'ETag and 304', giua: true, body: two(term(null, doan('_t6/out/headers', 0, 1), { title: 'curl -i' }), con('_t6/out/etag-browser', null, { title: 'Chromium + DevTools Protocol' }), 'r55') + box('The browser does it for you', 'It sends If-None-Match itself; the network says 304, your JavaScript sees a full 200 from cache.', 'ok') },

  { t: 'JSON on the wire', giua: true, body: two(js('6-4/json.js', null, { gon: true, chi: [2, 17] }), con('6-4/json', null, { title: 'Chromium' }), 'r64') },

  { t: 'What survives JSON', to: true, giua: true, body: tbl(['Value', 'After stringify → parse'], [
      ['string · number · boolean · null · array · object', 'same'],
      ['undefined · function', 'property removed'],
      ['NaN · Infinity', 'null'],
      ['Date', 'ISO string (stays a string)'],
      ['Map · Set', '{}'],
      ['integer > 2^53 − 1', 'rounded — send as string'],
    ]) + box('Unexpected token \'&lt;\'', 'You called res.json() on an HTML page (404, 502, login). Check res.ok and Content-Type first.', 'bad') },

  { t: 'The headers you will set', to: true, giua: true, body: steps([
      '<b>Client</b>: Content-Type (with a body) · Accept · Authorization',
      '<b>Server</b>: Content-Type · Location · Cache-Control · ETag · Set-Cookie',
      '<b>Browser only</b>: Host · Cookie · Content-Length · Origin',
    ]) + tbl(['Cache-Control', 'Means'], [['no-store', 'never keep'], ['no-cache', 'keep, revalidate each time'], ['max-age=600', 'reuse 10 min without asking']]) },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Content-Type = how to read this body</li>
    <li>Accept = what I would like back</li>
    <li>ETag + If-None-Match → 304</li>
    <li>JSON drops undefined, dates become strings</li></ul>`,
    box('Practice (30 min)', 'POST with no / wrong / right Content-Type; CSV vs JSON; 304 before and 200 after a PATCH; fix a fetch.<br><br><b>Done when</b>: 415, 415, 201 — and your fixed fetch returns a Location.', 'ok')) },
]);
