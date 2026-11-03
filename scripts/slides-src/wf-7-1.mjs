/** Web Foundations · deck bài 7.1 — Xác thực và phân quyền. Output thật: _demo/_t7 (app Node + curl). */
import { deckWf, js, term, box, two, tbl, steps, OUT } from './_wf-bai.mjs';

const doan = (key, ...n) => { const p = OUT[key].split(/\n+(?=\$ )/); return n.map((i) => p[i].trim()).join('\n\n'); };

export const deck = { key: 'wf-7-1', code: 'WF 7.1', title: 'Authentication and authorization', sub: 'Web Foundations · Chapter 7' };

export const slides = deckWf({ chuong: 'Chapter 7 — Authentication & security', bai: '7.1' }, [
  { cover: true, t: 'Authn and authz', sub: 'Who are you — and what are you allowed to do?' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Tell <b>authentication</b> from <b>authorization</b></li>
    <li>Explain why identity rides on <b>every request</b></li>
    <li>Name the four <b>carriers</b> of identity</li>
    <li>Choose <b>401</b> or <b>403</b></li>
    <li>Never trust a <b>role sent by the client</b></li></ul>` },

  { t: 'HTTP forgets you', giua: true, body: term('_t7/out/forgets', null, { title: 'curl' }) + box('Not a bug', 'curl did not keep the cookie. Proof of identity must travel with every request.', 'info') },

  { t: 'How identity travels', to: true, giua: true, body: tbl(['Carrier', 'Header', 'Typical use'], [
      ['Session cookie', 'Cookie: sid=…', 'websites (7.2)'],
      ['Bearer token', 'Authorization: Bearer eyJ…', 'APIs, mobile (7.3)'],
      ['HTTP Basic', 'Authorization: Basic …', 'internal tools only'],
      ['API key', 'X-API-Key / Bearer', 'program to program'],
    ]) + box('All of them', 'need HTTPS (7.5).', 'bad') },

  { t: 'Base64 is not encryption', giua: true, body: term('_t7/out/basic', null, { title: 'curl -v + base64' }) + box('Anyone on the path', 'can decode a Basic header — or a JWT payload. That is why HTTPS is not optional.', 'bad') },

  { t: '401 then 403', giua: true, body: js('_t7/app.mjs', null, { gon: true, chi: [66, 75] }) + two(term(null, doan('_t7/out/session', 3, 4), { title: 'An (user)' }), term('_t7/out/admin', null, { title: 'Lan (admin)' })) },

  { t: 'Never trust the client', to: true, giua: true, body: two(box('Role from the request', '<code class="i">req.body.role</code>, hidden fields, localStorage — all typed by the user. Read the role from the server\'s records.', 'bad'), box('Hidden button', 'curl has no buttons. Every rule the UI enforces must be checked again on the server.', 'bad')) + steps(['Find the user → <b>401</b>', 'Check the rule → <b>403</b>', 'Do the work (and check ownership)']) },

  { t: 'One message for both failures', giua: true, body: term(null, doan('_t7/out/session', 0, 1), { title: 'wrong password · unknown email' }) + box('Why', 'Different messages let anyone test which emails have accounts.', 'info') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>401 = who are you? · 403 = not allowed</li>
    <li>Identity on every request</li>
    <li>Base64 hides nothing</li>
    <li>Rules live on the server</li></ul>`,
    box('Practice (25 min)', 'Log in as An and Lan with curl cookie jars; call /api/me and the admin list; try sending a role yourself.<br><br><b>Done when</b>: 200/403, 200/200, 401/401 — and the extra role changes nothing.', 'ok')) },
]);
