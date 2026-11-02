/** Web Foundations · deck bài 0.2 — Web hoạt động thế nào. Output thật: _demo/0-2 (Chromium), _demo/_t0/out (dig, curl, Node 22). */
import { deckWf, js, html, con, term, anh, box, two, steps, tbl, vsd, OUT } from './_wf-bai.mjs';

export const deck = { key: 'wf-0-2', code: 'WF 0.2', title: 'How the web works', sub: 'Web Foundations · Section 0' };

const CV = OUT['_t0/out/curl-v'].split('\n');

export const slides = deckWf({ chuong: 'Section 0 — Getting started', bai: '0.2' }, [
  { cover: true, t: 'How the web works', sub: 'Five steps between pressing Enter and seeing the page — each one shown with a real tool' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Take a <b>URL</b> apart into its pieces</li>
    <li>Name the <b>five steps</b> of a page load</li>
    <li>Read a real HTTP <b>request</b> and <b>response</b></li>
    <li>Run a tiny <b>web server</b> and watch requests arrive</li>
    <li>Explain why one page is <b>many requests</b></li></ul>
    ${box('Why', 'Almost every later bug — a wrong link, a 404, a slow page, a cookie that “does not stick” — happens in one of these steps.', 'info')}` },

  { t: 'The journey in five steps', to: true, giua: true, body: steps([
      '<b>Read the URL</b> — protocol, host, path, query',
      '<b>DNS</b> — the name becomes an IP address',
      '<b>Connect + encrypt</b> — a connection, then TLS',
      '<b>Request → response</b> — text out, status + headers + body back',
      '<b>Render, then request more</b> — CSS, images, scripts',
    ]) },

  { t: 'Step 1: a URL has parts', giua: true, body: `${js(null, "const url = new URL('https://cuongthai.com:443/courses/web-foundations/learn?lessonSlug=wf-0-2&lang=vi#journey');\nconsole.log('protocol:', url.protocol);   // …and so on for each part", { gon: false })}
    ${two(con('0-2/url'), box('Remember', 'The <b>query</b> (?a=1) goes to the server. The <b>hash</b> (#top) never leaves the browser. <b>Origin</b> = protocol + host + port.', 'info'))}` },

  { t: 'Step 2: DNS — name → numbers', to: true, giua: true, body: two(term('_t0/out/dns', null, { title: 'terminal · real lookup' }), `${box('The internet’s contact list', 'Networks route by <b>IP address</b>. You remember the name; your computer asks a DNS server for the number.', 'info')}
    ${box('Two answers?', 'Two machines can serve the site. One breaks, the other still answers.', 'ok')}
    ${box('Cached', 'Answers are remembered for a <b>TTL</b>. A DNS change is not instant.', 'bad')}`) },

  { t: 'Step 3: connect, then encrypt', to: true, giua: true, body: `${term(null, CV.slice(0, 5).join('\n'), { title: 'curl -v https://example.com/' })}
    ${two(box('Port 443', 'The default “door” for https (80 for http).', 'info'), box('TLS 1.3', 'From here on, nobody in between — café Wi-Fi, ISP — can read or change the traffic. That is the padlock.', 'ok'))}` },

  { t: 'Step 4: request and response are text', giua: true, body: two(term(null, CV.slice(5).join('\n'), { title: 'curl -v — after the connection' }), tbl(['Line', 'Means'], [
      ['> GET / HTTP/2', 'method + path + version'],
      ['> Host, Accept…', 'request headers'],
      ['< HTTP/2 200', 'status code: OK'],
      ['< content-type', 'what the body is'],
      ['(then the body)', 'the HTML itself'],
    ]), 'r55') },

  { t: 'Be the server: 13 lines of Node.js', giua: true, body: `${js('_t0/web/server.mjs', null, { gon: true })}
    ${two(term(null, OUT['_t0/out/curl-local'].split('\n').filter((l) => /^\$|^HTTP|^<h1|^Not found/.test(l)).join('\n'), { title: 'curl -i (headers trimmed)' }), term('_t0/out/server-log', null, { title: 'the server’s own terminal' }))}` },

  { t: 'Step 5: render — and request more', giua: true, body: two(`${anh('0-2/mot-trang-nhieu-request.png', { w: 500 })}${box('', 'One heading, two pictures — <b>five</b> requests. Real sites make 50–300.', 'info')}`,
      `${con('0-2/mot-trang-nhieu-request')}
      ${box('Cache trap', 'CSS changed but nothing happens? Hard-reload: <b>Ctrl/Cmd+Shift+R</b>.', 'bad')}`, 'r46') },

  { t: 'Who does what', to: true, giua: true, body: tbl(['', 'Client (browser)', 'Server'], [
      ['Runs on', 'the visitor’s machine', 'a machine you control'],
      ['Does', 'asks, renders, reacts', 'decides, remembers'],
      ['Sees', 'only what the server sends', 'the database, the secrets'],
      ['Code is', 'public', 'private'],
    ]) + vsd('<ul><li>http:// login page</li><li>Sending a friend localhost:3000</li></ul>', '<ul><li>https:// everywhere</li><li>Deploy to a public address (Chapter 14)</li></ul>', '✗ Trap', '✓ Instead') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>URL → DNS → TLS → request/response → render</li>
    <li>Status + headers + body</li>
    <li>A server is a program that answers</li>
    <li>One page = many requests</li></ul>`,
    box('Practice (20 min)', 'Run <code class="i">server.mjs</code>, add a route <code class="i">/about</code> with your name.<br><br><b>Done when</b>: <code class="i">curl -i</code> shows <b>200</b> and your name, <code class="i">/nope</code> shows <b>404</b>, the server log shows both, and you found the status and <code class="i">Content-Type</code> in the Network tab.', 'ok')) },
]);
