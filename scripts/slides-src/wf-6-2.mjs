/** Web Foundations · deck bài 6.2 — HTTP method. Output thật: _demo/_t6 (curl → API Node; Chromium: prefetch, form method="put"). */
import { deckWf, js, term, box, two, tbl, OUT } from './_wf-bai.mjs';

const doan = (key, ...n) => { const p = OUT[key].split(/\n+(?=\$ )/); return n.map((i) => p[i].trim()).join('\n\n'); };

export const deck = { key: 'wf-6-2', code: 'WF 6.2', title: 'HTTP methods', sub: 'Web Foundations · Chapter 6' };

export const slides = deckWf({ chuong: 'Chapter 6 — HTTP & APIs', bai: '6.2' }, [
  { cover: true, t: 'HTTP methods', sub: 'GET, POST, PUT, PATCH, DELETE — and what each one promises' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Pick the right <b>method</b> for an action</li>
    <li>Predict what happens when a request is <b>sent twice</b></li>
    <li>Explain <b>PUT vs PATCH</b> from real output</li>
    <li>Avoid a <b>GET that changes data</b></li>
    <li>Know which methods an <b>HTML form</b> can send</li></ul>` },

  { t: 'One address, many actions', to: true, giua: true, body: tbl(['Method + path', 'Action', 'Success'], [
      ['GET /api/products', 'list', '200'],
      ['POST /api/products', 'create', '201 + Location'],
      ['GET /api/products/2', 'read one', '200'],
      ['PUT /api/products/2', 'replace', '200'],
      ['PATCH /api/products/2', 'change some fields', '200'],
      ['DELETE /api/products/2', 'delete', '204'],
    ]) + box('Rule', 'The path names the <b>thing</b>; the method names the <b>action</b>.', 'ok') },

  { t: 'POST twice, two products', giua: true, body: term(null, doan('_t6/out/methods', 1, 2), { title: 'curl' }) + two(box('Not idempotent', 'Same request, two records: id 6 and id 7.', 'bad'), box('So', 'Disable the button after one click; never auto-retry a POST; payment APIs use an idempotency key.', 'info')) },

  { t: 'PUT replaces, PATCH changes', giua: true, body: term(null, doan('_t6/out/methods', 3, 4, 5), { title: 'curl · product 2 was category "home"' }) + two(box('PATCH', '<code class="i">{ ...old, ...body }</code> — category stays <b>home</b>.', 'ok'), box('PUT', 'body becomes the product — category lost, back to <b>other</b>. Same result when repeated.', 'bad')) },

  { t: 'Safe and idempotent', giua: true, body: two(tbl(['Method', 'Safe', 'Idempotent'], [
      ['GET · HEAD · OPTIONS', '✅', '✅'], ['PUT', '❌', '✅'], ['DELETE', '❌', '✅'], ['POST', '❌', '❌'], ['PATCH', '❌', 'not guaranteed'],
    ]), term(null, doan('_t6/out/methods', 6, 7), { title: 'DELETE twice' }) + box('Idempotent', 'Same <b>state</b> after repeats — not the same response.', 'info'), 'r55') },

  { t: 'A GET that deletes (real Chromium)', giua: true, body: term('_t6/out/prefetch', null, { title: 'page with <link rel="prefetch" href="/notes/1/delete">' }) + box('Nobody clicked', 'Prefetch, crawlers, link previews and scanners all send GETs on their own. Anything that changes data must be POST / PUT / PATCH / DELETE.', 'bad') },

  { t: 'Forms speak only GET and POST', giua: true, body: term('_t6/out/form-put', null, { title: 'Chromium' }) + two(box('Silent fallback', '<code class="i">method="put"</code> is not an error: it becomes GET and the fields go into the URL.', 'bad'), box('Instead', '<code class="i">fetch(url, { method: \'PATCH\', … })</code>, or a server convention like <code class="i">_method</code>.', 'ok')) },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>POST creates every time</li>
    <li>PUT = whole resource, PATCH = changes</li>
    <li>405 + Allow lists what is supported</li>
    <li>GET must never change data</li></ul>`,
    box('Practice (30 min)', 'Predict, then send POST ×2, PATCH, PUT, DELETE ×2 and a 405; replace a delete link with a button + fetch.<br><br><b>Done when</b>: 6 of 8 predictions right and the 405 lists <code class="i">GET, HEAD, POST</code>.', 'ok')) },
]);
