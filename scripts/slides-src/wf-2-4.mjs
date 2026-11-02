/** Web Foundations · deck bài 2.4 — Biểu mẫu. Ảnh + output thật: _demo/2-4 (Chromium), _t2/out/form-may-chu (form thật → máy chủ Node thật). */
import { deckWf, html, con, term, anh, box, two, tbl, vsd } from './_wf-bai.mjs';

export const deck = { key: 'wf-2-4', code: 'WF 2.4', title: 'Forms', sub: 'Web Foundations · Chapter 2' };

export const slides = deckWf({ chuong: 'Chapter 2 — HTML', bai: '2.4' }, [
  { cover: true, t: 'Forms', sub: 'Where HTML, the network and the server meet — and exactly what the browser sends' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Build a form with the right <b>controls</b></li>
    <li>Say exactly which fields are <b>sent</b> and how</li>
    <li>Choose <b>GET or POST</b></li>
    <li>Connect every field to a <b>label</b></li>
    <li>Use built-in <b>validation</b> — and know its limit</li>
    <li>Stop a Cancel button from <b>submitting</b></li></ul>` },

  { t: 'The controls', giua: true, body: two(anh('2-4/cac-o-nhap.png', { w: 500 }), `${box('Type matters', 'The right <code class="i">type</code> gives the right widget, the right mobile keyboard, and free validation.', 'info')}
    ${con('2-4/cac-o-nhap', null, { title: 'what this form would send' })}`) },

  { t: 'No name, no data', giua: true, body: `${html('2-4/thieu-name.html', null, { chi: [6, 10] })}
    ${two(con('2-4/thieu-name', null, { title: 'FormData: what would be sent' }), tbl(['Field', 'Why'], [['email', 'id, but no name'], ['newsletter', 'unchecked: sends nothing'], ['agree', 'checked, no value: "on"'], ['city', 'disabled: not sent']]))}` },

  { t: 'What really reaches the server', giua: true, body: `${term('_t2/out/form-may-chu', null, { title: 'a real Node server recording what a real browser sent' })}
    ${two(box('GET', 'The data is in the <b>URL</b>. A space became <code class="i">+</code>.', 'info'), box('POST', 'The data is in the <b>body</b>, encoded: <code class="i">@</code> → <code class="i">%40</code>, <code class="i">&amp;</code> → <code class="i">%26</code>.', 'info'))}` },

  { t: 'GET or POST?', to: true, giua: true, body: `${tbl(['', 'GET', 'POST'], [
      ['Data goes in', 'the URL', 'the body'],
      ['For', 'reading: search, filter', 'changing: sign up, pay'],
      ['Bookmark', 'yes', 'no'],
      ['Reload', 'safe to repeat', 'browser warns'],
    ])}${box('Trap', 'The default is GET. Forget <code class="i">method="post"</code> on a login and the password lands in the URL: browser history, server logs. Only HTTPS encrypts it.', 'bad')}` },

  { t: 'Labels', to: true, giua: true, body: `${html('2-4/nhan-label.html', null, { chi: [5, 7] })}
    ${two(con('2-4/nhan-label'), box('Two ways', '<code class="i">for</code> + <code class="i">id</code>, or wrap the input inside the label. A placeholder is <b>not</b> a label.', 'ok'))}` },

  { t: 'Built-in validation', giua: true, body: `${html('2-4/kiem-hop-le.html', null, { chi: [6, 10] })}
    ${con('2-4/kiem-hop-le')}` },

  { t: 'A button submits by default', giua: true, body: `${html('2-4/nut-mac-dinh.html', null, { chi: [6, 9] })}
    ${two(con('2-4/nut-mac-dinh'), box('Always write the type', '<code class="i">type="button"</code> for actions, <code class="i">type="submit"</code> for sending.', 'ok'))}` },

  { t: 'Browser checks are not security', to: true, giua: true, body: `${tbl(['Layer', 'What it is'], [
      ['Browser validation', 'a convenience for honest users'],
      ['The network', 'anyone can send anything — curl needs no form'],
      ['Server validation', 'the real rule, on every request'],
    ])}${vsd('<ul><li>“required” protects my data</li><li>password type = encrypted</li></ul>', '<ul><li>Delete the attribute in DevTools: it goes through</li><li>Only HTTPS encrypts</li></ul>', '✗ Belief', '✓ Reality')}` },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Only enabled fields with a <b>name</b> are sent</li>
    <li>GET = URL · POST = body</li>
    <li>A label for every field</li>
    <li>Validation is free, and not security</li>
    <li><code class="i">type="button"</code> unless it submits</li></ul>`,
    box('Practice (30 min)', 'A sign-up form posting to a tiny Node server that prints the body.<br><br><b>Done when</b>: the server prints all your fields, an empty form is blocked, a 5-character password is refused, and <code class="i">checkValidity()</code> is true only when complete.', 'ok')) },
]);
